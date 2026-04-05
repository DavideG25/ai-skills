# sf-init-project

Inizializza la configurazione Claude Code per un progetto Salesforce. Genera un `CLAUDE.md` leggero e i file `.claude/rules/` usati da tutte le altre skill per rispettare le convenzioni del progetto.

**Su repo esistente** → scansiona il codice e scopre le convenzioni automaticamente.
**Su repo nuovo** → chiede le convenzioni allo sviluppatore in modo interattivo.

## Come si usa

```
/sf-init-project
/sf-init-project MyProjectName
```

Va lanciato una volta sola all'inizio. Può essere rilasciato in seguito per aggiornare le parti mancanti.

## Output

```
CLAUDE.md                        ← leggero: org, API version, oggetti chiave, link alle rules
.claude/
  rules/
    apex-rules.md                ← naming, trigger pattern, logging, error handling
    testing-rules.md             ← coverage minima, data setup, cosa evitare
    metadata-rules.md            ← API names, picklist, field conventions
  context/
    _index.md                    ← scaffold vuoto, popolato dalle altre skill nel tempo
```

## Perché CLAUDE.md deve restare leggero

`CLAUDE.md` viene caricato ad ogni sessione e occupa contesto. I dettagli stanno in `.claude/rules/` e vengono letti dalle skill solo quando servono — così anche su progetti grandi il contesto non viene sprecato.

## Cosa succede dopo

Una volta inizializzato, le altre skill usano automaticamente le convenzioni:
- `sf-apex-testing` legge `apex-rules.md` e `testing-rules.md` prima di scrivere test
- `sf-code-review` legge `apex-rules.md` per trovare violazioni alle convenzioni del progetto
- `sf-code-explorer` e `sf-documentation` popolano `.claude/context/` nel tempo

## Aggiornamento

Se aggiungi nuove convenzioni, editare direttamente i file in `.claude/rules/` — le skill le raccolgono alla prossima esecuzione. Rilancia `/sf-init-project` solo se vuoi rigenerare da zero.

## Agenti usati internamente

| Agente | Scopo |
|--------|-------|
| `sf-folder-scanner` | Struttura repo, sfdx-project.json, org connesse |
| `sf-apex-pattern-scanner` | Naming conventions, trigger framework, logging pattern |
| `sf-test-analyzer` | Convenzioni test, coverage minima, pattern data setup |
| `sf-integration-scanner` | Named credentials, remote sites, sistemi esterni |

## Installazione

Copia in `.claude/` del tuo progetto:
- `skills/sf-init-project/` → `.claude/skills/sf-init-project/`
- `agents/sf-folder-scanner.md` → `.claude/agents/`
- `agents/sf-apex-pattern-scanner.md` → `.claude/agents/`
- `agents/sf-test-analyzer.md` → `.claude/agents/` (già presente se usi `sf-apex-testing`)
- `agents/sf-integration-scanner.md` → `.claude/agents/` (già presente se usi `sf-process-discovery`)
