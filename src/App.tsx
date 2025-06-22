import React, { useState, useEffect } from 'react';
import { RecordingButton } from './components/RecordingButton';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { StatusIndicator } from './components/StatusIndicator';
import { ApiKeySetup } from './components/ApiKeySetup';
import { useDeepgramTranscription } from './hooks/useDeepgramTranscription';
import { Headphones, Zap, CheckCircle, Download } from 'lucide-react';

function App() {
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);
  const {
    transcript,
    recordingState,
    startRecording,
    stopRecording,
    clearTranscript,
    exportTranscript
  } = useDeepgramTranscription();

  useEffect(() => {
    // Check if API key is available
    const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
    if (!apiKey) {
      setShowApiKeySetup(true);
    }
  }, []);

  const handleStartRecording = async () => {
    const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
    if (!apiKey) {
      setShowApiKeySetup(true);
      return;
    }
    
    await startRecording();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <Headphones className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Speech to Text
            </h1>
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Transform your voice into text in real-time using advanced AI-powered speech recognition
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex justify-center mb-8">
          <StatusIndicator recordingState={recordingState} />
        </div>

        {/* Recording Controls */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-6">
            <RecordingButton
              isRecording={recordingState.isRecording}
              onStart={handleStartRecording}
              onStop={stopRecording}
              disabled={!!recordingState.error}
            />
          </div>
        </div>

        {/* Transcript Display */}
        <TranscriptDisplay
          transcript={transcript}
          onClear={clearTranscript}
          onExport={exportTranscript}
        />

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-time</h3>
            <p className="text-white/70">
              See your words appear instantly as you speak with minimal latency
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Accurate</h3>
            <p className="text-white/70">
              Powered by Deepgram's advanced AI for superior accuracy and formatting
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Export</h3>
            <p className="text-white/70">
              Save your transcripts as text files for future use and reference
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 max-w-2xl mx-auto bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">How to use:</h3>
          <ol className="space-y-2 text-white/80 list-decimal list-inside">
            <li>Click the microphone button to start recording</li>
            <li>Grant microphone permissions when prompted</li>
            <li>Speak clearly and watch your words appear in real-time</li>
            <li>Click the stop button when finished</li>
            <li>Use the toolbar to copy, export, or clear your transcript</li>
          </ol>
        </div>
      </div>

      {/* API Key Setup Modal */}
      {showApiKeySetup && (
        <ApiKeySetup onClose={() => setShowApiKeySetup(false)} />
      )}
    </div>
  );
}

export default App;