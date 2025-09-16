# Matemáticas Andinas - Docker Configuration
FROM python:3.11-slim

# CHANGE HERE: Puerto expuesto por la aplicación
EXPOSE 8000

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código de la aplicación
COPY . .

# Crear directorio para datos si no existe
RUN mkdir -p data

# CHANGE HERE: Comando de inicio - usar gunicorn para producción
CMD ["flask", "run", "--host=0.0.0.0", "--port=8000"]
