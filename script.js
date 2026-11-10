/**
 * THE INFINITY BURGER ♾️🍔 - Next-Gen 3D Culinary Experience
 * Core Engine & Gameplay System
 */

// -------------------------------------------------------------
// 1. SOUND & AUDIO SYNTHESIZER (Web Audio API 8-Bit / Cinematic)
// -------------------------------------------------------------
class InfinitySoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Sizzling drop of meat / ingredient
  playDrop() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;

    // Pitch pop + squishy tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  // Sizzle sound effect
  playSizzle() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    // White noise buffer for sizzling
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(3, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.25);
  }

  // Cosmic Infinity beam shimmer sound
  playInfinityBeam() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;

    [440, 554, 659, 880, 1108].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const startT = now + idx * 0.06;
      osc.frequency.setValueAtTime(freq, startT);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, startT + 0.25);

      gain.gain.setValueAtTime(0.15, startT);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startT);
      osc.stop(startT + 0.36);
    });
  }

  // Victory fanfare upon serving
  playVictory() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    chords.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      const startT = now + idx * 0.08;
      osc.frequency.setValueAtTime(freq, startT);

      gain.gain.setValueAtTime(0.18, startT);
      gain.gain.exponentialRampToValueAtTime(0.01, startT + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startT);
      osc.stop(startT + 0.5);
    });
  }

  toggle() {
    this.muted = !this.muted;
    return !this.muted;
  }
}

// -------------------------------------------------------------
// 2. INGREDIENTS DATABASE (Hundreds, Rarities, Colors, 3D Geometries)
// -------------------------------------------------------------
const INGREDIENTS = {
  // BUNS
  'bun_bottom': { id: 'bun_bottom', name: 'Sesame Base Bun', cat: 'buns', icon: '🍞', height: 0.35, radius: 1.5, color: 0xd99b50, type: 'cylinder' },
  'bun_top': { id: 'bun_top', name: 'Golden Brioche Crown', cat: 'buns', icon: '🍔', height: 0.7, radius: 1.5, color: 0xe6a147, type: 'dome' },
  'bun_black': { id: 'bun_black', name: 'Charcoal Void Bun', cat: 'buns', icon: '🌑', height: 0.65, radius: 1.5, color: 0x222228, type: 'dome' },
  'bun_crystal': { id: 'bun_crystal', name: 'Starlight Crystal Crust', cat: 'buns', icon: '💎', height: 0.6, radius: 1.5, color: 0x88e5ff, type: 'dome', emissive: 0x00a8ff },

  // PATTIES
  'patty_beef': { id: 'patty_beef', name: 'Angus Smash Patty', cat: 'patties', icon: '🥩', height: 0.35, radius: 1.45, color: 0x4a2a18, type: 'cylinder' },
  'patty_dragon': { id: 'patty_dragon', name: 'Dragon-Fire Wagyu', cat: 'patties', icon: '🔥', height: 0.4, radius: 1.5, color: 0x801818, type: 'cylinder', emissive: 0xff3b30 },
  'patty_chicken': { id: 'patty_chicken', name: 'Crispy Gold Chicken', cat: 'patties', icon: '🍗', height: 0.45, radius: 1.45, color: 0xcca03d, type: 'cylinder' },
  'patty_cosmic': { id: 'patty_cosmic', name: 'Nebula Quark Steak', cat: 'patties', icon: '🪐', height: 0.45, radius: 1.5, color: 0x6a0dad, type: 'cylinder', emissive: 0xb5179e },

  // CHEESES
  'cheese_cheddar': { id: 'cheese_cheddar', name: 'Melted Cheddar Lava', cat: 'cheeses', icon: '🧀', height: 0.15, radius: 1.6, color: 0xffa500, type: 'plate' },
  'cheese_swiss': { id: 'cheese_swiss', name: 'Quantum Swiss Ribbon', cat: 'cheeses', icon: '🕳️', height: 0.15, radius: 1.55, color: 0xfff3a1, type: 'plate' },
  'cheese_golden': { id: 'cheese_golden', name: '24K Golden Gouda', cat: 'cheeses', icon: '🌟', height: 0.2, radius: 1.65, color: 0xffd700, type: 'plate', emissive: 0xffaa00 },

  // TOPPINGS
  'top_lettuce': { id: 'top_lettuce', name: 'Crisp Emerald Lettuce', cat: 'toppings', icon: '🥬', height: 0.18, radius: 1.65, color: 0x44bd32, type: 'fluted' },
  'top_tomato': { id: 'top_tomato', name: 'Crimson Sun Tomato', cat: 'toppings', icon: '🍅', height: 0.22, radius: 1.35, color: 0xe84118, type: 'cylinder' },
  'top_onion': { id: 'top_onion', name: 'Purple Star Onions', cat: 'toppings', icon: '🧅', height: 0.15, radius: 1.4, color: 0x8c1d82, type: 'torus' },
  'top_pickle': { id: 'top_pickle', name: 'Chronos Dill Pickles', cat: 'toppings', icon: '🥒', height: 0.18, radius: 1.3, color: 0x487eb0, type: 'torus' },
  'top_bacon': { id: 'top_bacon', name: 'Hyper-Crisp Bacon Strip', cat: 'toppings', icon: '🥓', height: 0.15, radius: 1.5, color: 0xa52a2a, type: 'plate' },
  'top_egg': { id: 'top_egg', name: 'Solar Sunrise Egg', cat: 'toppings', icon: '🍳', height: 0.22, radius: 1.35, color: 0xfffae6, type: 'egg' },

  // SAUCES
  'sauce_bbq': { id: 'sauce_bbq', name: 'Hickory Smoke Glaze', cat: 'sauces', icon: '🍯', height: 0.1, radius: 1.45, color: 0x3d1c06, type: 'fluid' },
  'sauce_mayo': { id: 'sauce_mayo', name: 'Truffle Aioli Drizzle', cat: 'sauces', icon: '🍶', height: 0.1, radius: 1.45, color: 0xfdfaf0, type: 'fluid' },
  'sauce_magma': { id: 'sauce_magma', name: 'Inferno Ghost Pepper', cat: 'sauces', icon: '🌶️', height: 0.1, radius: 1.45, color: 0xd63031, type: 'fluid', emissive: 0xff0000 },

  // COSMIC INFINITY RELICS
  'cosmic_infinity_shard': { id: 'cosmic_infinity_shard', name: 'Shard of Eternity', cat: 'cosmic', icon: '✨', height: 0.35, radius: 1.2, color: 0xffd700, type: 'poly', emissive: 0xffea00 },
  'cosmic_blackhole': { id: 'cosmic_blackhole', name: 'Singularity Ring', cat: 'cosmic', icon: '🌀', height: 0.25, radius: 1.6, color: 0x190033, type: 'torus', emissive: 0x8a2be2 },
  'cosmic_galaxy_bun': { id: 'cosmic_galaxy_bun', name: 'Multiverse Bun Crown', cat: 'cosmic', icon: '🌌', height: 0.75, radius: 1.5, color: 0x240046, type: 'dome', emissive: 0x9d4edd }
};

// -------------------------------------------------------------
// 3. RECIPES & SACRED CODEX
// -------------------------------------------------------------
const SACRED_RECIPES = [
  {
    id: 'classic_infinity',
    name: 'The Golden Nexus Burger',
    icon: '🍔✨',
    desc: 'The timeless standard across the cosmos. Pure harmonious balance.',
    layers: ['bun_bottom', 'patty_beef', 'cheese_cheddar', 'top_lettuce', 'top_tomato', 'bun_top'],
    rewardCoins: 450,
    rewardXP: 120,
    unlocked: true
  },
  {
    id: 'dragon_blaze',
    name: 'Dragon Emperor Inferno',
    icon: '🔥🐉',
    desc: 'Forged in stellar magma. Spicier than a collapsing supernova!',
    layers: ['bun_bottom', 'patty_dragon', 'cheese_cheddar', 'sauce_magma', 'top_bacon', 'top_onion', 'bun_top'],
    rewardCoins: 750,
    rewardXP: 220,
    unlocked: false
  },
  {
    id: 'quantum_stack',
    name: 'Quantum Double Crunch',
    icon: '⚡🍔',
    desc: 'Two patties vibrating at harmonic culinary frequencies.',
    layers: ['bun_bottom', 'patty_beef', 'cheese_swiss', 'patty_chicken', 'cheese_golden', 'top_pickle', 'bun_top'],
    rewardCoins: 1100,
    rewardXP: 340,
    unlocked: false
  },
  {
    id: 'infinity_god',
    name: 'THE TRUE INFINITY BURGER',
    icon: '♾️👑',
    desc: 'Ascend mortality. The ultimate culinary artifact containing the universe.',
    layers: ['bun_black', 'patty_cosmic', 'cheese_golden', 'cosmic_infinity_shard', 'cosmic_blackhole', 'cosmic_galaxy_bun'],
    rewardCoins: 5000,
    rewardXP: 1000,
    unlocked: false
  }
];

// -------------------------------------------------------------
// 4. CUSTOMERS AND PERSONALITIES
// -------------------------------------------------------------
const CUSTOMERS = [
  {
    name: 'Emperor Gluttonus',
    tag: 'ROYALTY',
    tagClass: 'legendary',
    avatar: '👑',
    quote: '"Make it scrape the heavens! Infinite glory!"',
    patience: 55,
    recipeTargets: ['bun_bottom', 'patty_beef', 'cheese_cheddar', 'top_lettuce', 'bun_top']
  },
  {
    name: 'Captain Nova Spark',
    tag: 'SPACE EXPLORER',
    tagClass: '',
    avatar: '🚀',
    quote: '"I need dense fuel for warp jumps! Pack it heavy!"',
    patience: 40,
    recipeTargets: ['bun_bottom', 'patty_dragon', 'cheese_swiss', 'top_bacon', 'sauce_magma', 'bun_top']
  },
  {
    name: 'Grandma Chrono',
    tag: 'TIME TRAVELER',
    tagClass: '',
    avatar: '👵',
    quote: '"I tasted this burger in 3042 and traveled back just for seconds!"',
    patience: 50,
    recipeTargets: ['bun_bottom', 'top_lettuce', 'patty_beef', 'cheese_golden', 'top_egg', 'bun_top']
  },
  {
    name: 'Cyber Samurai Zero',
    tag: 'NEO-CHEF',
    tagClass: 'legendary',
    avatar: '🥷',
    quote: '"Precision, balance, aesthetic perfection. Show me your steel."',
    patience: 35,
    recipeTargets: ['bun_black', 'patty_cosmic', 'cheese_swiss', 'top_tomato', 'sauce_mayo', 'bun_crystal']
  },
  {
    name: 'Cosmic Djinn Zaphod',
    tag: 'MYSTICAL ENTITY',
    tagClass: 'legendary',
    avatar: '🧞‍♂️',
    quote: '"Conjure a burger so tasty it warps spacetime itself!"',
    patience: 45,
    recipeTargets: ['bun_bottom', 'patty_cosmic', 'cosmic_infinity_shard', 'cheese_golden', 'cosmic_galaxy_bun']
  }
];

// -------------------------------------------------------------
// 5. REALMS & RESTAURANTS
// -------------------------------------------------------------
const REALMS = [
  {
    id: 'cosmic_kitchen',
    name: 'Cosmic Kitchen',
    icon: '🌌',
    desc: 'A floating culinary sanctuary surrounded by sparkling nebulas.',
    bgColor: 0x0f1026,
    tableColor: 0x222449,
    unlocked: true,
    cost: 0
  },
  {
    id: 'neon_tokyo_3099',
    name: 'Neo-Tokyo Skylounge',
    icon: '🌆',
    desc: 'High atop neon towers with hover-cars and cyber beats.',
    bgColor: 0x16002c,
    tableColor: 0x3d0066,
    unlocked: false,
    cost: 1500
  },
  {
    id: 'magma_palace',
    name: 'Draconian Magma Forge',
    icon: '🌋',
    desc: 'Sizzle patties with geothermal heat from active volcanic spires.',
    bgColor: 0x2b0606,
    tableColor: 0x541010,
    unlocked: false,
    cost: 3200
  },
  {
    id: 'infinity_citadel',
    name: 'The Golden Citadel',
    icon: '🏛️✨',
    desc: 'The throne of culinary demigods at the edge of the Multiverse.',
    bgColor: 0x241d04,
    tableColor: 0x59460a,
    unlocked: false,
    cost: 8000
  }
];

// -------------------------------------------------------------
// 6. UPGRADES DATA
// -------------------------------------------------------------
const UPGRADES = [
  {
    id: 'golden_spatula',
    title: 'Mythic Golden Spatula',
    icon: '🍳',
    desc: 'Stack speed +30% and adds +10% coin bonus to every served burger.',
    cost: 300,
    level: 1,
    maxLevel: 5
  },
  {
    id: 'flavor_infuser',
    title: 'Infinity Flavor Supercharger',
    icon: '⚡',
    desc: 'Increases customer patience time by +10 seconds per level.',
    cost: 450,
    level: 0,
    maxLevel: 5
  },
  {
    id: 'cosmic_multiplier',
    title: 'Nebula Tip Magnet',
    icon: '🧲',
    desc: 'Customers tip +25% extra coins for high tower burgers.',
    cost: 700,
    level: 0,
    maxLevel: 5
  },
  {
    id: 'singularity_fryer',
    title: 'Singularity Patty Sizzler',
    icon: '🔥',
    desc: 'Unlocks permanent Golden Glaze particles and +50 XP per burger.',
    cost: 1200,
    level: 0,
    maxLevel: 3
  }
];

// -------------------------------------------------------------
// 7. MAIN 3D GAME ENGINE
// -------------------------------------------------------------
class InfinityBurgerGame {
  constructor() {
    this.sound = new InfinitySoundEngine();

    // Player Save State
    this.coins = 500;
    this.essence = 15;
    this.xp = 0;
    this.level = 1;
    this.activeRealm = REALMS[0];

    // Current Burger Stack
    this.currentStack = []; // array of { id, mesh, height }
    this.currentCustomer = null;
    this.orderTimer = 45;
    this.timerInterval = null;
    this.isServing = false;

    // Camera view toggle
    this.cameraViewIndex = 0;
    this.cameraViews = [
      { pos: new THREE.Vector3(0, 4, 8), target: new THREE.Vector3(0, 1.8, 0) },
      { pos: new THREE.Vector3(5, 5, 5), target: new THREE.Vector3(0, 2.0, 0) },
      { pos: new THREE.Vector3(0, 8, 4), target: new THREE.Vector3(0, 1.5, 0) }
    ];

    // Three.js Core
    this.initThree();
    this.buildEnvironment();
    this.initUI();
    this.nextCustomer();

    // Start Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    // Setup 2D Sparkles Overlay
    this.initSparkleFX();
  }

  // Initialize Three.js Scene, Camera, Renderer, Lighting
  initThree() {
    this.container = document.getElementById('canvas-container');
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.activeRealm.bgColor);
    this.scene.fog = new THREE.FogExp2(this.activeRealm.bgColor, 0.04);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.copy(this.cameraViews[0].pos);
    this.camera.lookAt(this.cameraViews[0].target);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    this.container.appendChild(this.renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xfff1cf, 1.4);
    this.dirLight.position.set(6, 12, 6);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.scene.add(this.dirLight);

    // Colored Accent Spotlights (Infinity Burger Magic)
    this.goldSpot = new THREE.SpotLight(0xffb703, 2.5, 20, Math.PI / 4, 0.4);
    this.goldSpot.position.set(-5, 8, 3);
    this.scene.add(this.goldSpot);

    this.purpleSpot = new THREE.SpotLight(0xb5179e, 2.0, 20, Math.PI / 4, 0.4);
    this.purpleSpot.position.set(5, 7, -3);
    this.scene.add(this.purpleSpot);

    // Handle Window Resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // Construct Chef Kitchen Table & Magical Floating Halo
  buildEnvironment() {
    // Culinary Table / Plate pedestal
    const plateGeom = new THREE.CylinderGeometry(2.4, 2.2, 0.35, 48);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0xf4f6f9,
      roughness: 0.15,
      metalness: 0.1
    });
    this.plate = new THREE.Mesh(plateGeom, plateMat);
    this.plate.position.set(0, 0, 0);
    this.plate.receiveShadow = true;
    this.scene.add(this.plate);

    // Golden Rim around the plate
    const rimGeom = new THREE.TorusGeometry(2.35, 0.08, 16, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffc400,
      metalness: 0.85,
      roughness: 0.2
    });
    const rim = new THREE.Mesh(rimGeom, goldMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.18;
    this.plate.add(rim);

    // Large Marble Cooking Island / Table
    const tableGeom = new THREE.CylinderGeometry(5.5, 6.0, 1.0, 48);
    this.tableMat = new THREE.MeshStandardMaterial({
      color: this.activeRealm.tableColor,
      roughness: 0.4,
      metalness: 0.2
    });
    this.table = new THREE.Mesh(tableGeom, this.tableMat);
    this.table.position.set(0, -0.65, 0);
    this.table.receiveShadow = true;
    this.scene.add(this.table);

    // Floating Rotating Infinity Portal Ring Behind the Table
    const portalGeom = new THREE.TorusGeometry(4.2, 0.15, 16, 100);
    const portalMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xff9900,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });
    this.portalRing = new THREE.Mesh(portalGeom, portalMat);
    this.portalRing.position.set(0, 4.0, -4.5);
    this.scene.add(this.portalRing);

    // Floating Star / Sparkle particles in 3D
    const starCount = 180;
    const starGeom = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 20;
      starPositions[i + 1] = Math.random() * 12 - 2;
      starPositions[i + 2] = (Math.random() - 0.5) * 16;
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffde59,
      size: 0.18,
      transparent: true,
      opacity: 0.85
    });
    this.starPoints = new THREE.Points(starGeom, starMat);
    this.scene.add(this.starPoints);
  }

  // -------------------------------------------------------------
  // 8. 3D BURGER MESH GENERATION (Cartoon High-Fidelity)
  // -------------------------------------------------------------
  createIngredientMesh(item) {
    const group = new THREE.Group();
    let mesh;

    switch (item.type) {
      case 'dome': { // Bun Top
        const geom = new THREE.SphereGeometry(item.radius, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.48);
        const mat = new THREE.MeshStandardMaterial({
          color: item.color,
          roughness: 0.45,
          emissive: item.emissive || 0x000000,
          emissiveIntensity: 0.6
        });
        mesh = new THREE.Mesh(geom, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Add sesame seeds to top bun!
        if (item.id === 'bun_top') {
          const seedGeom = new THREE.SphereGeometry(0.04, 8, 8);
          const seedMat = new THREE.MeshStandardMaterial({ color: 0xfff0db, roughness: 0.3 });
          for (let i = 0; i < 24; i++) {
            const seed = new THREE.Mesh(seedGeom, seedMat);
            const phi = Math.random() * Math.PI * 0.35;
            const theta = Math.random() * Math.PI * 2;
            seed.position.set(
              (item.radius - 0.02) * Math.sin(phi) * Math.cos(theta),
              (item.radius - 0.02) * Math.cos(phi),
              (item.radius - 0.02) * Math.sin(phi) * Math.sin(theta)
            );
            seed.scale.set(1.5, 0.6, 1.0);
            mesh.add(seed);
          }
        }
        break;
      }

      case 'cylinder': { // Patties, tomato, bottom bun
        const geom = new THREE.CylinderGeometry(item.radius, item.radius * 0.98, item.height, 32);
        const mat = new THREE.MeshStandardMaterial({
          color: item.color,
          roughness: 0.65,
          metalness: 0.1,
          emissive: item.emissive || 0x000000,
          emissiveIntensity: 0.5
        });
        mesh = new THREE.Mesh(geom, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        break;
      }

      case 'plate': { // Cheese slices, bacon
        // Square with slight rounded drooping corners
        const geom = new THREE.BoxGeometry(item.radius * 1.8, item.height, item.radius * 1.8);
        const mat = new THREE.MeshStandardMaterial({
          color: item.color,
          roughness: 0.3,
          metalness: 0.15,
          emissive: item.emissive || 0x000000,
          emissiveIntensity: 0.4
        });
        mesh = new THREE.Mesh(geom, mat);
        mesh.rotation.y = (Math.random() - 0.5) * 0.5; // stylish jaunty rotation
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        break;
      }

      case 'fluted': { // Lettuce with ripples
        const geom = new THREE.CylinderGeometry(item.radius * 1.1, item.radius, item.height, 24);
        const mat = new THREE.MeshStandardMaterial({
          color: item.color,
          roughness: 0.5,
          metalness: 0.05
        });
        mesh = new THREE.Mesh(geom, mat);
        mesh.scale.set(1.05, 1, 0.95);
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.castShadow = true;
        break;
      }

      case 'torus': { // Onions / Pickles rings
        const geom = new THREE.TorusGeometry(item.radius * 0.6, 0.12, 12, 32);
        const mat = new THREE.MeshStandardMaterial({
          color: item.color,
          roughness: 0.4
        });
        mesh = new THREE.Mesh(geom, mat);
        mesh.rotation.x = Math.PI / 2;
        mesh.castShadow = true;
        break;
      }

      case 'fluid': { // Sauces with dripping drops
        const geom = new THREE.CylinderGeometry(item.radius * 0.9, item.radius * 1.05, item.height, 24);
        const mat = new THREE.MeshStandardMaterial({
          color: item.color,
          roughness: 0.1, // glossy sauce
          metalness: 0.2,
          emissive: item.emissive || 0x000000,
          emissiveIntensity: 0.5
        });
        mesh = new THREE.Mesh(geom, mat);
        break;
      }

      case 'poly': { // Cosmic Infinity Gem
        const geom = new THREE.OctahedronGeometry(item.radius * 0.7, 1);
        const mat = new THREE.MeshStandardMaterial({
          color: item.color,
          roughness: 0.1,
          metalness: 0.9,
          emissive: item.emissive || 0xffd700,
          emissiveIntensity: 1.0
        });
        mesh = new THREE.Mesh(geom, mat);
        mesh.castShadow = true;
        break;
      }

      case 'egg': { // Sunny side egg
        const eggBase = new THREE.CylinderGeometry(item.radius, item.radius * 1.05, 0.1, 24);
        const eggWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
        mesh = new THREE.Mesh(eggBase, eggWhiteMat);

        const yolkGeom = new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
        const yolkMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.15 });
        const yolk = new THREE.Mesh(yolkGeom, yolkMat);
        yolk.position.set(0.2, 0.05, 0.1);
        mesh.add(yolk);
        mesh.castShadow = true;
        break;
      }

      default: {
        const geom = new THREE.CylinderGeometry(item.radius, item.radius, item.height, 24);
        const mat = new THREE.MeshStandardMaterial({ color: item.color });
        mesh = new THREE.Mesh(geom, mat);
      }
    }

    group.add(mesh);
    return group;
  }

  // Calculate current top Y position of burger stack
  getStackHeight() {
    let y = 0.2; // base plate offset
    for (const item of this.currentStack) {
      y += item.data.height;
    }
    return y;
  }

  // Add Ingredient with physics squishy drop bounce & sound
  addIngredient(ingredientId) {
    if (this.isServing) return;
    const itemData = INGREDIENTS[ingredientId];
    if (!itemData) return;

    // Check bottom bun rule recommendation
    if (this.currentStack.length === 0 && itemData.id !== 'bun_bottom' && itemData.id !== 'bun_black') {
      this.announce('💡 TIP: Start with a Bottom Bun for a stable burger!');
    }

    const currentY = this.getStackHeight();
    const meshGroup = this.createIngredientMesh(itemData);

    // Initial Drop position high in air
    meshGroup.position.set(
      (Math.random() - 0.5) * 0.15,
      currentY + 3.5, // drop from sky
      (Math.random() - 0.5) * 0.15
    );
    this.scene.add(meshGroup);

    // TWEEN drop animation
    new TWEEN.Tween(meshGroup.position)
      .to({ x: (Math.random() - 0.5) * 0.08, y: currentY + itemData.height * 0.5, z: (Math.random() - 0.5) * 0.08 }, 300)
      .easing(TWEEN.Easing.Bounce.Out)
      .onComplete(() => {
        // Squish effect on entire stack
        this.squishEffect();
      })
      .start();

    // Subtle random jaunty tilt
    meshGroup.rotation.y = (Math.random() - 0.5) * 0.4;

    this.currentStack.push({
      data: itemData,
      mesh: meshGroup,
      height: itemData.height
    });

    // Sound FX
    this.sound.playDrop();
    if (itemData.cat === 'patties') {
      this.sound.playSizzle();
    }
    if (itemData.cat === 'cosmic') {
      this.sound.playInfinityBeam();
    }

    // Camera Auto-elevation for sky-scraping burgers
    this.adjustCameraForHeight();

    // Update HUD and Check Ticket Match
    this.updateHUD();
    this.checkTicketProgress();
  }

  // Squish animation on all burger layers upon impact
  squishEffect() {
    this.currentStack.forEach((layer, idx) => {
      const origScaleY = 1.0;
      new TWEEN.Tween(layer.mesh.scale)
        .to({ x: 1.08, y: 0.88, z: 1.08 }, 70)
        .yoyo(true)
        .repeat(1)
        .start();
    });
  }

  // Camera adjusts upwards if burger becomes tall
  adjustCameraForHeight() {
    const stackH = this.getStackHeight();
    const targetY = Math.max(1.8, stackH * 0.7);
    new TWEEN.Tween(this.cameraViews[this.cameraViewIndex].target)
      .to({ y: targetY }, 400)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();
  }

  // Undo the top ingredient
  undoLastIngredient() {
    if (this.currentStack.length === 0 || this.isServing) return;
    const removed = this.currentStack.pop();

    // Fly away animation
    new TWEEN.Tween(removed.mesh.position)
      .to({ y: removed.mesh.position.y + 3.0 }, 200)
      .onComplete(() => {
        this.scene.remove(removed.mesh);
      })
      .start();

    this.sound.playDrop();
    this.updateHUD();
    this.checkTicketProgress();
  }

  // Clear current burger
  clearBurger() {
    if (this.isServing) return;
    this.currentStack.forEach(item => {
      this.scene.remove(item.mesh);
    });
    this.currentStack = [];
    this.announce('🗑️ Kitchen Cleared!');
    this.updateHUD();
    this.checkTicketProgress();
    this.adjustCameraForHeight();
  }

  // -------------------------------------------------------------
  // 9. INFINITY SPECIAL INFUSION BEAM
  // -------------------------------------------------------------
  triggerInfinitySpecial() {
    if (this.currentStack.length === 0 || this.isServing) {
      this.announce('⚠️ Build a burger first to infuse with Infinity!');
      return;
    }
    if (this.essence < 3) {
      this.announce('⚠️ Need at least 3 ✨ Infinity Essence!');
      return;
    }

    this.essence -= 3;
    this.updateHUD();
    this.sound.playInfinityBeam();
    this.announce('✨ INFINITY INFUSION ACTIVATED! ✨');

    // Confetti and gold sparks
    if (window.confetti) {
      window.confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#ff9900', '#b5179e', '#4cc9f0']
      });
    }

    // Infuse all meshes in stack with golden emissive glow
    this.currentStack.forEach(item => {
      item.mesh.traverse(child => {
        if (child.isMesh && child.material) {
          const oldEmissive = child.material.emissive ? child.material.emissive.getHex() : 0x000000;
          child.material.emissive = new THREE.Color(0xffaa00);
          child.material.emissiveIntensity = 1.2;

          // Float animation
          new TWEEN.Tween(child.position)
            .to({ y: child.position.y + 0.3 }, 250)
            .yoyo(true)
            .repeat(1)
            .start();
        }
      });
    });

    // Spin the portal ring with high speed
    new TWEEN.Tween(this.portalRing.rotation)
      .to({ z: this.portalRing.rotation.z + Math.PI * 2 }, 1200)
      .start();
  }

  // -------------------------------------------------------------
  // 10. CUSTOMER ORDER & MATCH ENGINE
  // -------------------------------------------------------------
  nextCustomer() {
    // Pick random customer
    const template = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
    this.currentCustomer = JSON.parse(JSON.stringify(template));

    // Update customer UI
    document.getElementById('customer-avatar').textContent = this.currentCustomer.avatar;
    document.getElementById('customer-name').textContent = this.currentCustomer.name;
    const tagElem = document.getElementById('customer-tag');
    tagElem.textContent = this.currentCustomer.tag;
    tagElem.className = `customer-tag ${this.currentCustomer.tagClass}`;
    document.getElementById('customer-quote').textContent = this.currentCustomer.quote;

    // Reset Timer
    this.orderTimer = this.currentCustomer.patience;
    this.startOrderTimer();

    // Render Recipe Checklist in UI
    this.renderOrderBadges();
    this.clearBurger();
    this.announce(`🔔 New Order from ${this.currentCustomer.name}!`);
  }

  renderOrderBadges() {
    const list = document.getElementById('order-recipe-list');
    list.innerHTML = '';
    const targets = this.currentCustomer.recipeTargets;

    document.getElementById('target-count').textContent = targets.length;

    targets.forEach((targetId, idx) => {
      const item = INGREDIENTS[targetId];
      if (!item) return;

      const badge = document.createElement('div');
      badge.className = 'recipe-item-badge';
      badge.id = `order-layer-${idx}`;
      badge.innerHTML = `
        <span>${item.icon}</span>
        <span>${item.name}</span>
        <span class="badge-state">⚪</span>
      `;
      list.appendChild(badge);
    });
  }

  checkTicketProgress() {
    if (!this.currentCustomer) return;
    const targets = this.currentCustomer.recipeTargets;
    let matched = 0;

    targets.forEach((targetId, idx) => {
      const badge = document.getElementById(`order-layer-${idx}`);
      if (!badge) return;

      // Check if current stack has this layer at or near this sequence
      const userHasLayer = this.currentStack.some(item => item.data.id === targetId);

      if (userHasLayer) {
        badge.classList.add('matched');
        badge.querySelector('.badge-state').textContent = '✅';
        matched++;
      } else {
        badge.classList.remove('matched');
        badge.querySelector('.badge-state').textContent = '⚪';
      }
    });

    document.getElementById('matched-count').textContent = matched;
  }

  startOrderTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const badge = document.getElementById('timer-badge');

    this.timerInterval = setInterval(() => {
      this.orderTimer--;
      badge.textContent = `⏳ ${this.orderTimer}s`;

      if (this.orderTimer <= 10) {
        badge.style.color = '#ff0055';
      } else {
        badge.style.color = '#ff6b6b';
      }

      if (this.orderTimer <= 0) {
        clearInterval(this.timerInterval);
        this.announce('⏰ Time ran out! Customer left hungry!');
        setTimeout(() => this.nextCustomer(), 1500);
      }
    }, 1000);
  }

  // -------------------------------------------------------------
  // 11. SERVE & SCORECARD
  // -------------------------------------------------------------
  serveBurger() {
    if (this.currentStack.length === 0 || this.isServing) {
      this.announce('⚠️ You cannot serve an empty plate!');
      return;
    }

    this.isServing = true;
    if (this.timerInterval) clearInterval(this.timerInterval);

    // Calculate score & bonuses
    const targets = this.currentCustomer.recipeTargets;
    let matchedLayers = 0;
    targets.forEach(targetId => {
      if (this.currentStack.some(item => item.data.id === targetId)) matchedLayers++;
    });

    const accuracyPct = Math.round((matchedLayers / targets.length) * 100);
    const heightBonus = this.currentStack.length * 40;
    const speedBonus = this.orderTimer * 10;
    const cosmicItems = this.currentStack.filter(item => item.data.cat === 'cosmic').length;
    const cosmicBonus = cosmicItems * 150;

    const totalScore = Math.min(100, Math.round((accuracyPct * 0.6) + (matchedLayers * 8) + (this.orderTimer * 0.5)));

    const earnedCoins = Math.round(180 + (matchedLayers * 60) + heightBonus * 0.5 + speedBonus * 0.8 + cosmicBonus);
    const earnedEssence = cosmicItems > 0 ? 5 : 2;
    const earnedXP = 100 + matchedLayers * 30;

    // Apply player awards
    this.coins += earnedCoins;
    this.essence += earnedEssence;
    this.addXP(earnedXP);

    // Fanfare and confetti
    this.sound.playVictory();
    if (window.confetti) {
      window.confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 }
      });
    }

    // Show Scorecard Modal
    document.getElementById('sc-title').textContent = accuracyPct >= 80 ? 'CULINARY MASTERPIECE!' : 'DELICIOUS CREATION!';
    document.getElementById('sc-subtitle').textContent = `${this.currentCustomer.name} says: "Spectacular burger!"`;
    document.getElementById('sc-final-score').textContent = totalScore;
    document.getElementById('sc-accuracy').textContent = `${accuracyPct}% (${matchedLayers}/${targets.length})`;
    document.getElementById('sc-height').textContent = `+${heightBonus} pts (${this.currentStack.length} layers)`;
    document.getElementById('sc-infusion').textContent = `+${cosmicBonus} pts (${cosmicItems} relics)`;
    document.getElementById('sc-speed').textContent = `+${speedBonus} pts`;
    document.getElementById('sc-reward').textContent = `+${earnedCoins} 🪙 | +${earnedEssence} ✨ | +${earnedXP} XP`;

    document.getElementById('modal-scorecard').classList.remove('hidden');

    this.updateHUD();
  }

  addXP(amount) {
    this.xp += amount;
    const nextLevelXP = this.level * 200;
    if (this.xp >= nextLevelXP) {
      this.xp -= nextLevelXP;
      this.level++;
      this.announce(`🎉 LEVEL UP! You are now Chef Level ${this.level}!`);
    }
  }

  // -------------------------------------------------------------
  // 12. UI BUILDER & EVENT LISTENERS
  // -------------------------------------------------------------
  initUI() {
    this.renderIngredientShelf('buns');

    // Category Tabs Switching
    const tabs = document.querySelectorAll('.cat-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.renderIngredientShelf(tab.dataset.cat);
      });
    });

    // Control buttons
    document.getElementById('btn-undo').addEventListener('click', () => this.undoLastIngredient());
    document.getElementById('btn-clear').addEventListener('click', () => this.clearBurger());
    document.getElementById('btn-serve').addEventListener('click', () => this.serveBurger());
    document.getElementById('btn-infinity-special').addEventListener('click', () => this.triggerInfinitySpecial());

    // Camera Switcher
    document.getElementById('btn-camera').addEventListener('click', () => {
      this.cameraViewIndex = (this.cameraViewIndex + 1) % this.cameraViews.length;
      const targetView = this.cameraViews[this.cameraViewIndex];

      new TWEEN.Tween(this.camera.position)
        .to(targetView.pos, 600)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

      new TWEEN.Tween(this.cameraViews[this.cameraViewIndex].target)
        .to(targetView.target, 600)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

      this.announce('🎥 Camera View Switched');
    });

    // Audio Mute Toggle
    const audioBtn = document.getElementById('btn-audio-toggle');
    audioBtn.addEventListener('click', () => {
      const isSoundOn = this.sound.toggle();
      audioBtn.textContent = isSoundOn ? '🔊' : '🔇';
    });

    // Modal Triggers
    document.getElementById('btn-recipes').addEventListener('click', () => this.openRecipesModal());
    document.getElementById('btn-upgrades').addEventListener('click', () => this.openUpgradesModal());
    document.getElementById('btn-world-select').addEventListener('click', () => this.openRealmsModal());
    document.getElementById('btn-compete').addEventListener('click', () => this.openCompetitionModal());

    // Close Modals
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.close;
        document.getElementById(modalId).classList.add('hidden');
      });
    });

    // Scorecard Continue Button
    document.getElementById('btn-scorecard-continue').addEventListener('click', () => {
      document.getElementById('modal-scorecard').classList.add('hidden');
      this.isServing = false;
      this.nextCustomer();
    });

    // Start Competition Button
    document.getElementById('btn-start-comp').addEventListener('click', () => {
      this.startChefShowdown();
    });

    this.updateHUD();
  }

  // Render Ingredient Shelf Carousel
  renderIngredientShelf(category) {
    const shelf = document.getElementById('ingredient-shelf');
    shelf.innerHTML = '';

    const items = Object.values(INGREDIENTS).filter(item => item.cat === category);

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = `ingredient-card ${item.cat === 'cosmic' ? 'legendary' : ''}`;
      card.innerHTML = `
        <div class="ingredient-icon-box">${item.icon}</div>
        <div class="ingredient-name">${item.name}</div>
        <div class="ingredient-stat">${item.height.toFixed(2)}m H</div>
      `;
      card.addEventListener('click', () => {
        this.addIngredient(item.id);
      });
      shelf.appendChild(card);
    });
  }

  updateHUD() {
    document.getElementById('hud-coins').textContent = this.coins.toLocaleString();
    document.getElementById('hud-essence').textContent = this.essence;
    document.getElementById('hud-realm-name').textContent = this.activeRealm.name;
    document.getElementById('hud-level').innerHTML = `${this.level} <small>(${this.xp}/${this.level * 200} XP)</small>`;

    document.getElementById('stack-count').textContent = this.currentStack.length;
    const totalHeight = (this.getStackHeight() - 0.2).toFixed(2);
    document.getElementById('stack-height').textContent = `${totalHeight}m`;

    const multiplier = (1.0 + (this.currentStack.length * 0.1)).toFixed(1);
    document.getElementById('combo-multiplier').textContent = `${multiplier}x MULTIPLIER`;
  }

  announce(text) {
    const el = document.getElementById('game-announcer');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(this.announceTimer);
    this.announceTimer = setTimeout(() => {
      el.classList.remove('show');
    }, 2000);
  }

  // -------------------------------------------------------------
  // 13. MODALS IMPLEMENTATIONS (Recipes, Upgrades, Realms, Comp)
  // -------------------------------------------------------------
  openRecipesModal() {
    const grid = document.getElementById('recipes-grid');
    grid.innerHTML = '';

    SACRED_RECIPES.forEach(recipe => {
      const card = document.createElement('div');
      card.className = `card-item ${recipe.unlocked ? 'unlocked' : ''}`;

      const layerIcons = recipe.layers
        .map(id => (INGREDIENTS[id] ? INGREDIENTS[id].icon : '❓'))
        .join(' ');

      card.innerHTML = `
        <div class="card-header">
          <span class="card-icon">${recipe.icon}</span>
          <div>
            <h4 class="card-title">${recipe.name}</h4>
            <span style="font-size:10px; color:#ffc400;">Reward: +${recipe.rewardCoins} 🪙</span>
          </div>
        </div>
        <p class="card-desc">${recipe.desc}</p>
        <div style="font-size: 16px; margin: 4px 0;"><strong>Layers:</strong> ${layerIcons}</div>
        <div class="card-footer">
          <span style="font-size:11px; color:#a0a5cc;">Status: ${recipe.unlocked ? 'Unlocked 🔓' : 'Secret Mastery'}</span>
          <button class="btn-buy" ${recipe.unlocked ? '' : 'disabled'}>
            ${recipe.unlocked ? 'Load as Order' : 'Locked'}
          </button>
        </div>
      `;

      if (recipe.unlocked) {
        card.querySelector('.btn-buy').addEventListener('click', () => {
          document.getElementById('modal-recipes').classList.add('hidden');
          this.currentCustomer.recipeTargets = [...recipe.layers];
          this.currentCustomer.name = `Master Recipe: ${recipe.name}`;
          this.renderOrderBadges();
          this.announce(`📜 Recipe Loaded: ${recipe.name}`);
        });
      }

      grid.appendChild(card);
    });

    document.getElementById('modal-recipes').classList.remove('hidden');
  }

  openUpgradesModal() {
    const grid = document.getElementById('upgrades-grid');
    grid.innerHTML = '';

    UPGRADES.forEach(upg => {
      const card = document.createElement('div');
      card.className = 'card-item';
      const cost = upg.cost * (upg.level + 1);

      card.innerHTML = `
        <div class="card-header">
          <span class="card-icon">${upg.icon}</span>
          <div>
            <h4 class="card-title">${upg.title}</h4>
            <span style="font-size:11px; color:#4cc9f0;">Tier ${upg.level}/${upg.maxLevel}</span>
          </div>
        </div>
        <p class="card-desc">${upg.desc}</p>
        <div class="card-footer">
          <span style="font-size:12px; color:#ffc400;">Cost: ${cost} 🪙</span>
          <button class="btn-buy" ${this.coins >= cost && upg.level < upg.maxLevel ? '' : 'disabled'}>
            ${upg.level >= upg.maxLevel ? 'MAXED' : 'Upgrade'}
          </button>
        </div>
      `;

      card.querySelector('.btn-buy').addEventListener('click', () => {
        if (this.coins >= cost && upg.level < upg.maxLevel) {
          this.coins -= cost;
          upg.level++;
          this.sound.playVictory();
          this.updateHUD();
          this.openUpgradesModal(); // refresh
          this.announce(`⚡ Upgraded: ${upg.title}!`);
        }
      });

      grid.appendChild(card);
    });

    document.getElementById('modal-upgrades').classList.remove('hidden');
  }

  openRealmsModal() {
    const grid = document.getElementById('realms-grid');
    grid.innerHTML = '';

    REALMS.forEach(realm => {
      const isCurrent = this.activeRealm.id === realm.id;
      const card = document.createElement('div');
      card.className = `card-item ${realm.unlocked ? 'unlocked' : ''}`;

      card.innerHTML = `
        <div class="card-header">
          <span class="card-icon">${realm.icon}</span>
          <div>
            <h4 class="card-title">${realm.name}</h4>
            <span style="font-size:10px; color:#ffc400;">${realm.cost > 0 ? realm.cost + ' 🪙' : 'FREE'}</span>
          </div>
        </div>
        <p class="card-desc">${realm.desc}</p>
        <div class="card-footer">
          <span style="font-size:11px; color:#a0a5cc;">${isCurrent ? 'Active Location' : (realm.unlocked ? 'Unlocked' : 'Locked')}</span>
          <button class="btn-buy">
            ${isCurrent ? 'CURRENT' : (realm.unlocked ? 'TRAVEL' : 'UNLOCK')}
          </button>
        </div>
      `;

      const btn = card.querySelector('.btn-buy');
      btn.addEventListener('click', () => {
        if (isCurrent) return;
        if (!realm.unlocked) {
          if (this.coins >= realm.cost) {
            this.coins -= realm.cost;
            realm.unlocked = true;
            this.switchRealm(realm);
          } else {
            this.announce('⚠️ Not enough coins for this realm!');
          }
        } else {
          this.switchRealm(realm);
        }
      });

      grid.appendChild(card);
    });

    document.getElementById('modal-realms').classList.remove('hidden');
  }

  switchRealm(realm) {
    this.activeRealm = realm;
    this.scene.background = new THREE.Color(realm.bgColor);
    this.scene.fog.color = new THREE.Color(realm.bgColor);
    this.tableMat.color = new THREE.Color(realm.tableColor);
    this.updateHUD();
    document.getElementById('modal-realms').classList.add('hidden');
    this.sound.playInfinityBeam();
    this.announce(`🚀 Traveled to ${realm.name}!`);
  }

  openCompetitionModal() {
    document.getElementById('modal-competition').classList.remove('hidden');
    document.getElementById('player-comp-progress').style.width = '0%';
    document.getElementById('rival-comp-progress').style.width = '0%';
    document.getElementById('player-comp-score').textContent = '0 pts';
    document.getElementById('rival-comp-score').textContent = '0 pts';
  }

  startChefShowdown() {
    document.getElementById('modal-competition').classList.add('hidden');
    this.announce('⚔️ SHOWDOWN STARTED! Stack 12+ layers swiftly!');

    let rivalScore = 0;
    let time = 30;

    const compInterval = setInterval(() => {
      time--;
      // Simulated AI opponent stacking burgers
      rivalScore += Math.floor(Math.random() * 8) + 4;
      const playerProgress = Math.min(100, (this.currentStack.length / 12) * 100);
      const rivalProgress = Math.min(100, (rivalScore / 100) * 100);

      document.getElementById('player-comp-progress').style.width = `${playerProgress}%`;
      document.getElementById('rival-comp-progress').style.width = `${rivalProgress}%`;
      document.getElementById('player-comp-score').textContent = `${this.currentStack.length * 10} pts`;
      document.getElementById('rival-comp-score').textContent = `${rivalScore} pts`;

      if (time <= 0 || this.currentStack.length >= 12) {
        clearInterval(compInterval);
        const playerFinal = this.currentStack.length * 10;
        if (playerFinal >= rivalScore) {
          this.sound.playVictory();
          this.coins += 1000;
          this.essence += 10;
          this.updateHUD();
          this.announce('🏆 YOU WON THE CHEF SHOWDOWN! +1000 🪙 & +10 ✨!');
        } else {
          this.announce('🤖 Rival Chef took the crown! Keep practicing!');
        }
      }
    }, 1000);
  }

  // -------------------------------------------------------------
  // 14. 2D BACKGROUND SPARKLES & PARTICLES (Canvas FX)
  // -------------------------------------------------------------
  initSparkleFX() {
    const canvas = document.getElementById('fx-canvas');
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        color: ['#ffc400', '#b5179e', '#4cc9f0', '#ffffff'][Math.floor(Math.random() * 4)],
        vy: -Math.random() * 0.8 - 0.2,
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    function renderSparkles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y += p.vy;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      requestAnimationFrame(renderSparkles);
    }
    renderSparkles();
  }

  // -------------------------------------------------------------
  // 15. MAIN RENDER & ANIMATION LOOP
  // -------------------------------------------------------------
  animate(time) {
    requestAnimationFrame(this.animate);

    // Update TWEEN
    TWEEN.update();

    // Rotate Portal Ring gently
    if (this.portalRing) {
      this.portalRing.rotation.z += 0.005;
      this.portalRing.rotation.y = Math.sin(time * 0.001) * 0.15;
    }

    // Slowly rotate background star points
    if (this.starPoints) {
      this.starPoints.rotation.y += 0.0008;
    }

    // Gentle floating bob of plate
    if (this.plate) {
      this.plate.position.y = Math.sin(time * 0.002) * 0.03;
    }

    // Camera look target
    this.camera.lookAt(this.cameraViews[this.cameraViewIndex].target);

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.infinityGame = new InfinityBurgerGame();
});
