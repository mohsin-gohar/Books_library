/**
 * Athenaeum Monastic Soundscapes Synthesizer
 * Uses Web Audio API for pure procedural ambient acoustics (Rain, Library Hum, Hearth Fireplace).
 * Zero external audio files or network requests required.
 */

export type SoundscapeType = 'none' | 'library' | 'rain' | 'fireplace';

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private currentMode: SoundscapeType = 'none';
  private nodes: AudioNode[] = [];
  private gainNode: GainNode | null = null;
  private isRunning = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundscape(mode: SoundscapeType, volume = 0.15) {
    this.stop();
    this.currentMode = mode;

    if (mode === 'none') return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(volume, this.ctx.currentTime);
      masterGain.connect(this.ctx.destination);
      this.gainNode = masterGain;

      if (mode === 'library') {
        this.startLibraryHum(masterGain);
      } else if (mode === 'rain') {
        this.startGentleRain(masterGain);
      } else if (mode === 'fireplace') {
        this.startFireplaceCrackle(masterGain);
      }

      this.isRunning = true;
    } catch (err) {
      console.warn('Soundscape synthesizer notice:', err);
    }
  }

  public setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime, 0.05);
    }
  }

  private startLibraryHum(destination: AudioNode) {
    if (!this.ctx) return;
    // Brown noise buffer for warm ambient room presence
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain compensation
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Gentle low-pass filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(destination);
    whiteNoise.start();

    this.nodes.push(whiteNoise, filter);
  }

  private startGentleRain(destination: AudioNode) {
    if (!this.ctx) return;
    // Pink noise filtered into gentle raindrops against window
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(850, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    rainSource.connect(filter);
    filter.connect(destination);
    rainSource.start();

    this.nodes.push(rainSource, filter);
  }

  private startFireplaceCrackle(destination: AudioNode) {
    if (!this.ctx) return;
    // Warm low roar
    this.startLibraryHum(destination);

    // Subtle random crackle clicks
    const crackleGain = this.ctx.createGain();
    crackleGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    crackleGain.connect(destination);

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.015);
    const clickBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = clickBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const interval = window.setInterval(() => {
      if (!this.ctx || !this.isRunning) return;
      if (Math.random() > 0.4) {
        const clickNode = this.ctx.createBufferSource();
        clickNode.buffer = clickBuffer;
        const clickFilter = this.ctx.createBiquadFilter();
        clickFilter.type = 'bandpass';
        clickFilter.frequency.setValueAtTime(1200 + Math.random() * 800, this.ctx.currentTime);
        clickNode.connect(clickFilter);
        clickFilter.connect(crackleGain);
        clickNode.start();
      }
    }, 180);

    // Store interval cleanup
    this.nodes.push({
      disconnect: () => clearInterval(interval)
    } as unknown as AudioNode);
  }

  public stop() {
    this.isRunning = false;
    this.nodes.forEach((n) => {
      try {
        if ('stop' in n && typeof (n as AudioScheduledSourceNode).stop === 'function') {
          (n as AudioScheduledSourceNode).stop();
        }
        n.disconnect();
      } catch {
        // ignore
      }
    });
    this.nodes = [];
    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {
        // ignore
      }
      this.gainNode = null;
    }
    this.currentMode = 'none';
  }

  public getMode(): SoundscapeType {
    return this.currentMode;
  }
}

export const soundscapes = new SoundscapeEngine();
