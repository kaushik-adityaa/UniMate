import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { KeyRound, X, ExternalLink, Check, AlertCircle, Loader2 } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose }) {
  const { checkServerStatus, serverStatus } = useChat();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSaveAndTest = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      setStatusMsg({ type: 'error', text: 'Please paste your Gemini API key.' });
      return;
    }

    setIsLoading(true);
    setStatusMsg({ type: 'info', text: 'Testing connection to Gemini API...' });

    try {
      const res = await fetch('/api/config/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKeyInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to verify API key with Google Gemini.');
      }

      setStatusMsg({
        type: 'success',
        text: `Success! Connected to Gemini model (${data.model || 'gemini-1.5-flash'}).`,
      });

      await checkServerStatus();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Verification failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#141416] dark:bg-[#141416] light:bg-white border border-[#27272A] dark:border-[#27272A] light:border-slate-200 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#FAFAFA] light:text-slate-900">
                Gemini API Key Configuration
              </h3>
              <p className="text-xs text-[#A1A1AA] light:text-slate-500">
                UniMate connects to Google Gemini for genuine AI responses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#71717A] hover:text-[#FAFAFA] light:hover:text-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions */}
        <div className="mb-5 space-y-2.5 text-xs text-[#D4D4D8] light:text-slate-700 leading-relaxed bg-[#18181B] dark:bg-[#18181B] light:bg-slate-50 p-4 rounded-xl border border-[#27272A] light:border-slate-200">
          <div className="font-semibold text-indigo-400 text-xs">How to get a free API key:</div>
          <ol className="list-decimal list-outside pl-4 space-y-1.5 text-[#A1A1AA] light:text-slate-600">
            <li>
              Go to{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 underline inline-flex items-center gap-0.5 font-medium"
              >
                Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>Click <strong>“Create API Key”</strong> (100% free with generous tier).</li>
            <li>Copy the key and paste it below or save it as <code className="px-1 py-0.5 rounded bg-black/40 text-indigo-300">GEMINI_API_KEY</code> in your server's <code className="px-1 py-0.5 rounded bg-black/40 text-indigo-300">.env</code> file.</li>
          </ol>
          <div className="text-[11px] text-[#71717A] pt-1 border-t border-[#27272A] light:border-slate-200">
            🔒 The key is stored securely on the server and is never exposed to browser clients or public code.
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSaveAndTest} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#FAFAFA] light:text-slate-800 mb-1.5">
              Paste Gemini API Key:
            </label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E10] dark:bg-[#0E0E10] light:bg-white border border-[#27272A] dark:border-[#27272A] light:border-slate-300 text-xs text-[#FAFAFA] light:text-slate-900 placeholder-[#71717A] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>

          {/* Status Message */}
          {statusMsg.text && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMsg.type === 'error'
                  ? 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                  : statusMsg.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                  : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-300'
              }`}
            >
              {statusMsg.type === 'error' ? (
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              ) : statusMsg.type === 'success' ? (
                <Check className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              ) : (
                <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin text-indigo-400" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#D4D4D8] light:text-slate-700 hover:bg-[#222226] light:hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !apiKeyInput.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Key...</span>
                </>
              ) : (
                <span>Save & Test Connection</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
