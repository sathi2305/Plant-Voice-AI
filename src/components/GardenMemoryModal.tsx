/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice 2.0 — My Garden Memory Modal
 * Reflective session record honoring each touch, drop, ray, and discovery.
 */

import React from 'react';
import { X, Droplets, Sun, Sparkles, Hand, Compass, CheckCircle2, Lock } from 'lucide-react';
import { GardenState, GROWTH_STAGES, GARDEN_MOODS, DISCOVERY_DEFINITIONS, DiscoveryId } from '../types';

interface GardenMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GardenState;
}

export const GardenMemoryModal: React.FC<GardenMemoryModalProps> = ({
  isOpen,
  onClose,
  state,
}) => {
  if (!isOpen) return null;

  const currentStage = GROWTH_STAGES[state.currentStage];
  const currentMood = GARDEN_MOODS[state.mood];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="memory-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0d1712] border border-emerald-900/60 rounded-2xl shadow-2xl p-6 sm:p-7 text-emerald-100">
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-lg text-emerald-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <Compass className="w-5 h-5 text-emerald-400" />
          <h2 id="memory-modal-title" className="text-lg font-display font-semibold text-white">
            Garden Memory · {state.gardenName}
          </h2>
        </div>
        <p className="text-xs text-emerald-400/70 mb-5">
          A quiet record of your current session’s care and discoveries.
        </p>

        {/* Current State Summary */}
        <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
          <div className="p-3 rounded-xl bg-[#13231a] border border-emerald-800/40">
            <span className="text-[11px] text-emerald-400/70 block">Growth Journey</span>
            <span className="font-semibold text-emerald-100 text-sm">Stage {state.currentStage}: {currentStage.name}</span>
            <span className="text-[11px] text-emerald-400/60 block mt-0.5">{currentStage.subtitle}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#13231a] border border-emerald-800/40">
            <span className="text-[11px] text-emerald-400/70 block">Atmosphere Mood</span>
            <span className="font-semibold text-emerald-100 text-sm">{currentMood.name}</span>
            <span className="text-[11px] text-emerald-400/60 block mt-0.5">{currentMood.subtitle}</span>
          </div>
        </div>

        {/* Care Ritual Breakdown */}
        <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400/80 mb-2.5">
          Care Actions Offered
        </h3>
        <div className="grid grid-cols-4 gap-2 mb-5 text-center">
          <div className="p-2.5 rounded-xl bg-[#111f18] border border-white/5">
            <Droplets className="w-4 h-4 text-sky-400 mx-auto mb-1" />
            <span className="text-base font-semibold font-mono tabular-nums text-white block">
              {state.waterCount}
            </span>
            <span className="text-[10px] text-emerald-300/70">Water</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#111f18] border border-white/5">
            <Sun className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span className="text-base font-semibold font-mono tabular-nums text-white block">
              {state.sunCount}
            </span>
            <span className="text-[10px] text-emerald-300/70">Sunlight</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#111f18] border border-white/5">
            <Sparkles className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-base font-semibold font-mono tabular-nums text-white block">
              {state.helloCount}
            </span>
            <span className="text-[10px] text-emerald-300/70">Hellos</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#111f18] border border-white/5">
            <Hand className="w-4 h-4 text-emerald-300 mx-auto mb-1" />
            <span className="text-base font-semibold font-mono tabular-nums text-white block">
              {state.leafTouchCount}
            </span>
            <span className="text-[10px] text-emerald-300/70">Leaf Touches</span>
          </div>
        </div>

        {/* Hidden Discoveries Track */}
        <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400/80 mb-2.5 flex items-center justify-between">
          <span>Curiosity Discoveries</span>
          <span className="text-[11px] font-normal text-emerald-400/60 lowercase">
            {Object.values(state.discoveries).filter(Boolean).length} of 3 found
          </span>
        </h3>
        <div className="space-y-2 mb-5">
          {(['butterfly', 'pot-resonance', 'starlight-wisp'] as DiscoveryId[]).map((discId) => {
            const def = DISCOVERY_DEFINITIONS[discId];
            const isFound = state.discoveries[discId];

            return (
              <div
                key={discId}
                className={`flex items-start justify-between gap-3 p-3 rounded-xl border text-xs transition-colors ${
                  isFound
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                    : 'bg-[#101b15]/60 border-white/5 text-emerald-400/50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-medium">
                    {isFound ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    )}
                    <span>{def.name}</span>
                  </div>
                  <p className="text-[11px] text-emerald-300/70 mt-0.5 pl-5">
                    {isFound ? def.story : `Hint: ${def.hint}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-400/60">
          <span>Active Session Memory</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
