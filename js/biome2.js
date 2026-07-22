// ═══════════════════════════════════════════════════════════════════════════
//  BIOME 2 — LA PYRAMIDE DU DÉSERT  (niveaux 6 à 10)
//  Placer dans le même dossier que index.html
//  Ajouter dans index.html juste avant </body> :
//    <script src="biome2.js"></script>
// ═══════════════════════════════════════════════════════════════════════════

/* ── Détection du biome ── */
function _b2IsDesert(f) { return f >= 6 && f <= 10; }

/* ══════════════════════════════════════════════════════════════════
   TEXTURES — même structure exacte que biome1, couleurs désert
═══════════════════════════════════════════════════════════════════ */

// Sol sable : 128×128, dalles 16×16 — clone de la génération biome1
// avec palette chaude (sable/or) au lieu de bleu-ardoise
function _b2BuildFloorTex() {
  const S = 128, TS2 = 16;
  const { c, x } = mkCanvas(S, S);
  const rng = seededRng(0xDEAD2501);

  const slabPal = ['#c8a840','#b89430','#d4b450','#a07820','#c0a038','#baa040'];

  for (let row = 0; row < S / TS2; row++) {
    for (let col = 0; col < S / TS2; col++) {
      const sx = col * TS2, sy = row * TS2;
      const t = rng();
      const base = slabPal[((col * 7 + row * 3 + (t * 5 | 0)) % slabPal.length)];

      x.fillStyle = base;
      x.fillRect(sx, sy, TS2, TS2);

      // Gradient diagonal léger
      const dg = x.createLinearGradient(sx, sy, sx + TS2, sy + TS2);
      dg.addColorStop(0,   'rgba(255,255,255,0.07)');
      dg.addColorStop(0.5, 'rgba(0,0,0,0)');
      dg.addColorStop(1,   'rgba(0,0,0,0.10)');
      x.fillStyle = dg;
      x.fillRect(sx, sy, TS2, TS2);

      // Grain de sable
      for (let i = 0; i < 12; i++) {
        const nx = sx + 1 + (rng() * (TS2 - 2)) | 0;
        const ny = sy + 1 + (rng() * (TS2 - 2)) | 0;
        x.globalAlpha = 0.03 + rng() * 0.07;
        x.fillStyle = rng() > 0.5 ? '#e8d070' : '#7a5810';
        x.fillRect(nx, ny, 1, 1);
      }
      x.globalAlpha = 1;

      // Joint bas + droite (mortier sable foncé)
      x.fillStyle = '#5a3c08';
      x.globalAlpha = 0.7;
      x.fillRect(sx, sy + TS2 - 1, TS2, 1);
      x.fillRect(sx + TS2 - 1, sy, 1, TS2);
      x.globalAlpha = 1;

      // Highlight haut + gauche
      x.fillStyle = '#e8cc60';
      x.globalAlpha = 0.18;
      x.fillRect(sx, sy, TS2 - 1, 1);
      x.fillRect(sx, sy, 1, TS2 - 1);
      x.globalAlpha = 1;
    }
  }

  // Petits cailloux sablés
  for (let i = 0; i < 18; i++) {
    const px2 = 2 + (rng() * (S - 4)) | 0;
    const py2 = 2 + (rng() * (S - 4)) | 0;
    const sz  = 1 + (rng() * 2 | 0);
    x.fillStyle = '#3a2808'; x.fillRect(px2 + 1, py2 + 1, sz, sz);
    x.fillStyle = rng() < 0.5 ? '#9a7030' : '#7a5820';
    x.fillRect(px2, py2, sz, sz);
    x.fillStyle = '#d4aa50'; x.globalAlpha = 0.8;
    x.fillRect(px2, py2, 1, 1);
    x.globalAlpha = 1;
  }
  return c;
}

// Mur grès : 128×128, briques 16×8 — clone de la génération biome1
// avec palette grès chaud (ocre/sable) au lieu de bleu-noir
function _b2BuildWallTex() {
  const S = 128, BW = 16, BH = 8;
  const { c, x } = mkCanvas(S, S);
  const rng = seededRng(0xBEEF2502);

  // Mortier sable foncé
  x.fillStyle = '#4a3010';
  x.fillRect(0, 0, S, S);

  const brickPal = ['#c0944c','#b08040','#ca9e54','#a87838','#b88c48','#d0a860'];

  const rows = S / BH;
  const cols = S / BW + 1;
  for (let row = 0; row < rows; row++) {
    const oy = row * BH;
    const offset = (row % 2) === 0 ? 0 : BW / 2;
    for (let col = 0; col < cols; col++) {
      const ox = col * BW - offset;
      const bx = ox, by = oy;
      const bw = BW - 1, bh = BH - 1;

      const t = rng();
      const bCol = brickPal[(col * 5 + row * 3 + (t * 4 | 0)) % brickPal.length];

      x.fillStyle = bCol;
      x.fillRect(bx, by, bw, bh);

      // Gradient : plus clair en haut
      const bg = x.createLinearGradient(bx, by, bx, by + bh);
      bg.addColorStop(0,   'rgba(255,255,255,0.09)');
      bg.addColorStop(0.5, 'rgba(0,0,0,0)');
      bg.addColorStop(1,   'rgba(0,0,0,0.18)');
      x.fillStyle = bg;
      x.fillRect(bx, by, bw, bh);

      // Grain
      for (let i = 0; i < 5; i++) {
        const nx = bx + (rng() * (bw - 1)) | 0;
        const ny = by + (rng() * (bh - 1)) | 0;
        x.globalAlpha = 0.04 + rng() * 0.08;
        x.fillStyle = rng() > 0.5 ? '#e8c870' : '#6a4010';
        x.fillRect(nx, ny, 1, 1);
      }
      x.globalAlpha = 1;

      // Highlight haut
      x.fillStyle = '#d4b060';
      x.globalAlpha = 0.5;
      x.fillRect(bx, by, bw, 1);
      x.globalAlpha = 1;

      // Égratignure rare
      if (rng() < 0.12) {
        x.fillStyle = '#5a3808';
        x.globalAlpha = 0.4;
        const sx2 = bx + 1 + (rng() * (bw - 2)) | 0;
        const sy2 = by + 1 + (rng() * (bh - 2)) | 0;
        x.fillRect(sx2, sy2, 1 + (rng() * 3 | 0), 1);
        x.globalAlpha = 1;
      }
    }
  }
  return c;
}

// Sable mouvant : 128×128, texture unie sombre (sans joints ni détails)
function _b2BuildQsTex() {
  const S = 128;
  const { c, x } = mkCanvas(S, S);
  x.fillStyle = '#7a5a18';
  x.fillRect(0, 0, S, S);
  const rng = seededRng(0xABCD8888);
  for (let i = 0; i < S * S * 0.08; i++) {
    x.globalAlpha = 0.04 + rng() * 0.06;
    x.fillStyle = rng() < 0.5 ? '#8a6a20' : '#6a4c14';
    x.fillRect((rng() * S) | 0, (rng() * S) | 0, 1, 1);
  }
  x.globalAlpha = 1;
  return c;
}

// Plafond désert (wall top)
function _b2BuildWallTopTex() {
  const S = 16;
  const { c, x } = mkCanvas(S, S);
  const g = x.createRadialGradient(8, 8, 0, 8, 8, 10);
  g.addColorStop(0, '#3a2808'); g.addColorStop(1, '#2a1c04');
  x.fillStyle = g; x.fillRect(0, 0, S, S);
  x.globalAlpha = 0.07; x.fillStyle = '#c0944c';
  x.fillRect(0, 0, 7, 7); x.fillRect(9, 8, 7, 8);
  x.globalAlpha = 1;
  return c;
}

// Version assombrie (explored-but-not-visible)
function _b2Dim(src) {
  if (!src) return null;
  const { c, x } = mkCanvas(src.width, src.height);
  x.drawImage(src, 0, 0);
  x.globalCompositeOperation = 'multiply';
  x.fillStyle = '#3a2808'; x.fillRect(0, 0, src.width, src.height);
  x.globalCompositeOperation = 'source-over';
  x.globalAlpha = 0.35; x.fillStyle = '#000'; x.fillRect(0, 0, src.width, src.height);
  return c;
}

/* ══════════════════════════════════════════════════════════════════
   SPRITES MONSTRES
═══════════════════════════════════════════════════════════════════ */

function _b2BuildMummy() {
  SPR.monsters.mummy = [];
  [0, 1].forEach(fi => {
    const S = 16;
    const { c, x } = mkCanvas(S, S);
    const bob = fi;
    const m1 = '#d4c898', m2 = '#b8ac78', m3 = '#c0b488';
    const band = '#a8986c', dark = '#6a5c38';

    // Ombre
    x.globalAlpha = 0.25; x.fillStyle = '#000';
    x.beginPath(); x.ellipse(8, 15, 5, 1.5, 0, 0, Math.PI * 2); x.fill();
    x.globalAlpha = 1;

    // Corps
    x.fillStyle = m1; x.fillRect(3, 5 - bob, 10, 9);
    x.fillStyle = m2; x.fillRect(4, 6 - bob, 8, 7);
    [0, 2, 4, 6].forEach(dy => { x.fillStyle = band; x.fillRect(3, 6 + dy - bob, 10, 1); });
    x.fillStyle = dark; x.fillRect(5, 5 - bob, 1, 9);
    x.fillStyle = dark; x.fillRect(10, 5 - bob, 1, 9);

    // Bras tendus
    x.fillStyle = m1;
    x.fillRect(0, 6 - fi, 3, 2);
    x.fillRect(13, 6 - fi, 3, 2);

    // Jambes
    x.fillStyle = m2; x.fillRect(4, 14 - bob, 3, 2); x.fillRect(9, 14 - bob, 3, 2);

    // Tête
    x.fillStyle = m3; x.fillRect(3, 1 - bob, 10, 5);
    x.fillStyle = m1; x.fillRect(4, 0 - bob, 8, 4);

    // Yeux magiques verts
    x.fillStyle = '#40ff80'; x.fillRect(5, 2 - bob, 2, 2); x.fillRect(9, 2 - bob, 2, 2);
    x.fillStyle = '#ffffff'; x.fillRect(5, 2 - bob, 1, 1); x.fillRect(9, 2 - bob, 1, 1);

    // Bandage sur visage
    x.fillStyle = band; x.globalAlpha = 0.7; x.fillRect(3, 3 - bob, 10, 1); x.globalAlpha = 1;

    SPR.monsters.mummy.push(c);
  });
}

function _b2BuildScorpion() {
  SPR.monsters.scorpion = [];
  [0, 1].forEach(fi => {
    const S = 18;
    const { c, x } = mkCanvas(S, S);
    const alt = fi;
    const s1 = '#181808', s2 = '#2c2c10', s3 = '#484820';
    const clw = '#484820', sting = '#10b010';

    x.globalAlpha = 0.22; x.fillStyle = '#000';
    x.beginPath(); x.ellipse(9, 17, 7, 2, 0, 0, Math.PI * 2); x.fill(); x.globalAlpha = 1;

    const tailY = alt;
    x.fillStyle = s2; x.fillRect(11, 6, 2, 3);
    x.fillStyle = s2; x.fillRect(12, 3, 2, 4);
    x.fillStyle = s2; x.fillRect(13, 1 + tailY, 2, 3);
    x.fillStyle = s3; x.fillRect(14, 1 + tailY, 1, 2);
    x.fillStyle = sting; x.fillRect(15, tailY, 1, 1); x.fillRect(14, tailY + 1, 1, 1);

    x.fillStyle = s1; x.fillRect(3, 7, 12, 7);
    x.fillStyle = s2; x.fillRect(4, 8, 10, 5);
    x.fillStyle = s3; x.fillRect(5, 9, 8, 3);
    [0, 2, 4].forEach(dy => { x.fillStyle = s1; x.fillRect(3, 8 + dy, 12, 1); });

    const legOff = alt;
    [[0, 9], [0, 11], [0, 13]].forEach(([lx, ly]) => {
      x.fillStyle = s2; x.fillRect(lx, ly + legOff, 3, 1); x.fillRect(15, ly + legOff, 3, 1);
    });

    x.fillStyle = clw; x.fillRect(0, 7, 4, 2); x.fillRect(14, 7, 4, 2);
    x.fillStyle = '#2e2e10'; x.fillRect(0, 8, 4, 1); x.fillRect(14, 8, 4, 1);

    x.fillStyle = s2; x.fillRect(4, 5, 10, 3);
    x.fillStyle = s3; x.fillRect(5, 5, 8, 2);
    x.fillStyle = '#ff4400'; x.fillRect(5, 5, 2, 2); x.fillRect(11, 5, 2, 2);
    x.fillStyle = '#ff8800'; x.fillRect(5, 5, 1, 1); x.fillRect(11, 5, 1, 1);

    SPR.monsters.scorpion.push(c);
  });
}

// Ver des Sables — 2 frames : tête émergée / attaque
function _b2BuildSandworm() {
  SPR.monsters.sandworm = [];

  // Frame 0 : tête qui émerge (visible quand player à 1-2 cases)
  {
    const S = 16;
    const { c, x } = mkCanvas(S, S);
    const w1 = '#c89040', w2 = '#e0b050', w3 = '#a87030', w4 = '#f0cc78';

    x.fillStyle = w2; x.fillRect(3, 9, 10, 5);
    x.fillStyle = w1; x.fillRect(4, 9, 8, 4);
    x.fillStyle = '#806020'; x.fillRect(3, 10, 10, 1);

    x.fillStyle = w2; x.fillRect(4, 4, 8, 6);
    x.fillStyle = w1; x.fillRect(5, 4, 6, 5);
    x.fillStyle = w4; x.fillRect(6, 4, 4, 2);

    x.fillStyle = '#602010'; x.fillRect(5, 8, 6, 1);

    x.fillStyle = '#0a0a0a'; x.fillRect(5, 5, 2, 2); x.fillRect(9, 5, 2, 2);
    x.fillStyle = '#ff8000'; x.fillRect(5, 5, 1, 1); x.fillRect(9, 5, 1, 1);

    SPR.monsters.sandworm.push(c);
  }

  // Frame 1 : attaque (bouche ouverte)
  {
    const S = 16;
    const { c, x } = mkCanvas(S, S);
    const w1 = '#c89040', w2 = '#e0b050', w4 = '#f0cc78';
    const fang = '#f0ead0', mouth = '#602010';

    x.fillStyle = w2; x.fillRect(3, 10, 10, 5);
    x.fillStyle = w1; x.fillRect(4, 10, 8, 4);
    x.fillStyle = '#806020'; x.fillRect(3, 11, 10, 1);

    x.fillStyle = w2; x.fillRect(2, 2, 12, 9);
    x.fillStyle = w1; x.fillRect(3, 3, 10, 7);
    x.fillStyle = w4; x.fillRect(4, 3, 8, 2);

    x.fillStyle = mouth; x.fillRect(3, 8, 10, 3);
    x.fillStyle = '#3a0c04'; x.fillRect(4, 9, 8, 1);
    [3, 5, 7, 9, 11].forEach(fx => {
      x.fillStyle = fang; x.fillRect(fx, 7, 1, 2); x.fillRect(fx, 10, 1, 2);
    });

    x.fillStyle = '#ff2000'; x.fillRect(4, 4, 2, 2); x.fillRect(10, 4, 2, 2);
    x.fillStyle = '#ff8800'; x.fillRect(4, 4, 1, 1); x.fillRect(10, 4, 1, 1);
    x.globalAlpha = 0.2; x.fillStyle = '#ff6010'; x.fillRect(2, 7, 12, 5); x.globalAlpha = 1;

    SPR.monsters.sandworm.push(c);
  }
}

/* ══════════════════════════════════════════════════════════════════
   DONNÉES MONSTRES DÉSERT
═══════════════════════════════════════════════════════════════════ */
const _B2_MONSTERS = {
  mummy:    { hp: 22, atk: 7,  col: '#d4c898', name: 'Momie',          speed: 3  },
  scorpion: { hp: 8,  atk: 5,  col: '#2c2c10', name: 'Scorpion',       speed: 1  },
  sandworm: { hp: 15, atk: 6,  col: '#c89040', name: 'Ver des Sables', speed: 99 },
};

(function() {
  const _orig = Monster.prototype._setup;
  Monster.prototype._setup = function() {
    const dm = _B2_MONSTERS[this.type];
    if (dm) {
      this.maxHp = dm.hp; this.hp = dm.hp;
      this.atk = dm.atk; this.col = dm.col; this.name = dm.name;
      this.speed = dm.speed;
      this.attackWarningTimer = 0;
    } else {
      _orig.call(this);
    }
  };
})();

/* ══════════════════════════════════════════════════════════════════
   GÉNÉRATION DES SABLES MOUVANTS
═══════════════════════════════════════════════════════════════════ */
function _b2GenQuicksands(map, MAP_W, MAP_H, seed) {
  const rng = seededRng(seed ^ 0xABCD1234);
  const set = new Set();
  const list = [];
  const numPatches = 4 + (rng() * 5 | 0);

  for (let attempt = 0; attempt < numPatches * 40 && list.length < numPatches * 3; attempt++) {
    const qx = 3 + (rng() * (MAP_W - 6) | 0);
    const qy = 3 + (rng() * (MAP_H - 6) | 0);
    if (map[qy]?.[qx] !== T.FLOOR) continue;
    if (qx < 12 && qy < 12) continue;
    const key = `${qx},${qy}`;
    if (set.has(key)) continue;
    set.add(key); list.push({ x: qx, y: qy });

    // Étendre la tache (2-4 cases)
    const patchSize = 1 + (rng() * 3 | 0);
    for (let p = 0; p < patchSize * 4; p++) {
      const nx = qx + (rng() * 3 | 0) - 1;
      const ny = qy + (rng() * 3 | 0) - 1;
      if (nx < 1 || ny < 1 || nx >= MAP_W - 1 || ny >= MAP_H - 1) continue;
      if (map[ny]?.[nx] === T.FLOOR) {
        const k2 = `${nx},${ny}`;
        if (!set.has(k2)) { set.add(k2); list.push({ x: nx, y: ny }); }
      }
    }
  }
  return { list, set };
}

/* ══════════════════════════════════════════════════════════════════
   SPAWN MONSTRES DÉSERT
   Vers des sables UNIQUEMENT sur cases de sables mouvants
═══════════════════════════════════════════════════════════════════ */
function _b2SpawnMonsters(rooms, floor, quicksandSet) {
  const monsPerRoom = 1 + Math.floor((floor - 5) / 2);
  const hpMult  = 1 + (floor - 1) * 0.35;
  const atkMult = 1 + (floor - 1) * 0.25;
  const result = [];
  const occupied = new Set();

  rooms.slice(1).forEach(r => {
    const n = monsPerRoom + (Math.random() * 2 | 0);
    let placed = 0, attempts = 0;
    while (placed < n && attempts < n * 12) {
      attempts++;
      const mx = r.x + 1 + (Math.random() * (r.w - 2) | 0);
      const my = r.y + 1 + (Math.random() * (r.h - 2) | 0);
      const key = `${mx},${my}`;
      if (occupied.has(key)) continue;

      // Ver = seulement sur sable mouvant, sinon mummy/scorpion
      let pool;
      if (quicksandSet.has(key)) {
        pool = ['mummy', 'scorpion', 'sandworm'];
      } else {
        pool = ['mummy', 'scorpion'];
      }
      const tp = pool[Math.floor(Math.random() * pool.length)];
      occupied.add(key);

      const m = new Monster(mx, my, tp);
      m.maxHp = Math.ceil(m.maxHp * hpMult);
      m.hp = m.maxHp;
      m.atk = Math.ceil(m.atk * atkMult);
      m.xpR = Math.floor(m.xpR * hpMult);
      if (tp === 'sandworm') { m._wormHidden = true; m._wormAttackCd = 0; }
      result.push(m);
      placed++;
    }
  });

  // Garantir au moins 1 ver si des sables mouvants existent
  if (quicksandSet.size > 0 && !result.some(m => m.type === 'sandworm')) {
    const qsArr = [...quicksandSet];
    const pick = qsArr[Math.floor(Math.random() * qsArr.length)];
    if (!occupied.has(pick)) {
      const [wx, wy] = pick.split(',').map(Number);
      const worm = new Monster(wx, wy, 'sandworm');
      worm.maxHp = Math.ceil(worm.maxHp * hpMult);
      worm.hp = worm.maxHp;
      worm.atk = Math.ceil(worm.atk * atkMult);
      worm.xpR = Math.floor(worm.xpR * hpMult);
      worm._wormHidden = true;
      worm._wormAttackCd = 0;
      result.push(worm);
    }
  }
  return result;
}

/* ══════════════════════════════════════════════════════════════════
   IA DÉSERT — patch tickMonsters
═══════════════════════════════════════════════════════════════════ */
(function() {
  const _orig = window.tickMonsters;
  window.tickMonsters = function(state) {
    if (!state._biome2) { _orig(state); return; }

    const p = state.player;

    // Séparer les monstres désert spéciaux des monstres standard
    const special = state.monsters.filter(m => m.type === 'mummy' || m.type === 'sandworm');
    const standard = state.monsters.filter(m => m.type !== 'mummy' && m.type !== 'sandworm');

    // IA spéciale momie
    special.filter(m => m.type === 'mummy').forEach(m => {
      if (!m.alive) return;
      _b2TickMummy(m, p, state);
    });

    // IA spéciale ver des sables
    special.filter(m => m.type === 'sandworm').forEach(m => {
      if (!m.alive) return;
      _b2TickSandworm(m, p, state);
    });

    // Tick standard pour scorpions + tout le reste
    const saved = state.monsters;
    state.monsters = standard;
    _orig(state);
    state.monsters = saved;

    // Poison joueur
    _b2TickPoison(p, state);

    // Check sable mouvant
    _b2CheckQuicksand(p, state);
  };
})();

// ── Momie : lente, garde ≥3 cases, attaque magique à distance ──
function _b2TickMummy(m, p, state) {
  m.update(); m.updateTween();

  if (m.attackWarningTimer > 0) {
    m.attackWarningTimer--;
    if (m.attackWarningTimer === 0) {
      const dmg = Math.max(1, m.atk - p.def + (Math.random() * 3 | 0));
      p.hp = Math.max(0, p.hp - dmg);
      if (dmg > 0) {
        floatDmg(p.x, p.y, `-${dmg}`, '#40ff80');
        flash('rgba(0,180,80,.3)');
        log(`La Momie envoûte : -${dmg} PV`, '#40ff80');
        state.particles.spawn(p.x, p.y, '#00ff80', 8, 'magic');
        if (typeof SFX !== 'undefined') SFX.hit && SFX.hit();
        if (p.hp <= 0) G._die(p);
      }
    }
    return;
  }

  m.moveTimer = (m.moveTimer || 1) - 1;
  if (m.moveTimer > 0) return;

  const dist = Math.abs(p.x - m.x) + Math.abs(p.y - m.y);
  if (dist <= 9 && state.visible[m.y]?.[m.x]) m.aggro = true;
  if (dist > 14) m.aggro = false;
  if (!m.aggro) { m.moveTimer = (m.speed || 3) + 14; return; }

  m.moveTimer = m.speed || 3;

  if (dist <= 3) {
    // Déclencher attaque magique
    m.attackWarningTimer = 2;
    // Reculer si trop proche (< 3 cases)
    if (dist < 3) {
      const ax = Math.sign(m.x - p.x), ay = Math.sign(m.y - p.y);
      const nx = m.x + ax, ny = m.y + ay;
      if (state.map[ny]?.[nx] === T.FLOOR &&
          !state.monsters.some(o => o.alive && o !== m && o.x === nx && o.y === ny)) {
        m.startMove(nx, ny);
      }
    }
  } else if (dist > 4) {
    // Se rapprocher jusqu'à 3 cases
    const sx = Math.sign(p.x - m.x), sy = Math.sign(p.y - m.y);
    for (const [mx2, my2] of [[sx, sy], [sx, 0], [0, sy]]) {
      if (mx2 === 0 && my2 === 0) continue;
      const nx = m.x + mx2, ny = m.y + my2;
      if (Math.abs(p.x - nx) + Math.abs(p.y - ny) < 3) continue;
      if (state.map[ny]?.[nx] === T.FLOOR &&
          !state.monsters.some(o => o.alive && o !== m && o.x === nx && o.y === ny)) {
        m.startMove(nx, ny); break;
      }
    }
  }
}

// ── Ver des sables : caché sous le sol, émerge à 1-2 cases, attaque et replonge ──
function _b2TickSandworm(m, p, state) {
  m.updateTween();
  if (m._wormAttackCd > 0) { m._wormAttackCd--; return; }

  const dist = Math.abs(p.x - m.x) + Math.abs(p.y - m.y);

  if (dist > 2) {
    m._wormHidden = true;
    return;
  }

  // Émerge à 1-2 cases
  if (m._wormHidden) {
    m._wormHidden = false;
    log('Un Ver des Sables émerge du sol !', '#f0b060');
  }

  if (dist <= 1) {
    // Attaque et se réenfouit
    const dmg = Math.max(1, m.atk - p.def + (Math.random() * 2 | 0));
    p.hp = Math.max(0, p.hp - dmg);
    if (dmg > 0) {
      floatDmg(p.x, p.y, `-${dmg}`, '#ff8040');
      flash('rgba(180,100,0,.3)');
      log(`Le Ver des Sables surgit ! -${dmg} PV`, '#f0b060');
      if (typeof SFX !== 'undefined') SFX.hit && SFX.hit();
      state.particles.spawn(p.x, p.y, '#c08020', 8, 'hit');
      if (p.hp <= 0) { G._die(p); return; }
    }
    // Se réenfouit + repositionnement sur un sable mouvant voisin
    m._wormHidden = true;
    m._wormAttackCd = 6;
    if (state.quicksandSet) {
      const nearby = [];
      for (const key of state.quicksandSet) {
        const [qx, qy] = key.split(',').map(Number);
        if (Math.abs(qx - m.x) <= 4 && Math.abs(qy - m.y) <= 4 &&
            (qx !== m.x || qy !== m.y) &&
            !state.monsters.some(o => o.alive && o !== m && o.x === qx && o.y === qy)) {
          nearby.push({ x: qx, y: qy });
        }
      }
      if (nearby.length > 0) {
        const dest = nearby[Math.floor(Math.random() * nearby.length)];
        m.x = dest.x; m.y = dest.y;
        m.rx = m.x * 16; m.ry = m.y * 16;
        m.tx = m.rx; m.ty = m.ry;
      }
    }
  }
}

/* ══════════════════════════════════════════════════════════════════
   POISON SCORPION
═══════════════════════════════════════════════════════════════════ */
(function() {
  const _orig = G.attack.bind(G);
  G.attack = function(player, mon) {
    _orig(player, mon);
    if (this.state?._biome2 && mon.type === 'scorpion' && mon.alive && Math.random() < 0.35) {
      if (!player._poisonTicks || player._poisonTicks <= 0) {
        player._poisonTicks = 8;
        player._poisonTimer = 0;
        log('☠ Poison du Scorpion ! (-1 PV/s)', '#40e040');
        flash('rgba(0,130,0,.2)');
      }
    }
  };
})();

function _b2TickPoison(p, state) {
  if (!p._poisonTicks || p._poisonTicks <= 0) return;
  p._poisonTimer = (p._poisonTimer || 0) + 1;
  if (p._poisonTimer < 60) return;
  p._poisonTimer = 0;
  p._poisonTicks--;
  p.hp = Math.max(0, p.hp - 1);
  floatDmg(p.x, p.y, '☠1', '#40e040');
  state.particles.spawn(p.x, p.y, '#00cc00', 3, 'magic');
  if (p.hp <= 0) G._die(p);
  if (p._poisonTicks <= 0) log('Le poison se dissipe.', '#80e080');
}

/* ══════════════════════════════════════════════════════════════════
   SABLE MOUVANT — Ralentissement ×2 (1 mouvement sur 2)
═══════════════════════════════════════════════════════════════════ */
function _b2CheckQuicksand(p, state) {
  if (!state.quicksandSet) { p._onQuicksand = false; return; }
  p._onQuicksand = state.quicksandSet.has(`${p.x},${p.y}`);
}

(function() {
  const _orig = G.tryMove.bind(G);
  G.tryMove = function(dx, dy) {
    const p = this.state?.player;
    // Ne rien faire si un mouvement est déjà en cours (tween) — évite de
    // désynchroniser le flag _qsSkip quand une touche répète pendant l'animation.
    if (p && p.moving) { _orig(dx, dy); return; }
    if (this.state?._biome2 && p?._onQuicksand) {
      p._qsSkip = !p._qsSkip;
      if (p._qsSkip) {
        if (!p._qsLogCd) { log('Les sables mouvants vous ralentissent…', '#b09040'); p._qsLogCd = 45; }
        this._updatePlayerDir && this._updatePlayerDir(dx, dy);
      }
      if (p._qsLogCd > 0) p._qsLogCd--;
      if (p._qsSkip) return;
    } else if (p) {
      p._qsSkip = false;
    }
    _orig(dx, dy);
  };
})();

/* ══════════════════════════════════════════════════════════════════
   RENDU
═══════════════════════════════════════════════════════════════════ */

// Ver des sables : ne pas afficher quand caché sous le sol
(function() {
  const _orig = window.drawMonster;
  window.drawMonster = function(ctx2, m, camX, camY) {
    if (m.type === 'sandworm') {
      if (m._wormHidden) return;
      // Frame 0 = tête, frame 1 = attaque
      const fi = m._wormAttackCd > 0 ? 1 : 0;
      const sprs = SPR.monsters.sandworm;
      if (!sprs?.[fi]) return;
      const sx = (m.rx - camX) | 0, sy = (m.ry - camY) | 0;
      // Légère lueur orangée pour signaler la présence
      ctx2.globalAlpha = 0.18 + 0.1 * Math.sin((G.frame || 0) * 0.15);
      ctx2.fillStyle = '#ff8000';
      ctx2.fillRect(sx + 2, sy + 2, 12, 12);
      ctx2.globalAlpha = 1;
      ctx2.imageSmoothingEnabled = false;
      ctx2.drawImage(sprs[fi], sx - 1, sy - 3, 18, 18);
      if (m.hp < m.maxHp) {
        const r = m.hp / m.maxHp;
        ctx2.fillStyle = '#200808'; ctx2.fillRect(sx + 1, sy - 3, 14, 2);
        ctx2.fillStyle = r > 0.5 ? '#30b030' : '#b02020';
        ctx2.fillRect(sx + 1, sy - 3, (14 * r) | 0, 2);
      }
      return;
    }
    _orig(ctx2, m, camX, camY);
  };
})();

// Overlay sables mouvants (dessinés PAR-DESSUS les dalles de sol)
(function() {
  const _orig = window.drawOverlays;
  window.drawOverlays = function(ctx, state, camX, camY, frame) {
    _orig(ctx, state, camX, camY, frame);
    if (!state._biome2 || !state.quicksandList || !SPR._b2QsTex) return;
    for (const q of state.quicksandList) {
      const exp = state.explored?.[q.y]?.[q.x];
      if (!exp) continue;
      const vis = state.visible?.[q.y]?.[q.x];
      const sx = (q.x * 16 - camX) | 0;
      const sy = (q.y * 16 - camY) | 0;
      const srcX = (q.x * 16) & 127, srcY = (q.y * 16) & 127;
      ctx.globalAlpha = vis ? 1 : 0.5;
      _drawWrapped(ctx, SPR._b2QsTex, srcX, srcY, 16, 16, sx, sy);
      ctx.globalAlpha = 1;
    }
  };
})();

// Swap textures désert avant render(), restaurer après
(function() {
  const _orig = G.loop.bind(G);
  G.loop = function() {
    const isDesert = this.state?._biome2;
    if (isDesert && SPR._b2FloorTex) {
      if (!SPR._b2Orig) {
        SPR._b2Orig = {
          floorTex: SPR.floorTex, floor: SPR.floor, floorB: SPR.floorB,
          wallTex: SPR.wallTex, wall: SPR.wall, wallTop: SPR.wallTop,
          dimFloor: DIM.floor, dimFloorB: DIM.floorB, dimWall: DIM.wall,
        };
      }
      SPR.floorTex = SPR._b2FloorTex; SPR.floor = SPR._b2FloorTex; SPR.floorB = SPR._b2FloorTex;
      SPR.wallTex  = SPR._b2WallTex;  SPR.wall  = SPR._b2WallTex;
      SPR.wallTop  = SPR._b2WallTopTex;
      DIM.floor = DIM._b2Floor; DIM.floorB = DIM._b2Floor; DIM.wall = DIM._b2Wall;
    } else if (!isDesert && SPR._b2Orig) {
      SPR.floorTex = SPR._b2Orig.floorTex; SPR.floor = SPR._b2Orig.floor; SPR.floorB = SPR._b2Orig.floorB;
      SPR.wallTex  = SPR._b2Orig.wallTex;  SPR.wall  = SPR._b2Orig.wall;
      SPR.wallTop  = SPR._b2Orig.wallTop;
      DIM.floor = SPR._b2Orig.dimFloor; DIM.floorB = SPR._b2Orig.dimFloorB; DIM.wall = SPR._b2Orig.dimWall;
    }
    _orig();
  };
})();

/* ══════════════════════════════════════════════════════════════════
   LUMIÈRE — Biome désert plus éclairé (pyramide)
═══════════════════════════════════════════════════════════════════ */
(function() {
  const _orig = window.buildLightmap;
  window.buildLightmap = function(state, camX, camY, ox, oy) {
    if (!state?._biome2) { _orig(state, camX, camY, ox, oy); return; }
    const lc = lightCx;
    const cw = lightCv.width, ch = lightCv.height;
    lc.fillStyle = 'rgba(0,0,0,0.42)';
    lc.fillRect(0, 0, cw, ch);
    lc.save();
    lc.globalCompositeOperation = 'destination-out';
    const p = state.player;
    const plx = ox + (p.rx - camX + 8) * SCALE;
    const ply = oy + (p.ry - camY + 8) * SCALE;
    const r = 92 * SCALE;
    const grad = lc.createRadialGradient(plx, ply, 0, plx, ply, r);
    grad.addColorStop(0,   'rgba(0,0,0,1)');
    grad.addColorStop(.5,  'rgba(0,0,0,.75)');
    grad.addColorStop(1,   'rgba(0,0,0,0)');
    lc.fillStyle = grad;
    lc.fillRect(plx - r, ply - r, r * 2, r * 2);
    const flick = 0.88 + Math.sin((G.frame || 0) * 0.12) * 0.08;
    state.torches.forEach(t => {
      if (!state.explored[t.y]?.[t.x]) return;
      const tx2 = ox + (t.x * 16 - camX + 8) * SCALE;
      const ty2 = oy + (t.y * 16 - camY + 8) * SCALE;
      const tr = 48 * SCALE * flick;
      if (tx2 < -tr || tx2 > cw + tr || ty2 < -tr || ty2 > ch + tr) return;
      const tg = lc.createRadialGradient(tx2, ty2, 0, tx2, ty2, tr);
      tg.addColorStop(0,   'rgba(0,0,0,.8)');
      tg.addColorStop(.4,  'rgba(0,0,0,.45)');
      tg.addColorStop(1,   'rgba(0,0,0,0)');
      lc.fillStyle = tg; lc.fillRect(tx2 - tr, ty2 - tr, tr * 2, tr * 2);
    });
    lc.restore();
    cx.drawImage(lightCv, 0, 0);
  };
})();

/* ══════════════════════════════════════════════════════════════════
   HOOK newFloor — Activation/désactivation du biome désert
═══════════════════════════════════════════════════════════════════ */
(function() {
  const _orig = G.newFloor.bind(G);
  G.newFloor = function(floor, existingPlayer = null) {
    _orig(floor, existingPlayer);
    const state = this.state;
    if (!state) return;

    if (_b2IsDesert(floor)) {
      state._biome2 = true;

      // Supprimer les flaques d'eau (le désert n'en a pas)
      state.puddles = [];

      const { list, set } = _b2GenQuicksands(
        state.map, state.MAP_W, state.MAP_H, Math.floor(Math.random() * 99999)
      );
      state.quicksandList = list;
      state.quicksandSet = set;

      if (floor % 5 !== 0) {
        state.monsters = _b2SpawnMonsters(state.rooms, floor, set);
      }

      const names = {
        6:'⚱ La Chambre des Offrandes', 7:'⚱ Les Couloirs du Pharaon',
        8:'⚱ La Salle des Pièges',      9:'⚱ Le Labyrinthe de Sable',
       10:'☠ La Chambre du Seigneur des Sables',
      };
      const msgs = {
        6:'La chaleur étouffante de la pyramide vous enveloppe…',
        7:'Le sable crisse sous vos pieds. Méfiez-vous.',
        8:'Des bandages effilochés traînent sur le sol de grès.',
        9:'Les sables mouvants guettent les imprudents.',
       10:'☠ Un grondement souterrain ébranle la pyramide.',
      };
      log(names[floor] || `⚱ La Pyramide — Niveau ${floor}`, '#d4b060');
      setTimeout(() => log(msgs[floor] || '', '#c8a840'), 600);

    } else {
      // Biome 1 (ou autre) — nettoyer les états désert
      state._biome2 = false;
      state.quicksandList = null;
      state.quicksandSet = null;
      if (state.player) {
        state.player._poisonTicks = 0;
        state.player._onQuicksand = false;
        state.player._qsSkip = false;
        state.player._qsLogCd = 0;
      }
    }
  };
})();

/* ══════════════════════════════════════════════════════════════════
   INIT — Construire les sprites désert après buildSprites()
═══════════════════════════════════════════════════════════════════ */
(function() {
  function _b2Init() {
    SPR._b2FloorTex   = _b2BuildFloorTex();
    SPR._b2WallTex    = _b2BuildWallTex();
    SPR._b2WallTopTex = _b2BuildWallTopTex();
    SPR._b2QsTex      = _b2BuildQsTex();
    DIM._b2Floor = _b2Dim(SPR._b2FloorTex);
    DIM._b2Wall  = _b2Dim(SPR._b2WallTex);
    _b2BuildMummy();
    _b2BuildScorpion();
    _b2BuildSandworm();
    console.log('[Biome2] Sprites désert construits.');
  }

  const _origDoInit = G._doInit.bind(G);
  G._doInit = function() { _origDoInit(); _b2Init(); };

  const _origDoInitFromSave = G._doInitFromSave.bind(G);
  G._doInitFromSave = function(saveData) { _origDoInitFromSave(saveData); _b2Init(); };
})();

/* ══════════════════════════════════════════════════════════════════
   MINIMAP — Couleurs désert adaptées au biome 2
═══════════════════════════════════════════════════════════════════ */
(function() {
  const _origDrawMinimap = window.drawMinimap;
  window.drawMinimap = function(state) {
    if (!state?._biome2) { _origDrawMinimap(state); return; }
    
    const { map, MAP_W, MAP_H, player, monsters, explored, visible, merchant } = state;
    const tw = 120 / MAP_W, th = 120 / MAP_H;
    const mmCtx = document.getElementById('minimap')?.getContext('2d');
    if (!mmCtx) { _origDrawMinimap(state); return; }

    // Fond sombre désert
    mmCtx.fillStyle = '#1a0f08';
    mmCtx.fillRect(0, 0, 120, 120);

    // Tuiles — couleurs désert
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        if (!explored[y][x]) continue;
        const t = map[y][x]; if (t === T.EMPTY) continue;
        const isVis = visible[y][x];
        let col;
        switch(t) {
          case T.WALL:    col = isVis ? '#6a5030' : '#3a2810'; break;
          case T.FLOOR:   col = isVis ? '#8a7040' : '#4a3820'; break;
          case T.STAIRS:  col = isVis ? '#f0c840' : '#806820'; break;
          case T.CHEST:     col = state.openedChests?.has(`${x},${y}`) ? '#5a4820' : (isVis ? '#e8c030' : '#604810'); break;
          case T.BOSS_CHEST:col = state.openedChests?.has(`${x},${y}`) ? '#5a3010' : (isVis ? '#ffaa00' : '#804800'); break;
          case T.TRAP:    col = isVis ? '#cc2020' : '#500808'; break;
          case T.WATER:   col = isVis ? '#2040a0' : '#101840'; break;
          default:        col = isVis ? '#6a5830' : '#3a2a18';
        }
        mmCtx.fillStyle = col;
        mmCtx.fillRect(x*tw|0, y*th|0, Math.ceil(tw)+1, Math.ceil(th)+1);
      }
    }

    // Monstres
    monsters.filter(m => m.alive && explored[m.y]?.[m.x]).forEach(m => {
      const isVis = visible[m.y]?.[m.x];
      if (m.type === 'boss') {
        mmCtx.fillStyle = isVis ? '#dd00ff' : '#660088';
        const bx = (m.x*tw|0)-1, by = (m.y*th|0)-1;
        mmCtx.fillRect(bx, by, Math.ceil(tw)+2, Math.ceil(th)+2);
        mmCtx.globalAlpha = 0.3;
        mmCtx.fillStyle = '#c000ff';
        mmCtx.fillRect(bx-1, by-1, Math.ceil(tw)+4, Math.ceil(th)+4);
        mmCtx.globalAlpha = 1;
      } else {
        mmCtx.fillStyle = isVis ? '#ff3030' : '#991010';
        mmCtx.fillRect(m.x*tw|0, m.y*th|0, Math.ceil(tw), Math.ceil(th));
      }
    });

    // Marchand
    if (merchant && explored[merchant.y]?.[merchant.x]) {
      const isVis = visible[merchant.y]?.[merchant.x];
      const mx2 = (merchant.x*tw|0)-1, my2 = (merchant.y*th|0)-1;
      mmCtx.fillStyle = isVis ? '#f0c040' : '#806820';
      mmCtx.fillRect(mx2, my2, Math.ceil(tw)+2, Math.ceil(th)+2);
    }

    // Joueur
    const px2 = (player.x*tw|0), py2 = (player.y*th|0);
    mmCtx.globalAlpha = 0.35;
    mmCtx.fillStyle = '#f0d080';
    mmCtx.fillRect(px2-2, py2-2, Math.ceil(tw)+4, Math.ceil(th)+4);
    mmCtx.globalAlpha = 1;
    mmCtx.fillStyle = '#ffffff';
    mmCtx.fillRect(px2, py2, Math.ceil(tw), Math.ceil(th));
  };
})();

console.log('[Biome2] Module chargé — Désert niveaux 6-10.');
