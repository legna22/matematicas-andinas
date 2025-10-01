/**
 * Matemáticas Andinas - Tutorial System
 * Sistema de tutoriales narrativos para los juegos
 */

class TutorialManager {
    constructor() {
        this.currentStep = 0;
        this.currentGame = null;
        this.tutorialData = null;
        this.onCompleteCallback = null;
        this.overlay = null;
        
        this.initializeStyles();
    }
    
    /**
     * Mostrar tutorial para un juego específico
     */
    showTutorial(gameType, onComplete) {
        this.currentGame = gameType;
        this.onCompleteCallback = onComplete;
        this.tutorialData = this.getTutorialData(gameType);
        this.currentStep = 0;
        
        this.createTutorialOverlay();
        this.updateTutorialContent();
        this.showOverlay();
        
        console.log(`📚 Tutorial started for ${gameType}`);
    }
    
    /**
     * Obtener datos del tutorial según el juego
     */
    getTutorialData(gameType) {
        const tutorials = {
            khipu: {
                title: "El Khipu Mágico",
                character: "Amaru, el niño quipucamayoc",
                steps: [
                    {
                        text: "¡Hola! Soy Amaru, guardián de los khipus sagrados. En las altas montañas del Tawantinsuyo, mis ancestros usaban cuerdas con nudos coloridos para registrar números y contar tesoros...",
                        image: "niño_andino_saludo",
                        animation: "fadeIn"
                    },
                    {
                        text: "Cada cuerda representa una posición: centenas (×100), decenas (×10) y unidades (×1). Haz clic en las cuerdas para añadir cuentas coloridas y formar el número objetivo.",
                        image: "niño_andino_explicando",
                        animation: "bounce"
                    },
                    {
                        text: "Cuando una cuerda llega a 10 cuentas, se reinicia automáticamente y pasa su valor a la cuerda de la izquierda. ¡Es el sistema decimal de los incas!",
                        image: "niño_andino_animando",
                        animation: "pulse"
                    },
                    {
                        text: "Forma el número objetivo haciendo clic en las cuerdas. Cada clic añade una cuenta colorida. ¡Experimenta y descubre la sabiduría matemática de los incas!",
                        image: "niño_andino_invitando",
                        animation: "wave"
                    }
                ]
            },
            yupana: {
                title: "La Yupana Ancestral",
                character: "Chuya, la niña calculista",
                steps: [
                    {
                        text: "¡Saludos, joven aprendiz! Soy Chuya, maestra de la yupana. Este ábaco sagrado era usado por los sabios incas para realizar cálculos increíbles...",
                        image: "niña_andina_saludo",
                        animation: "fadeIn"
                    },
                    {
                        text: "Cada ficha tiene un poder diferente: las pequeñas valen 1, las medianas valen 3, y las grandes valen 5. ¡Como las piedras preciosas de nuestros templos!",
                        image: "niña_andina_explicando",
                        animation: "bounce"
                    },
                    {
                        text: "Arrastra las fichas mágicas al tablero sagrado. Combínalas sabiamente para formar el número que los dioses te piden.",
                        image: "niña_andina_enseñando",
                        animation: "slideIn"
                    },
                    {
                        text: "Recuerda: cada columna multiplica el valor. ¡Que la sabiduría de Pachamama ilumine tus cálculos!",
                        image: "niña_andina_bendiciendo",
                        animation: "glow"
                    }
                ]
            },
            chacana: {
                title: "La Chacana Sagrada",
                character: "Inti, el guardián del equilibrio",
                steps: [
                    {
                        text: "Bienvenido, hermano del viento. Soy Inti, guardián de la chacana sagrada. Esta cruz andina representa el equilibrio perfecto del cosmos...",
                        image: "niño_sabio_saludo",
                        animation: "fadeIn"
                    },
                    {
                        text: "La chacana debe estar en perfecta armonía. Cada brazo debe reflejar a su opuesto, como el día y la noche, como el sol y la luna.",
                        image: "niño_sabio_explicando",
                        animation: "rotate"
                    },
                    {
                        text: "Observa los patrones: círculos, triángulos, cuadrados y diamantes. Cada símbolo tiene su lugar en el orden cósmico.",
                        image: "niño_sabio_mostrando",
                        animation: "pulse"
                    },
                    {
                        text: "Completa la simetría sagrada y restaura el equilibrio. ¡Los cuatro vientos te acompañan en esta misión!",
                        image: "niño_sabio_bendiciendo",
                        animation: "blessing"
                    }
                ]
            }
        };
        
        return tutorials[gameType] || tutorials.khipu;
    }
    
    /**
     * Crear el overlay del tutorial
     */
    createTutorialOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'tutorial-overlay';
        this.overlay.innerHTML = `
            <div class="tutorial-container">
                <div class="tutorial-background"></div>
                <div class="tutorial-content">
                    <div class="character-section">
                        <div class="character-image" id="characterImage">
                            <div class="character-placeholder">👦</div>
                        </div>
                        <div class="character-name" id="characterName"></div>
                    </div>
                    <div class="dialog-section">
                        <div class="dialog-box">
                            <div class="dialog-title" id="dialogTitle"></div>
                            <div class="dialog-text" id="dialogText"></div>
                            <div class="dialog-progress">
                                <div class="progress-dots" id="progressDots"></div>
                            </div>
                            <div class="dialog-buttons">
                                <button class="btn-skip" id="skipButton" aria-label="Omitir tutorial">
                                    <span class="btn-icon">⏭️</span>
                                    <span class="btn-text">Omitir</span>
                                </button>
                                <button class="btn-next" id="nextButton" aria-label="Siguiente paso">
                                    <span class="btn-text">Siguiente</span>
                                    <span class="btn-icon">➡️</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tutorial-decorations">
                    <div class="decoration decoration-1">🏔️</div>
                    <div class="decoration decoration-2">☀️</div>
                    <div class="decoration decoration-3">🌙</div>
                    <div class="decoration decoration-4">⭐</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.overlay);
        this.setupEventListeners();
    }
    
    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        const nextButton = document.getElementById('nextButton');
        const skipButton = document.getElementById('skipButton');
        
        nextButton.addEventListener('click', () => this.nextStep());
        skipButton.addEventListener('click', () => this.skipTutorial());
        
        // Soporte para teclado
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        
        // Prevenir cierre accidental
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                // No cerrar al hacer clic en el fondo
                e.preventDefault();
            }
        });
    }
    
    /**
     * Manejar teclas
     */
    handleKeyPress(e) {
        if (!this.overlay || this.overlay.style.display === 'none') return;
        
        switch(e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                this.nextStep();
                break;
            case 'Escape':
                e.preventDefault();
                this.skipTutorial();
                break;
        }
    }
    
    /**
     * Actualizar contenido del tutorial
     */
    updateTutorialContent() {
        if (!this.tutorialData) return;
        
        const currentStepData = this.tutorialData.steps[this.currentStep];
        const characterName = document.getElementById('characterName');
        const dialogTitle = document.getElementById('dialogTitle');
        const dialogText = document.getElementById('dialogText');
        const characterImage = document.getElementById('characterImage');
        const nextButton = document.getElementById('nextButton');
        const progressDots = document.getElementById('progressDots');
        
        // Actualizar contenido
        if (characterName) {
            characterName.textContent = this.tutorialData.character;
        }
        
        if (dialogTitle) {
            dialogTitle.textContent = this.tutorialData.title;
        }
        
        if (dialogText) {
            dialogText.textContent = currentStepData.text;
        }
        
        // Actualizar imagen del personaje
        if (characterImage) {
            characterImage.className = `character-image ${currentStepData.animation || 'fadeIn'}`;
            
            // CHANGE HERE: Reemplazar emojis con imágenes reales cuando estén disponibles
            // const imagePath = `/static/images/characters/${currentStepData.image}.png`;
            // characterImage.innerHTML = `<img src="${imagePath}" alt="${this.tutorialData.character}" class="character-img">`;
            
            // Por ahora usamos emojis como placeholder
            const characterEmojis = {
                khipu: '👦',
                yupana: '👧',
                chacana: '🧙‍♂️'
            };
            characterImage.innerHTML = `<div class="character-placeholder">${characterEmojis[this.currentGame] || '👦'}</div>`;
        }
        
        // Actualizar botón siguiente
        if (nextButton) {
            const isLastStep = this.currentStep >= this.tutorialData.steps.length - 1;
            nextButton.querySelector('.btn-text').textContent = isLastStep ? '¡Jugar!' : 'Siguiente';
            nextButton.querySelector('.btn-icon').textContent = isLastStep ? '🎮' : '➡️';
        }
        
        // Actualizar indicadores de progreso
        if (progressDots) {
            progressDots.innerHTML = '';
            for (let i = 0; i < this.tutorialData.steps.length; i++) {
                const dot = document.createElement('div');
                dot.className = `progress-dot ${i === this.currentStep ? 'active' : ''} ${i < this.currentStep ? 'completed' : ''}`;
                progressDots.appendChild(dot);
            }
        }
        
        // Animar entrada del texto
        if (dialogText) {
            dialogText.style.animation = 'none';
            setTimeout(() => {
                dialogText.style.animation = 'textFadeIn 0.6s ease-out';
            }, 10);
        }
    }
    
    /**
     * Avanzar al siguiente paso
     */
    nextStep() {
        if (this.currentStep < this.tutorialData.steps.length - 1) {
            this.currentStep++;
            this.updateTutorialContent();
            
            // Efecto de sonido (si está disponible)
            if (window.GameCommon && window.GameCommon.SoundManager) {
                window.GameCommon.SoundManager.play('page_turn');
            }
        } else {
            // Último paso - iniciar juego
            this.completeTutorial();
        }
    }
    
    /**
     * Omitir tutorial
     */
    skipTutorial() {
        this.completeTutorial();
    }
    
    /**
     * Completar tutorial
     */
    completeTutorial() {
        this.hideOverlay();
        
        setTimeout(() => {
            if (this.onCompleteCallback) {
                this.onCompleteCallback();
            }
            this.cleanup();
        }, 300);
        
        console.log(`✅ Tutorial completed for ${this.currentGame}`);
    }
    
    /**
     * Mostrar overlay
     */
    showOverlay() {
        if (this.overlay) {
            this.overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                this.overlay.classList.add('show');
            }, 10);
        }
    }
    
    /**
     * Ocultar overlay
     */
    hideOverlay() {
        if (this.overlay) {
            this.overlay.classList.remove('show');
            document.body.style.overflow = '';
            
            setTimeout(() => {
                if (this.overlay) {
                    this.overlay.style.display = 'none';
                }
            }, 300);
        }
    }
    
    /**
     * Limpiar recursos
     */
    cleanup() {
        document.removeEventListener('keydown', this.handleKeyPress.bind(this));
        
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
        
        this.currentStep = 0;
        this.currentGame = null;
        this.tutorialData = null;
        this.onCompleteCallback = null;
    }
    
    /**
     * Inicializar estilos CSS dinámicamente
     */
    initializeStyles() {
        if (document.getElementById('tutorial-styles')) return;
        
        const link = document.createElement('link');
        link.id = 'tutorial-styles';
        link.rel = 'stylesheet';
        link.href = '/static/css/tutorials.css';
        document.head.appendChild(link);
    }
}

// Crear instancia global
window.TutorialManager = new TutorialManager();

/**
 * Función de conveniencia para mostrar tutorial
 */
function showTutorial(gameType, onComplete) {
    window.TutorialManager.showTutorial(gameType, onComplete);
}

// Exportar para uso global
window.showTutorial = showTutorial;

console.log('📚 Tutorial system loaded');