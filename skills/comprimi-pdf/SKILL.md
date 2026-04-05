---
name: comprimi-pdf
description: >
  Comprime PDF pesanti riducendone le dimensioni, ideale per PDF scansionati o firmati
  digitalmente che non si riescono a mandare per email. Usa questa skill ogni volta che
  l'utente carica un PDF e chiede di comprimerlo, ridurlo, alleggerirlo, o dice che e
  troppo grande per la mail. Trigger tipici: comprimimi questo pdf, e troppo grande,
  riduci il pdf, non riesco a mandarlo per email, alleggerisci questo file.
---

# Comprimi PDF

## Cosa fa
Riduce le dimensioni di un PDF ricomprimendo le immagini interne come JPEG a qualità 70% e 150dpi. Funziona soprattutto su PDF scansionati o firmati digitalmente (dove le pagine sono immagini). La riduzione tipica è del 50-70%.

## Avvertenze da comunicare all'utente
- Il contenuto visivo rimane identico
- Le firme digitali embedded non sono più verificabili criptograficamente nel file compresso — usare l'originale se serve verifica firma
- Per PDF di solo testo vettoriale (es. esportati da Word) la compressione è minima o nulla, ma quelli pesano già poco

## Procedura

### 0. Verifica che il file sia un PDF
Controlla l'estensione del file allegato. Se non è `.pdf`, rispondi immediatamente:
> "Questo non è un PDF — la skill funziona solo con file PDF."
E non procedere oltre.

### 1. Comprimi il PDF
```python
from pdf2image import convert_from_path
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import io, os

input_path = '/mnt/user-data/uploads/NOMEFILE.pdf'
output_path = '/mnt/user-data/outputs/NOMEFILE_small.pdf'

images = convert_from_path(input_path, dpi=150)
c = canvas.Canvas(output_path, pagesize=A4)
w, h = A4

for i, img in enumerate(images):
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=70, optimize=True)
    buf.seek(0)
    c.drawImage(ImageReader(buf), 0, 0, width=w, height=h)
    c.showPage()

c.save()
```

### 2. Mostra risultato e presenta il file
Stampa dimensione originale, dimensione compressa, percentuale di riduzione.
Usa `present_files` per presentare il file all'utente.

### 3. Comunica all'utente
- Dimensioni prima/dopo
- Avvertenza sulle firme digitali se il documento ne contiene
EOF
