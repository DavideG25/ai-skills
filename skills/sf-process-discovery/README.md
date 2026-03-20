# sf-process-discovery

Analizza cosa succede in un org Salesforce quando si verifica un evento su un oggetto. Lancia agenti paralleli per scansionare trigger, flow, validation rules e integrazioni, segue le catene indirette e restituisce una mappa di processo ordinata per execution order.

## Come si usa

```
/sf-process-discovery cosa succede quando un'Opportunity cambia Stage?
/sf-process-discovery impact analysis su Account insert
/sf-process-discovery mappami il processo di creazione Quote
```

Funziona in italiano e in inglese. Si adatta all'interlocutore: linguaggio business per utenti funzionali, tecnico per sviluppatori.

## Output

- **Mappa di processo** ordinata per Salesforce order of execution
- **Chain reactions**: cosa scatta in cascata (fino a 3 livelli)
- **Impact analysis**: cosa si rompe, cosa potrebbe essere impattato, cosa è sicuro
- **Test checklist**: scenari funzionali da verificare (focus su test di processo, non tecnici)
- **Regression tests**: processi esistenti da ri-verificare dopo una modifica

## Modalità

- **deep** (default): scansione completa, segue catene indirette, salva la mappa in `.claude/sf-execution-map.md`
- **quick**: solo impact + test di primo livello, non salva

## Come funziona internamente

1. Controlla se esiste già una mappa salvata aggiornata per lo scenario richiesto
2. Se non esiste o è obsoleta, lancia in parallelo 4 agenti di scansione:
   - `sf-trigger-scanner` — trigger Apex
   - `sf-flow-scanner` — Flow
   - `sf-validation-scanner` — Validation Rules
   - `sf-integration-scanner` — Callout, Platform Event, MuleSoft
3. Assembla i risultati nell'ordine di esecuzione Salesforce
4. Segue le catene indirette (field scritti → altre automazioni)
5. Salva la mappa per riuso futuro

## File generati

- `.claude/sf-execution-map.md` — mappa cumulativa di tutti gli scenari analizzati (in deep mode)