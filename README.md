# Temenos Engineering Platform

Integration and workflow platform for Temenos engineering intelligence.

## Purpose

The platform connects independent engineering capabilities without merging their source repositories:

- Temenos-Skills — Temenos release/domain knowledge, field/rule lookup and verification
- RepoMind — bank customization repository intelligence
- agentic-suite — optional workflow/conductor integration
- AgentVerse — optional generic agent/runtime provider
- T24Tools — presentation/cockpit surface

The platform owns cross-system correlation, evidence, risk, workflow policy, remediation and reports.

## Flagship capability

R16 -> R25 Upgrade & Migration Intelligence

Bank Repository -> RepoMind Inventory -> Temenos-Skills Release Evidence -> Correlation + Impact Graph -> Risk -> Remediation -> Human Approval -> Approved Remediation + Rollback -> Verification + Regression -> Runtime/Migration -> ADC Zero-Downtime -> Upgrade Control Tower -> Final Human Approval -> External Cutover

## Implemented phases

- Phase 1 — architecture/discovery
- Phase 2 — platform contracts, store and RepoMind boundary
- Phase 3 — Temenos-Skills adapter
- Phase 4 — release-aware correlation, risk, evidence, remediation, verification and report
- Phase 5 — native DAG orchestration and safe agentic-suite bridge
- Phase 6 — T24Tools presentation read model and export contract
- Phase 7 — approval-gated remediation workflow and CI
- Phase 8 — regression intelligence
- Phase 9 — runtime, migration and deployment-readiness intelligence
- Phase 10 — ADC zero-downtime upgrade intelligence
- Phase 11 — Upgrade Control Tower

## Safety

The platform does not autonomously migrate production data, deploy production software or switch ADC traffic. Consequential execution remains external and explicitly approval-gated.

## CI

GitHub Actions workflow .github/workflows/cli.yml runs npm test on pushes and pull requests.

## Phase 11

The Upgrade Control Tower unifies upgrade, regression, runtime/migration and ADC readiness into one auditable go/no-go model with a single cutover timeline. READY_FOR_APPROVAL still requires explicit final human approval before external deployment or ADC switching.