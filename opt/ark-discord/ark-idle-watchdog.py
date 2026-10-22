#!/usr/bin/env python3

import os
import re
import socket
import struct
import subprocess
import time


CONTAINER = "ark-server"
ARK_STOP = "/usr/local/bin/ark-stop"
RCON_HOST = "127.0.0.1"
RCON_PORT = 27020
POLL_INTERVAL = 30
IDLE_LIMIT = 600


def packet(request_id, packet_type, body):
    payload = struct.pack("<ii", request_id, packet_type)
    payload += body.encode("utf-8") + b"\x00\x00"
    return struct.pack("<i", len(payload)) + payload


def receive_packet(sock):
    header = sock.recv(4)
    if len(header) != 4:
        raise ConnectionError("RCON: header incomplete")
    size = struct.unpack("<i", header)[0]
    if size < 10 or size > 1024 * 1024:
        raise ValueError("RCON: invalid packet size")
    payload = b""
    while len(payload) < size:
        chunk = sock.recv(size - len(payload))
        if not chunk:
            raise ConnectionError("RCON: connection closed")
        payload += chunk
    return struct.unpack("<ii", payload[:8]), payload[8:-2].decode("utf-8", errors="replace")


def list_players():
    password = os.environ["ARK_RCON_PASSWORD"]
    with socket.create_connection((RCON_HOST, RCON_PORT), timeout=5) as sock:
        sock.settimeout(5)
        sock.sendall(packet(1, 3, password))
        auth, _ = receive_packet(sock)
        if auth[0] == -1:
            raise PermissionError("RCON: authentication refused")
        sock.sendall(packet(2, 2, "ListPlayers"))
        response, body = receive_packet(sock)
        if response[0] != 2:
            raise ConnectionError("RCON: unexpected response")
        return body


def ark_is_running():
    result = subprocess.run(
        ["docker", "inspect", CONTAINER, "--format", "{{.State.Status}}"],
        capture_output=True,
        text=True,
        timeout=5,
    )
    return result.returncode == 0 and result.stdout.strip() == "running"


def stop_ark():
    print("[ARK-WATCHDOG] 10 minutes sans joueur: arret ARK", flush=True)
    result = subprocess.run([ARK_STOP], capture_output=True, text=True, timeout=900)
    if result.returncode != 0:
        print(result.stdout[-4000:], flush=True)
        print(result.stderr[-4000:], flush=True)
        raise RuntimeError(f"ark-stop exit code {result.returncode}")


def main():
    idle_since = None
    print("[ARK-WATCHDOG] Surveillance demarree", flush=True)

    while True:
        try:
            if not ark_is_running():
                idle_since = None
                time.sleep(POLL_INTERVAL)
                continue

            output = list_players()
            players = [
                line for line in output.splitlines()
                if re.match(r"^\s*\d+\.\s*.+?,\s*\d{5,}\s*$", line)
            ]

            if players:
                if idle_since is not None:
                    print("[ARK-WATCHDOG] Joueur detecte: compteur remis a zero", flush=True)
                idle_since = None
            else:
                if idle_since is None:
                    idle_since = time.monotonic()
                    print("[ARK-WATCHDOG] 0 joueur: compteur demarre", flush=True)
                elif time.monotonic() - idle_since >= IDLE_LIMIT:
                    stop_ark()
                    idle_since = None

        except Exception as error:
            idle_since = None
            print(f"[ARK-WATCHDOG] Verification impossible: {error}", flush=True)

        time.sleep(POLL_INTERVAL)


if __name__ == "__main__":
    main()
