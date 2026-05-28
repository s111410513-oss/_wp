let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", gain = 0.15) {
  const c = getCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export function playCorrect() {
  const c = getCtx();
  const now = c.currentTime;
  [523, 659, 784].forEach((f, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sine";
    osc.frequency.value = f;
    g.gain.setValueAtTime(0.15, now + i * 0.12);
    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.25);
    osc.connect(g).connect(c.destination);
    osc.start(now + i * 0.12);
    osc.stop(now + i * 0.12 + 0.25);
  });
}

export function playWrong() {
  playTone(180, 0.2, "square", 0.08);
}

export function playLevelUp() {
  const c = getCtx();
  const now = c.currentTime;
  [392, 523, 659, 784].forEach((f, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sine";
    osc.frequency.value = f;
    g.gain.setValueAtTime(0.15, now + i * 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
    osc.connect(g).connect(c.destination);
    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.3);
  });
}

export function playGameOver() {
  const c = getCtx();
  const now = c.currentTime;
  [440, 349, 262].forEach((f, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "triangle";
    osc.frequency.value = f;
    g.gain.setValueAtTime(0.12, now + i * 0.2);
    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.4);
    osc.connect(g).connect(c.destination);
    osc.start(now + i * 0.2);
    osc.stop(now + i * 0.2 + 0.4);
  });
}

export function playTimeout() {
  const c = getCtx();
  const now = c.currentTime;
  for (let i = 0; i < 4; i++) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "square";
    osc.frequency.value = 440;
    g.gain.setValueAtTime(0.1, now + i * 0.25);
    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.18);
    osc.connect(g).connect(c.destination);
    osc.start(now + i * 0.25);
    osc.stop(now + i * 0.25 + 0.18);
  }
}

export function playHint() {
  playTone(880, 0.15, "sine", 0.08);
}
