# Guida Rapida - Preventivatore Porte Akina

## Avvio Rapido

### Aprire l'applicazione
1. Apri il file `index.html` nel tuo browser web preferito (Chrome, Firefox, Safari, Edge)
2. Non è necessaria alcuna installazione o server web per l'uso locale

### Alternativa: Usare un server locale
Se preferisci usare un server locale:

```bash
# Con Python 3
python3 -m http.server 8080

# Con PHP
php -S localhost:8080

# Con Node.js (http-server)
npx http-server -p 8080
```

Poi apri `http://localhost:8080` nel browser.

## Come usare il preventivatore

### 1. Dati Cliente
Inserisci i dati del cliente:
- Nome cliente (obbligatorio)
- Email (opzionale)
- Telefono (opzionale)

### 2. Specifiche Porta
Seleziona le caratteristiche della porta:
- **Tipo Porta**: Standard (€300), Blindata (€800), Interna (€200), Scorrevole (€450)
- **Materiale**: Legno (1.0x), Alluminio (1.3x), PVC (0.9x), Legno Massello (1.5x)
- **Finitura**: Verniciata (+€50), Laminata (+€40), Naturale (€0), Laccata (+€80)

### 3. Dimensioni e Tagli
Inserisci le dimensioni della porta:
- **Altezza**: da 180 a 250 cm
- **Larghezza**: da 60 a 120 cm
- **Spessore**: da 30 a 80 mm (default: 40mm)

Se necessario taglio su misura:
1. Spunta "Taglio su misura necessario"
2. Inserisci i tagli per ogni lato:
   - Taglio Alto (cm)
   - Taglio Basso (cm)
   - Taglio Sinistro (cm)
   - Taglio Destro (cm)

**Costo taglio**: €2.50 per cm lineare

### 4. Accessori
Seleziona gli accessori opzionali:
- Maniglia: €50
- Serratura: €80
- Cerniere Premium: €60
- Verniciatura Extra: €100

### 5. Installazione
- Spunta l'opzione se richiedi installazione professionale: €150

### 6. Calcola Preventivo
Clicca su "Calcola Preventivo" per vedere:
- **Dimensioni Finali**: Altezza, larghezza e area dopo i tagli
- **Dettaglio Costi**: Lista itemizzata di tutti i costi
- **Totale**: Prezzo finale comprensivo di tutto

### 7. Azioni disponibili
- **Stampa Preventivo**: Stampa o salva come PDF il preventivo
- **Nuovo Preventivo**: Nascondi i risultati per creare un nuovo preventivo
- **Azzera**: Resetta completamente il form

## Esempi di Preventivo

### Esempio 1: Porta Standard Base
- Tipo: Standard
- Materiale: Legno
- Finitura: Naturale
- Dimensioni: 210x90 cm
- Nessun taglio
- Nessun accessorio
**Totale: €300**

### Esempio 2: Porta Completa con Tagli
- Tipo: Standard
- Materiale: Legno
- Finitura: Verniciata
- Dimensioni: 210x90 cm
- Tagli: Alto 5cm, Basso 3cm (totale 8cm)
- Accessori: Maniglia, Serratura
- Installazione: Sì
**Totale: €650**

### Esempio 3: Porta Blindata Premium
- Tipo: Blindata
- Materiale: Legno Massello
- Finitura: Laccata
- Dimensioni: 220x100 cm
- Accessori: Maniglia, Serratura, Cerniere Premium, Verniciatura Extra
- Installazione: Sì
**Totale stimato: €1,620+**

## Formule di Calcolo

### Costo Base
```
Costo Base = Prezzo Tipo Porta × Moltiplicatore Materiale
```

### Costo Tagli
```
Costo Tagli = (Taglio Alto + Taglio Basso + Taglio Sinistro + Taglio Destro) × €2.50
```

### Dimensioni Finali
```
Altezza Finale = Altezza Iniziale - Taglio Alto - Taglio Basso
Larghezza Finale = Larghezza Iniziale - Taglio Sinistro - Taglio Destro
Area = (Altezza Finale × Larghezza Finale) / 10000 m²
```

### Costo Dimensioni Extra
Se l'area supera i 2 m²:
```
Costo Extra = (Area - 2.0) × €100
```

### Totale Finale
```
Totale = Costo Base + Costo Materiale + Finitura + Tagli + Accessori + Installazione + Dimensioni Extra
```

## Note Importanti

- Le dimensioni minime consigliate sono 180 cm di altezza e 60 cm di larghezza
- Il sistema ti avviserà se le dimensioni finali sono troppo piccole dopo i tagli
- Tutti i prezzi sono in Euro (€)
- I preventivi possono essere stampati direttamente dal browser
- Non è necessaria connessione internet per utilizzare il tool
- Tutti i calcoli vengono effettuati localmente nel browser

## Personalizzazione Prezzi

Per modificare i prezzi, apri il file `script.js` e modifica le costanti all'inizio:

```javascript
// Prezzi base per tipo di porta (EUR)
const prezziBase = {
    'standard': 300,
    'blindata': 800,
    'interna': 200,
    'scorrevole': 450
};

// Prezzi per materiale (moltiplicatore)
const moltiplicatoriMateriale = {
    'legno': 1.0,
    'alluminio': 1.3,
    'pvc': 0.9,
    'legno-massello': 1.5
};

// E così via...
```

## Supporto Browser

Il tool è compatibile con:
- ✅ Chrome/Edge (versioni recenti)
- ✅ Firefox (versioni recenti)
- ✅ Safari (versioni recenti)
- ✅ Browser mobile (iOS Safari, Chrome Mobile)

## Risoluzione Problemi

### Il form non si carica
- Verifica che tutti i file (index.html, styles.css, script.js) siano nella stessa cartella
- Controlla la console del browser per eventuali errori (F12)

### I calcoli non funzionano
- Assicurati che JavaScript sia abilitato nel browser
- Verifica che tutti i campi obbligatori siano compilati

### La stampa non funziona correttamente
- Usa la funzione "Stampa Preventivo" invece di Ctrl+P
- Verifica le impostazioni della stampante/PDF

## Contatti

Per assistenza o domande sul Preventivatore Porte Akina, contattare il team di supporto.
