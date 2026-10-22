#!/usr/bin/env python3

import base64
import json
import os
import shutil
import sqlite3
import urllib.parse
import urllib.request
from calendar import monthrange
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo


# ============================================================
# CONFIGURATION
# ============================================================

ENV_FILE = "/opt/tempo-rte/.env"

HA_DB = "/home/nascle/docker/homeassistant/config/home-assistant_v2.db"
TEMPO_DB = "/opt/tempo-rte/tempo.db"

TOKEN_URL = "https://digital.iservices.rte-france.com/token/oauth/"

API_URL = (
    "https://digital.iservices.rte-france.com/"
    "open_api/tempo_like_supply_contract/v1/tempo_like_calendars"
)

TIMEZONE = ZoneInfo("Europe/Paris")

LINKY_STATISTIC_ID = "linky:01144573079089"

HISTORY_START = date(2025, 9, 21)
HISTORY_END = date(2026, 9, 21)


# ============================================================
# ENV
# ============================================================

def load_env():
    values = {}

    with open(ENV_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()

            if (
                not line
                or line.startswith("#")
                or "=" not in line
            ):
                continue

            key, value = line.split("=", 1)

            values[key.strip()] = value.strip()

    return values


# ============================================================
# RTE AUTHENTIFICATION
# ============================================================

def get_token(client_id, client_secret):
    credentials = (
        f"{client_id}:{client_secret}"
    ).encode()

    encoded = base64.b64encode(
        credentials
    ).decode()

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

    with urllib.request.urlopen(
        request,
        timeout=30,
    ) as response:

        result = json.load(response)

    return result["access_token"]


# ============================================================
# RTE CALENDRIER
# ============================================================

def get_tempo_month(token, start_date, end_date):
    """
    RTE considère end_date comme une borne EXCLUE.

    Exemple :
        start = 01/10
        end   = 01/11

    permet de récupérer du 01/10 au 31/10 inclus.

    On construit donc end_date comme le lendemain
    du dernier jour souhaité, à 00:00.
    """

    start_dt = datetime(
        start_date.year,
        start_date.month,
        start_date.day,
        0,
        0,
        0,
        tzinfo=TIMEZONE,
    )

    exclusive_end_date = (
        end_date + timedelta(days=1)
    )

    end_dt = datetime(
        exclusive_end_date.year,
        exclusive_end_date.month,
        exclusive_end_date.day,
        0,
        0,
        0,
        tzinfo=TIMEZONE,
    )

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

    with urllib.request.urlopen(
        request,
        timeout=60,
    ) as response:

        return json.load(response)


# ============================================================
# SAUVEGARDE
# ============================================================

def backup_tempo_db():
    timestamp = datetime.now(
        TIMEZONE
    ).strftime("%Y%m%d_%H%M%S")

    backup_file = (
        f"{TEMPO_DB}.backup_{timestamp}"
    )

    shutil.copy2(
        TEMPO_DB,
        backup_file,
    )

    return backup_file


# ============================================================
# IMPORT TEMPO DAYS
# ============================================================

def import_tempo_days(conn, values):
    imported = 0

    for value in values:

        start_date = value.get(
            "start_date"
        )

        color = value.get(
            "value"
        )

        updated_at = value.get(
            "updated_date"
        )

        if not start_date or not color:
            continue

        day = start_date[:10]

        conn.execute(
            """
            INSERT INTO tempo_days (
                date,
                color,
                updated_at
            )
            VALUES (?, ?, ?)
            ON CONFLICT(date) DO UPDATE SET
                color = excluded.color,
                updated_at = excluded.updated_at
            """,
            (
                day,
                color,
                updated_at,
            ),
        )

        imported += 1

    conn.commit()

    return imported


# ============================================================
# TEMPO DATA
# ============================================================

def get_tempo_data(conn, date_str):
    current_date = datetime.strptime(
        date_str,
        "%Y-%m-%d",
    ).date()

    previous_date = (
        current_date - timedelta(days=1)
    ).isoformat()

    today = conn.execute(
        """
        SELECT color
        FROM tempo_days
        WHERE date = ?
        """,
        (date_str,),
    ).fetchone()

    previous = conn.execute(
        """
        SELECT color
        FROM tempo_days
        WHERE date = ?
        """,
        (previous_date,),
    ).fetchone()

    if today is None:
        raise RuntimeError(
            f"Couleur Tempo absente pour {date_str}"
        )

    if previous is None:
        raise RuntimeError(
            f"Couleur Tempo absente pour {previous_date}"
        )

    return today[0], previous[0]


# ============================================================
# TARIFS
# ============================================================

def get_rate(conn, color, period):
    row = conn.execute(
        """
        SELECT price_eur_kwh
        FROM tempo_rates
        WHERE color = ?
          AND period = ?
        """,
        (
            color,
            period,
        ),
    ).fetchone()

    if row is None:
        raise RuntimeError(
            f"Tarif absent pour {color}/{period}"
        )

    return row[0]


# ============================================================
# JOURNEES LINKY COMPLETES
# ============================================================

def get_complete_dates(conn):
    rows = conn.execute(
        """
        SELECT
            date(
                datetime(
                    start_ts,
                    'unixepoch',
                    'localtime'
                )
            ) AS jour,
            COUNT(*) AS heures
        FROM statistics
        WHERE metadata_id = (
            SELECT id
            FROM statistics_meta
            WHERE statistic_id = ?
        )
        GROUP BY jour
        HAVING COUNT(*) = 24
        ORDER BY jour
        """,
        (
            LINKY_STATISTIC_ID,
        ),
    ).fetchall()

    return [
        row[0]
        for row in rows
    ]


# ============================================================
# CALCUL D'UNE JOURNEE
# ============================================================

def calculate_day(
    conn_ha,
    conn_tempo,
    date_str,
):
    today_color, previous_color = get_tempo_data(
        conn_tempo,
        date_str,
    )

    hp_rates = {
        color: get_rate(
            conn_tempo,
            color,
            "HP",
        )
        for color in (
            "BLUE",
            "WHITE",
            "RED",
        )
    }

    hc_rates = {
        color: get_rate(
            conn_tempo,
            color,
            "HC",
        )
        for color in (
            "BLUE",
            "WHITE",
            "RED",
        )
    }

    start = (
        f"{date_str} 00:00:00"
    )

    end_date = (
        datetime.strptime(
            date_str,
            "%Y-%m-%d",
        ).date()
        + timedelta(days=1)
    )

    end = (
        f"{end_date.isoformat()} "
        "00:00:00"
    )

    rows = conn_ha.execute(
        """
        SELECT
            datetime(
                start_ts,
                'unixepoch',
                'localtime'
            ) AS heure,
            state / 1000.0 AS kwh
        FROM statistics
        WHERE metadata_id = (
            SELECT id
            FROM statistics_meta
            WHERE statistic_id = ?
        )
        AND datetime(
            start_ts,
            'unixepoch',
            'localtime'
        ) >= ?
        AND datetime(
            start_ts,
            'unixepoch',
            'localtime'
        ) < ?
        ORDER BY start_ts
        """,
        (
            LINKY_STATISTIC_ID,
            start,
            end,
        ),
    ).fetchall()

    if len(rows) != 24:
        return None

    kwh_hp = 0.0
    kwh_hc = 0.0

    cost_hp = 0.0
    cost_hc = 0.0

    for heure, kwh in rows:

        hour = int(
            heure[11:13]
        )

        # ----------------------------------------------------
        # HP : 06:00 -> 22:00
        # ----------------------------------------------------

        if 6 <= hour < 22:

            color = today_color

            rate = hp_rates[color]

            kwh_hp += kwh

            cost_hp += (
                kwh * rate
            )

        # ----------------------------------------------------
        # HC : 22:00 -> 06:00
        # ----------------------------------------------------

        else:

            if hour < 6:
                color = previous_color
            else:
                color = today_color

            rate = hc_rates[color]

            kwh_hc += kwh

            cost_hc += (
                kwh * rate
            )

    cost_total = (
        cost_hp + cost_hc
    )

    return {
        "date": date_str,
        "color_today": today_color,
        "color_previous": previous_color,
        "kwh_hp": round(
            kwh_hp,
            3,
        ),
        "kwh_hc": round(
            kwh_hc,
            3,
        ),
        "cost_hp": round(
            cost_hp,
            4,
        ),
        "cost_hc": round(
            cost_hc,
            4,
        ),
        "cost_total": round(
            cost_total,
            4,
        ),
        "hours": len(rows),
    }


# ============================================================
# SAUVEGARDE DU RESULTAT
# ============================================================

def save_result(
    conn,
    result,
):
    calculated_at = datetime.now(
        TIMEZONE
    ).isoformat()

    conn.execute(
        """
        INSERT INTO tempo_costs (
            date,
            kwh_hp,
            kwh_hc,
            cost_hp,
            cost_hc,
            cost_total,
            calculated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(date) DO UPDATE SET
            kwh_hp = excluded.kwh_hp,
            kwh_hc = excluded.kwh_hc,
            cost_hp = excluded.cost_hp,
            cost_hc = excluded.cost_hc,
            cost_total = excluded.cost_total,
            calculated_at = excluded.calculated_at
        """,
        (
            result["date"],
            result["kwh_hp"],
            result["kwh_hc"],
            result["cost_hp"],
            result["cost_hc"],
            result["cost_total"],
            calculated_at,
        ),
    )

    conn.commit()


# ============================================================
# GENERATION DES MOIS
# ============================================================

def generate_month_ranges(
    start_date,
    end_date,
):
    current = date(
        start_date.year,
        start_date.month,
        1,
    )

    while current <= end_date:

        last_day = monthrange(
            current.year,
            current.month,
        )[1]

        month_start = current

        month_end = date(
            current.year,
            current.month,
            last_day,
        )

        if month_start < start_date:
            month_start = start_date

        if month_end > end_date:
            month_end = end_date

        yield (
            month_start,
            month_end,
        )

        if current.month == 12:

            current = date(
                current.year + 1,
                1,
                1,
            )

        else:

            current = date(
                current.year,
                current.month + 1,
                1,
            )


# ============================================================
# MAIN
# ============================================================

def main():

    print(
        "============================================================"
    )
    print(
        " IMPORT HISTORIQUE TEMPO + RECALCUL DES COUTS"
    )
    print(
        "============================================================"
    )
    print()

    print(
        f"Période Tempo : "
        f"{HISTORY_START.isoformat()} -> "
        f"{HISTORY_END.isoformat()}"
    )

    print(
        f"Base Tempo    : {TEMPO_DB}"
    )

    print(
        f"Base Home Assistant : {HA_DB}"
    )

    print()

    # --------------------------------------------------------
    # Vérifications
    # --------------------------------------------------------

    if not os.path.isfile(
        ENV_FILE
    ):
        raise RuntimeError(
            f"Fichier absent : {ENV_FILE}"
        )

    if not os.path.isfile(
        TEMPO_DB
    ):
        raise RuntimeError(
            f"Base absente : {TEMPO_DB}"
        )

    if not os.path.isfile(
        HA_DB
    ):
        raise RuntimeError(
            f"Base Home Assistant absente : {HA_DB}"
        )

    env = load_env()

    client_id = env.get(
        "RTE_CLIENT_ID"
    )

    client_secret = env.get(
        "RTE_CLIENT_SECRET"
    )

    if not client_id or not client_secret:
        raise RuntimeError(
            "RTE_CLIENT_ID ou "
            "RTE_CLIENT_SECRET absent"
        )

    # --------------------------------------------------------
    # Connexions
    # --------------------------------------------------------

    conn_ha = sqlite3.connect(
        f"file:{HA_DB}?mode=ro",
        uri=True,
    )

    conn_tempo = sqlite3.connect(
        TEMPO_DB
    )

    try:

        # ----------------------------------------------------
        # Sauvegarde
        # ----------------------------------------------------

        print(
            "Création d'une sauvegarde de tempo.db..."
        )

        backup_file = (
            backup_tempo_db()
        )

        print(
            f"Sauvegarde créée : {backup_file}"
        )

        print()

        # ----------------------------------------------------
        # Token RTE
        # ----------------------------------------------------

        print(
            "Obtention du token RTE..."
        )

        token = get_token(
            client_id,
            client_secret,
        )

        print(
            "Token RTE obtenu."
        )

        print()

        # ----------------------------------------------------
        # Historique Tempo
        # ----------------------------------------------------

        print(
            "============================================================"
        )
        print(
            " RÉCUPÉRATION DES COULEURS TEMPO"
        )
        print(
            "============================================================"
        )
        print()

        total_days = 0

        month_ranges = list(
            generate_month_ranges(
                HISTORY_START,
                HISTORY_END,
            )
        )

        for index, (
            month_start,
            month_end,
        ) in enumerate(
            month_ranges,
            start=1,
        ):

            print(
                f"[{index}/{len(month_ranges)}] "
                f"{month_start.isoformat()} -> "
                f"{month_end.isoformat()}"
            )

            data = get_tempo_month(
                token,
                month_start,
                month_end,
            )

            calendar = data.get(
                "tempo_like_calendars",
                {},
            )

            values = calendar.get(
                "values",
                [],
            )

            print(
                f"    {len(values)} jour(s) reçu(s)"
            )

            imported = import_tempo_days(
                conn_tempo,
                values,
            )

            print(
                f"    {imported} jour(s) enregistré(s)"
            )

            total_days += imported

        print()

        print(
            "Total de jours Tempo "
            "importés/mis à jour : "
            f"{total_days}"
        )

        print()

        # ----------------------------------------------------
        # Vérification couleurs
        # ----------------------------------------------------

        print(
            "============================================================"
        )
        print(
            " VÉRIFICATION DE tempo_days"
        )
        print(
            "============================================================"
        )
        print()

        row = conn_tempo.execute(
            """
            SELECT
                MIN(date),
                MAX(date),
                COUNT(*)
            FROM tempo_days
            WHERE date >= ?
              AND date <= ?
            """,
            (
                HISTORY_START.isoformat(),
                HISTORY_END.isoformat(),
            ),
        ).fetchone()

        print(
            f"Première date : {row[0]}"
        )

        print(
            f"Dernière date : {row[1]}"
        )

        print(
            f"Nombre de jours : {row[2]}"
        )

        print()

        # ----------------------------------------------------
        # Recherche des éventuels jours manquants
        # ----------------------------------------------------

        missing = []

        current_date = HISTORY_START

        while current_date <= HISTORY_END:

            date_str = (
                current_date.isoformat()
            )

            exists = conn_tempo.execute(
                """
                SELECT 1
                FROM tempo_days
                WHERE date = ?
                """,
                (date_str,),
            ).fetchone()

            if exists is None:
                missing.append(
                    date_str
                )

            current_date += timedelta(
                days=1
            )

        if missing:

            print(
                "Journées Tempo manquantes :"
            )

            for date_str in missing:
                print(
                    f"    {date_str}"
                )

            print()

            raise RuntimeError(
                f"{len(missing)} journée(s) Tempo "
                "sont encore manquantes."
            )

        print(
            "Toutes les journées Tempo "
            "de la période sont présentes."
        )

        print()

        # ----------------------------------------------------
        # Journées Linky complètes
        # ----------------------------------------------------

        print(
            "============================================================"
        )
        print(
            " RECALCUL DES COÛTS LINKY + TEMPO"
        )
        print(
            "============================================================"
        )
        print()

        all_dates = get_complete_dates(
            conn_ha
        )

        dates = [
            d
            for d in all_dates
            if HISTORY_START.isoformat()
            <= d
            <= HISTORY_END.isoformat()
        ]

        print(
            f"Journées Linky complètes trouvées : "
            f"{len(dates)}"
        )

        print()

        processed = 0
        skipped = 0

        for date_str in dates:

            try:

                result = calculate_day(
                    conn_ha,
                    conn_tempo,
                    date_str,
                )

                if result is None:

                    print(
                        f"{date_str} | "
                        f"IGNORÉ | "
                        f"journée incomplète"
                    )

                    skipped += 1

                    continue

                save_result(
                    conn_tempo,
                    result,
                )

                print(
                    f"{result['date']} | "
                    f"{result['color_today']} | "
                    f"HP {result['kwh_hp']:.3f} kWh / "
                    f"{result['cost_hp']:.4f} € | "
                    f"HC {result['kwh_hc']:.3f} kWh / "
                    f"{result['cost_hc']:.4f} € | "
                    f"TOTAL {result['cost_total']:.4f} €"
                )

                processed += 1

            except RuntimeError as e:

                print(
                    f"{date_str} | "
                    f"IGNORÉ | "
                    f"{e}"
                )

                skipped += 1

        print()

        print(
            "============================================================"
        )
        print(
            " TERMINÉ"
        )
        print(
            "============================================================"
        )
        print()

        print(
            f"Journées calculées : "
            f"{processed}"
        )

        print(
            f"Journées ignorées  : "
            f"{skipped}"
        )

        print()

        print(
            f"Sauvegarde disponible : "
            f"{backup_file}"
        )

        print()

    finally:

        conn_ha.close()

        conn_tempo.close()


if __name__ == "__main__":
    main()
