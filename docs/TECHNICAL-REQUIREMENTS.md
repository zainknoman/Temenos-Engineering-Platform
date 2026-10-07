# Technical Requirement Document — Temenos Engineering Platform

**Status:** Productized / validation stage  
**Date:** 2026-10-07

## 1. Architecture

TEP is a Node.js ESM integration platform.

`Capability → Adapter → Transport → Runtime`

The domain layer must remain independent of the implementation mechanism used by RepoMind, Temenos-Skills, workers, MCP, CLI or HTTP providers.

## 2. Technology Requirements

| Area | Requirement |
|---|---|
| Runtime | Node.js 20+ |
| Language | JavaScript / ESM |
| CLI | `bin/tep.js` + `src/cli.js` |
| Domain | Provider-neutral JavaScript modules |
| Repository intelligence | RepoMind adapter/export |
| Temenos knowledge | Temenos-Skills adapter |
| Output | Stable JSON/read models |
| Browser | Static Command Center over read model |
| Testing | Node test runner / complete suite |
| CI | Node 20 and Node 22 |
| Safety | approval-gated external execution |

## 3. Core Technical Components

1. Project/workspace configuration.
2. Adapter registry and capability discovery.
3. RepoMind inventory normalization.
4. Temenos release comparison.
5. Cross-system correlation.
6. Risk classification.
7. Remediation planning.
8. Regression assessment.
9. Runtime/migration assessment.
10. ADC readiness and rollback planning.
11. Control Tower.
12. Certification and evidence.
13. Report/read API model.
14. Command Center.
15. Enterprise provider boundaries.

## 4. Data Contracts

Minimum normalized objects:
- Project
- Artifact
- Dependency
- Finding
- Evidence
- Verification
- Workflow Run
- Report

Provider-specific IDs/payloads must remain in adapter metadata.

## 5. Integration Requirements

### RepoMind
Input must be a valid RepoMind export. The adapter must preserve source profile, files, symbols, references, dependencies and limitations without copying RepoMind internals.

### Temenos-Skills
The adapter must expose release-aware lookup/comparison/verification capabilities and clearly distinguish READY, UNVERIFIED and unavailable states.

### External execution
No domain module may directly execute production actions. Execution must pass through an explicit provider and human approval policy.

## 6. Safety Requirements

- `productionExecution=false` by default.
- `autonomousExecution=false` by default.
- Human approval is mandatory for external production actions.
- Evidence must be retained for high-confidence findings and gate decisions.
- Provider failures must be distinguishable from analysis failures and invalid responses.
- No secrets in source control or domain contracts.

## 7. Quality Gates

A feature is complete only when:
1. focused tests pass;
2. full test suite passes;
3. safety boundaries remain intact;
4. repository boundaries remain intact;
5. CLI/API compatibility is preserved;
6. CI is green.

## 8. Current Technical Gaps

- Real Temenos-Skills readiness is still not fully verified in the flagship report.
- Real-bank provider execution has not replaced deterministic fixtures.
- The current demo runtime log analyzer has a false-positive condition for the phrase "No transaction errors detected"; this must be corrected.
- Runtime failure is not currently propagated consistently into the migration readiness gate.
- Command Center should expose more detailed lifecycle state instead of only high-level counts.

## 9. Technical Direction

The next technical stage is **real provider onboarding and non-production bank validation**, not another parallel architecture rewrite.
