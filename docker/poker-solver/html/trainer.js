document.addEventListener('DOMContentLoaded', () => {
    let currentIdx = 0;
    let currentScenario = null;
    let streak = 0;
    const TRAINER_STATS_VERSION = 1;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const shuffledScenarios = (typeof scenarios !== 'undefined') ? shuffle([...scenarios]) : [];
    const uiSitText = document.getElementById('ui-sit-text');
    const uiPotText = document.getElementById('ui-pot-text');
    const uiVillainPos = document.getElementById('ui-villain-pos');
    const uiVillainActionType = document.getElementById('ui-villain-action-type');
    const uiVillainActionAmt = document.getElementById('ui-villain-action-amt');
    const uiHandHistory = document.getElementById('ui-hand-history');
    const uiHeroPos = document.getElementById('ui-hero-pos');
    const uiHeroStack = document.getElementById('ui-hero-stack');
    const uiHeroLegend = document.getElementById('ui-hero-legend');
    const uiDealer = document.getElementById('ui-dealer');
    const uiBoard = document.getElementById('ui-board');
    const uiHeroCards = document.getElementById('ui-hero-cards');
    const feedbackOverlay = document.getElementById('feedback-overlay');
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackText = document.getElementById('feedback-text');
    const streakCounter = document.getElementById('streak-counter');
    const btnCall = document.getElementById('btn-call');
    const btnCheck = document.getElementById('btn-check');
    const btnRaise = document.getElementById('btn-raise');
    const btnFold = document.getElementById('btn-fold');
    const btnNext = document.getElementById('btn-next');
    const btnStats = document.getElementById('btn-stats');
    const difficultyBadge = document.getElementById('difficulty-badge');
    const statsModal = document.getElementById('stats-modal');
    const statsClose = document.getElementById('stats-close');
    const statsSummary = document.getElementById('stats-summary');
    const statsStreet = document.getElementById('stats-street');
    const statsAction = document.getElementById('stats-action');
    const statsSpot = document.getElementById('stats-spot');
    const tableSeatNodes = Array.from(document.querySelectorAll('.node-seat'));
    const tablePositionOrder = ['UTG', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

    function getAuthUserKey() {
        try {
            const raw = localStorage.getItem('pokerAuthUser');
            if (!raw) return 'guest';
            const parsed = JSON.parse(raw);
            return parsed.uid || parsed.email || 'guest';
        } catch (error) {
            return 'guest';
        }
    }

    function statsStorageKey() {
        return `trainerStats:v${TRAINER_STATS_VERSION}:${getAuthUserKey()}`;
    }

    function emptyStats() {
        return {
            total: 0,
            correct: 0,
            byStreet: {},
            byAction: {},
            bySpotType: {}
        };
    }

    function loadStats() {
        try {
            const raw = localStorage.getItem(statsStorageKey());
            if (!raw) return emptyStats();
            return { ...emptyStats(), ...JSON.parse(raw) };
        } catch (error) {
            return emptyStats();
        }
    }

    function saveStats(stats) {
        localStorage.setItem(statsStorageKey(), JSON.stringify(stats));
    }

    function ensureBucket(stats, group, label) {
        if (!stats[group][label]) {
            stats[group][label] = { total: 0, correct: 0 };
        }
    }

    function classifySpotType(villainAction) {
        const text = (villainAction || '').toUpperCase();
        if (text === 'CHECK') return 'Check adverse';
        if (text.includes('OVERBET')) return 'Overbet adverse';
        if (text.includes('SHOVE') || text.includes('ALL-IN')) return 'All-in adverse';
        return 'Mise standard adverse';
    }

    function pct(correct, total) {
        if (!total) return '0%';
        return `${((correct / total) * 100).toFixed(1)}%`;
    }

    function renderStatsList(container, dataset) {
        const entries = Object.entries(dataset).sort((a, b) => b[1].total - a[1].total);
        if (entries.length === 0) {
            container.innerHTML = '<div class="stats-row muted">Pas encore de donnees.</div>';
            return;
        }

        container.innerHTML = entries.map(([label, values]) => {
            return `<div class="stats-row"><span>${label}</span><span>${values.correct}/${values.total} (${pct(values.correct, values.total)})</span></div>`;
        }).join('');
    }

    function renderStats() {
        const stats = loadStats();
        statsSummary.textContent = `Reussite globale: ${pct(stats.correct, stats.total)} (${stats.correct}/${stats.total})`;
        renderStatsList(statsStreet, stats.byStreet);
        renderStatsList(statsAction, stats.byAction);
        renderStatsList(statsSpot, stats.bySpotType);
    }

    function updateStats(isCorrect, scenario) {
        const stats = loadStats();
        const street = scenario.street || 'Inconnu';
        const action = scenario.correctAction || 'Inconnu';
        const spotType = classifySpotType(scenario.villainAction);

        stats.total += 1;
        if (isCorrect) stats.correct += 1;

        ensureBucket(stats, 'byStreet', street);
        ensureBucket(stats, 'byAction', action);
        ensureBucket(stats, 'bySpotType', spotType);

        stats.byStreet[street].total += 1;
        stats.byAction[action].total += 1;
        stats.bySpotType[spotType].total += 1;

        if (isCorrect) {
            stats.byStreet[street].correct += 1;
            stats.byAction[action].correct += 1;
            stats.bySpotType[spotType].correct += 1;
        }

        saveStats(stats);
    }

    function getSuitClass(suit) {
        if (suit === '♥') return 's-h';
        if (suit === '♦') return 's-d';
        if (suit === '♣') return 's-c';
        if (suit === '♠') return 's-s';
        return '';
    }

    function createCardHTML(cardData, sizeClass) {
        return `
            <div class="card ${sizeClass} ${getSuitClass(cardData.s)}">
                <span class="suit-mini">${cardData.s}</span>
                <span class="rank">${cardData.r}</span>
            </div>
        `;
    }

    function setActionButtonState(button, isAvailable, label) {
        button.classList.toggle('is-disabled', !isAvailable);
        button.disabled = !isAvailable;
        button.setAttribute('aria-disabled', String(!isAvailable));
        button.textContent = label;
    }

    function formatCards(cards) {
        if (!cards || cards.length === 0) return 'Preflop';
        return cards.map((card) => `${card.r}${card.s}`).join(' ');
    }

    function getStreetIndex(street) {
        const order = ['PRE-FLOP', 'FLOP', 'TURN', 'RIVER'];
        return order.indexOf((street || '').toUpperCase());
    }

    function buildScenarioPlayersMap(scenario) {
        const playersByPos = new Map();

        if (Array.isArray(scenario.players) && scenario.players.length > 0) {
            for (const player of scenario.players) {
                playersByPos.set(player.pos, player);
            }
            return playersByPos;
        }

        for (const pos of tablePositionOrder) {
            playersByPos.set(pos, { pos, inHand: false, role: 'other', stack: null });
        }

        playersByPos.set(scenario.heroPos, {
            pos: scenario.heroPos,
            inHand: true,
            role: 'hero',
            stack: scenario.heroStack
        });

        playersByPos.set(scenario.villainPos, {
            pos: scenario.villainPos,
            inHand: true,
            role: 'villain',
            stack: scenario.villainStack
        });

        return playersByPos;
    }

    function renderTableSeats(scenario) {
        if (tableSeatNodes.length === 0) return;

        const playersByPos = buildScenarioPlayersMap(scenario);
        const nonHeroPositions = tablePositionOrder
            .filter((pos) => pos !== scenario.heroPos)
            .slice(0, tableSeatNodes.length);

        tableSeatNodes.forEach((seat, idx) => {
            const seatPos = nonHeroPositions[idx] || tablePositionOrder[idx];
            const player = playersByPos.get(seatPos) || { inHand: false };
            const isInHand = Boolean(player.inHand);

            const posEl = seat.querySelector('.node-pos');
            const statusEl = seat.querySelector('.node-status');
            if (posEl) posEl.textContent = seatPos;
            if (statusEl) statusEl.textContent = isInHand ? 'IN' : 'FOLD';

            seat.classList.toggle('node-in', isInHand);
            seat.classList.toggle('node-fold', !isInHand);
            seat.classList.toggle('node-villain', seatPos === scenario.villainPos);
        });
    }

    function renderHandHistory(scenario) {
        const streetOrder = ['PRE-FLOP', 'FLOP', 'TURN', 'RIVER'];
        const labels = {
            'PRE-FLOP': 'Preflop',
            FLOP: 'Flop',
            TURN: 'Turn',
            RIVER: 'River'
        };

        const currentStreetIndex = getStreetIndex(scenario.street);

        const chips = streetOrder.map((street, idx) => {
            let status = 'A venir';
            let levelClass = 'future';

            if (idx < currentStreetIndex) {
                status = 'Action precedente';
                levelClass = 'past';
            } else if (idx === currentStreetIndex) {
                status = `Vilain: ${scenario.villainAction}`;
                levelClass = 'current';
            }

            return `<span class="history-chip ${levelClass}"><strong>${labels[street]}</strong> - ${status}</span>`;
        }).join('');

        uiHandHistory.innerHTML = chips;
    }

    function getDecisionHint(correctAction) {
        if (correctAction === 'Fold') {
            return 'Quand la mise adverse est tres polarisee et que ta main ne bloque rien de fort, fold est souvent la meilleure discipline.';
        }
        if (correctAction === 'Call') {
            return 'Call garde les bluffs adverses dans le coup et evite de t isoler contre une range trop forte.';
        }
        if (correctAction === 'Check') {
            return 'Check sert a controler la taille du pot quand ta value est moyenne ou que le board favorise la range adverse.';
        }
        return 'Raise sert a prendre de la value ou a faire folder mieux via la pression. Cherche toujours la raison principale avant de cliquer.';
    }

    function parseNumeric(value) {
        const match = String(value || '').match(/[0-9]+(?:\.[0-9]+)?/);
        return match ? Number(match[0]) : null;
    }

    function computeDifficulty(scenario) {
        let score = 0;
        const street = (scenario.street || '').toUpperCase();
        const villainAction = (scenario.villainAction || '').toUpperCase();
        const correctAction = (scenario.correctAction || '').toUpperCase();
        const heroStack = parseNumeric(scenario.heroStack);
        const villainStack = parseNumeric(scenario.villainStack);

        if (street === 'TURN') score += 1;
        if (street === 'RIVER') score += 2;

        if (villainAction === 'CHECK') score += 0;
        else if (villainAction.includes('OVERBET')) score += 3;
        else if (villainAction.includes('SHOVE') || villainAction.includes('ALL-IN')) score += 3;
        else score += 1;

        if (correctAction === 'FOLD' || correctAction === 'RAISE') score += 1;

        if (heroStack !== null && heroStack <= 25) score += 1;
        if (villainStack !== null && villainStack <= 25) score += 1;

        if (score <= 2) return { label: 'Facile', className: 'difficulty-easy' };
        if (score <= 4) return { label: 'Moyen', className: 'difficulty-medium' };
        if (score <= 6) return { label: 'Difficile', className: 'difficulty-hard' };
        return { label: 'Expert', className: 'difficulty-expert' };
    }

    function getDifficultyFromScenario(scenario) {
        const mapped = {
            FACILE: { label: 'Facile', className: 'difficulty-easy' },
            MOYEN: { label: 'Moyen', className: 'difficulty-medium' },
            DIFFICILE: { label: 'Difficile', className: 'difficulty-hard' },
            EXPERT: { label: 'Expert', className: 'difficulty-expert' }
        };
        const raw = String(scenario?.difficulty || '').trim().toUpperCase();
        return mapped[raw] || null;
    }

    function updateDifficultyBadge(scenario) {
        const difficulty = getDifficultyFromScenario(scenario) || computeDifficulty(scenario);
        difficultyBadge.textContent = `Difficulte: ${difficulty.label}`;
        difficultyBadge.classList.remove('difficulty-easy', 'difficulty-medium', 'difficulty-hard', 'difficulty-expert');
        difficultyBadge.classList.add(difficulty.className);
    }

    function buildDetailedExplanation(selectedAction, isCorrect) {
        const selectedLabel = selectedAction.toUpperCase();
        const correctLabel = currentScenario.correctAction.toUpperCase();
        const boardText = formatCards(currentScenario.board);
        const heroCardsText = formatCards(currentScenario.heroCards);
        const callOption = currentScenario.callAmount === '-' ? 'CHECK' : `CALL ${currentScenario.callAmount}`;
        const raiseOption = currentScenario.raiseAmount === '-' ? 'RAISE NON DISPONIBLE' : `RAISE ${currentScenario.raiseAmount}`;
        const comparison = isCorrect
            ? `Bonne decision: ${selectedLabel} etait bien l action optimale ici.`
            : `Tu as choisi ${selectedLabel}, mais la meilleure action etait ${correctLabel}.`;

        return `
            <div class="feedback-section"><strong>Situation:</strong> ${currentScenario.street} - ${currentScenario.heroPos} vs ${currentScenario.villainPos}, pot ${currentScenario.pot} BB.</div>
            <div class="feedback-section"><strong>Ta main:</strong> ${heroCardsText} | <strong>Board:</strong> ${boardText}</div>
            <div class="feedback-section"><strong>Action adverse:</strong> ${currentScenario.villainAction}</div>
            <div class="feedback-section"><strong>Options realistes:</strong> ${callOption} / ${raiseOption} / FOLD</div>
            <div class="feedback-section"><strong>Lecture du spot:</strong> ${comparison}</div>
            <div class="feedback-section"><strong>Pourquoi (theorie du scenario):</strong> ${currentScenario.explanation}</div>
            <div class="feedback-tip"><strong>Repere pratique:</strong> ${getDecisionHint(currentScenario.correctAction)}</div>
        `;
    }

    function loadNextScenario() {
        if (shuffledScenarios.length === 0) {
            uiSitText.textContent = 'Aucun scénario disponible.';
            uiPotText.textContent = '';
            setActionButtonState(btnCall, false, 'CALL');
            setActionButtonState(btnCheck, false, 'CHECK');
            setActionButtonState(btnRaise, false, 'RAISE');
            setActionButtonState(btnFold, false, 'FOLD');
            btnCall.classList.add('hidden');
            btnCheck.classList.add('hidden');
            return;
        }

        feedbackOverlay.style.display = 'none';
        currentScenario = shuffledScenarios[currentIdx];
        currentIdx = (currentIdx + 1) % shuffledScenarios.length;
        updateDifficultyBadge(currentScenario);
        renderHandHistory(currentScenario);
        renderTableSeats(currentScenario);

        const extraPlayers = Math.max(0, (currentScenario.activePlayersCount || 2) - 2);
        const multiwaySuffix = extraPlayers > 0 ? ` +${extraPlayers}` : '';
        uiSitText.textContent = `${currentScenario.heroPos} vs ${currentScenario.villainPos}${multiwaySuffix}, ${currentScenario.street}`;
        uiPotText.textContent = `POT: ${currentScenario.pot} BB`;
        uiVillainPos.textContent = currentScenario.villainPos;

        const villainAction = currentScenario.villainAction.toUpperCase();
        if (villainAction === 'CHECK') {
            uiVillainActionType.textContent = 'CHECK';
            uiVillainActionAmt.textContent = '';
        } else if (villainAction.includes('SHOVE') || villainAction.includes('ALL-IN')) {
            uiVillainActionType.textContent = 'ALL-IN';
            uiVillainActionAmt.textContent = currentScenario.villainAction;
        } else if (villainAction.includes('OVERBET')) {
            uiVillainActionType.textContent = 'OVERBET';
            uiVillainActionAmt.textContent = currentScenario.villainAction;
        } else {
            uiVillainActionType.textContent = 'BET';
            uiVillainActionAmt.textContent = currentScenario.villainAction;
        }

        uiHeroPos.textContent = currentScenario.heroPos;
        uiHeroPos.title = `Votre position : ${currentScenario.heroPos}`;
        uiHeroStack.textContent = `${currentScenario.heroStack}`;
        uiHeroLegend.textContent = `Vous jouez en ${currentScenario.heroPos} - Tapis: ${currentScenario.heroStack} blindes`;
        uiDealer.style.display = currentScenario.heroPos === 'BTN' ? 'flex' : 'none';

        uiBoard.innerHTML = currentScenario.board.map(c => createCardHTML(c, 'board')).join('');
        uiHeroCards.innerHTML = currentScenario.heroCards.map(c => createCardHTML(c, 'hero')).join('');

        setActionButtonState(btnFold, true, 'FOLD');

        if (currentScenario.callAmount === '-') {
            btnCall.classList.add('hidden');
            btnCheck.classList.remove('hidden');
            setActionButtonState(btnCheck, true, 'CHECK');
        } else {
            btnCall.classList.remove('hidden');
            btnCheck.classList.add('hidden');
            setActionButtonState(btnCall, true, `CALL ${currentScenario.callAmount}`);
        }

        if (currentScenario.raiseAmount === '-') {
            setActionButtonState(btnRaise, false, 'RAISE');
        } else {
            const raiseText = currentScenario.raiseAmount.toUpperCase();
            const label = raiseText.includes('ALL-IN') || raiseText.includes('SHOVE')
                ? `ALL-IN ${raiseText.split(' ')[0]}`
                : `RAISE ${currentScenario.raiseAmount}`;
            setActionButtonState(btnRaise, true, label);
        }
    }

    function checkAnswer(selectedAction) {
        if (!currentScenario) return;
        const isCorrect = selectedAction === currentScenario.correctAction;
        updateStats(isCorrect, currentScenario);
        feedbackContainer.className = isCorrect ? 'correct' : 'incorrect';
        feedbackTitle.textContent = isCorrect ? 'Bonne decision' : `A retravailler: ${currentScenario.correctAction.toUpperCase()}`;
        streak = isCorrect ? streak + 1 : 0;
        streakCounter.textContent = streak;
        feedbackText.innerHTML = buildDetailedExplanation(selectedAction, isCorrect);
        feedbackOverlay.style.display = 'flex';
    }

    btnRaise.addEventListener('click', () => checkAnswer('Raise'));
    btnFold.addEventListener('click', () => checkAnswer('Fold'));
    btnCall.addEventListener('click', () => checkAnswer('Call'));
    btnCheck.addEventListener('click', () => checkAnswer('Check'));
    btnNext.addEventListener('click', loadNextScenario);

    btnStats.addEventListener('click', () => {
        renderStats();
        statsModal.classList.remove('hidden');
        statsModal.setAttribute('aria-hidden', 'false');
    });

    statsClose.addEventListener('click', () => {
        statsModal.classList.add('hidden');
        statsModal.setAttribute('aria-hidden', 'true');
    });

    statsModal.addEventListener('click', (event) => {
        if (event.target === statsModal) {
            statsModal.classList.add('hidden');
            statsModal.setAttribute('aria-hidden', 'true');
        }
    });

    setTimeout(loadNextScenario, 100);
});