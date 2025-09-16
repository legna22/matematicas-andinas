# Guía de Ejecución - Matemáticas Andinas 🚀

Esta guía proporciona todos los comandos y procedimientos necesarios para ejecutar, desarrollar y desplegar la aplicación Matemáticas Andinas.

## 📋 Tabla de Contenidos

- [Requisitos del Sistema](#requisitos-del-sistema)
- [Instalación y Configuración](#instalación-y-configuración)
- [Comandos de Desarrollo](#comandos-de-desarrollo)
- [Comandos de Docker](#comandos-de-docker)
- [Comandos de Git](#comandos-de-git)
- [Despliegue](#despliegue)
- [Mantenimiento](#mantenimiento)
- [Solución de Problemas](#solución-de-problemas)

## 💻 Requisitos del Sistema

### Opción 1: Con Docker (Recomendado)
```bash
# Verificar instalación de Docker
docker --version          # >= 20.10.0
docker compose --version  # >= 2.0.0
```

### Opción 2: Instalación Local
```bash
# Python
python --version          # >= 3.10.0
pip --version            # >= 21.0.0

# Node.js (opcional, para herramientas de desarrollo)
node --version           # >= 16.0.0
npm --version           # >= 8.0.0
```

### Recursos Mínimos
- **RAM**: 2GB disponible
- **Disco**: 1GB espacio libre
- **CPU**: 2 cores recomendado
- **Red**: Conexión a internet para dependencias

## 🔧 Instalación y Configuración

### Método 1: Docker (Recomendado)

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd matematicas-andinas

# 2. Construir y ejecutar
docker compose up --build

# 3. Acceder a la aplicación
# http://localhost:8000
```

### Método 2: Instalación Local

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd matematicas-andinas

# 2. Crear entorno virtual
python -m venv venv

# 3. Activar entorno virtual
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 4. Instalar dependencias
pip install -r requirements.txt

# 5. Ejecutar aplicación
python app.py

# 6. Acceder a la aplicación
# http://localhost:8000
```

### Configuración de Variables de Entorno

```bash
# CHANGE HERE: Crear archivo .env para configuración local
cat > .env << EOF
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=tu-clave-secreta-aqui
PORT=8000
HOST=0.0.0.0
EOF
```

## 🛠️ Comandos de Desarrollo

### Servidor de Desarrollo

```bash
# Con Docker (recarga automática)
docker compose up --build

# Con Docker en background
docker compose up -d --build

# Local con Flask
python app.py

# Local con recarga automática
FLASK_ENV=development FLASK_DEBUG=1 python app.py
```

### Herramientas de Código

```bash
# Formatear código Python
black app.py

# Verificar estilo Python
pylint app.py

# Verificar tipos (si se usa)
mypy app.py

# Ejecutar tests (cuando estén implementados)
pytest tests/
```

### Desarrollo Frontend

```bash
# Verificar JavaScript (si se usa ESLint)
npx eslint static/js/

# Minificar CSS (producción)
npx cssnano static/css/base.css static/css/base.min.css

# Optimizar imágenes
# CHANGE HERE: Instalar herramientas de optimización
npm install -g imagemin-cli
imagemin static/images/*.png --out-dir=static/images/optimized/
```

## 🐳 Comandos de Docker

### Comandos Básicos

```bash
# Construir imagen
docker compose build

# Ejecutar servicios
docker compose up

# Ejecutar en background
docker compose up -d

# Ver logs
docker compose logs

# Ver logs en tiempo real
docker compose logs -f

# Parar servicios
docker compose down

# Parar y eliminar volúmenes
docker compose down -v
```

### Gestión de Contenedores

```bash
# Listar contenedores activos
docker ps

# Listar todas las imágenes
docker images

# Ejecutar comando en contenedor
docker compose exec matematicas-andinas bash

# Copiar archivos desde/hacia contenedor
docker cp archivo.txt matematicas-andinas:/app/
docker cp matematicas-andinas:/app/logs/ ./logs/
```

### Limpieza del Sistema

```bash
# Limpiar contenedores parados
docker container prune

# Limpiar imágenes no utilizadas
docker image prune

# Limpiar todo el sistema (¡CUIDADO!)
docker system prune -a

# Limpiar volúmenes no utilizados
docker volume prune

# Ver uso de espacio
docker system df
```

### Docker para Producción

```bash
# Construir imagen de producción
docker build -t matematicas-andinas:latest .

# Ejecutar en producción
docker run -d \
  --name matematicas-andinas-prod \
  -p 8000:8000 \
  -v $(pwd)/data:/app/data \
  matematicas-andinas:latest

# Ver logs de producción
docker logs matematicas-andinas-prod

# Actualizar aplicación en producción
docker pull matematicas-andinas:latest
docker stop matematicas-andinas-prod
docker rm matematicas-andinas-prod
# Ejecutar comando anterior nuevamente
```

## 📝 Comandos de Git

### Flujo de Desarrollo

```bash
# Configurar Git (primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Clonar repositorio
git clone <repository-url>
cd matematicas-andinas

# Crear rama para nueva funcionalidad
git checkout -b feature/nueva-funcionalidad

# Ver estado de archivos
git status

# Agregar archivos al staging
git add .
git add archivo-especifico.py

# Hacer commit
git commit -m "feat: agregar nueva funcionalidad de khipu"

# Subir cambios
git push origin feature/nueva-funcionalidad

# Cambiar a rama principal
git checkout main

# Actualizar rama principal
git pull origin main

# Fusionar rama (después de PR aprobado)
git merge feature/nueva-funcionalidad

# Eliminar rama local
git branch -d feature/nueva-funcionalidad

# Eliminar rama remota
git push origin --delete feature/nueva-funcionalidad
```

### Comandos de Mantenimiento

```bash
# Ver historial de commits
git log --oneline

# Ver diferencias
git diff
git diff archivo.py

# Deshacer cambios no confirmados
git checkout -- archivo.py
git reset --hard HEAD

# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1

# Deshacer último commit (eliminar cambios)
git reset --hard HEAD~1

# Ver ramas
git branch -a

# Limpiar ramas locales
git remote prune origin
```

### Etiquetado de Versiones

```bash
# CHANGE HERE: Crear etiquetas para versiones
git tag -a v1.0.0 -m "Primera versión estable"
git push origin v1.0.0

# Listar etiquetas
git tag -l

# Ver información de etiqueta
git show v1.0.0

# Eliminar etiqueta
git tag -d v1.0.0
git push origin --delete v1.0.0
```

## 🚀 Despliegue

### Despliegue Local de Prueba

```bash
# Simular entorno de producción
FLASK_ENV=production FLASK_DEBUG=0 python app.py

# Con Docker en modo producción
docker compose -f docker-compose.prod.yml up --build
```

### Despliegue en Servidor

```bash
# 1. Conectar al servidor
ssh usuario@servidor.com

# 2. Clonar repositorio
git clone <repository-url>
cd matematicas-andinas

# 3. Configurar variables de entorno
cp .env.example .env
nano .env  # Editar configuración

# 4. Ejecutar con Docker
docker compose up -d --build

# 5. Configurar proxy reverso (Nginx)
sudo nano /etc/nginx/sites-available/matematicas-andinas
```

### Configuración de Nginx

```nginx
# CHANGE HERE: /etc/nginx/sites-available/matematicas-andinas
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /path/to/matematicas-andinas/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com

# Renovar automáticamente
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Despliegue con CI/CD

```yaml
# CHANGE HERE: .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          cd matematicas-andinas
          git pull origin main
          docker compose down
          docker compose up -d --build
```

## 🔧 Mantenimiento

### Backup de Datos

```bash
# Backup de niveles
cp data/levels.json backups/levels-$(date +%Y%m%d-%H%M%S).json

# Backup automático (cron)
# CHANGE HERE: Agregar a crontab
0 2 * * * cd /path/to/matematicas-andinas && cp data/levels.json backups/levels-$(date +\%Y\%m\%d).json

# Backup con Docker
docker compose exec matematicas-andinas cp data/levels.json data/backups/
```

### Monitoreo de Logs

```bash
# Ver logs en tiempo real
docker compose logs -f

# Ver logs específicos
docker compose logs matematicas-andinas

# Logs del sistema (Linux)
sudo journalctl -u docker -f

# Rotar logs (evitar que crezcan mucho)
docker compose logs --tail=1000 > logs/app-$(date +%Y%m%d).log
```

### Actualización de la Aplicación

```bash
# 1. Backup de datos
cp data/levels.json backups/levels-backup.json

# 2. Parar aplicación
docker compose down

# 3. Actualizar código
git pull origin main

# 4. Reconstruir y ejecutar
docker compose up -d --build

# 5. Verificar funcionamiento
curl http://localhost:8000/

# 6. Verificar logs
docker compose logs -f
```

### Limpieza Periódica

```bash
# Script de limpieza semanal
#!/bin/bash
# CHANGE HERE: cleanup.sh

echo "Iniciando limpieza del sistema..."

# Limpiar Docker
docker system prune -f
docker image prune -f

# Limpiar logs antiguos
find logs/ -name "*.log" -mtime +30 -delete

# Limpiar backups antiguos (mantener últimos 10)
ls -t backups/levels-*.json | tail -n +11 | xargs rm -f

echo "Limpieza completada."
```

## 🔍 Solución de Problemas

### Problemas Comunes

#### Error: Puerto 8000 en uso

```bash
# Encontrar proceso usando el puerto
sudo lsof -i :8000
# o
sudo netstat -tulpn | grep :8000

# Terminar proceso
sudo kill -9 <PID>

# Cambiar puerto en docker-compose.yml
# CHANGE HERE: ports: ["8001:8000"]
```

#### Error: Permisos de Docker

```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión o ejecutar
newgrp docker

# Verificar
docker run hello-world
```

#### Error: Memoria insuficiente

```bash
# Ver uso de memoria
free -h
docker stats

# Limpiar memoria
docker system prune -a
sudo apt clean
```

#### Error: Archivos de configuración

```bash
# Verificar estructura de archivos
ls -la data/
cat data/levels.json | python -m json.tool

# Restaurar desde backup
cp backups/levels-backup.json data/levels.json

# Verificar permisos
chmod 644 data/levels.json
chown $USER:$USER data/levels.json
```

### Debugging

#### Modo Debug

```bash
# Activar debug en Flask
export FLASK_DEBUG=1
python app.py

# Ver variables de entorno
docker compose exec matematicas-andinas env

# Ejecutar shell en contenedor
docker compose exec matematicas-andinas bash
```

#### Logs Detallados

```bash
# Logs con timestamps
docker compose logs -t

# Logs de un servicio específico
docker compose logs matematicas-andinas

# Seguir logs en tiempo real
docker compose logs -f --tail=100
```

#### Verificación de Salud

```bash
# Script de verificación
#!/bin/bash
# CHANGE HERE: health-check.sh

echo "Verificando salud de la aplicación..."

# Verificar respuesta HTTP
if curl -f http://localhost:8000/ > /dev/null 2>&1; then
    echo "✅ Aplicación responde correctamente"
else
    echo "❌ Aplicación no responde"
    exit 1
fi

# Verificar archivos críticos
if [ -f "data/levels.json" ]; then
    echo "✅ Archivo de niveles existe"
else
    echo "❌ Archivo de niveles no encontrado"
    exit 1
fi

# Verificar Docker
if docker compose ps | grep -q "Up"; then
    echo "✅ Contenedores ejecutándose"
else
    echo "❌ Problemas con contenedores"
    exit 1
fi

echo "✅ Verificación completada exitosamente"
```

### Contacto de Soporte

Si los problemas persisten:

1. **Revisar logs**: `docker compose logs -f`
2. **Verificar configuración**: Archivos `.env` y `docker-compose.yml`
3. **Consultar documentación**: [README.md](../README.md)
4. **Crear issue**: [GitHub Issues](../../issues)
5. **Revisar discusiones**: [GitHub Discussions](../../discussions)

### Comandos de Emergencia

```bash
# Reinicio completo del sistema
docker compose down -v
docker system prune -a
docker compose up --build

# Restaurar desde backup completo
git stash
git checkout main
git pull origin main
cp backups/levels-backup.json data/levels.json
docker compose up --build

# Verificar integridad del sistema
docker compose exec matematicas-andinas python -c "
import json
with open('data/levels.json') as f:
    data = json.load(f)
    print('✅ JSON válido')
    print(f'Juegos: {list(data.keys())}')
    print(f'Total niveles: {sum(len(v) for v in data.values())}')
"
```

---

## 📚 Referencias Rápidas

### Puertos por Defecto
- **Aplicación**: 8000
- **Nginx**: 80, 443

### Archivos Importantes
- `app.py` - Aplicación principal
- `data/levels.json` - Configuración de niveles
- `docker-compose.yml` - Configuración Docker
- `.env` - Variables de entorno

### Comandos Más Usados
```bash
# Desarrollo diario
docker compose up --build
docker compose logs -f
git status && git add . && git commit -m "mensaje"

# Despliegue
git pull && docker compose down && docker compose up -d --build

# Mantenimiento
docker system prune && cp data/levels.json backups/
```

---

**¿Necesitas ayuda?** Consulta la [documentación completa](../README.md) o abre un [issue](../../issues) para soporte técnico.