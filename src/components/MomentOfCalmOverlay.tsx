/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice 2.0 — Moment of Calm Fullscreen Scrim
 */

import React from 'react';

interface MomentOfCalmOverlayProps {
  isActive: boolean;
  onExit: () => void;
  gardenName: string;
}

export const MomentOfCalmOverlay: React.FC<MomentOfCalmOverlayProps> = ({
  isActive,
  onExit,
  gardenName,
}) => {
  if (!isActive) return null;

  return (
    <div
      onClick={onExit}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          onExit();
        }
      }}
      aria-label="A Moment of Calm active. Press escape or click anywhere to return to garden controls."
      className="fixed inset-0 z-40 flex flex-col items-center justify-between p-8 bg-black/45 backdrop-blur-[2px] cursor-pointer animate-fade-in select-none"
    >
      <div className="pt-8 text-center pointer-events-none">
        <h2 className="text-xl sm:text-2xl font-display font-light text-emerald-100/90 tracking-widest uppercase">
          {gardenName}
        </h2>
        <p className="text-xs text-emerald-300/60 mt-1 font-light tracking-wide">
          Breathe gently with the foliage
        </p>
      </div>

      <div className="pb-8 text-center pointer-events-none">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0c1611]/80 border border-emerald-500/20 shadow-lg text-xs text-emerald-300/80 animate-pulse">
          <span>Tap anywhere to return</span>
        </div>
      </div>
    </div>
  );
};
