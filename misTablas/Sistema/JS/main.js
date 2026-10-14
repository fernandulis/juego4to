/* ==========================================================================
   MAIN.JS - Coordinador Principal de la Plataforma "Mis Tablas"
   Navegación fluida entre módulos, sincronización de perfil y eventos
   ========================================================================== */

function updateHeaderStats() {
  const student = StudentStorage.get();

  const elName = document.getElementById('headerStudentName');
  const elAvatar = document.getElementById('headerAvatarImg');
  const elRank = document.getElementById('headerStudentRank');
  const elStars = document.getElementById('headerStarsCount');
  const elPoints = document.getElementById('headerPointsCount');

  if (elName) elName.innerText = student.name || "Estudiante";
  if (elAvatar) elAvatar.src = `IMAGEN/${student.avatar || 'avatar1.svg'}`;
  if (elRank) elRank.innerText = StudentStorage.getRankTitle(student.score);
  if (elStars) elStars.innerText = student.stars || 0;
  if (elPoints) elPoints.innerText = student.score || 0;

  // Actualizar también en el banner de bienvenida del menú
  const heroName = document.getElementById('heroStudentName');
  const heroAvatar = document.getElementById('heroAvatarImg');
  if (heroName) heroName.innerText = student.name || "Estudiante";
  if (heroAvatar) heroAvatar.src = `IMAGEN/${student.avatar || 'avatar1.svg'}`;
}

function switchView(viewId) {
  sound.play('click');

  // Ocultar todas las vistas
  document.querySelectorAll('.view-section').forEach(view => {
    view.classList.remove('active-view');
  });

  // Quitar estado activo de los botones de navegación
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-view') === viewId) {
      btn.classList.add('active');
    }
  });

  // Mostrar vista seleccionada
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add('active-view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Inicializar o refrescar contenido específico de la vista
  if (viewId === 'view-progreso') {
    renderProgressView();
  } else if (viewId === 'view-aprendizaje') {
    aprendizaje.renderTableIslands();
  }
}

function renderProgressView() {
  const student = StudentStorage.get();
  const tablesContainer = document.getElementById('progressTablesList');
  const achievementsContainer = document.getElementById('progressAchievementsList');

  // Gráfico / Barras de progreso de cada tabla (2 al 10)
  if (tablesContainer) {
    tablesContainer.innerHTML = '';
    for (let t = 2; t <= 10; t++) {
      const prog = student.tablesProgress[t] || { stars: 0, completed: false, attempts: 0 };
      const percentage = Math.round((prog.stars / 3) * 100);

      const item = document.createElement('div');
      item.className = 'table-progress-item';
      item.innerHTML = `
        <div class="table-progress-name">
          Tabla del ${t}
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${percentage}%"></div>
          </div>
          <span style="font-weight: 800; font-size: 0.95rem;">${'⭐'.repeat(prog.stars)}${'☆'.repeat(3 - prog.stars)}</span>
        </div>
      `;
      tablesContainer.appendChild(item);
    }
  }

  // Galería de medallas y logros
  if (achievementsContainer) {
    achievementsContainer.innerHTML = '';
    student.achievements.forEach(ach => {
      const card = document.createElement('div');
      card.className = `achievement-card ${ach.unlocked ? '' : 'locked'}`;
      card.innerHTML = `
        <div class="achievement-icon">${ach.unlocked ? ach.icon : '🔒'}</div>
        <div class="achievement-title">${ach.title}</div>
        <div class="achievement-desc">${ach.desc}</div>
        <div style="margin-top: 8px; font-weight: 800; font-size: 0.8rem; color: ${ach.unlocked ? '#16A34A' : '#94A3B8'};">
          ${ach.unlocked ? '¡Desbloqueado! 🏆' : 'Por desbloquear'}
        </div>
      `;
      achievementsContainer.appendChild(card);
    });
  }

  // Estadísticas globales
  const totalCompleted = StudentStorage.getCompletedTablesCount();
  const simceAttempts = (student.simceHistory || []).length;
  const bestSimce = (student.simceHistory || []).reduce((max, h) => Math.max(max, h.score), 0);

  const elCompleted = document.getElementById('statCompletedTables');
  const elSimceBest = document.getElementById('statSimceBest');

  if (elCompleted) elCompleted.innerText = `${totalCompleted} de 9`;
  if (elSimceBest) elSimceBest.innerText = `${bestSimce} / 10`;
}

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar módulos
  updateHeaderStats();
  aprendizaje.init();
  gamesHub.init();
  simceEngine.init();

  // Controladores de Pestañas de Navegación
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      if (view) switchView(view);
    });
  });

  // Tarjetas de Acceso Rápido del Dashboard (Menú Principal)
  document.querySelectorAll('[data-goto-view]').forEach(card => {
    card.addEventListener('click', () => {
      const view = card.getAttribute('data-goto-view');
      if (view) switchView(view);
    });
  });

  // Botón de Silenciar / Activar Sonido
  const btnMute = document.getElementById('btnToggleMute');
  if (btnMute) {
    const updateMuteIcon = () => {
      btnMute.innerHTML = sound.isMuted() ? '🔇 <span class="hide-mobile">Silencio</span>' : '🔊 <span class="hide-mobile">Sonido</span>';
    };
    updateMuteIcon();
    btnMute.addEventListener('click', () => {
      sound.toggleMute();
      updateMuteIcon();
      if (!sound.isMuted()) sound.play('click');
    });
  }

  // Botón de Reiniciar Progreso
  const btnReset = document.getElementById('btnResetProgress');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      sound.play('click');
      if (confirm('¿Estás seguro de que deseas reiniciar tu progreso y estrellas?')) {
        StudentStorage.resetProgress();
        updateHeaderStats();
        aprendizaje.renderTableIslands();
        renderProgressView();
        alert('¡Progreso reiniciado! Comienza una nueva aventura.');
      }
    });
  }

  // Botón de Salir / Cambiar Estudiante (volver a misTablas/index.html)
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sound.play('click');
      window.location.href = '../index.html';
    });
  }
});
