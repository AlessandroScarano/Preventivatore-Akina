import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.4/index.js';

const MODEL_CONFIG = {
  TRASCINAMENTO: { label: 'Trascinamento', defaultOpening: 'scorrevole-parete' },
  INDIPENDENTE: { label: 'Indipendente', defaultOpening: 'scorrevole-parete' },
  MAGNETICA: { label: 'Magnetica', defaultOpening: 'scorrevole-parete' },
  SINGOLA: { label: 'Singola', defaultOpening: 'battente' },
  SOLO_PANNELLO: { label: 'Solo pannello fisso', defaultOpening: 'fisso' },
  SOLO_ANTA: { label: 'Solo anta', defaultOpening: 'scorrevole-parete' },
};

const ENVIRONMENT_CONFIG = {
  soloporta: { label: 'Solo porta' },
};

const MODEL_ANTE_OPTIONS = {
  TRASCINAMENTO: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  INDIPENDENTE: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  MAGNETICA: [1, 2],
  DEFAULT: [1, 2],
};

const BINARIO_CONFIG = {
  'A vista': { label: 'A vista', track: 'standard' },
  Nascosto: { label: 'Nascosto nel cartongesso', track: 'incasso' },
};

const TRACK_LENGTH_OPTIONS = {
  DEFAULT: [
    { code: 20, meters: 2, label: '2,0 Metri' },
    { code: 30, meters: 3, label: '3,0 Metri' },
    { code: 40, meters: 4, label: '4,0 Metri' },
    { code: 60, meters: 6, label: '6,0 Metri' },
  ],
  SINGOLA: {
    Parete: [
      { code: 25, meters: 2.5, label: '2,5 Metri' },
      { code: 40, meters: 4, label: '4,0 Metri' },
    ],
    'A soffitto': [
      { code: 20, meters: 2, label: '2,0 Metri' },
      { code: 30, meters: 3, label: '3,0 Metri' },
      { code: 40, meters: 4, label: '4,0 Metri' },
      { code: 60, meters: 6, label: '6,0 Metri' },
    ],
  },
  MAGNETICA: {
    'A vista': [
      { code: 20, meters: 2, label: '2,0 Metri' },
      { code: 27, meters: 2.7, label: '2,7 Metri' },
      { code: 34, meters: 3.4, label: '3,4 Metri' },
    ],
    Nascosto: [
      { code: 21, meters: 2.1, label: '2,1 Metri' },
      { code: 28, meters: 2.8, label: '2,8 Metri' },
    ],
  },
};

const PRICE_TABLE = {
  TRACKS: {
    STANDARD: {
      PRIMARY: {
        20: { code: 'UNK-GS1-L20', price: 309, description: 'Binario principale 2 m' },
        30: { code: 'UNK-GS1-L30', price: 463, description: 'Binario principale 3 m' },
        40: { code: 'UNK-GS1-L40', price: 614, description: 'Binario principale 4 m' },
        60: { code: 'UNK-GS1-L60', price: 921, description: 'Binario principale 6 m' },
      },
      EXTRA: {
        20: { code: 'UNK-GS2-L20', price: 244, description: 'Binario aggiuntivo 2 m' },
        30: { code: 'UNK-GS2-L30', price: 370, description: 'Binario aggiuntivo 3 m' },
        40: { code: 'UNK-GS2-L40', price: 454, description: 'Binario aggiuntivo 4 m' },
        60: { code: 'UNK-GS2-L60', price: 721, description: 'Binario aggiuntivo 6 m' },
      },
    },
    SINGOLA: {
      SOFFITTO: {
        20: { code: 'UNK-GS1-L20', price: 309, description: 'Binario principale 2 m' },
        30: { code: 'UNK-GS1-L30', price: 463, description: 'Binario principale 3 m' },
        40: { code: 'UNK-GS1-L40', price: 614, description: 'Binario principale 4 m' },
        60: { code: 'UNK-GS1-L60', price: 921, description: 'Binario principale 6 m' },
      },
      PARETE: {
        25: { code: 'UNK-GP1-L25', price: 797, description: 'Kit binario parete 2,5 m' },
        40: { code: 'UNK-GP1-L40', price: 1275, description: 'Kit binario parete 4 m' },
      },
    },
    MAGNETICA: {
      VISTA: {
        20: { code: 'M100-P40-L20', price: 1850, description: 'Magnetica a vista 2 m (per anta)' },
        27: { code: 'M100-P40-L27', price: 2050, description: 'Magnetica a vista 2,7 m (per anta)' },
        34: { code: 'M100-P40-L34', price: 2250, description: 'Magnetica a vista 3,4 m (per anta)' },
      },
      NASCOSTO: {
        21: { code: 'M100-CS55-L21', price: 2200, description: 'Magnetica incassata 2,1 m (per anta)' },
        28: { code: 'M100-CS55-L28', price: 2450, description: 'Magnetica incassata 2,8 m (per anta)' },
      },
    },
    FIXED_EXTRA: { code: 'UNK-GS1-L20', price: 309, description: 'Binario extra per pannello fisso' },
  },
  COVERS: {
    STANDARD: { code: 'UNK-CCS-L30 NO', price: 40, description: 'Cover di montaggio' },
    MAGNETICA: {
      20: {
        FRONT: { code: 'M100-CF-L20', price: 75, description: 'Cover frontale 2 m' },
        TOP: { code: 'M100-CS-L20', price: 35, description: 'Cover superiore 2 m' },
        MOUNT: { code: 'M100-PM-L20', price: 100, description: 'Profilo montaggio 2 m' },
      },
      27: {
        FRONT: { code: 'M100-CF-L27', price: 95, description: 'Cover frontale 2,7 m' },
        TOP: { code: 'M100-CS-L27', price: 45, description: 'Cover superiore 2,7 m' },
        MOUNT: { code: 'M100-PM-L27', price: 130, description: 'Profilo montaggio 2,7 m' },
      },
    },
  },
  SCORRIMENTO: {
    KIT1: { code: 'UNK-KIT1-K1A', price: 350, description: 'Kit scorrimento anta (prima/ultima)' },
    KIT2: { code: 'UNK-KIT2-K1A', price: 333, description: 'Kit scorrimento anta centrale' },
    KIT3: { code: 'UNK-KIT3-K1A', price: 343, description: 'Kit scorrimento anta centrale maggiorata' },
    KIT1S: { code: 'UNK-KIT1S-K1A', price: 450, description: 'Kit anta ridotta' },
    PUSH_TO_OPEN: { code: 'UNK-PTO', price: 100, description: 'Push to Open con Soft Close' },
    CINTA_MAGGIORATA: { code: 'UNK-CAM-L1500', price: 100, description: 'Cinta sincronizzazione ante maggiorate' },
  },
  FISSI: {
    PROFILI: {
      20: { code: 'UNK-GS2-L20', price: 244, description: 'Profilo superiore fissi 2 m' },
      30: { code: 'UNK-GS2-L30', price: 370, description: 'Profilo superiore fissi 3 m' },
      40: { code: 'UNK-GS2-L40', price: 454, description: 'Profilo superiore fissi 4 m' },
      60: { code: 'UNK-GS2-L60', price: 721, description: 'Profilo superiore fissi 6 m' },
    },
    KIT_ACCESSORI: { code: 'UNK-PF-K1A', price: 100, description: 'Kit accessori pannello fisso' },
    TELAIO: { code: 'UNK-TK3-L30 NO', price: 534, description: 'Telaio per pannello fisso' },
  },
  TELAI: {
    PER_ANTA: { code: 'UNK-TK1-L30', price: 541, description: 'Telaio anta scorrevole' },
    CENTRALE: { code: 'UNK-TK2-L30', price: 549, description: 'Telaio anta centrale' },
    SINGOLA_STANDARD: { code: 'UNK-TK3-L30', price: 534, description: 'Telaio anta singola' },
  },
  DOOR_BOX: {
    Destra: { code: 'UNK-DBDX-K1A', price: 919, description: 'Door Box Destra' },
    Sinistra: { code: 'UNK-BDSX-K1A', price: 919, description: 'Door Box Sinistra' },
  },
  MANIGLIE: {
    DEP01: { code: 'DEP01', price: 23.5, description: 'Traversino decorativo adesivo (m)' },
  },
};

const MAGNETICA_DEPENDENCIES = new Map([
  ['MAG-AC-CSB', 'MAG-AC-CAV'],
  ['MAG-AC-CSW', 'MAG-AC-CAV'],
]);

const QUOTE_ITEM_IMAGE_PATTERNS = [
  { pattern: /^UNK-GS[12]-/i, url: 'https://glasscom.it/wp-content/uploads/2024/10/Tavola-disegno-1-copia-312.png' },
  { pattern: /^M100-/i, url: 'https://glasscom.it/wp-content/uploads/2024/10/Tavola-disegno-1-copia-312.png' },
  { pattern: /^UNK-CCS/i, url: 'https://glasscom.it/wp-content/uploads/2024/10/Tavola-disegno-1-copia12.png' },
  { pattern: /^UNK-TK/i, url: 'https://glasscom.it/wp-content/uploads/2024/10/Tavola-disegno-112.png' },
  { pattern: /^UNK-PF/i, url: 'https://glasscom.it/wp-content/uploads/2024/10/fisso.jpg' },
  { pattern: /^UNK-DB/i, url: 'https://glasscom.it/wp-content/uploads/2024/10/DoorBoxSi.svg' },
  { pattern: /^UNK-BD/i, url: 'https://glasscom.it/wp-content/uploads/2024/10/DoorBoxSi.svg' },
  { pattern: /^DEP01$/i, url: 'https://glasscom.it/wp-content/uploads/2024/10/traversinoSi.svg' },
  { pattern: /^MAG-AC/i, url: 'https://glasscom.it/wp-content/uploads/2024/10/magnetica.jpg' },
];

const QUOTE_ITEM_IMAGE_CACHE = {};

const LARGHEZZA_MIN = 400;
const LARGHEZZA_MAX = 1500;

const DEFAULT_PROFILE_COLOR = '#23283a';
const DEFAULT_GLASS_COLOR = '#d6e9ff';

const isBrowserContext = typeof window !== 'undefined';
const DEFAULT_LOCAL_ASSET_BASE = './profili3dakina/';

const rawCustomAssetBase =
  isBrowserContext && typeof window.AKINA_ASSET_BASE === 'string'
    ? window.AKINA_ASSET_BASE.trim()
    : null;

const ALLOW_REMOTE_ASSETS =
  isBrowserContext && window.AKINA_ALLOW_REMOTE_ASSETS === true;

function normalizeAssetBase(base) {
  if (!base) return '';
  return base.endsWith('/') ? base : `${base}/`;
}

const normalizedAssetBase = normalizeAssetBase(
  rawCustomAssetBase === null ? DEFAULT_LOCAL_ASSET_BASE : rawCustomAssetBase
);

const GLASSCOM_ASSET_BASE = normalizedAssetBase;
const ASSET_BASE_ACTIVE = Boolean(GLASSCOM_ASSET_BASE);

const ASSET_PATHS = ASSET_BASE_ACTIVE
  ? {
      environments: {},
      parts: {
        leftProfile: `${GLASSCOM_ASSET_BASE}profiloVertSx.glb`,
        rightProfile: `${GLASSCOM_ASSET_BASE}profiloVertDx.glb`,
        topProfile: `${GLASSCOM_ASSET_BASE}profiloOrizzSup.glb`,
        bottomProfile: `${GLASSCOM_ASSET_BASE}profiloOrizzInf.glb`,
        track: `${GLASSCOM_ASSET_BASE}binario.glb`,
        coverLeft: `${GLASSCOM_ASSET_BASE}coverSx.glb`,
        coverRight: `${GLASSCOM_ASSET_BASE}coverDx.glb`,
      },
    }
  : { environments: {}, parts: {} };

const FALLBACK_GEOMETRIES = {
  verticalProfile: new THREE.BoxGeometry(0.05, 1, 0.05),
  horizontalProfile: new THREE.BoxGeometry(1, 0.05, 0.05),
  track: new THREE.BoxGeometry(1, 0.05, 0.08),
  cover: new THREE.BoxGeometry(0.03, 1, 0.04),
};

function createFallbackPart(key) {
  let geometry = null;
  switch (key) {
    case 'leftProfile':
    case 'rightProfile':
      geometry = FALLBACK_GEOMETRIES.verticalProfile;
      break;
    case 'topProfile':
    case 'bottomProfile':
      geometry = FALLBACK_GEOMETRIES.horizontalProfile;
      break;
    case 'track':
      geometry = FALLBACK_GEOMETRIES.track;
      break;
    case 'coverLeft':
    case 'coverRight':
      geometry = FALLBACK_GEOMETRIES.cover;
      break;
    default:
      geometry = null;
  }

  if (!geometry) {
    return null;
  }

  const group = new THREE.Group();
  const mesh = new THREE.Mesh(
    geometry.clone(),
    new THREE.MeshStandardMaterial({ color: DEFAULT_PROFILE_COLOR })
  );
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  group.add(mesh);
  return group;
}

const formatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
});

function formatCurrency(value) {
  return formatter.format(value);
}

function formatMeters(value) {
  return new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(value);
}

function formatMillimeters(value) {
  return new Intl.NumberFormat('it-IT', {
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value || 0)));
}

function mmFromCode(code) {
  return Math.round(Number(code || 0) * 100);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resolveQuoteItemImage(code) {
  if (!code) return null;
  const normalized = String(code).trim();
  for (const entry of QUOTE_ITEM_IMAGE_PATTERNS) {
    if (entry.pattern.test(normalized)) {
      return entry.url;
    }
  }
  return null;
}

function generateQuoteItemImage(code, description) {
  const displayCode = (code || 'N/D').toString().slice(0, 18);
  const descriptor = (description || '').toString().split(' ').slice(0, 3).join(' ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4c5bff" />
        <stop offset="100%" stop-color="#8ba6ff" />
      </linearGradient>
    </defs>
    <rect width="320" height="200" rx="24" fill="url(#grad)"/>
    <text x="24" y="110" font-family="'Poppins', 'Helvetica', 'Arial', sans-serif" font-size="44" fill="#ffffff" font-weight="600">${escapeHtml(displayCode)}</text>
    <text x="24" y="150" font-family="'Poppins', 'Helvetica', 'Arial', sans-serif" font-size="24" fill="rgba(255,255,255,0.85)">${escapeHtml(descriptor)}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getQuoteItemImage(item) {
  const code = item?.codice ? String(item.codice).trim() : '';
  if (code && QUOTE_ITEM_IMAGE_CACHE[code]) {
    return QUOTE_ITEM_IMAGE_CACHE[code];
  }
  const resolved = resolveQuoteItemImage(code);
  if (resolved) {
    QUOTE_ITEM_IMAGE_CACHE[code] = resolved;
    return resolved;
  }
  const generated = generateQuoteItemImage(code || 'Articolo', item?.descrizione || '');
  if (code) {
    QUOTE_ITEM_IMAGE_CACHE[code] = generated;
  }
  return generated;
}

function disposeObject3D(object) {
  if (!object) return;
  object.traverse((child) => {
    if (child.isMesh) {
      if (child.geometry) {
        child.geometry.dispose?.();
      }
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material?.dispose?.());
      } else if (child.material) {
        child.material.dispose?.();
      }
    }
  });
}

function clearGroup(group) {
  if (!group) return;
  while (group.children.length) {
    const child = group.children.pop();
    group.remove(child);
    disposeObject3D(child);
  }
}

function cloneGltfScene(gltf) {
  if (!gltf) return null;
  const clone = gltf.scene.clone(true);
  clone.traverse((node) => {
    if (node.isMesh) {
      node.geometry = node.geometry?.clone?.() ?? node.geometry;
      if (Array.isArray(node.material)) {
        node.material = node.material.map((material) => material?.clone?.() ?? material);
      } else if (node.material) {
        node.material = node.material.clone();
      }
    }
  });
  return clone;
}

function findTrackOptions(model, binario, montaggio) {
  if (model === 'MAGNETICA') {
    const family = TRACK_LENGTH_OPTIONS.MAGNETICA[binario === 'A vista' ? 'A vista' : 'Nascosto'];
    return family ?? [];
  }
  if (model === 'SINGOLA') {
    const key = montaggio === 'Parete' ? 'Parete' : 'A soffitto';
    return TRACK_LENGTH_OPTIONS.SINGOLA[key] ?? [];
  }
  return TRACK_LENGTH_OPTIONS.DEFAULT;
}

function addOrUpdateItem(list, item) {
  if (!item || !item.codice) return;
  const existing = list.find((entry) => entry.codice === item.codice);
  if (existing) {
    existing.quantita += item.quantita;
    if (item.descrizione) existing.descrizione = item.descrizione;
    if (typeof item.prezzo === 'number') existing.prezzo = item.prezzo;
    return;
  }
  list.push({ ...item });
}

class DoorVisualizer {
  constructor(container) {
    this.container = container;
    this.overlay = document.getElementById('viewer-loading');
    this.overlayBar = document.getElementById('viewer-loading-bar');
    this.overlayPercent = document.getElementById('viewer-loading-percent');
    this.assetWarning = document.getElementById('viewer-asset-warning');
    this.partButtonsContainer = document.getElementById('part-buttons');
    this.partInfoBox = document.getElementById('part-info');
    this.dimensionsInfo = document.getElementById('dimensions-info');
    this.moveControls = document.getElementById('door-move-controls');
    this.moveLeftButton = document.getElementById('move-doors-left');
    this.moveRightButton = document.getElementById('move-doors-right');
    this.resetButton = document.getElementById('reset-colors');
    this.resetCameraButton = document.getElementById('reset-camera');
    this.fullscreenButton = document.getElementById('fullscreen-toggle');

    this.scene = new THREE.Scene();
    this.scene.background = null;

    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 50);
    this.camera.position.set(2.4, 2.1, 3.6);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);
    this.renderer.setClearAlpha(0);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.maxWidth = '100%';
    this.renderer.domElement.style.maxHeight = '100%';
    this.renderer.domElement.style.objectFit = 'contain';
    this.renderer.domElement.style.display = 'block';
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.target.set(0, 1, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    const directional = new THREE.DirectionalLight(0xffffff, 0.85);
    directional.position.set(2, 3, 2);
    this.scene.add(ambient, directional);

    this.doorRoot = new THREE.Group();
    this.doorFrames = new THREE.Group();
    this.tracksGroup = new THREE.Group();
    this.doorRoot.add(this.doorFrames);
    this.doorRoot.add(this.tracksGroup);
    this.scene.add(this.doorRoot);

    this.villaGroup = null;

    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onStart = () => this.showOverlay(0);
    this.loadingManager.onProgress = (_, loaded, total) => {
      const percent = total ? Math.round((loaded / total) * 100) : 0;
      this.showOverlay(percent);
    };
    this.loadingManager.onLoad = () => this.onAssetsReady();

    this.loader = new GLTFLoader(this.loadingManager);
    this.gltfCache = new Map();
    this.availableAssetUrls = new Set();
    this.allowRemoteAssets = ALLOW_REMOTE_ASSETS;

    this.assetsReady = false;
    this.pendingUpdate = null;
    this.partMeshes = [];
    this.leafData = [];
    this.movableLeafData = [];
    this.closedOffset = 0;
    this.isClosed = true;
    this.frameThickness = 0.045;
    this.zOffset = 0.051;
    this.environmentMode = 'soloporta';
    this.lastParams = null;
    this.moveInterval = null;
    this.autoTimeline = null;

    this.bindUIControls();

    this.animate = this.animate.bind(this);
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('fullscreenchange', this.handleResize);

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.container);
    } else {
      this.resizeObserver = null;
    }

    this.preloadPromise = this.preloadAssets();

    this.animate();

    requestAnimationFrame(() => this.handleResize());
  }

  bindUIControls() {
    if (this.partButtonsContainer) {
      this.partButtonsContainer.classList.add('is-hidden');
      const buttons = this.partButtonsContainer.querySelectorAll('[data-part]');
      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          const part = button.dataset.part;
          if (part) {
            this.highlightPart(part);
          }
        });
      });
    }

    if (this.moveControls) {
      this.moveControls.classList.add('is-hidden');
      this.moveControls.setAttribute('aria-hidden', 'true');
    }

    this.resetButton?.addEventListener('click', () => this.resetHighlights());
    this.resetCameraButton?.addEventListener('click', () => this.resetCamera());
    this.fullscreenButton?.addEventListener('click', () => this.toggleFullscreen());

    if (this.moveLeftButton && this.moveRightButton) {
      const attach = (button, direction) => {
        const startMove = () => this.startContinuousMove(direction);
        const stopMove = () => this.stopContinuousMove();
        button.addEventListener('mousedown', (event) => {
          event.preventDefault();
          startMove();
        });
        button.addEventListener(
          'touchstart',
          (event) => {
            event.preventDefault();
            startMove();
          },
          { passive: false }
        );
        ['mouseup', 'mouseleave'].forEach((type) =>
          button.addEventListener(type, stopMove)
        );
        ['touchend', 'touchcancel'].forEach((type) =>
          button.addEventListener(type, stopMove)
        );
      };
      attach(this.moveLeftButton, -1);
      attach(this.moveRightButton, 1);
    }
  }

  async preloadAssets() {
    const environmentUrls = Object.values(ASSET_PATHS.environments || {});
    const partUrls = Object.values(ASSET_PATHS.parts || {});
    const urls = [...environmentUrls, ...partUrls].filter(Boolean);

    if (!urls.length) {
      this.showOverlay(100);
      this.onAssetsReady();
      return;
    }

    this.showOverlay(0);
    this.hideAssetWarning();

    const availability = await Promise.all(
      urls.map((url) => this.checkAssetAvailability(url))
    );

    const availableUrls = urls.filter((_, index) => availability[index]);
    this.availableAssetUrls = new Set(availableUrls);

    if (availableUrls.length !== urls.length) {
      const baseMessage = GLASSCOM_ASSET_BASE || DEFAULT_LOCAL_ASSET_BASE;
      const instruction = this.allowRemoteAssets
        ?
            'Verifica i permessi del dominio remoto oppure copia i file GLB nella cartella <strong>profili3dakina</strong> accanto alla pagina.'
        :
            'Copia i file GLB forniti da Glasscom nella cartella <strong>profili3dakina</strong> accanto alla pagina oppure abilita <code>window.AKINA_ALLOW_REMOTE_ASSETS = true</code> per usare un CDN autorizzato.';
      this.showAssetWarning(
        `<strong>Asset 3D mancanti</strong><p>Non è stato possibile raggiungere i modelli GLB da <code>${baseMessage}</code>.</p><p>${instruction}</p>`
      );
    }

    if (!availableUrls.length) {
      this.showOverlay(100);
      this.onAssetsReady();
      return;
    }

    try {
      await Promise.all(availableUrls.map((url) => this.loadAsset(url)));
    } catch (error) {
      console.warn('Errore durante il preload dei modelli 3D:', error);
    } finally {
      if (!this.assetsReady) {
        this.onAssetsReady();
      }
    }
  }

  async checkAssetAvailability(url) {
    if (!url) {
      return false;
    }

    try {
      const resolvedUrl = new URL(url, window.location.href);
      if (!this.allowRemoteAssets && resolvedUrl.origin !== window.location.origin) {
        console.warn(
          'Asset 3D remoto ignorato: abilita AKINA_ALLOW_REMOTE_ASSETS per consentire il caricamento cross-origin.',
          resolvedUrl.href
        );
        return false;
      }

      const response = await fetch(resolvedUrl.href, { method: 'HEAD' });
      if (!response.ok) {
        console.warn('Asset 3D non trovato o non raggiungibile:', resolvedUrl.href);
        return false;
      }
      return true;
    } catch (error) {
      console.warn('Impossibile verificare la disponibilità dell\'asset 3D:', url, error);
      return false;
    }
  }

  loadAsset(url) {
    if (!url || (this.availableAssetUrls.size && !this.availableAssetUrls.has(url))) {
      return Promise.resolve(null);
    }
    if (this.gltfCache.has(url)) {
      return Promise.resolve(this.gltfCache.get(url));
    }
    return new Promise((resolve) => {
      this.loader.load(
        url,
        (gltf) => {
          this.gltfCache.set(url, gltf);
          resolve(gltf);
        },
        undefined,
        (error) => {
          console.warn("Impossibile caricare l'asset 3D:", url, error);
          resolve(null);
        }
      );
    });
  }

  showOverlay(percent = 0) {
    if (this.overlay) {
      this.overlay.classList.remove('is-hidden');
    }
    if (this.overlayBar) {
      const clamped = Math.min(Math.max(percent, 0), 100);
      this.overlayBar.style.width = `${clamped}%`;
    }
    if (this.overlayPercent) {
      const clamped = Math.min(Math.max(Math.round(percent), 0), 100);
      this.overlayPercent.textContent = `${clamped}%`;
    }
  }

  hideOverlay() {
    if (this.overlay) {
      this.overlay.classList.add('is-hidden');
    }
  }

  showAssetWarning(message) {
    if (!this.assetWarning) return;
    this.assetWarning.innerHTML = message;
    this.assetWarning.classList.remove('is-hidden');
    this.assetWarning.removeAttribute('hidden');
  }

  hideAssetWarning() {
    if (!this.assetWarning) return;
    this.assetWarning.textContent = '';
    this.assetWarning.classList.add('is-hidden');
    this.assetWarning.setAttribute('hidden', '');
  }

  onAssetsReady() {
    this.assetsReady = true;
    this.hideOverlay();
    if (this.partButtonsContainer) {
      this.partButtonsContainer.classList.remove('is-hidden');
    }
    if (this.pendingUpdate) {
      const queued = this.pendingUpdate;
      this.pendingUpdate = null;
      this.updateDoor(queued);
    }
  }

  handleResize() {
    if (!this.container || !this.renderer || !this.camera) {
      return;
    }

    const width = Math.max(this.container.clientWidth, 1);
    const height = Math.max(this.container.clientHeight, 1);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  clonePart(key) {
    const url = ASSET_PATHS.parts?.[key];
    if (url && this.availableAssetUrls.has(url)) {
      const cached = this.gltfCache.get(url);
      if (cached) {
        return cloneGltfScene(cached);
      }
    }
    return createFallbackPart(key);
  }

  decoratePart(root, name, color, info) {
    if (!root) return null;
    const partInfo = { ...info };
    root.name = name;
    root.traverse((node) => {
      if (!node.isMesh) return;
      node.name = name;
      if (node.material) {
        node.material = node.material.clone();
        if (node.material.color) {
          node.material.color.set(color);
        }
      }
      node.userData.originalColor = node.material?.color?.clone?.();
      node.userData.partInfo = partInfo;
      this.partMeshes.push(node);
    });
    return root;
  }

  updateDoor(options = {}) {
    const shouldQueueUpdate = !this.assetsReady;
    if (shouldQueueUpdate) {
      this.pendingUpdate = { ...options };
    }

    const heightMm = Number(options.heightMm ?? options.height ?? 0);
    const totalWidthMm = Number(options.totalWidthMm ?? options.width ?? 0);

    const slidingLeavesInput = Array.isArray(options.slidingLeaves) ? options.slidingLeaves : [];
    const fixedPanelsInput = Array.isArray(options.fixedPanels) ? options.fixedPanels : [];

    const extraTrackLeftMm = Math.max(Number(options.extraTrackLeftMm) || 0, 0);
    const extraTrackRightMm = Math.max(Number(options.extraTrackRightMm) || 0, 0);
    const extraTrackLeftM = extraTrackLeftMm / 1000;
    const extraTrackRightM = extraTrackRightMm / 1000;
    const trackLengthMmRaw = Number(options.trackLengthMm) || 0;
    const inferredTrackLengthMm =
      trackLengthMmRaw > 0
        ? trackLengthMmRaw
        : totalWidthMm + extraTrackLeftMm + extraTrackRightMm;
    const trackLengthMm = Math.max(inferredTrackLengthMm, 0);
    const trackLengthM = trackLengthMm / 1000;

    const slidingLeaves = slidingLeavesInput
      .map((leaf, index) => {
        const widthMm = Number(leaf?.widthMm ?? leaf ?? 0);
        if (!Number.isFinite(widthMm) || widthMm <= 0) return null;
        return {
          index,
          widthMm,
          widthM: widthMm / 1000,
        };
      })
      .filter(Boolean);

    const fixedPanels = fixedPanelsInput
      .map((panel, index) => {
        const widthMm = Number(panel?.widthMm ?? panel ?? 0);
        if (!Number.isFinite(widthMm) || widthMm <= 0) return null;
        const side = panel?.side === 'left' ? 'left' : 'right';
        return {
          index,
          side,
          widthMm,
          widthM: widthMm / 1000,
        };
      })
      .filter(Boolean);

    const hasSegments = slidingLeaves.length > 0 || fixedPanels.length > 0;

    if (!heightMm || !totalWidthMm || !hasSegments) {
      clearGroup(this.doorFrames);
      clearGroup(this.tracksGroup);
      this.toggleMoveControls(false);
      this.lastParams = null;
      return;
    }

    const params = {
      heightMm,
      totalWidthMm,
      heightM: heightMm / 1000,
      totalWidthM: totalWidthMm / 1000,
      profileColor: options.profileColor || DEFAULT_PROFILE_COLOR,
      glassColor: options.glassColor || DEFAULT_GLASS_COLOR,
      trackMode: options.trackVisibility === 'hidden' ? 'hidden' : 'visible',
      showCover: Boolean(options.showCover),
      environment: options.environment || this.environmentMode || 'soloporta',
      openingMode: options.openingMode || 'single-right',
      slidingLeaves,
      fixedPanels,
      extraTrackLeftMm,
      extraTrackRightMm,
      extraTrackLeftM,
      extraTrackRightM,
      trackLengthMm,
      trackLengthM,
    };

    params.glassHeight = Math.max(params.heightM - 0.1, 0.05);
    params.slidingLeavesCount = slidingLeaves.length;
    params.fixedPanelsCount = fixedPanels.length;
    params.fixedPanelsShareTrack = Boolean(options.fixedPanelsShareTrack);
    const slidingTrackOverride =
      Number.isFinite(options.slidingTrackCount) && options.slidingTrackCount !== null
        ? Math.max(Math.floor(options.slidingTrackCount), 0)
        : null;
    params.slidingTrackCount = slidingTrackOverride;
    const requestedTrackCount =
      Number.isFinite(options.trackCount) && options.trackCount !== null
        ? Math.max(Math.floor(options.trackCount), 0)
        : null;
    const fallbackTrackCount =
      params.slidingLeavesCount > 0
        ? params.slidingLeavesCount
        : params.fixedPanelsCount > 0
        ? 1
        : 0;
    params.trackCount =
      requestedTrackCount !== null
        ? requestedTrackCount > 0 || fallbackTrackCount === 0
          ? requestedTrackCount
          : fallbackTrackCount
        : fallbackTrackCount;
    const averageLeafWidthMm =
      params.slidingLeavesCount > 0
        ? params.slidingLeaves.reduce((sum, leaf) => sum + leaf.widthMm, 0) /
          Math.max(params.slidingLeavesCount, 1)
        : params.totalWidthMm;
    params.primaryLeafWidthMm = averageLeafWidthMm;
    params.primaryLeafWidthM = params.primaryLeafWidthMm / 1000;
    params.glassWidth = Math.max(params.primaryLeafWidthM - 0.05, 0.05);
    params.overlapM = Math.max(Number(options.overlapMm) || 0, 0) / 1000;

    this.lastParams = params;

    this.resetHighlights();
    this.buildDoor(params);
    this.updateDimensionsInfo(this.lastParams);
  }

  prepareSegments(params) {
    const layout = [];
    const slidingSegments = [];
    const leftFixed = params.fixedPanels.filter((panel) => panel.side === 'left');
    const rightFixed = params.fixedPanels.filter((panel) => panel.side === 'right');

    const totalWidthM = params.totalWidthM;
    const leftFixedWidthM = leftFixed.reduce((sum, panel) => sum + panel.widthM, 0);
    const rightFixedWidthM = rightFixed.reduce((sum, panel) => sum + panel.widthM, 0);
    const overlapM = Math.max(Number(params.overlapM) || 0, 0);
    const extraLeft = Math.max(Number(params.extraTrackLeftM) || 0, 0);
    const extraRight = Math.max(Number(params.extraTrackRightM) || 0, 0);

    const doorLeftEdge = -totalWidthM / 2;
    const doorRightEdge = totalWidthM / 2;

    const slidingAreaStart = doorLeftEdge - extraLeft + leftFixedWidthM;
    const slidingAreaEnd = doorRightEdge + extraRight - rightFixedWidthM;

    let cursor = -totalWidthM / 2;
    let zIndex = 0;

    const pushSegment = (segment) => {
      const enriched = segment;
      enriched.zIndex = zIndex;
      layout.push(enriched);
      zIndex += 1;
    };

    leftFixed.forEach((panel) => {
      const center = cursor + panel.widthM / 2;
      pushSegment({
        ...panel,
        type: 'fixed',
        center,
        closedX: center,
        openX: center,
        isFixed: true,
      });
      cursor += panel.widthM;
    });

    params.slidingLeaves.forEach((leaf, index) => {
      const center = cursor + leaf.widthM / 2;
      const segment = {
        ...leaf,
        type: 'sliding',
        center,
        closedX: center,
        isFixed: false,
      };
      slidingSegments.push(segment);
      pushSegment(segment);
      const stepOverlap = index < params.slidingLeaves.length - 1 ? overlapM : 0;
      cursor += Math.max(leaf.widthM - stepOverlap, 0);
    });

    rightFixed.forEach((panel) => {
      const center = cursor + panel.widthM / 2;
      pushSegment({
        ...panel,
        type: 'fixed',
        center,
        closedX: center,
        openX: center,
        isFixed: true,
      });
      cursor += panel.widthM;
    });

    const openPositions = this.computeOpenPositions(
      params.openingMode,
      slidingSegments,
      slidingAreaStart,
      slidingAreaEnd
    );
    const stackLeftPositions = this.computeStackPositions(
      'left',
      slidingSegments,
      slidingAreaStart,
      slidingAreaEnd
    );
    const stackRightPositions = this.computeStackPositions(
      'right',
      slidingSegments,
      slidingAreaStart,
      slidingAreaEnd
    );

    slidingSegments.forEach((segment, index) => {
      segment.openX = openPositions[index];
      segment.stackLeftX = stackLeftPositions[index];
      segment.stackRightX = stackRightPositions[index];
    });

    const extraFixedTrack =
      !params.fixedPanelsShareTrack && params.fixedPanelsCount > 0 ? 1 : 0;
    const trackCount = Math.max(params.trackCount || slidingSegments.length || 0, 0);
    const safeTrackCount =
      trackCount > 0
        ? trackCount
        : Math.max(slidingSegments.length + extraFixedTrack, params.fixedPanelsCount > 0 ? 1 : 0);
    let slidingTrackCount;
    if (Number.isFinite(params.slidingTrackCount) && params.slidingTrackCount > 0) {
      const maxSliding = Math.max(safeTrackCount - extraFixedTrack, 0);
      slidingTrackCount = Math.min(Math.max(Math.floor(params.slidingTrackCount), 0), Math.max(maxSliding, 0));
    } else {
      const base = Math.max(safeTrackCount - extraFixedTrack, 0);
      slidingTrackCount = base > 0 ? base : slidingSegments.length > 0 ? 1 : 0;
    }
    const effectiveSlidingTrackCount =
      slidingTrackCount > 0 ? slidingTrackCount : slidingSegments.length > 0 ? 1 : 0;

    if (slidingSegments.length) {
      if (
        params.openingMode === 'biparting' &&
        effectiveSlidingTrackCount > 0 &&
        effectiveSlidingTrackCount < slidingSegments.length
      ) {
        const leftCount = Math.floor(slidingSegments.length / 2);
        slidingSegments.forEach((segment, index) => {
          const localIndex = index < leftCount ? index : index - leftCount;
          const trackIndex = Math.min(localIndex, Math.max(effectiveSlidingTrackCount - 1, 0));
          segment.trackIndex = Math.max(trackIndex, 0);
        });
      } else {
        slidingSegments.forEach((segment, index) => {
          const trackIndex = Math.min(index, Math.max(effectiveSlidingTrackCount - 1, 0));
          segment.trackIndex = Math.max(trackIndex, 0);
        });
      }
    }

    layout.forEach((segment) => {
      if (segment.isFixed) {
        segment.openX = segment.closedX;
        if (params.fixedPanelsShareTrack) {
          const totalFixed = params.fixedPanelsCount;
          const lastSlidingIndex = Math.max(effectiveSlidingTrackCount - 1, 0);
          if (totalFixed <= 1) {
            segment.trackIndex = 0;
          } else if (segment.side === 'right' && effectiveSlidingTrackCount > 1) {
            segment.trackIndex = lastSlidingIndex;
          } else if (segment.side === 'right' && effectiveSlidingTrackCount <= 1) {
            segment.trackIndex = 0;
          } else {
            segment.trackIndex = 0;
          }
        } else {
          segment.trackIndex = Math.max(safeTrackCount - 1, 0);
        }
      }
      segment.depthIndex = Number.isFinite(segment.trackIndex)
        ? segment.trackIndex
        : segment.zIndex || 0;
    });

    return {
      layout,
      slidingSegments,
      slidingAreaStart,
      slidingAreaEnd,
      slidingAreaWidth: Math.max(slidingAreaEnd - slidingAreaStart, 0),
    };
  }

  computeOpenPositions(mode, segments, areaStart, areaEnd) {
    const count = segments.length;
    if (count === 0) return [];

    const start = Math.min(areaStart, areaEnd);
    const end = Math.max(areaStart, areaEnd);
    const positions = new Array(count);
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const smallestWidth = segments.reduce(
      (min, segment) => Math.min(min, segment.widthM || min),
      Number.POSITIVE_INFINITY
    );
    const stackSpacing = clamp(
      smallestWidth * 0.25,
      Math.min((end - start) * 0.02, 0.04),
      0.12
    );

    if (mode === 'none') {
      return segments.map((segment) => segment.closedX ?? segment.center ?? 0);
    }

    if (mode === 'single-left') {
      const base = start + (segments[0]?.widthM ?? 0) / 2;
      for (let i = 0; i < count; i += 1) {
        const width = segments[i].widthM;
        const target = base + i * stackSpacing;
        const min = start + width / 2;
        const max = end - width / 2;
        positions[i] = clamp(target, min, max);
      }
      return positions;
    }

    if (mode === 'single-right') {
      const base = end - (segments[count - 1]?.widthM ?? 0) / 2;
      for (let i = count - 1; i >= 0; i -= 1) {
        const width = segments[i].widthM;
        const offset = (count - 1 - i) * stackSpacing;
        const target = base - offset;
        const min = start + width / 2;
        const max = end - width / 2;
        positions[i] = clamp(target, min, max);
      }
      return positions;
    }

    const leftCount = Math.floor(count / 2);
    const rightCount = count - leftCount;
    if (leftCount > 0) {
      const baseLeft = start + (segments[0]?.widthM ?? 0) / 2;
      for (let i = 0; i < leftCount; i += 1) {
        const width = segments[i].widthM;
        const target = baseLeft + i * stackSpacing;
        const min = start + width / 2;
        const max = end - width / 2;
        positions[i] = clamp(target, min, max);
      }
    }

    if (rightCount > 0) {
      const baseRight = end - (segments[count - 1]?.widthM ?? 0) / 2;
      for (let i = 0; i < rightCount; i += 1) {
        const index = leftCount + i;
        const width = segments[index].widthM;
        const target = baseRight - i * stackSpacing;
        const min = start + width / 2;
        const max = end - width / 2;
        positions[index] = clamp(target, min, max);
      }
    }

    return positions;
  }

  computeStackPositions(direction, segments, areaStart, areaEnd) {
    const count = segments.length;
    if (count === 0) return [];

    const start = Math.min(areaStart, areaEnd);
    const end = Math.max(areaStart, areaEnd);
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    if (direction === 'left') {
      const referenceWidth = segments[0]?.widthM ?? 0;
      const base = start + referenceWidth / 2;
      return segments.map((segment) => {
        const width = segment.widthM ?? referenceWidth;
        const min = start + width / 2;
        const max = end - width / 2;
        return clamp(base, min, max);
      });
    }

    if (direction === 'right') {
      const referenceWidth = segments[segments.length - 1]?.widthM ?? 0;
      const base = end - referenceWidth / 2;
      return segments.map((segment) => {
        const width = segment.widthM ?? referenceWidth;
        const min = start + width / 2;
        const max = end - width / 2;
        return clamp(base, min, max);
      });
    }

    return segments.map((segment) => segment.closedX ?? segment.center ?? 0);
  }

  buildDoor(params) {
    this.stopAutoCycle();
    clearGroup(this.doorFrames);
    clearGroup(this.tracksGroup);
    if (this.villaGroup) {
      this.scene.remove(this.villaGroup);
      disposeObject3D(this.villaGroup);
      this.villaGroup = null;
    }

    this.partMeshes = [];
    this.leafData = [];
    this.movableLeafData = [];
    this.closedOffset = 0;
    this.isClosed = true;

    this.applyEnvironment(params);

    this.doorFrames.position.set(0, params.heightM / 2, 0);

    const {
      layout,
      slidingAreaStart,
      slidingAreaEnd,
      slidingAreaWidth,
    } = this.prepareSegments(params);

    params.slidingAreaStart = slidingAreaStart;
    params.slidingAreaEnd = slidingAreaEnd;
    params.slidingAreaWidth = slidingAreaWidth;
    const averageLeafWidthMm =
      params.slidingLeavesCount > 0
        ? params.slidingLeaves.reduce((sum, leaf) => sum + leaf.widthMm, 0) /
          Math.max(params.slidingLeavesCount, 1)
        : params.totalWidthMm;
    params.primaryLeafWidthMm = averageLeafWidthMm;
    params.primaryLeafWidthM = params.primaryLeafWidthMm / 1000;
    this.lastParams = params;

    layout.forEach((segment) => {
      const segmentParams = {
        heightMm: params.heightMm,
        heightM: params.heightM,
        profileColor: params.profileColor,
        glassColor: params.glassColor,
        showCover: !segment.isFixed && params.showCover,
        glassHeight: params.glassHeight,
        slidingLeavesCount: params.slidingLeavesCount,
        fixedPanelsCount: params.fixedPanelsCount,
        doorWidthMm: segment.widthMm,
        doorWidthM: segment.widthM,
      };
      const leaf = this.buildLeaf(segment, segmentParams);
      if (leaf) {
        leaf.openX = segment.openX ?? segment.closedX ?? 0;
        leaf.closedX = segment.closedX ?? 0;
        leaf.stackLeftX = Number.isFinite(segment.stackLeftX)
          ? segment.stackLeftX
          : leaf.closedX;
        leaf.stackRightX = Number.isFinite(segment.stackRightX)
          ? segment.stackRightX
          : leaf.closedX;
        const depthIndex = Number.isFinite(segment.depthIndex)
          ? segment.depthIndex
          : segment.zIndex || 0;
        leaf.group.position.set(leaf.openX, 0, depthIndex * this.zOffset);
        this.doorFrames.add(leaf.group);
        this.leafData.push(leaf);
        if (!leaf.isFixed) {
          this.movableLeafData.push(leaf);
        }
      }
    });

    clearGroup(this.tracksGroup);
    if (params.trackCount > 0) {
      for (let i = 0; i < params.trackCount; i += 1) {
        const track = this.buildTrack(i, params);
        if (track) {
          this.tracksGroup.add(track);
        }
      }
    }

    if (!this.movableLeafData.length) {
      this.toggleMoveControls(false);
      this.updateCamera(params);
      return;
    }

    this.toggleMoveControls(false);
    this.startAutoCycle();
    this.updateCamera(params);
  }

  applyEnvironment(params) {
    this.environmentMode = params.environment || 'soloporta';
  }

  buildLeaf(segment, params) {
    const suffix = segment.zIndex ?? segment.index ?? 0;
    const group = new THREE.Group();
    group.name = `${segment.isFixed ? 'fixedPanel' : 'doorLeaf'}_${suffix}`;
    group.position.set(0, 0, 0);

    const pieces = segment.isFixed
      ? Math.max(params.fixedPanelsCount || 0, 1)
      : Math.max(params.slidingLeavesCount || 0, 1);

    const doorWidthM = params.doorWidthM || 0;
    const doorWidthMm = params.doorWidthMm || 0;
    const heightM = params.heightM || 0;
    const heightMm = params.heightMm || 0;

    const glassWidth = Math.max(doorWidthM - 0.05, 0.05);
    const profileInset = Math.max((doorWidthM - glassWidth) / 2, 0);
    const profileOffset = Math.max(doorWidthM / 2 - profileInset, 0);

    const commonInfo = {
      dimensions: `Altezza: ${formatMillimeters(heightMm)} mm`,
      pieces,
    };

    const leftProfile = this.decoratePart(
      this.clonePart('leftProfile'),
      `leftProfile_${suffix}`,
      params.profileColor,
      {
        ...commonInfo,
        name: 'Profilo Sinistro',
        code: 'UNK-A202-40',
        images: '/wp-content/uploads/2024/10/Tavola-disegno-112.png',
      }
    );
    if (leftProfile) {
      leftProfile.position.x = -profileOffset;
      leftProfile.scale.set(1, heightM, 1);
      group.add(leftProfile);
    }

    const rightProfile = this.decoratePart(
      this.clonePart('rightProfile'),
      `rightProfile_${suffix}`,
      params.profileColor,
      {
        ...commonInfo,
        name: 'Profilo Destro',
        code: 'UNK-A202-40',
        images: '/wp-content/uploads/2024/10/Tavola-disegno-112.png',
      }
    );
    if (rightProfile) {
      rightProfile.position.x = profileOffset;
      rightProfile.scale.set(1, heightM, 1);
      group.add(rightProfile);
    }

    const horizontalInfo = {
      name: 'Profilo Superiore',
      code: 'UNK-A201-40',
      dimensions: `Lunghezza: ${formatMillimeters(doorWidthMm)} mm`,
      pieces,
      images: '/wp-content/uploads/2024/10/Tavola-disegno-1-copia-412.png',
    };
    const topProfile = this.decoratePart(
      this.clonePart('topProfile'),
      `topProfile_${suffix}`,
      params.profileColor,
      horizontalInfo
    );
    if (topProfile) {
      topProfile.position.y = heightM / 2;
      topProfile.scale.set(doorWidthM, 1, 1);
      group.add(topProfile);
    }

    const bottomProfile = this.decoratePart(
      this.clonePart('bottomProfile'),
      `bottomProfile_${suffix}`,
      params.profileColor,
      {
        ...horizontalInfo,
        name: 'Profilo Inferiore',
      }
    );
    if (bottomProfile) {
      bottomProfile.position.y = -heightM / 2;
      bottomProfile.scale.set(doorWidthM, 1, 1);
      group.add(bottomProfile);
    }

    if (params.showCover) {
      const coverInfo = {
        name: 'Cover',
        code: 'UNK-A203-40',
        dimensions: `Altezza: ${formatMillimeters(heightMm)} mm`,
        pieces: pieces * 2,
        images: '/wp-content/uploads/2024/10/Tavola-disegno-1-copia12.png',
      };
      const coverLeft = this.decoratePart(
        this.clonePart('coverLeft'),
        `coverLeft_${suffix}`,
        params.profileColor,
        coverInfo
      );
      if (coverLeft) {
        coverLeft.position.x = -profileOffset;
        coverLeft.scale.set(1, heightM, 1);
        group.add(coverLeft);
      }
      const coverRight = this.decoratePart(
        this.clonePart('coverRight'),
        `coverRight_${suffix}`,
        params.profileColor,
        coverInfo
      );
      if (coverRight) {
        coverRight.position.x = profileOffset;
        coverRight.scale.set(1, heightM, 1);
        group.add(coverRight);
      }
    }

    const glassHeight = Math.max((params.glassHeight ?? heightM - 0.1), 0.05);

    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(glassWidth, glassHeight),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(params.glassColor),
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
      })
    );
    glass.name = `glassPanel_${suffix}`;
    glass.position.set(0, 0, 0);
    glass.renderOrder = 1;
    glass.userData.originalColor = glass.material.color.clone();
    glass.userData.partInfo = {
      name: 'Pannello Vetrato',
      code: 'GLASS',
      dimensions: `Larghezza: ${formatMillimeters(Math.max(doorWidthMm - 50, 0))} mm · Altezza: ${formatMillimeters(Math.max(heightMm - 100, 0))} mm`,
      pieces,
      images: '/wp-content/uploads/2024/10/Tavola-disegno-1-copia-412.png',
    };
    this.partMeshes.push(glass);
    group.add(glass);

    group.userData.closedX = segment.closedX ?? 0;
    group.userData.openX = segment.openX ?? segment.closedX ?? 0;
    group.userData.isFixed = Boolean(segment.isFixed);

    return {
      group,
      openX: group.userData.openX,
      closedX: group.userData.closedX,
      isFixed: Boolean(segment.isFixed),
    };
  }

  buildTrack(index, params) {
    const trackLengthMm = Math.max(Number(params.trackLengthMm) || Number(params.totalWidthMm) || 0, 0);
    const track = this.decoratePart(
      this.clonePart('track'),
      `track_${index}`,
      params.profileColor,
      {
        name: 'Binario',
        code: 'GS1',
        dimensions: `Lunghezza: ${formatMillimeters(trackLengthMm)} mm`,
        pieces: Math.max(params.trackCount || 1, 1),
        images: '/wp-content/uploads/2024/10/Tavola-disegno-1-copia-312.png',
      }
    );
    if (!track) return null;
    const trackVerticalOffset = this.frameThickness - (params.trackMode === 'hidden' ? 0.02 : 0);
    const extraLeft = Math.max(Number(params.extraTrackLeftM) || 0, 0);
    const extraRight = Math.max(Number(params.extraTrackRightM) || 0, 0);
    const trackLengthM = Math.max(Number(params.trackLengthM) || Number(params.totalWidthM) || 0, 0);
    const centerOffset = (extraRight - extraLeft) / 2;
    track.position.set(centerOffset, params.heightM + trackVerticalOffset, index * this.zOffset);
    track.scale.set(trackLengthM, 1, 1);
    return track;
  }

  updateCamera(params) {
    const horizontalSpan = Math.max(
      Number(params.totalWidthM) || 0,
      Number(params.trackLengthM) || Number(params.totalWidthM) || 0
    );
    const distance = Math.max(2.4, horizontalSpan * 1.35, params.heightM * 1.2);
    this.camera.position.set(distance, params.heightM * 0.75 + 0.4, distance);
    this.controls.target.set(0, params.heightM / 2, 0);
    this.controls.update();
  }

  updateDimensionsInfo(params) {
    if (!this.dimensionsInfo || !params) return;
    const parts = [];
    if (typeof params.slidingLeavesCount === 'number') {
      parts.push(`Ante scorrevoli: ${params.slidingLeavesCount}`);
    }
    if (params.fixedPanelsCount) {
      parts.push(`Pannelli fissi: ${params.fixedPanelsCount}`);
    }
    if (params.slidingLeavesCount) {
      parts.push(`Larghezza anta: ${formatMillimeters(params.primaryLeafWidthMm)} mm`);
    }
    parts.push(`Altezza: ${formatMillimeters(params.heightMm)} mm`);
    parts.push(`Larghezza totale: ${formatMillimeters(params.totalWidthMm)} mm`);
    this.dimensionsInfo.textContent = parts.join(' · ');
  }

  highlightPart(partName) {
    if (!partName) return;
    this.resetHighlights();
    const matches = this.partMeshes.filter((mesh) => {
      if (partName === 'cover') {
        return mesh.name?.startsWith('coverLeft_') || mesh.name?.startsWith('coverRight_');
      }
      return mesh.name?.startsWith(partName);
    });
    if (!matches.length) {
      this.showPartInfo(null);
      return;
    }
    matches.forEach((mesh) => {
      mesh.material?.color?.set?.(0xee0000);
    });
    this.showPartInfo(matches[0].userData?.partInfo || null);
  }

  resetHighlights() {
    this.partMeshes.forEach((mesh) => {
      if (mesh.userData?.originalColor && mesh.material?.color) {
        mesh.material.color.copy(mesh.userData.originalColor);
      }
    });
    this.showPartInfo(null);
  }

  stopAutoCycle() {
    if (this.autoTimeline) {
      this.autoTimeline.kill();
      this.autoTimeline = null;
    }
  }

  startAutoCycle() {
    this.stopAutoCycle();
    if (!this.movableLeafData.length) {
      this.isClosed = true;
      return;
    }

    const closedTargets = this.movableLeafData.map((leaf) =>
      Number.isFinite(leaf.closedX) ? leaf.closedX : 0
    );
    const stackRightTargets = this.movableLeafData.map((leaf, index) => {
      const fallback = Number.isFinite(closedTargets[index])
        ? closedTargets[index]
        : leaf.openX ?? 0;
      if (Number.isFinite(leaf.stackRightX)) {
        return leaf.stackRightX;
      }
      if (Number.isFinite(leaf.closedX)) {
        return leaf.closedX;
      }
      return fallback;
    });
    const stackLeftTargets = this.movableLeafData.map((leaf, index) => {
      const fallback = Number.isFinite(closedTargets[index])
        ? closedTargets[index]
        : leaf.openX ?? 0;
      if (Number.isFinite(leaf.stackLeftX)) {
        return leaf.stackLeftX;
      }
      if (Number.isFinite(leaf.closedX)) {
        return leaf.closedX;
      }
      return fallback;
    });
    const splitTargets = this.movableLeafData.map((leaf, index) => {
      const fallback = Number.isFinite(closedTargets[index])
        ? closedTargets[index]
        : leaf.openX ?? 0;
      if (Number.isFinite(leaf.openX)) {
        return leaf.openX;
      }
      return fallback;
    });

    this.movableLeafData.forEach((leaf, index) => {
      const target = Number.isFinite(closedTargets[index])
        ? closedTargets[index]
        : leaf.openX ?? 0;
      leaf.group.position.x = target;
    });

    this.isClosed = true;
    this.closedOffset = 0;
    this.toggleMoveControls(false);

    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });

    const addPause = (duration) => {
      timeline.to({}, { duration });
    };

    const animateLeaves = (targets, { duration = 1.1, onStart, onComplete } = {}) => {
      if (typeof onStart === 'function') {
        timeline.add(() => {
          onStart();
        });
      }

      this.movableLeafData.forEach((leaf, index) => {
        const fallback = Number.isFinite(closedTargets[index])
          ? closedTargets[index]
          : leaf.openX ?? 0;
        const target = Number.isFinite(targets[index]) ? targets[index] : fallback;
        timeline.to(
          leaf.group.position,
          {
            x: target,
            duration,
            ease: 'power2.inOut',
          },
          index === 0 ? '>' : '<'
        );
      });

      if (typeof onComplete === 'function') {
        timeline.add(() => {
          onComplete();
        });
      }
    };

    const mode = this.lastParams?.openingMode || 'single-right';
    const hasDistinctSplit = splitTargets.some((target, index) =>
      Math.abs(target - closedTargets[index]) > 1e-6
    );

    const queueClosed = () => {
      addPause(0.8);
      animateLeaves(closedTargets, {
        duration: 1.1,
        onComplete: () => {
          this.isClosed = true;
          this.closedOffset = 0;
        },
      });
    };

    addPause(0.6);

    if (mode === 'biparting' && hasDistinctSplit) {
      animateLeaves(splitTargets, {
        duration: 1.1,
        onStart: () => {
          this.isClosed = false;
        },
      });
      queueClosed();
    } else {
      animateLeaves(stackRightTargets, {
        duration: 1.1,
        onStart: () => {
          this.isClosed = false;
        },
      });

      queueClosed();

      animateLeaves(stackLeftTargets, {
        duration: 1.1,
        onStart: () => {
          this.isClosed = false;
        },
      });

      queueClosed();
    }

    this.autoTimeline = timeline;
    this.autoTimeline.play(0);
  }

  showPartInfo(info) {
    if (!this.partInfoBox) return;
    if (!info) {
      this.partInfoBox.setAttribute('hidden', 'true');
      this.partInfoBox.innerHTML = '';
      return;
    }
    const imageMarkup = info.images
      ? `<div class="viewer-part-info__media"><img src="${info.images}" alt="${info.name}" /></div>`
      : '';
    this.partInfoBox.innerHTML = `${imageMarkup}<div class="viewer-part-info__content"><p class="viewer-part-info__title">${info.name}</p><p class="viewer-part-info__code">Codice: ${info.code}</p><p class="viewer-part-info__dimensions">${info.dimensions}</p><p class="viewer-part-info__pieces">Numero di pezzi: ${info.pieces}</p></div>`;
    this.partInfoBox.removeAttribute('hidden');
  }

  openDoors(immediate = false) {
    this.stopAutoCycle();
    this.isClosed = false;
    this.closedOffset = 0;
    this.stopContinuousMove();
    this.toggleMoveControls(false);
    if (!this.movableLeafData.length) return;

    if (immediate) {
      this.movableLeafData.forEach((leaf) => {
        leaf.group.position.x = leaf.openX;
      });
      return;
    }

    this.movableLeafData.forEach((leaf) => {
      gsap.to(leaf.group.position, {
        x: leaf.openX,
        duration: 1,
        ease: 'power2.inOut',
      });
    });
  }

  closeDoors(immediate = false) {
    this.stopAutoCycle();
    if (!this.movableLeafData.length) return;
    this.isClosed = true;
    this.stopContinuousMove();
    const total = this.movableLeafData.length;
    let completed = 0;
    const onComplete = () => {
      this.toggleMoveControls(true);
    };

    if (immediate) {
      this.movableLeafData.forEach((leaf) => {
        leaf.group.position.x = leaf.closedX + this.closedOffset;
      });
      onComplete();
      return;
    }

    this.movableLeafData.forEach((leaf) => {
      gsap.to(leaf.group.position, {
        x: leaf.closedX + this.closedOffset,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          completed += 1;
          if (completed === total) {
            onComplete();
          }
        },
      });
    });
  }

  moveDoors(delta) {
    if (!this.isClosed || !this.movableLeafData.length || !this.lastParams) return;
    const areaWidth = this.lastParams.slidingAreaWidth ?? this.lastParams.totalWidthM ?? 0;
    const leafWidth = this.lastParams.primaryLeafWidthM ?? 0;
    const maxMove = Math.max(areaWidth / 2 - leafWidth / 2, 0);
    const newOffset = THREE.MathUtils.clamp(this.closedOffset + delta, -maxMove, maxMove);
    const actual = newOffset - this.closedOffset;
    if (Math.abs(actual) < 1e-6) return;
    this.closedOffset = newOffset;
    this.movableLeafData.forEach((leaf) => {
      leaf.group.position.x = leaf.closedX + this.closedOffset;
    });
  }

  startContinuousMove(direction) {
    if (!this.isClosed || !this.lastParams) return;
    const step = Math.max(this.lastParams.doorWidthM * 0.04, 0.01) * direction;
    this.moveDoors(step);
    this.stopContinuousMove();
    this.moveInterval = window.setInterval(() => this.moveDoors(step), 80);
  }

  stopContinuousMove() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }
  }

  toggleMoveControls(show) {
    if (!this.moveControls) return;
    if (show) {
      this.moveControls.classList.remove('is-hidden');
      this.moveControls.removeAttribute('aria-hidden');
    } else {
      this.moveControls.classList.add('is-hidden');
      this.moveControls.setAttribute('aria-hidden', 'true');
    }
  }

  captureSnapshot() {
    try {
      return this.renderer?.domElement?.toDataURL?.('image/png') || null;
    } catch (error) {
      console.warn('Impossibile generare l\'anteprima del 3D per il PDF.', error);
      return null;
    }
  }

  resetCamera() {
    if (!this.lastParams) return;
    this.updateCamera(this.lastParams);
  }

  toggleFullscreen() {
    const element = this.container;
    if (!document.fullscreenElement) {
      element.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

const visualizer = new DoorVisualizer(document.getElementById('viewer'));

const initialWidth = Number(document.getElementById('width')?.value) || 1200;
const initialHeight = Number(document.getElementById('height')?.value) || 2200;
const initialLeaves = Math.max(Number(document.getElementById('numero-ante-select')?.value) || 2, 1);
const initialLeafWidth = Math.max(Math.floor(initialWidth / Math.max(initialLeaves, 1)), 1);
const initialSlidingLeaves = Array.from({ length: initialLeaves }, () => ({ widthMm: initialLeafWidth }));
const initialRemainder = initialWidth - initialLeafWidth * initialLeaves;
if (initialRemainder !== 0 && initialSlidingLeaves.length > 0) {
  initialSlidingLeaves[initialSlidingLeaves.length - 1].widthMm = Math.max(
    initialSlidingLeaves[initialSlidingLeaves.length - 1].widthMm + initialRemainder,
    1
  );
}

const initialEnvironment = document.getElementById('environment-select')?.value || 'soloporta';

const initialDoorConfig = {
  heightMm: initialHeight,
  totalWidthMm: initialWidth,
  slidingLeaves: initialSlidingLeaves,
  fixedPanels: [],
  profileColor: DEFAULT_PROFILE_COLOR,
  glassColor: DEFAULT_GLASS_COLOR,
  trackVisibility: 'visible',
  showCover: true,
  openingMode: 'single-right',
  environment: initialEnvironment,
};

visualizer.updateDoor(initialDoorConfig);

if (visualizer.preloadPromise && typeof visualizer.preloadPromise.finally === 'function') {
  visualizer.preloadPromise
    .catch((error) => {
      console.warn('Impossibile completare il preload iniziale dei modelli 3D:', error);
    })
    .finally(() => {
      visualizer.updateDoor(initialDoorConfig);
      visualizer.handleResize();
    });
}

const selectors = {
  form: document.getElementById('akina-configurator-form'),
  formSteps: document.querySelectorAll('.form-step'),
  progressSteps: document.querySelectorAll('.progress-step'),
  prevButton: document.getElementById('step-prev'),
  nextButton: document.getElementById('step-next'),
  stepFeedback: document.getElementById('step-feedback'),
  widthInput: document.getElementById('width'),
  heightInput: document.getElementById('height'),
  modelContainer: document.querySelector('.model-selection'),
  modelInput: document.getElementById('model-select'),
  soloPannelloSection: document.getElementById('solo-pannello-section'),
  numPanelsPannelloInput: document.getElementById('num-panels-pannello'),
  panelDimensionsPannello: document.getElementById('panel-dimensions-container-pannello'),
  soloAntaSection: document.getElementById('solo-anta-section'),
  numPanelsAntaInput: document.getElementById('num-panels-anta'),
  panelDimensionsAnta: document.getElementById('panel-dimensions-container-anta'),
  numeroAnteSection: document.getElementById('numero-ante-section'),
  numeroAnteSelect: document.getElementById('numero-ante-select'),
  aperturaAnteSection: document.getElementById('apertura-ante-section'),
  aperturaAnteContainer: document.querySelector('.apertura-ante-selection'),
  aperturaAnteInput: document.getElementById('apertura-ante-select'),
  tipologiaSection: document.getElementById('tipologia-section'),
  tipologiaContainer: document.querySelector('.tipologia-selection'),
  tipologiaInput: document.getElementById('tipologia-select'),
  pannelloFissoContainer: document.querySelector('.pannello-fisso-selection'),
  pannelloFissoInput: document.getElementById('pannello-fisso-select'),
  pannelloFissoExtra: document.getElementById('pannello-fisso-extra'),
  numeroPannelliFissiInput: document.getElementById('numero-pannelli-fissi'),
  pannelliSuBinariQuestion: document.getElementById('pannelli-su-binari-question'),
  pannelliSuBinariContainer: document.querySelector('#pannelli-su-binari-question .pannelli-scelta'),
  pannelliSuBinariInput: document.getElementById('pannelli-su-binari-select'),
  sceltaPannelloFissoContainer: document.getElementById('scelta-dimensioni-pannello-fisso'),
  sceltaPannelloFissoInput: document.getElementById('sceltaPannelloFissoHidden'),
  campoLarghezzaPannelloFisso: document.getElementById('campo-larghezza-pannello-fisso'),
  larghezzaPannelloFissoInput: document.getElementById('larghezza-pannello-fisso'),
  larghezzaPannelloFissoHidden: document.getElementById('input-larghezza-pannello-fisso'),
  profiloSuperioreSection: document.getElementById('profilo-superiore-section'),
  profiloSuperioreContainer: document.querySelector('.profilo-superiore-selection'),
  profiloSuperioreInput: document.getElementById('profilo-superiore-fissi-select'),
  anteNascosteContainer: document.querySelector('.ante-nascoste-selection'),
  anteNascosteInput: document.getElementById('ante-nascoste-select'),
  doorBoxSection: document.getElementById('door-box-section'),
  doorBoxContainer: document.querySelector('#door-box-section > .door-box-selection'),
  doorBoxInput: document.getElementById('door-box-select'),
  doorBoxMountingWrapper: document.getElementById('door-box-mounting'),
  doorBoxMountingContainer: document.querySelector('#door-box-mounting .door-box-selection'),
  doorBoxMountingInput: document.getElementById('door-box-mounting-select'),
  binarioContainer: document.querySelector('#binario-select')?.closest('.configurator-section')?.querySelector('.binario-selection'),
  binarioInput: document.getElementById('binario-select'),
  montaggioSection: document.getElementById('montaggio-section'),
  montaggioSelect: document.getElementById('montaggio-select'),
  lunghezzaBinarioMsg: document.getElementById('lunghezza-binario-msg'),
  lunghezzaBinarioSelect: document.getElementById('lunghezza-binario-select'),
  traversinoContainer: document.querySelector('#traversino-section .traversino-selection'),
  traversinoInput: document.getElementById('traversino-select'),
  traversinoMetersWrapper: document.getElementById('traversino-meters'),
  traversinoMetersInput: document.getElementById('traversino-meters-input'),
  environmentInput: document.getElementById('environment-select'),
  magneticaOptionalSection: document.getElementById('magnetica-optional-section'),
  optionalTrascinamento: document.querySelectorAll('.optional-trascinamento'),
  kitTrascinamento: document.querySelectorAll('.kit-trascinamento-only'),
  maniglieInputs: document.querySelectorAll('input[name^="maniglie_nicchie_quantity"]'),
  kitCheckboxes: document.querySelectorAll('input[name="kit_lavorazione[]"]'),
  optionalCheckboxes: document.querySelectorAll('input[name="optional[]"]'),
  optionalMagneticaCheckboxes: document.querySelectorAll('input[name="optional_magnetica[]"]'),
  selectAllKits: document.getElementById('select-all-kits'),
  resultsPanel: document.querySelector('.summary-panel--quote'),
  cutsPanel: document.querySelector('.summary-panel--cuts'),
  fullSummaryButton: document.getElementById('open-full-summary'),
  savePdfButton: document.getElementById('save-pdf-button'),
  quoteTotal: document.getElementById('quote-total'),
  quoteBreakdown: document.getElementById('quote-breakdown'),
  summaryList: document.getElementById('selection-summary'),
  cutsBody: document.getElementById('cuts-body'),
  viewerHeightLabel: document.getElementById('viewer-height-label'),
  viewerWidthLabel: document.getElementById('viewer-width-label'),
  viewerTrackLabel: document.getElementById('viewer-track-label'),
};

const manigliaInputs = Array.from(selectors.maniglieInputs ?? []);

function setFlexVisibility(element, visible) {
  if (!element) return;
  element.style.display = visible ? 'flex' : 'none';
}

function setBlockVisibility(element, visible) {
  if (!element) return;
  element.style.display = visible ? 'block' : 'none';
}

function toggleRequired(input, isRequired) {
  if (!input) return;
  if (isRequired) {
    input.setAttribute('required', '');
  } else {
    input.removeAttribute('required');
  }
}

const formSteps = Array.from(selectors.formSteps ?? []);
let currentStepIndex = 0;

function showStepFeedback(message = '') {
  if (!selectors.stepFeedback) return;
  selectors.stepFeedback.textContent = message;
}

function toggleSummaryCards(visible) {
  if (selectors.resultsPanel) {
    selectors.resultsPanel.classList.toggle('is-collapsed', !visible);
  }
  if (selectors.cutsPanel) {
    selectors.cutsPanel.classList.toggle('is-collapsed', !visible);
  }
  if (visible) {
    requestAnimationFrame(() => visualizer.handleResize());
  }
}

function updateStep(index) {
  if (!formSteps.length) return;
  formSteps.forEach((step, stepIndex) => {
    const isActive = stepIndex === index;
    step.classList.toggle('is-active', isActive);
    step.setAttribute('aria-hidden', isActive ? 'false' : 'true');
  });

  Array.from(selectors.progressSteps ?? []).forEach((node, stepIndex) => {
    const isActive = stepIndex === index;
    node.classList.toggle('is-active', isActive);
    node.classList.toggle('is-complete', stepIndex < index);
    if (isActive) {
      node.setAttribute('aria-current', 'step');
    } else {
      node.removeAttribute('aria-current');
    }
  });

  if (selectors.prevButton) {
    selectors.prevButton.disabled = index === 0;
  }

  if (selectors.nextButton) {
    selectors.nextButton.style.display = index >= formSteps.length - 1 ? 'none' : 'inline-flex';
  }

  toggleSummaryCards(index === formSteps.length - 1);
  showStepFeedback('');
  currentStepIndex = index;
}

function validateStep(index) {
  const step = formSteps[index];
  if (!step) return true;

  const fields = Array.from(step.querySelectorAll('input, select, textarea')).filter((field) => !field.disabled);
  fields.forEach((field) => {
    field.closest('.configurator-section')?.classList.remove('configurator-section--error');
  });

  for (const field of fields) {
    const section = field.closest('.configurator-section');
    if (field.type === 'hidden') {
      const shouldValidate = field.dataset.stepValidate === 'true' && field.required;
      if (shouldValidate && !field.value) {
        section?.classList.add('configurator-section--error');
        showStepFeedback(field.dataset.validationMessage || 'Completa il campo obbligatorio.');
        section?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
      continue;
    }

    if (field.offsetParent === null) {
      continue;
    }

    if (!field.checkValidity()) {
      section?.classList.add('configurator-section--error');
      field.reportValidity();
      showStepFeedback(field.validationMessage);
      return false;
    }
  }

  showStepFeedback('');
  return true;
}

function goToStep(index, { validateCurrent = false } = {}) {
  if (!formSteps.length) return;
  const target = Math.max(0, Math.min(index, formSteps.length - 1));
  if (validateCurrent && !validateStep(currentStepIndex)) {
    return;
  }

  updateStep(target);

  if (target === formSteps.length - 1) {
    refreshOutputs({ force: true });
  }
}

updateStep(0);

function gatherCheckboxDetails(inputs) {
  return Array.from(inputs ?? [])
    .filter((input) => input.checked)
    .map((input) => ({
      value: input.value,
      name: input.dataset.name || input.value,
      price: Number(input.dataset.price || 0),
    }));
}

function getCheckboxMeta(inputs, value) {
  const node = Array.from(inputs ?? []).find((input) => input.value === value);
  if (!node) return null;
  return {
    value: node.value,
    name: node.dataset.name || node.value,
    price: Number(node.dataset.price || 0),
  };
}

function setOptionalChecked(code, checked) {
  const checkbox = Array.from(selectors.optionalCheckboxes ?? []).find((input) => input.value === code);
  if (!checkbox) return;
  checkbox.checked = checked;
  checkbox.dispatchEvent(new Event('change', { bubbles: true }));
}

function setMagneticaOptionalChecked(code, checked) {
  const checkbox = Array.from(selectors.optionalMagneticaCheckboxes ?? []).find((input) => input.value === code);
  if (!checkbox) return;
  checkbox.checked = checked;
  checkbox.dispatchEvent(new Event('change', { bubbles: true }));
}

function getCardLabel(container, selector, value, fallback = '—') {
  if (!container || !value) return fallback;
  const option = Array.from(container.querySelectorAll(selector)).find(
    (node) => node.dataset.value === value
  );
  if (!option) return fallback;
  const text = option.querySelector('span')?.textContent?.trim();
  return text || fallback;
}

function updatePanelDimensions(container, count, prefix) {
  if (!container) return;
  container.innerHTML = '';
  const safeCount = Number(count) || 0;
  const baseWidth = Number(selectors.widthInput?.value) || 0;
  const baseHeight = Number(selectors.heightInput?.value) || 0;

  for (let index = 1; index <= safeCount; index += 1) {
    const widthLabel = document.createElement('label');
    widthLabel.textContent = `Larghezza ${prefix} ${index} (mm)`;
    const widthInput = document.createElement('input');
    widthInput.type = 'number';
    widthInput.name = `${prefix}_width_${index}`;
    widthInput.min = '200';
    widthInput.max = '4000';
    widthInput.value = baseWidth && safeCount ? Math.round(baseWidth / safeCount) : '';
    widthInput.required = true;
    widthLabel.appendChild(widthInput);

    const heightLabel = document.createElement('label');
    heightLabel.textContent = `Altezza ${prefix} ${index} (mm)`;
    const heightInput = document.createElement('input');
    heightInput.type = 'number';
    heightInput.name = `${prefix}_height_${index}`;
    heightInput.min = '200';
    heightInput.max = '4000';
    heightInput.value = baseHeight || '';
    heightInput.required = true;
    heightLabel.appendChild(heightInput);

    container.append(widthLabel, heightLabel);
  }
}

function updateNumeroAnteOptions(model) {
  const select = selectors.numeroAnteSelect;
  if (!select) return;
  const available = MODEL_ANTE_OPTIONS[model] ?? MODEL_ANTE_OPTIONS.DEFAULT;
  const previous = select.value;
  select.innerHTML = '';

  available.forEach((value) => {
    const option = document.createElement('option');
    option.value = String(value);
    option.textContent = `${value} ${value === 1 ? 'anta' : 'ante'}`;
    select.appendChild(option);
  });

  if (available.length === 0) {
    select.value = '';
    return;
  }

  const preferred = available.includes(Number(previous)) ? previous : String(available[0]);
  select.value = preferred;
  select.dispatchEvent(new Event('change', { bubbles: true }));
}

function isBipartingAllowed(model, count) {
  if (!model || !Number.isFinite(count)) return false;
  if (count < 4 || count % 2 !== 0) return false;
  return model === 'TRASCINAMENTO' || model === 'INDIPENDENTE';
}

function updateAperturaAvailability() {
  const option = selectors.aperturaAnteContainer?.querySelector(
    '.apertura-ante-option[data-value="Destra Sinistra"]'
  );
  if (!option) return;

  const model = selectors.modelInput?.value || '';
  const anteCount = Number(selectors.numeroAnteSelect?.value || 0);
  const allowed = isBipartingAllowed(model, anteCount);

  option.classList.toggle('is-disabled', !allowed);
  option.setAttribute('aria-disabled', allowed ? 'false' : 'true');
  option.tabIndex = allowed ? 0 : -1;

  if (!allowed && selectors.aperturaAnteInput?.value === 'Destra Sinistra') {
    aperturaGroup?.select('Normale');
  }
}

function handleNumeroAnteChange() {
  const count = Number(selectors.numeroAnteSelect?.value || 0);
  const shouldShow = count > 1;
  setFlexVisibility(selectors.aperturaAnteSection, shouldShow);
  toggleRequired(selectors.aperturaAnteInput, shouldShow);
  if (!shouldShow && aperturaGroup) {
    aperturaGroup.clear();
  }
  updateAperturaAvailability();
}

function handleNumeroPannelliFissiChange() {
  const count = Number(selectors.numeroPannelliFissiInput?.value || 0);
  const showQuestion = selectors.pannelloFissoInput?.value === 'Si' && count > 0;
  setBlockVisibility(selectors.pannelliSuBinariQuestion, showQuestion);
  toggleRequired(selectors.pannelliSuBinariInput, showQuestion);
  if (showQuestion && pannelliSuBinariGroup && !selectors.pannelliSuBinariInput.value) {
    pannelliSuBinariGroup.select('Si');
  }
  if (!showQuestion && pannelliSuBinariGroup) {
    pannelliSuBinariGroup.clear();
  }
  updateTrackLengthOptions();
}

function handlePannelloFissoChange(value) {
  const enabled = value === 'Si';
  setBlockVisibility(selectors.pannelloFissoExtra, enabled);
  setFlexVisibility(selectors.profiloSuperioreSection, enabled);
  toggleRequired(selectors.numeroPannelliFissiInput, enabled);
  toggleRequired(selectors.sceltaPannelloFissoInput, enabled);
  toggleRequired(selectors.profiloSuperioreInput, enabled);
  handleNumeroPannelliFissiChange();

  if (!enabled) {
    selectors.numeroPannelliFissiInput.value = '';
    if (pannelliSuBinariGroup) pannelliSuBinariGroup.clear();
    if (pannelloDimensionGroup) pannelloDimensionGroup.clear();
    if (profiloSuperioreGroup) profiloSuperioreGroup.clear();
    selectors.larghezzaPannelloFissoInput.value = '';
    selectors.larghezzaPannelloFissoHidden.value = '';
  } else {
    if (profiloSuperioreGroup) {
      profiloSuperioreGroup.select('Quanto i fissi');
    }
    if (pannelloDimensionGroup && !selectors.sceltaPannelloFissoInput.value) {
      pannelloDimensionGroup.select('uguale_anta');
    }
  }
  updateTrackLengthOptions();
}

function handleSceltaPannelloFissoChange(value) {
  const manual = value === 'manuale';
  setBlockVisibility(selectors.campoLarghezzaPannelloFisso, manual);
  toggleRequired(selectors.larghezzaPannelloFissoInput, manual);
  if (!manual) {
    selectors.larghezzaPannelloFissoInput.value = '';
    selectors.larghezzaPannelloFissoHidden.value = '';
  } else {
    selectors.larghezzaPannelloFissoHidden.value = selectors.larghezzaPannelloFissoInput.value;
  }
}

function handleDoorBoxChange(value) {
  const enabled = value === 'Si';
  setBlockVisibility(selectors.doorBoxMountingWrapper, enabled);
  toggleRequired(selectors.doorBoxMountingInput, enabled);
  if (!enabled && doorBoxMountingGroup) {
    doorBoxMountingGroup.clear();
  }
  setOptionalChecked(PRICE_TABLE.SCORRIMENTO.PUSH_TO_OPEN.code, enabled);
}

function handleTraversinoChange(value) {
  const enabled = value === 'Si';
  setBlockVisibility(selectors.traversinoMetersWrapper, enabled);
  toggleRequired(selectors.traversinoMetersInput, enabled);
  if (!enabled) {
    selectors.traversinoMetersInput.value = '';
  }
}

function handleAnteNascosteChange() {
  updateTrackLengthOptions();
}

function resolveMontaggioValue(model) {
  const binario = selectors.binarioInput?.value || 'A vista';
  const pannelloFisso = selectors.pannelloFissoInput?.value || 'No';
  const pannelliSuBinari = selectors.pannelliSuBinariInput?.value || '';

  if (model === 'MAGNETICA' && binario === 'Nascosto') {
    if (selectors.montaggioSelect) {
      selectors.montaggioSelect.value = 'A soffitto';
      selectors.montaggioSelect.setAttribute('disabled', 'true');
    }
    return 'A soffitto';
  }

  let forcedValue = '';
  if (model === 'SINGOLA' && pannelloFisso === 'Si' && pannelliSuBinari === 'No') {
    forcedValue = 'A soffitto';
  }

  if (selectors.montaggioSelect) {
    if (model === 'SINGOLA' || (model === 'MAGNETICA' && binario === 'A vista')) {
      selectors.montaggioSelect.removeAttribute('disabled');
      if (!selectors.montaggioSelect.value) {
        selectors.montaggioSelect.value = 'A soffitto';
      }
      if (forcedValue) {
        selectors.montaggioSelect.value = forcedValue;
        selectors.montaggioSelect.setAttribute('disabled', 'true');
      }
    } else {
      selectors.montaggioSelect.value = 'A soffitto';
      selectors.montaggioSelect.setAttribute('disabled', 'true');
    }
  }

  if (forcedValue) return forcedValue;
  if (model === 'SINGOLA') return selectors.montaggioSelect?.value || 'A soffitto';
  if (model === 'MAGNETICA' && binario === 'A vista') {
    return selectors.montaggioSelect?.value || 'A soffitto';
  }
  return 'A soffitto';
}

function shouldShowMontaggioSection(model) {
  const binario = selectors.binarioInput?.value || 'A vista';
  if (model === 'SINGOLA') return true;
  if (model === 'MAGNETICA' && binario === 'A vista') return true;
  return false;
}

function syncMontaggioVisibility(model) {
  const show = shouldShowMontaggioSection(model);
  setFlexVisibility(selectors.montaggioSection, show);
  toggleRequired(selectors.montaggioSelect, show);
}

function updateTrackLengthOptions() {
  const select = selectors.lunghezzaBinarioSelect;
  if (!select) return;
  const model = document.getElementById('model-select')?.value || 'TRASCINAMENTO';
  const binario = selectors.binarioInput?.value || 'A vista';
  syncMontaggioVisibility(model);
  const montaggio = resolveMontaggioValue(model);
  const options = findTrackOptions(model, binario, montaggio);
  const previous = select.value;
  select.innerHTML = '';

  options.forEach(({ code, meters, label }) => {
    const option = document.createElement('option');
    option.value = String(code);
    option.dataset.code = String(code);
    option.dataset.meters = String(meters);
    option.dataset.mm = String(mmFromCode(code));
    option.dataset.label = label;
    option.textContent = label;
    select.appendChild(option);
  });

  if (options.length > 0) {
    const preferred = options.find((item) => String(item.code) === previous)
      ? previous
      : String(options[0].code);
    select.value = preferred;
    selectors.lunghezzaBinarioMsg.textContent = '';
  } else {
    selectors.lunghezzaBinarioMsg.textContent = 'Compila i campi precedenti per mostrare le lunghezze disponibili.';
  }
}

function collectConfiguration() {
  if (!selectors.form) return null;
  const data = new FormData(selectors.form);
  const model = data.get('model') || 'TRASCINAMENTO';

  const optionalDetails = gatherCheckboxDetails(selectors.optionalCheckboxes);
  const optionalMagneticaDetails = gatherCheckboxDetails(selectors.optionalMagneticaCheckboxes);
  const kitDetails = gatherCheckboxDetails(selectors.kitCheckboxes);

  const maniglieDetails = manigliaInputs
    .map((input) => ({
      code: input.name.replace(/.*\[(.*)\]/, '$1'),
      quantity: Number(input.value || 0),
      price: Number(input.dataset.price || 0),
      name: input.dataset.name || input.name,
    }))
    .filter((item) => item.quantity > 0);

  const numeroAnteValue = Number(data.get('numero_ante')) || 0;
  const soloPannelloCount = Number(data.get('num_panels_pannello')) || 0;
  const soloAntaCount = Number(data.get('num_panels_anta')) || 0;

  const trackOption = selectors.lunghezzaBinarioSelect?.selectedOptions?.[0] || null;
  const trackCode = Number(trackOption?.dataset.code || data.get('lunghezza_binario') || 0);
  const trackMeters = Number(trackOption?.dataset.meters || 0);
  const trackLabel = trackOption?.dataset.label || trackOption?.textContent?.trim() || '';
  const trackMm = Number(trackOption?.dataset.mm || 0);

  const leaves = (() => {
    if (model === 'SOLO_PANNELLO') return soloPannelloCount || 1;
    if (model === 'SOLO_ANTA') return soloAntaCount || 1;
    return numeroAnteValue || 1;
  })();

  return {
    width: Number(data.get('width')) || 0,
    height: Number(data.get('height')) || 0,
    model,
    leaves,
    numeroAnte: numeroAnteValue || null,
    aperturaAnte: data.get('apertura_ante') || '',
    tipologia: data.get('tipologia') || '',
    pannelloFisso: data.get('pannello_fisso') || '',
    numeroPannelliFissi: Number(data.get('numero_pannelli_fissi')) || 0,
    pannelliSuBinari: data.get('pannelli_su_binari') || '',
    sceltaPannelloFisso: data.get('sceltaPannelloFisso') || '',
    larghezzaPannelloFisso:
      Number(data.get('larghezza_pannello_fisso')) || Number(data.get('larghezza_pannello_fisso_hidden')) || 0,
    profiloSuperioreFissi: data.get('profilo_superiore_fissi') || '',
    anteNascoste: data.get('ante_nascoste') || '',
    doorBox: data.get('door_box') || '',
    doorBoxMounting: data.get('door_box_mounting') || '',
    binario: data.get('binario') || 'A vista',
    montaggio: data.get('montaggio') || '',
    lunghezzaBinario: trackMm || mmFromCode(trackCode),
    lunghezzaBinarioCodice: trackCode,
    lunghezzaBinarioMetri: trackMeters,
    lunghezzaBinarioLabel: trackLabel,
    traversino: data.get('traversino') || '',
    traversinoMeters: Number(data.get('traversino_meters')) || 0,
    optionalDetails,
    optionalMagneticaDetails,
    kitDetails,
    maniglieDetails,
    soloPannelloCount,
    soloAntaCount,
    environment: data.get('environment') || 'soloporta',
  };
}

function deriveConfiguration(config) {
  if (!config) return null;
  const model = config.model;
  let numeroAnte = 0;

  if (model === 'SINGOLA') {
    numeroAnte = config.tipologia === '1+1' ? 2 : 1;
  } else if (model === 'SOLO_PANNELLO') {
    numeroAnte = 0;
  } else if (model === 'SOLO_ANTA') {
    numeroAnte = config.soloAntaCount || 1;
  } else if (config.numeroAnte) {
    numeroAnte = config.numeroAnte;
  } else {
    numeroAnte = config.leaves || 0;
  }

  let apertura = config.aperturaAnte;
  const canBiparting = apertura === 'Destra Sinistra' && isBipartingAllowed(model, numeroAnte);
  if (apertura === 'Destra Sinistra' && !canBiparting) {
    apertura = 'Normale';
  }

  let numeroBinari = numeroAnte;
  if (model === 'SINGOLA') {
    numeroBinari = 1;
  } else if (canBiparting) {
    numeroBinari = Math.max(Math.floor(numeroAnte / 2), 1);
  }

  const fixedPanelsDeclared =
    config.pannelloFisso === 'Si' && (Number(config.numeroPannelliFissi) || 0) > 0;
  if (fixedPanelsDeclared) {
    if (config.pannelliSuBinari === 'No') {
      numeroBinari = Math.max(numeroBinari, 0) + 1;
    } else {
      numeroBinari = Math.max(numeroBinari, 1);
    }
  }

  const realNumeroAnte = numeroAnte + (config.doorBox === 'Si' ? 1 : 0);

  const trackCode = config.lunghezzaBinarioCodice || 0;
  let trackMm = config.lunghezzaBinario || mmFromCode(trackCode);
  let trackMeters = config.lunghezzaBinarioMetri || trackMm / 1000;

  let montaggio = config.montaggio || 'A soffitto';
  if (model === 'TRASCINAMENTO' || model === 'INDIPENDENTE') {
    montaggio = 'A soffitto';
  } else if (model === 'MAGNETICA' && config.binario === 'Nascosto') {
    montaggio = 'A soffitto';
  } else if (model !== 'SINGOLA' && model !== 'MAGNETICA') {
    montaggio = 'A soffitto';
  } else if (!montaggio) {
    montaggio = 'A soffitto';
  }

  if (model === 'SINGOLA' && config.pannelloFisso === 'Si' && config.pannelliSuBinari === 'No') {
    montaggio = 'A soffitto';
  }

  const pannelliCount = Math.max(config.numeroPannelliFissi || 0, 0);

  let slidingSheet = null;
  if (
    (model === 'TRASCINAMENTO' || model === 'INDIPENDENTE') &&
    numeroAnte > 0 &&
    Number(config.width) > 0 &&
    Number(config.height) > 0
  ) {
    try {
      slidingSheet = calculateSlidingModelCutSheet({
        numeroAnte,
        pannelloFisso: config.pannelloFisso,
        sceltaPannelloFisso: config.sceltaPannelloFisso,
        numeroPannelliFissi: config.numeroPannelliFissi,
        larghezzaPannelloFisso: config.larghezzaPannelloFisso,
        larghezzaVano: config.width,
        altezzaVano: config.height,
        tipoBinario: config.binario === 'A vista' ? 'a_vista' : 'nascosto',
        anteNascoste: config.anteNascoste,
        aperturaAnteRaw: config.aperturaAnte,
        doorBox: config.doorBox,
        profiloSuperioreFissi: config.profiloSuperioreFissi,
        traversino: config.traversino,
        traversinoMeters: config.traversinoMeters,
      });
      if (slidingSheet && Number.isFinite(slidingSheet.numeroBinari)) {
        numeroBinari = slidingSheet.numeroBinari;
      }
      if (slidingSheet && Number.isFinite(slidingSheet.lunghezzaBinario)) {
        const sheetTrackMm = Math.max(Number(slidingSheet.lunghezzaBinario) || 0, 0);
        if (sheetTrackMm > trackMm) {
          trackMm = sheetTrackMm;
          trackMeters = trackMm / 1000;
        }
      }
    } catch (error) {
      console.warn('Impossibile calcolare la larghezza anta con il foglio tagli.', error);
      slidingSheet = null;
    }
  }

  let larghezzaAnta = 0;
  if (slidingSheet) {
    larghezzaAnta = Math.max(Number(slidingSheet.larghezzaAnta) || 0, 0);
  } else if (model === 'SINGOLA' || model === 'MAGNETICA') {
    const base = (trackCode * 100) / 2;
    const divisor = Math.max(realNumeroAnte || 1, 1);
    larghezzaAnta = Math.floor(base / divisor);
  } else {
    let availableMm = trackCode ? trackCode * 100 : trackMm || config.width || 0;
    if (
      config.pannelloFisso === 'Si' &&
      config.sceltaPannelloFisso === 'manuale' &&
      config.larghezzaPannelloFisso &&
      pannelliCount > 0
    ) {
      availableMm -= config.larghezzaPannelloFisso * pannelliCount;
    }
    availableMm = Math.max(availableMm, 0);
    const divisor = Math.max(realNumeroAnte || 1, 1);
    larghezzaAnta = Math.floor(availableMm / divisor);
  }

  let withinRange = true;
  if (!['MAGNETICA', 'SINGOLA', 'SOLO_PANNELLO', 'SOLO_ANTA'].includes(model) && larghezzaAnta !== 0) {
    withinRange = larghezzaAnta >= LARGHEZZA_MIN && larghezzaAnta <= LARGHEZZA_MAX;
  }

  const sheetOverlapMm = slidingSheet ? Math.max(Number(slidingSheet.sormontoMm) || 0, 0) : 0;

  return {
    ...config,
    numeroAnte,
    numeroBinari,
    realNumeroAnte,
    larghezzaAnta,
    larghezzaAntaValida: withinRange,
    montaggioEffettivo: montaggio,
    lunghezzaBinarioMetri: trackMeters,
    lunghezzaBinarioMm: trackMm,
    aperturaEffettiva: apertura,
    sormontoMm: sheetOverlapMm,
    larghezzaPannelloFissoCalcolata: slidingSheet
      ? Math.max(Number(slidingSheet.larghezzaPannelloFisso) || 0, 0)
      : config.larghezzaPannelloFisso,
  };
}


function selectProfileCode(meters) {
  const allowed = [20, 30, 40, 60];
  const target = Math.ceil((meters || 0) * 10);
  return allowed.find((size) => size >= target) ?? allowed[allowed.length - 1];
}

function buildTrackItems(list, config, derived) {
  const trackCode = derived.lunghezzaBinarioCodice || config.lunghezzaBinarioCodice || 0;
  const model = config.model;
  const numeroBinari = Math.max(derived.numeroBinari || 0, 0);
  if (trackCode <= 0) return;

  if (model === 'MAGNETICA') {
    const family =
      config.binario === 'A vista'
        ? PRICE_TABLE.TRACKS.MAGNETICA.VISTA
        : PRICE_TABLE.TRACKS.MAGNETICA.NASCOSTO;
    const track = family?.[trackCode];
    if (track) {
      addOrUpdateItem(list, {
        codice: track.code,
        descrizione: track.description,
        quantita: Math.max(derived.numeroAnte || 1, 1),
        prezzo: track.price,
      });
    }
    return;
  }

  if (model === 'SINGOLA') {
    const table =
      derived.montaggioEffettivo === 'Parete'
        ? PRICE_TABLE.TRACKS.SINGOLA.PARETE
        : PRICE_TABLE.TRACKS.SINGOLA.SOFFITTO;
    const track = table?.[trackCode];
    if (track) {
      addOrUpdateItem(list, {
        codice: track.code,
        descrizione: track.description,
        quantita: 1,
        prezzo: track.price,
      });
    }
    return;
  }

  const primary = PRICE_TABLE.TRACKS.STANDARD.PRIMARY[trackCode];
  if (primary && numeroBinari > 0) {
    addOrUpdateItem(list, {
      codice: primary.code,
      descrizione: primary.description,
      quantita: 1,
      prezzo: primary.price,
    });
  }

  const extra = PRICE_TABLE.TRACKS.STANDARD.EXTRA[trackCode];
  if (extra && numeroBinari > 1) {
    addOrUpdateItem(list, {
      codice: extra.code,
      descrizione: extra.description,
      quantita: numeroBinari - 1,
      prezzo: extra.price,
    });
  }

  if (config.pannelloFisso === 'Si' && config.pannelliSuBinari === 'No') {
    const fixed = PRICE_TABLE.TRACKS.FIXED_EXTRA;
    addOrUpdateItem(list, {
      codice: fixed.code,
      descrizione: fixed.description,
      quantita: 1,
      prezzo: fixed.price,
    });
  }
}

function buildCoverItems(list, config, derived) {
  if (config.model === 'MAGNETICA' && config.binario === 'A vista') {
    const trackCode = derived.lunghezzaBinarioCodice || config.lunghezzaBinarioCodice || 0;
    if (trackCode === 34) {
      const covers = PRICE_TABLE.COVERS.MAGNETICA[20];
      if (covers) {
        addOrUpdateItem(list, { codice: covers.FRONT.code, descrizione: covers.FRONT.description, quantita: 2, prezzo: covers.FRONT.price });
        addOrUpdateItem(list, { codice: covers.TOP.code, descrizione: covers.TOP.description, quantita: 2, prezzo: covers.TOP.price });
        addOrUpdateItem(list, { codice: covers.MOUNT.code, descrizione: covers.MOUNT.description, quantita: 2, prezzo: covers.MOUNT.price });
      }
      return;
    }
    const covers = PRICE_TABLE.COVERS.MAGNETICA[trackCode];
    if (covers) {
      addOrUpdateItem(list, { codice: covers.FRONT.code, descrizione: covers.FRONT.description, quantita: 1, prezzo: covers.FRONT.price });
      addOrUpdateItem(list, { codice: covers.TOP.code, descrizione: covers.TOP.description, quantita: 1, prezzo: covers.TOP.price });
      addOrUpdateItem(list, { codice: covers.MOUNT.code, descrizione: covers.MOUNT.description, quantita: 1, prezzo: covers.MOUNT.price });
    }
    return;
  }

  if (config.model !== 'MAGNETICA' && config.binario === 'Nascosto') {
    const cover = PRICE_TABLE.COVERS.STANDARD;
    const step = derived.montaggioEffettivo === 'Parete' ? 3 : 1.5;
    const pieces = Math.ceil((derived.lunghezzaBinarioMetri || 0) / step);
    if (pieces > 0) {
      addOrUpdateItem(list, {
        codice: cover.code,
        descrizione: cover.description,
        quantita: pieces,
        prezzo: cover.price,
      });
    }
  }
}

function buildScorrimentoItems(list, config, derived, optionalGeneral, optionalMagnetica) {
  const model = config.model;
  const numeroAnte = Math.max(derived.numeroAnte || 0, 0);
  if (numeroAnte > 0) {
    let kit1 = 0;
    let kit2 = 0;
    let kit3 = 0;

    if (model === 'INDIPENDENTE' || model === 'MAGNETICA') {
      kit1 = numeroAnte;
    } else if (model === 'SINGOLA') {
      kit1 = derived.numeroAnte;
    } else if (numeroAnte === 1) {
      kit1 = 1;
    } else if (numeroAnte === 2) {
      kit1 = 1;
      kit2 = 1;
    } else if (numeroAnte === 3) {
      kit1 = 2;
      kit2 = 1;
    } else if (numeroAnte >= 4) {
      kit1 = 2;
      kit3 = numeroAnte - 2;
    }

    let kitRidottaCount = 0;
    const kitRidottaSelection = optionalGeneral.get(PRICE_TABLE.SCORRIMENTO.KIT1S.code);
    if (kitRidottaSelection) {
      kitRidottaCount = config.model === 'SINGOLA' && config.tipologia !== '1+1' ? 1 : 2;
      optionalGeneral.delete(PRICE_TABLE.SCORRIMENTO.KIT1S.code);
    }
    const autoRidotta =
      config.model !== 'MAGNETICA' &&
      config.model !== 'SINGOLA' &&
      derived.larghezzaAnta >= LARGHEZZA_MIN &&
      derived.larghezzaAnta <= 600;
    if (autoRidotta) {
      kitRidottaCount = Math.max(kitRidottaCount, kit1);
    }
    if (kitRidottaCount > 0) {
      addOrUpdateItem(list, {
        codice: PRICE_TABLE.SCORRIMENTO.KIT1S.code,
        descrizione: PRICE_TABLE.SCORRIMENTO.KIT1S.description,
        quantita: kitRidottaCount,
        prezzo: PRICE_TABLE.SCORRIMENTO.KIT1S.price,
      });
      kit1 = Math.max(kit1 - kitRidottaCount, 0);
    }

    if (kit1 > 0) {
      addOrUpdateItem(list, {
        codice: PRICE_TABLE.SCORRIMENTO.KIT1.code,
        descrizione: PRICE_TABLE.SCORRIMENTO.KIT1.description,
        quantita: kit1,
        prezzo: PRICE_TABLE.SCORRIMENTO.KIT1.price,
      });
    }
    if (kit2 > 0) {
      addOrUpdateItem(list, {
        codice: PRICE_TABLE.SCORRIMENTO.KIT2.code,
        descrizione: PRICE_TABLE.SCORRIMENTO.KIT2.description,
        quantita: kit2,
        prezzo: PRICE_TABLE.SCORRIMENTO.KIT2.price,
      });
    }
    if (kit3 > 0) {
      addOrUpdateItem(list, {
        codice: PRICE_TABLE.SCORRIMENTO.KIT3.code,
        descrizione: PRICE_TABLE.SCORRIMENTO.KIT3.description,
        quantita: kit3,
        prezzo: PRICE_TABLE.SCORRIMENTO.KIT3.price,
      });
    }

    let pushToOpen = optionalGeneral.get(PRICE_TABLE.SCORRIMENTO.PUSH_TO_OPEN.code);
    if (config.doorBox === 'Si' && !pushToOpen) {
      pushToOpen = {
        value: PRICE_TABLE.SCORRIMENTO.PUSH_TO_OPEN.code,
        name: PRICE_TABLE.SCORRIMENTO.PUSH_TO_OPEN.description,
        price: PRICE_TABLE.SCORRIMENTO.PUSH_TO_OPEN.price,
      };
    }
    if (pushToOpen) {
      const quantity = config.model === 'SINGOLA' && config.tipologia !== '1+1' ? 1 : 2;
      addOrUpdateItem(list, {
        codice: PRICE_TABLE.SCORRIMENTO.PUSH_TO_OPEN.code,
        descrizione: PRICE_TABLE.SCORRIMENTO.PUSH_TO_OPEN.description,
        quantita: quantity,
        prezzo: PRICE_TABLE.SCORRIMENTO.PUSH_TO_OPEN.price,
      });
      optionalGeneral.delete(PRICE_TABLE.SCORRIMENTO.PUSH_TO_OPEN.code);
    }

    if (config.model === 'TRASCINAMENTO') {
      let cintaQuantity = 0;
      const cintaSelection = optionalGeneral.get(PRICE_TABLE.SCORRIMENTO.CINTA_MAGGIORATA.code);
      if (cintaSelection) {
        cintaQuantity = Math.max(cintaQuantity, 1);
        optionalGeneral.delete(PRICE_TABLE.SCORRIMENTO.CINTA_MAGGIORATA.code);
      }
      if (derived.larghezzaAnta >= 1236 && derived.larghezzaAnta <= 1500 && numeroAnte >= 2) {
        cintaQuantity = Math.max(cintaQuantity, numeroAnte === 2 ? 1 : numeroAnte - 2);
      }
      if (cintaQuantity > 0) {
        addOrUpdateItem(list, {
          codice: PRICE_TABLE.SCORRIMENTO.CINTA_MAGGIORATA.code,
          descrizione: PRICE_TABLE.SCORRIMENTO.CINTA_MAGGIORATA.description,
          quantita: cintaQuantity,
          prezzo: PRICE_TABLE.SCORRIMENTO.CINTA_MAGGIORATA.price,
        });
      }
    }

    if (config.model === 'SINGOLA') {
      const quantity = config.tipologia === '1+1' ? 2 : 1;
      const telaio =
        config.pannelloFisso === 'Si'
          ? PRICE_TABLE.TELAI.PER_ANTA
          : PRICE_TABLE.TELAI.SINGOLA_STANDARD;
      addOrUpdateItem(list, {
        codice: telaio.code,
        descrizione: telaio.description,
        quantita: quantity,
        prezzo: telaio.price,
      });
    } else if (numeroAnte > 0) {
      if (numeroAnte === 1) {
        addOrUpdateItem(list, {
          codice: PRICE_TABLE.TELAI.PER_ANTA.code,
          descrizione: PRICE_TABLE.TELAI.PER_ANTA.description,
          quantita: 1,
          prezzo: PRICE_TABLE.TELAI.PER_ANTA.price,
        });
      } else if (numeroAnte === 2) {
        addOrUpdateItem(list, {
          codice: PRICE_TABLE.TELAI.PER_ANTA.code,
          descrizione: PRICE_TABLE.TELAI.PER_ANTA.description,
          quantita: 2,
          prezzo: PRICE_TABLE.TELAI.PER_ANTA.price,
        });
      } else {
        addOrUpdateItem(list, {
          codice: PRICE_TABLE.TELAI.PER_ANTA.code,
          descrizione: PRICE_TABLE.TELAI.PER_ANTA.description,
          quantita: 2,
          prezzo: PRICE_TABLE.TELAI.PER_ANTA.price,
        });
        addOrUpdateItem(list, {
          codice: PRICE_TABLE.TELAI.CENTRALE.code,
          descrizione: PRICE_TABLE.TELAI.CENTRALE.description,
          quantita: numeroAnte - 2,
          prezzo: PRICE_TABLE.TELAI.CENTRALE.price,
        });
      }
    }
  }

  optionalGeneral.forEach((item) => {
    addOrUpdateItem(list, {
      codice: item.value,
      descrizione: item.name,
      quantita: 1,
      prezzo: item.price,
    });
  });

  optionalMagnetica.forEach((item) => {
    addOrUpdateItem(list, {
      codice: item.value,
      descrizione: item.name,
      quantita: 1,
      prezzo: item.price,
    });
  });
}

function buildFixedPanelItems(list, config, derived) {
  if (config.pannelloFisso !== 'Si') return;
  const pannelliCount = Math.max(Number(config.numeroPannelliFissi) || 0, 0);
  if (pannelliCount <= 0) return;
  const profili = PRICE_TABLE.FISSI.PROFILI;

  if (config.pannelliSuBinari === 'No') {
    let meters = derived.lunghezzaBinarioMetri || 0;
    if (config.profiloSuperioreFissi !== 'Quanto tutto il binario') {
      const widthSource =
        config.sceltaPannelloFisso === 'manuale' && config.larghezzaPannelloFisso
          ? config.larghezzaPannelloFisso
          : derived.larghezzaAnta;
      meters = ((widthSource || 0) * pannelliCount) / 1000;
    }
    const code = selectProfileCode(meters);
    const profile = profili[code] ?? profili[20];
    if (profile) {
      addOrUpdateItem(list, {
        codice: profile.code,
        descrizione: profile.description,
        quantita: 1,
        prezzo: profile.price,
      });
    }
  }

  const kit = PRICE_TABLE.FISSI.KIT_ACCESSORI;
  addOrUpdateItem(list, {
    codice: kit.code,
    descrizione: kit.description,
    quantita: pannelliCount,
    prezzo: kit.price,
  });

  const telaio = PRICE_TABLE.FISSI.TELAIO;
  addOrUpdateItem(list, {
    codice: telaio.code,
    descrizione: telaio.description,
    quantita: pannelliCount,
    prezzo: telaio.price,
  });
}

function buildDoorBoxItems(list, config) {
  if (config.doorBox !== 'Si') return;
  const side = config.doorBoxMounting === 'Sinistra' ? 'Sinistra' : 'Destra';
  const doorBox = PRICE_TABLE.DOOR_BOX[side];
  if (doorBox) {
    addOrUpdateItem(list, {
      codice: doorBox.code,
      descrizione: doorBox.description,
      quantita: 1,
      prezzo: doorBox.price,
    });
  }
}

function buildManiglieItems(list, config) {
  config.maniglieDetails.forEach((item) => {
    addOrUpdateItem(list, {
      codice: item.code,
      descrizione: item.name,
      quantita: item.quantity,
      prezzo: item.price,
    });
  });
}

function buildKitItems(list, config) {
  config.kitDetails.forEach((item) => {
    addOrUpdateItem(list, {
      codice: item.value,
      descrizione: item.name,
      quantita: 1,
      prezzo: item.price,
    });
  });
}

function buildTraversinoItems(list, config) {
  if (config.traversino !== 'Si') return;
  const meters = Math.max(Number(config.traversinoMeters) || 0, 0);
  if (meters <= 0) return;
  const traversino = PRICE_TABLE.MANIGLIE.DEP01;
  addOrUpdateItem(list, {
    codice: traversino.code,
    descrizione: traversino.description,
    quantita: meters,
    prezzo: traversino.price,
  });
}

function calculateQuote(config) {
  const derived = deriveConfiguration(config);
  if (!derived) {
    return { categories: [], total: 0, derived: null };
  }
  if (!derived.larghezzaAntaValida) {
    return {
      categories: [],
      total: 0,
      derived,
      error: `La larghezza di ogni anta deve essere compresa tra ${LARGHEZZA_MIN} e ${LARGHEZZA_MAX} mm.`,
    };
  }

  const optionalGeneral = new Map(config.optionalDetails.map((item) => [item.value, item]));
  const optionalMagnetica = new Map(config.optionalMagneticaDetails.map((item) => [item.value, item]));
  MAGNETICA_DEPENDENCIES.forEach((dependency, code) => {
    if (optionalMagnetica.has(code) && !optionalMagnetica.has(dependency)) {
      const meta = getCheckboxMeta(selectors.optionalMagneticaCheckboxes, dependency);
      if (meta) {
        optionalMagnetica.set(dependency, meta);
      }
    }
  });

  const categories = [];

  const binariItems = [];
  buildTrackItems(binariItems, config, derived);
  if (binariItems.length > 0) {
    categories.push({ label: 'Binari con Cover', items: binariItems });
  }

  const coverItems = [];
  buildCoverItems(coverItems, config, derived);
  if (coverItems.length > 0) {
    categories.push({ label: 'Cover di Montaggio', items: coverItems });
  }

  const scorrimentoItems = [];
  buildScorrimentoItems(scorrimentoItems, config, derived, optionalGeneral, optionalMagnetica);
  if (scorrimentoItems.length > 0) {
    categories.push({ label: 'Carrelli e Meccaniche di Scorrimento', items: scorrimentoItems });
  }

  const fissiItems = [];
  buildFixedPanelItems(fissiItems, config, derived);
  if (fissiItems.length > 0) {
    categories.push({ label: 'Binari, Accessori e Telai per Pannello fisso', items: fissiItems });
  }

  const doorBoxItems = [];
  buildDoorBoxItems(doorBoxItems, config);
  if (doorBoxItems.length > 0) {
    categories.push({ label: 'Door Box', items: doorBoxItems });
  }

  const maniglieItems = [];
  buildManiglieItems(maniglieItems, config);
  if (maniglieItems.length > 0) {
    categories.push({ label: 'Maniglie e Nicchie', items: maniglieItems });
  }

  const kitItems = [];
  buildKitItems(kitItems, config);
  if (kitItems.length > 0) {
    categories.push({ label: 'Kit di Lavorazione Profili', items: kitItems });
  }

  const traversinoItems = [];
  buildTraversinoItems(traversinoItems, config);
  if (traversinoItems.length > 0) {
    categories.push({ label: 'Traversino Decorativo Adesivo', items: traversinoItems });
  }

  const total = categories.reduce(
    (sum, category) =>
      sum +
      category.items.reduce((acc, item) => acc + Number(item.prezzo || 0) * Number(item.quantita || 0), 0),
    0
  );

  return { categories, total, derived };
}

let latestSlidingCutSheet = null;

function calculateSlidingModelCutSheet(input) {
  if (!input) {
    throw new Error('Input mancante per il calcolo dei tagli.');
  }

  const numeroAnte = Number(input.numeroAnte);
  const larghezzaVano = Number(input.larghezzaVano);
  const altezzaVano = Number(input.altezzaVano);

  if (!Number.isFinite(numeroAnte) || numeroAnte <= 0) {
    throw new Error('numeroAnte è obbligatorio e deve essere maggiore di zero.');
  }

  if (!Number.isFinite(larghezzaVano) || larghezzaVano <= 0) {
    throw new Error('larghezzaVano è obbligatorio e deve essere maggiore di zero.');
  }

  if (!Number.isFinite(altezzaVano) || altezzaVano <= 0) {
    throw new Error('altezzaVano è obbligatorio e deve essere maggiore di zero.');
  }

  const pannelloFisso = input.pannelloFisso === 'Si' ? 'Si' : 'No';
  const sceltaPannelloFisso =
    pannelloFisso === 'Si' && input.sceltaPannelloFisso === 'uguale_anta'
      ? 'uguale_anta'
      : 'manuale';
  const numeroPannelliFissi = Math.max(Number(input.numeroPannelliFissi) || 0, 0);
  let larghezzaPannelloFisso = Number(input.larghezzaPannelloFisso) || 0;

  const tipoBinario = input.tipoBinario === 'a_vista' ? 'a_vista' : 'nascosto';
  const anteNascoste = input.anteNascoste === 'Si' ? 'Si' : 'No';
  const doorBox = input.doorBox === 'Si' ? 'Si' : 'No';
  const traversino = input.traversino === 'Si' ? 'Si' : 'No';
  const traversinoMeters = traversino === 'Si' ? Math.max(Number(input.traversinoMeters) || 0, 0) : 0;

  const aperturaAnteRaw = typeof input.aperturaAnteRaw === 'string' ? input.aperturaAnteRaw.trim() : '';
  let aperturaAnte = 'Normale';
  if (aperturaAnteRaw === 'Destra Sinistra' && numeroAnte >= 4 && numeroAnte % 2 === 0) {
    aperturaAnte = 'Destra Sinistra';
  } else if (aperturaAnteRaw && aperturaAnteRaw !== 'Destra Sinistra') {
    aperturaAnte = aperturaAnteRaw;
  }

  const numeroBinari = aperturaAnte === 'Destra Sinistra' ? Math.max(Math.floor(numeroAnte / 2), 1) : numeroAnte; // Regola: numero binari dimezzato con apertura Destra Sinistra
  const numeroProfiloBinarioCentrali = Math.max(0, numeroBinari - 2); // Regola: centrali = max(0, numeroBinari - 2)

  if (aperturaAnte === 'Destra Sinistra' && numeroAnte % 2 !== 0) {
    throw new Error('Per apertura Destra Sinistra il numero di ante deve essere pari.');
  }

  if (pannelloFisso === 'Si' && sceltaPannelloFisso === 'uguale_anta') {
    const sormonto = 17; // Regola: sormonto tra elementi scorrevoli = 17 mm
    const totalePannelli = numeroAnte + numeroPannelliFissi;
    const numeroSormonti = Math.max(0, totalePannelli - 1); // Regola: numero sormonti = totale elementi - 1
    larghezzaPannelloFisso = Math.round((larghezzaVano + numeroSormonti * sormonto) / Math.max(totalePannelli, 1)); // Regola: larghezza pannello fisso uguale ante
  }

  const sormontoTotaleBase = 17 * Math.max(numeroAnte - 1, 0); // Regola: sormonto totale = 17 mm * (numeroAnte - 1)
  let larghezzaAnta = 0;
  if (pannelloFisso === 'No') {
    larghezzaAnta = Math.floor((sormontoTotaleBase + larghezzaVano) / numeroAnte); // Regola: larghezza anta senza fissi
  } else if (sceltaPannelloFisso === 'uguale_anta') {
    larghezzaAnta = Math.floor(larghezzaPannelloFisso); // Regola: pannello fisso uguale alla larghezza anta
  } else {
    const sormontoTotale = sormontoTotaleBase + 17 * Math.max(numeroPannelliFissi, 0); // Regola: aggiunge sormonto per ogni pannello fisso
    const sottrazioneFissi = Math.max(numeroPannelliFissi * Math.max(larghezzaPannelloFisso, 0), 0);
    larghezzaAnta = Math.floor((sormontoTotale + larghezzaVano - sottrazioneFissi) / numeroAnte); // Regola: larghezza anta con pannelli fissi manuali
  }
  larghezzaAnta = Math.max(larghezzaAnta, 0);

  const altezzaAnta =
    tipoBinario === 'a_vista' ? Math.max(altezzaVano - 60, 0) : Math.max(altezzaVano - 12, 0); // Regola: delta altezza anta in base al tipo di binario

  const altezzaProfiloVerticale = Math.max(Math.floor(altezzaAnta - 70), 0); // Regola: altezza profili verticali = altezza anta - 70 mm
  const altezzaVetro = Math.max(Math.floor(altezzaAnta - 58), 0); // Regola: altezza vetro anta = altezza anta - 58 mm
  const lunghezzaProfiloOrizzontale = Math.max(Math.floor(larghezzaAnta - 5), 0); // Regola: profilo orizzontale = larghezza anta - 5 mm
  const larghezzaVetro = Math.max(Math.floor(larghezzaAnta - 18), 0); // Regola: larghezza vetro anta = larghezza anta - 18 mm

  let larghezzaVetroFisso = 0;
  let altezzaVetroFisso = 0;
  if (pannelloFisso === 'Si') {
    larghezzaVetroFisso = Math.max(Math.floor(larghezzaPannelloFisso - 18), 0); // Regola: larghezza vetro fisso = larghezza pannello fisso - 18 mm
    altezzaVetroFisso = Math.max(Math.floor(altezzaAnta - 58), 0); // Regola: altezza vetro fisso = altezza anta - 58 mm
  }

  let baseLunghezzaBinario = larghezzaVano; // Regola: lunghezza binario base = larghezza vano
  if (anteNascoste === 'Si') {
    baseLunghezzaBinario = larghezzaVano + Math.max(larghezzaAnta, 0); // Regola aggiornata: ante nascoste allungano il binario della larghezza di un'anta
  }

  const lunghezzaBinario = Math.round(baseLunghezzaBinario + (doorBox === 'Si' ? 34 : 0)); // Regola: doorBox aggiunge 34 mm al binario

  let lunghezzaProfiloSuperioreFissi = 0;
  const profiloSuperioreFissiRaw = input.profiloSuperioreFissi ?? '';
  if (pannelloFisso === 'Si') {
    if (profiloSuperioreFissiRaw === 'Quanto i fissi') {
      lunghezzaProfiloSuperioreFissi = Math.max(Math.floor(larghezzaPannelloFisso), 0); // Regola: profilo superiore = larghezza pannello fisso
    } else if (profiloSuperioreFissiRaw === 'Quanto tutto il binario') {
      lunghezzaProfiloSuperioreFissi = Math.max(lunghezzaBinario, 0); // Regola: profilo superiore = lunghezza binario
    } else {
      lunghezzaProfiloSuperioreFissi = Math.max(Math.floor(Number(profiloSuperioreFissiRaw) || 0), 0); // Regola: valore manuale profilo superiore fissi
    }
  }

  const ingombroProfiliScorrimento = Math.max(Math.floor(44.8 * numeroAnte + 1.2 * Math.max(numeroAnte - 1, 0)), 0); // Regola: ingombro profili scorrimento
  const ingombroTotaleProfiliCover = Math.max(Math.floor(12.4 + ingombroProfiliScorrimento), 0); // Regola: ingombro totale profili + cover

  const altezzaCoverVerticale = Math.max(Math.floor(altezzaAnta), 0); // Regola: altezza cover verticale uguale all'altezza anta
  const pezziCoverVerticaleSenzaSpazzolino = 4; // Regola: cover senza spazzolino sempre 4
  const pezziCoverVerticaleConSpazzolino = Math.max((numeroAnte - 2) * 2, 0); // Regola: cover con spazzolino = max(0, (numeroAnte - 2) * 2)

  const sceltaOutput = pannelloFisso === 'Si' ? sceltaPannelloFisso : '';
  const larghezzaPannelloFissoOutput =
    pannelloFisso === 'Si' ? Math.max(Math.floor(larghezzaPannelloFisso), 0) : 0;

  return {
    numeroAnte,
    aperturaAnte,
    tipoBinario,
    anteNascoste,
    doorBox,
    larghezzaVano,
    altezzaVano,
    numeroBinari,
    binariInizialiFinali: 2,
    binariCentrali: numeroProfiloBinarioCentrali,
    larghezzaAnta,
    altezzaAnta,
    lunghezzaBinario,
    lunghezzaProfiloOrizzontale,
    pezziProfiloOrizzontale: numeroAnte * 2,
    altezzaProfiloVerticale,
    pezziProfiloVerticale: numeroAnte * 2,
    altezzaCoverVerticale,
    pezziCoverVerticaleSenzaSpazzolino,
    pezziCoverVerticaleConSpazzolino,
    larghezzaVetro,
    altezzaVetro,
    pannelloFisso,
    sceltaPannelloFisso: sceltaOutput,
    numeroPannelliFissi,
    larghezzaPannelloFisso: larghezzaPannelloFissoOutput,
    larghezzaVetroFisso,
    altezzaVetroFisso,
    profiloSuperioreFissi: String(profiloSuperioreFissiRaw || ''),
    lunghezzaProfiloSuperioreFissi,
    traversino,
    traversinoMeters,
    ingombroProfiliScorrimento,
    ingombroTotaleProfiliCover,
    sormontoMm: numeroAnte > 1 ? 17 : 0,
  };
}

function calculateCuts(config, derived) {
  if (!config || !config.width || !config.height) return [];
  const effective = derived || deriveConfiguration(config);
  if (!effective) return [];

  if (config.model === 'TRASCINAMENTO' || config.model === 'INDIPENDENTE') {
    try {
      const sheet = calculateSlidingModelCutSheet({
        numeroAnte: effective.numeroAnte,
        pannelloFisso: config.pannelloFisso,
        sceltaPannelloFisso: config.sceltaPannelloFisso,
        numeroPannelliFissi: config.numeroPannelliFissi,
        larghezzaPannelloFisso: config.larghezzaPannelloFisso,
        larghezzaVano: config.width,
        altezzaVano: config.height,
        tipoBinario: config.binario === 'A vista' ? 'a_vista' : 'nascosto',
        anteNascoste: config.anteNascoste,
        aperturaAnteRaw: config.aperturaAnte,
        doorBox: config.doorBox,
        profiloSuperioreFissi: config.profiloSuperioreFissi,
        traversino: config.traversino,
        traversinoMeters: config.traversinoMeters,
      });

      latestSlidingCutSheet = sheet;
      if (typeof window !== 'undefined') {
        window.akinaSlidingCutSheet = sheet;
      }

      const formatMm = (value) => `${Math.max(0, Math.round(Number(value) || 0))} mm`;
      const rows = [];

      rows.push({ element: 'Binari iniziali e finali', quantity: sheet.binariInizialiFinali, length: formatMm(sheet.lunghezzaBinario) });
      if (sheet.binariCentrali > 0) {
        rows.push({ element: 'Binari centrali', quantity: sheet.binariCentrali, length: formatMm(sheet.lunghezzaBinario) });
      }

      rows.push({ element: 'Ante scorrevoli - larghezza', quantity: sheet.numeroAnte, length: formatMm(sheet.larghezzaAnta) });
      rows.push({ element: 'Ante scorrevoli - altezza', quantity: sheet.numeroAnte, length: formatMm(sheet.altezzaAnta) });

      rows.push({ element: 'Profili orizzontali anta', quantity: sheet.pezziProfiloOrizzontale, length: formatMm(sheet.lunghezzaProfiloOrizzontale) });
      rows.push({ element: 'Profili verticali anta', quantity: sheet.pezziProfiloVerticale, length: formatMm(sheet.altezzaProfiloVerticale) });

      rows.push({ element: 'Cover verticali senza spazzolino', quantity: sheet.pezziCoverVerticaleSenzaSpazzolino, length: formatMm(sheet.altezzaCoverVerticale) });
      if (sheet.pezziCoverVerticaleConSpazzolino > 0) {
        rows.push({ element: 'Cover verticali con spazzolino', quantity: sheet.pezziCoverVerticaleConSpazzolino, length: formatMm(sheet.altezzaCoverVerticale) });
      }

      rows.push({
        element: 'Vetri ante scorrevoli',
        quantity: sheet.numeroAnte,
        length: `${formatMm(sheet.larghezzaVetro)} × ${formatMm(sheet.altezzaVetro)}`,
      });

      if (sheet.pannelloFisso === 'Si' && sheet.numeroPannelliFissi > 0) {
        rows.push({
          element: 'Pannelli fissi',
          quantity: sheet.numeroPannelliFissi,
          length: `${formatMm(sheet.larghezzaPannelloFisso)} × ${formatMm(sheet.altezzaAnta)}`,
        });
        rows.push({
          element: 'Vetri pannello fisso',
          quantity: sheet.numeroPannelliFissi,
          length: `${formatMm(sheet.larghezzaVetroFisso)} × ${formatMm(sheet.altezzaVetroFisso)}`,
        });
        if (sheet.lunghezzaProfiloSuperioreFissi > 0) {
          rows.push({
            element: 'Profilo superiore pannelli fissi',
            quantity: 1,
            length: formatMm(sheet.lunghezzaProfiloSuperioreFissi),
          });
        }
      }

      rows.push({
        element: 'Ingombro profili di scorrimento',
        quantity: 1,
        length: formatMm(sheet.ingombroProfiliScorrimento),
      });
      rows.push({
        element: 'Ingombro totale profili + cover',
        quantity: 1,
        length: formatMm(sheet.ingombroTotaleProfiliCover),
      });

      if (sheet.traversino === 'Si' && sheet.traversinoMeters > 0) {
        rows.push({
          element: 'Traversino decorativo adesivo',
          quantity: 1,
          length: `${Number(sheet.traversinoMeters).toFixed(2)} m`,
        });
      }

      return rows;
    } catch (error) {
      console.error('Errore nel calcolo dei tagli per modelli scorrevoli:', error);
    }
  }

  const leaves = Math.max(effective?.numeroAnte || config.leaves || 1, 1);
  const stileLength = Math.max(Math.round(config.height - 90), 0);
  const leafWidth = Math.max(Math.round((config.lunghezzaBinario || config.width) / leaves), 0);
  const railLength = Math.max(Math.round(leafWidth + 60), 0);
  const glassWidth = Math.max(Math.round(leafWidth - 90), 40);
  const glassHeight = Math.max(Math.round(stileLength - 60), 0);
  const trackLength = Math.max(Math.round(effective?.lunghezzaBinarioMm || config.lunghezzaBinario || config.width * 1.2), 0);

  const cuts = [
    { element: 'Montanti verticali anta', quantity: leaves * 2, length: stileLength },
    { element: 'Traversi orizzontali', quantity: leaves * 2, length: railLength },
    { element: 'Vetri / pannelli anta', quantity: leaves, length: `${glassWidth} × ${glassHeight}` },
    { element: 'Binario superiore', quantity: 1, length: trackLength },
    { element: 'Guida inferiore', quantity: 1, length: Math.round(leafWidth) },
  ];

  if (config.pannelloFisso === 'Si') {
    const pannelliCount = Math.max(Number(config.numeroPannelliFissi) || 0, 0);
    if (pannelliCount > 0) {
      cuts.push({
        element: 'Pannelli fissi',
        quantity: pannelliCount,
        length:
          config.sceltaPannelloFisso === 'manuale' && config.larghezzaPannelloFisso
            ? `${Math.round(config.larghezzaPannelloFisso)} × ${config.height}`
            : `Uguali alle ante (${Math.round(effective?.larghezzaAnta || leafWidth)} mm)`,
      });
    }
  }

  if (config.doorBox === 'Si') {
    cuts.push({ element: 'Door Box', quantity: 1, length: Math.round(config.height) });
  }

  return cuts;
}


function renderCutsTable(cuts) {
  if (!selectors.cutsBody) return;
  selectors.cutsBody.innerHTML = '';
  const hasCuts = Array.isArray(cuts) && cuts.length > 0;
  if (selectors.cutsPanel) {
    selectors.cutsPanel.classList.toggle('summary-panel--empty', !hasCuts);
  }
  if (!hasCuts) {
    const emptyRow = document.createElement('tr');
    emptyRow.className = 'cuts-table__empty';
    emptyRow.innerHTML = `
      <td colspan="3">Nessun taglio disponibile per questa configurazione.</td>
    `;
    selectors.cutsBody.appendChild(emptyRow);
    return;
  }

  cuts.forEach((cut) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${cut.element}</td>
      <td>${cut.quantity}</td>
      <td>${cut.length}</td>
    `;
    selectors.cutsBody.appendChild(row);
  });
}

function renderQuoteBreakdown(categories) {
  if (!selectors.quoteBreakdown) return;
  selectors.quoteBreakdown.innerHTML = '';
  categories.forEach((category) => {
    const section = document.createElement('section');
    section.className = 'quote-breakdown__section';
    const heading = document.createElement('h3');
    heading.textContent = category.label;
    section.appendChild(heading);

    const list = document.createElement('ul');
    list.className = 'quote-breakdown__list';
    category.items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'quote-breakdown__item';
      const total = Number(item.prezzo || 0) * Number(item.quantita || 0);
      li.textContent = `${item.descrizione} (Codice: ${item.codice}, Quantità: ${item.quantita}, Prezzo unitario: ${formatCurrency(item.prezzo)}, Totale: ${formatCurrency(total)})`;
      list.appendChild(li);
    });

    section.appendChild(list);
    selectors.quoteBreakdown.appendChild(section);
  });
}

function buildSelectionSummaryItems(config, derived) {
  const items = [];

  items.push({
    label: 'Modello',
    value: MODEL_CONFIG[config.model]?.label ?? config.model ?? '—',
  });

  const environmentLabel =
    ENVIRONMENT_CONFIG[config.environment]?.label ?? 'Solo porta';
  items.push({ label: 'Ambientazione 3D', value: environmentLabel });

  if (config.model === 'SINGOLA') {
    items.push({
      label: 'Tipologia',
      value: getCardLabel(selectors.tipologiaContainer, '.tipologia-option', config.tipologia, config.tipologia),
    });
  }

  const rawNumeroAnte = Number(derived?.numeroAnte ?? config.numeroAnte ?? config.leaves ?? 0);
  items.push({
    label: 'Numero ante',
    value: Number.isFinite(rawNumeroAnte) ? rawNumeroAnte : '—',
  });

  const rawNumeroBinari = Number(derived?.numeroBinari ?? 0);
  items.push({
    label: 'Numero binari',
    value: Number.isFinite(rawNumeroBinari) ? rawNumeroBinari : '—',
  });

  const aperturaLabel = getCardLabel(
    selectors.aperturaAnteContainer,
    '.apertura-ante-option',
    config.aperturaAnte,
    config.aperturaAnte || '—'
  );
  items.push({ label: 'Apertura', value: aperturaLabel });

  items.push({ label: 'Montaggio', value: derived?.montaggioEffettivo || config.montaggio || '—' });

  const doorBoxValue =
    config.doorBox === 'Si'
      ? config.doorBoxMounting
        ? `Si (${config.doorBoxMounting})`
        : 'Si'
      : 'No';
  items.push({ label: 'Door Box', value: doorBoxValue });

  items.push({
    label: 'Binario',
    value: BINARIO_CONFIG[config.binario]?.label ?? config.binario ?? '—',
  });

  const lengthLabel =
    derived?.lunghezzaBinarioLabel ||
    (derived?.lunghezzaBinarioMetri ? `${formatMeters(derived.lunghezzaBinarioMetri)} Metri` : '—');
  items.push({ label: 'Lunghezza binario', value: lengthLabel });

  const traversinoMeters = Number(config.traversinoMeters) || 0;
  const traversinoValue =
    config.traversino === 'Si'
      ? traversinoMeters > 0
        ? `Si (${traversinoMeters} m)`
        : 'Si'
      : 'No';
  items.push({ label: 'Traversino decorativo', value: traversinoValue });

  items.push({ label: 'Finitura', value: 'Nera' });
  items.push({ label: 'Spessore vetro consigliato', value: '4+4 mm' });

  if (config.width && config.height) {
    items.push({ label: 'Dimensioni vano', value: `${config.width} × ${config.height} mm` });
  }

  return items;
}

function renderSelectionSummary(config, derived) {
  if (!selectors.summaryList) return;

  const items = buildSelectionSummaryItems(config, derived);

  selectors.summaryList.innerHTML = '';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `${item.label}<span>${item.value}</span>`;
    selectors.summaryList.appendChild(li);
  });
}

function updateVisualizerPreview(config, derived) {
  if (!config) return;

  if (selectors.viewerHeightLabel) {
    const heightLabel = Number(config.height) ? `${formatMillimeters(config.height)} mm` : '—';
    selectors.viewerHeightLabel.textContent = heightLabel;
  }

  if (selectors.viewerWidthLabel) {
    const widthLabel = Number(config.width) ? `A: ${formatMillimeters(config.width)} mm` : 'A: —';
    selectors.viewerWidthLabel.textContent = widthLabel;
  }

  if (selectors.viewerTrackLabel) {
    const trackLabel =
      derived?.lunghezzaBinarioLabel ||
      config.lunghezzaBinarioLabel ||
      (() => {
        const meters = derived?.lunghezzaBinarioMetri ?? config.lunghezzaBinarioMetri;
        return meters ? `${formatMeters(meters)} m` : '—';
      })();
    selectors.viewerTrackLabel.textContent = `Binario: ${trackLabel}`;
  }

  const isSoloPannello = config.model === 'SOLO_PANNELLO';
  const slidingLeavesCount = isSoloPannello ? 0 : Math.max(derived?.numeroAnte || config.leaves || 1, 1);
  const soloPanelCount = isSoloPannello ? Math.max(config.soloPannelloCount || config.leaves || 1, 1) : 0;
  const requestedFixedPanels = Number(config.numeroPannelliFissi) || 0;
  const fixedPanelsCount =
    !isSoloPannello && config.pannelloFisso === 'Si' ? Math.max(requestedFixedPanels, 0) : 0;

  const openingType = (() => {
    if (isSoloPannello) return 'fisso';
    if (config.model === 'SINGOLA') return 'battente';
    if (config.anteNascoste === 'Si') return 'scorrevole-muro';
    return MODEL_CONFIG[config.model]?.defaultOpening ?? 'scorrevole-parete';
  })();

  const swingDirection = (() => {
    if (openingType === 'battente') {
      if (config.tipologia === '1+1' || config.aperturaAnte === 'Destra Sinistra') {
        return 'centrale';
      }
      if (config.aperturaAnte === 'Normale') {
        return 'sinistra';
      }
      return 'sinistra';
    }
    if (config.aperturaAnte === 'Destra Sinistra') {
      return 'centrale';
    }
    return 'sinistra';
  })();

  const handleType = (() => {
    if (isSoloPannello) return 'hidden';
    if (config.maniglieDetails?.length > 0) return 'incassata';
    return 'standard';
  })();

  const trackType = (() => {
    if (openingType === 'battente' || openingType === 'fisso') return 'standard';
    if (config.anteNascoste === 'Si') return 'filo-muro';
    return BINARIO_CONFIG[config.binario]?.track ?? 'standard';
  })();

  const floorGuideType = (() => {
    if (openingType === 'battente' || openingType === 'fisso') return 'none';
    if (config.anteNascoste === 'Si') return 'invisibile';
    return 'standard';
  })();

  const fixedPanelDetails = {
    count: isSoloPannello ? soloPanelCount : fixedPanelsCount,
    mode: isSoloPannello ? 'manuale' : config.sceltaPannelloFisso || '',
    manualWidth: isSoloPannello
      ? soloPanelCount > 0
        ? config.width / soloPanelCount
        : config.width
      : config.larghezzaPannelloFisso || 0,
    shareTrack: !isSoloPannello && config.pannelliSuBinari === 'Si',
  };

  const realLeaves = Math.max(derived?.realNumeroAnte || slidingLeavesCount || 1, 1);
  const computedLeafWidth = (() => {
    if (derived?.larghezzaAnta) {
      return derived.larghezzaAnta;
    }
    const baseWidth = Number(config.width) || 0;
    if (!baseWidth || realLeaves <= 0) {
      return 0;
    }
    return Math.floor(baseWidth / realLeaves);
  })();

  let effectiveTotalWidthMm = Number(config.width) || 0;
  if (!effectiveTotalWidthMm) {
    effectiveTotalWidthMm = Number(derived?.lunghezzaBinarioMm || config.lunghezzaBinario || 0);
  }
  if (!effectiveTotalWidthMm && computedLeafWidth > 0 && slidingLeavesCount > 0) {
    effectiveTotalWidthMm = computedLeafWidth * slidingLeavesCount;
  }
  if (
    !effectiveTotalWidthMm &&
    fixedPanelDetails.mode === 'manuale' &&
    fixedPanelDetails.manualWidth &&
    (soloPanelCount || fixedPanelsCount)
  ) {
    effectiveTotalWidthMm = fixedPanelDetails.manualWidth * Math.max(soloPanelCount || fixedPanelsCount, 1);
  }

  const slidingCount = isSoloPannello ? 0 : Math.max(realLeaves, 0);
  const totalFixedCount = isSoloPannello ? soloPanelCount : fixedPanelsCount;

  let overlapMm = 0;
  const slidingLeavesSpecs = [];
  const fixedPanelsSpecs = [];

  if (effectiveTotalWidthMm > 0 && (slidingCount > 0 || totalFixedCount > 0)) {
    overlapMm = slidingCount > 1 ? Math.max(Number(derived?.sormontoMm) || 0, 0) : 0;

    const manualWidthMmRaw =
      fixedPanelDetails.mode === 'manuale' && fixedPanelDetails.manualWidth
        ? Number(fixedPanelDetails.manualWidth)
        : 0;
    const derivedFixedWidthMm = Math.max(Number(derived?.larghezzaPannelloFissoCalcolata) || 0, 0);

    let fixedWidthMm = 0;
    if (totalFixedCount > 0) {
      if (manualWidthMmRaw > 0) {
        fixedWidthMm = manualWidthMmRaw;
      } else if (fixedPanelDetails.mode === 'uguale_anta' && Number(derived?.larghezzaAnta) > 0) {
        fixedWidthMm = Number(derived.larghezzaAnta);
      } else if (derivedFixedWidthMm > 0) {
        fixedWidthMm = derivedFixedWidthMm;
      } else if (isSoloPannello && soloPanelCount > 0) {
        fixedWidthMm = effectiveTotalWidthMm / Math.max(soloPanelCount, 1);
      } else if (slidingCount > 0 && computedLeafWidth > 0) {
        fixedWidthMm = computedLeafWidth;
      } else {
        fixedWidthMm = effectiveTotalWidthMm / Math.max(totalFixedCount, 1);
      }
    }
    fixedWidthMm = Number.isFinite(fixedWidthMm) ? Math.max(fixedWidthMm, 0) : 0;

    const fixedSpanMm = fixedWidthMm * totalFixedCount;
    const availableSlidingSpanMm = Math.max(effectiveTotalWidthMm - fixedSpanMm, 0);

    let leafWidthMm =
      slidingCount > 0 ? Math.max(Number(derived?.larghezzaAnta) || computedLeafWidth || 0, 0) : 0;
    if (slidingCount > 0) {
      if (!Number.isFinite(leafWidthMm) || leafWidthMm <= 0) {
        leafWidthMm = Math.max(effectiveTotalWidthMm / Math.max(slidingCount, 1), 0);
      }
      const overlapTotal = overlapMm * Math.max(slidingCount - 1, 0);
      const maxLeafWidth = Math.max((availableSlidingSpanMm + overlapTotal) / Math.max(slidingCount, 1), 0);
      if (maxLeafWidth > 0 && leafWidthMm > maxLeafWidth) {
        leafWidthMm = maxLeafWidth;
      }
    }

    for (let i = 0; i < slidingCount; i += 1) {
      slidingLeavesSpecs.push({ widthMm: Math.max(leafWidthMm, 0) });
    }

    const singleSharedFixedLeft =
      !isSoloPannello && totalFixedCount === 1 && fixedPanelDetails.shareTrack;

    for (let i = 0; i < totalFixedCount; i += 1) {
      const side = isSoloPannello
        ? 'left'
        : singleSharedFixedLeft
        ? 'left'
        : totalFixedCount === 1
        ? 'right'
        : totalFixedCount === 2
        ? i === 0
          ? 'left'
          : 'right'
        : i === 0
        ? 'left'
        : i === 1
        ? 'right'
        : i % 2 === 0
        ? 'left'
        : 'right';
      fixedPanelsSpecs.push({ widthMm: Math.max(fixedWidthMm, 0), side });
    }

    const overlapTotal = overlapMm * Math.max(slidingLeavesSpecs.length - 1, 0);
    const slidingSpanOccupied =
      slidingLeavesSpecs.reduce((sum, leaf) => sum + leaf.widthMm, 0) - overlapTotal;
    const fixedSpanOccupied = fixedPanelsSpecs.reduce((sum, panel) => sum + panel.widthMm, 0);
    const totalOccupied = slidingSpanOccupied + fixedSpanOccupied;
    const remainder = effectiveTotalWidthMm - totalOccupied;
    if (Math.abs(remainder) > 0.1) {
      if (slidingLeavesSpecs.length > 0) {
        const lastLeaf = slidingLeavesSpecs[slidingLeavesSpecs.length - 1];
        lastLeaf.widthMm = Math.max(lastLeaf.widthMm + remainder, 0);
      } else if (fixedPanelsSpecs.length > 0) {
        const lastPanel = fixedPanelsSpecs[fixedPanelsSpecs.length - 1];
        lastPanel.widthMm = Math.max(lastPanel.widthMm + remainder, 0);
      }
    }
  }

  const openingChoice = derived?.aperturaEffettiva || config.aperturaAnte;
  const openingMode = (() => {
    if (openingChoice === 'Destra Sinistra') return 'biparting';
    if (openingChoice === 'Sinistra') return 'single-left';
    return 'single-right';
  })();

  const rawTrackCount = Number(derived?.numeroBinari ?? 0);
  const baseTrackCount = Number.isFinite(rawTrackCount) && rawTrackCount > 0
    ? Math.floor(rawTrackCount)
    : Math.max(slidingLeavesSpecs.length, 0);
  const shareTrack = fixedPanelDetails.shareTrack;
  const hasFixedPanelsForViewer = fixedPanelsSpecs.length > 0;
  const slidingLeafTotal = slidingLeavesSpecs.length;
  let viewerTrackCount = baseTrackCount;
  if (!Number.isFinite(viewerTrackCount) || viewerTrackCount <= 0) {
    viewerTrackCount = slidingLeafTotal > 0 ? slidingLeafTotal : hasFixedPanelsForViewer ? 1 : 0;
  }
  if (!shareTrack && hasFixedPanelsForViewer) {
    const minimum = slidingLeafTotal > 0 ? slidingLeafTotal + 1 : 1;
    viewerTrackCount = Math.max(viewerTrackCount, minimum);
  } else if (shareTrack && slidingLeafTotal > 0) {
    viewerTrackCount = Math.max(viewerTrackCount, 1);
  }
  const slidingTrackCountForViewer = shareTrack
    ? slidingLeafTotal > 0
      ? Math.max(Math.min(viewerTrackCount, slidingLeafTotal), 1)
      : 0
    : Math.max(
        viewerTrackCount - (hasFixedPanelsForViewer ? 1 : 0),
        slidingLeafTotal > 0 ? 1 : 0
      );

  const supportsHiddenExtension =
    config.model === 'TRASCINAMENTO' || config.model === 'INDIPENDENTE';
  const baseTrackLengthMm = Math.max(
    Number(derived?.lunghezzaBinarioMm) || 0,
    Number(config.lunghezzaBinario) || 0,
    effectiveTotalWidthMm
  );
  let targetTrackLengthMm = baseTrackLengthMm;
  if (supportsHiddenExtension && config.anteNascoste === 'Si' && slidingLeafTotal > 0) {
    const referenceLeafWidth = Math.max(
      Number(derived?.larghezzaAnta) || computedLeafWidth || 0,
      0
    );
    if (referenceLeafWidth > 0) {
      targetTrackLengthMm = Math.max(
        targetTrackLengthMm,
        effectiveTotalWidthMm + referenceLeafWidth
      );
    }
  }

  const totalTrackExtraMm = Math.max(targetTrackLengthMm - effectiveTotalWidthMm, 0);
  const extraTrackLeftMm = totalTrackExtraMm > 0 ? totalTrackExtraMm / 2 : 0;
  const extraTrackRightMm = totalTrackExtraMm - extraTrackLeftMm;

  visualizer.updateDoor({
    heightMm: config.height,
    totalWidthMm: effectiveTotalWidthMm,
    slidingLeaves: slidingLeavesSpecs,
    fixedPanels: fixedPanelsSpecs,
    profileColor: DEFAULT_PROFILE_COLOR,
    glassColor: DEFAULT_GLASS_COLOR,
    trackVisibility: trackType === 'incasso' ? 'hidden' : 'visible',
    showCover: !isSoloPannello && config.binario === 'A vista',
    openingMode,
    environment: config.environment || 'soloporta',
    trackCount: viewerTrackCount,
    slidingTrackCount: slidingTrackCountForViewer,
    fixedPanelsShareTrack: shareTrack,
    overlapMm,
    trackLengthMm: targetTrackLengthMm,
    extraTrackLeftMm,
    extraTrackRightMm,
  });
}

function refreshOutputs({ force = false } = {}) {
  if (!selectors.form) return;
  const config = collectConfiguration();
  if (!config) return;

  let derived = deriveConfiguration(config) || {};

  updateVisualizerPreview(config, derived);

  const isValid = force ? selectors.form.reportValidity() : selectors.form.checkValidity();
  if (!isValid) {
    return;
  }

  const quote = calculateQuote(config);
  if (quote.error) {
    alert(quote.error);
    return;
  }

  derived = quote.derived || derived;
  updateVisualizerPreview(config, derived);

  const cuts = calculateCuts(config, derived);

  if (selectors.quoteTotal) {
    selectors.quoteTotal.textContent = `${formatCurrency(quote.total)} + IVA e Spese di Trasporto`;
  }

  renderQuoteBreakdown(quote.categories || []);
  renderSelectionSummary(config, derived);
  renderCutsTable(cuts);

}

async function handleSavePdf() {
  if (!selectors.form) return;

  showStepFeedback('');
  const isValid = selectors.form.reportValidity();
  if (!isValid) {
    return;
  }

  refreshOutputs({ force: true });
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const config = collectConfiguration();
  if (!config) return;

  const quote = calculateQuote(config);
  if (quote.error) {
    alert(quote.error);
    return;
  }

  const derived = quote.derived || deriveConfiguration(config) || {};
  const summaryItems = buildSelectionSummaryItems(config, derived);
  const categories = Array.isArray(quote.categories) ? quote.categories : [];
  const total = Number(quote.total || 0);

  const snapshot = visualizer.captureSnapshot();
  const jsPdfNamespace = window.jspdf || window.jsPDF;
  const JsPdfConstructor = jsPdfNamespace?.jsPDF || jsPdfNamespace;

  if (!JsPdfConstructor) {
    alert('Impossibile generare il PDF in questo ambiente.');
    return;
  }

  const pdf = new JsPdfConstructor('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  const palette = {
    headerDark: [26, 32, 52],
    headerLight: [45, 58, 88],
    text: [36, 42, 58],
    muted: [110, 118, 142],
    accent: [84, 104, 255],
    accentSoft: [226, 232, 255],
    panel: [247, 249, 255],
    border: [214, 222, 242],
  };

  const fillRect = (color, x, y, width, height) => {
    pdf.setFillColor(color[0], color[1], color[2]);
    pdf.rect(x, y, width, height, 'F');
  };

  fillRect(palette.headerDark, 0, 0, pageWidth, 30);
  fillRect(palette.headerLight, 0, 30, pageWidth, 14);

  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.text('Preventivo Porta Akina', margin, 20);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.text(new Date().toLocaleDateString('it-IT'), pageWidth - margin, 20, { align: 'right' });

  let cursorY = 46;
  pdf.setTextColor(palette.text[0], palette.text[1], palette.text[2]);

  if (snapshot) {
    try {
      const props = pdf.getImageProperties(snapshot);
      const maxImageHeight = Math.min(70, pageHeight * 0.28);
      const imageHeight = Math.min(maxImageHeight, (props.height * contentWidth) / props.width);
      pdf.addImage(snapshot, 'PNG', margin, cursorY, contentWidth, imageHeight);
      cursorY += imageHeight + 10;
    } catch (error) {
      console.warn("Impossibile aggiungere l'immagine al PDF.", error);
    }
  }

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('Riepilogo configurazione', margin, cursorY);
  cursorY += 6;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);

  const summaryColumns = 2;
  const summaryGap = 10;
  const summaryPadding = 8;
  const columnWidth = (contentWidth - summaryGap) / summaryColumns;
  const columnItems = Array.from({ length: summaryColumns }, () => []);
  summaryItems.forEach((item, index) => {
    columnItems[index % summaryColumns].push(item);
  });

  const columnHeights = columnItems.map((items) => {
    let height = 0;
    items.forEach((item) => {
      const valueLines = pdf.splitTextToSize(String(item.value ?? '—'), columnWidth - 6);
      height += 6 + valueLines.length * 4.2 + 4;
    });
    return height;
  });

  const summaryBoxHeight = summaryPadding * 2 + Math.max(...columnHeights, 16);
  pdf.setFillColor(palette.panel[0], palette.panel[1], palette.panel[2]);
  pdf.setDrawColor(palette.border[0], palette.border[1], palette.border[2]);
  pdf.roundedRect(margin, cursorY, contentWidth, summaryBoxHeight, 4, 4, 'FD');

  columnItems.forEach((items, columnIndex) => {
    let columnY = cursorY + summaryPadding + 2;
    const columnX = margin + summaryPadding + columnIndex * (columnWidth + summaryGap);
    items.forEach((item) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(item.label, columnX, columnY + 3);
      pdf.setFont('helvetica', 'normal');
      const valueLines = pdf.splitTextToSize(String(item.value ?? '—'), columnWidth - 6);
      valueLines.forEach((line, lineIndex) => {
        pdf.text(line, columnX, columnY + 6.4 + lineIndex * 4.2);
      });
      columnY += 6 + valueLines.length * 4.2 + 4;
    });
  });

  cursorY += summaryBoxHeight + 12;

  const footerReserve = 32;
  let availableHeight = pageHeight - margin - cursorY - footerReserve;
  if (availableHeight < 40) {
    availableHeight = 40;
  }

  const descriptionWidth = contentWidth * 0.46;
  const codeWidth = contentWidth * 0.18;
  const quantityWidth = contentWidth * 0.1;
  const unitWidth = contentWidth * 0.1;
  const totalWidth = contentWidth - (descriptionWidth + codeWidth + quantityWidth + unitWidth);

  const columnPositions = {
    description: margin + 8,
    code: margin + 8 + descriptionWidth,
    quantity: margin + 8 + descriptionWidth + codeWidth,
    unit: margin + 8 + descriptionWidth + codeWidth + quantityWidth,
    total: margin + 8 + descriptionWidth + codeWidth + quantityWidth + unitWidth,
  };

  const paddingTop = 8;
  const paddingBottom = 8;
  let tableFontSize = 10;
  let itemRowHeight = 6;
  let sectionRowHeight = 7;
  const headerRowHeight = 7;

  const buildTableRows = (fontSize) => {
    const previousFontSize = pdf.getFontSize();
    pdf.setFontSize(fontSize);
    const rows = [];

    categories.forEach((category) => {
      if (!Array.isArray(category.items) || category.items.length === 0) return;
      rows.push({ type: 'section', text: category.label });
      category.items.forEach((item) => {
        const quantity = Number(item.quantita || 0);
        const unitPrice = Number(item.prezzo || 0);
        const totalLine = unitPrice * quantity;
        const description = item.descrizione || '';
        const descLines = pdf.splitTextToSize(description, Math.max(descriptionWidth - 6, 20));
        descLines.forEach((line, lineIndex) => {
          rows.push({
            type: 'item',
            description: line,
            code: lineIndex === 0 ? item.codice : '',
            quantity: lineIndex === 0 && quantity ? quantity : '',
            unit: lineIndex === 0 ? formatCurrency(unitPrice) : '',
            total: lineIndex === 0 ? formatCurrency(totalLine) : '',
          });
        });
      });
    });

    pdf.setFontSize(previousFontSize);
    return rows;
  };

  const computeTableHeight = (rows) =>
    rows.reduce((sum, row) => sum + (row.type === 'section' ? sectionRowHeight : itemRowHeight), 0);

  let tableRows = buildTableRows(tableFontSize);
  const availableTableHeight = Math.max(availableHeight - paddingTop - paddingBottom - headerRowHeight, 16);

  let attempts = 0;
  while (tableRows.length > 0 && computeTableHeight(tableRows) > availableTableHeight && attempts < 6) {
    const currentHeight = computeTableHeight(tableRows);
    const scale = Math.max(availableTableHeight / currentHeight, 0.55);
    tableFontSize = Math.max(6.8, tableFontSize * scale);
    itemRowHeight = Math.max(3.6, itemRowHeight * scale);
    sectionRowHeight = Math.max(4.2, sectionRowHeight * scale);
    tableRows = buildTableRows(tableFontSize);
    attempts += 1;
  }

  let tableContentHeight = computeTableHeight(tableRows);
  if (tableRows.length > 0 && tableContentHeight > availableTableHeight) {
    const scale = Math.max(availableTableHeight / tableContentHeight, 0.45);
    tableFontSize = Math.max(6.2, tableFontSize * scale);
    itemRowHeight = Math.max(3.2, itemRowHeight * scale);
    sectionRowHeight = Math.max(3.8, sectionRowHeight * scale);
    tableRows = buildTableRows(tableFontSize);
    tableContentHeight = computeTableHeight(tableRows);
  }

  if (tableRows.length === 0) {
    const placeholderHeight = 24;
    pdf.setFillColor(palette.panel[0], palette.panel[1], palette.panel[2]);
    pdf.roundedRect(margin, cursorY, contentWidth, placeholderHeight, 4, 4, 'F');
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(10);
    pdf.text('Nessuna voce di preventivo disponibile.', margin + 10, cursorY + placeholderHeight / 2 + 3);
    cursorY += placeholderHeight + 12;
  } else {
    const tableBoxHeight = paddingTop + headerRowHeight + tableContentHeight + paddingBottom;
    pdf.setFillColor(palette.panel[0], palette.panel[1], palette.panel[2]);
    pdf.setDrawColor(palette.border[0], palette.border[1], palette.border[2]);
    pdf.roundedRect(margin, cursorY, contentWidth, tableBoxHeight, 4, 4, 'FD');

    const headerY = cursorY + paddingTop;
    pdf.setFillColor(palette.accentSoft[0], palette.accentSoft[1], palette.accentSoft[2]);
    pdf.rect(margin, headerY, contentWidth, headerRowHeight, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(tableFontSize);
    pdf.setTextColor(palette.text[0], palette.text[1], palette.text[2]);
    pdf.text('Descrizione', columnPositions.description, headerY + headerRowHeight - 2);
    pdf.text('Codice', columnPositions.code, headerY + headerRowHeight - 2);
    pdf.text('Qtà', columnPositions.quantity, headerY + headerRowHeight - 2);
    pdf.text('Prezzo', columnPositions.unit, headerY + headerRowHeight - 2);
    pdf.text('Totale', columnPositions.total, headerY + headerRowHeight - 2);

    let rowCursor = headerY + headerRowHeight;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(tableFontSize);

    tableRows.forEach((row, index) => {
      const height = row.type === 'section' ? sectionRowHeight : itemRowHeight;
      const baseline = rowCursor + height - 1.6;

      if (row.type === 'section') {
        pdf.setFont('helvetica', 'bold');
        pdf.text(row.text, columnPositions.description, baseline);
        pdf.setFont('helvetica', 'normal');
      } else {
        pdf.text(row.description, columnPositions.description, baseline);
        if (row.code) {
          pdf.text(row.code, columnPositions.code + codeWidth - 2, baseline, { align: 'right' });
        }
        if (row.quantity !== '') {
          pdf.text(String(row.quantity), columnPositions.quantity + quantityWidth - 2, baseline, { align: 'right' });
        }
        if (row.unit) {
          pdf.text(row.unit, columnPositions.unit + unitWidth - 2, baseline, { align: 'right' });
        }
        if (row.total) {
          pdf.setFont('helvetica', 'bold');
          pdf.text(row.total, columnPositions.total + totalWidth - 2, baseline, { align: 'right' });
          pdf.setFont('helvetica', 'normal');
        }
      }

      rowCursor += height;
      if (index < tableRows.length - 1) {
        pdf.setDrawColor(palette.border[0], palette.border[1], palette.border[2]);
        pdf.line(margin + 6, rowCursor, margin + contentWidth - 6, rowCursor);
      }
    });

    cursorY += tableBoxHeight + 12;
  }

  const totalBoxHeight = 24;
  pdf.setFillColor(palette.accentSoft[0], palette.accentSoft[1], palette.accentSoft[2]);
  pdf.roundedRect(margin, cursorY, contentWidth, totalBoxHeight, 4, 4, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(palette.text[0], palette.text[1], palette.text[2]);
  pdf.text('Totale', margin + 8, cursorY + totalBoxHeight / 2 + 3);

  pdf.setFontSize(14);
  pdf.setTextColor(palette.accent[0], palette.accent[1], palette.accent[2]);
  pdf.text(
    `${formatCurrency(total)} + IVA e Spese di Trasporto`,
    margin + contentWidth - 8,
    cursorY + totalBoxHeight / 2 + 3,
    { align: 'right' }
  );

  cursorY += totalBoxHeight + 6;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(palette.muted[0], palette.muted[1], palette.muted[2]);
  const disclaimerLines = pdf.splitTextToSize(
    'La Glass Com non si assume responsabilità per errori nei calcoli e nell’utilizzo del tool. Utilizzare sempre cataloghi, listini e schede tecniche aggiornati.',
    contentWidth
  );
  pdf.text(disclaimerLines, margin, cursorY + 4);

  const timestamp = new Date().toISOString().slice(0, 10);
  pdf.save(`preventivo-akina-${timestamp}.pdf`);
}

async function handleOpenFullSummary() {
  if (!selectors.form) return;

  showStepFeedback('');
  const isValid = selectors.form.reportValidity();
  if (!isValid) {
    return;
  }

  refreshOutputs({ force: true });
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const config = collectConfiguration();
  if (!config) return;

  const quote = calculateQuote(config);
  if (quote.error) {
    alert(quote.error);
    return;
  }

  const derived = quote.derived || deriveConfiguration(config) || {};
  const summaryItems = buildSelectionSummaryItems(config, derived);
  const categories = Array.isArray(quote.categories) ? quote.categories : [];
  const cuts = calculateCuts(config, derived) || [];
  const snapshot = visualizer.captureSnapshot();
  const total = Number(quote.total || 0);

  const summaryWindow = window.open('', '_blank');
  if (!summaryWindow) {
    alert('Impossibile aprire il riepilogo completo. Abilita i pop-up del browser per proseguire.');
    return;
  }

  const html = buildFullSummaryHTML({
    snapshot,
    summaryItems,
    categories,
    cuts: Array.isArray(cuts) ? cuts : [],
    total,
  });

  summaryWindow.document.open();
  summaryWindow.document.write(html);
  summaryWindow.document.close();
}

function buildFullSummaryHTML({ snapshot, summaryItems, categories, cuts, total }) {
  const now = new Date().toLocaleString('it-IT');
  const summaryCards = Array.isArray(summaryItems)
    ? summaryItems
        .map((item) => {
          const label = escapeHtml(item.label || '');
          const value = escapeHtml(item.value || '—');
          return `
            <article class="full-summary__fact">
              <p class="full-summary__fact-label">${label}</p>
              <p class="full-summary__fact-value">${value}</p>
            </article>
          `;
        })
        .join('')
    : '';

  const numberFormatter = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 2 });

  const categorySections = Array.isArray(categories)
    ? categories
        .map((category) => {
          if (!Array.isArray(category.items) || category.items.length === 0) {
            return '';
          }
          const itemsMarkup = category.items
            .map((item) => {
              const quantityValue = Number(item.quantita);
              const unitPriceValue = Number(item.prezzo);
              const safeQuantity = Number.isFinite(quantityValue) ? quantityValue : 0;
              const totalLine = Number.isFinite(unitPriceValue) ? unitPriceValue * safeQuantity : 0;
              const quantityDisplay = escapeHtml(
                Number.isFinite(quantityValue)
                  ? numberFormatter.format(quantityValue)
                  : String(item.quantita ?? '—')
              );
              const unitPriceDisplay = escapeHtml(
                Number.isFinite(unitPriceValue) ? formatCurrency(unitPriceValue) : formatCurrency(0)
              );
              const totalDisplay = escapeHtml(
                Number.isFinite(totalLine) ? formatCurrency(totalLine) : formatCurrency(0)
              );
              const imageSrc = escapeHtml(getQuoteItemImage(item));
              const description = escapeHtml(item.descrizione || 'Articolo');
              const code = escapeHtml(item.codice || '—');

              return `
                <li class="full-summary__item">
                  <div class="full-summary__item-media">
                    <img src="${imageSrc}" alt="${description}" loading="lazy" />
                  </div>
                  <div class="full-summary__item-body">
                    <h4>${description}</h4>
                    <p class="full-summary__item-code">Codice articolo: <strong>${code}</strong></p>
                    <div class="full-summary__item-meta">
                      <span>Quantità: <strong>${quantityDisplay}</strong></span>
                      <span>Prezzo unitario: <strong>${unitPriceDisplay}</strong></span>
                      <span>Totale: <strong>${totalDisplay}</strong></span>
                    </div>
                  </div>
                </li>
              `;
            })
            .join('');

          if (!itemsMarkup) {
            return '';
          }

          return `
            <section class="full-summary__category">
              <h3>${escapeHtml(category.label || '')}</h3>
              <ul class="full-summary__items">
                ${itemsMarkup}
              </ul>
            </section>
          `;
        })
        .join('')
    : '';

  const cutsMarkup = Array.isArray(cuts) && cuts.length > 0
    ? `
        <table class="full-summary__cuts-table">
          <thead>
            <tr>
              <th>Elemento</th>
              <th>Quantità</th>
              <th>Dimensione</th>
            </tr>
          </thead>
          <tbody>
            ${cuts
              .map((row) => {
                const element = escapeHtml(row.element || '—');
                const quantity = escapeHtml(String(row.quantity ?? '—'));
                const length = escapeHtml(String(row.length ?? '—'));
                return `<tr><td>${element}</td><td>${quantity}</td><td>${length}</td></tr>`;
              })
              .join('')}
          </tbody>
        </table>
      `
    : '<p class="full-summary__empty">Nessun taglio disponibile per questa configurazione.</p>';

  const snapshotMarkup = snapshot
    ? `
        <section class="full-summary__panel full-summary__panel--snapshot">
          <h2>Anteprima configurazione</h2>
          <div class="full-summary__snapshot">
            <img src="${escapeHtml(snapshot)}" alt="Anteprima 3D della porta configurata" />
          </div>
        </section>
      `
    : '';

  const totalDisplay = escapeHtml(formatCurrency(total));

  return `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Riepilogo completo Porta Akina</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <style>
      :root {
        color-scheme: light;
        --bg: #f3f6ff;
        --surface: #ffffff;
        --surface-alt: #f9fafe;
        --text: #1f2559;
        --text-soft: #4f5c8a;
        --accent: #5468ff;
        --accent-soft: rgba(84, 104, 255, 0.08);
        --border: rgba(92, 111, 190, 0.18);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: 'Poppins', 'Helvetica', 'Arial', sans-serif;
        background: radial-gradient(circle at 20% 20%, rgba(84, 104, 255, 0.12), transparent 55%),
          radial-gradient(circle at 80% 0%, rgba(84, 104, 255, 0.08), transparent 45%),
          var(--bg);
        color: var(--text);
        padding: 3rem 1.5rem 4rem;
      }

      .full-summary {
        max-width: 1080px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
      }

      .full-summary__hero {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
        background: linear-gradient(135deg, rgba(30, 44, 104, 0.95), rgba(84, 104, 255, 0.9));
        color: #ffffff;
        padding: 2.2rem;
        border-radius: 28px;
        box-shadow: 0 30px 80px rgba(34, 48, 120, 0.35);
      }

      .full-summary__hero h1 {
        margin: 0.3rem 0 0;
        font-size: clamp(1.8rem, 3vw, 2.35rem);
        font-weight: 600;
      }

      .full-summary__eyebrow {
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.75rem;
        opacity: 0.75;
      }

      .full-summary__meta {
        margin: 0.6rem 0 0;
        font-size: 0.9rem;
        opacity: 0.8;
      }

      .full-summary__total {
        align-self: flex-start;
        background: rgba(255, 255, 255, 0.12);
        border-radius: 20px;
        padding: 1.6rem;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        backdrop-filter: blur(8px);
      }

      .full-summary__total span {
        font-size: 0.85rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        opacity: 0.8;
      }

      .full-summary__total strong {
        font-size: 2rem;
        font-weight: 600;
      }

      .full-summary__total p {
        margin: 0;
        font-size: 0.85rem;
        opacity: 0.9;
      }

      .full-summary__total button {
        margin-top: 0.5rem;
        align-self: flex-start;
        padding: 0.55rem 1.3rem;
        background: #ffffff;
        color: var(--accent);
        border: none;
        border-radius: 999px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .full-summary__total button:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 28px rgba(17, 24, 64, 0.25);
      }

      .full-summary__panel {
        background: var(--surface);
        border-radius: 26px;
        padding: 2rem;
        box-shadow: 0 24px 60px rgba(33, 44, 111, 0.12);
      }

      .full-summary__panel h2 {
        margin: 0 0 1.5rem;
        font-size: 1.4rem;
        font-weight: 600;
      }

      .full-summary__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
      }

      .full-summary__fact {
        background: var(--surface-alt);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 1.1rem 1.2rem;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }

      .full-summary__fact-label {
        margin: 0;
        font-size: 0.78rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--text-soft);
      }

      .full-summary__fact-value {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 600;
      }

      .full-summary__category + .full-summary__category {
        margin-top: 2rem;
      }

      .full-summary__category h3 {
        margin: 0 0 1rem;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text);
      }

      .full-summary__items {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .full-summary__item {
        display: grid;
        grid-template-columns: 140px 1fr;
        gap: 1.4rem;
        align-items: center;
        background: var(--surface-alt);
        border: 1px solid var(--border);
        border-radius: 22px;
        padding: 1.1rem;
      }

      .full-summary__item-media img {
        width: 100%;
        max-width: 120px;
        border-radius: 18px;
        background: var(--accent-soft);
        object-fit: cover;
        display: block;
      }

      .full-summary__item-body h4 {
        margin: 0 0 0.35rem;
        font-size: 1.05rem;
        font-weight: 600;
      }

      .full-summary__item-code {
        margin: 0 0 0.75rem;
        font-size: 0.85rem;
        color: var(--text-soft);
      }

      .full-summary__item-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem 1.2rem;
        font-size: 0.9rem;
        color: var(--text-soft);
      }

      .full-summary__item-meta strong {
        color: var(--text);
      }

      .full-summary__cuts-table {
        width: 100%;
        border-collapse: collapse;
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 10px 26px rgba(29, 40, 92, 0.12);
      }

      .full-summary__cuts-table thead {
        background: var(--accent);
        color: #ffffff;
      }

      .full-summary__cuts-table th,
      .full-summary__cuts-table td {
        padding: 0.85rem 1rem;
        text-align: left;
        font-size: 0.92rem;
      }

      .full-summary__cuts-table tbody tr:nth-child(odd) {
        background: var(--surface-alt);
      }

      .full-summary__cuts-table tbody tr:nth-child(even) {
        background: var(--surface);
      }

      .full-summary__snapshot {
        border-radius: 22px;
        overflow: hidden;
        background: var(--surface-alt);
        border: 1px solid var(--border);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);
      }

      .full-summary__snapshot img {
        width: 100%;
        display: block;
      }

      .full-summary__empty {
        margin: 0;
        font-size: 0.95rem;
        color: var(--text-soft);
      }

      @media (max-width: 720px) {
        body {
          padding: 2rem 1rem 3rem;
        }

        .full-summary__item {
          grid-template-columns: 1fr;
          text-align: left;
        }

        .full-summary__item-media img {
          max-width: 100%;
          margin: 0 auto;
        }

        .full-summary__item-meta {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    </style>
  </head>
  <body>
    <div class="full-summary">
      <header class="full-summary__hero">
        <div>
          <p class="full-summary__eyebrow">Preventivatore Akina</p>
          <h1>Riepilogo completo</h1>
          <p class="full-summary__meta">Generato il ${escapeHtml(now)}</p>
        </div>
        <div class="full-summary__total">
          <span>Totale configurazione</span>
          <strong>${totalDisplay}</strong>
          <p>+ IVA e Spese di Trasporto</p>
          <button type="button" onclick="window.print()">Stampa</button>
        </div>
      </header>
      ${snapshotMarkup}
      <section class="full-summary__panel">
        <h2>Scelte del configuratore</h2>
        <div class="full-summary__grid">
          ${summaryCards || '<p class="full-summary__empty">Nessuna informazione disponibile.</p>'}
        </div>
      </section>
      <section class="full-summary__panel">
        <h2>Dettaglio preventivo</h2>
        ${categorySections || '<p class="full-summary__empty">Nessuna voce di preventivo disponibile.</p>'}
      </section>
      <section class="full-summary__panel">
        <h2>Calcolo tagli</h2>
        ${cutsMarkup}
      </section>
    </div>
  </body>
</html>`;
}

function setupSelectionGroup(container, optionSelector, hiddenInput, { onChange } = {}) {
  if (!container || !hiddenInput) {
    return {
      select: () => {},
      clear: () => {},
    };
  }

  const options = Array.from(container.querySelectorAll(optionSelector));

  const select = (value) => {
    if (!value) {
      clear();
      return;
    }
    const option = options.find((node) => node.dataset.value === value);
    if (!option) return;
    options.forEach((node) => node.classList.remove('selected'));
    option.classList.add('selected');
    hiddenInput.value = value;
    hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    if (onChange) onChange(value);
  };

  const clear = () => {
    options.forEach((node) => node.classList.remove('selected'));
    hiddenInput.value = '';
    hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    if (onChange) onChange('');
  };

  const isDisabled = (node) =>
    node.classList.contains('is-disabled') || node.getAttribute('aria-disabled') === 'true';

  options.forEach((option) => {
    if (!option.hasAttribute('tabindex')) {
      option.tabIndex = 0;
    }
    option.addEventListener('click', () => {
      if (isDisabled(option)) return;
      select(option.dataset.value || '');
    });
    option.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        if (isDisabled(option)) {
          event.preventDefault();
          return;
        }
        event.preventDefault();
        select(option.dataset.value || '');
      }
    });
  });

  return { select, clear };
}

let modelGroup;
let aperturaGroup;
let tipologiaGroup;
let pannelloFissoGroup;
let pannelliSuBinariGroup;
let pannelloDimensionGroup;
let profiloSuperioreGroup;
let anteNascosteGroup;
let doorBoxGroup;
let doorBoxMountingGroup;
let binarioGroup;
let traversinoGroup;

modelGroup = setupSelectionGroup(selectors.modelContainer, '.model-option', document.getElementById('model-select'), {
  onChange: (value) => {
    const isSoloPannello = value === 'SOLO_PANNELLO';
    const isSoloAnta = value === 'SOLO_ANTA';

    setFlexVisibility(selectors.soloPannelloSection, isSoloPannello);
    toggleRequired(selectors.numPanelsPannelloInput, isSoloPannello);
    if (!isSoloPannello) {
      selectors.numPanelsPannelloInput.value = '';
      updatePanelDimensions(selectors.panelDimensionsPannello, 0, 'pannello');
    }

    setFlexVisibility(selectors.soloAntaSection, isSoloAnta);
    toggleRequired(selectors.numPanelsAntaInput, isSoloAnta);
    if (!isSoloAnta) {
      selectors.numPanelsAntaInput.value = '';
      updatePanelDimensions(selectors.panelDimensionsAnta, 0, 'anta');
    }

    const showNumeroAnte = !isSoloPannello && !isSoloAnta && value !== 'SINGOLA';
    setFlexVisibility(selectors.numeroAnteSection, showNumeroAnte);
    toggleRequired(selectors.numeroAnteSelect, showNumeroAnte);
    if (!showNumeroAnte && aperturaGroup) {
      aperturaGroup.clear();
    }

    updateNumeroAnteOptions(value);

    const showTipologia = value === 'SINGOLA';
    setFlexVisibility(selectors.tipologiaSection, showTipologia);
    toggleRequired(selectors.tipologiaInput, showTipologia);
    if (!showTipologia && tipologiaGroup) {
      tipologiaGroup.clear();
    } else if (showTipologia && tipologiaGroup) {
      tipologiaGroup.select('1');
    }

    const showDoorBox = value === 'TRASCINAMENTO' || value === 'INDIPENDENTE';
    setFlexVisibility(selectors.doorBoxSection, showDoorBox);
    toggleRequired(selectors.doorBoxInput, showDoorBox);
    if (!showDoorBox && doorBoxGroup) {
      doorBoxGroup.clear();
      if (doorBoxMountingGroup) doorBoxMountingGroup.clear();
    }
    if (showDoorBox && doorBoxGroup && !selectors.doorBoxInput.value) {
      doorBoxGroup.select('No');
    }

    const showMontaggio = value === 'SINGOLA';
    setFlexVisibility(selectors.montaggioSection, showMontaggio);

    selectors.optionalTrascinamento.forEach((label) => {
      label.style.display = value === 'TRASCINAMENTO' ? 'flex' : 'none';
      const input = label.querySelector('input');
      if (value !== 'TRASCINAMENTO' && input) input.checked = false;
    });

    selectors.kitTrascinamento.forEach((label) => {
      label.style.display = value === 'TRASCINAMENTO' ? 'flex' : 'none';
      const input = label.querySelector('input');
      if (value !== 'TRASCINAMENTO' && input) input.checked = false;
    });

    setFlexVisibility(selectors.magneticaOptionalSection, value === 'MAGNETICA');
    updateTrackLengthOptions();
    updateAperturaAvailability();
  },
});

aperturaGroup = setupSelectionGroup(selectors.aperturaAnteContainer, '.apertura-ante-option', selectors.aperturaAnteInput);

tipologiaGroup = setupSelectionGroup(selectors.tipologiaContainer, '.tipologia-option', selectors.tipologiaInput);

pannelloFissoGroup = setupSelectionGroup(selectors.pannelloFissoContainer, '.pannello-fisso-option', selectors.pannelloFissoInput, {
  onChange: handlePannelloFissoChange,
});

pannelliSuBinariGroup = setupSelectionGroup(selectors.pannelliSuBinariContainer, '.pannello-option', selectors.pannelliSuBinariInput);

pannelloDimensionGroup = setupSelectionGroup(
  selectors.sceltaPannelloFissoContainer,
  '.binario-option',
  selectors.sceltaPannelloFissoInput,
  { onChange: handleSceltaPannelloFissoChange }
);

profiloSuperioreGroup = setupSelectionGroup(
  selectors.profiloSuperioreContainer,
  '.profilo-superiore-option',
  selectors.profiloSuperioreInput
);

anteNascosteGroup = setupSelectionGroup(
  selectors.anteNascosteContainer,
  '.ante-nascoste-option',
  selectors.anteNascosteInput,
  { onChange: handleAnteNascosteChange }
);

doorBoxGroup = setupSelectionGroup(selectors.doorBoxContainer, '.door-box-option', selectors.doorBoxInput, {
  onChange: handleDoorBoxChange,
});

doorBoxMountingGroup = setupSelectionGroup(
  selectors.doorBoxMountingContainer,
  '.door-box-mounting-option',
  selectors.doorBoxMountingInput
);

binarioGroup = setupSelectionGroup(selectors.binarioContainer, '.binario-option', selectors.binarioInput, {
  onChange: () => {
    updateTrackLengthOptions();
    refreshOutputs();
  },
});

traversinoGroup = setupSelectionGroup(
  selectors.traversinoContainer,
  '.traversino-option',
  selectors.traversinoInput,
  { onChange: handleTraversinoChange }
);

selectors.optionalMagneticaCheckboxes?.forEach((checkbox) => {
  checkbox.addEventListener('change', (event) => {
    if (event.target.checked && MAGNETICA_DEPENDENCIES.has(event.target.value)) {
      const dependency = MAGNETICA_DEPENDENCIES.get(event.target.value);
      setMagneticaOptionalChecked(dependency, true);
    } else if (!event.target.checked && MAGNETICA_DEPENDENCIES.has(event.target.value)) {
      const dependency = MAGNETICA_DEPENDENCIES.get(event.target.value);
      const stillRequired = Array.from(selectors.optionalMagneticaCheckboxes ?? []).some(
        (input) =>
          input.checked &&
          MAGNETICA_DEPENDENCIES.get(input.value) === dependency
      );
      if (!stillRequired) {
        setMagneticaOptionalChecked(dependency, false);
      }
    }
    refreshOutputs();
  });
});

selectors.numeroAnteSelect?.addEventListener('change', () => {
  handleNumeroAnteChange();
  refreshOutputs();
});

selectors.numPanelsPannelloInput?.addEventListener('input', (event) => {
  updatePanelDimensions(selectors.panelDimensionsPannello, event.target.value, 'pannello');
  refreshOutputs();
});

selectors.numPanelsAntaInput?.addEventListener('input', (event) => {
  updatePanelDimensions(selectors.panelDimensionsAnta, event.target.value, 'anta');
  refreshOutputs();
});

selectors.numeroPannelliFissiInput?.addEventListener('input', () => {
  handleNumeroPannelliFissiChange();
  refreshOutputs();
});

selectors.larghezzaPannelloFissoInput?.addEventListener('input', (event) => {
  selectors.larghezzaPannelloFissoHidden.value = event.target.value;
  refreshOutputs();
});

selectors.widthInput?.addEventListener('input', () => {
  updateTrackLengthOptions();
  refreshOutputs();
});

selectors.heightInput?.addEventListener('input', () => {
  refreshOutputs();
});

selectors.lunghezzaBinarioSelect?.addEventListener('change', () => refreshOutputs());
selectors.montaggioSelect?.addEventListener('change', () => {
  updateTrackLengthOptions();
  refreshOutputs();
});
selectors.traversinoMetersInput?.addEventListener('input', () => refreshOutputs());

selectors.form?.addEventListener('change', (event) => {
  event.target.closest('.configurator-section')?.classList.remove('configurator-section--error');
  showStepFeedback('');
  refreshOutputs();
});

selectors.form?.addEventListener('input', (event) => {
  if (event.target.closest('.configurator-section')) {
    event.target.closest('.configurator-section').classList.remove('configurator-section--error');
  }
  showStepFeedback('');
  if (event.target.matches('input[type="number"]') && !event.target.classList.contains('hidden')) {
    refreshOutputs();
  }
});

selectors.selectAllKits?.addEventListener('click', (event) => {
  event.preventDefault();
  selectors.kitCheckboxes?.forEach((checkbox) => {
    checkbox.checked = true;
  });
  refreshOutputs();
});

selectors.fullSummaryButton?.addEventListener('click', () => {
  handleOpenFullSummary();
});

selectors.savePdfButton?.addEventListener('click', () => {
  handleSavePdf();
});

selectors.nextButton?.addEventListener('click', () => {
  goToStep(currentStepIndex + 1, { validateCurrent: true });
});

selectors.prevButton?.addEventListener('click', () => {
  goToStep(currentStepIndex - 1);
});

Array.from(selectors.progressSteps ?? []).forEach((node, index) => {
  node.addEventListener('click', () => {
    if (index <= currentStepIndex) {
      goToStep(index);
    }
  });
});

// Default selections
if (selectors.environmentInput) {
  selectors.environmentInput.value = selectors.environmentInput.value || 'soloporta';
}
modelGroup.select('TRASCINAMENTO');
pannelloFissoGroup.select('No');
anteNascosteGroup.select('No');
binarioGroup.select('A vista');
traversinoGroup.select('No');
aperturaGroup.select('Normale');
updateTrackLengthOptions();
updateAperturaAvailability();
refreshOutputs();
