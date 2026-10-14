/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice — Primary Care Action Toolbar
 * Water, Sunlight, Say Hello actions with responsive micro-interactions.
 */

import React from 'react';
import { Droplets, Sun, Sparkles } from 'lucide-react';
import { GardenState } from '../types';

interface CareActionBarProps {
  state: GardenState;
  onWater: () => void;
  onSunlight: () => void;
  onSayHello: () => void;
}

export const CareActionBar: React.FC<CareActionBarProps> = ({
  state,
  onWater,
  onSunlight,
  onSayHello,
}) => {
  return (
    <nav
      aria-label="Care actions toolbar"
      className="flex items-center justify-center gap-3 sm:gap-4 p-2 bg-[#0c1611]/85 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl transition-all"
    >
      {/* ACTION A: WATER */}
      <button
        onClick={onWater}
        disabled={state.isWatering}
        aria-label="Water the plant. Offer refreshing moisture to the roots."
        className={`group relative flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 active:scale-95 ${
          state.isWatering
            ? 'bg-sky-950/80 text-sky-200 border border-sky-500/40 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
            : 'bg-[#15251d] hover:bg-[#1d3529] text-emerald-100 hover:text-white border border-emerald-900/60 hover:border-emerald-700/80 shadow-md'
        }`}
      >
        <Droplets
          className={`w-4 h-4 transition-transform duration-300 ${
            state.isWatering ? 'text-sky-400 scale-110 animate-bounce' : 'text-sky-300 group-hover:scale-110'
          }`}
          aria-hidden="true"
        />
        <span>Water</span>
        {state.waterCount > 0 && (
          <span className="text-[11px] font-mono tabular-nums text-emerald-400/80 ml-0.5">
            {state.waterCount}
          </span>
        )}
      </button>

      {/* ACTION B: SUNLIGHT */}
      <button
        onClick={onSunlight}
        disabled={state.isSunlit}
        aria-label="Provide sunlight. Fill the garden canopy with warm golden light."
        className={`group relative flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 active:scale-95 ${
          state.isSunlit
            ? 'bg-amber-950/80 text-amber-100 border border-amber-500/40 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
            : 'bg-[#15251d] hover:bg-[#1d3529] text-emerald-100 hover:text-white border border-emerald-900/60 hover:border-emerald-700/80 shadow-md'
        }`}
      >
        <Sun
          className={`w-4 h-4 transition-transform duration-300 ${
            state.isSunlit ? 'text-amber-400 rotate-90 scale-110' : 'text-amber-300 group-hover:rotate-45'
          }`}
          aria-hidden="true"
        />
        <span>Sunlight</span>
        {state.sunCount > 0 && (
          <span className="text-[11px] font-mono tabular-nums text-amber-400/80 ml-0.5">
            {state.sunCount}
          </span>
        )}
      </button>

      {/* ACTION C: SAY HELLO */}
      <button
        onClick={onSayHello}
        disabled={state.isSayingHello}
        aria-label="Say hello to your garden. Send a gentle pulse of greeting."
        className={`group relative flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 active:scale-95 ${
          state.isSayingHello
            ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-400/50 shadow-[0_0_20px_rgba(52,211,153,0.3)]'
            : 'bg-[#15251d] hover:bg-[#1d3529] text-emerald-100 hover:text-white border border-emerald-900/60 hover:border-emerald-700/80 shadow-md'
        }`}
      >
        <Sparkles
          className={`w-4 h-4 transition-transform duration-300 ${
            state.isSayingHello ? 'text-emerald-300 scale-110 animate-spin' : 'text-emerald-400 group-hover:scale-110'
          }`}
          aria-hidden="true"
        />
        <span>Say Hello</span>
        {state.helloCount > 0 && (
          <span className="text-[11px] font-mono tabular-nums text-emerald-400/80 ml-0.5">
            {state.helloCount}
          </span>
        )}
      </button>
    </nav>
  );
};
