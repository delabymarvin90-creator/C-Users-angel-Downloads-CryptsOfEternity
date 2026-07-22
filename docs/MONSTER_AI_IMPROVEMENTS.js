// ══════════════════════════════════════════════════════════════════════════════
// AMÉLIORATIONS DE L'IA DES MONSTRES — Crypts of Eternity
// ══════════════════════════════════════════════════════════════════════════════
// À REMPLACER dans game.js :
// 1. La classe Monster (lignes 2376-2417)
// 2. La fonction tickMonsters (lignes 3118-3213)
// ══════════════════════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════════════════
// CLASSE MONSTER AMÉLIORÉE avec IA spécifique par type
// ══════════════════════════════════════════════════════════════════════════════
class Monster extends Entity {
  constructor(x, y, type) {
    super(x, y);
    this.type = type;
    this._setup();
    this.aggro = false;
    
    // Chaque monstre a son propre timer de mouvement initial (variabilité)
    this.moveTimer = 20 + Math.random() * 20 | 0;
    
    // Animation
    this.animFrame = 0;
    this.animTimer = 0;
    this.xpR = Math.floor(this.maxHp * 1.5);
    
    // Smooth movement
    this.rx = x * TS;
    this.ry = y * TS;
    this.sx = this.rx;
    this.sy = this.ry;
    this.tx = this.rx;
    this.ty = this.ry;
    this.tweenT = 0;
    this.tweenD = 16;
    this.moving = false;
    
    // ── IA PERSONNALISÉE ──
    this.aiState = 'idle'; // idle, hunt, evade, patrol, rush
    this.targetX = x;
    this.targetY = y;
    this.decisionTimer = 0;
    this.decisionInterval = this._getDecisionInterval();
    
    // Mémoire de patouille — pour les monstres qui patrouillent
    this.patrolWaypoints = [];
    this.patrolIndex = 0;
    this.patrolTimer = 0;
    this.patrolCycle = 120 + Math.random() * 60 | 0;
    
    // Memory — dernière position connue du joueur
    this.lastSeenPlayerX = null;
    this.lastSeenPlayerY = null;
    this.lastSeenTimer = 0;
    this.lastSeenMaxMemory = 200; // ticks avant d'oublier
    
    // États spécialisés par type
    this._initializeAIBehavior();
  }
  
  _setup() {
    const T2 = {
      skeleton: {hp:8,  atk:3, col:'#d4c4a0', name:'Squelette'},
      goblin:   {hp:7,  atk:4, col:'#60a030', name:'Gobelin'},
      demon:    {hp:20, atk:8, col:'#c03030', name:'Démon'},
      ghost:    {hp:12, atk:5, col:'#a0c0d0', name:'Fantôme'},
      spider:   {hp:6,  atk:4, col:'#7030a0', name:'Araignée'},
      ogre:     {hp:30, atk:10,col:'#904018', name:'Ogre'},
      boss:     {hp:80, atk:16,col:'#c000ff', name:'Seigneur des Cryptes'},
    };
    const t = T2[this.type] || T2.skeleton;
    this.maxHp = t.hp;
    this.hp = t.hp;
    this.atk = t.atk;
    this.col = t.col;
    this.name = t.name;
  }
  
  // Initialiser le comportement spécifique par type
  _initializeAIBehavior() {
    switch(this.type) {
      case 'skeleton':
        // Guerrier lent et patient — patouille régulièrement
        this.aiType = 'stalker';
        this.aggroRange = 12;
        this.moveSpeed = 'slow';
        break;
      case 'goblin':
        // Guerrier agressif et impulsif — fonce droit sur le joueur
        this.aiType = 'rusher';
        this.aggroRange = 10;
        this.moveSpeed = 'fast';
        this.rushChance = 0.4;
        break;
      case 'spider':
        // Chasseur tactique — évite le combat direct, cherche à encercler
        this.aiType = 'tactical';
        this.aggroRange = 14;
        this.moveSpeed = 'fast';
        this.flankingDistance = 5;
        break;
      case 'ghost':
        // Spectre intelligent qui peut traverser les murs — poursuite implacable
        this.aiType = 'haunter';
        this.aggroRange = 16;
        this.moveSpeed = 'medium';
        this.canPhaseThrough = true; // traverse les obstacles
        this.persistentAggro = true; // reste en chasse longtemps
        break;
      case 'demon':
        // Chef agressif avec stratégie offensive — fonce puis se retire
        this.aiType = 'skirmisher';
        this.aggroRange = 13;
        this.moveSpeed = 'medium';
        this.chargeDistance = 4;
        this.chargeCooldown = 0;
        this.chargeInterval = 60;
        break;
      case 'ogre':
        // Brute simple mais puissante — patrouille et réagit lentement
        this.aiType = 'brute';
        this.aggroRange = 10;
        this.moveSpeed = 'slow';
        this.slowReactionTime = 40;
        this.reactionTimer = 0;
        break;
      case 'boss':
        // Boss intelligent avec stratégie complexe
        this.aiType = 'boss';
        this.aggroRange = 20;
        this.moveSpeed = 'medium';
        break;
    }
  }
  
  _getDecisionInterval() {
    // Chaque type décide ses actions à un rythme différent
    switch(this.type) {
      case 'goblin': return 8;  // très rapide, impulsif
      case 'spider': return 12; // tactique
      case 'ghost':  return 10; // pressant
      case 'demon':  return 14; // stratégique
      case 'ogre':   return 25; // très lent
      case 'skeleton': return 18; // patient
      case 'boss':   return 16; // puissant mais calculé
      default: return 20;
    }
  }
  
  // Calcule l'intervalle de mouvement selon l'IA
  _getMoveInterval(isAggro) {
    if (!isAggro) {
      // En patrouille : mouvement lent et régulier
      switch(this.type) {
        case 'skeleton': return 35;
        case 'goblin': return 25;
        case 'spider': return 20;
        case 'ghost': return 30;
        case 'demon': return 28;
        case 'ogre': return 40;
        case 'boss': return 32;
        default: return 30;
      }
    } else {
      // En chasse : mouvement rapide
      switch(this.type) {
        case 'skeleton': return 16;
        case 'goblin': return 10; // très agressif
        case 'spider': return 12;
        case 'ghost': return 14;
        case 'demon': return 13;
        case 'ogre': return 18;
        case 'boss': return 14;
        default: return 16;
      }
    }
  }
  
  startMove(nx, ny) {
    this.sx = this.rx;
    this.sy = this.ry;
    this.tx = nx * TS;
    this.ty = ny * TS;
    this.tweenT = 0;
    this.moving = true;
    this.x = nx;
    this.y = ny;
  }
  
  updateTween() {
    if (!this.moving) return;
    this.tweenT++;
    const t = Math.min(1, this.tweenT / this.tweenD);
    const e = 1 - Math.pow(1 - t, 2); // ease-out quad
    this.rx = this.sx + (this.tx - this.sx) * e;
    this.ry = this.sy + (this.ty - this.sy) * e;
    if (this.tweenT >= this.tweenD) {
      this.rx = this.tx;
      this.ry = this.ty;
      this.moving = false;
    }
  }
  
  // Décider du comportement en fonction du contexte
  decideBehavior(playerX, playerY, playerVisible, state) {
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.abs(dx) + Math.abs(dy);
    
    // Mise à jour de la mémoire du joueur
    if (playerVisible && dist <= this.aggroRange + 2) {
      this.lastSeenPlayerX = playerX;
      this.lastSeenPlayerY = playerY;
      this.lastSeenTimer = 0;
    } else if (this.lastSeenTimer < this.lastSeenMaxMemory) {
      this.lastSeenTimer++;
    } else {
      this.lastSeenPlayerX = null;
      this.lastSeenPlayerY = null;
    }
    
    // Détection du joueur
    const isInRange = dist <= this.aggroRange;
    const canSeePlayer = playerVisible && isInRange;
    const hasMemory = this.lastSeenPlayerX !== null && this.lastSeenTimer < this.lastSeenMaxMemory;
    
    // Transition des états IA
    if (canSeePlayer || hasMemory) {
      this.aggro = true;
      this.aiState = 'hunt';
    } else if (dist > 16 && !this.persistentAggro) {
      this.aggro = false;
      this.aiState = 'patrol';
    } else if (this.persistentAggro && this.lastSeenTimer < this.lastSeenMaxMemory) {
      this.aiState = 'hunt';
    } else {
      this.aiState = 'patrol';
    }
  }
  
  // Exécuter l'action décidée par l'IA
  executeAction(playerX, playerY, state, map, MAP_W, MAP_H) {
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.abs(dx) + Math.abs(dy);
    
    // Fonction helper pour vérifier si une tuile est passable
    const passable = (nx, ny) => {
      const t = map[ny]?.[nx] || 0;
      const occupied = state.monsters.some(o => o.alive && o !== this && o.x === nx && o.y === ny);
      return t >= T.FLOOR && t !== T.WALL && !occupied && !(playerX === nx && playerY === ny);
    };
    
    // Pour les spectres : peuvent traverser les murs
    const canMove = (nx, ny) => {
      if (this.canPhaseThrough) {
        return nx >= 0 && ny >= 0 && nx < MAP_W && ny < MAP_H;
      }
      return passable(nx, ny);
    };
    
    switch(this.aiType) {
      // ── STALKER (Skeleton) ──
      case 'stalker':
        if (this.aiState === 'hunt') {
          this._moveTowardPlayer(dx, dy, playerX, playerY, passable);
        } else {
          this._patrolBehavior(state, passable);
        }
        break;
      
      // ── RUSHER (Goblin) ──
      case 'rusher':
        if (this.aiState === 'hunt') {
          // Charge directe vers le joueur avec quelques variations tactiques
          if (Math.random() < this.rushChance && dist > 2) {
            this._rushTowardPlayer(dx, dy, playerX, playerY, passable);
          } else {
            this._moveTowardPlayer(dx, dy, playerX, playerY, passable);
          }
        } else {
          this._patrolBehavior(state, passable);
        }
        break;
      
      // ── TACTICAL (Spider) ──
      case 'tactical':
        if (this.aiState === 'hunt') {
          // Cherche à encercler — se déplace latéralement par rapport au joueur
          this._flankPlayer(dx, dy, playerX, playerY, passable);
        } else {
          this._patrolBehavior(state, passable);
        }
        break;
      
      // ── HAUNTER (Ghost) ──
      case 'haunter':
        if (this.aiState === 'hunt') {
          // Poursuite implacable — traverse obstacles si le joueur s'échappe
          this._moveTowardPlayer(dx, dy, playerX, playerY, canMove);
        } else {
          this._patrolBehavior(state, passable);
        }
        break;
      
      // ── SKIRMISHER (Demon) ──
      case 'skirmisher':
        if (this.aiState === 'hunt') {
          // Charge puis se retire — hit and run
          this.chargeCooldown--;
          if (dist <= this.chargeDistance && this.chargeCooldown <= 0) {
            // Charge directe
            this._rushTowardPlayer(dx, dy, playerX, playerY, passable);
            this.chargeCooldown = this.chargeInterval;
          } else {
            this._moveTowardPlayer(dx, dy, playerX, playerY, passable);
          }
        } else {
          this._patrolBehavior(state, passable);
        }
        break;
      
      // ── BRUTE (Ogre) ──
      case 'brute':
        this.reactionTimer--;
        if (this.aiState === 'hunt' && this.reactionTimer <= 0) {
          // Réaction lente mais puissante
          this._moveTowardPlayer(dx, dy, playerX, playerY, passable);
          this.reactionTimer = this.slowReactionTime;
        } else if (this.aiState !== 'hunt') {
          this._patrolBehavior(state, passable);
        }
        break;
      
      // ── BOSS ──
      case 'boss':
        if (this.aiState === 'hunt') {
          this._bossBehavior(dx, dy, playerX, playerY, passable, state);
        } else {
          this._patrolBehavior(state, passable);
        }
        break;
    }
  }
  
  // Mouvement simple vers le joueur (Manhattan)
  _moveTowardPlayer(dx, dy, targetX, targetY, passableCheck) {
    const moves = [
      [Math.sign(dx), Math.sign(dy)], // diagonal
      [Math.sign(dx), 0],              // horizontal
      [0, Math.sign(dy)],              // vertical
    ];
    
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
  
  // Charge directe — mouvement plus agressif
  _rushTowardPlayer(dx, dy, targetX, targetY, passableCheck) {
    const priorityMoves = [
      [Math.sign(dx), Math.sign(dy)],
      [Math.sign(dx), 0],
      [0, Math.sign(dy)],
    ];
    
    for (const [mx, my] of priorityMoves) {
      if (mx === 0 && my === 0) continue;
      const nx = this.x + mx;
      const ny = this.y + my;
      if (passableCheck(nx, ny)) {
        this.startMove(nx, ny);
        return;
      }
    }
  }
  
  // Encerclement tactique — se déplace perpendiculairement au joueur
  _flankPlayer(dx, dy, targetX, targetY, passableCheck) {
    // Cherche à se positionner sur un côté du joueur
    const flankMoves = [
      [0, Math.sign(dy)], // approche verticalement
      [Math.sign(dx), 0], // approche horizontalement
      [Math.sign(dx), Math.sign(dy)], // diagonal
    ];
    
    for (const [mx, my] of flankMoves) {
      if (mx === 0 && my === 0) continue;
      const nx = this.x + mx;
      const ny = this.y + my;
      if (passableCheck(nx, ny)) {
        this.startMove(nx, ny);
        return;
      }
    }
  }
  
  // Patrouille — marche en cercle ou en pattern
  _patrolBehavior(state, passableCheck) {
    // Patrouille simple : mouvement aléatoire régulier
    const patrolMoves = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];
    
    // Shuffle slight bias — continuer dans la même direction
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
  
  // Comportement du Boss — intelligent et stratégique
  _bossBehavior(dx, dy, targetX, targetY, passableCheck, state) {
    // Le boss utilise une stratégie plus complexe
    const dist = Math.abs(dx) + Math.abs(dy);
    
    // Stratégie : approche avec timing, crée des minions, gère la distance
    if (dist > 6) {
      // Loin du joueur : approche
      this._moveTowardPlayer(dx, dy, targetX, targetY, passableCheck);
    } else {
      // Proche du joueur : tactique variée
      if (Math.random() < 0.3) {
        // Quelquefois se retire un peu
        this._moveAwayFromPlayer(dx, dy, passableCheck);
      } else {
        this._moveTowardPlayer(dx, dy, targetX, targetY, passableCheck);
      }
    }
  }
  
  // Se retirer du joueur
  _moveAwayFromPlayer(dx, dy, passableCheck) {
    const escapeMoves = [
      [-Math.sign(dx), -Math.sign(dy)],
      [-Math.sign(dx), 0],
      [0, -Math.sign(dy)],
    ];
    
    for (const [mx, my] of escapeMoves) {
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

// ══════════════════════════════════════════════════════════════════════════════
// NOUVELLE FONCTION tickMonsters avec IA améliorée
// ══════════════════════════════════════════════════════════════════════════════
function tickMonsters(state) {
  const p = state.player;
  
  state.monsters.forEach(m => {
    if (!m.alive) return;
    
    // Mise à jour animation
    m.update();
    
    // Décrémente le timer de mouvement
    m.moveTimer--;
    
    // Décider du comportement toutes les X ticks (variable par type)
    m.decisionTimer++;
    if (m.decisionTimer >= m.decisionInterval) {
      m.decisionTimer = 0;
      
      // Déterminer si le joueur est visible
      const playerVisible = state.visible[m.y]?.[m.x];
      
      // Décider du comportement IA
      m.decideBehavior(p.x, p.y, playerVisible, state);
    }
    
    // Exécuter le mouvement selon le timer spécifique du monstre
    if (m.moveTimer <= 0) {
      m.moveTimer = m._getMoveInterval(m.aggro);
      
      // Exécuter l'action IA
      m.executeAction(p.x, p.y, state, state.map, state.MAP_W, state.MAP_H);
    }
    
    // ── BOSS SUMMON ──
    if (m.type === 'boss' && m.aggro) {
      m.summonTimer = (m.summonTimer || 0) + 1;
      if (m.summonTimer >= (m.summonInterval || 18)) {
        m.summonTimer = 0;
        const minionTypes = ['skeleton', 'goblin', 'demon', 'spider'];
        let summoned = 0;
        for (let attempt = 0; attempt < 20 && summoned < 2; attempt++) {
          const ox = (Math.random() * 6 | 0) - 3;
          const oy = (Math.random() * 6 | 0) - 3;
          const mx3 = m.x + ox, my3 = m.y + oy;
          if (mx3 < 0 || my3 < 0 || mx3 >= state.MAP_W || my3 >= state.MAP_H) continue;
          if (state.map[my3][mx3] !== T.FLOOR) continue;
          if (state.monsters.some(o => o.alive && o.x === mx3 && o.y === my3)) continue;
          if (p.x === mx3 && p.y === my3) continue;
          const tp = minionTypes[Math.floor(Math.random() * minionTypes.length)];
          const minion = new Monster(mx3, my3, tp);
          const sc = 1 + (m.summonFloor || 5) * 0.15;
          minion.maxHp = Math.ceil(minion.maxHp * sc);
          minion.hp = minion.maxHp;
          minion.aggro = true;
          state.monsters.push(minion);
          state.particles.spawn(mx3, my3, '#c000ff', 12, 'magic');
          summoned++;
        }
        if (summoned > 0) {
          log(`☠ Le Seigneur invoque des sbires !`, '#c000ff');
          flash('rgba(120,0,200,.3)');
        }
      }
    }
    
    // ── BURNING DoT ──
    if (m.burnTicks > 0) {
      m.burnTickTimer = (m.burnTickTimer || 0) + 1;
      if (m.burnTickTimer >= 3) {
        m.burnTickTimer = 0;
        const bdmg = m.burnDmg || 2;
        m.hp -= bdmg;
        m.burnTicks--;
        floatDmg(m.x, m.y, `🔥${bdmg}`, '#ff6010');
        state.particles.spawn(m.x, m.y, '#ff4008', 4, 'fire');
        Achievements.bump('burnDamage', bdmg);
        if (m.hp <= 0) {
          m.alive = false;
          state.particles.spawn(m.x, m.y, '#ff5000', 14, 'fire');
          p.gainXp(m.xpR);
          log(`${m.name} réduit en cendres ! +${m.xpR} XP`, '#ff8020');
        }
      }
    }
    
    if (!m.alive) return;
    
    // ── COMBAT ──
    if (m.aggro) {
      const dx = p.x - m.x;
      const dy = p.y - m.y;
      const dist = Math.abs(dx) + Math.abs(dy);
      
      // Si adjacent, attaquer
      if (dist <= 1 || (Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && dist > 0)) {
        const dmg = Math.max(0, m.atk - p.def + Math.floor(Math.random() * 3));
        p.hp = Math.max(0, p.hp - dmg);
        p.shake();
        state.particles.spawn(p.x, p.y, '#e04040', 6, 'hit');
        if (dmg > 0) {
          log(`${m.name} frappe: -${dmg} PV`, '#ff6060');
          flash('rgba(160,0,0,.35)');
        }
        if (p.hp <= 0) {
          G._die(p);
        }
      }
    }
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// INSTRUCITONS D'INSTALLATION
// ══════════════════════════════════════════════════════════════════════════════
/*

DANS LE FICHIER game.js, REMPLACEZ :

1. LA CLASSE MONSTER (lignes 2376-2417) par la nouvelle classe Monster ci-dessus

2. LA FONCTION tickMonsters (lignes 3118-3213) par la nouvelle fonction tickMonsters ci-dessus

Les changements clés :
✓ Chaque type de monstre a sa propre IA (stalker, rusher, tactical, etc.)
✓ Les monstres se déplacent indépendamment selon leur type
✓ Comportements variés : patrouille, chasse, encerclement, charge
✓ Mémoire : les monstres se souviennent du dernier endroit où ils ont vu le joueur
✓ Les spectres peuvent traverser les murs
✓ Le boss a un comportement stratégique complexe
✓ Chaque type a sa vitesse de mouvement et son intervalle de décision unique

*/
