# PlantVoice 2.0 — The Little Garden That Grows With You

> **“Touch a leaf, offer a little care, and watch your digital garden answer.”**

- **Creator:** Sathiyamoorthi Saravanan
- **Challenge:** DJXHack 2026 — Everyday Magic
- **Product Type:** Interactive Browser-Based Digital Garden
- **Primary Objective:** Transform the familiar ritual of caring for a plant into an emotionally engaging interactive experience where every human action produces a visible, living botanical response.

---

## 1. Overview & Concept

**PlantVoice 2.0** is an expanded contemplative digital sanctuary designed to evoke wonder, calm, and connection. Rather than presenting a cold dashboard or speculative sensor monitor, PlantVoice treats digital foliage as an interactive living artwork.

When you touch a leaf, it bends and resonates with an organic chime. When you water the plant, droplets soak into the dark soil and ripples spread beneath the roots. When you introduce sunlight, golden warmth illuminates the canopy and golden motes drift skyward. With continuous care, the plant progresses through five symbolic growth stages, eventually opening a delicate blossom at its crown.

---

## 2. Technology Stack

- **Framework:** React 19 with Vite & TypeScript
- **Styling:** Tailwind CSS v4 with custom organic color palette and keyframe animations
- **3D Graphics:** Three.js WebGL (physically based materials, ceramic glazed pot, organic curved stem, raycast-interactive leaves, procedural particle systems)
- **2D Resilient Canvas:** Custom SVG botanical canvas ensuring 100% accessible rendering even if WebGL is unavailable or when reduced motion is preferred
- **Icons:** Lucide React
- **Audio:** Web Audio API (100% client-side procedural synthesis — zero external broken audio assets, zero latency)

---

## 3. Advanced Features in PlantVoice 2.0

### A. Four Garden Moods
Select between four visually distinct environmental atmospheres via the top-right mood selector:
- **Morning Calm:** Warm golden daylight, fresh dew tones, and drifting pollen.
- **Rainy Day:** Animated continuous raindrops, soft water ripples across the soil, cool slate-cyan lighting, and peaceful rain patter.
- **Golden Evening:** Amber sunset warmth, rich terracotta shadows, and contemplative slower atmospheric movement.
- **Moonlit Garden:** Midnight indigo atmosphere, subtle starry sky, celestial highlights, and firefly bioluminescence.

### B. Five Symbolic Growth Stages
1. **Stage 1 — First Hello (0–2 cares):** Original calm starter plant resting in rich soil.
2. **Stage 2 — Little Moments (3–4 cares):** A delicate emerald aura glow awakens along the veins in response to your presence.
3. **Stage 3 — New Beginnings (5–6 cares):** Vigorous new foliage uncurls along the upper stem.
4. **Stage 4 — A Bud of Wonder (7–8 cares):** A decorative flower bud emerges at the crown nestled within protective green sepals.
5. **Stage 5 — In Full Bloom (9+ cares):** Radiant blossom petals unfold around an illuminated golden core.

### C. Three Hidden Discoveries
- **Discovery 1: Visiting Swallowtail:** An emerald swallowtail resting near the foliage. Tapping it triggers an elegant spiral flight loop and crystalline arpeggio.
- **Discovery 2: Earthen Pot Resonance:** Tapping the ceramic pot base awakens a deep acoustic singing bowl chime (~146 Hz) and expanding glowing moss ripples.
- **Discovery 3: Starlight Firefly Wisp:** A curious glowing wisp hovering above the crown that bursts into constellation sparkles when caught.

### D. Touch-Reactive Personality
- Successive taps on leaves trigger varied animation styles (gentle bend, dynamic flutter, lateral shimmer).
- Paired with an authored collection of warm, non-judgmental reflective responses.

### E. Personal Garden Name
- Name your garden sanctuary (e.g. *Sathiya's Sanctuary*, *Whispering Fern*).
- Stored safely in browser `localStorage` with a quick default reset option.

### F. My Garden Memory
- A quiet session activity panel displaying total care actions, breakdown by ritual (Water, Sunlight, Hellos, Leaf Touches), active mood, growth stage, and discovered hidden secrets.

### G. Gentle Daily Reflection & "A Moment of Calm"
- Authored daily reflections that inspire calm without fake AI advice.
- **“A Moment of Calm”**: Dims all interface controls, toolbars, and buttons, softening the view into a pure, undisturbed living artwork. Tapping anywhere restores the controls.

### H. Garden Photo Moment ("Capture My Garden")
- Captures a high-resolution snapshot directly from the WebGL/SVG canvas.
- Overlays an elegant minimal botanical watermark with your Garden Name, Growth Stage, and Mood.
- Downloads a clean PNG directly to your device.

### I. Presentation Mode for Hackathon Judges ("Show the Magic")
- A built-in 60–90 second interactive walkthrough guided tour.
- Step-by-step sequence demonstrating the untouched garden, leaf touch, water ripples, sunlight warmth, hello pulse, bud development, and full bloom.
- Reviewers remain in full interactive control at every step.

---

## 4. Development & Build Commands

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Type check & lint
npm run lint

# Build production bundle
npm run build
```

---

## 5. Honesty, Transparency & Limitations

- **No Fake Sensors:** Responses are designed as interactive digital art; they do not measure physical room moisture or ambient lumens.
- **No Fake AI Claims:** Reflections and messages are curated author collections; no external AI API or LLM calls are used.
- **No Fake Speech Recognition:** "Say Hello" sends an intentional tactile greeting without requiring microphone permissions.
- **100% Procedural Audio:** All sounds are synthesized client-side via the Web Audio API without downloading external audio files.
- **Resilience:** Automatic or manual fallback to the 2D Botanical Canvas if WebGL is unavailable.
