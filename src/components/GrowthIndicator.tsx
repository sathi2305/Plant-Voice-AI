/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice — Symbolic Growth Indicator with Stage 5 Bloom Animation & Restart Option
 */

import React from 'react';
import { Wind, RotateCcw, Sparkles } from 'lucide-react';
import { GardenState, GROWTH_STAGES, GrowthStageId } from '../types';

interface GrowthIndicatorProps {
  state: GardenState;
  onOpenStageDetails?: () => void;
  onRestart?: () => void;
}

export const GrowthIndicator: React.FC<GrowthIndicatorProps> = ({
  state,
  onOpenStageDetails,
  onRestart,
}) => {
  const currentStageInfo = GROWTH_STAGES[state.currentStage];
  const nextStageInfo =
    state.currentStage < 5
      ? GROWTH_STAGES[(state.currentStage + 1) as GrowthStageId]
      : null;

  const windStatus =
    state.interactionCount === 0
      ? 'Calm Slumber Breeze'
      : state.interactionCount < 4
      ? 'Gentle Attunement'
      : state.interactionCount < 8
      ? 'Vital Foliage Sway'
      : 'Flourishing Harmony';

  const isStage5 = state.currentStage === 5;

  return (
    <div className="flex flex-col gap-2 px-4 py-3 bg-[#0c1611]/85 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl text-xs max-w-sm select-none">
      {/* Stage Title and Status */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* In Stage 5: Living Blooming Flower Emblem with CSS Pulse & Slow Rotation */}
          {isStage5 ? (
            <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
              <span className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping opacity-40" />
              <div className="w-5 h-5 flex items-center justify-center animate-bloom-rotate">
                <svg
                  viewBox="-20 -20 40 40"
                  className="w-5 h-5 overflow-visible animate-bloom-pulse"
                >
                  {[0, 60, 120, 180, 240, 300].map((deg, idx) => (
                    <ellipse
                      key={idx}
                      cx="0"
                      cy="-8"
                      rx="4"
                      ry="8"
                      fill="#fef08a"
                      stroke="#f59e0b"
                      strokeWidth="0.8"
                      transform={`rotate(${deg})`}
                      className="animate-petal-breathe"
                    />
                  ))}
                  <circle cx="0" cy="0" r="4.5" fill="#f59e0b" />
                  <circle cx="0" cy="0" r="2.5" fill="#fff" />
                </svg>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenStageDetails}
              className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] cursor-pointer"
              title="Click to view all stages"
            />
          )}

          <button
            onClick={onOpenStageDetails}
            className="font-medium text-emerald-100 hover:text-white transition-colors cursor-pointer text-left"
            title="Click to view stages modal"
          >
            Stage {state.currentStage} · {currentStageInfo.name}
          </button>
        </div>

        <span className="text-emerald-400/90 font-mono tabular-nums text-[11px]">
          {state.interactionCount} {state.interactionCount === 1 ? 'care' : 'cares'}
        </span>
      </div>

      {/* Subtle Progress Track */}
      <div
        className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(state.stageProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Growth progress towards ${nextStageInfo ? nextStageInfo.name : 'full bloom'}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isStage5
              ? 'bg-gradient-to-r from-emerald-400 via-amber-300 to-amber-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]'
              : 'bg-gradient-to-r from-emerald-500 to-emerald-300'
          }`}
          style={{ width: `${Math.min(100, Math.max(8, state.stageProgress))}%` }}
        />
      </div>

      {/* Clean Unboxed Metadata Line */}
      <div className="flex items-center justify-between text-[11px] text-emerald-300/70 pt-0.5">
        <span>{currentStageInfo.subtitle}</span>
        {nextStageInfo ? (
          <span>
            {Math.max(0, nextStageInfo.minInteractions - state.interactionCount)} more care to unfold
          </span>
        ) : (
          <span className="text-amber-300 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Sanctuary in Bloom
          </span>
        )}
      </div>

      {/* Footer Info: Wind Resonance + Quick Restart Option */}
      <div className="flex items-center justify-between pt-1.5 border-t border-white/5 text-[10px] text-emerald-400/70">
        <div className="flex items-center gap-1.5">
          <Wind className="w-3 h-3 text-emerald-400/80" />
          <span>{windStatus}</span>
        </div>

        {/* Quick Restart Option */}
        {onRestart && (
          <button
            onClick={onRestart}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 hover:bg-emerald-900/40 text-emerald-300 hover:text-white transition-colors cursor-pointer"
            title="Restart garden to Stage 1"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Restart</span>
          </button>
        )}
      </div>
    </div>
  );
};
