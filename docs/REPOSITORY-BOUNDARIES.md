# Repository Boundaries

The five existing repositories remain independent.

| Repository | Platform may use | Platform should not copy |
|---|---|---|
| Temenos-Skills | knowledge/search/generation/verification capabilities | knowledge corpus or internal implementation |
| T24Tools | UI concepts and integration surface | application source |
| RepoMind | repository intelligence capabilities | AST/index implementation |
| agentic-suite | orchestration capabilities | generic orchestrator source |
| AgentVerse | runtime capabilities | runtime internals |

The platform should depend on documented interfaces or deliberately defined adapters.

If an integration requires a source-repository change, record it as a separate proposal rather than silently modifying that repository.
