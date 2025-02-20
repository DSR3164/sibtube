import os
import uuid
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, 
    get_jwt_identity, get_jwt
)
from flask_bcrypt import Bcrypt
from moviepy import VideoFileClip
from werkzeug.utils import secure_filename
from models import db, Video, User, Comment
from flask_migrate import Migrate

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("MYSQL_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

jwt = JWTManager(app)
bcrypt = Bcrypt(app)
db.init_app(app)
CORS(app)

# Папки для хранения медиа
VIDEO_FOLDER = 'media/videos'
PREVIEW_FOLDER = 'media/previews'
IMG_FOLDER = 'media/img'

# Единый эндпоинт для доступа к видеофайлам
@app.route('/media/video/<string:filename>', methods=['GET'])
def serve_video(filename):
    return send_from_directory(VIDEO_FOLDER, filename)

# Единый эндпоинт для доступа к превью
@app.route('/media/preview/<string:filename>', methods=['GET'])
def serve_preview(filename):
    return send_from_directory(PREVIEW_FOLDER, filename)

# Эндпоинт для получения изображений
@app.route('/media/image/<string:filename>', methods=['GET'])
def serve_image(filename):
    filename = secure_filename(filename)
    return send_from_directory(IMG_FOLDER, filename)

# Регистрация пользователя
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not all(k in data for k in ("nickname", "email", "password")):
        return jsonify({"error": "Неверные данные"}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['nickname'], email=data['email'], password=hashed_password)
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Пользователь уже существует"}), 409

    return jsonify({"message": "Пользователь успешно зарегистрирован"}), 201

# Логин пользователя
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not all(k in data for k in ("email", "password")):
        return jsonify({"error": "Неверные данные"}), 400

    user = User.query.filter_by(email=data['email']).first()
    if not user or not bcrypt.check_password_hash(user.password, data['password']):
        return jsonify({"error": "Неверный email или пароль"}), 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"username": user.username, "email": user.email}
    )
    return jsonify({"access_token": access_token}), 200

# Получение профиля пользователя
@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    user_id = int(get_jwt_identity())
    user_data = User.query.filter_by(id=user_id).first()
    if user_data:
        return jsonify({
            "username": user_data.username,
            "email": user_data.email
        }), 200
    return jsonify({"error": "Пользователь не найден"}), 404

# Получение видео, принадлежащих пользователю
@app.route('/api/user/videos', methods=['GET'])
@jwt_required()
def user_videos():
    user_id = int(get_jwt_identity())
    videos = Video.query.filter_by(user_id=user_id).all()
    videos_data = [{
        "id": video.id,
        "title": video.title,
        "description": video.description,
        "url": video.url,
        "preview": video.preview
    } for video in videos]
    return jsonify(videos_data), 200

# Загрузка видео
@app.route('/api/user/upload', methods=['POST'])
@jwt_required()
def upload_video():
    user_id = int(get_jwt_identity())
    if 'video' not in request.files:
        return jsonify({"error": "Файл видео не предоставлен"}), 400

    video_file = request.files['video']
    title = request.form.get('title', 'Untitled').strip()
    if video_file.filename == '':
        return jsonify({"error": "Файл не выбран"}), 400

    original_filename = secure_filename(video_file.filename)
    file_extension = os.path.splitext(original_filename)[1]
    # Генерируем уникальное имя файла
    unique_id = uuid.uuid4().hex
    base_name = secure_filename(title)
    video_filename = f"{base_name}_{unique_id}{file_extension}"
    preview_filename = f"{base_name}_{unique_id}.png"
    video_path = os.path.join(VIDEO_FOLDER, video_filename)
    preview_path = os.path.join(PREVIEW_FOLDER, preview_filename)

    video_file.save(video_path)

    try:
        clip = VideoFileClip(video_path)
        t = clip.duration - (1.0 / clip.fps) if clip.duration > (1.0 / clip.fps) else 0
        clip.save_frame(preview_path, t=t)
        clip.close()
    except Exception as e:
        return jsonify({"error": f"Ошибка обработки видео: {str(e)}"}), 500

    video_url = f"/media/video/{video_filename}"
    preview_url = f"/media/preview/{preview_filename}"
    new_video = Video(user_id=user_id, title=title, url=video_url, preview=preview_url)
    db.session.add(new_video)
    db.session.commit()

    return jsonify({"id": new_video.id, "title": new_video.title, "url": new_video.url}), 201

# Получение всех видео с комментариями
@app.route('/api/videos', methods=['GET'])
def get_videos():
    videos = Video.query.all()
    data = []
    for video in videos:
        comments = Comment.query.filter_by(video_id=video.id).all()
        creator = video.creator
        video_data = {
            "id": video.id,
            "title": video.title,
            "description": video.description,
            "url": video.url,
            "preview": video.preview,
            "creator": {
                "id": creator.id,
                "username": creator.username
            } if creator else None,
            "comments": [
                {
                    "id": comment.id,
                    "user_id": comment.userid,
                    "username": comment.username,
                    "text": comment.text
                } for comment in comments
            ]
        }
        data.append(video_data)
    return jsonify(data), 200

# Удаление видео (только его создатель)
@app.route('/api/videos/<int:video_id>', methods=['DELETE'])
@jwt_required()
def delete_video(video_id):
    user_id = int(get_jwt_identity())
    video = Video.query.get(video_id)
    if not video:
        return jsonify({"error": "Видео не найдено"}), 404
    if video.user_id != user_id:
        return jsonify({"error": "Нет прав на удаление этого видео"}), 403

    try:
        db.session.delete(video)
        db.session.commit()
        return jsonify({"success": True, "message": "Видео успешно удалено"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Ошибка при удалении видео", "details": str(e)}), 500

# Добавление комментария
@app.route('/add_comment', methods=['POST'])
@jwt_required()
def add_comment():
    comment_data = request.get_json()
    if not comment_data:
        return jsonify({"error": "Нет данных для комментария"}), 400

    user_id = int(get_jwt_identity())
    claims = get_jwt()
    username = claims.get("username")

    video_id = comment_data.get("video_id")
    text = comment_data.get("text")
    if video_id is None or not text:
        return jsonify({"error": "Не хватает данных"}), 400

    new_comment = Comment(userid=user_id, username=username, video_id=video_id, text=text)
    try:
        db.session.add(new_comment)
        db.session.commit()
        return jsonify({"success": True}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Получение информации о текущем пользователе
@app.route('/get_user', methods=['GET'])
@jwt_required()
def get_user():
    try:
        claims = get_jwt()
        return jsonify(claims), 200
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
