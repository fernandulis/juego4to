/* ==========================================================================
   CONFETTI.JS - Motor de Confeti y Partículas de Celebración
   Animaciones visuales de fiesta en Canvas HTML5 nativo
   ========================================================================== */

class ConfettiLauncher {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
    this.colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#FEF08A'];
  }

  init() {
    this.canvas = document.getElementById('confettiCanvas');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'confettiCanvas';
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  launch(count = 80) {
    if (!this.canvas) this.init();
    if (!this.ctx) return;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: -10,
        size: Math.random() * 9 + 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        speedY: Math.random() * 4 + 3,
        speedX: (Math.random() - 0.5) * 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    if (!this.animationId) {
      this.render();
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    // Filtrar partículas que salieron de la pantalla
    this.particles = this.particles.filter(p => p.y < this.canvas.height + 20);

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.render());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animationId = null;
    }
  }
}

const confetti = new ConfettiLauncher();
