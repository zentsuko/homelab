#!/bin/bash

set -u

CONTAINER="valheim"

IDLE_TIMEOUT=600
CHECK_INTERVAL=30

BACKUP_TIMEOUT=180

EVENT_LOG="/srv/docker/valheim/discord/valheim-events.log"

idle_since=0
last_player_count=""

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

event() {
    local message="$1"

    printf '%s|%s\n' \
        "$(date '+%Y-%m-%d %H:%M:%S')" \
        "$message" >> "$EVENT_LOG"
}

get_player_count() {
    docker exec "$CONTAINER" \
        /usr/local/bin/valheim-status --timeout-is-error 2>/dev/null |
        awk -F': ' '/"player_count"/ {
            gsub(/,/, "", $2)
            print $2
            exit
        }'
}

get_latest_backup() {
    docker exec "$CONTAINER" sh -c '
        find /config/backups \
            -maxdepth 1 \
            -type f \
            -name "worlds-*.zip" \
            -printf "%T@ %p\n" 2>/dev/null |
        sort -nr |
        head -1
    '
}

is_container_running() {
    docker inspect -f '{{.State.Running}}' "$CONTAINER" 2>/dev/null
}

perform_backup_and_stop() {
    log "10 minutes sans joueur : dernière vérification avant arrêt"

    event "⏱️ 10 minutes sans joueur : dernière vérification avant arrêt"

    local final_player_count
    final_player_count="$(get_player_count)"

    if ! [[ "$final_player_count" =~ ^[0-9]+$ ]]; then
        log "ERREUR : impossible de vérifier les joueurs avant arrêt"
        log "Aucun arrêt effectué par sécurité"

        event "⚠️ Impossible de vérifier les joueurs avant arrêt : arrêt annulé"

        return 1
    fi

    if [ "$final_player_count" -gt 0 ]; then
        log "Un joueur est revenu ($final_player_count) → annulation de l'arrêt"

        event "🟢 Joueur revenu ($final_player_count) → arrêt automatique annulé"

        return 0
    fi

    log "Confirmation : 0 joueur"

    event "💤 Confirmation : 0 joueur"

    if [ "$(is_container_running)" != "true" ]; then
        log "Le conteneur $CONTAINER n'est déjà plus en fonctionnement"
        return 0
    fi

    log "Recherche du dernier backup avant déclenchement"

    local previous_backup
    previous_backup="$(get_latest_backup)"

    log "Déclenchement du backup natif Valheim"

    event "💾 Backup automatique avant arrêt lancé"

    local backup_pid
    backup_pid="$(
        docker exec "$CONTAINER" sh -c \
            'pgrep -f "^/bin/bash /usr/local/bin/valheim-backup$" | head -1' \
            2>/dev/null
    )"

    if ! [[ "$backup_pid" =~ ^[0-9]+$ ]]; then
        log "ERREUR : processus valheim-backup introuvable"
        log "Aucun arrêt effectué par sécurité"

        event "❌ Processus de backup introuvable : arrêt annulé"

        return 1
    fi

    log "Envoi de SIGHUP au processus backup PID $backup_pid"

    if ! docker exec "$CONTAINER" kill -HUP "$backup_pid"; then
        log "ERREUR : impossible d'envoyer SIGHUP au backup"
        log "Aucun arrêt effectué par sécurité"

        event "❌ Impossible de déclencher le backup : arrêt annulé"

        return 1
    fi

    log "Attente de la création du nouveau backup ZIP (maximum ${BACKUP_TIMEOUT}s)"

    local elapsed=0
    local new_backup=""

    while [ "$elapsed" -lt "$BACKUP_TIMEOUT" ]; do
        sleep 5
        elapsed=$((elapsed + 5))

        new_backup="$(get_latest_backup)"

        if [ -n "$new_backup" ] && [ "$new_backup" != "$previous_backup" ]; then
            log "Nouveau backup détecté : ${new_backup#* }"
            break
        fi

        log "Backup en cours... ${elapsed}/${BACKUP_TIMEOUT}s"
    done

    if [ -z "$new_backup" ] || [ "$new_backup" = "$previous_backup" ]; then
        log "ERREUR : aucun nouveau backup détecté après ${BACKUP_TIMEOUT}s"
        log "Aucun arrêt effectué par sécurité"

        event "❌ Backup non détecté après ${BACKUP_TIMEOUT}s : arrêt annulé"

        return 1
    fi

    log "Backup terminé avec succès"

    event "✅ Backup terminé avec succès"

    final_player_count="$(get_player_count)"

    if ! [[ "$final_player_count" =~ ^[0-9]+$ ]]; then
        log "ERREUR : impossible de vérifier les joueurs avant docker stop"
        log "Aucun arrêt effectué par sécurité"

        event "⚠️ Vérification des joueurs impossible avant arrêt : arrêt annulé"

        return 1
    fi

    if [ "$final_player_count" -gt 0 ]; then
        log "Un joueur est revenu pendant le backup ($final_player_count)"
        log "Annulation de l'arrêt : le serveur reste en ligne"

        event "🟢 Joueur revenu pendant le backup ($final_player_count) → serveur maintenu en ligne"

        return 0
    fi

    log "Toujours 0 joueur"
    log "Arrêt propre du conteneur $CONTAINER"

    event "🛑 Arrêt automatique du serveur Valheim"

    if docker stop -t 120 "$CONTAINER"; then
        log "Serveur Valheim arrêté proprement"

        event "🔴 Serveur Valheim arrêté proprement"

        return 0
    else
        log "ERREUR : docker stop a échoué"

        event "❌ Échec de l'arrêt du serveur Valheim"

        return 1
    fi
}

log "=============================================="
log "Valheim idle monitor démarré"
log "Conteneur       : $CONTAINER"
log "Timeout inactif : ${IDLE_TIMEOUT}s"
log "Intervalle      : ${CHECK_INTERVAL}s"
log "Timeout backup  : ${BACKUP_TIMEOUT}s"
log "=============================================="

while true; do

    if [ "$(is_container_running)" != "true" ]; then

        if [ "$idle_since" -ne 0 ]; then
            log "Conteneur $CONTAINER arrêté → timer réinitialisé"
            idle_since=0
        fi

        sleep "$CHECK_INTERVAL"
        continue
    fi

    PLAYER_COUNT="$(get_player_count)"

    if [[ "$PLAYER_COUNT" =~ ^[0-9]+$ ]]; then

        if [ "$PLAYER_COUNT" -gt 0 ]; then

            if [[ "$last_player_count" =~ ^[0-9]+$ ]] && [ "$last_player_count" -eq 0 ]; then
                event "🟢 Joueur connecté ($PLAYER_COUNT joueur(s))"
            fi

            if [ "$idle_since" -ne 0 ]; then
                log "Joueur(s) détecté(s) : $PLAYER_COUNT → annulation du timer"
                event "🟢 Timer d'arrêt annulé : joueur(s) connecté(s)"
            fi

            idle_since=0

            log "Joueurs connectés : $PLAYER_COUNT"

        else

            if [[ "$last_player_count" =~ ^[0-9]+$ ]] && [ "$last_player_count" -gt 0 ]; then
                event "👋 Tous les joueurs ont quitté le serveur"
            fi

            if [ "$idle_since" -eq 0 ]; then
                idle_since="$(date +%s)"

                log "Aucun joueur → démarrage du timer de 10 minutes"

                event "🌙 Aucun joueur → timer d'arrêt de 10 minutes démarré"

            else
                now="$(date +%s)"
                idle_duration=$((now - idle_since))
                remaining=$((IDLE_TIMEOUT - idle_duration))

                if [ "$remaining" -lt 0 ]; then
                    remaining=0
                fi

                log "Aucun joueur depuis ${idle_duration}s → arrêt dans ${remaining}s"

                if [ "$idle_duration" -ge "$IDLE_TIMEOUT" ]; then

                    if perform_backup_and_stop; then
                        if [ "$(is_container_running)" != "true" ]; then
                            idle_since=0
                        fi
                    fi

                    if [ "$(is_container_running)" != "true" ]; then
                        idle_since=0
                    fi
                fi
            fi
        fi

        last_player_count="$PLAYER_COUNT"

    else
        log "Impossible de déterminer le nombre de joueurs → timer annulé par sécurité"

        event "⚠️ Impossible de déterminer le nombre de joueurs → timer annulé par sécurité"

        idle_since=0
        last_player_count=""
    fi

    sleep "$CHECK_INTERVAL"

done
