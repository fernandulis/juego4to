/* ==========================================================================
   APRENDIZAJE.JS - Módulo Interactivo de Tablas de Multiplicar (2 al 10)
   Resultados continuamente animados y desafíos estrictos de la tabla elegida
   ========================================================================== */

const TABLES_DATA = {
  2: {
    emoji: '🍎',
    objectName: 'manzanas',
    color: '#3B82F6',
    superpowerTitle: '¡El Doble de Todo! ⚡',
    superpowerDesc: 'Multiplicar por 2 siempre entrega un número PAR (termina en 0, 2, 4, 6 u 8). ¡Es como sumar el número consigo mismo!',
    tip: 'Si tienes 2 × 7, solo piensa: ¿Cuánto es 7 + 7? ¡Exacto, 14!'
  },
  3: {
    emoji: '⭐',
    objectName: 'estrellas',
    color: '#F59E0B',
    superpowerTitle: '¡El Ritmo del Tres! 🎵',
    superpowerDesc: 'Contar de 3 en 3 es como un compás: 3, 6, 9, 12, 15... ¡Si sumas los dígitos del resultado siempre obtienes 3, 6 o 9!',
    tip: 'Para resolver 3 × 6, piensa en sumar 6 tres veces: 6 + 6 + 6 = 18.'
  },
  4: {
    emoji: '🚗',
    objectName: 'autitos',
    color: '#10B981',
    superpowerTitle: '¡El Doble del Doble! 🚀',
    superpowerDesc: '¿Quieres multiplicar por 4? Solo duplica el número y luego vuelve a duplicar el resultado. ¡Así de fácil!',
    tip: 'Para calcular 4 × 6: el doble de 6 es 12, y el doble de 12 es 24.'
  },
  5: {
    emoji: '✋',
    objectName: 'manos con 5 dedos',
    color: '#EC4899',
    superpowerTitle: '¡La Tabla del Reloj y las Manos! ⏱️',
    superpowerDesc: 'Todos los resultados de la tabla del 5 terminan estrictamente en 0 o en 5. ¡Igual que contar de 5 en 5 los minutos en un reloj!',
    tip: 'Si el número es par, termina en 0 (ej: 5×4=20). Si es impar, termina en 5 (ej: 5×7=35).'
  },
  6: {
    emoji: '🍪',
    objectName: 'galletas',
    color: '#8B5CF6',
    superpowerTitle: '¡El Hermano Mayor del 3! 🍪',
    superpowerDesc: 'El 6 es el doble de 3. Si conoces la respuesta en la tabla del 3, solo duplica esa respuesta para tener la del 6.',
    tip: '3 × 4 = 12, por lo tanto el doble es: 6 × 4 = 24.'
  },
  7: {
    emoji: '📅',
    objectName: 'días de la semana',
    color: '#06B6D4',
    superpowerTitle: '¡El Calendario Mágico! 🗓️',
    superpowerDesc: 'Una semana tiene 7 días. Cada resultado de la tabla del 7 representa semanas completas: 2 semanas = 14 días, 3 semanas = 21 días.',
    tip: '7 × 8 = 56 (¡Truco nemotécnico: 5, 6, 7, 8... 56 = 7 × 8!).'
  },
  8: {
    emoji: '🐙',
    objectName: 'tentáculos',
    color: '#F97316',
    superpowerTitle: '¡El Pulpo Multiplicador! 🐙',
    superpowerDesc: 'El 8 es el doble de 4 (¡y cuatro veces el 2!). Duplica tres veces consecutivas el número para obtener su resultado.',
    tip: 'Para 8 × 5: 5 -> 10 -> 20 -> 40. ¡8 × 5 = 40!'
  },
  9: {
    emoji: '🎈',
    objectName: 'globos mágicos',
    color: '#E11D48',
    superpowerTitle: '¡El Truco Mágico de los Dedos! 🪄',
    superpowerDesc: 'En la tabla del 9, las decenas van subiendo (0, 1, 2, 3...) y las unidades bajando (9, 8, 7...). ¡La suma de los dos dígitos SIEMPRE es 9!',
    tip: 'En 9 × 4 = 36, observa que 3 + 6 = 9. ¡Y las decenas (3) son uno menos que el número multiplicado (4-1=3)!'
  },
  10: {
    emoji: '💎',
    objectName: 'diamantes',
    color: '#14B8A6',
    superpowerTitle: '¡El Cero Relámpago! 💎',
    superpowerDesc: 'Multiplicar por 10 es lo más veloz: ¡Solo tomas el número y le agregas un cero a la derecha!',
    tip: '10 × 8 = ¡Escribes el 8 y le pones un cero: 80!'
  }
};

class AprendizajeModule {
  constructor() {
    this.currentTable = 2;
    this.currentFactor = 3;
    this.practiceList = [];
    this.practiceIndex = 0;
    this.practiceScore = 0;
  }

  init() {
    this.renderTableIslands();
    this.bindEvents();
    this.loadTable(2);
  }

  renderTableIslands() {
    const container = document.getElementById('tablesCarousel');
    if (!container) return;
    const student = StudentStorage.get();

    container.innerHTML = '';
    for (let t = 2; t <= 10; t++) {
      const prog = student.tablesProgress[t] || { stars: 0, completed: false };
      const starsDisplay = '⭐'.repeat(prog.stars) + '☆'.repeat(3 - prog.stars);

      const btn = document.createElement('button');
      btn.className = `table-island-btn ${t === this.currentTable ? 'active' : ''}`;
      btn.setAttribute('data-table', t);
      btn.innerHTML = `
        <span class="table-num">${t}</span>
        <span class="table-label">Tabla</span>
        <span class="table-stars">${starsDisplay}</span>
      `;
      btn.addEventListener('click', () => {
        sound.play('click');
        this.loadTable(t);
      });
      container.appendChild(btn);
    }
  }

  bindEvents() {
    // Selector de factores 1 al 10
    const factorButtons = document.querySelectorAll('.factor-btn');
    factorButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        factorButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFactor = parseInt(btn.getAttribute('data-factor'));
        sound.play('star');
        this.updateInteractiveView();
      });
    });

    // Botón de pista didáctica
    const hintBtn = document.getElementById('btnShowHint');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => this.showHintModal());
    }

    // Botón de iniciar desafío guiado de la tabla
    const startPracticeBtn = document.getElementById('btnStartTablePractice');
    if (startPracticeBtn) {
      startPracticeBtn.onclick = () => this.startPractice(this.currentTable);
    }
  }

  loadTable(tableNum) {
    this.currentTable = parseInt(tableNum);

    // Actualizar clase activa en islas
    document.querySelectorAll('.table-island-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.getAttribute('data-table')) === this.currentTable);
    });

    const info = TABLES_DATA[this.currentTable];
    const badge = document.getElementById('tableActiveBadge');
    if (badge) badge.innerText = `Tabla del ${this.currentTable}`;

    // Actualizar tarjeta del superpoder
    const powerTitle = document.getElementById('patternTitle');
    const powerDesc = document.getElementById('patternDesc');
    if (powerTitle && powerDesc) {
      powerTitle.innerText = info.superpowerTitle;
      powerDesc.innerText = info.superpowerDesc;
    }

    // Actualizar títulos y área del Desafío para que sea 100% sobre esta tabla seleccionada
    const challengeTitle = document.getElementById('practiceTitle');
    const challengeBtn = document.getElementById('btnStartTablePractice');
    const challengeArea = document.getElementById('practiceQuestionArea');

    if (challengeTitle) {
      challengeTitle.innerHTML = `🎯 Desafío Exclusivo: ¡Tabla del ${this.currentTable}!`;
    }
    if (challengeBtn) {
      challengeBtn.innerHTML = `Comenzar Desafío de la Tabla del ${this.currentTable} (5 Preguntas) 🚀`;
      challengeBtn.onclick = () => this.startPractice(this.currentTable);
    }
    if (challengeArea) {
      challengeArea.innerHTML = `
        <div class="anim-pop" style="padding: 18px 24px; text-align: center;">
          <p style="font-size: 1.3rem; color: #1E293B; font-weight: 800; margin-bottom: 8px;">
            ¿Estás listo para responder las 5 preguntas exclusivas de la <strong>Tabla del ${this.currentTable}</strong>?
          </p>
          <p style="font-size: 1.05rem; color: #64748B; font-weight: 700; margin-bottom: 20px;">
            Todas las preguntas serán sobre la Tabla del ${this.currentTable} (${this.currentTable} × 1 hasta ${this.currentTable} × 10). ¡Acierta y gana tus 3 estrellas ⭐ para registrar tu progreso!
          </p>
          <button class="btn btn-primary btn-lg anim-bounce" onclick="aprendizaje.startPractice(${this.currentTable})">
            ¡Comenzar Desafío de la Tabla del ${this.currentTable}! 🚀
          </button>
        </div>
      `;
    }

    this.updateInteractiveView();
  }

  /* Actualiza la vista interactiva con el resultado en continuo movimiento */
  updateInteractiveView() {
    const t = this.currentTable;
    const f = this.currentFactor;
    const result = t * f;
    const info = TABLES_DATA[t];

    // Actualizar números de la ecuación
    const elFactor1 = document.getElementById('eqFactor1');
    const elFactor2 = document.getElementById('eqFactor2');
    const elResult = document.getElementById('eqResult');

    if (elFactor1) {
      elFactor1.innerText = t;
      elFactor1.classList.remove('anim-pop');
      void elFactor1.offsetWidth;
      elFactor1.classList.add('anim-pop');
    }

    if (elFactor2) {
      elFactor2.innerText = f;
      elFactor2.classList.remove('anim-pop');
      void elFactor2.offsetWidth;
      elFactor2.classList.add('anim-pop');
    }

    // RESULTADO SÚPER ANIMADO Y CONTINUAMENTE EN MOVIMIENTO (BAILANDO Y FLOTANDO)
    if (elResult) {
      elResult.innerHTML = `
        <span class="anim-spin-slow" style="font-size: 1.8rem; user-select: none;">🌟</span>
        <span class="anim-dancing-number" style="display: inline-block;">${result}</span>
        <span class="anim-spin-slow" style="font-size: 1.8rem; user-select: none;">🌟</span>
      `;
      elResult.classList.remove('anim-result-pop');
      void elResult.offsetWidth; // Forzar reflow para reiniciar la animación de explosión
      elResult.classList.add('anim-result-pop');
    }

    // Suma iterada con animación
    const repeatedBox = document.getElementById('repeatedAdditionText');
    if (repeatedBox) {
      const parts = Array(t).fill(f);
      repeatedBox.innerHTML = `💡 <strong>Representa:</strong> ${t} grupos de ${f} ${info.objectName} <br><span style="color: #0369A1; font-size: 1.25rem;">(${parts.join(' + ')} = <strong>${result}</strong>)</span>`;
      repeatedBox.classList.remove('anim-pop');
      void repeatedBox.offsetWidth;
      repeatedBox.classList.add('anim-pop');
    }

    // Dibujar los grupos visuales con animación
    const groupsContainer = document.getElementById('groupsVisualContainer');
    if (groupsContainer) {
      groupsContainer.innerHTML = '';
      for (let g = 1; g <= t; g++) {
        const groupBox = document.createElement('div');
        groupBox.className = 'group-box anim-pop';
        groupBox.style.animationDelay = `${g * 0.03}s`;

        let itemsHtml = '';
        for (let i = 1; i <= f; i++) {
          itemsHtml += `<span class="item-icon anim-apple-drop" style="animation-delay: ${(g * 0.04) + (i * 0.03)}s">${info.emoji}</span>`;
        }

        groupBox.innerHTML = `
          <div class="group-items-row">${itemsHtml}</div>
          <span class="group-caption">Grupo ${g} (${f})</span>
        `;
        groupsContainer.appendChild(groupBox);
      }
    }
  }

  showHintModal() {
    sound.play('star');
    const info = TABLES_DATA[this.currentTable];
    const modal = document.getElementById('gameModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalBtn = document.getElementById('modalActionBtn');

    if (!modal) return;
    modalTitle.innerHTML = `💡 Pista Matemática: Tabla del ${this.currentTable}`;
    modalBody.innerHTML = `
      <div style="font-size: 1.2rem; line-height: 1.6; text-align: left; padding: 12px;">
        <p style="margin-bottom: 14px; font-weight: bold; color: #1E3A8A;">
          ${info.superpowerDesc}
        </p>
        <div style="background: #FEF3C7; border: 3px dashed #D97706; padding: 14px; border-radius: 16px; margin-bottom: 14px;">
          <strong>🎯 Estrategia mental para ${this.currentTable} × ${this.currentFactor}:</strong><br>
          ${info.tip}
        </div>
        <p style="color: #475569;">
          Recuerda: ${this.currentTable} veces el número ${this.currentFactor} es igual a <strong style="color: #B45309; font-size: 1.3rem;">${this.currentTable * this.currentFactor}</strong>.
        </p>
      </div>
    `;
    modalBtn.innerText = "¡Entendido! 👍";
    modalBtn.onclick = () => modal.classList.remove('active');
    modal.classList.add('active');
  }

  /* ==========================================================================
     DESAFÍO GUIADO: 5 PREGUNTAS ESTRICTAS DE LA TABLA SELECCIONADA
     ========================================================================== */
  startPractice(tableToPractice = null) {
    sound.play('star');
    // Asegurar 100% que la tabla sea exactamente la que el niño seleccionó
    const t = tableToPractice ? parseInt(tableToPractice) : parseInt(this.currentTable);
    this.currentTable = t;
    this.practiceScore = 0;
    this.practiceIndex = 0;

    // Generar 5 multiplicaciones aleatorias estrictamente de la tabla 't'
    const factors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort(() => Math.random() - 0.5).slice(0, 5);
    this.practiceList = factors.map(f => ({
      table: t,
      factor: f,
      result: t * f
    }));

    const practiceBox = document.getElementById('tablePracticeBox');
    if (practiceBox) {
      practiceBox.scrollIntoView({ behavior: 'smooth' });
    }
    this.renderCurrentPracticeQuestion();
  }

  renderCurrentPracticeQuestion() {
    const q = this.practiceList[this.practiceIndex];
    const container = document.getElementById('practiceQuestionArea');
    if (!container) return;

    // Generar 4 alternativas con distractores verosímiles
    const correct = q.result;
    const distractors = new Set();
    distractors.add(correct + q.table);
    distractors.add(Math.max(1, correct - q.table));
    distractors.add(correct + 2);
    distractors.add(Math.max(1, correct - 2));

    const options = Array.from(distractors).filter(n => n !== correct).slice(0, 3);
    options.push(correct);
    options.sort(() => Math.random() - 0.5);

    container.innerHTML = `
      <div class="anim-pop">
        <!-- Banner inequívoco de la tabla seleccionada -->
        <div style="display: inline-block; background: #FEF08A; border: 3px solid #B45309; color: #78350F; padding: 10px 26px; border-radius: 26px; font-size: 1.25rem; font-weight: 900; margin-bottom: 18px; box-shadow: 0 4px 0 #B45309;" class="anim-bounce">
          🎯 DESAFÍO EXCLUSIVO: TABLA DEL ${q.table} | Pregunta ${this.practiceIndex + 1} de ${this.practiceList.length}
        </div>

        <div class="practice-question-text anim-result-pop" style="font-size: 3rem; font-weight: 900; color: #1E293B; margin-bottom: 24px;">
          ¿Cuánto es ${q.table} × ${q.factor}?
        </div>

        <div class="practice-options-grid">
          ${options.map(opt => `
            <button class="btn btn-secondary practice-opt-btn" onclick="aprendizaje.handlePracticeAnswer(${opt}, ${correct}, this)">
              ${opt}
            </button>
          `).join('')}
        </div>
        <div id="practiceFeedbackMsg" style="font-size: 1.35rem; font-weight: 900; min-height: 42px;"></div>
      </div>
    `;
  }

  handlePracticeAnswer(selectedVal, correctVal, btn) {
    const feedback = document.getElementById('practiceFeedbackMsg');
    const allBtns = document.querySelectorAll('.practice-opt-btn');
    allBtns.forEach(b => b.disabled = true);

    if (selectedVal === correctVal) {
      this.practiceScore++;
      sound.play('correct');
      confetti.launch(40);
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-success', 'anim-bounce');
      feedback.innerHTML = `<span style="color: #16A34A;" class="anim-bounce">¡EXTRAORDINARIO! ¡${this.practiceList[this.practiceIndex].table} × ${this.practiceList[this.practiceIndex].factor} = ${correctVal}! 🎉</span>`;
    } else {
      sound.play('wrong');
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-danger', 'anim-shake');
      allBtns.forEach(b => {
        if (parseInt(b.innerText) === correctVal) {
          b.classList.remove('btn-secondary');
          b.classList.add('btn-success');
        }
      });
      feedback.innerHTML = `<span style="color: #DC2626;" class="anim-shake">¡Casi! ${this.practiceList[this.practiceIndex].table} × ${this.practiceList[this.practiceIndex].factor} es <strong>${correctVal}</strong>. ¡Tú puedes! 💪</span>`;
    }

    setTimeout(() => {
      this.practiceIndex++;
      if (this.practiceIndex < this.practiceList.length) {
        this.renderCurrentPracticeQuestion();
      } else {
        this.finishPractice();
      }
    }, 1300);
  }

  finishPractice() {
    sound.play('fanfare');
    confetti.launch(85);

    const starsEarned = this.practiceScore >= 5 ? 3 : this.practiceScore >= 3 ? 2 : 1;
    const pointsGained = this.practiceScore * 10;

    StudentStorage.addPoints(pointsGained);
    StudentStorage.addStars(starsEarned);
    // Guarda el progreso exactamente para la tabla que el niño aprendió
    StudentStorage.setTableProgress(this.currentTable, starsEarned);

    if (typeof updateHeaderStats === 'function') updateHeaderStats();
    this.renderTableIslands();

    const container = document.getElementById('practiceQuestionArea');
    if (container) {
      container.innerHTML = `
        <div class="anim-pop" style="padding: 26px; text-align: center;">
          <h3 style="font-size: 2.2rem; color: #1E293B; margin-bottom: 12px;">¡Desafío de la Tabla del ${this.currentTable} Completado! 🏆</h3>
          <p style="font-size: 1.4rem; font-weight: 800; color: #475569; margin-bottom: 16px;">
            Acertaste <strong>${this.practiceScore} de 5</strong> preguntas de la Tabla del ${this.currentTable}
          </p>
          <div style="font-size: 3.4rem; margin-bottom: 22px;">
            ${'⭐'.repeat(starsEarned)}${'☆'.repeat(3 - starsEarned)}
          </div>
          <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-warning btn-md" onclick="aprendizaje.startPractice(${this.currentTable})">
              Repetir Desafío de la Tabla del ${this.currentTable} 🔄
            </button>
            <button class="btn btn-primary btn-md" onclick="aprendizaje.loadTable(${Math.min(10, this.currentTable + 1)})">
              Aprender Tabla del ${Math.min(10, this.currentTable + 1)} ➡️
            </button>
          </div>
        </div>
      `;
    }
  }
}

const aprendizaje = new AprendizajeModule();
