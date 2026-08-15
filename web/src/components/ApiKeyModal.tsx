import React, { useState } from 'react';
import { Key, X, ShieldCheck, Lock, ExternalLink, Check, Trash2 } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../services/openrouterApi';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [apiKey, setApiKey] = useState<string>(getStoredApiKey());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(apiKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onSave();
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setApiKey('');
    setStoredApiKey('');
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 relative space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">OpenRouter API Access</h3>
              <p className="text-xs text-slate-400">Directly query live benchmarks</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <p className="text-slate-300 leading-relaxed">
            Your key enables live queries to <code className="text-sky-400 font-mono">https://openrouter.ai/api/v1/benchmarks</code>. Keys are stored safely in your local browser storage and never transmitted to any third-party server.
          </p>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center justify-between">
              <span>OpenRouter API Key</span>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>Get API key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              placeholder="sk-or-v1-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Encrypted local storage authentication. Zero key telemetry.</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {apiKey ? (
            <button
              onClick={handleClear}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Key</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-lg shadow-sky-500/25 transition-all flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save API Key</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
