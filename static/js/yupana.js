/**
 * Matemáticas Andinas - Yupana Game Logic
 * Lógica específica del juego Yupana
 */

class YupanaGame extends GameCommon.GameManager {
    constructor() {
        super('yupana');
        this.targetNumber = 0;
        this.currentValue = 0;
        this.boardState = {
            centenas: [0, 0, 0, 0],
            decenas: [0, 0, 0, 0],
            unidades: [0, 0, 0, 0]
        };
        this.availablePieces = {
            small: 5,
            medium: 3,
            large: 2
        };
        this.selectedPiece = null;
        this.isDragging = false;
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.setupBoard();
        this.setupPieces();
        this.setupDragAndDrop();
        this.generateTargetNumber();
        
        console.log('🧮 Yupana game initialized');
    }
    
    setupBoard() {
        const cells = document.querySelectorAll('.yupana-grid .cell');
        cells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                this.handleCellClick(cell);
            });
        });
        
        // Configurar valores de las celdas
        this.updateCellValues();
    }
    
    updateCellValues() {
        // Los valores ya están definidos en el HTML como data-value
        // Aquí podemos agregar lógica adicional si es necesario
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
        if (!piece.classList.contains('available')) return;
        
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
        
        const x = event.clientX - 20; // Centrar en el cursor
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
        const pieceValue = this.getPieceValue(pieceType);
        const cellValue = parseInt(cell.dataset.value);
        
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
        GameCommon.GameAnimations.animateSuccess(cell);
        cell.classList.add('cell-correct');
        setTimeout(() => {
            cell.classList.remove('cell-correct');
        }, 1000);
        
        GameCommon.SoundManager.play('place');
        
        console.log('📍 Piece placed in cell:', pieceType, 'value:', cellValue);
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
        GameCommon.GameAnimations.pulse(piece.parentElement);
        
        console.log('🗑️ Piece removed from cell:', pieceType);
    }
    
    returnPieceToStack() {
        // La pieza vuelve automáticamente al stack
        // ya que no se modificó la disponibilidad
        GameCommon.GameAnimations.animateError(this.selectedPiece);
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
        
        // Verificar si se alcanzó el objetivo
        if (this.currentValue === this.targetNumber) {
            this.handleCorrectAnswer();
        }
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
        }
        
        console.log('🔢 Current value updated:', this.currentValue);
    }
    
    generateTargetNumber() {
        if (!this.levelData) return;
        
        const min = this.levelData.target_min || 1;
        const max = this.levelData.target_max || 20;
        this.targetNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        
        // Actualizar display del número objetivo
        const targetDisplay = document.getElementById('targetNumber');
        if (targetDisplay) {
            targetDisplay.textContent = this.targetNumber;
        }
        
        console.log('🎯 Target number generated:', this.targetNumber);
    }
    
    handleCellClick(cell) {
        // Manejar clic directo en celda (para accesibilidad)
        if (this.selectedPiece && this.canDropPieceInCell(cell)) {
            this.dropPieceInCell(cell);
            this.cleanupDrag();
        }
    }
    
    handleCorrectAnswer() {
        this.showFeedback('¡Excelente! Has representado el número correctamente', 'success');
        
        // Efectos visuales de celebración
        const board = document.querySelector('.yupana-board');
        GameCommon.GameAnimations.createParticles(board, 20);
        
        // Animar todas las piezas colocadas
        const placedPieces = document.querySelectorAll('.cell-pieces .piece');
        placedPieces.forEach((piece, index) => {
            setTimeout(() => {
                GameCommon.GameAnimations.pulse(piece, 500);
            }, index * 100);
        });
        
        GameCommon.SoundManager.play('success');
        this.score += 20;
        
        setTimeout(() => {
            this.endGame(true);
        }, 3000);
        
        GameCommon.AccessibilityManager.announce('Número representado correctamente');
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
        GameCommon.GameAnimations.pulse(board);
        
        GameCommon.SoundManager.play('clear');
        
        console.log('🧹 Board cleared');
    }
    
    checkAnswer() {
        if (this.currentValue === this.targetNumber) {
            this.handleCorrectAnswer();
        } else {
            this.showFeedback(
                `Aún no es correcto. Tienes ${this.currentValue}, necesitas ${this.targetNumber}`, 
                'warning'
            );
        }
    }
}

/**
 * Funciones específicas de Yupana
 */
function initYupanaGame() {
    window.yupanaGame = new YupanaGame();
    
    // Configurar botones de acción
    const clearButton = document.querySelector('[onclick="clearBoard()"]');
    if (clearButton) {
        clearButton.onclick = () => window.yupanaGame.clearBoard();
    }
    
    const checkButton = document.querySelector('[onclick="checkAnswer()"]');
    if (checkButton) {
        checkButton.onclick = () => window.yupanaGame.checkAnswer();
    }
    
    // Iniciar el juego
    setTimeout(() => {
        window.yupanaGame.startGame();
    }, 1000);
    
    console.log('🧮 Yupana game initialization complete');
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

// CHANGE HERE: Configuración específica de Yupana
const YUPANA_CONFIG = {
    maxPiecesPerCell: 3,
    pieceValues: {
        small: 1,
        medium: 3,
        large: 5
    },
    columnMultipliers: {
        centenas: 100,
        decenas: 10,
        unidades: 1
    }
};

// Exportar para uso global
window.YupanaGame = YupanaGame;