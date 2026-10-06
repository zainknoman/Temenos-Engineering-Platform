# Adapter Transports

| Adapter | Capability source | Initial transport | Later option |
|---|---|---|---|
| RepoMind | local/browser index | exported analysis JSON | local worker/API |
| Temenos-Skills | release knowledge and verification | MCP/CLI worker | service if stable |
| agentic-suite | workflow conductor | Claude CLI/worker | service/worker |
| AgentVerse | generic runtime | HTTP/API | service |
| T24Tools | presentation | platform read model/API | web integration |

The adapter contract must remain stable when transport changes. The workflow should not know whether a lookup was fulfilled through MCP, CLI, HTTP or a local process.

Phase 2 implements only the RepoMind read-only boundary. Other transports remain documented until validated against live repositories.
