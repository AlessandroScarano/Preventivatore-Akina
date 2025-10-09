# Preventivatore Akina

Applicazione web responsive per configurare e preventivare la porta Akina con un flusso guidato ispirato al configuratore ufficiale Glasscom.

## Funzionalità principali

- **Configuratore multi-step** con le stesse domande del flusso Glasscom: dimensioni del vano, tipologia di apertura, sistemi di scorrimento, finiture, vetri e accessori.
- **Calcolo economico dettagliato** con scomposizione di struttura base, scorrimento, finiture, maniglie e accessori opzionali.
- **Generazione automatica dei tagli dei profili** per montanti, traversi, vetro e componenti di scorrimento.
- **Visualizzatore 3D in Three.js** sincronizzato con le scelte estetiche per avere un'anteprima interattiva della porta.
- **Layout responsive** con interfaccia glassmorphism, compatibile con desktop, tablet e mobile.

## Avvio

1. Clona il repository o scarica i sorgenti.
2. Per un'anteprima rapida avvia il server locale incluso:

   ```bash
   node preview.js
   ```

   L'applicazione sarà disponibile su [http://localhost:4173](http://localhost:4173).

3. In alternativa apri direttamente `index.html` in un browser moderno (Chrome, Edge, Firefox o Safari).

## Asset 3D

Il visualizzatore Three.js utilizza modelli GLB per profili, cover e ambienti. Per evitare errori di CORS, gli asset devono essere
serviti dalla **stessa origine** del configuratore.

1. Crea (o utilizza quella già presente) la cartella `profili3dakina/` **nella radice del progetto**, allo stesso livello di `index.html` e `app.js`.

   L'albero dovrebbe risultare, ad esempio:

   ```
   Preventivatore-Akina/
   ├── app.js
   ├── index.html
   ├── profili3dakina/
   │   ├── villaclassica.glb
   │   ├── conf3dvillaGL5.glb
   │   └── ...
   └── styles.css
   ```

2. Copia all'interno di `profili3dakina/` tutti i file GLB forniti da Glasscom (es. `villaclassica.glb`, `profiloVertSx.glb`, ecc.).
3. Avviando `node preview.js` gli asset verranno serviti correttamente su `http://localhost:4173/profili3dakina/...`.

Se la pagina è pubblicata in una sottocartella (es. `https://dominio.it/preventivatore/`), assicurati che i file si trovino in
`https://dominio.it/preventivatore/profili3dakina/`. Il visualizzatore mostra un avviso contestuale quando non riesce a raggiungere gli asset.

Se devi caricare i file da un dominio esterno che espone le intestazioni CORS adeguate, definisci le variabili globali prima di
`app.js`:

```html
<script>
  window.AKINA_ASSET_BASE = 'https://cdn.tuo-dominio.it/profili3dakina/';
  window.AKINA_ALLOW_REMOTE_ASSETS = true;
</script>
```

Se gli asset non sono disponibili, il visualizzatore userà automaticamente geometrie procedurali di fallback senza interrompere la
configurazione.

## Tecnologie

- HTML5, CSS3, JavaScript ES Modules
- [Three.js](https://threejs.org/) per la visualizzazione 3D

## Struttura del progetto

```
.
├── app.js         # Logica del configuratore, calcoli e viewer 3D
├── index.html     # Layout e markup dell'applicazione
├── styles.css     # Stili moderni e responsive
├── preview.js     # Server HTTP minimale per l'anteprima locale
└── README.md
```
