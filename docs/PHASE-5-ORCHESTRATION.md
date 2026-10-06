# Phase 5 — Orchestration

Phase 5 adds orchestration without moving Temenos domain logic into agentic-suite.

## Ownership

Temenos Engineering Platform owns workflow/domain contracts, the R16 → R25 upgrade DAG, correlation, risk, evidence and approval policy.

agentic-suite owns optional external conductor integration, CLI/worker lifecycle and its own dashboard/resume mechanisms.

## Upgrade DAG

1. RepoMind inventory
2. Temenos-Skills release comparison
3. Correlation
4. Risk and remediation
5. Human review gate
6. Verification and report

Stages 1 and 2 execute in parallel. Correlation waits for both. The approval gate blocks the final stage until explicitly approved.

## Agentic-suite bridge

The platform does not assume an undocumented HTTP API. The adapter uses a small manifest/command boundary:

- AGENTIC_SUITE_HOME: optional working directory
- AGENTIC_SUITE_COMMAND: optional bridge command
- TEMENOS_PLATFORM_PAYLOAD: JSON payload supplied to the bridge process

Without a command, the adapter is manifest-only. This is deliberate: local tests stay deterministic and no external conductor is started accidentally.

## Native execution

DagOrchestrator provides parallel independent nodes, persisted run metadata, pause/resume, node status, events and approval/rejection. runOrchestratedUpgradeAssessment wires the Phase 4 assessment into that DAG.

## Safety

Phase 5 performs analysis and report generation only. No source rewriting, production migration or ADC traffic switching is automatic. Provider credentials remain in the runtime environment.
