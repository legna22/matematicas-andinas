/**
 * Matemáticas Andinas - Game Common Functions
 * Funciones compartidas entre todos los juegos
 */

/**
 * Clase base para gestión de juegos
 */
class GameManager {
    constructor(gameType) {
        this.gameType = gameType;
        this.currentLevel = 1;
        this.currentGrade = 1;
        this.score = 0;
        this.timeRemaining = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.timerInterval = null;
        this.levelData = null;
        
        this.initializeFromUrl();
        this.loadLevelData();
        
        console.log(`🎮 ${gameType} game manager initialized`);
    }
    
    /**
     * Inicializar datos desde parámetros URL
     */
    initializeFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentGrade = parseInt(urlParams.get('grade')) || 1;
        this.currentLevel = parseInt(urlParams.get('level')) || 1;
    }
    
    /**
     * Cargar datos del nivel actual
     */
    loadLevelData() {
        if (window.GAME_DATA && window.GAME_DATA.levels) {
            const levels = window.GAME_DATA.levels;
            this.levelData = levels.find(level => 
                level.grade === this.currentGrade && 
                level.level === this.currentLevel
            );
            
            if (this.levelData) {
                this.updateLevelInfo();
                console.log('📊 Level data loaded:', this.levelData);
            } else {
                console.warn('⚠️ No level data found for grade', this.currentGrade, 'level', this.currentLevel);
            }
        }
    }
    
    /**
     * Actualizar información del nivel en la UI
     */
    updateLevelInfo() {
        const questionDesc = document.getElementById('questionDesc');
        const timeRemaining = document.getElementById('timeRemaining');
        const timeValue = document.getElementById('timeValue');
        
        if (this.levelData) {
            if (questionDesc) {
                questionDesc.textContent = this.levelData.desc || 'Completa el desafío';
            }
            
            if (this.levelData.time > 0) {
                this.timeRemaining = this.levelData.time;
                if (timeRemaining) timeRemaining.style.display = 'inline';
                if (timeValue) timeValue.textContent = this.timeRemaining;
            } else {
                if (timeRemaining) timeRemaining.style.display = 'none';
            }
        }
    }
    
    /**
     * Iniciar el juego
     */
    startGame() {
        this.isPlaying = true;
        this.isPaused = false;
        this.startTimer();
        
        console.log(`▶️ ${this.gameType} game started`);
    }
    
    /**
     * Pausar el juego
     */
    pauseGame() {
        this.isPaused = true;
        this.stopTimer();
        window.MathAndinas.showPause();
        
        console.log(`⏸️ ${this.gameType} game paused`);
    }
    
    /**
     * Reanudar el juego
     */
    resumeGame() {
        this.isPaused = false;
        this.startTimer();
        window.MathAndinas.resumeGame();
        
        console.log(`▶️ ${this.gameType} game resumed`);
    }
    
    /**
     * Finalizar el juego
     */
    endGame(success = false) {
        this.isPlaying = false;
        this.stopTimer();
        
        if (success) {
            this.handleSuccess();
        } else {
            this.handleFailure();
        }
        
        console.log(`🏁 ${this.gameType} game ended, success:`, success);
    }
    
    /**
     * Manejar éxito del nivel
     */
    handleSuccess() {
        this.showFeedback('¡Excelente trabajo!', 'success');
        this.updateProgress();
        
        setTimeout(() => {
            this.nextLevel();
        }, 2000);
    }
    
    /**
     * Manejar fallo del nivel
     */
    handleFailure() {
        this.showFeedback('¡Inténtalo de nuevo!', 'error');
        
        setTimeout(() => {
            this.restartLevel();
        }, 2000);
    }
    
    /**
     * Iniciar cronómetro
     */
    startTimer() {
        if (this.levelData && this.levelData.time > 0 && !this.timerInterval) {
            this.timerInterval = setInterval(() => {
                if (!this.isPaused && this.timeRemaining > 0) {
                    this.timeRemaining--;
                    this.updateTimerDisplay();
                    
                    if (this.timeRemaining === 0) {
                        this.endGame(false);
                    }
                }
            }, 1000);
        }
    }
    
    /**
     * Detener cronómetro
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    /**
     * Actualizar visualización del cronómetro
     */
    updateTimerDisplay() {
        const timeValue = document.getElementById('timeValue');
        if (timeValue) {
            timeValue.textContent = this.timeRemaining;
            
            // Cambiar color cuando queda poco tiempo
            if (this.timeRemaining <= 10) {
                timeValue.style.color = 'var(--color-error)';
                timeValue.style.animation = 'pulse 1s infinite';
            } else if (this.timeRemaining <= 30) {
                timeValue.style.color = 'var(--color-warning)';
            }
        }
    }
    
    /**
     * Mostrar feedback visual
     */
    showFeedback(message, type = 'info') {
        const feedback = document.createElement('div');
        feedback.className = 'feedback-message';
        feedback.textContent = message;
        
        // Aplicar estilos según el tipo
        const colors = {
            success: 'var(--color-success)',
            error: 'var(--color-error)',
            warning: 'var(--color-warning)',
            info: 'var(--color-info)'
        };
        
        feedback.style.backgroundColor = colors[type] || colors.info;
        
        // Agregar al contenedor del juego
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.appendChild(feedback);
            
            setTimeout(() => {
                feedback.remove();
            }, 2000);
        }
    }
    
    /**
     * Actualizar progreso del nivel
     */
    updateProgress() {
        const progressBar = document.querySelector('.progress-fill');
        if (progressBar) {
            // Calcular progreso basado en niveles completados
            const totalLevels = this.getTotalLevelsForGrade();
            const progress = (this.currentLevel / totalLevels) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
        
        // Guardar progreso en localStorage
        this.saveProgress();
    }
    
    /**
     * Obtener total de niveles para el grado actual
     */
    getTotalLevelsForGrade() {
        if (window.GAME_DATA && window.GAME_DATA.levels) {
            return window.GAME_DATA.levels.filter(level => 
                level.grade === this.currentGrade
            ).length;
        }
        return 8; // Valor por defecto
    }
    
    /**
     * Guardar progreso en localStorage
     */
    saveProgress() {
        const progressKey = `matematicas_andinas_progress_${this.gameType}`;
        const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
        
        const gradeKey = `grade_${this.currentGrade}`;
        if (!progress[gradeKey]) {
            progress[gradeKey] = {};
        }
        
        progress[gradeKey][`level_${this.currentLevel}`] = {
            completed: true,
            score: this.score,
            completedAt: new Date().toISOString()
        };
        
        localStorage.setItem(progressKey, JSON.stringify(progress));
        console.log('💾 Progress saved for', this.gameType);
    }
    
    /**
     * Avanzar al siguiente nivel
     */
    nextLevel() {
        const nextLevelData = window.GAME_DATA.levels.find(level => 
            level.grade === this.currentGrade && 
            level.level === this.currentLevel + 1
        );
        
        if (nextLevelData) {
            // Ir al siguiente nivel
            const url = new URL(window.location);
            url.searchParams.set('level', this.currentLevel + 1);
            window.location.href = url.toString();
        } else {
            // Ir al siguiente grado si existe
            const nextGradeData = window.GAME_DATA.levels.find(level => 
                level.grade === this.currentGrade + 1 && level.level === 1
            );
            
            if (nextGradeData) {
                const url = new URL(window.location);
                url.searchParams.set('grade', this.currentGrade + 1);
                url.searchParams.set('level', 1);
                window.location.href = url.toString();
            } else {
                // Completado todo el juego
                this.showFeedback('¡Has completado todos los niveles!', 'success');
                setTimeout(() => {
                    window.MathAndinas.goHome();
                }, 3000);
            }
        }
    }
    
    /**
     * Reiniciar nivel actual
     */
    restartLevel() {
        location.reload();
    }
}

/**
 * Utilidades para manejo de ayuda
 */
function showHelp() {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        console.log('❓ Help modal shown');
    }
}

function closeHelp() {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        console.log('❌ Help modal closed');
    }
}

/**
 * Utilidades de sonido (placeholder)
 * CHANGE HERE: Implementar sistema de sonido si se requiere
 */
const SoundManager = {
    enabled: true,
    
    play(soundName) {
        if (!this.enabled) return;
        
        // CHANGE HERE: Implementar reproducción de sonidos
        console.log('🔊 Playing sound:', soundName);
        
        // Placeholder - agregar Web Audio API o HTML5 Audio
    },
    
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('matematicas_andinas_sound', this.enabled.toString());
        console.log('🔊 Sound toggled:', this.enabled);
    },
    
    init() {
        const savedSetting = localStorage.getItem('matematicas_andinas_sound');
        if (savedSetting !== null) {
            this.enabled = savedSetting === 'true';
        }
    }
};

/**
 * Utilidades de animación para juegos
 */
const GameAnimations = {
    /**
     * Animar elemento con efecto de éxito
     */
    animateSuccess(element) {
        element.classList.add('animate-success');
        setTimeout(() => {
            element.classList.remove('animate-success');
        }, 1000);
    },
    
    /**
     * Animar elemento con efecto de error
     */
    animateError(element) {
        element.classList.add('animate-error');
        setTimeout(() => {
            element.classList.remove('animate-error');
        }, 500);
    },
    
    /**
     * Crear partículas de celebración
     */
    createParticles(container, count = 20) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'celebration-particle';
            
            // Posición aleatoria
            particle.style.left = Math.random() * container.offsetWidth + 'px';
            particle.style.top = Math.random() * container.offsetHeight + 'px';
            
            // Dirección aleatoria
            const angle = Math.random() * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            particle.style.setProperty('--vx', vx + 'px');
            particle.style.setProperty('--vy', vy + 'px');
            
            container.appendChild(particle);
            
            // Remover después de la animación
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    },
    
    /**
     * Efecto de pulsación
     */
    pulse(element, duration = 1000) {
        element.style.animation = `pulse ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }
};

/**
 * Gestión de accesibilidad
 */
const AccessibilityManager = {
    /**
     * Anunciar texto para lectores de pantalla
     */
    announce(text) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = text;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
        
        console.log('📢 Accessibility announcement:', text);
    },
    
    /**
     * Enfocar elemento de manera segura
     */
    focusElement(element) {
        if (element && typeof element.focus === 'function') {
            element.focus();
        }
    },
    
    /**
     * Configurar navegación por teclado para un contenedor
     */
    setupKeyboardNavigation(container, itemSelector) {
        const items = container.querySelectorAll(itemSelector);
        let currentIndex = 0;
        
        container.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    currentIndex = (currentIndex + 1) % items.length;
                    this.focusElement(items[currentIndex]);
                    break;
                    
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    currentIndex = (currentIndex - 1 + items.length) % items.length;
                    this.focusElement(items[currentIndex]);
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    currentIndex = 0;
                    this.focusElement(items[currentIndex]);
                    break;
                    
                case 'End':
                    e.preventDefault();
                    currentIndex = items.length - 1;
                    this.focusElement(items[currentIndex]);
                    break;
            }
        });
    }
};

// Inicializar utilidades comunes
document.addEventListener('DOMContentLoaded', function() {
    SoundManager.init();
    
    // Configurar cierre de modales con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeHelp();
        }
    });
    
    // Configurar clics fuera del modal para cerrarlo
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeHelp();
        }
    });
    
    console.log('🔧 Game common utilities initialized');
});

// Exportar utilidades para uso global
window.GameCommon = {
    GameManager,
    showHelp,
    closeHelp,
    SoundManager,
    GameAnimations,
    AccessibilityManager
};