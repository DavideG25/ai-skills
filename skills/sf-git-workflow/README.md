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

```
production   ← branch di produzione
release      ← branch principale (feature partono da qui)
quality      ← ambiente di test/staging

feature/TICKET        ← sviluppo
qualitymerge/TICKET   ← merge verso quality
hotfix/TICKET         ← fix urgenti da production
```

## Configurazione

La skill salva automaticamente la configurazione in `.claude/git-workflow-config.md`:

```
BRANCH_MAIN=release
BRANCH_QUALITY=quality
BRANCH_PRODUCTION=production
FEATURE_PREFIX=feature
HOTFIX_PREFIX=hotfix
QUALITYMERGE_PREFIX=qualitymerge
```

Modifica questo file se i nomi dei branch cambiano nel progetto.