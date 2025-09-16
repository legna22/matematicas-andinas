/**
 * Matemáticas Andinas - Chacana Game Logic
 * Lógica específica del juego Chacana
 */

class ChacanaGame extends GameCommon.GameManager {
    constructor() {
        super('chacana');
        this.targetPattern = null;
        this.selectedPattern = null;
        this.selectableCells = [];
        this.completedCells = 0;
        this.totalSelectableCells = 0;
        this.patternSolution = {};
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.setupPatternOptions();
        this.setupGrid();
        this.generateChallenge();
        
        console.log('✚ Chacana game initialized');
    }
    
    setupPatternOptions() {
        const patternOptions = document.querySelectorAll('.pattern-option');
        patternOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectPattern(option.dataset.pattern);
            });
            
            // Soporte para teclado
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectPattern(option.dataset.pattern);
                }
            });
        });
    }
    
    setupGrid() {
        const selectableCells = document.querySelectorAll('.grid-cell.selectable');
        selectableCells.forEach(cell => {
            cell.addEventListener('click', () => {
                this.handleCellClick(cell);
            });
            
            // Soporte para teclado
            cell.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCellClick(cell);
                }
            });
        });
        
        this.selectableCells = Array.from(selectableCells);
        this.totalSelectableCells = this.selectableCells.length;
        
        // Configurar navegación por teclado
        GameCommon.AccessibilityManager.setupKeyboardNavigation(
            document.querySelector('.chacana-grid'),
            '.grid-cell.selectable'
        );
    }
    
    generateChallenge() {
        if (!this.levelData) return;
        
        // Generar patrón basado en el nivel
        this.generateTargetPattern();
        
        // Configurar celdas vacías que deben completarse
        this.setupSelectableCells();
        
        // Actualizar información del desafío
        this.updateChallengeInfo();
        
        console.log('🎯 Chacana challenge generated');
    }
    
    generateTargetPattern() {
        // Definir patrones según la dificultad
        const difficulty = this.levelData.difficulty || 'facil';
        const patterns = {
            facil: ['circle', 'triangle'],
            medio: ['circle', 'triangle', 'square'],
            dificil: ['circle', 'triangle', 'square', 'diamond']
        };
        
        const availablePatterns = patterns[difficulty];
        
        // Generar solución para cada celda seleccionable
        this.selectableCells.forEach(cell => {
            const position = cell.dataset.pos;
            const requiredPattern = this.getRequiredPattern(position, availablePatterns);
            this.patternSolution[position] = requiredPattern;
            cell.dataset.requiredPattern = requiredPattern;
        });
        
        console.log('🔮 Pattern solution:', this.patternSolution);
    }
    
    getRequiredPattern(position, availablePatterns) {
        // Generar patrón basado en simetría
        const symmetryMap = {
            'n2': 's1',  // Norte-Sur
            's1': 'n2',
            'e3': 'w2',  // Este-Oeste
            'w2': 'e3'
        };
        
        const symmetricPos = symmetryMap[position];
        
        if (symmetricPos && this.patternSolution[symmetricPos]) {
            // Usar el mismo patrón que su simétrico
            return this.patternSolution[symmetricPos];
        } else {
            // Elegir patrón aleatorio de los disponibles
            return availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
        }
    }
    
    setupSelectableCells() {
        // Marcar celdas como requeridas según la dificultad del nivel
        const totalCells = this.selectableCells.length;
        const difficulty = this.levelData.difficulty || 'facil';
        
        const requiredCells = {
            facil: Math.min(2, totalCells),
            medio: Math.min(3, totalCells),
            dificil: totalCells
        };
        
        const required = requiredCells[difficulty];
        
        // Seleccionar celdas aleatoriamente para completar
        const shuffledCells = this.shuffleArray([...this.selectableCells]);
        
        for (let i = 0; i < required; i++) {
            const cell = shuffledCells[i];
            cell.classList.add('required');
        }
        
        this.totalSelectableCells = required;
    }
    
    updateChallengeInfo() {
        const patternType = document.getElementById('patternType');
        if (patternType) {
            const difficulty = this.levelData.difficulty || 'facil';
            const descriptions = {
                facil: 'Simetría simple',
                medio: 'Patrón equilibrado',
                dificil: 'Armonía completa'
            };
            patternType.textContent = descriptions[difficulty];
        }
        
        this.updateCompletionStatus();
    }
    
    selectPattern(patternName) {
        // Remover selección previa
        document.querySelectorAll('.pattern-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Seleccionar nuevo patrón
        const selectedOption = document.querySelector(`[data-pattern="${patternName}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
            this.selectedPattern = patternName;
            
            // Efecto visual
            GameCommon.GameAnimations.pulse(selectedOption);
            
            GameCommon.SoundManager.play('select');
            
            console.log('🎨 Pattern selected:', patternName);
        }
    }
    
    handleCellClick(cell) {
        if (!this.selectedPattern) {
            this.showFeedback('Primero selecciona un patrón', 'warning');
            return;
        }
        
        if (cell.classList.contains('selected')) {
            // Deseleccionar celda
            this.deselectCell(cell);
        } else {
            // Seleccionar celda con el patrón actual
            this.selectCell(cell);
        }
    }
    
    selectCell(cell) {
        cell.classList.add('selected');
        cell.dataset.pattern = this.selectedPattern;
        
        // Efecto visual
        GameCommon.GameAnimations.animateSuccess(cell);
        GameCommon.SoundManager.play('place');
        
        this.updateCompletionStatus();
        this.checkCellCorrectness(cell);
        
        console.log('🟨 Cell selected:', cell.dataset.pos, 'pattern:', this.selectedPattern);
    }
    
    deselectCell(cell) {
        cell.classList.remove('selected', 'correct', 'incorrect');
        delete cell.dataset.pattern;
        
        this.updateCompletionStatus();
        
        console.log('⬜ Cell deselected:', cell.dataset.pos);
    }
    
    checkCellCorrectness(cell) {
        const position = cell.dataset.pos;
        const selectedPattern = cell.dataset.pattern;
        const requiredPattern = cell.dataset.requiredPattern;
        
        if (selectedPattern === requiredPattern) {
            cell.classList.add('correct');
            cell.classList.remove('incorrect');
            GameCommon.GameAnimations.animateSuccess(cell);
        } else {
            cell.classList.add('incorrect');
            cell.classList.remove('correct');
            GameCommon.GameAnimations.animateError(cell);
        }
    }
    
    updateCompletionStatus() {
        const selectedCells = document.querySelectorAll('.grid-cell.selectable.selected');
        const requiredCells = document.querySelectorAll('.grid-cell.required');
        
        this.completedCells = selectedCells.length;
        
        const statusDisplay = document.getElementById('completionStatus');
        if (statusDisplay) {
            statusDisplay.textContent = `${this.completedCells}/${requiredCells.length}`;
        }
        
        // Verificar si se completó el patrón
        if (this.completedCells >= requiredCells.length) {
            setTimeout(() => {
                this.checkPattern();
            }, 500);
        }
    }
    
    checkPattern() {
        const requiredCells = document.querySelectorAll('.grid-cell.required');
        let correctCells = 0;
        
        requiredCells.forEach(cell => {
            const position = cell.dataset.pos;
            const selectedPattern = cell.dataset.pattern;
            const requiredPattern = cell.dataset.requiredPattern;
            
            if (selectedPattern === requiredPattern) {
                correctCells++;
            }
        });
        
        if (correctCells === requiredCells.length) {
            this.handleCorrectPattern();
        } else {
            this.handleIncompletePattern(correctCells, requiredCells.length);
        }
    }
    
    handleCorrectPattern() {
        this.showFeedback('¡Perfecto! Has completado la chacana con armonía', 'success');
        
        // Animación de celebración
        const grid = document.querySelector('.chacana-grid');
        grid.classList.add('chacana-complete');
        
        // Crear partículas de celebración
        GameCommon.GameAnimations.createParticles(
            document.querySelector('.chacana-frame'), 
            25
        );
        
        // Animar cada celda correcta en secuencia
        const correctCells = document.querySelectorAll('.grid-cell.correct');
        correctCells.forEach((cell, index) => {
            setTimeout(() => {
                GameCommon.GameAnimations.pulse(cell, 800);
            }, index * 200);
        });
        
        GameCommon.SoundManager.play('success');
        this.score += 30;
        
        setTimeout(() => {
            this.endGame(true);
        }, 3000);
        
        GameCommon.AccessibilityManager.announce('Chacana completada correctamente');
    }
    
    handleIncompletePattern(correct, total) {
        const message = `${correct} de ${total} patrones son correctos. Revisa la simetría`;
        this.showFeedback(message, 'warning');
        
        // Resaltar celdas incorrectas
        const incorrectCells = document.querySelectorAll('.grid-cell.incorrect');
        incorrectCells.forEach(cell => {
            GameCommon.GameAnimations.animateError(cell);
        });
        
        GameCommon.SoundManager.play('error');
    }
    
    clearSelections() {
        const selectedCells = document.querySelectorAll('.grid-cell.selected');
        selectedCells.forEach(cell => {
            this.deselectCell(cell);
        });
        
        // Limpiar selección de patrón también
        document.querySelectorAll('.pattern-option').forEach(option => {
            option.classList.remove('selected');
        });
        this.selectedPattern = null;
        
        this.updateCompletionStatus();
        
        GameCommon.SoundManager.play('clear');
        
        console.log('🧹 All selections cleared');
    }
    
    showSymmetryLines(show = true) {
        const lines = document.querySelectorAll('.symmetry-line');
        lines.forEach(line => {
            line.classList.toggle('show', show);
        });
        
        if (show) {
            setTimeout(() => {
                this.showSymmetryLines(false);
            }, 3000);
        }
    }
    
    /**
     * Proporcionar pista visual
     */
    provideHint() {
        // Mostrar líneas de simetría
        this.showSymmetryLines();
        
        // Resaltar una celda que necesita completarse
        const incompleteCells = document.querySelectorAll('.grid-cell.required:not(.selected)');
        if (incompleteCells.length > 0) {
            const hintCell = incompleteCells[0];
            hintCell.classList.add('tutorial-highlight');
            
            setTimeout(() => {
                hintCell.classList.remove('tutorial-highlight');
            }, 2000);
        }
        
        this.showFeedback('Observa las líneas de simetría para encontrar el patrón', 'info');
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

/**
 * Funciones específicas de Chacana
 */
function initChacanaGame() {
    window.chacanaGame = new ChacanaGame();
    
    // Configurar botones de acción
    const clearButton = document.querySelector('[onclick="clearSelections()"]');
    if (clearButton) {
        clearButton.onclick = () => window.chacanaGame.clearSelections();
    }
    
    const checkButton = document.querySelector('[onclick="checkPattern()"]');
    if (checkButton) {
        checkButton.onclick = () => window.chacanaGame.checkPattern();
    }
    
    // Iniciar el juego
    setTimeout(() => {
        window.chacanaGame.startGame();
    }, 1000);
    
    console.log('✚ Chacana game initialization complete');
}

// Funciones globales para botones
function clearSelections() {
    if (window.chacanaGame) {
        window.chacanaGame.clearSelections();
    }
}

function checkPattern() {
    if (window.chacanaGame) {
        window.chacanaGame.checkPattern();
    }
}

function showHint() {
    if (window.chacanaGame) {
        window.chacanaGame.provideHint();
    }
}

// CHANGE HERE: Configuración específica de Chacana
const CHACANA_CONFIG = {
    patterns: {
        circle: '●',
        triangle: '▲',
        square: '■',
        diamond: '♦'
    },
    symmetryTypes: ['horizontal', 'vertical', 'diagonal1', 'diagonal2'],
    difficulties: {
        facil: { requiredCells: 2, patterns: 2 },
        medio: { requiredCells: 3, patterns: 3 },
        dificil: { requiredCells: 4, patterns: 4 }
    }
};

// Exportar para uso global
window.ChacanaGame = ChacanaGame;