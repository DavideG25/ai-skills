---
name: sf-init-project
description: >
  Initializes Claude Code configuration for a Salesforce project.
  On existing repos: scans the codebase and discovers conventions automatically.
  On new repos: asks the developer for conventions interactively.
  Generates a lean CLAUDE.md and .claude/rules/ files used by all other skills.
  Use when: "inizializza il progetto", "setup claude", "init project", "configura claude",
  "crea il CLAUDE.md", "set up this repo for Claude Code", or at the start of a new project.
---

# SF Init Project — Orchestrator

You run in a **forked context** — isolated from the user's conversation.
The user invoked you with: **$ARGUMENTS** (optional notes or project name).

## Step 0: Check if already initialized

Read `CLAUDE.md` if it exists. If it already contains org type, API version, and at least one rule file reference → ask the user: "Questo progetto sembra già configurato. Vuoi sovrascrivere o aggiornare solo le parti mancanti?"

If updating: only regenerate files that don't exist yet. Never overwrite rules the user may have manually edited without asking.

## Step 1: Scan the repo structure

**If Task tool is available** — spawn in parallel using Task():
1. **sf-folder-scanner** — repo structure, sfdx-project.json, package.json, org info
2. **sf-apex-pattern-scanner** — trigger framework, naming conventions, logging, error handling patterns
3. **sf-test-analyzer** — test conventions, coverage patterns, data setup approach
4. **sf-integration-scanner** — named credentials, remote sites, callout patterns

Wait for all to return.

**If Task tool is NOT available** — run sequentially:
1. **Repo structure**: read `sfdx-project.json` (org type, API version, namespace, package directories). Run `sf org list --json 2>/dev/null` to check connected orgs. Count Apex classes and triggers in `force-app/`.
2. **Apex patterns**: `Glob "*.trigger"` — read 2-3 triggers to detect handler pattern (does it delegate to a Handler class?). `Glob "*Handler*.cls"` and `Glob "*Service*.cls"` — read 1-2 to detect naming conventions and logging approach.
3. **Test conventions**: `Glob "*Test*.cls"` — read 2-3 test classes to detect: coverage target, data setup method (TestDataFactory vs inline), use of @TestSetup.
4. **Integrations**: `Glob "*.namedCredential-meta.xml"` and `Glob "*.remoteSite-meta.xml"`. List names. Check if any HTTP callout patterns exist in classes.

## Step 2: Detect repo type

**Existing repo** — has Apex classes (more than 2 `.cls` files found) → go to Step 3a.

**New repo** — no or very few Apex classes → go to Step 3b.

## Step 3a: Extract conventions (existing repo)

From the scan results, derive:

**Apex conventions:**
- Naming: do classes follow `[Object]TriggerHandler`, `[Object]Service`, `[Object]Controller` patterns?
- Trigger framework: is there a TriggerHandler base class or similar?
- Logging: `System.debug`? Custom Logger class? What level?
- Error handling: try/catch pattern? Custom exception classes?

**Testing conventions:**
- Minimum coverage: check if any CI config or README mentions a threshold
- Data setup: TestDataFactory class present? @TestSetup used?
- Naming: `[ClassName]_Test`, `[ClassName]Test`, `Test_[ClassName]`?

**Key objects:**
From triggers and service classes, identify the 3-5 most referenced SObjects.

Go to Step 4.

## Step 3b: Ask conventions (new repo)

Ask the user the following questions — one block, not one by one:

```
Nuovo progetto rilevato. Dimmi le convenzioni da usare:

1. Naming classi:
   a) ObjectTriggerHandler + ObjectService (standard)
   b) Altro (specificare)

2. Framework trigger:
   a) Nessun framework — trigger semplici con handler
   b) Ho un TriggerHandler base class (incolla il nome)
   c) Altro (specificare)

3. Logging:
   a) System.debug standard
   b) Custom Logger class (specificare nome)
   c) Nessun logging

4. Coverage minima richiesta: [numero]% (default: 85)

5. Setup dati nei test:
   a) TestDataFactory class
   b) Dati inline nel test
   c) @TestSetup method

6. Hai integrazioni esterne? (sì/no — se sì, con quali sistemi)
```

Wait for the user to answer. Use the answers in Step 4.

## Step 4: Generate the files

### CLAUDE.md (lean — max 60 lines)

```markdown
# [Project Name]

## Org
- Type: [Production / Sandbox / Developer / Scratch]
- API Version: [from sfdx-project.json]
- Default org alias: [from sf org list]
- Namespace: [if any]

## Deploy
```bash
sf project deploy start --source-dir force-app -o [alias]
sf apex run test --test-level RunLocalTests -o [alias]
```

## Key objects
- [Object1]: [one line — what it represents]
- [Object2]: [one line]
- [Object3]: [one line]

## Conventions
See `.claude/rules/` for full details.
- Apex: `.claude/rules/apex-rules.md`
- Testing: `.claude/rules/testing-rules.md`
- Metadata: `.claude/rules/metadata-rules.md`
```

### .claude/rules/apex-rules.md

```markdown
# Apex Rules — [Project Name]

## Naming
- Triggers: [ObjectName]Trigger (one trigger per object)
- Handlers: [ObjectName]TriggerHandler
- Services: [ObjectName]Service
- Controllers: [ObjectName]Controller (LWC/Aura only)

## Trigger framework
[Describe the framework or pattern used]

## Logging
[How to log: System.debug / Logger.log() / etc.]

## Error handling
[Pattern: try/catch on callouts, custom exceptions, etc.]

## Non-negotiable
- No SOQL or DML inside loops
- No logic directly in .trigger files — always delegate to handler
- No hardcoded IDs or Record Type names
```

### .claude/rules/testing-rules.md

```markdown
# Testing Rules — [Project Name]

## Coverage
Minimum: [N]%

## Data setup
[TestDataFactory / inline / @TestSetup — and why]

## Naming
Test classes: [pattern]

## Non-negotiable
- No @SeeAllData=true
- Every test method must have at least one Assert
- Bulk test (200 records) for any trigger or batch
- Test.startTest()/stopTest() around the action only
```

### .claude/rules/metadata-rules.md

```markdown
# Metadata Rules — [Project Name]

## API naming
- Custom objects: [PascalCase]__c
- Custom fields: [snake_case]__c or [PascalCase]__c (specify which)
- Custom labels: [Category_Name] format

## Picklist values
[Convention: Title Case / UPPER_CASE / etc.]

## Field conventions
[Any project-specific rules on required fields, field types, etc.]
```

### .claude/context/_index.md (empty scaffold)

```markdown
# Context Index — [Project Name]
> Auto-populated by sf-code-explorer and sf-documentation as you analyze components.
> Load individual files on demand — do not load this entire folder.

## Apex Classes
[populated automatically]

## Objects
[populated automatically]
```

## Step 5: Save all files

Write each file. If a file already exists and was manually edited (check git blame or ask), skip it unless the user said to overwrite.

Create `.claude/rules/` and `.claude/context/` directories if they don't exist.

## Step 6: Deliver

Tell the user:
- What was generated and where
- Which conventions were discovered vs assumed
- What to do next: "Ora puoi usare tutte le skill — inizia con `/sf-code-explorer [ClassePrincipale]` per costruire il contesto del progetto"
- If any convention was unclear, say so explicitly and suggest the user edit the relevant rules file
