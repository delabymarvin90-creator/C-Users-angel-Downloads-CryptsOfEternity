═══════════════════════════════════════════════════════════════════════════════
 GUIDE AVANCÉ — Personnalisation de l'IA des Monstres
═══════════════════════════════════════════════════════════════════════════════

Ce guide montre comment modifier, étendre et créer des comportements
personnalisés pour les monstres.

═══════════════════════════════════════════════════════════════════════════════
 EXEMPLE 1: Rendre un Goblin plus ou moins agressif
═══════════════════════════════════════════════════════════════════════════════

ACTUELLEMENT (Goblin standard):
──────────────────────────────
case 'goblin':
  this.aggroRange = 10;
  return 8;  // décide très vite
  
Dans _getMoveInterval():
  case 'goblin': 
    if (!isAggro) return 25; // normal
    if (isAggro) return 10;  // en chasse

---

OPTION 1: Goblin plus faible (moins agressif)
──────────────────────────────────────────────
case 'goblin':
  this.aggroRange = 8;  // ← détecte moins tôt
  return 12;            // ← décide plus lentement
  
Dans _getMoveInterval():
  case 'goblin': 
    if (!isAggro) return 30;  // ← plus lent en patrouille
    if (isAggro) return 15;   // ← moins rapide en chasse

🧪 Résultat: Goblin plus facile à éviter, moins menaçant.

---

OPTION 2: Goblin plus fort (très agressif)
──────────────────────────────────────────
case 'goblin':
  this.aggroRange = 13;  // ← détecte plus tôt
  return 5;              // ← décide TRÈS vite
  
Dans _getMoveInterval():
  case 'goblin': 
    if (!isAggro) return 20;  // ← plus rapide en patrouille
    if (isAggro) return 8;    // ← TRÈS rapide en chasse

🧪 Résultat: Goblin cauchemardesque, très difficile à échapper.

═══════════════════════════════════════════════════════════════════════════════
 EXEMPLE 2: Ajouter un nouveau type de monstre (Liche)
═══════════════════════════════════════════════════════════════════════════════

ÉTAPE 1: Ajouter au _setup()
───────────────────────────

const T2 = {
  skeleton: {hp:8,  atk:3, col:'#d4c4a0', name:'Squelette'},
  goblin:   {hp:7,  atk:4, col:'#60a030', name:'Gobelin'},
  // ... autres ...
  
  // ← NOUVEAU!
  liche:    {hp:25, atk:6, col:'#7c6c8c', name:'Liche'},
};

---

ÉTAPE 2: Ajouter au _initializeAIBehavior()
─────────────────────────────────────────────

case 'liche':
  // Magicien mort-vivant — intelligent, esquive, lance des sorts
  this.aiType = 'caster';
  this.aggroRange = 15;
  this.moveSpeed = 'medium';
  
  // Spécifique à la Liche:
  this.spellCooldown = 0;
  this.spellInterval = 40;
  this.keepDistance = 6;  // Essaie de rester à distance
  this.canCastSpells = true;
  break;

---

ÉTAPE 3: Ajouter au _getDecisionInterval()
──────────────────────────────────────────

case 'liche': return 11;  // Assez rapide (magicienne)

---

ÉTAPE 4: Ajouter au _getMoveInterval()
──────────────────────────────────────

case 'liche': 
  if (!isAggro) return 28;  // Patrouille normale
  if (isAggro) return 14;   // Mouvement moderate en chasse

---

ÉTAPE 5: Ajouter une méthode spéciale _licheBehavior()
──────────────────────────────────────────────────────

// Ajouter cette méthode dans la classe Monster:

_licheBehavior(dx, dy, targetX, targetY, passableCheck, state) {
  const dist = Math.abs(dx) + Math.abs(dy);
  
  // Cooldown sur les sorts
  this.spellCooldown--;
  
  // Stratégie: Rester à distance, lancer des sorts
  if (dist > this.keepDistance) {
    // Trop loin, approche
    this._moveTowardPlayer(dx, dy, targetX, targetY, passableCheck);
  } else if (dist < 3 && this.spellCooldown <= 0) {
    // Trop proche: lance un sort et recule
    this._castSpell(targetX, targetY, state);
    this._moveAwayFromPlayer(dx, dy, passableCheck);
    this.spellCooldown = this.spellInterval;
  } else if (this.spellCooldown <= 0) {
    // Lance un sort à distance
    this._castSpell(targetX, targetY, state);
    this.spellCooldown = this.spellInterval;
  } else {
    // En cooldown, cercle autour du joueur
    this._flankPlayer(dx, dy, targetX, targetY, passableCheck);
  }
}

_castSpell(targetX, targetY, state) {
  // Crée une explosion magique à la position du joueur
  log(`✨ La Liche lance un sort!`, '#9070ff');
  state.particles.spawn(targetX, targetY, '#9070ff', 20, 'magic');
  flash('rgba(160,0,255,.2)');
  
  // Infliger des dégâts dans la zone
  const spellRange = 2;
  for (let dy = -spellRange; dy <= spellRange; dy++) {
    for (let dx = -spellRange; dx <= spellRange; dx++) {
      const px = targetX + dx;
      const py = targetY + dy;
      // Dégâts au joueur si dans la zone
      if (px === state.player.x && py === state.player.y) {
        const dmg = 4 + Math.floor(Math.random() * 3);
        state.player.hp -= dmg;
        state.particles.spawn(px, py, '#ff6060', 8, 'magic');
        if (dmg > 0) log(`💜 Sort magique: -${dmg} PV`, '#9070ff');
      }
    }
  }
}

---

ÉTAPE 6: Ajouter au executeAction()
───────────────────────────────────

// Dans le switch:
case 'caster':
  if (this.aiState === 'hunt') {
    this._licheBehavior(dx, dy, playerX, playerY, passableCheck, state);
  } else {
    this._patrolBehavior(state, passableCheck);
  }
  break;

---

RÉSULTAT: Une nouvelle classe de monstre "Caster" avec sorts! 🔮

═══════════════════════════════════════════════════════════════════════════════
 EXEMPLE 3: Monstre qui "panique" quand sa vie est basse
═══════════════════════════════════════════════════════════════════════════════

Ajouter au constructeur:
───────────────────────

// Seuil de panique (50% de la vie max)
this.panicThreshold = this.maxHp * 0.5;

---

Modifier executeAction() pour ajouter:
──────────────────────────────────────

// Avant le switch, check si panic:
const isPanicked = this.hp < this.panicThreshold;

if (isPanicked) {
  // En panique: fuit au lieu de chasser
  this._moveAwayFromPlayer(dx, dy, passableCheck);
  if (Math.random() < 0.1) {
    // 10% de chance de crier à l'aide
    log(`${this.name} FUIT! 😱`, '#ff9900');
  }
} else {
  // Normal behavior
  // ... rest of code ...
}

---

RÉSULTAT: Les monstres blessés fuient! Plus immersif! 😱

═══════════════════════════════════════════════════════════════════════════════
 EXEMPLE 4: Monstre qui change de couleur selon son état
═══════════════════════════════════════════════════════════════════════════════

Ajouter dans _initializeAIBehavior() après this.col = t.col:
──────────────────────────────────────────────────────────────

this.normalCol = t.col;
this.aggroCol = '#' + ((parseInt(t.col.slice(1), 16) * 1.5) | 0).toString(16).padStart(6, '0');
this.panicCol = '#ff3030';

---

Modifier drawMonster() pour utiliser les couleurs dynamiques:
─────────────────────────────────────────────────────────────

// Dans drawMonster(), cherchez:
cx2.globalAlpha = .22 + .08 * Math.sin(G.frame * .15 + m.x);
cx2.fillStyle = m.col;  // ← REMPLACER

// Remplacer par:
cx2.globalAlpha = .22 + .08 * Math.sin(G.frame * .15 + m.x);
let displayCol = m.normalCol;
if (m.hp < m.panicThreshold) {
  displayCol = m.panicCol;  // Rouge si panique
} else if (m.aggro) {
  displayCol = m.aggroCol;  // Brillant si aggro
}
cx2.fillStyle = displayCol;

---

RÉSULTAT: Visuels qui reflètent l'état! 🎨

═══════════════════════════════════════════════════════════════════════════════
 EXEMPLE 5: Monstre qui se groupe avec ses alliés
═══════════════════════════════════════════════════════════════════════════════

Ajouter au constructeur:
───────────────────────

// Grouping behavior
this.allyGrouping = Math.random() < 0.5;  // 50% chances
this.allyDistance = 4;  // Essaie de rester proche d'autres

---

Ajouter une méthode:
───────────────────

_findAllyPosition(state) {
  // Cherche l'allié le plus proche
  let closestAlly = null;
  let closestDist = this.allyDistance;
  
  for (const m of state.monsters) {
    if (m.alive && m !== this && m.type === this.type) {
      const dist = Math.abs(m.x - this.x) + Math.abs(m.y - this.y);
      if (dist < closestDist) {
        closestAlly = m;
        closestDist = dist;
      }
    }
  }
  
  return closestAlly;
}

---

Modifier _patrolBehavior():
──────────────────────────

_patrolBehavior(state, passableCheck) {
  // Si grouping activé et allié visible:
  if (this.allyGrouping) {
    const ally = this._findAllyPosition(state);
    if (ally && Math.abs(ally.x - this.x) + Math.abs(ally.y - this.y) > 1) {
      // Approche son allié
      const dx = ally.x - this.x;
      const dy = ally.y - this.y;
      const moves = [[Math.sign(dx), Math.sign(dy)], [Math.sign(dx), 0], [0, Math.sign(dy)]];
      for (const [mx, my] of moves) {
        if (mx === 0 && my === 0) continue;
        const nx = this.x + mx;
        const ny = this.y + my;
        if (passableCheck(nx, ny)) {
          this.startMove(nx, ny);
          return;
        }
      }
    }
  }
  
  // Normal patrol si pas grouping ou ally trouvé
  const patrolMoves = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];
  const shuffled = patrolMoves.sort(() => Math.random() - 0.55);
  for (const [mx, my] of shuffled) {
    const nx = this.x + mx;
    const ny = this.y + my;
    if (passableCheck(nx, ny)) {
      this.startMove(nx, ny);
      return;
    }
  }
}

---

RÉSULTAT: Les monstres du même type se groupent ensemble! 👥

═══════════════════════════════════════════════════════════════════════════════
 EXEMPLE 6: Varier la difficulté par étage
═══════════════════════════════════════════════════════════════════════════════

Dans spawnMonsters(), modifier aggroRange dynamiquement:
────────────────────────────────────────────────────────

function spawnMonsters(rooms, floor) {
  // ... existing code ...
  
  rooms.slice(1).forEach(r => {
    // ... existing loop ...
    
    const m = new Monster(mx2, my2, tp);
    
    // Ajouter: Augmenter agressivité par étage
    if (floor >= 3) {
      m.aggroRange = Math.min(m.aggroRange + 2, 20);
      // Les monstres détectent plus tôt à partir de l'étage 3
    }
    if (floor >= 5) {
      m.decisionInterval = Math.max(m.decisionInterval - 2, 4);
      // Les monstres décident plus vite à partir de l'étage 5
    }
    
    // ... rest of code ...
  });
}

---

RÉSULTAT: Progression de difficulté naturelle! 📈

═══════════════════════════════════════════════════════════════════════════════
 EXEMPLE 7: Ajouter des "Elite Monsters" (versions améliorées)
═══════════════════════════════════════════════════════════════════════════════

Modifier la classe Monster:
──────────────────────────

constructor(x, y, type, isElite = false) {
  // ... existing code ...
  this.isElite = isElite;
  
  if (isElite) {
    this._applyEliteBonus();
  }
}

_applyEliteBonus() {
  // Les élites sont plus fortes
  this.maxHp = Math.ceil(this.maxHp * 1.5);
  this.hp = this.maxHp;
  this.atk = Math.ceil(this.atk * 1.3);
  this.col = this._brightenColor(this.col);  // Couleur plus brillante
  
  // Ils sont aussi plus intelligents
  this.aggroRange = Math.min(this.aggroRange + 3, 20);
  this.decisionInterval = Math.max(this.decisionInterval - 3, 4);
}

_brightenColor(hexCol) {
  // Augmente la luminosité de la couleur hex
  const num = parseInt(hexCol.slice(1), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) * 1.5) | 0;
  const g = Math.min(255, ((num >> 8) & 0xff) * 1.5) | 0;
  const b = Math.min(255, (num & 0xff) * 1.5) | 0;
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

---

Modifier spawnMonsters() pour ajouter des élites:
─────────────────────────────────────────────────

const tp = typePool[Math.floor(Math.random() * typePool.length)];
const isElite = floor >= 3 && Math.random() < 0.15;  // 15% élites à partir étage 3
const m = new Monster(mx2, my2, tp, isElite);

if (isElite) {
  log(`⭐ Elite ${m.name} apparus!`, '#ffff00');
}

---

RÉSULTAT: Boss mineurs avec visuels distincts! ⭐

═══════════════════════════════════════════════════════════════════════════════
 EXEMPLE 8: Monstre avec "Buddy System" (pair bonding)
═══════════════════════════════════════════════════════════════════════════════

Ajouter au constructeur:
───────────────────────

this.buddyId = null;      // ID du monstre partenaire
this.buddyDistance = 3;   // Distance idéale du partenaire

---

Ajouter une méthode:
───────────────────

_findBuddy(state) {
  // Cherche un monstre du même type proche
  for (const m of state.monsters) {
    if (m.alive && m !== this && m.type === this.type && !m.buddyId) {
      const dist = Math.abs(m.x - this.x) + Math.abs(m.y - this.y);
      if (dist <= this.buddyDistance + 2) {
        this.buddyId = m.x + ',' + m.y;
        m.buddyId = this.x + ',' + this.y;
        return true;
      }
    }
  }
  return false;
}

---

Modifier decideBehavior():
──────────────────────────

// Ajouter après la détection du joueur:
if (!this.buddyId) {
  this._findBuddy(state);
}

---

RÉSULTAT: Monstres qui se cherchent et s'allient! 👬

═══════════════════════════════════════════════════════════════════════════════
 RECAP: Difficultés de Modification
═══════════════════════════════════════════════════════════════════════════════

⭐ FACILE (5 min):
  - Changer aggroRange
  - Changer moveTimer
  - Changer couleur
  - Changer decisionInterval

⭐⭐ MOYEN (15 min):
  - Ajouter une nouvelle méthode de mouvement
  - Ajouter un état de monstre (panic, grouping)
  - Modifier les timers par étage

⭐⭐⭐ AVANCÉ (30+ min):
  - Ajouter un nouveau type de monstre complet
  - Implémenter un système de sorts
  - Ajouter de la pathfinding intelligente

═══════════════════════════════════════════════════════════════════════════════

Amusez-vous à créer des monstres uniques! 🎮✨
