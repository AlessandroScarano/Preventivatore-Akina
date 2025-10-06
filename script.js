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

// Prezzi per finitura (addizionale EUR)
const prezziFinitura = {
    'verniciata': 50,
    'laminata': 40,
    'naturale': 0,
    'laccata': 80
};

// Costo taglio per cm lineare
const costoTaglioCm = 2.5;

// Prezzi accessori (già definiti nell'HTML)
const prezziAccessori = {
    'maniglia': 50,
    'serratura': 80,
    'cerniere': 60,
    'verniciatura-extra': 100,
    'installazione': 150
};

// Inizializzazione
document.addEventListener('DOMContentLoaded', function() {
    // Gestione checkbox taglio su misura
    const taglioSuMisura = document.getElementById('taglio-su-misura');
    const tagliSection = document.getElementById('tagli-section');
    
    taglioSuMisura.addEventListener('change', function() {
        if (this.checked) {
            tagliSection.style.display = 'block';
        } else {
            tagliSection.style.display = 'none';
            // Reset campi taglio
            document.getElementById('taglio-alto').value = 0;
            document.getElementById('taglio-basso').value = 0;
            document.getElementById('taglio-sinistro').value = 0;
            document.getElementById('taglio-destro').value = 0;
        }
    });

    // Gestione submit form
    const form = document.getElementById('preventivatore-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calcolaPreventivo();
    });

    // Gestione reset
    document.getElementById('reset-btn').addEventListener('click', function() {
        form.reset();
        tagliSection.style.display = 'none';
        document.getElementById('risultato').style.display = 'none';
    });

    // Gestione nuovo preventivo
    document.getElementById('nuovo-preventivo-btn').addEventListener('click', function() {
        document.getElementById('risultato').style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Gestione stampa
    document.getElementById('stampa-btn').addEventListener('click', function() {
        window.print();
    });
});

function calcolaPreventivo() {
    // Raccolta dati
    const tipoPorta = document.getElementById('tipo-porta').value;
    const materiale = document.getElementById('materiale').value;
    const finitura = document.getElementById('finitura').value;
    
    const altezza = parseFloat(document.getElementById('altezza').value);
    const larghezza = parseFloat(document.getElementById('larghezza').value);
    const spessore = parseFloat(document.getElementById('spessore').value);
    
    const taglioSuMisura = document.getElementById('taglio-su-misura').checked;
    const taglioAlto = taglioSuMisura ? parseFloat(document.getElementById('taglio-alto').value) : 0;
    const taglioBasso = taglioSuMisura ? parseFloat(document.getElementById('taglio-basso').value) : 0;
    const taglioSinistro = taglioSuMisura ? parseFloat(document.getElementById('taglio-sinistro').value) : 0;
    const taglioDestro = taglioSuMisura ? parseFloat(document.getElementById('taglio-destro').value) : 0;
    
    // Validazione
    if (!tipoPorta || !materiale || !altezza || !larghezza) {
        alert('Per favore, compila tutti i campi obbligatori');
        return;
    }
    
    // Calcolo dimensioni finali
    const altezzaFinale = altezza - taglioAlto - taglioBasso;
    const larghezzaFinale = larghezza - taglioSinistro - taglioDestro;
    const areaTotale = (altezzaFinale * larghezzaFinale) / 10000; // m²
    
    // Validazione dimensioni finali
    if (altezzaFinale < 180 || larghezzaFinale < 60) {
        alert('Attenzione: le dimensioni finali sono troppo piccole per una porta standard!');
    }
    
    // Calcolo costi
    let costiDettagliati = [];
    let totale = 0;
    
    // 1. Costo base porta
    const costoBasePorta = prezziBase[tipoPorta] || 300;
    costiDettagliati.push({
        descrizione: `Porta ${tipoPorta}`,
        costo: costoBasePorta
    });
    totale += costoBasePorta;
    
    // 2. Costo materiale (moltiplicatore sul totale attuale)
    const moltiplicatoreMateriale = moltiplicatoriMateriale[materiale] || 1.0;
    const costoMateriale = costoBasePorta * (moltiplicatoreMateriale - 1);
    if (costoMateriale > 0) {
        costiDettagliati.push({
            descrizione: `Materiale ${materiale}`,
            costo: costoMateriale
        });
        totale += costoMateriale;
    }
    
    // 3. Costo finitura
    if (finitura && prezziFinitura[finitura]) {
        const costoFinitura = prezziFinitura[finitura];
        costiDettagliati.push({
            descrizione: `Finitura ${finitura}`,
            costo: costoFinitura
        });
        totale += costoFinitura;
    }
    
    // 4. Costo dimensioni extra (se supera dimensioni standard)
    const areaDimensioneExtra = Math.max(0, areaTotale - 2.0); // oltre 2 m²
    if (areaDimensioneExtra > 0) {
        const costoDimensioneExtra = areaDimensioneExtra * 100;
        costiDettagliati.push({
            descrizione: `Dimensione extra (+${areaDimensioneExtra.toFixed(2)} m²)`,
            costo: costoDimensioneExtra
        });
        totale += costoDimensioneExtra;
    }
    
    // 5. Costo tagli
    if (taglioSuMisura) {
        const taglioTotale = taglioAlto + taglioBasso + taglioSinistro + taglioDestro;
        const costoTaglio = taglioTotale * costoTaglioCm;
        costiDettagliati.push({
            descrizione: `Tagli su misura (${taglioTotale.toFixed(1)} cm)`,
            costo: costoTaglio
        });
        totale += costoTaglio;
    }
    
    // 6. Accessori
    const accessori = ['maniglia', 'serratura', 'cerniere', 'verniciatura-extra'];
    accessori.forEach(accessorio => {
        const checkbox = document.getElementById(accessorio);
        if (checkbox.checked) {
            const nomeAccessorio = checkbox.parentElement.textContent.trim().split('(')[0].trim();
            costiDettagliati.push({
                descrizione: nomeAccessorio,
                costo: prezziAccessori[accessorio]
            });
            totale += prezziAccessori[accessorio];
        }
    });
    
    // 7. Installazione
    const installazione = document.getElementById('installazione');
    if (installazione.checked) {
        costiDettagliati.push({
            descrizione: 'Installazione professionale',
            costo: prezziAccessori['installazione']
        });
        totale += prezziAccessori['installazione'];
    }
    
    // Mostra risultati
    mostraRisultati(altezzaFinale, larghezzaFinale, areaTotale, costiDettagliati, totale);
}

function mostraRisultati(altezzaFinale, larghezzaFinale, areaTotale, costiDettagliati, totale) {
    // Aggiorna dimensioni finali
    document.getElementById('altezza-finale').textContent = `${altezzaFinale.toFixed(1)} cm`;
    document.getElementById('larghezza-finale').textContent = `${larghezzaFinale.toFixed(1)} cm`;
    document.getElementById('area-totale').textContent = `${areaTotale.toFixed(2)} m²`;
    
    // Aggiorna dettaglio costi
    const dettaglioCosti = document.getElementById('dettaglio-costi');
    dettaglioCosti.innerHTML = '';
    
    costiDettagliati.forEach(item => {
        const div = document.createElement('div');
        div.className = 'risultato-item';
        div.innerHTML = `
            <span class="label">${item.descrizione}:</span>
            <span class="value">€ ${item.costo.toFixed(2)}</span>
        `;
        dettaglioCosti.appendChild(div);
    });
    
    // Aggiorna totale
    document.getElementById('prezzo-totale').textContent = `€ ${totale.toFixed(2)}`;
    
    // Mostra sezione risultati
    const risultato = document.getElementById('risultato');
    risultato.style.display = 'block';
    
    // Scroll alla sezione risultati
    risultato.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Funzioni utility per validazione in tempo reale
document.addEventListener('DOMContentLoaded', function() {
    // Validazione dimensioni
    const altezza = document.getElementById('altezza');
    const larghezza = document.getElementById('larghezza');
    
    altezza.addEventListener('change', function() {
        if (this.value < 180) {
            alert('Attenzione: l\'altezza minima consigliata è 180 cm');
        }
    });
    
    larghezza.addEventListener('change', function() {
        if (this.value < 60) {
            alert('Attenzione: la larghezza minima consigliata è 60 cm');
        }
    });
});
