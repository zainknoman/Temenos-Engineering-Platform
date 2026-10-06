# Architecture

## System boundary

The platform is an integration layer, not a monorepo.

```
                         T24Tools
                            |
                            v
                +------------------------+
                | Temenos Engineering    |
                | Platform               |
                |                        |
                | Contracts              |
                | Domain Workflows       |
                | Projects / Runs        |
                | Findings / Evidence   |
                | Reports                |
                +-----------+------------+
                            |
          +-----------------+------------------+
          |                 |                  |
          v                 v                  v
   Temenos-Skills       RepoMind        agentic-suite
   Temenos truth        Bank truth      orchestration
                                             |
                                             v
                                         AgentVerse
                                      execution/runtime
```

## Responsibility boundaries

- **Temenos-Skills:** release-specific Temenos knowledge, lookup, generation and verification.
- **RepoMind:** bank repository inventory, code intelligence, dependencies and impact candidates.
- **agentic-suite:** workflow sequencing, parallel execution, gates, approvals and orchestration.
- **AgentVerse:** optional runtime for agent execution, sandboxing, memory and provider abstraction.
- **T24Tools:** engineering cockpit and user-facing surface.

## Platform-owned domains

- project and run state
- integration adapters
- common contracts
- Temenos-specific agents
- upgrade/migration workflows
- evidence aggregation
- risk classification
- report generation
- approval boundaries
- cross-system correlation

## Core flow

`Repository → RepoMind inventory → normalized artifacts → Temenos-Skills release analysis → impact graph → risk → agentic workflow → verification → human approval → report`

No Temenos knowledge should be duplicated into the orchestration layer. Adapters translate external capabilities into stable platform contracts.
