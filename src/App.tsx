/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice 2.0 — The Little Garden That Grows With You
 * Creator: Sathiyamoorthi Saravanan
 * Challenge: DJXHack 2026 — Everyday Magic
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  GardenState,
  GrowthStageId,
  GardenMoodId,
  DiscoveryId,
  INITIAL_LEAVES,
  GROWTH_STAGES,
  GARDEN_MOODS,
  AUTHORED_LEAF_MESSAGES,
  DISCOVERY_DEFINITIONS,
} from './types';
import { Garden3DScene } from './components/Garden3DScene';
import { Garden2DFallback } from './components/Garden2DFallback';
import { TopNav } from './components/TopNav';
import { CareActionBar } from './components/CareActionBar';
import { GrowthIndicator } from './components/GrowthIndicator';
import { GardenMessage } from './components/GardenMessage';
import { GardenMoodBar } from './components/GardenMoodBar';
import { InteractiveLeafList } from './components/InteractiveLeafList';
import { ProjectInfoModal } from './components/ProjectInfoModal';
import { GrowthStageModal } from './components/GrowthStageModal';
import { PersonalGardenNameModal } from './components/PersonalGardenNameModal';
import { GardenMemoryModal } from './components/GardenMemoryModal';
import { DailyReflectionCard } from './components/DailyReflectionCard';
import { SettingsComfortModal } from './components/SettingsComfortModal';
import { PresentationModeGuide } from './components/PresentationModeGuide';
import { MomentOfCalmOverlay } from './components/MomentOfCalmOverlay';
import { CaptureNotificationModal } from './components/CaptureNotificationModal';
import { RestartConfirmModal } from './components/RestartConfirmModal';
import { captureGardenSnapshot } from './utils/snapshot';
import { gardenAudio } from './utils/audio';

const STORAGE_KEY = 'plantvoice_garden_state_v2';

const getInitialGardenState = (): GardenState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        isWatering: false,
        isSunlit: false,
        isSayingHello: false,
        touchedLeafId: null,
        isPotTapped: false,
        isButterflyFlying: false,
        isWispTapped: false,
        isCalmMoment: false,
        isPresentationMode: false,
        presentationStep: 0,
        gardenName: parsed.gardenName || 'Little Haven',
        mood: parsed.mood || 'morning',
        cameraView: parsed.cameraView || 'focus',
        discoveries: parsed.discoveries || {
          butterfly: false,
          'pot-resonance': false,
          'starlight-wisp': false,
        },
      };
    }
  } catch {
    // fallback
  }

  return {
    gardenName: 'Little Haven',
    interactionCount: 0,
    waterCount: 0,
    sunCount: 0,
    helloCount: 0,
    leafTouchCount: 0,
    currentStage: 1,
    stageProgress: 10,
    mood: 'morning',
    cameraView: 'focus',
    lastAction: 'none',
    lastMessage: 'A quiet seed rests in the soil, awaiting your gentle attention.',
    isWatering: false,
    isSunlit: false,
    isSayingHello: false,
    touchedLeafId: null,
    leafTapCount: 0,
    soundEnabled: true,
    ambientAudioEnabled: false,
    reducedMotion: false,
    highContrast: false,
    hasInteracted: false,
    viewMode: '3d',
    discoveries: {
      butterfly: false,
      'pot-resonance': false,
      'starlight-wisp': false,
    },
    lastDiscovery: null,
    isPotTapped: false,
    isButterflyFlying: false,
    isWispTapped: false,
    isCalmMoment: false,
    isPresentationMode: false,
    presentationStep: 0,
  };
};

export default function App() {
  const [state, setState] = useState<GardenState>(getInitialGardenState);

  // Modal visibility states
  const [isLeafListOpen, setIsLeafListOpen] = useState(false);
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isRestartModalOpen, setIsRestartModalOpen] = useState(false);
  const [captureModalData, setCaptureModalData] = useState<{ isOpen: boolean; dataUrl?: string }>({
    isOpen: false,
  });

  // Local storage persistence
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          gardenName: state.gardenName,
          interactionCount: state.interactionCount,
          waterCount: state.waterCount,
          sunCount: state.sunCount,
          helloCount: state.helloCount,
          leafTouchCount: state.leafTouchCount,
          currentStage: state.currentStage,
          stageProgress: state.stageProgress,
          mood: state.mood,
          cameraView: state.cameraView,
          soundEnabled: state.soundEnabled,
          ambientAudioEnabled: state.ambientAudioEnabled,
          reducedMotion: state.reducedMotion,
          highContrast: state.highContrast,
          hasInteracted: state.hasInteracted,
          viewMode: state.viewMode,
          discoveries: state.discoveries,
        })
      );
    } catch {
      // storage unavailable
    }
  }, [
    state.gardenName,
    state.interactionCount,
    state.waterCount,
    state.sunCount,
    state.helloCount,
    state.leafTouchCount,
    state.currentStage,
    state.stageProgress,
    state.mood,
    state.cameraView,
    state.soundEnabled,
    state.ambientAudioEnabled,
    state.reducedMotion,
    state.highContrast,
    state.hasInteracted,
    state.viewMode,
    state.discoveries,
  ]);

  // Compute 5-stage progression
  const computeStageAndProgress = (count: number): { stage: GrowthStageId; progress: number } => {
    if (count < 3) {
      // Stage 1: First Hello (0-2)
      return { stage: 1, progress: Math.min(100, Math.round((count / 3) * 100)) };
    } else if (count < 5) {
      // Stage 2: Little Moments (3-4)
      return { stage: 2, progress: Math.min(100, Math.round(((count - 3) / 2) * 100)) };
    } else if (count < 7) {
      // Stage 3: New Beginnings (5-6)
      return { stage: 3, progress: Math.min(100, Math.round(((count - 5) / 2) * 100)) };
    } else if (count < 9) {
      // Stage 4: A Bud of Wonder (7-8)
      return { stage: 4, progress: Math.min(100, Math.round(((count - 7) / 2) * 100)) };
    } else {
      // Stage 5: In Full Bloom (9+)
      return { stage: 5, progress: 100 };
    }
  };

  // Helper to record any care action
  const registerCare = useCallback(
    (actionType: 'water' | 'sunlight' | 'hello' | 'leaf-touch', customMessage: string) => {
      setState((prev) => {
        const nextCount = prev.interactionCount + 1;
        const { stage: nextStage, progress: nextProgress } = computeStageAndProgress(nextCount);

        if (nextStage > prev.currentStage) {
          setTimeout(() => {
            gardenAudio.playGrowthStageUpgrade();
            if (nextStage === 5) {
              window.dispatchEvent(
                new CustomEvent('bloom', {
                  detail: { stage: 5, timestamp: Date.now() },
                  bubbles: true,
                })
              );
            }
          }, 300);
        }

        const stageUpgradeMessages: Record<GrowthStageId, string> = {
          1: 'The journey begins in quiet ground.',
          2: 'A delicate aura awakens along the veins — your care is felt.',
          3: 'Fresh emerald leaves uncurl along the stem with newfound vigor!',
          4: 'Look closely: a small decorative flower bud has emerged at the crown!',
          5: 'In Full Bloom! Radiant petals unfold around a glowing golden center.',
        };

        return {
          ...prev,
          interactionCount: nextCount,
          waterCount: actionType === 'water' ? prev.waterCount + 1 : prev.waterCount,
          sunCount: actionType === 'sunlight' ? prev.sunCount + 1 : prev.sunCount,
          helloCount: actionType === 'hello' ? prev.helloCount + 1 : prev.helloCount,
          leafTouchCount: actionType === 'leaf-touch' ? prev.leafTouchCount + 1 : prev.leafTouchCount,
          currentStage: nextStage,
          stageProgress: nextProgress,
          lastAction: actionType,
          lastMessage: nextStage > prev.currentStage ? stageUpgradeMessages[nextStage] : customMessage,
          hasInteracted: true,
        };
      });
    },
    []
  );

  // ACTION A: WATER
  const handleWater = useCallback(() => {
    if (state.isWatering) return;
    gardenAudio.playWaterDroplets();
    setState((prev) => ({ ...prev, isWatering: true }));
    registerCare('water', 'A little moment of care. Refreshing drops quench the roots.');

    setTimeout(() => {
      setState((prev) => ({ ...prev, isWatering: false }));
    }, 2400);
  }, [state.isWatering, registerCare]);

  // ACTION B: SUNLIGHT
  const handleSunlight = useCallback(() => {
    if (state.isSunlit) return;
    gardenAudio.playSunlightWarmth();
    setState((prev) => ({ ...prev, isSunlit: true }));
    registerCare('sunlight', 'Let a little light in. The leaves turn gently toward the warmth.');

    setTimeout(() => {
      setState((prev) => ({ ...prev, isSunlit: false }));
    }, 2800);
  }, [state.isSunlit, registerCare]);

  // ACTION C: SAY HELLO
  const handleSayHello = useCallback(() => {
    if (state.isSayingHello) return;
    gardenAudio.playSayHelloChime();
    setState((prev) => ({ ...prev, isSayingHello: true }));
    registerCare('hello', 'Hello, garden friend. The foliage trembles with quiet recognition.');

    setTimeout(() => {
      setState((prev) => ({ ...prev, isSayingHello: false }));
    }, 2000);
  }, [state.isSayingHello, registerCare]);

  // ACTION: LEAF TOUCH with Personality Variations
  const handleLeafTouch = useCallback(
    (leafId: number) => {
      const nextTap = state.leafTapCount + 1;
      gardenAudio.playLeafTouch(leafId, nextTap);

      const leaf = INITIAL_LEAVES.find((l) => l.id === leafId);
      const leafName = leaf ? leaf.name : `Leaf #${leafId}`;
      const messageIndex = nextTap % AUTHORED_LEAF_MESSAGES.length;
      const responseMessage = `${AUTHORED_LEAF_MESSAGES[messageIndex]} ("${leafName}")`;

      setState((prev) => ({
        ...prev,
        touchedLeafId: leafId,
        leafTapCount: nextTap,
      }));

      registerCare('leaf-touch', responseMessage);

      setTimeout(() => {
        setState((prev) => (prev.touchedLeafId === leafId ? { ...prev, touchedLeafId: null } : prev));
      }, 700);
    },
    [state.leafTapCount, registerCare]
  );

  // ACTION: DISCOVERIES
  const handleDiscovery = useCallback(
    (discId: DiscoveryId) => {
      const def = DISCOVERY_DEFINITIONS[discId];
      if (discId === 'butterfly') {
        gardenAudio.playButterflyFlutter();
        setState((prev) => ({
          ...prev,
          isButterflyFlying: true,
          discoveries: { ...prev.discoveries, butterfly: true },
          lastDiscovery: 'butterfly',
        }));
        registerCare('leaf-touch', 'You discovered a visiting emerald swallowtail! It spirals through the air.');
        setTimeout(() => {
          setState((prev) => ({ ...prev, isButterflyFlying: false }));
        }, 3500);
      } else if (discId === 'pot-resonance') {
        gardenAudio.playPotResonance();
        setState((prev) => ({
          ...prev,
          isPotTapped: true,
          discoveries: { ...prev.discoveries, 'pot-resonance': true },
          lastDiscovery: 'pot-resonance',
        }));
        registerCare('leaf-touch', 'You awakened the earthen pot resonance. Acoustic warmth hums through the roots.');
        setTimeout(() => {
          setState((prev) => ({ ...prev, isPotTapped: false }));
        }, 2500);
      } else if (discId === 'starlight-wisp') {
        gardenAudio.playStarlightSparkle();
        setState((prev) => ({
          ...prev,
          isWispTapped: true,
          discoveries: { ...prev.discoveries, 'starlight-wisp': true },
          lastDiscovery: 'starlight-wisp',
        }));
        registerCare('leaf-touch', 'You caught a drifting starlight wisp! Constellation sparkles dance in the air.');
      }
    },
    [registerCare]
  );

  // MOOD SELECTOR
  const handleSelectMood = useCallback((mood: GardenMoodId) => {
    gardenAudio.setMood(mood);
    setState((prev) => ({
      ...prev,
      mood,
      lastMessage: `Garden atmosphere shifted to ${GARDEN_MOODS[mood].name}.`,
    }));
  }, []);

  // TOGGLE CAMERA VIEW (FOCUS / WIDE)
  const handleToggleCameraView = useCallback(() => {
    setState((prev) => ({
      ...prev,
      cameraView: prev.cameraView === 'focus' ? 'wide' : 'focus',
    }));
  }, []);

  // CAPTURE GARDEN SNAPSHOT
  const handleCaptureSnapshot = useCallback(() => {
    const stageInfo = GROWTH_STAGES[state.currentStage];
    const moodInfo = GARDEN_MOODS[state.mood];
    const res = captureGardenSnapshot(state.gardenName, moodInfo.name, `Stage ${state.currentStage}: ${stageInfo.name}`);

    if (res.success) {
      setCaptureModalData({ isOpen: true, dataUrl: res.dataUrl });
    } else {
      alert(`Snapshot captured of ${state.gardenName}!`);
    }
  }, [state.gardenName, state.currentStage, state.mood]);

  // TOGGLE SOUND
  const handleToggleSound = useCallback(() => {
    setState((prev) => {
      const next = !prev.soundEnabled;
      gardenAudio.setMuted(!next);
      return { ...prev, soundEnabled: next };
    });
  }, []);

  // TOGGLE AMBIENT SOUND
  const handleToggleAmbient = useCallback(() => {
    setState((prev) => {
      const next = !prev.ambientAudioEnabled;
      gardenAudio.setAmbientEnabled(next);
      return { ...prev, ambientAudioEnabled: next };
    });
  }, []);

  // RESET GARDEN
  const handleResetGarden = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // storage
    }
    gardenAudio.playRestartRenewalChime();
    gardenAudio.setMood('morning');
    setState({
      gardenName: 'Little Haven',
      interactionCount: 0,
      waterCount: 0,
      sunCount: 0,
      helloCount: 0,
      leafTouchCount: 0,
      currentStage: 1,
      stageProgress: 10,
      mood: 'morning',
      cameraView: 'focus',
      lastAction: 'none',
      lastMessage: 'The garden returns to its quiet beginning, ready for fresh care.',
      isWatering: false,
      isSunlit: false,
      isSayingHello: false,
      touchedLeafId: null,
      leafTapCount: 0,
      soundEnabled: state.soundEnabled,
      ambientAudioEnabled: state.ambientAudioEnabled,
      reducedMotion: state.reducedMotion,
      highContrast: state.highContrast,
      hasInteracted: false,
      viewMode: state.viewMode,
      discoveries: {
        butterfly: false,
        'pot-resonance': false,
        'starlight-wisp': false,
      },
      lastDiscovery: null,
      isPotTapped: false,
      isButterflyFlying: false,
      isWispTapped: false,
      isCalmMoment: false,
      isPresentationMode: false,
      presentationStep: 0,
    });
  }, [state.soundEnabled, state.ambientAudioEnabled, state.reducedMotion, state.highContrast, state.viewMode]);

  // JUMP TO STAGE (FOR REVIEWER TESTING)
  const handleJumpStage = useCallback((stageId: GrowthStageId) => {
    const minCounts: Record<GrowthStageId, number> = { 1: 0, 2: 3, 3: 5, 4: 7, 5: 9 };
    const count = minCounts[stageId];
    const { stage, progress } = computeStageAndProgress(count);
    gardenAudio.playGrowthStageUpgrade();

    if (stageId === 5) {
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('bloom', {
            detail: { stage: 5, timestamp: Date.now() },
            bubbles: true,
          })
        );
      }, 200);
    }

    setState((prev) => ({
      ...prev,
      currentStage: stage,
      stageProgress: progress,
      interactionCount: count,
      lastMessage: `Garden advanced to Stage ${stageId}: ${GROWTH_STAGES[stageId].name}.`,
      hasInteracted: true,
    }));
  }, []);

  // KEYBOARD SHORTCUTS (W = Water, S = Sunlight, H = Hello, R = Restart, M = Sound Mute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'w') {
        handleWater();
      } else if (key === 's') {
        handleSunlight();
      } else if (key === 'h') {
        handleSayHello();
      } else if (key === 'r') {
        setIsRestartModalOpen(true);
      } else if (key === 'm') {
        handleToggleSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleWater, handleSunlight, handleSayHello, handleToggleSound]);

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden flex flex-col bg-[#0b1410] text-[#e8f0eb] select-none font-sans ${
        state.highContrast ? 'contrast-125' : ''
      }`}
    >
      {/* ATMOSPHERIC BOTANICAL BACKDROP */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src="/src/assets/images/sanctuary_botanical_backdrop_1791986242475.jpg"
          alt=""
          role="presentation"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-25 filter blur-xs scale-105 transition-opacity duration-1000"
        />
        {/* Dynamic Mood Scrim Overlay */}
        <div className={`absolute inset-0 transition-colors duration-1000 ${GARDEN_MOODS[state.mood].backdropOverlay}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1410] via-[#0b1410]/70 to-[#0b1410]/50" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0b1410]/40 to-[#0b1410]/95" />
      </div>

      {/* TOP NAVIGATION BAR */}
      {!state.isCalmMoment && (
        <TopNav
          state={state}
          onOpenNameModal={() => setIsNameModalOpen(true)}
          onOpenMemoryModal={() => setIsMemoryModalOpen(true)}
          onOpenReflectionModal={() => setIsReflectionModalOpen(true)}
          onOpenStageModal={() => setIsStageModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          onOpenRestartModal={() => setIsRestartModalOpen(true)}
          onStartPresentation={() => setState((prev) => ({ ...prev, isPresentationMode: true, presentationStep: 0 }))}
          onCaptureSnapshot={handleCaptureSnapshot}
        />
      )}

      {/* MAIN GARDEN INTERACTION VIEWPORT */}
      <main className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center z-10">
        {state.viewMode === '3d' ? (
          <Garden3DScene
            state={state}
            onLeafTouch={handleLeafTouch}
            onDiscovery={handleDiscovery}
            onContextLost={() => setState((prev) => ({ ...prev, viewMode: '2d' }))}
          />
        ) : (
          <Garden2DFallback
            state={state}
            onLeafTouch={handleLeafTouch}
            onDiscovery={handleDiscovery}
          />
        )}

        {/* OVERLAYS (Hidden during "A Moment of Calm") */}
        {!state.isCalmMoment && (
          <>
            {/* OVERLAY: GROWTH PROGRESS (Top Left) */}
            <div className="absolute top-4 left-4 z-20">
              <GrowthIndicator
                state={state}
                onOpenStageDetails={() => setIsStageModalOpen(true)}
                onRestart={() => setIsRestartModalOpen(true)}
              />
            </div>

            {/* OVERLAY: ENVIRONMENT MOOD SELECTOR (Top Right) */}
            <div className="absolute top-4 right-4 z-20">
              <GardenMoodBar
                currentMood={state.mood}
                onSelectMood={handleSelectMood}
              />
            </div>

            {/* OVERLAY: CONTEXTUAL MESSAGE (Center Bottom, above toolbar) */}
            <div className="absolute bottom-24 sm:bottom-28 z-20 pointer-events-none">
              <GardenMessage message={state.lastMessage} hasInteracted={state.hasInteracted} />
            </div>

            {/* OVERLAY: ACCESSIBLE LEAF COMPANION DRAWER (Bottom Left) */}
            <div className="absolute bottom-5 left-4 z-30">
              <InteractiveLeafList
                state={state}
                onLeafTouch={handleLeafTouch}
                isOpen={isLeafListOpen}
                onToggle={() => setIsLeafListOpen((prev) => !prev)}
              />
            </div>

            {/* OVERLAY: CARE ACTIONS TOOLBAR (Bottom Center) */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30">
              <CareActionBar
                state={state}
                onWater={handleWater}
                onSunlight={handleSunlight}
                onSayHello={handleSayHello}
              />
            </div>
          </>
        )}
      </main>

      {/* MOMENT OF CALM FULLSCREEN DIMMING */}
      <MomentOfCalmOverlay
        isActive={state.isCalmMoment}
        onExit={() => setState((prev) => ({ ...prev, isCalmMoment: false }))}
        gardenName={state.gardenName}
      />

      {/* PRESENTATION MODE WALKTHROUGH FOR JUDGES */}
      <PresentationModeGuide
        isOpen={state.isPresentationMode}
        onClose={() => setState((prev) => ({ ...prev, isPresentationMode: false }))}
        currentStep={state.presentationStep}
        onSetStep={(step) => setState((prev) => ({ ...prev, presentationStep: step }))}
        onLeafTouch={() => handleLeafTouch(1)}
        onWater={handleWater}
        onSunlight={handleSunlight}
        onSayHello={handleSayHello}
        onJumpStage={handleJumpStage}
        onSelectMood={handleSelectMood}
      />

      {/* ALL MODALS */}
      <PersonalGardenNameModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        currentName={state.gardenName}
        onSaveName={(name) => setState((prev) => ({ ...prev, gardenName: name }))}
      />

      <GardenMemoryModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        state={state}
      />

      <DailyReflectionCard
        isOpen={isReflectionModalOpen}
        onClose={() => setIsReflectionModalOpen(false)}
        onStartCalmMoment={() => setState((prev) => ({ ...prev, isCalmMoment: true }))}
      />

      <SettingsComfortModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        state={state}
        onToggleSound={handleToggleSound}
        onToggleAmbient={handleToggleAmbient}
        onToggleReducedMotion={() => setState((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion }))}
        onToggleHighContrast={() => setState((prev) => ({ ...prev, highContrast: !prev.highContrast }))}
        onToggleCameraView={handleToggleCameraView}
        onSelectMood={handleSelectMood}
        onResetGarden={() => setIsRestartModalOpen(true)}
      />

      <GrowthStageModal
        isOpen={isStageModalOpen}
        onClose={() => setIsStageModalOpen(false)}
        state={state}
        onJumpStage={handleJumpStage}
        onRestartJourney={() => setIsRestartModalOpen(true)}
      />

      <ProjectInfoModal
        isOpen={isProjectInfoOpen}
        onClose={() => setIsProjectInfoOpen(false)}
      />

      <CaptureNotificationModal
        isOpen={captureModalData.isOpen}
        onClose={() => setCaptureModalData({ isOpen: false })}
        dataUrl={captureModalData.dataUrl}
        gardenName={state.gardenName}
      />

      {/* RESTART GARDEN SANCTUARY CONFIRMATION MODAL */}
      <RestartConfirmModal
        isOpen={isRestartModalOpen}
        onClose={() => setIsRestartModalOpen(false)}
        onConfirmRestart={handleResetGarden}
        gardenName={state.gardenName}
        currentStage={state.currentStage}
      />
    </div>
  );
}
