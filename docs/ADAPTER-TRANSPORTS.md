# Adapter Transports

| Adapter | Capability source | Initial transport | Later option |
|---|---|---|---|
| RepoMind | local/browser index | exported analysis JSON | local worker/API |
| Temenos-Skills | release knowledge and verification | MCP/CLI worker | service if stable |
| agentic-suite | workflow conductor | Claude CLI/worker bridge | service/worker |
| AgentVerse | generic runtime | HTTP/API | service |
| T24Tools | presentation | platform read model/API | web integration |

Phase 5 validates the agentic-suite boundary through an explicit worker/command bridge. The adapter contract remains stable if the bridge later becomes a service. Provider credentials remain outside platform state.
