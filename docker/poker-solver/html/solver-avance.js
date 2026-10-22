document.addEventListener('DOMContentLoaded', () => {
    const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    const grid = document.getElementById('poker-grid');
    const posSelect = document.getElementById('position-select');
    const streetSelect = document.getElementById('street-select');
    const stackSelect = document.getElementById('stack-select');
    const scenariosSection = document.getElementById('scenarios-section');
    const scenarioCards = document.getElementById('scenario-cards');
    const advicePanel = document.getElementById('advice-panel');
    const handTitle = document.getElementById('selected-hand-title');

    let activeHandId = null;
    let currentActiveScenario = null;
    let currentActiveCard = null;

    const advNuts = {
        DEEP: {
            FLOP: {
                IP: "<strong>🎯 Objectif : Value Maximale.</strong> Tu parles en dernier avec le jeu max.<br><span class='aura-agressive'>🔥 Aura Agressive :</span> S'il a checké, fais un gros C-Bet (75%+). S'il a misé, relance fort. Bâtis un pot géant.<br><span class='aura-passive'>🛡️ Aura Passive :</span> S'il a checké, Check Back (Slowplay) pour le laisser toucher une carte à la Turn.",
                OOP: "<strong>🎯 Objectif : Piéger ou Bâtir.</strong> Tu parles en premier.<br><span class='aura-agressive'>🔥 Aura Agressive :</span> Prends l'initiative direct en misant (Donk bet/Lead) pour être sûr de faire grossir le pot, ou Check pour le laisser miser et le détruire avec un Check-Raise massif.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check, et s'il mise, contente-toi de payer (Check-Call) pour le garder en confiance."
            },
            TURN: {
                IP: "<strong>🎯 Accélération.</strong> Tu as toujours la position.<br><span class='aura-agressive'>🔥 Aura Agressive :</span> S'il check, 2-Barrel très gras (Overbet possible). Fais payer tous les tirages.<br><span class='aura-passive'>🛡️ Aura Passive :</span> S'il donk bet, fais juste Call. S'il check, bet 1/3 pot pour induire une relance.",
                OOP: "<strong>🎯 Construction finale.</strong> Tu parles en premier.<br><span class='aura-agressive'>🔥 Aura Agressive :</span> Lead bet (Mise en premier) lourdement pour ne laisser aucune carte gratuite. S'il avait misé au flop et que tu as check-call, c'est l'heure du Check-Raise All-in.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Call encore. Ne l'interromps surtout pas s'il est en plein bluff."
            },
            RIVER: {
                IP: "<strong>🎯 Finition.</strong> Dernier à parler.<br><span class='aura-agressive'>🔥 Aura Agressive :</span> S'il check, fais Tapis (Shove). S'il mise, relance à tapis. Polarise ta range.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Value bet standard (50% pot) s'il check, pour t'assurer d'être payé par des paires moyennes.",
                OOP: "<strong>🎯 Coup de grâce.</strong> Premier à parler.<br><span class='aura-agressive'>🔥 Aura Agressive :</span> Lead All-in (Donk Shove) surprise pour le choquer.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check pour le laisser faire un bluff final suicidaire (Check-Call)."
            }
        },
        MID: {
            FLOP: {
                IP: "<strong>🎯 Préparation.</strong><br><span class='aura-agressive'>🔥 Aura Agressive :</span> Bet 50% ou Raise s'il a lead. Tu te commit.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check pot control s'il a check.",
                OOP: "<strong>🎯 Piège.</strong><br><span class='aura-agressive'>🔥 Aura Agressive :</span> Check, puis Raise All-in s'il mise.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Call pour garder ses bluffs."
            },
            TURN: {
                IP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Shove direct s'il check.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Petit bet induisant un shove.",
                OOP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Lead Shove.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Call."
            },
            RIVER: {
                IP: "<strong>🎯 Tapis pur et dur.</strong>",
                OOP: "<strong>🎯 Laisse-le faire tapis (Check), sinon Lead Shove.</strong>"
            }
        },
        SHORT: {
            FLOP: {
                IP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Tapis direct s'il check.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Min-bet.",
                OOP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Check-Shove ou Lead Tapis direct.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Call."
            },
            TURN: { IP: "<strong>🔥 Push.</strong>", OOP: "<strong>🔥 Push.</strong>" },
            RIVER: { IP: "<strong>🔥 Push.</strong>", OOP: "<strong>🔥 Push.</strong>" }
        }
    };

    const advStrong = {
        DEEP: {
            FLOP: {
                IP: "<strong>🛡️ Protection / Value.</strong> Main forte mais vulnérable.<br><span class='aura-agressive'>🔥 Aura Agressive :</span> S'il a checké, C-Bet 66% pour value contre les tirages et paires.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Pot control (Check back) si le board est ultra drawy.",
                OOP: "<strong>🛡️ Contrôle.</strong> Tu parles en premier.<br><span class='aura-agressive'>🔥 Aura Agressive :</span> Lead (Donk Bet) pour reprendre l'initiative, ou Check pour faire un Check-Raise modéré.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Call classique pour sous-représenter la main."
            },
            TURN: {
                IP: "<strong>🛡️ Analyse de la carte.</strong><br><span class='aura-agressive'>🔥 Aura Agressive :</span> 2-Barrel fort si la carte est une brique.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Back si la couleur/quinte rentre.",
                OOP: "<strong>🛡️ Prudence OOP.</strong><br><span class='aura-agressive'>🔥 Aura Agressive :</span> Lead bet pour empêcher son check-behind en position.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Call en mode Bluff Catcher."
            },
            RIVER: {
                IP: "<strong>🛡️ Thin Value.</strong><br><span class='aura-agressive'>🔥 Aura Agressive :</span> Bet 50% pour te faire payer par moins bien.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check Behind pour prendre l'abattage en sécurité.",
                OOP: "<strong>🛡️ Décision finale.</strong><br><span class='aura-agressive'>🔥 Aura Agressive :</span> Block bet (25% pot) pour fixer toi-même le prix de l'abattage.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Call ou Fold sur un gros overbet."
            }
        },
        MID: {
            FLOP: {
                IP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Bet fort pour commit.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check pot control.",
                OOP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Check-Raise.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Call."
            },
            TURN: {
                IP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Shove si pot déjà gros.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check.",
                OOP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Lead Shove.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Call."
            },
            RIVER: { IP: "<strong>⚔️ Tapis ou Check.</strong>", OOP: "<strong>⚔️ Check-Call ou Fold.</strong>" }
        },
        SHORT: {
            FLOP: { IP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Tapis direct.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check.", OOP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Check-Shove.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Lead Tapis." },
            TURN: { IP: "<strong>🔥 Tapis.</strong>", OOP: "<strong>🔥 Tapis.</strong>" },
            RIVER: { IP: "<strong>🔥 Tapis.</strong>", OOP: "<strong>🔥 Tapis.</strong>" }
        }
    };

    const advMedium = {
        DEEP: {
            FLOP: {
                IP: "<strong>⚖️ Maintien de l'équité.</strong> Tu agis en dernier.<br><span class='aura-agressive'>🔥 Aura Agressive :</span> S'il a checké, petit bet (25% pot) pour 'acheter' la Turn pas cher.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check Back absolu. Va à l'abattage pour le moins cher possible.",
                OOP: "<strong>⚖️ Défense OOP.</strong> Tu parles en premier.<br><span class='aura-agressive'>🔥 Aura Agressive :</span> Check puis Raise en bluff pur pour transformer ta main (très risqué).<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Call une fois si son sizing est petit. Fold si c'est cher."
            },
            TURN: {
                IP: "<strong>⚖️ Fige l'action.</strong><br><span class='aura-agressive'>🔥 Aura Agressive :</span> Bet de protection s'il check encore.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check Back et Fold sur action agressive.",
                OOP: "<strong>⚖️ Résistance.</strong><br><span class='aura-agressive'>🔥 Aura Agressive :</span> Donk bet surprise pour stopper son agression.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Fold standard."
            },
            RIVER: {
                IP: "<strong>⚖️ Showdown.</strong><br><span class='aura-agressive'>🔥 Aura Agressive :</span> Bluff total s'il check et que les tirages rentrent.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check Behind pour voir les cartes.",
                OOP: "<strong>⚖️ Abandon.</strong><br><span class='aura-agressive'>🔥 Aura Agressive :</span> Lead Tapis en pur bluff (Suicide).<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Fold sans émotion."
            }
        },
        MID: {
            FLOP: { IP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Min-bet.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check Back.", OOP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Check-Raise bluff.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Fold." },
            TURN: { IP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Barrel bluff.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check.", OOP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Lead bluff.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Fold." },
            RIVER: { IP: "<strong>⚖️ Check.</strong>", OOP: "<strong>⚖️ Check-Fold.</strong>" }
        },
        SHORT: {
            FLOP: { IP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Shove Bluff.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check.", OOP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Check-Shove bluff.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Fold." },
            TURN: { IP: "<strong>🛡️ Check.</strong>", OOP: "<strong>🛡️ Check-Fold.</strong>" },
            RIVER: { IP: "<strong>🛡️ Fold.</strong>", OOP: "<strong>🛡️ Fold.</strong>" }
        }
    };

    const advDraw = {
        DEEP: {
            FLOP: {
                IP: "<strong>📈 Semi-Bluff.</strong> Tirage très fort.<br><span class='aura-agressive'>🔥 Aura Agressive :</span> S'il check, Overbet. S'il bet, gros Raise en semi-bluff. Tu as plein d'outs.<br><span class='aura-passive'>🛡️ Aura Passive :</span> S'il check, Check Back pour réaliser ton équité 100% gratuitement.",
                OOP: "<strong>📈 Initiative OOP.</strong> Tu parles en premier.<br><span class='aura-agressive'>🔥 Aura Agressive :</span> Check pour induire un bet puis Raise massif. Ou Lead bet direct.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Call (Suivre les cotes) pour voir la Turn pas cher."
            },
            TURN: { IP: "<strong>📈 Continuité.</strong><br><span class='aura-agressive'>🔥 Aura Agressive :</span> 2nd Barrel fort. Met la pression.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check Back si le pot est déjà trop gros.", OOP: "<strong>📈 Décision.</strong><br><span class='aura-agressive'>🔥 Aura Agressive :</span> Check-Raise All-in en semi-bluff.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Call ou Fold selon les cotes de pot." },
            RIVER: { IP: "<strong>📈 Bilan.</strong><br><span class='aura-agressive'>🔥 Aura Agressive :</span> Si raté + il check = Gros Bluff All-in. Si touché = Value Bet.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Si raté = Give up (Check Behind). Si touché = Value douce.", OOP: "<strong>📈 Survie.</strong><br><span class='aura-agressive'>🔥 Aura Agressive :</span> Si raté = Lead Bluff All-in.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Fold." }
        },
        MID: { FLOP: { IP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Shove Semi-Bluff.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check.", OOP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Check-Shove.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Call." }, TURN: { IP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Shove.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Fold si trop cher.", OOP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Shove.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Fold." }, RIVER: { IP: "<strong>🌪️ Bluff ou Value.</strong>", OOP: "<strong>🌪️ Check-Fold ou Shove.</strong>" } },
        SHORT: { FLOP: { IP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Tapis direct.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check.", OOP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Check-Shove direct.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Fold." }, TURN: { IP: "<strong>🚀 Tapis.</strong>", OOP: "<strong>🚀 Tapis.</strong>" }, RIVER: { IP: "<strong>🚀 Fold si raté.</strong>", OOP: "<strong>🚀 Check-Fold.</strong>" } }
    };

    const advDraw_weak = {
        DEEP: {
            FLOP: {
                IP: "<strong>🏹 Faible équité.</strong><br><span class='aura-agressive'>🔥 Aura Agressive :</span> S'il check, C-Bet pur bluff si le board est extrêmement sec (ex: K-2-2).<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check Back pour espérer toucher ton miracle.",
                OOP: "<strong>🏹 Repli.</strong> Tu parles en premier.<br><span class='aura-agressive'>🔥 Aura Agressive :</span> Lead bluff surprise (Donk bet) pour représenter le flop.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check et Fold instantané s'il mise."
            },
            TURN: { IP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Barrel bluff si 'scare card'.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Abandon.", OOP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Check-Raise bluff suicidaire.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Fold." },
            RIVER: { IP: "<strong>🏹 Abandon.</strong>", OOP: "<strong>🏹 Check-Fold.</strong>" }
        },
        MID: { FLOP: { IP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Petit bet bluff.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check.", OOP: "<strong>🏹 Check-Fold.</strong>" }, TURN: { IP: "<strong>🏹 Abandon.</strong>", OOP: "<strong>🏹 Check-Fold.</strong>" }, RIVER: { IP: "<strong>🏹 Fold.</strong>", OOP: "<strong>🏹 Check-Fold.</strong>" } },
        SHORT: { FLOP: { IP: "<strong>⛔ Fold.</strong>", OOP: "<strong>⛔ Check-Fold immédiat.</strong>" }, TURN: { IP: "<strong>⛔ Fold.</strong>", OOP: "<strong>⛔ Check-Fold.</strong>" }, RIVER: { IP: "<strong>⛔ Fold.</strong>", OOP: "<strong>⛔ Fold.</strong>" } }
    };

    const advAir = {
        DEEP: {
            FLOP: {
                IP: "<strong>💨 Rien du tout.</strong><br><span class='aura-agressive'>🔥 Aura Agressive :</span> S'il check, C-Bet (1/3 pot) si tu as un avantage de range (ex: A-K-x).<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check Back / Give up instantané.",
                OOP: "<strong>💨 Jet de l'éponge.</strong> Tu agis en premier.<br><span class='aura-agressive'>🔥 Aura Agressive :</span> Check pour l'un de ces tours. Ou Lead Bet si le board est très sec.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check et Fold si il mise."
            },
            TURN: { IP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Bet si tu penses le représenter.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Abandon.", OOP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Check-Raise bluff risqué.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check-Fold." },
            RIVER: { IP: "<strong>💨 Give up ou bluff selon la texture.</strong>", OOP: "<strong>💨 Check-Fold ou petit bluff.</strong>" }
        },
        MID: { FLOP: { IP: "<span class='aura-agressive'>🔥 Aura Agressive :</span> Min-bet si le board est sec.<br><span class='aura-passive'>🛡️ Aura Passive :</span> Check Back.", OOP: "<strong>💨 Check-Fold.</strong>" }, TURN: { IP: "<strong>💨 Check-Fold.</strong>", OOP: "<strong>💨 Check-Fold.</strong>" }, RIVER: { IP: "<strong>💨 Fold.</strong>", OOP: "<strong>💨 Fold.</strong>" } },
        SHORT: { FLOP: { IP: "<strong>💨 Fold.</strong>", OOP: "<strong>💨 Fold.</strong>" }, TURN: { IP: "<strong>💨 Fold.</strong>", OOP: "<strong>💨 Fold.</strong>" }, RIVER: { IP: "<strong>💨 Fold.</strong>", OOP: "<strong>💨 Fold.</strong>" } }
    };

    function getCategoriesForHand(handId, street) {
        const vals = { A: 14, K: 13, Q: 12, J: 11, T: 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 };
        const r1 = handId.charAt(0);
        const r2 = handId.length > 1 ? handId.charAt(1) : r1;
        const isPair = r1 === r2;
        const isSuited = handId.length === 3 && handId.charAt(2) === 's';
        const v1 = vals[r1];
        const v2 = vals[r2];

        const cats = [];
        cats.push({ id: 'cat_qf', title: '👑 Quinte Flush Royale / Quinte Flush', hit_prob: isSuited ? '~0.02%' : '< 0.01%', equity: '100%', desc: isSuited ? 'La main ultime (utilise tes 2 cartes en main).' : 'La main ultime (utilise 1 de tes cartes + 4 au board).', advice: advNuts });
        cats.push({ id: 'cat_carre', title: '💥 Carré (Four of a Kind)', hit_prob: isPair ? '~0.2%' : '~0.01%', equity: '99%+', desc: 'Quatre cartes de même rang.', advice: advNuts });

        if (isPair) {
            if (r1 !== '2') cats.push({ id: 'cat_full_max', title: '🌋 Full House Max', hit_prob: '~0.6%', equity: '98%+', desc: 'Le meilleur Full possible (tu détiens le brelan supérieur).', advice: advNuts });
            if (r1 !== 'A') cats.push({ id: 'cat_full_min', title: '🗻 Full House Min', hit_prob: '~0.4%', equity: '80-90%', desc: 'Un Full inférieur (Under-full). Attention aux Fulls supérieurs ou carrés.', advice: advStrong });
        } else {
            cats.push({ id: 'cat_full_max', title: '🌋 Full House Max', hit_prob: '~0.05%', equity: '98%+', desc: 'Le meilleur Full possible (tu détiens le brelan supérieur).', advice: advNuts });
            cats.push({ id: 'cat_full_min', title: '🗻 Full House Min', hit_prob: '~0.05%', equity: '80-90%', desc: 'Un Full inférieur (Under-full). Attention aux Fulls supérieurs ou carrés.', advice: advStrong });
        }

        if (isSuited || street !== 'FLOP') {
            cats.push({ id: 'cat_couleur', title: '💧 Couleur (Flush)', hit_prob: isSuited ? '~0.8%' : '< 0.1%', equity: '90%+', desc: isSuited ? '5 cartes de la même couleur (2 en main + 3 au board).' : '5 cartes de la même couleur (1 en main + 4 au board).', advice: advNuts });
        }

        cats.push({ id: 'cat_quinte_max', title: '🛤️ Quinte Max (Nut Straight)', hit_prob: '~0.8%', equity: '90-95%', desc: 'La meilleure suite possible, imbattable par une autre suite.', advice: advNuts });
        cats.push({ id: 'cat_quinte_min', title: '🦯 Quinte Min (Bottom Straight)', hit_prob: '~0.7%', equity: '60-80%', desc: 'Suite par le bas. Très vulnérable si le board connecte plus haut.', advice: advStrong });
        cats.push({ id: 'cat_brelan', title: '🔥 Brelan (Three of a Kind)', hit_prob: isPair ? '~11%' : '~1.5%', equity: '80%+', desc: 'Trois cartes de même rang.', advice: advStrong });
        cats.push({ id: 'cat_dp', title: '🌟 Double Paire (Two Pair)', hit_prob: isPair ? '~15%' : '~8%', equity: '70%+', desc: 'Deux paires distinctes.', advice: advStrong });
        cats.push({ id: 'cat_paire', title: '🟡 Paire (One Pair)', hit_prob: isPair ? 'Main servie' : '~32%', equity: '40-60%', desc: 'Une seule paire touchée.', advice: advMedium });

        if (street !== 'RIVER') {
            const probFD = street === 'FLOP' ? '~35%' : '~18%';
            const probOESD = street === 'FLOP' ? '~31%' : '~17%';
            const probGut = street === 'FLOP' ? '~16%' : '~9%';

            if (isSuited) {
                cats.push({ id: 'cat_draw_fd2', title: '💦 Tirage Couleur Max (2 cartes)', hit_prob: probFD, equity: '35-50%', desc: "2 en main + 2 au board. Il t'en manque 1.", advice: advDraw });
                if (street === 'FLOP') cats.push({ id: 'cat_draw_bd_fd', title: '💧 Tirage Couleur Backdoor', hit_prob: '~4%', equity: '10-20%', desc: "Runner-Runner. Il t'en manque 2.", advice: advDraw_weak });
            } else {
                cats.push({ id: 'cat_draw_fd1', title: '💧 Tirage Couleur Faible', hit_prob: probFD, equity: '20-35%', desc: '1 carte en main + 3 au board.', advice: advDraw });
            }

            const noOESD = isPair || (v1 === 14 && v2 === 13) || (v1 === 14 && v2 === 2);
            if (!noOESD) cats.push({ id: 'cat_draw_oesd', title: '📈 Tirage Quinte Bilatérale', hit_prob: probOESD, equity: '30-45%', desc: '4 cartes de suite (8 outs).', advice: advDraw });
            cats.push({ id: 'cat_draw_gutshot', title: '🏹 Tirage Quinte Ventrale', hit_prob: probGut, equity: '15-25%', desc: 'Manque le milieu (4 outs).', advice: advDraw_weak });
        }

        if (!isPair) cats.push({ id: 'cat_hc', title: '⚫ Carte Haute (Air)', hit_prob: '~40%', equity: '10-25%', desc: 'Aucune combinaison touchée.', advice: advAir });

        return cats;
    }

    function getDynamicBoard(category, handId, street) {
        const vals = { A: 14, K: 13, Q: 12, J: 11, T: 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 };
        const revVals = { 14: 'A', 13: 'K', 12: 'Q', 11: 'J', 10: 'T', 9: '9', 8: '8', 7: '7', 6: '6', 5: '5', 4: '4', 3: '3', 2: '2' };
        const r1 = handId.charAt(0);
        const r2 = handId.length > 1 ? handId.charAt(1) : r1;
        const isPair = r1 === r2;
        const isSuited = handId.length === 3 && handId.charAt(2) === 's';
        const v1 = vals[r1];
        const v2 = vals[r2];
        let highR = v1 > v2 ? r1 : r2;
        let lowR = v1 > v2 ? r2 : r1;
        if (isPair) { highR = r1; lowR = r1; }

        function getOther(avoidArr) {
            for (let v = 2; v <= 14; v++) {
                const r = revVals[v];
                if (!avoidArr.includes(r)) return r;
            }
            return '2';
        }

        function getStraightCards(type) {
            const possibleSeqs = [];
            for (let h = 14; h >= 5; h--) {
                const seq = [h, h - 1, h - 2, h - 3, h - 4];
                if (!isPair && seq.includes(v1) && seq.includes(v2)) possibleSeqs.push(seq);
            }
            const lowSeq = [5, 4, 3, 2, 14];
            if (!isPair && lowSeq.includes(v1) && lowSeq.includes(v2)) possibleSeqs.push(lowSeq);
            if (possibleSeqs.length === 0) {
                const targetV = Math.max(v1, v2);
                for (let h = 14; h >= 5; h--) {
                    const seq = [h, h - 1, h - 2, h - 3, h - 4];
                    if (seq.includes(targetV)) possibleSeqs.push(seq);
                }
                if (lowSeq.includes(targetV)) possibleSeqs.push(lowSeq);
            }
            possibleSeqs.sort((a, b) => type === 'max' ? a[0] - b[0] : b[0] - a[0]);
            const chosenSeq = possibleSeqs[0] || [14, 13, 12, 11, 10];
            const board = [];
            for (const v of chosenSeq) {
                if (v !== v1 && v !== v2) board.push((v === 14 && chosenSeq[0] === 5) ? 'A' : revVals[v]);
            }
            return board;
        }

        function getFullHouseFlop(type) {
            if (isPair) {
                if (type === 'max') {
                    const low = Object.keys(vals).find(key => vals[key] < vals[r1]) || '2';
                    return [r1, low, low];
                }
                const high = Object.keys(vals).find(key => vals[key] > vals[r1]) || 'A';
                return [high, high, r1];
            }
            return type === 'max' ? [highR, highR, lowR] : [lowR, lowR, highR];
        }

        function getOesdFlop() {
            const diff = Math.abs(v1 - v2);
            const max = Math.max(v1, v2);
            const min = Math.min(v1, v2);
            const o = getOther([r1, r2]);
            if (diff === 1 && max < 14 && min > 2) return [revVals[max + 1], revVals[min - 1], o];
            if (diff === 2 && max < 14 && min > 1) return [revVals[max + 1], revVals[max - 1], o];
            if (diff === 3 && max < 15 && min > 1) return [revVals[max - 1], revVals[max - 2], o];
            const t = (max === 14) ? min : max;
            if (t >= 4 && t <= 12) return [revVals[t - 1], revVals[t - 2], revVals[t + 1]];
            if (t < 4) return [revVals[t + 1], revVals[t + 2], revVals[t + 3]];
            return ['9', '8', '7'];
        }

        function getGutshotFlop() {
            const diff = Math.abs(v1 - v2);
            const max = Math.max(v1, v2);
            const min = Math.min(v1, v2);
            const o = getOther([r1, r2]);
            if (diff === 1 && min > 3) return [revVals[min - 2], revVals[min - 3], o];
            if (diff === 2 && max < 13) return [revVals[max + 2], revVals[max - 1], o];
            if (diff === 3 && max < 14) return [revVals[max + 1], revVals[min + 1], o];
            if (diff === 4) return [revVals[max - 1], revVals[max - 2], o];
            if (max === 14) return ['K', 'Q', 'J'];
            if (max >= 6) return [revVals[max - 2], revVals[max - 3], revVals[max - 4]];
            return ['J', 'T', '8'];
        }

        const o1 = getOther([r1, r2]);
        const o2 = getOther([r1, r2, o1]);
        const o3 = getOther([r1, r2, o1, o2]);
        const o4 = getOther([r1, r2, o1, o2, o3]);
        const o5 = getOther([r1, r2, o1, o2, o3, o4]);

        let flop = '';
        let turn = '';
        let river = '';

        switch (category.id) {
            case 'cat_qf': {
                if (isSuited) {
                    const qfCards = getStraightCards('max');
                    const b1 = getOther([r1, r2, ...qfCards]);
                    const b2 = getOther([r1, r2, b1, ...qfCards]);
                    flop = `${qfCards[0]}♠-${qfCards[1]}♠-${qfCards[2]}♠`;
                    turn = `${b1}♦`;
                    river = `${b2}♣`;
                } else {
                    const qfBoard = [];
                    let seqStart = Math.max(vals[highR], 5);
                    for (let i = 0; i < 5; i += 1) {
                        let cardVal = seqStart - i;
                        if (cardVal === 1) cardVal = 14;
                        if (cardVal !== vals[highR]) qfBoard.push(revVals[cardVal]);
                    }
                    const b1 = getOther([r1, r2, ...qfBoard]);
                    flop = `${qfBoard[0]}♠-${qfBoard[1]}♠-${qfBoard[2]}♠`;
                    turn = `${qfBoard[3]}♠`;
                    river = `${b1}♦`;
                }
            } break;
            case 'cat_carre':
                if (isPair) { flop = `${highR}-${highR}-${o1}`; turn = o2; river = o3; }
                else { flop = `${highR}-${highR}-${highR}`; turn = o1; river = o2; }
                break;
            case 'cat_full_max': {
                const fhMax = getFullHouseFlop('max');
                flop = `${fhMax[0]}-${fhMax[1]}-${fhMax[2]}`;
                turn = o3;
                river = o4;
            } break;
            case 'cat_full_min': {
                const fhMin = getFullHouseFlop('min');
                flop = `${fhMin[0]}-${fhMin[1]}-${fhMin[2]}`;
                turn = o3;
                river = o4;
            } break;
            case 'cat_couleur':
                if (isSuited) { flop = `${o1}♠-${o2}♠-${o3}♠`; turn = `${o4}♥`; river = `${o5}♦`; }
                else { flop = `${o1}♠-${o2}♠-${o3}♠`; turn = `${o4}♠`; river = `${o5}♦`; }
                break;
            case 'cat_quinte_max': {
                const sCardsMax = getStraightCards('max');
                while (sCardsMax.length < 5) sCardsMax.push(getOther([r1, r2, ...sCardsMax]));
                flop = `${sCardsMax[0]}-${sCardsMax[1]}-${sCardsMax[2]}`;
                turn = sCardsMax[3];
                river = sCardsMax[4];
            } break;
            case 'cat_quinte_min': {
                const sCardsMin = getStraightCards('min');
                while (sCardsMin.length < 5) sCardsMin.push(getOther([r1, r2, ...sCardsMin]));
                flop = `${sCardsMin[0]}-${sCardsMin[1]}-${sCardsMin[2]}`;
                turn = sCardsMin[3];
                river = sCardsMin[4];
            } break;
            case 'cat_brelan':
                if (isPair) { flop = `${highR}-${o1}-${o2}`; turn = o3; river = o4; }
                else { flop = `${highR}-${highR}-${o1}`; turn = o2; river = o3; }
                break;
            case 'cat_dp':
                if (isPair) { flop = `${o1}-${o1}-${o2}`; turn = o3; river = o4; }
                else { flop = `${highR}-${lowR}-${o1}`; turn = o2; river = o3; }
                break;
            case 'cat_paire':
                if (isPair) { flop = `${o1}-${o2}-${o3}`; turn = o4; river = o5; }
                else { flop = `${highR}-${o1}-${o2}`; turn = o3; river = o4; }
                break;
            case 'cat_draw_fd2':
                flop = `${o1}♠-${o2}♠-${o3}♥`; turn = `${o4}♦`; river = `${o5}♣`;
                break;
            case 'cat_draw_fd1':
                flop = `${o1}♠-${o2}♠-${o3}♠`; turn = `${o4}♦`; river = `${o5}♣`;
                break;
            case 'cat_draw_bd_fd':
                flop = `${o1}♠-${o2}♥-${o3}♦`; turn = `${o4}♠`; river = `${o5}♠`;
                break;
            case 'cat_draw_oesd': {
                const oesd = getOesdFlop();
                flop = `${oesd[0]}-${oesd[1]}-${oesd[2]}`; turn = o4; river = o5;
            } break;
            case 'cat_draw_gutshot': {
                const gs = getGutshotFlop();
                flop = `${gs[0]}-${gs[1]}-${gs[2]}`; turn = o4; river = o5;
            } break;
            case 'cat_hc':
                flop = `${o1}-${o2}-${o3}`; turn = o4; river = o5;
                break;
            default:
                flop = `${o1}-${o2}-${o3}`;
                turn = o4;
                river = o5;
                break;
        }

        if (street === 'FLOP') return `Ex: ${flop}`;
        if (street === 'TURN') return `Ex: ${flop} — ${turn}`;
        return `Ex: ${flop} — ${turn} — ${river}`;
    }

    function createGrid() {
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                const div = document.createElement('div');
                const handStr = (i === j) ? `${ranks[i]}${ranks[j]}` : (i < j) ? `${ranks[i]}${ranks[j]}s` : `${ranks[j]}${ranks[i]}o`;
                div.id = handStr;
                div.className = `hand ${i === j ? 'pair' : i < j ? 'suited' : 'offsuit'} has-data`;
                div.innerHTML = `<span>${handStr}</span>`;
                div.addEventListener('click', () => selectHand(handStr, div));
                grid.appendChild(div);
            }
        }
    }

    function selectHand(handId, cellElement) {
        document.querySelectorAll('.hand').forEach(el => el.classList.remove('active-hand'));
        cellElement.classList.add('active-hand');
        activeHandId = handId;
        currentActiveScenario = null;
        currentActiveCard = null;
        advicePanel.style.display = 'none';
        renderCategories();
    }

    function renderCategories() {
        if (!activeHandId) return;

        handTitle.textContent = `Main sélectionnée : ${activeHandId}`;
        scenariosSection.style.display = 'flex';
        scenarioCards.innerHTML = '';
        advicePanel.style.display = 'none';

        const currentStreet = streetSelect.value;
        const categories = getCategoriesForHand(activeHandId, currentStreet);

        if (currentActiveScenario && !categories.some(c => c.id === currentActiveScenario.id)) {
            currentActiveScenario = null;
            currentActiveCard = null;
            advicePanel.style.display = 'none';
        }

        categories.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'scenario-card';
            if (currentActiveScenario && currentActiveScenario.id === cat.id) {
                card.classList.add('active-scenario');
                currentActiveCard = card;
            }

            const dynamicDesc = getDynamicBoard(cat, activeHandId, currentStreet);
            card.innerHTML = `
                <div class="card-header">
                    <div class="card-title">${cat.title}</div>
                </div>
                <div class="stats-row">
                    <span class="stat-badge prob">🎯 ${cat.hit_prob}</span>
                    <span class="stat-badge eq">⚔️ Win: ${cat.equity}</span>
                </div>
                <div class="card-desc">${cat.desc}</div>
                <div class="card-ex">${dynamicDesc}</div>
            `;
            card.addEventListener('click', () => showAdvice(cat, card));
            scenarioCards.appendChild(card);
        });

        if (currentActiveScenario) showAdvice(currentActiveScenario, currentActiveCard);
    }

    function showAdvice(scenario, cardElement) {
        document.querySelectorAll('.scenario-card').forEach(el => el.classList.remove('active-scenario'));
        if (cardElement) {
            cardElement.classList.add('active-scenario');
            currentActiveCard = cardElement;
            cardElement.parentNode.insertBefore(advicePanel, cardElement.nextSibling);
        }

        currentActiveScenario = scenario;
        const currentPosition = posSelect.value;
        const currentStreet = streetSelect.value;
        const currentStack = stackSelect.value;
        const positionText = currentPosition === 'IP' ? 'En Position (IP)' : 'Hors Position (OOP)';

        let stackAdvice = scenario.advice[currentStack] || scenario.advice.DEEP;
        const streetData = stackAdvice[currentStreet] || stackAdvice.FLOP;
        const adviceText = streetData[currentPosition] || streetData.IP;

        advicePanel.innerHTML = `
            <div class="badges-container">
                <div class="stack-badge">${currentStack} STACK</div>
                <div class="street-badge">${currentStreet}</div>
                <div class="position-badge">${positionText}</div>
            </div>
            <div>${adviceText}</div>
        `;
        advicePanel.style.display = 'block';
        advicePanel.classList.remove('flash');
        void advicePanel.offsetWidth;
        advicePanel.classList.add('flash');
    }

    streetSelect.addEventListener('change', () => { if (activeHandId) renderCategories(); });
    posSelect.addEventListener('change', () => { if (activeHandId) renderCategories(); });
    stackSelect.addEventListener('change', () => { if (currentActiveScenario) showAdvice(currentActiveScenario, currentActiveCard); });

    createGrid();
});