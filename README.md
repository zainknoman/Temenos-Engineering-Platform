# Temenos Engineering Platform

> AI-powered engineering intelligence for Temenos Transact — understand, analyze, generate, validate, troubleshoot and plan upgrades using release-specific knowledge and bank-specific code intelligence.

This repository is the integration and product layer for five independent systems. It does not clone, replace, or absorb them.

| System | Responsibility |
|---|---|
| Temenos-Skills | Temenos Transact ground truth, release-aware knowledge, generation and verification |
| T24Tools | T24 engineering cockpit and user-facing utilities |
| RepoMind | Bank/customization repository intelligence |
| agentic-suite | Workflow orchestration, DAG scheduling, approvals and engineering phases |
| AgentVerse | Generic agent runtime, execution, sandboxing, memory and provider infrastructure |

## Vision

Combine three forms of intelligence:

1. **What should Temenos do?** — Temenos-Skills.
2. **What does this bank actually have?** — RepoMind.
3. **What should we do next, and can we prove it?** — this platform, orchestrated by agentic-suite and optionally executed through AgentVerse.

The first flagship capability is **R16 → R25 Upgrade & Migration Intelligence**.

## Principles

- Keep all five source repositories independent and untouched.
- Integrate through adapters and stable contracts, not source-code copying.
- Evidence before automation.
- Make release-aware decisions.
- Require human approval before destructive or production-impacting actions.
- Preserve provenance for findings and recommendations.
- Prefer deterministic analysis and verification over unsupported AI guesses.
- Start with an end-to-end vertical slice before building a large framework.

## MVP

`Bank Repository → Inventory → R16/R25 Analysis → Impact Graph → Risk Classification → Remediation Recommendations → Verification Plan → Human Review → Upgrade Report`

Expected output: customization inventory, impacted applications/fields/APIs/components/routines, release-change findings, dependency graph, risk classification, evidence, remediation recommendations, verification status, regression plan and management-ready report.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Implementation Plan](docs/PLAN.md)
- [MVP](docs/MVP.md)
- [Contracts](docs/CONTRACTS.md)
- [Repository Boundaries](docs/REPOSITORY-BOUNDARIES.md)
- [Decision Log](docs/DECISIONS.md)
- [R16 → R25 Workflow](docs/workflows/R16-R25-UPGRADE-ASSESSMENT.md)
- [Phase 1 Discovery](docs/PHASE-1-DISCOVERY.md)
- [Capability Matrix](docs/CAPABILITY-MATRIX.md)
- [Integration Adapters](docs/INTEGRATION-ADAPTERS.md)
- [Common Data Model](docs/DATA-MODEL.md)
- [Workflow Design](docs/WORKFLOW-DESIGN.md)
- [Integration Risks](docs/INTEGRATION-RISKS.md)
- [MVP Backlog](docs/MVP-BACKLOG.md)
- [Source Repository Baselines](docs/SOURCE-REPOSITORY-BASELINES.md)
- [Next Phase](docs/NEXT-PHASE.md)

## Non-goals

Initially this project will not rewrite the five source repositories, copy their source code, become another generic coding-agent framework, replace official Temenos tooling/documentation, or autonomously migrate production systems.

## Roadmap

### MVP
1. Architecture and contracts
2. RepoMind adapter
3. Temenos-Skills adapter
4. R16 → R25 impact workflow
5. agentic-suite orchestration adapter
6. Unified assessment report
7. T24Tools integration surface

### Post-MVP
- approved automated remediation
- T24 test/regression intelligence
- runtime/log intelligence
- ADC zero-downtime upgrade planning
- bank knowledge packs
- solution-architect workflows
- controlled migration factory
- enterprise deployment

## Development rule

Changes required in the five source repositories must be proposed separately and deliberately. This repository must not depend on undocumented internal implementation details.
