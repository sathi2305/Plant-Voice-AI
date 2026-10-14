/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice — Accessible Leaf Companion Controls
 * Gives full accessibility to every individual leaf with keyboard focus and tactile feedback.
 */

import React from 'react';
import { Leaf } from 'lucide-react';
import { INITIAL_LEAVES, GardenState } from '../types';

interface InteractiveLeafListProps {
  state: GardenState;
  onLeafTouch: (leafId: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const InteractiveLeafList: React.FC<InteractiveLeafListProps> = ({
  state,
  onLeafTouch,
  isOpen,
  onToggle,
}) => {
  const visibleLeaves = INITIAL_LEAVES.filter((l) => l.stageAvailable <= state.currentStage);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="leaf-roster"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111f18]/80 hover:bg-[#182b22] border border-white/10 text-xs text-emerald-200/80 hover:text-emerald-100 transition-colors cursor-pointer"
        title="View list of active foliage leaves"
      >
        <Leaf className="w-3.5 h-3.5 text-emerald-400" />
        <span>Leaves ({visibleLeaves.length})</span>
      </button>

      {isOpen && (
        <div
          id="leaf-roster"
          className="absolute bottom-full mb-2 left-0 w-64 max-h-72 overflow-y-auto p-2 bg-[#0c1611]/95 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl z-40 flex flex-col gap-1.5"
        >
          <div className="px-2 py-1 text-[11px] font-medium text-emerald-400/70 uppercase tracking-wider">
            Active Foliage
          </div>
          {visibleLeaves.map((leaf) => {
            const isTouched = state.touchedLeafId === leaf.id;
            return (
              <button
                key={leaf.id}
                onClick={() => onLeafTouch(leaf.id)}
                className={`flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                  isTouched
                    ? 'bg-emerald-800/50 text-emerald-100 border border-emerald-400/40'
                    : 'bg-[#15241c]/60 hover:bg-[#1a2e24] text-emerald-200 border border-white/5'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-emerald-100">{leaf.name}</span>
                  <span className="text-[10px] text-emerald-400/60 truncate max-w-[170px]">
                    {leaf.description}
                  </span>
                </div>
                <Leaf
                  className={`w-3.5 h-3.5 shrink-0 ml-2 ${
                    isTouched ? 'text-emerald-300 animate-spin' : 'text-emerald-500/70'
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
