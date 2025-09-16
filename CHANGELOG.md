# Changelog - Matemáticas Andinas

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planeado
- Sistema de autenticación de usuarios
- Base de datos PostgreSQL
- Modo multijugador
- Más niveles para grados avanzados
- Sistema de logros expandido
- Soporte para múltiples idiomas

## [1.0.0] - 2025-01-XX

### Agregado
- 🎮 **Tres juegos educativos completos**:
  - Khipu: Sistema de nudos para conteo y operaciones
  - Yupana: Ábaco andino con drag & drop
  - Chacana: Patrones geométricos y simetría
- 📚 **Sistema de niveles adaptativos**:
  - Primaria: Grados 1-6
  - Secundaria: Grados 7-11
  - 8 niveles por juego con dificultad progresiva
- 🎨 **Interfaz culturalmente auténtica**:
  - Paleta de colores inspirada en paisajes andinos
  - Elementos visuales de pergamino y texturas naturales
  - Iconografía circular con efectos dorados
- 📱 **Diseño completamente responsivo**:
  - Optimizado para móviles (< 768px)
  - Soporte para tablets (768px - 1024px)
  - Experiencia desktop completa (> 1024px)
- ♿ **Características de accesibilidad**:
  - Navegación completa por teclado
  - Soporte para lectores de pantalla
  - Contraste de colores WCAG AA
  - Elementos táctiles mínimo 44px
- 🔧 **Sistema de configuración flexible**:
  - Editor de niveles integrado
  - Configuración JSON para contenido
  - Variables CSS para personalización
- 📊 **Seguimiento de progreso**:
  - Guardado local del progreso
  - Sistema de puntuación
  - Estadísticas por juego
- 🐳 **Despliegue con Docker**:
  - Dockerfile optimizado
  - Docker Compose para desarrollo
  - Configuración de producción

### Características Técnicas
- **Backend**: Flask (Python 3.10+)
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Base de datos**: JSON files (expandible)
- **Contenedores**: Docker + Docker Compose
- **Arquitectura**: Modular y extensible

### Juegos Implementados

#### 🪢 Khipu - Sistema de Nudos
- Visualización interactiva de khipus con canvas HTML5
- Generación procedural de nudos simples y compuestos
- Sistema de conteo basado en la tradición inca
- Animaciones de celebración y feedback visual
- Niveles desde conteo básico hasta operaciones complejas

#### 🧮 Yupana - Ábaco Andino
- Sistema de drag & drop intuitivo
- Tres tipos de fichas (1, 3, 5 unidades)
- Representación de números en sistema decimal
- Cálculo automático de valores
- Interfaz táctil optimizada

#### ✚ Chacana - Cruz Andina
- Patrones geométricos interactivos
- Sistema de simetría y equilibrio
- Cuatro tipos de patrones (círculo, triángulo, cuadrado, diamante)
- Verificación automática de armonía
- Líneas de simetría como ayuda visual

### Documentación
- README.md completo con instrucciones de instalación
- Guía de contribución detallada
- Documentación de arquitectura
- Guía de niveles y contenido educativo
- Comandos de desarrollo y despliegue

### Configuración y Personalización
- Sistema de comentarios `CHANGE HERE` para personalización
- Variables CSS organizadas para temas
- Configuración de niveles en JSON
- Rutas de imágenes documentadas
- Configuración de Docker flexible

## [0.9.0] - 2025-01-XX (Beta)

### Agregado
- Estructura base del proyecto
- Configuración inicial de Flask
- Templates HTML básicos
- Estilos CSS fundamentales
- JavaScript para navegación

### En Desarrollo
- Lógica de juegos
- Sistema de niveles
- Interfaz de usuario

## [0.1.0] - 2025-01-XX (Alpha)

### Agregado
- Configuración inicial del repositorio
- Estructura de directorios
- Dependencias básicas
- Dockerfile inicial

---

## Tipos de Cambios

- `Added` para nuevas funcionalidades
- `Changed` para cambios en funcionalidades existentes
- `Deprecated` para funcionalidades que serán removidas
- `Removed` para funcionalidades removidas
- `Fixed` para corrección de bugs
- `Security` para vulnerabilidades de seguridad

## Versionado

Este proyecto usa [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Cambios incompatibles en la API
- **MINOR** (0.X.0): Nueva funcionalidad compatible hacia atrás
- **PATCH** (0.0.X): Correcciones de bugs compatibles

## Contribuir

Para contribuir a este changelog:

1. Agregar cambios en la sección `[Unreleased]`
2. Usar el formato establecido
3. Incluir enlaces a issues/PRs cuando sea relevante
4. Mover cambios a versión específica al hacer release

## Enlaces

- [Repositorio](https://github.com/usuario/matematicas-andinas)
- [Issues](https://github.com/usuario/matematicas-andinas/issues)
- [Releases](https://github.com/usuario/matematicas-andinas/releases)

---

**Formato de Commit para Changelog:**
```bash
git commit -m "feat(khipu): agregar animación de nudos

- Implementar canvas para visualización
- Agregar efectos de celebración
- Mejorar feedback visual

Closes #123"
```