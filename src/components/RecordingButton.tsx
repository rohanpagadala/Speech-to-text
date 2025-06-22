import React from 'react';
import { Mic, MicOff, Square } from 'lucide-react';

interface RecordingButtonProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export const RecordingButton: React.FC<RecordingButtonProps> = ({
  isRecording,
  onStart,
  onStop,
  disabled = false
}) => {
  return (
    <button
      onClick={isRecording ? onStop : onStart}
      disabled={disabled}
      className={`
        relative w-20 h-20 rounded-full transition-all duration-300 transform hover:scale-105
        ${isRecording 
          ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25' 
          : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/25'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        flex items-center justify-center text-white
      `}
    >
      {isRecording ? (
        <>
          <Square className="w-8 h-8" />
          <div className="absolute inset-0 rounded-full bg-red-500 animate-pulse opacity-30"></div>
        </>
      ) : (
        <Mic className="w-8 h-8" />
      )}
    </button>
  );
};