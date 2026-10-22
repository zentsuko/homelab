document.addEventListener('DOMContentLoaded', () => {
    const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    const grid = document.getElementById('poker-grid');
    const percentageDisplay = document.getElementById('range-percentage');
    const comboDisplay = document.getElementById('combo-count');
    const noteEl = document.getElementById('scenario-note');
    const btnContainer = document.getElementById('position-buttons');
    const formatSelect = document.getElementById('format-select');
    const situationSelect = document.getElementById('situation-select');
    const stackSelect = document.getElementById('stack-select');

    const equitiesData = [
        [85, 67, 66, 65, 64, 62, 61, 60, 59, 60, 59, 58, 57],
        [65, 82, 63, 62, 61, 59, 58, 57, 56, 55, 54, 53, 52],
        [64, 60, 80, 60, 59, 57, 56, 54, 53, 52, 51, 50, 49],
        [63, 59, 58, 77, 58, 56, 54, 53, 51, 50, 49, 48, 47],
        [62, 58, 56, 55, 75, 55, 53, 51, 50, 48, 47, 46, 45],
        [60, 56, 54, 53, 52, 72, 52, 50, 48, 47, 45, 44, 43],
        [59, 55, 53, 51, 49, 48, 69, 49, 47, 45, 44, 42, 41],
        [58, 54, 51, 49, 48, 46, 45, 66, 46, 44, 42, 41, 40],
        [57, 53, 50, 48, 46, 44, 43, 42, 63, 44, 42, 40, 39],
        [58, 52, 50, 48, 46, 45, 43, 41, 40, 60, 43, 41, 40],
        [57, 51, 49, 47, 45, 43, 41, 40, 38, 39, 57, 41, 39],
        [56, 50, 48, 46, 44, 42, 40, 39, 37, 38, 37, 53, 38],
        [55, 49, 47, 45, 43, 41, 39, 37, 36, 37, 35, 34, 50]
    ];

    const db_rfi = {
        'deep': [
            { R: "AA,KK,QQ,JJ,TT,99,88,77,AKs,AQs,AJs,ATs,KQs,KJs,KTs,QJs,QTs,JTs,AKo,AQo" },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,66,55,AKs,AQs,AJs,ATs,A9s,KQs,KJs,KTs,QJs,QTs,JTs,T9s,AKo,AQo,AJo,KQo" },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,QJs,QTs,JTs,T9s,98s,AKo,AQo,AJo,ATo,KQo,KJo" },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,QJs,QTs,Q9s,JTs,J9s,T9s,98s,87s,76s,AKo,AQo,AJo,ATo,KQo,KJo,QJo" },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,QJs,QTs,Q9s,Q8s,JTs,J9s,J8s,T9s,T8s,98s,97s,87s,76s,65s,54s,AKo,AQo,AJo,ATo,A9o,KQo,KJo,QJo,QTo,JTo" },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,JTs,J9s,J8s,J7s,T9s,T8s,T7s,98s,97s,87s,86s,76s,75s,65s,54s,43s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,QJo,QTo,Q9o,JTo,J9o,T9o,98o" },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,JTs,J9s,J8s,J7s,T9s,T8s,T7s,98s,97s,87s,86s,76s,75s,65s,54s,43s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,K8o,QJo,QTo,Q9o,JTo,J9o,T9o,98o" },
            {
                R: "AA,KK,QQ,JJ,TT,99,AKs,AQs,AJs,ATs,KQs,KJs,AKo,AQo",
                C: "88,77,66,55,44,33,22,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KTs,K9s,QJs,QTs,Q9s,JTs,J9s,T9s,T8s,98s,87s,76s,65s,54s,ATo,A9o,A8o,A7o,KJo,KTo,K9o,QJo,QTo,JTo,T9o"
            }
        ],
        'mid': [
            { R: "AA,KK,QQ,JJ,TT,99,88,AKs,AQs,AJs,ATs,KQs,KJs,KTs,QJs,QTs,JTs,AKo,AQo,AJo,KQo" },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,AKs,AQs,AJs,ATs,A9s,KQs,KJs,KTs,QJs,QTs,JTs,T9s,AKo,AQo,AJo,ATo,KQo" },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,66,AKs,AQs,AJs,ATs,A9s,A8s,A5s,KQs,KJs,KTs,K9s,QJs,QTs,JTs,T9s,98s,AKo,AQo,AJo,ATo,KQo,KJo" },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,66,55,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A5s,A4s,KQs,KJs,KTs,K9s,QJs,QTs,Q9s,JTs,J9s,T9s,98s,87s,AKo,AQo,AJo,ATo,A9o,KQo,KJo,QJo" },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,QJs,QTs,Q9s,JTs,J9s,T9s,98s,87s,76s,AKo,AQo,AJo,ATo,A9o,A8o,KQo,KJo,KTo,QJo,QTo,JTo" },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,QJs,QTs,Q9s,JTs,J9s,T9s,98s,87s,76s,AKo,AQo,AJo,ATo,A9o,A8o,KQo,KJo,KTo,QJo,QTo,JTo" },
            {
                R: "AA,KK,QQ,JJ,TT,99,88,AKs,AQs,AJs,ATs,KQs,AKo,AQo",
                C: "77,66,55,44,33,22,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KJs,KTs,K9s,K8s,QJs,QTs,Q9s,JTs,J9s,T9s,T8s,98s,87s,76s,AJo,ATo,A9o,A8o,KQo,KJo,KTo,QJo,QTo,JTo,T9o"
            },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,KQs,KJs,KTs,K9s,QJs,QTs,Q9s,JTs,J9s,T9s,98s,87s,AKo,AQo,AJo,ATo,A9o,KQo,KJo,QJo,QTo,JTo" }
        ],
        'short': [
            { R: "AA,KK,QQ,JJ,TT,99,88,AKs,AQs,AJs,ATs,KQs,KJs,KTs,QJs,QTs,JTs,AKo,AQo,AJo,KQo" },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,AKs,AQs,AJs,ATs,A9s,KQs,KJs,KTs,QJs,QTs,JTs,T9s,AKo,AQo,AJo,ATo,KQo" },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,66,AKs,AQs,AJs,ATs,A9s,A8s,A5s,KQs,KJs,KTs,K9s,QJs,QTs,JTs,T9s,98s,AKo,AQo,AJo,ATo,KQo,KJo" },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,66,55,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A5s,A4s,KQs,KJs,KTs,K9s,QJs,QTs,Q9s,JTs,J9s,T9s,98s,87s,AKo,AQo,AJo,ATo,A9o,KQo,KJo,QJo" },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,QJs,QTs,Q9s,JTs,J9s,T9s,98s,87s,76s,AKo,AQo,AJo,ATo,A9o,A8o,KQo,KJo,KTo,QJo,QTo,JTo" },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,QJs,QTs,Q9s,JTs,J9s,T9s,98s,87s,76s,AKo,AQo,AJo,ATo,A9o,A8o,KQo,KJo,KTo,QJo,QTo,JTo" },
            {
                R: "AA,KK,QQ,JJ,TT,99,88,AKs,AQs,AJs,ATs,KQs,AKo,AQo",
                C: "77,66,55,44,33,22,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KJs,KTs,K9s,K8s,QJs,QTs,Q9s,JTs,J9s,T9s,T8s,98s,87s,76s,AJo,ATo,A9o,A8o,KQo,KJo,KTo,QJo,QTo,JTo,T9o"
            },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,KQs,KJs,KTs,K9s,QJs,QTs,Q9s,JTs,J9s,T9s,98s,87s,AKo,AQo,AJo,ATo,A9o,KQo,KJo,QJo,QTo,JTo" }
        ],
        'micro': [
            { R: "AA,KK,QQ,JJ,AKs,AQs,AKo", P: "TT,99,88,AJs,ATs,KQs,KJs,AQo,AJo" },
            { R: "AA,KK,QQ,JJ,AKs,AQs,AKo", P: "TT,99,88,77,AJs,ATs,KQs,KJs,KTs,QJs,AQo,AJo,ATo,KQo" },
            { R: "AA,KK,QQ,JJ,AKs,AQs", P: "TT,99,88,77,66,AJs,ATs,A9s,KQs,KJs,KTs,QJs,QTs,JTs,AKo,AQo,AJo,ATo,KQo,KJo" },
            { R: "AA,KK,QQ,JJ", P: "TT,99,88,77,66,55,AKs,AQs,AJs,ATs,A9s,A8s,A5s,KQs,KJs,KTs,K9s,QJs,QTs,JTs,T9s,AKo,AQo,AJo,ATo,A9o,KQo,KJo,KTo,QJo" },
            { R: "AA,KK", P: "QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,JTs,J9s,J8s,T9s,T8s,98s,AKo,AQo,AJo,ATo,A9o,A8o,KQo,KJo,KTo,QJo,QTo,JTo,T9o" },
            {
                P: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,JTs,J9s,J8s,T9s,T8s,98s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,KQo,KJo,KTo,K9o,QJo,QTo,Q9o,JTo,J9o,T9o",
                C: "T7s,97s,A4o,A3o,A2o,K8o,K7o"
            },
            { P: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,JTs,J9s,J8s,T9s,T8s,T7s,98s,97s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,K8o,K7o,QJo,QTo,Q9o,JTo,J9o,T9o" },
            { R: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,KQs,KJs,KTs,QJs,QTs,JTs,AKo,AQo,AJo,ATo,KQo,KJo" }
        ]
    };

    const db_vs_open = {
        'deep': [
            {},
            { '3B': "AA,KK,QQ,JJ,TT,AKs,AQs,AKo", C: "99,88,77,AJs,ATs,KQs,KJs,AQo" },
            { '3B': "AA,KK,QQ,JJ,TT,99,AKs,AQs,AJs,AKo", C: "88,77,66,ATs,KQs,KJs,KTs,QJs,AQo" },
            { '3B': "AA,KK,QQ,JJ,TT,99,AKs,AQs,AJs,KQs,AKo,AQo", C: "88,77,66,55,ATs,A9s,KJs,KTs,QJs,QTs,JTs,T9s" },
            { '3B': "AA,KK,QQ,JJ,TT,99,88,AKs,AQs,AJs,ATs,KQs,KJs,AKo,AQo,AJo", C: "77,66,55,44,33,22,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KTs,K9s,QJs,QTs,JTs,T9s,98s,87s" },
            { '3B': "AA,KK,QQ,JJ,TT,99,88,AKs,AQs,AJs,ATs,A5s,A4s,KQs,KJs,KTs,QJs,AKo,AQo,AJo,KQo", C: "77,66,55,44,33,22,A9s,A8s,A7s,A6s,A3s,A2s,K9s,K8s,QTs,Q9s,JTs,J9s,T9s,T8s,98s,87s,76s,65s,54s" },
            { '3B': "AA,KK,QQ,JJ,TT,99,88,AKs,AQs,AJs,ATs,KQs,KJs,AKo,AQo,AJo,KQo", C: "77,66,55,44,A9s,A8s,KTs,QJs,QTs,JTs,T9s,98s" },
            { '3B': "AA,KK,QQ,JJ,TT,AKs,AQs,AJs,ATs,A5s,A4s,KQs,KJs,KTs,QJs,AKo,AQo", C: "99,88,77,66,55,44,33,22,A9s,A8s,A7s,A6s,A3s,A2s,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QTs,Q9s,Q8s,JTs,J9s,J8s,T9s,T8s,98s,97s,87s,86s,76s,75s,65s,64s,54s,53s,AJo,ATo,A9o,A8o,A7o,KQo,KJo,KTo,QJo,QTo,JTo,T9o" }
        ],
        'mid': [
            {},
            { '3B': "AA,KK,QQ,JJ,TT,99,AKs,AQs,AKo", C: "88,77,AJs,ATs,KQs,KJs,AQo" },
            { '3B': "AA,KK,QQ,JJ,TT,99,88,AKs,AQs,AJs,AKo,AQo", C: "77,66,ATs,KQs,KJs,KTs,QJs" },
            { '3B': "AA,KK,QQ,JJ,TT,99,88,AKs,AQs,AJs,ATs,KQs,AKo,AQo,AJo", C: "77,66,55,KJs,KTs,QJs,QTs,JTs,T9s,KQo" },
            { '3B': "AA,KK,QQ,JJ,TT,99,88,77,AKs,AQs,AJs,ATs,KQs,KJs,AKo,AQo,AJo,KQo", C: "66,55,44,A9s,A8s,KTs,K9s,QJs,QTs,JTs,T9s,98s" },
            { '3B': "AA,KK,QQ,JJ,TT,99,88,77,AKs,AQs,AJs,ATs,A5s,KQs,KJs,KTs,QJs,AKo,AQo,AJo,KQo,KJo", C: "66,55,44,33,22,A9s,A8s,A7s,K9s,K8s,QTs,Q9s,JTs,J9s,T9s,98s,87s" },
            { '3B': "AA,KK,QQ,JJ,TT,99,88,77,AKs,AQs,AJs,ATs,KQs,KJs,AKo,AQo,AJo,KQo", C: "66,55,44,A9s,A8s,KTs,QJs,QTs,JTs,T9s,98s" },
            { '3B': "AA,KK,QQ,JJ,TT,99,AKs,AQs,AJs,ATs,A5s,KQs,AKo,AQo,AJo", C: "88,77,66,55,44,33,22,A9s,A8s,A7s,A6s,A4s,A3s,A2s,KJs,KTs,K9s,K8s,K7s,K6s,K5s,QJs,QTs,Q9s,JTs,J9s,T9s,T8s,98s,97s,87s,76s,65s,ATo,A9o,A8o,KQo,KJo,KTo,QJo,QTo,JTo" }
        ],
        'short': [
            {},
            { '3B': "AA,KK,QQ,JJ,TT,99,AKs,AQs,AKo", C: "88,77,AJs,ATs,KQs,KJs,AQo" },
            { '3B': "AA,KK,QQ,JJ,TT,99,88,AKs,AQs,AJs,AKo,AQo", C: "77,66,ATs,KQs,KJs,KTs,QJs" },
            { '3B': "AA,KK,QQ,JJ,TT,99,88,AKs,AQs,AJs,ATs,KQs,AKo,AQo,AJo", C: "77,66,55,KJs,KTs,QJs,QTs,JTs,T9s,KQo" },
            { '3B': "AA,KK,QQ,JJ,TT,99,88,77,AKs,AQs,AJs,ATs,KQs,KJs,AKo,AQo,AJo,KQo", C: "66,55,44,A9s,A8s,KTs,K9s,QJs,QTs,JTs,T9s,98s" },
            { '3B': "AA,KK,QQ,JJ,TT,99,88,77,AKs,AQs,AJs,ATs,A5s,KQs,KJs,KTs,QJs,AKo,AQo,AJo,KQo,KJo", C: "66,55,44,33,22,A9s,A8s,A7s,K9s,K8s,QTs,Q9s,JTs,J9s,T9s,98s,87s" },
            { '3B': "AA,KK,QQ,JJ,TT,99,88,77,AKs,AQs,AJs,ATs,KQs,KJs,AKo,AQo,AJo,KQo", C: "66,55,44,A9s,A8s,KTs,QJs,QTs,JTs,T9s,98s" },
            { '3B': "AA,KK,QQ,JJ,TT,99,AKs,AQs,AJs,ATs,A5s,KQs,AKo,AQo,AJo", C: "88,77,66,55,44,33,22,A9s,A8s,A7s,A6s,A4s,A3s,A2s,KJs,KTs,K9s,K8s,K7s,K6s,K5s,QJs,QTs,Q9s,JTs,J9s,T9s,T8s,98s,97s,87s,76s,65s,ATo,A9o,A8o,KQo,KJo,KTo,QJo,QTo,JTo" }
        ],
        'micro': [
            {},
            { P: "AA,KK,QQ,JJ,TT,99,88,AKs,AQs,AJs,AKo,AQo" },
            { P: "AA,KK,QQ,JJ,TT,99,88,77,AKs,AQs,AJs,ATs,KQs,AKo,AQo,AJo" },
            { P: "AA,KK,QQ,JJ,TT,99,88,77,66,AKs,AQs,AJs,ATs,KQs,KJs,AKo,AQo,AJo,KQo" },
            { P: "AA,KK,QQ,JJ,TT,99,88,77,66,55,AKs,AQs,AJs,ATs,A5s,KQs,KJs,KTs,QJs,AKo,AQo,AJo,ATo,KQo,KJo", C: "44,A9s,A8s,JTs,T9s,98s" },
            { P: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,AKs,AQs,AJs,ATs,A5s,A4s,KQs,KJs,KTs,QJs,QTs,JTs,AKo,AQo,AJo,ATo,KQo,KJo", C: "33,22,A9s,A8s,A7s,K9s,T9s,98s,87s" },
            { P: "AA,KK,QQ,JJ,TT,99,88,77,AKs,AQs,AJs,ATs,A5s,A4s,A3s,KQs,KJs,KTs,QJs,AKo,AQo,AJo,ATo,KQo,KJo" },
            { P: "AA,KK,QQ,JJ,TT,99,88,77,AKs,AQs,AJs,ATs,A5s,KQs,AKo,AQo,AJo,ATo,KQo", C: "66,55,44,33,22,A9s,A8s,A7s,A6s,A4s,A3s,A2s,KJs,KTs,K9s,K8s,QJs,QTs,Q9s,JTs,J9s,T9s,98s,87s,A9o,A8o,KJo,KTo,QJo" }
        ]
    };

    const posNames = ['UTG', 'UTG+1', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
    let currentActiveRanges = {};

    function getCombos(handStr) {
        if (handStr.length === 2) return 6;
        if (handStr.endsWith('s')) return 4;
        if (handStr.endsWith('o')) return 12;
        return 0;
    }

    function updateStats() {
        let totalCombos = 0;
        document.querySelectorAll('.hand').forEach(cell => {
            if (cell.classList.contains('action-raise') ||
                cell.classList.contains('action-threebet') ||
                cell.classList.contains('action-push') ||
                cell.classList.contains('action-call') ||
                cell.classList.contains('action-check')) {
                totalCombos += getCombos(cell.id);
            }
        });

        const percentage = ((totalCombos / 1326) * 100).toFixed(1);
        percentageDisplay.textContent = `Mains jouées : ${percentage}%`;
        comboDisplay.innerHTML = `<span>${totalCombos} / 1326 Combos</span>`;
    }

    function createGrid() {
        grid.innerHTML = '';
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                const div = document.createElement('div');
                let handStr = '';
                if (i === j) {
                    handStr = ranks[i] + ranks[j];
                    div.className = 'hand pair';
                } else if (i < j) {
                    handStr = ranks[i] + ranks[j] + 's';
                    div.className = 'hand suited';
                } else {
                    handStr = ranks[j] + ranks[i] + 'o';
                    div.className = 'hand offsuit';
                }
                div.id = handStr;
                const eqValue = equitiesData[i][j];
                div.innerHTML = `<span>${handStr}</span><span class="eq-text">${eqValue}%</span>`;
                grid.appendChild(div);
            }
        }
    }

    function clearGrid() {
        document.querySelectorAll('.hand').forEach(el => {
            el.classList.remove('action-raise', 'action-threebet', 'action-push', 'action-call', 'action-check');
        });
    }

    function loadRange(positionName, btnElement, situationMode) {
        document.querySelectorAll('#position-buttons button').forEach(b => {
            b.classList.remove('active', 'mode-rfi', 'mode-vs');
        });

        btnElement.classList.add('active');
        btnElement.classList.add(situationMode === 'rfi' ? 'mode-rfi' : 'mode-vs');

        clearGrid();
        const rangeObj = currentActiveRanges[positionName] || {};

        if (rangeObj.R) {
            rangeObj.R.split(',').forEach(handStr => {
                const cell = document.getElementById(handStr.trim());
                if (cell) cell.classList.add('action-raise');
            });
        }
        if (rangeObj['3B']) {
            rangeObj['3B'].split(',').forEach(handStr => {
                const cell = document.getElementById(handStr.trim());
                if (cell) cell.classList.add('action-threebet');
            });
        }
        if (rangeObj.P) {
            rangeObj.P.split(',').forEach(handStr => {
                const cell = document.getElementById(handStr.trim());
                if (cell) cell.classList.add('action-push');
            });
        }
        if (rangeObj.C) {
            rangeObj.C.split(',').forEach(handStr => {
                const cell = document.getElementById(handStr.trim());
                if (cell) cell.classList.add('action-call');
            });
        }

        if (positionName === 'BB' && situationMode === 'rfi') {
            document.querySelectorAll('.hand').forEach(cell => {
                if (!cell.classList.contains('action-raise') &&
                    !cell.classList.contains('action-threebet') &&
                    !cell.classList.contains('action-push') &&
                    !cell.classList.contains('action-call')) {
                    cell.classList.add('action-check');
                }
            });
        }

        if (Object.keys(rangeObj).length === 0 && !(positionName === 'BB' && situationMode === 'rfi')) {
            if (situationMode === 'vs_open') {
                noteEl.textContent = `${positionName} est toujours le premier à parler à cette table : ce scénario ("faire face à une relance") ne peut pas se produire.`;
            } else {
                noteEl.textContent = `${positionName} n'a aucune range définie pour cette situation.`;
            }
            noteEl.style.display = 'block';
        } else {
            noteEl.style.display = 'none';
        }

        updateStats();
    }

    function updateSolver() {
        const formatSize = parseInt(formatSelect.value, 10);
        const situationMode = situationSelect.value;
        const stackMode = stackSelect.value;
        const fullRanges = situationMode === 'rfi' ? db_rfi[stackMode] : db_vs_open[stackMode];
        const startIndex = 8 - formatSize;

        currentActiveRanges = {};
        btnContainer.innerHTML = '';
        let firstBtn = null;

        for (let i = startIndex; i < 8; i++) {
            let pName = posNames[i];
            let rData = fullRanges[i];

            if (formatSize === 2) {
                if (situationMode === 'rfi' && pName === 'BB') continue;
                if (situationMode === 'vs_open' && pName === 'SB') continue;
                if (pName === 'SB') pName = 'SB (BTN)';
                if (pName === 'SB (BTN)' && situationMode === 'rfi') rData = fullRanges[5];
            }

            if (!rData) rData = {};
            currentActiveRanges[pName] = rData;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = pName;
            btn.addEventListener('click', () => loadRange(pName, btn, situationMode));
            btnContainer.appendChild(btn);

            if (!firstBtn) {
                firstBtn = btn;
            }
        }

        if (firstBtn) {
            firstBtn.click();
        } else {
            clearGrid();
            updateStats();
        }
    }

    createGrid();
    formatSelect.addEventListener('change', updateSolver);
    situationSelect.addEventListener('change', updateSolver);
    stackSelect.addEventListener('change', updateSolver);
    updateSolver();
});