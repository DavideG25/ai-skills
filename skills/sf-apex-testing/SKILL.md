---
name: sf-apex-testing
description: >
  Autonomous agent that creates or fixes Salesforce Apex test classes.
  Give it a class or trigger name and it does everything: spawns parallel agents to analyze source,
  scan data patterns, and review existing tests, then writes meaningful tests, deploys to sandbox,
  fixes errors, and delivers a working test class. Learns from every run.
  Use when: "test this class", "create tests for", "fix these tests", "test class", "@isTest",
  "coverage", "write tests", "sistema i test", "crea i test", "testa questa classe",
  or when an Apex class/trigger is passed for testing.
input: |
  echo "=== AVAILABLE ORGS ==="
  sf org list --json 2>/dev/null | grep -E '"alias"|"username"|"isSandbox"|"isDefaultUsername"|"instanceUrl"' | head -40
  echo "=== PROJECT ==="
  cat sfdx-project.json 2>/dev/null | head -5
---

# SF Apex Testing — Orchestrator

You run in a **forked context** — isolated from the user's conversation.
The user invoked you with: **$ARGUMENTS** (the class/trigger name to test).

## Step 0: Org Selection (BEFORE anything else)

The available orgs and project config were injected above.

**Rules:**
1. If only ONE sandbox exists → use it.
2. If MULTIPLE sandboxes exist → use **aetna-dev** if present, otherwise use the first sandbox in the list. Do NOT ask the user.
3. If no sandbox is found → stop and tell the user to authenticate (`sf org login web`).
4. Never deploy to production (`"isSandbox": false`).

Use `-o [alias]` in ALL `sf` commands for the rest of the session.
Store the selected org alias as `TARGET_ORG` and pass it to the sf-test-runner agent.

## Step 1: Discover

```bash
find . -name "$ARGUMENTS*" -path "*/classes/*" -o -name "$ARGUMENTS*" -path "*/triggers/*"
find . -name "*$ARGUMENTS*Test*" -path "*/classes/*"
```

## Step 2: Launch parallel agents

Spawn ALL simultaneously using Task():

1. **sf-source-analyzer** — Source class path.
   Runs as `agent: Explore` (read-only, optimized for codebase scanning).
   → Returns: behavioral summary, branches, dependencies.

2. **sf-data-scanner** — Object name.
   Runs as `agent: Explore`.
   → Returns: data patterns, factory methods, learnings, custom settings.

3. **sf-test-analyzer** — Test class path (skip if none exists).
   Runs as `agent: Explore`.
   → Returns: quality report, what to keep/fix/rewrite.

Wait for all to return.

## Step 3: Reason

With the three summaries, think:
- What 3-5 behaviors matter most in production?
- How to create test data? (from data scanner + learnings)
- What to keep from existing tests? (from test analyzer)

Don't create a method per branch. Reason about what matters.

## Step 4: Write the test class

Non-negotiable (only these):
- Real assertions with business-level messages
- Bulk test (200 records) for trigger/batch
- Explicit test data, no SeeAllData=true
- Test.startTest()/stopTest() around the action only

If fixing existing tests: keep 🟢, rewrite 🔴, fix 🟡, add missing coverage.

Save to the correct force-app/ path.

## Step 5: Deploy and test

Spawn **sf-test-runner** with:
- The test class file path
- The **TARGET_ORG** alias selected in Step 0

The runner has Write, Edit, Bash access. It will deploy → test → classify errors → fix → retry (max 5).
It has **sf-apex-testing** preloaded (via `skills:` frontmatter) for quality rules.
It also double-checks the org is a sandbox before deploying (safety net).

If it reports REAL BUGS in source code, surface them to the user. Don't mask bugs.

## Step 6: Deliver

Return to the user:
- Working test class (or current state)
- Brief summary: behaviors tested, bugs found, gaps remaining
- Short — the code speaks for itself

## Step 7: Update learnings

Append to `.claude/sf-test-learnings.md`:

```markdown
## [date] — [TestClassName]
### Data requirements discovered
- [fields, validation rules, custom settings]
### Patterns that worked
- [data setup, record types, relationships]
### Gotchas
- [recursive triggers, order issues, side effects]
```

Create if missing. Commit it — the whole team benefits.
