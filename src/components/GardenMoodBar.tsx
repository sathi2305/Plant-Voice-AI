/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice 2.0 — Garden Mood Selector
 * 4 Visually distinct environments: Morning Calm, Rainy Day, Golden Evening, Moonlit Garden.
 */

import React from 'react';
import { Sunrise, CloudRain, Sunset, Moon } from 'lucide-react';
import { GardenMoodId, GARDEN_MOODS } from '../types';

interface GardenMoodBarProps {
  currentMood: GardenMoodId;
  onSelectMood: (mood: GardenMoodId) => void;
}

export const GardenMoodBar: React.FC<GardenMoodBarProps> = ({ currentMood, onSelectMood }) => {
  const moods: { id: GardenMoodId; icon: React.ReactNode; label: string }[] = [
    { id: 'morning', icon: <Sunrise className="w-3.5 h-3.5" />, label: 'Morning' },
    { id: 'rainy', icon: <CloudRain className="w-3.5 h-3.5" />, label: 'Rainy' },
    { id: 'evening', icon: <Sunset className="w-3.5 h-3.5" />, label: 'Evening' },
    { id: 'moonlit', icon: <Moon className="w-3.5 h-3.5" />, label: 'Moonlit' },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Garden environment mood selector"
      className="flex items-center gap-1 p-1 bg-[#0c1611]/85 backdrop-blur-md rounded-xl border border-white/10 shadow-lg text-xs"
    >
      {moods.map((m) => {
        const isActive = currentMood === m.id;
        const config = GARDEN_MOODS[m.id];
        return (
          <button
            key={m.id}
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelectMood(m.id)}
            title={`${config.name} — ${config.subtitle}`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-emerald-400 ${
              isActive
                ? 'bg-[#1b3427] text-white border border-emerald-500/40 shadow-sm'
                : 'text-emerald-300/70 hover:text-emerald-100 hover:bg-white/5'
            }`}
          >
            <span style={{ color: isActive ? config.accentColor : undefined }}>{m.icon}</span>
            <span className="hidden sm:inline">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
};
