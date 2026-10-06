# Runtime Modes

## Local
Phase 2 uses deterministic local execution: Platform → RepoMind export adapter → JSON index → normalized artifacts.

## Worker
Use when a capability needs a process boundary, long-running execution, Claude CLI, MCP server or isolation. The worker owns authentication and process lifecycle.

## Service
Use when a capability already exposes a stable network API. Example: Platform → AgentVerse adapter → HTTP/API → AgentVerse → provider.

## Selection policy
1. Prefer deterministic local execution.
2. Use worker mode for CLI/MCP tools.
3. Use service mode when a stable API exists.
4. Do not create a service only for symmetry.
