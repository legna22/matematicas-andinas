# Guía de Niveles - Matemáticas Andinas 📚

Esta guía explica el sistema de niveles, cómo están organizados los contenidos educativos y cómo personalizar o agregar nuevos niveles al juego.

## 📋 Tabla de Contenidos

- [Estructura del Sistema de Niveles](#estructura-del-sistema-de-niveles)
- [Contenido por Grado](#contenido-por-grado)
- [Configuración de Niveles](#configuración-de-niveles)
- [Ejemplos de Niveles](#ejemplos-de-niveles)
- [Cómo Agregar Nuevos Niveles](#cómo-agregar-nuevos-niveles)
- [Progresión de Dificultad](#progresión-de-dificultad)

## 🎯 Estructura del Sistema de Niveles

### Organización General

```
Matemáticas Andinas
├── Primaria (Grados 1-6)
│   ├── Grado 1: Números 1-20, conteo básico
│   ├── Grado 2: Números 1-100, sumas/restas simples
│   ├── Grado 3: Números 1-1000, operaciones básicas
│   ├── Grado 4: Fracciones, decimales básicos
│   ├── Grado 5: Operaciones avanzadas, geometría
│   └── Grado 6: Proporciones, porcentajes
└── Secundaria (Grados 7-11)
    ├── Grado 7: Números enteros, ecuaciones
    ├── Grado 8: Álgebra básica, geometría
    ├── Grado 9: Funciones, estadística
    ├── Grado 10: Trigonometría, probabilidad
    └── Grado 11: Cálculo básico, matemática avanzada
```

### Mapeo de Grados

```javascript
// CHANGE HERE: Ajustar según sistema educativo local
const GRADE_MAPPING = {
    // Primaria
    1: "1° Primaria",
    2: "2° Primaria", 
    3: "3° Primaria",
    4: "4° Primaria",
    5: "5° Primaria",
    6: "6° Primaria",
    // Secundaria
    7: "7° Básico / 1° ESO",
    8: "8° Básico / 2° ESO", 
    9: "9° Básico / 3° ESO",
    10: "1° Bachillerato / 4° ESO",
    11: "2° Bachillerato / 1° Bach"
};
```

## 📊 Contenido por Grado

### Primaria (Grados 1-6)

#### Grado 1 (6-7 años)
**Conceptos Clave**: Conteo, números 1-20, reconocimiento de patrones

| Juego | Niveles | Conceptos | Rango Numérico |
|-------|---------|-----------|----------------|
| Khipu | 4 | Conteo básico, nudos simples | 1-10 |
| Yupana | 3 | Representación numérica | 1-10 |
| Chacana | 3 | Patrones simples, simetría | 2-4 elementos |

#### Grado 2 (7-8 años)
**Conceptos Clave**: Números hasta 100, suma y resta básica

| Juego | Niveles | Conceptos | Rango Numérico |
|-------|---------|-----------|----------------|
| Khipu | 5 | Conteo avanzado, operaciones | 10-50 |
| Yupana | 4 | Decenas, operaciones simples | 10-50 |
| Chacana | 4 | Patrones crecientes | 4-8 elementos |

#### Grado 3 (8-9 años)
**Conceptos Clave**: Números hasta 1000, multiplicación básica

| Juego | Niveles | Conceptos | Rango Numérico |
|-------|---------|-----------|----------------|
| Khipu | 6 | Sistema decimal, centenas | 50-200 |
| Yupana | 5 | Tres dígitos, multiplicación | 50-200 |
| Chacana | 5 | Fracciones visuales | 8-16 elementos |

#### Grados 4-6
**Progresión**: Fracciones → Decimales → Porcentajes → Geometría

### Secundaria (Grados 7-11)

#### Grado 7 (12-13 años)
**Conceptos Clave**: Números enteros, ecuaciones simples

| Juego | Niveles | Conceptos | Rango Numérico |
|-------|---------|-----------|----------------|
| Khipu | 8 | Números negativos, algebra | -100 a 500 |
| Yupana | 7 | Operaciones complejas | 100-1000 |
| Chacana | 6 | Geometría avanzada | Patrones complejos |

#### Grados 8-11
**Progresión**: Álgebra → Funciones → Trigonometría → Cálculo

## ⚙️ Configuración de Niveles

### Estructura del Archivo `data/levels.json`

```json
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
      "concepts": ["conteo", "números básicos"],
      "instructions": "Cuenta los nudos que ves en el khipu",
      "hints": ["Los nudos simples valen 1", "Cuenta de arriba hacia abajo"]
    }
  ],
  "yupana": [...],
  "chacana": [...]
}
```

### Campos de Configuración

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `grade` | number | Grado escolar (1-11) | `3` |
| `level` | number | Nivel dentro del grado | `2` |
| `target_min` | number | Valor mínimo del rango | `10` |
| `target_max` | number | Valor máximo del rango | `50` |
| `time` | number | Tiempo límite en segundos (0 = sin límite) | `120` |
| `desc` | string | Descripción del nivel | `"Sumas con yupana"` |
| `difficulty` | string | Dificultad: "facil", "medio", "dificil" | `"medio"` |
| `concepts` | array | Conceptos matemáticos cubiertos | `["suma", "decenas"]` |
| `instructions` | string | Instrucciones específicas | `"Arrastra las fichas..."` |
| `hints` | array | Pistas para el estudiante | `["Usa fichas grandes para 5"]` |

### Configuración Específica por Juego

#### Khipu - Campos Adicionales

```json
{
  "knot_types": ["simple", "compound"],
  "max_cords": 4,
  "animation_speed": "normal",
  "show_counting": true
}
```

#### Yupana - Campos Adicionales

```json
{
  "piece_types": ["small", "medium", "large"],
  "max_pieces_per_cell": 3,
  "show_grid_values": true,
  "allow_multiple_solutions": false
}
```

#### Chacana - Campos Adicionales

```json
{
  "pattern_types": ["circle", "triangle", "square", "diamond"],
  "symmetry_type": "full",
  "required_cells": 4,
  "show_symmetry_lines": true
}
```

## 📝 Ejemplos de Niveles

### Ejemplo 1: Khipu Básico (Grado 1)

```json
{
  "grade": 1,
  "level": 1,
  "target_min": 1,
  "target_max": 5,
  "time": 0,
  "desc": "Primeros pasos con el khipu",
  "difficulty": "facil",
  "concepts": ["conteo", "números 1-5"],
  "instructions": "Cuenta cuántos nudos ves en total",
  "hints": [
    "Cada nudo representa el número 1",
    "Cuenta todos los nudos que veas"
  ],
  "knot_types": ["simple"],
  "max_cords": 2,
  "show_counting": true
}
```

### Ejemplo 2: Yupana Intermedio (Grado 3)

```json
{
  "grade": 3,
  "level": 3,
  "target_min": 25,
  "target_max": 75,
  "time": 180,
  "desc": "Representar números de dos dígitos",
  "difficulty": "medio",
  "concepts": ["decenas", "unidades", "valor posicional"],
  "instructions": "Usa las fichas para formar el número mostrado",
  "hints": [
    "Las fichas pequeñas valen 1",
    "Las fichas medianas valen 3", 
    "Las fichas grandes valen 5",
    "Recuerda el valor de cada columna"
  ],
  "piece_types": ["small", "medium", "large"],
  "show_grid_values": true
}
```

### Ejemplo 3: Chacana Avanzado (Grado 7)

```json
{
  "grade": 7,
  "level": 2,
  "target_min": 8,
  "target_max": 16,
  "time": 300,
  "desc": "Patrones geométricos complejos",
  "difficulty": "dificil",
  "concepts": ["simetría", "geometría", "patrones"],
  "instructions": "Completa la chacana manteniendo la armonía",
  "hints": [
    "Observa la simetría en todos los ejes",
    "Cada brazo debe estar equilibrado",
    "Los patrones se reflejan en direcciones opuestas"
  ],
  "pattern_types": ["circle", "triangle", "square", "diamond"],
  "symmetry_type": "full",
  "required_cells": 6,
  "show_symmetry_lines": false
}
```

## ➕ Cómo Agregar Nuevos Niveles

### Método 1: Editor Web (Recomendado)

1. Acceder a `/admin/levels` en la aplicación
2. Seleccionar el juego (Khipu, Yupana, Chacana)
3. Hacer clic en "Añadir Nivel"
4. Completar los campos del formulario
5. Guardar cambios

### Método 2: Edición Manual

#### Paso 1: Editar `data/levels.json`

```bash
# CHANGE HERE: Agregar nuevo nivel al final del array correspondiente
nano data/levels.json
```

#### Paso 2: Seguir la Estructura

```json
{
  "khipu": [
    // ... niveles existentes ...
    {
      "grade": 2,
      "level": 6,
      "target_min": 20,
      "target_max": 40,
      "time": 90,
      "desc": "Nuevo nivel de conteo avanzado",
      "difficulty": "medio",
      "concepts": ["conteo", "números hasta 40"]
    }
  ]
}
```

#### Paso 3: Validar JSON

```bash
# Verificar que el JSON sea válido
python -m json.tool data/levels.json
```

#### Paso 4: Reiniciar Aplicación

```bash
# Si usas Docker
docker compose restart

# Si ejecutas localmente
# Ctrl+C y python app.py
```

### Método 3: Script de Generación

```python
# scripts/generate_levels.py
import json

def generate_level_progression(game_type, grade, base_min, base_max, num_levels):
    """Generar progresión de niveles automáticamente"""
    levels = []
    
    for level in range(1, num_levels + 1):
        # Incrementar dificultad gradualmente
        min_val = base_min + (level - 1) * 5
        max_val = base_max + (level - 1) * 10
        time_limit = 60 + (level - 1) * 30
        
        level_data = {
            "grade": grade,
            "level": level,
            "target_min": min_val,
            "target_max": max_val,
            "time": time_limit if level > 2 else 0,
            "desc": f"Nivel {level} - Grado {grade}",
            "difficulty": "facil" if level <= 2 else "medio" if level <= 4 else "dificil",
            "concepts": ["conteo", "operaciones básicas"]
        }
        
        levels.append(level_data)
    
    return levels

# Uso del script
new_levels = generate_level_progression("khipu", 4, 50, 100, 6)
print(json.dumps(new_levels, indent=2))
```

## 📈 Progresión de Dificultad

### Principios de Progresión

1. **Incremental**: Cada nivel aumenta ligeramente la dificultad
2. **Conceptual**: Introduce un nuevo concepto por vez
3. **Práctica**: Permite dominar conceptos antes de avanzar
4. **Motivacional**: Mantiene el desafío sin frustrar

### Curva de Dificultad por Juego

#### Khipu
```
Dificultad
    ▲
    │     ╭─╮
    │   ╭─╯  ╰─╮
    │ ╭─╯      ╰─╮
    │╱           ╰─╮
    └─────────────────► Nivel
    1  2  3  4  5  6  7  8
```

#### Yupana
```
Dificultad
    ▲
    │       ╭─╮
    │     ╭─╯  ╰╮
    │   ╭─╯     ╰─╮
    │ ╭─╯         ╰─╮
    │╱             ╰─
    └─────────────────► Nivel
    1  2  3  4  5  6  7
```

#### Chacana
```
Dificultad
    ▲
    │         ╭─╮
    │       ╭─╯  ╰─╮
    │     ╭─╯      ╰─╮
    │   ╭─╯          ╰─╮
    │ ╭─╯              ╰─
    └─────────────────────► Nivel
    1  2  3  4  5  6  7  8
```

### Factores de Dificultad

#### Khipu
- **Rango numérico**: 1-5 → 1-10 → 10-50 → 50-200
- **Tipos de nudos**: Simples → Compuestos → Mixtos
- **Número de cuerdas**: 1-2 → 3-4 → 5+
- **Operaciones**: Conteo → Suma → Resta → Multiplicación

#### Yupana
- **Rango numérico**: 1-10 → 10-50 → 50-200 → 200+
- **Tipos de fichas**: Solo pequeñas → Medianas → Grandes → Todas
- **Columnas activas**: Unidades → Decenas → Centenas
- **Operaciones**: Representación → Suma → Resta → Multiplicación

#### Chacana
- **Número de patrones**: 1-2 → 3 → 4
- **Celdas requeridas**: 2 → 4 → 6 → 8
- **Tipo de simetría**: Simple → Doble → Completa
- **Complejidad visual**: Básica → Intermedia → Avanzada

## 🎯 Objetivos de Aprendizaje por Nivel

### Taxonomía de Bloom Aplicada

#### Nivel 1-2: Recordar y Comprender
- Reconocer números y patrones básicos
- Comprender conceptos fundamentales
- Identificar elementos visuales

#### Nivel 3-4: Aplicar y Analizar  
- Aplicar operaciones matemáticas
- Analizar patrones y relaciones
- Resolver problemas estructurados

#### Nivel 5-6: Evaluar y Crear
- Evaluar diferentes estrategias
- Crear soluciones originales
- Sintetizar conocimientos previos

### Competencias Transversales

- **Pensamiento lógico**: Secuencias y patrones
- **Resolución de problemas**: Estrategias múltiples
- **Cultura matemática**: Conexión con tradiciones andinas
- **Perseverancia**: Superar desafíos graduales

## 📊 Métricas y Evaluación

### Indicadores de Progreso

```javascript
// Métricas que se pueden trackear
const PROGRESS_METRICS = {
    completion_time: "Tiempo para completar nivel",
    attempts: "Número de intentos",
    hints_used: "Pistas utilizadas",
    accuracy: "Precisión en respuestas",
    progression_speed: "Velocidad de avance"
};
```

### Criterios de Éxito

- **Dominio**: 80% de precisión en 3 intentos consecutivos
- **Fluidez**: Completar en tiempo esperado
- **Transferencia**: Aplicar conceptos en contextos nuevos

## 🔄 Mantenimiento de Niveles

### Revisión Periódica

1. **Mensual**: Revisar métricas de dificultad
2. **Trimestral**: Actualizar contenidos según feedback
3. **Anual**: Reevaluar progresión completa

### Versionado de Contenido

```bash
# CHANGE HERE: Usar tags de Git para versionar niveles
git tag -a levels-v1.2 -m "Actualización niveles Grado 3"
git push origin levels-v1.2
```

### Backup y Restauración

```bash
# Backup automático
cp data/levels.json data/backups/levels-$(date +%Y%m%d).json

# Restaurar desde backup
cp data/backups/levels-20250115.json data/levels.json
```

---

## 🚀 Próximas Mejoras

### Funcionalidades Planeadas

- **Niveles adaptativos**: Ajuste automático según rendimiento
- **Contenido generativo**: Creación automática de variaciones
- **Análisis de aprendizaje**: Métricas avanzadas de progreso
- **Personalización**: Rutas de aprendizaje individualizadas

### Expansión de Contenido

- **Más grados**: Preescolar y educación superior
- **Más juegos**: Nuevos elementos de la cultura andina
- **Más idiomas**: Quechua, Aymara, otros idiomas originarios

---

**¿Necesitas ayuda con los niveles?** Consulta el [Editor Web](/admin/levels) o revisa los [ejemplos completos](../data/levels.json).