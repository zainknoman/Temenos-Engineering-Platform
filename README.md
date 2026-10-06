# Temenos Engineering Platform

Integration and workflow platform for Temenos engineering intelligence.

## Purpose

The platform connects independent engineering capabilities without merging their source repositories:

- Temenos-Skills — Temenos release/domain knowledge
- RepoMind — bank customization repository intelligence
- agentic-suite — optional workflow/conductor integration
- AgentVerse — optional generic agent/runtime provider
- T24Tools — presentation/cockpit surface

The platform owns cross-system correlation, evidence, risk, workflow policy, remediation and reports.

## Flagship capability

R16 -> R25 Upgrade & Migration Intelligence

Bank Repository -> RepoMind -> Temenos-Skills -> Correlation/Impact -> Risk -> Remediation -> Verification/Regression -> Runtime/Migration -> ADC Zero-Downtime -> Upgrade Control Tower -> Human Approval -> External Operations -> Live Cutover Evidence & Incident Control -> Cutover Command Center & Scenario Simulation

## Implemented phases

- Phase 1 — architecture/discovery
- Phase 2 — contracts, store and RepoMind boundary
- Phase 3 — Temenos-Skills adapter
- Phase 4 — release-aware upgrade intelligence
- Phase 5 — orchestration
- Phase 6 — T24Tools surface
- Phase 7 — approval-gated remediation
- Phase 8 — regression intelligence
- Phase 9 — runtime/migration intelligence
- Phase 10 — ADC zero-downtime intelligence
- Phase 11 — Upgrade Control Tower
- Phase 12 — Execution Adapter & Operations Integration
- Phase 13 — Live Cutover Evidence & Incident Control
- Phase 14 — Cutover Command Center & Scenario Simulation

## Safety

The platform does not autonomously migrate production data, deploy production software, switch ADC traffic or execute rollback. Consequential execution remains external and explicitly approval-gated.

## Phase 14

Scenario simulation, readiness replay, dependency-aware blast-radius analysis, environment comparison, operator handoff and an event-stream boundary are available through the platform. See `docs/PHASE-14-CUTOVER-COMMAND-CENTER.md`.
