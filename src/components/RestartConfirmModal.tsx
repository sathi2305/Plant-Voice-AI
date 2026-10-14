/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice 2.0 — Restart Garden Sanctuary Confirmation Modal
 */

import React, { useEffect } from 'react';
import { RotateCcw, X, Sprout, Sparkles } from 'lucide-react';
import { GrowthStageId, GROWTH_STAGES } from '../types';

interface RestartConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRestart: () => void;
  gardenName: string;
  currentStage: GrowthStageId;
}

export const RestartConfirmModal: React.FC<RestartConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmRestart,
  gardenName,
  currentStage,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentStageInfo = GROWTH_STAGES[currentStage];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="restart-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0c1611] border border-emerald-900/70 rounded-2xl shadow-2xl p-6 sm:p-7 text-emerald-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Cancel and close dialog"
          className="absolute top-4 right-4 p-2 rounded-lg text-emerald-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-700/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)] shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h2 id="restart-modal-title" className="text-lg font-display font-semibold text-white">
              Restart Garden Journey?
            </h2>
            <p className="text-xs text-emerald-300/70">
              Return to Stage 1: First Hello
            </p>
          </div>
        </div>

        {/* Informative Body */}
        <div className="p-3.5 rounded-xl bg-[#122219]/70 border border-emerald-900/40 text-xs text-emerald-200/90 space-y-2 mb-5">
          <div className="flex items-center justify-between text-[11px] pb-2 border-b border-white/5 text-emerald-300/80">
            <span>Current Status:</span>
            <span className="font-medium text-emerald-100">
              Stage {currentStage} · {currentStageInfo.name}
            </span>
          </div>
          <p className="leading-relaxed text-emerald-200/80">
            Restarting <strong className="text-emerald-100 font-medium">"{gardenName}"</strong> will gently return your plant to a quiet seedling resting in fresh soil, clearing current care counts so you can experience the botanical growth stages anew.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400/80">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>You can explore all stages and discoveries anytime.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#14231b] hover:bg-[#1a3024] text-emerald-200 hover:text-white text-xs font-medium border border-emerald-900/50 transition-colors cursor-pointer"
          >
            Keep Growing
          </button>

          <button
            onClick={() => {
              onConfirmRestart();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white text-xs font-medium shadow-md transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Yes, Restart Garden</span>
          </button>
        </div>
      </div>
    </div>
  );
};
