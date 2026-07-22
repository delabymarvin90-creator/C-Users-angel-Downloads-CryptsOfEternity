// ══════════════════════════════════════════════════════════════
//  CRYPTS OF ETERNITY — Top-down 16-bit pixel roguelike
// ══════════════════════════════════════════════════════════════

// ===== ADMIN MENU =====
const AdminMenu = {
  currentTab: 'stats',
  showTab(tab) {
    // Masquer tous les tabs
    document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.admin-tab').forEach(el => {
      el.style.background = 'transparent';
      el.style.color = 'var(--gold)';
      el.style.border = '1px solid var(--gold)';
    });
    // Afficher le tab sélectionné
    document.getElementById(`admin-tab-${tab}`).style.display = 'block';
    event.target.style.background = 'var(--gold)';
    event.target.style.color = '#08060a';
    event.target.style.border = 'none';
    this.currentTab = tab;
  },
  open() {
    const screen = document.getElementById('admin-screen');
    screen.style.display = 'block';
    screen.style.pointerEvents = 'all';
    setTimeout(() => screen.style.opacity = '1', 10);
    if (G && G.togglePause) G.togglePause();
  },
  close() {
    const screen = document.getElementById('admin-screen');
    screen.style.opacity = '0';
    setTimeout(() => {
      screen.style.display = 'none';
      screen.style.pointerEvents = 'none';
    }, 300);
    if (G && G.togglePause) G.togglePause();
  },
  setStat(stat) {
    if (!G || !G.state || !G.state.player) return;
    const val = parseInt(document.getElementById(`admin-${stat}`).value);
    if (stat === 'hp') {
      G.state.player.hp = Math.min(val, G.state.player.maxHp);
    } else if (stat === 'mp') {
      G.state.player.mp = Math.min(val, G.state.player.maxMp);
    } else if (stat === 'atk') {
      G.state.player.atk = val;
    } else if (stat === 'def') {
      G.state.player.def = val;
    } else if (stat === 'crit') {
      G.state.player.critChance = val / 100;
    } else if (stat === 'dodge') {
      G.state.player.dodgeChance = val / 100;
    }
  },
  addGold() {
    if (!G || !G.state || !G.state.player) return;
    const val = parseInt(document.getElementById('admin-gold').value);
    G.state.player.gold += val;
  },
  addXp() {
    if (!G || !G.state || !G.state.player) return;
    const val = parseInt(document.getElementById('admin-xp').value);
    G.state.player.xp += val;
    while (G.state.player.xp >= G.state.player.xpNext) {
      G.state.player.gainXp(0);
    }
  },
  setLevel() {
    if (!G || !G.state || !G.state.player) return;
    const lvl = parseInt(document.getElementById('admin-level').value);
    G.state.player.level = lvl;
  },
  goToFloor() {
    if (!G || !G.state) return;
    const floor = parseInt(document.getElementById('admin-floor').value);
    G.newFloor(floor, G.state.player);
    this.close();
  },
  nextFloor() {
    if (!G || !G.state) return;
    const currentFloor = G.state.floor;
    G.newFloor(currentFloor + 1, G.state.player);
    this.close();
  },
  heal() {
    if (!G || !G.state || !G.state.player) return;
    G.state.player.hp = G.state.player.maxHp;
    G.state.player.mp = G.state.player.maxMp;
  },
  maxStamina() {
    if (!G || !G.state || !G.state.player) return;
    G.state.player.stamina = G.state.player.maxStamina;
  },
  killAllMonsters() {
    if (!G || !G.state) return;
    G.state.monsters.forEach(m => m.alive = false);
  },
  spawnMonster(type) {
    if (!G || !G.state || !G.state.player) return;
    const count = parseInt(document.getElementById('admin-spawn-count').value) || 1;
    for (let i = 0; i < count; i++) {
      const x = G.state.player.x + Math.floor(Math.random() * 10 - 5);
      const y = G.state.player.y + Math.floor(Math.random() * 10 - 5);
      if (x >= 0 && x < G.state.MAP_W && y >= 0 && y < G.state.MAP_H) {
        G.state.monsters.push(new Monster(x, y, type));
      }
    }
  },
  addUpgrade(type) {
    if (!G || !G.state || !G.state.player) return;
    if (type === 'weapon') {
      G.state.player.weaponLevel++;
      G.state.player.atk += 2;
    } else if (type === 'armor') {
      G.state.player.def += 1;
    }
  },
  revealMap() {
    if (!G || !G.state) return;
    for (let y = 0; y < G.state.MAP_H; y++) {
      for (let x = 0; x < G.state.MAP_W; x++) {
        G.state.explored[y][x] = 1;
      }
    }
  },
  clearExplored() {
    if (!G || !G.state) return;
    for (let y = 0; y < G.state.MAP_H; y++) {
      for (let x = 0; x < G.state.MAP_W; x++) {
        G.state.explored[y][x] = 0;
      }
    }
  },
  saveState() {
    if (!G || !G.state || !G.state.player) return;
    const save = {
      floor: G.state.floor,
      player: {
        x: G.state.player.x,
        y: G.state.player.y,
        hp: G.state.player.hp,
        maxHp: G.state.player.maxHp,
        level: G.state.player.level,
        gold: G.state.player.gold
      }
    };
    localStorage.setItem('crypts_admin_save', JSON.stringify(save));
  },
  toggleGodMode() {
    if (!G || !G.state || !G.state.player) return;
    G.state.player._godMode = !G.state.player._godMode;
  },
  toggleInvincible() {
    if (!G || !G.state || !G.state.player) return;
    G.state.player._invincible = !G.state.player._invincible;
  },
  prevFloor() {
    if (!G || !G.state || G.state.floor <= 1) return;
    const currentFloor = G.state.floor;
    G.newFloor(currentFloor - 1, G.state.player);
    this.close();
  },
  addBuff() {
    if (!G || !G.state || !G.state.player) return;
    const buffs = ['dash_inv', 'lifesteal', 'thorns', 'lucky', 'dodge'];
    const buff = buffs[Math.floor(Math.random() * buffs.length)];
    G.state.player.buffs.push({icon: '✨', name: buff});
  },
  setWeapon() {
    if (!G || !G.state || !G.state.player) return;
    const weapon = document.getElementById('admin-weapon').value;
    G.state.player.equippedWeapon = weapon;
  },
  setWeaponLevel() {
    if (!G || !G.state || !G.state.player) return;
    const level = parseInt(document.getElementById('admin-weapon-level').value);
    G.state.player.weaponLevel = level;
    G.state.player.atk += level * 2;
  },
  reveal() {
    this.revealMap();
  },
  resetPlayer() {
    if (!G || !G.state || !G.state.player) return;
    G.restart();
  },
  goToFloor() {
    if (!G || !G.state) return;
    const floor = parseInt(document.getElementById('admin-floor-num')?.value || document.getElementById('admin-floor')?.value || 1);
    if (floor > 0) {
      G.newFloor(floor, G.state.player);
      this.close();
    }
  },
  fullReset() {
    // Confirmation
    if (!confirm('⚠️ RÉINITIALISER COMPLÈTEMENT LA PARTIE?\n\n- Tous les succès seront effacés\n- Toutes les données de jeu seront supprimées\n- Le bouton "Continuer" disparaîtra\n- Impossible à annuler!\n\nVous êtes sûr?')) return;
    
    // Supprimer TOUTES les données du jeu avec les vraies clés
    localStorage.removeItem('coe_save');
    localStorage.removeItem('coe_achievements');
    localStorage.removeItem('coe_perm');
    localStorage.removeItem('crypts_admin_save');
    localStorage.removeItem('coe_achievements_v2');
    
    // Supprimer TOUT le localStorage qui contient save/achievement/coe/crypts
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('coe') || key.includes('crypts') || key.includes('save') || key.includes('achievement') || key.includes('perm'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Forcer la réinitialisation des succès
    if (Achievements) {
      Achievements._stats = Achievements._defaultStats();
      Achievements.save();
    }
    
    // Vider la sauvegarde du jeu
    if (G) {
      G._lastSaveData = null;
      G.hasSave = false;
    }
    
    // Recharger la page pour que tout soit clean
    setTimeout(() => {
      window.location.reload();
    }, 500);
    
    console.log('[ADMIN] RÉINITIALISATION COMPLÈTE - Tout effacé, rechargement...');
  }
};

// Listener pour Ctrl+Shift+D
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
    e.preventDefault();
    const screen = document.getElementById('admin-screen');
    if (screen.style.display === 'none') {
      AdminMenu.open();
    } else {
      AdminMenu.close();
    }
  }
});

// God mode check
setInterval(() => {
  if (document.getElementById('admin-godmode')?.checked && G && G.state && G.state.player) {
    G.state.player.hp = G.state.player.maxHp;
    G.state.player._godMode = true;
  } else if (G && G.state && G.state.player) {
    G.state.player._godMode = false;
  }
  
  if (document.getElementById('admin-invisible')?.checked && G && G.state && G.state.player) {
    G.state.player._invisible = true;
    G.state.monsters.forEach(m => m.aggro = false);
  } else if (G && G.state && G.state.player) {
    G.state.player._invisible = false;
  }
}, 100);

const cv = document.getElementById('c');
const cx = cv.getContext('2d');
const mmCv = document.getElementById('minimap');
const mmCtx = mmCv.getContext('2d');

// Virtual resolution (scaled up)
const VW = 320, VH = 240;

// ══ LIGHTING ═══════════════════════════════
const lightCv = document.createElement('canvas');
const lightCx = lightCv.getContext('2d');
// Full window size — resized in resize()
lightCv.width = window.innerWidth; 
lightCv.height = window.innerHeight;

let SCALE = 1;

function resize() {
  const sw = window.innerWidth  / VW;
  const sh = window.innerHeight / VH;
  SCALE = Math.min(sw, sh);
  cv.width  = window.innerWidth;
  cv.height = window.innerHeight;
  lightCv.width  = window.innerWidth;
  lightCv.height = window.innerHeight;
  cx.imageSmoothingEnabled = false;
}
resize();
window.addEventListener('resize', resize);

// ── TILE SIZE ──────────────────────────────
const TS = 16; // 16×16 pixel tiles

// ── TILE TYPES ─────────────────────────────
const T = { EMPTY:0, FLOOR:1, WALL:2, STAIRS:3, CHEST:4, TRAP:5, WATER:6, WALL_TOP:7, BREAKABLE:8, BOSS_CHEST:9 };

// ── PALETTE (16-bit SNES-style) ────────────
const P = {
  // ── Floor — blue-slate stone slabs
  FL1:'#3d4a62', FL2:'#334058', FL3:'#283450', FL4:'#455270', FL5:'#506080',
  FL_CRACK:'#1c2438', FL_GROUT:'#1a2030', FL_HIGH:'#607090',
  FL_MID:'#3a4860', FL_SHADOW:'#22304a',
  // ── Wall — navy brick
  WL1:'#181a2e', WL2:'#121628', WL3:'#0e1020', WL4:'#1e2238', WL5:'#080a14',
  WL_EDGE:'#060810', WL_LIT:'#252840',
  WL_GLOW:'#5c3a18', WL_GLOW2:'#7a4c20', WL_MOOS:'#1e2e1e',
  // ── Wall top / ceiling
  WT:'#0e1020', WT2:'#0a0c18', WT3:'#121828',
  // ── Water
  WA1:'#162a5c', WA2:'#1a3070', WA3:'#203898',
  WA_FOAM:'#4a70c0', WA_DEEP:'#0c1840', WA_LIGHT:'#2a4a80',
  // ── Stairs
  ST1:'#4a3c20', ST2:'#5a4a28', ST3:'#382c14', ST4:'#b89040', ST5:'#907030',
  // ── Chest
  CH1:'#5a2c10', CH2:'#7a3c18', CH3:'#c09020', CH4:'#3c1c08', CH5:'#e0b028',
  // ── Trap
  TR1:'#3c1818', TR2:'#281010', TR3:'#800808', TR4:'#180808',
  // ── Torch
  TO1:'#3c2810', TO2:'#5c3c18', TO3:'#7c5020',
  TO_FIRE1:'#ff8010', TO_FIRE2:'#ff5000', TO_FIRE3:'#c02000', TO_FIRE4:'#ffcc40',
  TO_GLOW:'#ff6010',
  // ── Player
  PL_SKIN:'#e8b888', PL_HAIR:'#1c140c', PL_ARMOR1:'#3a4878',
  PL_ARMOR2:'#5060a0', PL_ARMOR3:'#28304e',
  PL_SWORD:'#c0d0e0', PL_SWORD2:'#808898', PL_CAPE:'#6c1818',
  PL_EYES:'#e8e020', PL_BOOTS:'#241c0c',
  // ── Monsters
  SK1:'#c8c0a0', SK2:'#9c9480', SK3:'#706858', SK4:'#e0d8b8', SK_EYE:'#e03030',
  GO1:'#4a6c28', GO2:'#385018', GO3:'#283c10', GO4:'#6c9030', GO_EYE:'#e8d800',
  DE1:'#7c2828', DE2:'#582020', DE3:'#a03838', DE4:'#c03838', DE_EYE:'#ff7000',
  GH1:'#b8c8e0', GH2:'#98a8c0', GH3:'#e0e8f8', GH4:'#788898', GH_EYE:'#3870ff',
  SP1:'#482468', SP2:'#301850', SP3:'#604088', SP4:'#200c38', SP_EYE:'#ff3800',
  OG1:'#704828', OG2:'#503018', OG3:'#906050', OG4:'#402818', OG_EYE:'#ff5800',
};

// ── PIXEL PAINTER ──────────────────────────
function mkCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  x.imageSmoothingEnabled = false;
  return { c, x };
}

// Draw single pixel
function px(ctx, x, y, col) {
  if (!col || col === 'transparent' || col === null) return;
  ctx.fillStyle = col;
  ctx.fillRect(x, y, 1, 1);
}

// Draw pixel row
function row(ctx, x, y, cols) {
  cols.forEach((c, i) => px(ctx, x + i, y, c));
}

// Fill rect with color
function fill(ctx, x, y, w, h, col) {
  if (!col) return;
  ctx.fillStyle = col;
  ctx.fillRect(x, y, w, h);
}

// ── SMOOTH UPSCALE helper ──────────────────
// Takes a small pixel-art canvas, returns a 2× version
// with bilinear smoothing applied — kills hard tile borders
// while keeping the pixel art character in the interior
function smoothUpscale(src, dstW, dstH) {
  const { c, x } = mkCanvas(dstW, dstH);
  x.imageSmoothingEnabled = false;
  x.drawImage(src, 0, 0, dstW, dstH);
  return c;
}

// ── SOFT BLEND helper ─────────────────────
// Paint a pixel with fractional opacity to soften tile edges
function spx(ctx, x, y, col, alpha) {
  if (!col || alpha <= 0) return;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = col;
  ctx.fillRect(x, y, 1, 1);
  ctx.globalAlpha = 1;
}

// Hex color lerp — blends two colors (used for smooth gradients in sprites)
function lerpCol(a, b, t) {
  const p = s => parseInt(s, 16);
  const r1 = p(a.slice(1,3)), g1 = p(a.slice(3,5)), b1 = p(a.slice(5,7));
  const r2 = p(b.slice(1,3)), g2 = p(b.slice(3,5)), b2 = p(b.slice(5,7));
  const ri = (r1 + (r2-r1)*t)|0, gi = (g1 + (g2-g1)*t)|0, bi = (b1 + (b2-b1)*t)|0;
  return `#${ri.toString(16).padStart(2,'0')}${gi.toString(16).padStart(2,'0')}${bi.toString(16).padStart(2,'0')}`;
}

// ── PIXEL ART SPRITES ──────────────────────
const SPR = {};

// Seeded pseudo-random for consistent tile noise
function seededRng(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

// Paint a stone surface using gradient + subtle noise — no hard borders
function paintStoneSurface(x, w, h, baseCol, lightCol, darkCol, crackCol, noiseSeed) {
  const rng = seededRng(noiseSeed);

  // 1. Radial gradient base — lighter center, darker edges (no hard tile border)
  const cx2 = w/2, cy2 = h/2;
  const grad = x.createRadialGradient(cx2, cy2*0.7, 1, cx2, cy2, w*0.75);
  grad.addColorStop(0,   lightCol);
  grad.addColorStop(0.5, baseCol);
  grad.addColorStop(1,   darkCol);
  x.fillStyle = grad;
  x.fillRect(0, 0, w, h);

  // 2. Organic noise stippling — MORE dots for rich stone texture
  for (let i = 0; i < w * h * 0.35; i++) {
    const nx = (rng() * w) | 0, ny = (rng() * h) | 0;
    const t = rng();
    let col;
    if (t < 0.3) col = darkCol;
    else if (t < 0.6) col = lightCol;
    else col = baseCol;
    x.globalAlpha = 0.06 + rng() * 0.14;
    const size = Math.random() < 0.85 ? 1 : (Math.random() < 0.5 ? 2 : 3);
    x.fillStyle = col;
    x.fillRect(nx, ny, size, size);
  }
  x.globalAlpha = 1;

  // 3. Large color patches — for more organic, less regular look
  const numPatches = 3 + (rng() * 4 | 0);
  for (let p = 0; p < numPatches; p++) {
    const px = rng() * w, py = rng() * h;
    const psize = 4 + rng() * 6;
    const patchCol = rng() < 0.5 ? lightCol : darkCol;
    const grad2 = x.createRadialGradient(px, py, 0, px, py, psize);
    grad2.addColorStop(0, patchCol);
    grad2.addColorStop(1, 'rgba(0,0,0,0)');
    x.globalAlpha = 0.08 + rng() * 0.12;
    x.fillStyle = grad2;
    x.fillRect(px - psize, py - psize, psize * 2, psize * 2);
  }
  x.globalAlpha = 1;

  // 4. Cracks — soft diagonal lines, more varied
  const numCracks = 2 + (rng() * 4 | 0);
  for (let c2 = 0; c2 < numCracks; c2++) {
    const sx2 = rng() * w, sy2 = rng() * h;
    const len = 4 + rng() * 10;
    const angle = rng() * Math.PI * 2;
    // Crack path with slight waviness
    x.beginPath();
    x.moveTo(sx2, sy2);
    let cx3 = sx2, cy3 = sy2;
    for (let step = 0; step < len; step += 1) {
      cx3 += Math.cos(angle + rng() * 0.3 - 0.15);
      cy3 += Math.sin(angle + rng() * 0.3 - 0.15);
      x.lineTo(cx3, cy3);
    }
    x.strokeStyle = crackCol;
    x.globalAlpha = 0.35 + rng() * 0.25;
    x.lineWidth = 0.5 + rng() * 0.5;
    x.stroke();
  }
  x.globalAlpha = 1;
  x.lineWidth = 1;
}

// Paint a brick wall surface with soft gradients between bricks
function paintBrickSurface(x, w, h, brickCol, mortarCol, litCol, glowCol, noiseSeed) {
  const rng = seededRng(noiseSeed);

  // Base fill
  x.fillStyle = mortarCol;
  x.fillRect(0, 0, w, h);

  // Two rows of bricks with soft shading (no hard pixel lines between)
  const rows = [
    { y: 0, bricks: [{x: 0, w: w*0.47}, {x: w*0.53, w: w*0.47}] },
    { y: h*0.52, bricks: [{x: 0, w: w*0.28}, {x: w*0.33, w: w*0.35}, {x: w*0.72, w: w*0.28}] },
  ];

  rows.forEach(row2 => {
    row2.bricks.forEach(br => {
      const bx = br.x, by = row2.y, bw = br.w, bh = h * 0.46;
      // Brick gradient — lit top-left, dark bottom-right
      const bg = x.createLinearGradient(bx, by, bx + bw, by + bh);
      bg.addColorStop(0,   litCol);
      bg.addColorStop(0.3, brickCol);
      bg.addColorStop(1,   mortarCol);
      x.fillStyle = bg;
      // Soft rect: rounded corners via clip would be expensive, use alpha falloff
      x.globalAlpha = 1;
      x.fillRect(bx + 1, by + 1, bw - 1, bh - 1);

      // Top-left highlight pixel strip
      x.fillStyle = litCol;
      x.globalAlpha = 0.5;
      x.fillRect(bx + 1, by + 1, bw - 2, 1);
      x.fillRect(bx + 1, by + 1, 1, bh - 2);

      // Bottom-right shadow
      x.fillStyle = mortarCol;
      x.globalAlpha = 0.6;
      x.fillRect(bx + 1, by + bh - 2, bw - 1, 1);

      // Noise on brick face
      for (let i = 0; i < bw * bh * 0.06; i++) {
        x.globalAlpha = 0.04 + rng() * 0.08;
        x.fillStyle = rng() > 0.5 ? litCol : mortarCol;
        x.fillRect((bx + 1 + rng() * (bw-2)) | 0, (by + 1 + rng() * (bh-2)) | 0, 1, 1);
      }
    });
  });
  x.globalAlpha = 1;

  // Warm glow on right edge (torch reflection)
  const glow = x.createLinearGradient(w * 0.6, 0, w, 0);
  glow.addColorStop(0, 'rgba(0,0,0,0)');
  glow.addColorStop(1, 'rgba(92,58,24,0.25)');
  x.fillStyle = glow;
  x.fillRect(0, 0, w, h);
}

function buildSprites() {

  // ── TEXTURE SEAMLESS SOL — 128×128, dalles 16×16 pixel-perfect ──
  // Chaque tuile monde (TS=16) consomme exactement 16px → 1 dalle = 1 tuile, jamais zoomé
  {
    const S = 128; // multiple de 16 → seamless parfait
    const TS = 16; // taille d'une dalle = taille d'une tuile monde
    const { c, x } = mkCanvas(S, S);
    const rng = seededRng(0xBEEF1234);

    // Palette dalle — variations subtiles autour du bleu-ardoise
    const slabPal = ['#2e3c54','#334058','#2a3850','#364460','#3a4868','#2c3a56'];

    for (let row = 0; row < S / TS; row++) {
      for (let col = 0; col < S / TS; col++) {
        const sx = col * TS, sy = row * TS;

        // Couleur de base — variation pseudo-aléatoire par position
        const t = rng();
        const base = slabPal[((col * 7 + row * 3 + (t * 5 | 0)) % slabPal.length)];

        // Remplissage de base
        x.fillStyle = base;
        x.fillRect(sx, sy, TS, TS);

        // Gradient léger diagonal (donne du relief sans déformer)
        const dg = x.createLinearGradient(sx, sy, sx + TS, sy + TS);
        dg.addColorStop(0,   'rgba(255,255,255,0.06)');
        dg.addColorStop(0.5, 'rgba(0,0,0,0)');
        dg.addColorStop(1,   'rgba(0,0,0,0.10)');
        x.fillStyle = dg;
        x.fillRect(sx, sy, TS, TS);

        // Grain de surface (bruit pixel)
        for (let i = 0; i < 12; i++) {
          const nx = sx + 1 + (rng() * (TS - 2)) | 0;
          const ny = sy + 1 + (rng() * (TS - 2)) | 0;
          x.globalAlpha = 0.03 + rng() * 0.07;
          x.fillStyle = rng() > 0.5 ? '#6080a8' : '#1a2030';
          x.fillRect(nx, ny, 1, 1);
        }
        x.globalAlpha = 1;

        // Joint — 1px en bas + 1px à droite, couleur mortier sombre
        x.fillStyle = '#141c28';
        x.globalAlpha = 0.75;
        x.fillRect(sx, sy + TS - 1, TS, 1);     // joint bas
        x.fillRect(sx + TS - 1, sy, 1, TS);     // joint droite
        x.globalAlpha = 1;

        // Highlight 1px en haut + à gauche (lumière de torche)
        x.fillStyle = '#506890';
        x.globalAlpha = 0.18;
        x.fillRect(sx, sy, TS - 1, 1);          // highlight haut
        x.fillRect(sx, sy, 1, TS - 1);          // highlight gauche
        x.globalAlpha = 1;
      }
    }

    // Taches de mousse légères aux intersections de dalles
    for (let i = 0; i < 8; i++) {
      const mx2 = (rng() * S) | 0, my2 = (rng() * S) | 0;
      const gr = x.createRadialGradient(mx2, my2, 0, mx2, my2, 5 + rng() * 4);
      gr.addColorStop(0,   'rgba(20,42,22,0.22)');
      gr.addColorStop(1,   'rgba(0,0,0,0)');
      x.fillStyle = gr;
      x.fillRect(mx2 - 10, my2 - 10, 20, 20);
    }

    // ── Petites pierres éparpillées (contrastées, bien visibles) ──
    for (let i = 0; i < 22; i++) {
      const px2 = 2 + (rng() * (S - 4)) | 0;
      const py2 = 2 + (rng() * (S - 4)) | 0;
      const sz  = 1 + (rng() * 2 | 0); // 1 ou 2px
      // Ombre portée
      x.fillStyle = '#060c14';
      x.globalAlpha = 1;
      x.fillRect(px2 + 1, py2 + 1, sz, sz);
      // Corps pierre — gris-bleu bien visible sur le sol
      x.fillStyle = rng() < 0.5 ? '#4a5c72' : '#3a4c62';
      x.globalAlpha = 1;
      x.fillRect(px2, py2, sz, sz);
      // Reflet haut-gauche
      x.fillStyle = '#7898b8';
      x.globalAlpha = 0.9;
      x.fillRect(px2, py2, 1, 1);
      x.globalAlpha = 1;
    }

    // ── Débris / éclats isolés ──
    for (let i = 0; i < 20; i++) {
      const px2 = (rng() * S) | 0;
      const py2 = (rng() * S) | 0;
      x.fillStyle = rng() < 0.5 ? '#5a6878' : '#283848';
      x.globalAlpha = 0.8;
      x.fillRect(px2, py2, 1, 1);
      x.globalAlpha = 1;
    }


    SPR.floorTex = c;
    SPR.floor  = c;
    SPR.floorB = c;
    SPR.floorC = c;
    SPR.floorPattern = cx.createPattern(c, 'repeat');
  }

  // ── TEXTURE SEAMLESS MUR — 128×128, briques 16×8 pixel-perfect ──
  // Briques de 15×7px + 1px mortier = 16×8 par cellule → aligne sur TS=16
  {
    const S = 128;
    const BW = 16, BH = 8;   // cellule = taille tuile × ½ → 2 rangées par tuile
    const { c, x } = mkCanvas(S, S);
    const rng = seededRng(0xDEAD5678);

    // Mortier de fond
    x.fillStyle = '#08090e';
    x.fillRect(0, 0, S, S);

    const brickPal = ['#121628','#181a2e','#0e1224','#1a1e34','#101428','#161c30'];

    const rows = S / BH;
    const cols = S / BW + 1;
    for (let row = 0; row < rows; row++) {
      const oy = row * BH;
      const offset = (row % 2) === 0 ? 0 : BW / 2; // décalage alternant
      for (let col = 0; col < cols; col++) {
        const ox = col * BW - offset;
        const bx = ox, by = oy;
        const bw = BW - 1, bh = BH - 1; // -1 pour le mortier

        // Couleur brique
        const t = rng();
        const bCol = brickPal[(col * 5 + row * 3 + (t * 4 | 0)) % brickPal.length];

        // Corps de la brique
        x.fillStyle = bCol;
        x.fillRect(bx, by, bw, bh);

        // Gradient léger : plus clair en haut, plus sombre en bas
        const bg = x.createLinearGradient(bx, by, bx, by + bh);
        bg.addColorStop(0,   'rgba(255,255,255,0.08)');
        bg.addColorStop(0.5, 'rgba(0,0,0,0)');
        bg.addColorStop(1,   'rgba(0,0,0,0.18)');
        x.fillStyle = bg;
        x.fillRect(bx, by, bw, bh);

        // Grain de surface (brique ancienne, texturée)
        for (let i = 0; i < 5; i++) {
          const nx = bx + (rng() * (bw - 1)) | 0;
          const ny = by + (rng() * (bh - 1)) | 0;
          x.globalAlpha = 0.04 + rng() * 0.08;
          x.fillStyle = rng() > 0.5 ? '#4a5080' : '#0a0e1c';
          x.fillRect(nx, ny, 1, 1);
        }
        x.globalAlpha = 1;

        // Highlight 1px en haut (lumière rasante)
        x.fillStyle = '#222640';
        x.globalAlpha = 0.55;
        x.fillRect(bx, by, bw, 1);
        x.globalAlpha = 1;

        // Égratignure rare (1 brique sur 8)
        if (rng() < 0.12) {
          x.fillStyle = '#0c101a';
          x.globalAlpha = 0.4;
          const sx2 = bx + 1 + (rng() * (bw - 2)) | 0;
          const sy2 = by + 1 + (rng() * (bh - 2)) | 0;
          x.fillRect(sx2, sy2, 1 + (rng() * 3 | 0), 1);
          x.globalAlpha = 1;
        }
      }
    }

    // Taches d'humidité / suintement
    for (let i = 0; i < 6; i++) {
      const mx2 = (rng() * S) | 0, my2 = (rng() * S) | 0;
      const gr = x.createRadialGradient(mx2, my2, 0, mx2, my2, 8 + rng() * 8);
      gr.addColorStop(0,   'rgba(14,24,14,0.28)');
      gr.addColorStop(1,   'rgba(0,0,0,0)');
      x.fillStyle = gr;
      x.fillRect(mx2 - 18, my2 - 18, 36, 36);
    }

    SPR.wallTex = c;
    SPR.wall = c;
    SPR.wallPattern = cx.createPattern(c, 'repeat');
  }

  // ── WALL TOP — dark, near-black with faint pillar texture ──────
  {
    const S = 16;
    const { c, x } = mkCanvas(S, S);
    const g = x.createRadialGradient(8,8,0,8,8,10);
    g.addColorStop(0, P.WT3); g.addColorStop(1, P.WT2);
    x.fillStyle = g; x.fillRect(0,0,S,S);
    // Very faint brick ghost
    x.globalAlpha = 0.07;
    x.fillStyle = P.WL1;
    x.fillRect(0,0,7,7); x.fillRect(9,8,7,8);
    x.globalAlpha = 1;
    SPR.wallTop = c;
  }

  // ── STAIRS ────────────────────────────────────────────────────
  {
    // 32×32 → downscale 16×16
    // Couleur de base = P.FL2 (même que le sol du niveau)
    // Trou occupe toute la tuile, marches taillées dans la teinte sol
    const { c: c32, x: d } = mkCanvas(32, 32);

    // ── Sol autour — bord 1px ────────────────────────────────────
    d.fillStyle = P.FL2; d.fillRect(0, 0, 32, 32);

    // ── Abîme noir pleine tuile ──────────────────────────────────
    d.fillStyle = '#06040e'; d.fillRect(1, 1, 30, 30);

    // Lueur chaude profonde (torche du niveau d'en-bas)
    const pit = d.createRadialGradient(16, 36, 0, 16, 30, 20);
    pit.addColorStop(0,   'rgba(200,115,20,0.65)');
    pit.addColorStop(0.35,'rgba(120, 60,10,0.35)');
    pit.addColorStop(0.7, 'rgba( 55, 25, 5,0.15)');
    pit.addColorStop(1,   'rgba(  0,  0, 0,0)');
    d.fillStyle = pit; d.fillRect(1, 1, 30, 30);

    // ── Fonction helper : mélange une couleur hex avec du noir (sombre) ──
    // On dérive toutes les teintes de marches directement de P.FL2
    // Marche = teinte sol désaturée et assombrie + légère variation
    // Couleurs fixées en se basant sur la palette sol (#4a4058 / #3a3048)
    const steps = [
      // y,  x0, w,  top principal,   arête lumineuse,  contremarche, ombre basse
      { y:23, x0: 1, w:30, top:'#3e3850', hi:'#5a5468', fr:'#1e1a28', fd:'#110e18' },
      { y:18, x0: 4, w:24, top:'#363048', hi:'#504a60', fr:'#191620', fd:'#0e0c16' },
      { y:13, x0: 7, w:18, top:'#2e2840', hi:'#443e56', fr:'#141220', fd:'#0c0a14' },
      { y: 9, x0:10, w:12, top:'#282238', hi:'#3a3448', fr:'#100e18', fd:'#08060e' },
      { y: 6, x0:13, w: 6, top:'#221c30', hi:'#302c40', fr:'#0c0a14', fd:'#060408' },
    ];

    steps.forEach(({ y, x0, w, top, hi, fr, fd }) => {
      const topH = 4, frH = 2;

      // Contremarche (face avant)
      d.fillStyle = fr;  d.fillRect(x0, y + topH,         w, frH);
      d.fillStyle = fd;  d.fillRect(x0, y + topH + frH - 1, w, 1);

      // Dessus de la marche
      d.fillStyle = top; d.fillRect(x0, y, w, topH);
      // Gradient intérieur — 2 lignes plus claires au centre
      d.fillStyle = hi;  d.fillRect(x0 + 1, y, w - 2, 1);  // arête lumineuse

      // Rainure discrète
      d.fillStyle = 'rgba(0,0,0,0.18)'; d.fillRect(x0 + 1, y + 2, w - 2, 1);

      // Paroi latérale du puits
      d.fillStyle = 'rgba(0,0,0,0.55)';
      d.fillRect(x0,         y, 2, topH + frH);
      d.fillRect(x0 + w - 2, y, 2, topH + frH);
    });

    // Arêtes lumineuses de chaque marche (reflet lumière)
    d.fillStyle = 'rgba(210,175,130,0.55)'; d.fillRect( 1, 23, 30, 1);
    d.fillStyle = 'rgba(175,145,105,0.38)'; d.fillRect( 4, 18, 24, 1);
    d.fillStyle = 'rgba(140,115, 85,0.26)'; d.fillRect( 7, 13, 18, 1);
    d.fillStyle = 'rgba(110, 90, 65,0.18)'; d.fillRect(10,  9, 12, 1);
    d.fillStyle = 'rgba( 80, 65, 48,0.12)'; d.fillRect(13,  6,  6, 1);

    // Bords du puits — continuité avec le sol
    d.fillStyle = 'rgba(0,0,0,0.70)'; d.fillRect(1, 1, 30, 2);  // haut
    d.fillStyle = 'rgba(0,0,0,0.50)'; d.fillRect(1, 1, 2, 30);  // gauche
    d.fillStyle = 'rgba(0,0,0,0.50)'; d.fillRect(29,1, 2, 30);  // droite

    // Lisière sol → trou (haut)
    d.fillStyle = P.FL2; d.fillRect(0, 0, 32, 1);
    d.fillStyle = P.FL3; d.fillRect(0, 1, 32, 1);

    // Sol devant (bas) — plancher joueur avec lueur remontante
    d.fillStyle = P.FL2; d.fillRect(0, 29, 32, 3);
    d.fillStyle = 'rgba(0,0,0,0.45)'; d.fillRect(1, 29, 30, 1);
    const frontGlow = d.createLinearGradient(16, 24, 16, 32);
    frontGlow.addColorStop(0, 'rgba(190,120,25,0.18)');
    frontGlow.addColorStop(1, 'rgba(190,120,25,0)');
    d.fillStyle = frontGlow; d.fillRect(0, 24, 32, 8);

    SPR.stairs = smoothUpscale(c32, 16, 16);
  }

  // ── CHEST ────────────────────────────────────────────────────
  {
    const { c, x } = mkCanvas(16, 16);

    // Sol sous le coffre
    x.fillStyle = P.FL2; x.fillRect(0, 0, 16, 16);

    // Ombre portée
    x.fillStyle = 'rgba(0,0,0,0.40)';
    x.fillRect(3, 13, 10, 2);

    // ── Corps du coffre (bas) ──
    // Bois foncé — corps principal
    x.fillStyle = P.CH1; x.fillRect(2, 8, 12, 6);
    // Variation de bois (grain clair)
    x.fillStyle = P.CH2; x.fillRect(3, 8, 10, 5);
    // Lattes verticales (séparations de planches)
    x.fillStyle = P.CH4;
    x.fillRect(5,  8, 1, 6);
    x.fillRect(9,  8, 1, 6);
    // Cerclage métal bas (bande horizontale)
    x.fillStyle = '#7a6020'; x.fillRect(2, 11, 12, 2);
    x.fillStyle = P.CH3;    x.fillRect(2, 11, 12, 1); // reflet métal haut
    x.fillStyle = P.CH4;    x.fillRect(2, 12, 12, 1); // ombre métal bas

    // ── Couvercle bombé ──
    // Base couvercle
    x.fillStyle = P.CH2; x.fillRect(2, 4, 12, 5);
    x.fillStyle = P.CH1; x.fillRect(2, 4, 12, 4);
    // Bombé — rangée de pixels du dessus plus claire
    x.fillStyle = P.CH2; x.fillRect(3, 4, 10, 1);
    x.fillStyle = '#9a5828'; x.fillRect(4, 3, 8, 2); // arrondi sommet
    x.fillStyle = '#b06830'; x.fillRect(5, 3, 6, 1); // reflet sommet bombé
    // Lattes couvercle
    x.fillStyle = P.CH4;
    x.fillRect(5, 4, 1, 4);
    x.fillRect(9, 4, 1, 4);
    // Cerclage métal couvercle
    x.fillStyle = '#7a6020'; x.fillRect(2, 7, 12, 1);
    x.fillStyle = P.CH3;    x.fillRect(2, 7, 12, 1);

    // ── Serrure dorée (centre) ──
    x.fillStyle = P.CH5;  x.fillRect(7, 6, 3, 4);  // platine
    x.fillStyle = P.CH3;  x.fillRect(7, 6, 3, 1);  // reflet haut platine
    x.fillStyle = P.CH4;  x.fillRect(7, 9, 3, 1);  // ombre bas platine
    x.fillStyle = '#fff0a0'; x.fillRect(8, 7, 1, 1); // trou de serrure (clair)
    x.fillStyle = P.CH4;  x.fillRect(8, 8, 1, 1);  // trou bas

    // ── Ombre latérale droite ──
    x.fillStyle = 'rgba(0,0,0,0.28)'; x.fillRect(13, 3, 1, 11);

    SPR.chest = c;
  }

  // ── CHEST OPEN ───────────────────────────────────────────────
  {
    const { c, x } = mkCanvas(16, 16);

    // Sol sous le coffre
    x.fillStyle = P.FL2; x.fillRect(0, 0, 16, 16);

    // Ombre portée (plus petite — couvercle ouvert)
    x.fillStyle = 'rgba(0,0,0,0.30)'; x.fillRect(3, 14, 10, 2);

    // ── Corps du coffre (bas) — identique au fermé ──
    x.fillStyle = P.CH1; x.fillRect(2, 9, 12, 5);
    x.fillStyle = P.CH2; x.fillRect(3, 9, 10, 4);
    x.fillStyle = P.CH4; x.fillRect(5, 9, 1, 5);
    x.fillStyle = P.CH4; x.fillRect(9, 9, 1, 5);
    x.fillStyle = '#7a6020'; x.fillRect(2, 12, 12, 2);
    x.fillStyle = P.CH3;    x.fillRect(2, 12, 12, 1);
    x.fillStyle = P.CH4;    x.fillRect(2, 13, 12, 1);

    // ── Intérieur du coffre (visible car ouvert) ──
    // Fond intérieur sombre
    x.fillStyle = '#1a1008'; x.fillRect(3, 9, 10, 4);
    // Velours rouge au fond
    x.fillStyle = '#5a1010'; x.fillRect(4, 9, 8, 3);
    x.fillStyle = '#7a1818'; x.fillRect(4, 9, 8, 1);  // reflet velours
    // Pièces d'or éparpillées
    x.fillStyle = '#d4900a'; x.fillRect(5, 10, 2, 1);
    x.fillStyle = '#f0c020'; x.fillRect(5, 10, 1, 1); // reflet pièce
    x.fillStyle = '#d4900a'; x.fillRect(9, 10, 2, 1);
    x.fillStyle = '#f0c020'; x.fillRect(9, 10, 1, 1);
    x.fillStyle = '#d4900a'; x.fillRect(7, 11, 2, 1);
    // Petite gemme rouge (butin spécial)
    x.fillStyle = '#e02020'; x.fillRect(6, 9, 1, 1);
    x.fillStyle = '#ff6060'; x.fillRect(6, 9, 1, 1);

    // ── Couvercle ouvert (basculé en arrière) ──
    // Le couvercle est incliné vers l'arrière → on le voit "à plat" en haut
    // Il occupe y=2..5 (derrière le corps du coffre visuellement)
    x.fillStyle = P.CH1; x.fillRect(2, 3, 12, 4);
    x.fillStyle = P.CH2; x.fillRect(3, 3, 10, 3);
    // Lattes couvercle
    x.fillStyle = P.CH4; x.fillRect(5, 3, 1, 4);
    x.fillStyle = P.CH4; x.fillRect(9, 3, 1, 4);
    // Cerclage métal couvercle
    x.fillStyle = '#7a6020'; x.fillRect(2, 6, 12, 1);
    x.fillStyle = P.CH3;    x.fillRect(2, 6, 12, 1);
    // Dessus bombé du couvercle (arrondi en haut)
    x.fillStyle = '#9a5828'; x.fillRect(4, 2, 8, 2);
    x.fillStyle = '#b06830'; x.fillRect(5, 2, 6, 1);
    // Ombre portée couvercle ouvert sur le mur
    x.fillStyle = 'rgba(0,0,0,0.22)'; x.fillRect(2, 7, 12, 1);

    // Serrure ouverte (crochet pendant)
    x.fillStyle = P.CH5;  x.fillRect(7, 6, 3, 2);
    x.fillStyle = P.CH3;  x.fillRect(7, 6, 3, 1);
    x.fillStyle = '#888';  x.fillRect(8, 8, 1, 2);  // crochet ouvert
    x.fillStyle = '#666';  x.fillRect(7, 9, 2, 1);

    // Ombre latérale droite
    x.fillStyle = 'rgba(0,0,0,0.28)'; x.fillRect(13, 3, 1, 11);

    SPR.chestOpen = c;
  }

  // ── BOSS CHEST — grand coffre légendaire ──────────────────────
  {
    const { c, x } = mkCanvas(24, 24);

    // Sol sous le coffre
    x.fillStyle = P.FL2; x.fillRect(0, 0, 24, 24);

    // Ombre portée large
    x.fillStyle = 'rgba(0,0,0,0.45)';
    x.fillRect(3, 20, 18, 3);

    // ── Corps du coffre (bas) ──
    x.fillStyle = P.CH4; x.fillRect(2, 13, 20, 8); // bois très foncé extérieur
    x.fillStyle = P.CH1; x.fillRect(3, 13, 18, 7);
    x.fillStyle = P.CH2; x.fillRect(4, 13, 16, 6);
    // Lattes verticales
    x.fillStyle = P.CH4;
    x.fillRect(7,  13, 1, 8); x.fillRect(11, 13, 1, 8); x.fillRect(15, 13, 1, 8);
    // Cerclage or massif bas
    x.fillStyle = '#8a6820'; x.fillRect(2, 17, 20, 3);
    x.fillStyle = P.CH5;    x.fillRect(2, 17, 20, 1); // reflet or
    x.fillStyle = '#604010'; x.fillRect(2, 19, 20, 1); // ombre bas

    // ── Couvercle bombé massif ──
    x.fillStyle = P.CH1; x.fillRect(2, 6, 20, 8);
    x.fillStyle = P.CH2; x.fillRect(3, 6, 18, 7);
    // Bombé — arrondi multiple niveaux
    x.fillStyle = '#9a5828'; x.fillRect(4, 4, 16, 3);
    x.fillStyle = '#b06830'; x.fillRect(6, 3, 12, 2);
    x.fillStyle = '#c87838'; x.fillRect(8, 2, 8,  2);
    x.fillStyle = '#d88840'; x.fillRect(10,2, 4,  1); // pointe bombée
    // Lattes couvercle
    x.fillStyle = P.CH4;
    x.fillRect(7, 6, 1, 7); x.fillRect(11, 6, 1, 7); x.fillRect(15, 6, 1, 7);
    // Cerclage or couvercle
    x.fillStyle = '#8a6820'; x.fillRect(2, 12, 20, 2);
    x.fillStyle = P.CH5;    x.fillRect(2, 12, 20, 1);

    // ── Serrure massive dorée ornée (centre) ──
    x.fillStyle = P.CH5;     x.fillRect(10, 8, 4, 6); // platine large
    x.fillStyle = '#ffe860'; x.fillRect(10, 8, 4, 1); // reflet haut
    x.fillStyle = P.CH4;     x.fillRect(10,13, 4, 1); // ombre bas
    x.fillStyle = '#fff0a0'; x.fillRect(11, 9, 2, 2); // trou serrure éclairé
    x.fillStyle = P.CH4;     x.fillRect(11,11, 2, 2); // trou bas

    // ── Gemmes ornementales (coins) ──
    x.fillStyle = '#a020c0'; x.fillRect(4,  8, 2, 2); // gemme violet gauche
    x.fillStyle = '#c040e0'; x.fillRect(4,  8, 1, 1); // reflet
    x.fillStyle = '#a020c0'; x.fillRect(18, 8, 2, 2); // gemme violet droite
    x.fillStyle = '#c040e0'; x.fillRect(18, 8, 1, 1);
    x.fillStyle = '#2080e0'; x.fillRect(4, 14, 2, 2); // gemme bleue gauche
    x.fillStyle = '#40a0ff'; x.fillRect(4, 14, 1, 1);
    x.fillStyle = '#2080e0'; x.fillRect(18,14, 2, 2); // gemme bleue droite
    x.fillStyle = '#40a0ff'; x.fillRect(18,14, 1, 1);

    // ── Chaînes dorées (décoration) ──
    x.fillStyle = '#c09020';
    x.fillRect(2, 10, 2, 1); x.fillRect(20, 10, 2, 1);
    x.fillStyle = '#e0b030';
    x.fillRect(2, 10, 1, 1); x.fillRect(20, 10, 1, 1);

    // ── Ombre latérale droite ──
    x.fillStyle = 'rgba(0,0,0,0.32)'; x.fillRect(21, 3, 1, 18);

    // ── Aura légendaire (halo doré) ──
    const aura = x.createRadialGradient(12, 10, 2, 12, 10, 13);
    aura.addColorStop(0, 'rgba(255,220,80,0.18)');
    aura.addColorStop(1, 'rgba(255,180,20,0)');
    x.fillStyle = aura; x.fillRect(0, 0, 24, 24);

    SPR.bossChest = c;
  }

  // ── BOSS CHEST OPEN — grand coffre légendaire ouvert ──────────
  {
    const { c, x } = mkCanvas(24, 24);
    x.fillStyle = P.FL2; x.fillRect(0, 0, 24, 24);
    x.fillStyle = 'rgba(0,0,0,0.35)'; x.fillRect(3, 21, 18, 2);

    // Corps
    x.fillStyle = P.CH4; x.fillRect(2, 14, 20, 7);
    x.fillStyle = P.CH1; x.fillRect(3, 14, 18, 6);
    x.fillStyle = P.CH2; x.fillRect(4, 14, 16, 5);
    x.fillStyle = P.CH4; x.fillRect(7,14,1,7); x.fillRect(11,14,1,7); x.fillRect(15,14,1,7);
    x.fillStyle = '#8a6820'; x.fillRect(2, 18, 20, 3);
    x.fillStyle = P.CH5;    x.fillRect(2, 18, 20, 1);
    x.fillStyle = '#604010'; x.fillRect(2, 20, 20, 1);

    // Intérieur velours + trésor
    x.fillStyle = '#1a1008'; x.fillRect(3, 14, 18, 5);
    x.fillStyle = '#5a1010'; x.fillRect(4, 14, 16, 4);
    x.fillStyle = '#7a1818'; x.fillRect(4, 14, 16, 1);
    // Beaucoup de pièces d'or
    for (let i = 0; i < 8; i++) {
      const gx = 5 + (i % 4) * 3, gy = 15 + (i > 3 ? 1 : 0);
      x.fillStyle = '#d4900a'; x.fillRect(gx, gy, 2, 1);
      x.fillStyle = '#f0c020'; x.fillRect(gx, gy, 1, 1);
    }
    // Gemmes éparpillées
    x.fillStyle = '#e02020'; x.fillRect(6, 14, 1, 1);
    x.fillStyle = '#2080e0'; x.fillRect(10, 15, 1, 1);
    x.fillStyle = '#a020c0'; x.fillRect(14, 14, 1, 1);
    x.fillStyle = '#20c080'; x.fillRect(17, 15, 1, 1);

    // Couvercle ouvert basculé en arrière
    x.fillStyle = P.CH1; x.fillRect(2, 4, 20, 7);
    x.fillStyle = P.CH2; x.fillRect(3, 4, 18, 6);
    x.fillStyle = '#9a5828'; x.fillRect(4, 2, 16, 3);
    x.fillStyle = '#b06830'; x.fillRect(6, 2, 12, 2);
    x.fillStyle = '#c87838'; x.fillRect(8, 2, 8, 1);
    x.fillStyle = P.CH4; x.fillRect(7,4,1,7); x.fillRect(11,4,1,7); x.fillRect(15,4,1,7);
    x.fillStyle = '#8a6820'; x.fillRect(2, 10, 20, 1);
    x.fillStyle = P.CH5;    x.fillRect(2, 10, 20, 1);
    x.fillStyle = 'rgba(0,0,0,0.22)'; x.fillRect(2, 11, 20, 1);
    // Serrure ouverte
    x.fillStyle = P.CH5; x.fillRect(10, 7, 4, 3);
    x.fillStyle = P.CH3; x.fillRect(10, 7, 4, 1);
    x.fillStyle = '#888'; x.fillRect(12, 10, 1, 3);
    x.fillStyle = '#666'; x.fillRect(11, 12, 2, 1);
    // Ombre droite
    x.fillStyle = 'rgba(0,0,0,0.32)'; x.fillRect(21, 3, 1, 18);
    // Aura
    const aura2 = x.createRadialGradient(12, 12, 2, 12, 12, 14);
    aura2.addColorStop(0, 'rgba(255,220,80,0.22)');
    aura2.addColorStop(1, 'rgba(255,180,20,0)');
    x.fillStyle = aura2; x.fillRect(0, 0, 24, 24);

    SPR.bossChestOpen = c;
  }

  // ── BREAKABLE OBJECTS — 3 variantes pixel art ──────────────────
  {
    SPR.breakable = [];
    // V0 : Pot en argile
    { const {c,x}=mkCanvas(16,16);
      x.fillStyle=P.FL2; x.fillRect(0,0,16,16);
      x.fillStyle='rgba(0,0,0,.35)'; x.fillRect(5,13,8,2);
      x.fillStyle='#7a4828'; x.fillRect(5,5,7,8);
      x.fillStyle='#9a6038'; x.fillRect(6,4,5,9);
      x.fillStyle='#b07848'; x.fillRect(7,4,3,4);
      x.fillStyle='#6a3820'; x.fillRect(6,3,5,2);
      x.fillStyle='#8a5030'; x.fillRect(7,3,3,1);
      x.fillStyle='#c09060'; x.fillRect(6,2,5,2);
      x.fillStyle='#e0b880'; x.fillRect(7,2,3,1);
      x.fillStyle='#4a2010'; x.fillRect(5,10,1,3); x.fillRect(11,10,1,3);
      x.fillStyle='#5a2a14'; x.fillRect(5,5,1,5); x.fillRect(11,5,1,5);
      x.fillStyle='#c08040'; x.globalAlpha=0.5; x.fillRect(6,8,6,1); x.globalAlpha=1;
      SPR.breakable.push(c); }
    // V1 : Tonneau en bois
    { const {c,x}=mkCanvas(16,16);
      x.fillStyle=P.FL2; x.fillRect(0,0,16,16);
      x.fillStyle='rgba(0,0,0,.35)'; x.fillRect(4,13,9,2);
      x.fillStyle='#5a3810'; x.fillRect(4,4,9,9);
      x.fillStyle='#7a5020'; x.fillRect(5,4,7,9);
      x.fillStyle='#9a6830'; x.fillRect(6,5,5,7);
      x.fillStyle='#4a2c0c'; x.fillRect(4,5,1,7); x.fillRect(12,5,1,7);
      x.fillStyle='#4a2c0c'; x.globalAlpha=0.5;
      x.fillRect(7,4,1,9); x.fillRect(9,4,1,9); x.fillRect(11,4,1,9); x.globalAlpha=1;
      x.fillStyle='#606868'; x.fillRect(4,6,9,1); x.fillRect(4,10,9,1);
      x.fillStyle='#888e8e'; x.fillRect(5,6,7,1); x.fillRect(5,10,7,1);
      x.fillStyle='#7a5020'; x.fillRect(5,3,7,2);
      x.fillStyle='#9a6830'; x.fillRect(6,3,5,1);
      x.fillStyle='#606868'; x.fillRect(5,4,7,1);
      SPR.breakable.push(c); }
    // V2 : Pile de pierres
    { const {c,x}=mkCanvas(16,16);
      x.fillStyle=P.FL2; x.fillRect(0,0,16,16);
      x.fillStyle='rgba(0,0,0,.30)'; x.fillRect(4,13,9,2);
      x.fillStyle='#484858'; x.fillRect(3,8,6,5);
      x.fillStyle='#585868'; x.fillRect(3,8,5,4);
      x.fillStyle='#686878'; x.fillRect(4,8,3,2);
      x.fillStyle='#303040'; x.fillRect(8,10,1,3);
      x.fillStyle='#404050'; x.fillRect(8,9,5,4);
      x.fillStyle='#505060'; x.fillRect(8,9,4,3);
      x.fillStyle='#606070'; x.fillRect(9,9,2,2);
      x.fillStyle='#303040'; x.fillRect(7,11,1,2);
      x.fillStyle='#505060'; x.fillRect(6,6,5,4);
      x.fillStyle='#606070'; x.fillRect(6,6,4,3);
      x.fillStyle='#707080'; x.fillRect(7,6,2,1);
      x.fillStyle='#303040'; x.fillRect(5,8,1,2); x.fillRect(10,8,1,2);
      x.fillStyle='#c8c0a0'; x.fillRect(5,10,2,1); x.fillRect(10,9,1,1); x.fillRect(7,7,1,1);
      SPR.breakable.push(c); }
  }

  // ── BREAKABLE SMASHED — débris au sol après casse ───────────────
  {
    SPR.breakableSmashed = [];
    // V0 cassé : tessons de pot éparpillés
    { const {c,x}=mkCanvas(16,16);
      x.fillStyle=P.FL2; x.fillRect(0,0,16,16);
      // Gros tesson gauche
      x.fillStyle='#7a4828'; x.fillRect(3,9,4,3);
      x.fillStyle='#9a6038'; x.fillRect(3,9,3,2);
      x.fillStyle='#4a2010'; x.fillRect(3,11,4,1);
      // Gros tesson droite
      x.fillStyle='#7a4828'; x.fillRect(10,8,4,4);
      x.fillStyle='#9a6038'; x.fillRect(10,8,3,3);
      x.fillStyle='#4a2010'; x.fillRect(10,11,4,1);
      // Petit tesson haut
      x.fillStyle='#9a6038'; x.fillRect(7,5,3,2);
      x.fillStyle='#c09060'; x.fillRect(7,5,2,1);
      // Petits débris épars
      x.fillStyle='#7a4828'; x.fillRect(6,10,2,1); x.fillRect(9,6,2,1); x.fillRect(4,6,2,1);
      x.fillStyle='#9a6038'; x.fillRect(12,6,1,1); x.fillRect(2,8,1,1); x.fillRect(8,12,1,1);
      // Ombre portée légère
      x.fillStyle='rgba(0,0,0,.25)'; x.fillRect(3,12,4,1); x.fillRect(10,12,4,1);
      SPR.breakableSmashed.push(c); }
    // V1 cassé : planches de tonneau brisées
    { const {c,x}=mkCanvas(16,16);
      x.fillStyle=P.FL2; x.fillRect(0,0,16,16);
      // Planche 1 — diagonale gauche
      x.fillStyle='#5a3810'; x.fillRect(2,8,2,5);
      x.fillStyle='#7a5020'; x.fillRect(2,8,1,4);
      x.fillStyle='#9a6830'; x.fillRect(3,9,1,2);
      // Planche 2 — horizontale centre
      x.fillStyle='#5a3810'; x.fillRect(5,10,7,2);
      x.fillStyle='#7a5020'; x.fillRect(5,10,6,1);
      x.fillStyle='#9a6830'; x.fillRect(6,10,4,1);
      // Planche 3 — droite verticale
      x.fillStyle='#5a3810'; x.fillRect(12,7,2,4);
      x.fillStyle='#7a5020'; x.fillRect(12,7,1,3);
      // Cerclage métal brisé
      x.fillStyle='#606868'; x.fillRect(4,12,4,1); x.fillRect(10,6,3,1);
      x.fillStyle='#888e8e'; x.fillRect(4,12,3,1); x.fillRect(10,6,2,1);
      // Éclats épars
      x.fillStyle='#7a5020'; x.fillRect(7,7,2,1); x.fillRect(3,6,2,1); x.fillRect(11,11,2,1);
      x.fillStyle='rgba(0,0,0,.22)'; x.fillRect(2,12,3,1); x.fillRect(5,11,7,1);
      SPR.breakableSmashed.push(c); }
    // V2 cassé : pierres éparpillées + poussière
    { const {c,x}=mkCanvas(16,16);
      x.fillStyle=P.FL2; x.fillRect(0,0,16,16);
      // Pierre 1
      x.fillStyle='#484858'; x.fillRect(2,9,4,3);
      x.fillStyle='#585868'; x.fillRect(2,9,3,2);
      x.fillStyle='#686878'; x.fillRect(3,9,1,1);
      x.fillStyle='rgba(0,0,0,.22)'; x.fillRect(2,11,4,1);
      // Pierre 2
      x.fillStyle='#404050'; x.fillRect(9,7,4,3);
      x.fillStyle='#505060'; x.fillRect(9,7,3,2);
      x.fillStyle='#606070'; x.fillRect(10,7,1,1);
      x.fillStyle='rgba(0,0,0,.22)'; x.fillRect(9,9,4,1);
      // Pierre 3 petite
      x.fillStyle='#484858'; x.fillRect(6,11,3,2);
      x.fillStyle='#585868'; x.fillRect(6,11,2,1);
      x.fillStyle='rgba(0,0,0,.20)'; x.fillRect(6,12,3,1);
      // Graviers épars
      x.fillStyle='#505060'; x.fillRect(4,6,2,1); x.fillRect(12,10,1,1); x.fillRect(7,5,1,1);
      x.fillStyle='#404050'; x.fillRect(3,13,2,1); x.fillRect(11,12,2,1); x.fillRect(8,8,1,1);
      // Points de poussière
      x.fillStyle='#686878'; x.globalAlpha=0.4;
      x.fillRect(5,8,1,1); x.fillRect(13,8,1,1); x.fillRect(2,11,1,1); x.globalAlpha=1;
      SPR.breakableSmashed.push(c); }
  }

  // ── TRAP — plaque de pression discrète, quasi pleine tuile ──────
  {
    const { c: c32, x: d } = mkCanvas(32, 32);

    // Fond sol exact
    d.fillStyle = P.FL2; d.fillRect(0, 0, 32, 32);

    // ── Dépression autour de la plaque ───────────────────────────
    d.fillStyle = 'rgba(0,0,0,0.28)'; d.fillRect(2, 2, 28, 28);

    // ── Plaque principale — métal oxydé, teinte proche du sol ────
    // Base sombre légèrement violacée (métal vieux)
    d.fillStyle = '#293548'; d.fillRect(3, 3, 26, 26);
    // Zone centrale un poil plus claire
    d.fillStyle = '#2e3c52'; d.fillRect(4, 4, 24, 24);
    d.fillStyle = '#33425a'; d.fillRect(5, 5, 20, 20);
    // Légère variation de surface (texture métal)
    d.fillStyle = 'rgba(60,80,110,0.18)';
    d.fillRect(5, 5, 10, 10); d.fillRect(17, 17, 10, 10);
    d.fillStyle = 'rgba(20,28,44,0.18)';
    d.fillRect(15, 5, 10, 10); d.fillRect(5, 17, 10, 10);

    // ── Rainures — disposition en rectangle intérieur ─────────────
    // Rainure périphérique (légèrement en retrait du bord)
    d.fillStyle = 'rgba(0,0,0,0.32)';
    d.fillRect(7,  7, 18, 1);   // haut
    d.fillRect(7, 24, 18, 1);   // bas
    d.fillRect(7,  7,  1, 18);  // gauche
    d.fillRect(24, 7,  1, 18);  // droite

    // Reflet sur la rainure haute et gauche (relief)
    d.fillStyle = 'rgba(255,255,255,0.07)';
    d.fillRect(7, 8, 18, 1);   // dessous rainure haute
    d.fillRect(8, 7,  1, 18);  // droite de la rainure gauche

    // Petite rainure centrale (marque d'usure, pas une croix)
    d.fillStyle = 'rgba(0,0,0,0.22)';
    d.fillRect(10, 15, 12, 1);   // juste une ligne horizontale
    d.fillRect(15, 10,  1, 12);   // et une verticale (discret ×)
    // On atténue l'intersection pour éviter l'effet croix voyant
    d.fillStyle = 'rgba(40,55,80,0.60)'; d.fillRect(15, 15, 1, 1);

    // ── Bord de la plaque — relief 3D subtil ──────────────────────
    // Arête haute et gauche : clair (lumière de la torche)
    d.fillStyle = 'rgba(255,255,255,0.09)';
    d.fillRect(3, 3, 26, 1);  // haut
    d.fillRect(3, 3,  1, 26); // gauche
    // Arête basse et droite : sombre (ombre)
    d.fillStyle = 'rgba(0,0,0,0.38)';
    d.fillRect(3, 28, 26, 1);   // bas
    d.fillRect(28, 3,  1, 26);  // droite

    // ── Micro-rivets aux coins (détail métal, pas brillant) ───────
    d.fillStyle = '#202e40';
    [[5,5],[26,5],[5,26],[26,26]].forEach(([rx,ry]) => {
      d.fillRect(rx, ry, 2, 2);
      d.fillStyle = 'rgba(255,255,255,0.10)'; d.fillRect(rx, ry, 1, 1);
      d.fillStyle = '#202e40';
    });

    SPR.trap = smoothUpscale(c32, 16, 16);
  }

  // ── WATER + TORCH (animated) ─────────────────────────────────
  buildWater(0);
  buildTorch(0);

  // ── PLAYER ───────────────────────────────────────────────────
  buildPlayer();

  // ── MONSTERS ─────────────────────────────────────────────────
  buildMonsters();

  // ── CURSOR ───────────────────────────────────────────────────
  {
    const cur = document.getElementById('cur');
    const cx2 = cur.getContext('2d');
    cx2.imageSmoothingEnabled = false;
    [[5,0],[6,0],[5,11],[6,11],[0,5],[0,6],[11,5],[11,6],
     [4,1],[7,1],[4,10],[7,10],[1,4],[1,7],[10,4],[10,7],
     [3,2],[8,2],[3,9],[8,9],[2,3],[2,8],[9,3],[9,8],
     [5,5],[6,5],[5,6],[6,6]
    ].forEach(([px2,py2]) => { cx2.fillStyle='#c8b870'; cx2.fillRect(px2,py2,1,1); });
    [[5,1],[6,1],[5,10],[6,10],[1,5],[1,6],[10,5],[10,6]
    ].forEach(([px2,py2]) => { cx2.fillStyle='rgba(0,0,0,.6)'; cx2.fillRect(px2,py2,1,1); });
  }
}

function buildWater(frame) {
  // Stub — flaques générées comme overlays monde dans genPuddles/drawOverlays
  if (!SPR.water) { const { c } = mkCanvas(1, 1); SPR.water = c; }
}


// ══ FLAQUES — ellipse aplatie vue top-down + vaguelettes ══════════
// ══════════════════════════════════════════════════════════════════
// FLAQUES D'EAU — ellipse aplatie perspective + 6 tailles + 4 frames
// ══════════════════════════════════════════════════════════════════
function genPuddles(map, MAP_W, MAP_H, seed) {
  const rng = seededRng(seed ^ 0xABCD1234);
  const puddles = [];
  const usedTiles = new Set();
  const isPassable = (tx,ty) => { const t=map[ty]?.[tx]; return t===T.FLOOR||t===T.WATER; };

  for (let ty=1; ty<MAP_H-1; ty++) {
    for (let tx=1; tx<MAP_W-1; tx++) {
      if (map[ty][tx]!==T.WATER) continue;
      if (usedTiles.has(ty*512+tx)) continue;

      // 6 tailles — rX = rayon horizontal en pixels
      const sizeRoll = rng();
      const rX = sizeRoll<0.18 ?  4+(rng()*2|0)   // XS  4–5
               : sizeRoll<0.38 ?  6+(rng()*3|0)   // S   6–8
               : sizeRoll<0.58 ?  9+(rng()*4|0)   // M   9–12
               : sizeRoll<0.75 ? 13+(rng()*4|0)   // L  13–16
               : sizeRoll<0.90 ? 17+(rng()*4|0)   // XL 17–20
               :                 21+(rng()*5|0);  // XXL 21–25
      // Perspective top-down : rY = 45–60% de rX
      const rY = Math.max(2, (rX*(0.44+rng()*0.18))|0);

      const sw=rX*2+6, sh=rY*2+6;
      const offX=sw>>1, offY=sh>>1;
      const wx0=tx*16+8-offX, wy0=ty*16+8-offY;

      // Ellipse irrégulière — N rayons dans l'espace elliptique normalisé
      const nRays=12+(rng()*10|0);
      const rayR=Array.from({length:nRays},()=>0.52+rng()*0.64);

      const mask=Array.from({length:sh},()=>new Uint8Array(sw));
      for (let py=0;py<sh;py++)
        for (let px=0;px<sw;px++) {
          const dx=(px-offX)/rX, dy=(py-offY)/rY;
          const dist=Math.sqrt(dx*dx+dy*dy);
          if (dist<0.01){mask[py][px]=1;continue;}
          const a=((Math.atan2(dy,dx)+Math.PI)/(Math.PI*2)*nRays);
          const i0=Math.floor(a)%nRays,i1=(i0+1)%nRays,t2=a-Math.floor(a);
          mask[py][px]=dist<=rayR[i0]*(1-t2)+rayR[i1]*t2?1:0;
        }
      for (let py=0;py<sh;py++)
        for (let px=0;px<sw;px++)
          if (mask[py][px]&&!isPassable((wx0+px)>>4,(wy0+py)>>4)) mask[py][px]=0;

      let pcount=0;
      for (let py=0;py<sh;py++) for (let px=0;px<sw;px++) pcount+=mask[py][px];
      if (pcount<5) continue;

      const C={
        deep:'#091422',   // centre très profond
        mid: '#0e1c36',   // milieu
        edge:'#142444',   // bord intérieur
        rim: '#182e54',   // bord extérieur (juste avant contour)
        border:'#050a12', // contour 1px
        hi1: '#1a3060',   // highlight haut (moins lumineux = DA sombre)
        hi2: '#142648',   // highlight haut secondaire
        rip1:'#162c52',   // vaguelette 1
        rip2:'#1a3460',   // vaguelette 2
        sh1: '#2a5080',   // scintillement fort
        sh2: '#3a6898',   // scintillement pâle
      };

      const distEl=Array.from({length:sh},(_,py)=>
        Float32Array.from({length:sw},(_,px)=>
          Math.sqrt(((px-offX)/rX)**2+((py-offY)/rY)**2)));

      const buildFrame=(waveOff)=>{
        const {c:fc,x:fx}=mkCanvas(sw,sh);

        // Corps — 4 niveaux de profondeur
        for (let py=0;py<sh;py++)
          for (let px=0;px<sw;px++) {
            if (!mask[py][px]) continue;
            const d=distEl[py][px];
            fx.fillStyle=d<0.25?C.deep:d<0.55?C.mid:d<0.80?C.edge:C.rim;
            fx.fillRect(px,py,1,1);
          }

        // Contour 1px intérieur
        for (let py=0;py<sh;py++)
          for (let px=0;px<sw;px++) {
            if (!mask[py][px]) continue;
            if (!mask[py-1]?.[px]||!mask[py+1]?.[px]||!mask[py]?.[px-1]||!mask[py]?.[px+1]) {
              fx.fillStyle=C.border; fx.fillRect(px,py,1,1);
            }
          }

        // Highlight supérieur (lumière du plafond — bande horizontale haut)
        for (let py=0;py<sh;py++)
          for (let px=0;px<sw;px++) {
            if (!mask[py][px]) continue;
            const dy=py-offY, d=distEl[py][px];
            if (dy< -rY*0.05 && d>0.12 && d<0.70) {
              fx.fillStyle=dy< -rY*0.35?C.hi1:C.hi2;
              fx.fillRect(px,py,1,1);
            }
          }

        // Vaguelettes — 2 arcs qui descendent de 1px/frame
        // Forme : arc courbé vers le bas (perspective), longueur 75% du diamètre
        const drawRipple=(baseY,col)=>{
          for (let px=0;px<sw;px++) {
            const relX=(px-offX)/Math.max(1,rX);
            // Courbure perspective : bas de l'arc légèrement en U
            const curve=(rY*0.10*(relX*relX))|0;
            const ry=baseY+waveOff+curve;
            if (ry<0||ry>=sh) continue;
            if (!mask[ry]?.[px]) continue;
            // Longueur limitée : fade sur les bords
            if (Math.abs(relX)>0.75) continue;
            fx.fillStyle=col; fx.fillRect(px,ry,1,1);
          }
        };
        drawRipple(offY-(rY*0.30|0), C.rip2);
        drawRipple(offY+(rY*0.22|0), C.rip1);

        // Scintillements — 2 pixels qui se déplacent sur 4 frames
        const ang1=(waveOff/4)*Math.PI*2;
        const ang2=ang1+Math.PI;
        [[ang1,0.28,C.sh1],[ang2,0.22,C.sh2]].forEach(([a,dr,col])=>{
          const spx=(offX+Math.cos(a)*rX*dr)|0;
          const spy=(offY+Math.sin(a)*rY*dr)|0;
          if (spy>=0&&spy<sh&&spx>=0&&spx<sw&&mask[spy]?.[spx]) {
            fx.fillStyle=col; fx.fillRect(spx,spy,1,1);
          }
        });
        // Pixel fixe reflet haut-gauche (torche)
        const hx=offX-(rX*0.25|0), hy=offY-(rY*0.38|0);
        if (hy>=0&&hy<sh&&hx>=0&&hx<sw&&mask[hy]?.[hx]) {
          fx.fillStyle=C.sh1; fx.fillRect(hx,hy,1,1);
        }
        return fc;
      };

      const frames=[buildFrame(0),buildFrame(1),buildFrame(2),buildFrame(3)];

      const tileR=Math.ceil(rX/16)+1;
      for (let dy=-tileR;dy<=tileR;dy++)
        for (let dx=-tileR;dx<=tileR;dx++)
          usedTiles.add((ty+dy)*512+(tx+dx));

      puddles.push({tx,ty,wx:wx0,wy:wy0,animFrames:frames,sw,sh});
    }
  }
  return puddles;
}

// ══════════════════════════════════════════════════════════════════
// FISSURES PAR CASE — sprite 16×16, dalle endommagée, style pixel art
// Chaque fissure est dessinée sur UNE tuile FLOOR (pas de traversée)
// Variantes : petit éclat, fissure en L, fissure en étoile, dalle brisée
// ══════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════
// FISSURES PAR CASE — sprite 16×16, 7 variantes, toutes petites
// ══════════════════════════════════════════════════════════════════
function genCracks(map, MAP_W, MAP_H, seed) {
  const rng = seededRng(seed^0xC4C4C4C4);
  const cracks = [];
  const usedTiles = new Set();

  const floorTiles = [];
  for (let ty=1;ty<MAP_H-1;ty++)
    for (let tx=1;tx<MAP_W-1;tx++)
      if (map[ty][tx]===T.FLOOR) floorTiles.push([tx,ty]);
  if (!floorTiles.length) return cracks;

  // 1 tuile sur 5 — plus de fissures
  const nCracks = Math.max(4, (floorTiles.length/5)|0);

  const C_DARK='#0a1220', C_MID='#162030', C_LIT='#2e4258';

  // helper : trace une ligne pixel par pixel entre deux points
  const line=(x,x0,y0,x1,y1,col,alpha=1)=>{
    const dx=x1-x0,dy=y1-y0,d=Math.sqrt(dx*dx+dy*dy);
    if (d<0.5) return;
    for (let s=0;s<=d;s++) {
      const px=Math.round(x0+dx*s/d), py=Math.round(y0+dy*s/d);
      if (px<0||py<0||px>15||py>15) continue;
      x.globalAlpha=alpha; x.fillStyle=col; x.fillRect(px,py,1,1);
    }
    x.globalAlpha=1;
  };

  // ── V1 : coin fissuré — 2-3 branches courtes depuis un coin ──
  const drawCornerCrack=(x,r)=>{
    const corner=r()*4|0;
    const ox=corner&1?13:2, oy=corner&2?13:2;
    const nb=2+(r()*2|0);
    for (let b=0;b<nb;b++) {
      let angle=Math.atan2(oy-8,ox-8)+(r()-0.5)*1.2;
      const len=3+(r()*4|0);
      let cx=ox+0.5,cy=oy+0.5;
      for (let s=0;s<len;s++) {
        const px=Math.round(cx),py=Math.round(cy);
        if (px<0||py<0||px>15||py>15) break;
        x.fillStyle=s<1?C_DARK:s<3?C_MID:C_LIT; x.fillRect(px,py,1,1);
        x.fillStyle=C_LIT; x.globalAlpha=0.30;
        x.fillRect(Math.max(0,px-1),Math.max(0,py-1),1,1); x.globalAlpha=1;
        angle+=(r()-0.5)*0.45; cx+=Math.cos(angle); cy+=Math.sin(angle);
      }
    }
  };

  // ── V2 : fissure en L ──
  const drawLCrack=(x,r)=>{
    const sx=2+(r()*4|0),sy=2+(r()*4|0);
    const ex=9+(r()*4|0),ey=9+(r()*4|0);
    const mx=r()>0.5?ex:sx, my=r()>0.5?sy:ey;
    line(x,sx,sy,mx,my,C_DARK);
    line(x,sx,sy,mx,my,C_LIT,0.28);
    line(x,mx,my,ex,ey,C_MID);
    line(x,mx,my,ex,ey,C_LIT,0.22);
  };

  // ── V3 : étoile d'impact — 3-4 branches courtes ──
  const drawStarCrack=(x,r)=>{
    const ox=5+(r()*6|0),oy=5+(r()*6|0);
    const nb=3+(r()<0.35?1:0);
    const base=r()*Math.PI*2;
    for (let b=0;b<nb;b++) {
      let angle=base+b*(Math.PI*2/nb)+(r()-0.5)*0.35;
      const len=3+(r()*4|0);
      let cx=ox+0.5,cy=oy+0.5;
      for (let s=0;s<len;s++) {
        const px=Math.round(cx),py=Math.round(cy);
        if (px<0||py<0||px>15||py>15) break;
        x.fillStyle=s<2?C_DARK:C_MID; x.fillRect(px,py,1,1);
        if (s>0) { x.fillStyle=C_LIT; x.globalAlpha=0.28; x.fillRect(Math.max(0,px-1),Math.max(0,py-1),1,1); x.globalAlpha=1; }
        angle+=(r()-0.5)*0.45; cx+=Math.cos(angle); cy+=Math.sin(angle);
      }
    }
    x.fillStyle=C_DARK; x.fillRect(ox,oy,2,2);
  };

  // ── V4 : simple trait diagonal ──
  const drawDiagCrack=(x,r)=>{
    const sx=1+(r()*5|0),sy=1+(r()*5|0);
    const angle=r()*Math.PI*2;
    const len=5+(r()*6|0);
    let cx=sx+0.5,cy=sy+0.5,a=angle;
    for (let s=0;s<len;s++) {
      const px=Math.round(cx),py=Math.round(cy);
      if (px<0||py<0||px>15||py>15) break;
      x.fillStyle=s<len*0.3?C_DARK:C_MID; x.fillRect(px,py,1,1);
      x.fillStyle=C_LIT; x.globalAlpha=0.25; x.fillRect(Math.max(0,px-1),Math.max(0,py-1),1,1); x.globalAlpha=1;
      a+=(r()-0.5)*0.35; cx+=Math.cos(a); cy+=Math.sin(a);
    }
  };

  // ── V5 : fente horizontale (joint de dalle) ──
  const drawJointCrack=(x,r)=>{
    const y0=3+(r()*10|0);
    const x0=1+(r()*4|0), x1=9+(r()*5|0);
    // Ligne principale légèrement ondulée
    for (let px=x0;px<=x1;px++) {
      const py=y0+((r()-0.5)*1.5|0);
      if (px<0||py<0||px>15||py>15) continue;
      x.fillStyle=C_DARK; x.fillRect(px,py,1,1);
      x.fillStyle=C_LIT; x.globalAlpha=0.30; x.fillRect(px,Math.max(0,py-1),1,1); x.globalAlpha=1;
    }
    // Petit éclat à l'une des extrémités
    if (r()<0.6) {
      const side=r()<0.5?x0:x1;
      let cx=side+0.5,cy=y0+0.5,a=r()*Math.PI*2;
      for (let s=0;s<3+(r()*3|0);s++) {
        const px=Math.round(cx),py=Math.round(cy);
        if (px<0||py<0||px>15||py>15) break;
        x.fillStyle=C_MID; x.fillRect(px,py,1,1);
        a+=(r()-0.5)*0.6; cx+=Math.cos(a); cy+=Math.sin(a);
      }
    }
  };

  // ── V6 : deux micro-fissures parallèles ──
  const drawDoubleCrack=(x,r)=>{
    const baseAngle=r()*Math.PI;
    const ox=3+(r()*6|0),oy=3+(r()*6|0);
    const sep=2;
    for (let n=0;n<2;n++) {
      const offPerp=n===0?-1:1;
      const px0=Math.round(ox+Math.cos(baseAngle+Math.PI/2)*sep*offPerp);
      const py0=Math.round(oy+Math.sin(baseAngle+Math.PI/2)*sep*offPerp);
      const len=3+(r()*5|0);
      let cx=px0+0.5,cy=py0+0.5,a=baseAngle+(r()-0.5)*0.3;
      for (let s=0;s<len;s++) {
        const px=Math.round(cx),py=Math.round(cy);
        if (px<0||py<0||px>15||py>15) break;
        x.fillStyle=n===0?C_DARK:C_MID; x.fillRect(px,py,1,1);
        x.fillStyle=C_LIT; x.globalAlpha=0.22; x.fillRect(Math.max(0,px-1),Math.max(0,py-1),1,1); x.globalAlpha=1;
        a+=(r()-0.5)*0.4; cx+=Math.cos(a); cy+=Math.sin(a);
      }
    }
  };

  // ── V7 : éclat de bord (fissure qui part d'un bord de tuile) ──
  const drawEdgeCrack=(x,r)=>{
    // Bord : 0=haut, 1=bas, 2=gauche, 3=droite
    const edge=r()*4|0;
    const ox=edge<2?(2+(r()*12|0)):(edge===2?0:15);
    const oy=edge<2?(edge===0?0:15):(2+(r()*12|0));
    const toCenter=Math.atan2(8-oy,8-ox);
    const nb=2+(r()*2|0);
    for (let b=0;b<nb;b++) {
      let angle=toCenter+(r()-0.5)*0.9;
      const len=3+(r()*5|0);
      let cx=ox+0.5,cy=oy+0.5;
      for (let s=0;s<len;s++) {
        const px=Math.round(cx),py=Math.round(cy);
        if (px<0||py<0||px>15||py>15) break;
        x.fillStyle=s<2?C_DARK:C_MID; x.fillRect(px,py,1,1);
        x.fillStyle=C_LIT; x.globalAlpha=0.28; x.fillRect(Math.max(0,px-1),Math.max(0,py-1),1,1); x.globalAlpha=1;
        angle+=(r()-0.5)*0.5; cx+=Math.cos(angle); cy+=Math.sin(angle);
      }
    }
  };

  const variants=[
    drawCornerCrack, drawLCrack, drawStarCrack,
    drawDiagCrack, drawJointCrack, drawDoubleCrack, drawEdgeCrack
  ];

  let placed=0, attempts=0;
  while (placed<nCracks && attempts<nCracks*5) {
    attempts++;
    const [tx,ty]=floorTiles[rng()*floorTiles.length|0];
    if (usedTiles.has(ty*512+tx)) continue;
    usedTiles.add(ty*512+tx);
    const {c,x}=mkCanvas(16,16);
    const alpha=0.28+rng()*0.24; // 0.28–0.52
    variants[rng()*variants.length|0](x,rng);
    cracks.push({tx,ty,wx:tx*16,wy:ty*16,spr:c,alpha});
    placed++;
  }
  return cracks;
}

function drawOverlays(ctx,state,camX,camY,frame) {
  const {puddles,cracks,visible}=state;
  ctx.imageSmoothingEnabled=false;

  // Fissures (sous les flaques)
  if (cracks) {
    for (const cr of cracks) {
      if (!visible[cr.ty]?.[cr.tx]) continue;
      ctx.globalAlpha=cr.alpha??0.38;
      ctx.drawImage(cr.spr,(cr.wx-camX)|0,(cr.wy-camY)|0);
    }
    ctx.globalAlpha=1;
  }

  // Flaques (au-dessus des fissures)
  if (puddles) {
    const fi=(frame>>3)&3;
    for (const p of puddles) {
      if (!visible[p.ty]?.[p.tx]) continue;
      ctx.drawImage(p.animFrames[fi],(p.wx-camX)|0,(p.wy-camY)|0);
    }
  }
}

function buildTorch(frame) {
  // Torche montée sur mur, vue de face/légèrement dessus
  // Canvas 16×16 — tout centré, pas d'offset à l'appel drawImage
  const flick  = Math.sin(frame * 0.38) * 0.8;          // -0.8 .. +0.8
  const flick2 = Math.sin(frame * 0.71 + 1.1) * 0.5;    // variation 2
  const fx = (flick  > 0.4 ? 1 : flick  < -0.4 ? -1 : 0); // ±1 px horiz
  const fy = (flick2 > 0.3 ? -1 : 0);                       // -1 px vert occ.

  const { c, x } = mkCanvas(16, 16);

  // ── Halo ambré radial sur le mur (derrière tout) ─────────────
  const halo = x.createRadialGradient(8, 7, 0, 8, 7, 10);
  halo.addColorStop(0,   'rgba(255,170,40,0.38)');
  halo.addColorStop(0.45,'rgba(210,110,15,0.22)');
  halo.addColorStop(0.75,'rgba(150, 65,10,0.10)');
  halo.addColorStop(1,   'rgba(100, 40, 5,0)');
  x.fillStyle = halo; x.fillRect(0, 0, 16, 16);

  // ── Anneau de fixation mural (haut) ──────────────────────────
  x.fillStyle = '#2c2416'; x.fillRect(6, 1, 4, 2);  // platine haut
  x.fillStyle = '#3e3220'; x.fillRect(7, 1, 2, 1);  // reflet haut
  x.fillStyle = '#1a140c'; x.fillRect(6, 2, 4, 1);  // ombre bas fixation

  // ── Bâton de la torche ────────────────────────────────────────
  // Corps principal (bois sombre)
  x.fillStyle = '#5a3614'; x.fillRect(7, 2, 2, 8);
  // Grain gauche clair
  x.fillStyle = '#7a5228'; x.fillRect(7, 3, 1, 7);
  // Grain droit sombre
  x.fillStyle = '#3c2208'; x.fillRect(8, 3, 1, 7);
  // Nœud dans le bois (à mi-hauteur)
  x.fillStyle = '#4a2c10'; x.fillRect(7, 6, 2, 1);
  x.fillStyle = '#6a4820'; x.fillRect(7, 6, 1, 1);

  // ── Cerclage métal (2 anneaux sur le bâton) ──────────────────
  // Anneau 1
  x.fillStyle = '#605040'; x.fillRect(6, 4, 4, 1);
  x.fillStyle = '#887060'; x.fillRect(6, 4, 4, 1); // reflet
  x.fillStyle = '#302820'; x.fillRect(6, 4, 4, 1);
  x.fillStyle = '#807060'; x.fillRect(6, 4, 2, 1); // reflet gauche
  x.fillStyle = '#302820'; x.fillRect(8, 4, 2, 1); // ombre droite
  // Anneau 2
  x.fillStyle = '#504030'; x.fillRect(6, 7, 4, 1);
  x.fillStyle = '#706050'; x.fillRect(6, 7, 2, 1);

  // ── Coupelle / tête de torche ────────────────────────────────
  // Corps coupelle (cuivre oxydé)
  x.fillStyle = '#8a6028'; x.fillRect(5, 9, 6, 2);
  x.fillStyle = '#a87830'; x.fillRect(5, 9, 6, 1);  // bord supérieur clair
  x.fillStyle = '#604418'; x.fillRect(5,10, 6, 1);  // bord inférieur sombre
  // Rebord évasé de la coupelle
  x.fillStyle = '#7a5422'; x.fillRect(4, 9, 1, 2);
  x.fillStyle = '#7a5422'; x.fillRect(11,9, 1, 2);
  x.fillStyle = '#c09040'; x.fillRect(4, 9, 1, 1);  // reflet coin gauche
  x.fillStyle = '#c09040'; x.fillRect(11,9, 1, 1);  // reflet coin droit
  // Intérieur (braise incandescente)
  x.fillStyle = '#6a2c08'; x.fillRect(6, 9, 4, 1);
  x.fillStyle = '#c04010'; x.fillRect(7, 9, 2, 1);  // cœur braise

  // ── Flamme multicouche animée ─────────────────────────────────
  // La flamme monte depuis la coupelle (y=8) vers le haut
  // Couche 1 — base large orangée
  const b1y = 7;
  x.fillStyle = '#e85000'; x.fillRect(5 + fx, b1y + 1, 6, 2);
  x.fillStyle = '#ff6a00'; x.fillRect(6 + fx, b1y,     4, 2);
  x.globalAlpha = 0.7;
  x.fillStyle = '#ff5500'; x.fillRect(4 + fx, b1y + 1, 1, 2);  // halo gauche
  x.fillStyle = '#ff5500'; x.fillRect(11+ fx, b1y + 1, 1, 2);  // halo droit
  x.globalAlpha = 1;

  // Couche 2 — corps jaune-orangé
  const b2y = 5 + fy;
  x.fillStyle = '#ff9010'; x.fillRect(6 + fx, b2y + 1, 4, 2);
  x.fillStyle = '#ffb820'; x.fillRect(7 + fx, b2y,     2, 2);
  x.globalAlpha = 0.5;
  x.fillStyle = '#ff8800'; x.fillRect(5 + fx, b2y, 1, 2);
  x.fillStyle = '#ff8800'; x.fillRect(10+ fx, b2y, 1, 2);
  x.globalAlpha = 1;

  // Couche 3 — cœur jaune vif
  const b3y = 3 + fy;
  x.fillStyle = '#ffda30'; x.fillRect(7 + fx, b3y + 1, 2, 2);
  x.fillStyle = '#ffee70'; x.fillRect(7 + fx, b3y,     2, 1);

  // Couche 4 — pointe blanche (pixel unique, scintille)
  const b4y = 2 + fy;
  if (frame % 3 !== 1) {
    x.fillStyle = '#fff8c0'; x.fillRect(7 + (fx >= 0 ? 1 : 0), b4y, 1, 1);
  }

  // ── Petites étincelles (frames spécifiques) ───────────────────
  if (frame % 7 === 0) { x.fillStyle = '#ffcc40'; x.fillRect(5, b2y - 1, 1, 1); }
  if (frame % 5 === 2) { x.fillStyle = '#ff8820'; x.fillRect(10,b2y - 1, 1, 1); }
  if (frame % 9 === 3) { x.fillStyle = '#ffee60'; x.fillRect(8, b4y - 1, 1, 1); }

  SPR.torch = c;
}

function buildPlayer() {
  const PNG_B64 = {
    'u': 'assets/sprites/player_up.png',
    'ne': 'assets/sprites/player_ne.png',
    'r': 'assets/sprites/player_right.png',
    'se': 'assets/sprites/player_se.png',
    'd': 'assets/sprites/player_down.png',
    'sw': 'assets/sprites/player_sw.png',
    'l': 'assets/sprites/player_left.png',
    'nw': 'assets/sprites/player_nw.png',
  };

  SPR.player = {};
  SPR.playerW = {}; SPR.playerH = {};

  for (const [dir, dataUrl] of Object.entries(PNG_B64)) {
    const img = new window.Image();
    img.onload = () => {
      const { c, x } = mkCanvas(img.width, img.height);
      x.drawImage(img, 0, 0);
      const baseFrame = c;
      
      // ===== FRAMES IDLE =====
      const idleFrames = [baseFrame];
      for (let f = 1; f <= 11; f++) {
        const { c: frameC, x: frameX } = mkCanvas(img.width, img.height);
        const cycle = f / 12;
        
        const bobY = Math.sin(cycle * Math.PI * 2) * 1.2;
        const sideWay = Math.sin(cycle * Math.PI * 2 - Math.PI / 4) * 0.5;
        const breathe = 0.93 + Math.sin(cycle * Math.PI * 2) * 0.05;
        const breatheX = 1 + Math.sin(cycle * Math.PI * 4 - Math.PI / 2) * 0.02;
        const opacityVar = 0.88 + Math.sin(cycle * Math.PI * 2) * 0.12;
        const shimmer = Math.sin(cycle * Math.PI * 3) * 0.03;
        
        frameX.save();
        frameX.globalAlpha = Math.max(0.85, opacityVar + shimmer);
        frameX.translate(img.width / 2, img.height / 2);
        frameX.scale(breathe * breatheX, breathe);
        frameX.translate(-img.width / 2, -img.height / 2);
        frameX.translate(sideWay, bobY);
        frameX.drawImage(img, 0, 0);
        frameX.restore();
        
        idleFrames.push(frameC);
      }
      
      // ===== FRAMES DE MARCHE =====
      const walkFrames = [];
      for (let f = 0; f < 8; f++) {
        const { c: frameC, x: frameX } = mkCanvas(img.width, img.height);
        const cycle = f / 8;
        
        // Animation de marche : oscillation des jambes
        const legBob = Math.sin(cycle * Math.PI * 2) * 1.5; // Saut/bounce des jambes
        const legSwing = Math.sin(cycle * Math.PI * 2 - Math.PI / 2) * 0.4; // Oscillation latérale
        const bodyBounce = Math.abs(Math.sin(cycle * Math.PI)) * 0.8; // Corps qui monte/descend
        const bodyTilt = Math.sin(cycle * Math.PI * 2) * 1.2; // Légère torsion du corps
        const stride = Math.sin(cycle * Math.PI * 2) * 0.3; // Micro-déplacement de stride
        
        frameX.save();
        frameX.globalAlpha = 0.98;
        frameX.translate(img.width / 2, img.height / 2);
        frameX.scale(0.98 + Math.sin(cycle * Math.PI) * 0.02, 0.98 + Math.sin(cycle * Math.PI * 2) * 0.03);
        frameX.translate(-img.width / 2, -img.height / 2);
        frameX.translate(legSwing + stride, legBob - bodyBounce);
        frameX.drawImage(img, 0, 0);
        frameX.restore();
        
        walkFrames.push(frameC);
      }
      
      // Stocker les deux sets de frames
      SPR.player[dir] = { idle: idleFrames, walk: walkFrames };
      SPR.playerW[dir] = img.width;
      SPR.playerH[dir] = img.height;
    };
    img.src = dataUrl;
    if (img.complete && img.naturalWidth > 0) img.onload();
  }

  // Portrait
  const { c, x } = mkCanvas(40, 40);
  drawPlayerPortrait(x);
  SPR.portrait = c;
}

function makePlayerFrame(dir, walkFrame) {
  const { c } = mkCanvas(24, 24);
  return c;
}

function drawPlayerPortrait(x) {
  fill(x, 0, 0, 40, 40, '#1a1628');
  // Helmet
  fill(x, 8, 4, 24, 20, P.PL_ARMOR1);
  fill(x, 10, 4, 20, 4, P.PL_ARMOR2);
  fill(x, 8, 6, 24, 2, P.PL_ARMOR2);
  // Face
  fill(x, 10, 12, 20, 16, P.PL_SKIN);
  // Eyes
  fill(x, 12, 16, 5, 4, P.PL_ARMOR3);
  fill(x, 23, 16, 5, 4, P.PL_ARMOR3);
  row(x, 13, 17, [P.PL_EYES, P.PL_EYES, P.PL_EYES]);
  row(x, 24, 17, [P.PL_EYES, P.PL_EYES, P.PL_EYES]);
  // Visor bar
  fill(x, 10, 20, 20, 2, P.PL_ARMOR3);
  // Chin
  fill(x, 12, 22, 16, 6, P.PL_ARMOR1);
  fill(x, 14, 22, 12, 4, P.PL_ARMOR2);
  // Pauldron hints
  fill(x, 4, 20, 6, 10, P.PL_ARMOR3);
  fill(x, 30, 20, 6, 10, P.PL_ARMOR3);
  fill(x, 5, 20, 4, 2, P.PL_ARMOR2);
  fill(x, 31, 20, 4, 2, P.PL_ARMOR2);
}

function buildMonsters() {
  SPR.monsters = {};

  // ── SKELETON 20×20 ─────────────────────────────────────────────
  ['a', 'b'].forEach((fr, fi) => {
    const S = 20;
    const { c, x } = mkCanvas(S, S);
    const bob = fi; // 0 ou 1 pour animation
    const bone  = '#e8dfc0', bone2 = '#cfc5a0', bone3 = '#a89870', boneDk = '#5a4830';
    const eyeR  = '#ff1010', eyeG = '#ff4040';
    const rust  = '#8c4820', rustL = '#b06030'; // épée rouillée

    // Ombre au sol
    x.globalAlpha = 0.22; x.fillStyle = '#000';
    x.beginPath(); x.ellipse(10, 19, 5, 1.5, 0, 0, Math.PI*2); x.fill(); x.globalAlpha = 1;

    // ── Jambes ──
    // Fémur gauche
    fill(x,  6, 14,     2, 4, bone2);
    fill(x,  6, 14+bob, 2, 1, bone);      // rotule animée
    px(x, 7, 17, boneDk);
    // Fémur droit
    fill(x, 12, 14,     2, 4, bone2);
    fill(x, 12, 14+bob, 2, 1, bone);
    px(x, 12, 17, boneDk);
    // Tibias
    fill(x,  6, 18, 2, 2, bone3);
    fill(x, 12, 18, 2, 2, bone3);
    // Pieds osseux
    row(x,  5, 19, [boneDk, bone2, bone2, boneDk]);
    row(x, 11, 19, [boneDk, bone2, bone2, boneDk]);

    // ── Bassin ──
    fill(x, 6, 13, 8, 2, bone3);
    row(x, 6, 13, [boneDk, bone2, bone, bone, bone, bone, bone2, boneDk]);
    row(x, 6, 14, [boneDk, null,   null, bone3,bone3,null, null,   boneDk]);

    // ── Colonne vertébrale ──
    for (let i = 0; i < 4; i++) {
      const cy = 9 - bob + i;
      fill(x, 9, cy, 2, 1, i%2===0 ? bone : bone2);
      px(x, 9,  cy, boneDk);
      px(x, 10, cy, bone);
    }

    // ── Cage thoracique ──
    // Sternum
    fill(x, 9, 9-bob, 2, 4, bone2);
    // Côtes gauches (3 paires)
    [[3,9],[3,10],[3,11]].forEach(([rx2,ry2], i) => {
      const w2 = 5 - i;
      fill(x, rx2, ry2-bob, w2, 1, i===0?bone:bone2);
      px(x, rx2, ry2-bob, bone3);
      px(x, rx2+w2-1, ry2-bob, boneDk);
    });
    // Côtes droites
    [[12,9],[12,10],[12,11]].forEach(([rx2,ry2], i) => {
      const w2 = 5 - i;
      fill(x, rx2, ry2-bob, w2, 1, i===0?bone:bone2);
      px(x, rx2, ry2-bob, boneDk);
      px(x, rx2+w2-1, ry2-bob, bone3);
    });

    // ── Bras gauche (tient une épée rouillée) ──
    fill(x, 3, 9-bob,  2, 5, bone2);
    fill(x, 3, 9-bob,  1, 4, bone);
    // Avant-bras courbé
    fill(x, 1, 12-bob, 3, 2, bone3);
    px(x, 1, 12-bob, bone2);
    // Épée rouillée dans la main
    fill(x, 0, 6,  1, 8, rust);
    fill(x, 0, 7,  1, 6, rustL);
    px(x, 0, 6, '#d0c000'); // garde dorée
    px(x, 0, 5, '#e0d010'); // pommeau

    // ── Bras droit (levé, menaçant) ──
    fill(x, 15, 9-bob, 2, 5, bone2);
    fill(x, 16, 9-bob, 1, 4, bone);
    // Main osseuse pointée
    row(x, 16, 13-bob, [boneDk, bone, bone2]);
    px(x, 18, 13-bob, bone3); // doigt pointé

    // ── Crâne ──
    // Forme cranienne
    fill(x, 5, 1-bob, 10, 7, bone2);
    fill(x, 6, 1-bob,  8, 6, bone);
    fill(x, 7, 1-bob,  6, 5, '#fff8ec');
    // Highlight sommet
    row(x, 7, 1-bob, ['#fff','#fff','#fff','#fff','#fff','#fff']);
    // Fissure du crâne
    px(x, 10, 1-bob, boneDk); px(x, 10, 2-bob, boneDk); px(x, 11, 3-bob, boneDk);
    // Ombres latérales
    x.globalAlpha = 0.35;
    fill(x,  5, 2-bob, 1, 5, boneDk);
    fill(x, 14, 2-bob, 1, 5, boneDk);
    x.globalAlpha = 1;
    // Orbites — grand et effrayant
    fill(x,  6, 3-bob, 3, 3, '#000');
    fill(x, 11, 3-bob, 3, 3, '#000');
    // Lueur rouge dans les orbites
    px(x,  7, 4-bob, eyeR); px(x,  8, 4-bob, eyeG);
    px(x, 12, 4-bob, eyeR); px(x, 13, 4-bob, eyeG);
    // Cavité nasale
    fill(x, 9, 6-bob, 2, 1, boneDk);
    // Mâchoire inférieure
    fill(x, 6, 7-bob, 8, 1, bone2);
    // Dents alternées (supérieures + inférieures)
    row(x, 6, 7-bob, [boneDk,'#fffff0',boneDk,'#fffff0',boneDk,'#fffff0',boneDk,'#fffff0']);

    if (!SPR.monsters.skeleton) SPR.monsters.skeleton = [];
    SPR.monsters.skeleton.push(c);
  });

  // ── GOBLIN 20×20 ───────────────────────────────────────────────
  ['a', 'b'].forEach((fr, fi) => {
    const S = 20;
    const { c, x } = mkCanvas(S, S);
    const bo = fi;
    const g1 = '#4a6c28', g2 = '#3a5418', g3 = '#2a3c10', g4 = '#6a9030', ghi = '#90c040', eye = '#ffe000';

    x.globalAlpha = 0.25; x.fillStyle = '#000';
    x.beginPath(); x.ellipse(10, 19, 6, 2, 0, 0, Math.PI*2); x.fill(); x.globalAlpha = 1;

    // Corps trapu
    fill(x, 6, 11-bo, 8, 5, g1);
    fill(x, 7, 11-bo, 6, 4, g2);
    // Plastron de cuir grossier
    fill(x, 7, 12-bo, 6, 3, '#483818');
    fill(x, 8, 12-bo, 4, 2, '#604820');
    px(x, 10, 12-bo, '#907030'); // rivet

    // Bras + arme
    fill(x, 3, 11-bo, 4, 4, g1); fill(x, 13, 11-bo, 4, 4, g1);
    fill(x, 3, 11-bo, 3, 3, g2); fill(x, 14, 11-bo, 3, 3, g2);
    // Masse (gauche)
    fill(x, 1, 8-bo, 3, 2, '#705028'); fill(x, 0, 7-bo, 4, 2, '#906030');
    px(x, 0, 7-bo, '#b08040'); // reflet
    // Couteau (droite)
    fill(x, 17, 9-bo, 1, 5, '#a0a8b0'); fill(x, 16, 9-bo, 1, 1, '#c8a820');
    px(x, 17, 14-bo, '#707880');

    // Jambes courtes
    fill(x, 6, 16, 4, 3, g3); fill(x, 10, 16, 4, 3, g3);
    fill(x, 7, 15-bo, 3, 2, g1); fill(x, 10, 15-bo, 3, 2, g1);
    // Pieds
    fill(x, 5, 18, 4, 1, '#302010'); fill(x, 10, 18, 4, 1, '#302010');

    // Grande tête
    fill(x, 3, 1-bo, 14, 11, g1);
    fill(x, 4, 1-bo, 12, 10, g2);
    fill(x, 5, 1-bo, 10, 9, g4);
    // Highlight front de crâne
    x.globalAlpha = 0.4;
    fill(x, 6, 1-bo, 8, 1, ghi); fill(x, 5, 2-bo, 1, 6, ghi);
    x.globalAlpha = 1;
    // Oreilles pointues
    fill(x, 1, 2-bo, 3, 6, g1); px(x, 1, 2-bo, g3);
    fill(x, 16, 2-bo, 3, 6, g1); px(x, 18, 2-bo, g3);
    // Yeux
    fill(x, 5, 4-bo, 4, 3, '#201008');
    fill(x, 6, 4-bo, 2, 2, eye); fill(x, 12, 4-bo, 2, 2, eye);
    px(x, 6, 4-bo, '#fff'); px(x, 13, 4-bo, '#fff');
    fill(x, 12, 4-bo, 4, 3, '#201008');
    // Nez bulbeux
    fill(x, 8, 7-bo, 4, 2, g1);
    fill(x, 9, 7-bo, 2, 2, g2);
    px(x, 9, 8-bo, g3); px(x, 10, 8-bo, g3);
    // Bouche dents
    fill(x, 6, 9-bo, 8, 2, g3);
    row(x, 6, 9-bo, [g3, '#e0d8a0', g3, '#e0d8a0', g3, '#e0d8a0', g3, '#e0d8a0']);

    if (!SPR.monsters.goblin) SPR.monsters.goblin = [];
    SPR.monsters.goblin.push(c);
  });

  // ── DEMON 20×20 ────────────────────────────────────────────────
  ['a', 'b'].forEach((fr, fi) => {
    const S = 20;
    const { c, x } = mkCanvas(S, S);
    const bo = fi;
    const d1 = '#8c2020', d2 = '#601010', d3 = '#b83030', d4 = '#d84040', dhi = '#ff6060', eye = '#ff8800';

    x.globalAlpha = 0.3; x.fillStyle = '#000';
    x.beginPath(); x.ellipse(10, 19, 7, 2, 0, 0, Math.PI*2); x.fill(); x.globalAlpha = 1;

    // Corps musclé
    fill(x, 4, 8-bo, 12, 9, d1);
    fill(x, 5, 8-bo, 10, 8, d2);
    // Lignes musculaires
    x.globalAlpha = 0.5;
    fill(x, 10, 8-bo, 1, 9, d3); // ligne centrale
    row(x, 5, 10-bo, [d3, null, d3, null, d3, null, d3, null, d3, null]); // abdos
    x.globalAlpha = 1;
    // Highlight pectoraux
    fill(x, 5, 8-bo, 4, 2, d3); fill(x, 11, 8-bo, 4, 2, d3);
    px(x, 5, 8-bo, dhi); px(x, 14, 8-bo, dhi);

    // Ailes (partielles en haut)
    fill(x, 0, 4-bo, 4, 7, '#701020');
    fill(x, 16, 4-bo, 4, 7, '#701020');
    row(x, 0, 4-bo, [null, '#901828', '#b02030', null]);
    row(x, 16, 4-bo, [null, '#b02030', '#901828', null]);
    // Membrure d'aile
    x.globalAlpha = 0.6;
    for (let i = 0; i < 4; i++) {
      px(x, 1, 4-bo+i*1, '#c03040'); px(x, 18, 4-bo+i, '#c03040');
    }
    x.globalAlpha = 1;

    // Bras puissants
    fill(x, 1, 9-bo, 4, 6, d1); fill(x, 15, 9-bo, 4, 6, d1);
    fill(x, 1, 9-bo, 3, 5, d3); fill(x, 16, 9-bo, 3, 5, d3);
    // Griffes
    row(x, 0, 14-bo, [d4, d3, null, d4]); row(x, 15, 14-bo, [d4, null, d3, d4]);

    // Pattes / sabots
    fill(x, 4, 17, 5, 2, d2); fill(x, 11, 17, 5, 2, d2);
    fill(x, 3, 16-bo, 4, 2, d1); fill(x, 12, 16-bo, 4, 2, d1);
    fill(x, 3, 18, 3, 1, '#301800'); fill(x, 12, 18, 3, 1, '#301800'); // sabots

    // Tête
    fill(x, 4, 1-bo, 12, 8, d1);
    fill(x, 5, 1-bo, 10, 7, d2);
    fill(x, 6, 1-bo, 8, 6, d3);
    // Highlight top crâne
    row(x, 6, 1-bo, [dhi, d3, d3, d3, d3, d3, d3, dhi]);
    // Ombres latérales
    x.globalAlpha = 0.35;
    fill(x, 4, 2-bo, 1, 6, '#200000'); fill(x, 15, 2-bo, 1, 6, '#200000');
    x.globalAlpha = 1;
    // Cornes
    fill(x, 4, 0, 2, 4, d4); fill(x, 14, 0, 2, 4, d4);
    row(x, 4, 0, [null, '#ff4020']); row(x, 14, 0, ['#ff4020', null]);
    // Yeux
    fill(x, 6, 3-bo, 3, 3, '#200000');
    fill(x, 7, 3-bo, 2, 2, eye); fill(x, 11, 3-bo, 2, 2, eye);
    px(x, 7, 3-bo, '#ffdd00'); px(x, 12, 3-bo, '#ffdd00');
    fill(x, 11, 3-bo, 3, 3, '#200000');
    // Dents
    fill(x, 6, 7-bo, 8, 2, '#1a0000');
    row(x, 6, 7-bo, [null, '#f0d8b0', null, '#f0d8b0', null, '#f0d8b0', null, '#f0d8b0']);

    if (!SPR.monsters.demon) SPR.monsters.demon = [];
    SPR.monsters.demon.push(c);
  });

  // ── GHOST 20×20 ────────────────────────────────────────────────
  ['a', 'b'].forEach((fr, fi) => {
    const S = 20;
    const { c, x } = mkCanvas(S, S);
    const bob = fi; // 0 ou 1px de flottement

    const w1 = '#ddeeff', w2 = '#b8d4f0', w3 = '#7aa0cc', w4 = '#4a6ea0';
    const dark = '#08101e', eyeC = '#00eeff', mouth = '#001840';

    // ── Aura radiale externe ──
    const aura = x.createRadialGradient(10, 8 - bob, 1, 10, 8 - bob, 10);
    aura.addColorStop(0,   'rgba(120,180,255,0.28)');
    aura.addColorStop(0.5, 'rgba(80,140,220,0.10)');
    aura.addColorStop(1,   'rgba(0,0,0,0)');
    x.fillStyle = aura; x.fillRect(0, 0, S, S);

    // ── Bas effiloché — 3 pointes ──
    x.globalAlpha = 0.50;
    fill(x, 3,  14 - bob, 4, 4, w3);
    fill(x, 4,  17 - bob, 2, 1, w4);
    fill(x, 8,  14 - bob, 4, 5, w3);
    fill(x, 9,  18 - bob, 2, 1, w4);
    fill(x, 13, 14 - bob, 4, 4, w3);
    fill(x, 14, 17 - bob, 2, 1, w4);
    x.globalAlpha = 1;

    // ── Corps — 3 couches concentriques de transparence décroissante ──
    // Couche 1 — bord extérieur (très éthéré)
    x.globalAlpha = 0.28;
    fill(x, 3,  6 - bob, 14, 10, w4);
    fill(x, 4,  4 - bob, 12, 12, w4);
    fill(x, 6,  3 - bob,  8,  2, w4);
    x.globalAlpha = 1;

    // Couche 2 — intermédiaire
    x.globalAlpha = 0.48;
    fill(x, 4,  6 - bob, 12,  9, w3);
    fill(x, 5,  4 - bob, 10, 10, w3);
    fill(x, 7,  3 - bob,  6,  2, w3);
    x.globalAlpha = 1;

    // Couche 3 — noyau intérieur (plus dense mais encore translucide)
    x.globalAlpha = 0.65;
    fill(x, 6,  6 - bob,  8,  8, w2);
    fill(x, 7,  4 - bob,  6,  8, w2);
    fill(x, 8,  3 - bob,  4,  3, w1);
    x.globalAlpha = 1;

    // Cœur lumineux (petite zone la plus brillante)
    x.globalAlpha = 0.80;
    fill(x, 8,  5 - bob,  4,  3, w1);
    x.globalAlpha = 1;

    // Highlight sommet — éclat blanc
    x.globalAlpha = 0.88;
    fill(x, 9, 3 - bob, 2, 1, '#ffffff');
    px(x, 10, 2 - bob, '#ffffff');
    x.globalAlpha = 1;

    // ── Bras vaporeux ──
    x.globalAlpha = 0.32;
    fill(x, 1,  9 - bob, 4, 4, w3);
    fill(x, 15, 9 - bob, 4, 4, w3);
    x.globalAlpha = 0.18;
    fill(x, 0,  10 - bob, 2, 3, w2);
    fill(x, 18, 10 - bob, 2, 3, w2);
    x.globalAlpha = 1;

    // ── Visage ──
    // Orbites — trous sombres (percés dans la forme translucide)
    x.globalAlpha = 0.85;
    fill(x, 6,  7 - bob, 3, 3, dark);
    fill(x, 11, 7 - bob, 3, 3, dark);
    x.globalAlpha = 1;

    // Halo cyan autour des yeux
    x.globalAlpha = 0.40;
    fill(x, 5,  6 - bob, 5, 5, eyeC);
    fill(x, 10, 6 - bob, 5, 5, eyeC);
    x.globalAlpha = 1;
    // Re-assombrir l'orbite par-dessus le halo
    x.globalAlpha = 0.85;
    fill(x, 6,  7 - bob, 3, 3, dark);
    fill(x, 11, 7 - bob, 3, 3, dark);
    x.globalAlpha = 1;
    // Pupille lumineuse cyan
    fill(x, 7,  7 - bob, 2, 2, eyeC);
    fill(x, 12, 7 - bob, 2, 2, eyeC);
    px(x, 7,  7 - bob, '#ffffff');
    px(x, 12, 7 - bob, '#ffffff');

    // Bouche hurlante — O ouvert
    x.globalAlpha = 0.88;
    fill(x, 8,  11 - bob, 4, 3, dark);
    fill(x, 9,  11 - bob, 2, 3, mouth);
    x.globalAlpha = 1;
    x.globalAlpha = 0.55;
    row(x, 8, 10 - bob, [null, w3, w3, null]);
    row(x, 8, 13 - bob, [null, w3, w3, null]);
    // Lueur spectrale dans la bouche
    fill(x, 9, 12 - bob, 2, 1, eyeC);
    x.globalAlpha = 1;

    if (!SPR.monsters.ghost) SPR.monsters.ghost = [];
    SPR.monsters.ghost.push(c);
  });

  // ── SPIDER 20×20 ────────────────────────────────────────────────
  ['a', 'b'].forEach((fr, fi) => {
    const S = 20;
    const { c, x } = mkCanvas(S, S);
    const alt = fi;

    const body  = '#1e0838', bodyL = '#3a1460', bodyH = '#5828a0';
    const leg   = '#2a1050', legD  = '#150828';
    const eyeR  = '#ff2000', eyeO  = '#ff7700';
    const hourglass = '#cc1400', hourglassL = '#ff3010';

    // ── Pattes (8) — longues, étalées, bien visibles ──
    // Format : [x_racine, y_racine, x_ext, y_ext] (coude intermédiaire)
    // Pattes gauches (de haut en bas)
    const legsL = alt === 0
      ? [ [6,7,  2,3,  0,2 ],   // patte 1 haut
          [5,8,  1,7,  0,8 ],   // patte 2
          [5,10, 1,11, 0,12],   // patte 3
          [6,12, 2,15, 0,17] ]  // patte 4 bas
      : [ [6,7,  2,4,  0,3 ],
          [5,8,  1,8,  0,9 ],
          [5,10, 1,12, 0,13],
          [6,12, 2,16, 0,18] ];

    const legsR = alt === 0
      ? [ [14,7,  17,3,  19,2 ],
          [15,8,  18,7,  19,8 ],
          [15,10, 18,11, 19,12],
          [14,12, 17,15, 19,17] ]
      : [ [14,7,  17,4,  19,3 ],
          [15,8,  18,8,  19,9 ],
          [15,10, 18,12, 19,13],
          [14,12, 17,16, 19,18] ];

    // Dessiner chaque patte en 2 segments (coude visible)
    [...legsL, ...legsR].forEach(([x1,y1, x2,y2, x3,y3]) => {
      // Segment 1 : racine → coude
      x.strokeStyle = leg;
      x.lineWidth = 1;
      x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke();
      // Segment 2 : coude → extrémité (plus fin)
      x.strokeStyle = legD;
      x.beginPath(); x.moveTo(x2, y2); x.lineTo(x3, y3); x.stroke();
      // Point de coude
      x.fillStyle = bodyH;
      x.fillRect(x2, y2, 1, 1);
    });

    // ── Abdomen (grand, rond, arrière) ──
    fill(x, 6, 9, 8, 9, bodyL);
    fill(x, 7, 8, 6, 10, bodyL);
    fill(x, 7, 9, 6, 9, body);
    fill(x, 8, 9, 4, 8, body);
    // Highlight dorsal
    x.globalAlpha = 0.55;
    fill(x, 9, 9, 3, 2, bodyH);
    x.globalAlpha = 1;
    // Marquage sablier (ventre)
    fill(x, 9, 12, 2, 5, '#1a0000');
    fill(x, 9, 13, 2, 3, hourglass);
    px(x, 9, 13, hourglassL); px(x, 10, 13, hourglassL); // haut sablier
    px(x, 9, 15, hourglassL); px(x, 10, 15, hourglassL); // bas sablier
    // Ombre ventrale
    x.globalAlpha = 0.35;
    fill(x, 7, 16, 6, 2, '#000');
    x.globalAlpha = 1;

    // ── Céphalothorax (tête, avant) ──
    fill(x, 7, 4, 6, 6, bodyL);
    fill(x, 8, 4, 4, 5, body);
    // Sillon
    fill(x, 9, 5, 2, 3, legD);
    // Highlight
    x.globalAlpha = 0.5;
    fill(x, 9, 4, 2, 1, bodyH);
    x.globalAlpha = 1;

    // Jonction thorax-abdomen (étranglement)
    fill(x, 9, 9, 2, 1, legD);

    // ── 8 yeux — disposés en arc sur le céphalothorax ──
    // Le céphalothorax va de x=7 à x=12, y=4 à y=9
    // 2 yeux principaux (grands, centraux) + 6 yeux secondaires (petits)
    // Yeux principaux — paire centrale, bien visibles
    fill(x, 8, 6, 2, 2, '#0a0010'); // orbite gauche
    fill(x, 11,6, 2, 2, '#0a0010'); // orbite droite
    fill(x, 8, 6, 2, 2, eyeR);      // iris gauche rouge vif
    fill(x,11, 6, 2, 2, eyeR);      // iris droit rouge vif
    px(x, 8, 6, '#ff8040');          // reflet gauche
    px(x,11, 6, '#ff8040');          // reflet droit

    // 3 yeux secondaires haut-gauche (petits, orange)
    px(x,  8, 4, eyeO);
    px(x, 10, 4, eyeO);
    px(x, 12, 4, eyeO);
    // 1 œil secondaire bas (en dessous des principaux, plus sombre)
    px(x,  9, 8, '#cc2200');
    px(x, 11, 8, '#cc2200');

    // ── Chélicères (crochets à venin) ──
    fill(x, 8, 8, 2, 2, bodyL);
    fill(x, 11,8, 2, 2, bodyL);
    px(x, 8,  9, '#ff1000'); // venin gauche
    px(x, 12, 9, '#ff1000'); // venin droit

    if (!SPR.monsters.spider) SPR.monsters.spider = [];
    SPR.monsters.spider.push(c);
  });

  // ── OGRE 20×20 ─────────────────────────────────────────────────
  ['a', 'b'].forEach((fr, fi) => {
    const S = 20;
    const { c, x } = mkCanvas(S, S);
    const bo = fi;
    const o1 = '#805030', o2 = '#604020', o3 = '#a07050', o4 = '#503020', ohi = '#c09060', eye = '#ff6000';

    x.globalAlpha = 0.3; x.fillStyle = '#000';
    x.beginPath(); x.ellipse(10, 19, 8, 2, 0, 0, Math.PI*2); x.fill(); x.globalAlpha = 1;

    // Corps massif
    fill(x, 3, 8-bo, 14, 10, o1);
    fill(x, 4, 8-bo, 12, 9, o2);
    fill(x, 5, 8-bo, 10, 8, o3);
    // Ventre proéminent
    fill(x, 6, 12-bo, 8, 4, o1);
    fill(x, 7, 12-bo, 6, 3, o3);
    px(x, 9, 13-bo, o4); px(x, 10, 13-bo, o4); // nombril
    // Peau texture
    x.globalAlpha = 0.2;
    [[5,9],[8,10],[12,11],[6,13],[14,10]].forEach(([px2,py2]) => px(x, px2, py2-bo, o4));
    x.globalAlpha = 1;

    // Bras énormes
    fill(x, 0, 9-bo, 4, 7, o1); fill(x, 16, 9-bo, 4, 7, o1);
    fill(x, 0, 9-bo, 3, 6, o3); fill(x, 17, 9-bo, 3, 6, o3);
    // Jointures
    fill(x, 0, 13-bo, 4, 2, o2); fill(x, 16, 13-bo, 4, 2, o2);
    // Poings
    fill(x, 0, 15-bo, 4, 2, o4); fill(x, 16, 15-bo, 4, 2, o4);
    row(x, 0, 15-bo, [o3, o2, o3, o2]); row(x, 16, 15-bo, [o2, o3, o2, o3]);

    // Jambes épaisses
    fill(x, 4, 18, 5, 2, o2); fill(x, 11, 18, 5, 2, o2);
    fill(x, 4, 16-bo, 5, 3, o1); fill(x, 11, 16-bo, 5, 3, o1);

    // Massue
    fill(x, 17, 4-bo, 2, 10, '#604820'); fill(x, 16, 3-bo, 4, 3, '#906030');
    row(x, 16, 3-bo, [null, '#b08040', '#b08040', null]); // clous
    [[16,4],[17,5],[18,4],[19,5]].forEach(([nx,ny]) => px(x, nx, ny-bo, '#c0a050'));

    // Tête massive (front bas)
    fill(x, 2, 0-bo, 16, 9, o1);
    fill(x, 3, 0-bo, 14, 8, o2);
    fill(x, 4, 0-bo, 12, 7, o3);
    // Arcade sourcilière prononcée
    fill(x, 2, 3-bo, 16, 3, o4);
    row(x, 3, 3-bo, [o2,o1,o1,o1,o1,o1,o1,o1,o1,o1,o1,o1,o1,o2]);
    // Highlight front
    x.globalAlpha = 0.35; fill(x, 5, 0-bo, 10, 1, ohi); x.globalAlpha = 1;
    // Yeux sous l'arcade
    fill(x, 4, 5-bo, 4, 3, '#1a0800');
    fill(x, 5, 5-bo, 2, 2, eye); fill(x, 12, 5-bo, 2, 2, eye);
    px(x, 5, 5-bo, '#ffaa00'); px(x, 13, 5-bo, '#ffaa00');
    fill(x, 12, 5-bo, 4, 3, '#1a0800');
    // Défenses + dents
    px(x, 7, 7-bo, '#e8e0c0'); px(x, 8, 7-bo, '#e8e0c0');
    px(x, 11, 7-bo, '#e8e0c0'); px(x, 12, 7-bo, '#e8e0c0');
    fill(x, 6, 8-bo, 8, 1, o4);

    if (!SPR.monsters.ogre) SPR.monsters.ogre = [];
    SPR.monsters.ogre.push(c);
  });

  // ── BOSS (Seigneur des Cryptes) 20×20 ──────────────────────────
  ['a', 'b'].forEach((fr, fi) => {
    const S = 20;
    const { c, x } = mkCanvas(S, S);
    const bob = fi;
    const robe1 = '#150028', robe2 = '#220040', robe3 = '#300060';
    const bone  = '#e8dfc0', boneD = '#a89870', boneHi = '#fffff0';
    const purp  = '#c000ff', purp2 = '#8800cc', purpL = '#e060ff';
    const gold  = '#e8c020', goldL = '#fff060', goldD = '#b09010';
    const ember = '#ff4000';

    // Ombre au sol
    x.globalAlpha = 0.35; x.fillStyle = '#000';
    x.beginPath(); x.ellipse(10, 19, 7, 2, 0, 0, Math.PI*2); x.fill(); x.globalAlpha = 1;

    // ── Aura maléfique (lueur violette) ──
    const aura = x.createRadialGradient(10, 9-bob, 0, 10, 9-bob, 10);
    aura.addColorStop(0,   'rgba(192,0,255,0.18)');
    aura.addColorStop(0.6, 'rgba(100,0,150,0.06)');
    aura.addColorStop(1,   'rgba(0,0,0,0)');
    x.fillStyle = aura; x.fillRect(0, 0, S, S);

    // ── Robe longue effilochée ──
    fill(x, 4, 9-bob, 12, 9, robe1);
    fill(x, 5, 8-bob, 10, 9, robe2);
    fill(x, 6, 8-bob,  8, 8, robe3);
    // Runes sur la robe
    px(x,  8,12-bob, purp); px(x, 11,12-bob, purp);
    px(x,  9,14-bob, purp2); px(x, 10,13-bob, purp);
    // Bas de robe déchiqueté
    row(x, 4, 17, [null, robe2, robe1, null, robe1, robe2, null, robe1, null, robe2, null, robe1]);
    row(x, 5, 18, [robe1, null, robe2, robe1, null, robe2, robe1, null, robe2, null]);
    // Liseré bas de robe (runé)
    row(x, 5, 16, [purp2, null, null, purp2, null, null, purp2, null, null, purp2]);

    // ── Sceptre (main gauche, tenu haut) ──
    fill(x, 1, 3-bob, 1, 12, '#403020'); // bâton bois sombre
    fill(x, 1, 3-bob, 1,  1, gold);       // tête du sceptre
    fill(x, 0, 2-bob, 3,  3, robe2);      // orbite magique
    px(x, 1, 2-bob, purp); px(x, 0, 3-bob, purpL); // gemme violette
    // Particules magiques (frame 2)
    if(bob===0){ px(x, 0, 1, purpL); px(x, 2, 1, purp); }
    else        { px(x, 0, 2, purp);  px(x, 2, 0, purpL);}

    // ── Mains osseuses ──
    // Main gauche (tient le sceptre)
    fill(x, 1, 9-bob, 3, 4, bone);
    fill(x, 1, 9-bob, 2, 3, boneHi);
    row(x, 0,12-bob, [bone, boneD, null]);
    px(x, 0,11-bob, boneHi);
    // Main droite (pointée, sort un sort)
    fill(x, 15, 9-bob, 3, 4, bone);
    fill(x, 16, 9-bob, 2, 3, boneHi);
    row(x, 16,12-bob, [boneD, bone, boneHi]);
    px(x, 19,11-bob, purpL); // éclat de sort
    // Doigts tendus
    px(x, 18, 9-bob, bone); px(x, 19,10-bob, boneD);

    // ── Crâne de liche ──
    fill(x, 4, 1-bob, 12, 7, boneD);
    fill(x, 5, 1-bob, 10, 6, bone);
    fill(x, 6, 1-bob,  8, 5, boneHi);
    // Fissures du crâne
    px(x, 9, 2-bob, boneD); px(x,10, 2-bob, boneD);
    px(x,11, 3-bob, boneD); px(x, 9, 4-bob, boneD);
    // Ombres latérales
    x.globalAlpha = 0.4;
    fill(x, 4, 2-bob, 1, 5, '#000');
    fill(x,15, 2-bob, 1, 5, '#000');
    x.globalAlpha = 1;

    // ── Couronne d'os et d'or ──
    fill(x, 4, 0, 12, 2, goldD);
    // Pointes de couronne
    row(x, 4, 0, [goldD, null, gold, goldD, null, goldL, goldD, null, gold, goldD, null, goldD]);
    row(x, 5, 0, [gold, goldL, gold, null, goldL, gold, null, goldL, gold, null]);
    // Gemmes dans la couronne
    px(x,  7, 0, ember);    // gemme rouge
    px(x, 10, 0, purp);     // gemme violette
    px(x, 13, 0, '#00e0ff'); // gemme cyan
    // Base couronne
    fill(x, 4, 1, 12, 1, gold);
    row(x, 4, 1, [goldD,goldL,goldD,goldL,goldD,goldL,goldD,goldL,goldD,goldL,goldD,goldL]);

    // ── Orbites lumineuses (yeux de liche) ──
    fill(x, 6, 3-bob, 3, 3, '#000');
    fill(x,11, 3-bob, 3, 3, '#000');
    // Lueur violette dans les orbites
    fill(x, 6, 3-bob, 3, 3, purp2);
    fill(x,11, 3-bob, 3, 3, purp2);
    // Pupille blanche
    fill(x, 7, 4-bob, 2, 2, purpL);
    fill(x,12, 4-bob, 2, 2, purpL);
    px(x,  7, 4-bob, '#ffffff'); px(x,12, 4-bob, '#ffffff');
    // Larme de feu (frame 2)
    if(bob===0){ px(x, 8, 5-bob, ember); px(x,13, 5-bob, ember); }

    // ── Cavité nasale ──
    fill(x, 9, 5-bob, 2, 1, '#08000c');
    px(x, 9, 6-bob, robe2); px(x,10, 6-bob, robe2);

    // ── Mâchoire + dents de liche ──
    fill(x, 5, 7-bob, 10, 1, robe1);
    // Dents (longues et acérées)
    row(x, 5, 6-bob, [null,boneHi,null,boneHi,null,boneHi,null,boneHi,null,boneHi]);
    row(x, 5, 7-bob, [null,bone,  null,bone,  null,bone,  null,bone,  null,bone]);

    if (!SPR.monsters.boss) SPR.monsters.boss = [];
    SPR.monsters.boss.push(c);
  });
}
// ══ PROCGEN ════════════════════════════════
function makeRng(seed) {
  let s = seed | 0;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

function genMap(seed, floor, mapSize=40) {
  const rng = makeRng(seed);
  const MAP_W = mapSize, MAP_H = mapSize;
  const map = Array.from({length: MAP_H}, () => Array(MAP_W).fill(T.WALL));
  const rooms = [];
  const nRooms = 8 + Math.floor(rng() * 5) + Math.floor(floor / 2);

  for (let a = 0; a < nRooms * 10 && rooms.length < nRooms; a++) {
    const w = 5 + Math.floor(rng() * 7), h = 5 + Math.floor(rng() * 7);
    const x = 1 + Math.floor(rng() * (MAP_W - w - 2));
    const y = 1 + Math.floor(rng() * (MAP_H - h - 2));
    const r = {x, y, w, h, cx: x + (w / 2 | 0), cy: y + (h / 2 | 0)};
    if (!rooms.some(o => o.x < r.x+w+1 && o.x+o.w > r.x-1 && o.y < r.y+h+1 && o.y+o.h > r.y-1)) {
      rooms.push(r);
      for (let ry = y; ry < y + h; ry++) for (let rx = x; rx < x + w; rx++) map[ry][rx] = T.FLOOR;
    }
  }

  const hcor = (x1,x2,y) => { for(let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++) map[y][x]=T.FLOOR; };
  const vcor = (y1,y2,x) => { for(let y=Math.min(y1,y2);y<=Math.max(y1,y2);y++) map[y][x]=T.FLOOR; };

  for (let i = 1; i < rooms.length; i++) {
    const a = rooms[i-1], b = rooms[i];
    if (rng() < .5) { hcor(a.cx,b.cx,a.cy); vcor(a.cy,b.cy,b.cx); }
    else             { vcor(a.cy,b.cy,a.cx); hcor(a.cx,b.cx,b.cy); }
  }

  // Specials
  const s = rooms[0], e = rooms[rooms.length-1];
  map[e.cy][e.cx] = T.STAIRS;
  rooms.slice(1,-1).forEach(r => {
    if (rng() < .5) { const tx=r.x+1+(rng()*(r.w-2)|0),ty=r.y+1+(rng()*(r.h-2)|0); if(map[ty][tx]===T.FLOOR) map[ty][tx]=T.CHEST; }
    if (rng() < .35) { const tx=r.x+1+(rng()*(r.w-2)|0),ty=r.y+1+(rng()*(r.h-2)|0); if(map[ty][tx]===T.FLOOR) map[ty][tx]=T.TRAP; }
    // Objets cassables : rares (40% chance/salle), placés dans les coins
    if (rng() < 0.40) {
      // Les 4 coins intérieurs de la salle
      const corners = [
        [r.x+1, r.y+1], [r.x+r.w-2, r.y+1],
        [r.x+1, r.y+r.h-2], [r.x+r.w-2, r.y+r.h-2]
      ];
      // Mélange et prend 1 ou 2 coins
      corners.sort(()=>rng()-0.5);
      const n = rng()<0.3 ? 2 : 1;
      for (let b=0;b<n;b++) {
        const [tx,ty]=corners[b];
        if (tx>=0&&ty>=0&&tx<MAP_W&&ty<MAP_H&&map[ty][tx]===T.FLOOR) map[ty][tx]=T.BREAKABLE;
      }
    }
  });

  // Water pools — plus nombreuses, clusters plus larges
  const nPools = 4 + floor + (rooms.length >> 1); // beaucoup plus de pools
  for (let i = 0; i < nPools; i++) {
    const r = rooms[Math.floor(rng() * rooms.length)];
    const cx = r.x+1+(rng()*(r.w-2)|0), cy = r.y+1+(rng()*(r.h-2)|0);
    // Rayon du cluster : 1 ou 2 tuiles selon rng
    const rad = rng() < 0.4 ? 2 : 1;
    for (let dy=-rad;dy<=rad;dy++)
      for (let dx=-rad;dx<=rad;dx++)
        if (map[cy+dy]?.[cx+dx]===T.FLOOR && rng()<0.72) map[cy+dy][cx+dx]=T.WATER;
  }

  // Torches on walls adjacent to rooms
  const torches = [];
  rooms.forEach(r => {
    torches.push({x: r.cx, y: r.y - 1});
    if (r.w > 6) torches.push({x: r.x - 1, y: r.cy});
  });

  // Pre-build torchSet for O(1) lookup
  const torchSet = new Set(torches.map(t => `${t.x},${t.y}`));

  return { map, rooms, start: s, MAP_W, MAP_H, torches, torchSet };
}

// ══ FOV — raycasting ══════════════════════
function computeFOVProxy(map, px, py, MAP_W, MAP_H, radius) {
  if (radius === undefined) radius = 9;
  const buf = new Uint8Array(MAP_W * MAP_H);
  buf[py * MAP_W + px] = 1;
  const RAYS = 360, step = 0.48;
  const maxSteps = (radius / step) | 0;
  for (let i = 0; i < RAYS; i++) {
    const ang = i / RAYS * 6.2832;
    const cos = Math.cos(ang), sin = Math.sin(ang);
    let rx = px + 0.5, ry = py + 0.5;
    for (let s = 0; s < maxSteps; s++) {
      rx += cos * step; ry += sin * step;
      const gx = rx | 0, gy = ry | 0;
      if (gx < 0 || gx >= MAP_W || gy < 0 || gy >= MAP_H) break;
      buf[gy * MAP_W + gx] = 1;
      if (map[gy][gx] === T.WALL) break;
    }
  }
  const rows = new Array(MAP_H);
  for (let y = 0; y < MAP_H; y++) rows[y] = buf.subarray(y * MAP_W, (y + 1) * MAP_W);
  return rows;
}


// ══ ENTITIES ═══════════════════════════════
class Entity {
  constructor(x, y) {
    this.x = x; this.y = y; this.hp = 10; this.maxHp = 10; this.alive = true;
    this.shakeT = 0; this.sox = 0; this.soy = 0;
  }
  shake() { this.shakeT = 8; }
  update() {
    if (this.shakeT > 0) { this.shakeT--; this.sox=(Math.random()-.5)*3|0; this.soy=(Math.random()-.5)*3|0; }
    else { this.sox = this.soy = 0; }
  }
}

class Player extends Entity {
  constructor(x, y) {
    super(x, y);
    this.hp = 40; this.maxHp = 40; this.mp = 20; this.maxMp = 20;
    this.atk = 6; this.def = 2; this.level = 1; this.xp = 0; this.xpNext = 25; this.gold = 0;
    this.buffs = [];
    this.spellDmg = 10; this.spellRange = 4; this.spellMpCost = 5;
    this.vampiric = 0; this.thorns = 0; this.critChance = 0; this.dodgeChance = 0;
    // Stamina / Dash
    this.stamina = 100; this.maxStamina = 100;
    this.staminaRegen = 8;
    this.dashCost = 40;
    this.dashInvincible = false;
    this._staminaRegenTimer = 0;
    // Equipment
    this.equippedWeapon = 'sword';
    this.weaponLevel = 0;
    this._weaponAtkApplied = 0;
    this._weaponSweep = false;
    this._weaponBurn = 0;
    this.armorLevels = { helmet: 0, chestplate: 0, leggings: 0, boots: 0 };
    // Potions
    this.potions = { hp: 0, mana: 0 };
    // Smooth movement
    this.rx = x * TS; this.ry = y * TS; // render pixel pos
    this.tx = this.rx; this.ty = this.ry; // target
    this.sx = this.rx; this.sy = this.ry; // start
    this.tweenT = 0; this.tweenD = 5; this.moving = false;
    this.dir = 'd'; this.animFrame = 0; this.animTimer = 0;
    this._tweenJustFinished = false; this._firstPress = false;
  }
  gainXp(a) {
    this.xp += a;
    let leveled = false;
    while (this.xp >= this.xpNext) {
      this.level++; this.xp -= this.xpNext; this.xpNext = Math.floor(this.xpNext * 2.2);
      this.maxHp += 10; this.hp = Math.min(this.hp + 10, this.maxHp);
      this.maxMp += 5; this.mp = Math.min(this.mp + 5, this.maxMp);
      this.atk += 2; leveled = true;
    }
    return leveled;
  }
  startMove(nx, ny) {
    if (this.moving) return;
    this.sx = this.rx; this.sy = this.ry;
    this.tx = nx * TS; this.ty = ny * TS;
    this.tweenT = 0; this.moving = true;
    // Direction — diagonales si dx et dy tous les deux non nuls
    const dx = nx - this.x, dy = ny - this.y;
    if (dx !== 0 && dy !== 0) {
      if      (dx > 0 && dy < 0) this.dir = 'ne';
      else if (dx > 0 && dy > 0) this.dir = 'se';
      else if (dx < 0 && dy > 0) this.dir = 'sw';
      else                        this.dir = 'nw';
    } else if (Math.abs(dx) >= Math.abs(dy)) this.dir = dx > 0 ? 'r' : 'l';
    else this.dir = dy > 0 ? 'd' : 'u';
    this.x = nx; this.y = ny;
  }
  updateTween() {
    if (!this.moving) return;
    this.tweenT++;
    const t = Math.min(1, this.tweenT / this.tweenD);
    const e = 1 - Math.pow(1 - t, 3); // cubic ease-out
    this.rx = this.sx + (this.tx - this.sx) * e;
    this.ry = this.sy + (this.ty - this.sy) * e;
    if (this.tweenT >= this.tweenD) {
      this.rx = this.tx; this.ry = this.ty; this.moving = false;
      this._tweenJustFinished = true;
    }
  }
}

class Monster extends Entity {
  constructor(x, y, type) {
    super(x, y);
    this.type = type; this._setup();
    this.aggro = false; this.moveTimer = 1 + Math.random() * 2 | 0;
    this.animFrame = 0; this.animTimer = 0;
    this.xpR = Math.floor(this.maxHp * 1.5);
    // Smooth movement
    this.rx = x * TS; this.ry = y * TS;
    this.sx = this.rx; this.sy = this.ry;
    this.tx = this.rx; this.ty = this.ry;
    this.tweenT = 0; this.tweenD = 8; this.moving = false;
  }
  _setup() {
    const T2 = {
      skeleton: {hp:8,  atk:3, col:'#d4c4a0', name:'Squelette',             speed:1},
      goblin:   {hp:7,  atk:4, col:'#60a030', name:'Gobelin',               speed:0},
      demon:    {hp:20, atk:8, col:'#c03030', name:'Démon',                 speed:1},
      ghost:    {hp:12, atk:5, col:'#a0c0d0', name:'Fantôme',               speed:1},
      spider:   {hp:6,  atk:4, col:'#7030a0', name:'Araignée',              speed:0},
      ogre:     {hp:30, atk:10,col:'#904018', name:'Ogre',                  speed:2},
      boss:     {hp:80, atk:16,col:'#c000ff', name:'Seigneur des Cryptes',  speed:1},
    };
    const t = T2[this.type] || T2.skeleton;
    this.maxHp = t.hp; this.hp = t.hp; this.atk = t.atk; this.col = t.col; this.name = t.name;
    this.speed = t.speed || 1;
    this.attackWarningTimer = 0; // Timer pour le warning avant attaque
  }
  startMove(nx, ny) {
    this.sx = this.rx; this.sy = this.ry;
    this.tx = nx * TS; this.ty = ny * TS;
    this.tweenT = 0; this.moving = true;
    this.x = nx; this.y = ny;
  }
  updateTween() {
    if (!this.moving) return;
    this.tweenT++;
    const t = Math.min(1, this.tweenT / this.tweenD);
    const e = 1 - Math.pow(1 - t, 2); // ease-out quad
    this.rx = this.sx + (this.tx - this.sx) * e;
    this.ry = this.sy + (this.ty - this.sy) * e;
    if (this.tweenT >= this.tweenD) { this.rx = this.tx; this.ry = this.ty; this.moving = false; }
  }
}

class Merchant extends Entity {
  constructor(x, y) {
    super(x, y);
    this.type = 'merchant';
    this.alive = true;
    this.rx = x * TS; this.ry = y * TS;
  }
  update() {
    // Marchand idle : respiration légère
  }
}

// ══ PARTICLES ══════════════════════════════
class Particles {
  constructor() { this.list = []; }

  // type: 'hit'=blood splat, 'gold'=coins, 'magic'=runes, 'dash'=trail, 'death'=explosion, 'fire'=embers, 'heal'=bubbles
  spawn(wx, wy, col, n=8, type='hit') {
    const cx2 = wx * TS + 8, cy2 = wy * TS + 8;
    for (let i = 0; i < n; i++) {
      const a  = Math.random() * Math.PI * 2;
      let sp, vx, vy, sz, decay, shape;
      switch(type) {
        case 'gold':
          sp = 0.8 + Math.random() * 1.4;
          vx = Math.cos(a)*sp*0.7; vy = -1.5 - Math.random()*2;
          sz = 1.5 + Math.random(); decay = 0.025 + Math.random()*0.02; shape = 'diamond'; break;
        case 'magic':
          sp = 0.6 + Math.random() * 1.8;
          vx = Math.cos(a)*sp; vy = Math.sin(a)*sp - 0.8;
          sz = 1 + Math.random()*2; decay = 0.02 + Math.random()*0.025; shape = 'star'; break;
        case 'death':
          sp = 1.5 + Math.random() * 3.5;
          vx = Math.cos(a)*sp; vy = Math.sin(a)*sp - 2;
          sz = 2 + Math.random()*2.5; decay = 0.018 + Math.random()*0.018; shape = 'circle'; break;
        case 'dash':
          sp = 0.2 + Math.random() * 0.8;
          vx = (Math.random()-0.5)*sp; vy = -0.5 - Math.random();
          sz = 1 + Math.random()*1.5; decay = 0.06 + Math.random()*0.05; shape = 'rect'; break;
        case 'fire':
          sp = 0.5 + Math.random() * 1.5;
          vx = (Math.random()-0.5)*sp*0.6; vy = -1.2 - Math.random()*2;
          sz = 1 + Math.random()*1.5; decay = 0.03 + Math.random()*0.03; shape = 'circle'; break;
        case 'heal':
          sp = 0.4 + Math.random() * 0.8;
          vx = Math.cos(a)*sp*0.4; vy = -0.8 - Math.random()*1.5;
          sz = 1 + Math.random()*1.5; decay = 0.022 + Math.random()*0.02; shape = 'circle'; break;
        default: // 'hit' — blood
          sp = 1 + Math.random() * 2.5;
          vx = Math.cos(a)*sp; vy = Math.sin(a)*sp - 1.5;
          sz = 1 + Math.random()*2; decay = 0.03 + Math.random()*0.04; shape = 'rect';
      }
      this.list.push({ x:cx2, y:cy2, vx, vy, col, sz, life:1, decay, shape });
    }
  }

  update() {
    this.list = this.list.filter(p => p.life > 0);
    for (const p of this.list) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.life -= p.decay;
    }
  }
}

// Pre-bake dim (explored-but-not-visible) versions of all sprites
// This replaces the slow per-tile css filter
const DIM = {};
function bakeDimSprites() {
  function makeDim(src) {
    if (!src) return null;
    const { c, x } = mkCanvas(src.width, src.height);
    x.drawImage(src, 0, 0);
    x.globalCompositeOperation = 'multiply';
    x.fillStyle = '#282030';
    x.fillRect(0, 0, src.width, src.height);
    x.globalCompositeOperation = 'source-over';
    x.globalAlpha = 0.35;
    x.fillStyle = '#000';
    x.fillRect(0, 0, src.width, src.height);
    return c;
  }
  DIM.floor  = makeDim(SPR.floorTex);
  DIM.floorB = DIM.floor;
  DIM.floorC = DIM.floor;
  DIM.wall   = makeDim(SPR.wallTex);
  DIM.stairs = makeDim(SPR.stairs);
  DIM.chest  = makeDim(SPR.chest);
  DIM.chestOpen = makeDim(SPR.chestOpen);
  DIM.bossChest = makeDim(SPR.bossChest);
  DIM.bossChestOpen = makeDim(SPR.bossChestOpen);
  DIM.water  = makeDim(SPR.water);
}

// Cache radial gradients (recreated only when position changes enough)
let _cachedPlayerGrad = null, _cachedPlx = -9999, _cachedPly = -9999;

function buildLightmap(state, camX, camY, ox, oy) {
  const lc = lightCx;
  const cw = lightCv.width, ch = lightCv.height;
  
  // Clear entire window to dark
  lc.fillStyle = 'rgba(0,0,0,.9)';
  lc.fillRect(0, 0, cw, ch);
  lc.save();
  lc.globalCompositeOperation = 'destination-out';

  const p = state.player;
  // Final screen coordinates (after translate + scale)
  const plx = ox + (p.rx - camX + TS/2) * SCALE;
  const ply = oy + (p.ry - camY + TS/2) * SCALE;

  // Only recreate gradient if player moved significantly
  if (Math.abs(plx - _cachedPlx) > 2 || Math.abs(ply - _cachedPly) > 2) {
    const r = 85 * SCALE;
    _cachedPlayerGrad = lc.createRadialGradient(plx, ply, 0, plx, ply, r);
    _cachedPlayerGrad.addColorStop(0,   'rgba(0,0,0,1)');
    _cachedPlayerGrad.addColorStop(.45, 'rgba(0,0,0,.75)');
    _cachedPlayerGrad.addColorStop(1,   'rgba(0,0,0,0)');
    _cachedPlx = plx; _cachedPly = ply;
  }
  
  const r0 = 90 * SCALE;
  lc.fillStyle = _cachedPlayerGrad;
  lc.fillRect(plx - r0, ply - r0, r0 * 2, r0 * 2);

  // Torch lights — seulement les torches explorées
  const flick = 0.88 + Math.sin(G.frame * 0.12) * 0.08;
  state.torches.forEach(t => {
    // Ne pas allumer une torche dans une zone non-explorée
    if (!state.explored[t.y]?.[t.x]) return;
    const tx = ox + (t.x * TS - camX + TS/2) * SCALE;
    const ty = oy + (t.y * TS - camY + TS/2) * SCALE;
    const r = 52 * SCALE * flick;
    if (tx < -r || tx > cw + r || ty < -r || ty > ch + r) return;
    const tg = lc.createRadialGradient(tx, ty, 0, tx, ty, r);
    tg.addColorStop(0,   'rgba(0,0,0,.85)');
    tg.addColorStop(.4,  'rgba(0,0,0,.5)');
    tg.addColorStop(1,   'rgba(0,0,0,0)');
    lc.fillStyle = tg;
    lc.fillRect(tx - r, ty - r, r * 2, r * 2);
  });

  lc.restore();
}

// ══ CAMERA ═════════════════════════════════
const cam = { x: 0, y: 0 };
function updateCam(player) {
  const tx = player.rx - VW / 2 + TS / 2;
  const ty = player.ry - VH / 2 + TS / 2;
  cam.x += (tx - cam.x) * 0.16;
  cam.y += (ty - cam.y) * 0.16;
}

// ══ RENDER ═════════════════════════════════
// Dessin d'une tuile depuis une texture 256×256 avec wrap automatique aux bords
function _drawWrapped(ctx, tex, srcX, srcY, w, h, dstX, dstY) {
  const S = tex ? (tex.width || 128) : 128;
  // Découpe en sous-rects si on dépasse 255
  const x1 = srcX, y1 = srcY;
  const x2 = (srcX + w > S) ? S - srcX : w;  // largeur dans la texture
  const y2 = (srcY + h > S) ? S - srcY : h;  // hauteur dans la texture

  ctx.drawImage(tex, x1, y1, x2, y2, dstX, dstY, x2, y2);
  if (x2 < w) ctx.drawImage(tex, 0, y1, w - x2, y2, dstX + x2, dstY, w - x2, y2);
  if (y2 < h) ctx.drawImage(tex, x1, 0, x2, h - y2, dstX, dstY + y2, x2, h - y2);
  if (x2 < w && y2 < h) ctx.drawImage(tex, 0, 0, w - x2, h - y2, dstX + x2, dstY + y2, w - x2, h - y2);
}

function render(state) {
  const cw = cv.width, ch = cv.height;
  cx.fillStyle = '#000';
  cx.fillRect(0, 0, cw, ch);

  cx.save();
  // Center the game viewport in the full window
  const ox = ((cw - VW * SCALE) / 2) | 0;
  const oy = ((ch - VH * SCALE) / 2) | 0;
  cx.translate(ox, oy);
  cx.scale(SCALE, SCALE);
  cx.imageSmoothingEnabled = false;

  const { map, MAP_W, MAP_H, monsters, player, visible, explored, torches, torchSet, particles } = state;
  const camX = cam.x | 0, camY = cam.y | 0;

  const startX = Math.max(0, (camX / TS | 0) - 1);
  const startY = Math.max(0, (camY / TS | 0) - 1);
  const endX   = Math.min(MAP_W, ((camX + VW) / TS | 0) + 2);
  const endY   = Math.min(MAP_H, ((camY + VH) / TS | 0) + 2);

  // Draw tiles — no save/restore, no filter, pre-baked dim sprites
  for (let ty2 = startY; ty2 < endY; ty2++) {
    for (let tx2 = startX; tx2 < endX; tx2++) {
      if (!explored[ty2][tx2]) continue;
      const tile = map[ty2][tx2];
      if (tile === T.EMPTY) continue;

      const sx = tx2 * TS - camX, sy = ty2 * TS - camY;
      const isVis = visible[ty2][tx2];

      // Coordonnées monde pour ancrage du pattern (repeat seamless)
      const wx = tx2 * TS, wy = ty2 * TS;

      if (tile === T.WALL) {
        if (isVis) {
          const srcX = (tx2 * TS) & 127, srcY = (ty2 * TS) & 127;
          _drawWrapped(cx, SPR.wallTex, srcX, srcY, TS, TS, sx, sy);
        } else {
          _drawWrapped(cx, DIM.wall, (tx2 * TS) & 127, (ty2 * TS) & 127, TS, TS, sx, sy);
        }
      } else if (tile === T.STAIRS) {
        const spr = isVis ? SPR.stairs : (DIM.stairs || SPR.stairs);
        cx.drawImage(spr, sx, sy);
      } else if (tile === T.CHEST) {
        const srcX = (tx2 * TS) & 127, srcY = (ty2 * TS) & 127;
        if (isVis) _drawWrapped(cx, SPR.floorTex, srcX, srcY, TS, TS, sx, sy);
        else _drawWrapped(cx, DIM.floor, srcX, srcY, TS, TS, sx, sy);
        const isOpened = state.openedChests?.has(`${tx2},${ty2}`);
        const chestSpr = isOpened ? SPR.chestOpen : SPR.chest;
        if (isVis) cx.drawImage(chestSpr, sx, sy);
        else { cx.globalAlpha = 0.5; cx.drawImage(chestSpr, sx, sy); cx.globalAlpha = 1; }
      } else if (tile === T.BOSS_CHEST) {
        const srcX = (tx2 * TS) & 127, srcY = (ty2 * TS) & 127;
        if (isVis) _drawWrapped(cx, SPR.floorTex, srcX, srcY, TS, TS, sx, sy);
        else _drawWrapped(cx, DIM.floor, srcX, srcY, TS, TS, sx, sy);
        if (SPR.bossChest) {
          const isOpened = state.openedChests?.has(`${tx2},${ty2}`);
          const bcSpr = isOpened ? SPR.bossChestOpen : SPR.bossChest;
          if (isVis) {
            // Aura dorée pulsante autour du boss chest non ouvert
            if (!isOpened) {
              const pulse = 0.25 + 0.15 * Math.sin((G.frame || 0) * 0.1);
              const auraR = 14;
              const ag = cx.createRadialGradient(sx+8, sy+8, 2, sx+8, sy+8, auraR);
              ag.addColorStop(0, `rgba(255,200,40,${pulse})`);
              ag.addColorStop(1, 'rgba(255,150,0,0)');
              cx.fillStyle = ag;
              cx.fillRect(sx - auraR + 8, sy - auraR + 8, auraR * 2, auraR * 2);
            }
            // Décalé de -4,-4 pour centrer le sprite 24×24 sur la tuile 16×16
            cx.drawImage(bcSpr, sx - 4, sy - 4, 24, 24);
          } else {
            cx.globalAlpha = 0.5; cx.drawImage(bcSpr, sx - 4, sy - 4, 24, 24); cx.globalAlpha = 1;
          }
        }
      } else if (tile === T.BREAKABLE) {
        const srcX = (tx2 * TS) & 127, srcY = (ty2 * TS) & 127;
        if (isVis) _drawWrapped(cx, SPR.floorTex, srcX, srcY, TS, TS, sx, sy);
        else _drawWrapped(cx, DIM.floor, srcX, srcY, TS, TS, sx, sy);
        if (SPR.breakable && SPR.breakable.length > 0) {
          // Variante déterministe par position
          const vi = ((tx2 * 7 + ty2 * 13) % SPR.breakable.length + SPR.breakable.length) % SPR.breakable.length;
          const bspr = SPR.breakable[vi];
          if (isVis) cx.drawImage(bspr, sx, sy);
          else { cx.globalAlpha = 0.5; cx.drawImage(bspr, sx, sy); cx.globalAlpha = 1; }
        }
      } else if (tile === T.WATER) {
        // Tuile eau = sol normal, la flaque est dessinée en overlay par drawOverlays
        const srcX = (tx2 * TS) & 127, srcY = (ty2 * TS) & 127;
        if (isVis) _drawWrapped(cx, SPR.floorTex, srcX, srcY, TS, TS, sx, sy);
        else _drawWrapped(cx, DIM.floor, srcX, srcY, TS, TS, sx, sy);
      } else {
        const srcX = (tx2 * TS) & 127, srcY = (ty2 * TS) & 127;
        if (isVis) _drawWrapped(cx, SPR.floorTex, srcX, srcY, TS, TS, sx, sy);
        else _drawWrapped(cx, DIM.floor, srcX, srcY, TS, TS, sx, sy);
      }

      if (tile === T.TRAP && isVis) cx.drawImage(SPR.trap, sx, sy);

      // Débris au sol — objet cassé
      if (tile === T.FLOOR && isVis && state.smashed?.has(`${tx2},${ty2}`) && SPR.breakableSmashed) {
        const vi = ((tx2*7+ty2*13)%3+3)%3;
        cx.drawImage(SPR.breakableSmashed[vi], sx, sy);
      }

      // Torch — O(1) lookup
      if (tile === T.WALL && isVis && torchSet.has(`${tx2},${ty2}`) && SPR.torch) {
        cx.drawImage(SPR.torch, sx, sy);
      }
    }
  }

  // Overlays monde — flaques + fissures (indépendants des tuiles)
  drawOverlays(cx, state, camX, camY, G.frame || 0);

  // ── THREAT WARNING OVERLAY ──
  // Affiche la case rouge clignotante avant l'attaque
  for (const m of monsters) {
    if (!m.alive || !visible[m.y]?.[m.x] || m.attackWarningTimer <= 0) continue;
    const px = (m.x * TS - camX) | 0;
    const py = (m.y * TS - camY) | 0;
    // Pulsing effect
    const pulse = Math.sin(m.attackWarningTimer * Math.PI / 2);
    const alpha = 0.3 + pulse * 0.4;
    cx.fillStyle = `rgba(255, 32, 32, ${alpha})`;
    cx.fillRect(px, py, TS, TS);
    cx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
    cx.lineWidth = 2;
    cx.strokeRect(px, py, TS, TS);
  }

  // Entities — sorted by Y
  const drawList = [];
  for (const m of monsters) {
    if (m.alive && visible[m.y]?.[m.x]) drawList.push(m);
  }
  drawList.sort((a, b) => a.ry - b.ry);

  for (const m of drawList) drawMonster(cx, m, camX, camY);
  drawPlayer(cx, player, camX, camY);
  
  // Draw merchant
  if (state.merchant && state.merchant.alive && visible[state.merchant.y]?.[state.merchant.x]) {
    drawMerchant(cx, state.merchant, camX, camY);
  }

  // Particles — no shadowBlur (GPU killer)
  for (const p of particles.list) {
    cx.globalAlpha = p.life * p.life; // quadratic fade
    cx.fillStyle = p.col;
    const px2 = (p.x - camX) | 0, py2 = (p.y - camY) | 0;
    const s = p.sz | 0 || 1;
    if (p.shape === 'diamond') {
      cx.beginPath();
      cx.moveTo(px2, py2 - s);
      cx.lineTo(px2 + s, py2);
      cx.lineTo(px2, py2 + s);
      cx.lineTo(px2 - s, py2);
      cx.closePath(); cx.fill();
    } else if (p.shape === 'star') {
      // petit carré + croix pour simuler une étoile en pixel art
      cx.fillRect(px2 - s, py2 - 1, s*2, 2);
      cx.fillRect(px2 - 1, py2 - s, 2, s*2);
    } else if (p.shape === 'circle') {
      cx.beginPath();
      cx.arc(px2, py2, Math.max(1, s * 0.8), 0, Math.PI * 2);
      cx.fill();
    } else {
      // rect (default)
      cx.fillRect(px2 - s, py2 - s, s * 2, s * 2);
    }
  }
  cx.globalAlpha = 1;

  cx.restore();
  buildLightmap(state, camX, camY, ox, oy);
  cx.drawImage(lightCv, 0, 0);
}

function drawPlayer(cx2, p, camX, camY) {
  const sx = (p.rx - camX + p.sox) | 0, sy = (p.ry - camY + p.soy) | 0;
  // Ombre
  cx2.globalAlpha = .3; cx2.fillStyle = '#000';
  cx2.beginPath(); cx2.ellipse(sx + 8, sy + 12, 8, 3, 0, 0, Math.PI*2); cx2.fill();
  cx2.globalAlpha = 1;

  // Utilise la dir exacte — toutes les 8 directions sont disponibles
  const sprDir = p.dir || 'd';
  const sprData = SPR.player[sprDir];
  
  // Sélectionner idle ou walk frames
  const isMoving = p.moving;
  const frames = (sprData && sprData[isMoving ? 'walk' : 'idle']) || (sprData && sprData.idle);
  
  if (frames && frames.length > 0 && frames[0]) {
    cx2.imageSmoothingEnabled = false;
    const sw = SPR.playerW[sprDir] || 24;
    const sh = SPR.playerH[sprDir] || 24;
    const rh = 18;
    const rw = Math.round(sw * rh / sh);
    const ox = Math.round((16 - rw) / 2);
    const fi = p.animFrame % frames.length;
    cx2.drawImage(frames[fi], sx + ox, sy - 6, rw, rh);
  }
  p.animTimer = (p.animTimer || 0) + 1;
  const spd = p.moving ? 5 : 7;
  if (p.animTimer >= spd) {
    p.animTimer = 0;
    const flen = (frames && frames.length) ? frames.length : 1;
    p.animFrame = ((p.animFrame || 0) + 1) % flen;
  }
}

function drawMonster(cx2, m, camX, camY) {
  m.updateTween();
  const sx = (m.rx - camX + m.sox) | 0, sy = (m.ry - camY + m.soy) | 0;
  const sprs = SPR.monsters[m.type];
  if (!sprs) return;

  const isBoss = m.type === 'boss';

  if (m.aggro) {
    cx2.globalAlpha = .22 + .08 * Math.sin(G.frame * .15 + m.x);
    cx2.fillStyle = m.col;
    cx2.fillRect(sx + 2, sy + 2, 12, 12);
    cx2.globalAlpha = 1;
  }

  // Boss: pulsing purple aura behind sprite
  if (isBoss) {
    const pulse = 0.3 + 0.2 * Math.sin(G.frame * 0.08);
    const auraR = 18 + 4 * Math.sin(G.frame * 0.06);
    const ag = cx2.createRadialGradient(sx+8, sy+8, 2, sx+8, sy+8, auraR);
    ag.addColorStop(0, `rgba(160,0,255,${pulse})`);
    ag.addColorStop(1, 'rgba(80,0,160,0)');
    cx2.fillStyle = ag;
    cx2.fillRect(sx - auraR, sy - auraR, (auraR + 8) * 2, (auraR + 8) * 2);
    // Second ring — slower
    const pulse2 = 0.15 + 0.1 * Math.sin(G.frame * 0.04 + 1.5);
    const ag2 = cx2.createRadialGradient(sx+8, sy+8, 8, sx+8, sy+8, auraR * 1.6);
    ag2.addColorStop(0, 'rgba(0,0,0,0)');
    ag2.addColorStop(0.5, `rgba(120,0,200,${pulse2})`);
    ag2.addColorStop(1, 'rgba(0,0,0,0)');
    cx2.fillStyle = ag2;
    cx2.fillRect(sx - auraR*2, sy - auraR*2, (auraR*2 + 8) * 2, (auraR*2 + 8) * 2);
  }

  // Shadow
  cx2.globalAlpha = isBoss ? .45 : .28;
  cx2.fillStyle = '#000';
  cx2.beginPath();
  cx2.ellipse(sx + (isBoss?8:8), sy + (isBoss?22:14), isBoss?9:5, isBoss?3:2, 0, 0, Math.PI*2);
  cx2.fill();
  cx2.globalAlpha = 1;

  // Mise à jour animation : utilise tous les frames disponibles
  const animSpeed = isBoss ? 8 : 10;
  m.animTimer = (m.animTimer || 0) + 1;
  if (m.animTimer >= animSpeed) { 
    m.animTimer = 0; 
    m.animFrame = (m.animFrame || 0) + 1;
  }

  // Animation de mouvement : oscillation légère (respiration/bobbing)
  let offsetY = 0;
  if (m.moving) {
    // Bounce quand le monstre se déplace
    const bouncePhase = (m.animTimer / animSpeed) * Math.PI * 2;
    offsetY = Math.sin(bouncePhase) * 0.7;
  } else {
    // Respiration subtile quand immobile
    offsetY = Math.sin(G.frame * 0.08 + m.x * 0.5 + m.y * 0.3) * 0.4;
  }

  const fr = sprs[m.animFrame % sprs.length];
  if (fr) {
    cx2.imageSmoothingEnabled = false;
    if (isBoss) {
      cx2.drawImage(fr, sx - 6, sy - 14 + offsetY, 28, 28);
    } else {
      cx2.drawImage(fr, sx - 1, sy - 3 + offsetY, 18, 18);
    }
  }

  // Brûlure — overlay orange scintillant
  if (m.burnTicks > 0) {
    const flick = 0.25 + 0.2 * Math.sin(G.frame * 0.35 + m.x * 1.7);
    cx2.globalAlpha = flick;
    cx2.fillStyle = '#ff5500';
    cx2.fillRect(sx + 1, sy - 3 + (offsetY|0), 14, 16);
    cx2.globalAlpha = 1;
    // Flamme au-dessus
    cx2.fillStyle = G.frame % 4 < 2 ? '#ff8010' : '#ffcc20';
    cx2.fillRect(sx + 4, sy - 6 + (offsetY|0), 2, 3);
    cx2.fillRect(sx + 8, sy - 7 + (offsetY|0), 2, 4);
    cx2.fillRect(sx + 12, sy - 5 + (offsetY|0), 2, 3);
  }

  // Health bar — bigger for boss
  if (m.hp < m.maxHp) {
    const bw = isBoss ? 30 : 14;
    const bh = isBoss ? 3 : 2;
    const bx = isBoss ? sx - 7 : sx + 1;
    const by = isBoss ? sy - 15 + offsetY : sy - 3 + offsetY;
    cx2.fillStyle = '#200808'; cx2.fillRect(bx, by, bw, bh);
    const r = m.hp / m.maxHp;
    cx2.fillStyle = isBoss
      ? (r > .5 ? '#a000ff' : r > .25 ? '#ff8000' : '#ff2020')
      : (r > .5 ? '#30b030' : r > .25 ? '#b0b020' : '#b02020');
    cx2.fillRect(bx, by, bw * r | 0, bh);
    // Boss name above bar
    if (isBoss) {
      cx2.fillStyle = '#e0a0ff';
      cx2.font = 'bold 5px monospace';
      cx2.textAlign = 'center';
      cx2.fillText('BOSS', sx + 8, by - 2);
      cx2.textAlign = 'left';
    }
  }
}

function drawMerchant(cx2, m, camX, camY) {
  const sx = (m.rx - camX) | 0, sy = (m.ry - camY) | 0;
  
  // Shadow
  cx2.globalAlpha = .3;
  cx2.fillStyle = '#000';
  cx2.beginPath();
  cx2.ellipse(sx + 8, sy + 14, 6, 2, 0, 0, Math.PI*2);
  cx2.fill();
  cx2.globalAlpha = 1;
  
  const y = sy; // pas de bob, marchand immobile
  
  // === MARCHAND / FORGERON - couleurs plus sobres ===
  
  // Robe/tunic (main body) - dark blue instead of flashy purple
  cx2.fillStyle = '#404050'; // darker, more muted
  cx2.fillRect(sx + 3, y + 6, 10, 8);
  
  // Robe trim (subtle gold border)
  cx2.fillStyle = '#8b7355'; // muted brown-gold
  cx2.fillRect(sx + 2, y + 5, 12, 1);
  cx2.fillRect(sx + 2, y + 13, 12, 1);
  
  // Ceinture (belt) - brown leather
  cx2.fillStyle = '#5a4a3a';
  cx2.fillRect(sx + 3, y + 9, 10, 1);
  
  // Buckle - subtle
  cx2.fillStyle = '#a89060';
  cx2.fillRect(sx + 7, y + 8, 2, 3);
  
  // Arms/Sleeves - darker
  cx2.fillStyle = '#353540';
  cx2.fillRect(sx + 1, y + 7, 2, 4); // left arm
  cx2.fillRect(sx + 13, y + 7, 2, 4); // right arm
  
  // Hands (skin tone)
  cx2.fillStyle = '#c9a890';
  cx2.fillRect(sx + 1, y + 11, 2, 1);
  cx2.fillRect(sx + 13, y + 11, 2, 1);
  
  // Head
  cx2.fillStyle = '#c9a890'; // skin
  cx2.fillRect(sx + 4, y + 1, 8, 5);
  
  // Hair/Hat - dark brown (less flashy than red)
  cx2.fillStyle = '#4a3a2a';
  cx2.fillRect(sx + 3, y, 10, 2);
  
  // Hat detail - subtle tan accent
  cx2.fillStyle = '#8b7355';
  cx2.fillRect(sx + 13, y - 1, 1, 3);
  
  // Face details
  // Eyes
  cx2.fillStyle = '#2a2a2a';
  cx2.fillRect(sx + 5, y + 2, 1, 1);
  cx2.fillRect(sx + 10, y + 2, 1, 1);
  
  // Eyes highlight (subtle)
  cx2.fillStyle = '#ddd';
  cx2.fillRect(sx + 5, y + 1, 1, 1);
  cx2.fillRect(sx + 10, y + 1, 1, 1);
  
  // Nose
  cx2.fillStyle = '#b8986a';
  cx2.fillRect(sx + 7, y + 3, 2, 1);
  
  // Beard
  cx2.fillStyle = '#6a5a4a';
  cx2.fillRect(sx + 5, y + 4, 6, 1);
  
  // Mouth (subtle)
  cx2.fillStyle = '#7a6a5a';
  cx2.fillRect(sx + 7, y + 5, 2, 1);
  
  // === Holding simple pouch (not flashy coin) ===
  cx2.fillStyle = '#8b7355';
  cx2.fillRect(sx + 1, y + 10, 2, 3);
}

// ══ MINIMAP ════════════════════════════════
function renderMM(state) {
  // Vérification de sécurité : si le canvas n'existe pas, ne rien faire
  if (!mmCv || !mmCtx) return;
  
  const { map, MAP_W, MAP_H, player, monsters, explored, visible, merchant } = state;
  const tw = 120 / MAP_W, th = 120 / MAP_H;

  // Fond
  mmCtx.fillStyle = '#06040e'; mmCtx.fillRect(0, 0, 120, 120);

  // Tuiles — distinguer visible vs exploré
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (!explored[y][x]) continue;
      const t = map[y][x]; if (t === T.EMPTY) continue;
      const isVis = visible[y][x];
      let col;
      switch(t) {
        case T.WALL:    col = isVis ? '#2a2248' : '#14102a'; break;
        case T.FLOOR:   col = isVis ? '#483e6a' : '#252038'; break;
        case T.STAIRS:  col = isVis ? '#f0c840' : '#806820'; break;
        case T.CHEST:     col = state.openedChests?.has(`${x},${y}`) ? '#5a4820' : (isVis ? '#e8c030' : '#604810'); break;
        case T.BOSS_CHEST:col = state.openedChests?.has(`${x},${y}`) ? '#5a3010' : (isVis ? '#ffaa00' : '#804800'); break;
        case T.TRAP:    col = isVis ? '#cc2020' : '#500808'; break;
        case T.WATER:   col = isVis ? '#2040a0' : '#101840'; break;
        default:        col = isVis ? '#403858' : '#1e1830';
      }
      mmCtx.fillStyle = col;
      mmCtx.fillRect(x*tw|0, y*th|0, Math.ceil(tw)+1, Math.ceil(th)+1);
    }
  }

  // Monstres — rouge si exploré, rouge vif si visible
  monsters.filter(m => m.alive && explored[m.y]?.[m.x]).forEach(m => {
    const isVis = visible[m.y]?.[m.x];
    if (m.type === 'boss') {
      // Boss : carré violet pulsant
      mmCtx.fillStyle = isVis ? '#dd00ff' : '#660088';
      const bx = (m.x*tw|0)-1, by = (m.y*th|0)-1;
      mmCtx.fillRect(bx, by, Math.ceil(tw)+2, Math.ceil(th)+2);
      // Halo
      mmCtx.globalAlpha = 0.3;
      mmCtx.fillStyle = '#c000ff';
      mmCtx.fillRect(bx-1, by-1, Math.ceil(tw)+4, Math.ceil(th)+4);
      mmCtx.globalAlpha = 1;
    } else {
      mmCtx.fillStyle = isVis ? '#ff3030' : '#991010';
      mmCtx.fillRect(m.x*tw|0, m.y*th|0, Math.ceil(tw), Math.ceil(th));
    }
  });

  // Marchand — jaune distinctif
  if (merchant && merchant.alive && explored[merchant.y]?.[merchant.x]) {
    mmCtx.fillStyle = '#f0c040';
    const mx2 = (merchant.x*tw|0)-1, my2 = (merchant.y*th|0)-1;
    mmCtx.fillRect(mx2, my2, Math.ceil(tw)+2, Math.ceil(th)+2);
  }

  // Joueur — point blanc avec halo doré
  const px2 = (player.x*tw)|0, py2 = (player.y*th)|0;
  mmCtx.globalAlpha = 0.35;
  mmCtx.fillStyle = '#f0d080';
  mmCtx.fillRect(px2-2, py2-2, Math.ceil(tw)+4, Math.ceil(th)+4);
  mmCtx.globalAlpha = 1;
  mmCtx.fillStyle = '#ffffff';
  mmCtx.fillRect(px2-1, py2-1, Math.ceil(tw)+2, Math.ceil(th)+2);

  // Rectangle du viewport actuel
  const vx1 = ((cam.x / TS) * tw) | 0;
  const vy1 = ((cam.y / TS) * th) | 0;
  const vw2 = ((VW / TS) * tw) | 0;
  const vh2 = ((VH / TS) * th) | 0;
  mmCtx.strokeStyle = 'rgba(201,168,76,0.2)';
  mmCtx.lineWidth = 1;
  mmCtx.strokeRect(vx1, vy1, vw2, vh2);

  // Bordure
  mmCtx.strokeStyle = 'rgba(201,168,76,.3)'; mmCtx.lineWidth = 1; mmCtx.strokeRect(0, 0, 120, 120);
}

// ══ HUD ════════════════════════════════════
const FLOOR_NUMERALS = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI','XXII','XXIII','XXIV','XXV','XXVI','XXVII','XXVIII','XXIX','XXX','XXXI','XXXII','XXXIII','XXXIV','XXXV','XXXVI','XXXVII','XXXVIII','XXXIX','XL','XLI','XLII','XLIII','XLIV','XLV','XLVI','XLVII','XLVIII','XLIX','L'];

// Fonction pour convertir n'importe quel nombre en chiffres romains
function numToRoman(num) {
  if (num <= 0) return 'N/A';
  if (num < FLOOR_NUMERALS.length) return FLOOR_NUMERALS[num - 1];
  
  // Pour les nombres > 50, utiliser la notation avec barre (vinculum)
  // ou générer dynamiquement
  const romanValues = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' }
  ];
  
  let result = '';
  for (let i = 0; i < romanValues.length; i++) {
    while (num >= romanValues[i].value) {
      result += romanValues[i].numeral;
      num -= romanValues[i].value;
    }
  }
  return result;
}
function updateHUD(p, floor) {
  document.getElementById('hp-fill').style.width  = (p.hp/p.maxHp*100)+'%';
  document.getElementById('mp-fill').style.width  = (p.mp/p.maxMp*100)+'%';
  const _staPct = p.stamina / p.maxStamina * 100;
  const _staEl = document.getElementById('sta-fill');
  if (_staEl) {
    _staEl.style.width = _staPct + '%';
    _staEl.classList.toggle('low',   _staPct < 30);
    _staEl.classList.toggle('empty', _staPct < 5);
  }
  const _staVal = document.getElementById('sta-val');
  if (_staVal) _staVal.textContent = Math.round(_staPct) + '%';
  document.getElementById('xp-fill').style.width  = (p.xp/p.xpNext*100)+'%';
  document.getElementById('hp-val').textContent   = `${p.hp}/${p.maxHp}`;
  document.getElementById('mp-val').textContent   = `${p.mp}/${p.maxMp}`;
  document.getElementById('xp-val').textContent   = `${Math.floor(p.xp/p.xpNext*100)}%`;
  document.getElementById('level-badge').textContent = `Niveau ${p.level}`;
  document.getElementById('floor-num').textContent = numToRoman(floor);
  // Potions
  document.getElementById('hud-hp-potion').textContent = `${p.potions?.hp || 0}/3`;
  document.getElementById('hud-mana-potion').textContent = `${p.potions?.mana || 0}/3`;
  // Buff icons
  const br = document.getElementById('buffs-row');
  br.innerHTML = p.buffs.map(b=>`<span class="buff-icon" title="${b.name||''}">${b.icon}</span>`).join('');
  // Stats
  document.getElementById('stat-nums').innerHTML =
    `⚔ ATK <span class="val">${p.atk}</span><br>` +
    `🛡 DEF <span class="val">${p.def}</span><br>` +
    `💛 Or&nbsp; <span class="val">${p.gold}</span>`;
  // Portrait
  const pc = document.getElementById('portrait-cv');
  if (pc) {
    const px2 = pc.getContext('2d');
    px2.imageSmoothingEnabled = false;
    if (SPR.portrait) px2.drawImage(SPR.portrait, 0, 0, 54, 54);
  }
}

// ══ LOG / FX ═══════════════════════════════
function log(text, col='#c9a84c') {
  const el = document.createElement('div'); el.className='msg'; el.style.color=col; el.textContent=text;
  const l = document.getElementById('msg-log'); l.prepend(el);
  while (l.children.length > 7) l.lastChild.remove();
  setTimeout(()=>el.remove(), 5000);
}
function flash(col) { const f=document.getElementById('flash'); f.style.background=col; f.style.opacity='1'; setTimeout(()=>f.style.opacity='0',120); }
function floatDmg(gx, gy, text, col) {
  const rect = cv.getBoundingClientRect();
  const ox = (cv.width  - VW * SCALE) / 2;
  const oy = (cv.height - VH * SCALE) / 2;
  const sx = rect.left + ox + (gx * TS - cam.x + TS / 2) * SCALE;
  const sy = rect.top  + oy + (gy * TS - cam.y - 4) * SCALE;
  const el = document.createElement('div'); el.className = 'fdmg';
  el.style.cssText = `left:${sx}px;top:${sy}px;color:${col};`;
  el.textContent = text; document.body.appendChild(el); setTimeout(() => el.remove(), 1400);
}

// ══ CURSOR ═════════════════════════════════
document.addEventListener('mousemove', e => {
  const cur = document.getElementById('cur');
  cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px';
});

// ══ MORT DE MONSTRE (mutualisé) ═════════════
// Centralise ce qui se passe à la mort d'un monstre, quelle que soit la source
// des dégâts (mêlée, sort, épines, brûlure...). Avant ce correctif, seule
// l'attaque de mêlée déclenchait la logique spéciale du boss (coffre, son,
// achievement) — les autres sources de mort le tuaient "silencieusement".
function handleMonsterDeath(state, player, mon) {
  if (!mon.alive) return; // déjà traité (évite un double-kill le même tick)
  mon.alive = false;
  if (mon.type === 'boss') {
    SFX.bossDie();
    state.particles.spawn(mon.x, mon.y, '#c000ff', 60, 'death');
    state.particles.spawn(mon.x, mon.y, '#ffffff', 30, 'death');
    state.particles.spawn(mon.x, mon.y, '#ffcc00', 40, 'gold');
    flash('rgba(160,0,255,.7)');
    const xpGain = player.gainXp(mon.xpR);
    log(`☠ LE SEIGNEUR EST VAINCU !`, '#ff80ff');
    log(`+${mon.xpR} XP !!!`, '#c000ff');
    if (xpGain) { log(`★ Niveau ${player.level}!`,'#f0d080'); SFX.levelUp(); }
    Achievements.bump('bossKills');
    Achievements.set('maxLevel', player.level);
    const {map} = state;
    if (map[mon.y] && map[mon.y][mon.x] !== undefined) {
      map[mon.y][mon.x] = T.BOSS_CHEST;
      log(`✦ Un coffre légendaire est apparu !`, '#f0d080');
      const vis2 = computeFOVProxy(map, player.x, player.y, state.MAP_W, state.MAP_H, 9);
      state.visible = vis2;
      for (let y=0;y<state.MAP_H;y++) for (let x=0;x<state.MAP_W;x++) if (vis2[y][x]) state.explored[y][x]=1;
    }
  } else {
    SFX.monsterDie();
    state.particles.spawn(mon.x,mon.y,mon.col,22,'death');
    const lv = player.gainXp(mon.xpR);
    log(`${mon.name} vaincu! +${mon.xpR} XP`,'#80e080');
    if (lv) { log(`★ Niveau ${player.level}!`,'#f0d080'); flash('rgba(201,168,76,.4)'); SFX.levelUp(); }
    Achievements.bump('totalKills');
    Achievements.set('maxLevel', player.level);
    Achievements.set('maxGold', player.gold);
  }
}

// ══ AI ═════════════════════════════════════
function tickMonsters(state) {
  const p = state.player;
  state.monsters.forEach(m => {
    if (!m.alive) return;
    m.update();
    
    // ── GÉRER WARNING AVANT ATTAQUE ──
    if (m.attackWarningTimer > 0) {
      m.attackWarningTimer--;
      if (m.attackWarningTimer === 0) {
        // ATTAQUE après le warning
        const dmg = Math.max(0, m.atk - p.def + Math.floor(Math.random() * 3));
        p.hp = Math.max(0, p.hp - dmg); p.shake();
        state.particles.spawn(p.x, p.y, '#e04040', 6, 'hit');
        if (dmg > 0) { log(`${m.name} frappe: -${dmg} PV`, '#ff6060'); flash('rgba(160,0,0,.35)'); }
        if (p.hp <= 0) { G._die(p); }
      }
      return; // Ne rien faire d'autre pendant le warning
    }
    
    m.moveTimer--;
    if (m.moveTimer > 0) return;
    m.moveTimer = m.aggro ? (m.speed || 1) : ((m.speed || 1) + 14);
    const dx = p.x - m.x, dy = p.y - m.y;
    const dist = Math.abs(dx) + Math.abs(dy);
    if (dist <= 10 && state.visible[m.y]?.[m.x]) {
      if (!m.aggro && m.type === 'boss') {
        SFX.bossRoar();
        log('☠ Le Seigneur des Cryptes se réveille…', '#c000ff');
        flash('rgba(160,0,255,.4)');
      }
      m.aggro = true;
    }
    // Boss minion summoning
    if (m.type === 'boss' && m.aggro) {
      m.summonTimer = (m.summonTimer || 0) + 1;
      if (m.summonTimer >= (m.summonInterval || 18)) {
        m.summonTimer = 0;
        // Summon 2 minions near boss — pick random floor tiles adjacent
        const minionTypes = ['skeleton','goblin','demon','spider'];
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
    if (dist > 16) m.aggro = false;

    // ── DoT : brûlure ──
    if (m.burnTicks > 0) {
      m.burnTickTimer = (m.burnTickTimer || 0) + 1;
      if (m.burnTickTimer >= 3) { // tick tous les 3 tours monstre
        m.burnTickTimer = 0;
        const bdmg = m.burnDmg || 2;
        m.hp -= bdmg;
        m.burnTicks--;
        floatDmg(m.x, m.y, `🔥${bdmg}`, '#ff6010');
        state.particles.spawn(m.x, m.y, '#ff4008', 4, 'fire');
        Achievements.bump('burnDamage', bdmg);
        if (m.hp <= 0) {
          state.particles.spawn(m.x, m.y, '#ff5000', 14, 'fire');
          handleMonsterDeath(state, p, m);
        }
      }
    }

    if (!m.alive) return; // peut être mort par DoT juste au-dessus
    if (!m.aggro) return;
    if (dist <= 1 || (Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && dist > 0)) {
      // Initier le warning avant l'attaque
      m.attackWarningTimer = 2;
      return;
    } else {
      const sx2 = Math.sign(dx), sy2 = Math.sign(dy);
      const occupied = (nx, ny) => state.monsters.some(o => o.alive && o !== m && o.x === nx && o.y === ny);
      const passable = (nx, ny) => {
        const t = state.map[ny]?.[nx] || 0;
        return t >= T.FLOOR && t !== T.WALL && t !== T.WALL_TOP && !occupied(nx, ny) && !(p.x===nx && p.y===ny);
      };
      const moves = [[sx2, sy2], [sx2, 0], [0, sy2]];
      for (const [mx2, my2] of moves) {
        if (mx2 === 0 && my2 === 0) continue;
        const nx = m.x + mx2, ny = m.y + my2;
        if (passable(nx, ny)) { m.startMove(nx, ny); break; }
      }
    }
  });
}

// ══ SPAWN ══════════════════════════════════
function spawnMonsters(rooms, floor) {
  const types=['skeleton','goblin','spider','ghost','demon','ogre'];
  const avail = types.slice(0, Math.min(types.length, 2 + Math.floor(floor * .8)));
  const monsPerRoom = 1 + Math.floor(floor / 2);
  const hpMult  = 1 + (floor - 1) * 0.35;
  const atkMult = 1 + (floor - 1) * 0.25;

  const result = [];
  const occupied = new Set(); // clé "x,y" pour éviter tout doublon

  rooms.slice(1).forEach(r => {
    const n = monsPerRoom + Math.floor(Math.random() * 2);
    let placed = 0, attempts = 0;
    while (placed < n && attempts < n * 8) {
      attempts++;
      const mx2 = r.x + 1 + (Math.random() * (r.w - 2) | 0);
      const my2 = r.y + 1 + (Math.random() * (r.h - 2) | 0);
      const key = `${mx2},${my2}`;
      if (occupied.has(key)) continue;
      occupied.add(key);
      const typePool = floor >= 4 ? avail.slice(-3) : avail;
      const tp = typePool[Math.floor(Math.random() * typePool.length)];
      const m = new Monster(mx2, my2, tp);
      m.maxHp = Math.ceil(m.maxHp * hpMult);
      m.hp    = m.maxHp;
      m.atk   = Math.ceil(m.atk * atkMult);
      m.xpR   = Math.floor(m.xpR * hpMult);
      result.push(m);
      placed++;
    }
  });

  return result;
}

// Spawn the boss in the largest room (not spawn room)
// ══ BOSS ARENA ══════════════════════════════
// Generates a single large rectangular arena for boss floors
// Returns same shape as genMap: {map, rooms, start, MAP_W, MAP_H, torches, torchSet}
function genBossArena(seed, floor) {
  const W = 38, H = 34;
  const map = Array.from({length: H}, () => new Uint8Array(W));

  // Fill everything as wall first
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      map[y][x] = T.WALL;

  // Main arena room — large central rectangle
  const arenaX = 3, arenaY = 3, arenaW = W - 6, arenaH = H - 8;
  for (let y = arenaY; y < arenaY + arenaH; y++)
    for (let x = arenaX; x < arenaX + arenaW; x++)
      map[y][x] = T.FLOOR;

  // Decorative pillars in corners
  const pillars = [
    [arenaX+2, arenaY+2], [arenaX+arenaW-3, arenaY+2],
    [arenaX+2, arenaY+arenaH-3], [arenaX+arenaW-3, arenaY+arenaH-3],
  ];
  pillars.forEach(([px2, py2]) => {
    map[py2][px2] = T.WALL;
    map[py2][px2+1] = T.WALL;
    map[py2+1][px2] = T.WALL;
    map[py2+1][px2+1] = T.WALL;
  });

  // Entry corridor from south (player starts here)
  const entryX = Math.floor(W / 2);
  for (let y = arenaY + arenaH; y < H - 1; y++)
    map[y][entryX] = T.FLOOR;
  for (let x = entryX - 1; x <= entryX + 1; x++)
    map[H - 2][x] = T.FLOOR;

  // Stairs at north wall center
  const stairsX = Math.floor(W / 2), stairsY = arenaY + 1;
  map[stairsY][stairsX] = T.STAIRS;

  // Wall top tiles for ceiling
  for (let x = 0; x < W; x++) map[0][x] = T.WALL_TOP || T.WALL;
  for (let x = 0; x < W; x++) map[1][x] = T.WALL_TOP || T.WALL;

  // Torches on walls around the arena
  const torches = [];
  const torchSet = new Set();
  const addTorch = (x, y) => {
    if (map[y][x] === T.WALL) {
      torches.push({x, y});
      torchSet.add(`${x},${y}`);
    }
  };
  for (let x = arenaX; x < arenaX + arenaW; x += 5) {
    addTorch(x, arenaY - 1 < 0 ? 0 : arenaY);
  }
  for (let y = arenaY; y < arenaY + arenaH; y += 5) {
    addTorch(arenaX - 1 < 0 ? 0 : arenaX - 1, y);
    addTorch(arenaX + arenaW, y);
  }

  const start = { cx: entryX, cy: H - 3 };
  const rooms = [
    { x: entryX - 1, y: H - 3, w: 3, h: 1 },    // spawn "room"
    { x: arenaX, y: arenaY, w: arenaW, h: arenaH }, // arena
  ];

  return { map, rooms, start, MAP_W: W, MAP_H: H, torches, torchSet };
}

function spawnBoss(rooms, floor) {
  // Boss goes in the arena center (rooms[1])
  const arena = rooms[1] || rooms[0];
  const bx = arena.x + (arena.w / 2 | 0);
  const by = arena.y + (arena.h / 2 | 0);
  const boss = new Monster(bx, by, 'boss');
  const scale = 1 + (floor - 5) * 0.3;
  boss.maxHp = Math.ceil(boss.maxHp * scale);
  boss.hp    = boss.maxHp;
  boss.atk   = Math.ceil(boss.atk * scale);
  boss.xpR   = boss.maxHp * 3;
  boss.aggro = false;
  boss.moveTimer = 12;
  // Summoning: boss will call minions every N turns — tracked via summonTimer
  boss.summonTimer = 0;
  boss.summonInterval = 18; // every 18 AI ticks
  boss.summonFloor = floor;
  return boss;
}
const POTIONS_DATA = [
  { id:'hp',   name:'Potion de vie',  icon:'🧪', restore:20, cost:25, maxStock:3 },
  { id:'mana', name:'Potion de mana', icon:'💙', restore:15, cost:20, maxStock:3 },
];

const ALL_UPGRADES = [
  // Common
  { id:'hp_up',    cost:25,  rarity:'common',    icon:'❤️',  name:'Vigueur',          desc:'Points de vie maximum',    value:'+15 PV max',
    apply: p => { p.maxHp+=15; p.hp=Math.min(p.hp+15,p.maxHp); } },
  { id:'atk_up',   cost:30,  rarity:'common',    icon:'⚔️',  name:'Force brute',      desc:'Puissance d\'attaque',      value:'+3 ATK',
    apply: p => { p.atk+=3; } },
  { id:'def_up',   cost:30,  rarity:'common',    icon:'🛡️',  name:'Endurance',        desc:'Résistance aux dégâts',     value:'+2 DEF',
    apply: p => { p.def+=2; } },
  { id:'mp_up',    cost:25,  rarity:'common',    icon:'💧',  name:'Réservoir arcane', desc:'Mana maximum',              value:'+8 MP max',
    apply: p => { p.maxMp+=8; p.mp=Math.min(p.mp+8,p.maxMp); } },
  { id:'heal',     cost:20,  rarity:'common',    icon:'🌿',  name:'Régénération',     desc:'Restauration immédiate',    value:'+20 PV',
    apply: p => { p.hp=Math.min(p.maxHp,p.hp+20); } },
  { id:'gold_gain',cost:35,  rarity:'common',    icon:'💰',  name:'Pillard',          desc:'Or trouvé dans les coffres',value:'+50%',
    apply: p => { p.goldMult=(p.goldMult||1)*1.5; } },
  { id:'swift',    cost:40,  rarity:'common',    icon:'💨',  name:'Légèreté',         desc:'Vitesse de déplacement',    value:'Déplacement +33%',
    apply: p => { p.tweenD=Math.max(4,p.tweenD-2); } },
  // Rare
  { id:'vampiric', cost:80,  rarity:'rare',      icon:'🩸',  name:'Vampirisme',       desc:'Vole de la vie à chaque coup', value:'5% de drain',
    apply: p => { p.vampiric+=0.05; p.buffs.push({icon:'🩸'}); } },
  { id:'thorns',   cost:75,  rarity:'rare',      icon:'🌹',  name:'Épines',           desc:'Renvoie les dégâts reçus',  value:'25% renvoyé',
    apply: p => { p.thorns+=0.25; p.buffs.push({icon:'🌹'}); } },
  { id:'crit',     cost:90,  rarity:'rare',      icon:'💥',  name:'Critique',         desc:'Chance de coup fatal',      value:'15% de critique (×2)',
    apply: p => { p.critChance+=0.15; p.buffs.push({icon:'💥'}); } },
  { id:'spell_dmg',cost:80,  rarity:'rare',      icon:'⚡',  name:'Surcharge',        desc:'Dégâts du sort de foudre',  value:'+8 DMG sort',
    apply: p => { p.spellDmg+=8; p.buffs.push({icon:'⚡'}); } },
  { id:'spell_rng',cost:75,  rarity:'rare',      icon:'🌀',  name:'Portée arcane',    desc:'Rayon du sort de foudre',   value:'+2 cases',
    apply: p => { p.spellRange+=2; p.buffs.push({icon:'🌀'}); } },
  { id:'mp_regen', cost:85,  rarity:'rare',      icon:'🔮',  name:'Méditation',       desc:'Regagne du mana en marchant',value:'+1 MP / 5 pas',
    apply: p => { p.mpRegen=(p.mpRegen||0)+1; p.buffs.push({icon:'🔮'}); } },
  { id:'dodge',    cost:100,  rarity:'rare',      icon:'🌫️',  name:'Esquive',          desc:'Chance d\'éviter une attaque',value:'12% d\'esquive',
    apply: p => { p.dodgeChance+=0.12; p.buffs.push({icon:'🌫️'}); } },
  // Legendary
  { id:'berserker',cost:160,  rarity:'legendary', icon:'🔥',  name:'Berserker',        desc:'ATK augmente quand vous perdez des PV', value:'+1 ATK / 10% PV perdus',
    apply: p => { p.berserker=true; p.buffs.push({icon:'🔥'}); } },
  { id:'lich',     cost:180,  rarity:'legendary', icon:'💀',  name:'Phylactère',       desc:'Ressuscite une fois avec 50% PV', value:'1 vie extra',
    apply: p => { p.lich=true; p.buffs.push({icon:'💀'}); } },
  { id:'archmage', cost:220,  rarity:'legendary', icon:'🌟',  name:'Archimage',        desc:'Sort gratuit + double dégâts', value:'Sort: MP×0 / DMG×2',
    apply: p => { p.spellMpCost=0; p.spellDmg*=2; p.buffs.push({icon:'🌟'}); } },
  { id:'iron_skin',cost:175,  rarity:'legendary', icon:'⚙️',  name:'Peau de fer',      desc:'DEF massive + régén PV/tour', value:'+5 DEF, +2 PV/tour',
    apply: p => { p.def+=5; p.hpRegen=(p.hpRegen||0)+2; p.buffs.push({icon:'⚙️'}); } },
  // Stamina / Dash
  { id:'sta_up',   cost:30,   rarity:'common',    icon:'💨',  name:'Souffle long',     desc:'Endurance maximale',          value:'+30 Endurance max',
    apply: p => { p.maxStamina+=30; p.stamina=Math.min(p.stamina+30,p.maxStamina); } },
  { id:'sta_regen',cost:85,   rarity:'rare',      icon:'🌬️', name:'Second souffle',   desc:'Régénération d\'endurance accélérée', value:'Regen Endurance ×2',
    apply: p => { p.staminaRegen*=2; p.buffs.push({icon:'🌬️'}); } },
  { id:'dash_inv', cost:180,  rarity:'legendary', icon:'👻',  name:'Fantôme',          desc:'Le dash traverse les ennemis sans dégâts', value:'Dash invincible',
    apply: p => { p.dashInvincible=true; p.dashCost=Math.max(10,p.dashCost-10); p.buffs.push({icon:'👻'}); } },
];

// ══ SHOP DATA ══════════════════════════════
const WEAPONS_SHOP = [
  { id:'sword',       name:'Épée courte',       icon:'⚔️',  atkBonus:0,   cost:0,    levelReq:0, special:null,    sVal:0,    desc:'Arme de départ polyvalente', starter:true },
  { id:'dagger',      name:'Dague',              icon:'🗡️', atkBonus:-2,  cost:120,  levelReq:2, special:'crit',   sVal:0.10, desc:'+10% coup critique' },
  { id:'axe',         name:'Hache de guerre',    icon:'🪓',  atkBonus:4,   cost:150,  levelReq:3, special:null,    sVal:0,    desc:'+4 ATK, frappe lourde' },
  { id:'longsword',   name:'Épée longue',        icon:'🗡️', atkBonus:3,   cost:160,  levelReq:3, special:'sweep',  sVal:0,    desc:'Frappe 2 ennemis adjacents' },
  { id:'warhammer',   name:'Marteau de guerre',  icon:'🔨',  atkBonus:8,   cost:200,  levelReq:4, special:null,    sVal:0,    desc:'+8 ATK, impact dévastateur' },
  { id:'staff',       name:'Bâton arcanique',    icon:'🪄',  atkBonus:-2,  cost:180,  levelReq:3, special:'spell',  sVal:15,   desc:'+15 dégâts de sort' },
  { id:'bow',         name:'Arc elfique',         icon:'🏹', atkBonus:2,   cost:170,  levelReq:3, special:'range',  sVal:2,    desc:'+2 portée de sort' },
  { id:'vampblade',   name:'Lame du Vampyr',      icon:'🩸', atkBonus:2,   cost:250,  levelReq:5, special:'vamp',   sVal:0.08, desc:'+8% drain de vie' },
  { id:'flameblade',  name:'Lame de feu',         icon:'🔥', atkBonus:6,   cost:310,  levelReq:6, special:'burn',   sVal:4,    desc:'+4 dégâts de feu par frappe' },
  { id:'shadowblade', name:'Lame des ombres',     icon:'🌑', atkBonus:5,   cost:270,  levelReq:5, special:'dodge',  sVal:0.08, desc:'+8% esquive' },
];

const ARMOR_DATA = [
  { id:'helmet',     name:'Casque',     icon:'⛑️',  baseCost:80,  incr:60,  maxLv:5, levelReq:2,
    desc: (lv) => lv===0 ? 'Non amélioré' : `+${lv} DEF${lv>=3?', +6% esquive':''}` },
  { id:'chestplate', name:'Plastron',   icon:'🛡️',  baseCost:120, incr:90,  maxLv:5, levelReq:2,
    desc: (lv) => lv===0 ? 'Non amélioré' : `+${lv*2} DEF, +${lv*8} PV max` },
  { id:'leggings',   name:'Jambières',  icon:'🦿',  baseCost:100, incr:75,  maxLv:5, levelReq:3,
    desc: (lv) => lv===0 ? 'Non amélioré' : `+${lv} DEF${lv>=2?', +critique':''}` },
  { id:'boots',      name:'Bottes',     icon:'👢',  baseCost:90,  incr:70,  maxLv:5, levelReq:2,
    desc: (lv) => lv===0 ? 'Non amélioré' : `+${lv} DEF, +${lv*4}% esquive` },
];

function getArmorUpgradeCost(slotId, currentLevel) {
  const a = ARMOR_DATA.find(s => s.id === slotId);
  if (!a || currentLevel >= a.maxLv) return null;
  return a.baseCost + currentLevel * a.incr;
}

function getWeaponUpgradeCost(level) {
  if (level >= 5) return null;
  return 50 + level * 40;
}

function applyArmorUpgrade(player, slotId) {
  const lv = player.armorLevels[slotId] + 1;
  player.armorLevels[slotId] = lv;
  switch(slotId) {
    case 'helmet':
      player.def += 1;
      if (lv === 3) player.dodgeChance += 0.06;
      break;
    case 'chestplate':
      player.def += 2; player.maxHp += 8;
      player.hp = Math.min(player.hp + 8, player.maxHp);
      break;
    case 'leggings':
      player.def += 1;
      if (lv === 2 || lv === 4) player.critChance += 0.05;
      break;
    case 'boots':
      player.def += 1; player.dodgeChance += 0.04;
      if (lv === 3) player.tweenD = Math.max(4, player.tweenD - 1);
      break;
  }
}

function applyWeaponSpecial(player, w) {
  const tag = w.id;
  switch(w.special) {
    case 'crit':  player.critChance   += w.sVal; player.buffs.push({icon:'💥', _weaponTag:tag}); break;
    case 'spell': player.spellDmg    += w.sVal; player.buffs.push({icon:'⚡', _weaponTag:tag}); break;
    case 'range': player.spellRange  += w.sVal; player.buffs.push({icon:'🌀', _weaponTag:tag}); break;
    case 'vamp':  player.vampiric    += w.sVal; player.buffs.push({icon:'🩸', _weaponTag:tag}); break;
    case 'dodge': player.dodgeChance += w.sVal; player.buffs.push({icon:'🌫️', _weaponTag:tag}); break;
    case 'sweep': player._weaponSweep = true;   player.buffs.push({icon:'↔️', _weaponTag:tag}); break;
    case 'burn':  player._weaponBurn  = w.sVal; player.buffs.push({icon:'🔥', _weaponTag:tag}); break;
  }
}

function removeWeaponSpecial(player, w) {
  switch(w.special) {
    case 'crit':  player.critChance   -= w.sVal; break;
    case 'spell': player.spellDmg    -= w.sVal; break;
    case 'range': player.spellRange  -= w.sVal; break;
    case 'vamp':  player.vampiric    -= w.sVal; break;
    case 'dodge': player.dodgeChance -= w.sVal; break;
    case 'sweep': player._weaponSweep = false;   break;
    case 'burn':  player._weaponBurn  = 0;       break;
  }
  player.buffs = player.buffs.filter(b => b._weaponTag !== w.id);
}

function buyWeapon(player, weaponId) {
  const newW = WEAPONS_SHOP.find(w => w.id === weaponId);
  if (!newW || player.equippedWeapon === weaponId) return false;
  if (player.level < (newW.levelReq || 0)) return false;
  if (!newW.starter && player.gold < newW.cost) return false;
  // Unequip old
  const oldW = WEAPONS_SHOP.find(w => w.id === player.equippedWeapon);
  if (oldW) {
    player.atk -= (player._weaponAtkApplied || 0);
    if (oldW.special) removeWeaponSpecial(player, oldW);
  }
  if (!newW.starter) player.gold -= newW.cost;
  player.weaponLevel = 0;
  player._weaponAtkApplied = newW.atkBonus;
  player.atk += newW.atkBonus;
  player.equippedWeapon = weaponId;
  player._weaponSweep = false;
  player._weaponBurn = 0;
  if (newW.special) applyWeaponSpecial(player, newW);
  return true;
}

// ── SHOP UI ────────────────────────────────
function showShopScreen(player, onDone) {
  G._shopCallback = onDone;
  renderShop(player);
  document.getElementById('shop-screen').classList.add('active');
}

function renderShop(player) {
  document.getElementById('shop-gold-val').textContent = player.gold;
  
  // Update potion stocks
  const hpStock = document.getElementById('hp-potion-stock');
  if (hpStock) hpStock.textContent = (player.potions?.hp || 0);
  const manaStock = document.getElementById('mana-potion-stock');
  if (manaStock) manaStock.textContent = (player.potions?.mana || 0);

  // Weapon equipped box
  const curW = WEAPONS_SHOP.find(w => w.id === player.equippedWeapon) || WEAPONS_SHOP[0];
  document.getElementById('weapon-eq-icon').textContent = curW.icon;
  document.getElementById('weapon-eq-name').textContent = curW.name;
  document.getElementById('weapon-eq-desc').textContent =
    `ATK bonus: ${player._weaponAtkApplied>=0?'+':''}${player._weaponAtkApplied||0}  |  ${curW.desc}`;
  // Weapon level pips
  const wStars = document.getElementById('weapon-eq-stars');
  wStars.innerHTML = '';
  for (let i=0;i<5;i++) {
    const pip = document.createElement('div');
    pip.className = 'armor-level-pip' + (i < player.weaponLevel ? ' filled' : '');
    wStars.appendChild(pip);
  }
  // Weapon upgrade button
  const wUpgCost = getWeaponUpgradeCost(player.weaponLevel);
  const wBtn = document.getElementById('weapon-upg-btn');
  if (!wUpgCost) {
    wBtn.textContent = 'MAX'; wBtn.disabled = true; wBtn.classList.add('maxed');
  } else {
    wBtn.innerHTML = `+2 ATK<br>💛${wUpgCost}`;
    wBtn.disabled = player.gold < wUpgCost;
    wBtn.classList.remove('maxed');
  }

  // Armor slots
  const armorContainer = document.getElementById('armor-slots');
  armorContainer.innerHTML = '';
  for (const slot of ARMOR_DATA) {
    const lv = player.armorLevels[slot.id];
    const meetsLevelReq = player.level >= (slot.levelReq || 0);
    const cost = getArmorUpgradeCost(slot.id, lv);
    const maxed = lv >= slot.maxLv;
    const canAfford = !maxed && cost !== null && player.gold >= cost;
    const canUpgrade = meetsLevelReq && canAfford;
    const div = document.createElement('div');
    div.className = 'armor-slot';
    // pips HTML — gold pip = permanent, amber = acquired this run
    let pips = '';
    const permLv = PermUpgrades.armorLevels[slot.id] || 0;
    for (let i=0;i<slot.maxLv;i++) {
      const isPerm = i < permLv;
      pips += `<div class="armor-level-pip${i<lv?' filled':''}${isPerm?' perm':''}" title="${isPerm?'Permanent':''}"></div>`;
    }
    div.innerHTML = `
      <div class="armor-slot-icon">${slot.icon}</div>
      <div class="armor-slot-info">
        <div class="armor-slot-name">${slot.name}</div>
        <div class="armor-level-bar">${pips}</div>
        <div class="armor-slot-desc">${slot.desc(lv)}</div>
        ${!meetsLevelReq ? `<div style="color:#ff6060;font-size:11px">⚠ Requiert niveau ${slot.levelReq}</div>` : ''}
      </div>
      <button class="armor-upg-btn${maxed?' maxed':''}" ${maxed||!canUpgrade?'disabled':''}
        onclick="shopUpgradeArmor('${slot.id}')">
        ${maxed ? 'MAX' : !meetsLevelReq ? 'Bloqué' : `Améliorer<br>💛${cost}`}
      </button>`;
    armorContainer.appendChild(div);
  }

  // Weapons grid
  const grid = document.getElementById('weapons-grid');
  grid.innerHTML = '';
  for (const w of WEAPONS_SHOP) {
    const isEquipped = player.equippedWeapon === w.id;
    const meetsLevelReq = player.level >= (w.levelReq || 0);
    const canAfford = w.starter || isEquipped || player.gold >= w.cost;
    const canBuy = meetsLevelReq && (w.starter || isEquipped || canAfford);
    const div = document.createElement('div');
    div.className = `weapon-card${isEquipped?' wep-equipped':''}${(!canBuy&&!isEquipped)?' cant-afford':''}`;
    div.innerHTML = `
      <span class="wep-icon">${w.icon}</span>
      <div class="wep-name">${w.name}</div>
      <div class="wep-atk">${w.atkBonus>0?'+':''}${w.atkBonus} ATK</div>
      <div class="wep-desc">${w.desc}</div>
      ${!meetsLevelReq 
        ? `<div class="wep-price" style="color:#ff6060">⚠ Niv. ${w.levelReq}</div>`
        : isEquipped
        ? `<div class="wep-equipped-badge">✓ Équipée</div>`
        : `<div class="wep-price">💛 ${w.starter?'Gratuite':w.cost+' or'}</div>`}`;
    if (!isEquipped && meetsLevelReq && (w.starter || canAfford)) div.onclick = () => shopBuyWeapon(w.id);
    grid.appendChild(div);
  }
}

function shopUpgradeArmor(slotId) {
  const player = G.state.player;
  const slot = ARMOR_DATA.find(s => s.id === slotId);
  if (!slot || player.level < (slot.levelReq || 0)) return;
  const cost = getArmorUpgradeCost(slotId, player.armorLevels[slotId]);
  if (cost === null || player.gold < cost) return;
  player.gold -= cost;
  applyArmorUpgrade(player, slotId);
  log(`✦ ${slot.name} amélioré(e) ! (-${cost} or)`, '#c9a84c');
  SFX.chest();
  // Track full armor achievement
  const maxed = Object.values(player.armorLevels).filter((v,i) => {
    const s = ARMOR_DATA[i]; return s && v >= s.maxLv;
  }).length;
  if (maxed >= 3) Achievements.set('maxArmorFull', 1);
  PermUpgrades.syncFrom(player);
  renderShop(player);
}

function shopUpgradeWeapon() {
  const player = G.state.player;
  const cost = getWeaponUpgradeCost(player.weaponLevel);
  if (cost === null || player.gold < cost) return;
  player.gold -= cost;
  player.weaponLevel++;
  player.atk += 2;
  player._weaponAtkApplied = (player._weaponAtkApplied || 0) + 2;
  const curW = WEAPONS_SHOP.find(w => w.id === player.equippedWeapon) || WEAPONS_SHOP[0];
  log(`✦ ${curW.name} +${player.weaponLevel} ! (-${cost} or)`, '#f0d060');
  SFX.chest();
  PermUpgrades.syncFrom(player);
  renderShop(player);
}

function shopBuyWeapon(weaponId) {
  const player = G.state.player;
  if (buyWeapon(player, weaponId)) {
    const w = WEAPONS_SHOP.find(w => w.id === weaponId);
    log(`✦ ${w.name} équipée !${w.cost?' (-'+w.cost+' or)':''}`, '#c9a84c');
    flash('rgba(201,168,76,.22)');
    SFX.chest();
    renderShop(player);
  }
}

function shopBuyPotion(type) {
  if (!G.state || !G.state.player) return;
  const player = G.state.player;
  const potionData = POTIONS_DATA.find(p => p.id === type);
  if (!potionData) return;
  if (player.gold < potionData.cost) { log('Pas assez d\'or !', '#ff6060'); return; }
  if ((player.potions[type] || 0) >= potionData.maxStock) { log('Stock plein !', '#ff6060'); return; }
  player.gold -= potionData.cost;
  player.potions[type] = (player.potions[type] || 0) + 1;
  log('✦ ' + (type==='hp'?'Potion de vie':'Potion de mana') + ' achetée ! (-' + potionData.cost + ' or)', '#c9a84c');
  SFX.chest();
  renderShop(player);
}



function pickUpgrades(floor) {
  // Weight by rarity based on floor depth
  const legChance  = Math.min(0.15, 0.03 * floor);
  const rareChance = Math.min(0.45, 0.15 + 0.05 * floor);
  const pool = ALL_UPGRADES.filter(u => {
    if (u.rarity === 'legendary') return Math.random() < legChance;
    if (u.rarity === 'rare')      return Math.random() < rareChance;
    return true;
  });
  // Always at least 3 options, mixing rarities
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  // Ensure at least 1 rare/legendary if floor >= 2
  const picks = shuffled.slice(0, 3);
  if (floor >= 2 && !picks.some(u => u.rarity !== 'common')) {
    const rarePool = ALL_UPGRADES.filter(u => u.rarity !== 'common');
    picks[2] = rarePool[Math.floor(Math.random() * rarePool.length)];
  }
  return picks.slice(0, 3);
}

function showUpgradeScreen(floor, player, onDone) {
  const screen = document.getElementById('upgrade-screen');
  const cards  = document.getElementById('upgrade-cards');
  document.getElementById('upgrade-floor').textContent = numToRoman(floor);
  document.getElementById('upgrade-subtitle').textContent = `Niveau ${floor} terminé — Dépensez votre or`;
  cards.innerHTML = '';

  // Gold display above cards
  let goldRow = document.getElementById('upgrade-gold-row');
  if (!goldRow) {
    goldRow = document.createElement('div');
    goldRow.id = 'upgrade-gold-row';
    goldRow.className = 'upg-gold-row';
    screen.querySelector('#upgrade-panel').insertBefore(goldRow, cards);
  }
  const refreshGold = () => { goldRow.textContent = `💛 Or disponible : ${player.gold}`; };
  refreshGold();

  const upgrades = pickUpgrades(floor);
  const renderCards = () => {
    cards.innerHTML = '';
    upgrades.forEach(u => {
      const canAfford = player.gold >= u.cost;
      const card = document.createElement('div');
      card.className = `upg-card ${u.rarity}${canAfford ? '' : ' cant-afford'}`;
      card.innerHTML = `<span class="upg-icon">${u.icon}</span>
        <div class="upg-name">${u.name}</div>
        <div class="upg-desc">${u.desc}</div>
        <div class="upg-value">${u.value}</div>
        <div class="upg-price">💛 ${u.cost} or</div>`;
      if (canAfford) {
        card.onclick = () => {
          player.gold -= u.cost;
          u.apply(player);
          log(`✦ ${u.name} acheté ! (-${u.cost} or)`, u.rarity==='legendary' ? '#ffb040' : u.rarity==='rare' ? '#c880f0' : '#c9a84c');
          flash(u.rarity==='legendary' ? 'rgba(255,150,30,.35)' : u.rarity==='rare' ? 'rgba(160,80,220,.25)' : 'rgba(201,168,76,.2)');
          SFX.chest();
          Achievements.bump('totalUpgrades');
          Achievements.set('maxBuffs', player.buffs ? player.buffs.length : 0);
          Achievements.set('maxGold', player.gold);
          refreshGold();
          renderCards();
        };
      }
      cards.appendChild(card);
    });
  };
  renderCards();

  screen.classList.add('active');
  G._upgradeCallback = onDone;
}

function hideUpgrade() {
  document.getElementById('upgrade-screen').classList.remove('active');
}

// ══ MAIN GAME ══════════════════════════════
const G = {
  state: null, frame: 0,
  heldKeys: {}, repeatTimer: null,
  REPEAT_DELAY: 200, REPEAT_RATE: 100,
  _upgradeCallback: null,
  _shopCallback: null,
  paused: false,

  togglePause() {
    if (!this.state) return;
    // Don't allow pause during upgrade/death screens
    const upgradeActive = document.getElementById('upgrade-screen').classList.contains('active');
    const deathActive   = document.getElementById('death-screen').classList.contains('active');
    if (upgradeActive || deathActive) return;
    this.paused = !this.paused;
    const ps = document.getElementById('pause-screen');
    ps.classList.toggle('active', this.paused);
    if (this.paused) {
      // Populate pause stats
      const p = this.state.player, s = this.state;
      document.getElementById('pause-stats-grid').innerHTML = `
        <div class="ps-cell"><span class="ps-label">Étage</span><span class="ps-val">${s.floor}</span></div>
        <div class="ps-cell"><span class="ps-label">Niveau</span><span class="ps-val">${p.level}</span></div>
        <div class="ps-cell"><span class="ps-label">Vie</span><span class="ps-val">${p.hp}<span style="font-size:9px;opacity:.5">/${p.maxHp}</span></span></div>
        <div class="ps-cell"><span class="ps-label">Mana</span><span class="ps-val">${p.mp}<span style="font-size:9px;opacity:.5">/${p.maxMp}</span></span></div>
        <div class="ps-cell"><span class="ps-label">Attaque</span><span class="ps-val">${p.atk}</span></div>
        <div class="ps-cell"><span class="ps-label">Défense</span><span class="ps-val">${p.def}</span></div>
        <div class="ps-cell ps-wide"><span class="ps-label">Or</span><span class="ps-val">💛 ${p.gold}</span></div>
      `;
      this.updateMusicBtn();
      Music.pause();
    } else {
      Music.resume();
    }
  },

  updateMusicBtn() {
    document.getElementById('music-status').textContent = Music.enabled ? 'ON' : 'OFF';
    document.getElementById('btn-music').textContent = Music.enabled ? '♪ MUSIQUE ON' : '♪ MUSIQUE OFF';
  },

  startGame() {
    TitleUI.startGame();
    G._diedThisRun = false;
  },

  _doInit() {
    buildSprites();
    bakeDimSprites();
    this.newFloor(1);
    // Appliquer les améliorations permanentes du marchand
    if (this.state && this.state.player) PermUpgrades.applyTo(this.state.player);
    this.setupInput();
    document.body.classList.add('game-started');
  },

  _doInitFromSave(saveData) {
    buildSprites();
    bakeDimSprites();
    // Construire un joueur temporaire (position 0,0, sera écrasée par newFloor)
    const p = new Player(0, 0);
    const d = saveData.player || {};
    // Restaurer toutes les stats
    const fields = ['hp','maxHp','mp','maxMp','atk','def','level','xp','xpNext','gold',
      'equippedWeapon','weaponLevel','_weaponAtkApplied','_weaponSweep','_weaponBurn',
      'vampiric','thorns','critChance','dodgeChance','spellDmg','spellRange','spellMpCost',
      'berserker','buffs','stamina','maxStamina','staminaRegen','dashCost','dashInvincible',
      'mpRegen','hpRegen','dashDist'];
    fields.forEach(f => { if (d[f] !== undefined) p[f] = d[f]; });
    if (d.armorLevels) p.armorLevels = {...d.armorLevels};
    // Passer le joueur restauré à newFloor (évite la création d'un Player niveau 1)
    this.newFloor(saveData.floor || 1, p);
    // NE PAS réappliquer PermUpgrades — déjà inclus dans les stats sauvées
    this.setupInput();
    document.body.classList.add('game-started');
  },

  init() {
    this.spawnSparks();
    TitleUI.init();
    PermUpgrades.load();
    requestAnimationFrame(() => this.loop());
  },

  newFloor(floor, existingPlayer=null) {
    const mapSize = Math.min(50, 36 + floor * 2);
    const seed = Math.floor(Math.random()*9999999);
    const isBossFloor = floor % 5 === 0;
    const mapData = isBossFloor
      ? genBossArena(seed, floor)
      : genMap(seed, floor, mapSize);
    const {map, rooms, start, MAP_W, MAP_H, torches, torchSet} = mapData;
    const player = existingPlayer || new Player(start.cx, start.cy);
    if (existingPlayer) {
      player.x=start.cx; player.y=start.cy;
      player.rx=player.x*TS; player.ry=player.y*TS;
      player.tx=player.rx; player.ty=player.ry;
      if (player.berserker) {
        const missing = Math.floor((1 - player.hp/player.maxHp) * 10);
        player.atk += missing;
      }
    }
    const explored = Array.from({length:MAP_H},()=>new Uint8Array(MAP_W));
    const visible = computeFOVProxy(map,player.x,player.y,MAP_W,MAP_H,9);
    for(let y=0;y<MAP_H;y++) for(let x=0;x<MAP_W;x++) if(visible[y][x]) explored[y][x]=1;
    cam.x=(player.rx-VW/2+TS/2); cam.y=(player.ry-VH/2+TS/2);
    // Boss floor: no normal monsters, only boss (and later his minions)
    const monsters = isBossFloor ? [] : spawnMonsters(rooms, floor);
    // Spawn merchant in the first room (spawn room)
    const spawnRoom = rooms[0];
    const merchant = new Merchant(spawnRoom.cx + 2, spawnRoom.cy);
    const puddles = genPuddles(map, MAP_W, MAP_H, seed);
    const cracks  = genCracks(map, MAP_W, MAP_H, seed);
    this.state={map,MAP_W,MAP_H,rooms,player,
      monsters, explored,visible,torches,torchSet,particles:new Particles(),floor,merchant,puddles,cracks,smashed:new Set(), openedChests:new Set()};
    if (isBossFloor) {
      const boss = spawnBoss(rooms, floor);
      this.state.monsters.push(boss);
      log(`☠ LE SEIGNEUR DES CRYPTES VOUS ATTEND…`, '#c000ff');
      log(`Étage ${floor} — COMBAT DE BOSS !`, '#ff80ff');
    } else {
      const numeral = numToRoman(floor);
      log(`Niveau ${numeral} — ${floor > 1 ? 'Les ténèbres s\'épaississent…' : 'L\'aventure commence…'}`, '#c9a84c');
      if (floor > 0) log(`Appuyez sur E pour parler au marchand`, '#f0d080');
    }
    Music.onFloor(floor);
    Achievements.set('maxFloor', floor);
    Achievements.set('maxGold', (this.state.player||{gold:0}).gold||0);
  },

  restart() {
    document.getElementById('death-screen').classList.remove('active');
    this._diedThisRun = false;
    this.newFloor(1);
    // Appliquer les améliorations permanentes du marchand
    if (this.state && this.state.player) PermUpgrades.applyTo(this.state.player);
  },

  skipUpgrade() {
    hideUpgrade();
    if (this._upgradeCallback) { this._upgradeCallback(); this._upgradeCallback = null; }
  },

  closeShop() {
    document.getElementById('shop-screen').classList.remove('active');
    if (this._shopCallback) { this._shopCallback(); this._shopCallback = null; }
  },

  tryMove(dx, dy) {
    const {player}=this.state;
    if(!player.alive || player.moving) return;
    // Mettre à jour la direction même si on ne peut pas se déplacer
    this._updatePlayerDir(dx, dy);
    this._execMove(dx, dy);
  },

  _updatePlayerDir(dx, dy) {
    const {player} = this.state;
    // Convertir les déplacements en directions
    const dirMap = {
      '-1,-1': 'nw', '0,-1': 'u', '1,-1': 'ne',
      '-1,0': 'l', '0,0': null, '1,0': 'r',
      '-1,1': 'sw', '0,1': 'd', '1,1': 'se'
    };
    const newDir = dirMap[`${dx},${dy}`];
    if (newDir) player.dir = newDir;
  },

  _execMove(dx, dy) {
    const {player,map,MAP_W,MAP_H,monsters,particles,merchant,openedChests}=this.state;
    const nx=player.x+dx, ny=player.y+dy;
    if(nx<0||nx>=MAP_W||ny<0||ny>=MAP_H) return;
    const tile=map[ny][nx];
    if(tile===T.WALL||tile===T.WALL_TOP||tile===T.EMPTY) return;
    const mon=monsters.find(m=>m.alive&&m.x===nx&&m.y===ny);
    if(mon){this.attack(player,mon);return;}
    
    // Check collision with merchant
    if(merchant && merchant.alive && merchant.x===nx && merchant.y===ny) {
      log('Il y a le marchand ici!','#f0d080');
      return;
    }

    if(tile===T.BREAKABLE){
      const vi=((nx*7+ny*13)%3+3)%3;
      const colParts = vi===0?'#c07848':vi===1?'#7a5020':'#606878';
      // Animation de casse — éclats + débris
      particles.spawn(nx,ny,colParts,14,'hit');
      particles.spawn(nx,ny,colParts,8,'death');
      particles.spawn(nx,ny,'#a08060',6,'hit');
      SFX.smash();
      flash('rgba(120,80,30,.15)');
      map[ny][nx]=T.FLOOR;
      this.state.smashed.add(`${nx},${ny}`);
      // Loot réduit : 40% rien, 40% petit or (1-5), 15% petite vie (1-4), 5% les deux
      const roll=Math.random();
      const mult=player.goldMult||1;
      if(roll<0.40){
        log(`Cassé !`,'#907050');
        floatDmg(nx,ny,`💥`,'#c09060');
      } else if(roll<0.80){
        const g=Math.max(1,(1+Math.random()*4|0))*mult|0;
        player.gold+=g;
        log(`Cassé ! +${g} or`,'#c0a040');
        particles.spawn(nx,ny,'#e0c020',5,'gold');
        floatDmg(nx,ny,`+${g}💰`,'#d0b030');
        Achievements.set('maxGold', player.gold);
      } else if(roll<0.95){
        const h=1+Math.random()*3|0;
        player.hp=Math.min(player.maxHp,player.hp+h);
        log(`Cassé ! +${h} PV`,'#60b060');
        particles.spawn(nx,ny,'#30c050',4,'heal');
        floatDmg(nx,ny,`+${h}❤️`,'#60d060');
      } else {
        const g=Math.max(1,(1+Math.random()*3|0))*mult|0;
        const h=1+Math.random()*2|0;
        player.gold+=g; player.hp=Math.min(player.maxHp,player.hp+h);
        log(`Cassé ! +${g} or, +${h} PV`,'#c0a050');
        particles.spawn(nx,ny,'#e0c020',4,'gold');
        floatDmg(nx,ny,`+${g}💰`,'#d0b030');
      }
      // Joueur reste sur place (obstacle physique brisé depuis l'extérieur)
      // Met à jour FOV depuis la position actuelle
      const vis=computeFOVProxy(map,player.x,player.y,MAP_W,MAP_H,9);
      this.state.visible=vis;
      for(let y=0;y<MAP_H;y++) for(let x=0;x<MAP_W;x++) if(vis[y][x]) this.state.explored[y][x]=1;
      tickMonsters(this.state);
      return;
    }
    if(tile===T.STAIRS){
      log('Vous descendez…','#f0d080'); flash('rgba(0,0,0,.9)');
      SFX.stairs();
      Achievements.bump('totalStairs');
      const floor = this.state.floor;
      // Clean run: reached floor 3 without a death this session
      if (floor >= 3 && !this._diedThisRun) Achievements.set('cleanRuns', (Achievements.s.cleanRuns||0)+1);
      setTimeout(() => {
        showUpgradeScreen(floor, player, () => {
          setTimeout(() => this.newFloor(floor+1, player), 300);
        });
      }, 400);
      return;
    }
    if(tile===T.CHEST){
      if(!openedChests.has(`${nx},${ny}`)){
        const mult = player.goldMult||1;
        const g=(5+Math.random()*20|0)*mult|0, h=3+Math.random()*10|0;
        player.gold+=g; player.hp=Math.min(player.maxHp,player.hp+h);
        openedChests.add(`${nx},${ny}`);
        log(`Coffre: +${g} or, +${h} PV`,'#f0d080');
        SFX.chest();
        particles.spawn(nx,ny,'#f0d030',20,'gold');
        particles.spawn(nx,ny,'#80ff80',8,'heal');
        flash('rgba(201,168,76,.18)');
        Achievements.bump('totalChests');
        Achievements.set('maxGold', player.gold);
      }
      return;
    }
    if(tile===T.BOSS_CHEST){
      if(!openedChests.has(`${nx},${ny}`)){
        const mult = player.goldMult||1;
        // Grande récompense légendaire
        const g = (80 + Math.random()*120|0)*mult|0;
        const h = Math.floor(player.maxHp * 0.5);
        const mp = Math.floor(player.maxMp * 0.5);
        player.gold += g;
        player.hp = Math.min(player.maxHp, player.hp + h);
        player.mp = Math.min(player.maxMp, player.mp + mp);
        openedChests.add(`${nx},${ny}`);
        log(`✦ COFFRE LÉGENDAIRE : +${g} or !`, '#ffcc00');
        log(`✦ +${h} PV, +${mp} Mana restaurés !`, '#80ff80');
        SFX.chest();
        particles.spawn(nx,ny,'#ffcc00',50,'gold');
        particles.spawn(nx,ny,'#ffffff',30,'death');
        particles.spawn(nx,ny,'#c000ff',25,'magic');
        particles.spawn(nx,ny,'#80ff80',20,'heal');
        flash('rgba(255,200,50,.45)');
        Achievements.bump('totalChests');
        Achievements.set('maxGold', player.gold);
      }
      return;
    }
    if(tile===T.TRAP){
      if(player.dodgeChance>0&&Math.random()<player.dodgeChance){
        map[ny][nx]=T.FLOOR; log('Esquivé !','#80e0ff');
        Achievements.bump('trapDodges');
      } else {
        const d=3+Math.random()*8|0+this.state.floor;
        player.hp=Math.max(0,player.hp-d); map[ny][nx]=T.FLOOR;
        log(`Piège! -${d} PV`,'#ff4040'); player.shake();
        SFX.trap();
        particles.spawn(nx,ny,'#ff2000',12,'hit'); flash('rgba(160,0,0,.3)');
        Achievements.bump('totalTraps');
        Achievements.bump('totalDamageTaken', d);
        if(player.hp<=0){ this._die(player); return; }
      }
    }
    this._updatePlayerDir(dx, dy);
    player.startMove(nx,ny);
    SFX.step();
    if(player.hpRegen) player.hp=Math.min(player.maxHp,player.hp+(player.hpRegen*.2|0));
    player.stepCount=(player.stepCount||0)+1;
    if(player.mpRegen&&player.stepCount%5===0) player.mp=Math.min(player.maxMp,player.mp+player.mpRegen);
    const vis=computeFOVProxy(map,nx,ny,MAP_W,MAP_H,9);
    this.state.visible=vis;
    for(let y=0;y<MAP_H;y++) for(let x=0;x<MAP_W;x++) if(vis[y][x]) this.state.explored[y][x]=1;
    tickMonsters(this.state);
  },

  attack(player, mon) {
    let dmg=Math.max(1,player.atk+Math.floor(Math.random()*4)-1);
    // Berserker bonus
    if(player.berserker) dmg+=Math.floor((1-player.hp/player.maxHp)*player.atk*.5);
    // Critical
    let isCrit=false;
    if(player.critChance>0&&Math.random()<player.critChance){ dmg*=2; isCrit=true; }
    mon.hp-=dmg; mon.shake(); mon.aggro=true;
    if(isCrit) SFX.crit(); else SFX.swing();
    floatDmg(mon.x,mon.y, isCrit?`✦${dmg}!`:`-${dmg}`, isCrit?'#ffdd40':'#ff8040');
    this.state.particles.spawn(mon.x,mon.y,'#ff4020',isCrit?18:10,'hit');
    if(isCrit){ log(`Coup critique ! -${dmg} !`,'#ffdd40'); Achievements.bump('totalCrits'); }
    else log(`${mon.name}: -${dmg} dégâts`,'#f0b060');
    // Vampiric
    if(player.vampiric>0){
      const drain=Math.max(1,Math.floor(dmg*player.vampiric));
      player.hp=Math.min(player.maxHp,player.hp+drain);
      Achievements.bump('vampireDrain', drain);
    }
    // Burn — DoT : applique 3 ticks de feu sur le monstre
    if(player._weaponBurn > 0 && mon.alive) {
      mon.burnDmg   = player._weaponBurn;
      mon.burnTicks = (mon.burnTicks || 0) + 3; // rechargeable
      floatDmg(mon.x, mon.y, `🔥`, '#ff7020');
      this.state.particles.spawn(mon.x, mon.y, '#ff5010', 5, 'fire');
    }
    // Sweep
    if(player._weaponSweep && mon.alive) {
      const sweepTarget = this.state.monsters.find(m =>
        m.alive && m !== mon && Math.abs(m.x - mon.x) <= 1 && Math.abs(m.y - mon.y) <= 1
      );
      if(sweepTarget) {
        const sdmg = Math.max(1, Math.floor(dmg * 0.5));
        sweepTarget.hp -= sdmg;
        floatDmg(sweepTarget.x, sweepTarget.y, `↔${sdmg}`, '#ffa040');
        this.state.particles.spawn(sweepTarget.x, sweepTarget.y, '#ffa040', 6, 'hit');
        Achievements.bump('sweepHits');
        if(sweepTarget.hp<=0){ handleMonsterDeath(this.state, player, sweepTarget); }
      }
    }
    Achievements.set('maxSingleHit', dmg);
    if(mon.hp<=0){
      handleMonsterDeath(this.state, player, mon);
    } else {
      // Monster counter-attack — with dodge check
      if(player.dodgeChance>0&&Math.random()<player.dodgeChance){
        log(`Esquive !`,'#80e0ff');
        Achievements.bump('totalDodges');
      } else {
        const md=Math.max(0,mon.atk-player.def+Math.floor(Math.random()*3));
        player.hp=Math.max(0,player.hp-md); player.shake();
        if(md>0) SFX.hit();
        if(md>0) Achievements.bump('totalDamageTaken', md);
        if(md>0) { floatDmg(player.x, player.y, `-${md}`, '#ff4040'); this.state.particles.spawn(player.x, player.y, '#cc2020', 6, 'hit'); }
        if(player.hp<=3 && player.hp>0) Achievements.bump('nearDeaths');
        // Thorns
        if(player.thorns>0){
          const td=Math.ceil(md*player.thorns); mon.hp-=td;
          Achievements.bump('thornsDamage', td);
          if(mon.hp<=0){ handleMonsterDeath(this.state, player, mon); }
        }
        if(md>0){log(`${mon.name} riposte: -${md} PV`,'#ff6060');flash('rgba(160,0,0,.22)');}
        if(player.hp<=0){ this._die(player); return; }
      }
    }
    tickMonsters(this.state);
  },

  _die(player) {
    // Lich resurrection
    if(player.lich&&!player.lichUsed){
      player.lichUsed=true; player.hp=Math.floor(player.maxHp*.5);
      log('⚰️ Le Phylactère vous ressuscite !','#c880f0');
      flash('rgba(160,80,220,.5)');
      Achievements.bump('lichRevives');
      return;
    }
    player.alive=false;
    Achievements.bump('totalDeaths');
    this._diedThisRun = true;
    SFX.die();
    setTimeout(()=>{
      const ds=document.getElementById('death-stats');
      const s=this.state;
      ds.textContent=`Niveau ${player.level}  •  Étage ${s.floor}  •  ${player.gold} or`;
      document.getElementById('death-screen').classList.add('active');
    }, 900);
  },

  spell() {
    const {player,monsters,particles}=this.state;
    if(player.mp<player.spellMpCost){log('Mana insuffisant!','#8080ff');return;}
    player.mp-=player.spellMpCost;
    const dmg=player.spellDmg+Math.random()*6|0; let hit=0;
    monsters.filter(m=>m.alive).forEach(m=>{
      if(Math.abs(m.x-player.x)+Math.abs(m.y-player.y)<=player.spellRange){
        m.hp-=dmg;hit++;particles.spawn(m.x,m.y,'#6080ff',14,'magic');
        if(m.hp<=0){ handleMonsterDeath(this.state, player, m); }
      }
    });
    flash('rgba(60,80,220,.38)');
    SFX.spell();
    Achievements.bump('totalSpells');
    Achievements.set('maxSpellHits', hit);
    log(hit?`Éclair! ${hit} ennemi(s) -${dmg}!`:'Sort lancé…','#8090ff');
    particles.spawn(player.x,player.y,'#6080ff',28,'magic');
  },

  usePotion(type) {
    if (!this.state || this.paused) return;
    const player = this.state.player;
    if (!player || !player.alive) return;
    const data = POTIONS_DATA.find(p => p.id === type);
    if (!data) return;
    if ((player.potions[type] || 0) <= 0) { log('Aucune potion en stock !', '#ff6060'); return; }
    if (type === 'hp') {
      if (player.hp >= player.maxHp) { log('PV déjà au maximum !', '#80e0ff'); return; }
      player.potions.hp--;
      player.hp = Math.min(player.maxHp, player.hp + data.restore);
      log(`✦ Potion de vie utilisée ! +${data.restore} PV`, '#80e080');
      flash('rgba(80,220,120,.3)');
    } else if (type === 'mana') {
      if (player.mp >= player.maxMp) { log('Mana déjà au maximum !', '#80e0ff'); return; }
      player.potions.mana--;
      player.mp = Math.min(player.maxMp, player.mp + data.restore);
      log(`✦ Potion de mana utilisée ! +${data.restore} MP`, '#80a0ff');
      flash('rgba(80,120,220,.3)');
    }
    SFX.chest();
    this.state.particles.spawn(player.x, player.y, type==='hp' ? '#40ff80' : '#4080ff', 16, 'magic');
  },

  interactMerchant() {
    if (!this.state || !this.state.merchant) return;
    const merchant = this.state.merchant;
    const dist = Math.abs(this.state.player.x - merchant.x) + Math.abs(this.state.player.y - merchant.y);
    if (dist > 2) {
      log('Trop loin du marchand!', '#ff6060');
      return;
    }
    log('Vous discutez avec le marchand…', '#f0d080');
    Achievements.bump('shopVisits');
    showShopScreen(this.state.player, () => {});
  },

  setupInput() {
    if (this._inputBound) return;
    this._inputBound = true;
    document.addEventListener('keydown', e => {
      const k = e.key.toLowerCase();
      if (e.key === 'Escape') { e.preventDefault(); this.togglePause(); return; }
      if([' ','arrowleft','arrowright','arrowup','arrowdown'].includes(e.key.toLowerCase())||
         ['z','q','s','d','w','a'].includes(k)) e.preventDefault();
      if(e.repeat) return;
      if (this.paused) return;
      if(k===' '){this.spell();return;}
      if(k==='e'){this.interactMerchant();return;}
      if(k==='1'){this.usePotion('hp');return;}
      if(k==='2'){this.usePotion('mana');return;}
      // Dash : Shift + direction (dans les 2 sens)
      if (e.key === 'Shift') {
        this.heldKeys['shift'] = true;
        // Si une touche de direction est déjà enfoncée → dash immédiat
        const dirs = ['arrowleft','arrowright','arrowup','arrowdown','z','q','s','d','w','a'];
        const heldDir = dirs.find(d => this.heldKeys[d]);
        if (heldDir) { this._doDash(heldDir); }
        return;
      }
      this.heldKeys[k]=true;
      if (e.shiftKey || this.heldKeys['shift']) { this._doDash(k); return; }
      this._doDir(k);
    });
    document.addEventListener('keyup', e => {
      this.heldKeys[e.key.toLowerCase()]=false;
      if (e.key === 'Shift') this.heldKeys['shift'] = false;
    });
    cv.addEventListener('click', e => {
      if(!this.state||this.paused) return;
      const {player,monsters}=this.state;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
        const m=monsters.find(m=>m.alive&&m.x===player.x+dx&&m.y===player.y+dy);
        if(m){this.attack(player,m);return;}
      }
    });
  },

  _doDir(k) {
    const diag = this.heldKeys;
    const l = diag['arrowleft']  || diag['q'] || diag['a'];
    const r = diag['arrowright'] || diag['d'];
    const u = diag['arrowup']    || diag['z'] || diag['w'];
    const d = diag['arrowdown']  || diag['s'];
    if      (l && u) this.tryMove(-1,-1);
    else if (r && u) this.tryMove(1,-1);
    else if (l && d) this.tryMove(-1,1);
    else if (r && d) this.tryMove(1,1);
    else if (k==='arrowleft'  || k==='q'||k==='a'|| (!k&&l)) this.tryMove(-1,0);
    else if (k==='arrowright' || k==='d'          || (!k&&r)) this.tryMove(1,0);
    else if (k==='arrowup'    || k==='z'||k==='w' || (!k&&u)) this.tryMove(0,-1);
    else if (k==='arrowdown'  || k==='s'          || (!k&&d)) this.tryMove(0,1);
  },

  _doDash(k) {
    if (!this.state) return;
    const player = this.state.player;
    if (!player || !player.alive) return;
    if (player.stamina < player.dashCost) {
      log('Endurance insuffisante !', '#ff6060'); return;
    }
    // Résoudre direction
    let dx = 0, dy = 0;
    if (k==='arrowleft'  || k==='q'||k==='a') dx=-1;
    else if (k==='arrowright' || k==='d')      dx=1;
    else if (k==='arrowup'    || k==='z'||k==='w') dy=-1;
    else if (k==='arrowdown'  || k==='s')      dy=1;
    else return; // touche non directionnelle
    // Avancer de 1 à 3 cases dans la direction, s'arrêter sur mur/monstre
    const {map,MAP_W,MAP_H,monsters,particles} = this.state;
    const dashDist = player.dashDist || 3;
    let stepped = 0;
    let lastX = player.x, lastY = player.y;
    for (let i = 0; i < dashDist; i++) {
      const nx = lastX + dx, ny = lastY + dy;
      if (nx<0||nx>=MAP_W||ny<0||ny>=MAP_H) break;
      const tile = map[ny][nx];
      if (tile===T.WALL||tile===T.WALL_TOP||tile===T.EMPTY) break;
      const mon = monsters.find(m=>m.alive&&m.x===nx&&m.y===ny);
      if (mon) {
        // Dash-attaque : frappe le monstre et s'arrête
        if (player.dashInvincible) player._dashImmune = 3; // 3 ticks d'immunité
        this.attack(player, mon);
        stepped++;
        lastX = nx; lastY = ny;
        break;
      }
      lastX = nx; lastY = ny; stepped++;
    }
    if (stepped === 0) { log('Bloqué !', '#888'); return; }
    // Téléportation directe (tween rapide)
    player.stamina = Math.max(0, player.stamina - player.dashCost);
    player._staminaRegenTimer = 0; // reset regen delay
    player.x = lastX; player.y = lastY;
    player.rx = player.tx = lastX * TS;
    player.ry = player.ty = lastY * TS;
    SFX.step();
    // EFFET DASH ÉPIQUE: Rémanence ultra stylée avec couches massives
    let traceX = player.x - dx * stepped, traceY = player.y - dy * stepped;
    for(let i = 0; i < stepped; i++) {
      // Trail massif: plusieurs couches de particules
      for(let j = 0; j < 3; j++) {
        particles.spawn(traceX + dx*i, traceY + dy*i, '#40ff40', 18-i*2-j*1, 'dash');
      }
      particles.spawn(traceX + dx*i, traceY + dy*i, '#60ff60', 14-i*1, 'dash');
      particles.spawn(traceX + dx*i, traceY + dy*i, '#20cc20', 10-i*1, 'dash');
      particles.spawn(traceX + dx*i, traceY + dy*i, '#10aa10', 8-i*1, 'dash');
    }
    // Shockwave circulaire MASSIF à la destination
    for(let i=0; i<30; i++) {
      particles.spawn(lastX, lastY, '#40ff40', 0.5+i*1.2, 'dash');
    }
    // Explosion centrale ultra intense
    for(let i=0; i<16; i++) {
      particles.spawn(lastX, lastY, '#60ff60', 2+i*0.8, 'dash');
    }
    // Double couronne d'expansion
    for(let ring = 1; ring <= 2; ring++) {
      for(let angle = 0; angle < Math.PI*2; angle += Math.PI/8) {
        particles.spawn(lastX + Math.cos(angle)*ring, lastY + Math.sin(angle)*ring, '#40ff40', 4-ring*0.5, 'dash');
      }
    }
    // Flashes échelonnées ultra dramatiques
    flash('rgba(64,255,64,.6)');
    setTimeout(() => flash('rgba(100,255,100,.4)'), 15);
    setTimeout(() => flash('rgba(64,255,64,.3)'), 30);
    setTimeout(() => flash('rgba(200,255,200,.15)'), 50);
    // Vibration du HUD
    const hud = document.getElementById('hud');
    if(hud) {
      hud.style.transform = 'scale(1.02)';
      setTimeout(() => hud.style.transform = 'scale(1)', 80);
    }
    log('Dash !', '#40ff40');
    // Mettre à jour FOV
    const vis = computeFOVProxy(map, lastX, lastY, MAP_W, MAP_H, 9);
    this.state.visible = vis;
    for(let y=0;y<MAP_H;y++) for(let x=0;x<MAP_W;x++) if(vis[y][x]) this.state.explored[y][x]=1;
    tickMonsters(this.state);
  },

  spawnSparks() {
    const cols=['#c9a84c','#ff4a1c','#8060b0','#f0d080'];
    for(let i=0;i<16;i++){
      const el=document.createElement('div'); el.className='spark';
      const c=cols[Math.floor(Math.random()*cols.length)];
      el.style.background=c; el.style.boxShadow=`0 0 3px ${c}`;
      el.style.left=Math.random()*100+'%';
      el.style.animationDuration=(9+Math.random()*13)+'s';
      el.style.animationDelay=(-Math.random()*15)+'s';
      el.style.setProperty('--drift',(Math.random()-.5)*55+'px');
      document.body.appendChild(el);
    }
  },

  loop() {
    try {
    this.frame++;
    if (this.state && !this.paused) {
      const { player, particles, monsters } = this.state;
      player.update();
      player.updateTween();
      for (const m of monsters) {
        if (m.alive) { m.update(); m.updateTween(); }
      }
      particles.update();
      if (this.frame % 6 === 0)  buildWater(this.frame);
      if (this.frame % 4 === 0)  buildTorch(this.frame);
      updateCam(player);
      // Stamina regen (délai de 30 frames après un dash)
      if (player.stamina < player.maxStamina) {
        player._staminaRegenTimer = (player._staminaRegenTimer || 0) + 1;
        if (player._staminaRegenTimer > 30) {
          player.stamina = Math.min(player.maxStamina, player.stamina + player.staminaRegen / 60);
        }
      } else {
        player._staminaRegenTimer = 999;
      }
      // Mouvement continu : relance si une touche est tenue et que le tween vient de finir
      if (player.alive && player._tweenJustFinished) {
        player._tweenJustFinished = false;
        const anyDir = this.heldKeys['arrowleft']||this.heldKeys['q']||this.heldKeys['a']||
                       this.heldKeys['arrowright']||this.heldKeys['d']||
                       this.heldKeys['arrowup']||this.heldKeys['z']||this.heldKeys['w']||
                       this.heldKeys['arrowdown']||this.heldKeys['s'];
        if (anyDir && !this.paused) this._doDir(null);
      }
    }
    if (this.state) {
      render(this.state);
      renderMM(this.state);
      updateHUD(this.state.player, this.state.floor);
    }
    } catch(e) { console.error('[loop]', e); }
    requestAnimationFrame(() => this.loop());
  },

};

// ══ MUSIC — WebAudio procedural dungeon ambient ══
// ══ AUDIO ENGINE ════════════════════════════════════════════════
// Shared AudioContext + reverb for both Music and SFX
const Audio = {
  ctx: null, reverb: null, sfxGain: null,

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    // Convolution reverb — decaying noise impulse, 2.2s
    const sr = this.ctx.sampleRate, len = sr * 2.2;
    const buf = this.ctx.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++)
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.6);
    }
    this.reverb = this.ctx.createConvolver();
    this.reverb.buffer = buf;
    const rvBus = this.ctx.createGain(); rvBus.gain.value = 1;
    this.reverb.connect(rvBus); rvBus.connect(this.ctx.destination);

    // SFX bus — dry only, no reverb, slightly lower
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.55;
    this.sfxGain.connect(this.ctx.destination);
  },

  // Utility: play an oscillator note with envelope
  osc(freq, start, dur, vol, type, dest, detune = 0) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type; o.frequency.value = freq; o.detune.value = detune;
    const atk = Math.min(0.05, dur * 0.1);
    const rel = Math.min(dur * 0.5, 0.9);
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(vol, start + atk);
    g.gain.setValueAtTime(vol, start + dur - rel);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(dest);
    o.start(start); o.stop(start + dur + 0.05);
  },

  // Utility: white noise burst with envelope
  noise(start, dur, vol, ffreq, dest) {
    const bufLen = this.ctx.sampleRate * dur;
    const nb = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
    const nd = nb.getChannelData(0);
    for (let i = 0; i < bufLen; i++) nd[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = nb;
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = ffreq; f.Q.value = 1.5;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, start);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    src.connect(f); f.connect(g); g.connect(dest);
    src.start(start); src.stop(start + dur + 0.02);
  }
};

// ══ SFX ══════════════════════════════════════════════════════════
const SFX = {
  get ac() { return Audio.ctx; },
  get bus() { return Audio.sfxGain; },
  get rv() { return Audio.reverb; },
  _vol: 1.0,

  setVolume(v) {
    this._vol = Math.max(0, Math.min(1, v));
    if (Audio.sfxGain) Audio.sfxGain.gain.value = 0.55 * this._vol;
    const el = document.getElementById('vol-sfx-val');
    if (el) el.textContent = Math.round(this._vol * 100) + '%';
  },

  // Footstep — soft stone thud, randomized pitch
  step() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    Audio.noise(t, 0.055, 0.18 + Math.random() * 0.06, 180 + Math.random() * 80, this.bus);
    Audio.osc(55 + Math.random() * 20, t, 0.06, 0.07, 'sine', this.bus);
  },

  // Sword swing — metallic whoosh
  swing() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    // Metallic scrape — highpass noise sweep
    const nb = this.ac.createBuffer(1, this.ac.sampleRate * 0.18, this.ac.sampleRate);
    const nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / nd.length, 0.6);
    const src = this.ac.createBufferSource(); src.buffer = nb;
    const filt = this.ac.createBiquadFilter();
    filt.type = 'highpass'; filt.frequency.value = 1200;
    filt.frequency.linearRampToValueAtTime(3800, t + 0.18);
    const g = this.ac.createGain();
    g.gain.setValueAtTime(0.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    src.connect(filt); filt.connect(g); g.connect(this.bus);
    src.start(t); src.stop(t + 0.2);
    // Low thud on impact
    Audio.osc(90, t + 0.06, 0.1, 0.12, 'sine', this.bus);
  },

  // Critical hit — sharper crack + high ping
  crit() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    Audio.noise(t, 0.08, 0.45, 3500, this.bus);
    Audio.osc(880, t, 0.15, 0.12, 'triangle', this.bus);
    Audio.osc(1320, t + 0.04, 0.1, 0.08, 'sine', this.bus);
  },

  // Player takes damage — low grunt + impact
  hit() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    Audio.noise(t, 0.12, 0.35, 300, this.bus);
    Audio.osc(110, t, 0.14, 0.18, 'sawtooth', this.bus);
    Audio.osc(80, t + 0.04, 0.1, 0.12, 'sine', this.bus);
  },

  // Monster dies — thud + brief decay
  monsterDie() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    Audio.osc(120, t, 0.08, 0.2, 'sine', this.bus);
    Audio.osc(80, t + 0.06, 0.18, 0.15, 'sine', this.bus);
    Audio.noise(t, 0.2, 0.25, 400, this.bus);
  },

  // Spell cast — rising electric buzz
  spell() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    // Rising sweep
    const o = this.ac.createOscillator();
    const g = this.ac.createGain();
    const f = this.ac.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 800; f.Q.value = 3;
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(200, t);
    o.frequency.exponentialRampToValueAtTime(1200, t + 0.25);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.25, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    o.connect(f); f.connect(g); g.connect(this.bus); g.connect(this.rv);
    o.start(t); o.stop(t + 0.45);
    // Crackle
    Audio.noise(t + 0.1, 0.2, 0.2, 2400, this.bus);
    // Harmonic ping
    Audio.osc(660, t + 0.15, 0.3, 0.1, 'triangle', this.rv);
  },

  // Chest open — coin jingle: 3 quick rising notes
  chest() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    [0, 0.07, 0.15].forEach((dt, i) => {
      Audio.osc(660 * Math.pow(1.26, i), t + dt, 0.22, 0.14, 'triangle', this.bus);
      Audio.osc(660 * Math.pow(1.26, i), t + dt, 0.22, 0.06, 'sine', this.rv);
    });
  },

  // Trap — sharp alarm buzz
  trap() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    Audio.osc(220, t, 0.08, 0.2, 'square', this.bus);
    Audio.osc(185, t + 0.07, 0.1, 0.18, 'square', this.bus);
    Audio.noise(t, 0.15, 0.3, 600, this.bus);
  },

  // Smash — impact franc + bruit d'éclats fort
  smash() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    // Impact grave percutant (×3)
    Audio.osc(120, t,        3.90, 0.06, 'sine',     this.bus);
    Audio.osc(70,  t + 0.01, 3.60, 0.14, 'sine',     this.bus);
    Audio.osc(45,  t + 0.02, 2.70, 0.18, 'sine',     this.bus);
    // Bruit d'éclats — large spectre (×3)
    Audio.noise(t,        3.90, 0.08, 300,  this.bus);
    Audio.noise(t + 0.02, 3.00, 0.10, 900,  this.bus);
    Audio.noise(t + 0.05, 1.80, 0.12, 2200, this.bus);
    // Réverbération (×3)
    Audio.noise(t + 0.08, 1.20, 0.18, 500, this.rv);
  },

  // Level up — ascending 4-note fanfare
  levelUp() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    [0, 330, 440, 550, 660].forEach((freq, i) => {
      if (i === 0) return;
      Audio.osc(freq, t + i * 0.1, 0.25, 0.15, 'triangle', this.bus);
      Audio.osc(freq, t + i * 0.1, 0.35, 0.07, 'sine', this.rv);
    });
  },

  // Descend stairs — deep reverberant rumble + shimmer
  stairs() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    Audio.osc(55, t, 0.6, 0.25, 'sine', this.rv);
    Audio.osc(82, t + 0.1, 0.4, 0.12, 'sine', this.rv);
    Audio.noise(t, 0.4, 0.18, 200, this.rv);
    Audio.osc(440, t + 0.3, 0.5, 0.07, 'triangle', this.rv);
  },

  // Player death — mournful descending toll
  die() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    [220, 185, 165, 147].forEach((freq, i) => {
      Audio.osc(freq, t + i * 0.28, 0.5, 0.14 - i * 0.02, 'triangle', this.rv);
    });
    Audio.osc(55, t + 0.1, 1.2, 0.2, 'sine', this.rv);
  },

  // Boss aggro roar — low rumble + screech
  bossRoar() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    // Sub rumble
    Audio.osc(50, t, 0.8, 0.3, 'sawtooth', this.rv);
    Audio.osc(75, t + 0.1, 0.6, 0.2, 'sine', this.rv);
    // High screech sweep
    const o = this.ac.createOscillator();
    const g = this.ac.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(800, t + 0.3);
    o.frequency.exponentialRampToValueAtTime(120, t + 0.9);
    g.gain.setValueAtTime(0.18, t + 0.3);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
    o.connect(g); g.connect(this.rv);
    o.start(t + 0.3); o.stop(t + 1.1);
  },

  // Boss death — thunderous, triumphant collapse
  bossDie() {
    const t = this.ac.currentTime;
    // Deep boom
    Audio.osc(40, t, 1.5, 0.4, 'sine', this.rv);
    Audio.osc(60, t + 0.05, 1.2, 0.3, 'sine', this.rv);
    // Shattering crack
    Audio.noise(t, 0.3, 0.6, 800, this.rv);
    Audio.noise(t + 0.1, 0.4, 0.4, 2000, this.rv);
    // Triumphant ascending tones
    [220, 277, 330, 440, 550].forEach((freq, i) => {
      Audio.osc(freq, t + 0.3 + i * 0.12, 0.6, 0.12, 'triangle', this.rv);
    });
    // Final shimmer
    Audio.osc(880, t + 1.0, 1.0, 0.08, 'sine', this.rv);
  },

  // ── UI sounds ─────────────────────────────────────────────────

  // Survol de bouton — léger tintement métallique court
  uiHover() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    // Petit chime cristallin
    Audio.osc(1320, t, 0.055, 0.04, 'triangle', this.bus);
    Audio.osc(1760, t + 0.018, 0.04, 0.022, 'sine', this.bus);
  },

  // Clic / sélection — frappe de pierre + résonance dorée
  uiSelect() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    // Impact pierre
    Audio.noise(t, 0.04, 0.28, 600, this.bus);
    Audio.osc(180, t, 0.07, 0.18, 'sine', this.bus);
    // Résonance dorée montante
    Audio.osc(440, t + 0.03, 0.18, 0.1, 'triangle', this.bus);
    Audio.osc(660, t + 0.06, 0.14, 0.07, 'sine', this.bus);
    // Petit shimmer final
    Audio.osc(1100, t + 0.1, 0.12, 0.04, 'sine', this.rv);
  },

  // Ouverture d'un sous-panneau — sceau qui s'ouvre
  uiPanelOpen() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    // Swoosh grave + montée
    const o = this.ac.createOscillator();
    const g = this.ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(380, t + 0.22);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.15, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.connect(g); g.connect(this.bus);
    o.start(t); o.stop(t + 0.32);
    // Clang métallique
    Audio.noise(t + 0.15, 0.1, 0.18, 1800, this.bus);
    Audio.osc(550, t + 0.15, 0.2, 0.08, 'triangle', this.bus);
  },

  // Fermeture d'un sous-panneau — portail qui se referme
  uiPanelClose() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    const o = this.ac.createOscillator();
    const g = this.ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(380, t);
    o.frequency.exponentialRampToValueAtTime(100, t + 0.18);
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.connect(g); g.connect(this.bus);
    o.start(t); o.stop(t + 0.24);
    Audio.noise(t, 0.06, 0.14, 900, this.bus);
  },

  // Iris close (début transition) — grondement sourd + aspiration
  uiIrisClose() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    // Grondement grave descendant
    const o = this.ac.createOscillator();
    const g = this.ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(90, t);
    o.frequency.exponentialRampToValueAtTime(28, t + 0.5);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.22, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    o.connect(g); g.connect(this.rv);
    o.start(t); o.stop(t + 0.6);
    // Aspiration (bruit filtré descendant)
    const nb = this.ac.createBuffer(1, this.ac.sampleRate * 0.45, this.ac.sampleRate);
    const nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / nd.length, 0.4);
    const src = this.ac.createBufferSource(); src.buffer = nb;
    const filt = this.ac.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(1200, t);
    filt.frequency.exponentialRampToValueAtTime(80, t + 0.45);
    const gn = this.ac.createGain();
    gn.gain.setValueAtTime(0.3, t); gn.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    src.connect(filt); filt.connect(gn); gn.connect(this.rv);
    src.start(t); src.stop(t + 0.5);
  },

  // Iris open (révélation) — portail magique qui s'ouvre, lueur dorée
  uiIrisOpen() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    // Montée mystique
    const o = this.ac.createOscillator();
    const g = this.ac.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(55, t);
    o.frequency.exponentialRampToValueAtTime(220, t + 0.55);
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.12);
    g.gain.setValueAtTime(0.18, t + 0.35);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.75);
    o.connect(g); g.connect(this.rv);
    o.start(t); o.stop(t + 0.8);
    // Harmonique dorée
    Audio.osc(220, t + 0.15, 0.55, 0.1, 'sine', this.rv);
    Audio.osc(330, t + 0.25, 0.45, 0.07, 'sine', this.rv);
    Audio.osc(440, t + 0.35, 0.38, 0.05, 'sine', this.rv);
    // Bruit d'air qui s'engouffre
    Audio.noise(t, 0.25, 0.18, 500, this.bus);
    // Shimmer haute fréquence
    Audio.osc(1760, t + 0.3, 0.4, 0.04, 'sine', this.rv);
    Audio.osc(2200, t + 0.45, 0.3, 0.025, 'sine', this.rv);
  },

  // Préloader terminé — gong solennel + harmoniques
  uiReady() {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    // Gong fondamental
    Audio.osc(110, t, 1.8, 0.3, 'sine', this.rv);
    Audio.osc(165, t + 0.02, 1.4, 0.18, 'triangle', this.rv);
    Audio.osc(220, t + 0.04, 1.1, 0.12, 'sine', this.rv);
    // Impact métallique initial
    Audio.noise(t, 0.08, 0.45, 1200, this.bus);
    // Harmoniques montantes (clocher)
    [330, 440, 550, 660].forEach((freq, i) => {
      Audio.osc(freq, t + 0.06 + i * 0.07, 0.8 - i * 0.12, 0.06 - i * 0.01, 'sine', this.rv);
    });
  },
};

// ══ MUSIC ════════════════════════════════════════════════════════
const Music = {
  enabled: true,
  _current: null,   // active HTMLAudioElement
  _trackIdx: 0,     // which track is playing
  _volume: 0.55,

  // Base64 MP3 tracks — cycle per floor
  _tracks: [
    'assets/audio/track1.mp3',
    'assets/audio/track2.mp3',
    'assets/audio/track3.mp3',
    'assets/audio/track4.mp3',
  ],

  // Call once on first interaction to satisfy browser autoplay policy
  init() {
    // Pre-create audio elements so they're ready
    if (!this._els) {
      this._els = this._tracks.map(src => {
        const a = new window.Audio(src);
        a.loop = true;
        a.volume = 0;
        a.preload = 'auto';
        return a;
      });
    }
    this.playTrack(0);
  },

  // Start playing track n (0-indexed), fade out current, fade in new
  playTrack(idx) {
    const next = this._els[idx % this._els.length];
    const prev = this._current;
    this._trackIdx = idx % this._els.length;

    if (!this.enabled) return;

    // Fade out previous
    if (prev && prev !== next) {
      this._fadeTo(prev, 0, 1200, () => { prev.pause(); prev.currentTime = 0; });
    }

    // Start + fade in next
    next.currentTime = 0;
    next.volume = 0;
    next.play().catch(() => {});
    this._fadeTo(next, this._volume, 1800);
    this._current = next;
  },

  // Change track when entering a new floor
  onFloor(floor) {
    if (!this._els) return; // not yet initialised (before first interaction)
    const idx = (floor - 1) % this._tracks.length;
    if (this._current === this._els[idx]) return; // already playing
    this.playTrack(idx);
  },

  pause() {
    if (this._current) this._fadeTo(this._current, 0, 800, () => this._current?.pause());
  },

  resume() {
    if (!this.enabled || !this._current) return;
    this._current.play().catch(() => {});
    this._fadeTo(this._current, this._volume, 800);
  },

  setVolume(v) {
    this._volume = Math.max(0, Math.min(1, v));
    if (this._current) this._current.volume = this.enabled ? this._volume : 0;
    const el = document.getElementById('vol-music-val');
    if (el) el.textContent = Math.round(this._volume * 100) + '%';
  },

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      if (!this._els) this.init();
      else this.resume();
    } else {
      this.pause();
    }
  },

  // Simple JS volume fade
  _fadeTo(el, target, ms, cb) {
    const steps = 30, interval = ms / steps;
    const start = el.volume, delta = (target - start) / steps;
    let step = 0;
    clearInterval(el._fadeTimer);
    el._fadeTimer = setInterval(() => {
      step++;
      el.volume = Math.max(0, Math.min(1, start + delta * step));
      if (step >= steps) {
        clearInterval(el._fadeTimer);
        el.volume = target;
        if (cb) cb();
      }
    }, interval);
  },
};

// ══ TITLE SAND — particules de sable derrière CRYPTS ════════════
const TitleSand = {
  _raf: null,
  _particles: [],
  _cv: null, _ctx: null,
  _t: 0,

  init() {
    this._cv  = document.getElementById('title-sand');
    if (!this._cv) return;
    this._ctx = this._cv.getContext('2d');
    this._resize();
    window.addEventListener('resize', () => this._resize());
    // Démarrer avec un délai pour coïncider avec fadeSlideUp du titre (0.5s)
    setTimeout(() => this._start(), 1400);
  },

  _resize() {
    const w = this._cv.offsetWidth  || 400;
    const h = this._cv.offsetHeight || 160;
    this._cv.width  = w;
    this._cv.height = h;
  },

  _start() {
    this._t = 0;
    this._particles = [];
    const run = () => {
      this._tick();
      this._raf = requestAnimationFrame(run);
    };
    run();
  },

  _spawn() {
    const cv = this._cv;
    const cx = cv.width / 2;
    const baseY = cv.height * 0.72; // ligne de base du texte
    // Grains émergent d'une zone large sous le texte
    const spread = cv.width * 0.38;
    const x = cx + (Math.random() - 0.5) * spread * 2;
    // Vitesses : surtout vers le haut, légère dérive latérale
    const vx = (Math.random() - 0.5) * 0.7;
    const vy = -(0.55 + Math.random() * 1.4);   // montée
    const life = 60 + Math.random() * 90;         // frames

    // Couleur sable/or
    const cols = ['#f0d080','#c9a84c','#e0b840','#ffee90','#8a6010'];
    const col  = cols[Math.floor(Math.random() * cols.length)];
    const size = 0.8 + Math.random() * 1.8;

    this._particles.push({ x, y: baseY, vx, vy, life, maxLife: life, col, size, spin: Math.random() * Math.PI * 2 });
  },

  _tick() {
    this._t++;
    const cv = this._cv, ctx = this._ctx;
    if (!cv) return;

    // Spawn rate : rafale en début puis flux continu plus léger
    const spawnRate = this._t < 80 ? 6 : this._t < 200 ? 3 : 1.2;
    for (let i = 0; i < spawnRate; i++) {
      if (Math.random() < (spawnRate % 1 === 0 ? 1 : spawnRate % 1)) this._spawn();
    }

    // Fond transparent
    ctx.clearRect(0, 0, cv.width, cv.height);

    // Update + draw
    this._particles = this._particles.filter(p => p.life > 0);
    for (const p of this._particles) {
      const progress = 1 - p.life / p.maxLife;  // 0→1
      const alpha    = Math.sin(progress * Math.PI) * 0.75; // fade in/out

      // Légère turbulence
      p.vx += (Math.random() - 0.5) * 0.06;
      p.vy -= 0.008; // accélération vers le haut
      p.x  += p.vx;
      p.y  += p.vy;
      p.spin += 0.08;
      p.life--;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin);

      // Forme : carré pixelisé (pixel art grain de sable)
      ctx.fillStyle = p.col;
      const s = p.size;
      ctx.fillRect(-s/2, -s/2, s, s);

      // Traînée lumineuse sur les grains rapides
      if (p.vy < -1.0) {
        ctx.globalAlpha = alpha * 0.25;
        ctx.fillRect(-s/4, s/2, s/2, Math.abs(p.vy) * 2);
      }

      ctx.restore();
    }
  },

  stop() {
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
  }
};

// ══ MENU SFX — pont léger (Audio pas encore init au menu titre) ═
const MenuSFX = {
  _ctx: null,
  _ready: false,

  // Appelé une fois dès le premier geste (mousemove, click, keydown)
  _init() {
    if (this._ctx) {
      // Reprendre si suspendu (politique autoplay)
      if (this._ctx.state === 'suspended') this._ctx.resume();
      return;
    }
    try {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this._ctx.state === 'suspended') this._ctx.resume();
      this._ready = true;
    } catch(e) {}
  },

  // Initialiser dès le premier geste utilisateur sur la page
  _attach() {
    const go = () => {
      this._init();
      document.removeEventListener('mousemove', go);
      document.removeEventListener('click', go);
      document.removeEventListener('keydown', go);
      document.removeEventListener('touchstart', go);
    };
    document.addEventListener('mousemove',  go, { once: true });
    document.addEventListener('click',      go, { once: true });
    document.addEventListener('keydown',    go, { once: true });
    document.addEventListener('touchstart', go, { once: true });
  },

  _resume() {
    if (this._ctx && this._ctx.state === 'suspended') this._ctx.resume();
  },

  _osc(freq, dur, vol, type = 'triangle', detune = 0) {
    if (!this._ctx) return; this._resume();
    const t = this._ctx.currentTime;
    const o = this._ctx.createOscillator();
    const g = this._ctx.createGain();
    o.type = type; o.frequency.value = freq; o.detune.value = detune;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this._ctx.destination);
    o.start(t); o.stop(t + dur + 0.02);
  },

  _noise(ffreq, dur, vol) {
    if (!this._ctx) return; this._resume();
    const t = this._ctx.currentTime;
    const buf = this._ctx.createBuffer(1, this._ctx.sampleRate * dur, this._ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 0.7);
    const src = this._ctx.createBufferSource(); src.buffer = buf;
    const f = this._ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = ffreq; f.Q.value = 2;
    const g = this._ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(this._ctx.destination);
    src.start(t); src.stop(t + dur + 0.02);
  },

  hover() {
    this._init();
    this._osc(1320, 0.06, 0.035, 'triangle');
    this._osc(1760, 0.04, 0.018, 'sine');
  },

  select() {
    this._init(); this._resume();
    this._noise(600, 0.04, 0.22);
    this._osc(180, 0.08, 0.16, 'sine');
    this._osc(440, 0.2, 0.09, 'triangle');
    this._osc(660, 0.14, 0.05, 'sine');
    setTimeout(() => this._osc(1100, 0.12, 0.03, 'sine'), 90);
  },

  panelOpen() {
    this._init(); this._resume();
    if (!this._ctx) return;
    const t = this._ctx.currentTime;
    const o = this._ctx.createOscillator(), g = this._ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(380, t + 0.22);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.14, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.connect(g); g.connect(this._ctx.destination);
    o.start(t); o.stop(t + 0.33);
    this._noise(1800, 0.1, 0.15);
    setTimeout(() => this._osc(550, 0.2, 0.07, 'triangle'), 140);
  },

  panelClose() {
    this._init(); this._resume();
    if (!this._ctx) return;
    const t = this._ctx.currentTime;
    const o = this._ctx.createOscillator(), g = this._ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(380, t);
    o.frequency.exponentialRampToValueAtTime(90, t + 0.18);
    g.gain.setValueAtTime(0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.connect(g); g.connect(this._ctx.destination);
    o.start(t); o.stop(t + 0.25);
    this._noise(900, 0.06, 0.12);
  },

  irisClose() {
    this._init(); this._resume();
    if (!this._ctx) return;
    const t = this._ctx.currentTime;
    const o = this._ctx.createOscillator(), g = this._ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(28, t + 0.5);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.2, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    o.connect(g); g.connect(this._ctx.destination); o.start(t); o.stop(t + 0.6);
    const buf = this._ctx.createBuffer(1, this._ctx.sampleRate * 0.4, this._ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 0.4);
    const src = this._ctx.createBufferSource(); src.buffer = buf;
    const flt = this._ctx.createBiquadFilter(); flt.type = 'lowpass';
    flt.frequency.setValueAtTime(1100, t); flt.frequency.exponentialRampToValueAtTime(70, t + 0.4);
    const gn = this._ctx.createGain(); gn.gain.setValueAtTime(0.25, t); gn.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    src.connect(flt); flt.connect(gn); gn.connect(this._ctx.destination);
    src.start(t); src.stop(t + 0.42);
  },

  irisOpen() {
    this._init(); this._resume();
    if (!this._ctx) return;
    const t = this._ctx.currentTime;
    const o = this._ctx.createOscillator(), g = this._ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(55, t); o.frequency.exponentialRampToValueAtTime(220, t + 0.55);
    g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.16, t + 0.12);
    g.gain.setValueAtTime(0.16, t + 0.35); g.gain.exponentialRampToValueAtTime(0.001, t + 0.75);
    o.connect(g); g.connect(this._ctx.destination); o.start(t); o.stop(t + 0.8);
    [220, 330, 440].forEach((f, i) => setTimeout(() => this._osc(f, 0.45 - i * 0.06, 0.08 - i * 0.02, 'sine'), 150 + i * 100));
    setTimeout(() => { this._osc(1760, 0.35, 0.03, 'sine'); this._osc(2200, 0.28, 0.02, 'sine'); }, 330);
    this._noise(500, 0.22, 0.15);
  },

  ready() {
    this._init(); this._resume();
    if (!this._ctx) return;
    const t = this._ctx.currentTime;
    [110, 165, 220].forEach((f, i) => {
      const o = this._ctx.createOscillator(), g = this._ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, t + i * 0.02); g.gain.linearRampToValueAtTime(0.22 - i * 0.05, t + i * 0.02 + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.6 - i * 0.2);
      o.connect(g); g.connect(this._ctx.destination); o.start(t + i * 0.02); o.stop(t + 1.7);
    });
    this._noise(1200, 0.08, 0.35);
    [330, 440, 550, 660].forEach((f, i) => setTimeout(() => this._osc(f, 0.7 - i * 0.1, 0.055 - i * 0.008, 'sine'), 55 + i * 65));
  },
};
const ACH_KEY = 'coe_achievements';
const ACHIEVEMENTS = [
  // ── Exploration ──
  { id:'floor2',        icon:'🗝️',  name:'Premiers Pas',        cat:'Exploration', desc:'Atteindre l\'étage 2.',                             cond: s => s.maxFloor >= 2 },
  { id:'floor5',        icon:'🕯️',  name:'Les Profondeurs',      cat:'Exploration', desc:'Atteindre l\'étage 5.',                             cond: s => s.maxFloor >= 5 },
  { id:'floor10',       icon:'💀',  name:'Sans Retour',          cat:'Exploration', desc:'Atteindre l\'étage 10.',                            cond: s => s.maxFloor >= 10 },
  { id:'floor15',       icon:'🌑',  name:'Avalé par les Ténèbres',cat:'Exploration', desc:'Atteindre l\'étage 15.',                           cond: s => s.maxFloor >= 15 },
  { id:'floor20',       icon:'♾️',  name:'Éternité',             cat:'Exploration', desc:'Atteindre l\'étage 20.',                            cond: s => s.maxFloor >= 20 },
  { id:'chest20',       icon:'📦',  name:'Chasseur de Trésors',  cat:'Exploration', desc:'Ouvrir 20 coffres.',                                cond: s => s.totalChests >= 20 },
  { id:'chest50',       icon:'💎',  name:'Collectionneur',       cat:'Exploration', desc:'Ouvrir 50 coffres.',                                cond: s => s.totalChests >= 50 },
  { id:'trap10',        icon:'⚠️',  name:'Piégé !',              cat:'Exploration', desc:'Déclencher 10 pièges.',                             cond: s => s.totalTraps >= 10 },
  { id:'trapdodge5',    icon:'🌀',  name:'Danse de l\'Ombre',    cat:'Exploration', desc:'Esquiver 5 pièges.',                                cond: s => s.trapDodges >= 5 },
  { id:'stairs30',      icon:'🪜',  name:'Spéléologue',          cat:'Exploration', desc:'Emprunter 30 escaliers.',                           cond: s => s.totalStairs >= 30 },

  // ── Combat ──
  { id:'first_blood',   icon:'⚔️',  name:'Premier Sang',         cat:'Combat',     desc:'Vaincre votre premier ennemi.',                     cond: s => s.totalKills >= 1 },
  { id:'kill10',        icon:'🗡️',  name:'Guerrier en Herbe',    cat:'Combat',     desc:'Éliminer 10 ennemis.',                              cond: s => s.totalKills >= 10 },
  { id:'kill50',        icon:'💀',  name:'Moissonneur',          cat:'Combat',     desc:'Éliminer 50 ennemis.',                              cond: s => s.totalKills >= 50 },
  { id:'kill200',       icon:'🩸',  name:'Bain de Sang',         cat:'Combat',     desc:'Éliminer 200 ennemis.',                             cond: s => s.totalKills >= 200 },
  { id:'kill500',       icon:'☠️',  name:'Légende des Cryptes',  cat:'Combat',     desc:'Éliminer 500 ennemis.',                             cond: s => s.totalKills >= 500 },
  { id:'crit1',         icon:'✦',   name:'Coup de Chance',       cat:'Combat',     desc:'Réaliser un premier coup critique.',                 cond: s => s.totalCrits >= 1 },
  { id:'crit50',        icon:'💥',  name:'Lame Fatale',          cat:'Combat',     desc:'Réaliser 50 coups critiques.',                      cond: s => s.totalCrits >= 50 },
  { id:'crit200',       icon:'⚡',  name:'Fureur Absolue',       cat:'Combat',     desc:'Réaliser 200 coups critiques.',                     cond: s => s.totalCrits >= 200 },
  { id:'dodge20',       icon:'💨',  name:'Insaisissable',        cat:'Combat',     desc:'Esquiver 20 attaques ennemies.',                    cond: s => s.totalDodges >= 20 },
  { id:'overkill',      icon:'🔥',  name:'Démesure',             cat:'Combat',     desc:'Infliger 50+ dégâts en un seul coup.',              cond: s => s.maxSingleHit >= 50 },
  { id:'sweep10',       icon:'🌊',  name:'Faucheur',             cat:'Combat',     desc:'Toucher 10 ennemis avec le balayage.',              cond: s => s.sweepHits >= 10 },

  // ── Boss ──
  { id:'boss_slay',     icon:'👁️',  name:'Tueur de Seigneur',   cat:'Boss',       desc:'Vaincre un boss des cryptes.',                      cond: s => s.bossKills >= 1 },
  { id:'boss3',         icon:'👑',  name:'Domination',          cat:'Boss',       desc:'Vaincre 3 boss.',                                   cond: s => s.bossKills >= 3 },
  { id:'boss10',        icon:'🏆',  name:'Fléau des Titans',    cat:'Boss',       desc:'Vaincre 10 boss.',                                  cond: s => s.bossKills >= 10 },
  { id:'boss_quick',    icon:'⚡',  name:'Exécution Éclair',    cat:'Boss',       desc:'Vaincre un boss en moins de 10 coups.',             cond: s => s.fastBossKills >= 1 },

  // ── Magie ──
  { id:'spell1',        icon:'🔮',  name:'Apprenti Mage',       cat:'Magie',      desc:'Lancer votre premier sort.',                        cond: s => s.totalSpells >= 1 },
  { id:'spell50',       icon:'🌩️',  name:'Invocateur',          cat:'Magie',      desc:'Lancer 50 sorts.',                                  cond: s => s.totalSpells >= 50 },
  { id:'spell200',      icon:'🌌',  name:'Archimage',           cat:'Magie',      desc:'Lancer 200 sorts.',                                 cond: s => s.totalSpells >= 200 },
  { id:'multihit5',     icon:'💫',  name:'Tempête Arcanique',   cat:'Magie',      desc:'Toucher 5 ennemis avec un seul sort.',              cond: s => s.maxSpellHits >= 5 },

  // ── Richesse ──
  { id:'gold100',       icon:'🪙',  name:'Pécheur Mineur',      cat:'Richesse',   desc:'Accumuler 100 pièces d\'or.',                       cond: s => s.maxGold >= 100 },
  { id:'gold500',       icon:'💰',  name:'Thésauriseur',        cat:'Richesse',   desc:'Accumuler 500 pièces d\'or.',                       cond: s => s.maxGold >= 500 },
  { id:'gold2000',      icon:'👛',  name:'Nabab des Profondeurs',cat:'Richesse',  desc:'Accumuler 2000 pièces d\'or.',                      cond: s => s.maxGold >= 2000 },
  { id:'shop5',         icon:'🛒',  name:'Bon Client',          cat:'Richesse',   desc:'Visiter le marchand 5 fois.',                       cond: s => s.shopVisits >= 5 },
  { id:'buyfull',       icon:'🗃️',  name:'Arsenal Complet',     cat:'Richesse',   desc:'Avoir 3 armures au niveau max.',                    cond: s => s.maxArmorFull >= 1 },

  // ── Progression ──
  { id:'level5',        icon:'⭐',  name:'Héros en Devenir',    cat:'Progression', desc:'Atteindre le niveau 5.',                           cond: s => s.maxLevel >= 5 },
  { id:'level10',       icon:'🌟',  name:'Héros Confirmé',      cat:'Progression', desc:'Atteindre le niveau 10.',                          cond: s => s.maxLevel >= 10 },
  { id:'level20',       icon:'💫',  name:'Légende Vivante',     cat:'Progression', desc:'Atteindre le niveau 20.',                          cond: s => s.maxLevel >= 20 },
  { id:'buff5',         icon:'🧪',  name:'Cocktail de Puissance',cat:'Progression', desc:'Avoir 5 buffs actifs simultanément.',              cond: s => s.maxBuffs >= 5 },
  { id:'buff10',        icon:'🔱',  name:'Être Transcendant',   cat:'Progression', desc:'Avoir 10 buffs actifs simultanément.',             cond: s => s.maxBuffs >= 10 },
  { id:'upgrade20',     icon:'⬆️',  name:'Amélioration Continue',cat:'Progression', desc:'Choisir 20 améliorations de fin de niveau.',      cond: s => s.totalUpgrades >= 20 },

  // ── Survie ──
  { id:'survive_1hp',   icon:'❤️',  name:'Miraculé',            cat:'Survie',     desc:'Survivre avec 1 PV restant.',                       cond: s => s.nearDeaths >= 1 },
  { id:'survive_3hp',   icon:'🩹',  name:'Résistant',           cat:'Survie',     desc:'Survivre 3 fois avec ≤3 PV.',                       cond: s => s.nearDeaths >= 3 },
  { id:'lich',          icon:'⚰️',  name:'Phylactère',          cat:'Survie',     desc:'Être ressuscité par le Lich.',                      cond: s => s.lichRevives >= 1 },
  { id:'clean_run',     icon:'🕯️',  name:'Survivant',           cat:'Survie',     desc:'Atteindre l\'étage 3 sans mourir.',                 cond: s => s.cleanRuns >= 1 },
  { id:'tankhit',       icon:'🛡️',  name:'Mur de Chair',        cat:'Survie',     desc:'Encaisser 1000 dégâts au total.',                   cond: s => s.totalDamageTaken >= 1000 },
  { id:'thorns10',      icon:'🌵',  name:'Peau de Ronces',      cat:'Survie',     desc:'Renvoi 10 dégâts d\'épines aux ennemis.',           cond: s => s.thornsDamage >= 10 },

  // ── Curiosités ──
  { id:'merchant3',     icon:'🧙',  name:'Ami du Marchand',     cat:'Curiosités', desc:'Parler au marchand 3 fois de suite.',               cond: s => s.shopVisits >= 3 },
  { id:'vamp5',         icon:'🧛',  name:'Vampirique',          cat:'Curiosités', desc:'Drainer 50 PV via vampirisme.',                     cond: s => s.vampireDrain >= 50 },
  { id:'death3',        icon:'💔',  name:'Coriace',             cat:'Curiosités', desc:'Mourir 3 fois (persistance de l\'âme).',            cond: s => s.totalDeaths >= 3 },
  { id:'death10',       icon:'☠️',  name:'Punition Perpétuelle', cat:'Curiosités', desc:'Mourir 10 fois. Vraiment ?',                       cond: s => s.totalDeaths >= 10 },
  { id:'burn20',        icon:'🔥',  name:'Briquet des Abysses', cat:'Curiosités', desc:'Infliger 20 dégâts de feu.',                        cond: s => s.burnDamage >= 20 },
];

const Achievements = {
  _stats: null,

  load() {
    try {
      this._stats = JSON.parse(localStorage.getItem(ACH_KEY)) || this._defaultStats();
    } catch(e) { this._stats = this._defaultStats(); }
  },

  save() {
    try { localStorage.setItem(ACH_KEY, JSON.stringify(this._stats)); } catch(e) {}
  },

  _defaultStats() {
    return { totalKills:0, bossKills:0, maxFloor:0, maxGold:0,
             maxLevel:0, totalSpells:0, totalCrits:0, cleanRuns:0,
             totalChests:0, totalTraps:0, trapDodges:0, totalStairs:0,
             totalDodges:0, maxSingleHit:0, sweepHits:0, fastBossKills:0,
             maxSpellHits:0, shopVisits:0, maxArmorFull:0, maxBuffs:0,
             totalUpgrades:0, nearDeaths:0, lichRevives:0, totalDamageTaken:0,
             thornsDamage:0, vampireDrain:0, totalDeaths:0, burnDamage:0,
             unlocked:{} };
  },

  get s() {
    if (!this._stats) this.load();
    return this._stats;
  },

  bump(key, amount=1) {
    this.s[key] = (this.s[key]||0) + amount;
    this.checkAll();
    this.save();
  },

  set(key, val) {
    if ((this.s[key]||0) < val) { this.s[key] = val; this.checkAll(); this.save(); }
  },

  checkAll() {
    ACHIEVEMENTS.forEach(a => {
      if (!this.s.unlocked[a.id] && a.cond(this.s)) {
        this.s.unlocked[a.id] = Date.now();
        this._notify(a);
      }
    });
  },

  _notify(a) {
    // Small toast in top-right during gameplay
    if (!document.getElementById('title-screen').classList.contains('hidden') &&
        document.getElementById('title-screen').style.display !== 'none') return;
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);
      z-index:400;font-family:'Cinzel',serif;font-size:9px;letter-spacing:3px;
      color:#f0d080;background:rgba(8,5,12,.95);border:1px solid rgba(201,168,76,.4);
      padding:10px 20px;text-transform:uppercase;
      box-shadow:0 0 20px rgba(201,168,76,.2);
      animation:fadeMsg 4s ease-in forwards;pointer-events:none`;
    el.textContent = `✦ Succès débloqué : ${a.name}`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4200);
  },

  unlockCount() {
    return Object.keys(this.s.unlocked).length;
  },

  buildGrid() {
    const grid = document.getElementById('ach-grid');
    const summ = document.getElementById('ach-summary');
    const n = this.unlockCount();
    summ.textContent = `${n} / ${ACHIEVEMENTS.length} débloqués`;

    // Group by category
    const cats = {};
    ACHIEVEMENTS.forEach(a => { (cats[a.cat] = cats[a.cat]||[]).push(a); });

    grid.innerHTML = Object.entries(cats).map(([cat, achs]) => `
      <div class="ach-cat-header">${cat}</div>
      ${achs.map(a => {
        const unlocked = !!this.s.unlocked[a.id];
        const prog = this._progress(a);
        return `<div class="ach-card${unlocked?' unlocked':''}">
          <span class="ach-card-icon">${a.icon}</span>
          <div class="ach-card-name">${a.name}</div>
          <div class="ach-card-desc">${a.desc}</div>
          ${prog ? `<div class="ach-progress">${prog}</div>` : ''}
          <span class="ach-card-badge">✦</span>
        </div>`;
      }).join('')}
    `).join('');
  },

  _progress(a) {
    const s = this.s;
    const thresholds = {
      'kill10':50,'kill50':50,'kill200':200,'kill500':500,
      'floor5':5,'floor10':10,'floor15':15,'floor20':20,
      'crit50':50,'crit200':200,'spell50':50,'spell200':200,
      'chest20':20,'chest50':50,'boss3':3,'boss10':10,
      'trap10':10,'stairs30':30,'dodge20':20,'gold100':100,
      'gold500':500,'gold2000':2000,'shop5':5,'level5':5,
      'level10':10,'level20':20,'upgrade20':20,'buff5':5,'buff10':10,
      'survive_3hp':3,'thorns10':10,'vamp5':50,'death3':3,'death10':10,
      'tankhit':1000,'burn20':20,'crit1':1,'spell1':1,
    };
    const keys = {
      'kill10':'totalKills','kill50':'totalKills','kill200':'totalKills','kill500':'totalKills',
      'floor5':'maxFloor','floor10':'maxFloor','floor15':'maxFloor','floor20':'maxFloor',
      'crit50':'totalCrits','crit200':'totalCrits','crit1':'totalCrits',
      'spell50':'totalSpells','spell200':'totalSpells','spell1':'totalSpells',
      'chest20':'totalChests','chest50':'totalChests',
      'boss3':'bossKills','boss10':'bossKills',
      'trap10':'totalTraps','stairs30':'totalStairs','dodge20':'totalDodges',
      'gold100':'maxGold','gold500':'maxGold','gold2000':'maxGold',
      'shop5':'shopVisits','level5':'maxLevel','level10':'maxLevel','level20':'maxLevel',
      'upgrade20':'totalUpgrades','buff5':'maxBuffs','buff10':'maxBuffs',
      'survive_3hp':'nearDeaths','thorns10':'thornsDamage',
      'vamp5':'vampireDrain','death3':'totalDeaths','death10':'totalDeaths',
      'tankhit':'totalDamageTaken','burn20':'burnDamage',
    };
    if (keys[a.id]) {
      const cur = Math.min(s[keys[a.id]]||0, thresholds[a.id]);
      return `${cur} / ${thresholds[a.id]}`;
    }
    return null;
  }
};

// ══ TITLE UI ════════════════════════════════════════════════════
const TitleUI = {
  _particlesEnabled: true,
  _scanlinesEnabled: true,
  _saveData: null,

  async init() {
    Achievements.load();
    TitleSand.init();
    // Détecte si une sauvegarde existe
    await this._checkSave();
  },

  async _checkSave() {
    let raw = null;
    try {
      if (window.storage) {
        // Timeout de sécurité : si window.storage ne répond pas en 2s, on continue sans sauvegarde
        const withTimeout = (promise, ms) => Promise.race([
          promise,
          new Promise(resolve => setTimeout(() => resolve(null), ms))
        ]);
        const r = await withTimeout(window.storage.get('coe_save'), 2000);
        if (r) raw = r.value;
      }
    } catch(e) {}
    if (!raw) {
      try { raw = localStorage.getItem('coe_save'); } catch(e) {}
    }
    if (raw) {
      try {
        this._saveData = JSON.parse(raw);
        const btn = document.getElementById('btn-continue');
        if (btn) {
          btn.style.display = '';
          const p = this._saveData.player;
          btn.title = `Étage ${this._saveData.floor} · Niveau ${p.level} · ${p.hp}/${p.maxHp} PV`;
        }
      } catch(e) { this._saveData = null; }
    }
  },

  continueGame() {
    if (!this._saveData) { this.startGame(); return; }
    MenuSFX.select();
    TitleSand.stop();
    const ts = document.getElementById('title-screen');
    ts.classList.add('title-exit');
    setTimeout(() => {
      MenuSFX.irisClose();
      FX.irisClose(520, () => {
        ts.classList.add('hidden');
        ts.classList.remove('visible', 'title-exit');
        Audio.init(); Music.init();
        const ls = document.getElementById('loading-screen');
        ls.classList.add('visible');
        this._runLoadingBar(() => {
          ls.classList.remove('visible');
          log('CRYPTS OF ETERNITY', '#c9a84c');
          log('Partie restaurée !', '#80d0a0');
          G._doInitFromSave(this._saveData);
          MenuSFX.irisOpen();
          setTimeout(() => FX.irisOpen(750), 80);
        });
      });
    }, 380);
  },

  open(panel) {
    MenuSFX.select();
    setTimeout(() => MenuSFX.panelOpen(), 60);
    if (panel === 'achievements') Achievements.buildGrid();
    document.getElementById(`panel-${panel}`).classList.add('open');
  },

  close(panel) {
    MenuSFX.panelClose();
    document.getElementById(`panel-${panel}`).classList.remove('open');
  },

  setMusicEnabled(on) {
    document.getElementById('opt-music-on').classList.toggle('active', on);
    document.getElementById('opt-music-off').classList.toggle('active', !on);
    if (Music.enabled !== on) Music.toggle();
  },

  setParticles(on) {
    this._particlesEnabled = on;
    document.getElementById('opt-particles-on').classList.toggle('active', on);
    document.getElementById('opt-particles-off').classList.toggle('active', !on);
  },

  setScanlines(on) {
    this._scanlinesEnabled = on;
    document.getElementById('opt-scan-on').classList.toggle('active', on);
    document.getElementById('opt-scan-off').classList.toggle('active', !on);
    document.getElementById('scan').style.opacity = on ? '1' : '0';
  },

  quit() {
    if (confirm('Quitter le jeu ?')) {
      window.close();
      // Fallback if window.close() is blocked
      document.getElementById('title-screen').innerHTML =
        `<div style="font-family:Cinzel,serif;font-size:14px;letter-spacing:4px;
          color:rgba(201,168,76,.5);text-align:center;position:relative;z-index:1">
          <div style="font-size:32px;margin-bottom:16px">☽✦☾</div>
          Merci d'avoir joué à<br>
          <span style="color:#f0d080;font-size:20px;display:block;margin-top:10px">
            Crypts of Eternity</span>
        </div>`;
    }
  },

  startGame() {
    MenuSFX.select();
    TitleSand.stop();
    const ts = document.getElementById('title-screen');
    ts.classList.add('title-exit');

    setTimeout(() => {
      // Iris close → black
      MenuSFX.irisClose();
      FX.irisClose(520, () => {
        ts.classList.add('hidden');
        ts.classList.remove('visible', 'title-exit');
        Audio.init(); Music.init();

        const ls = document.getElementById('loading-screen');
        ls.classList.add('visible');

        this._runLoadingBar(() => {
          ls.classList.remove('visible');
          log('CRYPTS OF ETERNITY', '#c9a84c');
          log('ZQSD/WASD déplacer · ESPACE sort · ESC pause', '#907080');
          G._doInit();
          MenuSFX.irisOpen();
          setTimeout(() => FX.irisOpen(750), 80);
        });
      });
    }, 380);
  },

  _flavors: [
    'Génération des cryptes…',
    'Invocation des ténèbres…',
    'Peuplement des donjons…',
    'Forge des artefacts…',
    'Éveil des gardiens…',
    'Tissage des malédictions…',
    'Allumage des torches…',
    'Tracé des couloirs…',
    'Préparation du chaos…',
    'Les profondeurs vous appellent…',
  ],

  _runLoadingBar(onDone) {
    const bar = document.getElementById('loading-bar');
    const pct = document.getElementById('loading-pct');
    const flav = document.getElementById('loading-flavor');
    let progress = 0;
    let fi = 0;

    const updateFlavor = () => {
      flav.style.opacity = '0';
      setTimeout(() => {
        flav.textContent = this._flavors[fi % this._flavors.length];
        flav.style.opacity = '1';
        fi++;
      }, 250);
    };

    updateFlavor();
    const flavorTimer = setInterval(updateFlavor, 900);

    const step = () => {
      // Non-linear progress — slows near 100%
      const inc = progress < 60 ? (4 + Math.random()*6) :
                  progress < 85 ? (1.5 + Math.random()*3) :
                  progress < 95 ? (0.5 + Math.random()*1) : 0.2;
      progress = Math.min(100, progress + inc);
      bar.style.width = progress + '%';
      pct.textContent = Math.floor(progress) + '%';

      if (progress < 100) {
        setTimeout(step, progress < 60 ? 80 : progress < 85 ? 120 : 180);
      } else {
        clearInterval(flavorTimer);
        setTimeout(onDone, 400);
      }
    };
    setTimeout(step, 200);
  },
};

// ══ PERM UPGRADES — Améliorations marchand permanentes (survivent à la mort) ═
const PermUpgrades = {
  armorLevels: { helmet: 0, chestplate: 0, leggings: 0, boots: 0 },
  weaponLevel: 0,
  weaponAtkApplied: 0,

  // Sync from current player (called after each shop upgrade)
  syncFrom(player) {
    for (const k of Object.keys(this.armorLevels)) {
      this.armorLevels[k] = Math.max(this.armorLevels[k], player.armorLevels[k] || 0);
    }
    if (player.weaponLevel > this.weaponLevel) {
      this.weaponAtkApplied += (player.weaponLevel - this.weaponLevel) * 2;
      this.weaponLevel = player.weaponLevel;
    }
  },

  // Apply to a fresh player (called in restart)
  applyTo(player) {
    // Armor
    for (const k of Object.keys(this.armorLevels)) {
      const lvs = this.armorLevels[k];
      if (lvs > 0) {
        player.armorLevels[k] = lvs;
        // Re-apply armor stats for each level gained
        for (let i = 0; i < lvs; i++) applyArmorUpgrade(player, k);
      }
    }
    // Weapon upgrades
    if (this.weaponLevel > 0) {
      player.weaponLevel = this.weaponLevel;
      player.atk += this.weaponAtkApplied;
      player._weaponAtkApplied = (player._weaponAtkApplied || 0) + this.weaponAtkApplied;
    }
  },

  save() {
    try { localStorage.setItem('coe_perm', JSON.stringify({ a: this.armorLevels, w: this.weaponLevel, wa: this.weaponAtkApplied })); } catch(e) {}
  },

  load() {
    try {
      const d = JSON.parse(localStorage.getItem('coe_perm') || 'null');
      if (!d) return;
      if (d.a) Object.assign(this.armorLevels, d.a);
      this.weaponLevel = d.w || 0;
      this.weaponAtkApplied = d.wa || 0;
    } catch(e) {}
  },

  reset() {
    this.armorLevels = { helmet: 0, chestplate: 0, leggings: 0, boots: 0 };
    this.weaponLevel = 0; this.weaponAtkApplied = 0;
    try { localStorage.removeItem('coe_perm'); } catch(e) {}
  },
};

// ══ PAUSE UI — Sub-panels depuis le menu pause ══════════════════
const PauseUI = {
  open(panel) {
    MenuSFX.select();
    setTimeout(() => MenuSFX.panelOpen(), 60);
    if (panel === 'achievements') Achievements.buildGrid();
    document.getElementById(`panel-${panel}`).classList.add('open');
  },

  async save() {
    MenuSFX.select();
    const s = G.state;
    if (!s || !s.player) { return; }
    const btn = document.getElementById('pause-save-btn');
    try {
      const saveData = {
        floor: s.floor,
        player: {
          hp: s.player.hp, maxHp: s.player.maxHp,
          mp: s.player.mp, maxMp: s.player.maxMp,
          atk: s.player.atk, def: s.player.def,
          level: s.player.level, xp: s.player.xp, xpNext: s.player.xpNext,
          gold: s.player.gold,
          equippedWeapon: s.player.equippedWeapon,
          weaponLevel: s.player.weaponLevel,
          _weaponAtkApplied: s.player._weaponAtkApplied,
          _weaponSweep: s.player._weaponSweep,
          _weaponBurn: s.player._weaponBurn,
          armorLevels: {...s.player.armorLevels},
          vampiric: s.player.vampiric, thorns: s.player.thorns,
          critChance: s.player.critChance, dodgeChance: s.player.dodgeChance,
          spellDmg: s.player.spellDmg, spellRange: s.player.spellRange,
          spellMpCost: s.player.spellMpCost,
          berserker: s.player.berserker,
          buffs: s.player.buffs,
          stamina: s.player.stamina, maxStamina: s.player.maxStamina,
          staminaRegen: s.player.staminaRegen, dashCost: s.player.dashCost,
          dashInvincible: s.player.dashInvincible,
        }
      };
      // Essai window.storage (artifact), fallback localStorage
      let ok = false;
      if (window.storage) {
        const withTimeout = (promise, ms) => Promise.race([
          promise,
          new Promise(resolve => setTimeout(() => resolve(null), ms))
        ]);
        const r = await withTimeout(window.storage.set('coe_save', JSON.stringify(saveData)), 2000);
        ok = !!r;
      }
      if (!ok) {
        localStorage.setItem('coe_save', JSON.stringify(saveData));
        ok = true;
      }
      PermUpgrades.save();
      const orig = btn.innerHTML;
      btn.innerHTML = '<span class="pb-icon">✓</span>Sauvegardé !';
      btn.style.color = 'rgba(80,200,120,.8)';
      setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; }, 1800);
    } catch(e) {
      if (btn) { btn.innerHTML = '<span class="pb-icon">✕</span>Échec !'; btn.style.color = 'rgba(220,80,80,.8)'; setTimeout(() => { btn.innerHTML = '<span class="pb-icon">💾</span>Sauvegarder'; btn.style.color = ''; }, 2000); }
      console.error('Save error:', e);
    }
  },

  quit() {
    MenuSFX.select();
    if (confirm('Quitter et retourner au menu principal ?')) {
      G.paused = false;
      const ps = document.getElementById('pause-screen');
      ps.classList.remove('active');
      // Retour à l'écran titre
      MenuSFX.irisClose();
      FX.irisClose(520, () => {
        document.body.classList.remove('game-started');
        const ts = document.getElementById('title-screen');
        ts.classList.remove('hidden');
        ts.classList.add('visible');
        TitleSand.init();
        MenuSFX.irisOpen();
        setTimeout(() => FX.irisOpen(750), 80);
      });
    }
  },
};

// ══ FX — Iris transition engine ═════════════════════════════════
const FX = {
  _cv: null, _ctx: null,

  _init() {
    if (this._cv) return;
    this._cv = document.getElementById('fx-canvas');
    this._ctx = this._cv.getContext('2d');
    const resize = () => { this._cv.width = innerWidth; this._cv.height = innerHeight; };
    resize(); window.addEventListener('resize', resize);
  },

  // Black screen appears instantly, then iris opens (hole expands from centre)
  irisOpen(ms = 650, onDone) {
    this._init();
    const cv = this._cv, ctx = this._ctx;
    cv.style.display = 'block';
    const cx = cv.width / 2, cy = cv.height / 2;
    const maxR = Math.hypot(cx, cy) * 1.06;
    const fps60 = ms / 16.67;
    let f = 0;
    const tick = () => {
      const ease = f / fps60;
      const r = maxR * (1 - Math.pow(1 - ease, 3)); // ease-out-cubic
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = '#020105';
      ctx.fillRect(0, 0, cv.width, cv.height);
      // Cut the hole
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      // Gold rim at the edge
      if (r > 2 && ease < 0.98) {
        const alpha = (1 - ease) * 0.8;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(201,168,76,${alpha})`; ctx.lineWidth = 3; ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(240,208,128,${alpha * 0.5})`; ctx.lineWidth = 1; ctx.stroke();
      }
      f++;
      if (f <= fps60) requestAnimationFrame(tick);
      else { cv.style.display = 'none'; if (onDone) onDone(); }
    };
    tick();
  },

  // Iris closes (hole shrinks to nothing) then calls onDone
  irisClose(ms = 520, onDone) {
    this._init();
    const cv = this._cv, ctx = this._ctx;
    cv.style.display = 'block';
    const cx = cv.width / 2, cy = cv.height / 2;
    const maxR = Math.hypot(cx, cy) * 1.06;
    const fps60 = ms / 16.67;
    let f = 0;
    const tick = () => {
      const ease = f / fps60;
      const r = maxR * Math.pow(1 - ease, 2.4); // ease-in
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = '#020105';
      ctx.fillRect(0, 0, cv.width, cv.height);
      if (r > 0) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        const alpha = (1 - ease) * 0.55;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(201,168,76,${alpha})`; ctx.lineWidth = 2; ctx.stroke();
      }
      f++;
      if (f <= fps60) requestAnimationFrame(tick);
      else {
        // Stay black
        ctx.clearRect(0,0,cv.width,cv.height);
        ctx.fillStyle = '#020105'; ctx.fillRect(0,0,cv.width,cv.height);
        if (onDone) onDone();
      }
    };
    tick();
  },

  showBlack() {
    this._init();
    const cv = this._cv, ctx = this._ctx;
    cv.style.display = 'block';
    ctx.fillStyle = '#020105';
    ctx.fillRect(0, 0, cv.width, cv.height);
  },

  hide() { if (this._cv) this._cv.style.display = 'none'; }
};

// ══ PRE-LOADER ═══════════════════════════════════════════════════
const Preloader = {
  _rafId: null,

  _steps: [
    { pct: 10,  label: 'Initialisation…' },
    { pct: 25,  label: 'Chargement des polices…' },
    { pct: 42,  label: 'Forge des sprites…' },
    { pct: 58,  label: 'Génération des palettes…' },
    { pct: 72,  label: 'Préparation de l\'audio…' },
    { pct: 85,  label: 'Allumage des torches…' },
    { pct: 95,  label: 'Derniers préparatifs…' },
    { pct: 100, label: 'Prêt.' },
  ],

  run(onTitleReady) {
    this._drawCursor();
    this._startIconAnimation();
    let step = 0;
    const next = () => {
      if (step >= this._steps.length) {
        // Gong solennel : prêt !
        MenuSFX.ready();
        // Title screen becomes ready (invisible but rendered)
        onTitleReady();
        setTimeout(() => {
          FX.showBlack();
          document.getElementById('preloader').style.display = 'none';
          this._stopIconAnimation();
          // Son d'ouverture + iris visuel
          setTimeout(() => { MenuSFX.irisOpen(); FX.irisOpen(750); }, 60);
        }, 420);
        return;
      }
      const s = this._steps[step++];
      this._setProgress(s.pct, s.label);
      if (step === 3) {
        // Timeout de sécurité : si les polices ne chargent pas en 1.5s, on continue quand même
        let fontsDone = false;
        const proceed = () => { if (!fontsDone) { fontsDone = true; setTimeout(next, 60); } };
        document.fonts.ready.then(proceed);
        setTimeout(proceed, 1500);
      }
      else setTimeout(next, (85 + Math.random() * 130) | 0);
    };
    setTimeout(next, 500);
  },

  _setProgress(pct, label) {
    const bar = document.getElementById('pl-bar');
    const stat = document.getElementById('pl-status');
    const pctEl = document.getElementById('pl-pct');
    if (bar) bar.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';
    if (stat) {
      stat.style.opacity = '0';
      setTimeout(() => { stat.textContent = label; stat.style.opacity = '1'; }, 160);
    }
  },

  // ── Animated pixel-art hourglass (24×24, displayed at 96×96) ──
  _startIconAnimation() {
    const cv = document.getElementById('pl-icon-canvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    // Activer l'orbe uniquement maintenant
    const wrap = document.getElementById('pl-icon-wrap');
    if (wrap) setTimeout(() => wrap.classList.add('glow-active'), 80);
    let f = 0;
    const draw = () => {
      ctx.clearRect(0, 0, 24, 24);
      this._drawHourglass(ctx, f++);
      this._rafId = requestAnimationFrame(draw);
    };
    draw();
  },

  _stopIconAnimation() {
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
  },

  _drawHourglass(ctx, f) {
    // Sand cycle: 0→1 over CYCLE frames (sand flows top→bottom, then resets)
    const CYCLE = 200;
    const phase = (f % CYCLE) / CYCLE;         // 0 to 1
    const flipZone = phase > 0.88;              // last 12%: flash & reset
    const sp = flipZone ? 1 : phase / 0.88;    // sand progress 0→1

    const p = (x, y, col, a = 1) => {
      ctx.globalAlpha = a; ctx.fillStyle = col;
      ctx.fillRect(x, y, 1, 1); ctx.globalAlpha = 1;
    };

    // ── Palette ──
    const FD = '#1c0c02', FM = '#6a3c10', FL = '#c9a84c', FH = '#f0d080';
    const GL = '#05020d';                           // empty glass
    const SM = '#c9a84c', SH = '#f0d080', SD = '#8a5010'; // sand
    const NK = '#ffe060';                           // neck glow

    // ── Top frame bar  y=1,2 ──
    for (let x = 4; x <= 19; x++) {
      p(x, 1, FD);
      p(x, 2, x === 4 || x === 19 ? FM : FL);
    }
    p(5, 2, FH); p(6, 2, FL); // corner highlight

    // ── Bottom frame bar  y=21,22 ──
    for (let x = 4; x <= 19; x++) {
      p(x, 21, x === 4 || x === 19 ? FM : FL);
      p(x, 22, FD);
    }
    p(5, 21, FH);

    // ── Glass scanlines ──
    // Format: {y, l, r}  (l/r = wall x, interior = l+1..r-1)
    const upper = [
      { y: 3,  l: 4, r: 19 },
      { y: 4,  l: 5, r: 18 },
      { y: 5,  l: 6, r: 17 },
      { y: 6,  l: 7, r: 16 },
      { y: 7,  l: 8, r: 15 },
      { y: 8,  l: 9, r: 14 },
      { y: 9,  l: 10, r: 13 },
      { y: 10, l: 11, r: 12 }, // neck top
    ];
    const lower = [
      { y: 11, l: 11, r: 12 }, // neck bottom
      { y: 12, l: 10, r: 13 },
      { y: 13, l: 9,  r: 14 },
      { y: 14, l: 8,  r: 15 },
      { y: 15, l: 7,  r: 16 },
      { y: 16, l: 6,  r: 17 },
      { y: 17, l: 5,  r: 18 },
      { y: 18, l: 4,  r: 19 },
      { y: 19, l: 4,  r: 19 }, // base élargie
      { y: 20, l: 4,  r: 19 }, // base élargie
    ];
    const sandRows = upper.length; // 8

    // Upper glass: sand depletes from bottom up
    upper.forEach(({ y, l, r }, i) => {
      p(l, y, FD); p(r, y, FD);
      const rowFromBottom = sandRows - 1 - i;    // row 0=top = 7 from bottom
      const emptyRows = Math.floor(sp * sandRows);
      const hasSand = rowFromBottom >= emptyRows;
      for (let x = l + 1; x <= r - 1; x++) {
        if (hasSand) {
          // Surface row gets highlight
          const isSurface = rowFromBottom === emptyRows;
          p(x, y, isSurface ? SH : (i < 2 ? SH : SM));
        } else {
          p(x, y, GL);
        }
      }
    });

    // Lower glass: sand accumulates from bottom up
    lower.forEach(({ y, l, r }, i) => {
      p(l, y, FD); p(r, y, FD);
      const rowFromBottom = lower.length - 1 - i;
      const filledRows = Math.floor(sp * lower.length);
      const hasSand = rowFromBottom < filledRows;
      for (let x = l + 1; x <= r - 1; x++) {
        if (hasSand) {
          // Surface = topmost sand row
          const isSurface = rowFromBottom === filledRows - 1;
          p(x, y, isSurface ? SH : SM);
        } else {
          p(x, y, GL);
        }
      }
    });

    // Neck glow (sand trickle point)
    const ng = 0.5 + Math.sin(f * 0.22) * 0.3;
    if (!flipZone) {
      p(11, 10, NK, ng); p(12, 10, NK, ng * 0.7);
      p(11, 11, NK, ng * 0.7); p(12, 11, NK, ng * 0.5);
    }

    // Falling sand particle (trickles through neck into lower half)
    if (!flipZone && sp < 0.97) {
      const pp = (f % 25) / 25;
      const py = Math.floor(10 + pp * 9);
      if (py > 10 && py < 20) {
        const a = 0.9 - (py - 10) / 12;
        p(11, py, SH, a);
        if (py > 11) p(11, py - 1, SM, a * 0.4);
      }
    }

    // Side wall shading (depth)
    upper.forEach(({ y, l, r }) => {
      p(l + 1, y, FM, 0.18); // inner left shadow
    });
    lower.forEach(({ y, l, r }) => {
      p(l + 1, y, FM, 0.15);
    });

    // Flip flash (burst of light when sand resets)
    if (flipZone) {
      const fe = Math.sin(((phase - 0.88) / 0.12) * Math.PI);
      const fc = '#ffe898';
      // Neck burst
      p(11, 10, fc, fe); p(12, 10, fc, fe * 0.8);
      p(11, 11, fc, fe * 0.8); p(12, 11, fc, fe);
      // Radiate outward
      if (fe > 0.5) {
        p(10, 9, fc, fe * 0.4); p(13, 9, fc, fe * 0.4);
        p(10, 12, fc, fe * 0.4); p(13, 12, fc, fe * 0.4);
      }
    }

    // Frame corner caps (top-left, bottom-right)
    p(4, 1, FD); p(19, 1, FD); p(4, 2, FM); p(19, 2, FM);
    p(4, 21, FM); p(19, 21, FM); p(4, 22, FD); p(19, 22, FD);
  },

  // ── Cursor ───────────────────────────────────────────────────
  _drawCursor() {
    const cur = document.getElementById('cur');
    if (!cur) return;
    const c = cur.getContext('2d');
    c.imageSmoothingEnabled = false;
    [[5,0],[6,0],[5,11],[6,11],[0,5],[0,6],[11,5],[11,6],
     [4,1],[7,1],[4,10],[7,10],[1,4],[1,7],[10,4],[10,7],
     [3,2],[8,2],[3,9],[8,9],[2,3],[2,8],[9,3],[9,8],
     [5,5],[6,5],[5,6],[6,6]
    ].forEach(([x, y]) => { c.fillStyle = '#c8b870'; c.fillRect(x, y, 1, 1); });
    [[5,1],[6,1],[5,10],[6,10],[1,5],[1,6],[10,5],[10,6]
    ].forEach(([x, y]) => { c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(x, y, 1, 1); });
  }
};

window.addEventListener('load', () => {
  MenuSFX._attach(); // prêt à jouer dès le premier geste
  G.init();
  Preloader.run(() => {
    document.getElementById('title-screen').classList.add('visible');
  });
});
