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

## Phase 3
The platform now has a real Temenos-Skills execution boundary:

`Platform → Temenos-Skills adapter → local Python worker → existing Temenos-Skills pipeline → structured result + evidence`

Implemented:
- release-aware field lookup
- business-rule search
- release comparison
- artifact field verification
- provider/runtime failure handling
- evidence/provenance

Configure `TEMENOS_SKILLS_HOME` to point at your local Temenos-Skills checkout.

## Principles
- Keep all five source repositories independent and untouched.
- Integrate through adapters and stable contracts.
- Use Capability → Adapter → Transport → Runtime.
- Evidence before automation.
- Require human approval before destructive or production-impacting actions.
- Preserve provenance.
- Prefer deterministic analysis and verification over unsupported AI guesses.

## Documentation
- [Architecture](docs/ARCHITECTURE.md)
- [Execution Architecture](docs/EXECUTION-ARCHITECTURE.md)
- [Runtime Modes](docs/RUNTIME-MODES.md)
- [Adapter Transports](docs/ADAPTER-TRANSPORTS.md)
- [Implementation Plan](docs/PLAN.md)
- [Phase 3 Temenos-Skills](docs/PHASE-3-TEMENOS-SKILLS.md)
- [MVP](docs/MVP.md)
- [Contracts](docs/CONTRACTS.md)
- [Repository Boundaries](docs/REPOSITORY-BOUNDARIES.md)
- [Decision Log](docs/DECISIONS.md)
- [R16 → R25 Workflow](docs/workflows/R16-R25-UPGRADE-ASSESSMENT.md)
- [Next Phase](docs/NEXT-PHASE.md)

## Non-goals
This project will not copy source from the five repositories, replace official Temenos tooling, become another generic coding-agent framework, or autonomously migrate production systems.

## Roadmap
MVP: RepoMind adapter → Temenos-Skills adapter → R16 → R25 impact workflow → agentic-suite orchestration → unified report → T24Tools surface.

Post-MVP: approved remediation, regression intelligence, runtime/log intelligence, ADC zero-downtime planning, bank knowledge packs, solution-architect workflows, migration factory and enterprise deployment.
