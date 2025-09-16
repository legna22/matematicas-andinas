# Arquitectura del Sistema - Matemáticas Andinas 🏗️

Este documento describe la arquitectura técnica del proyecto Matemáticas Andinas, incluyendo la estructura de componentes, patrones de diseño y puntos de extensión.

## 📋 Tabla de Contenidos

- [Visión General](#visión-general)
- [Arquitectura Frontend](#arquitectura-frontend)
- [Arquitectura Backend](#arquitectura-backend)
- [Flujo de Datos](#flujo-de-datos)
- [Patrones de Diseño](#patrones-de-diseño)
- [Puntos de Extensión](#puntos-de-extensión)
- [Consideraciones de Rendimiento](#consideraciones-de-rendimiento)

## 🎯 Visión General

### Stack Tecnológico

```
┌─────────────────────────────────────────┐
│                Frontend                 │
├─────────────────────────────────────────┤
│ HTML5 + CSS3 + JavaScript (Vanilla)    │
│ Canvas API + Web APIs                   │
│ Responsive Design + PWA Ready           │
└─────────────────────────────────────────┘
                    │
                    │ HTTP/JSON
                    ▼
┌─────────────────────────────────────────┐
│                Backend                  │
├─────────────────────────────────────────┤
│ Flask (Python 3.10+)                   │
│ Jinja2 Templates                       │
│ JSON File Storage                       │
└─────────────────────────────────────────┘
                    │
                    │ File I/O
                    ▼
┌─────────────────────────────────────────┐
│              Persistencia               │
├─────────────────────────────────────────┤
│ JSON Files (levels.json)                │
│ LocalStorage (progreso usuario)         │
│ Static Files (assets)                   │
└─────────────────────────────────────────┘
```

### Principios Arquitectónicos

1. **Separación de Responsabilidades**: Frontend/Backend claramente definidos
2. **Modularidad**: Cada juego es un módulo independiente
3. **Extensibilidad**: Fácil agregar nuevos juegos y niveles
4. **Accesibilidad**: Diseño inclusivo desde la arquitectura
5. **Rendimiento**: Optimizado para dispositivos móviles

## 🎨 Arquitectura Frontend

### Estructura de Archivos

```
static/
├── css/
│   ├── base.css          # Variables y utilidades base
│   ├── game.css          # Estilos compartidos de juegos
│   ├── khipu.css         # Estilos específicos Khipu
│   ├── yupana.css        # Estilos específicos Yupana
│   └── chacana.css       # Estilos específicos Chacana
├── js/
│   ├── main.js           # Navegación y funciones globales
│   ├── game-common.js    # Lógica compartida de juegos
│   ├── khipu.js          # Lógica específica Khipu
│   ├── yupana.js         # Lógica específica Yupana
│   └── chacana.js        # Lógica específica Chacana
└── images/
    ├── backgrounds/      # Fondos e imágenes principales
    ├── logos/           # Logos e iconos
    └── game/            # Assets específicos de juegos
```

### Patrón de Componentes

#### 1. Clase Base GameManager

```javascript
class GameManager {
    constructor(gameType) {
        this.gameType = gameType;
        this.currentLevel = 1;
        this.currentGrade = 1;
        this.score = 0;
        // ... estado común
    }
    
    // Métodos comunes a todos los juegos
    startGame() { /* ... */ }
    pauseGame() { /* ... */ }
    endGame(success) { /* ... */ }
    updateProgress() { /* ... */ }
}
```

#### 2. Clases Específicas de Juego

```javascript
class KhipuGame extends GameManager {
    constructor() {
        super('khipu');
        this.canvas = null;
        this.knots = [];
        // ... estado específico
    }
    
    // Métodos específicos del juego
    drawKhipu() { /* ... */ }
    generateQuestion() { /* ... */ }
    checkAnswer() { /* ... */ }
}
```

### Sistema de Estilos CSS

#### Variables CSS Centralizadas

```css
:root {
    /* CHANGE HERE: Colores del tema */
    --color-mountain-green: #4A6741;
    --color-earth-brown: #8B4513;
    --color-golden-sun: #D2691E;
    
    /* CHANGE HERE: Espaciado */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    
    /* CHANGE HERE: Tipografía */
    --font-family-primary: 'Segoe UI', sans-serif;
    --font-size-base: 1rem;
}
```

#### Metodología BEM

```css
/* Bloque */
.game-container { }

/* Elemento */
.game-container__header { }
.game-container__content { }

/* Modificador */
.game-container--khipu { }
.game-container__header--paused { }
```

### Gestión de Estado

#### Estado Global de la Aplicación

```javascript
window.AppState = {
    selectedGame: null,
    selectedLevel: 'primaria',
    selectedGrade: 1,
    isTransitioning: false
};
```

#### Estado Local de Juegos

```javascript
// Cada juego mantiene su propio estado
class YupanaGame extends GameManager {
    constructor() {
        super('yupana');
        this.boardState = {
            centenas: [0, 0, 0, 0],
            decenas: [0, 0, 0, 0],
            unidades: [0, 0, 0, 0]
        };
    }
}
```

## 🔧 Arquitectura Backend

### Estructura Flask

```python
app.py                    # Aplicación principal
├── Rutas principales
│   ├── / (index)        # Selector de juegos
│   ├── /khipu           # Juego Khipu
│   ├── /yupana          # Juego Yupana
│   ├── /chacana         # Juego Chacana
│   └── /perfil          # Perfil usuario
├── API Routes
│   ├── /api/levels      # CRUD de niveles
│   └── /static/images   # Servir imágenes
└── Error Handlers
    └── 404              # Página no encontrada
```

### Patrón MVC Simplificado

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Model       │    │   Controller    │    │      View       │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ levels.json     │◄──►│ Flask Routes    │◄──►│ Jinja2 Templates│
│ localStorage    │    │ app.py          │    │ HTML Templates  │
│ JSON APIs       │    │ Business Logic  │    │ Static Assets   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Gestión de Datos

#### Estructura de Niveles

```json
{
  "khipu": [
    {
      "grade": 1,
      "level": 1,
      "target_min": 1,
      "target_max": 5,
      "time": 0,
      "desc": "Contar del 1 al 5 con nudos simples",
      "difficulty": "facil",
      "concepts": ["conteo", "números básicos"]
    }
  ]
}
```

#### API de Niveles

```python
@app.route('/api/levels', methods=['GET', 'POST'])
def api_levels():
    if request.method == 'GET':
        return jsonify(load_levels())
    elif request.method == 'POST':
        new_levels = request.json
        save_levels(new_levels)
        return jsonify({"success": True})
```

## 🔄 Flujo de Datos

### Flujo de Navegación

```
1. Usuario accede a /
   ↓
2. Selecciona juego y grado
   ↓
3. JavaScript construye URL: /khipu?grade=3&level=1
   ↓
4. Flask renderiza template con datos del nivel
   ↓
5. JavaScript inicializa juego específico
   ↓
6. Usuario interactúa con el juego
   ↓
7. Progreso se guarda en localStorage
   ↓
8. Al completar: redirección al siguiente nivel
```

### Flujo de Datos del Juego

```
┌─────────────────┐
│ levels.json     │
└─────────┬───────┘
          │ load_levels()
          ▼
┌─────────────────┐    render_template()    ┌─────────────────┐
│ Flask Route     │─────────────────────────►│ HTML Template   │
│ /khipu          │                         │ khipu.html      │
└─────────────────┘                         └─────────┬───────┘
                                                      │
                                                      ▼
                                            ┌─────────────────┐
                                            │ JavaScript      │
                                            │ KhipuGame       │
                                            └─────────┬───────┘
                                                      │
                                                      ▼
                                            ┌─────────────────┐
                                            │ localStorage    │
                                            │ (progreso)      │
                                            └─────────────────┘
```

## 🎨 Patrones de Diseño

### 1. Module Pattern (JavaScript)

```javascript
// Encapsulación de funcionalidades
const GameCommon = {
    GameManager,
    SoundManager,
    GameAnimations,
    AccessibilityManager
};

// Exportar para uso global
window.GameCommon = GameCommon;
```

### 2. Observer Pattern (Eventos)

```javascript
// Eventos personalizados para comunicación entre componentes
document.addEventListener('gameStateChanged', (event) => {
    const { gameType, state } = event.detail;
    updateUI(gameType, state);
});

// Disparar eventos
const event = new CustomEvent('gameStateChanged', {
    detail: { gameType: 'khipu', state: 'completed' }
});
document.dispatchEvent(event);
```

### 3. Strategy Pattern (Juegos)

```javascript
// Diferentes estrategias para cada tipo de juego
const gameStrategies = {
    khipu: KhipuGame,
    yupana: YupanaGame,
    chacana: ChacanaGame
};

// Factory para crear juegos
function createGame(gameType) {
    const GameClass = gameStrategies[gameType];
    return new GameClass();
}
```

### 4. Template Method Pattern (GameManager)

```javascript
class GameManager {
    // Método template que define el flujo
    playLevel() {
        this.initializeLevel();
        this.startGame();
        this.waitForCompletion();
        this.endGame();
    }
    
    // Métodos que las subclases deben implementar
    initializeLevel() { throw new Error('Must implement'); }
    generateQuestion() { throw new Error('Must implement'); }
}
```

## 🔌 Puntos de Extensión

### 1. Agregar Nuevo Juego

#### Backend (Flask)

```python
# CHANGE HERE: Agregar nueva ruta
@app.route('/nuevo-juego')
def nuevo_juego():
    grade = request.args.get('grade', '1')
    level = request.args.get('level', '1')
    levels_data = load_levels()
    
    return render_template('nuevo-juego.html', 
                         grade=grade, 
                         level=level,
                         levels=levels_data.get('nuevo-juego', []))
```

#### Frontend

```javascript
// static/js/nuevo-juego.js
class NuevoJuegoGame extends GameCommon.GameManager {
    constructor() {
        super('nuevo-juego');
        // Inicialización específica
    }
    
    initializeGame() {
        // Lógica específica del juego
    }
}

// Función de inicialización
function initNuevoJuegoGame() {
    window.nuevoJuegoGame = new NuevoJuegoGame();
    window.nuevoJuegoGame.startGame();
}
```

#### Template

```html
<!-- templates/nuevo-juego.html -->
{% extends "base.html" %}
{% block title %}Nuevo Juego - Matemáticas Andinas{% endblock %}
{% block extra_css %}
<link rel="stylesheet" href="{{ url_for('static', filename='css/nuevo-juego.css') }}">
{% endblock %}
<!-- ... contenido específico ... -->
```

### 2. Personalizar Niveles

```json
// CHANGE HERE: data/levels.json
{
  "nuevo-juego": [
    {
      "grade": 1,
      "level": 1,
      "custom_property": "valor específico",
      "desc": "Descripción del nivel"
    }
  ]
}
```

### 3. Modificar Estilos

```css
/* CHANGE HERE: static/css/base.css */
:root {
    --color-primary: #TU_COLOR;
    --font-family-primary: 'Tu-Fuente', sans-serif;
}
```

### 4. Agregar Funcionalidades

#### Sistema de Sonido

```javascript
// CHANGE HERE: Implementar en game-common.js
const SoundManager = {
    play(soundName) {
        // Implementar Web Audio API
        const audio = new Audio(`/static/sounds/${soundName}.mp3`);
        audio.play();
    }
};
```

#### Base de Datos

```python
# CHANGE HERE: Migrar de JSON a PostgreSQL
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://...'
db = SQLAlchemy(app)

class Level(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    game_type = db.Column(db.String(50), nullable=False)
    grade = db.Column(db.Integer, nullable=False)
    # ... otros campos
```

## ⚡ Consideraciones de Rendimiento

### Frontend

#### 1. Lazy Loading de Recursos

```javascript
// Cargar assets solo cuando se necesiten
async function loadGameAssets(gameType) {
    const assets = await import(`./assets/${gameType}-assets.js`);
    return assets.default;
}
```

#### 2. Optimización de Canvas

```javascript
// Usar requestAnimationFrame para animaciones suaves
function animate() {
    // Lógica de animación
    requestAnimationFrame(animate);
}

// Optimizar redibujado
let needsRedraw = false;
function markForRedraw() {
    if (!needsRedraw) {
        needsRedraw = true;
        requestAnimationFrame(() => {
            redrawCanvas();
            needsRedraw = false;
        });
    }
}
```

#### 3. Gestión de Memoria

```javascript
// Limpiar event listeners al cambiar de juego
class GameManager {
    cleanup() {
        // Remover event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        
        // Limpiar referencias
        this.canvas = null;
        this.ctx = null;
    }
}
```

### Backend

#### 1. Caching de Niveles

```python
from functools import lru_cache

@lru_cache(maxsize=1)
def load_levels():
    """Cache de niveles en memoria"""
    with open('data/levels.json', 'r') as f:
        return json.load(f)
```

#### 2. Compresión de Assets

```python
# CHANGE HERE: Configurar compresión en producción
from flask_compress import Compress

Compress(app)
```

### Optimización de Imágenes

```bash
# CHANGE HERE: Optimizar imágenes antes de deployment
# Usar WebP para mejor compresión
cwebp input.png -q 80 -o output.webp

# Generar múltiples tamaños
convert input.png -resize 50% output@2x.png
convert input.png -resize 25% output@1x.png
```

## 🔒 Seguridad

### Validación de Entrada

```python
from flask import request
from werkzeug.exceptions import BadRequest

@app.route('/api/levels', methods=['POST'])
def update_levels():
    data = request.get_json()
    
    # Validar estructura
    if not isinstance(data, dict):
        raise BadRequest("Invalid data format")
    
    # Validar campos requeridos
    for game_type, levels in data.items():
        if game_type not in ['khipu', 'yupana', 'chacana']:
            raise BadRequest(f"Invalid game type: {game_type}")
```

### Sanitización de Datos

```javascript
// Sanitizar entrada del usuario
function sanitizeInput(input) {
    return input.replace(/[<>]/g, '');
}
```

## 📱 Consideraciones Móviles

### Touch Events

```javascript
// Soporte para eventos táctiles
function addTouchSupport(element, callback) {
    if ('ontouchstart' in window) {
        element.addEventListener('touchstart', callback);
    } else {
        element.addEventListener('click', callback);
    }
}
```

### Viewport y Orientación

```css
/* Optimización para móviles */
@media (orientation: landscape) and (max-height: 600px) {
    .game-container {
        padding: var(--spacing-sm);
    }
}
```

---

## 🚀 Próximos Pasos

### Mejoras Arquitectónicas Planeadas

1. **Microservicios**: Separar API de niveles
2. **PWA**: Service Workers para offline
3. **WebAssembly**: Cálculos intensivos
4. **GraphQL**: API más flexible
5. **Testing**: Cobertura completa de tests

### Escalabilidad

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   API Gateway   │    │   Microservices │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ Nginx/Traefik   │◄──►│ Kong/Ambassador │◄──►│ Games Service   │
│                 │    │                 │    │ Users Service   │
│                 │    │                 │    │ Levels Service  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

**¿Preguntas sobre la arquitectura?** Consulta los otros documentos en `/docs/` o abre un [Issue](../../issues) para discusión técnica.