/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice 2.0 — Personal Garden Name Modal
 */

import React, { useState } from 'react';
import { X, Sparkles, Check, RotateCcw } from 'lucide-react';

interface PersonalGardenNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSaveName: (newName: string) => void;
}

export const PersonalGardenNameModal: React.FC<PersonalGardenNameModalProps> = ({
  isOpen,
  onClose,
  currentName,
  onSaveName,
}) => {
  const [nameInput, setNameInput] = useState(currentName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = nameInput.trim() || 'Little Haven';
    onSaveName(clean);
    onClose();
  };

  const handleReset = () => {
    setNameInput('Little Haven');
    onSaveName('Little Haven');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="name-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-[#0d1712] border border-emerald-900/60 rounded-2xl shadow-2xl p-6 text-emerald-100">
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-lg text-emerald-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-emerald-900/40 border border-emerald-600/30 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 id="name-modal-title" className="text-base font-display font-semibold text-white">
              Name Your Garden Sanctuary
            </h2>
            <p className="text-xs text-emerald-400/70">A personal space that grows with you</p>
          </div>
        </div>

        <p className="text-xs text-emerald-200/80 my-3 leading-relaxed">
          Give your little sanctuary an authored name. Saved locally in your browser with zero external accounts.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="garden-name-input" className="block text-xs font-medium text-emerald-300 mb-1.5">
              Garden Name
            </label>
            <input
              id="garden-name-input"
              type="text"
              maxLength={32}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. Sathiya's Sanctuary, Whispering Fern..."
              className="w-full px-3.5 py-2.5 bg-[#14231b] border border-emerald-700/60 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-emerald-400/70 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs rounded-lg text-emerald-300 hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Name</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
