# sf-documentation

Produce un documento strutturato per un oggetto Salesforce o un processo di business. Il documento ha una sezione funzionale (linguaggio business) e una sezione tecnica (automazioni, campi, dipendenze). Output: `.md` salvato in `docs/` e `.docx` opzionale via Pandoc.

> Per documentare una classe Apex o un Flow usa `/sf-code-explorer`. Per documentare un oggetto o un processo usa `/sf-documentation`.

## Come si usa

```
/sf-documentation Quote__c
/sf-documentation Account
/sf-documentation processo di creazione ordine
/sf-documentation order approval process
/sf-documentation documenta l'oggetto: Opportunity
```

## Output

```
docs/
└── Quote__c.md       ← sempre
└── Quote__c.docx     ← se Pandoc è installato
```

### Struttura del documento

```
## Functional Overview
Cosa è / cosa fa in linguaggio business
Campi chiave (label, non API name)
Regole di business in linguaggio naturale
Come si inserisce nel processo

## Technical Reference
API names, automazioni in execution order, relazioni, integrazioni
```

## Input accettato

| Input | Esempio |
|-------|---------|
| Oggetto custom | `Quote__c`, `OrderLine__c` |
| Oggetto standard | `Account`, `Opportunity`, `Case` |
| Processo / evento | `"order creation"`, `"quote approval"` |

## Agenti usati internamente

| Agente | Scopo |
|--------|-------|
| `sf-object-scanner` | Legge metadata oggetto: campi, relazioni, picklist, record types |
| `sf-trigger-scanner` | Trigger sull'oggetto |
| `sf-flow-scanner` | Flow record-triggered sull'oggetto |
| `sf-validation-scanner` | Validation rules |
| `sf-integration-scanner` | Callout, Platform Events, sistemi esterni (se processo) |
| `sf-workflow-scanner` | Workflow rules (se processo) |

## Installazione

Copia in `.claude/` del tuo progetto:
- `skills/sf-documentation/` → `.claude/skills/sf-documentation/`
- `agents/sf-object-scanner.md` → `.claude/agents/`
- Gli altri agenti sono già presenti se usi `sf-process-discovery`
