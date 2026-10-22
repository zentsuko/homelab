from flask import Flask, request, render_template, send_from_directory, jsonify
import os
from datetime import datetime
import secrets

app = Flask(__name__)

UPLOAD_FOLDER = "/uploads"
MAX_REQUEST_SIZE = 500 * 1024 * 1024
MAX_FILES = 20
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".heic", ".webp"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)


@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    safe_name = os.path.basename(filename)
    return send_from_directory(UPLOAD_FOLDER, safe_name)


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@app.route("/upload", methods=["POST"])
def upload():
    content_length = request.content_length
    if content_length and content_length > MAX_REQUEST_SIZE:
        return jsonify({
            "success": False,
            "error": "Envoi trop volumineux (max 500 Mo)"
        }), 400

    files = request.files.getlist("photo")

    if not files:
        return jsonify({
            "success": False,
            "error": "Aucun fichier reçu"
        }), 400

    if len(files) > MAX_FILES:
        return jsonify({
            "success": False,
            "error": f"Maximum {MAX_FILES} photos par envoi"
        }), 400

    saved_files = []

    for file in files:
        if not file or file.filename == "":
            continue

        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            ext = ".jpg"

        filename = (
            datetime.now().strftime("%Y%m%d-%H%M%S")
            + "-"
            + secrets.token_hex(4)
            + ext
        )

        path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(path)
        saved_files.append(filename)

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
        safe_name = os.path.basename(filename)
        path = os.path.join(UPLOAD_FOLDER, safe_name)
        if os.path.exists(path):
            safe_files.append(safe_name)

    return render_template("success.html", files=safe_files)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
