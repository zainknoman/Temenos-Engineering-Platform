# Implementation Plan

## Phase 0 — Foundation
Documentation, boundaries, contracts, adapter interfaces, workflow state and evidence model.

## Phase 1 — Integration Discovery — COMPLETE
Capability matrix, responsibility map, adapter strategy, normalized data model, R16 → R25 workflow, risks, backlog, source baselines, execution/runtime architecture, runtime modes and adapter transports.

## Phase 2 — Platform Foundation + RepoMind Adapter — COMPLETE
Implemented runtime skeleton; Project, Run, Artifact, Dependency, Finding and Evidence contracts; JSON persistence; adapter registry; execution registry; read-only RepoMind export adapter; T24 artifact normalization; representative fixture; first R16 → R25 assessment workflow; tests for normalization, provenance and persistence.

**Exit:** a local platform run can ingest a RepoMind export and persist normalized evidence-backed artifacts without changing RepoMind.

## Phase 3 — Temenos-Skills Adapter
Validate live MCP/CLI invocation, implement worker transport, release-aware lookup, comparison and verification evidence.

## Phase 4 — R16 → R25 Upgrade Assessment
Release diff, correlation engine, risk classification, remediation recommendations, verification plan and reporting.

## Phase 5 — Orchestration
Integrate agentic-suite for DAG execution, parallel analysis, gates, approvals and pause/resume. Introduce AgentVerse where useful.

## Phase 6 — T24Tools Surface
Expose workflow/results through a user-facing integration surface.

## Post-MVP
Approved remediation; regression intelligence; runtime/log intelligence; ADC zero-downtime planning; bank knowledge packs; solution-architect workflows; controlled migration factory; enterprise deployment.
