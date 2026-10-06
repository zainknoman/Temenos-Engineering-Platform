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

## Phase 7

The remediation layer creates evidence-linked candidate changes, requires explicit human approval, captures rollback information before application, and records verification results.

It does not invent exact Temenos source replacements and does not directly mutate production or switch ADC traffic.

## CI

GitHub Actions workflow .github/workflows/cli.yml runs npm test on pushes and pull requests.

## Principles

1. Keep source repositories independent.
2. Integrate through capability adapters and explicit transports.
3. Preserve evidence and provenance.
4. Require human approval before consequential actions.
5. Do not invent release evidence.
6. Keep credentials in runtime environments, never in platform contracts.
