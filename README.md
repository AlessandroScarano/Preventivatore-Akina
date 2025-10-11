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

Il visualizzatore Three.js utilizza modelli GLB per profili, cover e binari della porta. Per evitare errori di CORS, gli asset devono essere
serviti dalla **stessa origine** del configuratore.

1. Crea (o utilizza quella già presente) la cartella `profili3dakina/` **nella radice del progetto**, allo stesso livello di `index.html` e `app.js`.

   L'albero dovrebbe risultare, ad esempio:

   ```
   Preventivatore-Akina/
   ├── app.js
   ├── index.html
   ├── profili3dakina/
   │   ├── profiloVertSx.glb
   │   ├── profiloVertDx.glb
   │   ├── profiloOrizzSup.glb
   │   ├── profiloOrizzInf.glb
   │   ├── binario.glb
   │   ├── coverSx.glb
   │   └── coverDx.glb
   └── styles.css
   ```

2. Copia all'interno di `profili3dakina/` i file GLB dei profili e degli accessori della porta (ad esempio `profiloVertSx.glb`, `profiloVertDx.glb`, `binario.glb`, `coverSx.glb`, `coverDx.glb`).
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

### Guida passo passo per GitHub Codespaces

Se stai lavorando dal tuo Codespace, segui questi passaggi per preparare gli asset e avviare l'anteprima:

1. **Apri il pannello Explorer** (icona della cartella nella barra laterale sinistra).
2. **Crea la cartella**:
   - Fai clic con il tasto destro sul nome della cartella del progetto (es. `Preventivatore-Akina`).
   - Seleziona `New Folder` e chiamala `profili3dakina`.
3. **Carica i file GLB**:
   - Fai clic con il tasto destro sulla nuova cartella `profili3dakina`.
   - Seleziona `Upload...` e scegli dal tuo computer tutti i file `.glb` forniti (puoi selezionarli in blocco).
   - Verifica che i file compaiano nella cartella (puoi espanderla nell'Explorer per controllare).
4. **Installa le dipendenze** (se non lo hai già fatto in questo Codespace):
   ```bash
   npm install
   ```
   > Questo comando prepara l'ambiente locale installando le dipendenze del server di anteprima.
5. **Avvia il server di anteprima**:
   ```bash
   node preview.js
   ```
   - Codespaces aprirà automaticamente una porta in ascolto (di default `4173`).
   - Nel toast che compare in basso a destra, scegli **Open in Browser** per visualizzare l'app.
6. **Testa il caricamento**:
   - Se gli asset sono raggiungibili, l'overlay di caricamento arriverà al 100% e vedrai la porta 3D.
   - Se vedi l'avviso di asset mancanti, ricontrolla che i file `.glb` siano nella cartella `profili3dakina/` e che il server sia ancora in esecuzione.

> 💡 Suggerimento: quando hai finito, interrompi il server con `Ctrl + C` nel terminale. Ricorda di **committare** i file `.glb` solo se il repository deve contenerli; in caso contrario mantienili locali.

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
