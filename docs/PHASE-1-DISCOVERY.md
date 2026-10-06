# Phase 1 — Integration Discovery

**Status:** Complete  
**Scope:** discovery and architecture only  
**Source repositories modified:** none

## Objective

Determine how the five existing repositories can participate in Temenos Engineering Platform without cloning, merging or modifying them.

## Conclusion

The repositories have complementary responsibilities:

| Layer | Repository | Platform role |
|---|---|---|
| Domain truth | Temenos-Skills | Temenos release knowledge, exact field/API evidence, generation and verification |
| Bank-code truth | RepoMind | Repository indexing, symbols, references, dependencies, impact and T24 analyzers |
| Workflow conductor | agentic-suite | DAG scheduling, phases, approvals, state, resume and engineering workflow |
| Runtime | AgentVerse | AI providers, agent execution, DAG execution, permissions, memory, sandbox and REST API |
| Cockpit | T24Tools | Browser-based T24 engineering UI and artefact/log/OFS utilities |
| Product/integration | Temenos Engineering Platform | Cross-system contracts, domain workflows, evidence, correlation, projects, runs and reports |

## Important finding

The five repositories do **not** currently expose one common application API.

Their natural integration surfaces are different:

- Temenos-Skills: Claude Code skills plus an optional MCP server and CLI/pipeline tools.
- RepoMind: browser/local services and an in-memory codebase model.
- T24Tools: browser application with local knowledge-file loading.
- agentic-suite: Claude Code skills/scripts with persisted workflow state and dashboards.
- AgentVerse: Node backend with REST endpoints and internal orchestration/runtime modules.

Therefore the platform must use **capability adapters**, not assume a shared REST API.

## MVP architectural decision

For the first vertical slice, keep external systems read-only and evidence-producing.

The platform should orchestrate:

`Repository → RepoMind analysis → normalized artifacts → Temenos-Skills release evidence → correlation → risk → report`

agentic-suite should be used as the workflow/conductor integration after the domain analysis path is proven. AgentVerse is optional runtime infrastructure, not an MVP hard dependency.

## What Phase 1 established

- ownership boundaries
- integration strategy
- capability matrix
- adapter responsibilities
- normalized data model
- evidence/provenance rules
- R16 → R25 workflow
- integration risks
- MVP implementation backlog
- explicit non-goals

## Out of scope

- source changes in the five repositories
- production migration
- autonomous remediation
- direct database sharing between repositories
- copying knowledge corpora or agent registries into this repository
