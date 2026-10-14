/* ==========================================================================
   STORAGE.JS - Gestor de Datos, Progreso, Puntos y Logros
   Almacenamiento permanente en localStorage para el estudiante
   ========================================================================== */

const STORAGE_KEY = 'misTablas_student';

const DEFAULT_STUDENT = {
  name: "Estudiante",
  avatar: "avatar1.svg",
  avatarName: "Mateo el Astronauta",
  score: 0,
  stars: 0,
  tablesProgress: {
    2: { stars: 0, completed: false, attempts: 0 },
    3: { stars: 0, completed: false, attempts: 0 },
    4: { stars: 0, completed: false, attempts: 0 },
    5: { stars: 0, completed: false, attempts: 0 },
    6: { stars: 0, completed: false, attempts: 0 },
    7: { stars: 0, completed: false, attempts: 0 },
    8: { stars: 0, completed: false, attempts: 0 },
    9: { stars: 0, completed: false, attempts: 0 },
    10: { stars: 0, completed: false, attempts: 0 }
  },
  achievements: [
    { id: "login", title: "¡Bienvenido a Bordo!", desc: "Creaste tu avatar y entraste a la plataforma", icon: "🚀", unlocked: true },
    { id: "first_table", title: "Primera Tabla", desc: "Completaste la práctica de tu primera tabla", icon: "⭐", unlocked: false },
    { id: "table_5", title: "Maestro del 5", desc: "Dominaste la tabla del 5", icon: "⏱️", unlocked: false },
    { id: "memory_master", title: "Mente Brillante", desc: "Ganaste una partida de Memoria Matemática", icon: "🧠", unlocked: false },
    { id: "speedster", title: "Rayo Veloz", desc: "Completaste el Desafío contra el Tiempo", icon: "⚡", unlocked: false },
    { id: "builder", title: "Gran Constructor", desc: "Agrupaste objetos en Construye la Multiplicación", icon: "🍎", unlocked: false },
    { id: "simce_ready", title: "Héroe SIMCE", desc: "Rendiste el ensayo matemático tipo SIMCE", icon: "📝", unlocked: false },
    { id: "math_legend", title: "Leyenda Matemática", desc: "Acumulaste 100 puntos en la plataforma", icon: "👑", unlocked: false }
  ],
  simceHistory: []
};

class StudentStorage {
  static get() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return DEFAULT_STUDENT;
      const parsed = JSON.parse(data);
      // Fusionar con defaults para evitar errores de claves faltantes
      return { ...DEFAULT_STUDENT, ...parsed };
    } catch (e) {
      console.error("Error al leer storage", e);
      return DEFAULT_STUDENT;
    }
  }

  static save(student) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(student));
    } catch (e) {
      console.error("Error al guardar storage", e);
    }
  }

  static addPoints(points) {
    const s = this.get();
    s.score = Math.max(0, (s.score || 0) + points);
    if (s.score >= 100) {
      this.unlockAchievement('math_legend', s);
    }
    this.save(s);
    return s.score;
  }

  static addStars(stars) {
    const s = this.get();
    s.stars = Math.max(0, (s.stars || 0) + stars);
    this.save(s);
    return s.stars;
  }

  static setTableProgress(tableNum, starsEarned) {
    const s = this.get();
    if (!s.tablesProgress[tableNum]) {
      s.tablesProgress[tableNum] = { stars: 0, completed: false, attempts: 0 };
    }
    const t = s.tablesProgress[tableNum];
    t.attempts = (t.attempts || 0) + 1;
    t.stars = Math.max(t.stars || 0, starsEarned);
    t.completed = t.stars >= 2;

    this.unlockAchievement('first_table', s);
    if (tableNum === 5 && t.completed) {
      this.unlockAchievement('table_5', s);
    }

    this.save(s);
    return t;
  }

  static unlockAchievement(id, currentStudent = null) {
    const s = currentStudent || this.get();
    const ach = s.achievements.find(a => a.id === id);
    if (ach && !ach.unlocked) {
      ach.unlocked = true;
      if (!currentStudent) this.save(s);
      // Notificación visual y sonido si está cargado
      if (typeof sound !== 'undefined') sound.play('fanfare');
      if (typeof confetti !== 'undefined') confetti.launch(50);
      return true;
    }
    return false;
  }

  static getCompletedTablesCount() {
    const s = this.get();
    let count = 0;
    for (let t = 2; t <= 10; t++) {
      if (s.tablesProgress[t] && s.tablesProgress[t].completed) {
        count++;
      }
    }
    return count;
  }

  static getRankTitle(score) {
    if (score >= 250) return "Supercampeón SIMCE 🏆";
    if (score >= 150) return "Mago de las Multiplicaciones 🧙";
    if (score >= 80) return "Capitán Matemático 🎖️";
    if (score >= 35) return "Explorador del Cálculo 🧭";
    return "Cadete de las Tablas 🚀";
  }

  static saveSimceAttempt(score, total, answersDetail) {
    const s = this.get();
    s.simceHistory = s.simceHistory || [];
    s.simceHistory.push({
      date: new Date().toLocaleDateString('es-CL'),
      score: score,
      total: total,
      percentage: Math.round((score / total) * 100),
      answers: answersDetail
    });
    this.unlockAchievement('simce_ready', s);
    this.addPoints(score * 5);
    this.addStars(Math.ceil((score / total) * 3));
    this.save(s);
  }

  static resetProgress() {
    const s = this.get();
    const reset = {
      ...DEFAULT_STUDENT,
      name: s.name,
      avatar: s.avatar,
      avatarName: s.avatarName
    };
    this.save(reset);
    return reset;
  }
}
