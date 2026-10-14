/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice — Garden Contextual Message & First-Visit Whisper
 * Calm, reflective message feedback that connects human care with botanical response.
 */

import React from 'react';

interface GardenMessageProps {
  message: string;
  hasInteracted: boolean;
  onDismissTip?: () => void;
}

export const GardenMessage: React.FC<GardenMessageProps> = ({ message, hasInteracted }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-lg px-4 pointer-events-none transition-all duration-500">
      {/* First-visit guidance whisper (disappears gently after first interaction) */}
      {!hasInteracted ? (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#0d1813]/90 backdrop-blur-md rounded-full border border-emerald-500/20 shadow-lg text-xs text-emerald-200/90 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Touch any leaf, or offer water below to begin listening.</span>
        </div>
      ) : (
        /* Dynamic contextual response message */
        <div
          key={message}
          className="px-5 py-2.5 bg-[#0b1510]/85 backdrop-blur-md rounded-xl border border-white/10 shadow-xl transition-all duration-300 transform animate-fade-in"
        >
          <p className="text-xs sm:text-sm font-light text-emerald-100 tracking-wide">
            {message}
          </p>
        </div>
      )}
    </div>
  );
};
