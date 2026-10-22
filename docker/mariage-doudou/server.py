import csv
import hmac
import io
import os
import secrets
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, Response, jsonify, render_template, request, send_from_directory
from werkzeug.exceptions import RequestEntityTooLarge

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 500 * 1024 * 1024
app.config["UPLOAD_FOLDER"] = os.environ.get("UPLOAD_FOLDER", "/uploads")
app.config["RSVP_DATABASE"] = os.environ.get("RSVP_DATABASE", "/data/rsvps.sqlite3")
app.config["ADMIN_USERNAME"] = os.environ.get("ADMIN_USERNAME", "admin")
app.config["ADMIN_PASSWORD"] = os.environ.get("ADMIN_PASSWORD", "")

MAX_FILES = 20
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".heic", ".webp"}

Path(app.config["UPLOAD_FOLDER"]).mkdir(parents=True, exist_ok=True)
Path(app.config["RSVP_DATABASE"]).parent.mkdir(parents=True, exist_ok=True)


def get_database():
    database = sqlite3.connect(app.config["RSVP_DATABASE"])
    database.row_factory = sqlite3.Row
    return database


def initialize_database():
    with get_database() as database:
        database.execute(
            """
            CREATE TABLE IF NOT EXISTS rsvp_guests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                submission_id TEXT NOT NULL,
                guest_name TEXT NOT NULL,
                attending INTEGER NOT NULL,
                dietary_requirements TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL
            )
            """
        )


def admin_is_authorized():
    if not app.config["ADMIN_PASSWORD"]:
        return False
    credentials = request.authorization
    return bool(
        credentials
        and hmac.compare_digest(credentials.username, app.config["ADMIN_USERNAME"])
        and hmac.compare_digest(credentials.password, app.config["ADMIN_PASSWORD"])
    )


def require_admin():
    if request.headers.get("X-Forwarded-Proto", "").lower() != "https":
        return Response("HTTPS is required for the RSVP dashboard.", status=400)
    if not admin_is_authorized():
        return Response(
            "Authentication required",
            status=401,
            headers={"WWW-Authenticate": 'Basic realm="RSVP admin"'},
        )
    return None


@app.after_request
def prevent_private_data_caching(response):
    if request.path.startswith("/admin"):
        response.headers["Cache-Control"] = "no-store"
    return response


@app.errorhandler(RequestEntityTooLarge)
def upload_too_large(_error):
    return jsonify({"success": False, "error": "Envoi trop volumineux (max 500 Mo)"}), 413


@app.get("/")
def home():
    return render_template("index.html")


@app.get("/photos")
def photos():
    return render_template("photos.html")


@app.get("/photos/static/<path:filename>")
def photo_static(filename):
    return send_from_directory("static", filename)


@app.get("/photos/uploads/<path:filename>")
def uploaded_photo(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], os.path.basename(filename))


@app.post("/rsvp")
def submit_rsvp():
    data = request.get_json(silent=True)
    if not isinstance(data, dict) or not isinstance(data.get("guests"), list):
        return jsonify({"success": False, "error": "Formulaire invalide."}), 400

    guests = data["guests"]
    if not 1 <= len(guests) <= 10:
        return jsonify({"success": False, "error": "Indiquez de 1 à 10 invités."}), 400

    validated_guests = []
    for guest in guests:
        if not isinstance(guest, dict):
            return jsonify({"success": False, "error": "Réponse d’invité invalide."}), 400

        guest_name = guest.get("name")
        attending = guest.get("attending")
        dietary_requirements = guest.get("dietary_requirements", "")
        if not isinstance(guest_name, str) or not guest_name.strip() or len(guest_name.strip()) > 200:
            return jsonify({"success": False, "error": "Indiquez le nom de chaque invité."}), 400
        if not isinstance(attending, bool):
            return jsonify({"success": False, "error": "Indiquez la présence de chaque invité."}), 400
        if not isinstance(dietary_requirements, str):
            return jsonify({"success": False, "error": "Réponse allergies/régimes invalide."}), 400
        dietary_requirements = dietary_requirements.strip()
        if len(dietary_requirements) > 500:
            return jsonify({"success": False, "error": "La réponse allergies/régimes est trop longue."}), 400
        validated_guests.append((guest_name.strip(), int(attending), dietary_requirements if attending else ""))

    submission_id = secrets.token_hex(16)
    created_at = datetime.now(timezone.utc).isoformat()
    with get_database() as database:
        database.executemany(
            """
            INSERT INTO rsvp_guests
                (submission_id, guest_name, attending, dietary_requirements, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            [
                (submission_id, guest_name, attending, dietary_requirements, created_at)
                for guest_name, attending, dietary_requirements in validated_guests
            ],
        )

    return jsonify({"success": True, "guests_saved": len(validated_guests)}), 201


@app.post("/photos/upload")
def upload_photos():
    files = request.files.getlist("photo")
    if not files or len(files) > MAX_FILES:
        return jsonify({"success": False, "error": "Sélectionnez de 1 à 20 photos."}), 400

    saved_files = []
    for file in files:
        if not file or not file.filename:
            continue

        extension = Path(file.filename).suffix.lower()
        if extension not in ALLOWED_EXTENSIONS:
            return jsonify({"success": False, "error": "Format de photo non pris en charge."}), 400

        filename = f"{datetime.now().strftime('%Y%m%d-%H%M%S')}-{secrets.token_hex(8)}{extension}"
        file.save(Path(app.config["UPLOAD_FOLDER"]) / filename)
        saved_files.append(filename)

    if not saved_files:
        return jsonify({"success": False, "error": "Aucune photo valide reçue."}), 400

    return jsonify({"success": True, "files": saved_files}), 201


@app.get("/photos/success")
def upload_success():
    filenames = request.args.getlist("files")
    safe_files = [
        os.path.basename(filename)
        for filename in filenames
        if os.path.isfile(Path(app.config["UPLOAD_FOLDER"]) / os.path.basename(filename))
    ]
    return render_template("success.html", files=safe_files)


@app.route("/admin", methods=["GET"])
def admin_dashboard():
    denied = require_admin()
    if denied:
        return denied
    with get_database() as database:
        guests = database.execute(
            "SELECT * FROM rsvp_guests ORDER BY created_at DESC, id ASC"
        ).fetchall()
    return render_template("admin.html", guests=guests)


@app.route("/admin/rsvps.csv", methods=["GET"])
def export_rsvps():
    denied = require_admin()
    if denied:
        return denied
    with get_database() as database:
        guests = database.execute(
            "SELECT * FROM rsvp_guests ORDER BY created_at DESC, id ASC"
        ).fetchall()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Nom de l’invité", "Présence", "Allergies et régimes", "Date de réponse"])
    for guest in guests:
        writer.writerow(
            [
                guest["guest_name"],
                "Oui" if guest["attending"] else "Non",
                guest["dietary_requirements"],
                guest["created_at"],
            ]
        )
    return Response(
        output.getvalue(),
        mimetype="text/csv; charset=utf-8",
        headers={"Content-Disposition": 'attachment; filename="rsvp-mariage.csv"'},
    )


initialize_database()
