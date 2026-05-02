---
name: sf-coverage-gap
description: >
  Analyzes the coverage gap between an Apex class and its test class without deploying.
  Finds uncovered methods and branches, prioritizes by impact, and decides autonomously
  whether to fix the gap directly or present a report for the user to act on.
  Target: 80% coverage.
  Use when: "coverage gap", "aumenta la coverage", "quali metodi non sono coperti",
  "coverage analysis", "trova i test mancanti", "analizza la coverage di",
  "quanta coverage manca", or when a class name is passed for coverage assessment.
context: fork
allowed-tools: Task, Read, Grep, Glob, Bash
---

# SF Coverage Gap — Orchestrator

You run in a **forked context** — isolated from the user's conversation.
The user invoked you with: **$ARGUMENTS** (class or trigger name to analyze).

## Pre-step: Load project context

1. If `.claude/sf-execution-map.md` exists → read it. Use it to trace execution chains accurately.
2. If `.claude/sf-test-learnings.md` exists → read it. Use it to avoid known pitfalls.

## Step 1: Estimate current coverage

Find source and test files:
```bash
find . -name "$ARGUMENTS.cls" -o -name "$ARGUMENTS.trigger" 2>/dev/null
find . -name "*$ARGUMENTS*Test*.cls" -o -name "*Test*$ARGUMENTS*.cls" 2>/dev/null
```

Read both files. Count copribili lines in the source:
- Exclude: blank lines, single-line comments (`//`), block comments (`/* */`), class/interface declarations, `{` and `}` alone on a line
- Count: method bodies, if/else/for/while statements, DML, SOQL, return statements, assignments

Estimate covered lines from the test class:
- For each test method, trace what it invokes (directly or via the class under test)
- Use the execution map if available to follow chains beyond direct calls

Calculate:
```
Current coverage % = (estimated covered lines / total coverable lines) × 100
Gap to 80% = lines needed = (0.80 × total) - covered
```

If already at or above 80%: report it and stop. No further analysis needed.

## Step 2: Find the gaps

**If Task tool is available** — spawn both agents simultaneously using Task():

1. **sf-coverage-method-scanner** with:
   - Source file path
   - Test file path
   - Execution map (if loaded)

2. **sf-coverage-branch-scanner** with:
   - Source file path
   - Test file path
   - Lines needed to reach 80% (from Step 1)

Wait for both to return.

**If Task tool is NOT available** — run sequentially using Read and Grep:

1. **Method scan** (sf-coverage-method-scanner logic):
   For each method in the source, check if it appears in the test class (Grep method name in test file). For methods not directly called, trace the execution chain: does any test method call something that eventually calls this method? Use the execution map to help. Mark each method as: covered / partially covered / not covered.

2. **Branch scan** (sf-coverage-branch-scanner logic):
   Read the source file. For each uncovered or partially covered method found above, identify: if/else blocks, loop bodies, catch blocks, ternary expressions, null checks. Order by impact (lines covered if added). Stop collecting once the cumulative line count would reach the 80% target.

## Step 3: Reason about the gap

With the two reports in hand, assess the gap:

**Evaluate complexity:**
- How many uncovered methods are there?
- Are the branches simple (one condition, straightforward data) or complex (chained conditions, special objects, integrations)?
- How much test data setup would be needed?
- Are there DML operations that require specific relationships or record types?

**Decision — use judgment, not thresholds:**

**Fix it directly** if ALL of these are true:
- Gap is small (a few methods or branches)
- Test data is simple (same object, no complex relationships)
- No callouts or async methods involved
- No ambiguity about what the branch should test

In this case: write the missing test methods, append them to the existing test class, deploy once. Report what was added and the new estimated coverage.

**Present the report and ask** in all other cases. Use this format:

```
## Coverage Gap — [ClassName]

**Coverage attuale stimata:** ~[N]% ([covered] / [total] righe copribili)
**Righe mancanti all'80%:** [N]

### Branch scoperti (per priorità)

1. **[MethodName]** — non coperto ([N] righe)
   Come coprirlo: [what test data and scenario is needed]

2. **[MethodName] — branch else** — scoperto ([N] righe)
   Come coprirlo: [what condition to set up]

3. ...

### Valutazione
[Why this gap is complex or straightforward — honest assessment]

### Cosa vuoi fare?
A. Lo faccio io — chiamo sf-apex-testing passando solo i gap identificati
B. Vuoi il report dettagliato per farlo tu
C. Altro
```

Wait for the user's choice before acting.

## Step 3b: Load project API map

Before writing any Apex code, spawn **sf-api-scanner** (agent: Explore).
It returns available methods, custom types, custom objects, and exceptions in this project.
Use this map when writing code — don't invent method signatures or types that don't exist here.

If Task tool is NOT available: run the grep commands from sf-api-scanner manually before writing code.

## Step 4: If fixing directly

Write the missing test methods following the existing test class style:
- Same naming convention
- Same data setup approach (TestDataFactory if present, inline if not)
- Real assertions — no empty test methods
- One method per logical scenario, not one per branch

Append to the existing test class (do NOT rewrite it).
Deploy via sf-test-runner.

## Step 5: Deliver

Whether fixed or reported:
- State the estimated coverage before and after (or projected)
- List what was added or what remains to add
- If bugs were surfaced during analysis, flag them explicitly
