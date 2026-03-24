# sf-class-explorer

Analizza una classe Apex, un trigger o un Flow Salesforce e produce un documento strutturato con:
- **Sezione funzionale**: cosa fa in linguaggio business, quando viene coinvolto, scenari chiave
- **Sezione tecnica**: logica, dipendenze dirette (cosa chiama) e inverse (chi la chiama), dati coinvolti

Il documento viene salvato in `docs/[NomeComponente].md` e, se Pandoc è disponibile, anche come `.docx`.

## Come si usa

```
/sf-class-explorer AccountTriggerHandler
/sf-class-explorer OpportunityUtils
/sf-class-explorer QuoteApprovalFlow
/sf-class-explorer spiega il trigger: ContactTrigger
```

## Output

```
docs/
└── AccountTriggerHandler.md     ← sempre
└── AccountTriggerHandler.docx   ← se Pandoc è installato
```

### Struttura del documento

```
# AccountTriggerHandler — Apex Class

## Functional Overview
Cosa fa, quando gira, scenari chiave (linguaggio business)

## Technical Reference
Logica, dipendenze dirette e inverse, oggetti/campi, async
```

## Agenti usati internamente

| Agente | Scopo |
|--------|-------|
| `sf-source-analyzer` | Analisi comportamentale di classi e trigger |
| `sf-flow-scanner` | Analisi dei Flow Salesforce |
| `sf-dependency-scanner` | Mappa chi chiama il componente e cosa chiama |

## Installazione

Copia in `.claude/` del tuo progetto:
- `skills/sf-class-explorer/` → `.claude/skills/sf-class-explorer/`
- `agents/sf-source-analyzer.md` → `.claude/agents/`
- `agents/sf-flow-scanner.md` → `.claude/agents/`
- `agents/sf-dependency-scanner.md` → `.claude/agents/`
