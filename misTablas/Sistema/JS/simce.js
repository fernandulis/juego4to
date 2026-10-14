/* ==========================================================================
   SIMCE.JS - Módulo de Ensayo Matemático Tipo SIMCE (4° Básico)
   Navegador lateral de 10 preguntas, situaciones contextualizadas reales,
   hoja de respuestas, retroalimentación formativa y cálculo de logro
   ========================================================================== */

const SIMCE_QUESTIONS = [
  {
    id: 1,
    title: "Situación 1: La kermesse escolar y los globos",
    context: "Para adornar la sala de 4° básico durante la fiesta de la kermesse escolar, la directiva del curso compró 4 bolsas de globos de colores. Si cada bolsa contiene exactamente 8 globos:",
    visualIcon: "🎈",
    visualText: "4 bolsas con 8 globos cada una",
    prompt: "¿Cuántos globos tienen en total para adornar la sala?",
    options: [
      { text: "24 globos", isCorrect: false },
      { text: "28 globos", isCorrect: false },
      { text: "32 globos", isCorrect: true },
      { text: "36 globos", isCorrect: false }
    ],
    explanation: "Multiplicamos la cantidad de bolsas por los globos de cada una: 4 bolsas × 8 globos = 32 globos en total."
  },
  {
    id: 2,
    title: "Situación 2: Sillas del salón de actos",
    context: "En el salón de actos del colegio se organizaron las sillas para el acto cívico. Se formaron 7 filas y en cada fila se ubicaron 9 sillas:",
    visualIcon: "🪑",
    visualText: "7 filas × 9 sillas en cada fila",
    prompt: "¿Cuántos estudiantes podrán sentarse en total?",
    options: [
      { text: "56 sillas", isCorrect: false },
      { text: "63 sillas", isCorrect: true },
      { text: "70 sillas", isCorrect: false },
      { text: "72 sillas", isCorrect: false }
    ],
    explanation: "En un arreglo rectangular multiplicamos filas por columnas: 7 filas × 9 sillas = 63 sillas en total."
  },
  {
    id: 3,
    title: "Situación 3: Materiales en la clase de Arte",
    context: "El profesor de Artes Plásticas repartió materiales para pintar. Entregó 6 cajas completas de lápices de colores. Cada caja contiene 10 lápices:",
    visualIcon: "✏️",
    visualText: "6 cajas con 10 lápices cada una",
    prompt: "¿Cuántos lápices de colores repartió en total el profesor?",
    options: [
      { text: "16 lápices", isCorrect: false },
      { text: "50 lápices", isCorrect: false },
      { text: "60 lápices", isCorrect: true },
      { text: "66 lápices", isCorrect: false }
    ],
    explanation: "Multiplicamos las 6 cajas por los 10 lápices de cada caja: 6 × 10 = 60 lápices (regla del cero)."
  },
  {
    id: 4,
    title: "Situación 4: Compras en la panadería del barrio",
    context: "Matías fue a la panadería a comprar ricas empanadas para el almuerzo familiar del domingo. Compró 5 empanadas y cada una cuesta $800 pesos:",
    visualIcon: "🥟",
    visualText: "5 empanadas a $800 pesos cada una",
    prompt: "¿Cuánto dinero pagó Matías en total por su compra?",
    options: [
      { text: "$3.500 pesos", isCorrect: false },
      { text: "$4.000 pesos", isCorrect: true },
      { text: "$4.500 pesos", isCorrect: false },
      { text: "$4.800 pesos", isCorrect: false }
    ],
    explanation: "Multiplicamos 5 empanadas × 800 pesos. Si 5 × 8 = 40, entonces 5 × 800 = $4.000 pesos."
  },
  {
    id: 5,
    title: "Situación 5: Colación saludable de galletas de avena",
    context: "Don Carlos horneó bandejas de galletas de avena para el recreo saludable. Llenó 8 bandejas iguales y en cada bandeja colocó 6 galletas:",
    visualIcon: "🍪",
    visualText: "8 bandejas con 6 galletas cada una",
    prompt: "¿Cuántas galletas de avena horneó Don Carlos en total?",
    options: [
      { text: "42 galletas", isCorrect: false },
      { text: "46 galletas", isCorrect: false },
      { text: "48 galletas", isCorrect: true },
      { text: "54 galletas", isCorrect: false }
    ],
    explanation: "Son 8 grupos de 6 galletas: 8 × 6 = 48 galletas horneadas."
  },
  {
    id: 6,
    title: "Situación 6: El álbum de figuras coleccionables",
    context: "Florencia está completando su álbum de fútbol. Su abuelo le regaló 9 sobres nuevos de láminas. Si cada sobre contiene 4 láminas:",
    visualIcon: "⚽",
    visualText: "9 sobres con 4 láminas cada uno",
    prompt: "¿Cuántas láminas nuevas tiene Florencia para pegar en su álbum?",
    options: [
      { text: "32 láminas", isCorrect: false },
      { text: "36 láminas", isCorrect: true },
      { text: "40 láminas", isCorrect: false },
      { text: "45 láminas", isCorrect: false }
    ],
    explanation: "Multiplicamos 9 sobres por 4 láminas de cada sobre: 9 × 4 = 36 láminas."
  },
  {
    id: 7,
    title: "Situación 7: Libros en la biblioteca escolar",
    context: "En la biblioteca del colegio ordenaron los libros de cuentos infantiles en 6 repisas. En cada repisa pusieron exactamente 7 libros:",
    visualIcon: "📚",
    visualText: "6 repisas con 7 libros cada una",
    prompt: "¿Cuántos libros de cuentos quedaron ordenados en total?",
    options: [
      { text: "36 libros", isCorrect: false },
      { text: "40 libros", isCorrect: false },
      { text: "42 libros", isCorrect: true },
      { text: "49 libros", isCorrect: false }
    ],
    explanation: "6 repisas por 7 libros cada una: 6 × 7 = 42 libros ordenados."
  },
  {
    id: 8,
    title: "Situación 8: Huerto escolar y plantas de lechuga",
    context: "Los estudiantes de 4° básico sembraron hortalizas en el huerto. Prepararon 4 hileras de tierra y en cada hilera plantaron 7 lechugas:",
    visualIcon: "🥬",
    visualText: "4 hileras con 7 lechugas en cada hilera",
    prompt: "¿Cuántas lechugas plantaron en total en el huerto?",
    options: [
      { text: "21 lechugas", isCorrect: false },
      { text: "24 lechugas", isCorrect: false },
      { text: "28 lechugas", isCorrect: true },
      { text: "32 lechugas", isCorrect: false }
    ],
    explanation: "Son 4 grupos de 7 lechugas: 4 × 7 = 28 lechugas sembradas."
  },
  {
    id: 9,
    title: "Situación 9: Jugos para el paseo de curso",
    context: "Para la hidratación durante el paseo de fin de año, el Centro de Padres compró 7 paquetes de jugos de frutas. Cada paquete contiene 5 cajitas de jugo:",
    visualIcon: "🧃",
    visualText: "7 paquetes con 5 cajitas de jugo cada uno",
    prompt: "¿Cuántas cajitas de jugo hay en total para los estudiantes?",
    options: [
      { text: "30 jugos", isCorrect: false },
      { text: "35 jugos", isCorrect: true },
      { text: "40 jugos", isCorrect: false },
      { text: "42 jugos", isCorrect: false }
    ],
    explanation: "Multiplicamos 7 paquetes × 5 cajitas: 7 × 5 = 35 jugos en total."
  },
  {
    id: 10,
    title: "Situación 10: Torneo de videojuegos matemáticos",
    context: "Joaquín participó en un torneo de cálculo mental. Superó 3 rondas completas y en cada ronda ganó 8 insignias doradas:",
    visualIcon: "🎮",
    visualText: "3 rondas con 8 insignias doradas en cada ronda",
    prompt: "¿Cuántas insignias doradas consiguió Joaquín en todo el torneo?",
    options: [
      { text: "21 insignias", isCorrect: false },
      { text: "24 insignias", isCorrect: true },
      { text: "26 insignias", isCorrect: false },
      { text: "28 insignias", isCorrect: false }
    ],
    explanation: "3 rondas por 8 insignias cada una: 3 × 8 = 24 insignias doradas."
  }
];

class SimceEngine {
  constructor() {
    this.currentQuestionIdx = 0;
    this.userAnswers = {}; // { questionIndex: selectedOptionIndex }
  }

  init() {
    this.renderSidebar();
    this.renderQuestion(0);
    this.bindControls();
  }

  renderSidebar() {
    const navGrid = document.getElementById('simceNavGrid');
    if (!navGrid) return;

    navGrid.innerHTML = '';
    SIMCE_QUESTIONS.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.className = `simce-nav-btn ${idx === this.currentQuestionIdx ? 'active' : ''} ${this.userAnswers[idx] !== undefined ? 'answered' : ''}`;
      btn.innerText = idx + 1;
      btn.setAttribute('data-idx', idx);
      btn.title = `Pregunta ${idx + 1}`;
      btn.addEventListener('click', () => {
        sound.play('click');
        this.renderQuestion(idx);
      });
      navGrid.appendChild(btn);
    });

    this.updateProgressSummary();
  }

  updateProgressSummary() {
    const answeredCount = Object.keys(this.userAnswers).length;
    const summaryText = document.getElementById('simceStatusSummaryText');
    if (summaryText) {
      summaryText.innerText = `Respondidas: ${answeredCount} de 10`;
    }
  }

  renderQuestion(index) {
    this.currentQuestionIdx = index;
    const q = SIMCE_QUESTIONS[index];
    const letters = ['A', 'B', 'C', 'D'];

    // Actualizar botones laterales
    document.querySelectorAll('.simce-nav-btn').forEach((b, idx) => {
      b.classList.toggle('active', idx === index);
      b.classList.toggle('answered', this.userAnswers[idx] !== undefined);
    });

    // Actualizar Encabezado de Pregunta
    const badge = document.getElementById('simceCurrentBadge');
    if (badge) badge.innerText = `Pregunta ${index + 1} de 10`;

    // Actualizar Contexto y Situación
    const titleEl = document.getElementById('simceQuestionTitle');
    const storyEl = document.getElementById('simceStoryText');
    const visualBox = document.getElementById('simceVisualBox');
    const promptEl = document.getElementById('simcePromptText');

    if (titleEl) titleEl.innerText = q.title;
    if (storyEl) storyEl.innerText = q.context;
    if (visualBox) {
      visualBox.innerHTML = `
        <span style="font-size: 2.5rem;">${q.visualIcon}</span>
        <span style="font-size: 1.15rem; font-weight: 800; color: #1E293B;">${q.visualText}</span>
      `;
    }
    if (promptEl) promptEl.innerText = q.prompt;

    // Renderizar Alternativas A, B, C, D
    const optionsContainer = document.getElementById('simceOptionsList');
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      q.options.forEach((opt, optIdx) => {
        const isSelected = this.userAnswers[index] === optIdx;
        const btn = document.createElement('button');
        btn.className = `simce-option-btn ${isSelected ? 'selected' : ''}`;
        btn.innerHTML = `
          <div class="simce-option-letter">${letters[optIdx]}</div>
          <div class="simce-option-text">${opt.text}</div>
        `;
        btn.addEventListener('click', () => {
          sound.play('click');
          this.selectOption(index, optIdx);
        });
        optionsContainer.appendChild(btn);
      });
    }

    // Actualizar estado de los botones de navegación anterior/siguiente
    const btnPrev = document.getElementById('btnSimcePrev');
    const btnNext = document.getElementById('btnSimceNext');
    if (btnPrev) btnPrev.disabled = index === 0;
    if (btnNext) {
      if (index === SIMCE_QUESTIONS.length - 1) {
        btnNext.innerText = "Revisar todo 📋";
      } else {
        btnNext.innerText = "Siguiente ➡️";
      }
    }
  }

  selectOption(qIndex, optIndex) {
    this.userAnswers[qIndex] = optIndex;
    this.renderSidebar();
    this.renderQuestion(qIndex);
  }

  bindControls() {
    const btnPrev = document.getElementById('btnSimcePrev');
    const btnNext = document.getElementById('btnSimceNext');
    const btnFinish = document.getElementById('btnSimceFinish');

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        sound.play('click');
        if (this.currentQuestionIdx > 0) {
          this.renderQuestion(this.currentQuestionIdx - 1);
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        sound.play('click');
        if (this.currentQuestionIdx < SIMCE_QUESTIONS.length - 1) {
          this.renderQuestion(this.currentQuestionIdx + 1);
        } else {
          this.confirmFinish();
        }
      });
    }

    if (btnFinish) {
      btnFinish.addEventListener('click', () => {
        sound.play('click');
        this.confirmFinish();
      });
    }
  }

  confirmFinish() {
    const answeredCount = Object.keys(this.userAnswers).length;
    const total = SIMCE_QUESTIONS.length;

    if (answeredCount < total) {
      const missing = total - answeredCount;
      const modal = document.getElementById('gameModal');
      const modalTitle = document.getElementById('modalTitle');
      const modalBody = document.getElementById('modalBody');
      const modalBtn = document.getElementById('modalActionBtn');

      if (!modal) return;
      modalTitle.innerHTML = `⚠️ Preguntas pendientes`;
      modalBody.innerHTML = `
        <p style="font-size: 1.15rem; color: #475569; margin-bottom: 14px;">
          Aún te faltan <strong>${missing} pregunta${missing > 1 ? 's' : ''}</strong> por responder en tu ensayo SIMCE.
        </p>
        <p style="font-weight: 700; color: #1E293B;">
          ¿Deseas responderlas para asegurar tu mejor puntaje?
        </p>
      `;
      modalBtn.innerText = "Volver y responder ✍️";
      modalBtn.onclick = () => modal.classList.remove('active');
      modal.classList.add('active');
    } else {
      this.calculateResults();
    }
  }

  calculateResults() {
    let correctCount = 0;
    const details = [];

    SIMCE_QUESTIONS.forEach((q, idx) => {
      const userSelected = this.userAnswers[idx];
      const selectedOption = userSelected !== undefined ? q.options[userSelected] : null;
      const isCorrect = selectedOption && selectedOption.isCorrect;

      if (isCorrect) correctCount++;

      const correctOption = q.options.find(o => o.isCorrect);

      details.push({
        questionNumber: idx + 1,
        title: q.title,
        userAnswer: selectedOption ? selectedOption.text : "Sin responder",
        correctAnswer: correctOption.text,
        isCorrect: isCorrect,
        explanation: q.explanation
      });
    });

    // Guardar en almacenamiento permanente
    StudentStorage.saveSimceAttempt(correctCount, SIMCE_QUESTIONS.length, details);
    if (typeof updateHeaderStats === 'function') updateHeaderStats();

    // Mostrar pantalla de resultados
    this.displayResults(correctCount, SIMCE_QUESTIONS.length, details);
  }

  displayResults(score, total, details) {
    sound.play('fanfare');
    confetti.launch(100);

    const testContainer = document.getElementById('simceTestContainer');
    const resultsContainer = document.getElementById('simceResultsContainer');

    if (testContainer) testContainer.style.display = 'none';
    if (resultsContainer) {
      resultsContainer.style.display = 'block';
      resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Determinar nivel de logro SIMCE
    let levelClass = 'level-inicial';
    let levelName = 'Nivel Inicial 💪';
    let levelMessage = '¡Buen intento! Repasa las tablas de multiplicar interactivas y verás cómo tu puntaje sube rápidamente.';

    if (score >= 9) {
      levelClass = 'level-destacado';
      levelName = '¡Nivel Destacado / Sobresaliente! 🌟';
      levelMessage = '¡Extraordinario! Tienes un dominio excelente de las situaciones matemáticas y el cálculo en 4° básico.';
    } else if (score >= 7) {
      levelClass = 'level-adecuado';
      levelName = '¡Nivel Adecuado! 👏';
      levelMessage = '¡Gran trabajo! Comprendes las situaciones problemáticas y aplicas muy bien las multiplicaciones.';
    } else if (score >= 5) {
      levelClass = 'level-elemental';
      levelName = '¡Nivel Elemental! 👍';
      levelMessage = '¡Vas por buen camino! Sigue practicando las tablas con los juegos para consolidar tu aprendizaje.';
    }

    const percentage = Math.round((score / total) * 100);

    const scoreDisplay = document.getElementById('simceScoreDisplay');
    const levelBadge = document.getElementById('simceLevelBadge');
    const messageEl = document.getElementById('simceFeedbackMessage');
    const feedbackList = document.getElementById('simceFeedbackQuestionsList');

    if (scoreDisplay) scoreDisplay.innerHTML = `<span class="score-num">${score}</span><span class="score-label">de ${total} (${percentage}%)</span>`;
    if (levelBadge) {
      levelBadge.className = `results-level-badge ${levelClass}`;
      levelBadge.innerText = levelName;
    }
    if (messageEl) messageEl.innerText = levelMessage;

    // Desglose de cada pregunta
    if (feedbackList) {
      feedbackList.innerHTML = details.map(d => `
        <div class="feedback-item ${d.isCorrect ? 'correct' : 'wrong'} anim-pop">
          <div class="feedback-q-title">
            <span>Pregunta ${d.questionNumber}: ${d.title}</span>
            <span>${d.isCorrect ? '✅ Correcta' : '❌ Incorrecta'}</span>
          </div>
          <div style="font-size: 0.95rem; margin-bottom: 6px;">
            <strong>Tu respuesta:</strong> ${d.userAnswer} ${d.isCorrect ? '' : `(Respuesta correcta: <strong>${d.correctAnswer}</strong>)`}
          </div>
          <div class="feedback-solution">
            💡 <strong>Resolución paso a paso:</strong> ${d.explanation}
          </div>
        </div>
      `).join('');
    }
  }

  restartTest() {
    this.userAnswers = {};
    this.currentQuestionIdx = 0;
    const testContainer = document.getElementById('simceTestContainer');
    const resultsContainer = document.getElementById('simceResultsContainer');

    if (resultsContainer) resultsContainer.style.display = 'none';
    if (testContainer) testContainer.style.display = 'grid';

    this.renderSidebar();
    this.renderQuestion(0);
  }
}

const simceEngine = new SimceEngine();
