/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PlantVoice 2.0 — The Little Garden That Grows With You
 * Creator: Sathiyamoorthi Saravanan | DJXHack 2026 Everyday Magic
 */

export type GrowthStageId = 1 | 2 | 3 | 4 | 5;

export interface GrowthStage {
  id: GrowthStageId;
  name: string;
  subtitle: string;
  description: string;
  minInteractions: number;
  leafCount: number;
  hasBud: boolean;
  hasFlower: boolean;
  hasAura: boolean;
}

export type GardenMoodId = 'morning' | 'rainy' | 'evening' | 'moonlit';

export interface GardenMoodConfig {
  id: GardenMoodId;
  name: string;
  subtitle: string;
  description: string;
  skyColor: number; // Three.js hex
  ambientColor: number;
  sunColor: number;
  fogColor: number;
  sunIntensity: number;
  ambientIntensity: number;
  backdropOverlay: string; // Tailwind class
  accentColor: string;
}

export type CareActionType = 'water' | 'sunlight' | 'hello' | 'leaf-touch' | 'none';

export type DiscoveryId = 'butterfly' | 'pot-resonance' | 'starlight-wisp';

export interface DiscoveryItem {
  id: DiscoveryId;
  name: string;
  hint: string;
  story: string;
  icon: string;
}

export interface LeafData {
  id: number;
  name: string;
  stageAvailable: GrowthStageId;
  angle: number; // radians around stem
  height: number; // height along stem (0 to 1)
  size: number;
  tilt: number;
  description: string;
}

export type CameraViewMode = 'focus' | 'wide';

export interface GardenState {
  gardenName: string;
  interactionCount: number;
  waterCount: number;
  sunCount: number;
  helloCount: number;
  leafTouchCount: number;
  currentStage: GrowthStageId;
  stageProgress: number; // 0 to 100% within stage
  mood: GardenMoodId;
  cameraView: CameraViewMode;
  lastAction: CareActionType;
  lastMessage: string;
  isWatering: boolean;
  isSunlit: boolean;
  isSayingHello: boolean;
  touchedLeafId: number | null;
  leafTapCount: number;
  soundEnabled: boolean;
  ambientAudioEnabled: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  hasInteracted: boolean;
  viewMode: '3d' | '2d';
  discoveries: Record<DiscoveryId, boolean>;
  lastDiscovery: DiscoveryId | null;
  isPotTapped: boolean;
  isButterflyFlying: boolean;
  isWispTapped: boolean;
  isCalmMoment: boolean;
  isPresentationMode: boolean;
  presentationStep: number;
}

export const GROWTH_STAGES: Record<GrowthStageId, GrowthStage> = {
  1: {
    id: 1,
    name: 'First Hello',
    subtitle: 'A quiet beginning',
    description: 'The original plant rests in calm soil, breathing softly with its first tender leaves.',
    minInteractions: 0,
    leafCount: 4,
    hasBud: false,
    hasFlower: false,
    hasAura: false,
  },
  2: {
    id: 2,
    name: 'Little Moments',
    subtitle: 'Awakened by care',
    description: 'A delicate emerald glow emerges along the midribs as the plant feels your gentle presence.',
    minInteractions: 3,
    leafCount: 4,
    hasBud: false,
    hasFlower: false,
    hasAura: true,
  },
  3: {
    id: 3,
    name: 'New Beginnings',
    subtitle: 'Uncurling vibrant leaves',
    description: 'Nurtured by water and sunlight, vigorous new foliage uncurls along the upper stem.',
    minInteractions: 5,
    leafCount: 7,
    hasBud: false,
    hasFlower: false,
    hasAura: true,
  },
  4: {
    id: 4,
    name: 'A Bud of Wonder',
    subtitle: 'The whisper of bloom',
    description: 'At the crown, a small decorative bud emerges within protective green sepals.',
    minInteractions: 7,
    leafCount: 8,
    hasBud: true,
    hasFlower: false,
    hasAura: true,
  },
  5: {
    id: 5,
    name: 'In Full Bloom',
    subtitle: 'A sanctuary in blossom',
    description: 'Every act of attention blossoms into radiant petals and a golden glowing core.',
    minInteractions: 9,
    leafCount: 9,
    hasBud: false,
    hasFlower: true,
    hasAura: true,
  },
};

export const GARDEN_MOODS: Record<GardenMoodId, GardenMoodConfig> = {
  morning: {
    id: 'morning',
    name: 'Morning Calm',
    subtitle: 'Soft golden daylight and drifting dew pollen',
    description: 'Gentle golden light filters through morning mist, illuminating the fresh leaves.',
    skyColor: 0x14281f,
    ambientColor: 0x365442,
    sunColor: 0xfff0cc,
    fogColor: 0x0f2018,
    sunIntensity: 2.3,
    ambientIntensity: 1.4,
    backdropOverlay: 'bg-emerald-950/40 mix-blend-multiply',
    accentColor: '#e2ba64',
  },
  rainy: {
    id: 'rainy',
    name: 'Rainy Day',
    subtitle: 'Cool mist, falling raindrops, and peaceful ripples',
    description: 'Cool atmospheric clouds and delicate rain bring quenching moisture to the garden.',
    skyColor: 0x0f1c24,
    ambientColor: 0x223c4a,
    sunColor: 0xa8d5e5,
    fogColor: 0x0a141b,
    sunIntensity: 1.4,
    ambientIntensity: 1.1,
    backdropOverlay: 'bg-slate-900/60 mix-blend-multiply',
    accentColor: '#38bdf8',
  },
  evening: {
    id: 'evening',
    name: 'Golden Evening',
    subtitle: 'Amber sunset glow and slow contemplative warmth',
    description: 'Warm terracotta twilight casts long, gentle shadows as the day slowly settles.',
    skyColor: 0x24160e,
    ambientColor: 0x4d2e1b,
    sunColor: 0xffaa5e,
    fogColor: 0x190e09,
    sunIntensity: 2.6,
    ambientIntensity: 1.3,
    backdropOverlay: 'bg-amber-950/50 mix-blend-multiply',
    accentColor: '#f97316',
  },
  moonlit: {
    id: 'moonlit',
    name: 'Moonlit Garden',
    subtitle: 'Midnight indigo sky, cool stars, and silver highlights',
    description: 'A deep celestial night where leaves gleam with soft silver and luminescent fireflies dance.',
    skyColor: 0x070c18,
    ambientColor: 0x152238,
    sunColor: 0xc4daf8,
    fogColor: 0x050912,
    sunIntensity: 1.8,
    ambientIntensity: 0.9,
    backdropOverlay: 'bg-indigo-950/65 mix-blend-multiply',
    accentColor: '#818cf8',
  },
};

export const INITIAL_LEAVES: LeafData[] = [
  { id: 1, name: 'Morning Crest', stageAvailable: 1, angle: 0.2, height: 0.35, size: 1.0, tilt: 0.45, description: 'Catches the earliest daylight on the eastern side.' },
  { id: 2, name: 'Sunlight Reacher', stageAvailable: 1, angle: 2.1, height: 0.52, size: 1.15, tilt: 0.38, description: 'Stretches broad green ribs toward warm rays.' },
  { id: 3, name: 'Quiet Sprout', stageAvailable: 1, angle: 4.2, height: 0.42, size: 0.95, tilt: 0.5, description: 'Rests gently above the rich dark soil.' },
  { id: 4, name: 'Tender Apex', stageAvailable: 1, angle: 5.6, height: 0.68, size: 0.85, tilt: 0.3, description: 'Perched near the tip, trembling in the air.' },
  { id: 5, name: 'Dew Cradle', stageAvailable: 3, angle: 1.1, height: 0.6, size: 1.1, tilt: 0.4, description: 'Uncurled during gentle care, broad and deep.' },
  { id: 6, name: 'Verdant Wing', stageAvailable: 3, angle: 3.4, height: 0.72, size: 1.05, tilt: 0.35, description: 'Vibrant emerald leaf showing strong growth vigor.' },
  { id: 7, name: 'Canopy Whisper', stageAvailable: 3, angle: 4.9, height: 0.8, size: 0.9, tilt: 0.28, description: 'Rustles softly with every passing whisper.' },
  { id: 8, name: 'Crown Sprout', stageAvailable: 4, angle: 2.8, height: 0.88, size: 0.75, tilt: 0.25, description: 'Fresh growth cradling the emerging flower bud.' },
  { id: 9, name: 'Blossom Leaf', stageAvailable: 5, angle: 0.7, height: 0.92, size: 0.7, tilt: 0.22, description: 'Delicate bract protecting the blooming petals.' },
];

export const DISCOVERY_DEFINITIONS: Record<DiscoveryId, DiscoveryItem> = {
  butterfly: {
    id: 'butterfly',
    name: 'Visiting Swallowtail',
    hint: 'Look for fluttering wings near the garden foliage',
    story: 'A radiant emerald swallowtail rests on the outer leaves, lifting off in an elegant spiral when gently greeted.',
    icon: 'Sparkle',
  },
  'pot-resonance': {
    id: 'pot-resonance',
    name: 'Earthen Pot Resonance',
    hint: 'Gently tap the ceramic pot base',
    story: 'The terracotta glaze hums with a deep acoustic chime, awakening glowing moss ripples across the base.',
    icon: 'Music',
  },
  'starlight-wisp': {
    id: 'starlight-wisp',
    name: 'Starlight Firefly Wisp',
    hint: 'Seek the curious floating golden particle above the crown',
    story: 'A drifting starlight wisp twinkles curiously near the plant crown, bursting into constellation sparkles when caught.',
    icon: 'Sun',
  },
};

export const AUTHORED_REFLECTIONS = [
  'Small moments can make a difference.',
  'Take a breath and enjoy this quiet moment.',
  'Growth can begin with a little attention.',
  'Like a garden, peace expands where your focus rests.',
  'Quiet acts of care echo far beyond the moment.',
  'Notice the subtle beauty that was always right here.',
  'Patience is the softest form of love.',
  'A single drop quenches roots unseen.',
];

export const AUTHORED_LEAF_MESSAGES = [
  'A gentle touch ripples through the chlorophyll.',
  'The leaf tilts into your palm with quiet joy.',
  'A subtle golden warmth traces the vein.',
  'The foliage answers with a tender rustle.',
  'A quiet connection between hand and leaf.',
];
