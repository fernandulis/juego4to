# 🚀 PLATAFORMA EDUCATIVA "MIS TABLAS"
## Proyecto Interactivo de Aprendizaje Matemático y Preparación SIMCE (4° Básico)

**Departamento de Informática**  
**Unidad 4:** Elaboración de apps para dispositivos electrónicos móviles  
**Objetivo de Aprendizaje (OA5):** Desarrollar aplicaciones interactivas orientadas al aprendizaje matemático y entrenamiento tipo SIMCE, aplicando estrategias de análisis, diseño algorítmico y control de versiones.

---

## 📋 Descripción del Proyecto

**"Mis Tablas"** es una plataforma educativa web y móvil diseñada especialmente para estudiantes de **4° básico** (9 a 10 años). Su propósito central es superar la memorización monótona de operaciones aisladas (como *"6 × 1 = 6"*) mediante un entorno gamificado, dinámico y multisensorial que fomenta la comprensión conceptual de la multiplicación como suma iterada y arreglos rectangulares.

### ✨ Características Principales
1. **Diseño Dinámico para Niños**: Todos los botones cuentan con física arcade en 3D, animaciones de elevación, brillos, rebotes festivos (`anim-bounce`) y efectos táctiles.
2. **Efectos de Sonido Integrados (Web Audio API)**: Sintetizador nativo de audio sin dependencias externas (campanillas de acierto, efectos arcade, fanfarria de victoria y modo silencio).
3. **Animación de Confeti Festivo (Canvas)**: Celebraciones visuales al responder correctamente o superar niveles.
4. **100% Autónomo y Offline**: Funciona completamente en XAMPP sin requerir librerías externas o conexión a internet.
5. **Adaptabilidad Móvil (Responsive Design)**: Diseñado bajo filosofía mobile-first para usarse en computadores, tablets y celulares.

---

## 🗂️ Estructura del Proyecto

```text
htdocs/
└── misTablas/
    ├── index.html                  # ETAPA 1: Login del estudiante y selección de Avatar
    └── Sistema/
        ├── index.html              # ETAPA 2, 3 y 4: Menú Principal, Módulos y Ensayo SIMCE
        ├── CSS/
        │   ├── animaciones.css     # Animaciones clave, botones 3D, rebotes y físicas
        │   ├── style.css           # Sistema de diseño, tarjetas, layouts y componentes
        │   ├── login.css           # Estilos de la pantalla de bienvenida y registro
        │   └── responsive.css      # Adaptaciones para celulares y tablets
        ├── IMAGEN/
        │   ├── logo.svg            # Logotipo de la plataforma
        │   ├── avatar1.svg         # Mateo el Astronauta
        │   ├── avatar2.svg         # Simón el Zorrito
        │   ├── avatar3.svg         # Byte el Robotito
        │   ├── avatar4.svg         # Luna la Maga
        │   ├── avatar5.svg         # Rex el Dino
        │   ├── avatar6.svg         # Super Estrellita
        │   ├── trofeo.svg          # Trofeo dorado
        │   ├── estrella.svg        # Estrella de calificación
        │   └── medalla.svg         # Medalla de logro
        └── JS/
            ├── audio.js            # Sintetizador de efectos sonoros Web Audio API
            ├── confetti.js         # Partículas de confeti en Canvas HTML5
            ├── storage.js          # Persistencia de datos y logros en localStorage
            ├── aprendizaje.js      # Taller de tablas (2 al 10), grupos, patrones y práctica
            ├── juegos.js           # 6 minijuegos educativos no monótonos
            ├── simce.js            # Motor del Ensayo SIMCE de 10 preguntas contextualizadas
            └── main.js             # Coordinador de vistas y eventos de interfaz
```

---

## 🕹️ Etapas del Proyecto

### 1. Etapa 1: Ingreso del Estudiante (`misTablas/index.html`)
- Nombre de la plataforma y logotipo vectorial.
- Campo de texto validado para el nombre del estudiante (mínimo 2 caracteres).
- Galería de 6 avatares ilustrados: Astronauta, Zorro, Robot, Maga, Dino y Superestrella.
- Validación con animación de sacudida cómica (`anim-shake`) y aviso didáctico.
- Botón animado de acceso directo a `Sistema/index.html`.

### 2. Etapa 2: Menú Principal y Perfil Gamificado (`Sistema/index.html`)
- **Barra superior**: Avatar seleccionado, nombre, rango del estudiante (ej: *Cadete de las Tablas*, *Explorador*, *Supercampeón SIMCE*), estrellas acumuladas y puntaje total.
- **Acceso rápido**: Tarjetas interactivas con animaciones hover y 3D hacia todos los módulos.
- Controles de sonido (Mute / Unmute) y reinicio de progreso.

### 3. Etapa 3: Aprendizaje Interactivo de Tablas (del 2 al 10)
- **Representación Concreta**: Visualización con grupos de objetos reales (manzanas, estrellas, autitos, galletas, etc.) y suma iterada: `4 × 6 = 6 + 6 + 6 + 6 = 24`.
- **Superpoderes y Patrones**: Explicación de los trucos matemáticos de cada tabla (el doble en la tabla del 2, el reloj en la del 5, los dedos en la del 9, el cero en la del 10).
- **Botón de Pistas Didácticas**: Estrategias de cálculo mental cuando el alumno tiene dudas.
- **Práctica Guiada**: 5 desafíos interactivos por tabla con asignación de hasta 3 estrellas.

### 4. Módulo de Juegos y Desafíos (6 Dinámicas)
1. 🧠 **Memoria Matemática**: Emparejar tarjetas 3D que relacionan multiplicación con producto.
2. 🎈 **Atrapa el Resultado**: Burbujas flotantes en movimiento continuo para poner a prueba los reflejos.
3. 🍎 **Construye la Multiplicación**: Manipulación directa de canastas y manzanas para modelar grupos iguales.
4. 🎭 **¿Quién tiene la respuesta?**: Personajes con letreros para razonar y seleccionar al correcto.
5. 🧩 **Arrastra y Completa**: Asociación táctil / drag & drop entre operaciones y fichas numéricas.
6. ⚡ **Desafío Contra el Tiempo (60s)**: Carrera de velocidad para batir récords personales.

### 5. Etapa 4: Ensayo Matemático Tipo SIMCE (4° Básico)
- **Panel lateral numerado**: Navegador con 10 botones interactivos que indican el estado de cada pregunta (Pendiente, Respondida y Activa).
- **10 Situaciones Contextualizadas Reales**:
  - Compra de globos para la kermesse escolar.
  - Arreglo de filas de sillas en el salón de actos.
  - Cajas de lápices de arte.
  - Ahorro de dinero en la panadería.
  - Bandejas de galletas horneadas.
  - Álbum de figuras de fútbol.
  - Organización de repisas en la biblioteca.
  - Siembra de hortalizas en el huerto escolar.
  - Paquetes de jugo para el paseo de curso.
  - Puntuaciones en videojuegos matemáticos.
- **Hoja de Respuestas y Alternativas (A, B, C, D)** con retroalimentación háptica y visual.
- **Pantalla de Resultados y Nivel de Logro SIMCE**:
  - *Nivel Destacado / Sobresaliente* (9 - 10 puntos).
  - *Nivel Adecuado* (7 - 8 puntos).
  - *Nivel Elemental* (5 - 6 puntos).
  - *Nivel Inicial* (Menos de 5 puntos).
- **Retroalimentación Didáctica Detallada**: Muestra la respuesta del alumno, la correcta y la explicación paso a paso de cada ejercicio.

---

## 🛠️ Cómo Ejecutar en XAMPP

1. Iniciar **XAMPP Control Panel** y presionar **Start** en el módulo **Apache**.
2. Abrir cualquier navegador web moderno (Google Chrome, Microsoft Edge, Firefox).
3. Ingresar a cualquiera de las siguientes URLs locales:
   - `http://localhost/misTablas/` (Ruta directa oficial del proyecto)
   - `http://localhost/codigos/trabajosimce/` (Ruta del espacio de trabajo)
4. Ingresar nombre, seleccionar avatar y ¡disfrutar de la aventura matemática!

---

## 🐙 Guía para GitHub y Control de Versiones

Para registrar los avances de acuerdo a las evaluaciones formativas y sumativas del semestre, sigue estos pasos en la terminal:

```bash
# 1. Inicializar el repositorio Git
git init

# 2. Agregar todos los archivos del proyecto
git add .

# 3. Primer commit (Evaluación Formativa 1: Login, Menú y Animaciones)
git commit -m "feat: interfaz interactiva 4to basico, login con avatares y menú con animaciones 3D"

# 4. Vincular con tu repositorio en GitHub
git remote add origin https://github.com/TU-USUARIO/misTablas-4basico.git
git branch -M main
git push -u origin main
```
