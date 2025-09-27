/**
 * Matemáticas Andinas - Game Engine
 * Motor de juegos dinámico que consume levels.json
 */

class GameEngine {
    constructor(gameType, gameData) {
        this.gameType = gameType;
        this.gameData = gameData;
        this.currentGrade = gameData.grade;
        this.currentLevel = gameData.level;
        this.levelData = this.findLevelData();
        this.currentQuestion = null;
        this.score = 0;
        this.timeRemaining = 0;
        this.timerInterval = null;
        this.startTime = null;
        this.isPlaying = false;
        
        console.log(`🎮 Game Engine initialized for ${gameType}`);
    }

    /**
     * Encontrar datos del nivel actual
     */
    findLevelData() {
        return this.gameData.levels.find(level => 
            level.grade === this.currentGrade && level.level === this.currentLevel
        );
    }

    /**
     * Generar pregunta basada en el nivel
     */
    generateQuestion() {
        if (!this.levelData) {
            console.error('❌ No level data found');
            return null;
        }

        const { target_min, target_max } = this.levelData;
        const correctAnswer = Math.floor(Math.random() * (target_max - target_min + 1)) + target_min;
        
        // Generar distractores inteligentes
        const distractors = this.generateDistractors(correctAnswer, target_min, target_max);
        
        // Mezclar opciones
        const options = this.shuffleArray([correctAnswer, ...distractors]);
        
        this.currentQuestion = {
            correctAnswer,
            options,
            target_min,
            target_max,
            difficulty: this.levelData.difficulty,
            concepts: this.levelData.concepts || []
        };

        return this.currentQuestion;
    }

    /**
     * Generar distractores inteligentes
     */
    generateDistractors(correctAnswer, min, max) {
        const distractors = new Set();
        const range = max - min + 1;
        
        // Estrategias para generar distractores
        const strategies = [
            // Números cercanos (±1, ±2)
            () => correctAnswer + (Math.random() < 0.5 ? 1 : -1),
            () => correctAnswer + (Math.random() < 0.5 ? 2 : -2),
            
            // Errores comunes de conteo
            () => Math.floor(correctAnswer * 0.8), // Subconteo
            () => Math.floor(correctAnswer * 1.2), // Sobreconteo
            
            // Números del rango
            () => Math.floor(Math.random() * range) + min,
            
            // Múltiplos o divisores
            () => correctAnswer * 2,
            () => Math.floor(correctAnswer / 2)
        ];

        while (distractors.size < 3) {
            const strategy = strategies[Math.floor(Math.random() * strategies.length)];
            const distractor = strategy();
            
            // Validar distractor
            if (distractor !== correctAnswer && 
                distractor >= Math.max(1, min - 5) && 
                distractor <= max + 10 &&
                !distractors.has(distractor)) {
                distractors.add(distractor);
            }
        }

        return Array.from(distractors).slice(0, 3);
    }

    /**
     * Mezclar array
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Iniciar juego
     */
    startGame() {
        this.isPlaying = true;
        this.startTime = Date.now();
        this.score = 0;
        
        // Configurar timer si es necesario
        if (this.levelData && this.levelData.time > 0) {
            this.timeRemaining = this.levelData.time;
            this.startTimer();
        }

        // Generar primera pregunta
        this.generateQuestion();
        
        console.log(`▶️ Game started: ${this.gameType} G${this.currentGrade}L${this.currentLevel}`);
        return this.currentQuestion;
    }

    /**
     * Iniciar cronómetro
     */
    startTimer() {
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.endGame(false, 'timeout');
            }
        }, 1000);
    }

    /**
     * Actualizar display del cronómetro
     */
    updateTimerDisplay() {
        const timeElement = document.getElementById('timeValue');
        const timeContainer = document.getElementById('timeRemaining');
        
        if (timeElement && this.levelData && this.levelData.time > 0) {
            timeElement.textContent = this.timeRemaining;
            
            if (timeContainer) {
                timeContainer.style.display = 'inline';
                
                // Cambiar color según tiempo restante
                if (this.timeRemaining <= 10) {
                    timeElement.style.color = 'var(--color-error)';
                    timeElement.style.animation = 'pulse 1s infinite';
                } else if (this.timeRemaining <= 30) {
                    timeElement.style.color = 'var(--color-warning)';
                } else {
                    timeElement.style.color = 'inherit';
                    timeElement.style.animation = 'none';
                }
            }
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
     * Verificar respuesta
     */
    checkAnswer(userAnswer) {
        if (!this.currentQuestion || !this.isPlaying) {
            return null;
        }

        const isCorrect = userAnswer === this.currentQuestion.correctAnswer;
        const timeUsed = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;

        const result = {
            isCorrect,
            userAnswer,
            correctAnswer: this.currentQuestion.correctAnswer,
            timeUsed,
            explanation: this.generateExplanation(userAnswer, this.currentQuestion.correctAnswer, isCorrect)
        };

        if (isCorrect) {
            this.score += this.calculateScore();
            this.endGame(true, 'completed');
        } else {
            // Permitir otro intento o mostrar explicación
            this.handleIncorrectAnswer(result);
        }

        return result;
    }

    /**
     * Calcular puntuación
     */
    calculateScore() {
        let baseScore = 10;
        
        // Bonus por dificultad
        const difficultyBonus = {
            'facil': 0,
            'medio': 5,
            'dificil': 10
        };
        
        baseScore += difficultyBonus[this.levelData.difficulty] || 0;
        
        // Bonus por tiempo (si hay límite de tiempo)
        if (this.levelData.time > 0 && this.timeRemaining > 0) {
            const timeBonus = Math.floor((this.timeRemaining / this.levelData.time) * 5);
            baseScore += timeBonus;
        }

        return baseScore;
    }

    /**
     * Generar explicación pedagógica
     */
    generateExplanation(userAnswer, correctAnswer, isCorrect) {
        if (isCorrect) {
            return {
                type: 'success',
                message: '¡Excelente! Tu respuesta es correcta.',
                details: this.getSuccessDetails()
            };
        } else {
            return {
                type: 'error',
                message: `Elegiste ${userAnswer}, pero la respuesta correcta es ${correctAnswer}.`,
                details: this.getErrorDetails(userAnswer, correctAnswer),
                hint: this.generateHint()
            };
        }
    }

    /**
     * Obtener detalles de éxito específicos del juego
     */
    getSuccessDetails() {
        const messages = {
            khipu: '¡Contaste correctamente todos los nudos del khipu!',
            yupana: '¡Representaste el número perfectamente en la yupana!',
            chacana: '¡Completaste la simetría de la chacana con armonía!'
        };
        return messages[this.gameType] || '¡Muy bien!';
    }

    /**
     * Obtener detalles de error específicos del juego
     */
    getErrorDetails(userAnswer, correctAnswer) {
        const difference = Math.abs(userAnswer - correctAnswer);
        
        const messages = {
            khipu: `En el khipu hay ${correctAnswer} nudos, pero contaste ${userAnswer}. ${difference > 1 ? 'Revisa cada cuerda cuidadosamente.' : 'Estuviste muy cerca.'}`,
            yupana: `El número objetivo era ${correctAnswer}, pero tu representación suma ${userAnswer}. ${difference > 5 ? 'Revisa el valor de cada ficha.' : 'Ajusta algunas fichas.'}`,
            chacana: `El patrón requiere ${correctAnswer} elementos, pero colocaste ${userAnswer}. Observa la simetría de la cruz.`
        };
        
        return messages[this.gameType] || `La diferencia es de ${difference} unidades.`;
    }

    /**
     * Generar pista
     */
    generateHint() {
        const hints = {
            khipu: 'Pista: Cuenta cada nudo individualmente, tanto simples como compuestos valen 1.',
            yupana: 'Pista: Recuerda que las fichas pequeñas valen 1, medianas 3, y grandes 5.',
            chacana: 'Pista: La chacana debe ser simétrica en todas las direcciones.'
        };
        
        return hints[this.gameType] || 'Revisa tu estrategia y vuelve a intentar.';
    }

    /**
     * Manejar respuesta incorrecta
     */
    handleIncorrectAnswer(result) {
        // Mostrar explicación
        this.showFeedback(result.explanation);
        
        // Dar oportunidad de reintentar o avanzar según configuración
        setTimeout(() => {
            if (this.levelData.difficulty === 'facil') {
                // En nivel fácil, permitir reintento
                this.showRetryOption(result);
            } else {
                // En niveles más difíciles, mostrar respuesta y continuar
                this.endGame(false, 'incorrect');
            }
        }, 3000);
    }

    /**
     * Mostrar opción de reintento
     */
    showRetryOption(result) {
        const retryModal = document.createElement('div');
        retryModal.className = 'retry-modal';
        retryModal.innerHTML = `
            <div class="retry-content">
                <h3>¿Quieres intentar de nuevo?</h3>
                <p>${result.explanation.details}</p>
                <p><em>${result.explanation.hint}</em></p>
                <div class="retry-buttons">
                    <button class="btn btn-primary" onclick="this.closest('.retry-modal').remove(); window.currentGame.generateNewQuestion()">
                        Intentar de Nuevo
                    </button>
                    <button class="btn btn-secondary" onclick="this.closest('.retry-modal').remove(); window.currentGame.endGame(false, 'skipped')">
                        Continuar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(retryModal);
    }

    /**
     * Generar nueva pregunta (para reintentos)
     */
    generateNewQuestion() {
        this.generateQuestion();
        // El juego específico debe implementar la actualización visual
        if (window.currentGameInstance && window.currentGameInstance.updateQuestion) {
            window.currentGameInstance.updateQuestion(this.currentQuestion);
        }
    }

    /**
     * Mostrar feedback
     */
    showFeedback(explanation) {
        const feedback = document.createElement('div');
        feedback.className = `feedback-overlay ${explanation.type}`;
        feedback.innerHTML = `
            <div class="feedback-content">
                <div class="feedback-icon">
                    ${explanation.type === 'success' ? '✅' : '❌'}
                </div>
                <div class="feedback-message">
                    <h3>${explanation.message}</h3>
                    <p>${explanation.details}</p>
                    ${explanation.hint ? `<p class="feedback-hint">${explanation.hint}</p>` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 4000);
    }

    /**
     * Finalizar juego
     */
    endGame(success, reason) {
        this.isPlaying = false;
        this.stopTimer();
        
        const timeUsed = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;

        if (success) {
            // Guardar progreso
            window.ProgressManager.completeLevel(
                this.gameType, 
                this.currentGrade, 
                this.currentLevel, 
                this.score, 
                timeUsed
            );

            // Mostrar celebración
            this.showSuccessAnimation();

            // Avanzar al siguiente nivel
            setTimeout(() => {
                this.advanceToNextLevel();
            }, 3000);
        } else {
            // Mostrar opción de reintentar
            setTimeout(() => {
                this.showGameOverOptions(reason);
            }, 2000);
        }

        console.log(`🏁 Game ended: ${success ? 'SUCCESS' : 'FAILED'} (${reason})`);
    }

    /**
     * Mostrar animación de éxito
     */
    showSuccessAnimation() {
        // Crear partículas de celebración
        if (window.GameCommon && window.GameCommon.GameAnimations) {
            const container = document.querySelector('.game-container');
            window.GameCommon.GameAnimations.createParticles(container, 30);
        }

        // Mostrar mensaje de éxito
        const successMessage = document.createElement('div');
        successMessage.className = 'success-celebration';
        successMessage.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-icon">🎉</div>
                <h2>¡Nivel Completado!</h2>
                <p>Puntuación: ${this.score} puntos</p>
                <p>Avanzando al siguiente nivel...</p>
            </div>
        `;

        document.body.appendChild(successMessage);

        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    }

    /**
     * Avanzar al siguiente nivel
     */
    advanceToNextLevel() {
        const nextLevel = window.ProgressManager.getNextLevel(
            this.gameType, 
            this.currentGrade, 
            this.currentLevel, 
            this.gameData.levels
        );

        if (nextLevel) {
            // Navegar al siguiente nivel
            const url = `/${this.gameType}?grade=${nextLevel.grade}&level=${nextLevel.level}`;
            window.location.href = url;
        } else {
            // Completó todos los niveles
            this.showGameCompleteMessage();
        }
    }

    /**
     * Mostrar mensaje de juego completado
     */
    showGameCompleteMessage() {
        const completeMessage = document.createElement('div');
        completeMessage.className = 'game-complete-modal';
        completeMessage.innerHTML = `
            <div class="complete-content">
                <div class="complete-icon">👑</div>
                <h2>¡Felicitaciones!</h2>
                <p>Has completado todos los niveles de ${this.gameType.charAt(0).toUpperCase() + this.gameType.slice(1)}!</p>
                <div class="complete-buttons">
                    <button class="btn btn-primary" onclick="window.location.href='/'">
                        Elegir Otro Juego
                    </button>
                    <button class="btn btn-secondary" onclick="window.location.href='/perfil'">
                        Ver Mi Progreso
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(completeMessage);
    }

    /**
     * Mostrar opciones de game over
     */
    showGameOverOptions(reason) {
        const reasonMessages = {
            timeout: '⏰ Se acabó el tiempo',
            incorrect: '❌ Respuesta incorrecta',
            skipped: '⏭️ Nivel omitido'
        };

        const gameOverModal = document.createElement('div');
        gameOverModal.className = 'game-over-modal';
        gameOverModal.innerHTML = `
            <div class="game-over-content">
                <h3>${reasonMessages[reason] || '🎮 Fin del juego'}</h3>
                <p>¡No te desanimes! Cada intento te ayuda a aprender.</p>
                <div class="game-over-buttons">
                    <button class="btn btn-primary" onclick="location.reload()">
                        Intentar de Nuevo
                    </button>
                    <button class="btn btn-secondary" onclick="window.location.href='/'">
                        Volver al Inicio
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(gameOverModal);
    }
}

// Exportar para uso global
window.GameEngine = GameEngine;

// Estilos CSS para los modales y feedback
const gameEngineStyles = document.createElement('style');
gameEngineStyles.textContent = `
.feedback-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
}

.feedback-content {
    background: white;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    max-width: 500px;
    margin: 20px;
}

.feedback-icon {
    font-size: 3rem;
    margin-bottom: 15px;
}

.feedback-message h3 {
    color: var(--color-earth-brown);
    margin-bottom: 15px;
}

.feedback-hint {
    font-style: italic;
    color: var(--color-golden-sun);
    background: rgba(210, 105, 30, 0.1);
    padding: 10px;
    border-radius: 8px;
    margin-top: 15px;
}

.retry-modal, .game-over-modal, .game-complete-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.retry-content, .game-over-content, .complete-content {
    background: white;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    max-width: 400px;
    margin: 20px;
}

.retry-buttons, .game-over-buttons, .complete-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 20px;
}

.success-celebration {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.celebration-content {
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #8B4513;
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    animation: celebrationPulse 2s ease-in-out;
}

.celebration-icon {
    font-size: 4rem;
    margin-bottom: 20px;
    animation: bounce 1s infinite;
}

.complete-icon {
    font-size: 4rem;
    margin-bottom: 20px;
}

@keyframes celebrationPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@media (max-width: 768px) {
    .retry-buttons, .game-over-buttons, .complete-buttons {
        flex-direction: column;
    }
    
    .feedback-content, .retry-content, .game-over-content, .complete-content {
        margin: 10px;
        padding: 20px;
    }
}
`;
document.head.appendChild(gameEngineStyles);