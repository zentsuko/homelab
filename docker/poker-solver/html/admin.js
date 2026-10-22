(function adminPage() {
    const USER_REGISTRY_KEY = "pokerUsersRegistry";
    const STATS_PREFIX = "trainerStats:v";

    function readJSON(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return fallback;
            return JSON.parse(raw);
        } catch (error) {
            return fallback;
        }
    }

    function formatDate(value) {
        if (!value) return "-";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "-";
        return date.toLocaleString("fr-FR");
    }

    function rate(correct, total) {
        if (!total) return "0%";
        return `${((correct / total) * 100).toFixed(1)}%`;
    }

    function readStatsByUserKey() {
        const out = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key || !key.startsWith(STATS_PREFIX)) continue;

            const userKey = key.split(":").slice(2).join(":");
            const stats = readJSON(key, null);
            if (!stats) continue;

            out[userKey] = {
                total: Number(stats.total || 0),
                correct: Number(stats.correct || 0)
            };
        }
        return out;
    }

    function buildRows() {
        const registry = readJSON(USER_REGISTRY_KEY, {});
        const statsByKey = readStatsByUserKey();

        const rowsById = new Map();

        Object.values(registry).forEach((entry) => {
            const uid = entry.uid || "";
            const keyByUid = statsByKey[uid] || null;
            const keyByEmail = entry.email ? (statsByKey[entry.email] || null) : null;
            const stat = keyByUid || keyByEmail || { total: 0, correct: 0 };

            rowsById.set(uid || entry.email, {
                name: entry.displayName || "-",
                email: entry.email || "-",
                userKey: uid || entry.email || "-",
                logins: Number(entry.loginCount || 0),
                total: stat.total,
                correct: stat.correct,
                lastLoginAt: entry.lastLoginAt || "",
                lastSeenAt: entry.lastSeenAt || entry.createdAt || ""
            });
        });

        Object.entries(statsByKey).forEach(([userKey, stat]) => {
            if ([...rowsById.values()].some((row) => row.userKey === userKey)) return;
            rowsById.set(`stats:${userKey}`, {
                name: userKey === "guest" ? "Invite" : "-",
                email: "-",
                userKey,
                logins: 0,
                total: Number(stat.total || 0),
                correct: Number(stat.correct || 0),
                lastLoginAt: "",
                lastSeenAt: ""
            });
        });

        return [...rowsById.values()].sort((a, b) => {
            if (b.logins !== a.logins) return b.logins - a.logins;
            return b.total - a.total;
        });
    }

    function render() {
        const body = document.getElementById("admin-users-body");
        const usersKpi = document.getElementById("kpi-users");
        const withStatsKpi = document.getElementById("kpi-with-stats");
        const handsKpi = document.getElementById("kpi-hands");

        if (!body || !usersKpi || !withStatsKpi || !handsKpi) return;

        const rows = buildRows();
        const withStats = rows.filter((row) => row.total > 0).length;
        const totalHands = rows.reduce((sum, row) => sum + row.total, 0);

        usersKpi.textContent = String(rows.length);
        withStatsKpi.textContent = String(withStats);
        handsKpi.textContent = String(totalHands);

        if (rows.length === 0) {
            body.innerHTML = '<tr><td colspan="8" class="admin-empty">Aucune donnee utilisateur locale pour le moment.</td></tr>';
            return;
        }

        body.innerHTML = rows.map((row) => {
            return `
                <tr>
                    <td>${row.name}</td>
                    <td>${row.email}</td>
                    <td>${row.userKey}</td>
                    <td>${row.logins}</td>
                    <td>${row.correct}/${row.total}</td>
                    <td>${rate(row.correct, row.total)}</td>
                    <td>${formatDate(row.lastLoginAt)}</td>
                    <td>${formatDate(row.lastSeenAt)}</td>
                </tr>
            `;
        }).join("");
    }

    render();
})();
