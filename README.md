# Preventivatore-Akina

Sistema completo per la preventivazione e il calcolo dei tagli per porte Akina.

## Caratteristiche

- 📝 **Form completo** per inserimento dati cliente e specifiche porta
- 📏 **Calcolo dimensioni finali** con supporto per tagli su misura
- 💰 **Preventivo dettagliato** con breakdown dei costi
- 🎨 **Design professionale** e responsive
- 🖨️ **Funzione di stampa** per preventivi
- ⚡ **Calcolo in tempo reale** senza necessità di backend

## Come usare

1. Apri il file `index.html` nel tuo browser
2. Compila il form con i dati del cliente e le specifiche della porta
3. Inserisci le dimensioni (altezza, larghezza, spessore)
4. Se necessario, attiva "Taglio su misura" e specifica i tagli richiesti
5. Seleziona gli accessori desiderati
6. Clicca su "Calcola Preventivo" per vedere il risultato

## Struttura del progetto

```
Preventivatore-Akina/
├── index.html      # Interfaccia principale con form
├── styles.css      # Stili e layout responsive
├── script.js       # Logica di calcolo e validazione
└── README.md       # Documentazione
```

## Funzionalità di calcolo

### Tipologie di porte supportate
- **Standard**: Porta base (€300)
- **Blindata**: Porta blindata (€800)
- **Interna**: Porta interna (€200)
- **Scorrevole**: Porta scorrevole (€450)

### Materiali disponibili
- **Legno**: Moltiplicatore 1.0x
- **Alluminio**: Moltiplicatore 1.3x
- **PVC**: Moltiplicatore 0.9x
- **Legno Massello**: Moltiplicatore 1.5x

### Finiture
- Verniciata (+€50)
- Laminata (+€40)
- Naturale (€0)
- Laccata (+€80)

### Calcolo tagli
- Costo per taglio: €2.50 per cm lineare
- Supporto per tagli su tutti e quattro i lati (alto, basso, sinistro, destro)
- Calcolo automatico delle dimensioni finali

### Accessori
- Maniglia: €50
- Serratura: €80
- Cerniere Premium: €60
- Verniciatura Extra: €100
- Installazione professionale: €150

## Tecnologie utilizzate

- HTML5
- CSS3 (Grid, Flexbox, Gradients)
- JavaScript (ES6+)
- Design responsive per mobile e desktop

## Validazioni

Il sistema include validazioni per:
- Campi obbligatori (tipo porta, materiale, dimensioni)
- Dimensioni minime (altezza ≥ 180cm, larghezza ≥ 60cm)
- Dimensioni finali dopo i tagli
- Format dei dati (numeri, email, telefono)

## Stampa preventivo

Il sistema include funzionalità di stampa ottimizzata che:
- Nasconde il form e mostra solo i risultati
- Mantiene la formattazione professionale
- Include tutti i dettagli del preventivo

## Personalizzazione

Per modificare i prezzi, modifica le costanti all'inizio del file `script.js`:

```javascript
const prezziBase = {
    'standard': 300,
    'blindata': 800,
    // ...
};
```

## Browser supportati

- Chrome/Edge (ultime 2 versioni)
- Firefox (ultime 2 versioni)
- Safari (ultime 2 versioni)
- Mobile browsers

## Licenza

© 2024 Preventivatore Porte Akina - Tutti i diritti riservati