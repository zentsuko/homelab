from flask import Flask, request, render_template, send_from_directory, jsonify
import os
from datetime import datetime
import secrets

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = None

UPLOAD_ROOT = "/uploads"
MAX_FILES = 20
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".heic", ".webp", ".mp4", ".mov", ".mkv", ".avi", ".webm", ".m4v"}
VIDEO_EXTENSIONS = {".mp4", ".mov", ".mkv", ".avi", ".webm", ".m4v"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".heic", ".webp"}

os.makedirs(UPLOAD_ROOT, exist_ok=True)


def get_storage_directory(filename, mimetype=""):
    ext = os.path.splitext(filename)[1].lower()
    if ext in IMAGE_EXTENSIONS or (mimetype or "").startswith("image/"):
        return os.path.join(UPLOAD_ROOT, "photos")
    if ext in VIDEO_EXTENSIONS or (mimetype or "").startswith("video/"):
        return os.path.join(UPLOAD_ROOT, "video")
    return os.path.join(UPLOAD_ROOT, "photos")


def resolve_upload_path(relative_path):
    normalized_path = os.path.normpath(relative_path)
    if normalized_path in {"", "."}:
        raise ValueError("Chemin vide")
    if normalized_path.startswith("/") or normalized_path.startswith(".."):
        raise ValueError("Chemin invalide")

    full_path = os.path.abspath(os.path.join(UPLOAD_ROOT, normalized_path))
    upload_root = os.path.abspath(UPLOAD_ROOT)
    if os.path.commonpath([upload_root, full_path]) != upload_root:
        raise ValueError("Chemin invalide")
    return full_path


@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)


@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    try:
        full_path = resolve_upload_path(filename)
    except ValueError:
        return jsonify({"success": False, "error": "Chemin invalide"}), 400

    if not os.path.exists(full_path):
        return jsonify({"success": False, "error": "Fichier introuvable"}), 404

    return send_from_directory(UPLOAD_ROOT, filename)


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@app.route("/upload", methods=["POST"])
def upload():
    files = request.files.getlist("photo")

    if not files:
        return jsonify({
            "success": False,
            "error": "Aucun fichier reçu"
        }), 400

    if len(files) > MAX_FILES:
        return jsonify({
            "success": False,
            "error": f"Maximum {MAX_FILES} fichiers par envoi"
        }), 400

    saved_files = []

    for file in files:
        if not file or file.filename == "":
            continue

        ext = os.path.splitext(file.filename)[1].lower()
        mimetype = (file.mimetype or "").lower()

        if ext in ALLOWED_EXTENSIONS:
            pass
        elif mimetype.startswith("video/"):
            ext = ".mp4"
        elif mimetype.startswith("image/"):
            ext = ".jpg"
        else:
            ext = ".jpg"

        filename = (
            datetime.now().strftime("%Y%m%d-%H%M%S")
            + "-"
            + secrets.token_hex(4)
            + ext
        )

        storage_dir = get_storage_directory(file.filename, mimetype)
        os.makedirs(storage_dir, exist_ok=True)
        path = os.path.join(storage_dir, filename)
        file.save(path)
        saved_files.append(os.path.relpath(path, UPLOAD_ROOT))

    if not saved_files:
        return jsonify({
            "success": False,
            "error": "Aucun fichier valide reçu"
        }), 400

    return jsonify({
        "success": True,
        "files": saved_files
    })


@app.route("/success", methods=["GET"])
def success():
    files = request.args.getlist("files")
    safe_files = []

    for filename in files:
        try:
            path = resolve_upload_path(filename)
        except ValueError:
            continue

        if os.path.exists(path):
            safe_files.append(filename)

    return render_template("success.html", files=safe_files)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
