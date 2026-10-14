/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice — Project Information & Creator Disclosure Modal
 * Creator: Sathiyamoorthi Saravanan | DJXHack 2026 Everyday Magic
 */

import React from 'react';
import { X, Sparkles, Heart, Code2, ShieldCheck, Flower2 } from 'lucide-react';

interface ProjectInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-info-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0d1712] border border-emerald-900/60 rounded-2xl shadow-2xl p-6 sm:p-8 text-emerald-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-lg text-emerald-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-400"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Flower2 className="w-6 h-6" />
          </div>
          <div>
            <h2 id="project-info-title" className="text-xl font-display font-semibold text-white">
              PlantVoice
            </h2>
            <p className="text-xs text-emerald-300/70">The Little Garden That Grows With You</p>
          </div>
        </div>

        {/* Creator & Challenge details */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10 my-4 text-xs">
          <div>
            <span className="text-emerald-400/60 block">Creator</span>
            <span className="font-medium text-emerald-200">Sathiyamoorthi Saravanan</span>
          </div>
          <div>
            <span className="text-emerald-400/60 block">Challenge</span>
            <span className="font-medium text-emerald-200">DJXHack 2026 — Everyday Magic</span>
          </div>
        </div>

        {/* Narrative & Concept */}
        <div className="space-y-4 text-xs sm:text-sm text-emerald-200/90 leading-relaxed font-light">
          <p>
            <strong className="font-medium text-emerald-100">Everyday Magic:</strong> PlantVoice transforms
            the familiar ritual of nurturing a plant into an emotionally engaging digital sanctuary. Every
            touch, drop of water, and ray of warmth evokes an immediate, living visual response.
          </p>

          <div className="p-3.5 bg-[#122319] rounded-xl border border-emerald-800/40 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Interactive Care Loop</span>
            </div>
            <ul className="space-y-1.5 text-emerald-200/80 pl-5 list-disc">
              <li>
                <strong>Touch Leaves:</strong> Tap or click any leaf to feel it bend, glow, and sing with a
                wooden pentatonic chime.
              </li>
              <li>
                <strong>Water:</strong> Releases falling water droplets, ripples the soil, and quenches the roots.
              </li>
              <li>
                <strong>Sunlight:</strong> Warms the conservatory lighting and awakens golden light particles.
              </li>
              <li>
                <strong>Say Hello:</strong> Sends an ascending energy pulse up the stem with a welcoming chime.
              </li>
              <li>
                <strong>Symbolic Growth:</strong> Care nurtures the plant from Stage 1 (First Connection) to Stage 2
                (Gentle Care) and Stage 3 (A Blooming Blossom).
              </li>
            </ul>
          </div>

          <div className="p-3.5 bg-[#101b15] rounded-xl border border-white/5 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Honesty & Transparency</span>
            </div>
            <p className="text-emerald-400/70 text-[11px] leading-normal">
              PlantVoice is an interactive digital artwork designed for wonder and calm. It does not use
              fake biological sensor claims, mock plant diagnosis, or hidden telemetry. Sound is synthesized
              locally in real time via the Web Audio API without external audio files.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-400/60">
          <span>Built for DJXHack 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-400"
          >
            Return to Garden
          </button>
        </div>
      </div>
    </div>
  );
};
