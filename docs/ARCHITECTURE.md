# Architecture

The platform is an integration layer, not a monorepo.

System shape:

T24Tools
   |
   v
Temenos Engineering Platform
   |-- contracts / projects / runs
   |-- workflows / correlation / findings / evidence
   |-- adapter registry
   |-- execution/runtime abstraction
   |
   +--> Temenos-Skills adapter --> MCP/CLI worker --> Temenos-Skills
   +--> RepoMind adapter -------> local export/worker --> RepoMind
   +--> agentic-suite adapter --> Claude CLI/worker --> agentic-suite
   +--> AgentVerse adapter ----> HTTP/API --> AgentVerse
   +--> T24Tools read model

## Responsibility boundaries

- Temenos-Skills: release-specific Temenos knowledge, lookup, generation and verification.
- RepoMind: bank repository inventory, code intelligence, dependencies and impact candidates.
- agentic-suite: workflow sequencing, parallel execution, gates, approvals and orchestration.
- AgentVerse: optional runtime for agent execution, sandboxing, memory and provider abstraction.
- T24Tools: engineering cockpit and user-facing surface.

## Platform-owned domains

- project and run state
- integration adapters
- capability discovery
- execution policy
- Temenos-specific agents
- upgrade/migration workflows
- cross-system correlation
- evidence aggregation
- risk classification
- report generation
- approval boundaries

## Execution boundary

External capabilities are invoked through:

Capability → Adapter → Transport → Runtime

The domain workflow must not know whether a capability is implemented by a browser export, MCP server, CLI process, worker or HTTP service.

## Core flow

Repository → RepoMind inventory → normalized artifacts → Temenos-Skills release analysis → impact graph → risk → agentic workflow → verification → human approval → report

No Temenos knowledge is duplicated into orchestration logic. Adapters translate external capabilities into stable platform contracts.
