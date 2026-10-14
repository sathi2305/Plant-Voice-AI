/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice 2.0 — Gentle Daily Reflection & Moment of Calm Card
 */

import React, { useState } from 'react';
import { Feather, RefreshCw, EyeOff, Sparkles } from 'lucide-react';
import { AUTHORED_REFLECTIONS } from '../types';

interface DailyReflectionCardProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCalmMoment: () => void;
}

export const DailyReflectionCard: React.FC<DailyReflectionCardProps> = ({
  isOpen,
  onClose,
  onStartCalmMoment,
}) => {
  const [reflectionIndex, setReflectionIndex] = useState(0);

  if (!isOpen) return null;

  const currentReflection = AUTHORED_REFLECTIONS[reflectionIndex];

  const handleNext = () => {
    setReflectionIndex((prev) => (prev + 1) % AUTHORED_REFLECTIONS.length);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reflection-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-[#0d1712] border border-emerald-900/60 rounded-2xl shadow-2xl p-6 sm:p-7 text-emerald-100">
        <div className="flex items-center gap-2.5 mb-4">
          <Feather className="w-5 h-5 text-emerald-400" />
          <h2 id="reflection-modal-title" className="text-base font-display font-semibold text-white">
            Gentle Reflection
          </h2>
        </div>

        {/* Reflection quote */}
        <div className="p-5 rounded-xl bg-[#122319] border border-emerald-800/40 my-3 text-center">
          <p className="text-sm sm:text-base font-light text-emerald-100 leading-relaxed italic">
            “{currentReflection}”
          </p>
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 mt-4 text-xs text-emerald-400 hover:text-emerald-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Another thought</span>
          </button>
        </div>

        {/* Action: A Moment of Calm */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onStartCalmMoment();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 hover:text-white rounded-xl text-xs font-medium border border-emerald-600/40 transition-colors cursor-pointer"
          >
            <EyeOff className="w-3.5 h-3.5 text-emerald-400" />
            <span>A Moment of Calm</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs rounded-lg text-emerald-400/80 hover:text-white transition-colors cursor-pointer"
          >
            Return to Garden
          </button>
        </div>
      </div>
    </div>
  );
};
