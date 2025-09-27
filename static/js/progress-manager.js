/**
 * Matemáticas Andinas - Progress Manager
 * Sistema centralizado de gestión de progreso del jugador
 */

class ProgressManager {
    constructor() {
        this.storageKey = 'matematicas_andinas_progress';
        this.userKey = 'matematicas_andinas_user';
        this.progress = this.loadProgress();
        this.user = this.loadUser();
    }

    /**
     * Cargar progreso desde localStorage
     */
    loadProgress() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : this.getDefaultProgress();
        } catch (error) {
            console.error('Error loading progress:', error);
            return this.getDefaultProgress();
        }
    }

    /**
     * Cargar datos del usuario
     */
    loadUser() {
        try {
            const saved = localStorage.getItem(this.userKey);
            return saved ? JSON.parse(saved) : this.getDefaultUser();
        } catch (error) {
            console.error('Error loading user:', error);
            return this.getDefaultUser();
        }
    }

    /**
     * Estructura por defecto del progreso
     */
    getDefaultProgress() {
        return {
            khipu: {},
            yupana: {},
            chacana: {},
            lastPlayed: null,
            totalPlayTime: 0,
            achievements: []
        };
    }

    /**
     * Datos por defecto del usuario
     */
    getDefaultUser() {
        return {
            name: 'Estudiante',
            currentGrade: 1,
            preferredDifficulty: 'normal',
            soundEnabled: true,
            createdAt: new Date().toISOString()
        };
    }

    /**
     * Guardar progreso
     */
    saveProgress() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
            localStorage.setItem(this.userKey, JSON.stringify(this.user));
            console.log('✅ Progress saved successfully');
        } catch (error) {
            console.error('❌ Error saving progress:', error);
        }
    }

    /**
     * Marcar nivel como completado
     */
    completeLevel(gameType, grade, level, score, timeUsed) {
        const gameKey = `grade_${grade}`;
        const levelKey = `level_${level}`;

        if (!this.progress[gameType][gameKey]) {
            this.progress[gameType][gameKey] = {};
        }

        const levelData = {
            completed: true,
            score: score,
            timeUsed: timeUsed,
            completedAt: new Date().toISOString(),
            attempts: (this.progress[gameType][gameKey][levelKey]?.attempts || 0) + 1
        };

        this.progress[gameType][gameKey][levelKey] = levelData;
        this.progress.lastPlayed = new Date().toISOString();
        this.progress.totalPlayTime += timeUsed;

        // Verificar logros
        this.checkAchievements(gameType, grade, level);

        this.saveProgress();
        console.log(`🎉 Level completed: ${gameType} G${grade}L${level}`);
    }

    /**
     * Verificar si un nivel está completado
     */
    isLevelCompleted(gameType, grade, level) {
        const gameKey = `grade_${grade}`;
        const levelKey = `level_${level}`;
        return this.progress[gameType][gameKey]?.[levelKey]?.completed || false;
    }

    /**
     * Obtener el siguiente nivel disponible
     */
    getNextLevel(gameType, currentGrade, currentLevel, allLevels) {
        // Buscar siguiente nivel en el mismo grado
        const nextLevelSameGrade = allLevels.find(level => 
            level.grade === currentGrade && level.level === currentLevel + 1
        );

        if (nextLevelSameGrade) {
            return nextLevelSameGrade;
        }

        // Buscar primer nivel del siguiente grado
        const nextGradeLevel = allLevels.find(level => 
            level.grade === currentGrade + 1 && level.level === 1
        );

        return nextGradeLevel || null;
    }

    /**
     * Calcular progreso de un juego
     */
    getGameProgress(gameType, allLevels) {
        const completedLevels = [];
        
        for (const gradeKey in this.progress[gameType]) {
            for (const levelKey in this.progress[gameType][gradeKey]) {
                if (this.progress[gameType][gradeKey][levelKey].completed) {
                    completedLevels.push({
                        grade: parseInt(gradeKey.replace('grade_', '')),
                        level: parseInt(levelKey.replace('level_', ''))
                    });
                }
            }
        }

        const totalLevels = allLevels.length;
        const completedCount = completedLevels.length;
        const percentage = totalLevels > 0 ? (completedCount / totalLevels) * 100 : 0;

        return {
            completed: completedCount,
            total: totalLevels,
            percentage: Math.round(percentage),
            levels: completedLevels
        };
    }

    /**
     * Verificar y otorgar logros
     */
    checkAchievements(gameType, grade, level) {
        const achievements = [];

        // Primer nivel completado
        if (grade === 1 && level === 1 && !this.hasAchievement(`first_${gameType}`)) {
            achievements.push({
                id: `first_${gameType}`,
                name: `Primer ${gameType.charAt(0).toUpperCase() + gameType.slice(1)}`,
                description: `Completaste tu primer nivel de ${gameType}`,
                icon: '🏆',
                unlockedAt: new Date().toISOString()
            });
        }

        // Completar un grado completo
        const gradeProgress = this.getGradeProgress(gameType, grade);
        if (gradeProgress.percentage === 100 && !this.hasAchievement(`grade_${grade}_${gameType}`)) {
            achievements.push({
                id: `grade_${grade}_${gameType}`,
                name: `Maestro de Grado ${grade}`,
                description: `Completaste todos los niveles de grado ${grade} en ${gameType}`,
                icon: '🎓',
                unlockedAt: new Date().toISOString()
            });
        }

        // Agregar nuevos logros
        achievements.forEach(achievement => {
            this.progress.achievements.push(achievement);
            this.showAchievementNotification(achievement);
        });
    }

    /**
     * Verificar si tiene un logro
     */
    hasAchievement(achievementId) {
        return this.progress.achievements.some(a => a.id === achievementId);
    }

    /**
     * Mostrar notificación de logro
     */
    showAchievementNotification(achievement) {
        // Crear notificación visual
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-text">
                    <h4>¡Logro Desbloqueado!</h4>
                    <p><strong>${achievement.name}</strong></p>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `;

        // Estilos inline
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#8B4513',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            zIndex: '10000',
            maxWidth: '300px',
            transform: 'translateX(350px)',
            transition: 'transform 0.5s ease'
        });

        document.body.appendChild(notification);

        // Animación de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animación de salida
        setTimeout(() => {
            notification.style.transform = 'translateX(350px)';
            setTimeout(() => notification.remove(), 500);
        }, 4000);

        console.log('🏆 Achievement unlocked:', achievement.name);
    }

    /**
     * Obtener progreso de un grado específico
     */
    getGradeProgress(gameType, grade) {
        // Esta función necesitaría acceso a los niveles para calcular correctamente
        // Por ahora retorna un placeholder
        return { completed: 0, total: 8, percentage: 0 };
    }

    /**
     * Reiniciar progreso
     */
    resetProgress() {
        this.progress = this.getDefaultProgress();
        this.saveProgress();
        console.log('🔄 Progress reset');
    }

    /**
     * Exportar progreso para backup
     */
    exportProgress() {
        return {
            progress: this.progress,
            user: this.user,
            exportedAt: new Date().toISOString()
        };
    }

    /**
     * Importar progreso desde backup
     */
    importProgress(data) {
        try {
            if (data.progress) this.progress = data.progress;
            if (data.user) this.user = data.user;
            this.saveProgress();
            console.log('📥 Progress imported successfully');
            return true;
        } catch (error) {
            console.error('❌ Error importing progress:', error);
            return false;
        }
    }
}

// Crear instancia global
window.ProgressManager = new ProgressManager();

// Estilos CSS para notificaciones de logros
const achievementStyles = document.createElement('style');
achievementStyles.textContent = `
.achievement-notification {
    font-family: var(--font-family-primary, 'Segoe UI', sans-serif);
}

.achievement-content {
    display: flex;
    align-items: center;
    gap: 15px;
}

.achievement-icon {
    font-size: 2rem;
    flex-shrink: 0;
}

.achievement-text h4 {
    margin: 0 0 5px 0;
    font-size: 1.1rem;
    font-weight: bold;
}

.achievement-text p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.3;
}

.achievement-text p:last-child {
    opacity: 0.8;
    font-size: 0.8rem;
}
`;
document.head.appendChild(achievementStyles);