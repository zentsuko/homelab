#!/usr/bin/env python3

import base64
import json
import urllib.parse
import urllib.request
from datetime import datetime
from zoneinfo import ZoneInfo


ENV_FILE = "/opt/tempo-rte/.env"

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


def get_tempo_history(token):
    start = datetime(
        2025,
        9,
        1,
        0,
        0,
        0,
        tzinfo=TIMEZONE,
    )

    end = datetime(
        2025,
        9,
        30,
        23,
        59,
        59,
        tzinfo=TIMEZONE,
    )

    params = urllib.parse.urlencode({
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
    })

    url = f"{API_URL}?{params}"

    request = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
        },
    )

    with urllib.request.urlopen(request, timeout=60) as response:
        return json.load(response)


def main():
    print("=== TEST HISTORIQUE TEMPO RTE ===")
    print("Période demandée : 2025-09-01 → 2025-09-30")
    print()

    env = load_env()

    client_id = env.get("RTE_CLIENT_ID")
    client_secret = env.get("RTE_CLIENT_SECRET")

    if not client_id or not client_secret:
        raise RuntimeError(
            "RTE_CLIENT_ID ou RTE_CLIENT_SECRET absent de /opt/tempo-rte/.env"
        )

    print("Obtention du token RTE...")

    token = get_token(
        client_id,
        client_secret,
    )

    print("Token obtenu.")
    print("Interrogation de l'API RTE...")
    print()

    data = get_tempo_history(token)

    calendar = data.get("tempo_like_calendars", {})
    values = calendar.get("values", [])

    print(f"Nombre de jours retournés : {len(values)}")
    print()

    if not values:
        print("Aucune donnée historique retournée.")
        return

    print("Jours retournés :")

    for value in values:
        date = value.get("start_date", "")[:10]
        color = value.get("value", "INCONNU")

        print(f"  {date} -> {color}")

    print()
    print("=== FIN DU TEST ===")
    print("Aucune donnée n'a été écrite dans tempo.db.")


if __name__ == "__main__":
    main()
