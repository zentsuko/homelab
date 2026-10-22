#!/usr/bin/env python3

import sqlite3
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

HA_DB = "/home/nascle/docker/homeassistant/config/home-assistant_v2.db"
TEMPO_DB = "/opt/tempo-rte/tempo.db"

TIMEZONE = ZoneInfo("Europe/Paris")
LINKY_STATISTIC_ID = "linky:01144573079089"

# À partir de cette date, les données Linky sont horaires.
# Le calcul HP/HC devient donc réel.
REAL_HOURLY_FROM = "2026-09-15"


def get_tempo_color(conn, date_str):
    row = conn.execute(
        "SELECT color FROM tempo_days WHERE date = ?",
        (date_str,),
    ).fetchone()

    if row is None:
        raise RuntimeError(
            f"Couleur Tempo absente pour {date_str}"
        )

    return row[0]


def get_tempo_colors_for_real_day(conn, date_str):
    current_date = datetime.strptime(
        date_str, "%Y-%m-%d"
    ).date()

    previous_date = (
        current_date - timedelta(days=1)
    ).isoformat()

    today_color = get_tempo_color(conn, date_str)
    previous_color = get_tempo_color(conn, previous_date)

    return today_color, previous_color


def get_rate(conn, color, period):
    row = conn.execute(
        """
        SELECT price_eur_kwh
        FROM tempo_rates
        WHERE color = ?
          AND period = ?
        """,
        (color, period),
    ).fetchone()

    if row is None:
        raise RuntimeError(
            f"Tarif absent pour {color}/{period}"
        )

    return row[0]


def get_linky_rows(conn_ha, date_str):
    start = f"{date_str} 00:00:00"

    end = (
        datetime.strptime(date_str, "%Y-%m-%d").date()
        + timedelta(days=1)
    ).isoformat() + " 00:00:00"

    return conn_ha.execute(
        """
        SELECT
            datetime(start_ts, 'unixepoch', 'localtime') AS heure,
            state / 1000.0 AS kwh
        FROM statistics
        WHERE metadata_id = (
            SELECT id
            FROM statistics_meta
            WHERE statistic_id = ?
        )
        AND datetime(start_ts, 'unixepoch', 'localtime') >= ?
        AND datetime(start_ts, 'unixepoch', 'localtime') < ?
        ORDER BY start_ts
        """,
        (
            LINKY_STATISTIC_ID,
            start,
            end,
        ),
    ).fetchall()


def calculate_historical_day(conn_ha, conn_tempo, date_str):
    """
    Historique avant le 15/09/2026.

    Les données Linky historiques sont journalières :
    une seule mesure représente la consommation totale du jour.

    Approximation choisie :
      BLUE  -> 100 % HP
      WHITE -> 100 % HP
      RED   -> 100 % HC

    Important :
    seule la couleur du jour est nécessaire.
    """

    color = get_tempo_color(
        conn_tempo,
        date_str,
    )

    rows = get_linky_rows(
        conn_ha,
        date_str,
    )

    if len(rows) != 1:
        return None

    total_kwh = rows[0][1]

    if color in ("BLUE", "WHITE"):
        period = "HP"
    elif color == "RED":
        period = "HC"
    else:
        raise RuntimeError(
            f"Couleur Tempo inconnue pour {date_str}: {color}"
        )

    rate = get_rate(
        conn_tempo,
        color,
        period,
    )

    cost = total_kwh * rate

    if period == "HP":
        kwh_hp = total_kwh
        kwh_hc = 0.0
        cost_hp = cost
        cost_hc = 0.0
    else:
        kwh_hp = 0.0
        kwh_hc = total_kwh
        cost_hp = 0.0
        cost_hc = cost

    return {
        "date": date_str,
        "kwh_hp": round(kwh_hp, 3),
        "kwh_hc": round(kwh_hc, 3),
        "cost_hp": round(cost_hp, 4),
        "cost_hc": round(cost_hc, 4),
        "cost_total": round(cost, 4),
        "hours": 1,
        "mode": "ESTIME",
        "color": color,
    }


def calculate_real_day(conn_ha, conn_tempo, date_str):
    """
    À partir du 15/09/2026 :
    calcul réel HP / HC à partir des 24 mesures horaires.

    HP : 06:00 -> 22:00
    HC : 22:00 -> 06:00

    Pour 00:00 -> 05:59 :
        couleur du jour précédent

    Pour 22:00 -> 23:59 :
        couleur du jour
    """

    today_color, previous_color = get_tempo_colors_for_real_day(
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

    rows = get_linky_rows(
        conn_ha,
        date_str,
    )

    if len(rows) != 24:
        return None

    kwh_hp = 0.0
    kwh_hc = 0.0
    cost_hp = 0.0
    cost_hc = 0.0

    for heure, kwh in rows:
        hour = int(heure[11:13])

        if 6 <= hour < 22:
            color = today_color
            rate = hp_rates[color]

            kwh_hp += kwh
            cost_hp += kwh * rate

        else:
            if hour < 6:
                color = previous_color
            else:
                color = today_color

            rate = hc_rates[color]

            kwh_hc += kwh
            cost_hc += kwh * rate

    cost_total = cost_hp + cost_hc

    return {
        "date": date_str,
        "kwh_hp": round(kwh_hp, 3),
        "kwh_hc": round(kwh_hc, 3),
        "cost_hp": round(cost_hp, 4),
        "cost_hc": round(cost_hc, 4),
        "cost_total": round(cost_total, 4),
        "hours": len(rows),
        "mode": "REEL",
        "color": today_color,
    }


def save_result(conn, result):
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


def get_available_dates(conn_ha):
    rows = conn_ha.execute(
        """
        SELECT DISTINCT
            date(
                datetime(
                    start_ts,
                    'unixepoch',
                    'localtime'
                )
            ) AS jour
        FROM statistics
        WHERE metadata_id = (
            SELECT id
            FROM statistics_meta
            WHERE statistic_id = ?
        )
        ORDER BY jour
        """,
        (LINKY_STATISTIC_ID,),
    ).fetchall()

    return [
        row[0]
        for row in rows
    ]


def main():
    conn_ha = sqlite3.connect(
        f"file:{HA_DB}?mode=ro",
        uri=True,
    )

    conn_tempo = sqlite3.connect(
        TEMPO_DB
    )

    try:
        dates = get_available_dates(
            conn_ha
        )

        if not dates:
            print(
                "Aucune donnée Linky disponible"
            )
            return

        processed_estimated = 0
        processed_real = 0
        skipped = 0

        print("=" * 80)
        print("CALCUL DES COÛTS TEMPO")
        print("=" * 80)
        print(
            f"Historique estimé : avant {REAL_HOURLY_FROM}"
        )
        print(
            f"Calcul réel HP/HC  : à partir du {REAL_HOURLY_FROM}"
        )
        print(
            "Règle historique   : BLUE/WHITE = HP | RED = HC"
        )
        print("=" * 80)

        for date_str in dates:

            try:
                if date_str < REAL_HOURLY_FROM:

                    result = calculate_historical_day(
                        conn_ha,
                        conn_tempo,
                        date_str,
                    )

                    if result is None:
                        skipped += 1
                        continue

                    save_result(
                        conn_tempo,
                        result,
                    )

                    print(
                        f"{result['date']} | "
                        f"{result['color']} | "
                        f"ESTIME | "
                        f"HP {result['kwh_hp']:.3f} kWh / "
                        f"{result['cost_hp']:.4f} € | "
                        f"HC {result['kwh_hc']:.3f} kWh / "
                        f"{result['cost_hc']:.4f} € | "
                        f"TOTAL {result['cost_total']:.4f} €"
                    )

                    processed_estimated += 1

                else:

                    result = calculate_real_day(
                        conn_ha,
                        conn_tempo,
                        date_str,
                    )

                    if result is None:
                        skipped += 1
                        continue

                    save_result(
                        conn_tempo,
                        result,
                    )

                    print(
                        f"{result['date']} | "
                        f"{result['color']} | "
                        f"REEL | "
                        f"HP {result['kwh_hp']:.3f} kWh / "
                        f"{result['cost_hp']:.4f} € | "
                        f"HC {result['kwh_hc']:.3f} kWh / "
                        f"{result['cost_hc']:.4f} € | "
                        f"TOTAL {result['cost_total']:.4f} €"
                    )

                    processed_real += 1

            except RuntimeError as e:

                print(
                    f"{date_str} | "
                    f"IGNORE | "
                    f"{e}"
                )

                skipped += 1

        print("=" * 80)
        print(
            f"Journées estimées : {processed_estimated}"
        )
        print(
            f"Journées réelles   : {processed_real}"
        )
        print(
            f"Journées ignorées  : {skipped}"
        )
        print("=" * 80)

    finally:
        conn_ha.close()
        conn_tempo.close()


if __name__ == "__main__":
    main()
