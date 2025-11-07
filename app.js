import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.4/index.js';


const SUPPORTED_LANGUAGES = ['it', 'en', 'de', 'zh'];

const LANGUAGE_NAMES = {
  it: 'Italiano',
  en: 'English',
  de: 'Deutsch',
  zh: '中文',
};

const TRANSLATIONS = {
  it: {
    language: {
      switchAria: 'Lingua',
      names: {
        it: 'Italiano',
        en: 'Inglese',
        de: 'Tedesco',
        zh: 'Cinese',
      },
    },
    header: {
      eyebrow: 'Preventivatore Porta Akina',
      title: 'Configura, visualizza e ottieni il preventivo',
      progressAria: 'Avanzamento configuratore',
    },
    steps: ['Dimensioni e modello', 'Struttura', 'Pannelli e profili', 'Scorrimento', 'Accessori', 'Riepilogo'],
    navigation: {
      ariaLabel: 'Navigazione app',
      viewer: 'Visualizzatore',
      configurator: 'Configuratore',
      summary: 'Riepilogo',
    },
    viewer: {
      loadingTitle: 'Caricamento modelli 3D…',
      controlsAria: 'Controlli visualizzatore 3D',
      ariaLabel: 'Anteprima 3D parametrica',
      partButtons: {
        top: 'Profilo superiore',
        bottom: 'Profilo inferiore',
        left: 'Profilo sinistro',
        right: 'Profilo destro',
        track: 'Binario',
        cover: 'Cover',
      },
      buttons: {
        resetHighlight: 'Reset evidenziazione',
        resetCamera: 'Reset camera',
        fullscreen: 'Schermo intero',
      },
      environment: {
        label: 'Scenario 3D',
        options: {
          soloporta: 'Versione classica',
          classichd: 'Appartamento classico HD',
          modernhd: 'Appartamento moderno HD',
        },
      },
      moveLabel: 'Sposta ante',
      moveLeftAria: 'Sposta ante a sinistra',
      moveRightAria: 'Sposta ante a destra',
      assetWarning: {
        title: 'Avviso caricamento asset',
        localMissing:
          'Non è stato possibile caricare i modelli 3D locali. Carica i file nella cartella <code>profili3dakina</code> per ottenere la resa completa.',
        remoteMissing:
          'Non è stato possibile raggiungere gli asset remoti. Controlla la connessione o abilita il caricamento remoto.',
      },
      dimensionsTemplate:
        'Ante: {leaves} · Larghezza anta: {leafWidth} mm · Altezza: {height} mm · Larghezza totale: {total} mm',
      trackLabel: 'Binario: {value}',
      partInfo: {
        code: 'Codice: {code}',
        dimensions: '{text}',
        pieces: 'Numero di pezzi: {value}',
      },
    },
    form: {
      validation: {
        selectModel: 'Seleziona un modello',
        selectOpening: "Seleziona l'apertura delle ante",
        selectTipologia: 'Seleziona la tipologia',
        selectFixed: 'Indica se vuoi un pannello fisso',
        selectFixedPlacement: 'Indica la posizione dei pannelli fissi',
        default: 'Completa il campo obbligatorio.',
        selectFixedProfile: 'Seleziona la lunghezza del profilo superiore.',
        selectHidden: 'Indica se vuoi le ante nascoste.',
        selectDoorBox: 'Indica se vuoi il Door Box.',
        selectDoorBoxSide: 'Seleziona il lato di montaggio del Door Box.',
        selectTrack: 'Scegli il tipo di binario.',
        selectDecorative: 'Indica se vuoi il traversino decorativo.',
      },
      dimensions: {
        title: 'Dimensioni del vano',
        width: 'Larghezza vano (mm)',
        height: 'Altezza vano (mm)',
      },
      placeholders: {
        widthExample: 'Es. 800 mm',
      },
      model: {
        title: 'Scegli il modello',
        options: {
          TRASCINAMENTO: 'TRASCINAMENTO',
          INDIPENDENTE: 'INDIPENDENTE',
          MAGNETICA: 'MAGNETICA',
          SINGOLA: 'SINGOLA',
          SOLO_PANNELLO: 'SOLO PANNELLO FISSO',
          SOLO_ANTA: 'SOLO ANTA',
        },
      },
      soloPanel: {
        title: 'Configurazione Solo Pannello',
        count: 'Numero di pannelli',
        widthLabel: 'Larghezza pannello {index} (mm)',
        heightLabel: 'Altezza pannello {index} (mm)',
      },
      soloLeaf: {
        title: 'Configurazione Solo Anta',
        count: 'Numero di ante',
        widthLabel: 'Larghezza anta {index} (mm)',
        heightLabel: 'Altezza anta {index} (mm)',
      },
      numeroAnte: {
        title: 'Scegli il numero di ante',
        label: 'Numero di ante',
        singular: 'anta',
        plural: 'ante',
        optionLabel: '{value} {label}',
      },
      aperturaAnte: {
        title: "Scegli l'apertura delle ante",
        options: {
          Normale: 'Normale',
          'Destra Sinistra': 'Destra · Sinistra',
        },
      },
      tipologia: {
        title: 'Scegli la tipologia',
        options: {
          '1': '1',
          '1+1': '1 + 1',
        },
      },
      pannelloFisso: {
        title: 'Vuoi un pannello fisso?',
        quantity: 'Numero dei pannelli fissi',
        sameTracks: 'I pannelli fissi sono sugli stessi binari delle ante scorrevoli?',
        widthQuestion: 'Come vuoi definire la larghezza del pannello fisso?',
        widthOptions: {
          manuale: 'Inserisco io la larghezza',
          uguale_anta: 'Uguale alle ante scorrevoli',
        },
        widthInput: 'Inserisci la larghezza del pannello fisso (in mm)',
      },
      profiloSuperioreFissi: {
        title: 'Scegli la lunghezza del profilo superiore per i fissi',
        options: {
          'Quanto i fissi': 'Quanto i fissi',
          'Quanto tutto il binario': 'Quanto tutto il binario',
        },
      },
      anteNascoste: {
        title: 'Vuoi che le ante siano nascoste dietro il muro?',
        options: {
          Si: 'Si',
          No: 'No',
        },
      },
      doorBox: {
        title: 'Vuoi aggiungere il Door Box?',
        mount: 'Montaggio Door Box',
        options: {
          Si: 'Si',
          No: 'No',
        },
        sides: {
          Destra: 'Destra',
          Sinistra: 'Sinistra',
        },
      },
      binario: {
        title: 'Scegli il binario',
        options: {
          'A vista': 'A vista',
          Nascosto: 'Nascosto nel cartongesso',
        },
      },
      montaggio: {
        title: 'Scegli il montaggio',
        placeholder: "-- Seleziona un'opzione --",
        options: {
          'A soffitto': 'A soffitto',
          Parete: 'Parete',
        },
      },
      lunghezzaBinario: {
        title: 'Scegli la lunghezza del binario',
        helper: 'Compila i campi precedenti per mostrare le lunghezze disponibili.',
        optionLabel: '{value} Metri',
        label: 'Lunghezza del binario:',
      },
      traversino: {
        title: 'Vuoi aggiungere il Traversino Decorativo Adesivo?',
        quantity: 'Quantità in metri',
        options: {
          Si: 'Si',
          No: 'No',
        },
      },
      optionalMagnetica: {
        title: 'Seleziona optional per modello Magnetica',
      },
      optionalGenerali: {
        title: 'Seleziona optional',
        selectAll: 'Seleziona tutti',
      },
      maniglie: {
        title: 'Seleziona maniglie e nicchie',
        quantityLabel: 'Quantità',
      },
      kit: {
        title: 'Seleziona kit di lavorazione profili',
        note: 'Da acquistare solo al primo ordine',
      },
      summaryStep: {
        title: 'Riepilogo finale',
        description:
          'Conferma le tue scelte e salva il preventivo dettagliato in PDF comprensivo di lavorazioni e accessori.',
        disclaimerBold:
          "* La Glass Com non si assume nessuna responsabilità per errori commessi nei calcoli e nell'utilizzo del tool.",
        disclaimer: 'Vi preghiamo di utilizzare i cataloghi, i listini e le schede tecniche a disposizione.',
      },
    },
    summary: {
      quoteEyebrow: 'Riepilogo preventivo',
      quoteTitle: 'Totale configurazione',
      configTitle: 'Dati configurazione',
      itemsTitle: 'Dettaglio voci',
      cutsEyebrow: 'Tagli profili',
      cutsTitle: 'Calcolo tagli',
      emptyCuts: 'Nessun taglio disponibile per questa configurazione.',
      tableHeaders: {
        element: 'Elemento',
        quantity: 'Quantità',
        length: 'Lunghezza (mm)',
      },
      totalSuffix: '+ IVA e Spese di Trasporto',
      labels: {
        modello: 'Modello',
        ambientazione: 'Ambientazione 3D',
        tipologia: 'Tipologia',
        numeroAnte: 'Numero ante',
        numeroBinari: 'Numero binari',
        apertura: 'Apertura',
        montaggio: 'Montaggio',
        doorBox: 'Door Box',
        binario: 'Binario',
        lunghezzaBinario: 'Lunghezza binario',
        traversino: 'Traversino decorativo',
        finitura: 'Finitura',
        spessoreVetro: 'Spessore vetro consigliato',
        dimensioniVano: 'Dimensioni vano',
      },
      defaults: {
        finitura: 'Nera',
        spessoreVetro: '4+4 mm',
        doorBoxNo: 'No',
        doorBoxYes: 'Si',
      },
    },
    totals: {
      totalLabel: 'Totale',
      totalFormatted: '{value} + IVA e Spese di Trasporto',
    },
    buttons: {
      prev: 'Indietro',
      next: 'Avanti',
      openSummary: 'Mostra riepilogo completo',
      savePdf: 'Salva in PDF',
    },
    pdf: {
      title: 'Preventivo Porta Akina',
      summaryTitle: 'Riepilogo configurazione',
      quoteTitle: 'Dettaglio economico',
      cutsTitle: 'Calcolo tagli',
      tableHeaders: {
        description: 'Descrizione',
        code: 'Codice',
        quantity: 'Qtà',
        unit: 'Prezzo',
        total: 'Totale',
      },
      disclaimer:
        'La Glass Com non si assume responsabilità per errori nei calcoli e nell’utilizzo del tool. Utilizzare sempre cataloghi, listini e schede tecniche aggiornati.',
      totalLabel: 'Totale',
      summaryLabels: {
        label: '{label}',
        value: '{value}',
      },
    },
    alerts: {
      popupBlocked: 'Impossibile aprire il riepilogo completo. Abilita i pop-up del browser per proseguire.',
      modelMissing: 'Seleziona un modello per continuare.',
      pdfUnavailable: 'Impossibile generare il PDF in questo ambiente.',
    },
    quote: {
      itemText: '{description} (Codice: {code}, Quantità: {quantity}, Prezzo unitario: {unit}, Totale: {total})',
      noSummary: 'Nessun dato disponibile',
    },
    cuts: {
      panelEqual: 'Uguali alle ante ({value} mm)',
      rows: {
        binariInizialiFinali: 'Binari iniziali e finali',
        binariCentrali: 'Binari centrali',
        anteLarghezza: 'Ante scorrevoli - larghezza',
        anteAltezza: 'Ante scorrevoli - altezza',
        profiliOrizzontali: 'Profili orizzontali anta',
        profiliVerticali: 'Profili verticali anta',
        coverSenzaSpazzolino: 'Cover verticali senza spazzolino',
        coverConSpazzolino: 'Cover verticali con spazzolino',
        vetriAnte: 'Vetri ante scorrevoli',
        pannelliFissi: 'Pannelli fissi',
        vetriPannelliFissi: 'Vetri pannello fisso',
        profiloSuperioreFissi: 'Profilo superiore pannelli fissi',
        ingombroProfili: 'Ingombro profili di scorrimento',
        ingombroTotale: 'Ingombro totale profili + cover',
        traversino: 'Traversino decorativo adesivo',
        montantiVerticali: 'Montanti verticali anta',
        traversiOrizzontali: 'Traversi orizzontali',
        vetriAnteGenerici: 'Vetri / pannelli anta',
        binarioSuperiore: 'Binario superiore',
        guidaInferiore: 'Guida inferiore',
        doorBox: 'Door Box',
      },
    },
    fullSummary: {
      title: 'Riepilogo completo preventivo Akina',
      eyebrow: 'Preventivatore Akina',
      generatedAt: 'Generato il {value}',
      configTitle: 'Scelte configuratore',
      quoteTitle: 'Dettaglio economico',
      cutsTitle: 'Calcolo tagli',
      totalLabel: 'Totale',
      totalSuffix: '+ IVA e Spese di Trasporto',
      print: 'Stampa',
      snapshotTitle: 'Anteprima configurazione',
      snapshotAlt: 'Anteprima 3D della porta configurata',
      emptySummary: 'Nessuna informazione disponibile.',
      emptyQuote: 'Nessuna voce di preventivo disponibile.',
      emptyCuts: 'Nessun taglio disponibile per questa configurazione.',
      itemLabels: {
        code: 'Codice articolo',
        quantity: 'Quantità',
        unitPrice: 'Prezzo unitario',
        total: 'Totale',
      },
      cutsHeaders: {
        element: 'Elemento',
        quantity: 'Quantità',
        length: 'Dimensione',
      },
    },
    misc: {
      documentTitle: 'Preventivatore Porta Akina',
      meters: '{value} m',
      mmPair: '{width} × {height} mm',
      yes: 'Si',
      no: 'No',
      none: '—',
      environment: {
        soloporta: 'Versione classica',
        classichd: 'Appartamento classico HD',
        modernhd: 'Appartamento moderno HD',
      },
      doorBoxSides: { Destra: 'Destra', Sinistra: 'Sinistra' },
      mountings: { 'A soffitto': 'A soffitto', Parete: 'Parete' },
    },
    quoteCategories: {
      binari: 'Binari con Cover',
      cover: 'Cover di Montaggio',
      scorrimento: 'Carrelli e Meccaniche di Scorrimento',
      fissi: 'Binari, Accessori e Telai per Pannello fisso',
      doorBox: 'Door Box',
      maniglie: 'Maniglie e Nicchie',
      kit: 'Kit di Lavorazione Profili',
      traversino: 'Traversino Decorativo Adesivo',
    },
    accessories: {
      labels: {
        code: 'Codice: {code}',
        price: 'Prezzo: {price}',
      },
      defaults: {
        fallbackName: 'Articolo',
      },
      items: {
        'MAG-AC-ELB': { name: 'Elettroblocco' },
        'MAG-AC-TC1': { name: 'Telecomando' },
        'MAG-AC-TC2': { name: 'Telecomando Smart' },
        'MAG-AC-TC3': { name: 'Telecomando Smart con supporto magnetico' },
        'MAG-AC-TNT': { name: 'Tastierino numerico con lettore' },
        'MAG-AC-CAV': { name: 'Cavo di connessione 4 fili' },
        'MAG-AC-MTS': { name: 'Mini sensore superiore' },
        'MAG-AC-CSB': { name: 'Clean Switch nero' },
        'MAG-AC-CSW': { name: 'Clean Switch bianco' },
        'MAG-AC-SBH': { name: 'Supporto Clean Switch quadrato' },
        'MAG-AC-SBW': { name: 'Supporto Clean Switch rettangolare' },
        'MAG-AC-SYN': { name: 'Cavo ante sincronizzate' },
        'UNK-KIT1S-K1A': { name: 'Kit anta ridotta (+100 € su anta)' },
        'UNK-PTO': { name: 'Push to Open con Soft Close' },
        'UNK-CAM-L1500': { name: 'Cinta per sincronizzazione ante maggiorate' },
        MAQ1015: { name: 'Coppia maniglie dritte autoadesive 10 × 160 mm' },
        'UNK-NTI NO': { name: 'Coppia nicchie tonde autoadesive Ø 110 mm' },
        'UNK-MRC200.33 NO': { name: 'Coppia maniglie a C 200 × 33 mm' },
        'UNK-MRC206.33 NO': { name: 'Coppia maniglie a C 206 × 33 mm' },
        'UNK-KSM NO': { name: 'Kit serratura magnetica per porta scorrevole' },
        'NRCI50.220': { name: 'Coppia nicchie autoadesive 50 × 110 mm' },
        'NRCI45.220 NO': { name: 'Coppia nicchie autoadesive 45 × 220 mm' },
        'UNK-PFT': { name: 'Punta per trapano foratura telaio' },
        'UNK-PSC': { name: 'Pinza per serraggio su cinghia' },
        'UNK-PVT': { name: 'Prolunga per fissaggio viti su telaio' },
        'UNK-DDC': { name: 'Dima per dimensione cinghia' },
        'UNK-DFT': { name: 'Dima per foratura profili telaio porta' },
        'UNK-GS1-L20': { name: 'Binario principale 2 m' },
        'UNK-GS1-L30': { name: 'Binario principale 3 m' },
        'UNK-GS1-L40': { name: 'Binario principale 4 m' },
        'UNK-GS1-L60': { name: 'Binario principale 6 m' },
        'UNK-GS2-L20': { name: 'Binario aggiuntivo 2 m' },
        'UNK-GS2-L30': { name: 'Binario aggiuntivo 3 m' },
        'UNK-GS2-L40': { name: 'Binario aggiuntivo 4 m' },
        'UNK-GS2-L60': { name: 'Binario aggiuntivo 6 m' },
        'UNK-GP1-L25': { name: 'Kit binario parete 2,5 m' },
        'UNK-GP1-L40': { name: 'Kit binario parete 4 m' },
        'M100-P40-L20': { name: 'Magnetica a vista 2 m (per anta)' },
        'M100-P40-L27': { name: 'Magnetica a vista 2,7 m (per anta)' },
        'M100-P40-L34': { name: 'Magnetica a vista 3,4 m (per anta)' },
        'M100-CS55-L21': { name: 'Magnetica incassata 2,1 m (per anta)' },
        'M100-CS55-L28': { name: 'Magnetica incassata 2,8 m (per anta)' },
        'UNK-CCS-L30 NO': { name: 'Cover di montaggio' },
        'M100-CF-L20': { name: 'Cover frontale 2 m' },
        'M100-CS-L20': { name: 'Cover superiore 2 m' },
        'M100-PM-L20': { name: 'Profilo montaggio 2 m' },
        'M100-CF-L27': { name: 'Cover frontale 2,7 m' },
        'M100-CS-L27': { name: 'Cover superiore 2,7 m' },
        'M100-PM-L27': { name: 'Profilo montaggio 2,7 m' },
        'UNK-PF-K1A': { name: 'Kit accessori pannello fisso' },
        'UNK-TK3-L30 NO': { name: 'Telaio per pannello fisso' },
        'UNK-TK1-L30': { name: 'Telaio anta scorrevole' },
        'UNK-TK2-L30': { name: 'Telaio anta centrale' },
        'UNK-TK3-L30': { name: 'Telaio anta singola' },
        'UNK-DBDX-K1A': { name: 'Door Box Destra' },
        'UNK-BDSX-K1A': { name: 'Door Box Sinistra' },
        DEP01: { name: 'Traversino decorativo adesivo (m)' },
      },
    },
  },

  en: {
    language: {
      switchAria: 'Language',
      names: {
        it: 'Italian',
        en: 'English',
        de: 'German',
        zh: 'Chinese',
      },
    },
    header: {
      eyebrow: 'Akina Door Quoter',
      title: 'Configure, preview and get your quote',
      progressAria: 'Configurator progress',
    },
    steps: ['Dimensions & model', 'Structure', 'Panels & profiles', 'Sliding', 'Accessories', 'Summary'],
    navigation: {
      ariaLabel: 'App navigation',
      viewer: '3D Viewer',
      configurator: 'Configurator',
      summary: 'Summary',
    },
    viewer: {
      loadingTitle: 'Loading 3D models…',
      controlsAria: '3D viewer controls',
      ariaLabel: 'Parametric 3D preview',
      partButtons: {
        top: 'Top profile',
        bottom: 'Bottom profile',
        left: 'Left profile',
        right: 'Right profile',
        track: 'Track',
        cover: 'Cover',
      },
      buttons: {
        resetHighlight: 'Reset highlight',
        resetCamera: 'Reset camera',
        fullscreen: 'Fullscreen',
      },
      environment: {
        label: '3D style',
        options: {
          soloporta: 'Classic view',
          classichd: 'Classic interior (HD)',
          modernhd: 'Modern apartment (HD)',
        },
      },
      moveLabel: 'Move leaves',
      moveLeftAria: 'Move leaves to the left',
      moveRightAria: 'Move leaves to the right',
      assetWarning: {
        title: 'Asset loading warning',
        localMissing:
          'The local 3D models could not be loaded. Place the files inside the <code>profili3dakina</code> folder to enjoy the full experience.',
        remoteMissing:
          'The remote assets are not reachable. Check your connection or enable remote loading.',
      },
      dimensionsTemplate:
        'Leaves: {leaves} · Leaf width: {leafWidth} mm · Height: {height} mm · Total width: {total} mm',
      trackLabel: 'Track: {value}',
      partInfo: {
        code: 'Code: {code}',
        dimensions: 'Dimensions: {text}',
        pieces: 'Pieces: {value}',
      },
    },
    form: {
      validation: {
        selectModel: 'Select a model',
        selectOpening: 'Select the leaf opening',
        selectTipologia: 'Select the typology',
        selectFixed: 'Tell us if you need a fixed panel',
        selectFixedPlacement: 'Tell us where the fixed panels sit',
        default: 'Please complete the required field.',
        selectFixedProfile: 'Please choose the top profile length.',
        selectHidden: 'Please specify if the leaves hide behind the wall.',
        selectDoorBox: 'Please choose whether to add the Door Box.',
        selectDoorBoxSide: 'Please choose the Door Box mounting side.',
        selectTrack: 'Please choose the track type.',
        selectDecorative: 'Please specify if you want the decorative bar.',
      },
      dimensions: {
        title: 'Opening size',
        width: 'Opening width (mm)',
        height: 'Opening height (mm)',
      },
      placeholders: {
        widthExample: 'e.g. 800 mm',
      },
      model: {
        title: 'Choose the model',
        options: {
          TRASCINAMENTO: 'TRASCINAMENTO',
          INDIPENDENTE: 'INDIPENDENTE',
          MAGNETICA: 'MAGNETICA',
          SINGOLA: 'SINGOLA',
          SOLO_PANNELLO: 'SOLO PANNELLO FISSO',
          SOLO_ANTA: 'SOLO ANTA',
        },
      },
      soloPanel: {
        title: 'Fixed panel configuration',
        count: 'Number of panels',
        widthLabel: 'Panel width {index} (mm)',
        heightLabel: 'Panel height {index} (mm)',
      },
      soloLeaf: {
        title: 'Single leaf configuration',
        count: 'Number of leaves',
        widthLabel: 'Leaf width {index} (mm)',
        heightLabel: 'Leaf height {index} (mm)',
      },
      numeroAnte: {
        title: 'Select the number of leaves',
        label: 'Number of leaves',
        singular: 'leaf',
        plural: 'leaves',
        optionLabel: '{value} {label}',
      },
      aperturaAnte: {
        title: 'Choose the opening direction',
        options: {
          Normale: 'One-sided',
          'Destra Sinistra': 'Right & left',
        },
      },
      tipologia: {
        title: 'Choose the typology',
        options: {
          '1': '1',
          '1+1': '1 + 1',
        },
      },
      pannelloFisso: {
        title: 'Do you want a fixed panel?',
        quantity: 'Number of fixed panels',
        sameTracks: 'Do the fixed panels use the same tracks as the sliding leaves?',
        widthQuestion: 'How would you like to define the fixed panel width?',
        widthOptions: {
          manuale: 'I will enter the width',
          uguale_anta: 'Same as the sliding leaves',
        },
        widthInput: 'Enter the fixed panel width (mm)',
      },
      profiloSuperioreFissi: {
        title: 'Choose the top profile length for the fixed panels',
        options: {
          'Quanto i fissi': 'Same as the fixed panels',
          'Quanto tutto il binario': 'Same as the full track',
        },
      },
      anteNascoste: {
        title: 'Should the leaves hide behind the wall?',
        options: {
          Si: 'Yes',
          No: 'No',
        },
      },
      doorBox: {
        title: 'Add the Door Box?',
        mount: 'Door Box mounting',
        options: {
          Si: 'Yes',
          No: 'No',
        },
        sides: {
          Destra: 'Right',
          Sinistra: 'Left',
        },
      },
      binario: {
        title: 'Choose the track',
        options: {
          'A vista': 'Exposed',
          Nascosto: 'Hidden in drywall',
        },
      },
      montaggio: {
        title: 'Select the mounting',
        placeholder: '-- Choose an option --',
        options: {
          'A soffitto': 'Ceiling',
          Parete: 'Wall',
        },
      },
      lunghezzaBinario: {
        title: 'Choose the track length',
        helper: 'Complete the previous fields to show the available lengths.',
        optionLabel: '{value} Metres',
        label: 'Track length:',
      },
      traversino: {
        title: 'Add the decorative adhesive bar?',
        quantity: 'Metres',
        options: {
          Si: 'Yes',
          No: 'No',
        },
      },
      optionalMagnetica: {
        title: 'Magnetica model accessories',
      },
      optionalGenerali: {
        title: 'Optional accessories',
        selectAll: 'Select all',
      },
      maniglie: {
        title: 'Handles and recessed pulls',
        quantityLabel: 'Quantity',
      },
      kit: {
        title: 'Profile processing kits',
        note: 'Only required on the first order',
      },
      summaryStep: {
        title: 'Final summary',
        description: 'Review your choices and save the detailed PDF quote with hardware and machining.',
        disclaimerBold: '* Glass Com is not responsible for mistakes in the calculations or the use of the tool.',
        disclaimer: 'Please refer to the catalogues, price lists and technical sheets provided.',
      },
    },
    summary: {
      quoteEyebrow: 'Quote summary',
      quoteTitle: 'Configuration total',
      configTitle: 'Configuration data',
      itemsTitle: 'Line items',
      cutsEyebrow: 'Profile cuts',
      cutsTitle: 'Cut calculation',
      emptyCuts: 'No cuts are available for this configuration.',
      tableHeaders: {
        element: 'Element',
        quantity: 'Quantity',
        length: 'Length (mm)',
      },
      totalSuffix: '+ VAT and shipping',
      labels: {
        modello: 'Model',
        ambientazione: '3D environment',
        tipologia: 'Typology',
        numeroAnte: 'Leaves',
        numeroBinari: 'Tracks',
        apertura: 'Opening',
        montaggio: 'Mounting',
        doorBox: 'Door Box',
        binario: 'Track',
        lunghezzaBinario: 'Track length',
        traversino: 'Decorative bar',
        finitura: 'Finish',
        spessoreVetro: 'Recommended glass thickness',
        dimensioniVano: 'Opening size',
      },
      defaults: {
        finitura: 'Black',
        spessoreVetro: '4+4 mm',
        doorBoxNo: 'No',
        doorBoxYes: 'Yes',
      },
    },
    totals: {
      totalLabel: 'Total',
      totalFormatted: '{value} + VAT and shipping',
    },
    buttons: {
      prev: 'Back',
      next: 'Next',
      openSummary: 'Show full summary',
      savePdf: 'Save as PDF',
    },
    pdf: {
      title: 'Akina Door Quote',
      summaryTitle: 'Configuration summary',
      quoteTitle: 'Economic details',
      cutsTitle: 'Cut calculation',
      tableHeaders: {
        description: 'Description',
        code: 'Code',
        quantity: 'Qty',
        unit: 'Unit price',
        total: 'Total',
      },
      disclaimer:
        'Glass Com is not responsible for errors in the calculations or the use of this tool. Always refer to the latest catalogues, price lists and technical sheets.',
      totalLabel: 'Total',
      summaryLabels: {
        label: '{label}',
        value: '{value}',
      },
    },
    alerts: {
      popupBlocked: 'Unable to open the full summary. Please allow browser pop-ups to continue.',
      modelMissing: 'Please select a model to continue.',
      pdfUnavailable: 'Unable to generate the PDF in this environment.',
    },
    quote: {
      itemText: '{description} (Code: {code}, Quantity: {quantity}, Unit price: {unit}, Total: {total})',
      noSummary: 'No data available',
    },
    cuts: {
      panelEqual: 'Same as the leaves ({value} mm)',
      rows: {
        binariInizialiFinali: 'Initial & end tracks',
        binariCentrali: 'Intermediate tracks',
        anteLarghezza: 'Sliding leaves – width',
        anteAltezza: 'Sliding leaves – height',
        profiliOrizzontali: 'Horizontal leaf profiles',
        profiliVerticali: 'Vertical leaf profiles',
        coverSenzaSpazzolino: 'Vertical covers without brush',
        coverConSpazzolino: 'Vertical covers with brush',
        vetriAnte: 'Sliding leaf glass',
        pannelliFissi: 'Fixed panels',
        vetriPannelliFissi: 'Fixed panel glass',
        profiloSuperioreFissi: 'Top profile for fixed panels',
        ingombroProfili: 'Sliding hardware footprint',
        ingombroTotale: 'Overall profiles + covers footprint',
        traversino: 'Decorative adhesive bar',
        montantiVerticali: 'Leaf stile cut',
        traversiOrizzontali: 'Cross-rail cut',
        vetriAnteGenerici: 'Leaf glass / panels',
        binarioSuperiore: 'Top track',
        guidaInferiore: 'Bottom guide',
        doorBox: 'Door Box',
      },
    },
    fullSummary: {
      title: 'Akina configurator full summary',
      eyebrow: 'Akina configurator',
      generatedAt: 'Generated on {value}',
      configTitle: 'Configurator choices',
      quoteTitle: 'Economic details',
      cutsTitle: 'Cut calculation',
      totalLabel: 'Total',
      totalSuffix: '+ VAT and shipping',
      print: 'Print',
      snapshotTitle: 'Configuration preview',
      snapshotAlt: '3D preview of the configured door',
      emptySummary: 'No information available.',
      emptyQuote: 'No quote items available.',
      emptyCuts: 'No cuts are available for this configuration.',
      itemLabels: {
        code: 'Item code',
        quantity: 'Quantity',
        unitPrice: 'Unit price',
        total: 'Total',
      },
      cutsHeaders: {
        element: 'Element',
        quantity: 'Quantity',
        length: 'Length (mm)',
      },
    },
    misc: {
      documentTitle: 'Akina Door Quoter',
      meters: '{value} m',
      mmPair: '{width} × {height} mm',
      yes: 'Yes',
      no: 'No',
      none: '—',
      environment: {
        soloporta: 'Classic view',
        classichd: 'Classic interior (HD)',
        modernhd: 'Modern apartment (HD)',
      },
      doorBoxSides: { Destra: 'Right', Sinistra: 'Left' },
      mountings: { 'A soffitto': 'Ceiling', Parete: 'Wall' },
    },
    quoteCategories: {
      binari: 'Tracks with cover',
      cover: 'Mounting cover',
      scorrimento: 'Carriages and sliding mechanics',
      fissi: 'Tracks, accessories and frames for fixed panels',
      doorBox: 'Door Box',
      maniglie: 'Handles and pulls',
      kit: 'Profile processing kits',
      traversino: 'Decorative adhesive bar',
    },
    accessories: {
      labels: {
        code: 'Code: {code}',
        price: 'Price: {price}',
      },
      defaults: {
        fallbackName: 'Item',
      },
      items: {
        'MAG-AC-ELB': { name: 'Electric lock' },
        'MAG-AC-TC1': { name: 'Remote control' },
        'MAG-AC-TC2': { name: 'Smart remote' },
        'MAG-AC-TC3': { name: 'Smart remote with magnetic mount' },
        'MAG-AC-TNT': { name: 'Keypad with fingerprint & badge reader' },
        'MAG-AC-CAV': { name: '4-wire connection cable' },
        'MAG-AC-MTS': { name: 'Mini top sensor' },
        'MAG-AC-CSB': { name: 'Clean Switch black' },
        'MAG-AC-CSW': { name: 'Clean Switch white' },
        'MAG-AC-SBH': { name: 'Square Clean Switch mount' },
        'MAG-AC-SBW': { name: 'Rectangular Clean Switch mount' },
        'MAG-AC-SYN': { name: 'Sync cable for leaves' },
        'UNK-KIT1S-K1A': { name: 'Reduced leaf kit (+€100 per leaf)' },
        'UNK-PTO': { name: 'Push to Open with soft close' },
        'UNK-CAM-L1500': { name: 'Belt for oversized leaf synchronisation' },
        MAQ1015: { name: 'Adhesive straight handle pair 10 × 160 mm' },
        'UNK-NTI NO': { name: 'Adhesive round recessed pull pair Ø 110 mm' },
        'UNK-MRC200.33 NO': { name: 'C-handle pair 200 × 33 mm' },
        'UNK-MRC206.33 NO': { name: 'C-handle pair 206 × 33 mm' },
        'UNK-KSM NO': { name: 'Magnetic lock kit for sliding door' },
        'NRCI50.220': { name: 'Adhesive recessed pull pair 50 × 110 mm' },
        'NRCI45.220 NO': { name: 'Adhesive recessed pull pair 45 × 220 mm' },
        'UNK-PFT': { name: 'Frame drilling bit' },
        'UNK-PSC': { name: 'Belt clamping pliers' },
        'UNK-PVT': { name: 'Frame screw fixing extension' },
        'UNK-DDC': { name: 'Belt sizing template' },
        'UNK-DFT': { name: 'Frame profile drilling template' },
        'UNK-GS1-L20': { name: 'Primary track 2 m' },
        'UNK-GS1-L30': { name: 'Primary track 3 m' },
        'UNK-GS1-L40': { name: 'Primary track 4 m' },
        'UNK-GS1-L60': { name: 'Primary track 6 m' },
        'UNK-GS2-L20': { name: 'Additional track 2 m' },
        'UNK-GS2-L30': { name: 'Additional track 3 m' },
        'UNK-GS2-L40': { name: 'Additional track 4 m' },
        'UNK-GS2-L60': { name: 'Additional track 6 m' },
        'UNK-GP1-L25': { name: 'Wall-mounted track kit 2.5 m' },
        'UNK-GP1-L40': { name: 'Wall-mounted track kit 4 m' },
        'M100-P40-L20': { name: 'Visible magnetic track 2 m (per leaf)' },
        'M100-P40-L27': { name: 'Visible magnetic track 2.7 m (per leaf)' },
        'M100-P40-L34': { name: 'Visible magnetic track 3.4 m (per leaf)' },
        'M100-CS55-L21': { name: 'Recessed magnetic track 2.1 m (per leaf)' },
        'M100-CS55-L28': { name: 'Recessed magnetic track 2.8 m (per leaf)' },
        'UNK-CCS-L30 NO': { name: 'Mounting cover' },
        'M100-CF-L20': { name: 'Front cover 2 m' },
        'M100-CS-L20': { name: 'Top cover 2 m' },
        'M100-PM-L20': { name: 'Mounting profile 2 m' },
        'M100-CF-L27': { name: 'Front cover 2.7 m' },
        'M100-CS-L27': { name: 'Top cover 2.7 m' },
        'M100-PM-L27': { name: 'Mounting profile 2.7 m' },
        'UNK-PF-K1A': { name: 'Fixed panel accessory kit' },
        'UNK-TK3-L30 NO': { name: 'Fixed panel frame' },
        'UNK-TK1-L30': { name: 'Sliding leaf frame' },
        'UNK-TK2-L30': { name: 'Central leaf frame' },
        'UNK-TK3-L30': { name: 'Single leaf frame' },
        'UNK-DBDX-K1A': { name: 'Door Box Right' },
        'UNK-BDSX-K1A': { name: 'Door Box Left' },
        DEP01: { name: 'Decorative adhesive bar (m)' },
      },
    },
  },
  de: {
    language: {
      switchAria: 'Sprache',
      names: {
        it: 'Italienisch',
        en: 'Englisch',
        de: 'Deutsch',
        zh: 'Chinesisch',
      },
    },
    header: {
      eyebrow: 'Akina Türkonfigurator',
      title: 'Konfigurieren, visualisieren und Angebot erhalten',
      progressAria: 'Fortschritt des Konfigurators',
    },
    steps: ['Abmessungen & Modell', 'Struktur', 'Paneele & Profile', 'Lauftechnik', 'Zubehör', 'Zusammenfassung'],
    navigation: {
      ariaLabel: 'App-Navigation',
      viewer: '3D-Ansicht',
      configurator: 'Konfigurator',
      summary: 'Zusammenfassung',
    },
    viewer: {
      loadingTitle: '3D-Modelle werden geladen…',
      controlsAria: 'Bedienelemente des 3D-Viewers',
      ariaLabel: 'Parametrische 3D-Vorschau',
      partButtons: {
        top: 'Oberes Profil',
        bottom: 'Unteres Profil',
        left: 'Linkes Profil',
        right: 'Rechtes Profil',
        track: 'Laufschiene',
        cover: 'Abdeckung',
      },
      buttons: {
        resetHighlight: 'Hervorhebung zurücksetzen',
        resetCamera: 'Kamera zurücksetzen',
        fullscreen: 'Vollbild',
      },
      environment: {
        label: '3D-Umgebung',
        options: {
          soloporta: 'Klassische Ansicht',
          classichd: 'Klassisches Interieur (HD)',
          modernhd: 'Modernes Apartment (HD)',
        },
      },
      moveLabel: 'Flügel verschieben',
      moveLeftAria: 'Flügel nach links verschieben',
      moveRightAria: 'Flügel nach rechts verschieben',
      assetWarning: {
        title: 'Warnung beim Laden der Assets',
        localMissing:
          'Die lokalen 3D-Modelle konnten nicht geladen werden. Lege die Dateien im Ordner <code>profili3dakina</code> ab, um die volle Darstellung zu erhalten.',
        remoteMissing:
          'Die entfernten Assets sind nicht erreichbar. Bitte Verbindung prüfen oder Remote-Laden aktivieren.',
      },
      dimensionsTemplate:
        'Flügel: {leaves} · Flügelbreite: {leafWidth} mm · Höhe: {height} mm · Gesamtbreite: {total} mm',
      trackLabel: 'Schiene: {value}',
      partInfo: {
        code: 'Code: {code}',
        dimensions: 'Abmessungen: {text}',
        pieces: 'Stückzahl: {value}',
      },
    },
    form: {
      validation: {
        selectModel: 'Wähle ein Modell',
        selectOpening: 'Wähle die Öffnungsart der Flügel',
        selectTipologia: 'Wähle die Typologie',
        selectFixed: 'Gib an, ob ein festes Feld benötigt wird',
        selectFixedPlacement: 'Gib die Position der festen Felder an',
        default: 'Bitte das Pflichtfeld ausfüllen.',
        selectFixedProfile: 'Bitte die Länge des oberen Profils auswählen.',
        selectHidden: 'Bitte angeben, ob die Flügel hinter der Wand verschwinden sollen.',
        selectDoorBox: 'Bitte angeben, ob der Door Box hinzugefügt werden soll.',
        selectDoorBoxSide: 'Bitte die Montage-Seite der Door Box wählen.',
        selectTrack: 'Bitte die Schienenart wählen.',
        selectDecorative: 'Bitte angeben, ob die Dekorleiste gewünscht ist.',
      },
      dimensions: {
        title: 'Öffnungsmaße',
        width: 'Öffnungsbreite (mm)',
        height: 'Öffnungshöhe (mm)',
      },
      placeholders: {
        widthExample: 'z. B. 800 mm',
      },
      model: {
        title: 'Modell wählen',
        options: {
          TRASCINAMENTO: 'TRASCINAMENTO',
          INDIPENDENTE: 'INDIPENDENTE',
          MAGNETICA: 'MAGNETICA',
          SINGOLA: 'SINGOLA',
          SOLO_PANNELLO: 'SOLO PANNELLO FISSO',
          SOLO_ANTA: 'SOLO ANTA',
        },
      },
      soloPanel: {
        title: 'Konfiguration nur festes Feld',
        count: 'Anzahl fester Felder',
        widthLabel: 'Feldbreite {index} (mm)',
        heightLabel: 'Feldhöhe {index} (mm)',
      },
      soloLeaf: {
        title: 'Konfiguration nur Flügel',
        count: 'Anzahl Flügel',
        widthLabel: 'Flügelbreite {index} (mm)',
        heightLabel: 'Flügelhöhe {index} (mm)',
      },
      numeroAnte: {
        title: 'Anzahl der Flügel wählen',
        label: 'Anzahl der Flügel',
        singular: 'Flügel',
        plural: 'Flügel',
        optionLabel: '{value} {label}',
      },
      aperturaAnte: {
        title: 'Öffnungsart wählen',
        options: {
          Normale: 'Einseitig',
          'Destra Sinistra': 'Links · Rechts',
        },
      },
      tipologia: {
        title: 'Typologie wählen',
        options: {
          '1': '1',
          '1+1': '1 + 1',
        },
      },
      pannelloFisso: {
        title: 'Festes Feld hinzufügen?',
        quantity: 'Anzahl fester Felder',
        sameTracks: 'Befinden sich die festen Felder auf denselben Schienen wie die Schiebetüren?',
        widthQuestion: 'Wie soll die Breite des festen Feldes festgelegt werden?',
        widthOptions: {
          manuale: 'Breite manuell angeben',
          uguale_anta: 'Wie die Schiebetüren',
        },
        widthInput: 'Breite des festen Feldes (in mm) eingeben',
      },
      profiloSuperioreFissi: {
        title: 'Länge des oberen Profils für feste Felder wählen',
        options: {
          'Quanto i fissi': 'So lang wie die festen Felder',
          'Quanto tutto il binario': 'So lang wie die gesamte Schiene',
        },
      },
      anteNascoste: {
        title: 'Sollen die Flügel hinter der Wand verschwinden?',
        options: {
          Si: 'Ja',
          No: 'Nein',
        },
      },
      doorBox: {
        title: 'Door Box hinzufügen?',
        mount: 'Door-Box-Montage',
        options: {
          Si: 'Ja',
          No: 'Nein',
        },
        sides: {
          Destra: 'Rechts',
          Sinistra: 'Links',
        },
      },
      binario: {
        title: 'Schiene wählen',
        options: {
          'A vista': 'Sichtbar',
          Nascosto: 'Verdeckt im Trockenbau',
        },
      },
      montaggio: {
        title: 'Montage wählen',
        placeholder: '-- Option wählen --',
        options: {
          'A soffitto': 'Decke',
          Parete: 'Wand',
        },
      },
      lunghezzaBinario: {
        title: 'Schienenlänge wählen',
        helper: 'Bitte zuerst die vorherigen Felder ausfüllen, um verfügbare Längen anzuzeigen.',
        optionLabel: '{value} Meter',
        label: 'Schienenlänge:',
      },
      traversino: {
        title: 'Dekoratives Klebeband hinzufügen?',
        quantity: 'Meteranzahl',
        options: {
          Si: 'Ja',
          No: 'Nein',
        },
      },
      optionalMagnetica: {
        title: 'Optionales Zubehör für Modell Magnetica',
      },
      optionalGenerali: {
        title: 'Optionales Zubehör',
        selectAll: 'Alle auswählen',
      },
      maniglie: {
        title: 'Griffe und Griffmulden',
        quantityLabel: 'Menge',
      },
      kit: {
        title: 'Profilbearbeitungs-Kits',
        note: 'Nur bei der ersten Bestellung erforderlich',
      },
      summaryStep: {
        title: 'Abschließende Zusammenfassung',
        description: 'Überprüfe deine Auswahl und speichere das detaillierte PDF-Angebot inklusive Zubehör und Bearbeitungen.',
        disclaimerBold: '* Glass Com übernimmt keine Haftung für Berechnungsfehler und die Nutzung des Tools.',
        disclaimer: 'Bitte nutze die verfügbaren Kataloge, Preislisten und technischen Datenblätter.',
      },
    },
    summary: {
      quoteEyebrow: 'Angebotsübersicht',
      quoteTitle: 'Konfigurationssumme',
      configTitle: 'Konfigurationsdaten',
      itemsTitle: 'Positionen',
      cutsEyebrow: 'Profilzuschnitte',
      cutsTitle: 'Zuschnittberechnung',
      emptyCuts: 'Für diese Konfiguration sind keine Zuschnitte verfügbar.',
      tableHeaders: {
        element: 'Element',
        quantity: 'Menge',
        length: 'Länge (mm)',
      },
      totalSuffix: '+ MwSt. und Transportkosten',
      labels: {
        modello: 'Modell',
        ambientazione: '3D-Umgebung',
        tipologia: 'Typologie',
        numeroAnte: 'Anzahl Flügel',
        numeroBinari: 'Anzahl Schienen',
        apertura: 'Öffnung',
        montaggio: 'Montage',
        doorBox: 'Door Box',
        binario: 'Schiene',
        lunghezzaBinario: 'Schienenlänge',
        traversino: 'Dekorleiste',
        finitura: 'Oberfläche',
        spessoreVetro: 'Empfohlene Glasstärke',
        dimensioniVano: 'Öffnungsmaß',
      },
      defaults: {
        finitura: 'Schwarz',
        spessoreVetro: '4+4 mm',
        doorBoxNo: 'Nein',
        doorBoxYes: 'Ja',
      },
    },
    totals: {
      totalLabel: 'Gesamtsumme',
      totalFormatted: '{value} + MwSt. und Transportkosten',
    },
    buttons: {
      prev: 'Zurück',
      next: 'Weiter',
      openSummary: 'Komplette Übersicht anzeigen',
      savePdf: 'Als PDF speichern',
    },
    pdf: {
      title: 'Akina Türangebot',
      summaryTitle: 'Konfigurationsübersicht',
      quoteTitle: 'Kalkulationsdetails',
      cutsTitle: 'Zuschnittberechnung',
      tableHeaders: {
        description: 'Beschreibung',
        code: 'Code',
        quantity: 'Menge',
        unit: 'Preis',
        total: 'Summe',
      },
      disclaimer:
        'Glass Com übernimmt keine Haftung für Fehler in den Berechnungen oder bei der Nutzung des Tools. Bitte immer aktuelle Kataloge, Preislisten und technischen Datenblätter verwenden.',
      totalLabel: 'Gesamtsumme',
      summaryLabels: {
        label: '{label}',
        value: '{value}',
      },
    },
    alerts: {
      popupBlocked: 'Die vollständige Übersicht konnte nicht geöffnet werden. Bitte Pop-ups im Browser zulassen.',
      modelMissing: 'Bitte ein Modell auswählen.',
      pdfUnavailable: 'PDF kann in dieser Umgebung nicht erstellt werden.',
    },
    quote: {
      itemText: '{description} (Code: {code}, Menge: {quantity}, Einzelpreis: {unit}, Summe: {total})',
      noSummary: 'Keine Daten verfügbar',
    },
    cuts: {
      panelEqual: 'Wie die Flügel ({value} mm)',
      rows: {
        binariInizialiFinali: 'Anfangs- und Endschienen',
        binariCentrali: 'Zwischenschienen',
        anteLarghezza: 'Schiebetürflügel – Breite',
        anteAltezza: 'Schiebetürflügel – Höhe',
        profiliOrizzontali: 'Horizontale Flügelprofile',
        profiliVerticali: 'Vertikale Flügelprofile',
        coverSenzaSpazzolino: 'Vertikalabdeckungen ohne Bürste',
        coverConSpazzolino: 'Vertikalabdeckungen mit Bürste',
        vetriAnte: 'Gläser Schiebetürflügel',
        pannelliFissi: 'Feste Paneele',
        vetriPannelliFissi: 'Gläser feste Paneele',
        profiloSuperioreFissi: 'Oberes Profil feste Paneele',
        ingombroProfili: 'Aufbau Laufprofile',
        ingombroTotale: 'Gesamtaufbau Profile + Abdeckungen',
        traversino: 'Dekorative Klebeleiste',
        montantiVerticali: 'Vertikale Pfosten Zuschnitt',
        traversiOrizzontali: 'Horizontale Traverse',
        vetriAnteGenerici: 'Gläser / Paneele Flügel',
        binarioSuperiore: 'Obere Schiene',
        guidaInferiore: 'Bodenführung',
        doorBox: 'Door Box',
      },
    },
    fullSummary: {
      title: 'Komplette Akina-Angebotsübersicht',
      eyebrow: 'Akina Konfigurator',
      generatedAt: 'Erstellt am {value}',
      configTitle: 'Konfigurator-Auswahl',
      quoteTitle: 'Kalkulationsdetails',
      cutsTitle: 'Zuschnittberechnung',
      totalLabel: 'Gesamtsumme',
      totalSuffix: '+ MwSt. und Versand',
      print: 'Drucken',
      snapshotTitle: 'Konfigurationsvorschau',
      snapshotAlt: '3D-Vorschau der konfigurierten Tür',
      emptySummary: 'Keine Informationen verfügbar.',
      emptyQuote: 'Keine Angebotspositionen verfügbar.',
      emptyCuts: 'Für diese Konfiguration sind keine Zuschnitte verfügbar.',
      itemLabels: {
        code: 'Artikelcode',
        quantity: 'Menge',
        unitPrice: 'Einzelpreis',
        total: 'Gesamt',
      },
      cutsHeaders: {
        element: 'Element',
        quantity: 'Menge',
        length: 'Länge (mm)',
      },
    },
    misc: {
      documentTitle: 'Akina Türkonfigurator',
      meters: '{value} m',
      mmPair: '{width} × {height} mm',
      yes: 'Ja',
      no: 'Nein',
      none: '—',
      environment: {
        soloporta: 'Klassische Ansicht',
        classichd: 'Klassisches Interieur (HD)',
        modernhd: 'Modernes Apartment (HD)',
      },
      doorBoxSides: { Destra: 'Rechts', Sinistra: 'Links' },
      mountings: { 'A soffitto': 'Decke', Parete: 'Wand' },
    },
    quoteCategories: {
      binari: 'Schienen mit Cover',
      cover: 'Montageabdeckung',
      scorrimento: 'Laufwagen und Mechanik',
      fissi: 'Schienen, Zubehör und Rahmen für feste Felder',
      doorBox: 'Door Box',
      maniglie: 'Griffe und Griffmulden',
      kit: 'Profilbearbeitungs-Kits',
      traversino: 'Dekorative Klebeleiste',
    },
    accessories: {
      labels: {
        code: 'Code: {code}',
        price: 'Preis: {price}',
      },
      defaults: {
        fallbackName: 'Artikel',
      },
      items: {
        'MAG-AC-ELB': { name: 'Elektroschloss' },
        'MAG-AC-TC1': { name: 'Handsender' },
        'MAG-AC-TC2': { name: 'Smart-Handsender' },
        'MAG-AC-TC3': { name: 'Smart-Handsender mit Magnethalter' },
        'MAG-AC-TNT': { name: 'Tastatur mit Fingerprint- & RFID-Leser' },
        'MAG-AC-CAV': { name: '4-adriges Anschlusskabel' },
        'MAG-AC-MTS': { name: 'Mini-Oberflächensensor' },
        'MAG-AC-CSB': { name: 'Clean Switch schwarz' },
        'MAG-AC-CSW': { name: 'Clean Switch weiß' },
        'MAG-AC-SBH': { name: 'Clean Switch Halter quadratisch' },
        'MAG-AC-SBW': { name: 'Clean Switch Halter rechteckig' },
        'MAG-AC-SYN': { name: 'Synchronisationskabel für Flügel' },
        'UNK-KIT1S-K1A': { name: 'Kit schmaler Flügel (+100 € pro Flügel)' },
        'UNK-PTO': { name: 'Push to Open mit Soft Close' },
        'UNK-CAM-L1500': { name: 'Synchronisationsriemen für große Flügel' },
        MAQ1015: { name: 'Gerade Selbstklebegriffe 10 × 160 mm (Paar)' },
        'UNK-NTI NO': { name: 'Selbstklebende runde Griffmulden Ø 110 mm (Paar)' },
        'UNK-MRC200.33 NO': { name: 'C-Griffpaar 200 × 33 mm' },
        'UNK-MRC206.33 NO': { name: 'C-Griffpaar 206 × 33 mm' },
        'UNK-KSM NO': { name: 'Magnetisches Schlosskit für Schiebetür' },
        'NRCI50.220': { name: 'Selbstklebende Griffmulden 50 × 110 mm (Paar)' },
        'NRCI45.220 NO': { name: 'Selbstklebende Griffmulden 45 × 220 mm (Paar)' },
        'UNK-PFT': { name: 'Bohrer für Türrahmen' },
        'UNK-PSC': { name: 'Zange zum Gurtspannen' },
        'UNK-PVT': { name: 'Verlängerung zur Schraubbefestigung am Rahmen' },
        'UNK-DDC': { name: 'Schablone zur Gurtauslegung' },
        'UNK-DFT': { name: 'Bohrschablone für Rahmenprofile' },
        'UNK-GS1-L20': { name: 'Hauptschiene 2 m' },
        'UNK-GS1-L30': { name: 'Hauptschiene 3 m' },
        'UNK-GS1-L40': { name: 'Hauptschiene 4 m' },
        'UNK-GS1-L60': { name: 'Hauptschiene 6 m' },
        'UNK-GS2-L20': { name: 'Zusatzschiene 2 m' },
        'UNK-GS2-L30': { name: 'Zusatzschiene 3 m' },
        'UNK-GS2-L40': { name: 'Zusatzschiene 4 m' },
        'UNK-GS2-L60': { name: 'Zusatzschiene 6 m' },
        'UNK-GP1-L25': { name: 'Wandschienen-Kit 2,5 m' },
        'UNK-GP1-L40': { name: 'Wandschienen-Kit 4 m' },
        'M100-P40-L20': { name: 'Sichtbare Magnetschiene 2 m (pro Flügel)' },
        'M100-P40-L27': { name: 'Sichtbare Magnetschiene 2,7 m (pro Flügel)' },
        'M100-P40-L34': { name: 'Sichtbare Magnetschiene 3,4 m (pro Flügel)' },
        'M100-CS55-L21': { name: 'Verdeckte Magnetschiene 2,1 m (pro Flügel)' },
        'M100-CS55-L28': { name: 'Verdeckte Magnetschiene 2,8 m (pro Flügel)' },
        'UNK-CCS-L30 NO': { name: 'Montageabdeckung' },
        'M100-CF-L20': { name: 'Frontabdeckung 2 m' },
        'M100-CS-L20': { name: 'Deckabdeckung 2 m' },
        'M100-PM-L20': { name: 'Montageprofil 2 m' },
        'M100-CF-L27': { name: 'Frontabdeckung 2,7 m' },
        'M100-CS-L27': { name: 'Deckabdeckung 2,7 m' },
        'M100-PM-L27': { name: 'Montageprofil 2,7 m' },
        'UNK-PF-K1A': { name: 'Zubehörkit für Festfeld' },
        'UNK-TK3-L30 NO': { name: 'Rahmen für Festfeld' },
        'UNK-TK1-L30': { name: 'Rahmen für Schiebetürflügel' },
        'UNK-TK2-L30': { name: 'Rahmen für mittleren Flügel' },
        'UNK-TK3-L30': { name: 'Rahmen für Einzelflügel' },
        'UNK-DBDX-K1A': { name: 'Door Box rechts' },
        'UNK-BDSX-K1A': { name: 'Door Box links' },
        DEP01: { name: 'Dekoratives Klebeband (m)' },
      },
    },
  },
  zh: {
    language: {
      switchAria: '语言',
      names: {
        it: '意大利语',
        en: '英语',
        de: '德语',
        zh: '中文',
      },
    },
    header: {
      eyebrow: 'Akina 门报价器',
      title: '配置、预览并获取报价',
      progressAria: '配置器进度',
    },
    steps: ['尺寸与型号', '结构', '面板与型材', '滑动系统', '配件', '汇总'],
    navigation: {
      ariaLabel: '应用导航',
      viewer: '3D 视图',
      configurator: '配置器',
      summary: '汇总',
    },
    viewer: {
      loadingTitle: '正在加载 3D 模型…',
      controlsAria: '3D 预览控制',
      ariaLabel: '参数化 3D 预览',
      partButtons: {
        top: '上框',
        bottom: '下框',
        left: '左侧立柱',
        right: '右侧立柱',
        track: '轨道',
        cover: '遮板',
      },
      buttons: {
        resetHighlight: '重置高亮',
        resetCamera: '重置相机',
        fullscreen: '全屏',
      },
      environment: {
        label: '3D 场景',
        options: {
          soloporta: '经典视图',
          classichd: '经典室内（高清）',
          modernhd: '现代公寓（高清）',
        },
      },
      moveLabel: '移动门扇',
      moveLeftAria: '向左移动门扇',
      moveRightAria: '向右移动门扇',
      assetWarning: {
        title: '资源加载警告',
        localMissing:
          '无法加载本地 3D 模型。请将文件放入 <code>profili3dakina</code> 文件夹以获得完整效果。',
        remoteMissing:
          '无法访问远程资源。请检查网络或启用远程加载。',
      },
      dimensionsTemplate:
        '门扇: {leaves} · 门扇宽度: {leafWidth} 毫米 · 高度: {height} 毫米 · 总宽度: {total} 毫米',
      trackLabel: '轨道: {value}',
      partInfo: {
        code: '编码: {code}',
        dimensions: '尺寸: {text}',
        pieces: '数量: {value}',
      },
    },
    form: {
      validation: {
        selectModel: '请选择型号',
        selectOpening: '请选择门扇开启方式',
        selectTipologia: '请选择类型',
        selectFixed: '请说明是否需要固定面板',
        selectFixedPlacement: '请说明固定面板的位置',
        default: '请填写必填字段。',
        selectFixedProfile: '请选择固定面板上框长度。',
        selectHidden: '请选择门扇是否隐藏在墙后。',
        selectDoorBox: '请选择是否添加 Door Box。',
        selectDoorBoxSide: '请选择 Door Box 的安装方向。',
        selectTrack: '请选择轨道类型。',
        selectDecorative: '请选择是否添加装饰贴条。',
      },
      dimensions: {
        title: '洞口尺寸',
        width: '洞口宽度 (毫米)',
        height: '洞口高度 (毫米)',
      },
      placeholders: {
        widthExample: '例如 800 mm',
      },
      model: {
        title: '选择型号',
        options: {
          TRASCINAMENTO: 'TRASCINAMENTO',
          INDIPENDENTE: 'INDIPENDENTE',
          MAGNETICA: 'MAGNETICA',
          SINGOLA: 'SINGOLA',
          SOLO_PANNELLO: 'SOLO PANNELLO FISSO',
          SOLO_ANTA: 'SOLO ANTA',
        },
      },
      soloPanel: {
        title: '仅固定面板配置',
        count: '固定面板数量',
        widthLabel: '固定面板宽度 {index} (毫米)',
        heightLabel: '固定面板高度 {index} (毫米)',
      },
      soloLeaf: {
        title: '仅门扇配置',
        count: '门扇数量',
        widthLabel: '门扇宽度 {index} (毫米)',
        heightLabel: '门扇高度 {index} (毫米)',
      },
      numeroAnte: {
        title: '选择门扇数量',
        label: '门扇数量',
        singular: '扇门',
        plural: '扇门',
        optionLabel: '{value} {label}',
      },
      aperturaAnte: {
        title: '选择门扇开启方式',
        options: {
          Normale: '单侧开启',
          'Destra Sinistra': '左右对开',
        },
      },
      tipologia: {
        title: '选择类型',
        options: {
          '1': '1',
          '1+1': '1 + 1',
        },
      },
      pannelloFisso: {
        title: '是否需要固定面板？',
        quantity: '固定面板数量',
        sameTracks: '固定面板是否与滑动门使用同一轨道？',
        widthQuestion: '如何设定固定面板的宽度？',
        widthOptions: {
          manuale: '手动输入宽度',
          uguale_anta: '与滑动门相同',
        },
        widthInput: '输入固定面板宽度 (毫米)',
      },
      profiloSuperioreFissi: {
        title: '选择固定面板上框长度',
        options: {
          'Quanto i fissi': '与固定面板等长',
          'Quanto tutto il binario': '与整条轨道等长',
        },
      },
      anteNascoste: {
        title: '门扇是否隐藏在墙后？',
        options: {
          Si: '是',
          No: '否',
        },
      },
      doorBox: {
        title: '是否添加 Door Box？',
        mount: 'Door Box 安装方向',
        options: {
          Si: '是',
          No: '否',
        },
        sides: {
          Destra: '右侧',
          Sinistra: '左侧',
        },
      },
      binario: {
        title: '选择轨道',
        options: {
          'A vista': '外露安装',
          Nascosto: '石膏板内隐藏',
        },
      },
      montaggio: {
        title: '选择安装方式',
        placeholder: '-- 请选择 --',
        options: {
          'A soffitto': '顶装',
          Parete: '墙装',
        },
      },
      lunghezzaBinario: {
        title: '选择轨道长度',
        helper: '请先完成上方字段以显示可选长度。',
        optionLabel: '{value} 米',
        label: '轨道长度：',
      },
      traversino: {
        title: '添加装饰贴条？',
        quantity: '米数',
        options: {
          Si: '是',
          No: '否',
        },
      },
      optionalMagnetica: {
        title: 'Magnetica 型号可选配件',
      },
      optionalGenerali: {
        title: '通用可选配件',
        selectAll: '全选',
      },
      maniglie: {
        title: '把手与拉手',
        quantityLabel: '数量',
      },
      kit: {
        title: '型材加工工具包',
        note: '仅首单需要购买',
      },
      summaryStep: {
        title: '最终汇总',
        description: '确认您的选择，并将包含配件与加工详情的 PDF 报价保存下来。',
        disclaimerBold: '＊Glass Com 对计算及工具使用中的错误不承担任何责任。',
        disclaimer: '请务必参考提供的目录、价目表与技术资料。',
      },
    },
    summary: {
      quoteEyebrow: '报价汇总',
      quoteTitle: '配置总计',
      configTitle: '配置信息',
      itemsTitle: '详细条目',
      cutsEyebrow: '型材切割',
      cutsTitle: '切割计算',
      emptyCuts: '当前配置没有切割数据。',
      tableHeaders: {
        element: '部件',
        quantity: '数量',
        length: '长度 (毫米)',
      },
      totalSuffix: '+ 含增值税及运输费用',
      labels: {
        modello: '型号',
        ambientazione: '3D 场景',
        tipologia: '类型',
        numeroAnte: '门扇数量',
        numeroBinari: '轨道数量',
        apertura: '开启方式',
        montaggio: '安装方式',
        doorBox: 'Door Box',
        binario: '轨道',
        lunghezzaBinario: '轨道长度',
        traversino: '装饰贴条',
        finitura: '表面处理',
        spessoreVetro: '推荐玻璃厚度',
        dimensioniVano: '洞口尺寸',
      },
      defaults: {
        finitura: '黑色',
        spessoreVetro: '4+4 毫米',
        doorBoxNo: '否',
        doorBoxYes: '是',
      },
    },
    totals: {
      totalLabel: '总计',
      totalFormatted: '{value} + 含增值税及运输费用',
    },
    buttons: {
      prev: '上一步',
      next: '下一步',
      openSummary: '查看完整汇总',
      savePdf: '保存为 PDF',
    },
    pdf: {
      title: 'Akina 门报价',
      summaryTitle: '配置汇总',
      quoteTitle: '费用明细',
      cutsTitle: '切割计算',
      tableHeaders: {
        description: '描述',
        code: '编码',
        quantity: '数量',
        unit: '单价',
        total: '小计',
      },
      disclaimer:
        'Glass Com 对计算及工具使用中的错误不承担责任。请始终参考最新的目录、价目表和技术资料。',
      totalLabel: '总计',
      summaryLabels: {
        label: '{label}',
        value: '{value}',
      },
    },
    alerts: {
      popupBlocked: '无法打开完整汇总。请允许浏览器弹出窗口。',
      modelMissing: '请选择一个型号继续。',
      pdfUnavailable: '当前环境无法生成 PDF。',
    },
    quote: {
      itemText: '{description} (编码: {code}, 数量: {quantity}, 单价: {unit}, 小计: {total})',
      noSummary: '暂无数据',
    },
    cuts: {
      panelEqual: '与门扇相同 ({value} 毫米)',
      rows: {
        binariInizialiFinali: '首末轨道',
        binariCentrali: '中间轨道',
        anteLarghezza: '滑动门扇宽度',
        anteAltezza: '滑动门扇高度',
        profiliOrizzontali: '门扇横向型材',
        profiliVerticali: '门扇竖向型材',
        coverSenzaSpazzolino: '竖向遮板（无毛刷）',
        coverConSpazzolino: '竖向遮板（带毛刷）',
        vetriAnte: '滑动门扇玻璃',
        pannelliFissi: '固定面板',
        vetriPannelliFissi: '固定面板玻璃',
        profiloSuperioreFissi: '固定面板上框',
        ingombroProfili: '滑动五金占用',
        ingombroTotale: '型材 + 遮板总占用',
        traversino: '装饰贴条',
        montantiVerticali: '门扇竖框切割',
        traversiOrizzontali: '门扇横梁切割',
        vetriAnteGenerici: '门扇玻璃 / 面板',
        binarioSuperiore: '上轨道',
        guidaInferiore: '下导向',
        doorBox: 'Door Box',
      },
    },
    fullSummary: {
      title: 'Akina 报价完整汇总',
      eyebrow: 'Akina 配置器',
      generatedAt: '生成时间 {value}',
      configTitle: '配置选择',
      quoteTitle: '费用明细',
      cutsTitle: '切割计算',
      totalLabel: '总计',
      totalSuffix: '+ 含增值税及运输费用',
      print: '打印',
      snapshotTitle: '配置预览',
      snapshotAlt: '配置门的 3D 预览图',
      emptySummary: '暂无信息。',
      emptyQuote: '暂无报价条目。',
      emptyCuts: '当前配置没有切割数据。',
      itemLabels: {
        code: '产品编码',
        quantity: '数量',
        unitPrice: '单价',
        total: '合计',
      },
      cutsHeaders: {
        element: '部件',
        quantity: '数量',
        length: '长度 (毫米)',
      },
    },
    misc: {
      documentTitle: 'Akina 门报价器',
      meters: '{value} 米',
      mmPair: '{width} × {height} 毫米',
      yes: '是',
      no: '否',
      none: '—',
      environment: {
        soloporta: '经典视图',
        classichd: '经典室内（高清）',
        modernhd: '现代公寓（高清）',
      },
      doorBoxSides: { Destra: '右侧', Sinistra: '左侧' },
      mountings: { 'A soffitto': '吊顶安装', Parete: '墙面安装' },
    },
    quoteCategories: {
      binari: '带遮板的轨道',
      cover: '安装遮板',
      scorrimento: '滑轮与滑动机构',
      fissi: '固定面板的轨道、配件与框体',
      doorBox: 'Door Box',
      maniglie: '把手与拉手',
      kit: '型材加工工具包',
      traversino: '装饰贴条',
    },
    accessories: {
      labels: {
        code: '编码: {code}',
        price: '价格: {price}',
      },
      defaults: {
        fallbackName: '配件',
      },
      items: {
        'MAG-AC-ELB': { name: '电控锁' },
        'MAG-AC-TC1': { name: '遥控器' },
        'MAG-AC-TC2': { name: '智能遥控器' },
        'MAG-AC-TC3': { name: '智能遥控器（含磁吸支架）' },
        'MAG-AC-TNT': { name: '指纹+门禁密码键盘' },
        'MAG-AC-CAV': { name: '4芯连接线' },
        'MAG-AC-MTS': { name: '顶部微型传感器' },
        'MAG-AC-CSB': { name: 'Clean Switch 黑色' },
        'MAG-AC-CSW': { name: 'Clean Switch 白色' },
        'MAG-AC-SBH': { name: 'Clean Switch 方形支架' },
        'MAG-AC-SBW': { name: 'Clean Switch 长方形支架' },
        'MAG-AC-SYN': { name: '门扇同步连接线' },
        'UNK-KIT1S-K1A': { name: '窄门扇套件（每扇 +€100）' },
        'UNK-PTO': { name: '推开助力含缓冲' },
        'UNK-CAM-L1500': { name: '加大门扇同步皮带' },
        MAQ1015: { name: '自粘直柄对 10 × 160 mm' },
        'UNK-NTI NO': { name: '自粘圆形内拉手对 Ø 110 mm' },
        'UNK-MRC200.33 NO': { name: 'C 型拉手对 200 × 33 mm' },
        'UNK-MRC206.33 NO': { name: 'C 型拉手对 206 × 33 mm' },
        'UNK-KSM NO': { name: '滑门磁力锁套件' },
        'NRCI50.220': { name: '自粘内拉手对 50 × 110 mm' },
        'NRCI45.220 NO': { name: '自粘内拉手对 45 × 220 mm' },
        'UNK-PFT': { name: '门框钻孔钻头' },
        'UNK-PSC': { name: '皮带夹钳' },
        'UNK-PVT': { name: '门框螺钉延长件' },
        'UNK-DDC': { name: '皮带定位模板' },
        'UNK-DFT': { name: '门框型材钻孔模板' },
        'UNK-GS1-L20': { name: '主轨道 2 米' },
        'UNK-GS1-L30': { name: '主轨道 3 米' },
        'UNK-GS1-L40': { name: '主轨道 4 米' },
        'UNK-GS1-L60': { name: '主轨道 6 米' },
        'UNK-GS2-L20': { name: '附加轨道 2 米' },
        'UNK-GS2-L30': { name: '附加轨道 3 米' },
        'UNK-GS2-L40': { name: '附加轨道 4 米' },
        'UNK-GS2-L60': { name: '附加轨道 6 米' },
        'UNK-GP1-L25': { name: '墙装轨道套件 2.5 米' },
        'UNK-GP1-L40': { name: '墙装轨道套件 4 米' },
        'M100-P40-L20': { name: '外露磁力轨道 2 米（每扇）' },
        'M100-P40-L27': { name: '外露磁力轨道 2.7 米（每扇）' },
        'M100-P40-L34': { name: '外露磁力轨道 3.4 米（每扇）' },
        'M100-CS55-L21': { name: '隐藏磁力轨道 2.1 米（每扇）' },
        'M100-CS55-L28': { name: '隐藏磁力轨道 2.8 米（每扇）' },
        'UNK-CCS-L30 NO': { name: '安装遮板' },
        'M100-CF-L20': { name: '正面遮板 2 米' },
        'M100-CS-L20': { name: '上方遮板 2 米' },
        'M100-PM-L20': { name: '安装型材 2 米' },
        'M100-CF-L27': { name: '正面遮板 2.7 米' },
        'M100-CS-L27': { name: '上方遮板 2.7 米' },
        'M100-PM-L27': { name: '安装型材 2.7 米' },
        'UNK-PF-K1A': { name: '固定面板配件套件' },
        'UNK-TK3-L30 NO': { name: '固定面板框体' },
        'UNK-TK1-L30': { name: '滑动门扇框体' },
        'UNK-TK2-L30': { name: '中间门扇框体' },
        'UNK-TK3-L30': { name: '单扇框体' },
        'UNK-DBDX-K1A': { name: 'Door Box 右侧' },
        'UNK-BDSX-K1A': { name: 'Door Box 左侧' },
        DEP01: { name: '装饰贴条 (米)' },
      },
    },
  },
};

let currentLanguage = 'it';

function getTranslationValue(lang, path) {
  const root = TRANSLATIONS[lang];
  if (!root) return undefined;
  return path.split('.').reduce((acc, segment) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, segment)) {
      return acc[segment];
    }
    return undefined;
  }, root);
}

function translationExists(path) {
  return getTranslationValue(currentLanguage, path) !== undefined || getTranslationValue('it', path) !== undefined;
}

function formatTemplate(template, replacements = {}) {
  if (typeof template !== 'string') return template;
  return template.replace(/\{(\w+)\}/g, (match, token) => {
    if (Object.prototype.hasOwnProperty.call(replacements, token)) {
      const value = replacements[token];
      return value === undefined || value === null ? '' : String(value);
    }
    return match;
  });
}

function t(path, replacements) {
  const value = getTranslationValue(currentLanguage, path);
  if (value !== undefined) {
    return typeof value === 'string' ? formatTemplate(value, replacements) : value;
  }
  const fallback = getTranslationValue('it', path);
  if (fallback !== undefined) {
    return typeof fallback === 'string' ? formatTemplate(fallback, replacements) : fallback;
  }
  return typeof path === 'string' ? formatTemplate(path, replacements) : path;
}

function tArray(path) {
  const value = t(path);
  return Array.isArray(value) ? value : [];
}

function resolveMessage(message, replacements) {
  if (!message) return '';
  if (typeof message === 'string' && translationExists(message)) {
    return t(message, replacements);
  }
  return formatTemplate(message, replacements);
}

function getModelLabel(model) {
  if (!model) return t('misc.none');
  const config = MODEL_CONFIG[model];
  if (config?.labelKey) {
    return t(config.labelKey);
  }
  return config?.label ?? model;
}

function getEnvironmentLabel(value) {
  if (!value) return t('misc.none');
  const config = ENVIRONMENT_CONFIG[value];
  if (config?.labelKey) {
    return t(config.labelKey);
  }
  return config?.label ?? value;
}

function getBinarioLabel(value) {
  if (!value) return t('misc.none');
  const config = BINARIO_CONFIG[value];
  if (config?.labelKey) {
    return t(config.labelKey);
  }
  return config?.label ?? value;
}

function resolveAccessoryName(code, fallback) {
  if (!code) {
    return fallback || t('accessories.defaults.fallbackName');
  }
  const key = `accessories.items.${code}.name`;
  const translation = getTranslationValue(currentLanguage, key);
  if (typeof translation === 'string') {
    return translation;
  }
  const fallbackTranslation = getTranslationValue('it', key);
  if (typeof fallbackTranslation === 'string') {
    return fallbackTranslation;
  }
  return fallback || t('accessories.defaults.fallbackName');
}

function applyAccessoryTranslations() {
  const cards = document.querySelectorAll('.accessory-card');
  cards.forEach((card) => {
    const checkbox = card.querySelector('input[type="checkbox"]');
    const quantityInput = card.querySelector('input[type="number"]');
    const code = checkbox?.value || quantityInput?.name?.replace(/.*\[(.*)\]/, '$1') || '';
    const fallbackName = checkbox?.dataset.name || quantityInput?.dataset.name || code;
    const nameKey = checkbox?.dataset.i18nName || quantityInput?.dataset.i18nName;
    const name = nameKey ? t(nameKey) : resolveAccessoryName(code, fallbackName);
    const priceValue = Number(checkbox?.dataset.price || quantityInput?.dataset.price || 0);

    const nameNode = card.querySelector('.accessory-card__name');
    if (nameNode) {
      nameNode.textContent = name;
    }

    const codeNode = card.querySelector('.accessory-card__code');
    if (codeNode && code) {
      codeNode.textContent = t('accessories.labels.code', { code });
    }

    const priceNode = card.querySelector('.accessory-card__price');
    if (priceNode) {
      priceNode.textContent = t('accessories.labels.price', { price: formatCurrency(priceValue) });
    }

    const quantityLabel = card.querySelector('.accessory-card__quantity span');
    if (quantityLabel) {
      quantityLabel.textContent = t('form.maniglie.quantityLabel');
    }
  });
}

function updateDocumentLanguageAttributes() {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('lang', currentLanguage);
  document.title = t('misc.documentTitle');
}

function updateLanguageSwitchUI() {
  if (!selectors.languageButtons) return;
  selectors.languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === currentLanguage;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function applyTranslationsToDom() {
  if (typeof document === 'undefined') return;
  updateDocumentLanguageAttributes();

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.getAttribute('data-i18n');
    if (!key) return;
    const value = t(key);
    if (node.dataset.i18nHtml === 'true') {
      node.innerHTML = value;
    } else {
      node.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-attr]').forEach((node) => {
    const descriptor = node.getAttribute('data-i18n-attr');
    if (!descriptor) return;
    descriptor
      .split(/\s+/)
      .map((entry) => entry.trim())
      .filter(Boolean)
      .forEach((entry) => {
        const [attr, key] = entry.split(':');
        if (attr && key) {
          node.setAttribute(attr, t(key));
        }
      });
  });

  applyAccessoryTranslations();
  updateLanguageSwitchUI();
  updateThemeToggleLabel();
  updateTrackLengthOptions({ preserveSelection: true });
  if (selectors.modelInput) {
    updateNumeroAnteOptions(selectors.modelInput.value || 'TRASCINAMENTO', { preserveSelection: true });
  }
}

function setLanguage(lang) {
  const targetLang = SUPPORTED_LANGUAGES.includes(lang) ? lang : 'it';
  const changed = currentLanguage !== targetLang;
  currentLanguage = targetLang;
  applyTranslationsToDom();
  if (changed) {
    refreshOutputs({ force: true });
  }
}

function initializeLanguageSwitcher() {
  if (!selectors.languageButtons) return;
  selectors.languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const { lang } = button.dataset;
      if (lang) {
        setLanguage(lang);
      }
    });
  });
  applyTranslationsToDom();
}

function getCurrentLocale() {
  switch (currentLanguage) {
    case 'en':
      return 'en-GB';
    case 'de':
      return 'de-DE';
    case 'zh':
      return 'zh-CN';
    default:
      return 'it-IT';
  }
}

function formatMetersValue(value) {
  const formatter = new Intl.NumberFormat(getCurrentLocale(), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return formatter.format(value);
}

const MODEL_CONFIG = {
  TRASCINAMENTO: { labelKey: 'form.model.options.TRASCINAMENTO', defaultOpening: 'scorrevole-parete' },
  INDIPENDENTE: { labelKey: 'form.model.options.INDIPENDENTE', defaultOpening: 'scorrevole-parete' },
  MAGNETICA: { labelKey: 'form.model.options.MAGNETICA', defaultOpening: 'scorrevole-parete' },
  SINGOLA: { labelKey: 'form.model.options.SINGOLA', defaultOpening: 'battente' },
  SOLO_PANNELLO: { labelKey: 'form.model.options.SOLO_PANNELLO', defaultOpening: 'fisso' },
  SOLO_ANTA: { labelKey: 'form.model.options.SOLO_ANTA', defaultOpening: 'scorrevole-parete' },
};

const ENVIRONMENT_CONFIG = {
  soloporta: { labelKey: 'misc.environment.soloporta' },
  classichd: { labelKey: 'misc.environment.classichd' },
  modernhd: { labelKey: 'misc.environment.modernhd' },
};

const MODEL_ANTE_OPTIONS = {
  TRASCINAMENTO: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  INDIPENDENTE: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  MAGNETICA: [1, 2],
  DEFAULT: [1, 2],
};

const BINARIO_CONFIG = {
  'A vista': { labelKey: 'form.binario.options.A vista', track: 'standard' },
  Nascosto: { labelKey: 'form.binario.options.Nascosto', track: 'incasso' },
};

const TRACK_LENGTH_OPTIONS = {
  DEFAULT: [
    { code: 20, meters: 2 },
    { code: 30, meters: 3 },
    { code: 40, meters: 4 },
    { code: 60, meters: 6 },
  ],
  SINGOLA: {
    Parete: [
      { code: 25, meters: 2.5 },
      { code: 40, meters: 4 },
    ],
    'A soffitto': [
      { code: 20, meters: 2 },
      { code: 30, meters: 3 },
      { code: 40, meters: 4 },
      { code: 60, meters: 6 },
    ],
  },
  MAGNETICA: {
    'A vista': [
      { code: 20, meters: 2 },
      { code: 27, meters: 2.7 },
      { code: 34, meters: 3.4 },
    ],
    Nascosto: [
      { code: 21, meters: 2.1 },
      { code: 28, meters: 2.8 },
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

const PROCEDURAL_TEXTURE_CACHE = new Map();

function clampColor(value) {
  return Math.max(0, Math.min(255, value));
}

function addCanvasNoise(ctx, width, height, intensity = 0.05) {
  if (!ctx || intensity <= 0) return;
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 255 * intensity;
    data[i] = clampColor(data[i] + noise);
    data[i + 1] = clampColor(data[i + 1] + noise);
    data[i + 2] = clampColor(data[i + 2] + noise);
  }
  ctx.putImageData(imageData, 0, 0);
}

function generateCanvasTexture(size, painter) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  painter(ctx, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.encoding = THREE.sRGBEncoding;
  texture.needsUpdate = true;
  return texture;
}

function createParquetTexture() {
  return generateCanvasTexture(512, (ctx, size) => {
    const palette = ['#d9bea4', '#c89b6f', '#b98253', '#e3c8ae'];
    const stripeHeight = size / palette.length;
    palette.forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, index * stripeHeight, size, stripeHeight + 1);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(0, index * stripeHeight, size, 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, index * stripeHeight + stripeHeight - 2, size, 2);
    });
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    for (let x = 0; x < size; x += 32) {
      ctx.fillRect(x, 0, 2, size);
    }
    addCanvasNoise(ctx, size, size, 0.08);
  });
}

function createPlasterTexture() {
  return generateCanvasTexture(256, (ctx, size) => {
    ctx.fillStyle = '#f5f3ef';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(200, 200, 200, 0.08)';
    for (let i = 0; i < 1200; i += 1) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const alpha = 0.02 + Math.random() * 0.04;
      ctx.fillStyle = `rgba(200, 200, 200, ${alpha})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
    addCanvasNoise(ctx, size, size, 0.04);
  });
}

function createFabricTexture() {
  return generateCanvasTexture(256, (ctx, size) => {
    ctx.fillStyle = '#3b4a67';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    for (let i = 0; i < size; i += 10) {
      ctx.fillRect(0, i, size, 1);
      ctx.fillRect(i, 0, 1, size);
    }
    addCanvasNoise(ctx, size, size, 0.1);
  });
}

function createRugTexture() {
  return generateCanvasTexture(256, (ctx, size) => {
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#f8f8f6');
    gradient.addColorStop(1, '#dcd8f4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(120, 110, 190, 0.28)';
    ctx.lineWidth = 2;
    for (let i = 20; i < size; i += 36) {
      ctx.strokeRect(i, i, size - i * 2, size - i * 2);
    }
    addCanvasNoise(ctx, size, size, 0.05);
  });
}

function createArtworkTexture() {
  return generateCanvasTexture(256, (ctx, size) => {
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#8aa9ff');
    gradient.addColorStop(0.5, '#f6d365');
    gradient.addColorStop(1, '#fda085');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    ctx.arc(size * 0.68, size * 0.35, size * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(45, 62, 114, 0.22)';
    ctx.fillRect(size * 0.12, size * 0.6, size * 0.3, size * 0.18);
    addCanvasNoise(ctx, size, size, 0.04);
  });
}

function createClassicMarbleTexture() {
  return generateCanvasTexture(512, (ctx, size) => {
    ctx.fillStyle = '#f6f2eb';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 90; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const length = size * (0.4 + Math.random() * 0.35);
      const startX = Math.random() * size;
      const startY = Math.random() * size;
      ctx.strokeStyle = `rgba(170, 158, 140, ${0.08 + Math.random() * 0.08})`;
      ctx.lineWidth = 1 + Math.random() * 1.2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + Math.cos(angle) * length, startY + Math.sin(angle) * length);
      ctx.stroke();
    }
    addCanvasNoise(ctx, size, size, 0.05);
  });
}

function createClassicInlayTexture() {
  return generateCanvasTexture(256, (ctx, size) => {
    ctx.fillStyle = '#e7d7bd';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(120, 90, 55, 0.35)';
    ctx.lineWidth = 8;
    ctx.strokeRect(12, 12, size - 24, size - 24);
    ctx.lineWidth = 3;
    ctx.strokeRect(32, 32, size - 64, size - 64);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    for (let i = 16; i < size; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 12);
      ctx.lineTo(i, size - 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(12, i);
      ctx.lineTo(size - 12, i);
      ctx.stroke();
    }
    addCanvasNoise(ctx, size, size, 0.05);
  });
}

function createClassicRugTexture() {
  return generateCanvasTexture(256, (ctx, size) => {
    ctx.fillStyle = '#f3ece0';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(176, 125, 90, 0.35)';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, size - 20, size - 20);
    ctx.strokeStyle = 'rgba(150, 104, 70, 0.22)';
    ctx.lineWidth = 2;
    for (let i = 18; i < size - 18; i += 26) {
      ctx.beginPath();
      ctx.moveTo(12, i);
      ctx.lineTo(size - 12, i);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(i, 12);
      ctx.lineTo(i, size - 12);
      ctx.stroke();
    }
    addCanvasNoise(ctx, size, size, 0.08);
  });
}

function createClassicCurtainTexture() {
  return generateCanvasTexture(256, (ctx, size) => {
    const gradient = ctx.createLinearGradient(0, 0, size, 0);
    gradient.addColorStop(0, '#d6c0ad');
    gradient.addColorStop(0.5, '#f1e7da');
    gradient.addColorStop(1, '#d6c0ad');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
    ctx.lineWidth = 2;
    for (let x = 8; x < size; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + 6, size * 0.25, x - 6, size * 0.55, x + 4, size);
      ctx.stroke();
    }
    addCanvasNoise(ctx, size, size, 0.06);
  });
}

function createClassicVelvetTexture() {
  return generateCanvasTexture(256, (ctx, size) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, '#b07264');
    gradient.addColorStop(0.5, '#a06254');
    gradient.addColorStop(1, '#8f5547');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let y = 6; y < size; y += 18) {
      ctx.fillRect(0, y, size, 2);
    }
    addCanvasNoise(ctx, size, size, 0.09);
  });
}

function createClassicWoodTexture() {
  return generateCanvasTexture(256, (ctx, size) => {
    ctx.fillStyle = '#7c5639';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    for (let x = 0; x < size; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 8, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 14, 0);
      ctx.lineTo(x + 20, size);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(40, 25, 10, 0.25)';
    for (let i = 0; i < 6; i += 1) {
      const centerX = Math.random() * size;
      const centerY = Math.random() * size;
      const radius = 18 + Math.random() * 32;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    addCanvasNoise(ctx, size, size, 0.07);
  });
}

function createClassicArtworkTexture() {
  return generateCanvasTexture(256, (ctx, size) => {
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#f2d9c9');
    gradient.addColorStop(0.5, '#f9efe6');
    gradient.addColorStop(1, '#d3b49b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(140, 90, 60, 0.35)';
    ctx.lineWidth = 8;
    ctx.strokeRect(18, 18, size - 36, size - 36);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo(size * 0.2, size * 0.75);
    ctx.bezierCurveTo(size * 0.35, size * 0.4, size * 0.65, size * 0.6, size * 0.8, size * 0.3);
    ctx.lineTo(size * 0.88, size * 0.6);
    ctx.closePath();
    ctx.fill();
    addCanvasNoise(ctx, size, size, 0.05);
  });
}

function getProceduralTexture(key, generator) {
  if (!PROCEDURAL_TEXTURE_CACHE.has(key)) {
    PROCEDURAL_TEXTURE_CACHE.set(key, generator());
  }
  const baseTexture = PROCEDURAL_TEXTURE_CACHE.get(key);
  if (!baseTexture) return null;
  const clone = baseTexture.clone();
  clone.wrapS = baseTexture.wrapS;
  clone.wrapT = baseTexture.wrapT;
  clone.encoding = baseTexture.encoding;
  clone.needsUpdate = true;
  return clone;
}

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
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return group;
}

function formatCurrency(value) {
  const formatter = new Intl.NumberFormat(getCurrentLocale(), {
    style: 'currency',
    currency: 'EUR',
  });
  const numericValue = Number.isFinite(value) ? value : Number(value) || 0;
  return formatter.format(numericValue);
}

function formatMeters(value) {
  const numericValue = Number(value) || 0;
  return new Intl.NumberFormat(getCurrentLocale(), {
    minimumFractionDigits: numericValue % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(numericValue);
}

function formatMillimeters(value) {
  const numericValue = Math.max(0, Math.round(Number(value) || 0));
  return new Intl.NumberFormat(getCurrentLocale(), {
    maximumFractionDigits: 0,
  }).format(numericValue);
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
  const fallbackLabel = t('accessories.defaults.fallbackName');
  const generated = generateQuoteItemImage(code || fallbackLabel, item?.descrizione || '');
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
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
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

    const ambient = new THREE.AmbientLight(0xffffff, 0.32);
    const hemisphere = new THREE.HemisphereLight(0xf5f7ff, 0xdadada, 0.58);
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(2.4, 3.2, 2.4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 10;
    keyLight.shadow.bias = -0.0004;

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.55);
    rimLight.position.set(-2.2, 2.8, -2.6);
    rimLight.castShadow = true;
    rimLight.shadow.mapSize.set(1024, 1024);
    rimLight.shadow.camera.near = 0.1;
    rimLight.shadow.camera.far = 8;
    rimLight.shadow.bias = -0.0006;

    this.scene.add(ambient, hemisphere, keyLight, rimLight);

    const floorMaterial = new THREE.ShadowMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.3,
    });
    const floorGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.set(0, 0, 0);
    this.floor.receiveShadow = true;
    this.floor.name = 'viewerFloor';
    this.scene.add(this.floor);

    this.environmentGroup = new THREE.Group();
    this.environmentGroup.name = 'viewerEnvironment';
    this.scene.add(this.environmentGroup);

    this.doorRoot = new THREE.Group();
    this.vanoGroup = new THREE.Group();
    this.doorFrames = new THREE.Group();
    this.tracksGroup = new THREE.Group();
    this.doorRoot.add(this.vanoGroup);
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
    this.environmentSignature = null;
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
      node.castShadow = true;
      node.receiveShadow = true;
      node.userData.originalColor = node.material?.color?.clone?.();
      if (node.material?.emissive) {
        node.userData.originalEmissive = node.material.emissive.clone();
      }
      if (typeof node.material?.emissiveIntensity === 'number') {
        node.userData.originalEmissiveIntensity = node.material.emissiveIntensity;
      }
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

    if (!Number.isFinite(params.trackGap)) {
      params.trackGap = params.trackMode === 'hidden' ? 0.008 : 0.012;
    } else {
      const minimumGap = params.trackMode === 'hidden' ? 0.006 : 0.01;
      params.trackGap = Math.max(params.trackGap, minimumGap);
    }
    params.glassHeight = Math.max(params.heightM - params.trackGap - 0.1, 0.05);
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

    let slidingAreaStart = doorLeftEdge - extraLeft + leftFixedWidthM;
    let slidingAreaEnd = doorRightEdge + extraRight - rightFixedWidthM;

    if (!params.fixedPanelsShareTrack) {
      slidingAreaStart = doorLeftEdge - extraLeft;
      slidingAreaEnd = doorRightEdge + extraRight;
    }

    if (slidingAreaEnd < slidingAreaStart) {
      const midpoint = (slidingAreaStart + slidingAreaEnd) / 2;
      slidingAreaStart = midpoint;
      slidingAreaEnd = midpoint;
    }

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

    const computeOptions = {
      shareTrack: params.fixedPanelsShareTrack,
      leftFixedWidthM,
      rightFixedWidthM,
      doorLeftEdge,
      doorRightEdge,
      extraLeft,
      extraRight,
    };

    const openPositions = this.computeOpenPositions(
      params.openingMode,
      slidingSegments,
      slidingAreaStart,
      slidingAreaEnd,
      computeOptions
    );
    const stackLeftPositions = this.computeStackPositions(
      'left',
      slidingSegments,
      slidingAreaStart,
      slidingAreaEnd,
      computeOptions
    );
    const stackRightPositions = this.computeStackPositions(
      'right',
      slidingSegments,
      slidingAreaStart,
      slidingAreaEnd,
      computeOptions
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

  computeOpenPositions(mode, segments, areaStart, areaEnd, options = {}) {
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
    const {
      shareTrack = true,
      leftFixedWidthM = 0,
      rightFixedWidthM = 0,
      doorLeftEdge = start,
      doorRightEdge = end,
    } = options;
    const leftAnchor = !shareTrack && leftFixedWidthM > 0
      ? doorLeftEdge + leftFixedWidthM / 2
      : start + (segments[0]?.widthM ?? 0) / 2;
    const rightAnchor = !shareTrack && rightFixedWidthM > 0
      ? doorRightEdge - rightFixedWidthM / 2
      : end - (segments[count - 1]?.widthM ?? 0) / 2;

    if (mode === 'none') {
      return segments.map((segment) => segment.closedX ?? segment.center ?? 0);
    }

    if (mode === 'single-left') {
      const base = leftAnchor;
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
      const base = rightAnchor;
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
      const baseLeft = leftAnchor;
      for (let i = 0; i < leftCount; i += 1) {
        const width = segments[i].widthM;
        const target = baseLeft + i * stackSpacing;
        const min = start + width / 2;
        const max = end - width / 2;
        positions[i] = clamp(target, min, max);
      }
    }

    if (rightCount > 0) {
      const baseRight = rightAnchor;
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

  computeStackPositions(direction, segments, areaStart, areaEnd, options = {}) {
    const count = segments.length;
    if (count === 0) return [];

    const start = Math.min(areaStart, areaEnd);
    const end = Math.max(areaStart, areaEnd);
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const {
      shareTrack = true,
      leftFixedWidthM = 0,
      rightFixedWidthM = 0,
      doorLeftEdge = start,
      doorRightEdge = end,
    } = options;

    if (direction === 'left') {
      const referenceWidth = segments[0]?.widthM ?? 0;
      const desired = !shareTrack && leftFixedWidthM > 0
        ? doorLeftEdge + leftFixedWidthM / 2
        : start + referenceWidth / 2;
      return segments.map((segment) => {
        const width = segment.widthM ?? referenceWidth;
        const min = start + width / 2;
        const max = end - width / 2;
        return clamp(desired, min, max);
      });
    }

    if (direction === 'right') {
      const referenceWidth = segments[segments.length - 1]?.widthM ?? 0;
      const desired = !shareTrack && rightFixedWidthM > 0
        ? doorRightEdge - rightFixedWidthM / 2
        : end - referenceWidth / 2;
      return segments.map((segment) => {
        const width = segment.widthM ?? referenceWidth;
        const min = start + width / 2;
        const max = end - width / 2;
        return clamp(desired, min, max);
      });
    }

    return segments.map((segment) => segment.closedX ?? segment.center ?? 0);
  }

  buildDoor(params) {
    this.stopAutoCycle();
    clearGroup(this.doorFrames);
    clearGroup(this.tracksGroup);
    clearGroup(this.vanoGroup);
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

    const trackDepthRequirement = (() => {
      const declaredTracks = Math.max(Math.floor(params.trackCount || 0), 0);
      const slidingEstimate = (() => {
        if (
          Number.isFinite(params.slidingTrackCount) &&
          params.slidingTrackCount !== null &&
          params.slidingTrackCount > 0
        ) {
          return Math.max(Math.floor(params.slidingTrackCount), 0);
        }
        if (params.slidingLeavesCount > 0) {
          return Math.max(Math.floor(params.slidingLeavesCount), 0);
        }
        return 0;
      })();
      const fixedTrackAllowance =
        !params.fixedPanelsShareTrack && params.fixedPanelsCount > 0 ? 1 : 0;
      const effectiveTracks = Math.max(
        declaredTracks,
        slidingEstimate + fixedTrackAllowance,
        fixedTrackAllowance > 0 ? 1 : 0
      );
      if (effectiveTracks <= 0) {
        return 0.16;
      }
      const safetyMargin = 0.04;
      const halfDepth = safetyMargin + Math.max(effectiveTracks - 1, 0) * this.zOffset;
      return Math.max(halfDepth * 2, 0.16);
    })();
    const enforcedWallDepth = Math.max(
      Number(params.wallDepthM) || 0,
      trackDepthRequirement
    );
    params.wallDepthM = enforcedWallDepth;
    params.wallThicknessM = Math.max(Number(params.wallThicknessM) || 0.08, 0.08);

    this.buildVano(params);
    if (this.floor) {
      const columnWidth = Math.max(Number(params.columnWidthM) || 0, 0.4);
      const spanX = Math.max(
        Number(params.trackLengthM) || Number(params.totalWidthM) || 0,
        Number(params.totalWidthM) || 0
      ) + columnWidth * 2;
      const spanZ = Math.max(Number(params.wallDepthM) || 0.3, 0.3) + 0.6;
      const offsetX = ((Number(params.extraTrackRightM) || 0) - (Number(params.extraTrackLeftM) || 0)) / 2;
      const padX = Math.max(spanX * 0.5, 2);
      const padZ = Math.max(spanZ * 0.5, 2);
      this.floor.scale.set(Math.max(spanX + padX, 4), Math.max(spanZ + padZ, 4), 1);
      this.floor.position.x = offsetX;
    }
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
        trackMode: params.trackMode,
        trackGap: params.trackGap,
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
    const mode = params.environment || 'soloporta';
    if (!this.environmentGroup) {
      this.environmentGroup = new THREE.Group();
      this.environmentGroup.name = 'viewerEnvironment';
      this.scene.add(this.environmentGroup);
    }

    const signature = [
      mode,
      Math.round(Number(params.totalWidthMm) || 0),
      Math.round(Number(params.heightMm) || 0),
      Math.round(Number(params.trackLengthMm) || 0),
      Math.round(Number(params.extraTrackLeftMm) || 0),
      Math.round(Number(params.extraTrackRightMm) || 0),
      Math.round((Number(params.wallDepthM) || 0) * 1000),
    ].join('|');

    if (this.environmentSignature === signature) {
      if (this.floor) {
        if (mode === 'modernhd' || mode === 'classichd') {
          this.floor.visible = false;
        } else {
          this.floor.visible = true;
          this.floor.material.opacity = 0.3;
        }
      }
      this.environmentMode = mode;
      return;
    }

    this.environmentSignature = signature;
    clearGroup(this.environmentGroup);

    if (mode === 'modernhd' || mode === 'classichd') {
      const builder = mode === 'modernhd' ? this.buildModernEnvironment : this.buildClassicEnvironment;
      const hdEnvironment = builder.call(this, params);
      if (hdEnvironment) {
        this.environmentGroup.add(hdEnvironment);
      }
      if (this.floor) {
        this.floor.visible = false;
      }
    } else if (this.floor) {
      this.floor.visible = true;
      this.floor.material.opacity = 0.3;
    }

    this.environmentMode = mode;
  }

  buildClassicEnvironment(params) {
    const environment = new THREE.Group();
    environment.name = 'classicSalonEnvironment';

    const totalWidthM = Math.max(Number(params.totalWidthM) || 0, 0);
    const trackLengthM = Math.max(Number(params.trackLengthM) || totalWidthM, totalWidthM);
    const wallDepthM = Math.max(Number(params.wallDepthM) || 0.3, 0.3);
    const heightM = Math.max(Number(params.heightM) || 2.1, 2.1);
    const offsetX = ((Number(params.extraTrackRightM) || 0) - (Number(params.extraTrackLeftM) || 0)) / 2;
    const effectiveWidth = Math.max(trackLengthM, totalWidthM);
    const salonWidth = Math.max(effectiveWidth + 2.6, 5.2);
    const salonDepth = Math.max(wallDepthM + 2.6, 4.4);
    const salonHeight = Math.max(heightM + 1.4, 3.4);
    const anisotropy = this.renderer?.capabilities?.getMaxAnisotropy?.() ?? 1;

    const marbleTexture = getProceduralTexture('classicMarble', createClassicMarbleTexture);
    if (marbleTexture) {
      marbleTexture.repeat.set(Math.max(salonWidth * 0.75, 3.2), Math.max(salonDepth * 0.75, 3.2));
      marbleTexture.anisotropy = anisotropy;
    }
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f6f1ea'),
      map: marbleTexture || null,
      roughness: 0.32,
      metalness: 0.12,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(salonWidth + 2.2, salonDepth + 2.2), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(offsetX, -0.0005, 0);
    floor.receiveShadow = true;
    environment.add(floor);

    const inlayTexture = getProceduralTexture('classicInlay', createClassicInlayTexture);
    if (inlayTexture) {
      inlayTexture.repeat.set(Math.max(salonWidth * 0.35, 1.6), Math.max(salonDepth * 0.32, 1.4));
      inlayTexture.anisotropy = anisotropy;
    }
    const inlay = new THREE.Mesh(
      new THREE.PlaneGeometry(
        Math.min(salonWidth * 0.9, effectiveWidth + 1.9),
        Math.min(salonDepth * 0.82, wallDepthM + 2.4)
      ),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#e3d5bf'),
        map: inlayTexture || null,
        roughness: 0.38,
        metalness: 0.05,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
      })
    );
    inlay.rotation.x = -Math.PI / 2;
    inlay.position.set(offsetX, 0.0004, 0);
    environment.add(inlay);

    const rugTexture = getProceduralTexture('classicRug', createClassicRugTexture);
    if (rugTexture) {
      rugTexture.repeat.set(Math.max(salonWidth * 0.25, 1.4), Math.max(salonDepth * 0.22, 1.2));
      rugTexture.anisotropy = anisotropy;
    }
    const rug = new THREE.Mesh(
      new THREE.PlaneGeometry(Math.min(salonWidth * 0.6, 3.1), Math.min(salonDepth * 0.5, 2.2)),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#efe9dd'),
        map: rugTexture || null,
        roughness: 0.72,
        metalness: 0.03,
        side: THREE.DoubleSide,
      })
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(offsetX, 0.001, Math.min(salonDepth * 0.18, 0.9));
    environment.add(rug);

    const columnHeight = Math.max(heightM + 0.6, 2.9);
    const columnRadius = Math.min(0.16, Math.max(0.09, effectiveWidth * 0.05));
    const columnTexture = getProceduralTexture('classicColumn', createClassicMarbleTexture);
    if (columnTexture) {
      columnTexture.repeat.set(1, Math.max(columnHeight, 2.4));
      columnTexture.anisotropy = anisotropy;
    }
    const columnMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f3eee3'),
      map: columnTexture || null,
      roughness: 0.42,
      metalness: 0.06,
    });
    const columnGeometry = new THREE.CylinderGeometry(columnRadius, columnRadius * 0.98, columnHeight, 32);
    const columnBaseGeometry = new THREE.CylinderGeometry(columnRadius * 1.3, columnRadius * 1.3, 0.08, 32);
    const columnCapitalGeometry = new THREE.CylinderGeometry(columnRadius * 1.4, columnRadius * 1.25, 0.12, 32);
    const columnWorldRadius = columnRadius * 1.4;
    const floorHalfWidth = (salonWidth + 2.2) / 2;
    const floorHalfDepth = (salonDepth + 2.2) / 2;
    const columnMarginX = Math.max(columnWorldRadius + 0.25, 0.65);
    const columnMarginZ = Math.max(columnWorldRadius + 0.25, 0.65);
    const sideOffset = Math.max(totalWidthM / 2 + columnWorldRadius + 0.25, floorHalfWidth - columnMarginX);
    const depthOffset = Math.max(wallDepthM / 2 + columnWorldRadius + 0.15, floorHalfDepth - columnMarginZ);

    [-1, 1].forEach((side) => {
      [-1, 1].forEach((depthSide) => {
        const column = new THREE.Group();
        const shaft = new THREE.Mesh(columnGeometry, columnMaterial.clone());
        shaft.position.y = columnHeight / 2;
        shaft.castShadow = true;
        shaft.receiveShadow = true;
        column.add(shaft);

        const base = new THREE.Mesh(columnBaseGeometry, columnMaterial.clone());
        base.position.y = 0.04;
        base.castShadow = true;
        base.receiveShadow = true;
        column.add(base);

        const capital = new THREE.Mesh(columnCapitalGeometry, columnMaterial.clone());
        capital.position.y = columnHeight + 0.06;
        capital.castShadow = true;
        capital.receiveShadow = true;
        column.add(capital);

        column.position.set(offsetX + side * sideOffset, 0, depthSide * depthOffset);
        column.castShadow = true;
        environment.add(column);
      });
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d9b97c'),
      roughness: 0.32,
      metalness: 0.85,
      emissive: new THREE.Color('#533a16'),
      emissiveIntensity: 0.05,
    });

    const woodTexture = getProceduralTexture('classicWood', createClassicWoodTexture);
    if (woodTexture) {
      woodTexture.repeat.set(2, 1.2);
      woodTexture.anisotropy = anisotropy;
    }
    const woodMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8a5e3c'),
      map: woodTexture || null,
      roughness: 0.45,
      metalness: 0.2,
    });
    const consoleWidth = Math.min(salonWidth * 0.35, 1.8);
    const consoleDepth = 0.35;
    const consoleGroup = new THREE.Group();
    const consoleTop = new THREE.Mesh(new THREE.BoxGeometry(consoleWidth, 0.06, consoleDepth), woodMaterial.clone());
    consoleTop.position.y = 0.62;
    consoleTop.castShadow = true;
    consoleTop.receiveShadow = true;
    consoleGroup.add(consoleTop);
    const consoleLegGeometry = new THREE.BoxGeometry(0.08, 0.6, 0.08);
    const legOffsets = [-consoleWidth / 2 + 0.12, consoleWidth / 2 - 0.12];
    legOffsets.forEach((x) => {
      const frontLeg = new THREE.Mesh(consoleLegGeometry, woodMaterial.clone());
      frontLeg.position.set(x, 0.3, consoleDepth / 2 - 0.08);
      frontLeg.castShadow = true;
      frontLeg.receiveShadow = true;
      consoleGroup.add(frontLeg);
      const backLeg = frontLeg.clone();
      backLeg.position.z = -consoleDepth / 2 + 0.08;
      consoleGroup.add(backLeg);
    });
    consoleGroup.rotation.y = Math.PI / 2;
    const consoleOffsetX = sideOffset + columnWorldRadius + consoleDepth / 2 + 0.35;
    consoleGroup.position.set(
      offsetX + consoleOffsetX,
      0,
      Math.min(salonDepth * 0.12, 0.7)
    );
    environment.add(consoleGroup);

    const vaseMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d8dadf'),
      roughness: 0.3,
      metalness: 0.35,
    });
    const vase = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 24), vaseMaterial);
    vase.scale.y = 1.4;
    vase.position.set(0, 0.78, 0);
    vase.castShadow = true;
    consoleGroup.add(vase);
    const foliageMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#3f7a55'),
      roughness: 0.8,
      metalness: 0.05,
    });
    const foliage = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 20), foliageMaterial);
    foliage.position.set(0, 1.02, 0);
    foliage.castShadow = true;
    consoleGroup.add(foliage);

    const mirrorFrame = new THREE.Mesh(
      new THREE.PlaneGeometry(0.92, 1.2),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d7b178'),
        roughness: 0.3,
        metalness: 0.65,
        side: THREE.DoubleSide,
      })
    );
    mirrorFrame.position.set(0, 1.32, -0.18);
    consoleGroup.add(mirrorFrame);
    const mirrorGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(0.78, 1.04),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#fdfdfd'),
        roughness: 0.05,
        metalness: 0.9,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.12,
        side: THREE.DoubleSide,
      })
    );
    mirrorGlass.position.set(0, 1.32, -0.17);
    consoleGroup.add(mirrorGlass);

    const easelGroup = new THREE.Group();
    const artworkTexture = getProceduralTexture('classicArtwork', createClassicArtworkTexture);
    if (artworkTexture) {
      artworkTexture.anisotropy = anisotropy;
    }
    const artwork = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 1),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#f9f2eb'),
        map: artworkTexture || null,
        roughness: 0.4,
        metalness: 0.08,
        side: THREE.DoubleSide,
      })
    );
    artwork.position.y = 1.05;
    artwork.castShadow = true;
    easelGroup.add(artwork);
    const easelLegMaterial = woodMaterial.clone();
    [-0.18, 0.18].forEach((x) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.2, 0.05), easelLegMaterial.clone());
      leg.position.set(x, 0.6, -0.12);
      leg.rotation.z = THREE.MathUtils.degToRad(x > 0 ? -6 : 6);
      leg.castShadow = true;
      leg.receiveShadow = true;
      easelGroup.add(leg);
    });
    const backLeg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.1, 0.05), easelLegMaterial.clone());
    backLeg.position.set(0, 0.55, 0.24);
    backLeg.rotation.x = THREE.MathUtils.degToRad(18);
    backLeg.castShadow = true;
    backLeg.receiveShadow = true;
    easelGroup.add(backLeg);
    const easelOffsetX = sideOffset + columnWorldRadius + consoleDepth / 2 + 0.35;
    easelGroup.position.set(offsetX - easelOffsetX, 0, Math.min(salonDepth * 0.12, 0.7));
    environment.add(easelGroup);

    const curtainTexture = getProceduralTexture('classicCurtain', createClassicCurtainTexture);
    if (curtainTexture) {
      curtainTexture.repeat.set(1.4, 1);
      curtainTexture.anisotropy = anisotropy;
    }
    const curtainMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#dbc9b8'),
      map: curtainTexture || null,
      roughness: 0.7,
      metalness: 0.1,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    });
    const curtainWidth = Math.max(totalWidthM * 0.3, 0.9);
    const curtainHeight = Math.max(heightM + 0.5, 2.6);
    const curtainGeometry = new THREE.PlaneGeometry(curtainWidth, curtainHeight);
    const curtainOffset = Math.max(
      totalWidthM / 2 + curtainWidth / 2 + 0.3,
      sideOffset + columnWorldRadius + curtainWidth / 2 + 0.15
    );
    [-1, 1].forEach((side) => {
      const curtain = new THREE.Mesh(curtainGeometry, curtainMaterial.clone());
      curtain.position.set(offsetX + side * curtainOffset, curtainHeight / 2 - 0.02, -0.35);
      curtain.rotation.y = side === -1 ? Math.PI / 9 : -Math.PI / 9;
      curtain.castShadow = true;
      curtain.receiveShadow = true;
      environment.add(curtain);
    });

    const velvetTexture = getProceduralTexture('classicVelvet', createClassicVelvetTexture);
    if (velvetTexture) {
      velvetTexture.repeat.set(1.4, 1.2);
      velvetTexture.anisotropy = anisotropy;
    }
    const velvetMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#a86e61'),
      map: velvetTexture || null,
      roughness: 0.55,
      metalness: 0.15,
    });
    const armchairBaseX = Math.min(
      totalWidthM / 2 + 0.95,
      Math.max(sideOffset - columnWorldRadius - 0.3, 1.1)
    );
    const armchairPositions = [
      {
        x: offsetX - armchairBaseX,
        z: rug.position.z + 0.62,
        rotation: Math.PI / 6,
      },
      {
        x: offsetX + armchairBaseX,
        z: rug.position.z + 0.62,
        rotation: -Math.PI / 6,
      },
    ];
    armchairPositions.forEach(({ x, z, rotation }) => {
      const chair = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.18, 0.7), velvetMaterial.clone());
      seat.position.set(0, 0.24, 0);
      seat.castShadow = true;
      seat.receiveShadow = true;
      chair.add(seat);
      const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.55, 0.08), velvetMaterial.clone());
      backrest.position.set(0, 0.55, -0.31);
      backrest.castShadow = true;
      backrest.receiveShadow = true;
      chair.add(backrest);
      const armGeometry = new THREE.BoxGeometry(0.08, 0.38, 0.7);
      [-1, 1].forEach((side) => {
        const arm = new THREE.Mesh(armGeometry, velvetMaterial.clone());
        arm.position.set(side * 0.32, 0.45, 0);
        arm.castShadow = true;
        arm.receiveShadow = true;
        chair.add(arm);
      });
      const legGeometry = new THREE.CylinderGeometry(0.035, 0.05, 0.22, 12);
      [-0.28, 0.28].forEach((lx) => {
        [-0.26, 0.26].forEach((lz) => {
          const leg = new THREE.Mesh(legGeometry, goldMaterial.clone());
          leg.position.set(lx, 0.11, lz);
          leg.castShadow = true;
          leg.receiveShadow = true;
          chair.add(leg);
        });
      });
      chair.position.set(x, 0, z);
      chair.rotation.y = rotation;
      environment.add(chair);
    });

    const planterMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#dcd7cf'),
      roughness: 0.5,
      metalness: 0.1,
    });
    const planterGeometry = new THREE.CylinderGeometry(0.16, 0.18, 0.38, 20);
    const foliageGeometry = new THREE.SphereGeometry(0.32, 24, 24);
    const planterOffsetX = Math.max(totalWidthM / 2 + 0.45, sideOffset + columnWorldRadius + 0.25);
    [-1, 1].forEach((side) => {
      const planter = new THREE.Mesh(planterGeometry, planterMaterial.clone());
      planter.position.set(offsetX + side * planterOffsetX, 0.19, -Math.min(salonDepth / 3, 1));
      planter.castShadow = true;
      planter.receiveShadow = true;
      environment.add(planter);
      const crown = new THREE.Mesh(foliageGeometry, foliageMaterial.clone());
      crown.position.set(planter.position.x, 0.62, planter.position.z);
      crown.castShadow = true;
      crown.receiveShadow = false;
      environment.add(crown);
    });

    const chandelier = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 16), goldMaterial.clone());
    stem.position.y = salonHeight - 0.2;
    stem.castShadow = true;
    chandelier.add(stem);
    const chandelierBodyMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#fff4d6'),
      emissive: new THREE.Color('#ffebc0'),
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.2,
    });
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 24), chandelierBodyMaterial.clone());
    body.position.y = salonHeight - 0.4;
    body.castShadow = true;
    chandelier.add(body);
    for (let i = 0; i < 6; i += 1) {
      const angle = (i / 6) * Math.PI * 2;
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 12), goldMaterial.clone());
      arm.position.set(Math.cos(angle) * 0.32, salonHeight - 0.65, Math.sin(angle) * 0.32);
      arm.rotation.z = Math.PI / 2;
      arm.rotation.y = angle;
      arm.castShadow = true;
      chandelier.add(arm);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), chandelierBodyMaterial.clone());
      bulb.position.set(Math.cos(angle) * 0.55, salonHeight - 0.65, Math.sin(angle) * 0.55);
      bulb.castShadow = true;
      chandelier.add(bulb);
    }
    chandelier.position.set(offsetX, 0, Math.min(salonDepth * 0.12, 0.6));
    environment.add(chandelier);

    return environment;
  }

  buildModernEnvironment(params) {
    const environment = new THREE.Group();
    environment.name = 'modernApartmentEnvironment';

    const totalWidthM = Math.max(Number(params.totalWidthM) || 0, 0);
    const trackLengthM = Math.max(Number(params.trackLengthM) || totalWidthM, totalWidthM);
    const wallDepthM = Math.max(Number(params.wallDepthM) || 0.35, 0.3);
    const heightM = Math.max(Number(params.heightM) || 2.2, 2.2);
    const extraLeft = Math.max(Number(params.extraTrackLeftM) || 0, 0);
    const extraRight = Math.max(Number(params.extraTrackRightM) || 0, 0);
    const offsetX = (extraRight - extraLeft) / 2;

    const effectiveSpan = Math.max(trackLengthM, totalWidthM);
    const doorHalfSpan = Math.max(totalWidthM / 2, 0.5);
    const walkwayLeftEdge = offsetX - doorHalfSpan;
    const walkwayRightEdge = offsetX + doorHalfSpan;
    const baseMargin = Math.max(1.2, doorHalfSpan * 0.35);
    const placementPadding = doorHalfSpan + baseMargin + 2.2;
    const walkwayGap = wallDepthM + 1.2;
    const frontRoomDepth = Math.max(wallDepthM + 2.8, 3.6);
    const backRoomDepth = Math.max(wallDepthM + 2.6, 3.4);
    const frontRoomCenterZ = walkwayGap / 2 + frontRoomDepth / 2;
    const backRoomCenterZ = -walkwayGap / 2 - backRoomDepth / 2;
    const loungeWidth = Math.max(effectiveSpan + 3.6, placementPadding * 2);
    const loungeDepth = Math.max(frontRoomDepth + backRoomDepth + walkwayGap, 8);
    const loungeHeight = Math.max(heightM + 1.8, 3.4);
    const anisotropy = this.renderer?.capabilities?.getMaxAnisotropy?.() ?? 1;

    const placeLeft = (halfWidth = 0) => walkwayLeftEdge - baseMargin - halfWidth - offsetX;
    const placeRight = (halfWidth = 0) => walkwayRightEdge + baseMargin + halfWidth - offsetX;

    // --- base floor -------------------------------------------------------
    const floorTexture = getProceduralTexture('modernFloor', createParquetTexture);
    if (floorTexture) {
      floorTexture.repeat.set(Math.max(loungeWidth * 1.15, 4), Math.max(loungeDepth * 1.15, 4));
      floorTexture.anisotropy = anisotropy;
    }
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d0c0af'),
      map: floorTexture || null,
      roughness: 0.42,
      metalness: 0.08,
    });
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(loungeWidth + 3, loungeDepth + 3),
      floorMaterial
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(offsetX, -0.0006, 0);
    floor.receiveShadow = true;
    environment.add(floor);

    const frontRoom = new THREE.Group();
    frontRoom.name = 'modernApartmentFrontRoom';
    frontRoom.position.set(offsetX, 0, frontRoomCenterZ);
    environment.add(frontRoom);

    const backRoom = new THREE.Group();
    backRoom.name = 'modernApartmentBackRoom';
    backRoom.position.set(offsetX, 0, backRoomCenterZ);
    environment.add(backRoom);

    // --- lounge area ------------------------------------------------------
    const rugTexture = getProceduralTexture('modernRug', createRugTexture);
    if (rugTexture) {
      rugTexture.repeat.set(3, 2.5);
      rugTexture.anisotropy = anisotropy;
    }
    const rugWidth = Math.min(loungeWidth * 0.62, 3.6);
    const rugDepth = Math.min(frontRoomDepth * 0.55, 2.6);
    const rug = new THREE.Mesh(
      new THREE.PlaneGeometry(rugWidth, rugDepth),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#f4f7ff'),
        map: rugTexture || null,
        roughness: 0.7,
        metalness: 0.04,
        side: THREE.DoubleSide,
      })
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(placeLeft(rugWidth / 2), 0.005, -0.1);
    rug.receiveShadow = false;
    frontRoom.add(rug);

    const fabricTexture = getProceduralTexture('modernFabric', createFabricTexture);
    if (fabricTexture) {
      fabricTexture.repeat.set(2.5, 2.5);
      fabricTexture.anisotropy = anisotropy;
    }
    const sofaMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1f2b3c'),
      map: fabricTexture || null,
      roughness: 0.55,
      metalness: 0.12,
    });
    const sofaWidth = Math.min(loungeWidth * 0.42, 2.4);
    const sofaSeat = new THREE.Mesh(
      new THREE.BoxGeometry(sofaWidth, 0.42, 1.05),
      sofaMaterial.clone()
    );
    sofaSeat.position.set(placeLeft(sofaWidth / 2), 0.21, -0.35);
    sofaSeat.castShadow = true;
    sofaSeat.receiveShadow = true;
    frontRoom.add(sofaSeat);

    const sofaChaise = new THREE.Mesh(
      new THREE.BoxGeometry(1.25, 0.42, 0.75),
      sofaMaterial.clone()
    );
    sofaChaise.position.set(
      sofaSeat.position.x + sofaSeat.geometry.parameters.width / 2 - 0.6,
      0.21,
      sofaSeat.position.z + sofaSeat.geometry.parameters.depth / 2 - 0.15
    );
    sofaChaise.castShadow = true;
    sofaChaise.receiveShadow = true;
    frontRoom.add(sofaChaise);

    const sofaBack = new THREE.Mesh(
      new THREE.BoxGeometry(sofaSeat.geometry.parameters.width, 0.55, 0.14),
      sofaMaterial.clone()
    );
    sofaBack.position.set(sofaSeat.position.x, 0.55, sofaSeat.position.z - 0.45);
    sofaBack.castShadow = true;
    sofaBack.receiveShadow = true;
    frontRoom.add(sofaBack);

    const cushionPalette = ['#f7d4b5', '#d8e3ff', '#ffe4f0'];
    cushionPalette.forEach((hex, index) => {
      const cushion = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.18, 0.3),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(hex),
          roughness: 0.6,
          metalness: 0.05,
        })
      );
      cushion.position.set(
        sofaSeat.position.x - sofaSeat.geometry.parameters.width / 2 + 0.45 + index * 0.55,
        0.48,
        sofaSeat.position.z - 0.3
      );
      cushion.castShadow = true;
      frontRoom.add(cushion);
    });

    const coffeeTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.48, 0.05, 32),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#faf6ef'),
        roughness: 0.35,
        metalness: 0.2,
      })
    );
    coffeeTop.position.set(sofaSeat.position.x + 0.55, 0.37, sofaSeat.position.z + 0.25);
    coffeeTop.castShadow = true;
    frontRoom.add(coffeeTop);
    const coffeeBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.16, 0.32, 24),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#c6b9a6'),
        roughness: 0.4,
        metalness: 0.25,
      })
    );
    coffeeBase.position.set(coffeeTop.position.x, 0.16, coffeeTop.position.z);
    coffeeBase.castShadow = true;
    frontRoom.add(coffeeBase);

    const sideTable = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.46, 0.45),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2f3a4d'),
        roughness: 0.5,
        metalness: 0.18,
      })
    );
    sideTable.position.set(
      sofaSeat.position.x - sofaSeat.geometry.parameters.width / 2 - 0.32,
      0.23,
      sofaSeat.position.z - 0.05
    );
    sideTable.castShadow = true;
    sideTable.receiveShadow = true;
    frontRoom.add(sideTable);

    const vase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.18, 0.34, 24),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#ffffff'),
        roughness: 0.25,
        metalness: 0.08,
      })
    );
    vase.position.set(sideTable.position.x, 0.46, sideTable.position.z);
    vase.castShadow = true;
    frontRoom.add(vase);
    const stems = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 0.6, 16),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#74bfa2'),
        roughness: 0.6,
        metalness: 0.02,
      })
    );
    stems.position.set(vase.position.x, 0.9, vase.position.z);
    stems.castShadow = true;
    frontRoom.add(stems);

    // --- media wall -------------------------------------------------------
    const consoleWidth = Math.min(loungeWidth * 0.4, 2.1);
    const consoleX = placeRight(consoleWidth / 2);
    const console = new THREE.Mesh(
      new THREE.BoxGeometry(consoleWidth, 0.12, 0.42),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#fdfdfd'),
        roughness: 0.22,
        metalness: 0.05,
      })
    );
    console.position.set(consoleX, 0.3, -backRoomDepth / 2 + 0.5);
    console.castShadow = true;
    console.receiveShadow = true;
    backRoom.add(console);

    const consoleBase = new THREE.Mesh(
      new THREE.BoxGeometry(consoleWidth, 0.2, 0.38),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#c8beb2'),
        roughness: 0.45,
        metalness: 0.08,
      })
    );
    consoleBase.position.set(console.position.x, 0.1, console.position.z);
    consoleBase.castShadow = true;
    consoleBase.receiveShadow = true;
    backRoom.add(consoleBase);

    const sculpture = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.16, 0.04, 80, 18),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d4b38c'),
        roughness: 0.35,
        metalness: 0.6,
      })
    );
    sculpture.position.set(console.position.x - consoleWidth / 3.5, 0.46, console.position.z + 0.04);
    sculpture.castShadow = true;
    backRoom.add(sculpture);

    const books = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.06, 0.26),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2d334a'),
        roughness: 0.55,
        metalness: 0.05,
      })
    );
    books.position.set(console.position.x + consoleWidth / 3.3, 0.45, console.position.z - 0.05);
    books.castShadow = true;
    backRoom.add(books);

    const wallArtTexture = getProceduralTexture('modernArtwork', createArtworkTexture);
    if (wallArtTexture) {
      wallArtTexture.repeat.set(1, 1);
      wallArtTexture.anisotropy = anisotropy;
    }
    const artPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(1.65, 1.05),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#ffffff'),
        map: wallArtTexture || null,
        emissive: new THREE.Color('#0f172a'),
        emissiveIntensity: 0.1,
        roughness: 0.5,
        metalness: 0.07,
      })
    );
    artPanel.position.set(console.position.x, loungeHeight * 0.62, console.position.z - 0.15);
    artPanel.castShadow = false;
    backRoom.add(artPanel);
    const artFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.71, 1.11, 0.04),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d8d1c7'),
        roughness: 0.4,
        metalness: 0.12,
      })
    );
    artFrame.position.copy(artPanel.position);
    backRoom.add(artFrame);

    // --- freestanding shelves --------------------------------------------
    const shelfMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1c2432'),
      roughness: 0.4,
      metalness: 0.18,
    });
    const shelfWidth = 0.32;
    const shelf = new THREE.Mesh(
      new THREE.BoxGeometry(shelfWidth, 1.6, 0.32),
      shelfMaterial.clone()
    );
    shelf.position.set(placeLeft(shelfWidth / 2) - 0.4, 0.8, -backRoomDepth / 2 + 0.9);
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    backRoom.add(shelf);

    const shelfLevels = 4;
    for (let i = 0; i < shelfLevels; i += 1) {
      const level = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.04, 0.34),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color('#f5f2ec'),
          roughness: 0.35,
          metalness: 0.08,
        })
      );
      level.position.set(shelf.position.x, 0.18 + i * 0.42, shelf.position.z);
      level.castShadow = true;
      backRoom.add(level);
    }

    const sculpture2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 24, 24),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#93d0f5'),
        emissive: new THREE.Color('#66c2ff'),
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.4,
      })
    );
    sculpture2.position.set(shelf.position.x, 1.05, shelf.position.z + 0.08);
    sculpture2.castShadow = true;
    backRoom.add(sculpture2);

    const floorLampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.14, 0.05, 20),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2b303a'),
        roughness: 0.4,
        metalness: 0.2,
      })
    );
    floorLampBase.position.set(placeLeft(0.2), 0.025, -0.2);
    floorLampBase.castShadow = true;
    frontRoom.add(floorLampBase);

    const floorLampStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 1.65, 18),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#dcd7cf'),
        roughness: 0.3,
        metalness: 0.5,
      })
    );
    floorLampStem.position.set(floorLampBase.position.x, 0.85, floorLampBase.position.z);
    floorLampStem.castShadow = true;
    frontRoom.add(floorLampStem);

    const lampShade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.22, 0.32, 26),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#ffffff'),
        emissive: new THREE.Color('#ffe6c8'),
        emissiveIntensity: 0.6,
        roughness: 0.25,
        metalness: 0.12,
      })
    );
    lampShade.position.set(floorLampStem.position.x, 1.52, floorLampStem.position.z);
    lampShade.castShadow = true;
    frontRoom.add(lampShade);

    const lampLight = new THREE.PointLight(0xffe6c8, 0.55, 5.5);
    lampLight.position.copy(lampShade.position);
    lampLight.castShadow = true;
    frontRoom.add(lampLight);

    // --- pendant cluster over the seating area ---------------------------
    const pendantRoot = new THREE.Group();
    pendantRoot.position.set(sofaSeat.position.x + 0.25, loungeHeight - 0.4, sofaSeat.position.z);
    const pendantColors = ['#ffffff', '#f9d7b0', '#bcd8ff'];
    pendantColors.forEach((hex, index) => {
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.18 + index * 0.02, 24, 24),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(hex),
          emissive: new THREE.Color(hex).multiplyScalar(0.6),
          emissiveIntensity: 0.5,
          roughness: 0.25,
          metalness: 0.05,
        })
      );
      bulb.position.set(Math.cos(index * 2.1) * 0.3, -0.35 - index * 0.05, Math.sin(index * 1.7) * 0.28);
      bulb.castShadow = true;
      pendantRoot.add(bulb);
    });
    const pendantStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.8, 16),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#dad2c7'),
        roughness: 0.3,
        metalness: 0.5,
      })
    );
    pendantStem.position.set(0, 0.4, 0);
    pendantStem.castShadow = true;
    pendantRoot.add(pendantStem);
    frontRoom.add(pendantRoot);

    const pendantLight = new THREE.PointLight(0xfff1d6, 0.6, 6.5);
    pendantLight.position.copy(pendantRoot.position).add(new THREE.Vector3(0, -0.55, 0));
    pendantLight.castShadow = true;
    frontRoom.add(pendantLight);

    // --- greenery ---------------------------------------------------------
    const planterMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f2eee6'),
      roughness: 0.4,
      metalness: 0.08,
    });
    const planter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.28, 0.36, 24),
      planterMaterial.clone()
    );
    planter.position.set(placeRight(0.34) + 0.4, 0.18, 0.25);
    planter.castShadow = true;
    planter.receiveShadow = true;
    frontRoom.add(planter);
    const palm = new THREE.Mesh(
      new THREE.ConeGeometry(0.42, 1.2, 32),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#4f946c'),
        roughness: 0.55,
        metalness: 0.06,
      })
    );
    palm.position.set(planter.position.x, 0.98, planter.position.z);
    palm.castShadow = true;
    frontRoom.add(palm);

    const lowPlanter = planter.clone();
    lowPlanter.scale.set(0.8, 0.8, 0.8);
    lowPlanter.position.set(placeRight(0.3), 0.14, -backRoomDepth / 2 + 0.8);
    backRoom.add(lowPlanter);
    const lowPlant = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 24, 20),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#6fb27c'),
        roughness: 0.6,
        metalness: 0.05,
      })
    );
    lowPlant.position.set(lowPlanter.position.x, 0.45, lowPlanter.position.z);
    lowPlant.castShadow = true;
    backRoom.add(lowPlant);

    // --- ambient light strips -------------------------------------------
    const ledStripMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffffff'),
      emissive: new THREE.Color('#9ec8ff'),
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.05,
    });
    const ledStrip = new THREE.Mesh(
      new THREE.BoxGeometry(effectiveSpan + 1.4, 0.02, 0.06),
      ledStripMaterial
    );
    ledStrip.position.set(offsetX, heightM + 0.25, -wallDepthM - 0.25);
    environment.add(ledStrip);

    const ledStrip2 = ledStrip.clone();
    ledStrip2.position.set(offsetX, heightM + 0.25, wallDepthM + 0.6);
    environment.add(ledStrip2);

    return environment;
  }


  buildVano(params) {
    if (!this.vanoGroup) return;
    this.vanoGroup.position.set(0, 0, 0);

    const heightM = Math.max(Number(params?.heightM) || 0, 0);
    const totalWidthM = Math.max(Number(params?.totalWidthM) || 0, 0);
    if (!heightM || !totalWidthM) {
      return;
    }

    const wallThickness = Math.max(Number(params?.wallThicknessM) || 0.08, 0.02);
    const primaryLeafWidthM = Math.max(
      Number(params?.primaryLeafWidthM) || 0,
      (() => {
        if (Array.isArray(params?.slidingLeaves) && params.slidingLeaves.length) {
          const total = params.slidingLeaves.reduce((sum, leaf) => sum + (leaf?.widthM || 0), 0);
          return total / params.slidingLeaves.length;
        }
        const segmentCount = Math.max(
          Number(params?.slidingLeavesCount) || 0,
          Number(params?.fixedPanelsCount) || 0,
          1
        );
        return (Number(params?.totalWidthM) || 0) / segmentCount;
      })()
    );
    const columnWidth = Math.max(wallThickness, primaryLeafWidthM * 2);
    const lintelThickness = Math.max(columnWidth / 2, 0.05);
    const wallDepth = Math.max(Number(params?.wallDepthM) || 0.25, 0.05);

    params.columnWidthM = columnWidth;
    params.lintelThickness = lintelThickness;
    params.wallDepthM = wallDepth;

    const extraLeft = Math.max(Number(params?.extraTrackLeftM) || 0, 0);
    const extraRight = Math.max(Number(params?.extraTrackRightM) || 0, 0);
    const lintelWidth = Math.max(totalWidthM + columnWidth * 2, columnWidth * 2);
    const lintelCenterOffset = 0;

    const baseMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffffff'),
      roughness: 0.35,
      metalness: 0,
    });

    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(columnWidth, heightM, wallDepth),
      baseMaterial.clone()
    );
    leftWall.position.set(-totalWidthM / 2 - columnWidth / 2, heightM / 2, 0);
    leftWall.name = 'vanoWall_left';
    leftWall.renderOrder = -5;
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    this.vanoGroup.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(columnWidth, heightM, wallDepth),
      baseMaterial.clone()
    );
    rightWall.position.set(totalWidthM / 2 + columnWidth / 2, heightM / 2, 0);
    rightWall.name = 'vanoWall_right';
    rightWall.renderOrder = -5;
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    this.vanoGroup.add(rightWall);

    const lintel = new THREE.Mesh(
      new THREE.BoxGeometry(lintelWidth, lintelThickness, wallDepth),
      baseMaterial.clone()
    );
    lintel.position.set(lintelCenterOffset, heightM + lintelThickness / 2, 0);
    lintel.name = 'vanoLintel_top';
    lintel.renderOrder = -5;
    lintel.castShadow = true;
    lintel.receiveShadow = true;
    this.vanoGroup.add(lintel);

    baseMaterial.dispose();
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
    const trackGap = Math.max(Number(params.trackGap) || 0, 0);
    const effectiveHeight = Math.max(params.heightM - trackGap, 0);
    const effectiveHeightMm = Math.max(Math.round(effectiveHeight * 1000), 0);
    const verticalCenterOffset = (effectiveHeight - params.heightM) / 2;

    const commonInfo = {
      dimensions: `Altezza: ${formatMillimeters(effectiveHeightMm)} mm`,
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
      leftProfile.position.y = verticalCenterOffset;
      leftProfile.scale.set(1, effectiveHeight, 1);
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
      rightProfile.position.y = verticalCenterOffset;
      rightProfile.scale.set(1, effectiveHeight, 1);
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
      topProfile.position.y = verticalCenterOffset + effectiveHeight / 2;
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
      bottomProfile.position.y = verticalCenterOffset - effectiveHeight / 2;
      bottomProfile.scale.set(doorWidthM, 1, 1);
      group.add(bottomProfile);
    }

    if (params.showCover) {
      const coverInfo = {
        name: 'Cover',
        code: 'UNK-A203-40',
        dimensions: `Altezza: ${formatMillimeters(effectiveHeightMm)} mm`,
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
        coverLeft.position.y = verticalCenterOffset;
        coverLeft.scale.set(1, effectiveHeight, 1);
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
        coverRight.position.y = verticalCenterOffset;
        coverRight.scale.set(1, effectiveHeight, 1);
        group.add(coverRight);
      }
    }

    const glassHeight = Math.max((params.glassHeight ?? effectiveHeight - 0.1), 0.05);

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
    glass.position.set(0, verticalCenterOffset, 0);
    glass.renderOrder = 1;
    glass.castShadow = false;
    glass.receiveShadow = false;
    glass.userData.originalColor = glass.material.color.clone();
    glass.userData.partInfo = {
      name: 'Pannello Vetrato',
      code: 'GLASS',
      dimensions: `Larghezza: ${formatMillimeters(Math.max(doorWidthMm - 50, 0))} mm · Altezza: ${formatMillimeters(Math.max(effectiveHeightMm - 100, 0))} mm`,
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
    const halfGap = Math.max(((Number(params.trackGap) || 0.01) / 2), 0.005);
    const lintelThickness = Math.max(Number(params.lintelThickness) || 0.1, 0.05);
    const lintelBottomY = Number(params.heightM) || 0;
    const visibleTrackY = lintelBottomY - halfGap / 2;
    const hiddenTrackY = lintelBottomY + Math.max(lintelThickness * 0.4, halfGap);
    const extraLeft = Math.max(Number(params.extraTrackLeftM) || 0, 0);
    const extraRight = Math.max(Number(params.extraTrackRightM) || 0, 0);
    const trackLengthM = Math.max(Number(params.trackLengthM) || Number(params.totalWidthM) || 0, 0);
    const centerOffset = (extraRight - extraLeft) / 2;
    const positionY = params.trackMode === 'hidden' ? hiddenTrackY : visibleTrackY;
    track.position.set(centerOffset, positionY, index * this.zOffset);
    const isHidden = params.trackMode === 'hidden';
    track.visible = !isHidden;
    if (isHidden) {
      track.castShadow = false;
      track.receiveShadow = false;
    }
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
    const neonColor = new THREE.Color('#63f5ff');
    const neonEmissive = new THREE.Color('#1bcfff');
    matches.forEach((mesh) => {
      if (mesh.material?.color) {
        mesh.material.color.set(neonColor);
      }
      if (mesh.material?.emissive) {
        mesh.material.emissive.set(neonEmissive);
      }
      if (typeof mesh.material?.emissiveIntensity === 'number') {
        mesh.material.emissiveIntensity = 1.35;
      }
    });
    this.showPartInfo(matches[0].userData?.partInfo || null);
  }

  resetHighlights() {
    this.partMeshes.forEach((mesh) => {
      if (mesh.userData?.originalColor && mesh.material?.color) {
        mesh.material.color.copy(mesh.userData.originalColor);
      }
      if (mesh.userData?.originalEmissive && mesh.material?.emissive) {
        mesh.material.emissive.copy(mesh.userData.originalEmissive);
      }
      if (
        typeof mesh.userData?.originalEmissiveIntensity === 'number' &&
        typeof mesh.material?.emissiveIntensity === 'number'
      ) {
        mesh.material.emissiveIntensity = mesh.userData.originalEmissiveIntensity;
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
  mobileNavButtons: document.querySelectorAll('.mobile-nav__button'),
  languageButtons: document.querySelectorAll('.language-switch__button'),
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
  environmentControl: document.getElementById('viewer-environment-control'),
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
  selectors.stepFeedback.textContent = resolveMessage(message);
}

function setupMobileNav() {
  const buttons = Array.from(selectors.mobileNavButtons ?? []);
  if (!buttons.length) {
    return;
  }

  const setActive = (activeButton) => {
    buttons.forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle('is-active', isActive);
      if (isActive) {
        button.setAttribute('aria-current', 'page');
      } else {
        button.removeAttribute('aria-current');
      }
    });
  };

  const observed = buttons
    .map((button) => {
      const targetSelector = button.getAttribute('data-target');
      if (!targetSelector) return null;
      const target = document.querySelector(targetSelector);
      if (!target) return null;
      return { button, target };
    })
    .filter(Boolean);

  let suppressObserver = false;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetSelector = button.getAttribute('data-target');
      const target = targetSelector ? document.querySelector(targetSelector) : null;
      if (!target) return;
      suppressObserver = true;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActive(button);
      window.setTimeout(() => {
        suppressObserver = false;
      }, 600);
    });
  });

  if (observed.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressObserver) return;
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;
        const { target } = visible[0];
        const match = observed.find((item) => item.target === target);
        if (match) {
          setActive(match.button);
        }
      },
      { threshold: [0.35, 0.6], rootMargin: '-25% 0px -45% 0px' }
    );

    observed.forEach(({ target }) => observer.observe(target));
  }

  const initialActive = buttons.find((btn) => btn.classList.contains('is-active')) || observed[0]?.button || buttons[0];
  if (initialActive) {
    setActive(initialActive);
  }
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
    if (typeof field.setCustomValidity === 'function') {
      field.setCustomValidity('');
    }
  });

  for (const field of fields) {
    const section = field.closest('.configurator-section');
    if (field.type === 'hidden') {
      const shouldValidate = field.dataset.stepValidate === 'true' && field.required;
      if (shouldValidate && !field.value) {
        section?.classList.add('configurator-section--error');
        const message = resolveMessage(field.dataset.validationMessage || 'form.validation.default');
        showStepFeedback(message);
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
      const message = resolveMessage(field.dataset.validationMessage || field.validationMessage || 'form.validation.default');
      if (typeof field.setCustomValidity === 'function') {
        field.setCustomValidity(message);
      }
      field.reportValidity();
      showStepFeedback(message);
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
      name:
        input.dataset.i18nName
          ? t(input.dataset.i18nName)
          : resolveAccessoryName(input.value, input.dataset.name || input.value),
      price: Number(input.dataset.price || 0),
    }));
}

function getCheckboxMeta(inputs, value) {
  const node = Array.from(inputs ?? []).find((input) => input.value === value);
  if (!node) return null;
  return {
    value: node.value,
    name:
      node.dataset.i18nName
        ? t(node.dataset.i18nName)
        : resolveAccessoryName(node.value, node.dataset.name || node.value),
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

function updateNumeroAnteOptions(model, { preserveSelection = false } = {}) {
  const select = selectors.numeroAnteSelect;
  if (!select) return;
  const available = MODEL_ANTE_OPTIONS[model] ?? MODEL_ANTE_OPTIONS.DEFAULT;
  const previous = select.value;
  select.innerHTML = '';

  available.forEach((value) => {
    const option = document.createElement('option');
    option.value = String(value);
    option.textContent = t('form.numeroAnte.optionLabel', {
      value,
      label: value === 1 ? t('form.numeroAnte.singular') : t('form.numeroAnte.plural'),
    });
    select.appendChild(option);
  });

  if (available.length === 0) {
    select.value = '';
    return;
  }

  const preferred = available.includes(Number(previous)) ? previous : String(available[0]);
  select.value = preferred;
  if (!preserveSelection || preferred !== previous) {
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }
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

function updateTrackLengthOptions({ preserveSelection = false } = {}) {
  const select = selectors.lunghezzaBinarioSelect;
  if (!select) return;
  const model = document.getElementById('model-select')?.value || 'TRASCINAMENTO';
  const binario = selectors.binarioInput?.value || 'A vista';
  syncMontaggioVisibility(model);
  const montaggio = resolveMontaggioValue(model);
  const options = findTrackOptions(model, binario, montaggio);
  const previous = select.value;
  select.innerHTML = '';

  options.forEach(({ code, meters }) => {
    const option = document.createElement('option');
    option.value = String(code);
    option.dataset.code = String(code);
    option.dataset.meters = String(meters);
    option.dataset.mm = String(mmFromCode(code));
    const labelText = t('form.lunghezzaBinario.optionLabel', { value: formatMetersValue(meters) });
    option.dataset.label = labelText;
    option.textContent = labelText;
    select.appendChild(option);
  });

  if (options.length > 0) {
    const preferred = options.find((item) => String(item.code) === previous)
      ? previous
      : String(options[0].code);
    select.value = preferred;
    selectors.lunghezzaBinarioMsg.textContent = '';
    if (!preserveSelection && preferred !== previous) {
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  } else {
    selectors.lunghezzaBinarioMsg.textContent = t('form.lunghezzaBinario.helper');
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
      name: resolveAccessoryName(
        input.name.replace(/.*\[(.*)\]/, '$1'),
        input.dataset.name || input.name
      ),
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
    categories.push({ label: t('quoteCategories.binari'), items: binariItems });
  }

  const coverItems = [];
  buildCoverItems(coverItems, config, derived);
  if (coverItems.length > 0) {
    categories.push({ label: t('quoteCategories.cover'), items: coverItems });
  }

  const scorrimentoItems = [];
  buildScorrimentoItems(scorrimentoItems, config, derived, optionalGeneral, optionalMagnetica);
  if (scorrimentoItems.length > 0) {
    categories.push({ label: t('quoteCategories.scorrimento'), items: scorrimentoItems });
  }

  const fissiItems = [];
  buildFixedPanelItems(fissiItems, config, derived);
  if (fissiItems.length > 0) {
    categories.push({ label: t('quoteCategories.fissi'), items: fissiItems });
  }

  const doorBoxItems = [];
  buildDoorBoxItems(doorBoxItems, config);
  if (doorBoxItems.length > 0) {
    categories.push({ label: t('quoteCategories.doorBox'), items: doorBoxItems });
  }

  const maniglieItems = [];
  buildManiglieItems(maniglieItems, config);
  if (maniglieItems.length > 0) {
    categories.push({ label: t('quoteCategories.maniglie'), items: maniglieItems });
  }

  const kitItems = [];
  buildKitItems(kitItems, config);
  if (kitItems.length > 0) {
    categories.push({ label: t('quoteCategories.kit'), items: kitItems });
  }

  const traversinoItems = [];
  buildTraversinoItems(traversinoItems, config);
  if (traversinoItems.length > 0) {
    categories.push({ label: t('quoteCategories.traversino'), items: traversinoItems });
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

      const formatMm = (value) => `${formatMillimeters(value)} mm`;
      const rows = [];

      rows.push({
        element: t('cuts.rows.binariInizialiFinali'),
        quantity: sheet.binariInizialiFinali,
        length: formatMm(sheet.lunghezzaBinario),
      });
      if (sheet.binariCentrali > 0) {
        rows.push({
          element: t('cuts.rows.binariCentrali'),
          quantity: sheet.binariCentrali,
          length: formatMm(sheet.lunghezzaBinario),
        });
      }

      rows.push({
        element: t('cuts.rows.anteLarghezza'),
        quantity: sheet.numeroAnte,
        length: formatMm(sheet.larghezzaAnta),
      });
      rows.push({
        element: t('cuts.rows.anteAltezza'),
        quantity: sheet.numeroAnte,
        length: formatMm(sheet.altezzaAnta),
      });

      rows.push({
        element: t('cuts.rows.profiliOrizzontali'),
        quantity: sheet.pezziProfiloOrizzontale,
        length: formatMm(sheet.lunghezzaProfiloOrizzontale),
      });
      rows.push({
        element: t('cuts.rows.profiliVerticali'),
        quantity: sheet.pezziProfiloVerticale,
        length: formatMm(sheet.altezzaProfiloVerticale),
      });

      rows.push({
        element: t('cuts.rows.coverSenzaSpazzolino'),
        quantity: sheet.pezziCoverVerticaleSenzaSpazzolino,
        length: formatMm(sheet.altezzaCoverVerticale),
      });
      if (sheet.pezziCoverVerticaleConSpazzolino > 0) {
        rows.push({
          element: t('cuts.rows.coverConSpazzolino'),
          quantity: sheet.pezziCoverVerticaleConSpazzolino,
          length: formatMm(sheet.altezzaCoverVerticale),
        });
      }

      rows.push({
        element: t('cuts.rows.vetriAnte'),
        quantity: sheet.numeroAnte,
        length: t('misc.mmPair', {
          width: formatMillimeters(sheet.larghezzaVetro),
          height: formatMillimeters(sheet.altezzaVetro),
        }),
      });

      if (sheet.pannelloFisso === 'Si' && sheet.numeroPannelliFissi > 0) {
        rows.push({
          element: t('cuts.rows.pannelliFissi'),
          quantity: sheet.numeroPannelliFissi,
          length: t('misc.mmPair', {
            width: formatMillimeters(sheet.larghezzaPannelloFisso),
            height: formatMillimeters(sheet.altezzaAnta),
          }),
        });
        rows.push({
          element: t('cuts.rows.vetriPannelliFissi'),
          quantity: sheet.numeroPannelliFissi,
          length: t('misc.mmPair', {
            width: formatMillimeters(sheet.larghezzaVetroFisso),
            height: formatMillimeters(sheet.altezzaVetroFisso),
          }),
        });
        if (sheet.lunghezzaProfiloSuperioreFissi > 0) {
          rows.push({
            element: t('cuts.rows.profiloSuperioreFissi'),
            quantity: 1,
            length: formatMm(sheet.lunghezzaProfiloSuperioreFissi),
          });
        }
      }

      rows.push({
        element: t('cuts.rows.ingombroProfili'),
        quantity: 1,
        length: formatMm(sheet.ingombroProfiliScorrimento),
      });
      rows.push({
        element: t('cuts.rows.ingombroTotale'),
        quantity: 1,
        length: formatMm(sheet.ingombroTotaleProfiliCover),
      });

      if (sheet.traversino === 'Si' && sheet.traversinoMeters > 0) {
        rows.push({
          element: t('cuts.rows.traversino'),
          quantity: 1,
          length: t('misc.meters', { value: formatMeters(sheet.traversinoMeters) }),
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

  const formatMmValue = (value) => `${formatMillimeters(value)} mm`;

  const cuts = [
    { element: t('cuts.rows.montantiVerticali'), quantity: leaves * 2, length: formatMmValue(stileLength) },
    { element: t('cuts.rows.traversiOrizzontali'), quantity: leaves * 2, length: formatMmValue(railLength) },
    {
      element: t('cuts.rows.vetriAnteGenerici'),
      quantity: leaves,
      length: t('misc.mmPair', {
        width: formatMillimeters(glassWidth),
        height: formatMillimeters(glassHeight),
      }),
    },
    { element: t('cuts.rows.binarioSuperiore'), quantity: 1, length: formatMmValue(trackLength) },
    { element: t('cuts.rows.guidaInferiore'), quantity: 1, length: formatMmValue(Math.round(leafWidth)) },
  ];

  if (config.pannelloFisso === 'Si') {
    const pannelliCount = Math.max(Number(config.numeroPannelliFissi) || 0, 0);
    if (pannelliCount > 0) {
      cuts.push({
        element: t('cuts.rows.pannelliFissi'),
        quantity: pannelliCount,
        length:
          config.sceltaPannelloFisso === 'manuale' && config.larghezzaPannelloFisso
            ? t('misc.mmPair', {
                width: formatMillimeters(config.larghezzaPannelloFisso),
                height: formatMillimeters(config.height),
              })
            : t('cuts.panelEqual', {
                value: formatMillimeters(effective?.larghezzaAnta || leafWidth),
              }),
      });
    }
  }

  if (config.doorBox === 'Si') {
    cuts.push({
      element: t('cuts.rows.doorBox'),
      quantity: 1,
      length: formatMmValue(Math.round(config.height)),
    });
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
      <td colspan="3">${t('summary.emptyCuts')}</td>
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
      li.textContent = t('quote.itemText', {
        description: item.descrizione,
        code: item.codice,
        quantity: item.quantita,
        unit: formatCurrency(item.prezzo),
        total: formatCurrency(total),
      });
      list.appendChild(li);
    });

    section.appendChild(list);
    selectors.quoteBreakdown.appendChild(section);
  });
}

function buildSelectionSummaryItems(config, derived) {
  const items = [];

  items.push({
    label: t('summary.labels.modello'),
    value: getModelLabel(config.model),
  });

  const environmentLabel = getEnvironmentLabel(config.environment);
  items.push({ label: t('summary.labels.ambientazione'), value: environmentLabel });

  if (config.model === 'SINGOLA') {
    items.push({
      label: t('summary.labels.tipologia'),
      value: getCardLabel(selectors.tipologiaContainer, '.tipologia-option', config.tipologia, config.tipologia),
    });
  }

  const rawNumeroAnte = Number(derived?.numeroAnte ?? config.numeroAnte ?? config.leaves ?? 0);
  items.push({
    label: t('summary.labels.numeroAnte'),
    value: Number.isFinite(rawNumeroAnte) ? rawNumeroAnte : '—',
  });

  const rawNumeroBinari = Number(derived?.numeroBinari ?? 0);
  items.push({
    label: t('summary.labels.numeroBinari'),
    value: Number.isFinite(rawNumeroBinari) ? rawNumeroBinari : '—',
  });

  const aperturaLabel = getCardLabel(
    selectors.aperturaAnteContainer,
    '.apertura-ante-option',
    config.aperturaAnte,
    config.aperturaAnte || '—'
  );
  items.push({ label: t('summary.labels.apertura'), value: aperturaLabel });

  items.push({ label: t('summary.labels.montaggio'), value: derived?.montaggioEffettivo || config.montaggio || '—' });

  const doorBoxValue =
    config.doorBox === 'Si'
      ? config.doorBoxMounting
        ? `${t('misc.yes')} (${config.doorBoxMounting})`
        : t('misc.yes')
      : t('misc.no');
  items.push({ label: t('summary.labels.doorBox'), value: doorBoxValue });

  items.push({ label: t('summary.labels.binario'), value: getBinarioLabel(config.binario) });

  const lengthLabel =
    derived?.lunghezzaBinarioLabel ||
    (derived?.lunghezzaBinarioMetri
      ? t('form.lunghezzaBinario.optionLabel', { value: formatMetersValue(derived.lunghezzaBinarioMetri) })
      : t('misc.none'));
  items.push({ label: t('summary.labels.lunghezzaBinario'), value: lengthLabel });

  const traversinoMeters = Number(config.traversinoMeters) || 0;
  const traversinoValue =
    config.traversino === 'Si'
      ? traversinoMeters > 0
        ? `${t('misc.yes')} (${t('misc.meters', { value: traversinoMeters })})`
        : t('misc.yes')
      : t('misc.no');
  items.push({ label: t('summary.labels.traversino'), value: traversinoValue });

  items.push({ label: t('summary.labels.finitura'), value: t('summary.defaults.finitura') });
  items.push({ label: t('summary.labels.spessoreVetro'), value: t('summary.defaults.spessoreVetro') });

  if (config.width && config.height) {
    items.push({
      label: t('summary.labels.dimensioniVano'),
      value: t('misc.mmPair', { width: config.width, height: config.height }),
    });
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
  let extraTrackLeftMm = 0;
  let extraTrackRightMm = 0;
  if (totalTrackExtraMm > 0) {
    if (config.anteNascoste === 'Si') {
      if (openingMode === 'single-left') {
        extraTrackLeftMm = totalTrackExtraMm;
      } else if (openingMode === 'single-right') {
        extraTrackRightMm = totalTrackExtraMm;
      } else {
        extraTrackRightMm = totalTrackExtraMm;
      }
    } else if (openingMode === 'single-left') {
      extraTrackLeftMm = totalTrackExtraMm;
    } else if (openingMode === 'single-right') {
      extraTrackRightMm = totalTrackExtraMm;
    } else {
      extraTrackLeftMm = totalTrackExtraMm / 2;
      extraTrackRightMm = totalTrackExtraMm - extraTrackLeftMm;
    }
  }

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
  const finalStepIndex = formSteps.length ? formSteps.length - 1 : -1;
  const isFinalStepActive = finalStepIndex >= 0 && currentStepIndex === finalStepIndex;
  const shouldAlert = force || isFinalStepActive;

  if (quote.error) {
    derived = quote.derived || derived;
    if (shouldAlert) {
      alert(resolveMessage(quote.error));
    }
    return;
  }

  derived = quote.derived || derived;
  updateVisualizerPreview(config, derived);

  const cuts = calculateCuts(config, derived);

  if (selectors.quoteTotal) {
    selectors.quoteTotal.textContent = t('totals.totalFormatted', { value: formatCurrency(quote.total) });
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
    alert(resolveMessage(quote.error));
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
    alert(t('alerts.pdfUnavailable'));
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
  pdf.text(t('pdf.title'), margin, 20);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.text(new Date().toLocaleDateString(getCurrentLocale()), pageWidth - margin, 20, { align: 'right' });

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
  pdf.text(t('pdf.summaryTitle'), margin, cursorY);
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
    pdf.text(t('fullSummary.emptyQuote'), margin + 10, cursorY + placeholderHeight / 2 + 3);
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
    pdf.text(t('pdf.tableHeaders.description'), columnPositions.description, headerY + headerRowHeight - 2);
    pdf.text(t('pdf.tableHeaders.code'), columnPositions.code, headerY + headerRowHeight - 2);
    pdf.text(t('pdf.tableHeaders.quantity'), columnPositions.quantity, headerY + headerRowHeight - 2);
    pdf.text(t('pdf.tableHeaders.unit'), columnPositions.unit, headerY + headerRowHeight - 2);
    pdf.text(t('pdf.tableHeaders.total'), columnPositions.total, headerY + headerRowHeight - 2);

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
  pdf.text(t('pdf.totalLabel'), margin + 8, cursorY + totalBoxHeight / 2 + 3);

  pdf.setFontSize(14);
  pdf.setTextColor(palette.accent[0], palette.accent[1], palette.accent[2]);
  pdf.text(t('totals.totalFormatted', { value: formatCurrency(total) }), margin + contentWidth - 8, cursorY + totalBoxHeight / 2 + 3, {
    align: 'right',
  });

  cursorY += totalBoxHeight + 6;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(palette.muted[0], palette.muted[1], palette.muted[2]);
  const disclaimerLines = pdf.splitTextToSize(t('pdf.disclaimer'), contentWidth);
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
    alert(resolveMessage(quote.error));
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
    alert(t('alerts.popupBlocked'));
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
  const locale = getCurrentLocale();
  const now = new Date().toLocaleString(locale);
  const noneLabel = t('misc.none');

  const summaryCards = Array.isArray(summaryItems) && summaryItems.length > 0
    ? summaryItems
        .map((item) => {
          const label = escapeHtml(item.label || '');
          const value = escapeHtml(item.value || noneLabel);
          return `
            <article class="full-summary__fact">
              <p class="full-summary__fact-label">${label}</p>
              <p class="full-summary__fact-value">${value}</p>
            </article>
          `;
        })
        .join('')
    : '';

  const summaryContent = summaryCards || `<p class="full-summary__empty">${escapeHtml(t('fullSummary.emptySummary'))}</p>`;

  const numberFormatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const itemLabels = t('fullSummary.itemLabels') || {};
  const quantityLabel = escapeHtml(itemLabels.quantity || '');
  const unitPriceLabel = escapeHtml(itemLabels.unitPrice || '');
  const totalLabelText = escapeHtml(itemLabels.total || '');
  const codeLabel = escapeHtml(itemLabels.code || '');

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
                  : String(item.quantita ?? noneLabel)
              );
              const unitPriceDisplay = escapeHtml(
                Number.isFinite(unitPriceValue) ? formatCurrency(unitPriceValue) : formatCurrency(0)
              );
              const totalDisplayLine = escapeHtml(
                Number.isFinite(totalLine) ? formatCurrency(totalLine) : formatCurrency(0)
              );
              const imageSrc = escapeHtml(getQuoteItemImage(item));
              const description = escapeHtml(resolveMessage(item.descrizione || noneLabel));
              const code = escapeHtml(item.codice || noneLabel);

              return `
                <li class="full-summary__item">
                  <div class="full-summary__item-media">
                    <img src="${imageSrc}" alt="${description}" loading="lazy" />
                  </div>
                  <div class="full-summary__item-body">
                    <h4>${description}</h4>
                    <p class="full-summary__item-code">${codeLabel}: <strong>${code}</strong></p>
                    <div class="full-summary__item-meta">
                      <span>${quantityLabel}: <strong>${quantityDisplay}</strong></span>
                      <span>${unitPriceLabel}: <strong>${unitPriceDisplay}</strong></span>
                      <span>${totalLabelText}: <strong>${totalDisplayLine}</strong></span>
                    </div>
                  </div>
                </li>
              `;
            })
            .filter(Boolean)
            .join('');

          if (!itemsMarkup) {
            return '';
          }

          const categoryLabel = escapeHtml(resolveMessage(category.label || ''));

          return `
            <section class="full-summary__category">
              <h3>${categoryLabel}</h3>
              <ul class="full-summary__items">
                ${itemsMarkup}
              </ul>
            </section>
          `;
        })
        .filter(Boolean)
        .join('')
    : '';

  const categoriesContent =
    categorySections || `<p class="full-summary__empty">${escapeHtml(t('fullSummary.emptyQuote'))}</p>`;

  const cutsHeaders = t('fullSummary.cutsHeaders') || {};
  const elementHeader = escapeHtml(
    cutsHeaders.element || t('summary.tableHeaders.element') || t('fullSummary.itemLabels.code')
  );
  const quantityHeader = escapeHtml(cutsHeaders.quantity || t('summary.tableHeaders.quantity'));
  const lengthHeader = escapeHtml(cutsHeaders.length || t('summary.tableHeaders.length'));

  const cutsContent = Array.isArray(cuts) && cuts.length > 0
    ? `
        <table class="full-summary__cuts-table">
          <thead>
            <tr>
              <th>${elementHeader}</th>
              <th>${quantityHeader}</th>
              <th>${lengthHeader}</th>
            </tr>
          </thead>
          <tbody>
            ${cuts
              .map((row) => {
                const element = escapeHtml(resolveMessage(row.element || noneLabel));
                const quantity = escapeHtml(String(row.quantity ?? noneLabel));
                const length = escapeHtml(String(row.length ?? noneLabel));
                return `<tr><td>${element}</td><td>${quantity}</td><td>${length}</td></tr>`;
              })
              .join('')}
          </tbody>
        </table>
      `
    : `<p class="full-summary__empty">${escapeHtml(t('fullSummary.emptyCuts'))}</p>`;

  const snapshotMarkup = snapshot
    ? `
        <section class="full-summary__panel full-summary__panel--snapshot">
          <h2>${escapeHtml(t('fullSummary.snapshotTitle'))}</h2>
          <div class="full-summary__snapshot">
            <img src="${escapeHtml(snapshot)}" alt="${escapeHtml(t('fullSummary.snapshotAlt'))}" />
          </div>
        </section>
      `
    : '';

  const totalDisplay = escapeHtml(formatCurrency(total));
  const documentTitle = escapeHtml(t('fullSummary.title'));
  const eyebrow = escapeHtml(t('fullSummary.eyebrow'));
  const generatedAt = escapeHtml(t('fullSummary.generatedAt', { value: now }));
  const totalLabel = escapeHtml(t('fullSummary.totalLabel'));
  const totalSuffix = escapeHtml(t('fullSummary.totalSuffix'));
  const printLabel = escapeHtml(t('fullSummary.print'));

  return `<!DOCTYPE html>
<html lang="${escapeHtml(currentLanguage)}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${documentTitle}</title>
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
          <p class="full-summary__eyebrow">${eyebrow}</p>
          <h1>${documentTitle}</h1>
          <p class="full-summary__meta">${generatedAt}</p>
        </div>
        <div class="full-summary__total">
          <span>${totalLabel}</span>
          <strong>${totalDisplay}</strong>
          <p>${totalSuffix}</p>
          <button type="button" onclick="window.print()">${printLabel}</button>
        </div>
      </header>
      ${snapshotMarkup}
      <section class="full-summary__panel">
        <h2>${escapeHtml(t('fullSummary.configTitle'))}</h2>
        <div class="full-summary__grid">${summaryContent}</div>
      </section>
      <section class="full-summary__panel">
        <h2>${escapeHtml(t('fullSummary.quoteTitle'))}</h2>
        ${categoriesContent}
      </section>
      <section class="full-summary__panel">
        <h2>${escapeHtml(t('fullSummary.cutsTitle'))}</h2>
        ${cutsContent}
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

initializeLanguageSwitcher();
setupMobileNav();

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

selectors.environmentControl?.addEventListener('change', (event) => {
  const value = event.target.value || 'soloporta';
  if (selectors.environmentInput) {
    selectors.environmentInput.value = value;
  }
  refreshOutputs();
});

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
if (selectors.environmentControl) {
  selectors.environmentControl.value = selectors.environmentInput?.value || 'soloporta';
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
