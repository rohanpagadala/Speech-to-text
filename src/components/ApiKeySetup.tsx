import React, { useState } from 'react';
import { Key, ExternalLink } from 'lucide-react';

interface ApiKeySetupProps {
  onClose: () => void;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onClose }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 max-w-lg w-full">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-semibold text-white">Deepgram API Key Required</h2>
        </div>

        <p className="text-white/80 mb-4">
          To use this Speech-to-Text application, you need a Deepgram API key.
        </p>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
          <p className="text-yellow-200 text-sm">
            <strong>Setup Instructions:</strong>
          </p>
          <ol className="text-yellow-200 text-sm mt-2 space-y-1 list-decimal list-inside">
            <li>Create a free account at Deepgram</li>
            <li>Get your API key from the dashboard</li>
            <li>Create a <code className="bg-black/20 px-1 rounded">.env</code> file in the project root</li>
            <li>Add: <code className="bg-black/20 px-1 rounded">VITE_DEEPGRAM_API_KEY=your_key_here</code></li>
            <li>Restart the development server</li>
          </ol>
        </div>

        <div className="flex gap-3">
          <a
            href="https://deepgram.com/signup"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Get API Key
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            I'll set it up later
          </button>
        </div>
      </div>
    </div>
  );
};