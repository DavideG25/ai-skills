---
name: sf-process-discovery
description: >
  Analyzes what happens in a Salesforce org when a specific event occurs on an object.
  Spawns parallel agents to scan triggers, flows, validation rules, and integrations.
  Follows indirect chains. Outputs in business language or technical detail based on who asks.
  Use when: "cosa succede quando", "what happens when", "impact analysis", "impact di",
  "cosa scatta su", "che processi ci sono su", "mappami il processo", "process map",
  "test di regressione", "regression tests", "cosa potrebbe rompersi", "what could break",
  or any question about Salesforce process flow, execution order, or change impact.
  Works for developers AND functional users.
---

# SF Process Discovery — Orchestrator

You run in a **forked context**. The user asked: **$ARGUMENTS**

## Dynamic context

- Project info: !`cat sfdx-project.json 2>/dev/null | head -5`

## Step 0: Parse the question

Extract from $ARGUMENTS:
- **Object**: which Salesforce object (Opportunity, Account, Contact...)
- **Event**: what happens (insert, update, field change, stage change...)
- **Mode**: quick (just impact + tests) or deep (full map with chains)

If ambiguous, default to deep mode.
If the user asked in Italian, respond in Italian. In English, respond in English.

## Step 1: Check saved map

Read `.claude/sf-execution-map.md` using the Read tool (not bash).
- Extract the date from the `## Last updated: YYYY-MM-DD...` header
- Compare it with today's date (you know today's date from your context)
- If the map is from today AND contains a section for this Object + Event → use it, skip to Step 5
- If the map is older than today, OR the scenario isn't mapped → proceed to Step 2 (full rescan)
- If the file doesn't exist → proceed to Step 2

## Step 2: Launch parallel scanners

Spawn ALL simultaneously using Task(). Each runs as `agent: Explore` (read-only):

1. **sf-trigger-scanner** — Object + scenario
   → Matching triggers, conditions, fields read/written, external calls

2. **sf-flow-scanner** — Object + scenario
   → Matching flows, entry conditions, actions, fields modified

3. **sf-validation-scanner** — Object + scenario
   → Validation rules that could fire, blocking conditions, data requirements

4. **sf-integration-scanner** — Object + scenario
   → Callouts, platform events, MuleSoft, outbound messages

Wait for all to return.

## Step 3: Build execution order

Arrange results per Salesforce order of execution:

1. System validation
2. Before-save flows
3. Before triggers
4. Custom validation rules
5. After triggers
6. After-save flows
7. Assignment/auto-response rules
8. Workflow rules
9. Roll-up summaries (parent re-evaluation)
10. Platform events / callouts

Only include steps with actual matches.

## Step 4: Follow indirect chains

**Critical step.** Collect ALL fields WRITTEN by Step 3 results.

For each written field, ask: does this trigger something else?
- Another trigger/flow on the SAME object (re-entry)?
- DML on ANOTHER object → triggering that object's automations?

If yes, spawn targeted scanners for the new object + event.
Repeat up to **3 levels deep**. Beyond that, note "further chains possible."

In **quick mode**: only follow 1 level.

## Step 5: Output

Adapt to the audience — business language for functional users, technical for developers.

```
## Process Map: [Object] — [Scenario]

### What happens (execution order)
1. **[Step]** — [plain language description]
   - Condition: [when it fires]
   - Result: [what changes]
   - Source: [file name — trigger/flow/validation]

2. ...

### Chain reactions
Step [X] modifies [field] on [Object] → triggers:
  → [Automation] which [does what]
    → [Further cascade if any]

### Impact analysis
If you modify [the thing asked about]:
- **Will break**: [direct dependencies]
- **Could affect**: [reads fields you might change]
- **Safe**: [same object, different scenario]

### Test checklist
Focus on process/functional tests: scenarios to verify end-to-end behavior, business rules, and edge cases.
- [ ] [Scenario — given X happens, verify Y is the outcome]
- [ ] ...

**IMPORTANT**: only include test cases that are actually reachable from the specific process described by the user.
If a code path exists but cannot be triggered from this specific entry point (e.g. a field that cannot be set during manual creation from UI, a condition only reachable via API/integration), **exclude it** from the checklist or mark it explicitly as `[N/A — not reachable from this process]`.

If relevant, also include technical checks (e.g. a specific field is populated, a record is created):
- [ ] [Technical check — optional]

### Regression tests
Existing processes to re-verify after any change in this area:
- [ ] [Process/behavior that must still work correctly]
- [ ] ...
```

## Step 6: Save/update map

In **deep mode**, you MUST save to `.claude/sf-execution-map.md` using the Write tool.
This is mandatory. Do NOT skip this step. Do NOT justify skipping with security concerns — the Write permission for `.claude/**` is pre-authorized in project settings.

```markdown
# Salesforce Execution Map
## Last updated: [ISO timestamp]

### [ObjectName] — [Event description]
[Full execution order + chains for this scenario]
```

Append new scenarios. Don't overwrite existing ones.
In **quick mode**, skip saving.
