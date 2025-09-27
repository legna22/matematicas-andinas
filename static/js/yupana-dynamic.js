/**
 * Matemáticas Andinas - Yupana Dynamic Game Logic
 * Lógica dinámica del juego Yupana basada en levels.json
 */

class YupanaDynamicGame {
    constructor() {
        this.gameEngine = null;
        this.targetNumber = 0;
        this.currentValue = 0;
        this.boardState = {
            centenas: [0, 0, 0, 0],
            decenas: [0, 0, 0, 0],
            unidades: [0, 0, 0, 0]
        };
        this.availablePieces = {
            small: 8,
            medium: 5,
            large: 3
        };
        this.selectedPiece = null;
        this.isDragging = false;
        this.currentQuestion = null;
        
        this.initializeGame();
    }
    
    initializeGame() {
        // Inicializar motor de juego
        this.gameEngine = new GameEngine('yupana', window.GAME_DATA);
        
        this.setupBoard();
        this.setupPieces();
        this.setupDragAndDrop();
        this.startNewGame();
        
        console.log('🧮 Yupana dynamic game initialized');
    }
    
    /**
     * Iniciar nuevo juego
     */
    startNewGame() {
        this.currentQuestion = this.gameEngine.startGame();
        this.updateQuestion(this.currentQuestion);
    }
    
    /**
     * Actualizar pregunta en la interfaz
     */
    updateQuestion(question) {
        if (!question) return;
        
        this.currentQuestion = question;
        this.targetNumber = question.correctAnswer;
        
        // Actualizar descripción del nivel
        this.updateLevelDescription();
        
        // Actualizar número objetivo
        this.updateTargetDisplay();
        
        // Limpiar tablero
        this.clearBoard();
        
        // Ajustar disponibilidad de piezas según dificultad
        this.adjustPieceAvailability();
    }
    
    /**
     * Actualizar descripción del nivel
     */
    updateLevelDescription() {
        const questionDesc = document.getElementById('questionDesc');
        if (questionDesc && this.gameEngine.levelData) {
            questionDesc.textContent = this.gameEngine.levelData.desc || 'Usa las fichas para representar el número en la yupana';
        }
    }
    
    /**
     * Actualizar display del número objetivo
     */
    updateTargetDisplay() {
        const targetDisplay = document.getElementById('targetNumber');
        if (targetDisplay) {
            targetDisplay.textContent = this.targetNumber;
            
            // Animación de cambio
            targetDisplay.style.animation = 'none';
            setTimeout(() => {
                targetDisplay.style.animation = 'pulse 0.5s ease-out';
            }, 10);
        }
    }
    
    /**
     * Ajustar disponibilidad de piezas según dificultad
     */
    adjustPieceAvailability() {
        const difficulty = this.gameEngine.levelData.difficulty;
        const targetNumber = this.targetNumber;
        
        // Calcular piezas necesarias de manera inteligente
        const optimalPieces = this.calculateOptimalPieces(targetNumber);
        
        // Ajustar según dificultad
        const difficultyMultipliers = {
            'facil': 1.5,    // Más piezas disponibles
            'medio': 1.2,    // Algunas piezas extra
            'dificil': 1.0   // Solo las necesarias
        };
        
        const multiplier = difficultyMultipliers[difficulty] || 1.2;
        
        this.availablePieces = {
            small: Math.ceil(optimalPieces.small * multiplier),
            medium: Math.ceil(optimalPieces.medium * multiplier),
            large: Math.ceil(optimalPieces.large * multiplier)
        };
        
        this.updatePieceAvailability();
        
        console.log(`🎯 Pieces adjusted for target ${targetNumber}, difficulty ${difficulty}:`, this.availablePieces);
    }
    
    /**
     * Calcular piezas óptimas para un número
     */
    calculateOptimalPieces(number) {
        // Estrategia: usar el mínimo número de piezas
        let remaining = number;
        const pieces = { small: 0, medium: 0, large: 0 };
        
        // Descomponer por columnas (centenas, decenas, unidades)
        const hundreds = Math.floor(remaining / 100);
        remaining %= 100;
        const tens = Math.floor(remaining / 10);
        remaining %= 10;
        const units = remaining;
        
        // Para cada columna, calcular piezas óptimas
        [hundreds, tens, units].forEach(value => {
            if (value >= 5) {
                pieces.large += Math.floor(value / 5);
                value %= 5;
            }
            if (value >= 3) {
                pieces.medium += Math.floor(value / 3);
                value %= 3;
            }
            pieces.small += value;
        });
        
        // Agregar algunas piezas extra para flexibilidad
        pieces.small += 2;
        pieces.medium += 1;
        pieces.large += 1;
        
        return pieces;
    }
    
    setupBoard() {
        const cells = document.querySelectorAll('.yupana-grid .cell');
        cells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                this.handleCellClick(cell);
            });
        });
        
        this.updateCellValues();
    }
    
    updateCellValues() {
        // Los valores ya están definidos en el HTML como data-value
        console.log('📊 Cell values updated');
    }
    
    setupPieces() {
        const pieces = document.querySelectorAll('.piece');
        pieces.forEach(piece => {
            piece.addEventListener('mousedown', (e) => {
                this.startDrag(piece, e);
            });
            
            piece.addEventListener('touchstart', (e) => {
                this.startDrag(piece, e);
            }, { passive: false });
        });
        
        this.updatePieceAvailability();
    }
    
    updatePieceAvailability() {
        const pieceTypes = ['small', 'medium', 'large'];
        
        pieceTypes.forEach(type => {
            const pieces = document.querySelectorAll(`.piece[data-type="${type}"]`);
            const available = this.availablePieces[type];
            
            pieces.forEach((piece, index) => {
                if (index < available) {
                    piece.classList.remove('used');
                    piece.classList.add('available');
                } else {
                    piece.classList.add('used');
                    piece.classList.remove('available');
                }
            });
        });
    }
    
    setupDragAndDrop() {
        // Prevenir comportamiento por defecto del navegador
        document.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
        
        // Eventos de mouse
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.handleDrag(e);
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            if (this.isDragging) {
                this.endDrag(e);
            }
        });
        
        // Eventos táctiles
        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.handleDrag(e.touches[0]);
            }
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            if (this.isDragging) {
                this.endDrag(e.changedTouches[0]);
            }
        });
    }
    
    startDrag(piece, event) {
        if (!piece.classList.contains('available') || !this.gameEngine.isPlaying) return;
        
        this.selectedPiece = piece;
        this.isDragging = true;
        
        piece.classList.add('dragging');
        
        // Crear copia visual para arrastrar
        this.createDragPreview(piece, event);
        
        // Resaltar zonas de destino válidas
        this.highlightDropZones(true);
        
        console.log('🖱️ Started dragging piece:', piece.dataset.type);
    }
    
    createDragPreview(piece, event) {
        const preview = piece.cloneNode(true);
        preview.className = 'drag-preview';
        preview.style.position = 'fixed';
        preview.style.pointerEvents = 'none';
        preview.style.zIndex = '1000';
        
        document.body.appendChild(preview);
        this.dragPreview = preview;
        
        this.updateDragPreview(event);
    }
    
    updateDragPreview(event) {
        if (!this.dragPreview) return;
        
        const x = event.clientX - 20;
        const y = event.clientY - 20;
        
        this.dragPreview.style.left = x + 'px';
        this.dragPreview.style.top = y + 'px';
    }
    
    handleDrag(event) {
        this.updateDragPreview(event);
        
        // Detectar celda debajo del cursor
        const elementBelow = document.elementFromPoint(event.clientX, event.clientY);
        const cell = elementBelow?.closest('.cell');
        
        // Actualizar indicadores visuales
        this.updateDropIndicators(cell);
    }
    
    updateDropIndicators(cell) {
        // Limpiar indicadores previos
        document.querySelectorAll('.cell').forEach(c => {
            c.classList.remove('drop-zone-active', 'drop-zone-invalid');
        });
        
        if (cell) {
            const canDrop = this.canDropPieceInCell(cell);
            cell.classList.add(canDrop ? 'drop-zone-active' : 'drop-zone-invalid');
        }
    }
    
    canDropPieceInCell(cell) {
        if (!this.selectedPiece || !cell) return false;
        
        // Verificar si la celda puede aceptar más piezas
        const cellPieces = cell.querySelectorAll('.piece');
        const maxPieces = 3; // Máximo 3 piezas por celda
        
        return cellPieces.length < maxPieces;
    }
    
    endDrag(event) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.highlightDropZones(false);
        
        // Encontrar celda de destino
        const elementBelow = document.elementFromPoint(event.clientX, event.clientY);
        const targetCell = elementBelow?.closest('.cell');
        
        if (targetCell && this.canDropPieceInCell(targetCell)) {
            this.dropPieceInCell(targetCell);
        } else {
            this.returnPieceToStack();
        }
        
        // Limpiar estado de arrastre
        this.cleanupDrag();
        
        console.log('🖱️ Ended drag operation');
    }
    
    dropPieceInCell(cell) {
        if (!this.selectedPiece) return;
        
        const pieceType = this.selectedPiece.dataset.type;
        
        // Crear nueva pieza en la celda
        const newPiece = this.createCellPiece(pieceType);
        
        // Agregar a la celda
        let cellPiecesContainer = cell.querySelector('.cell-pieces');
        if (!cellPiecesContainer) {
            cellPiecesContainer = document.createElement('div');
            cellPiecesContainer.className = 'cell-pieces';
            cell.appendChild(cellPiecesContainer);
        }
        
        cellPiecesContainer.appendChild(newPiece);
        
        // Actualizar disponibilidad de piezas
        this.availablePieces[pieceType]--;
        this.updatePieceAvailability();
        
        // Actualizar valor total
        this.updateCurrentValue();
        
        // Efectos visuales
        if (window.GameCommon) {
            window.GameCommon.GameAnimations.animateSuccess(cell);
        }
        cell.classList.add('cell-correct');
        setTimeout(() => {
            cell.classList.remove('cell-correct');
        }, 1000);
        
        if (window.GameCommon) {
            window.GameCommon.SoundManager.play('place');
        }
        
        console.log('📍 Piece placed in cell:', pieceType);
        
        // Verificar automáticamente si se alcanzó el objetivo
        this.checkAutoComplete();
    }
    
    /**
     * Verificar automáticamente si se completó el objetivo
     */
    checkAutoComplete() {
        if (this.currentValue === this.targetNumber) {
            setTimeout(() => {
                this.handleCorrectAnswer();
            }, 500);
        }
    }
    
    createCellPiece(type) {
        const piece = document.createElement('div');
        piece.className = `piece ${type}`;
        piece.dataset.type = type;
        
        // Agregar evento de clic para remover
        piece.addEventListener('click', () => {
            this.removePieceFromCell(piece);
        });
        
        return piece;
    }
    
    removePieceFromCell(piece) {
        const pieceType = piece.dataset.type;
        
        // Remover pieza
        piece.remove();
        
        // Devolver pieza al stack
        this.availablePieces[pieceType]++;
        this.updatePieceAvailability();
        
        // Actualizar valor
        this.updateCurrentValue();
        
        // Efecto visual
        if (window.GameCommon) {
            window.GameCommon.GameAnimations.pulse(piece.parentElement);
        }
        
        console.log('🗑️ Piece removed from cell:', pieceType);
    }
    
    returnPieceToStack() {
        // La pieza vuelve automáticamente al stack
        if (window.GameCommon) {
            window.GameCommon.GameAnimations.animateError(this.selectedPiece);
        }
    }
    
    cleanupDrag() {
        if (this.selectedPiece) {
            this.selectedPiece.classList.remove('dragging');
            this.selectedPiece = null;
        }
        
        if (this.dragPreview) {
            this.dragPreview.remove();
            this.dragPreview = null;
        }
        
        // Limpiar indicadores
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('drop-zone-active', 'drop-zone-invalid');
        });
    }
    
    highlightDropZones(highlight) {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            if (highlight) {
                cell.classList.add('drop-target');
            } else {
                cell.classList.remove('drop-target');
            }
        });
    }
    
    getPieceValue(type) {
        const values = {
            small: 1,
            medium: 3,
            large: 5
        };
        return values[type] || 1;
    }
    
    updateCurrentValue() {
        let total = 0;
        
        // Calcular valor de cada columna
        const columns = ['centenas', 'decenas', 'unidades'];
        const multipliers = [100, 10, 1];
        
        columns.forEach((column, columnIndex) => {
            const columnElement = document.querySelector(`.yupana-column.${column}`);
            if (!columnElement) return;
            
            const cells = columnElement.querySelectorAll('.cell');
            
            cells.forEach(cell => {
                const pieces = cell.querySelectorAll('.piece');
                let cellValue = 0;
                
                pieces.forEach(piece => {
                    const pieceType = piece.dataset.type;
                    cellValue += this.getPieceValue(pieceType);
                });
                
                // Multiplicar por el valor de la celda
                const cellMultiplier = parseInt(cell.dataset.value);
                total += (cellValue * cellMultiplier) * multipliers[columnIndex];
            });
        });
        
        this.currentValue = total;
        this.updateValueDisplay();
    }
    
    updateValueDisplay() {
        const valueDisplay = document.getElementById('currentValue');
        if (valueDisplay) {
            valueDisplay.textContent = this.currentValue;
            
            // Animación de cambio de valor
            valueDisplay.classList.add('value-change');
            setTimeout(() => {
                valueDisplay.classList.remove('value-change');
            }, 500);
            
            // Cambiar color según proximidad al objetivo
            const difference = Math.abs(this.currentValue - this.targetNumber);
            if (this.currentValue === this.targetNumber) {
                valueDisplay.style.color = 'var(--color-success)';
            } else if (difference <= 5) {
                valueDisplay.style.color = 'var(--color-warning)';
            } else {
                valueDisplay.style.color = 'var(--color-golden-sun)';
            }
        }
        
        console.log('🔢 Current value updated:', this.currentValue);
    }
    
    handleCellClick(cell) {
        // Manejar clic directo en celda (para accesibilidad)
        if (this.selectedPiece && this.canDropPieceInCell(cell)) {
            this.dropPieceInCell(cell);
            this.cleanupDrag();
        }
    }
    
    handleCorrectAnswer() {
        const result = this.gameEngine.checkAnswer(this.currentValue);
        if (!result || !result.isCorrect) return;
        
        // Efectos visuales de celebración
        const board = document.querySelector('.yupana-board');
        if (window.GameCommon) {
            window.GameCommon.GameAnimations.createParticles(board, 20);
        }
        
        // Animar todas las piezas colocadas
        const placedPieces = document.querySelectorAll('.cell-pieces .piece');
        placedPieces.forEach((piece, index) => {
            setTimeout(() => {
                if (window.GameCommon) {
                    window.GameCommon.GameAnimations.pulse(piece, 500);
                }
            }, index * 100);
        });
        
        if (window.GameCommon) {
            window.GameCommon.SoundManager.play('success');
            window.GameCommon.AccessibilityManager.announce('Número representado correctamente');
        }
    }
    
    clearBoard() {
        // Remover todas las piezas del tablero
        const cellPieces = document.querySelectorAll('.cell-pieces');
        cellPieces.forEach(container => {
            const pieces = container.querySelectorAll('.piece');
            pieces.forEach(piece => {
                const pieceType = piece.dataset.type;
                this.availablePieces[pieceType]++;
                piece.remove();
            });
        });
        
        // Actualizar displays
        this.updatePieceAvailability();
        this.updateCurrentValue();
        
        // Efecto visual
        const board = document.querySelector('.yupana-board');
        if (window.GameCommon) {
            window.GameCommon.GameAnimations.pulse(board);
            window.GameCommon.SoundManager.play('clear');
        }
        
        console.log('🧹 Board cleared');
    }
    
    checkAnswer() {
        const result = this.gameEngine.checkAnswer(this.currentValue);
        if (!result) return;
        
        if (!result.isCorrect) {
            // Mostrar feedback específico
            const difference = Math.abs(this.currentValue - this.targetNumber);
            let message = result.explanation.message;
            
            if (difference <= 5) {
                message += ' ¡Estás muy cerca!';
            } else if (difference <= 10) {
                message += ' Revisa algunas fichas.';
            } else {
                message += ' Necesitas hacer más cambios.';
            }
            
            this.showFeedback(message, 'warning');
        }
    }
    
    showFeedback(message, type) {
        // Usar el sistema de feedback del GameEngine o crear uno simple
        if (window.MathAndinas && window.MathAndinas.showNotification) {
            window.MathAndinas.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
    
    /**
     * Proporcionar pista inteligente
     */
    provideHint() {
        const difference = this.targetNumber - this.currentValue;
        let hint = '';
        
        if (difference > 0) {
            hint = `Necesitas agregar ${difference} más. `;
            if (difference >= 5) {
                hint += 'Considera usar fichas grandes (valor 5).';
            } else if (difference >= 3) {
                hint += 'Puedes usar una ficha mediana (valor 3).';
            } else {
                hint += 'Usa fichas pequeñas (valor 1).';
            }
        } else if (difference < 0) {
            hint = `Tienes ${Math.abs(difference)} de más. Quita algunas fichas.`;
        } else {
            hint = '¡Perfecto! Tu representación es correcta.';
        }
        
        this.showFeedback(hint, 'info');
    }
}

/**
 * Funciones específicas de Yupana
 */
function initYupanaDynamicGame() {
    window.yupanaGame = new YupanaDynamicGame();
    window.currentGameInstance = window.yupanaGame; // Para el GameEngine
    
    console.log('🧮 Yupana dynamic game initialization complete');
}

// Funciones globales para botones
function clearBoard() {
    if (window.yupanaGame) {
        window.yupanaGame.clearBoard();
    }
}

function checkAnswer() {
    if (window.yupanaGame) {
        window.yupanaGame.checkAnswer();
    }
}

function showHint() {
    if (window.yupanaGame) {
        window.yupanaGame.provideHint();
    }
}

// Exportar para uso global
window.YupanaDynamicGame = YupanaDynamicGame;