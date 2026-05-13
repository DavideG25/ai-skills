# sf-plan

Analisi tecnica e piano di implementazione per un ticket Salesforce.
Crea il branch, analizza il codice, propone un piano e aspetta approvazione prima di toccare qualsiasi file.

## Trigger

Usa questa skill quando:
- "analizza il ticket X"
- "pianifica lo sviluppo di X"
- "prima di implementare, fammi vedere il piano"
- "sf-plan CPQ-2236"

## Flusso

| Step | Cosa fa | Si ferma? |
|------|---------|-----------|
| 1. Branch | Crea il feature branch via `/feature` | No |
| 2. Analisi | Esplora il codice rilevante (agente o diretta) | No |
| 3. Piano | Scrive `.claude/plans/<TICKET>.md` e lo mostra | **Sì — aspetta ok** |
| 4. Implementazione | Esegue tutte le modifiche del piano | No |

## Analisi: agente o diretta?

- **Agente `Explore`**: se la ricerca coinvolge più di 3 file o pattern non noti
- **Grep/Read diretto**: se la ricerca è semplice e localizzata

## Output

Il piano in `.claude/plans/<TICKET>.md` contiene:
- Cosa cambia e perché
- Lista file da modificare/creare con modifica precisa per ciascuno
- Rischi e dipendenze

## Note

- La skill non modifica mai codice prima dell'approvazione esplicita
- La cartella `.claude/` è in `.gitignore` — i piani non appaiono nelle git changes
- L'implementazione parte solo con conferma esplicita: "vai", "ok", "procedi"
