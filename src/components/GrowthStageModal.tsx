/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice 2.0 — Growth Stages Overview Modal (5 Stages)
 */

import React from 'react';
import { X, Sprout, Sparkles, Leaf, Compass, Flower2, CheckCircle2, RotateCcw } from 'lucide-react';
import { GardenState, GROWTH_STAGES, GrowthStageId } from '../types';

interface GrowthStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GardenState;
  onJumpStage?: (stage: GrowthStageId) => void;
  onRestartJourney?: () => void;
}

export const GrowthStageModal: React.FC<GrowthStageModalProps> = ({
  isOpen,
  onClose,
  state,
  onJumpStage,
  onRestartJourney,
}) => {
  if (!isOpen) return null;

  const stageIcons: Record<GrowthStageId, React.ReactNode> = {
    1: <Sprout className="w-4 h-4 text-emerald-400" />,
    2: <Sparkles className="w-4 h-4 text-emerald-300" />,
    3: <Leaf className="w-4 h-4 text-emerald-400" />,
    4: <Compass className="w-4 h-4 text-amber-300" />,
    5: (
      <div className="w-4 h-4 flex items-center justify-center animate-bloom-rotate">
        <Flower2 className="w-4 h-4 text-amber-400 animate-bloom-pulse" />
      </div>
    ),
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="growth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0d1712] border border-emerald-900/60 rounded-2xl shadow-2xl p-6 sm:p-7 text-emerald-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-lg text-emerald-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="growth-modal-title" className="text-lg font-display font-semibold text-white mb-1">
          The 5 Growth Stages
        </h2>
        <p className="text-xs text-emerald-300/70 mb-5">
          A symbolic visual journey nurtured by your continuous attention and care.
        </p>

        <div className="space-y-3">
          {([1, 2, 3, 4, 5] as GrowthStageId[]).map((stageId) => {
            const info = GROWTH_STAGES[stageId];
            const isCurrent = state.currentStage === stageId;
            const isCompleted = state.currentStage > stageId;

            return (
              <div
                key={stageId}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-emerald-950/60 border-emerald-500/50 shadow-md'
                    : isCompleted
                    ? 'bg-[#101b15]/60 border-emerald-900/40 text-emerald-300/70'
                    : 'bg-[#09120e]/60 border-white/5 text-emerald-400/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-900/40 border border-emerald-700/30">
                      {stageIcons[stageId]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-emerald-100">
                          Stage {stageId}: {info.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] text-emerald-400 font-medium">
                            (Active Now)
                          </span>
                        )}
                        {isCompleted && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <p className="text-xs text-emerald-300/70 mt-0.5">{info.subtitle}</p>
                    </div>
                  </div>

                  {onJumpStage && (
                    <button
                      onClick={() => onJumpStage(stageId)}
                      className="text-[11px] px-2 py-1 rounded bg-[#16271e] hover:bg-emerald-800 text-emerald-200 transition-colors cursor-pointer shrink-0"
                    >
                      Jump to Stage
                    </button>
                  )}
                </div>

                <p className="text-xs text-emerald-200/80 mt-2 pl-1 leading-relaxed">
                  {info.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-emerald-400/60">
                  <span>Threshold: {info.minInteractions} care actions</span>
                  <span>
                    Foliage: {info.leafCount} leaves {info.hasBud ? '+ Crown Bud' : ''}{info.hasFlower ? '+ Radiant Blossom' : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer with Restart and Close */}
        <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between">
          {onRestartJourney ? (
            <button
              onClick={() => {
                onRestartJourney();
                onClose();
              }}
              className="flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-900/50 transition-colors cursor-pointer"
              title="Restart the 5-stage growth journey"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Restart Journey</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs rounded-lg font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
