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

Bank Repository -> RepoMind -> Temenos-Skills -> Correlation/Impact -> Risk -> Remediation -> Verification/Regression -> Runtime/Migration -> ADC Zero-Downtime -> Upgrade Control Tower -> Human Approval -> External Operations -> Live Cutover Evidence & Incident Control

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

## Safety

The platform does not autonomously migrate production data, deploy production software or switch ADC traffic. Consequential execution remains external and explicitly approval-gated.

## CI

GitHub Actions workflow .github/workflows/cli.yml runs npm test on pushes and pull requests.

## Phase 13

Live cutover operations are observed through external result ingestion and telemetry. The platform evaluates incidents, maintains a verifiable audit chain and reconciles expected versus observed outcomes. It never autonomously executes or rolls back production operations.
