import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

const MODEL_CONFIG = {
  TRASCINAMENTO: { label: 'Trascinamento', defaultOpening: 'scorrevole-parete' },
  INDIPENDENTE: { label: 'Indipendente', defaultOpening: 'scorrevole-parete' },
  MAGNETICA: { label: 'Magnetica', defaultOpening: 'scorrevole-parete' },
  SINGOLA: { label: 'Singola', defaultOpening: 'battente' },
  SOLO_PANNELLO: { label: 'Solo pannello fisso', defaultOpening: 'fisso' },
  SOLO_ANTA: { label: 'Solo anta', defaultOpening: 'scorrevole-parete' },
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

const LARGHEZZA_MIN = 400;
const LARGHEZZA_MAX = 1500;

const DEFAULT_PROFILE_COLOR = '#23283a';
const DEFAULT_GLASS_COLOR = '#d6e9ff';

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
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0a0c14');

    this.camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(180, 180, 360);
    this.camera.lookAt(new THREE.Vector3(0, 120, 0));

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    const rim = new THREE.DirectionalLight(0xffffff, 0.6);
    rim.position.set(-200, 200, 160);
    const key = new THREE.SpotLight(0xffffff, 0.85, 0, Math.PI / 6, 0.4, 1);
    key.position.set(220, 280, 180);
    this.scene.add(ambient, rim, key);

    const floorGeometry = new THREE.CircleGeometry(360, 64);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: '#121726',
      roughness: 0.85,
      metalness: 0.05,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    this.scene.add(floor);

    this.doorGroup = new THREE.Group();
    this.scene.add(this.doorGroup);

    window.addEventListener('resize', () => this.handleResize());

    this.scaleFactor = 0.1;
    this.leafGroups = [];
    this.slideAmplitude = 0;
    this.currentOpening = 'scorrevole-parete';
    this.clock = new THREE.Clock();

    this.animate();
  }

  handleResize() {
    const { clientWidth, clientHeight } = this.container;
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);
  }

  updateDoor({
    width,
    height,
    leaves,
    profileColor,
    glassColor,
    opening,
    swing,
    handle,
    track,
    floorGuide,
    fixedPanels = {},
    doorBox = false,
    doorBoxSide = 'Destra',
    isSoloPanelModel = false,
  }) {
    this.doorGroup.clear();
    this.leafGroups = [];

    if (!width || !height) {
      return;
    }

    const scale = this.scaleFactor;
    const doorHeight = height * scale;
    const totalWidth = width * scale;
    const frameThickness = 4.5;
    const stileWidth = 4.5;
    const panelInset = 0.3;
    const baseOffset = 1.2;

    const frameMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(profileColor),
      metalness: 0.45,
      roughness: 0.3,
    });

    const panelMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(glassColor),
      metalness: 0.1,
      roughness: 0.08,
      transparent: true,
      opacity: 0.82,
    });

    const createHandle = (type) => {
      const handleMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d8dbe6'),
        metalness: 0.8,
        roughness: 0.25,
      });

      if (type === 'totale') {
        const geometry = new THREE.BoxGeometry(scale * 40, doorHeight - scale * 240, scale * 18);
        return new THREE.Mesh(geometry, handleMaterial);
      }

      if (type === 'incassata') {
        const geometry = new THREE.BoxGeometry(scale * 30, scale * 240, scale * 6);
        return new THREE.Mesh(geometry, handleMaterial);
      }

      const geometry = new THREE.CapsuleGeometry(scale * 20, scale * 200, 6, 12);
      return new THREE.Mesh(geometry, handleMaterial);
    };

    const rawLeaves = Math.max(Number(leaves) || 0, 0);
    const slidingLeafCount = isSoloPanelModel ? 0 : Math.max(rawLeaves, 0);
    const fixedCount = Math.max(Number(fixedPanels.count) || 0, 0);
    const fallbackLeafCount = slidingLeafCount > 0 ? slidingLeafCount : Math.max(fixedCount, 1);
    const computedLeafWidth = fallbackLeafCount > 0 ? totalWidth / fallbackLeafCount : totalWidth;
    const leafWidth = Math.max(computedLeafWidth, stileWidth * 2 + scale * 20);

    const manualWidthScaled = Math.max(Number(fixedPanels.manualWidth) || 0, 0) * scale;
    const fixedPanelWidth =
      fixedPanels.mode === 'manuale' && manualWidthScaled ? manualWidthScaled : leafWidth;
    const fixedSpacing = scale * 16;
    const fixedClusterWidth =
      fixedCount > 0
        ? fixedCount * fixedPanelWidth + Math.max(0, fixedCount - 1) * fixedSpacing
        : 0;

    const addsExtraWidth =
      slidingLeafCount > 0 && fixedCount > 0 && !fixedPanels.shareTrack;
    const extraWidth = addsExtraWidth ? fixedClusterWidth + scale * 24 : 0;

    let stageWidth = totalWidth + extraWidth;
    if (slidingLeafCount === 0 && fixedClusterWidth > 0) {
      stageWidth = fixedClusterWidth;
    }
    if (!Number.isFinite(stageWidth) || stageWidth <= 0) {
      stageWidth = totalWidth || fixedClusterWidth || scale * 100;
    }

    const slidingOffsetX = addsExtraWidth ? -extraWidth / 2 : 0;
    const baseY = doorHeight / 2 + baseOffset;
    const slideSpacing = scale * (slidingLeafCount <= 1 ? 18 : 24);
    const handleDepthOffset = frameThickness / 2 + 0.6;
    const showHandles = !isSoloPanelModel && handle !== 'hidden';

    const isSliding = opening === 'scorrevole-parete' || opening === 'scorrevole-muro';
    const isSwing = opening === 'battente';

    const trackGroup = new THREE.Group();
    if (isSliding) {
      const trackSpan = totalWidth;
      const trackOffsetX = slidingOffsetX;
      const trackLength =
        trackSpan + (track === 'filo-muro' ? scale * 120 : track === 'incasso' ? scale * 80 : scale * 60);
      const trackHeight = scale * 40;
      const trackDepth = frameThickness + scale * 6;
      const trackMaterial = new THREE.MeshStandardMaterial({
        color:
          track === 'filo-muro'
            ? '#bfc3cc'
            : track === 'incasso'
            ? '#ccd0d8'
            : '#9aa0ad',
        metalness: 0.65,
        roughness: 0.3,
      });

      const rail = new THREE.Mesh(new THREE.BoxGeometry(trackLength, trackHeight, trackDepth), trackMaterial);
      rail.position.set(trackOffsetX, baseOffset + doorHeight + trackHeight / 2, -frameThickness / 2);

      if (track !== 'incasso') {
        const cover = new THREE.Mesh(
          new THREE.BoxGeometry(trackLength, trackHeight / 2, trackDepth + scale * 14),
          new THREE.MeshStandardMaterial({
            color: track === 'filo-muro' ? '#e2e5ed' : '#d4d7df',
            metalness: 0.3,
            roughness: 0.6,
          })
        );
        cover.position.set(trackOffsetX, rail.position.y + trackHeight / 1.8, rail.position.z + scale * 6);
        trackGroup.add(cover);
      }

      trackGroup.add(rail);
    } else if (isSwing) {
      const jambMaterial = new THREE.MeshStandardMaterial({
        color: '#b7b9c2',
        metalness: 0.2,
        roughness: 0.6,
      });
      const jambThickness = scale * 45;
      const jambWidth = scale * 35;
      const jambHeight = doorHeight + scale * 120;
      const halfSpan = stageWidth / 2;
      const jambLeft = new THREE.Mesh(
        new THREE.BoxGeometry(jambWidth, jambHeight, jambThickness),
        jambMaterial
      );
      jambLeft.position.set(-halfSpan - jambWidth / 2, baseOffset + jambHeight / 2 - scale * 60, -frameThickness);
      const jambRight = jambLeft.clone();
      jambRight.position.x = halfSpan + jambWidth / 2;
      const head = new THREE.Mesh(
        new THREE.BoxGeometry(stageWidth + jambWidth * 2, jambWidth, jambThickness),
        jambMaterial
      );
      head.position.set(0, jambLeft.position.y + jambHeight / 2 + jambWidth / 2, -frameThickness);
      trackGroup.add(jambLeft, jambRight, head);
    }

    const guideGroup = new THREE.Group();
    const showGuide = isSliding && floorGuide !== 'none';
    if (showGuide) {
      const guideMaterial = new THREE.MeshStandardMaterial({
        color: floorGuide === 'invisibile' ? '#a4aab6' : floorGuide === 'autoallineante' ? '#88909f' : '#767d8a',
        metalness: 0.4,
        roughness: 0.45,
      });
      const guideWidth = floorGuide === 'autoallineante' ? scale * 120 : scale * 90;
      const guideHeight = scale * 20;
      const guideDepth = scale * 40;
      const guide = new THREE.Mesh(
        new THREE.BoxGeometry(guideWidth, guideHeight, guideDepth),
        guideMaterial
      );
      guide.position.set(slidingOffsetX, baseOffset - guideHeight / 2, 0);
      guideGroup.add(guide);
    }

    const backdropMaterial = new THREE.MeshStandardMaterial({
      color: '#121826',
      metalness: 0.05,
      roughness: 0.9,
      transparent: true,
      opacity: 0.92,
    });
    const backdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(stageWidth + scale * 240, doorHeight + scale * 260),
      backdropMaterial
    );
    backdrop.position.set(0, baseOffset + doorHeight / 2, -frameThickness * 2);

    for (let i = 0; i < slidingLeafCount; i += 1) {
      const leafGroup = new THREE.Group();
      const offsetX = (leafWidth + slideSpacing) * (i - (slidingLeafCount - 1) / 2) + slidingOffsetX;
      leafGroup.position.set(offsetX, baseY, 0);

      const railHeight = scale * 45;
      const stileHeight = doorHeight - scale * 90;
      const panelWidth = Math.max(leafWidth - stileWidth * 2, scale * 40);
      const panelHeight = doorHeight - scale * 120;

      const topRail = new THREE.Mesh(
        new THREE.BoxGeometry(leafWidth, railHeight, frameThickness),
        frameMaterial
      );
      topRail.position.set(0, doorHeight / 2 - railHeight / 2, 0);

      const bottomRail = topRail.clone();
      bottomRail.position.y = -doorHeight / 2 + railHeight / 2;

      const stileGeometry = new THREE.BoxGeometry(stileWidth, stileHeight, frameThickness);
      const leftStile = new THREE.Mesh(stileGeometry, frameMaterial);
      leftStile.position.set(-leafWidth / 2 + stileWidth / 2, 0, 0);
      const rightStile = leftStile.clone();
      rightStile.position.x = leafWidth / 2 - stileWidth / 2;

      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(panelWidth, panelHeight, frameThickness - panelInset),
        panelMaterial
      );
      panel.position.set(0, 0, -panelInset / 2);

      leafGroup.add(topRail, bottomRail, leftStile, rightStile, panel);

      if (showHandles) {
        const handleMesh = createHandle(handle);
        const handleOffsetX = (() => {
          if (opening === 'battente') {
            if (slidingLeafCount === 1) {
              if (swing === 'sinistra') return leafWidth / 2 - scale * 70;
              if (swing === 'destra') return -leafWidth / 2 + scale * 70;
              return 0;
            }
            if (slidingLeafCount === 2) {
              return i === 0 ? leafWidth / 2 - scale * 70 : -leafWidth / 2 + scale * 70;
            }
          }

          if (slidingLeafCount === 1) {
            return leafWidth / 2 - scale * 80;
          }
          return i === 0 ? leafWidth / 2 - scale * 80 : -leafWidth / 2 + scale * 80;
        })();

        handleMesh.position.set(handleOffsetX, 0, handleDepthOffset);
        if (handle === 'incassata') {
          handleMesh.position.z = handleDepthOffset - scale * 2.2;
        } else if (handle === 'totale') {
          handleMesh.position.z = handleDepthOffset + scale * 0.8;
        }
        leafGroup.add(handleMesh);
      }

      if (opening === 'battente') {
        const baseRotation = THREE.MathUtils.degToRad(slidingLeafCount === 1 ? 12 : i === 0 ? -10 : 10);
        leafGroup.rotation.y = baseRotation;
        leafGroup.userData.baseRotation = baseRotation;
      } else {
        leafGroup.userData.baseRotation = 0;
      }

      if (opening === 'scorrevole-muro') {
        leafGroup.position.z = i % 2 === 0 ? frameThickness / 1.5 : -frameThickness / 1.5;
      }

      leafGroup.userData.baseX = offsetX;
      this.leafGroups.push(leafGroup);
      this.doorGroup.add(leafGroup);
    }

    if (fixedCount > 0) {
      const clusterSpan = fixedClusterWidth || stageWidth;
      const startX = (() => {
        if (slidingLeafCount === 0) {
          return clusterSpan / 2 - fixedPanelWidth / 2;
        }
        if (fixedPanels.shareTrack) {
          return totalWidth / 2 - fixedPanelWidth / 2 + slidingOffsetX;
        }
        return stageWidth / 2 - fixedPanelWidth / 2;
      })();

      for (let index = 0; index < fixedCount; index += 1) {
        const panelGroup = new THREE.Group();
        const railHeight = scale * 45;
        const stileHeight = doorHeight - scale * 90;
        const panelHeight = doorHeight - scale * 120;
        const visiblePanelWidth = Math.max(fixedPanelWidth - stileWidth * 2, scale * 30);

        const topRail = new THREE.Mesh(
          new THREE.BoxGeometry(fixedPanelWidth, railHeight, frameThickness),
          frameMaterial
        );
        topRail.position.set(0, doorHeight / 2 - railHeight / 2, 0);
        const bottomRail = topRail.clone();
        bottomRail.position.y = -doorHeight / 2 + railHeight / 2;

        const stileGeometry = new THREE.BoxGeometry(stileWidth, stileHeight, frameThickness);
        const leftStile = new THREE.Mesh(stileGeometry, frameMaterial);
        leftStile.position.set(-fixedPanelWidth / 2 + stileWidth / 2, 0, 0);
        const rightStile = leftStile.clone();
        rightStile.position.x = fixedPanelWidth / 2 - stileWidth / 2;

        const panelMesh = new THREE.Mesh(
          new THREE.BoxGeometry(visiblePanelWidth, panelHeight, frameThickness - panelInset),
          panelMaterial
        );
        panelMesh.position.set(0, 0, -panelInset / 2);

        panelGroup.add(topRail, bottomRail, leftStile, rightStile, panelMesh);

        const offset =
          (fixedPanels.shareTrack && slidingLeafCount > 0 ? slidingOffsetX : 0) +
          (startX - index * (fixedPanelWidth + fixedSpacing));

        panelGroup.position.set(offset, baseY, 0);
        this.doorGroup.add(panelGroup);
      }
    }

    if (doorBox) {
      const boxWidth = scale * 120;
      const boxDepth = frameThickness * 1.6;
      const boxHeight = doorHeight + scale * 160;
      const doorBoxMaterial = new THREE.MeshStandardMaterial({
        color: '#1f2434',
        metalness: 0.6,
        roughness: 0.35,
      });
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth),
        doorBoxMaterial
      );
      const sideFactor = doorBoxSide === 'Sinistra' ? -1 : 1;
      box.position.set(
        (stageWidth / 2 + boxWidth / 2 + scale * 12) * sideFactor,
        baseOffset + boxHeight / 2 - scale * 80,
        -frameThickness / 2
      );

      const glow = new THREE.Mesh(
        new THREE.BoxGeometry(boxWidth * 0.6, boxHeight * 0.9, boxDepth * 0.6),
        new THREE.MeshStandardMaterial({
          color: '#3b82f6',
          emissive: '#3b82f6',
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.35,
          roughness: 0.6,
          metalness: 0.2,
        })
      );
      glow.position.set(0, 0, boxDepth / 4);
      box.add(glow);
      this.doorGroup.add(box);
    }

    this.slideAmplitude = isSliding && slidingLeafCount > 0 ? Math.min(leafWidth * 0.25, scale * 120) : 0;
    this.currentOpening = opening;

    this.doorGroup.add(backdrop);
    if (trackGroup.children.length) {
      this.doorGroup.add(trackGroup);
    }
    if (guideGroup.children.length) {
      this.doorGroup.add(guideGroup);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const elapsed = this.clock.getElapsedTime();

    if (this.currentOpening === 'scorrevole-parete' || this.currentOpening === 'scorrevole-muro') {
      this.leafGroups.forEach((group, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        group.position.x = group.userData.baseX + Math.sin(elapsed * 0.6) * this.slideAmplitude * direction;
      });
    } else if (this.currentOpening === 'battente') {
      this.leafGroups.forEach((group, index) => {
        const wobble = THREE.MathUtils.degToRad(2.2) * (index % 2 === 0 ? 1 : -1);
        group.rotation.y = group.userData.baseRotation + Math.sin(elapsed * 0.7) * wobble;
      });
    }

    this.doorGroup.rotation.y = Math.sin(elapsed * 0.25) * 0.18;
    this.renderer.render(this.scene, this.camera);
  }
}

const visualizer = new DoorVisualizer(document.getElementById('viewer'));

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
  magneticaOptionalSection: document.getElementById('magnetica-optional-section'),
  optionalTrascinamento: document.querySelectorAll('.optional-trascinamento'),
  kitTrascinamento: document.querySelectorAll('.kit-trascinamento-only'),
  maniglieInputs: document.querySelectorAll('input[name^="maniglie_nicchie_quantity"]'),
  kitCheckboxes: document.querySelectorAll('input[name="kit_lavorazione[]"]'),
  optionalCheckboxes: document.querySelectorAll('input[name="optional[]"]'),
  optionalMagneticaCheckboxes: document.querySelectorAll('input[name="optional_magnetica[]"]'),
  selectAllKits: document.getElementById('select-all-kits'),
  resultsPanel: document.querySelector('.summary-panel'),
  summaryButton: document.getElementById('generate-summary'),
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

function handleNumeroAnteChange() {
  const count = Number(selectors.numeroAnteSelect?.value || 0);
  const shouldShow = count > 1;
  setFlexVisibility(selectors.aperturaAnteSection, shouldShow);
  toggleRequired(selectors.aperturaAnteInput, shouldShow);
  if (!shouldShow && aperturaGroup) {
    aperturaGroup.clear();
  }
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

  const apertura = config.aperturaAnte;
  const isDoubleOpening = apertura === 'Destra Sinistra' || apertura === 'Sinistra Destra';

  let numeroBinari = numeroAnte;
  if (model === 'SINGOLA') {
    numeroBinari = 1;
  } else if (isDoubleOpening) {
    numeroBinari = Math.max(Math.floor(numeroAnte / 2), 1);
  }

  const realNumeroAnte = numeroAnte + (config.anteNascoste === 'Si' || config.doorBox === 'Si' ? 1 : 0);

  const trackCode = config.lunghezzaBinarioCodice || 0;
  const trackMm = config.lunghezzaBinario || mmFromCode(trackCode);
  const trackMeters = config.lunghezzaBinarioMetri || trackMm / 1000;

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

  let larghezzaAnta = 0;
  if (model === 'SINGOLA' || model === 'MAGNETICA') {
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

  const withinRange =
    model === 'MAGNETICA' || model === 'SINGOLA' || larghezzaAnta === 0
      ? true
      : larghezzaAnta >= LARGHEZZA_MIN && larghezzaAnta <= LARGHEZZA_MAX;

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
  const pannelliCount = Math.max(config.numeroPannelliFissi || 1, 1);
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

function calculateCuts(config, derived) {
  if (!config || !config.width || !config.height) return [];
  const effective = derived || deriveConfiguration(config);
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
    cuts.push({
      element: 'Pannelli fissi',
      quantity: config.numeroPannelliFissi || 1,
      length:
        config.sceltaPannelloFisso === 'manuale' && config.larghezzaPannelloFisso
          ? `${Math.round(config.larghezzaPannelloFisso)} × ${config.height}`
          : `Uguali alle ante (${Math.round(effective?.larghezzaAnta || leafWidth)} mm)`
    });
  }

  if (config.doorBox === 'Si') {
    cuts.push({ element: 'Door Box', quantity: 1, length: Math.round(config.height) });
  }

  return cuts;
}


function renderCutsTable(cuts) {
  if (!selectors.cutsBody) return;
  selectors.cutsBody.innerHTML = '';
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

function renderSelectionSummary(config, derived) {
  if (!selectors.summaryList) return;

  const items = [];

  items.push({
    label: 'Modello',
    value: MODEL_CONFIG[config.model]?.label ?? config.model ?? '—',
  });

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

  selectors.summaryList.innerHTML = '';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `${item.label}<span>${item.value}</span>`;
    selectors.summaryList.appendChild(li);
  });
}

function refreshOutputs({ force = false } = {}) {
  if (!selectors.form) return;
  const isValid = force ? selectors.form.reportValidity() : selectors.form.checkValidity();
  if (!isValid) return;
  const config = collectConfiguration();
  if (!config) return;

  const quote = calculateQuote(config);
  if (quote.error) {
    alert(quote.error);
    return;
  }

  const derived = quote.derived || deriveConfiguration(config);
  const cuts = calculateCuts(config, derived);

  if (selectors.quoteTotal) {
    selectors.quoteTotal.textContent = `${formatCurrency(quote.total)} + IVA e Spese di Trasporto`;
  }

  renderQuoteBreakdown(quote.categories || []);
  renderSelectionSummary(config, derived);
  renderCutsTable(cuts);

  if (selectors.viewerHeightLabel) {
    selectors.viewerHeightLabel.textContent = `${formatMillimeters(config.height)} mm`;
  }
  if (selectors.viewerWidthLabel) {
    selectors.viewerWidthLabel.textContent = `A: ${formatMillimeters(config.width)} mm`;
  }
  if (selectors.viewerTrackLabel) {
    const trackLabel = config.lunghezzaBinarioLabel ||
      (config.lunghezzaBinarioMetri ? `${formatMeters(config.lunghezzaBinarioMetri)} m` : '—');
    selectors.viewerTrackLabel.textContent = `Binario: ${trackLabel}`;
  }

  const isSoloPannello = config.model === 'SOLO_PANNELLO';
  const slidingLeaves = isSoloPannello ? 0 : Math.max(derived?.numeroAnte || config.leaves || 1, 1);
  const soloPanelCount = isSoloPannello ? Math.max(config.soloPannelloCount || config.leaves || 1, 1) : 0;
  const fixedPanelsCount =
    !isSoloPannello && config.pannelloFisso === 'Si' ? Math.max(config.numeroPannelliFissi || 1, 1) : 0;

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
    if (config.maniglieDetails.length > 0) return 'incassata';
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

  visualizer.updateDoor({
    width: config.width,
    height: config.height,
    leaves: slidingLeaves || 1,
    profileColor: DEFAULT_PROFILE_COLOR,
    glassColor: DEFAULT_GLASS_COLOR,
    opening: openingType,
    swing: swingDirection,
    handle: handleType,
    track: trackType,
    floorGuide: floorGuideType,
    fixedPanels: fixedPanelDetails,
    doorBox: config.doorBox === 'Si',
    doorBoxSide: config.doorBoxMounting || 'Destra',
    isSoloPanelModel: isSoloPannello,
  });
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

  options.forEach((option) => {
    option.tabIndex = 0;
    option.addEventListener('click', () => select(option.dataset.value || ''));
    option.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
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
      label.style.display = value === 'TRASCINAMENTO' ? 'block' : 'none';
      const input = label.querySelector('input');
      if (value !== 'TRASCINAMENTO' && input) input.checked = false;
    });

    selectors.kitTrascinamento.forEach((label) => {
      label.style.display = value === 'TRASCINAMENTO' ? 'block' : 'none';
      const input = label.querySelector('input');
      if (value !== 'TRASCINAMENTO' && input) input.checked = false;
    });

    setFlexVisibility(selectors.magneticaOptionalSection, value === 'MAGNETICA');
    updateTrackLengthOptions();
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

selectors.summaryButton?.addEventListener('click', () => {
  showStepFeedback('');
  refreshOutputs({ force: true });
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
modelGroup.select('TRASCINAMENTO');
pannelloFissoGroup.select('No');
anteNascosteGroup.select('No');
binarioGroup.select('A vista');
traversinoGroup.select('No');
aperturaGroup.select('Normale');
updateTrackLengthOptions();
refreshOutputs();
