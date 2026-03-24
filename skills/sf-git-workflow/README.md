# sf-git-workflow

Claude Code skill per gestire il workflow git su progetti Salesforce con strategia multi-branch.

## Cosa fa

Interpreta comandi in linguaggio naturale ed esegue le operazioni git corrette, basandosi sulla struttura dei branch del progetto (feature, hotfix, qualitymerge, release, production).

Alla prima esecuzione rileva automaticamente la struttura dei branch e salva la configurazione in `.claude/git-workflow-config.md`. Dalle esecuzioni successive usa la config salvata senza chiedere nulla.

## Comportamento in base al tono

| Tono della richiesta | Comportamento |
|---|---|
| Imperativo ("aggiorna", "porta in quality", "crea") | Esegue i comandi git in autonomia |
| Prima persona ("voglio aggiornare", "vorrei portare") | Restituisce solo la riga di comando |
| Ambiguo | Chiede: "Vuoi che lo esegua io, o preferisci il comando?" |
| Termina con ` cmd` | Forza la restituzione del solo comando |

## Operazioni supportate

| Operazione | Esempio di invocazione |
|---|---|
| Crea feature branch | `crea il branch per CPQ-1234` |
| Crea hotfix branch | `crea un hotfix per CPQ-1234` |
| Aggiorna feature con release | `aggiorna CPQ-1234 con release` |
| Porta in quality | `porta CPQ-1234 in quality` |
| Aggiorna qualitymerge con quality | `sync quality CPQ-1234` |
| Prepara PR verso produzione | `prepara CPQ-1234 per prod` |
| Converti feature in hotfix | `converti CPQ-1234 in hotfix` |
| Pulisci branch qualitymerge locali | `pulisci i qualitymerge` |

## Struttura branch attesa

La skill riconosce automaticamente tre ruoli nei branch remoti:

- **BRANCH_MAIN** — branch principale da cui partono le feature (es. `release`, `main`, `develop`)
- **BRANCH_QUALITY** — ambiente di staging/test (es. `quality`, `staging`, `uat`)
- **BRANCH_PRODUCTION** — branch di produzione (es. `production`, `prod`, `master`)

I branch di lavoro seguono sempre questi prefissi:
- `feature/TICKET` — sviluppo
- `qualitymerge/TICKET` — merge verso quality
- `hotfix/TICKET` — fix urgenti da production

## Configurazione

Alla **prima esecuzione** la skill analizza i branch remoti e inferisce automaticamente la mappatura. Se ambigua, chiede conferma una sola volta.

La configurazione viene salvata in `.claude/git-workflow-config.md` e riutilizzata silenziosamente nelle esecuzioni successive. Per cambiarla basta modificare quel file.