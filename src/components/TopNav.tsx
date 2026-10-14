/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice 2.0 — Top Navigation Bar
 * Implements Top Bar Contract: Brand Wordmark & Name — Single-Line Nav Links — 1 Primary Action (Capture Snapshot).
 */

import React from 'react';
import { Camera, Edit3, Compass, Feather, Play, Sliders, Sparkles, RotateCcw } from 'lucide-react';
import { GardenState } from '../types';

interface TopNavProps {
  state: GardenState;
  onOpenNameModal: () => void;
  onOpenMemoryModal: () => void;
  onOpenReflectionModal: () => void;
  onOpenStageModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenRestartModal: () => void;
  onStartPresentation: () => void;
  onCaptureSnapshot: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  state,
  onOpenNameModal,
  onOpenMemoryModal,
  onOpenReflectionModal,
  onOpenStageModal,
  onOpenSettingsModal,
  onOpenRestartModal,
  onStartPresentation,
  onCaptureSnapshot,
}) => {
  return (
    <header className="flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-8 py-3.5 border-b border-white/10 bg-[#09120e]/85 backdrop-blur-md z-30 select-none">
      {/* Zone 1: Single brand wordmark with custom garden name */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <a
          href="#garden"
          className="text-lg sm:text-xl font-display font-semibold tracking-tight text-emerald-100 hover:text-white transition-colors flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          PlantVoice
        </a>

        {/* User's custom garden name */}
        <button
          onClick={onOpenNameModal}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#14231b] hover:bg-[#1a3024] border border-emerald-900/60 text-xs text-emerald-200/90 transition-colors cursor-pointer"
          title="Click to rename your garden sanctuary"
        >
          <span>{state.gardenName}</span>
          <Edit3 className="w-3 h-3 text-emerald-400/70" />
        </button>
      </div>

      {/* Zone 2: Clean single-line text links */}
      <nav aria-label="Garden options" className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-medium text-emerald-200/80">
        {/* Hackathon Judge Presentation Walkthrough */}
        <button
          onClick={onStartPresentation}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-200 hover:text-white border border-emerald-500/30 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-emerald-400"
          title="Start 60-90 second interactive walkthrough for hackathon judges"
        >
          <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" aria-hidden="true" />
          <span>Show Magic</span>
        </button>

        {/* Growth Stages */}
        <button
          onClick={onOpenStageModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-emerald-400"
          title="View the 5 growth stages"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span className="hidden sm:inline">Stages</span>
        </button>

        {/* Session Memory */}
        <button
          onClick={onOpenMemoryModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-emerald-400"
          title="View current session care memory & discoveries"
        >
          <Compass className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span>Memory</span>
        </button>

        {/* Daily Reflection */}
        <button
          onClick={onOpenReflectionModal}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-emerald-400"
          title="Read gentle reflection thought & moment of calm"
        >
          <Feather className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span>Reflection</span>
        </button>

        {/* Settings & Accessibility */}
        <button
          onClick={onOpenSettingsModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-emerald-400"
          title="Settings, sound toggles, reduced motion & view modes"
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span className="hidden md:inline">Settings</span>
        </button>

        {/* Restart Garden Option */}
        <button
          onClick={onOpenRestartModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-emerald-950/60 text-emerald-300/80 hover:text-emerald-100 border border-transparent hover:border-emerald-800/40 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-emerald-400"
          title="Restart garden journey from Stage 1"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span>Restart</span>
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action (Capture Garden Photo) */}
      <div className="flex items-center shrink-0">
        <button
          onClick={onCaptureSnapshot}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-100 hover:text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-emerald-400 active:scale-95"
          title="Capture and download high-resolution garden snapshot"
        >
          <Camera className="w-3.5 h-3.5 text-emerald-200" aria-hidden="true" />
          <span>Capture</span>
        </button>
      </div>
    </header>
  );
};
