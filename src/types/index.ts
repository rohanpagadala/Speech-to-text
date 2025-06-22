export interface TranscriptResult {
  text: string;
  timestamp: number;
  confidence: number;
  isFinal: boolean;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  error: string | null;
}

export interface DeepgramConfig {
  apiKey: string;
  model: string;
  language: string;
  smartFormat: boolean;
  punctuate: boolean;
  diarize: boolean;
}