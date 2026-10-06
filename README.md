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
1. **What should Temenos do?** — Temenos-Skills.
2. **What does this bank actually have?** — RepoMind.
3. **What should we do next, and can we prove it?** — this platform.

The first flagship capability is **R16 → R25 Upgrade & Migration Intelligence**.

## Principles
- Keep all five source repositories independent and untouched.
- Integrate through adapters and stable contracts.
- Use Capability → Adapter → Transport → Runtime for external execution.
- Evidence before automation.
- Require human approval before destructive or production-impacting actions.
- Preserve provenance.
- Prefer deterministic analysis and verification over unsupported AI guesses.

## Phase 2
The current foundation supports:

RepoMind export → normalized artifacts/dependencies → persisted R16 → R25 assessment run

## Documentation
- [Architecture](docs/ARCHITECTURE.md)
- [Execution Architecture](docs/EXECUTION-ARCHITECTURE.md)
- [Runtime Modes](docs/RUNTIME-MODES.md)
- [Adapter Transports](docs/ADAPTER-TRANSPORTS.md)
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
This project will not copy source from the five repositories, replace official Temenos tooling, become another generic coding-agent framework, or autonomously migrate production systems.

## Roadmap
MVP: RepoMind adapter → Temenos-Skills adapter → R16 → R25 impact workflow → agentic-suite orchestration → unified report → T24Tools surface.

Post-MVP: approved remediation, regression intelligence, runtime/log intelligence, ADC zero-downtime planning, bank knowledge packs, solution-architect workflows, migration factory and enterprise deployment.
