let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let sfxEnabled = true;
let sfxVolume = 0.3;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function ensureMaster(): GainNode {
  const c = getCtx();
  if (!masterGain) {
    masterGain = c.createGain();
    masterGain.gain.value = sfxEnabled ? sfxVolume : 0;
    masterGain.connect(c.destination);
  }
  return masterGain;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", gain = 0.15) {
  if (!sfxEnabled && !masterGain) return;
  const c = getCtx();
  const dest = ensureMaster();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(g).connect(dest);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export function playCorrect() {
  if (!sfxEnabled) return;
  const c = getCtx();
  const dest = ensureMaster();
  const now = c.currentTime;
  [523, 659, 784].forEach((f, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sine";
    osc.frequency.value = f;
    g.gain.setValueAtTime(0.15, now + i * 0.12);
    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.25);
    osc.connect(g).connect(dest);
    osc.start(now + i * 0.12);
    osc.stop(now + i * 0.12 + 0.25);
  });
}

export function playWrong() {
  if (!sfxEnabled) return;
  playTone(180, 0.2, "square", 0.08);
}

export function playLevelUp() {
  if (!sfxEnabled) return;
  const c = getCtx();
  const dest = ensureMaster();
  const now = c.currentTime;
  [392, 523, 659, 784].forEach((f, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sine";
    osc.frequency.value = f;
    g.gain.setValueAtTime(0.15, now + i * 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
    osc.connect(g).connect(dest);
    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.3);
  });
}

export function playGameOver() {
  if (!sfxEnabled) return;
  const c = getCtx();
  const dest = ensureMaster();
  const now = c.currentTime;
  [440, 349, 262].forEach((f, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "triangle";
    osc.frequency.value = f;
    g.gain.setValueAtTime(0.12, now + i * 0.2);
    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.4);
    osc.connect(g).connect(dest);
    osc.start(now + i * 0.2);
    osc.stop(now + i * 0.2 + 0.4);
  });
}

export function playTimeout() {
  if (!sfxEnabled) return;
  const c = getCtx();
  const dest = ensureMaster();
  const now = c.currentTime;
  for (let i = 0; i < 4; i++) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "square";
    osc.frequency.value = 440;
    g.gain.setValueAtTime(0.1, now + i * 0.25);
    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.18);
    osc.connect(g).connect(dest);
    osc.start(now + i * 0.25);
    osc.stop(now + i * 0.25 + 0.18);
  }
}

export function playHint() {
  if (!sfxEnabled) return;
  playTone(880, 0.15, "sine", 0.08);
}

export function setSfxEnabled(enabled: boolean) {
  sfxEnabled = enabled;
  if (masterGain) {
    masterGain.gain.setValueAtTime(enabled ? sfxVolume : 0, getCtx().currentTime);
  }
}

export function setSfxVolume(vol: number) {
  sfxVolume = vol;
  if (masterGain && sfxEnabled) {
    masterGain.gain.setValueAtTime(vol, getCtx().currentTime);
  }
}

export function isSfxEnabled(): boolean {
  return sfxEnabled;
}

export function getSfxVolume(): number {
  return sfxVolume;
}
