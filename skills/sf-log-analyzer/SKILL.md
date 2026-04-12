---
name: sf-log-analyzer
description: >
  Analyzes a Salesforce debug log to find problems. The user provides a log file
  and describes the symptom. If errors are found, traces the execution chain to the crash.
  If the log is clean but the symptom exists, finds where the flow deviated from the expected path.
  Use when: "analizza il log", "cosa dice il log", "perché crasha", "analyze this log",
  "debug log", "errore in produzione", "il processo non si esegue", "cosa è andato storto",
  or when a .log file is passed for analysis.
context: fork
allowed-tools: Task, Read, Grep, Glob, Bash
---

# SF Log Analyzer — Orchestrator

You run in a **forked context** — isolated from the user's conversation.
The user invoked you with: **$ARGUMENTS** (path to a log file and/or symptom description).

## Pre-step: Load project context

Before scanning the log, check for existing project knowledge:
1. If `.claude/sf-execution-map.md` exists → read it. Use it to understand the expected execution flow for the affected object/process.
2. If `.claude/sf-test-learnings.md` exists → read it. Use it to recognize known gotchas.

## Step 1: Quick scan

Do NOT read the full log. Run a targeted grep:

```bash
grep -n "Exception\|FATAL_ERROR\|System.LimitException\|^.*ERROR\|EXCEPTION_THROWN" [log_file_path] | head -30
```

Two outcomes:
- **Errors found** → go to Step 2A
- **No errors found** → go to Step 2B

## Step 2A: Error path

Errors found in the log. Spawn two agents in parallel.

**If Task tool is available** — spawn simultaneously using Task():

1. **sf-error-tracer** with:
   - Log file path
   - Error lines found in Step 1 (line numbers + content)
   - Symptom described by the user

2. **sf-code-linker** with:
   - Log file path
   - Error lines found in Step 1
   - Repo root path (current directory)

Wait for both to return.

**If Task tool is NOT available** — run sequentially using Read and Grep:

1. **Error trace** (sf-error-tracer logic):
   Read the log from the error line backward (~50 lines before the error). Identify the call stack: which trigger fired, which handler was called, which service method, at which line the exception was thrown. Extract: class name, method name, line number.

2. **Code link** (sf-code-linker logic):
   From the class name and line number extracted above, find the file:
   `Glob "*[ClassName].cls"`. Read ±15 lines around the error line. Show only the relevant lines.

## Step 2B: Clean log path

No errors in the log, but the user reported a symptom. Spawn two agents in parallel.

**If Task tool is available** — spawn simultaneously using Task():

1. **sf-flow-tracer** with:
   - Log file path
   - Symptom described by the user (what should have happened but didn't)
   - Execution map content (if loaded in pre-step)

2. **sf-code-linker** with:
   - Log file path
   - Deviation point found by sf-flow-tracer (will be passed after flow-tracer returns — run sequentially if needed)
   - Repo root path

**If Task tool is NOT available** — run sequentially:

1. **Flow trace** (sf-flow-tracer logic):
   Read the log in sections. Search for the class/method that should have produced the expected result (use the symptom and execution map as guide). Find the last execution point before the expected action would have happened. Check branching conditions — what was the value of the field or condition that caused the flow to take a different path?

2. **Code link** (sf-code-linker logic):
   Once the deviation point is identified, find the file and read the relevant lines around the condition that evaluated to false/unexpected.

## Step 3: Build the output

### If Step 2A (error found):

```
## Log Analysis — [log file name]

**Problema**
[One line: what crashed and where]

**Causa**
[Why it crashed — class, method, line number, what condition triggered it]

**Codice**
```apex
// [ClassName].cls — line [N]
[relevant lines from the repo]
```

**Suggerimento**
[Concrete fix — what to change and why]
```

### If Step 2B (clean log, symptom present):

```
## Log Analysis — [log file name]

**Problema**
[One line: what didn't happen and what was expected]

**Percorso atteso**
[What should have executed based on execution map + symptom]

**Percorso reale**
[What actually executed — last point before deviation]

**Deviazione**
[Where the flow split — class, method, line. What condition evaluated to false/unexpected, and what value it had at runtime]

**Codice**
```apex
// [ClassName].cls — line [N]
[the condition or branch that caused the deviation]
```

**Suggerimento**
[What to check or fix — data issue, missing condition, logic bug]
```

## Rules

- Never read the full log if an error was found — start from the error line.
- If the error is clear and sf-code-linker found the line, do not add further analysis. Be direct.
- Show only the relevant lines from the repo, never the full class.
- If the log is from an anonymous execution (no class context), say so and work with what's available.
- If the log file path is not provided, ask the user: "Puoi fornire il percorso del file di log?"
