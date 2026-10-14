/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice 2.0 — 2D Botanical Canvas & Accessible Fallback
 * Visually rich SVG botanical garden supporting 4 moods, 5 growth stages, and 3 hidden discoveries.
 */

import React from 'react';
import { GardenState, INITIAL_LEAVES, DiscoveryId } from '../types';
import { Stage5BloomingFlower } from './Stage5BloomingFlower';

interface Garden2DFallbackProps {
  state: GardenState;
  onLeafTouch: (leafId: number) => void;
  onDiscovery?: (id: DiscoveryId) => void;
}

export const Garden2DFallback: React.FC<Garden2DFallbackProps> = ({
  state,
  onLeafTouch,
  onDiscovery,
}) => {
  const isAuraActive = state.currentStage >= 2;
  const isBudActive = state.currentStage === 4;
  const isFlowerActive = state.currentStage === 5;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 select-none overflow-hidden">
      {/* Dynamic sunlight / mood glow background overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          state.isSunlit
            ? 'opacity-80 bg-radial from-amber-200/25 via-emerald-950/20 to-transparent'
            : state.mood === 'rainy'
            ? 'opacity-60 bg-radial from-sky-900/30 via-slate-950/40 to-transparent'
            : state.mood === 'evening'
            ? 'opacity-70 bg-radial from-amber-700/20 via-amber-950/30 to-transparent'
            : state.mood === 'moonlit'
            ? 'opacity-80 bg-radial from-indigo-900/30 via-slate-950/60 to-transparent'
            : 'opacity-0'
        }`}
      />

      <svg
        viewBox="0 0 600 700"
        className="w-full max-w-[540px] max-h-[85vh] transition-transform duration-500 ease-out"
        role="img"
        aria-label="Interactive 2D Digital Garden Plant"
      >
        <defs>
          {/* Ceramic Pot Gradient */}
          <linearGradient id="potGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e3427" />
            <stop offset="50%" stopColor="#2d4d3a" />
            <stop offset="100%" stopColor="#182b20" />
          </linearGradient>

          {/* Soil Gradient */}
          <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1f1812" />
            <stop offset="100%" stopColor="#130f0b" />
          </linearGradient>

          {/* Leaf Gradients */}
          <linearGradient id="leafGradDefault" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#489d6a" />
            <stop offset="50%" stopColor="#357c52" />
            <stop offset="100%" stopColor="#25583b" />
          </linearGradient>

          <linearGradient id="leafGradGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="50%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Sun Rays Gradient */}
          <radialGradient id="sunRaysGrad" cx="50%" cy="10%" r="70%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#fde68a" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0b1410" stopOpacity="0" />
          </radialGradient>

          {/* Glow Filters */}
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="auraFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="aura" />
            <feComponentTransfer in="aura" result="brightAura">
              <feFuncA type="linear" slope="0.7" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="brightAura" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Moonlit Stars in 2D */}
        {state.mood === 'moonlit' && (
          <g className="opacity-70">
            {[
              [80, 70], [140, 110], [220, 50], [380, 60], [480, 95], [520, 150], [90, 200], [450, 220]
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 2 : 1.5} fill="#e0e7ff" className="animate-pulse" />
            ))}
          </g>
        )}

        {/* Sunlight Beams */}
        {state.isSunlit && (
          <g className="animate-pulse">
            <circle cx="300" cy="80" r="280" fill="url(#sunRaysGrad)" />
            <line x1="300" y1="40" x2="180" y2="300" stroke="#fde68a" strokeWidth="2" strokeDasharray="8 12" opacity="0.3" />
            <line x1="300" y1="40" x2="300" y2="360" stroke="#fde68a" strokeWidth="2.5" strokeDasharray="6 8" opacity="0.4" />
            <line x1="300" y1="40" x2="420" y2="300" stroke="#fde68a" strokeWidth="2" strokeDasharray="8 12" opacity="0.3" />
          </g>
        )}

        {/* Rainy Day Falling Rain in 2D */}
        {state.mood === 'rainy' && (
          <g className="opacity-60">
            {[100, 160, 240, 320, 400, 480, 130, 290, 430].map((rx, idx) => (
              <line
                key={`rain-${idx}`}
                x1={rx}
                y1={40 + (idx % 3) * 60}
                x2={rx - 10}
                y2={90 + (idx % 3) * 60}
                stroke="#7dd3fc"
                strokeWidth="1.5"
                opacity="0.7"
                strokeDasharray="4 6"
              />
            ))}
          </g>
        )}

        {/* Stone Pedestal Shadow */}
        <ellipse cx="300" cy="640" rx="150" ry="24" fill="#060c09" opacity="0.8" />
        <ellipse cx="300" cy="635" rx="140" ry="18" fill="#14211a" stroke="#22362b" strokeWidth="2" />

        {/* Pot Resonance Ring (Discovery #2) */}
        {state.isPotTapped && (
          <ellipse cx="300" cy="625" rx="135" ry="18" fill="none" stroke="#5eead4" strokeWidth="2.5" className="animate-ping" opacity="0.75" />
        )}

        {/* Ceramic Pot Base & Rim (Clickable for Discovery #2: Pot Resonance) */}
        <g
          role="button"
          tabIndex={0}
          aria-label="Ceramic Glazed Pot. Tap to awaken earthen resonance."
          onClick={() => onDiscovery && onDiscovery('pot-resonance')}
          className="cursor-pointer focus:outline-none group"
        >
          <polygon
            points="210,500 390,500 365,620 235,620"
            fill="url(#potGrad)"
            stroke="#3e634e"
            strokeWidth="1.5"
            className="group-hover:brightness-110 transition-all"
          />
          <ellipse cx="300" cy="500" rx="94" ry="16" fill="#2d4d3a" stroke="#4a765d" strokeWidth="2" />
          <ellipse cx="300" cy="502" rx="84" ry="13" fill="url(#soilGrad)" />
        </g>

        {/* Water Droplets and Soil Ripples */}
        {state.isWatering && (
          <g className="animate-water-drops">
            {[260, 290, 315, 340, 275, 325].map((x, i) => (
              <g key={`drop-${i}`}>
                <ellipse cx={x} cy={340 + i * 25} rx="3" ry="6" fill="#93c5fd" opacity="0.8" className="animate-bounce" />
                <circle cx={x} cy={502} r={8 + i * 2} fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" className="animate-ping" />
              </g>
            ))}
          </g>
        )}

        {/* Dynamic Foliage & Stem Structure with Interaction-Scaled Wind Sway */}
        <g
          style={{
            transformOrigin: '300px 502px',
            animation: state.reducedMotion
              ? 'none'
              : `gentleSway ${(5.6 - Math.min(0.8, (state.interactionCount / 9) * 0.5 + (state.currentStage - 1) * 0.18) * 2.2).toFixed(1)}s ease-in-out infinite`,
          }}
        >
          {/* Central Stem */}
          <path
            d="M 300 502 Q 306 430 295 350 T 302 240 T 300 170"
            fill="none"
            stroke="#2f7a4e"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M 300 502 Q 306 430 295 350 T 302 240 T 300 170"
            fill="none"
            stroke="#48a66d"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* Hello Energy Pulse moving up the stem */}
          {state.isSayingHello && (
            <circle cx="300" cy="300" r="14" fill="#6ee7b7" filter="url(#glowFilter)" className="animate-ping" opacity="0.75" />
          )}

          {/* Interactive Leaves */}
          {INITIAL_LEAVES.map((leaf) => {
            const isVisible = leaf.stageAvailable <= state.currentStage;
            if (!isVisible) return null;

            const isTouched = state.touchedLeafId === leaf.id;
            const stemY = 480 - leaf.height * 300;
            const isRight = Math.cos(leaf.angle) > 0;
            const reach = 85 * leaf.size;
            const curveX = isRight ? 300 + reach : 300 - reach;
            const targetY = stemY - 35 * leaf.tilt;

            return (
              <g
                key={leaf.id}
                role="button"
                tabIndex={0}
                aria-label={`Leaf: ${leaf.name}. ${leaf.description}. Press enter or tap to touch.`}
                onClick={() => onLeafTouch(leaf.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onLeafTouch(leaf.id);
                  }
                }}
                className="cursor-pointer focus:outline-none group transition-all duration-300"
                transform={isTouched ? `scale(1.06) translate(${isRight ? 4 : -4}, -3)` : undefined}
                filter={isTouched ? 'url(#glowFilter)' : isAuraActive ? 'url(#auraFilter)' : undefined}
              >
                <line
                  x1={300}
                  y1={stemY}
                  x2={curveX * 0.4 + 300 * 0.6}
                  y2={stemY - 10}
                  stroke="#2f7a4e"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                <path
                  d={
                    isRight
                      ? `M ${300 * 0.5 + curveX * 0.5} ${stemY - 10} 
                         C ${curveX - 10} ${stemY - 50}, ${curveX + 30} ${targetY - 20}, ${curveX + 45} ${targetY}
                         C ${curveX + 30} ${targetY + 25}, ${curveX - 20} ${targetY + 30}, ${300 * 0.5 + curveX * 0.5} ${stemY - 10}`
                      : `M ${300 * 0.5 + curveX * 0.5} ${stemY - 10} 
                         C ${curveX + 10} ${stemY - 50}, ${curveX - 30} ${targetY - 20}, ${curveX - 45} ${targetY}
                         C ${curveX - 30} ${targetY + 25}, ${curveX + 20} ${targetY + 30}, ${300 * 0.5 + curveX * 0.5} ${stemY - 10}`
                  }
                  fill={isTouched ? 'url(#leafGradGlow)' : 'url(#leafGradDefault)'}
                  stroke={isTouched ? '#86efac' : '#5fb882'}
                  strokeWidth={isTouched ? '2.5' : '1.5'}
                  className="transition-colors duration-300 group-hover:brightness-110"
                />

                <path
                  d={`M ${300 * 0.5 + curveX * 0.5} ${stemY - 10} Q ${curveX} ${targetY + 5} ${isRight ? curveX + 40 : curveX - 40} ${targetY}`}
                  fill="none"
                  stroke="#a7f3d0"
                  strokeWidth="1.5"
                  opacity={isTouched ? '0.9' : '0.55'}
                />

                <circle
                  cx={isRight ? curveX + 20 : curveX - 20}
                  cy={targetY}
                  r="18"
                  fill="none"
                  stroke="#86efac"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  className="opacity-0 group-focus-visible:opacity-100 transition-opacity"
                />
              </g>
            );
          })}

          {/* Stage 4 Flower Bud at the Crown */}
          {isBudActive && (
            <g transform="translate(300, 168)" className="animate-pulse">
              <ellipse cx="-6" cy="0" rx="6" ry="14" fill="#3b7d54" transform="rotate(-15)" />
              <ellipse cx="6" cy="0" rx="6" ry="14" fill="#3b7d54" transform="rotate(15)" />
              <circle cx="0" cy="-6" r="7" fill="#facc15" filter="url(#glowFilter)" />
            </g>
          )}

          {/* Stage 5 Blooming Plant Component with Visual 'bloom' Event Listener */}
          <Stage5BloomingFlower
            currentStage={state.currentStage}
            reducedMotion={state.reducedMotion}
            x={300}
            y={165}
          />
        </g>

        {/* Discovery #1: Visiting Swallowtail Butterfly in 2D */}
        <g
          role="button"
          tabIndex={0}
          aria-label="Visiting Swallowtail Butterfly. Tap to greet."
          onClick={() => onDiscovery && onDiscovery('butterfly')}
          className="cursor-pointer group focus:outline-none"
          transform={state.isButterflyFlying ? 'translate(360, 210) scale(1.15)' : 'translate(390, 260)'}
        >
          <ellipse cx="-8" cy="-6" rx="10" ry="15" fill="#34d399" opacity="0.9" transform="rotate(-20)" />
          <ellipse cx="8" cy="-6" rx="10" ry="15" fill="#34d399" opacity="0.9" transform="rotate(20)" />
          <line x1="0" y1="-14" x2="0" y2="4" stroke="#064e3b" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="0" cy="-4" r="3" fill="#a7f3d0" />
        </g>

        {/* Discovery #3: Starlight Wisp in 2D */}
        <g
          role="button"
          tabIndex={0}
          aria-label="Starlight Firefly Wisp. Tap to catch constellation sparkle."
          onClick={() => onDiscovery && onDiscovery('starlight-wisp')}
          className="cursor-pointer group focus:outline-none animate-pulse"
          transform="translate(240, 150)"
        >
          <circle cx="0" cy="0" r="8" fill="#fef08a" filter="url(#glowFilter)" />
          <circle cx="0" cy="0" r="14" fill="none" stroke="#fde047" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
};
