# Temenos Engineering Platform

Integration and workflow platform for Temenos engineering intelligence.

## Purpose

The platform connects independent engineering capabilities without merging their source repositories:

- **Temenos-Skills** — Temenos release/domain knowledge, field/rule lookup and verification
- **RepoMind** — bank customization repository intelligence
- **agentic-suite** — optional workflow/conductor integration
- **AgentVerse** — optional generic agent/runtime provider
- **T24Tools** — presentation/cockpit surface

The platform owns cross-system correlation, evidence, risk, workflow policy and reports.

## Flagship capability

**R16 → R25 Upgrade & Migration Intelligence**

    Bank Repository
        ↓
    RepoMind Inventory
        ↓
    Normalized T24 Artifacts
        ↓
    Temenos-Skills Release Evidence
        ↓
    Correlation + Impact Graph
        ↓
    Risk Classification
        ↓
    Remediation Recommendation
        ↓
    Human Approval
        ↓
    Verification + Report
        ↓
    T24Tools Cockpit

## Implemented phases

- Phase 1 — architecture/discovery
- Phase 2 — platform contracts, store and RepoMind boundary
- Phase 3 — Temenos-Skills adapter
- Phase 4 — release-aware correlation, risk, evidence, remediation, verification and report
- Phase 5 — native DAG orchestration and safe agentic-suite bridge
- **Phase 6 — T24Tools presentation read model and export contract**

## Phase 6

The T24Tools boundary is intentionally read-only. Use `T24ToolsAdapter` to expose:

- upgrade dashboard
- artifact risk list
- evidence
- remediation/verification checklist
- Markdown report export

T24Tools remains the UI/cockpit; the platform remains the domain/workflow layer.

## Principles

1. Keep source repositories independent.
2. Integrate through capability adapters and explicit transports.
3. Preserve evidence and provenance.
4. Require human approval before consequential actions.
5. Do not invent release evidence.
6. Keep credentials in runtime environments, never in platform contracts.

## Tests

Run `npm test`.

Phase 6 adds three tests for the T24Tools read model and adapter.
