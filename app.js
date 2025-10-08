import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

const BASE_RATE = 380;
const MIN_AREA = 1.3;

const MODEL_CONFIG = {
  TRASCINAMENTO: { label: 'Trascinamento', multiplier: 1.22, defaultOpening: 'scorrevole-parete' },
  INDIPENDENTE: { label: 'Indipendente', multiplier: 1.18, defaultOpening: 'scorrevole-parete' },
  MAGNETICA: { label: 'Magnetica', multiplier: 1.45, defaultOpening: 'scorrevole-parete' },
  SINGOLA: { label: 'Singola', multiplier: 1.08, defaultOpening: 'scorrevole-parete' },
  SOLO_PANNELLO: { label: 'Solo pannello fisso', multiplier: 0.9, defaultOpening: 'scorrevole-parete' },
  SOLO_ANTA: { label: 'Solo anta', multiplier: 1.05, defaultOpening: 'scorrevole-parete' },
};

const MODEL_ANTE_OPTIONS = {
  TRASCINAMENTO: [2, 3, 4],
  INDIPENDENTE: [2, 3, 4],
  MAGNETICA: [1, 2],
  SINGOLA: [1, 2],
  DEFAULT: [1, 2],
};

const BINARIO_CONFIG = {
  'A vista': { label: 'A vista', multiplier: 1, track: 'standard' },
  Nascosto: { label: 'Nascosto nel cartongesso', multiplier: 1.08, track: 'incasso' },
};

const DOOR_BOX_PRICE = 420;
const PANNELLO_FISSO_PRICE = 150;
const PANNELLI_BINARIO_EXTRA = 65;
const PROFILO_BINARIO_EXTRA = 95;
const MANUAL_PANEL_RATE = 0.18;
const ANTE_NASCOSTE_EXTRA = 120;
const BINARIO_EXTRA_PER_MM = 0.06;
const TRAVERSINO_PRICE_PER_METER = 42;

const DEFAULT_PROFILE_COLOR = '#23283a';
const DEFAULT_GLASS_COLOR = '#d6e9ff';

const formatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
});

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
  }) {
    this.doorGroup.clear();
    this.leafGroups = [];

    if (!width || !height) {
      return;
    }

    const scale = this.scaleFactor;
    const totalWidth = width * scale;
    const doorHeight = height * scale;
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

    const leafWidth = totalWidth / leaves;
    const slideSpacing = scale * (leaves === 1 ? 18 : 24);
    const handleDepthOffset = frameThickness / 2 + 0.6;

    const baseY = doorHeight / 2 + baseOffset;

    const trackGroup = new THREE.Group();
    if (opening !== 'battente') {
      const trackLength =
        totalWidth + (track === 'filo-muro' ? scale * 120 : track === 'incasso' ? scale * 80 : scale * 60);
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
      rail.position.set(0, baseOffset + doorHeight + trackHeight / 2, -frameThickness / 2);

      if (track !== 'incasso') {
        const cover = new THREE.Mesh(
          new THREE.BoxGeometry(trackLength, trackHeight / 2, trackDepth + scale * 14),
          new THREE.MeshStandardMaterial({
            color: track === 'filo-muro' ? '#e2e5ed' : '#d4d7df',
            metalness: 0.3,
            roughness: 0.6,
          })
        );
        cover.position.set(0, rail.position.y + trackHeight / 1.8, rail.position.z + scale * 6);
        trackGroup.add(cover);
      }

      trackGroup.add(rail);
    } else {
      const jambMaterial = new THREE.MeshStandardMaterial({
        color: '#b7b9c2',
        metalness: 0.2,
        roughness: 0.6,
      });
      const jambThickness = scale * 45;
      const jambWidth = scale * 35;
      const jambHeight = doorHeight + scale * 120;
      const jambLeft = new THREE.Mesh(
        new THREE.BoxGeometry(jambWidth, jambHeight, jambThickness),
        jambMaterial
      );
      jambLeft.position.set(-totalWidth / 2 - jambWidth / 2, baseOffset + jambHeight / 2 - scale * 60, -frameThickness);
      const jambRight = jambLeft.clone();
      jambRight.position.x = totalWidth / 2 + jambWidth / 2;
      const head = new THREE.Mesh(
        new THREE.BoxGeometry(totalWidth + jambWidth * 2, jambWidth, jambThickness),
        jambMaterial
      );
      head.position.set(0, jambLeft.position.y + jambHeight / 2 + jambWidth / 2, -frameThickness);
      trackGroup.add(jambLeft, jambRight, head);
    }

    const guideGroup = new THREE.Group();
    if (opening !== 'battente') {
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
      guide.position.set(0, baseOffset - guideHeight / 2, 0);
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
      new THREE.PlaneGeometry(totalWidth + scale * 240, doorHeight + scale * 260),
      backdropMaterial
    );
    backdrop.position.set(0, baseOffset + doorHeight / 2, -frameThickness * 2);

    for (let i = 0; i < leaves; i += 1) {
      const leafGroup = new THREE.Group();
      const offsetX = (leafWidth + slideSpacing) * (i - (leaves - 1) / 2);
      leafGroup.position.set(offsetX, baseY, 0);

      const railHeight = scale * 45;
      const stileHeight = doorHeight - scale * 90;
      const panelWidth = Math.max(leafWidth - scale * 90, scale * 40);
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

      const handleMesh = createHandle(handle);
      const handleOffsetX = (() => {
        if (opening === 'battente') {
          if (leaves === 1) {
            if (swing === 'sinistra') return leafWidth / 2 - scale * 70;
            if (swing === 'destra') return -leafWidth / 2 + scale * 70;
            return 0;
          }
          if (leaves === 2) {
            return i === 0 ? leafWidth / 2 - scale * 70 : -leafWidth / 2 + scale * 70;
          }
        }

        if (leaves === 1) {
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

      leafGroup.add(topRail, bottomRail, leftStile, rightStile, panel, handleMesh);

      if (opening === 'battente') {
        const baseRotation = THREE.MathUtils.degToRad(leaves === 1 ? 12 : i === 0 ? -10 : 10);
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

    this.slideAmplitude = opening.startsWith('scorrevole') ? Math.min(leafWidth * 0.25, scale * 120) : 0;
    this.currentOpening = opening;

    this.doorGroup.add(backdrop, trackGroup, guideGroup);
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
  summaryButton: document.getElementById('generate-summary'),
  basePrice: document.getElementById('base-price'),
  structurePrice: document.getElementById('structure-price'),
  finishPrice: document.getElementById('finish-price'),
  handlePrice: document.getElementById('handle-price'),
  accessoriesPrice: document.getElementById('accessories-price'),
  totalPrice: document.getElementById('total-price'),
  summaryList: document.getElementById('selection-summary'),
  cutsBody: document.getElementById('cuts-body'),
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

function gatherCheckboxDetails(inputs) {
  return Array.from(inputs ?? [])
    .filter((input) => input.checked)
    .map((input) => ({
      value: input.value,
      name: input.dataset.name || input.value,
      price: Number(input.dataset.price || 0),
    }));
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

function updateTrackLengthOptions() {
  const select = selectors.lunghezzaBinarioSelect;
  if (!select) return;
  const width = Number(selectors.widthInput?.value) || 0;
  if (!width) {
    select.innerHTML = '';
    selectors.lunghezzaBinarioMsg.textContent = '';
    return;
  }

  const suggestions = new Set([
    Math.round(width * 1.05),
    Math.round(width * 1.2),
    Math.round(width * 1.35),
  ]);

  if (selectors.anteNascosteInput?.value === 'Si') {
    suggestions.add(Math.round(width * 1.5));
  }

  const sorted = Array.from(suggestions).filter((value) => value > 0).sort((a, b) => a - b);
  const previous = select.value;
  select.innerHTML = '';

  sorted.forEach((length) => {
    const option = document.createElement('option');
    option.value = String(length);
    option.textContent = `${length} mm`;
    select.appendChild(option);
  });

  const fallback =
    sorted.length === 0
      ? ''
      : sorted.includes(Number(previous))
      ? previous
      : String(sorted[sorted.length - 1]);
  if (fallback) {
    select.value = fallback;
  }

  selectors.lunghezzaBinarioMsg.textContent = `Suggerimento: aggiungi almeno ${Math.round(width * 0.25)} mm rispetto alla luce per lo scorrimento ottimale.`;
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
    lunghezzaBinario: Number(data.get('lunghezza_binario')) || 0,
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

function calculateQuote(config) {
  if (!config || !config.width || !config.height) {
    return {
      basePrice: 0,
      structurePrice: 0,
      finishPrice: 0,
      handlePrice: 0,
      accessoriesPrice: 0,
      total: 0,
    };
  }

  const areaSqm = Math.max((config.width * config.height) / 1_000_000, MIN_AREA);
  const modelData = MODEL_CONFIG[config.model] ?? MODEL_CONFIG.TRASCINAMENTO;
  const basePrice = areaSqm * BASE_RATE * (modelData.multiplier ?? 1);

  const binarioData = BINARIO_CONFIG[config.binario] ?? BINARIO_CONFIG['A vista'];
  const trackExtra = basePrice * (binarioData.multiplier - 1) + config.lunghezzaBinario * BINARIO_EXTRA_PER_MM;

  let pannelloFissoExtra = 0;
  if (config.pannelloFisso === 'Si') {
    pannelloFissoExtra += (config.numeroPannelliFissi || 1) * PANNELLO_FISSO_PRICE;
    if (config.pannelliSuBinari === 'Si') {
      pannelloFissoExtra += PANNELLI_BINARIO_EXTRA;
    }
    if (config.profiloSuperioreFissi === 'Quanto tutto il binario') {
      pannelloFissoExtra += PROFILO_BINARIO_EXTRA;
    }
    if (config.sceltaPannelloFisso === 'manuale' && config.larghezzaPannelloFisso) {
      pannelloFissoExtra += config.larghezzaPannelloFisso * MANUAL_PANEL_RATE;
    }
  }

  const doorBoxExtra = config.doorBox === 'Si' ? DOOR_BOX_PRICE : 0;
  const anteNascosteExtra = config.anteNascoste === 'Si' ? ANTE_NASCOSTE_EXTRA : 0;

  const structurePrice = Math.max(0, trackExtra) + pannelloFissoExtra + doorBoxExtra + anteNascosteExtra;

  const handlePrice = config.maniglieDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const traversinoPrice =
    config.traversino === 'Si' ? (config.traversinoMeters || 0) * TRAVERSINO_PRICE_PER_METER : 0;
  const optionalPrice = config.optionalDetails.reduce((sum, item) => sum + item.price, 0);
  const magneticaPrice = config.optionalMagneticaDetails.reduce((sum, item) => sum + item.price, 0);
  const kitPrice = config.kitDetails.reduce((sum, item) => sum + item.price, 0);

  const finishPrice = 0;
  const accessoriesPrice = traversinoPrice + optionalPrice + magneticaPrice + kitPrice;

  const total = basePrice + structurePrice + finishPrice + handlePrice + accessoriesPrice;

  return { basePrice, structurePrice, finishPrice, handlePrice, accessoriesPrice, total };
}

function calculateCuts(config) {
  if (!config || !config.width || !config.height) return [];
  const leaves = Math.max(Number(config.leaves) || 1, 1);
  const stileLength = Math.round(config.height - 90);
  const leafWidth = Math.round(config.width / leaves);
  const railLength = Math.round(leafWidth + 60);
  const glassWidth = Math.max(Math.round(leafWidth - 90), 40);
  const glassHeight = Math.round(stileLength - 60);
  const trackLength = config.lunghezzaBinario || Math.round(config.width * 1.2);

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
          : `Uguali alle ante (${leafWidth} mm)`
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

function renderSelectionSummary(config) {
  if (!selectors.summaryList) return;
  const items = [];
  items.push({
    label: 'Dimensioni vano',
    value:
      config.width && config.height ? `${config.width} × ${config.height} mm` : '—',
  });

  items.push({
    label: 'Modello',
    value: MODEL_CONFIG[config.model]?.label ?? config.model ?? '—',
  });

  if (config.model === 'SOLO_PANNELLO') {
    items.push({ label: 'Numero pannelli', value: config.soloPannelloCount || '—' });
  } else if (config.model === 'SOLO_ANTA') {
    items.push({ label: 'Numero ante', value: config.soloAntaCount || '—' });
  } else {
    items.push({ label: 'Numero ante', value: config.numeroAnte ?? config.leaves });
  }

  if (config.aperturaAnte) {
    items.push({
      label: 'Apertura ante',
      value: getCardLabel(selectors.aperturaAnteContainer, '.apertura-ante-option', config.aperturaAnte, config.aperturaAnte),
    });
  }

  if (config.tipologia) {
    items.push({
      label: 'Tipologia',
      value: getCardLabel(selectors.tipologiaContainer, '.tipologia-option', config.tipologia, config.tipologia),
    });
  }

  items.push({ label: 'Pannello fisso', value: config.pannelloFisso || '—' });

  if (config.pannelloFisso === 'Si') {
    if (config.numeroPannelliFissi) {
      items.push({ label: 'Numero pannelli fissi', value: config.numeroPannelliFissi });
    }
    if (config.pannelliSuBinari) {
      items.push({
        label: 'Fissi su binario',
        value: getCardLabel(
          selectors.pannelliSuBinariContainer,
          '.pannello-option',
          config.pannelliSuBinari,
          config.pannelliSuBinari
        ),
      });
    }
    if (config.sceltaPannelloFisso) {
      items.push({
        label: 'Dimensioni fissi',
        value:
          config.sceltaPannelloFisso === 'manuale'
            ? config.larghezzaPannelloFisso
              ? `${config.larghezzaPannelloFisso} mm`
              : 'Manuale'
            : 'Uguale alle ante',
      });
    }
    if (config.profiloSuperioreFissi) {
      items.push({
        label: 'Profilo superiore',
        value: getCardLabel(
          selectors.profiloSuperioreContainer,
          '.profilo-superiore-option',
          config.profiloSuperioreFissi,
          config.profiloSuperioreFissi
        ),
      });
    }
  }

  items.push({
    label: 'Ante nascoste',
    value: getCardLabel(selectors.anteNascosteContainer, '.ante-nascoste-option', config.anteNascoste, config.anteNascoste),
  });

  items.push({ label: 'Door Box', value: config.doorBox || '—' });

  if (config.doorBox === 'Si' && config.doorBoxMounting) {
    items.push({
      label: 'Montaggio Door Box',
      value: getCardLabel(
        selectors.doorBoxMountingContainer,
        '.door-box-mounting-option',
        config.doorBoxMounting,
        config.doorBoxMounting
      ),
    });
  }

  items.push({
    label: 'Binario',
    value: BINARIO_CONFIG[config.binario]?.label ?? config.binario ?? '—',
  });

  if (config.montaggio) {
    items.push({ label: 'Montaggio', value: config.montaggio });
  }

  if (config.lunghezzaBinario) {
    items.push({ label: 'Lunghezza binario', value: `${config.lunghezzaBinario} mm` });
  }

  items.push({
    label: 'Traversino decorativo',
    value:
      config.traversino === 'Si'
        ? `${config.traversino} (${config.traversinoMeters || 0} m)`
        : config.traversino || '—',
  });

  items.push({
    label: 'Optional Magnetica',
    value: config.optionalMagneticaDetails.length
      ? config.optionalMagneticaDetails
          .map((item) => `${item.value} (${formatter.format(item.price)})`)
          .join(', ')
      : 'Nessuno',
  });

  items.push({
    label: 'Optional',
    value: config.optionalDetails.length
      ? config.optionalDetails.map((item) => `${item.value} (${formatter.format(item.price)})`).join(', ')
      : 'Nessuno',
  });

  items.push({
    label: 'Kit lavorazione',
    value: config.kitDetails.length
      ? config.kitDetails.map((item) => `${item.value} (${formatter.format(item.price)})`).join(', ')
      : 'Nessuno',
  });

  items.push({
    label: 'Maniglie & nicchie',
    value: config.maniglieDetails.length
      ? config.maniglieDetails.map((item) => `${item.code} ×${item.quantity}`).join(', ')
      : 'Nessuna selezione',
  });

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
  const cuts = calculateCuts(config);

  selectors.basePrice.textContent = formatter.format(quote.basePrice);
  selectors.structurePrice.textContent = formatter.format(quote.structurePrice);
  selectors.finishPrice.textContent = formatter.format(quote.finishPrice);
  selectors.handlePrice.textContent = formatter.format(quote.handlePrice);
  selectors.accessoriesPrice.textContent = formatter.format(quote.accessoriesPrice);
  selectors.totalPrice.textContent = formatter.format(quote.total);

  renderSelectionSummary(config);
  renderCutsTable(cuts);

  visualizer.updateDoor({
    width: config.width,
    height: config.height,
    leaves: Math.max(config.leaves, 1),
    profileColor: DEFAULT_PROFILE_COLOR,
    glassColor: DEFAULT_GLASS_COLOR,
    opening: MODEL_CONFIG[config.model]?.defaultOpening ?? 'scorrevole-parete',
    swing: config.aperturaAnte === 'Destra Sinistra' ? 'centrale' : 'sinistra',
    handle: config.maniglieDetails.length > 0 ? 'incassata' : 'standard',
    track: BINARIO_CONFIG[config.binario]?.track ?? 'standard',
    floorGuide: config.anteNascoste === 'Si' ? 'invisibile' : 'standard',
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

    const showNumeroAnte = !isSoloPannello && !isSoloAnta;
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

binarioGroup = setupSelectionGroup(selectors.binarioContainer, '.binario-option', selectors.binarioInput);

traversinoGroup = setupSelectionGroup(
  selectors.traversinoContainer,
  '.traversino-option',
  selectors.traversinoInput,
  { onChange: handleTraversinoChange }
);

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
selectors.montaggioSelect?.addEventListener('change', () => refreshOutputs());
selectors.traversinoMetersInput?.addEventListener('input', () => refreshOutputs());

selectors.form?.addEventListener('change', () => {
  refreshOutputs();
});

selectors.form?.addEventListener('input', (event) => {
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

selectors.summaryButton?.addEventListener('click', () => refreshOutputs({ force: true }));

// Default selections
modelGroup.select('TRASCINAMENTO');
pannelloFissoGroup.select('No');
anteNascosteGroup.select('No');
binarioGroup.select('A vista');
traversinoGroup.select('No');
aperturaGroup.select('Normale');
updateTrackLengthOptions();
refreshOutputs();
