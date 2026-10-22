#!/usr/bin/env python3

import json
import os
import re
import socket
import struct
import subprocess
import time
import urllib.error
import urllib.request
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo


# ============================================================
# CONFIGURATION
# ============================================================

CONTAINER = "ark-server"

RCON_HOST = "127.0.0.1"
RCON_PORT = 27020

MAX_PLAYERS = 10
UPDATE_INTERVAL = 30

# Pendant le démarrage, on retente RCON toutes les X secondes.
RCON_TIMEOUT = 5
RCON_RETRIES = 2

BACKUP_DIR = Path(
    "/root/docker/ark/server/backup"
)

MESSAGE_ID_FILE = Path(
    "/opt/ark-discord/message_id"
)

TIMEZONE = ZoneInfo(
    "Europe/Paris"
)

MAP_NAME = "The Island"

SERVER_NAME = "HOMELABCLEMENT"

CROSSPLAY_TEXT = "Steam + Epic"

AUTO_START_TIME = "17:30"
AUTO_STOP_TIME = "02:00"


# ============================================================
# RCON CONSTANTES
# ============================================================

SERVERDATA_RESPONSE_VALUE = 0
SERVERDATA_EXECCOMMAND = 2
SERVERDATA_AUTH_RESPONSE = 2
SERVERDATA_AUTH = 3


# ============================================================
# LOGGING
# ============================================================

def log(message):

    print(
        f"[ARK-DISCORD] {message}",
        flush=True
    )


# ============================================================
# RCON - OUTILS BAS NIVEAU
# ============================================================

def recv_exact(sock, size):
    """
    Lit exactement 'size' octets sur la socket.

    recv() ne garantit pas de retourner toute la quantité
    demandée en une seule fois.
    """

    data = bytearray()

    while len(data) < size:

        chunk = sock.recv(
            size - len(data)
        )

        if not chunk:
            raise ConnectionError(
                "RCON : connexion fermée par le serveur"
            )

        data.extend(chunk)

    return bytes(data)


def build_rcon_packet(
    request_id,
    packet_type,
    body
):
    """
    Construit un paquet Source RCON.
    """

    body_bytes = body.encode(
        "utf-8"
    )

    payload = struct.pack(
        "<ii",
        request_id,
        packet_type
    )

    payload += body_bytes

    # Deux octets NULL obligatoires :
    # String terminator + empty padding string.
    payload += b"\x00\x00"

    return (
        struct.pack(
            "<i",
            len(payload)
        )
        + payload
    )


def receive_rcon_packet(sock):
    """
    Reçoit un paquet RCON complet.
    """

    raw_size = recv_exact(
        sock,
        4
    )

    size = struct.unpack(
        "<i",
        raw_size
    )[0]

    # Protection contre les tailles aberrantes.
    if size < 10 or size > 1024 * 1024:
        raise ValueError(
            f"RCON : taille de paquet invalide ({size})"
        )

    payload = recv_exact(
        sock,
        size
    )

    if len(payload) < 10:
        raise ValueError(
            "RCON : paquet trop petit"
        )

    request_id = struct.unpack(
        "<i",
        payload[0:4]
    )[0]

    packet_type = struct.unpack(
        "<i",
        payload[4:8]
    )[0]

    # Les deux derniers octets sont les terminateurs.
    body = payload[
        8:-2
    ].decode(
        "utf-8",
        errors="replace"
    )

    return {
        "request_id": request_id,
        "type": packet_type,
        "body": body
    }


# ============================================================
# RCON - CONNEXION / AUTHENTIFICATION
# ============================================================

def rcon_connect():

    password = os.environ[
        "ARK_RCON_PASSWORD"
    ]

    sock = socket.create_connection(
        (
            RCON_HOST,
            RCON_PORT
        ),
        timeout=RCON_TIMEOUT
    )

    sock.settimeout(
        RCON_TIMEOUT
    )

    # --------------------------------------------------------
    # AUTHENTIFICATION
    # --------------------------------------------------------

    sock.sendall(
        build_rcon_packet(
            1,
            SERVERDATA_AUTH,
            password
        )
    )

    auth = receive_rcon_packet(
        sock
    )

    # ARK renvoie -1 si l'authentification échoue.
    if auth["request_id"] == -1:

        sock.close()

        raise PermissionError(
            "RCON : authentification refusée"
        )

    if auth["request_id"] != 1:

        sock.close()

        raise ConnectionError(
            "RCON : réponse d'authentification inattendue"
        )

    return sock


# ============================================================
# RCON - COMMANDE
# ============================================================

def rcon_command(command):

    last_error = None

    for attempt in range(
        1,
        RCON_RETRIES + 1
    ):

        sock = None

        try:

            sock = rcon_connect()

            # ------------------------------------------------
            # ENVOI DE LA COMMANDE
            # ------------------------------------------------

            sock.sendall(
                build_rcon_packet(
                    2,
                    SERVERDATA_EXECCOMMAND,
                    command
                )
            )

            # ------------------------------------------------
            # LECTURE DE LA REPONSE
            # ------------------------------------------------

            packets = []

            # La réponse standard ARK tient généralement
            # dans un paquet. On lit au minimum celui-ci.
            response = receive_rcon_packet(
                sock
            )

            packets.append(
                response
            )

            body = "".join(
                packet["body"]
                for packet in packets
            )

            return body

        except Exception as e:

            last_error = e

            if attempt < RCON_RETRIES:

                time.sleep(
                    0.5
                )

        finally:

            if sock is not None:

                try:
                    sock.close()
                except Exception:
                    pass

    raise last_error


# ============================================================
# RCON - TEST DE DISPONIBILITE
# ============================================================

def rcon_ready():

    try:

        output = rcon_command(
            "ListPlayers"
        )

        # Une réponse vide est considérée comme valide :
        # cela peut simplement signifier 0 joueur.
        if output is not None:

            return True, output

    except Exception as e:

        return False, str(e)

    return False, "Réponse RCON vide"


# ============================================================
# JOUEURS ARK
# ============================================================

def parse_players(output):

    players = []

    if not output:
        return players

    for raw_line in output.splitlines():

        line = raw_line.strip()

        if not line:
            continue

        # Exemple ARK :
        #
        # 0. Zhen, 76561197998489650
        #
        match = re.match(
            r"^\s*\d+\.\s*(.+?),\s*(\d{5,})\s*$",
            line
        )

        if not match:
            continue

        name = match.group(1).strip()
        steam_id = match.group(2).strip()

        if not name:
            continue

        players.append(
            {
                "name": name,
                "steam_id": steam_id
            }
        )

    return players


def get_players():

    output = rcon_command(
        "ListPlayers"
    )

    return parse_players(
        output
    )


# ============================================================
# DOCKER STATUS
# ============================================================

def docker_status():

    try:

        result = subprocess.run(
            [
                "docker",
                "inspect",
                CONTAINER,
                "--format",
                "{{.State.Status}}|{{if .State.Health}}{{.State.Health.Status}}{{else}}no-healthcheck{{end}}|{{.State.StartedAt}}"
            ],
            capture_output=True,
            text=True,
            timeout=5
        )

        if result.returncode != 0:

            return {
                "exists": False,
                "running": False,
                "health": None,
                "started_at": None
            }

        parts = result.stdout.strip().split(
            "|",
            2
        )

        if len(parts) != 3:

            return {
                "exists": True,
                "running": False,
                "health": None,
                "started_at": None
            }

        status = parts[0]
        health = parts[1]
        started_at = parts[2]

        return {
            "exists": True,
            "running": status == "running",
            "health": health,
            "started_at": started_at
        }

    except Exception as e:

        log(
            f"Docker erreur : {e}"
        )

        return {
            "exists": False,
            "running": False,
            "health": None,
            "started_at": None
        }


# ============================================================
# FORMATAGE DATE
# ============================================================

def format_started_at(started_at):

    if not started_at:
        return "Inconnu"

    try:

        dt = datetime.fromisoformat(
            started_at.replace(
                "Z",
                "+00:00"
            )
        )

        dt = dt.astimezone(
            TIMEZONE
        )

        return dt.strftime(
            "%d/%m/%Y à %H:%M"
        )

    except Exception:

        return "Inconnu"


# ============================================================
# BACKUPS
# ============================================================

def get_latest_backup():

    try:

        if not BACKUP_DIR.exists():
            return None

        backups = list(
            BACKUP_DIR.rglob(
                "*.tar.bz2"
            )
        )

        if not backups:
            return None

        latest = max(
            backups,
            key=lambda path: path.stat().st_mtime
        )

        dt = datetime.fromtimestamp(
            latest.stat().st_mtime,
            TIMEZONE
        )

        return dt.strftime(
            "%d/%m/%Y à %H:%M"
        )

    except Exception as e:

        log(
            f"Backup erreur : {e}"
        )

        return None


# ============================================================
# MESSAGE DISCORD
# ============================================================

def load_message_id():

    try:

        if not MESSAGE_ID_FILE.exists():

            return None

        message_id = (
            MESSAGE_ID_FILE
            .read_text(
                encoding="utf-8"
            )
            .strip()
        )

        if message_id:

            log(
                f"Message permanent : {message_id}"
            )

            return message_id

    except Exception as e:

        log(
            f"Lecture message_id impossible : {e}"
        )

    return None


def save_message_id(
    message_id
):

    try:

        MESSAGE_ID_FILE.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        MESSAGE_ID_FILE.write_text(
            str(message_id),
            encoding="utf-8"
        )

        MESSAGE_ID_FILE.chmod(
            0o600
        )

    except Exception as e:

        log(
            f"Sauvegarde message_id impossible : {e}"
        )


def delete_message_id():

    try:

        if MESSAGE_ID_FILE.exists():

            MESSAGE_ID_FILE.unlink()

    except Exception as e:

        log(
            f"Suppression message_id impossible : {e}"
        )


# ============================================================
# DISCORD HTTP
# ============================================================

def discord_webhook_url():

    return os.environ[
        "DISCORD_WEBHOOK_URL"
    ]


def discord_request(
    method,
    url,
    payload=None
):

    data = None

    if payload is not None:

        data = json.dumps(
            payload,
            ensure_ascii=False
        ).encode(
            "utf-8"
        )

    request = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Content-Type":
                "application/json",

            "User-Agent":
                "HomelabClement-ARK-Status/2.0"
        }
    )

    try:

        with urllib.request.urlopen(
            request,
            timeout=10
        ) as response:

            response_data = response.read()

            if not response_data:
                return None

            return json.loads(
                response_data.decode(
                    "utf-8"
                )
            )

    except urllib.error.HTTPError as e:

        # Gestion spéciale du rate-limit Discord.
        if e.code == 429:

            retry_after = 5

            try:

                retry_after = float(
                    e.headers.get(
                        "Retry-After",
                        "5"
                    )
                )

            except Exception:
                pass

            log(
                f"Discord rate-limit, attente {retry_after}s"
            )

            time.sleep(
                retry_after
            )

            raise

        raise


# ============================================================
# DISCORD - CREATION / MODIFICATION MESSAGE
# ============================================================

def create_or_update_message(
    embed,
    message_id=None
):

    webhook = discord_webhook_url()

    payload = {
        "embeds": [
            embed
        ]
    }

    # --------------------------------------------------------
    # MODIFICATION DU MESSAGE EXISTANT
    # --------------------------------------------------------

    if message_id:

        url = (
            f"{webhook}"
            f"/messages/"
            f"{message_id}"
        )

        try:

            discord_request(
                "PATCH",
                url,
                payload
            )

            return message_id

        except urllib.error.HTTPError as e:

            if e.code != 404:
                raise

            log(
                "Message Discord introuvable, "
                "création d'un nouveau message."
            )

            delete_message_id()

    # --------------------------------------------------------
    # CREATION
    # --------------------------------------------------------

    url = (
        f"{webhook}"
        f"?wait=true"
    )

    response = discord_request(
        "POST",
        url,
        payload
    )

    if not response or "id" not in response:

        raise RuntimeError(
            "Discord : ID du message non reçu"
        )

    new_message_id = response[
        "id"
    ]

    save_message_id(
        new_message_id
    )

    log(
        f"Nouveau message permanent : {new_message_id}"
    )

    return new_message_id


# ============================================================
# EMBED - FOOTER
# ============================================================

def embed_footer():

    return {
        "text":
            "Mise à jour automatique • 30 secondes"
    }


# ============================================================
# EMBED - OFFLINE
# ============================================================

def offline_embed():

    backup = get_latest_backup()

    if backup:

        backup_text = (
            f"✅ {backup}"
        )

    else:

        backup_text = (
            "❌ Aucun backup trouvé"
        )

    return {

        "title":
            f"🦖 {SERVER_NAME} — ARK",

        "description":
            "🔴 **SERVEUR HORS LIGNE**",

        "color":
            15548997,

        "fields": [

            {
                "name":
                    "🌙 Statut",

                "value":
                    "Serveur actuellement arrêté",

                "inline":
                    False
            },

            {
                "name":
                    "🚀 Démarrage manuel",

                "value":
                    "Pour démarrer le serveur, utilise **/ark start**",

                "inline":
                    False
            },

            {
                "name":
                    "💾 Dernier backup",

                "value":
                    backup_text,

                "inline":
                    False
            },

            {
                "name":
                    "🎮 Crossplay",

                "value":
                    CROSSPLAY_TEXT,

                "inline":
                    False
            }

        ],

        "footer":
            embed_footer(),

        "timestamp":
            datetime.now(
                TIMEZONE
            ).isoformat()
    }


# ============================================================
# EMBED - STARTING
# ============================================================

def starting_embed():

    return {

        "title":
            f"🦖 {SERVER_NAME} — ARK",

        "description":
            "🟡 **SERVEUR EN DÉMARRAGE**",

        "color":
            16776960,

        "fields": [

            {
                "name":
                    "🌍 Carte",

                "value":
                    MAP_NAME,

                "inline":
                    False
            },

            {
                "name":
                    "⚙️ Statut",

                "value":
                    "ARK est lancé, chargement de la carte en cours…",

                "inline":
                    False
            },

            {
                "name":
                    "🎮 Crossplay",

                "value":
                    CROSSPLAY_TEXT,

                "inline":
                    False
            }

        ],

        "footer":
            embed_footer(),

        "timestamp":
            datetime.now(
                TIMEZONE
            ).isoformat()
    }


# ============================================================
# EMBED - ONLINE
# ============================================================

def online_embed(
    players,
    started_at
):

    count = len(
        players
    )

    # --------------------------------------------------------
    # LISTE DES JOUEURS
    # --------------------------------------------------------

    if players:

        player_lines = []

        for player in players:

            player_lines.append(
                f"• {player['name']}"
            )

        player_list = "\n".join(
            player_lines
        )

    else:

        player_list = (
            "• Aucun joueur connecté"
        )

    # Discord limite la valeur d'un field à 1024 caractères.
    player_list = player_list[
        :1024
    ]

    # --------------------------------------------------------
    # HEURE DE DEMARRAGE
    # --------------------------------------------------------

    start_text = format_started_at(
        started_at
    )

    # --------------------------------------------------------
    # BACKUP
    # --------------------------------------------------------

    backup = get_latest_backup()

    if backup:

        backup_text = (
            f"✅ {backup}"
        )

    else:

        backup_text = (
            "❌ Aucun backup trouvé"
        )

    # --------------------------------------------------------
    # EMBED
    # --------------------------------------------------------

    return {

        "title":
            f"🦖 {SERVER_NAME} — ARK",

        "description":
            "🟢 **SERVEUR EN LIGNE**\n\n"
            f"👥 **{count} / {MAX_PLAYERS} joueurs**",

        "color":
            5763719,

        "fields": [

            {
                "name":
                    "🌍 Carte",

                "value":
                    MAP_NAME,

                "inline":
                    False
            },

            {
                "name":
                    "👤 Joueurs connectés",

                "value":
                    player_list,

                "inline":
                    False
            },

            {
                "name":
                    "🎮 Crossplay",

                "value":
                    CROSSPLAY_TEXT,

                "inline":
                    False
            },

            {
                "name":
                    "⏱️ Serveur démarré",

                "value":
                    start_text,

                "inline":
                    False
            },

            {
                "name":
                    "💾 Dernier backup",

                "value":
                    backup_text,

                "inline":
                    False
            },

            {
                "name":
                    "🌙 Arrêt automatique",

                "value":
                    f"**{AUTO_STOP_TIME}**",

                "inline":
                    False
            }

        ],

        "footer":
            embed_footer(),

        "timestamp":
            datetime.now(
                TIMEZONE
            ).isoformat()
    }


# ============================================================
# MAIN
# ============================================================

def main():

    log(
        "Démarrage du bot..."
    )

    # --------------------------------------------------------
    # VERIFICATION ENV
    # --------------------------------------------------------

    required_variables = [
        "ARK_RCON_PASSWORD",
        "DISCORD_WEBHOOK_URL"
    ]

    missing = [
        variable
        for variable in required_variables
        if not os.environ.get(variable)
    ]

    if missing:

        log(
            "ERREUR : variables manquantes : "
            + ", ".join(missing)
        )

        raise SystemExit(1)

    # --------------------------------------------------------
    # MESSAGE PERMANENT
    # --------------------------------------------------------

    message_id = load_message_id()

    previous_state = None

    while True:

        try:

            docker = docker_status()

            # =================================================
            # DOCKER ARRETE
            # =================================================

            if not docker["running"]:

                state = "offline"

                embed = offline_embed()

                if previous_state != state:

                    log(
                        "🔴 OFFLINE"
                    )

            # =================================================
            # DOCKER LANCE
            # =================================================

            else:

                # -------------------------------------------------
                # Docker est running.
                #
                # On ne dit PAS encore ONLINE.
                # On vérifie que RCON + ListPlayers fonctionnent.
                # -------------------------------------------------

                ready, result = rcon_ready()

                if ready:

                    state = "online"

                    players = parse_players(
                        result
                    )

                    embed = online_embed(
                        players,
                        docker["started_at"]
                    )

                    if previous_state != state:

                        log(
                            "🟢 ONLINE — "
                            f"{len(players)}/{MAX_PLAYERS} joueurs"
                        )

                    else:

                        log(
                            f"🟢 ONLINE — "
                            f"{len(players)}/{MAX_PLAYERS} joueurs"
                        )

                else:

                    state = "starting"

                    embed = starting_embed()

                    if previous_state != state:

                        log(
                            "🟡 SERVEUR EN DÉMARRAGE — "
                            "RCON pas encore disponible"
                        )

            # =================================================
            # DISCORD
            # =================================================

            try:

                message_id = create_or_update_message(
                    embed,
                    message_id
                )

            except urllib.error.HTTPError as e:

                log(
                    f"Discord HTTP {e.code} : {e.reason}"
                )

            except Exception as e:

                log(
                    f"Discord erreur : {e}"
                )

            previous_state = state

        except KeyboardInterrupt:

            log(
                "Arrêt demandé."
            )

            break

        except Exception as e:

            log(
                f"ERREUR : {e}"
            )

        time.sleep(
            UPDATE_INTERVAL
        )


# ============================================================
# ENTRYPOINT
# ============================================================

if __name__ == "__main__":

    main()
