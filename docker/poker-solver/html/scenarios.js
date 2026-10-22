// scenarios.js
// BASE DE DONNÉES ZHEN TRAINING - SPOTS GTO (V1.0 - Massive Edition)

const scenarios = [

    // ==========================================
    // 1. LES CLASSIQUES ET POT CONTROL (FLOP)
    // ==========================================
    { street: "FLOP", pot: "6.50", villainPos: "HJ", villainStack: "26.55", villainAction: "3.45", heroPos: "CO", heroStack: "30.00", heroCards: [{r:'4',s:'♥'},{r:'A',s:'♥'}], board: [{r:'A',s:'♣'},{r:'Q',s:'♣'},{r:'6',s:'♦'}], callAmount: "3.45", raiseAmount: "8.63", correctAction: "Call", explanation: "Avec Top Pair + Flush Draw Faible (Backdoor), tu domines les bluffs mais tu es dominé par AQ/AK. Payer garde sa range large." },
    { street: "FLOP", pot: "5.50", villainPos: "BB", villainStack: "40.00", villainAction: "Check", heroPos: "BTN", heroStack: "50.00", heroCards: [{r:'Q',s:'♦'},{r:'9',s:'♦'}], board: [{r:'A',s:'♣'},{r:'3',s:'♠'},{r:'2',s:'♥'}], callAmount: "-", raiseAmount: "2.00", correctAction: "Raise", explanation: "C-Bet Bluff standard ! Tu as l'initiative et le board est très sec. Petite mise recommandée." },
    { street: "FLOP", pot: "9.50", villainPos: "CO", villainStack: "60.00", villainAction: "4.50", heroPos: "UTG", heroStack: "60.00", heroCards: [{r:'6',s:'♥'},{r:'6',s:'♠'}], board: [{r:'J',s:'♦'},{r:'T',s:'♦'},{r:'5',s:'♦'}], callAmount: "4.50", raiseAmount: "13.50", correctAction: "Fold", explanation: "Flop monocolore. Tes 6 sans carreau sont morts. Fold propre." },
    { street: "FLOP", pot: "14.00", villainPos: "UTG", villainStack: "85.00", villainAction: "Check", heroPos: "HJ", heroStack: "90.00", heroCards: [{r:'K',s:'♣'},{r:'Q',s:'♣'}], board: [{r:'J',s:'♠'},{r:'T',s:'♥'},{r:'2',s:'♦'}], callAmount: "-", raiseAmount: "7.00", correctAction: "Raise", explanation: "OESD très fort + 2 Overcards. Miser (Raise) en semi-bluff est indispensable." },
    { street: "FLOP", pot: "12.00", villainPos: "BTN", villainStack: "100.00", villainAction: "Check", heroPos: "BB", heroStack: "100.00", heroCards: [{r:'K',s:'♥'},{r:'J',s:'♥'}], board: [{r:'A',s:'♣'},{r:'Q',s:'♣'},{r:'3',s:'♠'}], callAmount: "-", raiseAmount: "6.00", correctAction: "Check", explanation: "Tu es OOP avec une Gutshot (T). Si tu mises et te fais relancer, tu devras fold. Le check permet de contrôler le pot." },
    { street: "FLOP", pot: "14.00", villainPos: "BB", villainStack: "65.00", villainAction: "Check", heroPos: "BTN", heroStack: "65.00", heroCards: [{r:'Q',s:'♠'},{r:'Q',s:'♥'}], board: [{r:'A',s:'♦'},{r:'K',s:'♣'},{r:'4',s:'♠'}], callAmount: "-", raiseAmount: "4.50", correctAction: "Check", explanation: "Board cauchemardesque (A et K). Tes Dames sont la 3ème paire du board. Miser ici serait un bluff inutile. Check behind." },
    { street: "FLOP", pot: "11.00", villainPos: "BTN", villainStack: "55.00", villainAction: "Check", heroPos: "SB", heroStack: "60.00", heroCards: [{r:'K',s:'♥'},{r:'J',s:'♥'}], board: [{r:'A',s:'♠'},{r:'4',s:'♣'},{r:'4',s:'♦'}], callAmount: "-", raiseAmount: "4.00", correctAction: "Check", explanation: "Pot 3-Bet. Hors position, avec hauteur Roi sur un board A-4-4 hyper sec. Check est obligatoire." },
    { street: "FLOP", pot: "8.00", villainPos: "MP", villainStack: "60.00", villainAction: "5.00", heroPos: "CO", heroStack: "60.00", heroCards: [{r:'J',s:'♦'},{r:'T',s:'♦'}], board: [{r:'J',s:'♣'},{r:'7',s:'♠'},{r:'2',s:'♥'}], callAmount: "5.00", raiseAmount: "16.00", correctAction: "Call", explanation: "Top Pair Kicker moyen. Face à un bet de MP, payer est standard pour contrôler le pot." },
    { street: "FLOP", pot: "10.00", villainPos: "BTN", villainStack: "90.00", villainAction: "6.00", heroPos: "BB", heroStack: "95.00", heroCards: [{r:'7',s:'♦'},{r:'7',s:'♠'}], board: [{r:'7',s:'♣'},{r:'8',s:'♣'},{r:'9',s:'♦'}], callAmount: "6.00", raiseAmount: "20.00", correctAction: "Call", explanation: "Brelan floppé, mais le board est ultra-connecté. Relancer te fera payer que par la Quinte max (JT). Call est plus prudent." },
    { street: "FLOP", pot: "15.00", villainPos: "HJ", villainStack: "80.00", villainAction: "Check", heroPos: "CO", heroStack: "85.00", heroCards: [{r:'A',s:'♦'},{r:'A',s:'♠'}], board: [{r:'K',s:'♣'},{r:'8',s:'♣'},{r:'5',s:'♦'}], callAmount: "-", raiseAmount: "5.00", correctAction: "Raise", explanation: "Overpair max sur un board avec tirage trèfle. Vilain check, il est impératif de miser (Raise) pour value et protection." },
    { street: "FLOP", pot: "8.50", villainPos: "SB", villainStack: "50.00", villainAction: "Check", heroPos: "BB", heroStack: "50.00", heroCards: [{r:'9',s:'♣'},{r:'9',s:'♠'}], board: [{r:'A',s:'♥'},{r:'K',s:'♦'},{r:'J',s:'♣'}], callAmount: "-", raiseAmount: "3.50", correctAction: "Check", explanation: "Tu as une pocket pair, mais le board est rempli d'overcards. Check pour abandonner le coup discrètement." },
    
    // ==========================================
    // 2. TURN : CHECK-RAISES & BARRELS
    // ==========================================
    { street: "TURN", pot: "16.00", villainPos: "BTN", villainStack: "50.00", villainAction: "8.00", heroPos: "BB", heroStack: "60.00", heroCards: [{r:'8',s:'♥'},{r:'8',s:'♠'}], board: [{r:'8',s:'♦'},{r:'9',s:'♣'},{r:'J',s:'♥'},{r:'2',s:'♠'}], callAmount: "8.00", raiseAmount: "26.00", correctAction: "Raise", explanation: "Brelan sur board connecté. Relance (Check-Raise) obligatoire pour value et protection." },
    { street: "TURN", pot: "28.00", villainPos: "BB", villainStack: "70.00", villainAction: "14.00", heroPos: "CO", heroStack: "65.00", heroCards: [{r:'A',s:'♠'},{r:'J',s:'♠'}], board: [{r:'Q',s:'♠'},{r:'8',s:'♠'},{r:'3',s:'♦'},{r:'2',s:'♠'}], callAmount: "14.00", raiseAmount: "42.00", correctAction: "Raise", explanation: "Nut Flush touchée + 'Donk Bet' adverse. Spot rêvé pour relancer lourdement." },
    { street: "TURN", pot: "12.00", villainPos: "BB", villainStack: "30.00", villainAction: "Check", heroPos: "SB", heroStack: "35.00", heroCards: [{r:'A',s:'♣'},{r:'Q',s:'♦'}], board: [{r:'K',s:'♥'},{r:'T',s:'♠'},{r:'4',s:'♣'},{r:'2',s:'♦'}], callAmount: "-", raiseAmount: "8.00", correctAction: "Raise", explanation: "Vilain a check 2 fois. Miser avec ta Gutshot (J) et tes overcards met la pression sur les hauteurs moindres." },
    { street: "TURN", pot: "15.00", villainPos: "CO", villainStack: "32.00", villainAction: "10.00", heroPos: "BB", heroStack: "35.00", heroCards: [{r:'T',s:'♣'},{r:'J',s:'♣'}], board: [{r:'K',s:'♣'},{r:'9',s:'♥'},{r:'3',s:'♠'},{r:'Q',s:'♦'}], callAmount: "10.00", raiseAmount: "35.00 (All-in)", correctAction: "Raise", explanation: "Quinte Max (Nuts) sur la Turn. Relancer à tapis (Shove) ici est parfait pour extraire des Rois adverses." },
    { street: "TURN", pot: "26.00", villainPos: "BTN", villainStack: "70.00", villainAction: "18.00", heroPos: "BB", heroStack: "65.00", heroCards: [{r:'T',s:'♥'},{r:'9',s:'♥'}], board: [{r:'7',s:'♥'},{r:'8',s:'♥'},{r:'2',s:'♣'},{r:'A',s:'♦'}], callAmount: "18.00", raiseAmount: "65.00 (All-in)", correctAction: "Raise", explanation: "Tirage Quinte Flush par les deux bouts ! Relancer à tapis génère une Fold Equity massive." },
    { street: "TURN", pot: "18.50", villainPos: "UTG", villainStack: "40.00", villainAction: "Check", heroPos: "CO", heroStack: "50.00", heroCards: [{r:'9',s:'♦'},{r:'T',s:'♦'}], board: [{r:'T',s:'♣'},{r:'6',s:'♠'},{r:'2',s:'♥'},{r:'K',s:'♦'}], callAmount: "-", raiseAmount: "9.00", correctAction: "Check", explanation: "2ème paire. La Turn (Roi) touche énormément la range UTG. Check est la meilleure option pour contrôler la taille du pot." },
    { street: "TURN", pot: "42.00", villainPos: "CO", villainStack: "80.00", villainAction: "Check", heroPos: "BTN", heroStack: "75.00", heroCards: [{r:'2',s:'♠'},{r:'2',s:'♣'}], board: [{r:'A',s:'♥'},{r:'K',s:'♥'},{r:'Q',s:'♥'},{r:'J',s:'♥'}], callAmount: "-", raiseAmount: "20.00", correctAction: "Check", explanation: "4 cartes à cœur sur le board, complétant une quinte flush potentielle. Ta paire de 2 ne vaut rien. Check (give up)." },
    { street: "TURN", pot: "40.00", villainPos: "UTG", villainStack: "60.00", villainAction: "Check", heroPos: "BTN", heroStack: "80.00", heroCards: [{r:'4',s:'♥'},{r:'5',s:'♥'}], board: [{r:'A',s:'♠'},{r:'A',s:'♣'},{r:'K',s:'♦'},{r:'Q',s:'♠'}], callAmount: "-", raiseAmount: "20.00", correctAction: "Check", explanation: "Tu n'as rien, et le board est blindé de broadways. Un bluff ici se ferait attraper par n'importe quel As, Roi ou Dame. Check." },
    { street: "TURN", pot: "22.00", villainPos: "BB", villainStack: "45.00", villainAction: "Check", heroPos: "BTN", heroStack: "45.00", heroCards: [{r:'K',s:'♠'},{r:'K',s:'♦'}], board: [{r:'8',s:'♦'},{r:'9',s:'♠'},{r:'4',s:'♥'},{r:'2',s:'♣'}], callAmount: "-", raiseAmount: "14.50", correctAction: "Raise", explanation: "Tes Rois sont très vulnérables face à des cartes gratuites à la River. Il faut miser pour prendre de la value et protéger ta main." },

    // ==========================================
    // 3. RIVER : HERO CALLS, FOLDS & OVERBETS
    // ==========================================
    { street: "RIVER", pot: "60.00", villainPos: "UTG", villainStack: "60.00", villainAction: "80.00 (Overbet)", heroPos: "BTN", heroStack: "80.00", heroCards: [{r:'6',s:'♥'},{r:'7',s:'♥'}], board: [{r:'K',s:'♥'},{r:'J',s:'♥'},{r:'2',s:'♥'},{r:'2',s:'♠'},{r:'9',s:'♥'}], callAmount: "80.00", raiseAmount: "-", correctAction: "Fold", explanation: "Couleur complétée, mais le board est pairé (2-2). Face à un overbet massif, ta couleur hauteur 7 est broyée. Fold." },
    { street: "RIVER", pot: "50.00", villainPos: "BB", villainStack: "45.00", villainAction: "45.00 (Shove)", heroPos: "UTG", heroStack: "60.00", heroCards: [{r:'A',s:'♥'},{r:'A',s:'♦'}], board: [{r:'9',s:'♠'},{r:'8',s:'♠'},{r:'7',s:'♣'},{r:'6',s:'♥'},{r:'2',s:'♦'}], callAmount: "45.00", raiseAmount: "-", correctAction: "Fold", explanation: "Quatre cartes pour une quinte affichées. Tes As ne valent plus rien. Fold GTO." },
    { street: "RIVER", pot: "55.00", villainPos: "BB", villainStack: "50.00", villainAction: "50.00 (Shove)", heroPos: "SB", heroStack: "60.00", heroCards: [{r:'Q',s:'♠'},{r:'Q',s:'♦'}], board: [{r:'T',s:'♠'},{r:'8',s:'♠'},{r:'4',s:'♣'},{r:'3',s:'♥'},{r:'A',s:'♠'}], callAmount: "50.00", raiseAmount: "-", correctAction: "Fold", explanation: "L'As tombe à la River et complète les tirages piques. Tes Dames sont pulvérisées. Snap Fold." },
    { street: "RIVER", pot: "38.50", villainPos: "BTN", villainStack: "18.00", villainAction: "18.00 (Shove)", heroPos: "SB", heroStack: "40.00", heroCards: [{r:'A',s:'♦'},{r:'2',s:'♦'}], board: [{r:'K',s:'♠'},{r:'J',s:'♠'},{r:'4',s:'♦'},{r:'7',s:'♣'},{r:'2',s:'♣'}], callAmount: "18.00", raiseAmount: "-", correctAction: "Fold", explanation: "Tirage couleur raté. Minuscule Paire de 2. Give up logique. Fold." },
    { street: "RIVER", pot: "26.00", villainPos: "SB", villainStack: "45.00", villainAction: "20.00", heroPos: "MP", heroStack: "55.00", heroCards: [{r:'9',s:'♥'},{r:'8',s:'♥'}], board: [{r:'J',s:'♣'},{r:'9',s:'♠'},{r:'3',s:'♦'},{r:'2',s:'♣'},{r:'6',s:'♥'}], callAmount: "20.00", raiseAmount: "-", correctAction: "Fold", explanation: "Ta 2ème paire est un Bluff Catcher marginal. Fold standard sans historique." },
    { street: "RIVER", pot: "24.00", villainPos: "SB", villainStack: "30.00", villainAction: "Check", heroPos: "BB", heroStack: "40.00", heroCards: [{r:'A',s:'♣'},{r:'A',s:'♥'}], board: [{r:'7',s:'♠'},{r:'7',s:'♦'},{r:'7',s:'♣'},{r:'2',s:'♥'},{r:'K',s:'♠'}], callAmount: "-", raiseAmount: "12.00", correctAction: "Raise", explanation: "Tu as un Full (As par les 7). Vilain ne misera pas un K, mais il paiera. Value obligatoire !" },
    { street: "RIVER", pot: "32.00", villainPos: "HJ", villainStack: "40.00", villainAction: "Check", heroPos: "BTN", heroStack: "45.00", heroCards: [{r:'A',s:'♠'},{r:'A',s:'♣'}], board: [{r:'A',s:'♥'},{r:'K',s:'♦'},{r:'Q',s:'♠'},{r:'J',s:'♣'},{r:'2',s:'♥'}], callAmount: "-", raiseAmount: "15.00", correctAction: "Check", explanation: "Brelan d'As, mais la Quinte est sur le board. Miser est un suicide, seul un 'T' te paiera et tu perdras. Prends le Check gratuit." },
    { street: "RIVER", pot: "90.00", villainPos: "BB", villainStack: "15.00", villainAction: "Check", heroPos: "BTN", heroStack: "150.00", heroCards: [{r:'A',s:'♣'},{r:'K',s:'♣'}], board: [{r:'2',s:'♦'},{r:'3',s:'♥'},{r:'5',s:'♣'},{r:'6',s:'♠'},{r:'9',s:'♥'}], callAmount: "-", raiseAmount: "15.00", correctAction: "Check", explanation: "BB n'a que 15BB restantes. Faire tapis en bluff ne passera presque jamais car il est 'pot-committed'." },
    { street: "RIVER", pot: "42.00", villainPos: "CO", villainStack: "30.00", villainAction: "30.00 (Shove)", heroPos: "BB", heroStack: "55.00", heroCards: [{r:'A',s:'♣'},{r:'K',s:'♥'}], board: [{r:'J',s:'♦'},{r:'5',s:'♠'},{r:'4',s:'♥'},{r:'3',s:'♣'},{r:'2',s:'♦'}], callAmount: "30.00", raiseAmount: "-", correctAction: "Call", explanation: "La fameuse Quinte sur le board. Tu as l'As, donc tu joues le board. C'est un Chop évident, tu ne peux pas fold." },
    { street: "RIVER", pot: "85.00", villainPos: "UTG", villainStack: "0.00", villainAction: "40.00 (Shove)", heroPos: "BB", heroStack: "60.00", heroCards: [{r:'K',s:'♣'},{r:'Q',s:'♣'}], board: [{r:'T',s:'♣'},{r:'9',s:'♥'},{r:'J',s:'♦'},{r:'A',s:'♠'},{r:'2',s:'♥'}], callAmount: "40.00", raiseAmount: "-", correctAction: "Call", explanation: "Tu as la Quinte Max absolue (Nut Straight). Paye le tapis immédiatement !" },

    // ==========================================
    // 4. POTS 3-BET & SPOTS COMPLEXES
    // ==========================================
    { street: "FLOP", pot: "22.50", villainPos: "UTG", villainStack: "75.00", villainAction: "Check", heroPos: "BTN", heroStack: "75.00", heroCards: [{r:'A',s:'♠'},{r:'A',s:'♥'}], board: [{r:'K',s:'♠'},{r:'Q',s:'♠'},{r:'J',s:'♠'}], callAmount: "-", raiseAmount: "7.50", correctAction: "Check", explanation: "Pot 3-Bet. Board cauchemardesque monocolore et ultra connecté. Même avec les As, tu es en danger face à n'importe quel pique ou double paire. Contrôle le pot." },
    { street: "TURN", pot: "45.00", villainPos: "CO", villainStack: "55.00", villainAction: "25.00", heroPos: "SB", heroStack: "50.00", heroCards: [{r:'K',s:'♣'},{r:'K',s:'♦'}], board: [{r:'7',s:'♥'},{r:'3',s:'♣'},{r:'2',s:'♠'},{r:'A',s:'♦'}], callAmount: "25.00", raiseAmount: "50.00 (All-in)", correctAction: "Fold", explanation: "L'As tombe à la Turn dans un pot 4-Bet. Vilain envoie plus de la moitié du pot. Tes Rois ne battent plus qu'un bluff pur. Fold discipliné." },
    { street: "FLOP", pot: "18.00", villainPos: "BB", villainStack: "82.00", villainAction: "6.00", heroPos: "HJ", heroStack: "82.00", heroCards: [{r:'T',s:'♠'},{r:'T',s:'♥'}], board: [{r:'9',s:'♣'},{r:'4',s:'♦'},{r:'2',s:'♠'}], callAmount: "6.00", raiseAmount: "18.00", correctAction: "Call", explanation: "Vilain 'Donk bet' dans un pot 3-Bet sur un board très sec. Relancer ferait fuir ses bluffs et t'isolerait contre JJ+. Call est la ligne parfaite." },
    { street: "FLOP", pot: "4.50", villainPos: "BB", villainStack: "95.00", villainAction: "Check", heroPos: "SB", heroStack: "95.00", heroCards: [{r:'Q',s:'♥'},{r:'J',s:'♥'}], board: [{r:'8',s:'♣'},{r:'5',s:'♠'},{r:'2',s:'♦'}], callAmount: "-", raiseAmount: "1.50", correctAction: "Raise", explanation: "Guerre de blindes. Tu as raté, mais le board est très sec et tu as des overcards. Un petit C-Bet Bluff en SB fera passer des tonnes de mains à la BB." },
    { street: "TURN", pot: "14.00", villainPos: "SB", villainStack: "60.00", villainAction: "10.00", heroPos: "BB", heroStack: "65.00", heroCards: [{r:'A',s:'♦'},{r:'9',s:'♦'}], board: [{r:'K',s:'♣'},{r:'9',s:'♥'},{r:'4',s:'♠'},{r:'7',s:'♦'}], callAmount: "10.00", raiseAmount: "30.00", correctAction: "Call", explanation: "Tu as la 2ème paire + Top Kicker. La SB mise fort sur la Turn. Relancer est suicidaire, folder est weak face à une blinde. Call en bluff catcher." },
    { street: "RIVER", pot: "32.00", villainPos: "BB", villainStack: "45.00", villainAction: "45.00 (Shove)", heroPos: "SB", heroStack: "80.00", heroCards: [{r:'J',s:'♠'},{r:'T',s:'♠'}], board: [{r:'T',s:'♣'},{r:'8',s:'♥'},{r:'6',s:'♦'},{r:'4',s:'♠'},{r:'2',s:'♣'}], callAmount: "45.00", raiseAmount: "-", correctAction: "Fold", explanation: "Vilain overbet à tapis River. Top paire avec kicker moyen ne suffit presque jamais pour payer un shove pour 1.5x le pot. Give up." },
    { street: "FLOP", pot: "8.50", villainPos: "BTN", villainStack: "60.00", villainAction: "4.00", heroPos: "BB", heroStack: "60.00", heroCards: [{r:'7',s:'♣'},{r:'6',s:'♣'}], board: [{r:'T',s:'♣'},{r:'8',s:'♦'},{r:'2',s:'♣'}], callAmount: "4.00", raiseAmount: "14.00", correctAction: "Raise", explanation: "Tirage monstre : Gutshot + Flush draw. Hors position, Check-Raise est l'arme ultime pour maximiser la Fold Equity." },
    { street: "TURN", pot: "21.00", villainPos: "MP", villainStack: "40.00", villainAction: "Check", heroPos: "CO", heroStack: "50.00", heroCards: [{r:'A',s:'♥'},{r:'Q',s:'♥'}], board: [{r:'K',s:'♠'},{r:'J',s:'♦'},{r:'5',s:'♥'},{r:'4',s:'♥'}], callAmount: "-", raiseAmount: "14.00", correctAction: "Raise", explanation: "Double tirage énorme : Gutshot max (T) + Tirage couleur max. Vilain montre de la faiblesse, miser fort en semi-bluff est obligatoire." },
    { street: "RIVER", pot: "48.00", villainPos: "UTG", villainStack: "55.00", villainAction: "Check", heroPos: "BTN", heroStack: "70.00", heroCards: [{r:'9',s:'♠'},{r:'8',s:'♠'}], board: [{r:'A',s:'♥'},{r:'K',s:'♦'},{r:'6',s:'♣'},{r:'2',s:'♠'},{r:'2',s:'♥'}], callAmount: "-", raiseAmount: "35.00", correctAction: "Check", explanation: "Tirage raté. Le board contient A et K. UTG ne passera jamais une Top Paire face à une mise. Bluffer ici brûle de l'argent. Check." },
    { street: "PRE-FLOP", pot: "4.50", villainPos: "CO", villainStack: "95.00", villainAction: "2.50", heroPos: "BTN", heroStack: "100.00", heroCards: [{r:'A',s:'♠'},{r:'A',s:'♥'}], board: [], callAmount: "2.50", raiseAmount: "8.00", correctAction: "Raise", explanation: "Les As au bouton face à une ouverture du Cutoff. Toujours 3-Bet (relancer) pour value. Pas de slowplay preflop." },
    
    // ==========================================
    // 5. NOUVELLES SITUATIONS DE GESTION DE STACK (SHORT)
    // ==========================================
    { street: "FLOP", pot: "5.50", villainPos: "BB", villainStack: "12.00", villainAction: "Check", heroPos: "SB", heroStack: "18.00", heroCards: [{r:'K',s:'♠'},{r:'2',s:'♠'}], board: [{r:'K',s:'♣'},{r:'J',s:'♦'},{r:'7',s:'♥'}], callAmount: "-", raiseAmount: "12.00 (All-in)", correctAction: "Raise", explanation: "Les tapis sont très petits (Short Stack). Tu as Top Paire. Check ou faire une petite mise donne de l'équité gratuite. Fais tapis direct (Shove) !" },
    { street: "TURN", pot: "11.00", villainPos: "BTN", villainStack: "25.00", villainAction: "5.50", heroPos: "BB", heroStack: "15.00", heroCards: [{r:'8',s:'♣'},{r:'9',s:'♣'}], board: [{r:'T',s:'♣'},{r:'4',s:'♦'},{r:'2',s:'♠'},{r:'J',s:'♥'}], callAmount: "5.50", raiseAmount: "15.00 (All-in)", correctAction: "Raise", explanation: "Open Ended Straight Flush Draw sur un tout petit stack. Payé la moitié de ton stack pour un tirage est l'erreur classique. Pousse le reste au milieu (All-in) !" },
    { street: "FLOP", pot: "12.50", villainPos: "UTG", villainStack: "85.00", villainAction: "12.50 (Shove)", heroPos: "BB", heroStack: "72.50", heroCards: [{r:'7',s:'♠'},{r:'8',s:'♠'}], board: [{r:'K',s:'♥'},{r:'2',s:'♦'},{r:'5',s:'♣'}], callAmount: "12.50", raiseAmount: "-", correctAction: "Fold", explanation: "Face à un shove à hauteur du pot avec Hauteur 8 et un board rainbow, tu n'as aucune équité. Fold immédiat." },

    // ==========================================
    // 6. NOUVELLE VAGUE : 50 SCÉNARIOS GTO AVANCÉS
    // ==========================================
    
    // --- 3-Bet Pots & 4-Bet Pots ---
    { street: "FLOP", pot: "20.00", villainPos: "CO", villainStack: "85.00", villainAction: "6.50", heroPos: "BTN", heroStack: "85.00", heroCards: [{r:'J',s:'♠'},{r:'J',s:'♥'}], board: [{r:'Q',s:'♦'},{r:'7',s:'♣'},{r:'3',s:'♠'}], callAmount: "6.50", raiseAmount: "19.50", correctAction: "Call", explanation: "Pot 3-Bet préflop. CO C-Bet sur un board hauteur Dame. Tes Valets sont un excellent bluff catcher. Payer garde sa range de bluff (AK, AJ, T9s) intacte." },
    { street: "TURN", pot: "33.00", villainPos: "CO", villainStack: "78.50", villainAction: "16.00", heroPos: "BTN", heroStack: "78.50", heroCards: [{r:'J',s:'♠'},{r:'J',s:'♥'}], board: [{r:'Q',s:'♦'},{r:'7',s:'♣'},{r:'3',s:'♠'},{r:'2',s:'♥'}], callAmount: "16.00", raiseAmount: "45.00", correctAction: "Call", explanation: "Suite du spot précédent. La brique à la Turn ne change rien. Face à un 2-barrel standard de CO, tu dois continuer à call (float) tes paires intermédiaires hautes." },
    { street: "RIVER", pot: "65.00", villainPos: "CO", villainStack: "62.50", villainAction: "62.50 (Shove)", heroPos: "BTN", heroStack: "62.50", heroCards: [{r:'J',s:'♠'},{r:'J',s:'♥'}], board: [{r:'Q',s:'♦'},{r:'7',s:'♣'},{r:'3',s:'♠'},{r:'2',s:'♥'},{r:'K',s:'♦'}], callAmount: "62.50", raiseAmount: "-", correctAction: "Fold", explanation: "Un Roi terrible tombe River. CO fait tapis. Tes Valets ne battent plus aucun bluff logique. C'est un fold facile maintenant." },
    { street: "FLOP", pot: "45.00", villainPos: "UTG", villainStack: "70.00", villainAction: "15.00", heroPos: "BB", heroStack: "70.00", heroCards: [{r:'T',s:'♣'},{r:'T',s:'♠'}], board: [{r:'A',s:'♥'},{r:'K',s:'♦'},{r:'J',s:'♣'}], callAmount: "15.00", raiseAmount: "45.00", correctAction: "Fold", explanation: "Pot 4-Bet. UTG C-Bet petit sur A-K-J. Ta paire de 10 est broyée. Tu n'as même pas un bon tirage quinte face à sa range. Fold direct." },
    
    // --- River Hero Calls & Folds ---
    { street: "RIVER", pot: "40.00", villainPos: "BB", villainStack: "50.00", villainAction: "30.00", heroPos: "SB", heroStack: "60.00", heroCards: [{r:'9',s:'♥'},{r:'9',s:'♣'}], board: [{r:'T',s:'♠'},{r:'8',s:'♦'},{r:'3',s:'♣'},{r:'2',s:'♥'},{r:'2',s:'♠'}], callAmount: "30.00", raiseAmount: "-", correctAction: "Call", explanation: "Guerre de blindes. Tu as une 3ème paire. La BB mise fort. La ligne de BB sent le bluff raté (Tirage quinte 76s, QJ, J9). Call héroïque validé par le GTO." },
    { street: "RIVER", pot: "55.00", villainPos: "BTN", villainStack: "45.00", villainAction: "45.00 (Shove)", heroPos: "UTG", heroStack: "75.00", heroCards: [{r:'A',s:'♠'},{r:'A',s:'♣'}], board: [{r:'6',s:'♥'},{r:'7',s:'♥'},{r:'8',s:'♥'},{r:'9',s:'♥'},{r:'T',s:'♣'}], callAmount: "45.00", raiseAmount: "-", correctAction: "Fold", explanation: "Quinte à 4 cartes + 4 Cœurs au board. Tu as l'As de trèfle. Tes As valent zéro. C'est un fold." },
    { street: "RIVER", pot: "80.00", villainPos: "HJ", villainStack: "60.00", villainAction: "Check", heroPos: "CO", heroStack: "90.00", heroCards: [{r:'A',s:'♥'},{r:'3',s:'♥'}], board: [{r:'K',s:'♥'},{r:'Q',s:'♥'},{r:'T',s:'♣'},{r:'5',s:'♥'},{r:'5',s:'♠'}], callAmount: "-", raiseAmount: "35.00", correctAction: "Raise", explanation: "Tu as la Nut Flush. Le board a pairé à la River, HJ check. Il faut absolument extraire de la value (Thin Value) contre ses quintes (AJ) ou Brelans. Ne sois pas terrifié par le Full." },
    { street: "RIVER", pot: "30.00", villainPos: "BB", villainStack: "40.00", villainAction: "40.00 (Overbet)", heroPos: "BTN", heroStack: "45.00", heroCards: [{r:'K',s:'♣'},{r:'T',s:'♣'}], board: [{r:'T',s:'♥'},{r:'9',s:'♠'},{r:'4',s:'♦'},{r:'3',s:'♣'},{r:'A',s:'♦'}], callAmount: "40.00", raiseAmount: "-", correctAction: "Fold", explanation: "L'As tombe River. La BB fait un overbet All-in. Avec ta 2ème paire, tu es purement un Bluff Catcher contre une ligne ultra polarisée. Fold." },

    // --- Check-Raises Flop & Turn ---
    { street: "FLOP", pot: "6.50", villainPos: "BTN", villainStack: "95.00", villainAction: "2.00", heroPos: "BB", heroStack: "95.00", heroCards: [{r:'5',s:'♠'},{r:'4',s:'♠'}], board: [{r:'7',s:'♠'},{r:'6',s:'♦'},{r:'2',s:'♣'}], callAmount: "2.00", raiseAmount: "8.50", correctAction: "Raise", explanation: "Tirage quinte bilatérale (OESD) + Backdoor flush. BTN fait un petit C-bet. C'est l'heure de Check-Raise en semi-bluff pour prendre le contrôle du coup." },
    { street: "TURN", pot: "23.50", villainPos: "BTN", villainStack: "86.50", villainAction: "Check", heroPos: "BB", heroStack: "86.50", heroCards: [{r:'5',s:'♠'},{r:'4',s:'♠'}], board: [{r:'7',s:'♠'},{r:'6',s:'♦'},{r:'2',s:'♣'},{r:'K',s:'♠'}], callAmount: "-", raiseAmount: "15.00", correctAction: "Raise", explanation: "Tu as touché ton tirage couleur en plus de ton OESD. BTN a call ton Check-Raise flop et check la Turn. 2-Barrel massif obligatoire en semi-bluff !" },
    { street: "FLOP", pot: "8.00", villainPos: "CO", villainStack: "65.00", villainAction: "3.50", heroPos: "BB", heroStack: "70.00", heroCards: [{r:'A',s:'♦'},{r:'A',s:'♣'}], board: [{r:'8',s:'♠'},{r:'3',s:'♦'},{r:'2',s:'♥'}], callAmount: "3.50", raiseAmount: "11.00", correctAction: "Call", explanation: "Tu as slowplay tes As en BB. CO C-Bet sur un board ultra sec. Check-Raise ici le fera fuir. Le Check-Call est parfait pour le laisser bluffer la Turn." },
    { street: "TURN", pot: "15.00", villainPos: "CO", villainStack: "61.50", villainAction: "10.00", heroPos: "BB", heroStack: "66.50", heroCards: [{r:'A',s:'♦'},{r:'A',s:'♣'}], board: [{r:'8',s:'♠'},{r:'3',s:'♦'},{r:'2',s:'♥'},{r:'T',s:'♠'}], callAmount: "10.00", raiseAmount: "28.00", correctAction: "Raise", explanation: "CO continue son agression sur le T. Le board se connecte légèrement. C'est maintenant le moment de Check-Raise pour la Value et punir ses Top Paires (Tx) ou overpairs (JJ/QQ)." },

    // --- Multiway Spots (Gérés comme des HU complexes) ---
    { street: "FLOP", pot: "14.50", villainPos: "HJ", villainStack: "80.00", villainAction: "6.00", heroPos: "BTN", heroStack: "85.00", heroCards: [{r:'7',s:'♣'},{r:'7',s:'♦'}], board: [{r:'A',s:'♥'},{r:'K',s:'♣'},{r:'9',s:'♠'}], callAmount: "6.00", raiseAmount: "18.00", correctAction: "Fold", explanation: "Un C-Bet d'un joueur en position précoce (HJ) sur un board A-K-x qui frappe sa range de plein fouet. Tes 7 n'ont aucune chance." },
    { street: "FLOP", pot: "12.00", villainPos: "UTG", villainStack: "50.00", villainAction: "12.00", heroPos: "CO", heroStack: "65.00", heroCards: [{r:'Q',s:'♥'},{r:'Q',s:'♦'}], board: [{r:'J',s:'♣'},{r:'T',s:'♣'},{r:'8',s:'♠'}], callAmount: "12.00", raiseAmount: "35.00", correctAction: "Call", explanation: "UTG 'Pot' le flop sur J-T-8. Board hyper dangereux. Relancer tes Dames te commit contre mieux (Brelans, Quintes). Paye juste pour voir la Turn en position." },
    { street: "TURN", pot: "36.00", villainPos: "UTG", villainStack: "38.00", villainAction: "38.00 (Shove)", heroPos: "CO", heroStack: "53.00", heroCards: [{r:'Q',s:'♥'},{r:'Q',s:'♦'}], board: [{r:'J',s:'♣'},{r:'T',s:'♣'},{r:'8',s:'♠'},{r:'9',s:'♦'}], callAmount: "38.00", raiseAmount: "-", correctAction: "Call", explanation: "Boom ! La Quinte absolue tombe pour tes Dames (Q-J-T-9-8). Vilain fait tapis. C'est un snap-call de rêve." },

    // --- C-Bets et Pot Control en Position ---
    { street: "FLOP", pot: "7.00", villainPos: "BB", villainStack: "55.00", villainAction: "Check", heroPos: "BTN", heroStack: "70.00", heroCards: [{r:'A',s:'♣'},{r:'4',s:'♣'}], board: [{r:'K',s:'♦'},{r:'8',s:'♠'},{r:'3',s:'♥'}], callAmount: "-", raiseAmount: "2.50", correctAction: "Check", explanation: "Board Rainbow. Tu as hauteur As faible. La BB a beaucoup de Kx et de 8x ici. Le check-behind pour réaliser ton équité est meilleur qu'un C-bet systématique." },
    { street: "FLOP", pot: "9.00", villainPos: "BB", villainStack: "40.00", villainAction: "Check", heroPos: "HJ", heroStack: "60.00", heroCards: [{r:'J',s:'♠'},{r:'T',s:'♠'}], board: [{r:'K',s:'♠'},{r:'7',s:'♠'},{r:'2',s:'♦'}], callAmount: "-", raiseAmount: "4.50", correctAction: "Raise", explanation: "Tirage couleur hauteur Valet. C-Bet obligatoire en semi-bluff. Tu as énormément de fold equity face à des mains moyennes de la BB." },
    { street: "TURN", pot: "18.00", villainPos: "BB", villainStack: "35.50", villainAction: "Check", heroPos: "HJ", heroStack: "55.50", heroCards: [{r:'J',s:'♠'},{r:'T',s:'♠'}], board: [{r:'K',s:'♠'},{r:'7',s:'♠'},{r:'2',s:'♦'},{r:'Q',s:'♣'}], callAmount: "-", raiseAmount: "12.00", correctAction: "Raise", explanation: "Tu touches un OESD (Gutshot sur l'As ou OESD 9/A). Double tirage monstrueux. Double Barrel obligatoire en semi-bluff !" },
    { street: "RIVER", pot: "42.00", villainPos: "BB", villainStack: "23.50", villainAction: "23.50 (Shove)", heroPos: "HJ", heroStack: "43.50", heroCards: [{r:'J',s:'♠'},{r:'T',s:'♠'}], board: [{r:'K',s:'♠'},{r:'7',s:'♠'},{r:'2',s:'♦'},{r:'Q',s:'♣'},{r:'4',s:'♥'}], callAmount: "23.50", raiseAmount: "-", correctAction: "Fold", explanation: "Tout a raté. BB donk-shove. Tu n'as que Hauteur Valet. Facile : Fold." },

    // --- Défense de Blindes avancée ---
    { street: "FLOP", pot: "6.50", villainPos: "BTN", villainStack: "90.00", villainAction: "2.50", heroPos: "BB", heroStack: "90.00", heroCards: [{r:'T',s:'♦'},{r:'8',s:'♦'}], board: [{r:'J',s:'♣'},{r:'9',s:'♠'},{r:'3',s:'♦'}], callAmount: "2.50", raiseAmount: "8.50", correctAction: "Call", explanation: "OESD (Tirage quinte bilatérale) sur un board assez sec. Check-raise est envisageable, mais Check-call est très solide pour contrôler la variance hors position." },
    { street: "TURN", pot: "11.50", villainPos: "BTN", villainStack: "87.50", villainAction: "8.00", heroPos: "BB", heroStack: "87.50", heroCards: [{r:'T',s:'♦'},{r:'8',s:'♦'}], board: [{r:'J',s:'♣'},{r:'9',s:'♠'},{r:'3',s:'♦'},{r:'7',s:'♥'}], callAmount: "8.00", raiseAmount: "25.00", correctAction: "Raise", explanation: "Quinte max touchée ! Vilain continue de miser. C'est le moment de Check-Raise en force pour bâtir un énorme pot." },
    { street: "FLOP", pot: "8.00", villainPos: "UTG", villainStack: "100.00", villainAction: "4.50", heroPos: "BB", heroStack: "90.00", heroCards: [{r:'K',s:'♣'},{r:'9',s:'♣'}], board: [{r:'K',s:'♥'},{r:'T',s:'♦'},{r:'5',s:'♠'}], callAmount: "4.50", raiseAmount: "14.00", correctAction: "Call", explanation: "Top pair avec kicker faible/moyen hors position contre un open d'UTG. Interdiction de relancer. Check-Call classique." },
    { street: "TURN", pot: "17.00", villainPos: "UTG", villainStack: "95.50", villainAction: "12.00", heroPos: "BB", heroStack: "85.50", heroCards: [{r:'K',s:'♣'},{r:'9',s:'♣'}], board: [{r:'K',s:'♥'},{r:'T',s:'♦'},{r:'5',s:'♠'},{r:'A',s:'♣'}], callAmount: "12.00", raiseAmount: "35.00", correctAction: "Fold", explanation: "L'As tombe. UTG balance un 2ème barrel soutenu. Ton K9 est complètement dominé par sa range (AK, AQ, AT, AJ). Fold." },

    // --- Les "Monsters" Flop ---
    { street: "FLOP", pot: "15.00", villainPos: "HJ", villainStack: "60.00", villainAction: "Check", heroPos: "CO", heroStack: "65.00", heroCards: [{r:'4',s:'♠'},{r:'4',s:'♦'}], board: [{r:'K',s:'♠'},{r:'8',s:'♥'},{r:'4',s:'♣'}], callAmount: "-", raiseAmount: "6.00", correctAction: "Raise", explanation: "Brelan (Bottom Set) sur un board ultra sec. Si HJ a un Roi, il faut commencer à value dès maintenant." },
    { street: "TURN", pot: "27.00", villainPos: "HJ", villainStack: "54.00", villainAction: "Check", heroPos: "CO", heroStack: "59.00", heroCards: [{r:'4',s:'♠'},{r:'4',s:'♦'}], board: [{r:'K',s:'♠'},{r:'8',s:'♥'},{r:'4',s:'♣'},{r:'T',s:'♦'}], callAmount: "-", raiseAmount: "18.00", correctAction: "Raise", explanation: "2ème barrel avec ton Set. Le 'T' connecte un peu (QJ), tu dois charger les tirages et tirer de la value sur AK/KQ." },
    { street: "RIVER", pot: "63.00", villainPos: "HJ", villainStack: "36.00", villainAction: "Check", heroPos: "CO", heroStack: "41.00", heroCards: [{r:'4',s:'♠'},{r:'4',s:'♦'}], board: [{r:'K',s:'♠'},{r:'8',s:'♥'},{r:'4',s:'♣'},{r:'T',s:'♦'},{r:'2',s:'♠'}], callAmount: "-", raiseAmount: "36.00 (All-in)", correctAction: "Raise", explanation: "Brique River. Shove All-in ! HJ est commit s'il a un bon K ou deux paires. Maximum Value." },
    
    // --- Bluffs Catchers & OESD ---
    { street: "FLOP", pot: "12.00", villainPos: "CO", villainStack: "45.00", villainAction: "6.00", heroPos: "SB", heroStack: "50.00", heroCards: [{r:'8',s:'♥'},{r:'9',s:'♥'}], board: [{r:'J',s:'♦'},{r:'T',s:'♣'},{r:'3',s:'♠'}], callAmount: "6.00", raiseAmount: "18.00", correctAction: "Raise", explanation: "OESD (Tirage quinte bilatérale) sur un board J-T. Check-raise en semi-bluff hors position est excellent." },
    { street: "RIVER", pot: "48.00", villainPos: "BB", villainStack: "40.00", villainAction: "30.00", heroPos: "BTN", heroStack: "55.00", heroCards: [{r:'A',s:'♣'},{r:'T',s:'♣'}], board: [{r:'T',s:'♦'},{r:'8',s:'♠'},{r:'5',s:'♥'},{r:'2',s:'♣'},{r:'Q',s:'♦'}], callAmount: "30.00", raiseAmount: "-", correctAction: "Call", explanation: "Top Paire (au Flop) devenue 2ème paire. La ligne de BB (Check-call Flop/Turn puis Donk River) représente souvent un bluff arraché ou une Dame. Un vrai pro paiera souvent ici (Bluff Catcher)." },
    { street: "FLOP", pot: "18.50", villainPos: "UTG", villainStack: "85.00", villainAction: "Check", heroPos: "HJ", heroStack: "85.00", heroCards: [{r:'Q',s:'♠'},{r:'Q',s:'♦'}], board: [{r:'A',s:'♥'},{r:'K',s:'♦'},{r:'9',s:'♣'}], callAmount: "-", raiseAmount: "8.00", correctAction: "Check", explanation: "Tu as relancé Préflop, UTG a payé. Le board est A-K. Tes Dames sont de la poussière spatiale. Check pour la gratuité." },

    // --- ICM & Short Stack Scenarios ---
    { street: "FLOP", pot: "9.00", villainPos: "BTN", villainStack: "18.00", villainAction: "6.00", heroPos: "BB", heroStack: "22.00", heroCards: [{r:'K',s:'♣'},{r:'J',s:'♣'}], board: [{r:'K',s:'♥'},{r:'T',s:'♦'},{r:'5',s:'♠'}], callAmount: "6.00", raiseAmount: "22.00 (All-in)", correctAction: "Raise", explanation: "Short Stack. Top Pair avec bon kicker. Tu ne peux pas juste call et jouer la turn hors position avec ce SPR (Stack-to-Pot Ratio). Shove direct." },
    { street: "FLOP", pot: "14.00", villainPos: "SB", villainStack: "15.00", villainAction: "15.00 (Shove)", heroPos: "BB", heroStack: "30.00", heroCards: [{r:'6',s:'♠'},{r:'6',s:'♥'}], board: [{r:'Q',s:'♣'},{r:'J',s:'♦'},{r:'9',s:'♥'}], callAmount: "15.00", raiseAmount: "-", correctAction: "Fold", explanation: "Vilain shove sur un board Q-J-9. Tes 6 sont largement battus. Aucun call héroïque ici." },
    { street: "TURN", pot: "16.00", villainPos: "CO", villainStack: "20.00", villainAction: "Check", heroPos: "BTN", heroStack: "25.00", heroCards: [{r:'A',s:'♥'},{r:'T',s:'♥'}], board: [{r:'J',s:'♣'},{r:'8',s:'♠'},{r:'3',s:'♦'},{r:'7',s:'♥'}], callAmount: "-", raiseAmount: "20.00 (All-in)", correctAction: "Raise", explanation: "Short Stack. Tu as une ventrale (9), deux overcards et l'initiative. Faire tapis en semi-bluff est EV+ contre un CO capé." },

    // --- Flush Draws & Combo Draws ---
    { street: "FLOP", pot: "11.00", villainPos: "MP", villainStack: "75.00", villainAction: "4.50", heroPos: "BTN", heroStack: "80.00", heroCards: [{r:'K',s:'♠'},{r:'Q',s:'♠'}], board: [{r:'T',s:'♠'},{r:'8',s:'♠'},{r:'3',s:'♦'}], callAmount: "4.50", raiseAmount: "16.00", correctAction: "Raise", explanation: "Tirage couleur au Roi + 2 overcards (KQ). En position, relancer (Raise) te donne la Fold Equity et construit le pot si tu touches." },
    { street: "TURN", pot: "43.00", villainPos: "MP", villainStack: "59.00", villainAction: "25.00", heroPos: "BTN", heroStack: "64.00", heroCards: [{r:'K',s:'♠'},{r:'Q',s:'♠'}], board: [{r:'T',s:'♠'},{r:'8',s:'♠'},{r:'3',s:'♦'},{r:'7',s:'♥'}], callAmount: "25.00", raiseAmount: "64.00 (All-in)", correctAction: "Call", explanation: "Brique à la Turn. MP barrel fort. Faire tapis serait de l'overplay face à sa range très forte (Sets, Overpairs). Tu as les cotes directes/implicites pour juste Payer (Call)." },
    { street: "RIVER", pot: "93.00", villainPos: "MP", villainStack: "34.00", villainAction: "34.00 (Shove)", heroPos: "BTN", heroStack: "39.00", heroCards: [{r:'K',s:'♠'},{r:'Q',s:'♠'}], board: [{r:'T',s:'♠'},{r:'8',s:'♠'},{r:'3',s:'♦'},{r:'7',s:'♥'},{r:'2',s:'♠'}], callAmount: "34.00", raiseAmount: "-", correctAction: "Call", explanation: "Pique River ! Tu as la Flush K-High. Snap Call absolu contre le tapis de MP." },

    // --- Les Boards Pairés ---
    { street: "FLOP", pot: "8.50", villainPos: "BB", villainStack: "50.00", villainAction: "Check", heroPos: "UTG", heroStack: "50.00", heroCards: [{r:'A',s:'♣'},{r:'K',s:'♣'}], board: [{r:'J',s:'♦'},{r:'J',s:'♥'},{r:'4',s:'♠'}], callAmount: "-", raiseAmount: "2.50", correctAction: "Check", explanation: "Board pairé J-J-4. Un petit C-Bet est souvent utilisé, mais avec AK, Check-behind a d'excellentes propriétés pour bluffer ou attraper les bluffs Turn/River." },
    { street: "TURN", pot: "8.50", villainPos: "BB", villainStack: "50.00", villainAction: "5.00", heroPos: "UTG", heroStack: "50.00", heroCards: [{r:'A',s:'♣'},{r:'K',s:'♣'}], board: [{r:'J',s:'♦'},{r:'J',s:'♥'},{r:'4',s:'♠'},{r:'7',s:'♣'}], callAmount: "5.00", raiseAmount: "15.00", correctAction: "Call", explanation: "BB 'Probe bet' après ton check au flop. AK est le meilleur bluff catcher ici. Call." },
    { street: "RIVER", pot: "18.50", villainPos: "BB", villainStack: "45.00", villainAction: "15.00", heroPos: "UTG", heroStack: "45.00", heroCards: [{r:'A',s:'♣'},{r:'K',s:'♣'}], board: [{r:'J',s:'♦'},{r:'J',s:'♥'},{r:'4',s:'♠'},{r:'7',s:'♣'},{r:'2',s:'♦'}], callAmount: "15.00", raiseAmount: "-", correctAction: "Fold", explanation: "BB continue l'agression avec un 2ème barrel massif. Hauteur As (même AK) devient perdant sur le long terme ici. Fold." },

    // --- Les Pots Splittés & Chopped ---
    { street: "RIVER", pot: "50.00", villainPos: "SB", villainStack: "40.00", villainAction: "40.00 (Shove)", heroPos: "BB", heroStack: "60.00", heroCards: [{r:'2',s:'♣'},{r:'2',s:'♦'}], board: [{r:'A',s:'♠'},{r:'A',s:'♥'},{r:'K',s:'♦'},{r:'K',s:'♣'},{r:'Q',s:'♠'}], callAmount: "40.00", raiseAmount: "-", correctAction: "Fold", explanation: "Board : AA-KK-Q (Double paire Max avec kicker Q). Tes 2 sont annulés (Counterfeited). Le board joue la meilleure main à 5 cartes. Fold, tu joues le board et ne peux que split ou perdre." },
    { street: "RIVER", pot: "75.00", villainPos: "UTG", villainStack: "35.00", villainAction: "35.00 (Shove)", heroPos: "CO", heroStack: "55.00", heroCards: [{r:'A',s:'♥'},{r:'K',s:'♣'}], board: [{r:'T',s:'♠'},{r:'J',s:'♠'},{r:'Q',s:'♥'},{r:'K',s:'♦'},{r:'A',s:'♠'}], callAmount: "35.00", raiseAmount: "-", correctAction: "Call", explanation: "Board Quinte Max. Tu as aussi une quinte (AK) mais c'est celle du board qui compte. Tout le monde a Quinte. Tu dois Call pour récupérer la moitié du pot (Chop)." },

    // --- Pression Max (Multi-Barrels) ---
    { street: "FLOP", pot: "11.00", villainPos: "BB", villainStack: "75.00", villainAction: "Check", heroPos: "BTN", heroStack: "75.00", heroCards: [{r:'9',s:'♣'},{r:'8',s:'♣'}], board: [{r:'K',s:'♥'},{r:'4',s:'♦'},{r:'2',s:'♠'}], callAmount: "-", raiseAmount: "3.50", correctAction: "Raise", explanation: "C-Bet pur Bluff classique. Tu n'as rien, mais tu as l'avantage de la range au Bouton sur un board K-High." },
    { street: "TURN", pot: "18.00", villainPos: "BB", villainStack: "71.50", villainAction: "Check", heroPos: "BTN", heroStack: "71.50", heroCards: [{r:'9',s:'♣'},{r:'8',s:'♣'}], board: [{r:'K',s:'♥'},{r:'4',s:'♦'},{r:'2',s:'♠'},{r:'7',s:'♣'}], callAmount: "-", raiseAmount: "12.00", correctAction: "Raise", explanation: "Le 7 t'ouvre un Gutshot (Ventrale pour le 6). C'est la carte parfaite pour un Double Barrel (2nd Barrel) Bluff et virer les paires moyennes." },
    { street: "RIVER", pot: "42.00", villainPos: "BB", villainStack: "59.50", villainAction: "Check", heroPos: "BTN", heroStack: "59.50", heroCards: [{r:'9',s:'♣'},{r:'8',s:'♣'}], board: [{r:'K',s:'♥'},{r:'4',s:'♦'},{r:'2',s:'♠'},{r:'7',s:'♣'},{r:'Q',s:'♥'}], callAmount: "-", raiseAmount: "40.00", correctAction: "Raise", explanation: "Triple Barrel Bluff ! La Q est une excellente 'Scare Card' qui fait rentrer KQ ou des quintes. Un gros bet River force BB à fold tous ses petits Rois." },

    // --- Défense de blindes : Flop ---
    { street: "FLOP", pot: "5.50", villainPos: "BTN", villainStack: "90.00", villainAction: "2.00", heroPos: "BB", heroStack: "95.00", heroCards: [{r:'A',s:'♥'},{r:'5',s:'♥'}], board: [{r:'A',s:'♣'},{r:'J',s:'♦'},{r:'8',s:'♠'}], callAmount: "2.00", raiseAmount: "7.00", correctAction: "Call", explanation: "Top Pair avec Kicker faible (A5). BTN C-bet petit. Check-Call est la ligne standard pour ne pas t'isoler contre AQ/AK." },
    { street: "FLOP", pot: "7.50", villainPos: "CO", villainStack: "60.00", villainAction: "3.50", heroPos: "BB", heroStack: "75.00", heroCards: [{r:'6',s:'♠'},{r:'5',s:'♠'}], board: [{r:'T',s:'♥'},{r:'7',s:'♦'},{r:'2',s:'♣'}], callAmount: "3.50", raiseAmount: "12.00", correctAction: "Fold", explanation: "Aucun tirage solide, juste une ventrale poubelle (Gapper). Face à un C-Bet du CO, tu n'as pas l'équité requise. Fold." },
    { street: "FLOP", pot: "14.50", villainPos: "UTG", villainStack: "85.00", villainAction: "6.00", heroPos: "BB", heroStack: "80.00", heroCards: [{r:'Q',s:'♦'},{r:'J',s:'♦'}], board: [{r:'9',s:'♦'},{r:'8',s:'♦'},{r:'2',s:'♠'}], callAmount: "6.00", raiseAmount: "18.00", correctAction: "Raise", explanation: "Double tirage par les deux bouts + Tirage couleur max. C'est le spot de rêve pour un Check-Raise surpuissant contre l'UTG." },

    // --- Brelans Flopés (Sets) ---
    { street: "FLOP", pot: "8.00", villainPos: "HJ", villainStack: "70.00", villainAction: "4.00", heroPos: "BTN", heroStack: "70.00", heroCards: [{r:'3',s:'♣'},{r:'3',s:'♠'}], board: [{r:'A',s:'♥'},{r:'K',s:'♦'},{r:'3',s:'♥'}], callAmount: "4.00", raiseAmount: "14.00", correctAction: "Call", explanation: "Bottom Set sur un board A-K avec tirage couleur. Étonnamment, juste Payer (Call) en position est très GTO pour piéger les AK/AQ qui miseront Turn." },
    { street: "FLOP", pot: "13.00", villainPos: "BB", villainStack: "60.00", villainAction: "Check", heroPos: "UTG", heroStack: "65.00", heroCards: [{r:'A',s:'♠'},{r:'A',s:'♥'}], board: [{r:'A',s:'♦'},{r:'9',s:'♣'},{r:'4',s:'♠'}], callAmount: "-", raiseAmount: "4.00", correctAction: "Check", explanation: "Top Set absolu sur un board hyper dry (A-9-4). Tu bloques tous les As. Un petit Check-back pour laisser la BB toucher ou bluffer à la Turn est excellent." },

    // ==========================================
    // 7. VAGUE 3 : BLOQUEURS, FLOATS & 4-BET POTS (40 Spots)
    // ==========================================

    // --- Les Boards Monocolores (Monotone) ---
    { street: "FLOP", pot: "14.00", villainPos: "BTN", villainStack: "80.00", villainAction: "5.00", heroPos: "BB", heroStack: "80.00", heroCards: [{r:'A',s:'♣'},{r:'K',s:'♦'}], board: [{r:'T',s:'♥'},{r:'7',s:'♥'},{r:'4',s:'♥'}], callAmount: "5.00", raiseAmount: "16.00", correctAction: "Fold", explanation: "Board avec 3 cœurs. Tu as AK sans aucun cœur. BTN C-Bet petit. Tu n'as littéralement aucune équité de secours et tu es 'drawing dead' (ou presque) contre n'importe quel cœur. Fold direct." },
    { street: "FLOP", pot: "18.50", villainPos: "UTG", villainStack: "70.00", villainAction: "Check", heroPos: "CO", heroStack: "75.00", heroCards: [{r:'A',s:'♠'},{r:'A',s:'♣'}], board: [{r:'Q',s:'♦'},{r:'9',s:'♦'},{r:'5',s:'♦'}], callAmount: "-", raiseAmount: "6.00", correctAction: "Check", explanation: "Tu as les As, mais le board a 3 carreaux et tu n'en as pas. UTG check. Miser ici est dangereux car tu seras payé que par un carreau ou un brelan, et relancé par une couleur. Prends la carte gratuite (Pot control)." },
    { street: "TURN", pot: "26.00", villainPos: "UTG", villainStack: "70.00", villainAction: "12.00", heroPos: "CO", heroStack: "75.00", heroCards: [{r:'A',s:'♠'},{r:'A',s:'♣'}], board: [{r:'Q',s:'♦'},{r:'9',s:'♦'},{r:'5',s:'♦'},{r:'2',s:'♠'}], callAmount: "12.00", raiseAmount: "36.00", correctAction: "Call", explanation: "Suite du spot précédent. UTG 'Probe bet' la Turn. Tes As deviennent un pur Bluff Catcher face à quelqu'un qui arrache le pot avec le K ou l'As de carreau. Call." },
    { street: "RIVER", pot: "50.00", villainPos: "UTG", villainStack: "58.00", villainAction: "58.00 (Shove)", heroPos: "CO", heroStack: "63.00", heroCards: [{r:'A',s:'♠'},{r:'A',s:'♣'}], board: [{r:'Q',s:'♦'},{r:'9',s:'♦'},{r:'5',s:'♦'},{r:'2',s:'♠'},{r:'J',s:'♦'}], callAmount: "58.00", raiseAmount: "-", correctAction: "Fold", explanation: "Le 4ème carreau tombe. UTG fait tapis. Tes As sans carreau sont de la poussière. Snap Fold." },

    // --- Floats & Probes (Jeu avancé) ---
    { street: "FLOP", pot: "7.00", villainPos: "MP", villainStack: "90.00", villainAction: "2.50", heroPos: "BTN", heroStack: "90.00", heroCards: [{r:'A',s:'♣'},{r:'Q',s:'♦'}], board: [{r:'8',s:'♠'},{r:'5',s:'♥'},{r:'2',s:'♣'}], callAmount: "2.50", raiseAmount: "8.50", correctAction: "Call", explanation: "Tu as 2 overcards (AQ) en position sur un board très bas. Vilain fait un petit C-bet. Payer ici en position avec l'intention de bluffer la Turn si Vilain check s'appelle un 'Float'." },
    { street: "TURN", pot: "12.00", villainPos: "MP", villainStack: "87.50", villainAction: "Check", heroPos: "BTN", heroStack: "87.50", heroCards: [{r:'A',s:'♣'},{r:'Q',s:'♦'}], board: [{r:'8',s:'♠'},{r:'5',s:'♥'},{r:'2',s:'♣'},{r:'J',s:'♦'}], callAmount: "-", raiseAmount: "8.00", correctAction: "Raise", explanation: "Suite du Float ! Vilain montre de la faiblesse en checkant la Turn. Ton AQ n'a toujours rien, mais c'est l'heure d'attaquer le pot. Miser (Raise) ici est un 'Probe bet' très rentable." },
    { street: "FLOP", pot: "8.50", villainPos: "SB", villainStack: "45.00", villainAction: "Check", heroPos: "BB", heroStack: "60.00", heroCards: [{r:'K',s:'♥'},{r:'T',s:'♥'}], board: [{r:'A',s:'♣'},{r:'4',s:'♠'},{r:'2',s:'♦'}], callAmount: "-", raiseAmount: "3.50", correctAction: "Raise", explanation: "Guerre de blindes. SB check. Tu n'as rien, mais tu es en position sur le board le plus sec du jeu. Un petit bet (1/3 pot) vole ce coup 60% du temps." },

    // --- Les gros Pots 4-Bet (SPR faible) ---
    { street: "FLOP", pot: "45.00", villainPos: "CO", villainStack: "55.00", villainAction: "Check", heroPos: "BTN", heroStack: "55.00", heroCards: [{r:'J',s:'♠'},{r:'J',s:'♥'}], board: [{r:'T',s:'♣'},{r:'5',s:'♦'},{r:'3',s:'♠'}], callAmount: "-", raiseAmount: "15.00", correctAction: "Raise", explanation: "Pot 4-Bet ! Le SPR (Stack-to-Pot Ratio) est de 1. Tu as une overpair. Vilain check. Une petite mise de 1/3 pot suffit à te commit et extraire de la value de 99/88/AK." },
    { street: "TURN", pot: "75.00", villainPos: "CO", villainStack: "40.00", villainAction: "40.00 (Shove)", heroPos: "BTN", heroStack: "40.00", heroCards: [{r:'J',s:'♠'},{r:'J',s:'♥'}], board: [{r:'T',s:'♣'},{r:'5',s:'♦'},{r:'3',s:'♠'},{r:'Q',s:'♥'}], callAmount: "40.00", raiseAmount: "-", correctAction: "Fold", explanation: "Aïe. La Dame tombe, et Vilain fait tapis direct. Dans un pot 4-Bet, sa range contient presque toujours QQ, KK, AA, ou AQ. Tes Valets sont battus. C'est un fold." },
    { street: "FLOP", pot: "50.00", villainPos: "SB", villainStack: "70.00", villainAction: "15.00", heroPos: "BB", heroStack: "70.00", heroCards: [{r:'A',s:'♣'},{r:'K',s:'♣'}], board: [{r:'9',s:'♠'},{r:'8',s:'♥'},{r:'4',s:'♦'}], callAmount: "15.00", raiseAmount: "70.00 (All-in)", correctAction: "Fold", explanation: "Tu as 4-Bet AK préflop. SB fait un petit 'Donk Bet' au flop. Tu n'as touché ni paire ni tirage. Ne t'entête pas, l'abandon (Fold) est la seule voie ici." },

    // --- Importance des Bloqueurs à la River ---
    { street: "RIVER", pot: "65.00", villainPos: "BB", villainStack: "85.00", villainAction: "65.00", heroPos: "BTN", heroStack: "80.00", heroCards: [{r:'A',s:'♠'},{r:'T',s:'♥'}], board: [{r:'J',s:'♠'},{r:'9',s:'♠'},{r:'3',s:'♦'},{r:'2',s:'♠'},{r:'K',s:'♠'}], callAmount: "65.00", raiseAmount: "80.00 (All-in)", correctAction: "Raise", explanation: "4 piques sur le board. Tu as l'As de Pique (Le bloqueur ultime !). Tu sais que Vilain n'a pas la Flush max. C'est le spot rêvé pour relancer à tapis en Bluff ! Il passera toutes ses petites couleurs." },
    { street: "RIVER", pot: "40.00", villainPos: "UTG", villainStack: "50.00", villainAction: "30.00", heroPos: "CO", heroStack: "55.00", heroCards: [{r:'K',s:'♥'},{r:'Q',s:'♥'}], board: [{r:'T',s:'♦'},{r:'9',s:'♣'},{r:'8',s:'♠'},{r:'2',s:'♥'},{r:'A',s:'♣'}], callAmount: "30.00", raiseAmount: "-", correctAction: "Fold", explanation: "Tu as complètement raté ton tirage quinte par les deux bouts. Face à une grosse mise, tu n'as ni showdown value ni bloqueur pertinent pour bluffer. Fold." },
    { street: "RIVER", pot: "55.00", villainPos: "HJ", villainStack: "45.00", villainAction: "Check", heroPos: "BTN", heroStack: "60.00", heroCards: [{r:'Q',s:'♣'},{r:'J',s:'♣'}], board: [{r:'T',s:'♦'},{r:'9',s:'♠'},{r:'4',s:'♥'},{r:'3',s:'♦'},{r:'A',s:'♥'}], callAmount: "-", raiseAmount: "35.00", correctAction: "Raise", explanation: "Encore un tirage raté, mais tu as QJ ! Tu bloques toutes les suites possibles (KQ, J8). Vilain a check. Miser fort en Bluff ici a un taux de réussite énorme grâce à tes bloqueurs." },

    // --- Les C-Bets Difficiles (Mauvais Boards) ---
    { street: "FLOP", pot: "8.50", villainPos: "BB", villainStack: "90.00", villainAction: "Check", heroPos: "UTG", heroStack: "90.00", heroCards: [{r:'A',s:'♣'},{r:'K',s:'♥'}], board: [{r:'8',s:'♠'},{r:'7',s:'♠'},{r:'6',s:'♦'}], callAmount: "-", raiseAmount: "4.50", correctAction: "Check", explanation: "Tu as ouvert UTG avec AK. Le board 8-7-6 connecte à 100% avec la range de défense de la BB. C-better ici est du suicide. Check behind pour abandonner." },
    { street: "FLOP", pot: "9.00", villainPos: "BTN", villainStack: "100.00", villainAction: "Check", heroPos: "SB", heroStack: "100.00", heroCards: [{r:'A',s:'♦'},{r:'Q',s:'♦'}], board: [{r:'K',s:'♠'},{r:'J',s:'♣'},{r:'9',s:'♠'}], callAmount: "-", raiseAmount: "3.50", correctAction: "Check", explanation: "Pot 3-bet. Tu es hors position avec Gutshot + Overcard. Miser te commitrait trop face à un raise. Check pour contrôler le pot." },
    { street: "FLOP", pot: "11.00", villainPos: "BB", villainStack: "50.00", villainAction: "Check", heroPos: "CO", heroStack: "50.00", heroCards: [{r:'7',s:'♥'},{r:'7',s:'♦'}], board: [{r:'J',s:'♠'},{r:'T',s:'♥'},{r:'9',s:'♣'}], callAmount: "-", raiseAmount: "4.00", correctAction: "Check", explanation: "Board J-T-9. Tes 7 ont une valeur de showdown marginale mais ne battront jamais une main qui paie un bet. Check est la seule option saine." },

    // --- Squeezes & Défense ---
    { street: "PRE-FLOP", pot: "9.50", villainPos: "BTN", villainStack: "100.00", villainAction: "2.50", heroPos: "BB", heroStack: "100.00", heroCards: [{r:'T',s:'♠'},{r:'9',s:'♠'}], board: [], callAmount: "1.50", raiseAmount: "11.00", correctAction: "Raise", explanation: "CO open, BTN call. Tu es en BB avec T9s. C'est le spot idéal pour un 'Squeeze' (Gros 3-Bet). Tu as une main jouable et tu mets une pression maximale sur l'argent mort au milieu." },
    { street: "FLOP", pot: "23.50", villainPos: "BTN", villainStack: "89.00", villainAction: "Check", heroPos: "BB", heroStack: "89.00", heroCards: [{r:'T',s:'♠'},{r:'9',s:'♠'}], board: [{r:'A',s:'♦'},{r:'7',s:'♠'},{r:'2',s:'♥'}], callAmount: "-", raiseAmount: "7.00", correctAction: "Raise", explanation: "Suite du Squeeze. BTN a payé. Le Flop amène un As. C'est la carte parfaite à bluffer car elle tape en plein dans ta range de Squeeze (AK/AQ/AA). Petit C-Bet obligatoire." },

    // --- Exploiter la faiblesse (Donk Bets) ---
    { street: "FLOP", pot: "6.00", villainPos: "BB", villainStack: "60.00", villainAction: "2.00", heroPos: "BTN", heroStack: "75.00", heroCards: [{r:'A',s:'♥'},{r:'K',s:'♥'}], board: [{r:'Q',s:'♠'},{r:'6',s:'♦'},{r:'2',s:'♣'}], callAmount: "2.00", raiseAmount: "8.00", correctAction: "Call", explanation: "BB fait un Donk Bet minuscule (1/3 pot) sur un board anodin. Relancer avec rien est risqué. Payer (Call) avec 2 grosses overcards en position est très rentable." },
    { street: "TURN", pot: "10.00", villainPos: "BB", villainStack: "58.00", villainAction: "Check", heroPos: "BTN", heroStack: "73.00", heroCards: [{r:'A',s:'♥'},{r:'K',s:'♥'}], board: [{r:'Q',s:'♠'},{r:'6',s:'♦'},{r:'2',s:'♣'},{r:'J',s:'♥'}], callAmount: "-", raiseAmount: "6.00", correctAction: "Raise", explanation: "BB a abandonné son bluff et check la Turn. Le J t'offre un Gutshot (T) en plus des overcards. Punis-le en reprenant le pot avec une mise (Raise)." },

    // --- Hero Folds & Traps ---
    { street: "RIVER", pot: "75.00", villainPos: "UTG", villainStack: "80.00", villainAction: "65.00", heroPos: "HJ", heroStack: "90.00", heroCards: [{r:'K',s:'♠'},{r:'K',s:'♦'}], board: [{r:'A',s:'♥'},{r:'T',s:'♣'},{r:'8',s:'♠'},{r:'5',s:'♦'},{r:'3',s:'♥'}], callAmount: "65.00", raiseAmount: "-", correctAction: "Fold", explanation: "Pot 3-Bet. UTG a check-call 2 fois et envoie une praline énorme à la River. Tes Rois sont un Bluff Catcher horrible face à l'As au board. Snap Fold." },
    { street: "FLOP", pot: "14.50", villainPos: "BB", villainStack: "45.00", villainAction: "Check", heroPos: "CO", heroStack: "50.00", heroCards: [{r:'7',s:'♣'},{r:'7',s:'♥'}], board: [{r:'7',s:'♠'},{r:'7',s:'♦'},{r:'A',s:'♣'}], callAmount: "-", raiseAmount: "4.50", correctAction: "Check", explanation: "CARRÉ FLOppé (Quads) ! Tu as la main absolue (Nuts). Miser fera fuir 100% des mains de la BB. Check obligatoire pour le laisser toucher quelque chose ou bluffer la Turn." },
    { street: "TURN", pot: "14.50", villainPos: "BB", villainStack: "45.00", villainAction: "8.00", heroPos: "CO", heroStack: "50.00", heroCards: [{r:'7',s:'♣'},{r:'7',s:'♥'}], board: [{r:'7',s:'♠'},{r:'7',s:'♦'},{r:'A',s:'♣'},{r:'K',s:'♠'}], callAmount: "8.00", raiseAmount: "22.00", correctAction: "Call", explanation: "Le piège fonctionne. Le K donne peut-être une paire à Vilain qui mise 8 BB. Ne relance surtout pas (il passerait). Contente-toi de payer (Call) pour l'encourager à tout mettre River." },

    // --- Tirages Marginaux ---
    { street: "FLOP", pot: "9.00", villainPos: "CO", villainStack: "65.00", villainAction: "5.00", heroPos: "BTN", heroStack: "70.00", heroCards: [{r:'5',s:'♣'},{r:'6',s:'♣'}], board: [{r:'A',s:'♥'},{r:'9',s:'♠'},{r:'4',s:'♣'}], callAmount: "5.00", raiseAmount: "15.00", correctAction: "Fold", explanation: "Tu as un Gutshot (un 3 ou un 7 pour la quinte) et un backdoor flush. Face à un bet plus de la moitié du pot, l'équité est trop faible. Fold." },
    { street: "FLOP", pot: "12.00", villainPos: "MP", villainStack: "85.00", villainAction: "8.00", heroPos: "CO", heroStack: "90.00", heroCards: [{r:'T',s:'♥'},{r:'J',s:'♥'}], board: [{r:'K',s:'♠'},{r:'8',s:'♥'},{r:'2',s:'♦'}], callAmount: "8.00", raiseAmount: "24.00", correctAction: "Fold", explanation: "Absolument rien touché, juste un backdoor flush et quinte. MP bet cher (2/3 pot). On ne float pas face à de gros sizings avec rien. Fold." },

    // --- Les Petits Tapis (Push/Fold Flop) ---
    { street: "FLOP", pot: "10.00", villainPos: "BTN", villainStack: "16.00", villainAction: "Check", heroPos: "SB", heroStack: "18.00", heroCards: [{r:'A',s:'♠'},{r:'5',s:'♠'}], board: [{r:'T',s:'♣'},{r:'7',s:'♠'},{r:'3',s:'♠'}], callAmount: "-", raiseAmount: "18.00 (All-in)", correctAction: "Raise", explanation: "Short Stack. Tirage couleur au max (Nut Flush Draw). Hors position, le Shove (Tapis direct) est la seule option pour garantir de voir la Turn/River tout en générant de la Fold Equity." },
    { street: "FLOP", pot: "14.50", villainPos: "BB", villainStack: "20.00", villainAction: "10.00", heroPos: "UTG", heroStack: "22.00", heroCards: [{r:'9',s:'♥'},{r:'9',s:'♦'}], board: [{r:'Q',s:'♠'},{r:'8',s:'♣'},{r:'4',s:'♥'}], callAmount: "10.00", raiseAmount: "22.00 (All-in)", correctAction: "Fold", explanation: "BB donk-bet la moitié de son stack. Il est pot-committed. Ta 2ème paire ne fait pas le poids face à une Dame ou même un tirage qui aurait une bonne équité. Tu dois Fold." },

    // --- Bataille de grosses blindes (BvB) avancée ---
    { street: "FLOP", pot: "6.00", villainPos: "BB", villainStack: "55.00", villainAction: "Check", heroPos: "SB", heroStack: "60.00", heroCards: [{r:'K',s:'♠'},{r:'2',s:'♠'}], board: [{r:'K',s:'♦'},{r:'J',s:'♦'},{r:'9',s:'♣'}], callAmount: "-", raiseAmount: "2.00", correctAction: "Check", explanation: "Top Pair Kicker très faible sur un board hyper connecté (quintes/couleurs possibles). Tu es hors position. Le pot control par le Check est essentiel ici." },
    { street: "TURN", pot: "6.00", villainPos: "BB", villainStack: "55.00", villainAction: "4.50", heroPos: "SB", heroStack: "60.00", heroCards: [{r:'K',s:'♠'},{r:'2',s:'♠'}], board: [{r:'K',s:'♦'},{r:'J',s:'♦'},{r:'9',s:'♣'},{r:'6',s:'♥'}], callAmount: "4.50", raiseAmount: "13.50", correctAction: "Call", explanation: "BB 'probe bet' fort la Turn. Tu as toujours Top Paire. Tu ne peux pas fold, mais relancer est suicidaire car tu n'es payé que par mieux. Call (Bluff Catcher)." },
    { street: "RIVER", pot: "15.00", villainPos: "BB", villainStack: "50.50", villainAction: "12.00", heroPos: "SB", heroStack: "55.50", heroCards: [{r:'K',s:'♠'},{r:'2',s:'♠'}], board: [{r:'K',s:'♦'},{r:'J',s:'♦'},{r:'9',s:'♣'},{r:'6',s:'♥'},{r:'3',s:'♦'}], callAmount: "12.00", raiseAmount: "-", correctAction: "Fold", explanation: "La couleur (carreaux) rentre. BB envoie un énorme parpaing. Ton K2 ne vaut plus rien du tout. C'est un fold facile pour sauver tes jetons." },

    // --- Les spots de Full House ---
    { street: "FLOP", pot: "12.00", villainPos: "CO", villainStack: "75.00", villainAction: "Check", heroPos: "BTN", heroStack: "80.00", heroCards: [{r:'8',s:'♠'},{r:'8',s:'♣'}], board: [{r:'T',s:'♥'},{r:'T',s:'♦'},{r:'8',s:'♥'}], callAmount: "-", raiseAmount: "4.00", correctAction: "Check", explanation: "Tu as touché le Full House floppé (Les 8 par les 10). Vilain check. Si tu mises, tu vas effrayer 90% de ses mains. Check behind pour piéger." },
    { street: "TURN", pot: "12.00", villainPos: "CO", villainStack: "75.00", villainAction: "6.00", heroPos: "BTN", heroStack: "80.00", heroCards: [{r:'8',s:'♠'},{r:'8',s:'♣'}], board: [{r:'T',s:'♥'},{r:'T',s:'♦'},{r:'8',s:'♥'},{r:'A',s:'♠'}], callAmount: "6.00", raiseAmount: "18.00", correctAction: "Call", explanation: "L'As magique tombe. Vilain mise (il a souvent touché l'As). Il faut le garder en confiance. Contente-toi de payer (Call), tu pourras tout lui prendre à la River." },
    { street: "RIVER", pot: "24.00", villainPos: "CO", villainStack: "69.00", villainAction: "15.00", heroPos: "BTN", heroStack: "74.00", heroCards: [{r:'8',s:'♠'},{r:'8',s:'♣'}], board: [{r:'T',s:'♥'},{r:'T',s:'♦'},{r:'8',s:'♥'},{r:'A',s:'♠'},{r:'3',s:'♣'}], callAmount: "15.00", raiseAmount: "69.00 (All-in)", correctAction: "Raise", explanation: "Brique River. Vilain value son As. C'est l'heure du massacre : Relance le maximum possible (Shove/All-in) ! Il aura beaucoup de mal à lâcher son As." },

    // --- Spot extrême : 5-Bet Pot postflop ---
    { street: "FLOP", pot: "85.00", villainPos: "BB", villainStack: "55.00", villainAction: "15.00", heroPos: "UTG", heroStack: "55.00", heroCards: [{r:'A',s:'♣'},{r:'K',s:'♣'}], board: [{r:'7',s:'♠'},{r:'3',s:'♦'},{r:'2',s:'♥'}], callAmount: "15.00", raiseAmount: "55.00 (All-in)", correctAction: "Fold", explanation: "Pot gigantesque avant même le Flop. BB fait une toute petite mise sur un board 100% brique. Il a très souvent les As (AA) ou les Rois (KK) et veut t'attraper. Fold." },

    // --- Double Paire vulnérable ---
    { street: "FLOP", pot: "8.50", villainPos: "BTN", villainStack: "65.00", villainAction: "3.50", heroPos: "BB", heroStack: "70.00", heroCards: [{r:'J',s:'♣'},{r:'9',s:'♣'}], board: [{r:'J',s:'♦'},{r:'9',s:'♥'},{r:'8',s:'♦'}], callAmount: "3.50", raiseAmount: "12.00", correctAction: "Raise", explanation: "Tu as Top 2 Paires (J et 9) en BB face au BTN. Le board est DANGEREUX (tirages quinte Q, T, 7 et couleurs). Relance (Check-Raise) en force immédiatement pour te protéger." },
    { street: "TURN", pot: "32.50", villainPos: "BTN", villainStack: "53.00", villainAction: "18.00", heroPos: "BB", heroStack: "58.00", heroCards: [{r:'J',s:'♣'},{r:'9',s:'♣'}], board: [{r:'J',s:'♦'},{r:'9',s:'♥'},{r:'8',s:'♦'},{r:'Q',s:'♠'}], callAmount: "18.00", raiseAmount: "58.00 (All-in)", correctAction: "Call", explanation: "La Dame tombe. La quinte (T) est rentrée. BTN paie ton raise au flop et mise lourdement à la turn. Tu es passé de favori à Bluff Catcher. Juste payer (Call) est la limite, priant pour un Full River." },
    { street: "RIVER", pot: "68.50", villainPos: "BTN", villainStack: "35.00", villainAction: "35.00 (Shove)", heroPos: "BB", heroStack: "40.00", heroCards: [{r:'J',s:'♣'},{r:'9',s:'♣'}], board: [{r:'J',s:'♦'},{r:'9',s:'♥'},{r:'8',s:'♦'},{r:'Q',s:'♠'},{r:'4',s:'♦'}], callAmount: "35.00", raiseAmount: "-", correctAction: "Fold", explanation: "Le Carreaux tombe. Quinte affichée, couleur affichée. Ta double paire est officiellement carbonisée. Fold sans regret face au tapis." },

    // --- The Naked Ace Bluff (Bluff à l'As sec) ---
    { street: "RIVER", pot: "55.00", villainPos: "UTG", villainStack: "75.00", villainAction: "Check", heroPos: "BTN", heroStack: "85.00", heroCards: [{r:'A',s:'♥'},{r:'2',s:'♠'}], board: [{r:'T',s:'♥'},{r:'8',s:'♥'},{r:'5',s:'♣'},{r:'3',s:'♥'},{r:'K',s:'♥'}], callAmount: "-", raiseAmount: "45.00", correctAction: "Raise", explanation: "Il y a 4 Cœurs au board ! UTG check. Tu n'as rien, MAIS tu as l'As de Cœur en main. Tu possèdes la carte clé absolue (le bloqueur des Nuts). Envoie une énorme sacoche (Raise) en bluff, personne ne peut te payer sans la couleur max." },

    // ==========================================
    // 8. VAGUE 4 : PROBE BETS, DONK BETS & HERO CALLS EXTRÊMES (40 Spots)
    // ==========================================

    // --- Les Probe Bets (Attaquer la faiblesse à la Turn) ---
    { street: "TURN", pot: "5.50", villainPos: "BTN", villainStack: "90.00", villainAction: "Check", heroPos: "BB", heroStack: "95.00", heroCards: [{r:'K',s:'♠'},{r:'T',s:'♠'}], board: [{r:'J',s:'♦'},{r:'6',s:'♣'},{r:'2',s:'♥'},{r:'T',s:'♦'}], callAmount: "-", raiseAmount: "3.50", correctAction: "Raise", explanation: "Flop check-check. La Turn te donne la 2ème paire. BTN est capé (il aurait C-Bet un J ou mieux). C'est l'heure du 'Probe Bet' (Raise) pour extraire de la value des hauteurs As ou petites paires." },
    { street: "TURN", pot: "8.00", villainPos: "CO", villainStack: "85.00", villainAction: "Check", heroPos: "BB", heroStack: "90.00", heroCards: [{r:'Q',s:'♣'},{r:'9',s:'♣'}], board: [{r:'K',s:'♠'},{r:'7',s:'♦'},{r:'3',s:'♠'},{r:'4',s:'♣'}], callAmount: "-", raiseAmount: "5.50", correctAction: "Raise", explanation: "Flop check-check. Tu n'as que Hauteur Dame, mais CO a montré une grande faiblesse sur un board K-high. Un Probe Bet en pur bluff ici a un taux de réussite énorme." },
    { street: "TURN", pot: "12.50", villainPos: "SB", villainStack: "60.00", villainAction: "Check", heroPos: "BTN", heroStack: "70.00", heroCards: [{r:'A',s:'♥'},{r:'8',s:'♥'}], board: [{r:'9',s:'♣'},{r:'5',s:'♣'},{r:'2',s:'♦'},{r:'8',s:'♠'}], callAmount: "-", raiseAmount: "8.00", correctAction: "Raise", explanation: "Guerre de blindes. SB a check Flop et Turn. Tu touches la 2ème paire Top Kicker. Mise ('Delay C-Bet') pour Value face à des 5x, 2x ou des tirages." },

    // --- Les Donk Bets GTO (Prendre l'initiative OOP) ---
    { street: "FLOP", pot: "6.50", villainPos: "UTG", villainStack: "100.00", villainAction: "Check", heroPos: "BB", heroStack: "100.00", heroCards: [{r:'6',s:'♠'},{r:'5',s:'♠'}], board: [{r:'7',s:'♣'},{r:'4',s:'♣'},{r:'3',s:'♦'}], callAmount: "-", raiseAmount: "3.50", correctAction: "Raise", explanation: "Quinte floppée ! Le board (7-4-3) avantage énormément ta range de BB par rapport à UTG. C'est un des rares spots où un 'Donk Bet' (Miser en premier OOP) est GTO pour construire le pot." },
    { street: "FLOP", pot: "8.50", villainPos: "BTN", villainStack: "80.00", villainAction: "Check", heroPos: "BB", heroStack: "85.00", heroCards: [{r:'4',s:'♥'},{r:'4',s:'♦'}], board: [{r:'6',s:'♠'},{r:'5',s:'♠'},{r:'3',s:'♥'}], callAmount: "-", raiseAmount: "4.50", correctAction: "Raise", explanation: "Tirage quinte bilatérale par le bas + Paire. Le board connecte massivement avec ta range. Donk bet en semi-bluff est excellent pour paralyser les overcards du BTN." },

    // --- L'Art du "Float" (Payer pour bluffer plus tard) ---
    { street: "FLOP", pot: "7.00", villainPos: "MP", villainStack: "65.00", villainAction: "2.50", heroPos: "BTN", heroStack: "75.00", heroCards: [{r:'K',s:'♦'},{r:'Q',s:'♦'}], board: [{r:'T',s:'♠'},{r:'6',s:'♥'},{r:'2',s:'♣'}], callAmount: "2.50", raiseAmount: "8.50", correctAction: "Call", explanation: "MP C-Bet petit sur un board très sec. Tu as 2 excellentes overcards (KQ) avec des backdoor. Payer en position (Float) avec l'intention de bluffer si MP check la Turn est une arme redoutable." },
    { street: "TURN", pot: "12.00", villainPos: "MP", villainStack: "62.50", villainAction: "Check", heroPos: "BTN", heroStack: "72.50", heroCards: [{r:'K',s:'♦'},{r:'Q',s:'♦'}], board: [{r:'T',s:'♠'},{r:'6',s:'♥'},{r:'2',s:'♣'},{r:'4',s:'♠'}], callAmount: "-", raiseAmount: "8.00", correctAction: "Raise", explanation: "Suite du Float ! MP check la Turn (faiblesse). C'est l'heure de frapper : mise (Raise) pour lui faire folder toutes ses hauteurs As et petites paires." },

    // --- Squeezes & 3-Bets Light ---
    { street: "PRE-FLOP", pot: "5.50", villainPos: "BTN", villainStack: "100.00", villainAction: "2.50", heroPos: "SB", heroStack: "100.00", heroCards: [{r:'A',s:'♣'},{r:'5',s:'♣'}], board: [], callAmount: "2.00", raiseAmount: "9.50", correctAction: "Raise", explanation: "CO open, BTN call. En Petite Blinde avec A5 assortis, le 'Squeeze' (Gros 3-Bet bluff) est ultra GTO. Tu as un bloqueur sur les As, une bonne jouabilité post-flop, et beaucoup de Fold Equity." },
    { street: "FLOP", pot: "21.50", villainPos: "CO", villainStack: "90.50", villainAction: "Check", heroPos: "SB", heroStack: "90.50", heroCards: [{r:'A',s:'♣'},{r:'5',s:'♣'}], board: [{r:'K',s:'♠'},{r:'7',s:'♦'},{r:'2',s:'♥'}], callAmount: "-", raiseAmount: "6.50", correctAction: "Raise", explanation: "Suite du Squeeze. Seul CO a payé. Le board K-7-2 est parfait pour ta range de 3-Bet. Un petit C-Bet (1/3 pot) remportera le coup très souvent." },
    { street: "PRE-FLOP", pot: "3.50", villainPos: "BTN", villainStack: "100.00", villainAction: "2.50", heroPos: "BB", heroStack: "100.00", heroCards: [{r:'K',s:'♠'},{r:'T',s:'♠'}], board: [], callAmount: "1.50", raiseAmount: "10.00", correctAction: "Raise", explanation: "Bataille BTN vs BB. KTs est un peu faible pour juste payer hors position de manière passive, mais c'est une excellente main pour un 3-Bet polarisé (Raise)." },

    // --- Hero Calls Extrêmes (Hauteur As & Bottom Pair) ---
    { street: "RIVER", pot: "35.00", villainPos: "BB", villainStack: "40.00", villainAction: "25.00", heroPos: "BTN", heroStack: "65.00", heroCards: [{r:'A',s:'♠'},{r:'Q',s:'♥'}], board: [{r:'J',s:'♦'},{r:'8',s:'♣'},{r:'4',s:'♠'},{r:'3',s:'♥'},{r:'2',s:'♦'}], callAmount: "25.00", raiseAmount: "-", correctAction: "Call", explanation: "Tu as relancé Préflop, checké Flop et Turn. BB 'bombarde' la River. Beaucoup de tirages quintes ont raté (T9, KQ, 97). Hauteur As, Dame Kicker est souvent le meilleur Bluff Catcher ici." },
    { street: "RIVER", pot: "50.00", villainPos: "UTG", villainStack: "45.00", villainAction: "35.00", heroPos: "BB", heroStack: "55.00", heroCards: [{r:'5',s:'♣'},{r:'4',s:'♣'}], board: [{r:'A',s:'♥'},{r:'K',s:'♠'},{r:'J',s:'♦'},{r:'7',s:'♣'},{r:'4',s:'♥'}], callAmount: "35.00", raiseAmount: "-", correctAction: "Call", explanation: "UTG a checké Flop et Turn puis mise 70% du pot River. La ligne d'UTG ne fait aucun sens (il aurait misé A ou K plus tôt). Ta minuscule paire de 4 (Bottom Pair) suffit pour attraper ce bluff non-sensique." },
    { street: "RIVER", pot: "85.00", villainPos: "CO", villainStack: "60.00", villainAction: "60.00 (Shove)", heroPos: "BTN", heroStack: "90.00", heroCards: [{r:'T',s:'♥'},{r:'T',s:'♦'}], board: [{r:'A',s:'♣'},{r:'Q',s:'♣'},{r:'9',s:'♠'},{r:'8',s:'♥'},{r:'7',s:'♦'}], callAmount: "60.00", raiseAmount: "-", correctAction: "Fold", explanation: "Board ultra dangereux. CO fait tapis. Tes 10 ne battent littéralement plus rien d'autre qu'un pur suicide. Snap Fold." },

    // --- Batailles de Brelans et Sets over Sets ---
    { street: "FLOP", pot: "14.50", villainPos: "UTG", villainStack: "85.00", villainAction: "6.00", heroPos: "MP", heroStack: "90.00", heroCards: [{r:'8',s:'♥'},{r:'8',s:'♦'}], board: [{r:'A',s:'♠'},{r:'K',s:'♥'},{r:'8',s:'♣'}], callAmount: "6.00", raiseAmount: "18.00", correctAction: "Call", explanation: "Bottom Set sur A-K-8. C'est le spot idéal pour Slowplay ! Relancer ferait fuir toutes les mains moyennes. Payer (Call) garde UTG en confiance avec ses AK/AQ." },
    { street: "TURN", pot: "26.50", villainPos: "UTG", villainStack: "79.00", villainAction: "16.00", heroPos: "MP", heroStack: "84.00", heroCards: [{r:'8',s:'♥'},{r:'8',s:'♦'}], board: [{r:'A',s:'♠'},{r:'K',s:'♥'},{r:'8',s:'♣'},{r:'2',s:'♦'}], callAmount: "16.00", raiseAmount: "45.00", correctAction: "Raise", explanation: "Brique Turn. UTG double barrel. Fin du slowplay ! Il faut relancer fort (Raise) pour extraire le maximum d'un AK ou d'un brelan supérieur s'il te 'Set over Set' (ce qui arrive, c'est le poker)." },
    { street: "RIVER", pot: "116.50", villainPos: "UTG", villainStack: "34.00", villainAction: "34.00 (Shove)", heroPos: "MP", heroStack: "39.00", heroCards: [{r:'8',s:'♥'},{r:'8',s:'♦'}], board: [{r:'A',s:'♠'},{r:'K',s:'♥'},{r:'8',s:'♣'},{r:'2',s:'♦'},{r:'K',s:'♠'}], callAmount: "34.00", raiseAmount: "-", correctAction: "Call", explanation: "Le Roi double. UTG Shove. Tu as Full (8 par les Rois). Tu perds contre AA et KK, mais tu bats AK, KQ, KJs... C'est un 'Cooler' si tu perds, mais le Call est mathématiquement obligatoire." },

    // --- Bluffs à multiples Barrels ---
    { street: "FLOP", pot: "6.50", villainPos: "BB", villainStack: "70.00", villainAction: "Check", heroPos: "CO", heroStack: "70.00", heroCards: [{r:'J',s:'♠'},{r:'9',s:'♠'}], board: [{r:'K',s:'♦'},{r:'5',s:'♣'},{r:'2',s:'♥'}], callAmount: "-", raiseAmount: "2.50", correctAction: "Raise", explanation: "C-Bet Bluff. Tu n'as rien, mais tu as l'avantage de la range et l'initiative." },
    { street: "TURN", pot: "11.50", villainPos: "BB", villainStack: "67.50", villainAction: "Check", heroPos: "CO", heroStack: "67.50", heroCards: [{r:'J',s:'♠'},{r:'9',s:'♠'}], board: [{r:'K',s:'♦'},{r:'5',s:'♣'},{r:'2',s:'♥'},{r:'T',s:'♠'}], callAmount: "-", raiseAmount: "8.00", correctAction: "Raise", explanation: "Le T te donne un OESD (Tirage bilatéral 8 et Q). C'est l'équité parfaite pour envoyer un 2ème Barrel Bluff !" },
    { street: "RIVER", pot: "27.50", villainPos: "BB", villainStack: "59.50", villainAction: "Check", heroPos: "CO", heroStack: "59.50", heroCards: [{r:'J',s:'♠'},{r:'9',s:'♠'}], board: [{r:'K',s:'♦'},{r:'5',s:'♣'},{r:'2',s:'♥'},{r:'T',s:'♠'},{r:'7',s:'♥'}], callAmount: "-", raiseAmount: "22.00", correctAction: "Raise", explanation: "Tout a raté. BB a check. Si tu check, tu perds avec hauteur Valet. La seule façon de gagner ce coup face à une petite paire (5x, 7x) est d'envoyer le 3ème Barrel Bluff. Courage et mise." },

    // --- Value Thins River ---
    { street: "RIVER", pot: "40.00", villainPos: "BTN", villainStack: "60.00", villainAction: "Check", heroPos: "SB", heroStack: "65.00", heroCards: [{r:'Q',s:'♣'},{r:'J',s:'♣'}], board: [{r:'J',s:'♠'},{r:'T',s:'♥'},{r:'4',s:'♦'},{r:'3',s:'♣'},{r:'2',s:'♠'}], callAmount: "-", raiseAmount: "18.00", correctAction: "Raise", explanation: "Top Pair Kicker Dame. Vilain a check. Beau coup de 'Thin Value' : en misant environ un demi-pot, tu peux encore te faire payer par des 10x ou 99/88." },
    { street: "RIVER", pot: "35.00", villainPos: "BB", villainStack: "50.00", villainAction: "Check", heroPos: "HJ", heroStack: "70.00", heroCards: [{r:'K',s:'♠'},{r:'J',s:'♥'}], board: [{r:'A',s:'♦'},{r:'J',s:'♠'},{r:'9',s:'♣'},{r:'5',s:'♥'},{r:'4',s:'♦'}], callAmount: "-", raiseAmount: "12.00", correctAction: "Check", explanation: "2ème Paire (Valet). Vilain check. Si tu mises ici, aucune main moins bonne que la tienne ne te paiera (un 9 passera). Par contre, un As te paiera toujours. Check behind pour le Showdown." },

    // --- ICM & Survie (Short Stack 10-15bb) ---
    { street: "PRE-FLOP", pot: "2.50", villainPos: "CO", villainStack: "45.00", villainAction: "2.50", heroPos: "BTN", heroStack: "14.00", heroCards: [{r:'A',s:'♥'},{r:'7',s:'♥'}], board: [], callAmount: "2.50", raiseAmount: "14.00 (All-in)", correctAction: "Raise", explanation: "Tu as 14 blindes. CO ouvre. A7 assortis est beaucoup trop fort pour passer, mais trop dangereux à jouer post-flop avec si peu de profondeur. Resteal All-in (Shove) direct !" },
    { street: "FLOP", pot: "7.00", villainPos: "SB", villainStack: "12.00", villainAction: "Check", heroPos: "BB", heroStack: "15.00", heroCards: [{r:'Q',s:'♠'},{r:'T',s:'♠'}], board: [{r:'J',s:'♥'},{r:'8',s:'♣'},{r:'2',s:'♦'}], callAmount: "-", raiseAmount: "15.00 (All-in)", correctAction: "Raise", explanation: "Bataille de blindes en short stack. Tu as OESD + 2 Overcards. Avec le SPR actuel, miser petit ne sert à rien. Fais tapis pour maximiser la Fold Equity ou jouer ton tirage 2 fois." },
    { street: "FLOP", pot: "15.00", villainPos: "BTN", villainStack: "11.00", villainAction: "11.00 (Shove)", heroPos: "BB", heroStack: "25.00", heroCards: [{r:'A',s:'♦'},{r:'4',s:'♦'}], board: [{r:'K',s:'♠'},{r:'Q',s:'♥'},{r:'3',s:'♣'}], callAmount: "11.00", raiseAmount: "-", correctAction: "Fold", explanation: "Tu as défendu ta blinde, mais le flop a raté. BTN Shove. Même si c'est 'seulement' 11bb, tu n'as rien qu'une hauteur As sale. Fold." },

    // --- Les Boards Pairés (Suite) ---
    { street: "FLOP", pot: "9.00", villainPos: "HJ", villainStack: "85.00", villainAction: "4.00", heroPos: "BTN", heroStack: "90.00", heroCards: [{r:'T',s:'♣'},{r:'T',s:'♦'}], board: [{r:'9',s:'♠'},{r:'9',s:'♥'},{r:'4',s:'♣'}], callAmount: "4.00", raiseAmount: "12.00", correctAction: "Call", explanation: "Overpair sur board pairé. HJ C-bet. Relancer va l'isoler sur ses brelans (9x) et overpairs meilleures (JJ+). Call est la ligne la plus sûre." },
    { street: "TURN", pot: "17.00", villainPos: "HJ", villainStack: "81.00", villainAction: "10.00", heroPos: "BTN", heroStack: "86.00", heroCards: [{r:'T',s:'♣'},{r:'T',s:'♦'}], board: [{r:'9',s:'♠'},{r:'9',s:'♥'},{r:'4',s:'♣'},{r:'2',s:'♦'}], callAmount: "10.00", raiseAmount: "30.00", correctAction: "Call", explanation: "Brique Turn. HJ continue l'agression. Tes 10 sont de très bons Bluff Catchers contre AQ/AK/KQ qui s'entêtent. Call encore." },
    { street: "RIVER", pot: "37.00", villainPos: "HJ", villainStack: "71.00", villainAction: "30.00", heroPos: "BTN", heroStack: "76.00", heroCards: [{r:'T',s:'♣'},{r:'T',s:'♦'}], board: [{r:'9',s:'♠'},{r:'9',s:'♥'},{r:'4',s:'♣'},{r:'2',s:'♦'},{r:'A',s:'♥'}], callAmount: "30.00", raiseAmount: "-", correctAction: "Fold", explanation: "L'As River est terrible. Toutes ses mains de bluff (AK, AQ) viennent de te passer devant. Face à ce 3ème barrel, les 10 doivent passer. Fold." },

    // --- Défense face aux Donk Bets marginaux ---
    { street: "FLOP", pot: "11.50", villainPos: "BB", villainStack: "50.00", villainAction: "3.00", heroPos: "UTG", heroStack: "60.00", heroCards: [{r:'A',s:'♥'},{r:'K',s:'♥'}], board: [{r:'T',s:'♠'},{r:'5',s:'♣'},{r:'3',s:'♦'}], callAmount: "3.00", raiseAmount: "12.00", correctAction: "Call", explanation: "La BB fait un Donk Bet minuscule (1/4 pot). Relancer AK sans tirage est trop ambitieux, mais l'équité de tes 2 overcards suffit largement pour juste Payer ce petit bet." },
    { street: "TURN", pot: "17.50", villainPos: "BB", villainStack: "47.00", villainAction: "15.00", heroPos: "UTG", heroStack: "57.00", heroCards: [{r:'A',s:'♥'},{r:'K',s:'♥'}], board: [{r:'T',s:'♠'},{r:'5',s:'♣'},{r:'3',s:'♦'},{r:'Q',s:'♥'}], callAmount: "15.00", raiseAmount: "47.00 (All-in)", correctAction: "Fold", explanation: "BB envoie un vrai bet pot à la Turn. Tu as récupéré un Gutshot (J), mais les cotes sont affreuses. Fold." },
    
    // --- Scénarios "Coolers" Post-flop ---
    { street: "FLOP", pot: "22.00", villainPos: "CO", villainStack: "85.00", villainAction: "10.00", heroPos: "BTN", heroStack: "90.00", heroCards: [{r:'8',s:'♣'},{r:'8',s:'♠'}], board: [{r:'J',s:'♦'},{r:'8',s:'♥'},{r:'6',s:'♦'}], callAmount: "10.00", raiseAmount: "32.00", correctAction: "Raise", explanation: "Middle Set (Brelan de 8). Le board est super drawy (tirages couleur et quinte T9). Tu ne dois SURTOUT PAS slowplay ici. Relance (Raise) lourdement pour charger les tirages et AJ/KJ." },
    { street: "TURN", pot: "86.00", villainPos: "CO", villainStack: "43.00", villainAction: "43.00 (Shove)", heroPos: "BTN", heroStack: "58.00", heroCards: [{r:'8',s:'♣'},{r:'8',s:'♠'}], board: [{r:'J',s:'♦'},{r:'8',s:'♥'},{r:'6',s:'♦'},{r:'7',s:'♦'}], callAmount: "43.00", raiseAmount: "-", correctAction: "Call", explanation: "Pire carte possible (7♦ complète la flush et la quinte T9). CO Shove. Même si la carte est horrible, tu as les cotes pour payer au cas où il s'enflamme avec 2 paires, et tu as 10 outs pour faire Full River s'il a déjà Quinte/Couleur. Snap Call (Cooler si tu perds)." },

    // --- Les Check-Raises Bluff (Balancing) ---
    { street: "FLOP", pot: "8.50", villainPos: "BTN", villainStack: "90.00", villainAction: "4.00", heroPos: "BB", heroStack: "90.00", heroCards: [{r:'J',s:'♣'},{r:'T',s:'♣'}], board: [{r:'A',s:'♥'},{r:'5',s:'♠'},{r:'2',s:'♦'}], callAmount: "4.00", raiseAmount: "14.00", correctAction: "Fold", explanation: "Rien touché, pas de backdoor, face à un C-Bet sur un board A-High sec. Vouloir Check-Raise en bluff pur ici est une erreur de débutant (tu ne représentes rien). Fold." },
    { street: "FLOP", pot: "8.50", villainPos: "BTN", villainStack: "90.00", villainAction: "3.50", heroPos: "BB", heroStack: "90.00", heroCards: [{r:'8',s:'♠'},{r:'7',s:'♠'}], board: [{r:'K',s:'♠'},{r:'5',s:'♦'},{r:'4',s:'♠'}], callAmount: "3.50", raiseAmount: "13.00", correctAction: "Raise", explanation: "Flush Draw + Gutshot (6). L'équité est énorme. Face à un petit C-bet, Check-Raise en Semi-Bluff est exceptionnel pour équilibrer tes value bets avec tes tirages." },
    
    // --- L'art de jouer les As (AA) sur des boards dangereux ---
    { street: "FLOP", pot: "14.00", villainPos: "BB", villainStack: "85.00", villainAction: "6.00", heroPos: "UTG", heroStack: "90.00", heroCards: [{r:'A',s:'♣'},{r:'A',s:'♠'}], board: [{r:'Q',s:'♥'},{r:'J',s:'♥'},{r:'T',s:'♦'}], callAmount: "6.00", raiseAmount: "22.00", correctAction: "Call", explanation: "Pot Single Raised. BB Donk bet sur le pire board possible (Q-J-T). Relancer avec les As t'isole contre double paires, brelans et quintes. Payer pour pot control et voir une Turn est vital." },
    { street: "TURN", pot: "26.00", villainPos: "BB", villainStack: "79.00", villainAction: "16.00", heroPos: "UTG", heroStack: "84.00", heroCards: [{r:'A',s:'♣'},{r:'A',s:'♠'}], board: [{r:'Q',s:'♥'},{r:'J',s:'♥'},{r:'T',s:'♦'},{r:'7',s:'♥'}], callAmount: "16.00", raiseAmount: "45.00", correctAction: "Fold", explanation: "La couleur (Cœur) rentre. BB continue d'envoyer fort. Tes As rouges sont morts et enterrés. Fold !" },

    // --- Les Limped Pots (BvB passif) ---
    { street: "FLOP", pot: "2.00", villainPos: "SB", villainStack: "99.00", villainAction: "Check", heroPos: "BB", heroStack: "99.00", heroCards: [{r:'J',s:'♦'},{r:'5',s:'♠'}], board: [{r:'J',s:'♣'},{r:'8',s:'♥'},{r:'2',s:'♦'}], callAmount: "-", raiseAmount: "1.50", correctAction: "Raise", explanation: "Pot limpé. Tu as touché Top Paire. Même avec un mauvais kicker, il faut miser (Raise) pour protéger l'équité face à n'importe quelle overcard adverse." },
    { street: "FLOP", pot: "2.00", villainPos: "SB", villainStack: "99.00", villainAction: "1.50", heroPos: "BB", heroStack: "99.00", heroCards: [{r:'K',s:'♥'},{r:'4',s:'♦'}], board: [{r:'Q',s:'♣'},{r:'9',s:'♠'},{r:'5',s:'♥'}], callAmount: "1.50", raiseAmount: "4.50", correctAction: "Fold", explanation: "Pot limpé. SB 'Donk bet'. Tu n'as que Hauteur Roi sans tirage. On ne s'accroche pas dans un pot limpé sans équité. Fold." },
    
    // --- Les spots de Squeeze en position ---
    { street: "PRE-FLOP", pot: "6.50", villainPos: "CO", villainStack: "100.00", villainAction: "2.50", heroPos: "BTN", heroStack: "100.00", heroCards: [{r:'Q',s:'♠'},{r:'J',s:'♠'}], board: [], callAmount: "2.50", raiseAmount: "9.00", correctAction: "Call", explanation: "MP open, CO call. En position avec QJs, le call est très fluide pour jouer post-flop en position. Squeezer est possible mais Call permet d'attraper des ranges dominées au flop." },
    { street: "FLOP", pot: "9.00", villainPos: "CO", villainStack: "97.50", villainAction: "Check", heroPos: "BTN", heroStack: "97.50", heroCards: [{r:'Q',s:'♠'},{r:'J',s:'♠'}], board: [{r:'Q',s:'♥'},{r:'T',s:'♦'},{r:'4',s:'♣'}], callAmount: "-", raiseAmount: "5.50", correctAction: "Raise", explanation: "Top Paire + Gutshot Backdoor. Tout le monde a checké. C'est l'heure de miser pour Value et Protection." },

    // --- Nouveaux Scenarios Multiway (3-way) ---
    { street: "FLOP", pot: "18.00", villainPos: "CO", villainStack: "68.00", villainAction: "7.00", heroPos: "BTN", heroStack: "72.00", heroCards: [{r:'A',s:'♣'},{r:'Q',s:'♣'}], board: [{r:'A',s:'♦'},{r:'7',s:'♠'},{r:'2',s:'♥'}], callAmount: "7.00", raiseAmount: "20.00", correctAction: "Call", explanation: "Spot 3-way: CO mise dans deux joueurs. Avec Top Pair bon kicker mais sans redraw massif, call garde les bluffs de CO et evite de s'isoler contre mieux.", players: [{pos:'UTG',role:'other',inHand:false,stack:'80.00'},{pos:'MP',role:'other',inHand:false,stack:'76.00'},{pos:'HJ',role:'other',inHand:false,stack:'82.00'},{pos:'CO',role:'villain',inHand:true,stack:'68.00'},{pos:'BTN',role:'hero',inHand:true,stack:'72.00'},{pos:'SB',role:'other',inHand:true,stack:'75.00'},{pos:'BB',role:'other',inHand:false,stack:'88.00'}] },
    { street: "TURN", pot: "32.00", villainPos: "BB", villainStack: "58.00", villainAction: "18.00", heroPos: "CO", heroStack: "64.00", heroCards: [{r:'K',s:'♠'},{r:'Q',s:'♠'}], board: [{r:'Q',s:'♥'},{r:'J',s:'♦'},{r:'5',s:'♣'},{r:'2',s:'♣'}], callAmount: "18.00", raiseAmount: "50.00", correctAction: "Fold", explanation: "Multiway turn: la grosse mise de BB dans deux joueurs est souvent tres orientee value. Top paire devient trop fragile ici, fold est discipliné.", players: [{pos:'UTG',role:'other',inHand:false,stack:'90.00'},{pos:'MP',role:'other',inHand:false,stack:'84.00'},{pos:'HJ',role:'other',inHand:false,stack:'78.00'},{pos:'CO',role:'hero',inHand:true,stack:'64.00'},{pos:'BTN',role:'other',inHand:true,stack:'61.00'},{pos:'SB',role:'other',inHand:false,stack:'73.00'},{pos:'BB',role:'villain',inHand:true,stack:'58.00'}] },
    { street: "RIVER", pot: "54.00", villainPos: "UTG", villainStack: "70.00", villainAction: "40.00 (Overbet)", heroPos: "HJ", heroStack: "74.00", heroCards: [{r:'A',s:'♥'},{r:'J',s:'♥'}], board: [{r:'K',s:'♥'},{r:'T',s:'♣'},{r:'6',s:'♠'},{r:'6',s:'♦'},{r:'3',s:'♣'}], callAmount: "40.00", raiseAmount: "-", correctAction: "Fold", explanation: "Overbet river en 3-way: le pool bluffe moins souvent. Meme avec As hauteur showdown, fold reste la ligne EV+.", players: [{pos:'UTG',role:'villain',inHand:true,stack:'70.00'},{pos:'MP',role:'other',inHand:false,stack:'66.00'},{pos:'HJ',role:'hero',inHand:true,stack:'74.00'},{pos:'CO',role:'other',inHand:true,stack:'49.00'},{pos:'BTN',role:'other',inHand:false,stack:'80.00'},{pos:'SB',role:'other',inHand:false,stack:'63.00'},{pos:'BB',role:'other',inHand:false,stack:'77.00'}] },
    { street: "FLOP", pot: "12.00", villainPos: "MP", villainStack: "62.00", villainAction: "Check", heroPos: "BTN", heroStack: "68.00", heroCards: [{r:'9',s:'♠'},{r:'8',s:'♠'}], board: [{r:'K',s:'♣'},{r:'7',s:'♠'},{r:'6',s:'♦'}], callAmount: "-", raiseAmount: "4.50", correctAction: "Raise", explanation: "Tu as open ended straight draw en position et deux ranges qui montrent de la faiblesse. Bet petit est excellent en semi-bluff multiway.", players: [{pos:'UTG',role:'other',inHand:false,stack:'86.00'},{pos:'MP',role:'villain',inHand:true,stack:'62.00'},{pos:'HJ',role:'other',inHand:false,stack:'71.00'},{pos:'CO',role:'other',inHand:false,stack:'69.00'},{pos:'BTN',role:'hero',inHand:true,stack:'68.00'},{pos:'SB',role:'other',inHand:false,stack:'74.00'},{pos:'BB',role:'other',inHand:true,stack:'59.00'}] },
    { street: "TURN", pot: "25.00", villainPos: "CO", villainStack: "44.00", villainAction: "Check", heroPos: "BB", heroStack: "52.00", heroCards: [{r:'A',s:'♥'},{r:'5',s:'♥'}], board: [{r:'K',s:'♥'},{r:'J',s:'♣'},{r:'7',s:'♥'},{r:'4',s:'♦'}], callAmount: "-", raiseAmount: "16.00", correctAction: "Raise", explanation: "Avec nut flush draw + As hauteur et deux joueurs capes, le probe turn met une grosse pression et construit un pot quand tu hit.", players: [{pos:'UTG',role:'other',inHand:false,stack:'60.00'},{pos:'MP',role:'other',inHand:false,stack:'63.00'},{pos:'HJ',role:'other',inHand:false,stack:'57.00'},{pos:'CO',role:'villain',inHand:true,stack:'44.00'},{pos:'BTN',role:'other',inHand:true,stack:'49.00'},{pos:'SB',role:'other',inHand:false,stack:'58.00'},{pos:'BB',role:'hero',inHand:true,stack:'52.00'}] },
    { street: "RIVER", pot: "70.00", villainPos: "BB", villainStack: "30.00", villainAction: "30.00 (Shove)", heroPos: "BTN", heroStack: "64.00", heroCards: [{r:'A',s:'♠'},{r:'K',s:'♠'}], board: [{r:'A',s:'♦'},{r:'A',s:'♣'},{r:'9',s:'♥'},{r:'6',s:'♠'},{r:'2',s:'♦'}], callAmount: "30.00", raiseAmount: "-", correctAction: "Call", explanation: "River short-stack shove en 3-way apres action passive: avec trips As et meilleur kicker, call est standard contre la range mergee de BB.", players: [{pos:'UTG',role:'other',inHand:false,stack:'73.00'},{pos:'MP',role:'other',inHand:false,stack:'69.00'},{pos:'HJ',role:'other',inHand:false,stack:'66.00'},{pos:'CO',role:'other',inHand:true,stack:'38.00'},{pos:'BTN',role:'hero',inHand:true,stack:'64.00'},{pos:'SB',role:'other',inHand:false,stack:'61.00'},{pos:'BB',role:'villain',inHand:true,stack:'30.00'}] },
    { street: "PRE-FLOP", pot: "7.00", villainPos: "HJ", villainStack: "92.00", villainAction: "2.50", heroPos: "CO", heroStack: "88.00", heroCards: [{r:'Q',s:'♣'},{r:'J',s:'♣'}], board: [], callAmount: "2.50", raiseAmount: "10.00", correctAction: "Call", explanation: "Open HJ + cold call BTN derriere: en CO, QJs prefere souvent call pour jouer un pot controle avec bonne jouabilite multiway.", players: [{pos:'UTG',role:'other',inHand:false,stack:'95.00'},{pos:'MP',role:'other',inHand:false,stack:'90.00'},{pos:'HJ',role:'villain',inHand:true,stack:'92.00'},{pos:'CO',role:'hero',inHand:true,stack:'88.00'},{pos:'BTN',role:'other',inHand:true,stack:'86.00'},{pos:'SB',role:'other',inHand:false,stack:'94.00'},{pos:'BB',role:'other',inHand:false,stack:'98.00'}] },
    { street: "FLOP", pot: "20.00", villainPos: "UTG", villainStack: "75.00", villainAction: "8.00", heroPos: "BB", heroStack: "82.00", heroCards: [{r:'T',s:'♦'},{r:'9',s:'♦'}], board: [{r:'J',s:'♠'},{r:'8',s:'♣'},{r:'7',s:'♥'}], callAmount: "8.00", raiseAmount: "24.00", correctAction: "Raise", explanation: "Tu as quinte max floppee sur board dynamique en 3-way. Il faut relancer maintenant pour value et protection.", players: [{pos:'UTG',role:'villain',inHand:true,stack:'75.00'},{pos:'MP',role:'other',inHand:false,stack:'69.00'},{pos:'HJ',role:'other',inHand:false,stack:'71.00'},{pos:'CO',role:'other',inHand:true,stack:'58.00'},{pos:'BTN',role:'other',inHand:false,stack:'77.00'},{pos:'SB',role:'other',inHand:false,stack:'66.00'},{pos:'BB',role:'hero',inHand:true,stack:'82.00'}] },
    { street: "TURN", pot: "16.00", villainPos: "SB", villainStack: "41.00", villainAction: "9.00", heroPos: "BTN", heroStack: "55.00", heroCards: [{r:'K',s:'♣'},{r:'T',s:'♣'}], board: [{r:'T',s:'♠'},{r:'8',s:'♥'},{r:'4',s:'♣'},{r:'2',s:'♦'}], callAmount: "9.00", raiseAmount: "26.00", correctAction: "Call", explanation: "Top paire kicker moyen en 3-way face a mise turn: call domine raise/fold pour garder les bluffs et controler la variance.", players: [{pos:'UTG',role:'other',inHand:false,stack:'72.00'},{pos:'MP',role:'other',inHand:false,stack:'70.00'},{pos:'HJ',role:'other',inHand:false,stack:'67.00'},{pos:'CO',role:'other',inHand:false,stack:'64.00'},{pos:'BTN',role:'hero',inHand:true,stack:'55.00'},{pos:'SB',role:'villain',inHand:true,stack:'41.00'},{pos:'BB',role:'other',inHand:true,stack:'49.00'}] },
    { street: "RIVER", pot: "48.00", villainPos: "CO", villainStack: "62.00", villainAction: "Check", heroPos: "BTN", heroStack: "67.00", heroCards: [{r:'Q',s:'♠'},{r:'J',s:'♠'}], board: [{r:'K',s:'♣'},{r:'T',s:'♥'},{r:'6',s:'♦'},{r:'6',s:'♣'},{r:'2',s:'♠'}], callAmount: "-", raiseAmount: "26.00", correctAction: "Raise", explanation: "River multiway apres double check: tu as hauteur Dame avec bloqueurs sur quintes. Le bluff thin a bonne rentabilite contre les mains one-pair faibles.", players: [{pos:'UTG',role:'other',inHand:false,stack:'78.00'},{pos:'MP',role:'other',inHand:false,stack:'76.00'},{pos:'HJ',role:'other',inHand:false,stack:'74.00'},{pos:'CO',role:'villain',inHand:true,stack:'62.00'},{pos:'BTN',role:'hero',inHand:true,stack:'67.00'},{pos:'SB',role:'other',inHand:false,stack:'65.00'},{pos:'BB',role:'other',inHand:true,stack:'53.00'}] }


];

function parseScenarioNumeric(value) {
    const match = String(value || '').match(/[0-9]+(?:\.[0-9]+)?/);
    return match ? Number(match[0]) : null;
}

function computeScenarioDifficultyLabel(scenario) {
    let score = 0;
    const street = (scenario.street || '').toUpperCase();
    const villainAction = (scenario.villainAction || '').toUpperCase();
    const correctAction = (scenario.correctAction || '').toUpperCase();
    const heroStack = parseScenarioNumeric(scenario.heroStack);
    const villainStack = parseScenarioNumeric(scenario.villainStack);

    if (street === 'TURN') score += 1;
    if (street === 'RIVER') score += 2;

    if (villainAction === 'CHECK') score += 0;
    else if (villainAction.includes('OVERBET')) score += 3;
    else if (villainAction.includes('SHOVE') || villainAction.includes('ALL-IN')) score += 3;
    else score += 1;

    if (correctAction === 'FOLD' || correctAction === 'RAISE') score += 1;

    if (heroStack !== null && heroStack <= 25) score += 1;
    if (villainStack !== null && villainStack <= 25) score += 1;

    if (score <= 2) return 'Facile';
    if (score <= 4) return 'Moyen';
    if (score <= 6) return 'Difficile';
    return 'Expert';
}

const difficultyOrder = {
    Facile: 0,
    Moyen: 1,
    Difficile: 2,
    Expert: 3
};

const defaultPositionOrder = ['UTG', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

function inferPositionOrder(allScenarios) {
    const seen = new Set(defaultPositionOrder);
    const extra = [];

    for (const scenario of allScenarios) {
        const positions = [scenario.heroPos, scenario.villainPos];
        for (const pos of positions) {
            if (!pos) continue;
            if (!seen.has(pos)) {
                seen.add(pos);
                extra.push(pos);
            }
        }
    }

    return [...defaultPositionOrder, ...extra];
}

function normalizePlayerSeat(player) {
    return {
        pos: player.pos,
        role: player.role || 'other',
        inHand: Boolean(player.inHand),
        status: player.inHand ? 'IN' : 'FOLD',
        stack: player.stack || null,
        stackBB: parseScenarioNumeric(player.stack)
    };
}

function refreshScenarioPlayersState(scenario, players) {
    scenario.players = players;
    scenario.activePositions = players.filter((player) => player.inHand).map((player) => player.pos);
    scenario.activePlayersCount = scenario.activePositions.length;
    scenario.isMultiway = scenario.activePlayersCount > 2;
}

function buildHeadsUpSeats(scenario, positionOrder) {
    return positionOrder.map((pos) => {
        const isHero = pos === scenario.heroPos;
        const isVillain = pos === scenario.villainPos;
        const inHand = isHero || isVillain;

        return normalizePlayerSeat({
            pos,
            role: isHero ? 'hero' : (isVillain ? 'villain' : 'other'),
            inHand,
            stack: isHero ? scenario.heroStack : (isVillain ? scenario.villainStack : null)
        });
    });
}

const legacyMultiwayExtras = {
    0: [{ pos: 'BTN', stack: '26.00' }],
    1: [{ pos: 'CO', stack: '42.00' }],
    2: [{ pos: 'BTN', stack: '58.00' }],
    3: [{ pos: 'BB', stack: '72.00' }],
    4: [{ pos: 'HJ', stack: '88.00' }],
    5: [{ pos: 'CO', stack: '67.00' }],
    6: [{ pos: 'UTG', stack: '60.00' }],
    7: [{ pos: 'SB', stack: '61.00' }],
    8: [{ pos: 'MP', stack: '84.00' }],
    9: [{ pos: 'UTG', stack: '50.00' }]
};

function applyLegacyMultiwayBoost(scenario, index, positionOrder) {
    const extras = legacyMultiwayExtras[index];
    if (!extras || extras.length === 0) return;

    const base = buildHeadsUpSeats(scenario, positionOrder);
    const byPos = new Map(base.map((player) => [player.pos, player]));

    for (const extra of extras) {
        const existing = byPos.get(extra.pos);
        if (!existing) continue;
        byPos.set(extra.pos, normalizePlayerSeat({
            ...existing,
            role: existing.role === 'other' ? 'other' : existing.role,
            inHand: true,
            stack: extra.stack || existing.stack || scenario.villainStack || scenario.heroStack
        }));
    }

    const boosted = positionOrder
        .map((pos) => byPos.get(pos))
        .filter(Boolean);

    refreshScenarioPlayersState(scenario, boosted);
}

function enrichScenarioTableState(scenario, index, positionOrder) {
    scenario.id = scenario.id || `SCN-${String(index + 1).padStart(3, '0')}`;
    scenario.tableFormat = scenario.tableFormat || '6-max';
    scenario.positions = positionOrder;

    const hasCustomPlayers = Array.isArray(scenario.players) && scenario.players.length > 0;
    const players = hasCustomPlayers
        ? scenario.players.map(normalizePlayerSeat)
        : buildHeadsUpSeats(scenario, positionOrder);

    refreshScenarioPlayersState(scenario, players);
}

const scenariosByDifficulty = {
    Facile: [],
    Moyen: [],
    Difficile: [],
    Expert: []
};

const inferredPositionOrder = inferPositionOrder(scenarios);

for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];
    enrichScenarioTableState(scenario, i, inferredPositionOrder);
    if (!scenario.isMultiway) {
        applyLegacyMultiwayBoost(scenario, i, inferredPositionOrder);
    }
    const difficulty = computeScenarioDifficultyLabel(scenario);
    scenario.difficulty = difficulty;
    scenariosByDifficulty[difficulty].push(scenario);
}

scenarios.sort((a, b) => {
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
});

const scenariosSortedByDifficulty = [...scenarios];