/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice 2.0 — Stage 5 Blooming Plant Component
 * Features a visual 'bloom' event listener that triggers the `animate-bloom-rotate`
 * and `animate-bloom-pulse` CSS keyframe classes when growth stage reaches 5.
 */

import React, { useState, useEffect, useRef } from 'react';
import { GrowthStageId } from '../types';

interface Stage5BloomingFlowerProps {
  currentStage: GrowthStageId;
  reducedMotion?: boolean;
  x?: number;
  y?: number;
  onBloomTriggered?: () => void;
}

export const Stage5BloomingFlower: React.FC<Stage5BloomingFlowerProps> = ({
  currentStage,
  reducedMotion = false,
  x = 300,
  y = 165,
  onBloomTriggered,
}) => {
  const flowerRef = useRef<SVGGElement>(null);
  const [isBlooming, setIsBlooming] = useState<boolean>(currentStage === 5);

  // Set up visual 'bloom' event listener that triggers animate-bloom-rotate & animate-bloom-pulse CSS classes
  useEffect(() => {
    const handleBloomEvent = (event: Event) => {
      setIsBlooming(true);
      if (onBloomTriggered) {
        onBloomTriggered();
      }
    };

    const element = flowerRef.current;
    if (element) {
      element.addEventListener('bloom', handleBloomEvent);
    }
    window.addEventListener('bloom', handleBloomEvent);

    // If growth stage reaches 5, dispatch visual 'bloom' event
    if (currentStage === 5) {
      const bloomEvent = new CustomEvent('bloom', {
        detail: {
          stage: 5,
          timestamp: Date.now(),
          source: 'Stage5BloomingFlower',
        },
        bubbles: true,
      });

      if (element) {
        element.dispatchEvent(bloomEvent);
      }
      window.dispatchEvent(bloomEvent);
    } else {
      setIsBlooming(false);
    }

    return () => {
      if (element) {
        element.removeEventListener('bloom', handleBloomEvent);
      }
      window.removeEventListener('bloom', handleBloomEvent);
    };
  }, [currentStage, onBloomTriggered]);

  if (currentStage !== 5) return null;

  const rotateClass = isBlooming && !reducedMotion ? 'animate-bloom-rotate' : '';
  const pulseClass = isBlooming && !reducedMotion ? 'animate-bloom-pulse' : '';
  const auraClass = isBlooming && !reducedMotion ? 'animate-flower-aura pointer-events-none' : 'pointer-events-none';
  const petalClass = isBlooming && !reducedMotion ? 'animate-petal-breathe' : '';

  return (
    <g
      ref={flowerRef}
      transform={`translate(${x}, ${y})`}
      className="stage-5-blooming-plant-component select-none"
      data-stage="5"
      data-blooming={isBlooming ? 'true' : 'false'}
    >
      {/* Radiating Golden Blossom Aura */}
      <circle
        cx="0"
        cy="0"
        r="42"
        fill="url(#sunRaysGrad)"
        className={auraClass}
      />

      {/* Outer group: triggers `animate-bloom-rotate` CSS class upon 'bloom' event */}
      <g className={rotateClass}>
        {/* Inner group: triggers `animate-bloom-pulse` CSS class upon 'bloom' event */}
        <g className={pulseClass}>
          {/* Outer Layer of Flower Petals */}
          {[0, 51.4, 102.8, 154.2, 205.7, 257.1, 308.5].map((angle, i) => (
            <ellipse
              key={`outer-petal-${i}`}
              cx="0"
              cy="-24"
              rx="13"
              ry="25"
              fill="#fffdf8"
              stroke="#fde68a"
              strokeWidth="1.2"
              transform={`rotate(${angle})`}
              className={petalClass}
              style={{ animationDelay: `${(i * 0.35).toFixed(2)}s` }}
              opacity="0.96"
            />
          ))}

          {/* Inner Decorative Flower Ring */}
          {[25.7, 77.1, 128.5, 180, 231.4, 282.8, 334.2].map((angle, j) => (
            <ellipse
              key={`inner-petal-${j}`}
              cx="0"
              cy="-14"
              rx="8"
              ry="15"
              fill="#fef3c7"
              stroke="#fcd34d"
              strokeWidth="0.8"
              transform={`rotate(${angle})`}
              className={petalClass}
              style={{ animationDelay: `${(j * 0.25).toFixed(2)}s` }}
              opacity="0.9"
            />
          ))}

          {/* Luminous Golden Pistil Center */}
          <circle cx="0" cy="0" r="13" fill="#f59e0b" filter="url(#glowFilter)" />
          <circle cx="0" cy="0" r="8" fill="#fef08a" />
        </g>
      </g>
    </g>
  );
};
