# Implementation Plan

## Phase 0 — Foundation
Documentation, boundaries, contracts, adapter interfaces, workflow state and evidence model.

## Phase 1 — Integration Discovery — COMPLETE
Capability matrix, responsibility map, adapter strategy, normalized data model, R16 → R25 workflow, risks, backlog, source baselines, execution/runtime architecture, runtime modes and adapter transports.

## Phase 2 — Platform Foundation + RepoMind Adapter — COMPLETE
Runtime skeleton; Project/Run/Artifact/Dependency/Finding/Evidence contracts; JSON persistence; adapter registry; execution registry; read-only RepoMind export adapter; T24 artifact normalization; fixture; first assessment workflow; tests.

## Phase 3 — Temenos-Skills Adapter — COMPLETE
Implemented a real local worker/CLI boundary with release-aware field lookup, business-rule search, R23→R25 comparison, artifact field verification, provider failure handling and evidence provenance.

**Exit:** the platform can invoke the existing Temenos-Skills knowledge pipeline without copying its source or making the platform depend on Claude Code as its only runtime.

## Phase 4 — R16 → R25 Upgrade Assessment
- release diff
- correlation engine
- risk classification
- remediation recommendations
- verification plan
- report generation

## Phase 5 — Orchestration
Integrate agentic-suite for DAG execution, parallel analysis, gates, approvals and pause/resume. Introduce AgentVerse where useful.

## Phase 6 — T24Tools Surface
Expose workflow/results through a user-facing integration surface.

## Post-MVP
Approved remediation; regression intelligence; runtime/log intelligence; ADC zero-downtime planning; bank knowledge packs; solution-architect workflows; controlled migration factory; enterprise deployment.
