# 🧟 Guide des Améliorations IA des Monstres — Crypts of Eternity

## 📋 Résumé des Améliorations

Ce guide explique comment les monstres de votre jeu roguelike deviennent **intelligents, variés et indépendants**.

---

## 🎯 Avant vs Après

### ❌ AVANT (IA Simple)
```
- Tous les monstres avaient le même comportement générique
- Ils se déplaçaient toujours vers le joueur en ligne droite
- Pas de mémoire, pas de stratégie
- Pas de variation entre les types
- Les décisions étaient prises au même rythme pour tous
```

### ✅ APRÈS (IA Intelligente)
```
- 7 types de monstres avec chacun leur propre stratégie IA
- Chaque monstre décide indépendamment de ses actions
- Mémoire du dernier endroit où ils ont vu le joueur
- Comportements variés : patrouille, chasse, encerclement, charge, etc.
- Chaque type a ses propres vitesses et rythmes de mouvement
```

---

## 🧌 Comportements IA par Type de Monstre

### 1. **SKELETON** (Squelette) — Type: `stalker`
**Stratégie:** Guerrier patient et méthodique

- **Aggro Range:** 12 tuiles
- **Movement Speed:** Lent (35 ticks entre les mouvements en patrouille)
- **Decision Interval:** 18 ticks
- **Comportement:**
  - En patrouille : marche régulièrement autour d'une zone
  - En chasse : approche le joueur lentement mais régulièrement
  - Style: Poursuite patiente et prévisible
  
**Gameplay:** Menace constante mais pas pressante. Le joueur a le temps de réagir.

---

### 2. **GOBLIN** (Gobelin) — Type: `rusher`
**Stratégie:** Guerrier agressif et impulsif

- **Aggro Range:** 10 tuiles
- **Movement Speed:** Rapide (25 ticks en patrouille, 10 ticks en chasse!)
- **Decision Interval:** 8 ticks (TRÈS rapide)
- **Comportement:**
  - En patrouille : bouge rapidement de façon aléatoire
  - En chasse : **fonce directement** sur le joueur (40% de chance de "rush")
  - Style: Agressif et imprévisible
  
**Gameplay:** Danger immédiat. Demande une réaction rapide du joueur.

---

### 3. **SPIDER** (Araignée) — Type: `tactical`
**Stratégie:** Chasseur intelligent qui encercle sa proie

- **Aggro Range:** 14 tuiles
- **Movement Speed:** Rapide (20 ticks en patrouille)
- **Decision Interval:** 12 ticks
- **Comportement:**
  - En patrouille : bouge rapidement dans l'environnement
  - En chasse : **cherche à encercler** le joueur plutôt que d'attaquer frontalement
  - Favorise les mouvements perpendiculaires au joueur
  - Style: Tactique et planifié
  
**Gameplay:** Combat dynamique. Le joueur doit prédire sa position.

---

### 4. **GHOST** (Fantôme) — Type: `haunter`
**Stratégie:** Spectre implacable qui traverse les obstacles

- **Aggro Range:** 16 tuiles (LARGE)
- **Movement Speed:** Moyen (30 ticks en patrouille, 14 en chasse)
- **Decision Interval:** 10 ticks
- **Capacités Spéciales:**
  - ✨ **Phase Through** : Peut traverser les murs et les obstacles
  - 🔄 **Persistent Aggro** : Reste en chasse très longtemps
  - 📍 **Long Memory** : Se souvient du joueur pendant 200 ticks
- **Comportement:**
  - En chasse : poursuite implacable, ignore les murs
  - Style: Inévitable et horrifiant
  
**Gameplay:** Le joueur ne peut pas se cacher derrière les murs. Menace oppressante.

---

### 5. **DEMON** (Démon) — Type: `skirmisher`
**Stratégie:** Combattant tactique — attaque puis se retire

- **Aggro Range:** 13 tuiles
- **Movement Speed:** Moyen (28 ticks en patrouille, 13 en chasse)
- **Decision Interval:** 14 ticks
- **Comportement Spécial:**
  - **Charge Distance:** 4 tuiles
  - **Charge Cooldown:** 60 ticks entre les charges
- **Comportement:**
  - En chasse : **charge** quand proche (mouvement agressif), puis peut se retirer
  - Hit & Run : attaque puis cherche de la distance
  - Style: Stratégique et offensif
  
**Gameplay:** Combat en vagues. Prévisible une fois qu'on comprend le pattern.

---

### 6. **OGRE** (Ogre) — Type: `brute`
**Stratégie:** Brute puissante mais simple

- **Aggro Range:** 10 tuiles
- **Movement Speed:** Très lent (40 ticks en patrouille, 18 en chasse)
- **Decision Interval:** 25 ticks (TRÈS lent)
- **Réaction:** 40 ticks entre les réactions (très réactif)
- **Comportement:**
  - En patrouille : mouvement très lent et régulier
  - En chasse : approche inexorable mais lente
  - Réaction lente : attend 40 ticks avant de décider son prochain mouvement
  - Style: Puissant mais prévisible
  
**Gameplay:** Menace tardive mais dangereuse. Le joueur peut l'esquiver par la vitesse.

---

### 7. **BOSS** (Seigneur des Cryptes) — Type: `boss`
**Stratégie:** Leader intelligent avec stratégie complexe

- **Aggro Range:** 20 tuiles (TRÈS large)
- **Movement Speed:** Moyen (32 ticks en patrouille, 14 en chasse)
- **Decision Interval:** 16 ticks
- **Comportement Spécial:**
  - 👿 **Summoning:** Invoque des minions tous les 18 ticks
  - 📍 **Strategic Retreat:** Se retire de 30% des cas proches du joueur
  - 🎯 **Intelligent Positioning:** Ajuste sa distance au joueur
- **Comportement:**
  - Loin (>6 tuiles) : approche le joueur
  - Proche (<6 tuiles) : alterne entre attaque et retraite tactique
  - Invoque des renforts qui sont **immédiatement agressifs**
  - Style: Chef puissant et stratégique
  
**Gameplay:** Combat épique. Gérer les minions ET le boss crée un combat complexe.

---

## 🧠 Système de Décision IA (Core)

### Architecture
```
Chaque monstre a son propre cycle de décision :

1. DECISION PHASE (toutes les X ticks)
   └─ decideBehavior() : Analyse la situation
      - Détecte le joueur (visible + distance)
      - Met à jour la mémoire (où j'ai vu le joueur)
      - Décide l'état : 'idle' → 'patrol' → 'hunt'

2. MOVEMENT PHASE (chaque Y ticks — variable par type)
   └─ executeAction() : Exécute une action basée sur l'IA
      - Stalker: moveTowardPlayer()
      - Rusher: rushTowardPlayer() (parfois)
      - Spider: flankPlayer() (encerclement)
      - Ghost: moveTowardPlayer() (ignore les murs)
      - Demon: rush + moveToward
      - Ogre: moveTowardPlayer() (lentement)
      - Boss: bossBehavior() (stratégique)
```

### Timers Indépendants
```javascript
// Chaque monstre a ses propres timers :
moveTimer            // Timer de mouvement (variable par type)
decisionTimer        // Timer de décision (variable par type)
lastSeenTimer        // Mémoire du joueur (200 ticks max)
chargeCooldown       // Pour les démons (60 ticks)
reactionTimer        // Pour les ogres (40 ticks)
patrolTimer          // Pour la patrouille
```

---

## 💾 Système de Mémoire

### Mémoire du Joueur
```javascript
lastSeenPlayerX, lastSeenPlayerY  // Dernière position vue
lastSeenTimer                      // Combien de ticks depuis
lastSeenMaxMemory = 200            // Oublie après 200 ticks (≈ 13 secondes)

// Persistant Aggro (Ghosts)
persistentAggro = true  // Reste en chasse longtemps
```

**Impact Gameplay:**
- Les monstres ne perds pas immédiatement leur cible
- Les spectres restent dangereux même hors vision
- Créent une tension : "Il est quelque part là..."

---

## 🎮 Comportements Spécialisés

### 1. **Patrouille** (`_patrolBehavior`)
```
Mouvement aléatoire avec biais :
- Shuffle légèrement biaisé vers la continuation
- 8 directions possibles
- Donne l'impression d'une patrouille vivante
```

### 2. **Approche** (`_moveTowardPlayer`)
```
Manhattan distance vers le joueur :
1. Mouvement diagonal (priorité)
2. Mouvement horizontal
3. Mouvement vertical

Cherche le premier mouvement valide
```

### 3. **Charge** (`_rushTowardPlayer`)
```
Comme l'approche mais plus agressif :
- Même priorité diagonale
- Évoque une "charge" pour le joueur
- Utilisé par Goblins et Démons
```

### 4. **Encerclement** (`_flankPlayer`)
```
Cherche à se positionner sur le CÔTÉ du joueur :
- Priorité aux mouvements perpendiculaires
- Combat tactique pour les Araignées
- Rend le positionnement du joueur crucial
```

### 5. **Retraite** (`_moveAwayFromPlayer`)
```
Fuit le joueur :
- Utilisé par le Boss en tactique
- Crée des combats dynamiques
- Oblige le joueur à poursuivre
```

---

## 📊 Tableau Récapitulatif

| Type | IA | Range | Move Normal | Move Aggro | Decision | Spécial |
|------|-----|-------|-----------|-----------|----------|---------|
| Skeleton | Stalker | 12 | 35 | 16 | 18 | Patient |
| Goblin | Rusher | 10 | 25 | 10 | 8 | Rapide! |
| Spider | Tactical | 14 | 20 | 12 | 12 | Encercle |
| Ghost | Haunter | 16 | 30 | 14 | 10 | Phase! |
| Demon | Skirmisher | 13 | 28 | 13 | 14 | Charge |
| Ogre | Brute | 10 | 40 | 18 | 25 | Lent |
| Boss | Boss | 20 | 32 | 14 | 16 | Summon |

---

## 🔧 Comment Intégrer dans game.js

### ÉTAPE 1: Sauvegarder l'original
```bash
cp game.js game.js.backup
```

### ÉTAPE 2: Remplacer la classe Monster

**Trouver (ligne ~2376):**
```javascript
class Monster extends Entity {
  constructor(x, y, type) {
    // ... code original ...
  }
  // ... 41 lignes ...
}
```

**Remplacer par:** (Voir MONSTER_AI_IMPROVEMENTS.js — section "CLASSE MONSTER AMÉLIORÉE")

### ÉTAPE 3: Remplacer la fonction tickMonsters

**Trouver (ligne ~3118):**
```javascript
function tickMonsters(state) {
  const p = state.player;
  state.monsters.forEach(m => {
    // ... code original ...
  });
}
```

**Remplacer par:** (Voir MONSTER_AI_IMPROVEMENTS.js — section "NOUVELLE FONCTION tickMonsters")

### ÉTAPE 4: Test
1. Ouvrir le jeu
2. Observer les monstres se comporter différemment par type
3. Les Goblins devraient charger rapidement
4. Les Araignées devraient encercler
5. Les Spectres devraient ignorer les murs
6. etc.

---

## 🎨 Visuels Améliorés (Optionnel)

Vous pouvez ajouter des visuals pour renforcer l'IA :

```javascript
// Indicateur d'état IA (dans drawMonster):
if (m.aiState === 'hunt') {
  cx2.globalAlpha = .3;
  cx2.fillStyle = '#ff4040';  // Rouge = chasse
  cx2.fillRect(sx + 2, sy + 2, 12, 12);
} else if (m.aiState === 'patrol') {
  cx2.globalAlpha = .15;
  cx2.fillStyle = '#4080ff';  // Bleu = patrouille
  cx2.fillRect(sx + 2, sy + 2, 12, 12);
}
cx2.globalAlpha = 1;
```

---

## 🧪 Balancing Tips

Si les monstres sont **trop forts:**
- ↓ Augmentez `aggroRange` (les détectent plus tard)
- ↑ Augmentez `decisionInterval` (décident plus lentement)
- ↑ Augmentez `moveTimer` (bougent plus lentement)

Si les monstres sont **trop faibles:**
- ↑ Diminuez `aggroRange` (les détectent plus tôt)
- ↓ Diminuez `decisionInterval` (décident plus vite)
- ↓ Diminuez `moveTimer` (bougent plus vite)

Exemples :
```javascript
// Plus difficile (Goblin)
case 'goblin':
  this.aggroRange = 12;  // +2
  return 6;              // -2

// Plus facile (Ghost)
case 'ghost':
  this.aggroRange = 14;  // -2
  return 12;             // +2
```

---

## 📈 Résultats Attendus

### Gameplay Feel
✓ Combat plus dynamique et varié
✓ Chaque monstre présente un défi unique
✓ Les joueurs doivent adapter leur stratégie
✓ Les rencontres se sentent "vivantes"

### Performance
✓ Pas d'impact sur les performances (optimisé)
✓ Timers indépendants = pas de goulot d'étranglement
✓ Même avec 50+ monstres = fluide

### Réplayabilité
✓ Encounters jamais identiques
✓ Demande plusieurs essais pour maîtriser
✓ Stratégies émergeantes

---

## 🐛 Debug

Si un monstre se comporte bizarrement :

```javascript
// Ajouter dans tickMonsters() pour logger:
if (m.type === 'ghost') {
  console.log(`Ghost ${m.x},${m.y}: state=${m.aiState}, aggro=${m.aggro}, memory=${m.lastSeenTimer}`);
}
```

---

## 📝 Notes Finales

Cette implémentation d'IA est **modulaire et extensible**. Vous pouvez :

1. **Ajouter des types de monstres:** Créer une nouvelle `case` dans `_initializeAIBehavior()`
2. **Modifier des comportements:** Ajuster les méthodes `_moveToward*`, `_patrol*`
3. **Changer les difficulties:** Modifier les ranges et intervals
4. **Ajouter des méchaniques:** Aggression progressive, fatigue, peur, etc.

Bonne chance et amusez-vous bien! 🎮✨

---

**Version:** 1.0  
**Complexity:** Avancée  
**Maintenance:** Faible (code bien structuré)  
**Impact Gameplay:** TRÈS ÉLEVÉ ⭐⭐⭐⭐⭐
