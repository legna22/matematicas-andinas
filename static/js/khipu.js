 
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
        this.init();
      }

      init() {
        this.updateDisplay();
        this.generateTarget();
      }

      addKnot(cordIndex) {
        if (cordIndex < 0 || cordIndex >= this.columns.length) return;
        
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
      }

      removeKnot() {
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
        const range = this.difficultyRanges[this.difficulty];
        this.targetNumber = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        document.getElementById('targetNumber').textContent = this.targetNumber;
        this.attempts++;
        this.updateDisplay();
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
          setTimeout(() => this.generateTarget(), 2000);
        } else if (currentValue > this.targetNumber) {
          this.streak = 0;
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
        achievementDiv.textContent = message;
        achievementDiv.style.display = 'block';
        setTimeout(() => {
          achievementDiv.style.display = 'none';
        }, 4000);
      }

      reset() {
        this.columns.forEach(col => col.knots = 0);
        this.updateDisplay();
      }

      updateDisplay() {
        document.getElementById('currentNumber').textContent = this.calculateValue();
        
        this.columns.forEach((col, index) => {
          document.getElementById(`count${index}`).textContent = col.knots;
          const cordElement = document.getElementById(`cord${index}`);
          cordElement.innerHTML = '';
          
          for (let i = 0; i < col.knots; i++) {
            const knot = document.createElement('div');
            knot.className = 'knot';
            knot.style.top = (35 + i * 30) + 'px';
            
            // 🎨 Asignar color consistente basado en posición
            const colorIndex = (index * 3 + i) % this.palette.length;
            knot.style.background = this.palette[colorIndex];
            
            // Añadir ligera variación en posición para más naturalidad
            const wobble = (Math.sin(i * 0.5) * 3);
            knot.style.left = (wobble - 12) + 'px';
            
            cordElement.appendChild(knot);
          }
        });
        
        document.getElementById('score').textContent = this.score;
        document.getElementById('streak').textContent = this.streak;
        document.getElementById('attempts').textContent = this.attempts;
      }

      setDifficulty(level, btn) {
  this.difficulty = level;
  document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  this.generateTarget();
}

    }

    let game;

    function addKnot(index) { game.addKnot(index); }
    function removeKnot() { game.removeKnot(); }
    function generateTarget() { game.generateTarget(); }
    function reset() { game.reset(); }
    function showHint() { game.showHint(); }
    function setDifficulty(level) { game.setDifficulty(level); }

    window.onload = function() { game = new KhipuGameImproved(); };
    
 function showHelp() {
    const modal = document.getElementById("helpModal");
    if (modal) {
        modal.style.display = "block";
    }
}

function closeHelp() {
    const modal = document.getElementById("helpModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// También puedes cerrar al hacer clic fuera del modal
window.onclick = function(event) {
    const modal = document.getElementById("helpModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
