import React, { useEffect, useRef } from 'react';
import { TranscriptResult } from '../types';
import { Copy, Download, Trash2 } from 'lucide-react';

interface TranscriptDisplayProps {
  transcript: TranscriptResult[];
  onClear: () => void;
  onExport: () => void;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  transcript,
  onClear,
  onExport
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const finalTranscript = transcript
    .filter(t => t.isFinal)
    .map(t => t.text)
    .join(' ');

  const interimTranscript = transcript
    .filter(t => !t.isFinal)
    .map(t => t.text)
    .join(' ');

  const fullText = finalTranscript + (interimTranscript ? ' ' + interimTranscript : '');

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [fullText]);

  const copyToClipboard = async () => {
    try {
      const textToCopy = finalTranscript || fullText;
      await navigator.clipboard.writeText(textToCopy);
      console.log('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text:', err);
      // Fallback for older browsers
      if (textareaRef.current) {
        textareaRef.current.select();
        document.execCommand('copy');
      }
    }
  };

  const hasContent = fullText.trim().length > 0;
  const wordCount = finalTranscript.trim() ? finalTranscript.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Live Transcript</h2>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              disabled={!hasContent}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={onExport}
              disabled={!finalTranscript.trim()}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download as text file"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClear}
              disabled={!hasContent}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear transcript"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={fullText}
            readOnly
            placeholder="Click the microphone button and start speaking. Your words will appear here in real-time..."
            className="w-full h-64 p-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          
          {interimTranscript && (
            <div className="absolute bottom-2 right-2 flex items-center gap-2 text-xs text-blue-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Processing...</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-white/70">
          <div className="flex items-center gap-4">
            {wordCount > 0 && (
              <span>{wordCount} word{wordCount !== 1 ? 's' : ''}</span>
            )}
            {finalTranscript.length > 0 && (
              <span>{finalTranscript.length} characters</span>
            )}
          </div>
          
          {interimTranscript && (
            <div className="flex items-center gap-2 text-blue-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Listening...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};