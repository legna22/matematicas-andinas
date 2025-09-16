# Matemáticas Andinas 🏔️

Un juego educativo web que enseña matemáticas utilizando elementos de la cultura andina ancestral: Khipu (sistema de nudos), Yupana (ábaco andino) y Chacana (cruz andina).

## 🎮 Características

- **Tres juegos educativos**: Khipu, Yupana y Chacana
- **Niveles adaptativos**: Primaria (grados 1-6) y Secundaria (grados 7-11)
- **Interfaz responsiva**: Optimizada para tablets y móviles
- **Diseño cultural auténtico**: Inspirado en paisajes y elementos andinos
- **Sistema de progreso**: Seguimiento del avance por estudiante
- **Accesibilidad**: Soporte para lectores de pantalla y navegación por teclado

## 🚀 Inicio Rápido

### Con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone <repository-url>
cd matematicas-andinas

# Construir y ejecutar con Docker Compose
docker compose up --build

# La aplicación estará disponible en http://localhost:8000
```

### Instalación Local

```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar la aplicación
python app.py

# Abrir http://localhost:8000 en el navegador
```

## 📁 Estructura del Proyecto

```
matematicas-andinas/
├── app.py                 # Aplicación Flask principal
├── requirements.txt       # Dependencias Python
├── Dockerfile            # Configuración Docker
├── docker-compose.yml    # Orquestación de servicios
├── data/
│   └── levels.json       # Configuración de niveles
├── templates/            # Plantillas HTML
│   ├── base.html
│   ├── index.html        # Página principal
│   ├── khipu.html        # Juego Khipu
│   ├── yupana.html       # Juego Yupana
│   ├── chacana.html      # Juego Chacana
│   ├── perfil.html       # Perfil del usuario
│   └── admin_levels.html # Editor de niveles
├── static/
│   ├── css/              # Estilos CSS
│   ├── js/               # JavaScript
│   └── images/           # Recursos gráficos
└── docs/                 # Documentación
```

## 🎯 Juegos Incluidos

### 🪢 Khipu - Sistema de Nudos
- Enseña conteo y operaciones básicas
- Visualización interactiva de nudos
- Basado en el sistema de registro inca

### 🧮 Yupana - Ábaco Andino  
- Representación numérica con fichas
- Sistema posicional decimal
- Drag & drop intuitivo

### ✚ Chacana - Cruz Andina
- Patrones geométricos y simetría
- Conceptos de equilibrio y proporción
- Resolución de rompecabezas visuales

## ⚙️ Configuración

### Variables de Entorno

```bash
# CHANGE HERE: Configurar según el entorno
FLASK_ENV=development
FLASK_DEBUG=1
```

### Personalización de Niveles

Editar `data/levels.json` para modificar:
- Rangos numéricos por grado
- Tiempo límite por nivel
- Descripción de desafíos
- Conceptos matemáticos

### Imágenes y Assets

<!-- CHANGE HERE: Rutas de imágenes -->
Colocar en `static/images/`:
- `backgrounds/inicio.png` (1920x1080px) - Fondo principal
- `logos/logouno.png` (512x512px) - Logo principal
- `game/` - Assets específicos de cada juego

## 🔧 Desarrollo

### Comandos Útiles

```bash
# Desarrollo con recarga automática
docker compose up --build

# Limpiar contenedores y volúmenes
docker compose down -v
docker system prune

# Ejecutar en background
docker compose up -d

# Ver logs
docker compose logs -f
```

### Estructura de Código

- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Backend**: Flask (Python 3.10+)
- **Base de datos**: JSON files (expandible a PostgreSQL)
- **Contenedores**: Docker + Docker Compose

### Agregar Nuevos Niveles

1. Editar `data/levels.json`
2. Seguir el esquema existente:
```json
{
  "grade": 1,
  "level": 1,
  "target_min": 1,
  "target_max": 10,
  "time": 60,
  "desc": "Descripción del nivel",
  "difficulty": "facil"
}
```

## 📚 Documentación Adicional

- [Arquitectura del Sistema](docs/ARCHITECTURE.md)
- [Guía de Niveles](docs/LEVELS.md)
- [Comandos de Ejecución](docs/RUNNING.md)
- [Guía de Contribución](CONTRIBUTING.md)

## 🎨 Diseño y UX

### Paleta de Colores
- **Verde Montaña**: `#4A6741`
- **Marrón Tierra**: `#8B4513`  
- **Dorado Sol**: `#D2691E`
- **Pergamino**: `#FFF8DC`

### Responsive Design
- **Móvil**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔒 Seguridad y Accesibilidad

- Navegación por teclado completa
- Soporte para lectores de pantalla
- Contraste de colores WCAG AA
- Elementos táctiles mínimo 44px
- Textos alternativos en imágenes

## 🚀 Despliegue

### Producción con Docker

```bash
# Construir imagen de producción
docker build -t matematicas-andinas:latest .

# Ejecutar en producción
docker run -p 8000:8000 matematicas-andinas:latest
```

### Variables de Producción

```bash
# CHANGE HERE: Configurar para producción
FLASK_ENV=production
FLASK_DEBUG=0
```

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m "feat: agregar nueva funcionalidad"`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Convenciones de Commits

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Documentación
- `style:` Cambios de formato
- `refactor:` Refactorización
- `test:` Pruebas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

Desarrollado con ❤️ para la educación matemática intercultural.

## 📞 Soporte

Para reportar problemas o solicitar funcionalidades:
- Crear un [Issue](../../issues)
- Consultar la [documentación](docs/)

---

**¡Aprende matemáticas con la sabiduría ancestral andina!** 🏔️✨"# matematicas-andinas" 
"# matematicas-andinas" 
