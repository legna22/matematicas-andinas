/**
 * Matemáticas Andinas - Khipu Game Logic
 * Lógica específica del juego Khipu
 */

class KhipuGame extends GameCommon.GameManager {
    constructor() {
        super('khipu');
        this.currentQuestion = null;
        this.correctAnswer = null;
        this.userAnswer = null;
        this.knots = [];
        this.canvas = null;
        this.ctx = null;
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.canvas = document.getElementById('khipuCanvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.setupCanvas();
        }
        
        this.setupAnswerButtons();
        this.generateQuestion();
        
        console.log('🪢 Khipu game initialized');
    }
    
    setupCanvas() {
        // Configurar canvas responsivo
        const container = this.canvas.parentElement;
        const containerWidth = container.offsetWidth - 40; // Padding
        const aspectRatio = 400 / 600; // height / width
        
        this.canvas.width = Math.min(600, containerWidth);
        this.canvas.height = this.canvas.width * aspectRatio;
        
        // CHANGE HERE: Configurar el dibujo del khipu
        this.drawKhipu();
    }
    
    drawKhipu() {
        if (!this.ctx) return;
        
        const { width, height } = this.canvas;
        this.ctx.clearRect(0, 0, width, height);
        
        // Fondo del canvas
        this.ctx.fillStyle = 'rgba(255, 248, 220, 0.9)';
        this.ctx.fillRect(0, 0, width, height);
        
        // Cuerda principal
        this.drawMainCord();
        
        // Cuerdas secundarias con nudos
        this.drawSecondaryCords();
        
        // Dibujar nudos
        this.drawKnots();
    }
    
    drawMainCord() {
        const { width, height } = this.canvas;
        const centerX = width / 2;
        
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, 20);
        this.ctx.lineTo(centerX, height - 20);
        this.ctx.stroke();
        
        // Sombra de la cuerda
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX + 2, 20);
        this.ctx.lineTo(centerX + 2, height - 20);
        this.ctx.stroke();
    }
    
    drawSecondaryCords() {
        const { width, height } = this.canvas;
        const centerX = width / 2;
        const cordCount = 3;
        const cordSpacing = width / (cordCount + 1);
        
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 3;
        
        for (let i = 0; i < cordCount; i++) {
            const x = cordSpacing * (i + 1);
            const startY = 60 + i * 20;
            const endY = height - 60 - i * 20;
            
            // Conexión con cuerda principal
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, startY);
            this.ctx.lineTo(x, startY);
            this.ctx.stroke();
            
            // Cuerda colgante
            this.ctx.beginPath();
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, endY);
            this.ctx.stroke();
        }
    }
    
    drawKnots() {
        // Limpiar array de nudos anterior
        this.knots = [];
        
        if (!this.correctAnswer) return;
        
        const { width, height } = this.canvas;
        const cordCount = 3;
        const cordSpacing = width / (cordCount + 1);
        
        // Distribuir nudos entre las cuerdas
        const knotsPerCord = this.distributeKnots(this.correctAnswer, cordCount);
        
        for (let cordIndex = 0; cordIndex < cordCount; cordIndex++) {
            const x = cordSpacing * (cordIndex + 1);
            const knotCount = knotsPerCord[cordIndex];
            const startY = 100 + cordIndex * 20;
            const knotSpacing = 40;
            
            for (let knotIndex = 0; knotIndex < knotCount; knotIndex++) {
                const knotY = startY + knotIndex * knotSpacing;
                const knotType = this.getKnotType(knotIndex, knotCount);
                
                this.drawKnot(x, knotY, knotType);
                this.knots.push({
                    x: x,
                    y: knotY,
                    type: knotType,
                    cord: cordIndex
                });
            }
        }
    }
    
    distributeKnots(total, cords) {
        // Distribuir nudos de manera equilibrada entre las cuerdas
        const knotsPerCord = new Array(cords).fill(0);
        let remaining = total;
        
        // Distribución básica
        const baseKnots = Math.floor(total / cords);
        for (let i = 0; i < cords; i++) {
            knotsPerCord[i] = baseKnots;
            remaining -= baseKnots;
        }
        
        // Distribuir nudos restantes
        for (let i = 0; i < remaining; i++) {
            knotsPerCord[i % cords]++;
        }
        
        return knotsPerCord;
    }
    
    getKnotType(knotIndex, totalKnots) {
        // Alternar entre nudos simples y compuestos para variedad visual
        if (totalKnots <= 3) {
            return 'simple';
        } else {
            return knotIndex % 3 === 0 ? 'compound' : 'simple';
        }
    }
    
    drawKnot(x, y, type) {
        const radius = type === 'compound' ? 12 : 8;
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
        
        if (type === 'compound') {
            gradient.addColorStop(0, '#CD853F');
            gradient.addColorStop(1, '#8B4513');
        } else {
            gradient.addColorStop(0, '#D2691E');
            gradient.addColorStop(1, '#A0522D');
        }
        
        // Sombra del nudo
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        
        // Dibujar nudo
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Borde del nudo
        this.ctx.shadowColor = 'transparent';
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = type === 'compound' ? 3 : 2;
        this.ctx.stroke();
        
        // Centro del nudo
        this.ctx.fillStyle = '#432818';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    setupAnswerButtons() {
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.selectAnswer(button);
            });
        });
    }
    
    selectAnswer(button) {
        if (!this.isPlaying || this.userAnswer !== null) return;
        
        // Remover selección previa
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Seleccionar respuesta
        button.classList.add('selected');
        this.userAnswer = parseInt(button.querySelector('.answer-number').textContent);
        
        // Verificar respuesta después de un breve delay
        setTimeout(() => {
            this.checkAnswer();
        }, 500);
    }
    
    generateQuestion() {
        if (!this.levelData) {
            console.warn('⚠️ No level data available for question generation');
            return;
        }
        
        // Generar número objetivo basado en el rango del nivel
        const min = this.levelData.target_min || 1;
        const max = this.levelData.target_max || 10;
        this.correctAnswer = Math.floor(Math.random() * (max - min + 1)) + min;
        
        // Actualizar interfaz
        this.updateQuestionUI();
        
        // Generar opciones de respuesta
        this.generateAnswerOptions();
        
        // Dibujar el khipu
        setTimeout(() => {
            this.drawKhipu();
        }, 100);
        
        console.log('❓ Question generated:', this.correctAnswer);
    }
    
    updateQuestionUI() {
        const questionTitle = document.querySelector('.question-title');
        if (questionTitle) {
            questionTitle.textContent = '¿Cuántos nudos ves?';
        }
        
        // Animación de aparición de la pregunta
        const questionSection = document.querySelector('.question-section');
        if (questionSection) {
            questionSection.style.animation = 'fadeIn 0.6s ease-out';
        }
    }
    
    generateAnswerOptions() {
        const buttons = document.querySelectorAll('.answer-btn');
        const options = this.generateOptions(this.correctAnswer);
        
        buttons.forEach((button, index) => {
            if (index < options.length) {
                const numberSpan = button.querySelector('.answer-number');
                const labelSpan = button.querySelector('.answer-label');
                
                if (numberSpan) numberSpan.textContent = options[index];
                if (labelSpan) {
                    labelSpan.textContent = this.numberToWord(options[index]) + ' nudos';
                }
                
                // Marcar respuesta correcta para verificación
                if (options[index] === this.correctAnswer) {
                    button.classList.add('correct-option');
                } else {
                    button.classList.remove('correct-option');
                }
                
                button.style.display = 'flex';
            } else {
                button.style.display = 'none';
            }
        });
    }
    
    generateOptions(correctAnswer) {
        const options = [correctAnswer];
        const usedNumbers = new Set([correctAnswer]);
        
        // Generar opciones incorrectas
        while (options.length < 3) {
            let option;
            if (Math.random() < 0.5) {
                // Opción menor
                option = correctAnswer - Math.floor(Math.random() * 5 + 1);
            } else {
                // Opción mayor
                option = correctAnswer + Math.floor(Math.random() * 5 + 1);
            }
            
            // Asegurar que la opción sea válida y única
            if (option > 0 && option <= 50 && !usedNumbers.has(option)) {
                options.push(option);
                usedNumbers.add(option);
            }
        }
        
        // Mezclar opciones
        return this.shuffleArray(options);
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    numberToWord(num) {
        const words = {
            1: 'Un', 2: 'Dos', 3: 'Tres', 4: 'Cuatro', 5: 'Cinco',
            6: 'Seis', 7: 'Siete', 8: 'Ocho', 9: 'Nueve', 10: 'Diez',
            11: 'Once', 12: 'Doce', 13: 'Trece', 14: 'Catorce', 15: 'Quince',
            16: 'Dieciséis', 17: 'Diecisiete', 18: 'Dieciocho', 19: 'Diecinueve', 20: 'Veinte'
        };
        return words[num] || num.toString();
    }
    
    checkAnswer() {
        if (this.userAnswer === null) return;
        
        const isCorrect = this.userAnswer === this.correctAnswer;
        const selectedButton = document.querySelector('.answer-btn.selected');
        
        if (isCorrect) {
            this.handleCorrectAnswer(selectedButton);
        } else {
            this.handleIncorrectAnswer(selectedButton);
        }
    }
    
    handleCorrectAnswer(button) {
        if (button) {
            button.classList.add('correct');
            GameCommon.GameAnimations.animateSuccess(button);
        }
        
        // Animar nudos con efecto de celebración
        this.animateKnotsSuccess();
        
        // Reproducir sonido de éxito
        GameCommon.SoundManager.play('success');
        
        // Mostrar feedback positivo
        this.showFeedback('¡Correcto! Contaste bien los nudos', 'success');
        
        // Incrementar puntuación
        this.score += 10;
        
        // Finalizar nivel con éxito
        setTimeout(() => {
            this.endGame(true);
        }, 2000);
        
        GameCommon.AccessibilityManager.announce('Respuesta correcta');
    }
    
    handleIncorrectAnswer(button) {
        if (button) {
            button.classList.add('incorrect');
            GameCommon.GameAnimations.animateError(button);
        }
        
        // Mostrar la respuesta correcta
        const correctButton = document.querySelector('.answer-btn.correct-option');
        if (correctButton) {
            correctButton.classList.add('correct');
        }
        
        // Reproducir sonido de error
        GameCommon.SoundManager.play('error');
        
        // Mostrar feedback
        this.showFeedback(`Incorrecto. La respuesta era ${this.correctAnswer} nudos`, 'error');
        
        // Reiniciar después de mostrar la respuesta correcta
        setTimeout(() => {
            this.resetQuestion();
        }, 3000);
        
        GameCommon.AccessibilityManager.announce('Respuesta incorrecta');
    }
    
    animateKnotsSuccess() {
        // Animar nudos en el canvas con efecto de brillo
        const canvas = document.querySelector('.khipu-frame');
        if (canvas) {
            canvas.style.animation = 'success-glow 1s ease-in-out';
            
            // Crear partículas de celebración
            GameCommon.GameAnimations.createParticles(canvas, 15);
        }
        
        // Efecto de conteo animado
        this.animateKnotCounting();
    }
    
    animateKnotCounting() {
        // Animar el conteo de nudos de manera secuencial
        this.knots.forEach((knot, index) => {
            setTimeout(() => {
                this.highlightKnot(knot.x, knot.y);
            }, index * 200);
        });
    }
    
    highlightKnot(x, y) {
        if (!this.ctx) return;
        
        // Dibujar círculo de resaltado
        this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // El círculo se desvanece automáticamente al redibujar
        setTimeout(() => {
            // Opcional: redibujar para limpiar el resaltado
        }, 300);
    }
    
    resetQuestion() {
        // Limpiar estado
        this.userAnswer = null;
        this.correctAnswer = null;
        
        // Limpiar clases de los botones
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.remove('selected', 'correct', 'incorrect', 'correct-option');
        });
        
        // Generar nueva pregunta
        this.generateQuestion();
    }
    
    /**
     * Manejo de redimensionamiento de ventana
     */
    handleResize() {
        if (this.canvas) {
            this.setupCanvas();
        }
    }
}

/**
 * Funciones específicas de Khipu
 */
function initKhipuGame() {
    window.khipuGame = new KhipuGame();
    
    // Configurar redimensionamiento
    window.addEventListener('resize', () => {
        if (window.khipuGame) {
            window.khipuGame.handleResize();
        }
    });
    
    // Iniciar el juego
    setTimeout(() => {
        window.khipuGame.startGame();
    }, 1000);
    
    console.log('🪢 Khipu game initialization complete');
}

// CHANGE HERE: Configuración específica de Khipu
const KHIPU_CONFIG = {
    maxKnotsPerCord: 8,
    cordColors: ['#8B4513', '#654321', '#A0522D'],
    knotSizes: {
        simple: 8,
        compound: 12
    },
    animationDuration: 300
};

// Exportar para uso global
window.KhipuGame = KhipuGame;