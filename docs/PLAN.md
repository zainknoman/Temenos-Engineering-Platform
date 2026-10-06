# Implementation Plan

## Phase 0 — Foundation

- documentation
- repository boundaries
- common contracts
- adapter interfaces
- workflow state
- evidence/provenance model

**Exit:** architecture and boundaries are explicit.

## Phase 1 — Integration Discovery

Inspect all five source repositories without modifying them.

Deliverables:

- capability matrix
- reusable-interface matrix
- dependency map
- integration risks
- adapter APIs
- release/feature compatibility map

**Exit:** every MVP dependency has a documented integration path.

## Phase 2 — RepoMind Adapter

Initial read-only capabilities:

- repository status/index
- artifact inventory
- symbol/reference search
- dependency graph
- impact candidates

## Phase 3 — Temenos-Skills Adapter

Initial capabilities:

- field lookup
- API/class lookup
- release-aware comparison
- generation recommendations
- compile/verification evidence

## Phase 4 — R16 → R25 Upgrade Assessment

Implement:

`inventory → release diff → impact analysis → risk → remediation recommendation → verification plan → report`

**MVP exit:** a representative customization repository produces a traceable upgrade assessment.

## Phase 5 — Orchestration

Integrate agentic-suite for DAG execution, parallel analysis, gates, approvals and pause/resume. Introduce AgentVerse only where its runtime capabilities provide clear value.

## Phase 6 — T24Tools Surface

Expose workflow/results through a user-facing integration surface without moving T24Tools source into this repository.

## Post-MVP

1. approved automated remediation
2. test/regression intelligence
3. runtime/log intelligence
4. ADC zero-downtime upgrade planning
5. bank knowledge packs
6. solution architect workflows
7. controlled migration factory
8. enterprise deployment

Prefer one vertical slice over broad infrastructure.
