/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice 2.0 — Settings & Comfort Controls
 */

import React from 'react';
import { X, Volume2, VolumeX, Eye, Zap, ZoomIn, ZoomOut, RotateCcw, Sliders } from 'lucide-react';
import { GardenState, GardenMoodId, GARDEN_MOODS } from '../types';

interface SettingsComfortModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GardenState;
  onToggleSound: () => void;
  onToggleAmbient: () => void;
  onToggleReducedMotion: () => void;
  onToggleHighContrast: () => void;
  onToggleCameraView: () => void;
  onSelectMood: (mood: GardenMoodId) => void;
  onResetGarden: () => void;
}

export const SettingsComfortModal: React.FC<SettingsComfortModalProps> = ({
  isOpen,
  onClose,
  state,
  onToggleSound,
  onToggleAmbient,
  onToggleReducedMotion,
  onToggleHighContrast,
  onToggleCameraView,
  onSelectMood,
  onResetGarden,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0d1712] border border-emerald-900/60 rounded-2xl shadow-2xl p-6 sm:p-7 text-emerald-100">
        <button
          onClick={onClose}
          aria-label="Close settings"
          className="absolute top-5 right-5 p-2 rounded-lg text-emerald-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-1">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <h2 id="settings-modal-title" className="text-lg font-display font-semibold text-white">
            Garden Settings & Comfort
          </h2>
        </div>
        <p className="text-xs text-emerald-400/70 mb-5">
          Tune your viewing comfort, soundscape, and sensory preferences.
        </p>

        <div className="space-y-3.5 text-xs">
          {/* Audio Settings */}
          <div className="p-3.5 rounded-xl bg-[#111f18] border border-white/5 space-y-3">
            <h3 className="font-semibold text-emerald-200">Audio Experience</h3>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-white block">Interactive Chimes & Feedback</span>
                <span className="text-[11px] text-emerald-400/60">Procedural sound effects for care actions</span>
              </div>
              <button
                onClick={onToggleSound}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  state.soundEnabled ? 'bg-emerald-800 text-white' : 'bg-stone-800 text-stone-400'
                }`}
              >
                {state.soundEnabled ? 'Enabled' : 'Muted'}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                <span className="font-medium text-white block">Atmospheric Ambient Sound</span>
                <span className="text-[11px] text-emerald-400/60">Gentle conservatory wind & rain textures</span>
              </div>
              <button
                onClick={onToggleAmbient}
                disabled={!state.soundEnabled}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  state.ambientAudioEnabled && state.soundEnabled
                    ? 'bg-emerald-800 text-white'
                    : 'bg-stone-800 text-stone-400 opacity-60'
                }`}
              >
                {state.ambientAudioEnabled && state.soundEnabled ? 'Active' : 'Off'}
              </button>
            </div>
          </div>

          {/* Visual Comfort & Accessibility */}
          <div className="p-3.5 rounded-xl bg-[#111f18] border border-white/5 space-y-3">
            <h3 className="font-semibold text-emerald-200">Accessibility & Camera</h3>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-white block">Reduced Motion</span>
                <span className="text-[11px] text-emerald-400/60">Quiets wind oscillation and particle speed</span>
              </div>
              <button
                onClick={onToggleReducedMotion}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  state.reducedMotion ? 'bg-emerald-800 text-white' : 'bg-[#18291f] text-emerald-300'
                }`}
              >
                {state.reducedMotion ? 'Reduced' : 'Standard'}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                <span className="font-medium text-white block">High Contrast Interface</span>
                <span className="text-[11px] text-emerald-400/60">Deepens panel contrast and sharpens borders</span>
              </div>
              <button
                onClick={onToggleHighContrast}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  state.highContrast ? 'bg-emerald-800 text-white' : 'bg-[#18291f] text-emerald-300'
                }`}
              >
                {state.highContrast ? 'Active' : 'Off'}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                <span className="font-medium text-white block">Camera Perspective</span>
                <span className="text-[11px] text-emerald-400/60">Switch between focused plant and wider garden</span>
              </div>
              <button
                onClick={onToggleCameraView}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium bg-[#18291f] hover:bg-emerald-800 text-emerald-200 transition-colors cursor-pointer"
              >
                {state.cameraView === 'focus' ? (
                  <>
                    <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Focused View</span>
                  </>
                ) : (
                  <>
                    <ZoomOut className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Wide Garden</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Interaction Guide */}
          <div className="p-3.5 rounded-xl bg-[#111f18] border border-white/5">
            <h3 className="font-semibold text-emerald-200 mb-1.5">How to Interact</h3>
            <ul className="space-y-1 text-emerald-300/80 text-[11px] pl-4 list-disc">
              <li>Tap or click any leaf to caress it with varying harmonic chimes.</li>
              <li>Offer Water, Sunlight, or Say Hello to nourish symbolic growth.</li>
              <li>Explore the garden to discover the visiting butterfly, pot resonance, and starlight wisp!</li>
            </ul>
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => {
              onResetGarden();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-900/40 transition-colors cursor-pointer"
            title="Restart garden journey from Stage 1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Restart Garden</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs rounded-lg font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
