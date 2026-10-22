# Poker Solver

Un mini site statique pour l'entraînement poker.

## Contenu
- `html/login.html` : ecran de connexion (Google ou email/mot de passe).
- `html/index.html` : page d'accueil avec navigation vers les différents outils.
- `html/solver-basique.html` : visualisation de ranges preflop selon position, tapis et situation.
- `html/solver-avance.html` : outil avancé d'aide postflop avec catégories de main et conseils.
- `html/trainer.html` : mode interactif avec scénarios poker et correction immédiate.
- `html/lexique.html` : lexique des termes de poker.
- `html/scenarios.js` : données de scénarios pour le mode trainer.
- `html/styles.css` : styles partagés.
- `html/solver-basique.js` : script du solver basique.
- `html/solver-avance.js` : script du solver avancé.
- `html/trainer.js` : script du mode trainer.

## Lancement

### Avec Docker Compose

```bash
cd /home/nascle/poker-solver
docker compose up -d
```

Ensuite, ouvre `http://localhost:8087`.

Le flux est maintenant:
1. Arrivee sur l'ecran de connexion
2. Authentification
3. Redirection vers l'accueil de l'application

### Sans Docker

Tu peux aussi ouvrir directement `html/login.html` dans un navigateur, mais l'authentification Firebase fonctionne correctement seulement via HTTP.

## Authentification (Google + Email/Mot de passe)

L'application inclut un systeme d'authentification Firebase:
- Connexion Google
- Connexion Email / Mot de passe
- Protection de toutes les pages de l'application (incluant l'accueil)

### 1. Creer un projet Firebase

1. Va dans Firebase Console.
2. Cree un projet puis une application Web.
3. Active Authentication:
	- Google
	- Email/Password

### 2. Renseigner la configuration

Edite `html/auth-config.js` et remplis:
- `apiKey`
- `authDomain`
- `projectId`
- `appId`

### 3. Lancer en HTTP (important)

Pour l'authentification, il faut servir l'app via un serveur HTTP (Docker ou autre). L'ouverture directe en `file://` n'est pas adaptee aux modules Firebase.

## Améliorations apportées
- Extraction du CSS partagé dans `html/styles.css`.
- Séparation des scripts JavaScript pour chaque page dans `html/*.js`.
- Meilleure structure HTML et suppression des scripts / styles inline.
- Amélioration de l'accessibilité et de la maintenance.
- Ajout d'un guide rapide de lancement.
