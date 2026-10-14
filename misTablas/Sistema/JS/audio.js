/* ==========================================================================
   AUDIO.JS - Sintetizador Web Audio API para Efectos de Sonido
   Genera sonidos alegres y dinámicos para niños sin depender de archivos MP3
   ========================================================================== */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.muted = localStorage.getItem('misTablas_muted') === 'true';
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('misTablas_muted', this.muted);
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  play(type = 'click') {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      switch (type) {
        case 'click': {
          // Sonido pop arcade al presionar un botón
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        case 'correct': {
          // Doble campanilla alegre de acierto (Arpegio ascendente)
          [523.25, 659.25, 783.99].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.09);
            gain.gain.setValueAtTime(0.2, now + idx * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.09);
            osc.stop(now + idx * 0.09 + 0.25);
          });
          break;
        }

        case 'wrong': {
          // Sonido cómico y suave "boing" (no punitivo)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.22);
          break;
        }

        case 'star': {
          // Campanita mágica de estrella
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(1320, now + 0.15);
          gain.gain.setValueAtTime(0.22, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }

        case 'bubble': {
          // Pop acuático
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(350, now);
          osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.1);
          break;
        }

        case 'fanfare': {
          // Fanfarria triunfal de victoria
          const notes = [440, 554.37, 659.25, 880];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            const noteStart = now + idx * 0.12;
            osc.frequency.setValueAtTime(freq, noteStart);
            gain.gain.setValueAtTime(0.25, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(noteStart);
            osc.stop(noteStart + 0.35);
          });
          break;
        }
      }
    } catch (e) {
      console.warn("Audio Context aún no iniciado por gesto de usuario", e);
    }
  }
}

// Instancia global del sistema de sonido
const sound = new SoundEngine();

// Auto-conectar sonido arcade y animación de clic a todos los botones de la página
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, .btn, .btn-table, .nav-tab-btn, .simce-nav-btn, .simce-option-btn');
    if (btn) {
      sound.play('click');
    }
  });
});
