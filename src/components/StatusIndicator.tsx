import React from 'react';
import { AlertCircle, CheckCircle, Mic } from 'lucide-react';
import { RecordingState } from '../types';

interface StatusIndicatorProps {
  recordingState: RecordingState;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ recordingState }) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (recordingState.error) {
    return (
      <div className="flex items-center gap-2 text-red-300 bg-red-500/10 px-4 py-2 rounded-lg backdrop-blur-sm">
        <AlertCircle className="w-5 h-5" />
        <span>{recordingState.error}</span>
      </div>
    );
  }

  if (recordingState.isRecording) {
    return (
      <div className="flex items-center gap-3 text-white bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <Mic className="w-5 h-5 text-red-400" />
        </div>
        <span className="font-medium">Recording</span>
        <span className="text-white/70">{formatDuration(recordingState.duration)}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-300 bg-green-500/10 px-4 py-2 rounded-lg backdrop-blur-sm">
      <CheckCircle className="w-5 h-5" />
      <span>Ready to record</span>
    </div>
  );
};