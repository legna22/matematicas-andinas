"""
Matemáticas Andinas - Juego Educativo Web
Flask Backend Application

CHANGE HERE: Puerto y host de la aplicación
"""

from flask import Flask, render_template, request, jsonify, send_from_directory
import json
import os

app = Flask(__name__)

# CHANGE HERE: Configuración de la aplicación
app.config['SECRET_KEY'] = 'matematicas_andinas_secret_key'
app.config['DEBUG'] = True

def load_levels():
    """Cargar niveles desde el archivo JSON"""
    try:
        with open('data/levels.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"khipu": [], "yupana": [], "chacana": []}

def save_levels(levels_data):
    """Guardar niveles al archivo JSON"""
    os.makedirs('data', exist_ok=True)
    with open('data/levels.json', 'w', encoding='utf-8') as f:
        json.dump(levels_data, f, indent=2, ensure_ascii=False)

@app.route('/')
def index():
    """Página principal - selector de juegos"""
    return render_template('index.html')

@app.route('/khipu')
def khipu():
    """Juego Khipu - Sistema de nudos andinos"""
    grade = request.args.get('grade', '1')
    level = request.args.get('level', '1')
    difficulty = request.args.get('difficulty', 'facil')
    levels_data = load_levels()
    
    return render_template('khipu.html', 
                         grade=grade, 
                         level=level,
                         difficulty=difficulty,
                         levels=levels_data.get('khipu', []))

@app.route('/yupana')
def yupana():
    """Juego Yupana - Ábaco andino"""
    grade = request.args.get('grade', '1')
    level = request.args.get('level', '1')
    levels_data = load_levels()
    
    return render_template('yupana.html', 
                         grade=grade, 
                         level=level,
                         levels=levels_data.get('yupana', []))

@app.route('/chacana')
def chacana():
    """Juego Chacana - Cruz andina"""
    grade = request.args.get('grade', '1')
    level = request.args.get('level', '1')
    levels_data = load_levels()
    
    return render_template('chacana.html', 
                         grade=grade, 
                         level=level,
                         levels=levels_data.get('chacana', []))

@app.route('/perfil')
def perfil():
    """Perfil del usuario - progreso y estadísticas"""
    return render_template('perfil.html')

@app.route('/admin/levels')
def admin_levels():
    """Editor de niveles - Panel administrativo"""
    levels_data = load_levels()
    return render_template('admin_levels.html', levels=levels_data)

@app.route('/instrucciones')
def instrucciones():
    return render_template('instrucciones.html')

@app.route('/api/levels', methods=['GET', 'POST'])
def api_levels():
    """API para gestionar niveles"""
    if request.method == 'GET':
        return jsonify(load_levels())
    
    elif request.method == 'POST':
        try:
            new_levels = request.json
            save_levels(new_levels)
            return jsonify({"success": True, "message": "Niveles actualizados correctamente"})
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 400

@app.route('/api/progress', methods=['GET', 'POST'])
def api_progress():
    """API para gestionar progreso del jugador"""
    if request.method == 'GET':
        # En una implementación real, esto vendría de una base de datos
        # Por ahora, devolvemos estructura vacía para que el frontend use localStorage
        return jsonify({
            "message": "Use localStorage for progress management",
            "structure": {
                "khipu": {},
                "yupana": {},
                "chacana": {},
                "user": {
                    "name": "Estudiante",
                    "currentGrade": 1
                }
            }
        })
    
    elif request.method == 'POST':
        # En una implementación real, aquí se guardaría en base de datos
        try:
            progress_data = request.json
            # Por ahora solo validamos la estructura
            required_keys = ['khipu', 'yupana', 'chacana']
            if not all(key in progress_data for key in required_keys):
                return jsonify({"success": False, "message": "Invalid progress structure"}), 400
            
            return jsonify({"success": True, "message": "Progress saved successfully"})
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 400

@app.route('/static/images/<path:filename>')
def serve_images(filename):
    """Servir imágenes estáticas"""
    return send_from_directory('static/images', filename)

@app.errorhandler(404)
def not_found(error):
    """Página de error 404 personalizada"""
    return render_template('404.html'), 404



if __name__ == '__main__':
    # CHANGE HERE: Configuración del servidor
    # Para desarrollo local, cambiar host a 'localhost'
    app.run(host="0.0.0.0", port=8000, debug=True)

    from flask import render_template


