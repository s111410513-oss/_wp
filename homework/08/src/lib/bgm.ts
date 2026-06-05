let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let currentTimeout: ReturnType<typeof setTimeout> | null = null;
let isPlaying = false;
let currentVolume = 0.3;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

const CHORDS: number[][] = [
  [262, 330, 392],       // C major
  [196, 247, 294],       // G3
  [220, 262, 330],       // A minor
  [247, 294, 370],       // B dim-ish
  [262, 330, 392],       // C
  [294, 370, 440],       // Dm
  [330, 392, 494],       // Em
  [247, 294, 370],       // B
];

function scheduleLoop() {
  if (!isPlaying || !masterGain) return;
  const c = getCtx();
  const now = c.currentTime;
  const chordDuration = 2;
  const dest = masterGain;

  CHORDS.forEach((chord, i) => {
    const startTime = now + i * chordDuration;
    chord.forEach((freq) => {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, startTime);
      g.gain.linearRampToValueAtTime(currentVolume * 0.08, startTime + 0.1);
      g.gain.setValueAtTime(currentVolume * 0.08, startTime + chordDuration - 0.2);
      g.gain.linearRampToValueAtTime(0, startTime + chordDuration);
      osc.connect(g).connect(dest);
      osc.start(startTime);
      osc.stop(startTime + chordDuration);
    });
  });

  const loopDuration = CHORDS.length * chordDuration * 1000;
  currentTimeout = setTimeout(scheduleLoop, loopDuration);
}

export function startBgm() {
  if (isPlaying) return;
  isPlaying = true;
  const c = getCtx();
  masterGain = c.createGain();
  masterGain.gain.value = currentVolume;
  masterGain.connect(c.destination);
  scheduleLoop();
}

export function stopBgm() {
  isPlaying = false;
  if (currentTimeout) {
    clearTimeout(currentTimeout);
    currentTimeout = null;
  }
  if (masterGain) {
    masterGain.disconnect();
    masterGain = null;
  }
}

export function setBgmVolume(vol: number) {
  currentVolume = vol;
  if (masterGain) {
    masterGain.gain.setValueAtTime(vol, getCtx().currentTime);
  }
}

export function getBgmVolume(): number {
  return currentVolume;
}

export function isBgmPlaying(): boolean {
  return isPlaying;
}
