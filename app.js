import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

const BASE_RATE = 380; // €/m²
const MIN_AREA = 1.3; // m² – superficie minima di riferimento

const LEAF_OPTIONS = {
  '1': { label: '1 anta', multiplier: 1 },
  '2': { label: '2 ante contrapposte', multiplier: 1.28 },
};

const OPENING_TYPES = {
  'scorrevole-parete': { label: 'Scorrevole esterno muro', multiplier: 1.1 },
  'scorrevole-muro': { label: 'Scorrevole interno muro', multiplier: 1.18 },
  battente: { label: 'A battente', multiplier: 1.12 },
};

const TRACK_OPTIONS = {
  standard: { label: 'Binario standard', multiplier: 1, fixed: 180, perSqm: 40 },
  incasso: { label: 'Binario incassato', multiplier: 1.05, fixed: 260, perSqm: 55 },
  'filo-muro': { label: 'Binario filo muro', multiplier: 1.08, fixed: 320, perSqm: 65 },
};

const FLOOR_GUIDE_OPTIONS = {
  standard: { label: 'Guida standard', price: 60 },
  invisibile: { label: 'Guida invisibile', price: 110 },
  autoallineante: { label: 'Guida autoallineante', price: 140 },
};

const PROFILE_FINISHES = {
  'nero-micaceo': { label: 'Nero micaceo', multiplier: 1.08, color: '#24262d' },
  champagne: { label: 'Champagne satinato', multiplier: 1.12, color: '#c8a87c' },
  bronzo: { label: 'Bronzo antico', multiplier: 1.15, color: '#7d5a3c' },
  bianco: { label: 'Bianco opaco', multiplier: 1.05, color: '#f4f4f2' },
};

const GLASS_TYPES = {
  extrachiaro: { label: 'Extrachiaro trasparente', multiplier: 1, color: '#d6e9ff' },
  satinato: { label: 'Satinato acidato', multiplier: 1.06, color: '#edf2f7' },
  fume: { label: 'Fumè grigio', multiplier: 1.08, color: '#b8c3cc' },
  bronzo: { label: 'Bronzo riflettente', multiplier: 1.1, color: '#d5b38a' },
};

const GLASS_TREATMENTS = {
  nessuno: { label: 'Nessun trattamento', price: 0 },
  anticalcare: { label: 'Trattamento anticalcare', price: 95 },
  strutturato: { label: 'Vetro strutturato 3D', price: 160 },
};

const HANDLES = {
  standard: { label: 'Maniglia standard', price: 0 },
  incassata: { label: 'Maniglia incassata', price: 120 },
  totale: { label: 'Maniglione a tutta altezza', price: 210 },
};

const ACCESSORIES = {
  'soft-close': { label: 'Sistema soft-close', price: 135 },
  'kit-montaggio': { label: 'Kit montaggio completo', price: 95 },
  serratura: { label: 'Serratura magnetica', price: 150 },
  guarnizioni: { label: 'Guarnizioni acustiche', price: 110 },
  trattamento: { label: 'Trattamento anti-impronta', price: 80 },
};

const selectors = {
  form: document.getElementById('config-form'),
  stepperItems: Array.from(document.querySelectorAll('.stepper__item')),
  steps: Array.from(document.querySelectorAll('.form-step')),
  prevButton: document.querySelector("button[data-action='prev']"),
  nextButton: document.querySelector("button[data-action='next']"),
  submitButton: document.querySelector("button[type='submit']"),
  totalPrice: document.getElementById('total-price'),
  basePrice: document.getElementById('base-price'),
  structurePrice: document.getElementById('structure-price'),
  finishPrice: document.getElementById('finish-price'),
  handlePrice: document.getElementById('handle-price'),
  accessoriesPrice: document.getElementById('accessories-price'),
  summaryList: document.getElementById('selection-summary'),
  cutsBody: document.getElementById('cuts-body'),
};

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
    this.camera.position.set(140, 180, 320);
    this.camera.lookAt(new THREE.Vector3(0, 100, 0));

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

    this.animate();
  }

  handleResize() {
    const { clientWidth, clientHeight } = this.container;
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);
  }

  updateDoor({ width, height, leaves, profileColor, glassColor, opening }) {
    this.doorGroup.clear();

    const doorWidth = width / leaves;
    const frameDepth = 18;
    const panelInset = 3;

    for (let i = 0; i < leaves; i += 1) {
      const leafGroup = new THREE.Group();
      const offsetX = (doorWidth + 20) * (i - (leaves - 1) / 2);
      leafGroup.position.x = offsetX;

      const frameMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(profileColor),
        metalness: 0.45,
        roughness: 0.3,
      });

      const panelMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(glassColor),
        metalness: 0.15,
        roughness: 0.1,
        transparent: true,
        opacity: 0.82,
      });

      const railGeometry = new THREE.BoxGeometry(doorWidth, 45, frameDepth);
      const stileGeometry = new THREE.BoxGeometry(45, height - 90, frameDepth);
      const panelGeometry = new THREE.BoxGeometry(
        Math.max(doorWidth - 90, 40),
        height - 120,
        frameDepth - panelInset
      );

      const topRail = new THREE.Mesh(railGeometry, frameMaterial);
      topRail.position.set(0, height / 2 - 22.5, 0);
      const bottomRail = new THREE.Mesh(railGeometry, frameMaterial);
      bottomRail.position.set(0, -height / 2 + 22.5, 0);

      const leftStile = new THREE.Mesh(stileGeometry, frameMaterial);
      leftStile.position.set(-doorWidth / 2 + 22.5, 0, 0);
      const rightStile = new THREE.Mesh(stileGeometry, frameMaterial);
      rightStile.position.set(doorWidth / 2 - 22.5, 0, 0);

      const panel = new THREE.Mesh(panelGeometry, panelMaterial);
      panel.position.set(0, 0, -panelInset / 2);

      leafGroup.add(topRail, bottomRail, leftStile, rightStile, panel);

      if (opening === 'battente') {
        const angle = THREE.MathUtils.degToRad(leaves === 1 ? 12 : i === 0 ? -10 : 10);
        leafGroup.rotation.y = angle;
        leafGroup.position.z = i === 0 ? 0 : 12;
      } else if (opening === 'scorrevole-muro') {
        leafGroup.position.z = i % 2 === 0 ? 6 : -6;
      }

      this.doorGroup.add(leafGroup);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.doorGroup.rotation.y = Math.sin(Date.now() * 0.00035) * 0.18;
    this.renderer.render(this.scene, this.camera);
  }
}

const visualizer = new DoorVisualizer(document.getElementById('viewer'));

function getFormValues() {
  const formData = new FormData(selectors.form);
  return {
    width: Number(formData.get('width')),
    height: Number(formData.get('height')),
    leaves: formData.get('leaves') ?? '1',
    swing: formData.get('swing') ?? 'sinistra',
    opening: formData.get('opening') ?? 'scorrevole-parete',
    track: formData.get('track') ?? 'standard',
    floorGuide: formData.get('floorGuide') ?? 'standard',
    profileFinish: formData.get('profileFinish') ?? 'nero-micaceo',
    glassType: formData.get('glassType') ?? 'extrachiaro',
    glassTreatment: formData.get('glassTreatment') ?? 'nessuno',
    handle: formData.get('handle') ?? 'standard',
    accessories: formData.getAll('accessories'),
  };
}

function calculateQuote(values) {
  const { width, height } = values;
  const areaSqMeters = (width * height) / 1_000_000;
  const effectiveArea = Math.max(areaSqMeters, MIN_AREA);
  const basePrice = effectiveArea * BASE_RATE;

  const leavesExtra = basePrice * (LEAF_OPTIONS[values.leaves].multiplier - 1);
  const openingExtra = basePrice * (OPENING_TYPES[values.opening].multiplier - 1);
  const trackData = TRACK_OPTIONS[values.track];
  const trackExtra =
    basePrice * (trackData.multiplier - 1) + trackData.fixed + effectiveArea * trackData.perSqm;
  const floorGuideExtra = FLOOR_GUIDE_OPTIONS[values.floorGuide].price;
  const structurePrice = leavesExtra + openingExtra + trackExtra + floorGuideExtra;

  const finishExtra = basePrice * (PROFILE_FINISHES[values.profileFinish].multiplier - 1);
  const glassExtra = basePrice * (GLASS_TYPES[values.glassType].multiplier - 1);
  const treatmentPrice = GLASS_TREATMENTS[values.glassTreatment].price;
  const finishPrice = finishExtra + glassExtra + treatmentPrice;

  const handlePrice = HANDLES[values.handle].price;
  const accessoriesPrice = values.accessories.reduce(
    (sum, key) => sum + (ACCESSORIES[key]?.price ?? 0),
    0
  );

  const total = basePrice + structurePrice + finishPrice + handlePrice + accessoriesPrice;

  return {
    basePrice,
    structurePrice,
    finishPrice,
    handlePrice,
    accessoriesPrice,
    total,
  };
}

function calculateCuts({ width, height, leaves, opening, track }) {
  const effectiveLeaves = Number(leaves);
  const stileLength = Math.round(height - 90);
  const leafWidth = Math.round(width / effectiveLeaves);
  const railLength = Math.round(leafWidth + 60);
  const glassWidth = Math.max(Math.round(leafWidth - 90), 40);
  const glassHeight = Math.round(stileLength - 60);
  const trackLength = Math.round(width + (track === 'filo-muro' ? 120 : 80));

  const cuts = [
    {
      element: 'Montanti verticali anta',
      quantity: effectiveLeaves * 2,
      length: stileLength,
    },
    {
      element: 'Traversi orizzontali',
      quantity: effectiveLeaves * 2,
      length: railLength,
    },
    {
      element: 'Vetri/pannelli',
      quantity: effectiveLeaves,
      length: `${glassWidth} × ${glassHeight}`,
    },
    {
      element: 'Binario superiore',
      quantity: 1,
      length: trackLength,
    },
    {
      element: 'Guida inferiore',
      quantity: 1,
      length: Math.round(leafWidth),
    },
  ];

  if (opening.startsWith('scorrevole')) {
    cuts.push({
      element: 'Copribinario',
      quantity: 1,
      length: trackLength,
    });
  }

  return cuts;
}

function renderCutsTable(cuts) {
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

function renderSelectionSummary(values) {
  const accessoriesLabel =
    values.accessories.length > 0
      ? values.accessories.map((key) => ACCESSORIES[key]?.label ?? key).join(', ')
      : 'Nessun accessorio';

  const summaryItems = [
    { label: 'Numero di ante', value: LEAF_OPTIONS[values.leaves].label },
    { label: 'Senso di apertura', value: values.swing.replace(/^./, (c) => c.toUpperCase()) },
    { label: 'Tipologia di apertura', value: OPENING_TYPES[values.opening].label },
    { label: 'Sistema di binario', value: TRACK_OPTIONS[values.track].label },
    { label: 'Guida inferiore', value: FLOOR_GUIDE_OPTIONS[values.floorGuide].label },
    { label: 'Finitura profili', value: PROFILE_FINISHES[values.profileFinish].label },
    { label: 'Tipologia vetro', value: GLASS_TYPES[values.glassType].label },
    { label: 'Trattamento vetro', value: GLASS_TREATMENTS[values.glassTreatment].label },
    { label: 'Maniglia', value: HANDLES[values.handle].label },
    { label: 'Accessori', value: accessoriesLabel },
  ];

  selectors.summaryList.innerHTML = '';
  summaryItems.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `${item.label}<span>${item.value}</span>`;
    selectors.summaryList.appendChild(listItem);
  });
}

function updateQuote() {
  const values = getFormValues();
  if (!values.width || !values.height) {
    return;
  }

  const quote = calculateQuote(values);
  const cuts = calculateCuts(values);

  selectors.basePrice.textContent = formatter.format(quote.basePrice);
  selectors.structurePrice.textContent = formatter.format(quote.structurePrice);
  selectors.finishPrice.textContent = formatter.format(quote.finishPrice);
  selectors.handlePrice.textContent = formatter.format(quote.handlePrice);
  selectors.accessoriesPrice.textContent = formatter.format(quote.accessoriesPrice);
  selectors.totalPrice.textContent = formatter.format(quote.total);

  renderSelectionSummary(values);
  renderCutsTable(cuts);
  visualizer.updateDoor({
    width: values.width,
    height: values.height,
    leaves: Number(values.leaves),
    profileColor: PROFILE_FINISHES[values.profileFinish].color,
    glassColor: GLASS_TYPES[values.glassType].color,
    opening: values.opening,
  });
}

let currentStep = 1;
const totalSteps = selectors.steps.length;

function updateStepper() {
  selectors.stepperItems.forEach((item) => {
    const step = Number(item.dataset.step);
    item.classList.toggle('stepper__item--active', step === currentStep);
    item.classList.toggle('stepper__item--completed', step < currentStep);
  });
}

function showStep(step) {
  currentStep = Math.min(Math.max(step, 1), totalSteps);

  selectors.steps.forEach((section) => {
    section.classList.toggle(
      'form-step--active',
      Number(section.dataset.step) === currentStep
    );
  });

  updateStepper();

  selectors.prevButton.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
  selectors.nextButton.style.display = currentStep === totalSteps ? 'none' : 'inline-flex';
  selectors.submitButton.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';
}

selectors.prevButton.addEventListener('click', () => {
  showStep(currentStep - 1);
});

selectors.nextButton.addEventListener('click', () => {
  showStep(currentStep + 1);
});

selectors.stepperItems.forEach((item) => {
  item.addEventListener('click', () => {
    showStep(Number(item.dataset.step));
  });
});

selectors.form.addEventListener('submit', (event) => {
  event.preventDefault();
  updateQuote();
});

selectors.form.addEventListener('input', () => {
  updateQuote();
});

selectors.form.addEventListener('change', () => {
  updateQuote();
});

showStep(1);
updateQuote();
