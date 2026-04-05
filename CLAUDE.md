# sf-ai-skills

Raccolta di skills e agenti riutilizzabili per lo sviluppo Salesforce con Claude Code. L'obiettivo è automatizzare operazioni comuni (testing, git workflow, analisi di processi) in modo autonomo e sicuro.

## Struttura

```
skills/     # Skill invocabili dall'utente — orchestrano uno o più agenti
agents/     # Agenti specializzati — analizzatori read-only, usati internamente dalle skills
settings.json
```

## Skills disponibili

| Skill | Descrizione | Dettagli |
|-------|-------------|----------|
| `sf-apex-testing` | Crea o corregge classi di test Apex in autonomia | `skills/sf-apex-testing/README.md` |
| `sf-git-workflow` | Gestisce branch e merge in linguaggio naturale | `skills/sf-git-workflow/README.md` |
| `sf-process-discovery` | Mappa l'execution flow e l'impatto di un evento su un oggetto Salesforce | `skills/sf-process-discovery/README.md` |
| `sf-code-explorer` | Spiega una classe/trigger/Flow e mappa le dipendenze, produce un documento | `skills/sf-code-explorer/README.md` |
| `sf-code-review` | Review interattiva del codice Apex: problemi tecnici, dipendenze, ottimizzazioni | `skills/sf-code-review/README.md` |
| `sf-documentation` | Documenta un oggetto Salesforce o un processo di business | `skills/sf-documentation/README.md` |
| `sf-init-project` | Inizializza CLAUDE.md e `.claude/rules/` per un progetto Salesforce | `skills/sf-init-project/README.md` |
| `comprimi-pdf` | Comprime PDF pesanti per invio via email | `skills/comprimi-pdf/README.md` |

## Come usare questo repo

### Installazione in un progetto Salesforce

1. Copia i file delle skills che ti servono in `.claude/skills/` del tuo progetto
2. Copia gli agenti necessari (indicati nel SKILL.md di ogni skill) in `.claude/agents/`
3. Assicurati che `settings.json` includa i permessi richiesti dalla skill

### Aggiornamento

Le skills si aggiornano indipendentemente. Sostituisci i file copiati con le versioni più recenti da questo repo.

## Principi guida

- **Solo sandbox**: nessuna skill deploya o modifica una org di produzione
- **Pattern orchestratore + agente**: le skills coordinano agenti read-only che analizzano il codice; solo il runner ha accesso in scrittura
- **Italiano e inglese**: tutte le skills supportano entrambe le lingue
- **Apprendimento persistente**: le skills salvano pattern e configurazioni in `.claude/` per migliorare nel tempo

## Roadmap

### In sviluppo
*(nessuna skill in corso attualmente)*

### Backlog
- `sf-new-trigger` — crea trigger completo con bypass metadata, deploy e test automatici *(bloccata — in attesa di info sul bypass metadata)*

Vedi `ROADMAP` per il dettaglio completo.

## Contribuire

Il repo è pubblico in lettura. Per contribuire:

- **Lettura**: libera per tutti
- **Modifiche**: solo tramite Pull Request da un branch dedicato
- **Merge su master**: richiede approvazione del maintainer

Push diretti su master sono bloccati.
test
