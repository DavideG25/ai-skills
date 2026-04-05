---
name: sf-code-review
description: >
  Interactive Apex code review. Asks two questions before starting, then analyzes
  only what the user selected: technical issues, external dependencies, optimizations.
  Produces a structured report — no descriptions of what the code does, only what's wrong or improvable.
  Use when: "review this class", "controlla il codice", "cosa non va in", "analizza la qualità",
  "ottimizza", "trova problemi", "code review", "review", "rivedi questa classe",
  or when a class/trigger is passed for quality assessment.
---

# SF Code Review — Orchestrator

You run in a **forked context** — isolated from the user's conversation.
The user invoked you with: **$ARGUMENTS** (the class or trigger to review).

## Step 0: Load project rules and context

Before asking anything:
1. If `.claude/rules/apex-rules.md` exists → read it. These are the project's coding conventions — violations are findings.
2. If `.claude/rules/testing-rules.md` exists → read it. Apply when reviewing test coverage.
3. If `.claude/context/$ARGUMENTS.md` exists → read it. Use to understand the component faster.

## Step 1: Ask two questions

Ask the user — in the same language they used:

**Question 1 — Scope:**
```
Cosa vuoi analizzare?
1. Tutta la classe
2. Solo le modifiche del branch corrente (git diff)
```

**Question 2 — Focus (multi-select):**
```
Cosa vuoi che controlli? (puoi scegliere più opzioni)
A. Problemi tecnici — Governor Limits, bulkification, null safety, pattern
B. Dipendenze esterne — cosa scatta sull'oggetto quando questa classe viene eseguita
C. Ottimizzazioni — suggerimenti di miglioramento con stima di impatto
```

Wait for the user to respond before proceeding.

## Step 2: Get the code to review

**If scope = tutta la classe:**
```bash
find . -name "$ARGUMENTS.cls" -o -name "$ARGUMENTS.trigger" 2>/dev/null
```
Read the full file.

**If scope = solo git diff:**
```bash
git diff main...HEAD -- "**/$ARGUMENTS.cls" "**/$ARGUMENTS.trigger" 2>/dev/null
```
If the diff is empty, fall back to the full file and notify the user.

## Step 3: Launch analysis (based on selections)

**If Task tool is available** — spawn selected agents in parallel using Task():

- If **A selected** → **sf-code-analyzer** with file path + apex-rules.md content (if loaded)
- If **B selected** → **sf-process-discovery** with object name extracted from the class (look for SObject types in DML/SOQL)
- If **C selected** → **sf-optimization-analyzer** with file path

Wait for all selected agents to return.

**If Task tool is NOT available** — run sequentially yourself:

- If **A selected**: read the full file. Check each of the 14 points in the sf-code-analyzer checklist (see agent file). For each issue found, note line number, severity, and fix.
- If **B selected**: extract the main SObject from DML/SOQL statements. Search for triggers (`Glob "*.trigger"` matching the object), flows (`Glob "*.flow-meta.xml"`), and validation rules. Note what fires when this class runs.
- If **C selected**: read the full file. Identify: repeated logic that could be extracted, inefficient queries, collections that could be Maps instead of Lists, methods doing too much. For each suggestion estimate impact (high/medium/low).

## Step 4: Build the report

**IMPORTANT:** This report must NOT describe what the code does. Only report problems, risks, and suggestions. If something is fine, skip it — only mention what needs attention.

```markdown
# Code Review — [ClassName] ([date])
Scope: [full class / git diff]
Sections: [A / B / C — as selected]

---

## A. Technical Issues
[Only if A was selected]

### 🔴 Critical
- **[Issue name]** — Line XX: [what's wrong and why it matters]
  Fix: [concrete suggestion]

### 🟡 Warning
- **[Issue name]** — Line XX: [what's wrong]
  Fix: [concrete suggestion]

### 🟢 OK
[List categories that were checked and passed — brief]

---

## B. External Dependencies
[Only if B was selected]

When this class runs, it also triggers:
1. **[Automation name]** ([type]) — [what it does, potential conflict or risk]
2. ...

Risks:
- [Specific risk — e.g. recursive trigger, governor limit cascade]

---

## C. Optimization Suggestions
[Only if C was selected]

| Suggestion | Line | Impact | Effort |
|------------|------|--------|--------|
| [description] | XX | High/Med/Low | High/Med/Low |

---

## Summary
- 🔴 Critical issues: [N]
- 🟡 Warnings: [N]
- 💡 Suggestions: [N]
- Recommended action: [fix criticals before merging / safe to merge / needs discussion]
```

## Step 5: Deliver

Return the report to the user.
If critical issues were found, say so clearly upfront — don't bury it in the report.
