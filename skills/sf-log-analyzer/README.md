# sf-log-analyzer

Analizza un debug log di Salesforce per trovare la causa di un problema. L'utente fornisce il file di log e descrive il sintomo. La skill trova l'errore, risale alla causa nel codice, e suggerisce il fix — senza leggere l'intero log.

## Come si usa

### Modalità A — Log con errore

```
/sf-log-analyzer /path/to/debug.log
/sf-log-analyzer debug.log "NullPointerException su AccountTriggerHandler"
/sf-log-analyzer analizza questo log: /logs/execution.log
```

### Modalità B — Log pulito ma sintomo presente

```
/sf-log-analyzer debug.log "il campo Status non viene aggiornato"
/sf-log-analyzer /logs/order.log "la email di conferma non parte"
/sf-log-analyzer log.txt "il record viene creato ma le quote non si aggiornano"
```

## Output

### Se c'è un errore nel log:

```
Problema:  NullPointerException in AccountService.updateRelated() — line 87
Causa:     account.Owner era null perché la query non includeva Owner.Email
Codice:    [righe 84-90 di AccountService.cls]
Suggerimento: aggiungi Owner.Email alla SOQL query a riga 34
```

### Se il log è pulito ma il sintomo c'è:

```
Problema:       il campo Status__c non viene aggiornato
Percorso atteso: Trigger → Handler → StatusService.update()
Percorso reale:  Trigger → Handler → condizione a riga 42 era false
Deviazione:     IsActive__c valeva false al momento dell'esecuzione
Codice:         [riga 42 di AccountTriggerHandler.cls]
Suggerimento:   verificare il valore di IsActive__c prima dell'invocazione
```

## Integrazione con le altre skill

| File | Uso |
|------|-----|
| `.claude/sf-execution-map.md` | Letto in pre-step per capire il flusso atteso del processo |
| `.claude/sf-test-learnings.md` | Letto in pre-step per riconoscere gotchas note del progetto |
| `sf-process-discovery` | Usa la mappa che questa skill produce |
| `sf-code-explorer` | Produce il contesto delle classi che questa skill referenzia |

## Agenti usati internamente

| Agente | Quando | Scopo |
|--------|--------|-------|
| `sf-error-tracer` | Log con errore | Risale il log dalla riga dell'errore, ricostruisce la catena trigger → handler → service |
| `sf-flow-tracer` | Log pulito + sintomo | Trova dove il flusso si è interrotto o ha preso un branch diverso |
| `sf-code-linker` | Sempre | Prende classe e riga dal log, trova il file nel repo, mostra il codice rilevante |

## Installazione

Copia in `.claude/` del tuo progetto:
- `skills/sf-log-analyzer/` → `.claude/skills/sf-log-analyzer/`
- `agents/sf-error-tracer.md` → `.claude/agents/`
- `agents/sf-flow-tracer.md` → `.claude/agents/`
- `agents/sf-code-linker.md` → `.claude/agents/`
