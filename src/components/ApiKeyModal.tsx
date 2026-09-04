import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Key, ExternalLink, Check, Eye, EyeOff, Trash2, ShieldCheck } from 'lucide-react';
import { getGeminiApiKey, getCustomApiKey, setStoredGeminiApiKey, removeStoredGeminiApiKey } from '../services/gemini';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(false);
  const [activeKeyMasked, setActiveKeyMasked] = useState('');

  useEffect(() => {
    if (isOpen) {
      const customKey = getCustomApiKey();
      const currentActive = getGeminiApiKey();
      setHasCustomKey(Boolean(customKey));
      setApiKeyInput(customKey);
      setIsSaved(false);

      if (currentActive) {
        setActiveKeyMasked(
          currentActive.length > 8
            ? `${currentActive.slice(0, 6)}••••••••${currentActive.slice(-4)}`
            : '••••••••••••'
        );
      } else {
        setActiveKeyMasked('');
      }
    }
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;

    setStoredGeminiApiKey(apiKeyInput.trim());
    setHasCustomKey(true);
    setIsSaved(true);

    const current = apiKeyInput.trim();
    setActiveKeyMasked(
      current.length > 8
        ? `${current.slice(0, 6)}••••••••${current.slice(-4)}`
        : '••••••••••••'
    );

    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    removeStoredGeminiApiKey();
    setApiKeyInput('');
    setHasCustomKey(false);
    const fallback = getGeminiApiKey();
    if (fallback) {
      setActiveKeyMasked(
        fallback.length > 8
          ? `${fallback.slice(0, 6)}••••••••${fallback.slice(-4)}`
          : '••••••••••••'
      );
    } else {
      setActiveKeyMasked('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
          >
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-pixel text-neutral-100">
                  Gemini API Key
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Custom key for Google AI Studio Hackathon evaluation
                </p>
              </div>
            </div>

            {/* Current Key Status Badge */}
            <div className="mb-5 p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeKeyMasked ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span className="font-mono text-neutral-300">
                  {activeKeyMasked ? (
                    hasCustomKey ? (
                      <>Custom key active: <span className="text-teal-300">{activeKeyMasked}</span></>
                    ) : (
                      <>Default env key active: <span className="text-neutral-400">{activeKeyMasked}</span></>
                    )
                  ) : (
                    <span className="text-amber-300">No active API key detected</span>
                  )}
                </span>
              </div>

              {hasCustomKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Remove custom key from localStorage"
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label
                  htmlFor="gemini-api-key-input"
                  className="block text-xs font-pixel uppercase tracking-wider text-neutral-300 mb-2"
                >
                  Enter Google AI Studio Key:
                </label>
                <div className="relative">
                  <input
                    id="gemini-api-key-input"
                    type={showPassword ? 'text' : 'password'}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    autoFocus
                    className="w-full py-3 pl-4 pr-11 bg-neutral-950 border-2 border-neutral-800 focus:border-teal-500 rounded-xl text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30 text-sm font-mono transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Security note & link */}
              <div className="space-y-2 text-xs text-neutral-400">
                <div className="flex items-start gap-1.5 text-[11px] text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>
                    Stored locally in your browser's <code className="text-neutral-300">localStorage</code>. Never sent to any external server, only directly to Google's official Gemini API.
                  </span>
                </div>

                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300 hover:underline pt-1 text-xs"
                >
                  <span>Get a free key from Google AI Studio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  id="cancel-api-key-btn"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 text-xs font-pixel transition-all cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="submit"
                  id="save-api-key-btn"
                  disabled={!apiKeyInput.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 disabled:opacity-40 disabled:pointer-events-none text-neutral-950 font-pixel font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save Key</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
