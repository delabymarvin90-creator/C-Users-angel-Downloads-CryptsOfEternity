# 🎮 Crypts of Eternity — Améliorations IA des Monstres

## 📚 Fichiers Fournis

### 1. **MONSTER_AI_IMPROVEMENTS.js**
   - Contient le code complet de la classe `Monster` améliorée
   - Contient la nouvelle fonction `tickMonsters()`
   - **À copier-coller** directement dans `game.js`
   - **Prêt à utiliser** — pas d'modifications préalables nécessaires

### 2. **GUIDE_MONSTER_AI.md** 
   - Documentation détaillée de TOUS les comportements
   - Explication de chaque type de monstre
   - Tableau récapitulatif des stats
   - Tips de balancing pour ajuster la difficulté

### 3. **INSTALL_GUIDE.txt**
   - Instructions étape par étape pour installer le patch
   - Vérifications à faire après installation
   - Dépannage courant

### 4. **COMPARAISON_AVANT_APRES.txt**
   - Visualisation des différences gameplay
   - Exemples concrets de scénarios
   - Tableaux comparatifs

### 5. **EXEMPLES_AVANCES.md**
   - 8 exemples de personnalisation avancée
   - Comment ajouter de nouveaux types de monstres
   - Comment implémenter des mécaniques spéciales

### 6. **README.md** (ce fichier)
   - Vue d'ensemble du projet
   - Quick Start
   - Questions Fréquentes

---

## ⚡ Quick Start (5 minutes)

### Étape 1: Ouvrir game.js
Utilisez votre éditeur de code préféré (VS Code, Sublime Text, etc.)

### Étape 2: Trouver la classe Monster (ligne ~2376)
```javascript
class Monster extends Entity {
  constructor(x, y, type) {
    // ...
  }
  // ~41 lignes
}
```

### Étape 3: Sélectionner et supprimer
Sélectionnez **tout le code** de `class Monster` jusqu'au dernier `}`

### Étape 4: Copier depuis MONSTER_AI_IMPROVEMENTS.js
- Ouvrez le fichier `MONSTER_AI_IMPROVEMENTS.js`
- Copiez la section **"CLASSE MONSTER AMÉLIORÉE"**
- Collez dans game.js

### Étape 5: Trouver la fonction tickMonsters (ligne ~3118)
```javascript
function tickMonsters(state) {
  const p = state.player;
  // ...
}
```

### Étape 6: Sélectionner et supprimer
Sélectionnez **tout le code** de `function tickMonsters` jusqu'au dernier `}`

### Étape 7: Copier depuis MONSTER_AI_IMPROVEMENTS.js
- Copiez la section **"NOUVELLE FONCTION tickMonsters"**
- Collez dans game.js

### Étape 8: Sauvegarde et test!
- Sauvegardez game.js
- Ouvrez le jeu
- **Observez les monstres se comporter différemment!** 🎉

---

## 🎯 Quoi de Nouveau?

### Avant
```
❌ Tous les monstres se comportent identiquement
❌ Approche simple en ligne droite
❌ Pas de mémoire
❌ Pas de stratégie
❌ Pas de variances
```

### Après
```
✅ 7 types de monstres avec IA unique
✅ Stratégies variées (chasse, encerclement, retraite)
✅ Mémoire du joueur (200 ticks)
✅ Comportements spécialisés par type
✅ Chaque monstre a son propre rythme
✅ Spectres peuvent traverser les murs
✅ Boss avec stratégie complexe
```

---

## 🧌 Les 7 Types de Monstres

| Type | Style | Capacité Clé |
|------|-------|-------------|
| **Skeleton** | Stalker — Patient et régulier | Patrouille méthodique |
| **Goblin** | Rusher — Rapide et agressif | Charge directe (10 ticks!) |
| **Spider** | Tactical — Intelligent | Encerclement du joueur |
| **Ghost** | Haunter — Implacable | Phase Through (traverse murs) |
| **Demon** | Skirmisher — Hit & Run | Charge puis retraite |
| **Ogre** | Brute — Puissant et lent | Poursuite inévitable |
| **Boss** | Boss — Leader stratégique | Summon + Repositionnement |

---

## 🔧 Architecture Technique

### Système de Décision
Chaque monstre a son propre cycle:

```
TICK 1-N: decisionTimer compte
↓
DECISION: decideBehavior() s'exécute (détecte le joueur)
↓
ACTION: executeAction() bouge selon l'IA
↓
REPEAT avec son propre timing
```

### Indépendance
- Chaque monstre a son propre `moveTimer`
- Chaque monstre a son propre `decisionInterval`
- Chaque type bouge à sa vitesse
- Pas de synchronisation globale

### Mémoire
- Les monstres se souviennent du joueur pendant 200 ticks
- Les spectres restent en chasse très longtemps
- Crée une tension : "Il est quelque part..."

---

## 📊 Statistiques de Performance

### Impact CPU
- ✅ Pas d'impact notable sur les performances
- ✅ Optimisé pour 50+ monstres simultanés
- ✅ Aucun pathfinding complexe (A* pas nécessaire)

### Gameplay
- ✅ Combat plus dynamique
- ✅ Chaque rencontre est unique
- ✅ Demande une vraie stratégie du joueur

---

## 🎮 Conseils de Gameplay

### Pour les Joueurs
1. **Observe les patterns** — Chaque type bouge différemment
2. **Utilise l'environnement** — Les murs peuvent bloquer certains monstres
3. **Gère la distance** — Les spectres ignorent les obstacles
4. **Attaque en groupe** — Les élites (si activées) sont plus fortes

### Pour les Créateurs
1. **Commencez par tester** — Voyez comment chaque type joue
2. **Ajustez selon vos préférences** — Rendez les monstres plus/moins forts
3. **Créez des variantes** — Rendez les rencontres progressives
4. **Balancez le jeu** — Assurez-vous que ce n'est pas trop facile/difficile

---

## ❓ Questions Fréquentes

### Q: Installation va-t-elle briser mon jeu?
**R:** Non! Il suffit de remplacer deux sections de code. Tout le reste reste identique.
Faites une sauvegarde (game.js.backup) pour être sûr.

### Q: Comment les spectres traversent les murs?
**R:** Ils ont `canPhaseThrough = true`. Voir `_moveTowardPlayer()` dans la classe Monster.

### Q: Comment rendre le jeu plus difficile?
**R:** Diminuez `aggroRange`, diminuez `moveTimer`, augmentez `decisionInterval`.
Voir GUIDE_MONSTER_AI.md pour les détails.

### Q: Comment ajouter un nouveau monstre?
**R:** 5 étapes simple dans EXEMPLES_AVANCES.md exemple #1.

### Q: Les monstres peuvent-ils travailler en équipe?
**R:** Pas nativement, mais c'est facile à ajouter! Voir exemple #8 dans EXEMPLES_AVANCES.md

### Q: Comment les élites fonctionnent?
**R:** Voir exemple #7 dans EXEMPLES_AVANCES.md — monstres renforcés avec couleurs brillantes.

### Q: Pourquoi mon jeu crash après installation?
**R:** Vérifiez la console (F12) pour les erreurs. Assurez-vous que :
- La classe Monster est **complète**
- La fonction tickMonsters est **complète**
- Il n'y a pas de doublons

---

## 🚀 Prochaines Étapes

### Niveau 1: Installation
- Suivez INSTALL_GUIDE.txt
- Testez le jeu
- Observez les différences

### Niveau 2: Balancing
- Lisez GUIDE_MONSTER_AI.md
- Modifiez les ranges et timers
- Ajustez la difficulté

### Niveau 3: Personnalisation
- Consultez EXEMPLES_AVANCES.md
- Ajoutez vos propres comportements
- Créez de nouveaux types

### Niveau 4: Extension
- Ajoutez des élites
- Implémentez des sorts
- Créez des bosses spéciaux

---

## 📈 Roadmap Possible

Si vous voulez aller plus loin:

- [ ] Élites avec bonus visuels
- [ ] Bosses mini avec mécaniques spéciales
- [ ] Monstres qui se "parent" (alliés naturels)
- [ ] Monstres qui crient au secours
- [ ] Monstres avec faiblesses (feu, glace, etc.)
- [ ] Monstres qui "apprennent" des défaites précédentes
- [ ] Chefs de dungeon uniques par étage

---

## 📝 Notes Techniques

### Conventions de Code
- `aiState`: État IA ('idle', 'patrol', 'hunt')
- `aiType`: Type de comportement ('stalker', 'rusher', etc.)
- `moveTimer`: Ticks avant le prochain mouvement
- `decisionTimer`: Ticks avant la prochaine décision
- `lastSeenTimer`: Ticks depuis la dernière vue du joueur

### Optimisations Implémentées
- Pas de recalculs inutiles
- Les timers sont indépendants (pas de goulot)
- Les vérifications sont O(1) ou O(n) acceptable
- Memory footprint minimal

### Compatibilité
- Fonctionne avec la version fournie de game.js
- Ne touche PAS à `spawnMonsters()`
- Ne touche PAS à `drawMonster()` ou autres rendus
- Entièrement retrocompatible

---

## 🐛 Dépannage

### Symptôme: Les monstres ne bougent pas
**Solution:** Vérifiez que `_getMoveInterval()` existe et retourne un nombre > 0.

### Symptôme: "m.decideBehavior is not a function"
**Solution:** Assurez-vous que la classe Monster est complète. Vérifiez les accolades.

### Symptôme: Comportements identiques à l'original
**Solution:** Assurez-vous que `executeAction()` est appelée dans `tickMonsters()`.

### Symptôme: Erreur "Cannot read property 'aggroRange' of undefined"
**Solution:** Vérifiez que `_initializeAIBehavior()` est appelée dans le constructeur.

---

## 💡 Tips de Créateurs

### Pour tester rapidement
```javascript
// Dans la console (F12), pendant le jeu:
G.state.monsters[0].aggroRange = 20;  // Change la portée du premier monstre
G.state.monsters[0].moveTimer = 0;    // Force un mouvement immédiat
console.log(G.state.monsters[0]);     // Inspecte l'état IA
```

### Pour debugger
```javascript
// Ajouter dans tickMonsters() pour voir ce qui se passe:
if (m.type === 'skeleton') {
  console.log(`${m.name}: state=${m.aiState}, aggro=${m.aggro}, hp=${m.hp}`);
}
```

### Pour mesurer les perfs
```javascript
// Dans la boucle de jeu:
const start = performance.now();
tickMonsters(state);
const elapsed = performance.now() - start;
console.log(`Monsters AI: ${elapsed.toFixed(2)}ms`);
```

---

## 🎉 Résultats Attendus

Après installation, vous devriez observer:

1. **Variété** — Chaque monstre se comporte différemment
2. **Dynamique** — Les combats sont moins prévisibles
3. **Défi** — Le jeu est plus difficile de manière justes
4. **Immersion** — Les monstres se sentent "vivants"
5. **Replayabilité** — Jamais deux combats pareils

---

## 📞 Support

En cas de problème:
1. Vérifiez la console (F12) pour les erreurs
2. Consultez INSTALL_GUIDE.txt pour le dépannage
3. Relisez MONSTER_AI_IMPROVEMENTS.js pour vérifier le code
4. Testez avec le jeu original en sauvegarde

---

## 📄 Licence

Utilisez librement! Amusez-vous et créez des expériences de jeu géniales! 🎮

---

## 🙏 Remerciements

Merci d'avoir utilisé cette amélioration d'IA pour Crypts of Eternity!
J'espère que vos monstres deviennent plus intelligents et que vos joueurs
auront un temps meilleur! ✨

---

**Version:** 1.0  
**Dernière mise à jour:** 2026  
**Complexité:** Avancée  
**Impact:** TRÈS ÉLEVÉ ⭐⭐⭐⭐⭐

Bonne chance! 🚀
