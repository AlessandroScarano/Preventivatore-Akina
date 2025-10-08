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
