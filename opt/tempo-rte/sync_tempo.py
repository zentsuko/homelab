#!/usr/bin/env python3

import base64
import json
import sqlite3
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo


ENV_FILE = "/opt/tempo-rte/.env"
DB_FILE = "/opt/tempo-rte/tempo.db"

TOKEN_URL = "https://digital.iservices.rte-france.com/token/oauth/"
API_URL = (
    "https://digital.iservices.rte-france.com/"
    "open_api/tempo_like_supply_contract/v1/tempo_like_calendars"
)

TIMEZONE = ZoneInfo("Europe/Paris")


def load_env():
    values = {}

    with open(ENV_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()

            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            values[key.strip()] = value.strip()

    return values


def get_token(client_id, client_secret):
    credentials = f"{client_id}:{client_secret}".encode()
    encoded = base64.b64encode(credentials).decode()

    data = urllib.parse.urlencode({
        "grant_type": "client_credentials"
    }).encode()

    request = urllib.request.Request(
        TOKEN_URL,
        data=data,
        method="POST",
        headers={
            "Authorization": f"Basic {encoded}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        result = json.load(response)

    return result["access_token"]


def fetch_calendar_range(token, start_dt, end_dt, max_retries=3):
    params = urllib.parse.urlencode({
        "start_date": start_dt.isoformat(),
        "end_date": end_dt.isoformat(),
    })

    request = urllib.request.Request(
        f"{API_URL}?{params}",
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
        },
    )

    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return json.load(response)
        except urllib.error.HTTPError as e:
            if e.code == 500 and attempt < max_retries - 1:
                time.sleep(2 * (attempt + 1))
                continue
            raise


def get_tempo_calendar(token):
    now = datetime.now(TIMEZONE)

    start = (now - timedelta(days=7)).replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
    )

    # L'API RTE a un end_date exclusif : days=2 permet de récupérer aujourd'hui et demain
    end = (now + timedelta(days=2)).replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
    )

    try:
        return fetch_calendar_range(token, start, end)
    except urllib.error.HTTPError as e:
        # Si RTE n'a pas encore publié demain (ex. le matin tôt), repli sur J+1
        if e.code == 400:
            fallback_end = (now + timedelta(days=1)).replace(
                hour=0,
                minute=0,
                second=0,
                microsecond=0,
            )
            return fetch_calendar_range(token, start, fallback_end)
        raise


def save_calendar(data):
    calendar = data["tempo_like_calendars"]
    values = calendar.get("values", [])

    with sqlite3.connect(DB_FILE) as conn:
        for value in values:
            start_date = value["start_date"][:10]
            color = value["value"]
            updated_at = value["updated_date"]

            conn.execute(
                """
                INSERT INTO tempo_days (date, color, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(date) DO UPDATE SET
                    color = excluded.color,
                    updated_at = excluded.updated_at
                """,
                (start_date, color, updated_at),
            )

        conn.commit()

    return len(values)


def main():
    env = load_env()

    client_id = env["RTE_CLIENT_ID"]
    client_secret = env["RTE_CLIENT_SECRET"]

    token = get_token(client_id, client_secret)
    data = get_tempo_calendar(token)

    count = save_calendar(data)

    print(f"{count} jour(s) Tempo synchronisé(s)")


if __name__ == "__main__":
    main()
