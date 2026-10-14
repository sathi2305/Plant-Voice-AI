/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice 2.0 — Presentation Mode ("Show the Magic") for Hackathon Judges
 * Step-by-step live interactive tour utilizing real application state and interactions.
 */

import React from 'react';
import { X, ChevronRight, ChevronLeft, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { GrowthStageId, GardenMoodId } from '../types';

interface PresentationStep {
  title: string;
  narrative: string;
  actionLabel: string;
  execute: () => void;
}

interface PresentationModeGuideProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  onSetStep: (step: number) => void;
  onLeafTouch: () => void;
  onWater: () => void;
  onSunlight: () => void;
  onSayHello: () => void;
  onJumpStage: (stage: GrowthStageId) => void;
  onSelectMood: (mood: GardenMoodId) => void;
}

export const PresentationModeGuide: React.FC<PresentationModeGuideProps> = ({
  isOpen,
  onClose,
  currentStep,
  onSetStep,
  onLeafTouch,
  onWater,
  onSunlight,
  onSayHello,
  onJumpStage,
  onSelectMood,
}) => {
  if (!isOpen) return null;

  const steps: PresentationStep[] = [
    {
      title: '1. The Untouched Garden',
      narrative: 'A tranquil digital sanctuary resting in morning light. The plant sways gently with natural atmospheric physics.',
      actionLabel: 'Reset to Stage 1 & Morning Mood',
      execute: () => {
        onJumpStage(1);
        onSelectMood('morning');
      },
    },
    {
      title: '2. Touch a Leaf',
      narrative: 'Every visible leaf is an individual interaction target that responds with organic bending, a vein glow, and a pentatonic chime.',
      actionLabel: 'Caress a Leaf Now',
      execute: () => {
        onLeafTouch();
      },
    },
    {
      title: '3. Water the Roots',
      narrative: 'A stream of droplets falls into the soil, creating ripples and refreshing hydration sheens across the foliage.',
      actionLabel: 'Trigger Water Action',
      execute: () => {
        onWater();
      },
    },
    {
      title: '4. Offer Warm Sunlight',
      narrative: 'Golden rays and shimmering motes illuminate the canopy. The leaves turn gently upward toward the warmth.',
      actionLabel: 'Trigger Sunlight Action',
      execute: () => {
        onSunlight();
      },
    },
    {
      title: '5. Say Hello',
      narrative: 'A luminescent pulse travels up the stem with a welcoming crystal chime and sympathetic leaf sway.',
      actionLabel: 'Send Hello Greeting',
      execute: () => {
        onSayHello();
      },
    },
    {
      title: '6. Awakening Growth',
      narrative: 'As care accumulates, the plant advances to Stage 3 (New Beginnings) and Stage 4 (A Bud of Wonder at the crown).',
      actionLabel: 'Unfold Stage 4 (Bud of Wonder)',
      execute: () => {
        onJumpStage(4);
      },
    },
    {
      title: '7. In Full Bloom',
      narrative: 'The journey culminates in Stage 5: radiant blossom petals open with a golden core, flourishing in the moonlit night.',
      actionLabel: 'Unfold Stage 5 & Moonlit Garden',
      execute: () => {
        onJumpStage(5);
        onSelectMood('moonlit');
      },
    },
  ];

  const currentStepData = steps[currentStep] || steps[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Judge presentation walkthrough"
      className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 animate-fade-in"
    >
      <div className="bg-[#0c1611]/95 backdrop-blur-md border border-emerald-500/40 rounded-2xl shadow-2xl p-5 text-emerald-100">
        <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Show the Magic · Judge Demo ({currentStep + 1} of {steps.length})
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Exit presentation mode"
            className="p-1 rounded-lg hover:bg-white/10 text-emerald-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-sm font-semibold text-white mb-1">{currentStepData.title}</h3>
        <p className="text-xs text-emerald-200/80 mb-4 leading-relaxed font-light">
          {currentStepData.narrative}
        </p>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={currentStepData.execute}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{currentStepData.actionLabel}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSetStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              aria-label="Previous step"
              className="p-2 rounded-lg bg-[#14231b] hover:bg-[#1a3024] disabled:opacity-40 text-emerald-200 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (currentStep < steps.length - 1) {
                  onSetStep(currentStep + 1);
                } else {
                  onClose();
                }
              }}
              aria-label="Next step"
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <span>{currentStep < steps.length - 1 ? 'Next' : 'Finish Demo'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
