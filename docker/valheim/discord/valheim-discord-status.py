#!/usr/bin/env python3

import json
import os
import subprocess
import time
from datetime import datetime, timezone

import requests


# ============================================================
# CONFIGURATION
# ============================================================

WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL")
LOG_WEBHOOK_URL = os.getenv("DISCORD_LOG_WEBHOOK_URL")

CONTAINER = "valheim"

MESSAGE_ID_FILE = "/srv/docker/valheim/discord/message_id"
EVENT_LOG_FILE = "/srv/docker/valheim/discord/valheim-events.log"
EVENT_OFFSET_FILE = "/srv/docker/valheim/discord/events_offset"

BACKUP_DIR = "/srv/docker/valheim/config/backups"

UPDATE_INTERVAL = 30
MAX_PLAYERS = 10
IDLE_TIMEOUT = 600


# ============================================================
# UTILITAIRES
# ============================================================

def log(message):
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"{timestamp} {message}", flush=True)


def load_message_id():
    try:
        with open(MESSAGE_ID_FILE, "r") as file:
            return file.read().strip()
    except FileNotFoundError:
        return None


def save_message_id(message_id):
    with open(MESSAGE_ID_FILE, "w") as file:
        file.write(str(message_id))


def get_docker_status():

    try:

        result = subprocess.run(
            [
                "docker",
                "inspect",
                "-f",
                "{{.State.Status}}",
                CONTAINER,
            ],
            capture_output=True,
            text=True,
            timeout=10,
        )

        if result.returncode != 0:
            log(
                f"Impossible de lire Docker : "
                f"code={result.returncode} "
                f"stderr={result.stderr.strip()}"
            )
            return "unknown"

        return result.stdout.strip()

    except Exception as error:

        log(f"Erreur Docker : {error}")

        return "unknown"


# ============================================================
# VALHEIM A2S
# ============================================================

def get_valheim_status():

    try:

        result = subprocess.run(
            [
                "docker",
                "exec",
                CONTAINER,
                "/usr/local/bin/valheim-status",
                "--timeout-is-error",
            ],
            capture_output=True,
            text=True,
            timeout=15,
        )

        # valheim-status peut retourner un code différent de 0
        # alors que stdout contient un JSON parfaitement valide.
        # Le JSON est donc la source de vérité.

        if not result.stdout.strip():
            log(
                f"Impossible de lire le statut Valheim : "
                f"code={result.returncode} "
                f"stderr={result.stderr.strip()}"
            )
            return None

        try:

            status = json.loads(result.stdout)

        except json.JSONDecodeError as error:

            log(
                f"JSON Valheim invalide : {error} "
                f"(code={result.returncode})"
            )

            return None

        # Le code retour 5 est normal avec valheim-status
        # lorsque le serveur répond correctement mais utilise
        # son propre code de statut.
        return status

    except Exception as error:

        log(f"Erreur statut Valheim : {error}")

        return None


# ============================================================
# BACKUP
# ============================================================

def get_latest_backup():

    try:

        files = []

        for filename in os.listdir(BACKUP_DIR):

            if filename.startswith("worlds-") and filename.endswith(".zip"):

                path = os.path.join(BACKUP_DIR, filename)

                if os.path.isfile(path):

                    files.append(path)

        if not files:
            return None

        latest = max(
            files,
            key=os.path.getmtime
        )

        return os.path.basename(latest)

    except Exception as error:

        log(f"Erreur lecture backup : {error}")

        return None


# ============================================================
# TIMER IDLE
# ============================================================

def get_idle_status():

    try:

        with open(EVENT_LOG_FILE, "r") as file:

            lines = file.readlines()

        for line in reversed(lines):

            if "timer d'arrêt de 10 minutes démarré" in line:

                return "🌙 Arrêt dans 10 minutes"

            if "Timer d'arrêt annulé" in line:

                return "🟢 Serveur actif"

            if "Joueur connecté" in line:

                return "🟢 Serveur actif"

        return "🟢 Serveur actif"

    except Exception:

        return "🟢 Serveur actif"


# ============================================================
# PAYLOAD DISCORD
# ============================================================

def build_payload():

    docker_status = get_docker_status()

    # --------------------------------------------------------
    # SERVEUR HORS LIGNE
    # --------------------------------------------------------

    if docker_status != "running":

        return {

            "embeds": [

                {

                    "title": "🔴 Le Royaume de Zhen — VALHEIM",

                    "description":
                        "Le serveur Valheim est actuellement **hors ligne**.\n\n"
                        "🖥️ Statut : 🔴 **SERVEUR HORS LIGNE**",

                    "color": 15158332,

                    "fields": [

                        {
                            "name": "👥 Joueurs",
                            "value": "0 / 10",
                            "inline": True,
                        },

                        {
                            "name": "🖥️ Docker",
                            "value": f"`{docker_status}`",
                            "inline": True,
                        },

                    ],

                    "timestamp":
                        datetime.now(timezone.utc).isoformat(),

                }

            ]

        }

    # --------------------------------------------------------
    # VALHEIM
    # --------------------------------------------------------

    status = get_valheim_status()

    # --------------------------------------------------------
    # DÉMARRAGE
    # --------------------------------------------------------

    if status is None:

        return {

            "embeds": [

                {

                    "title": "🟡 Le Royaume de Zhen — VALHEIM",

                    "description":
                        "Le serveur Valheim est en **cours de démarrage**.\n\n"
                        "🖥️ Statut : 🟡 **DÉMARRAGE EN COURS**\n"
                        "⏳ Patientez : Le serveur Steam n'est pas encore disponible.",

                    "color": 16776960,

                    "timestamp":
                        datetime.now(timezone.utc).isoformat(),

                }

            ]

        }

    # --------------------------------------------------------
    # SERVEUR ONLINE
    # --------------------------------------------------------

    player_count = status.get("player_count", 0)

    players = status.get("players", [])

    player_lines = []

    for index, player in enumerate(players, start=1):

        name = player.get("name") or f"Joueur {index}"

        player_lines.append(
            f"• {name}"
        )

    if not player_lines:

        player_lines.append("• Aucun joueur")

    idle_status = get_idle_status()

    latest_backup = get_latest_backup()

    backup_text = latest_backup if latest_backup else "Aucun backup"

    return {

        "embeds": [

            {

                "title":
                    "🟢 Le Royaume de Zhen — VALHEIM",

                "description":
                    "Le serveur Valheim est **en ligne**.\n\n"
                    "🖥️ Statut : 🟢 **EN LIGNE**",

                "color": 3066993,

                "fields": [

                    {

                        "name": "👥 Joueurs",

                        "value":
                            f"**{player_count} / {MAX_PLAYERS}**",

                        "inline": True,

                    },

                    {

                        "name": "⏱️ Activité",

                        "value":
                            idle_status,

                        "inline": True,

                    },

                    {

                        "name": "💾 Dernier backup",

                        "value":
                            backup_text,

                        "inline": False,

                    },

                    {

                        "name": "👤 Joueurs connectés",

                        "value":
                            "\n".join(player_lines),

                        "inline": False,

                    },

                ],

                "timestamp":
                    datetime.now(timezone.utc).isoformat(),

            }

        ]

    }


# ============================================================
# DISCORD MESSAGE
# ============================================================

def update_discord_message(payload, message_id):

    if not message_id:
        return None

    try:

        response = requests.patch(
            f"{WEBHOOK_URL}/messages/{message_id}",
            json=payload,
            timeout=15,
        )

        if response.status_code == 200:

            log(
                f"Message Discord {message_id} mis à jour"
            )

            return message_id

        log(
            f"Erreur mise à jour Discord : "
            f"HTTP {response.status_code} "
            f"{response.text}"
        )

        return None

    except Exception as error:

        log(
            f"Erreur connexion Discord : {error}"
        )

        return None


def create_discord_message(payload):

    try:

        response = requests.post(
            f"{WEBHOOK_URL}?wait=true",
            json=payload,
            timeout=15,
        )

        if response.status_code not in (200, 204):

            log(
                f"Erreur création message Discord : "
                f"HTTP {response.status_code} "
                f"{response.text}"
            )

            return None

        data = response.json()

        message_id = data.get("id")

        if message_id:

            save_message_id(message_id)

            log(
                f"Nouveau message Discord créé : {message_id}"
            )

        return message_id

    except Exception as error:

        log(
            f"Erreur création Discord : {error}"
        )

        return None


# ============================================================
# ÉVÉNEMENTS
# ============================================================

def process_event_logs():

    if not LOG_WEBHOOK_URL:
        return

    try:

        if not os.path.exists(EVENT_LOG_FILE):
            return

        current_size = os.path.getsize(EVENT_LOG_FILE)

        try:

            with open(EVENT_OFFSET_FILE, "r") as file:
                offset = int(file.read().strip())

        except (FileNotFoundError, ValueError):

            offset = 0

        if offset > current_size:
            offset = 0

        with open(
            EVENT_LOG_FILE,
            "r",
            encoding="utf-8",
            errors="replace",
        ) as file:

            file.seek(offset)

            new_content = file.read()

            new_offset = file.tell()

        if not new_content:
            return

        for line in new_content.splitlines():

            line = line.strip()

            if not line:
                continue

            try:

                response = requests.post(
                    LOG_WEBHOOK_URL,
                    json={
                        "content": line
                    },
                    timeout=15,
                )

                if response.status_code not in (200, 204):

                    log(
                        f"Erreur envoi événement Discord : "
                        f"HTTP {response.status_code}"
                    )

                else:

                    log(
                        f"Événement Discord envoyé : {line}"
                    )

            except Exception as error:

                log(
                    f"Erreur envoi événement Discord : {error}"
                )

        with open(EVENT_OFFSET_FILE, "w") as file:
            file.write(str(new_offset))

    except Exception as error:

        log(
            f"Erreur lecture événements : {error}"
        )


# ============================================================
# MAIN
# ============================================================

def main():

    if not WEBHOOK_URL:

        raise RuntimeError(
            "DISCORD_WEBHOOK_URL manquant"
        )

    if not LOG_WEBHOOK_URL:

        raise RuntimeError(
            "DISCORD_LOG_WEBHOOK_URL manquant"
        )

    message_id = load_message_id()

    log("Bot Discord Valheim démarré")

    while True:

        try:

            process_event_logs()

            payload = build_payload()

            if message_id:

                updated_id = update_discord_message(
                    payload,
                    message_id,
                )

                if updated_id:

                    message_id = updated_id

                else:

                    log(
                        "Impossible de mettre à jour le message, "
                        "suppression de l'ID pour recréation."
                    )

                    try:

                        os.remove(MESSAGE_ID_FILE)

                    except FileNotFoundError:

                        pass

                    message_id = None

            if not message_id:

                message_id = create_discord_message(
                    payload
                )

            time.sleep(UPDATE_INTERVAL)

        except Exception as error:

            log(
                f"Erreur dans la boucle : {error}"
            )

            time.sleep(UPDATE_INTERVAL)


if __name__ == "__main__":
    main()
