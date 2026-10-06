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

Bank Repository -> RepoMind Inventory -> Temenos-Skills Release Evidence -> Correlation + Impact Graph -> Risk -> Remediation -> Human Approval -> Approved Remediation + Rollback -> Verification + Report -> T24Tools Cockpit

## Implemented phases

- Phase 1 — architecture/discovery
- Phase 2 — platform contracts, store and RepoMind boundary
- Phase 3 — Temenos-Skills adapter
- Phase 4 — release-aware correlation, risk, evidence, remediation, verification and report
- Phase 5 — native DAG orchestration and safe agentic-suite bridge
- Phase 6 — T24Tools presentation read model and export contract
- Phase 7 — approval-gated remediation workflow and CI
- Phase 8 — regression intelligence and T24Tools regression status
- Phase 9 — runtime, migration and deployment-readiness intelligence
- Phase 10 — ADC zero-downtime upgrade intelligence

## Safety

The platform does not autonomously migrate production data, deploy production software or switch ADC traffic. Consequential execution remains external and explicitly approval-gated.

## CI

GitHub Actions workflow .github/workflows/cli.yml runs npm test on pushes and pull requests.

## Principles

1. Keep source repositories independent.
2. Integrate through capability adapters and explicit transports.
3. Preserve evidence and provenance.
4. Require human approval before consequential actions.
5. Do not invent release evidence.
6. Keep credentials in runtime environments, never in platform contracts.

## Phase 10

ADC Zero-Downtime Upgrade Intelligence models active/standby topology, health checks, target compatibility, dual-run readiness, session and transaction safety, migration checkpoints, controlled traffic drain/switch planning, rollback readiness and a human approval gate. Actual ADC traffic switching remains external and explicitly approved.