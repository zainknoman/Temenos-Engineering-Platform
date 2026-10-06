# Decision Log

## ADR-001 — Keep the five source repositories independent
The platform integrates rather than absorbs Temenos-Skills, RepoMind, agentic-suite, AgentVerse or T24Tools.

## ADR-002 — Platform owns cross-system correlation
Release impact, bank customization impact, risk, evidence aggregation and upgrade workflow logic belong here.

## ADR-003 — Evidence before automation
High-confidence findings require traceable evidence and known limitations.

## ADR-004 — AgentVerse is optional
AgentVerse is a runtime/provider, not the platform master execution architecture.

## ADR-005 — Capability / Adapter / Transport / Runtime
External tools may run as Claude Code skills, CLI processes, MCP servers, workers or HTTP services. The domain layer must not encode one runtime assumption.

## ADR-006 — RepoMind Phase 2 is read-only
Phase 2 consumes an exported RepoMind analysis boundary. It does not mutate RepoMind or invent a remote API for the browser-first application.
