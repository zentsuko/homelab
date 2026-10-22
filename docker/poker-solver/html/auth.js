import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const LOGIN_PAGE = "login.html";
const APP_HOME_PAGE = "index.html";
const ADMIN_PAGE = "admin.html";
const USER_REGISTRY_KEY = "pokerUsersRegistry";
const ADMIN_ALLOWED_EMAILS = Array.isArray(window.ADMIN_EMAILS)
    ? window.ADMIN_EMAILS.map((email) => String(email).trim().toLowerCase()).filter(Boolean)
    : [];

function pageName() {
    const path = window.location.pathname;
    const last = path.split("/").pop();
    return last || APP_HOME_PAGE;
}

function currentPathWithQuery() {
    const p = window.location.pathname.split("/").pop() || APP_HOME_PAGE;
    return `${p}${window.location.search || ""}`;
}

function hasFirebaseConfig(config) {
    if (!config) return false;
    const required = ["apiKey", "authDomain", "projectId", "appId"];
    return required.every((key) => typeof config[key] === "string" && config[key].trim() !== "");
}

function redirectToLogin(nextPath) {
    const next = encodeURIComponent(nextPath || APP_HOME_PAGE);
    window.location.href = `${LOGIN_PAGE}?next=${next}`;
}

function redirectAfterLogin() {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (!next || next === LOGIN_PAGE) {
        window.location.href = APP_HOME_PAGE;
        return;
    }
    window.location.href = next;
}

function readUserRegistry() {
    try {
        const raw = localStorage.getItem(USER_REGISTRY_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
        return {};
    }
}

function saveUserRegistry(registry) {
    localStorage.setItem(USER_REGISTRY_KEY, JSON.stringify(registry));
}

function saveCurrentUserIdentity(user) {
    if (!user) return;
    const payload = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || ""
    };
    localStorage.setItem("pokerAuthUser", JSON.stringify(payload));
}

function updateRegistryUser(user, incrementLoginCount) {
    if (!user) return;
    const registry = readUserRegistry();
    const uid = user.uid;
    const now = new Date().toISOString();
    const existing = registry[uid] || {
        uid,
        email: user.email || "",
        displayName: user.displayName || "",
        createdAt: now,
        firstSeenAt: now,
        loginCount: 0
    };

    existing.email = user.email || existing.email || "";
    existing.displayName = user.displayName || existing.displayName || "";
    existing.lastSeenAt = now;
    if (incrementLoginCount) {
        existing.loginCount = Number(existing.loginCount || 0) + 1;
        existing.lastLoginAt = now;
    }

    registry[uid] = existing;
    saveUserRegistry(registry);
}

function canAccessAdmin(user) {
    if (!user || !user.email) return false;
    if (ADMIN_ALLOWED_EMAILS.length === 0) return true;
    return ADMIN_ALLOWED_EMAILS.includes(String(user.email).toLowerCase());
}

function injectAuthShell() {
    const shell = document.createElement("div");
    shell.className = "auth-shell";
    shell.innerHTML = `
        <button class="auth-mini-btn" id="auth-mini-btn" aria-label="Compte" aria-expanded="false">●</button>
        <div class="auth-panel" id="auth-panel" aria-hidden="true">
            <div class="auth-status" id="auth-status">Connexion...</div>
            <div class="auth-actions">
                <button class="auth-btn auth-logout" id="auth-logout-btn">Deconnexion</button>
            </div>
        </div>
    `;
    document.body.appendChild(shell);

    return {
        shell,
        miniBtn: shell.querySelector("#auth-mini-btn"),
        panel: shell.querySelector("#auth-panel"),
        status: shell.querySelector("#auth-status"),
        logoutBtn: shell.querySelector("#auth-logout-btn")
    };
}

function initLoginPage(auth) {
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const emailBtn = document.getElementById("login-email-btn");
    const signupBtn = document.getElementById("signup-email-btn");
    const message = document.getElementById("login-message");

    if (!emailInput || !passwordInput || !emailBtn || !signupBtn || !message) {
        return;
    }

    emailBtn.addEventListener("click", async () => {
        message.textContent = "";
        try {
            await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
            saveCurrentUserIdentity(auth.currentUser);
            updateRegistryUser(auth.currentUser, true);
        } catch (error) {
            message.textContent = "Connexion impossible. Verifie ton email et ton mot de passe.";
        }
    });

    signupBtn.addEventListener("click", async () => {
        message.textContent = "";
        try {
            await createUserWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
            saveCurrentUserIdentity(auth.currentUser);
            updateRegistryUser(auth.currentUser, true);
        } catch (error) {
            message.textContent = "Creation impossible. Mot de passe minimum: 6 caracteres.";
        }
    });
}

(function bootstrapAuth() {
    const config = window.FIREBASE_CONFIG;
    const current = pageName();
    const isLoginPage = current === LOGIN_PAGE;

    if (!hasFirebaseConfig(config)) {
        if (isLoginPage) {
            const msg = document.getElementById("login-message");
            if (msg) {
                msg.textContent = "Auth non configuree. Complete html/auth-config.js.";
            }
        }
        return;
    }

    const app = initializeApp(config);
    const auth = getAuth(app);

    if (isLoginPage) {
        initLoginPage(auth);
        onAuthStateChanged(auth, (user) => {
            if (user) {
                redirectAfterLogin();
            }
        });
        return;
    }

    const ui = injectAuthShell();

    const closePanel = () => {
        ui.shell.classList.remove("open");
        ui.miniBtn.setAttribute("aria-expanded", "false");
        ui.panel.setAttribute("aria-hidden", "true");
    };

    const openPanel = () => {
        ui.shell.classList.add("open");
        ui.miniBtn.setAttribute("aria-expanded", "true");
        ui.panel.setAttribute("aria-hidden", "false");
    };

    ui.miniBtn.addEventListener("click", () => {
        if (ui.shell.classList.contains("open")) {
            closePanel();
            return;
        }
        openPanel();
    });

    document.addEventListener("click", (event) => {
        if (!ui.shell.contains(event.target)) {
            closePanel();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closePanel();
        }
    });

    ui.logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        localStorage.removeItem("pokerAuthUser");
        redirectToLogin(APP_HOME_PAGE);
    });

    onAuthStateChanged(auth, (user) => {
        if (!user) {
            localStorage.removeItem("pokerAuthUser");
            redirectToLogin(currentPathWithQuery());
            return;
        }

        saveCurrentUserIdentity(user);
        updateRegistryUser(user, false);

        if (current === ADMIN_PAGE && !canAccessAdmin(user)) {
            window.location.href = APP_HOME_PAGE;
            return;
        }

        const display = user.displayName || user.email || "Connecte";
        ui.status.textContent = `Connecte: ${display}`;
    });
})();
