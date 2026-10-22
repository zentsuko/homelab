#!/usr/bin/env python3

import asyncio
import json
import os

import discord
from discord import app_commands


ARK_ROLE_ID = 1541143251044671668
ARK_ROLE_NAME = "ARK SURVIE"

VALHEIM_ROLE_ID = 1552988664592863232
VALHEIM_ROLE_NAME = "🥩・ Valheim"

ARK_START = "/usr/local/bin/ark-start"
ARK_START_TIMEOUT = 660

VALHEIM_START = "/usr/local/bin/valheim-start"
VALHEIM_START_TIMEOUT = 240
VALHEIM_CONTAINER = "valheim"

GUILD_ID = os.getenv("DISCORD_GUILD_ID")


class ArkCommandBot(discord.Client):
    def __init__(self):
        intents = discord.Intents.none()
        super().__init__(intents=intents)

        self.tree = app_commands.CommandTree(self)

        self.ark_start_lock = asyncio.Lock()
        self.valheim_start_lock = asyncio.Lock()

    async def setup_hook(self):
        if GUILD_ID:
            guild = discord.Object(id=int(GUILD_ID))

            self.tree.copy_global_to(guild=guild)
            await self.tree.sync(guild=guild)

            print(
                f"[COMMAND] Commandes synchronisees sur le serveur {GUILD_ID}",
                flush=True,
            )

            resolved_guild = await self.fetch_guild(int(GUILD_ID))
            roles = await resolved_guild.fetch_roles()

            print(
                f"[COMMAND] Roles serveur: "
                f"{[(role.id, role.name) for role in roles]}",
                flush=True,
            )

        else:
            await self.tree.sync()

            print(
                "[COMMAND] Commandes synchronisees globalement",
                flush=True,
            )

    async def on_ready(self):
        print(
            f"[COMMAND] Connecte en tant que {self.user}",
            flush=True,
        )


bot = ArkCommandBot()


async def has_required_role(
    interaction: discord.Interaction,
    role_id: int,
    role_name: str,
) -> bool:

    if interaction.guild is None:
        await interaction.response.send_message(
            "Cette commande doit etre utilisee sur le serveur Discord.",
            ephemeral=True,
        )
        return False

    try:
        member = await interaction.guild.fetch_member(
            interaction.user.id
        )

    except discord.HTTPException as error:
        print(
            f"[COMMAND] Recuperation du membre impossible: {error}",
            flush=True,
        )

        await interaction.response.send_message(
            "Impossible de verifier ton role Discord pour le moment.",
            ephemeral=True,
        )
        return False

    role_ids = {
        int(role_id_value)
        for role_id_value in getattr(member, "_roles", [])
    }

    if role_id not in role_ids:
        print(
            f"[COMMAND] Acces refuse pour {member}: "
            f"role requis={role_name} "
            f"({role_id}), "
            f"role_ids={sorted(role_ids)}",
            flush=True,
        )

        await interaction.response.send_message(
            f"Tu n'as pas le role requis ({role_name}).",
            ephemeral=True,
        )
        return False

    return True


async def run_command(
    command,
    timeout,
    success_message,
    failure_message,
    log_prefix,
):
    process = None

    try:
        process = await asyncio.create_subprocess_exec(
            command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.STDOUT,
        )

        output, _ = await asyncio.wait_for(
            process.communicate(),
            timeout=timeout,
        )

        decoded_output = output.decode(
            errors="replace"
        )

        if process.returncode == 0:
            print(
                f"{log_prefix} Commande terminee avec succes",
                flush=True,
            )

            print(
                decoded_output[-4000:],
                flush=True,
            )

            return success_message

        print(
            f"{log_prefix} Commande echouee:",
            flush=True,
        )

        print(
            decoded_output[-4000:],
            flush=True,
        )

        return failure_message

    except asyncio.TimeoutError:

        if process is not None:
            process.kill()
            await process.wait()

        print(
            f"{log_prefix} Timeout apres {timeout}s",
            flush=True,
        )

        return failure_message

    except Exception as error:

        print(
            f"{log_prefix} Erreur: {error}",
            flush=True,
        )

        return failure_message


async def get_valheim_docker_status():

    try:
        process = await asyncio.create_subprocess_exec(
            "docker",
            "inspect",
            "-f",
            "{{.State.Status}}",
            VALHEIM_CONTAINER,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        stdout, _ = await process.communicate()

        if process.returncode != 0:
            return None

        return stdout.decode(
            errors="replace"
        ).strip()

    except Exception as error:

        print(
            f"[VALHEIM] Impossible de lire l'etat Docker: {error}",
            flush=True,
        )

        return None


async def get_valheim_a2s():

    try:
        process = await asyncio.create_subprocess_exec(
            "docker",
            "exec",
            VALHEIM_CONTAINER,
            "/usr/local/bin/valheim-status",
            "--timeout-is-error",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        stdout, stderr = await process.communicate()

        if process.returncode != 0:
            return None

        return json.loads(
            stdout.decode(errors="replace")
        )

    except Exception as error:

        print(
            f"[VALHEIM] Impossible de lire le statut A2S: {error}",
            flush=True,
        )

        return None


# ============================================================
# ARK
# ============================================================

ark_group = app_commands.Group(
    name="ark",
    description="Commandes du serveur ARK",
)


@ark_group.command(
    name="start",
    description="Demarre le serveur ARK",
)
async def ark_start(interaction: discord.Interaction):

    if not await has_required_role(
        interaction,
        ARK_ROLE_ID,
        ARK_ROLE_NAME,
    ):
        return

    if bot.ark_start_lock.locked():
        await interaction.response.send_message(
            "Le serveur ARK est deja en cours de demarrage.",
            ephemeral=True,
        )
        return

    await interaction.response.send_message(
        "Demarrage du serveur ARK lance. "
        "Je te confirmerai le resultat ici.",
        ephemeral=True,
    )

    async with bot.ark_start_lock:

        message = await run_command(
            ARK_START,
            ARK_START_TIMEOUT,
            "Serveur ARK demarre et RCON est disponible.",
            "Le demarrage du serveur ARK a echoue. "
            "Consulte les logs du serveur.",
            "[ARK-COMMAND]",
        )

    try:
        await interaction.followup.send(
            message,
            ephemeral=True,
        )

    except discord.HTTPException as error:

        print(
            f"[ARK-COMMAND] Reponse Discord impossible: {error}",
            flush=True,
        )


# ============================================================
# VALHEIM
# ============================================================

valheim_group = app_commands.Group(
    name="valheim",
    description="Commandes du serveur Valheim",
)


@valheim_group.command(
    name="start",
    description="Demarre le serveur Valheim",
)
async def valheim_start(interaction: discord.Interaction):

    if not await has_required_role(
        interaction,
        VALHEIM_ROLE_ID,
        VALHEIM_ROLE_NAME,
    ):
        return

    if bot.valheim_start_lock.locked():
        await interaction.response.send_message(
            "Le serveur Valheim est deja en cours de demarrage.",
            ephemeral=True,
        )
        return

    await interaction.response.send_message(
        "Demarrage du serveur Valheim lance. "
        "Je te confirmerai quand il sera pret.",
        ephemeral=True,
    )

    async with bot.valheim_start_lock:

        message = await run_command(
            VALHEIM_START,
            VALHEIM_START_TIMEOUT,
            "Serveur Valheim demarre et est disponible.",
            "Le demarrage du serveur Valheim a echoue. "
            "Consulte les logs du serveur.",
            "[VALHEIM-COMMAND]",
        )

    try:
        await interaction.followup.send(
            message,
            ephemeral=True,
        )

    except discord.HTTPException as error:

        print(
            f"[VALHEIM-COMMAND] Reponse Discord impossible: {error}",
            flush=True,
        )


@valheim_group.command(
    name="status",
    description="Affiche le statut du serveur Valheim",
)
async def valheim_status(interaction: discord.Interaction):

    if not await has_required_role(
        interaction,
        VALHEIM_ROLE_ID,
        VALHEIM_ROLE_NAME,
    ):
        return

    await interaction.response.defer(
        ephemeral=True
    )

    docker_status = await get_valheim_docker_status()

    if docker_status != "running":
        await interaction.followup.send(
            "🔴 Serveur Valheim arrete.",
            ephemeral=True,
        )
        return

    data = await get_valheim_a2s()

    if data is None:
        await interaction.followup.send(
            "🟠 Serveur Valheim en demarrage "
            "ou temporairement indisponible.",
            ephemeral=True,
        )
        return

    player_count = data.get(
        "player_count",
        0,
    )

    server_name = data.get(
        "server_name",
        "Valheim",
    )

    await interaction.followup.send(
        f"🟢 **{server_name}**\n"
        f"Joueurs connectes : **{player_count}**\n"
        f"Port : **{data.get('port', 2456)}**",
        ephemeral=True,
    )


@valheim_group.command(
    name="players",
    description="Affiche les joueurs connectes sur Valheim",
)
async def valheim_players(interaction: discord.Interaction):

    if not await has_required_role(
        interaction,
        VALHEIM_ROLE_ID,
        VALHEIM_ROLE_NAME,
    ):
        return

    await interaction.response.defer(
        ephemeral=True
    )

    docker_status = await get_valheim_docker_status()

    if docker_status != "running":
        await interaction.followup.send(
            "🔴 Serveur Valheim arrete.",
            ephemeral=True,
        )
        return

    data = await get_valheim_a2s()

    if data is None:
        await interaction.followup.send(
            "🟠 Serveur Valheim indisponible "
            "ou encore en demarrage.",
            ephemeral=True,
        )
        return

    player_count = data.get(
        "player_count",
        0,
    )

    players = data.get(
        "players",
        [],
    )

    if player_count == 0:

        message = "🟢 Aucun joueur connecte."

    else:

        names = []

        for player in players:

            if isinstance(player, dict):
                name = player.get(
                    "name",
                    "Joueur inconnu",
                )
            else:
                name = str(player)

            names.append(name)

        if names:

            player_list = "\n".join(
                f"• {name}"
                for name in names
            )

        else:

            player_list = (
                "• Liste des joueurs indisponible"
            )

        message = (
            f"🟢 **{player_count} joueur(s) connecte(s)**\n"
            f"{player_list}"
        )

    await interaction.followup.send(
        message,
        ephemeral=True,
    )


bot.tree.add_command(ark_group)
bot.tree.add_command(valheim_group)


TOKEN = os.getenv("DISCORD_BOT_TOKEN")

if not TOKEN:
    raise SystemExit(
        "DISCORD_BOT_TOKEN est manquant"
    )


bot.run(TOKEN)
