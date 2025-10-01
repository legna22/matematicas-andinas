/**
 * Matemáticas Andinas - Khipu Game Logic (Improved)
 * Lógica mejorada del juego Khipu con sistema de cuerdas y nudos
 */

class KhipuGameImproved {
    constructor() {
        this.columns = [
            { knots: 0, max: 9 },
            { knots: 0, max: 9 },
            { knots: 0, max: 9 }
        ];
        this.targetNumber = 0;
        this.score = 0;
        this.streak = 0;
        this.attempts = 0;
        this.difficulty = 'facil';
        this.difficultyRanges = {
            facil: { min: 1, max: 50 },
            medio: { min: 1, max: 200 },
            dificil: { min: 1, max: 999 }
        };
        
        // Paleta de colores vibrantes inspirada en textiles andinos
        this.palette = [
            "#FF6B6B", "#FFB347", "#FFD93D", "#6BCB77", 
            "#4D96FF", "#845EC2", "#FF9999", "#87CEEB",
            "#F0E68C", "#DDA0DD", "#98FB98", "#F4A460"
        ];
        
        this.achievements = [
            { id: 'first_success', name: '🎉 ¡Primer Éxito!', condition: () => this.streak >= 1 },
            { id: 'streak_5', name: '🔥 ¡Racha de 5!', condition: () => this.streak >= 5 },
            { id: 'khipu_master', name: '👑 ¡Maestro del Khipu!', condition: () => this.score >= 100 },
            { id: 'inca_expert', name: '🏆 ¡Experto Inca!', condition: () => this.score >= 500 }
        ];
        
        this.unlockedAchievements = new Set();
        this.gameEngine = null;
        this.isPlaying = false;
        
        this.init();
    }

    init() {
        // Inicializar motor de juego si está disponible
        if (window.GAME_DATA) {
            this.gameEngine = new GameEngine('khipu', window.GAME_DATA);
            this.setDifficultyFromLevel();
        }
        
        this.updateDisplay();
        this.generateTarget();
        this.isPlaying = true;
        
        console.log('🪢 Khipu game improved initialized');
    }

    /**
     * Configurar dificultad basada en el nivel actual y parámetros URL
     */
    setDifficultyFromLevel() {
        // Obtener dificultad desde parámetros URL (definida en la página de inicio)
        const urlParams = new URLSearchParams(window.location.search);
        const urlDifficulty = urlParams.get('difficulty');
        
        if (urlDifficulty) {
            this.difficulty = urlDifficulty;
        } else if (this.gameEngine && this.gameEngine.levelData) {
            // Fallback: usar datos del nivel
            const levelData = this.gameEngine.levelData;
            const maxValue = levelData.target_max || 50;
            
            // Determinar dificultad basada en el rango del nivel
            if (maxValue <= 50) {
                this.difficulty = 'facil';
            } else if (maxValue <= 200) {
                this.difficulty = 'medio';
            } else {
                this.difficulty = 'dificil';
            }
        }
        
        console.log('🎯 Difficulty set to:', this.difficulty);
    }

    addKnot(cordIndex) {
        if (!this.isPlaying || cordIndex < 0 || cordIndex >= this.columns.length) return;
        
        this.columns[cordIndex].knots++;
        
        // Sistema de valor posicional - al llegar a 10, reinicia y pasa a la siguiente
        if (this.columns[cordIndex].knots >= 10) {
            this.columns[cordIndex].knots = 0;
            if (cordIndex > 0) {
                this.addKnot(cordIndex - 1);
            }
        }
        
        this.updateDisplay();
        this.checkWin();
        
        // Efectos de sonido y visuales
        this.playKnotSound();
        this.animateKnotAddition(cordIndex);
    }

    removeKnot() {
        if (!this.isPlaying) return;
        
        // Buscar de derecha a izquierda la primera cuerda con cuentas
        for (let i = this.columns.length - 1; i >= 0; i--) {
            if (this.columns[i].knots > 0) {
                this.columns[i].knots--;
                break;
            }
        }
        this.updateDisplay();
    }

    calculateValue() {
        return this.columns[0].knots * 100 +
               this.columns[1].knots * 10 +
               this.columns[2].knots;
    }

    generateTarget() {
        let range;
        
        // Usar rango del nivel si está disponible
        if (this.gameEngine && this.gameEngine.levelData) {
            range = {
                min: this.gameEngine.levelData.target_min || 1,
                max: this.gameEngine.levelData.target_max || 50
            };
        } else {
            range = this.difficultyRanges[this.difficulty];
        }
        
        this.targetNumber = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        document.getElementById('targetNumber').textContent = this.targetNumber;
        this.attempts++;
        this.updateDisplay();
        
        console.log('🎯 New target generated:', this.targetNumber);
    }

    checkWin() {
        const currentValue = this.calculateValue();
        if (currentValue === this.targetNumber) {
            const points = this.getScoreMultiplier();
            this.score += points;
            this.streak++;
            this.showCelebration();
            this.showAchievement('🎉 ¡Correcto! +' + points + ' puntos');
            this.checkAchievements();
            
            // Integrar con el sistema de progreso
            if (this.gameEngine) {
                const result = this.gameEngine.checkAnswer(currentValue);
                if (result && result.isCorrect) {
                    // El GameEngine maneja el avance de nivel
                    return;
                }
            }
            
            // Si no hay GameEngine, generar nuevo objetivo
            setTimeout(() => this.generateTarget(), 2000);
        } else if (currentValue > this.targetNumber) {
            this.streak = 0;
            this.showFeedback('Te pasaste del objetivo', 'warning');
        }
    }

    getScoreMultiplier() {
        const baseScore = {
            facil: 10,
            medio: 20,
            dificil: 50
        };
        return baseScore[this.difficulty] + (this.streak * 5);
    }

    showCelebration() {
        const container = document.querySelector('.khipu-area');
        const emojis = ['🎉', '✨', '🌟', '🎊', '💫', '⭐'];
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const celebration = document.createElement('div');
                celebration.className = 'celebration';
                celebration.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                celebration.style.left = Math.random() * container.offsetWidth + 'px';
                celebration.style.top = Math.random() * container.offsetHeight + 'px';
                celebration.style.position = 'absolute';
                celebration.style.pointerEvents = 'none';
                celebration.style.fontSize = '2em';
                celebration.style.animation = 'celebrate 2s ease-out forwards';
                container.appendChild(celebration);
                
                setTimeout(() => celebration.remove(), 2000);
            }, i * 100);
        }
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!this.unlockedAchievements.has(achievement.id) && achievement.condition()) {
                this.unlockedAchievements.add(achievement.id);
                setTimeout(() => {
                    this.showAchievement('🏆 ' + achievement.name);
                }, 1500);
            }
        });
    }

    showHint() {
        const target = this.targetNumber;
        const centenas = Math.floor(target / 100);
        const decenas = Math.floor((target % 100) / 10);
        const unidades = target % 10;
        this.showAchievement(`💡 Pista: ${centenas} centenas, ${decenas} decenas, ${unidades} unidades`);
    }

    showAchievement(message) {
        const achievementDiv = document.getElementById('achievement');
        if (achievementDiv) {
            achievementDiv.textContent = message;
            achievementDiv.style.display = 'block';
            setTimeout(() => {
                achievementDiv.style.display = 'none';
            }, 4000);
        }
        
        // También usar el sistema de notificaciones global si está disponible
        if (window.MathAndinas && window.MathAndinas.showNotification) {
            window.MathAndinas.showNotification(message, 'success');
        }
    }

    showFeedback(message, type = 'info') {
        if (window.MathAndinas && window.MathAndinas.showNotification) {
            window.MathAndinas.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    reset() {
        this.columns.forEach(col => col.knots = 0);
        this.updateDisplay();
    }

    updateDisplay() {
        const currentValue = this.calculateValue();
        document.getElementById('currentNumber').textContent = currentValue;
        
        this.columns.forEach((col, index) => {
            document.getElementById(`count${index}`).textContent = col.knots;
            const cordElement = document.getElementById(`cord${index}`);
            cordElement.innerHTML = '';
            
            for (let i = 0; i < col.knots; i++) {
                const knot = document.createElement('div');
                knot.className = 'knot';
                knot.style.top = (35 + i * 30) + 'px';
                
                // Asignar color consistente basado en posición
                const colorIndex = (index * 3 + i) % this.palette.length;
                knot.style.background = this.palette[colorIndex];
                
                // Añadir ligera variación en posición para más naturalidad
                const wobble = (Math.sin(i * 0.5) * 3);
                knot.style.left = (wobble - 12) + 'px';
                
                cordElement.appendChild(knot);
            }
        });
        
        // Actualizar estadísticas
        document.getElementById('score').textContent = this.score;
        document.getElementById('streak').textContent = this.streak;
        document.getElementById('attempts').textContent = this.attempts;
        
        // Actualizar color del número actual según proximidad al objetivo
        const currentNumberElement = document.getElementById('currentNumber');
        if (currentNumberElement) {
            const difference = Math.abs(currentValue - this.targetNumber);
            if (currentValue === this.targetNumber) {
                currentNumberElement.style.color = 'var(--color-success)';
            } else if (difference <= 5) {
                currentNumberElement.style.color = 'var(--color-warning)';
            } else {
                currentNumberElement.style.color = '#8B4513';
            }
        }
    }

    playKnotSound() {
        // Integrar con el sistema de sonido si está disponible
        if (window.GameCommon && window.GameCommon.SoundManager) {
            window.GameCommon.SoundManager.play('knot_place');
        }
    }

    animateKnotAddition(cordIndex) {
        const cord = document.getElementById(`cord${cordIndex}`);
        if (cord) {
            cord.style.animation = 'none';
            setTimeout(() => {
                cord.style.animation = 'cordPulse 0.3s ease-out';
            }, 10);
        }
    }
}

/**
 * Funciones globales para botones
 */
function addKnot(index) { 
    if (window.khipuGame) {
        window.khipuGame.addKnot(index); 
    }
}

function removeKnot() { 
    if (window.khipuGame) {
        window.khipuGame.removeKnot(); 
    }
}

function generateTarget() { 
    if (window.khipuGame) {
        window.khipuGame.generateTarget(); 
    }
}

function reset() { 
    if (window.khipuGame) {
        window.khipuGame.reset(); 
    }
}

function showHint() { 
    if (window.khipuGame) {
        window.khipuGame.showHint(); 
    }
}

/**
 * Inicializar juego mejorado
 */
function initKhipuImprovedGame() {
    window.khipuGame = new KhipuGameImproved();
    window.currentGameInstance = window.khipuGame;
    
    console.log('🪢 Khipu improved game initialization complete');
}

// Exportar para uso global
window.KhipuGameImproved = KhipuGameImproved;
window.initKhipuImprovedGame = initKhipuImprovedGame;