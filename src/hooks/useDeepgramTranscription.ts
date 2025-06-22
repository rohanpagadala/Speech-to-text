import { useState, useRef, useCallback } from 'react';
import { TranscriptResult, RecordingState } from '../types';

export const useDeepgramTranscription = () => {
  const [transcript, setTranscript] = useState<TranscriptResult[]>([]);
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    error: null
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setRecordingState(prev => ({ ...prev, error: null }));

      // Check for API key
      const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
      if (!apiKey) {
        throw new Error('Deepgram API key not found. Please add VITE_DEEPGRAM_API_KEY to your .env file.');
      }

      console.log('Starting recording with API key:', apiKey.substring(0, 10) + '...');

      // Get user media with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          channelCount: 1
        } 
      });
      
      streamRef.current = stream;
      console.log('Got media stream');

      // Create WebSocket connection to Deepgram
      const wsUrl = `wss://api.deepgram.com/v1/listen?model=nova-2&language=en&smart_format=true&punctuate=true&interim_results=true&encoding=linear16&sample_rate=16000&channels=1`;
      console.log('Connecting to:', wsUrl);
      
      const socket = new WebSocket(wsUrl, ['token', apiKey]);
      websocketRef.current = socket;

      socket.onopen = () => {
        console.log('✅ Connected to Deepgram WebSocket');
        setRecordingState(prev => ({ 
          ...prev, 
          isRecording: true, 
          duration: 0,
          error: null
        }));

        // Start duration timer
        durationIntervalRef.current = setInterval(() => {
          setRecordingState(prev => ({ 
            ...prev, 
            duration: prev.duration + 1 
          }));
        }, 1000);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received data:', data);
          
          if (data.channel?.alternatives?.[0]?.transcript) {
            const transcriptText = data.channel.alternatives[0].transcript.trim();
            
            if (transcriptText) {
              const result: TranscriptResult = {
                text: transcriptText,
                timestamp: Date.now(),
                confidence: data.channel.alternatives[0].confidence || 0,
                isFinal: data.is_final || false
              };
              
              console.log('Adding transcript:', result);
              
              setTranscript(prev => {
                // Remove previous interim results and add new one
                const finalResults = prev.filter(t => t.isFinal);
                if (result.isFinal) {
                  return [...finalResults, result];
                } else {
                  return [...finalResults, result];
                }
              });
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setRecordingState(prev => ({ 
          ...prev, 
          error: 'Connection error. Please check your API key and try again.' 
        }));
      };

      socket.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        if (event.code !== 1000) {
          setRecordingState(prev => ({ 
            ...prev, 
            error: `Connection closed unexpectedly: ${event.reason || 'Unknown error'}` 
          }));
        }
      };

      // Set up audio processing with Web Audio API for better real-time streaming
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000
      });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (event) => {
        if (socket.readyState === WebSocket.OPEN) {
          const inputBuffer = event.inputBuffer;
          const inputData = inputBuffer.getChannelData(0);
          
          // Convert float32 to int16
          const int16Buffer = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            const sample = Math.max(-1, Math.min(1, inputData[i]));
            int16Buffer[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
          }
          
          socket.send(int16Buffer.buffer);
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

    } catch (error) {
      console.error('❌ Error starting recording:', error);
      setRecordingState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to start recording. Please check microphone permissions.' 
      }));
    }
  }, []);

  const stopRecording = useCallback(() => {
    console.log('Stopping recording...');

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
      streamRef.current = null;
    }

    if (websocketRef.current) {
      websocketRef.current.close(1000, 'Recording stopped');
      websocketRef.current = null;
    }

    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    setRecordingState(prev => ({
      ...prev,
      isRecording: false,
      isPaused: false
    }));

    console.log('✅ Recording stopped');
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
    console.log('Transcript cleared');
  }, []);

  const exportTranscript = useCallback(() => {
    const text = transcript
      .filter(t => t.isFinal)
      .map(t => t.text)
      .join(' ');
    
    if (!text.trim()) {
      console.log('No transcript to export');
      return;
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Transcript exported');
  }, [transcript]);

  return {
    transcript,
    recordingState,
    startRecording,
    stopRecording,
    clearTranscript,
    exportTranscript
  };
};