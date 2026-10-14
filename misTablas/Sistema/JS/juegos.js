/* ==========================================================================
   JUEGOS.JS - 6 Minijuegos Dinámicos, Súper Animados y con Selección de Tabla
   1. Memoria Matemática (Giro 3D y chispas)
   2. Atrapa el Resultado (Temporizador de 5s y cambio inmediato al fallar o acabarse el tiempo)
   3. Construye la Multiplicación (Canastas que vibran y manzanas que caen rebotando)
   4. ¿Quién tiene la respuesta? (Personajes que saltan y reaccionan)
   5. Arrastra y Completa (Efectos magnéticos de encaje)
   6. Desafío contra el Tiempo (Modo arcade con combos y fuego)
   ========================================================================== */

class GamesHub {
  constructor() {
    this.selectedTable = 2; // Tabla seleccionada por defecto (2 al 10 o 'all')
    this.activeGameId = null;
    this.timerInterval = null;
    this.roundCountdown = null;
    this._timeScore = 0;
    this._comboStreak = 0;
    this._activeChips = null;
  }

  init() {
    this.renderTablePicker();

    // Escuchar botones de inicio de cada juego en la cuadrícula
    document.querySelectorAll('[data-launch-game]').forEach(btn => {
      btn.addEventListener('click', () => {
        const gameId = btn.getAttribute('data-launch-game');
        sound.play('click');
        this.launchGame(gameId);
      });
    });

    const btnBack = document.getElementById('btnExitGame');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        sound.play('click');
        this.exitGame();
      });
    }

    const btnChangeTable = document.getElementById('btnChangeGameTable');
    if (btnChangeTable) {
      btnChangeTable.addEventListener('click', () => {
        sound.play('click');
        this.showChangeTableModal();
      });
    }
  }

  /* Renderiza la barra de selección de tabla en la pantalla de juegos */
  renderTablePicker() {
    const container = document.getElementById('gameTablesPickerList');
    if (!container) return;

    container.innerHTML = '';

    // Botones de las tablas 2 al 10
    for (let t = 2; t <= 10; t++) {
      const btn = document.createElement('button');
      btn.className = `game-table-pick-btn ${this.selectedTable === t ? 'active' : ''}`;
      btn.setAttribute('data-game-table', t);
      btn.innerHTML = `
        <span class="pick-table-num">${t}</span>
        <span class="pick-table-txt">Tabla</span>
      `;
      btn.addEventListener('click', () => {
        this.selectTable(t);
      });
      container.appendChild(btn);
    }

    // Botón especial: ¡Todas las Tablas Mezcladas!
    const allBtn = document.createElement('button');
    allBtn.className = `game-table-pick-btn btn-pick-all ${this.selectedTable === 'all' ? 'active' : ''}`;
    allBtn.setAttribute('data-game-table', 'all');
    allBtn.innerHTML = `
      <span class="pick-table-num">🌟</span>
      <span class="pick-table-txt">¡Todas!</span>
    `;
    allBtn.addEventListener('click', () => {
      this.selectTable('all');
    });
    container.appendChild(allBtn);

    this.updateActiveTableDisplays();
  }

  selectTable(table) {
    sound.play('star');
    this.selectedTable = table;

    // Actualizar estados visuales de los botones
    document.querySelectorAll('.game-table-pick-btn').forEach(b => {
      const val = b.getAttribute('data-game-table');
      b.classList.toggle('active', val === String(table));
    });

    this.updateActiveTableDisplays();

    // Si ya hay un juego activo en la arena, reiniciarlo inmediatamente con la nueva tabla
    if (this.activeGameId) {
      this.launchGame(this.activeGameId, true);
    }
  }

  updateActiveTableDisplays() {
    const isAll = this.selectedTable === 'all';
    const textDesc = isAll ? '¡Todas las Tablas Mezcladas! 🌟' : `Tabla del ${this.selectedTable}`;
    const shortDesc = isAll ? 'Todas 🌟' : `del ${this.selectedTable}`;

    const bannerText = document.getElementById('gameActiveTableText');
    const arenaPill = document.getElementById('arenaActiveTableNum');

    if (bannerText) bannerText.innerText = textDesc;
    if (arenaPill) arenaPill.innerText = shortDesc;
  }

  showChangeTableModal() {
    const modal = document.getElementById('gameModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalBtn = document.getElementById('modalActionBtn');

    if (!modal) return;
    modalTitle.innerHTML = `🎯 Elige con qué tabla jugar`;

    let buttonsHtml = '<div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin: 18px 0;">';
    for (let t = 2; t <= 10; t++) {
      const activeStyle = this.selectedTable === t ? 'background: #FEF08A; border-color: #B45309; transform: scale(1.08);' : '';
      buttonsHtml += `
        <button class="btn btn-secondary btn-sm" style="min-width: 76px; font-size: 1.15rem; ${activeStyle}" onclick="gamesHub.selectTable(${t}); document.getElementById('gameModal').classList.remove('active');">
          Tabla ${t}
        </button>
      `;
    }
    const allActive = this.selectedTable === 'all' ? 'background: #FEF08A; border-color: #B45309; transform: scale(1.08);' : '';
    buttonsHtml += `
      <button class="btn btn-warning btn-sm" style="min-width: 110px; font-size: 1.15rem; ${allActive}" onclick="gamesHub.selectTable('all'); document.getElementById('gameModal').classList.remove('active');">
        🌟 ¡Todas!
      </button>
    </div>`;

    modalBody.innerHTML = `
      <p style="font-size: 1.15rem; font-weight: 700; color: #475569;">
        Elige con qué tabla quieres continuar la partida:
      </p>
      ${buttonsHtml}
    `;

    modalBtn.innerText = "Cerrar ❌";
    modalBtn.onclick = () => modal.classList.remove('active');
    modal.classList.add('active');
  }

  getTableForQuestion() {
    if (this.selectedTable === 'all') {
      return Math.floor(Math.random() * 9) + 2; // 2 al 10
    }
    return parseInt(this.selectedTable);
  }

  exitGame() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.roundCountdown) clearInterval(this.roundCountdown);
    this.activeGameId = null;
    const arena = document.getElementById('activeGameArena');
    const hub = document.getElementById('gamesHubOverview');
    if (arena) arena.style.display = 'none';
    if (hub) hub.style.display = 'block';
  }

  launchGame(gameId, isReload = false) {
    this.activeGameId = gameId;
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.roundCountdown) clearInterval(this.roundCountdown);

    const arena = document.getElementById('activeGameArena');
    const hub = document.getElementById('gamesHubOverview');
    const title = document.getElementById('activeGameTitle');

    if (hub) hub.style.display = 'none';
    if (arena) {
      arena.style.display = 'block';
      if (!isReload) arena.scrollIntoView({ behavior: 'smooth' });
    }

    this.updateActiveTableDisplays();

    switch (gameId) {
      case 'memoria':
        if (title) title.innerText = '🧠 Memoria Matemática: Parejas de Multiplicación';
        this.initMemoryGame();
        break;
      case 'atrapa':
        if (title) title.innerText = '🎈 Atrapa el Resultado Flotante';
        this.initCatchBubblesGame();
        break;
      case 'construye':
        if (title) title.innerText = '🍎 Construye la Multiplicación en Canastas';
        this.initBuildMultiplicationGame();
        break;
      case 'quien':
        if (title) title.innerText = '🎭 ¿Quién tiene la Respuesta Correcta?';
        this.initWhoHasAnswerGame();
        break;
      case 'arrastra':
        if (title) title.innerText = '🧩 Arrastra y Completa las Operaciones';
        this.initDragAndDropGame();
        break;
      case 'tiempo':
        if (title) title.innerText = '⚡ Desafío Contra el Tiempo (60 Segundos)';
        this.initTimeAttackGame();
        break;
    }
  }

  /* ==========================================================================
     1. MEMORIA MATEMÁTICA
     Giro 3D, chispas y parejas de la tabla seleccionada
     ========================================================================== */
  initMemoryGame() {
    const stage = document.getElementById('gamePlayStage');
    const isAll = this.selectedTable === 'all';
    const mainTable = isAll ? null : parseInt(this.selectedTable);

    let pairs = [];
    if (!isAll) {
      const factors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort(() => Math.random() - 0.5).slice(0, 6);
      factors.forEach((f, idx) => {
        pairs.push({ id: idx + 1, text: `${mainTable} × ${f}` });
        pairs.push({ id: idx + 1, text: `${mainTable * f}` });
      });
    } else {
      const operations = [
        { t: 3, f: 4 }, { t: 6, f: 7 }, { t: 8, f: 5 },
        { t: 9, f: 3 }, { t: 4, f: 8 }, { t: 7, f: 7 }
      ].sort(() => Math.random() - 0.5);

      operations.forEach((op, idx) => {
        pairs.push({ id: idx + 1, text: `${op.t} × ${op.f}` });
        pairs.push({ id: idx + 1, text: `${op.t * op.f}` });
      });
    }

    pairs.sort(() => Math.random() - 0.5);

    let flipped = [];
    let matchedCount = 0;

    const tableBadgeText = isAll ? 'todas las tablas mezcladas' : `la <strong>Tabla del ${mainTable}</strong>`;

    stage.innerHTML = `
      <div style="text-align: center; margin-bottom: 22px;">
        <p style="font-size: 1.25rem; font-weight: 700; color: #475569;">
          ¡Encuentra las 6 parejas de ${tableBadgeText}! ¡Voltea las cartas!
        </p>
      </div>
      <div class="memory-board" id="memoryCardsBoard"></div>
    `;

    const board = document.getElementById('memoryCardsBoard');
    pairs.forEach((item) => {
      const tile = document.createElement('div');
      tile.className = 'memory-tile';
      tile.innerHTML = `<span>❓</span>`;
      tile.setAttribute('data-id', item.id);
      tile.setAttribute('data-text', item.text);

      tile.addEventListener('click', () => {
        if (tile.classList.contains('revealed') || tile.classList.contains('matched') || flipped.length >= 2) return;

        sound.play('click');
        tile.classList.add('revealed');
        tile.innerHTML = `<span>${item.text}</span>`;
        tile.classList.remove('anim-result-pop');
        void tile.offsetWidth;
        tile.classList.add('anim-result-pop');
        flipped.push(tile);

        if (flipped.length === 2) {
          const [first, second] = flipped;
          if (first.getAttribute('data-id') === second.getAttribute('data-id')) {
            setTimeout(() => {
              sound.play('correct');
              confetti.launch(25);
              first.classList.add('matched', 'anim-bounce');
              second.classList.add('matched', 'anim-bounce');
              flipped = [];
              matchedCount++;
              if (matchedCount === 6) {
                sound.play('fanfare');
                confetti.launch(90);
                StudentStorage.addPoints(25);
                StudentStorage.addStars(2);
                StudentStorage.unlockAchievement('memory_master');
                if (typeof updateHeaderStats === 'function') updateHeaderStats();
                stage.innerHTML += `
                  <div class="anim-pop" style="text-align: center; margin-top: 26px;">
                    <h2 style="color: #16A34A; font-size: 2.2rem;">¡Mente Brillante! 🧠🎉</h2>
                    <p style="font-size: 1.35rem; font-weight: 800; margin: 10px 0;">¡Completaste todas las parejas! Ganaste +25 puntos.</p>
                    <button class="btn btn-warning btn-lg" style="margin-top: 14px;" onclick="gamesHub.initMemoryGame()">Jugar otra vez 🔄</button>
                  </div>
                `;
              }
            }, 400);
          } else {
            setTimeout(() => {
              sound.play('wrong');
              first.classList.remove('revealed', 'anim-result-pop');
              second.classList.remove('revealed', 'anim-result-pop');
              first.innerHTML = `<span>❓</span>`;
              second.innerHTML = `<span>❓</span>`;
              flipped = [];
            }, 800);
          }
        }
      });
      board.appendChild(tile);
    });
  }

  /* ==========================================================================
     2. ATRAPA EL RESULTADO (ULTRA DINÁMICO)
     - Si el niño no alcanza a contestar en 5s, cambia AL TIRO a la siguiente pregunta.
     - Si responde mal, también cambia AL TIRO a la siguiente pregunta.
     - Si responde bien, festeja y avanza.
     ========================================================================== */
  initCatchBubblesGame() {
    const stage = document.getElementById('gamePlayStage');
    let score = 0;
    let round = 1;
    const maxRounds = 5;
    const TIME_PER_QUESTION = 5; // 5 segundos por pregunta para máxima emoción

    if (this.roundCountdown) clearInterval(this.roundCountdown);

    const playRound = () => {
      if (this.roundCountdown) clearInterval(this.roundCountdown);

      if (round > maxRounds) {
        sound.play('fanfare');
        confetti.launch(80);
        StudentStorage.addPoints(score * 5);
        if (typeof updateHeaderStats === 'function') updateHeaderStats();
        stage.innerHTML = `
          <div class="anim-pop" style="text-align: center; padding: 28px;">
            <h2 style="font-size: 2.3rem; color: #0284C7; margin-bottom: 12px;">¡Desafío de Burbujas Superado! 🎈✨</h2>
            <p style="font-size: 1.45rem; font-weight: 800; margin: 16px 0; color: #1E293B;">Puntaje final: <strong>${score} de ${maxRounds} aciertos</strong></p>
            <p style="font-size: 1.15rem; color: #64748B; font-weight: 700; margin-bottom: 24px;">¡Tus reflejos matemáticos están mejorando a gran velocidad!</p>
            <button class="btn btn-primary btn-lg" onclick="gamesHub.initCatchBubblesGame()">Jugar de nuevo 🔄</button>
          </div>
        `;
        return;
      }

      const t = this.getTableForQuestion();
      const f = Math.floor(Math.random() * 9) + 2;
      const correct = t * f;

      const wrongOptions = [
        correct + t,
        Math.max(2, correct - t),
        correct + 2,
        Math.max(2, correct - 2)
      ].filter(n => n !== correct).sort(() => Math.random() - 0.5).slice(0, 3);

      const allAnswers = [correct, ...wrongOptions].sort(() => Math.random() - 0.5);

      let timeLeft = TIME_PER_QUESTION;

      stage.innerHTML = `
        <div style="text-align: center;">
          <div style="display: flex; justify-content: space-between; align-items: center; max-width: 580px; margin: 0 auto 10px auto;">
            <span style="font-size: 1.15rem; font-weight: 800; color: #0369A1;">
              Ronda ${round} de ${maxRounds} | Aciertos: ${score}
            </span>
            <span id="bubbleSecondsText" style="font-size: 1.15rem; font-weight: 900; color: #DC2626;">
              ⏱️ ¡${timeLeft}s para atraparla!
            </span>
          </div>

          <!-- Barra de tiempo interactiva -->
          <div class="timer-progress-track" style="max-width: 580px; margin: 0 auto 16px auto;">
            <div id="bubbleTimerBar" class="timer-progress-fill" style="width: 100%;"></div>
          </div>

          <!-- Pregunta grande y viva -->
          <div class="anim-result-pop" style="font-size: 2.6rem; font-weight: 900; background: #FFF; border: 3px solid #0284C7; display: inline-block; padding: 10px 42px; border-radius: 26px; box-shadow: 0 5px 0 #0284C7; margin-bottom: 12px;">
            ¿Cuánto es ${t} × ${f}?
          </div>

          <div id="bubbleStatusMsg" style="font-size: 1.35rem; font-weight: 900; min-height: 38px; margin-bottom: 6px;"></div>

          <div class="catch-bubbles-arena" id="bubblesArena"></div>
        </div>
      `;

      const arena = document.getElementById('bubblesArena');
      const timerBar = document.getElementById('bubbleTimerBar');
      const secondsText = document.getElementById('bubbleSecondsText');
      const statusMsg = document.getElementById('bubbleStatusMsg');
      const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'];

      let roundFinished = false;

      // Iniciar cuenta regresiva: si se acaba el tiempo, CAMBIA AL TIRO a la siguiente
      const totalTicks = TIME_PER_QUESTION * 10;
      let ticksRemaining = totalTicks;

      this.roundCountdown = setInterval(() => {
        ticksRemaining--;
        const pct = (ticksRemaining / totalTicks) * 100;
        if (timerBar) timerBar.style.width = `${pct}%`;
        const secs = Math.ceil(ticksRemaining / 10);
        if (secondsText) secondsText.innerText = `⏱️ ¡${secs}s para atraparla!`;

        if (ticksRemaining <= 0 && !roundFinished) {
          roundFinished = true;
          clearInterval(this.roundCountdown);
          sound.play('wrong');

          if (statusMsg) {
            statusMsg.innerHTML = `<span style="color: #DC2626; font-size: 1.35rem;" class="anim-shake">⏰ ¡TIEMPO AGOTADO! La respuesta era ${correct}. ¡Siguiente pregunta!</span>`;
          }

          // Deshabilitar burbujas
          document.querySelectorAll('.bubble-target').forEach(b => b.style.pointerEvents = 'none');

          // CAMBIA AL TIRO a otra pregunta (550ms para ver el aviso)
          setTimeout(() => {
            round++;
            playRound();
          }, 550);
        }
      }, 100);

      // Renderizar burbujas
      allAnswers.forEach((ans, i) => {
        const bubble = document.createElement('div');
        bubble.className = 'bubble-target bubble-item anim-pop';
        bubble.style.backgroundColor = colors[i % colors.length];
        bubble.style.left = `${12 + i * 22}%`;
        bubble.style.top = `${25 + (i % 2) * 35}%`;
        bubble.innerText = ans;

        bubble.addEventListener('click', () => {
          if (roundFinished) return;
          roundFinished = true;
          clearInterval(this.roundCountdown);

          // Deshabilitar clics posteriores
          document.querySelectorAll('.bubble-target').forEach(b => b.style.pointerEvents = 'none');

          if (ans === correct) {
            score++;
            sound.play('correct');
            confetti.launch(35);
            bubble.classList.remove('bubble-item');
            bubble.classList.add('anim-result-pop');
            bubble.style.transform = 'scale(1.5)';
            if (statusMsg) {
              statusMsg.innerHTML = `<span style="color: #16A34A; font-size: 1.35rem;" class="anim-bounce">🎉 ¡ATRAPADA! ${t} × ${f} = ${correct} (+1 punto)</span>`;
            }

            // Cambiar a la siguiente pregunta
            setTimeout(() => {
              round++;
              playRound();
            }, 600);
          } else {
            // SI RESPONDE MAL: CAMBIA AL TIRO A OTRA PREGUNTA
            sound.play('wrong');
            bubble.classList.remove('bubble-item');
            bubble.classList.add('anim-shake');
            bubble.style.backgroundColor = '#DC2626';

            if (statusMsg) {
              statusMsg.innerHTML = `<span style="color: #DC2626; font-size: 1.35rem;" class="anim-shake">❌ ¡FALLASTE! La correcta era ${correct}. ¡Siguiente pregunta!</span>`;
            }

            // Cambiar al tiro
            setTimeout(() => {
              round++;
              playRound();
            }, 650);
          }
        });
        arena.appendChild(bubble);
      });
    };

    playRound();
  }

  /* ==========================================================================
     3. CONSTRUYE LA MULTIPLICACIÓN (Canastas y Elementos)
     Canastas que vibran y manzanas que caen rebotando
     ========================================================================== */
  initBuildMultiplicationGame() {
    const stage = document.getElementById('gamePlayStage');
    const isAll = this.selectedTable === 'all';
    const chosenTable = isAll ? (Math.floor(Math.random() * 4) + 2) : Math.min(6, parseInt(this.selectedTable));
    const targetGroups = chosenTable;
    const targetItems = Math.floor(Math.random() * 4) + 2; // 2 a 5

    let currentGroups = 1;
    let currentItemsPerGroup = 1;

    const render = () => {
      stage.innerHTML = `
        <div style="text-align: center;">
          <div style="background: #ECFDF5; border: 3px solid #059669; border-radius: 24px; padding: 18px 28px; display: inline-block; margin-bottom: 22px;">
            <h3 style="font-size: 1.7rem; color: #065F46; font-weight: 900;">
              Desafío: Representa ${targetGroups} × ${targetItems} (${targetGroups * targetItems} en total)
            </h3>
            <p style="font-size: 1.1rem; color: #047857; font-weight: 700; margin-top: 4px;">
              Forma exactamente ${targetGroups} canastas con ${targetItems} manzanas dentro de cada una.
            </p>
          </div>

          <div style="display: flex; gap: 24px; justify-content: center; margin-bottom: 24px; flex-wrap: wrap;">
            <div style="background: #FFF; border: 3px solid #1E293B; border-radius: 20px; padding: 14px 26px; box-shadow: 0 4px 0 #1E293B;">
              <span style="font-weight: 800; font-size: 1.2rem;">Canastas (Grupos): ${currentGroups}</span>
              <div style="margin-top: 8px; display: flex; gap: 10px; justify-content: center;">
                <button class="btn btn-secondary btn-sm" id="btnLessG" style="min-width: 48px; font-size: 1.3rem;">-</button>
                <button class="btn btn-primary btn-sm" id="btnMoreG" style="min-width: 48px; font-size: 1.3rem;">+</button>
              </div>
            </div>

            <div style="background: #FFF; border: 3px solid #1E293B; border-radius: 20px; padding: 14px 26px; box-shadow: 0 4px 0 #1E293B;">
              <span style="font-weight: 800; font-size: 1.2rem;">Manzanas por Canasta: ${currentItemsPerGroup}</span>
              <div style="margin-top: 8px; display: flex; gap: 10px; justify-content: center;">
                <button class="btn btn-secondary btn-sm" id="btnLessI" style="min-width: 48px; font-size: 1.3rem;">-</button>
                <button class="btn btn-primary btn-sm" id="btnMoreI" style="min-width: 48px; font-size: 1.3rem;">+</button>
              </div>
            </div>
          </div>

          <!-- Canastas visuales que vibran -->
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-bottom: 24px; min-height: 120px;">
            ${Array.from({ length: currentGroups }).map((_, gIdx) => `
              <div style="background: #FEF3C7; border: 3px solid #D97706; border-radius: 24px; padding: 16px; min-width: 115px; text-align: center; box-shadow: 0 5px 0 #D97706;" class="anim-pop anim-basket-wobble">
                <div style="font-size: 1.9rem; min-height: 44px; margin-bottom: 6px;">
                  ${Array.from({ length: currentItemsPerGroup }).map(() => `<span class="anim-apple-drop" style="display: inline-block;">🍎</span>`).join('')}
                </div>
                <span style="font-weight: 800; color: #92400E; font-size: 0.95rem;">Canasta ${gIdx + 1}</span>
              </div>
            `).join('')}
          </div>

          <div style="font-size: 1.6rem; font-weight: 900; margin-bottom: 22px;">
            Total actual: ${currentGroups} × ${currentItemsPerGroup} = <span class="anim-result-pop" style="display: inline-block; color: #B45309;">${currentGroups * currentItemsPerGroup}</span> manzanas
          </div>

          <button class="btn btn-success btn-lg anim-bounce" id="btnCheckBuild">
            ¡Verificar Construcción! 🚀
          </button>
          <div id="buildFeedback" style="margin-top: 18px; font-size: 1.4rem; font-weight: 900; min-height: 38px;"></div>
        </div>
      `;

      document.getElementById('btnLessG').onclick = () => { sound.play('click'); if (currentGroups > 1) { currentGroups--; render(); } };
      document.getElementById('btnMoreG').onclick = () => { sound.play('click'); if (currentGroups < 8) { currentGroups++; render(); } };
      document.getElementById('btnLessI').onclick = () => { sound.play('star'); if (currentItemsPerGroup > 1) { currentItemsPerGroup--; render(); } };
      document.getElementById('btnMoreI').onclick = () => { sound.play('star'); if (currentItemsPerGroup < 8) { currentItemsPerGroup++; render(); } };

      document.getElementById('btnCheckBuild').onclick = () => {
        const feedback = document.getElementById('buildFeedback');
        if (currentGroups === targetGroups && currentItemsPerGroup === targetItems) {
          sound.play('fanfare');
          confetti.launch(70);
          StudentStorage.addPoints(20);
          StudentStorage.unlockAchievement('builder');
          if (typeof updateHeaderStats === 'function') updateHeaderStats();
          feedback.innerHTML = `<span style="color: #16A34A;" class="anim-bounce">¡PERFECTO! Has construido exactamente ${targetGroups} canastas de ${targetItems} = ${targetGroups * targetItems}! 🌟</span>`;
          setTimeout(() => gamesHub.initBuildMultiplicationGame(), 1800);
        } else {
          sound.play('wrong');
          feedback.innerHTML = `<span style="color: #DC2626;" class="anim-shake">Aún no coincide. Necesitas ${targetGroups} canastas y ${targetItems} manzanas en cada una. ¡Sigue probando!</span>`;
        }
      };
    };

    render();
  }

  /* ==========================================================================
     4. ¿QUIÉN TIENE LA RESPUESTA?
     Personajes que saltan y reaccionan
     ========================================================================== */
  initWhoHasAnswerGame() {
    const stage = document.getElementById('gamePlayStage');
    const t = this.getTableForQuestion();
    const f = Math.floor(Math.random() * 8) + 2;
    const correct = t * f;

    const chars = [
      { name: 'Simón el Zorro', avatar: 'IMAGEN/avatar2.svg' },
      { name: 'Byte el Robot', avatar: 'IMAGEN/avatar3.svg' },
      { name: 'Rex el Dino', avatar: 'IMAGEN/avatar5.svg' }
    ].sort(() => Math.random() - 0.5);

    const values = [
      correct,
      correct + (Math.random() > 0.5 ? 4 : -4),
      correct + (Math.random() > 0.5 ? t : -t)
    ].filter((v, i, self) => self.indexOf(v) === i);

    while (values.length < 3) values.push(correct + values.length * 3);
    values.sort(() => Math.random() - 0.5);

    stage.innerHTML = `
      <div style="text-align: center;">
        <div class="anim-result-pop" style="font-size: 2.3rem; font-weight: 900; background: #FFF; border: 3px solid #1E293B; display: inline-block; padding: 12px 38px; border-radius: 26px; box-shadow: 0 5px 0 #1E293B; margin-bottom: 26px;">
          ¿Quién tiene el resultado de: ${t} × ${f}?
        </div>

        <div class="characters-quiz-grid">
          ${chars.map((c, i) => `
            <div class="char-answer-card anim-pop" id="charCard_${i}" style="animation-delay: ${i * 0.1}s;" onclick="gamesHub.checkWhoAnswer(${values[i]}, ${correct}, this, ${i})">
              <img src="${c.avatar}" id="charAvatar_${i}" class="char-avatar-box anim-float" alt="${c.name}"/>
              <h4 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 10px;">${c.name}</h4>
              <div class="char-speech-bubble anim-pulse">
                💬 "${values[i]}"
              </div>
            </div>
          `).join('')}
        </div>
        <div id="whoFeedback" style="font-size: 1.4rem; font-weight: 900; min-height: 40px;"></div>
      </div>
    `;
  }

  checkWhoAnswer(selected, correct, cardElement, idx) {
    const feedback = document.getElementById('whoFeedback');
    const avatar = document.getElementById(`charAvatar_${idx}`);

    if (selected === correct) {
      sound.play('correct');
      confetti.launch(50);
      cardElement.style.background = '#86EFAC';
      if (avatar) avatar.classList.add('anim-char-jump');
      cardElement.classList.add('anim-bounce');
      StudentStorage.addPoints(15);
      if (typeof updateHeaderStats === 'function') updateHeaderStats();
      feedback.innerHTML = `<span style="color: #16A34A;" class="anim-bounce">¡Correcto! ¡Ese personaje tenía la respuesta exacta! 🎉</span>`;
      setTimeout(() => gamesHub.initWhoHasAnswerGame(), 1500);
    } else {
      sound.play('wrong');
      cardElement.style.background = '#FCA5A5';
      cardElement.classList.add('anim-shake');
      feedback.innerHTML = `<span style="color: #DC2626;" class="anim-shake">¡Oh no! Ese resultado no es correcto. ¡Prueba con otro personaje!</span>`;
    }
  }

  /* ==========================================================================
     5. ARRASTRA Y COMPLETA (Drag & Drop + Touch Click)
     ========================================================================== */
  initDragAndDropGame() {
    const stage = document.getElementById('gamePlayStage');
    const isAll = this.selectedTable === 'all';
    const mainTable = isAll ? null : parseInt(this.selectedTable);

    let items = [];
    if (!isAll) {
      const factors = [2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 4);
      items = factors.map(f => ({ t: mainTable, f: f, res: mainTable * f }));
    } else {
      items = [
        { t: 3, f: 8, res: 24 },
        { t: 5, f: 6, res: 30 },
        { t: 7, f: 4, res: 28 },
        { t: 9, f: 5, res: 45 }
      ];
    }

    items.sort(() => Math.random() - 0.5);

    stage.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <p style="font-size: 1.25rem; font-weight: 700; color: #475569;">
          Selecciona una ficha numérica amarilla de la derecha y colócala en su casilla a la izquierda:
        </p>
      </div>

      <div class="drag-drop-arena">
        <div class="drop-zones-col">
          ${items.map((it, idx) => `
            <div class="drop-target-row anim-pop" data-target="${it.res}" id="slotRow_${idx}">
              <span>${it.t} × ${it.f} = </span>
              <div class="drop-target-slot" id="slot_${idx}" onclick="gamesHub.placeChipInSlot(${idx}, ${it.res})">
                <span style="color: #94A3B8; font-size: 1rem;">Toca aquí</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="drag-items-col" id="chipsContainer">
          ${items.map(it => it.res).sort(() => Math.random() - 0.5).map((num) => `
            <div class="draggable-number anim-pop" id="chip_${num}" onclick="gamesHub.selectChip(${num})">
              ${num}
            </div>
          `).join('')}
        </div>
      </div>
      <div id="dragFeedback" style="text-align: center; font-size: 1.35rem; font-weight: 900; min-height: 40px;"></div>
    `;

    this._activeChips = { items, selectedChip: null, completed: 0 };
  }

  selectChip(val) {
    sound.play('click');
    document.querySelectorAll('.draggable-number').forEach(c => c.style.outline = 'none');
    const chip = document.getElementById(`chip_${val}`);
    if (chip) {
      chip.style.outline = '4px solid #3B82F6';
      chip.classList.add('anim-bounce');
      setTimeout(() => chip.classList.remove('anim-bounce'), 400);
      this._activeChips.selectedChip = val;
    }
  }

  placeChipInSlot(slotIdx, expectedVal) {
    if (!this._activeChips || !this._activeChips.selectedChip) {
      sound.play('wrong');
      const feedback = document.getElementById('dragFeedback');
      if (feedback) feedback.innerText = "¡Primero haz clic en una ficha amarilla de la derecha!";
      return;
    }

    const val = this._activeChips.selectedChip;
    const slot = document.getElementById(`slot_${slotIdx}`);
    const feedback = document.getElementById('dragFeedback');

    if (val === expectedVal) {
      sound.play('correct');
      confetti.launch(20);
      slot.innerHTML = `<span style="color: #065F46; font-size: 1.35rem;" class="anim-result-pop">${val} ✅</span>`;
      slot.style.background = '#86EFAC';
      slot.style.border = '2px solid #16A34A';
      slot.onclick = null;

      const chip = document.getElementById(`chip_${val}`);
      if (chip) chip.style.display = 'none';

      this._activeChips.selectedChip = null;
      this._activeChips.completed++;

      if (this._activeChips.completed === 4) {
        sound.play('fanfare');
        confetti.launch(70);
        StudentStorage.addPoints(25);
        if (typeof updateHeaderStats === 'function') updateHeaderStats();
        if (feedback) feedback.innerHTML = `<span style="color: #16A34A;" class="anim-bounce">¡Extraordinario! Completaste todas las casillas correctamente (+25 pts) 🌟</span>`;
      }
    } else {
      sound.play('wrong');
      if (feedback) feedback.innerHTML = `<span style="color: #DC2626;" class="anim-shake">${val} no es el resultado para esa operación. ¡Intenta con otra!</span>`;
    }
  }

  /* ==========================================================================
     6. DESAFÍO CONTRA EL TIEMPO (60 Segundos) con Racha de Combos
     ========================================================================== */
  initTimeAttackGame() {
    const stage = document.getElementById('gamePlayStage');
    let timeLeft = 60;
    this._timeScore = 0;
    this._comboStreak = 0;

    const nextProblem = () => {
      const currentT = this.getTableForQuestion();
      const currentF = Math.floor(Math.random() * 9) + 2;
      const currentCorrect = currentT * currentF;

      const distractors = [
        currentCorrect + currentT,
        Math.max(2, currentCorrect - currentT),
        currentCorrect + 2
      ].sort(() => Math.random() - 0.5);

      const options = [currentCorrect, ...distractors].sort(() => Math.random() - 0.5);

      const problemArea = document.getElementById('timeAttackProblem');
      if (problemArea) {
        problemArea.innerHTML = `
          <div class="anim-result-pop" style="font-size: 2.8rem; font-weight: 900; margin-bottom: 24px; color: #1E293B;">
            ${currentT} × ${currentF} = ?
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px; max-width: 440px; margin: 0 auto;">
            ${options.map(opt => `
              <button class="btn btn-warning btn-lg anim-pop" onclick="gamesHub.answerTimeAttack(${opt}, ${currentCorrect})">
                ${opt}
              </button>
            `).join('')}
          </div>
        `;
      }
    };

    stage.innerHTML = `
      <div style="text-align: center;">
        <div style="display: flex; justify-content: space-between; align-items: center; max-width: 560px; margin: 0 auto 24px auto; background: #FFF; border: 3px solid #1E293B; border-radius: 24px; padding: 16px 30px; box-shadow: 0 4px 0 #1E293B;">
          <div id="timeClockBox" style="font-size: 1.45rem; font-weight: 900; color: #DC2626;">
            ⏱️ Tiempo: <span id="timeAttackClock">60</span>s
          </div>
          <div id="comboBanner" style="font-size: 1.15rem; font-weight: 800; color: #F59E0B;">
            🔥 Racha: 0
          </div>
          <div style="font-size: 1.45rem; font-weight: 900; color: #16A34A;">
            ⭐ Puntos: <span id="timeAttackScore">0</span>
          </div>
        </div>

        <div id="timeAttackProblem"></div>
      </div>
    `;

    nextProblem();

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      timeLeft--;
      const clock = document.getElementById('timeAttackClock');
      const clockBox = document.getElementById('timeClockBox');
      if (clock) clock.innerText = timeLeft;

      if (timeLeft <= 10 && clockBox) {
        clockBox.classList.add('anim-pulse');
      }

      if (timeLeft <= 0) {
        clearInterval(this.timerInterval);
        sound.play('fanfare');
        confetti.launch(90);
        StudentStorage.addPoints(this._timeScore * 5);
        StudentStorage.unlockAchievement('speedster');
        if (typeof updateHeaderStats === 'function') updateHeaderStats();

        stage.innerHTML = `
          <div class="anim-pop" style="text-align: center; padding: 30px;">
            <h2 style="font-size: 2.5rem; color: #1E293B; margin-bottom: 14px;">¡TIEMPO FINALIZADO! ⏱️🏁</h2>
            <p style="font-size: 1.5rem; font-weight: 800; color: #475569; margin-bottom: 24px;">
              Lograste resolver <strong>${this._timeScore} multiplicaciones</strong> en 60 segundos.
            </p>
            <button class="btn btn-primary btn-lg" onclick="gamesHub.initTimeAttackGame()">
              ¡Intentar de nuevo! ⚡
            </button>
          </div>
        `;
      }
    }, 1000);
  }

  answerTimeAttack(selected, correct) {
    const comboBanner = document.getElementById('comboBanner');
    if (selected === correct) {
      this._timeScore = (this._timeScore || 0) + 1;
      this._comboStreak = (this._comboStreak || 0) + 1;
      sound.play('correct');
      const scoreEl = document.getElementById('timeAttackScore');
      if (scoreEl) scoreEl.innerText = this._timeScore;

      if (comboBanner) {
        comboBanner.innerHTML = `🔥 Racha: ${this._comboStreak}!`;
        comboBanner.classList.remove('anim-bounce');
        void comboBanner.offsetWidth;
        comboBanner.classList.add('anim-bounce');
      }
    } else {
      this._comboStreak = 0;
      sound.play('wrong');
      if (comboBanner) comboBanner.innerHTML = `🔥 Racha: 0`;
    }

    const currentT = this.getTableForQuestion();
    const currentF = Math.floor(Math.random() * 9) + 2;
    const currentCorrect = currentT * currentF;

    const distractors = [
      currentCorrect + currentT,
      Math.max(2, currentCorrect - currentT),
      currentCorrect + 2
    ].sort(() => Math.random() - 0.5);

    const options = [currentCorrect, ...distractors].sort(() => Math.random() - 0.5);

    const problemArea = document.getElementById('timeAttackProblem');
    if (problemArea) {
      problemArea.innerHTML = `
        <div class="anim-result-pop" style="font-size: 2.8rem; font-weight: 900; margin-bottom: 24px; color: #1E293B;">
          ${currentT} × ${currentF} = ?
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px; max-width: 440px; margin: 0 auto;">
          ${options.map(opt => `
            <button class="btn btn-warning btn-lg anim-pop" onclick="gamesHub.answerTimeAttack(${opt}, ${currentCorrect})">
              ${opt}
            </button>
          `).join('')}
        </div>
      `;
    }
  }
}

const gamesHub = new GamesHub();
