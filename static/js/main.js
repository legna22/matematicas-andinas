/**
 * Matemáticas Andinas - Main JavaScript
 * Funciones principales de navegación y selección
 */

// Estado global de la aplicación
window.AppState = {
    selectedGame: null,
    selectedLevel: 'primaria',
    selectedGrade: 1,
    isTransitioning: false
};

/**
 * Inicializar la selección en la página de inicio
 */
function initHomeSelection() {
    const gameOptions = document.querySelectorAll('.game-option');
    const levelButtons = document.querySelectorAll('.btn-level');
    const gradeSelect = document.getElementById('gradeSelect');
    const playButton = document.getElementById('playButton');
    
    // CHANGE HERE: Agregar nuevos juegos a esta función
    console.log('🎮 Initializing home selection with', gameOptions.length, 'games available');
    
    // Configurar selección de juegos
    gameOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectGame(this.dataset.game);
        });
        
        // Soporte para teclado
        option.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectGame(this.dataset.game);
            }
        });
    });
    
    // Configurar botones de nivel educativo
    levelButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectLevel(this.dataset.level);
            updateGradeOptions(this.dataset.level);
        });
    });
    
    // Configurar selector de grado
    if (gradeSelect) {
        gradeSelect.addEventListener('change', function() {
            window.AppState.selectedGrade = parseInt(this.value);
            updatePlayButton();
            console.log('📚 Grade selected:', window.AppState.selectedGrade);
        });
    }
    
    // Configurar botón de jugar
    if (playButton) {
        playButton.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                startGame();
            }
        });
    }
    
    // Inicializar estado por defecto
    updateGradeOptions('primaria');
    updatePlayButton();
    
    // SUGGEST: Para agregar nuevos juegos, crear elementos con clase 'game-option' y data-game="nombre"
    console.log('✅ Home selection initialized successfully');
}

/**
 * Seleccionar un juego
 */
function selectGame(gameName) {
    // Remover selección previa
    document.querySelectorAll('.game-option').forEach(option => {
        option.classList.remove('seleccionado');
    });
    
    // Seleccionar nuevo juego
    const selectedOption = document.querySelector(`[data-game="${gameName}"]`);
    if (selectedOption) {
        selectedOption.classList.add('seleccionado');
        window.AppState.selectedGame = gameName;
        
        // Efectos visuales
        selectedOption.style.transform = 'scale(1.05)';
        setTimeout(() => {
            selectedOption.style.transform = '';
        }, 200);
        
        updatePlayButton();
        
        // CHANGE HERE: Personalizar sonidos de selección
        console.log('🎯 Game selected:', gameName);
    }
}

/**
 * Seleccionar nivel educativo
 */
function selectLevel(level) {
    document.querySelectorAll('.btn-level').forEach(button => {
        button.classList.remove('active');
    });
    
    const selectedButton = document.querySelector(`[data-level="${level}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
        window.AppState.selectedLevel = level;
        console.log('🎓 Education level selected:', level);
    }
}

/**
 * Actualizar opciones de grado según el nivel educativo
 */
function updateGradeOptions(level) {
    const gradeSelect = document.getElementById('gradeSelect');
    if (!gradeSelect) return;
    
    gradeSelect.innerHTML = '';
    
    if (level === 'primaria') {
        // CHANGE HERE: Ajustar grados de primaria según el sistema educativo
        for (let i = 1; i <= 6; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}° Grado`;
            gradeSelect.appendChild(option);
        }
    } else if (level === 'secundaria') {
        // CHANGE HERE: Ajustar grados de secundaria (7-11 para bachillerato completo)
        for (let i = 7; i <= 11; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i <= 9 ? `${i}° Grado` : `${i - 6}° Bachillerato`;
            gradeSelect.appendChild(option);
        }
    }
    
    // Actualizar estado
    window.AppState.selectedGrade = parseInt(gradeSelect.value);
    updatePlayButton();
}

/**
 * Actualizar estado del botón de jugar
 */
function updatePlayButton() {
    const playButton = document.getElementById('playButton');
    const playText = document.querySelector('.play-text');
    
    if (!playButton || !playText) return;
    
    if (window.AppState.selectedGame) {
        playButton.classList.remove('disabled');
        playButton.disabled = false;
        playText.textContent = `Jugar ${capitalize(window.AppState.selectedGame)}`;
    } else {
        playButton.classList.add('disabled');
        playButton.disabled = true;
        playText.textContent = 'Selecciona un juego';
    }
}

/**
 * Iniciar el juego seleccionado con animación de transición
 */
function startGame() {
    if (!window.AppState.selectedGame || window.AppState.isTransitioning) {
        return;
    }
    
    window.AppState.isTransitioning = true;
    
    // Mostrar overlay de carga
    showLoadingOverlay();
    
    // Animación de salida
    const homeContent = document.querySelector('.home-content');
    if (homeContent) {
        homeContent.style.transition = 'all 0.5s ease-out';
        homeContent.style.opacity = '0';
        homeContent.style.transform = 'translateY(-50px)';
    }
    
    // Esperar a que termine la animación antes de navegar
    setTimeout(() => {
        const gameUrl = buildGameUrl();
        console.log('🚀 Starting game:', gameUrl);
        
        // SUGGEST: Hacer commit antes de cambios importantes
        // git commit -m "feat: implement game navigation with transitions"
        window.location.href = gameUrl;
    }, 600);
}

/**
 * Construir URL del juego con parámetros
 */
function buildGameUrl() {
    const { selectedGame, selectedGrade } = window.AppState;
    const baseUrl = `/${selectedGame}`;
    const params = new URLSearchParams({
        grade: selectedGrade,
        level: 1 // Siempre empezar en nivel 1
    });
    
    return `${baseUrl}?${params.toString()}`;
}

/**
 * Mostrar overlay de carga
 */
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
    }
}

/**
 * Ocultar overlay de carga
 */
function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
}

/**
 * Mostrar header del juego
 */
function showGameHeader() {
    const header = document.getElementById('gameHeader');
    if (header) {
        header.style.display = 'block';
        
        // Actualizar información del header
        const gameTitle = document.getElementById('gameTitle');
        const currentLevel = document.getElementById('currentLevel');
        const currentGrade = document.getElementById('currentGrade');
        
        // Obtener parámetros de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const grade = urlParams.get('grade') || '1';
        const level = urlParams.get('level') || '1';
        
        if (currentLevel) currentLevel.textContent = `Nivel ${level}`;
        if (currentGrade) currentGrade.textContent = `Grado ${grade}`;
        
        console.log('📋 Game header shown for grade', grade, 'level', level);
    }
}

/**
 * Ir a la página de inicio
 */
function goHome() {
    if (window.AppState.isTransitioning) return;
    
    console.log('🏠 Navigating to home');
    window.AppState.isTransitioning = true;
    showLoadingOverlay();
    
    setTimeout(() => {
        window.location.href = '/';
    }, 300);
}

/**
 * Alternar pausa del juego
 */
function togglePause() {
    const overlay = document.getElementById('pauseOverlay');
    if (!overlay) return;
    
    if (overlay.style.display === 'none' || !overlay.style.display) {
        showPause();
    } else {
        resumeGame();
    }
}

/**
 * Mostrar menú de pausa
 */
function showPause() {
    const overlay = document.getElementById('pauseOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevenir scroll
        console.log('⏸️ Game paused');
    }
}

/**
 * Reanudar juego
 */
function resumeGame() {
    const overlay = document.getElementById('pauseOverlay');
    if (overlay) {
        overlay.style.display = 'none';
        document.body.style.overflow = ''; // Restaurar scroll
        console.log('▶️ Game resumed');
    }
}

/**
 * Reiniciar nivel actual
 */
function restartLevel() {
    if (confirm('¿Estás seguro de que quieres reiniciar este nivel?')) {
        console.log('🔄 Restarting current level');
        location.reload();
    }
}

/**
 * Capitalizar primera letra
 */
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Utilidades de animación
 */
const AnimationUtils = {
    /**
     * Ejecutar callback cuando termine una animación
     */
    onAnimationEnd(element, callback) {
        const handler = () => {
            element.removeEventListener('animationend', handler);
            callback();
        };
        element.addEventListener('animationend', handler);
    },
    
    /**
     * Aplicar animación de fade
     */
    fadeOut(element, duration = 300) {
        return new Promise(resolve => {
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = '0';
            setTimeout(resolve, duration);
        });
    },
    
    fadeIn(element, duration = 300) {
        return new Promise(resolve => {
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = '1';
            setTimeout(resolve, duration);
        });
    }
};

/**
 * Gestión de notificaciones
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos inline para la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontSize: '16px',
        fontWeight: '600',
        zIndex: '9999',
        opacity: '0',
        transform: 'translateX(300px)',
        transition: 'all 0.3s ease'
    });
    
    // Colores según el tipo
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Animación de salida
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(300px)';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

/**
 * Detección de dispositivo táctil
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Soporte para eventos táctiles
 */
function addTouchSupport(element, callback) {
    if (isTouchDevice()) {
        element.addEventListener('touchstart', callback);
    } else {
        element.addEventListener('click', callback);
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Ocultar loading si existe
    hideLoadingOverlay();
    
    // Configurar soporte táctil global
    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
        console.log('📱 Touch device detected');
    }
    
    // Manejar errores globales
    window.addEventListener('error', function(e) {
        console.error('🚨 Global error:', e.error);
        showNotification('Ha ocurrido un error. Por favor, recarga la página.', 'error');
    });
    
    // CHANGE HERE: Configuración de debug para desarrollo
    if (window.MATEMATICAS_ANDINAS && window.MATEMATICAS_ANDINAS.debug) {
        console.log('🔧 Debug mode enabled');
        
        // Atajos de teclado para desarrollo
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'h':
                        e.preventDefault();
                        goHome();
                        break;
                    case 'p':
                        e.preventDefault();
                        togglePause();
                        break;
                }
            }
        });
    }
    
    console.log('🎮 Main JavaScript initialized');
});

// Manejar cambios de orientación en móviles
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        window.scrollTo(0, 1); // Ocultar barra de direcciones en móviles
    }, 500);
});

// Prevenir zoom accidental en dispositivos táctiles
document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
});

// Funciones exportadas para usar en otros módulos
window.MathAndinas = {
    AppState: window.AppState,
    goHome,
    togglePause,
    showPause,
    resumeGame,
    restartLevel,
    showNotification,
    AnimationUtils,
    isTouchDevice,
    addTouchSupport
};