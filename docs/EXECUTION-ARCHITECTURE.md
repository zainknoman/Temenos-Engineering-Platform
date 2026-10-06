# Execution Architecture

The platform separates Capability, Adapter, Transport and Runtime.

- Platform owns business workflow, domain contracts, correlation, evidence and approval policy.
- Adapter converts provider capabilities into platform contracts.
- Transport is MCP, CLI, local export, worker IPC, HTTP/API or another explicit mechanism.
- Runtime is the environment that actually executes the provider.

## Runtime modes

| Mode | Use | Example |
|---|---|---|
| local | deterministic workstation analysis | Platform → RepoMind export → JSON |
| worker | CLI/MCP/isolated long-running tools | Platform → worker → Temenos-Skills |
| service | network runtime | Platform → AgentVerse API |

AgentVerse is an execution provider, not the master architecture. Temenos-Skills and agentic-suite may run through Claude CLI/MCP; AgentVerse may run through its service/API. The platform stays independent of authentication and provider runtime.

Secrets such as API keys and Claude/MCP credentials belong to the runtime or secret manager and never to platform contracts or Git.

Adapters must distinguish unavailable capability, transport failure, runtime failure, provider analysis failure and invalid provider response.
