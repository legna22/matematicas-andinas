# Guía de Contribución - Matemáticas Andinas 🤝

¡Gracias por tu interés en contribuir a Matemáticas Andinas! Esta guía te ayudará a participar efectivamente en el desarrollo del proyecto.

## 🎯 Cómo Contribuir

### Tipos de Contribuciones Bienvenidas

- 🐛 **Reportes de bugs** y correcciones
- ✨ **Nuevas funcionalidades** y mejoras
- 📚 **Documentación** y tutoriales
- 🎨 **Mejoras de diseño** y UX
- 🌍 **Traducciones** y localización
- 🧪 **Pruebas** y casos de test
- 📊 **Nuevos niveles** y contenido educativo

## 🚀 Proceso de Desarrollo

### 1. Configuración del Entorno

```bash
# Fork y clonar el repositorio
git clone https://github.com/tu-usuario/matematicas-andinas.git
cd matematicas-andinas

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instalar dependencias de desarrollo
pip install -r requirements.txt
pip install pylint black pytest

# Configurar Docker (opcional pero recomendado)
docker compose up --build
```

### 2. Flujo de Trabajo con Git

#### Branching Strategy

```bash
# Crear rama desde main
git checkout main
git pull origin main
git checkout -b feature/nombre-descriptivo

# Ejemplos de nombres de rama:
# feature/nuevo-juego-suma
# fix/error-navegacion-movil
# docs/guia-instalacion
# style/mejora-responsive
```

#### Commits Convencionales

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para mantener un historial claro:

```bash
# Formato: tipo(alcance): descripción
git commit -m "feat(khipu): agregar animación de nudos"
git commit -m "fix(yupana): corregir cálculo de valores"
git commit -m "docs(readme): actualizar instrucciones de instalación"
```

**Tipos de commit:**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan funcionalidad)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

### 3. Estándares de Código

#### Python (Backend)

```bash
# Formatear código con Black
black app.py

# Verificar estilo con Pylint
pylint app.py

# Configuración en .pylintrc (crear si no existe)
```

#### JavaScript (Frontend)

```javascript
// Usar ES6+ y funciones arrow
const initGame = () => {
    console.log('🎮 Game initialized');
};

// Documentar funciones complejas
/**
 * Calcular valor total de la yupana
 * @param {Array} pieces - Array de piezas colocadas
 * @returns {number} Valor total calculado
 */
function calculateTotal(pieces) {
    // Implementación...
}
```

#### CSS

```css
/* Usar variables CSS para consistencia */
:root {
    --color-primary: #8B4513;
    --spacing-md: 16px;
}

/* Nomenclatura BEM para clases */
.game-container__header--active {
    /* Estilos */
}

/* Comentarios descriptivos */
/* CHANGE HERE: Personalizar colores del tema */
```

### 4. Testing

#### Pruebas Backend

```python
# tests/test_app.py
import pytest
from app import app

def test_home_page():
    client = app.test_client()
    response = client.get('/')
    assert response.status_code == 200
    assert b'Matemáticas Andinas' in response.data
```

#### Pruebas Frontend

```javascript
// tests/test-game.js
describe('Game Navigation', () => {
    test('should navigate to khipu game', () => {
        // Implementar test
    });
});
```

### 5. Documentación

#### Comentarios en Código

```python
# CHANGE HERE: Configuración del puerto
app.run(host="0.0.0.0", port=8000)

# TODO: Implementar autenticación de usuarios
# FIXME: Corregir cálculo de puntuación en nivel 3
```

#### Documentación de APIs

```python
def generate_level_data(grade: int, level: int) -> dict:
    """
    Generar datos para un nivel específico.
    
    Args:
        grade (int): Grado escolar (1-11)
        level (int): Nivel dentro del grado (1-N)
    
    Returns:
        dict: Configuración del nivel con target_min, target_max, etc.
    
    Raises:
        ValueError: Si grade o level están fuera de rango
    """
    pass
```

## 📋 Checklist de Pull Request

Antes de enviar tu PR, verifica:

### ✅ Código
- [ ] El código sigue las convenciones del proyecto
- [ ] Se agregaron comentarios `CHANGE HERE` donde corresponde
- [ ] No hay código comentado o debug prints
- [ ] Las funciones están documentadas
- [ ] Se actualizaron las dependencias si es necesario

### ✅ Funcionalidad
- [ ] La funcionalidad funciona en Chrome, Firefox y Safari
- [ ] Es responsive (móvil, tablet, desktop)
- [ ] Funciona con teclado y es accesible
- [ ] No rompe funcionalidades existentes

### ✅ Testing
- [ ] Se agregaron tests para nueva funcionalidad
- [ ] Todos los tests pasan
- [ ] Se probó manualmente en diferentes dispositivos

### ✅ Documentación
- [ ] Se actualizó README.md si es necesario
- [ ] Se documentaron nuevas configuraciones
- [ ] Se agregaron comentarios explicativos

## 🎨 Guías de Diseño

### Principios de Diseño

1. **Culturalmente Auténtico**: Respetar elementos andinos
2. **Educativamente Efectivo**: Facilitar el aprendizaje
3. **Accesible**: Usable por todos los estudiantes
4. **Responsive**: Funcionar en todos los dispositivos

### Paleta de Colores

```css
/* Colores principales */
--color-mountain-green: #4A6741;
--color-earth-brown: #8B4513;
--color-golden-sun: #D2691E;
--color-sky-blue: #87CEEB;

/* Estados */
--color-success: #228B22;
--color-warning: #FF8C00;
--color-error: #DC143C;
```

### Espaciado Consistente

```css
/* Sistema de espaciado 8px */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno

```bash
# .env.development
FLASK_ENV=development
FLASK_DEBUG=1
LOG_LEVEL=DEBUG
```

### Docker para Desarrollo

```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  app:
    build: .
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    environment:
      - FLASK_ENV=development
```

## 📊 Agregar Contenido Educativo

### Nuevos Niveles

```json
// data/levels.json
{
  "khipu": [
    {
      "grade": 1,
      "level": 1,
      "target_min": 1,
      "target_max": 5,
      "time": 0,
      "desc": "Contar del 1 al 5 con nudos simples",
      "difficulty": "facil",
      "concepts": ["conteo", "números básicos"]
    }
  ]
}
```

### Nuevos Juegos

1. Crear template en `templates/nuevo-juego.html`
2. Agregar estilos en `static/css/nuevo-juego.css`
3. Implementar lógica en `static/js/nuevo-juego.js`
4. Agregar ruta en `app.py`
5. Actualizar navegación en `templates/index.html`

## 🐛 Reportar Bugs

### Template de Issue

```markdown
**Descripción del Bug**
Descripción clara del problema.

**Pasos para Reproducir**
1. Ir a '...'
2. Hacer clic en '...'
3. Ver error

**Comportamiento Esperado**
Lo que debería pasar.

**Screenshots**
Si aplica, agregar capturas de pantalla.

**Entorno:**
- OS: [ej. iOS]
- Navegador: [ej. chrome, safari]
- Versión: [ej. 22]
- Dispositivo: [ej. iPhone6]
```

## 🌟 Reconocimientos

### Contribuidores

Los contribuidores son reconocidos en:
- README.md principal
- Página de créditos en la aplicación
- Releases notes

### Niveles de Contribución

- 🥉 **Colaborador**: 1-5 commits
- 🥈 **Contribuidor Activo**: 6-20 commits
- 🥇 **Mantenedor**: 21+ commits + revisiones de PR

## 📞 Comunicación

### Canales de Comunicación

- **Issues**: Para bugs y feature requests
- **Discussions**: Para preguntas y ideas
- **Pull Requests**: Para revisión de código

### Código de Conducta

- Ser respetuoso y constructivo
- Valorar la diversidad de perspectivas
- Enfocarse en el aprendizaje colaborativo
- Mantener un ambiente educativo positivo

## 🎓 Recursos de Aprendizaje

### Tecnologías del Proyecto

- [Flask Documentation](https://flask.palletsprojects.com/)
- [JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Docker Tutorial](https://docs.docker.com/get-started/)

### Cultura Andina

- Historia de los Khipus
- Funcionamiento de la Yupana
- Simbolismo de la Chacana
- Matemáticas en culturas ancestrales

---

## 🚀 ¡Empezar a Contribuir!

1. **Fork** el repositorio
2. **Clonar** tu fork localmente
3. **Crear** una rama para tu contribución
4. **Desarrollar** siguiendo estas guías
5. **Probar** tu código
6. **Enviar** Pull Request

¡Gracias por ayudar a hacer que las matemáticas sean más accesibles y culturalmente relevantes! 🏔️✨

---

**¿Preguntas?** Abre un [Discussion](../../discussions) o contacta a los mantenedores.