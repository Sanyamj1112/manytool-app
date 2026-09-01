/**
 * @file soundUtils.js
 * @description Generates futuristic sci-fi mechanical click sounds using Web Audio API and triggers haptic feedback.
 */

// Web Audio API context singleton
let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playClickSound = (enabled = true) => {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Create oscillator for a high-tech subtle mechanical tick
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);

    // Trigger subtle haptic vibration if supported (Android / Mobile)
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  } catch (e) {
    // Audio context not allowed to start without user gesture yet
  }
};