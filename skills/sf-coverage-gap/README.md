# sf-coverage-gap

Analizza il gap di coverage tra una classe Apex e la sua test class, senza deployare nulla fino a quando non è necessario. Trova metodi e branch scoperti, li ordina per impatto, e decide autonomamente se risolvere il gap direttamente o presentare un report.

**Obiettivo:** portare la classe all'80% di coverage stimata.

## Come si usa

```
/sf-coverage-gap AccountTriggerHandler
/sf-coverage-gap OpportunityService
/sf-coverage-gap analizza la coverage di: QuoteLineService
```

## Cosa fa

1. **Stima la coverage attuale** — conta righe copribili nel sorgente, stima quelle già coperte dai test, calcola il gap verso l'80%
2. **Trova i gap** — due agenti in parallelo: uno trova i metodi non coperti tracciando la catena di esecuzione, l'altro trova i branch scoperti ordinati per impatto
3. **Decide autonomamente** — se il gap è semplice, lo risolve e deploya; se è complesso, presenta il report e chiede all'utente cosa fare

## Output

### Se risolve direttamente:
```
Gap colmato.
- Aggiunti N metodi di test
- Coverage stimata: 62% → 83%
- Deploy completato
```

### Se presenta il report:
```
Coverage attuale stimata: ~62% (48/77 righe copribili)
Righe mancanti all'80%: 14

Branch scoperti (per priorità):
1. processRefund() — non coperto (12 righe) → serve un Order con Status = Refunded
2. validateAmount — branch else (4 righe) → amount <= 0

Cosa vuoi fare?
A. Lo faccio io (chiamo sf-apex-testing sui gap)
B. Dammi il report dettagliato
C. Altro
```

## Regole

- Non deploya mai prima di aver presentato il piano, a meno che il gap non sia chiaramente banale
- Considera la catena trigger → handler → service per non fare falsi positivi sui metodi "non coperti"
- Si ferma di raccogliere branch non appena le righe identificate bastano per raggiungere l'80%
- Se la classe è già all'80% o oltre, lo dice e si ferma

## Integrazione con le altre skill

| File | Uso |
|------|-----|
| `.claude/sf-execution-map.md` | Traccia le catene di esecuzione per non fare falsi positivi |
| `.claude/sf-test-learnings.md` | Evita gotchas noti del progetto |
| `sf-apex-testing` | Chiamata internamente se l'utente sceglie opzione A |
| `sf-test-runner` | Deploy della test class aggiornata |

## Agenti usati internamente

| Agente | Scopo |
|--------|-------|
| `sf-coverage-method-scanner` | Trova metodi non coperti tracciando la catena di esecuzione |
| `sf-coverage-branch-scanner` | Trova branch scoperti ordinati per impatto, si ferma all'80% |

## Installazione

Copia in `.claude/` del tuo progetto:
- `skills/sf-coverage-gap/` → `.claude/skills/sf-coverage-gap/`
- `agents/sf-coverage-method-scanner.md` → `.claude/agents/`
- `agents/sf-coverage-branch-scanner.md` → `.claude/agents/`
- `agents/sf-test-runner.md` → `.claude/agents/` (già presente se usi `sf-apex-testing`)
