# Decision Log

## ADR-001 — Separate integration repository

Create a new Temenos Engineering Platform repository instead of cloning or merging the five existing repositories.

**Reason:** preserve ownership boundaries, reduce duplication and allow independent evolution.

## ADR-002 — Existing repositories remain untouched

Do not modify Temenos-Skills, T24Tools, RepoMind, agentic-suite or AgentVerse as part of initial platform work.

**Reason:** establish architecture first and avoid destabilizing working projects.

## ADR-003 — R16 → R25 is the first vertical slice

Make upgrade impact intelligence the MVP because it combines repository intelligence, release-aware Temenos knowledge, orchestration and verification around a high-value banking problem.

## ADR-004 — Evidence-first automation

Findings and recommendations retain provenance and verification status.

**Reason:** upgrade engineering requires explainability and auditability.
