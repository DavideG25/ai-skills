# sf-code-review

Review interattiva del codice Apex. Fa due domande prima di partire, poi analizza solo quello che hai selezionato. Produce un report strutturato con problemi, rischi e suggerimenti — non spiega cosa fa il codice, solo cosa non va o si può migliorare.

> Per capire cosa fa una classe usa `/sf-code-explorer`. Per valutarne la qualità usa `/sf-code-review`.

## Come si usa

```
/sf-code-review AccountTriggerHandler
/sf-code-review OpportunityService
/sf-code-review controlla il codice: QuoteLineService
```

Dopo l'invocazione la skill fa due domande:
1. **Scope** — tutta la classe o solo il diff del branch corrente
2. **Focus** — cosa controllare (multi-select): problemi tecnici / dipendenze esterne / ottimizzazioni

## Output

Report Markdown direttamente in chat, strutturato in sezioni in base alle scelte:

```
## A. Technical Issues
🔴 Critical — Governor Limits, bulkification, null safety, pattern
🟡 Warning   — best practice violations, minor risks

## B. External Dependencies
Automazioni che scattano quando questa classe gira (trigger, flow, validation rules)

## C. Optimization Suggestions
Tabella con suggerimenti, impatto e effort stimato

## Summary
Conteggio per severità + raccomandazione finale
```

## Checklist tecnica (sezione A)

**Governor Limits**
- SOQL dentro loop
- DML dentro loop
- Query multiple sullo stesso oggetto consolidabili

**Bulkification**
- Logica per record singolo (`Trigger.new[0]`)
- Tipo collezione errato (List dove serve Map o Set)
- Aggregazioni in Apex invece che in SOQL

**Null Safety**
- Accesso a campi relazionali senza null check (`account.Owner.Email`)
- Trigger context non verificato (before/after, insert/update)
- Risultati SOQL non controllati prima dell'accesso

**Pattern e struttura**
- Logica dentro il trigger invece che nell'handler
- Hardcoded IDs/valori (dovrebbero stare in Custom Metadata o Custom Labels)
- Missing try/catch sui callout
- Metodi troppo lunghi o con responsabilità multiple

**Testing**
- `@SeeAllData=true`
- Test senza asserzioni sul comportamento reale

## Agenti usati internamente

| Agente | Scopo |
|--------|-------|
| `sf-code-analyzer` | Analisi statica: 14 punti su Governor Limits, bulkification, null safety, pattern |
| `sf-optimization-analyzer` | Suggerimenti di ottimizzazione con stima impatto/effort |
| `sf-process-discovery` | Dipendenze esterne — automazioni che scattano sull'oggetto |

## Installazione

Copia in `.claude/` del tuo progetto:
- `skills/sf-code-review/` → `.claude/skills/sf-code-review/`
- `agents/sf-code-analyzer.md` → `.claude/agents/`
- `agents/sf-optimization-analyzer.md` → `.claude/agents/`
- `agents/sf-process-discovery` è già presente se usi `sf-process-discovery`
