/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Procedural Audio Synthesizer for PlantVoice 2.0 using Web Audio API.
 * 100% client-side, zero external audio asset dependencies, guaranteed zero-latency.
 */

import { GardenMoodId } from '../types';

class GardenAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private isAmbienceRunning = false;
  private isMuted = false;
  private isAmbientMuted = false;
  private currentMood: GardenMoodId = 'morning';
  private rainInterval: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.7, this.ctx.currentTime, 0.05);
    }
  }

  public setAmbientEnabled(enabled: boolean) {
    this.isAmbientMuted = !enabled;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(this.isAmbientMuted || this.isMuted ? 0 : 0.04, this.ctx.currentTime, 0.1);
    }
    if (enabled && !this.isAmbienceRunning) {
      this.startGentleAmbience();
    }
  }

  public setMood(mood: GardenMoodId) {
    this.currentMood = mood;
    if (this.ambientFilter && this.ctx) {
      const freq = mood === 'rainy' ? 700 : mood === 'evening' ? 280 : mood === 'moonlit' ? 520 : 420;
      this.ambientFilter.frequency.setTargetAtTime(freq, this.ctx.currentTime, 1.2);
    }
  }

  /**
   * Water drops falling and soaking into soil: harmonic droplets with resonant decay.
   */
  public playWaterDroplets() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const notes = [
      { delay: 0.0, freq: 880, endFreq: 440, duration: 0.18, vol: 0.28 },
      { delay: 0.12, freq: 1175, endFreq: 587, duration: 0.22, vol: 0.32 },
      { delay: 0.26, freq: 740, endFreq: 370, duration: 0.2, vol: 0.22 },
      { delay: 0.45, freq: 1320, endFreq: 660, duration: 0.25, vol: 0.26 },
    ];

    notes.forEach((drop) => {
      if (!this.ctx || !this.masterGain) return;
      const t = now + drop.delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(drop.freq, t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(10, drop.endFreq), t + drop.duration);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(drop.vol, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + drop.duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + drop.duration);
    });
  }

  /**
   * Warm sunlight awakening: soothing harmonic chord (F-A-C-E) with smooth swell.
   */
  public playSunlightWarmth() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const freqs = [174.61, 261.63, 440.0, 659.25];

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const delay = idx * 0.06;
      const attack = 0.4;
      const decay = 2.2;
      const peak = 0.16 / freqs.length;

      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(peak, now + delay + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + attack + decay);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + delay);
      osc.stop(now + delay + attack + decay);
    });
  }

  /**
   * Say Hello: Gentle, welcoming crystal chime (pentatonic cascade).
   */
  public playSayHelloChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const pitches = [392.0, 493.88, 587.33, 783.99];

    pitches.forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      const t = now + i * 0.08;
      const duration = 1.6;

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + duration);
    });
  }

  /**
   * Leaf caress/touch: sweet woody chime pluck tone with variation support.
   */
  public playLeafTouch(leafId: number, variation: number = 0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const leafNotes = [293.66, 329.63, 392.0, 440.0, 493.88, 587.33, 659.25, 783.99, 880.0];
    const pitchOffset = (variation % 3) * 0.05;
    const baseFreq = (leafNotes[(leafId - 1) % leafNotes.length] || 440) * (1 + pitchOffset);

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(baseFreq * 2.01, now);

    const duration = 0.65;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    subOsc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration);
    subOsc.stop(now + duration);
  }

  /**
   * Discovery 1: Butterfly Flutter arpeggio.
   */
  public playButterflyFlutter() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const flutterPitches = [659.25, 783.99, 987.77, 1174.66, 1318.51];

    flutterPitches.forEach((pitch, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const t = now + i * 0.055;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  /**
   * Discovery 2: Deep ceramic singing pot resonance.
   */
  public playPotResonance() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const harmonic = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(146.83, now); // D3 fundamental earthen pitch
    osc.frequency.exponentialRampToValueAtTime(144.0, now + 1.8);

    harmonic.type = 'triangle';
    harmonic.frequency.setValueAtTime(293.66, now); // D4 octave resonance

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.32, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

    osc.connect(gain);
    harmonic.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    harmonic.start(now);
    osc.stop(now + 2.4);
    harmonic.stop(now + 2.4);
  }

  /**
   * Discovery 3: Starlight firefly sparkle ping.
   */
  public playStarlightSparkle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const sparkleNotes = [1046.5, 1318.51, 1567.98, 2093.0];

    sparkleNotes.forEach((f, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const t = now + i * 0.06;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.14, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.8);
    });
  }

  /**
   * Growth stage upgrade flourish: ascending garden bloom chord.
   */
  public playGrowthStageUpgrade() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const flourishNotes = [329.63, 392.0, 493.88, 587.33, 783.99, 987.77];

    flourishNotes.forEach((f, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const t = now + idx * 0.09;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.0);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 2.0);
    });
  }

  /**
   * Procedural background conservatory breeze whisper & rain patter.
   */
  public startGentleAmbience() {
    if (this.isAmbienceRunning || this.isMuted || this.isAmbientMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(420, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
      this.ambientGain = gain;
      this.ambientFilter = filter;
      this.isAmbienceRunning = true;
    } catch {
      // Audio autoplay policy catch
    }
  }

  /**
   * Garden restart and renewal chime: soft descending-then-resolving dew notes.
   */
  public playRestartRenewalChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const renewalNotes = [587.33, 523.25, 440.0, 392.0, 329.63, 261.63]; // D5, C5, A4, G4, E4, C4

    renewalNotes.forEach((f, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const t = now + idx * 0.08;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 1.6);
    });
  }
}

export const gardenAudio = new GardenAudioEngine();
