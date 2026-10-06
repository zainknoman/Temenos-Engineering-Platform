# Phase 3 — Temenos-Skills Adapter

## Status

Phase 3 is implemented as a **local worker/CLI adapter**.

The adapter does not import Temenos-Skills source into the platform and does not require a network service.

## Runtime

Set:

`TEMENOS_SKILLS_HOME=D:\\path\\to\\Temenos-Skills`

Optional:

`TEMENOS_SKILLS_PYTHON=python`

The platform starts a short-lived Python process in that repository and invokes the existing Temenos-Skills pipeline modules. Provider credentials or Claude authentication are not stored by the platform.

## Implemented capabilities

### Field lookup

Uses the release knowledge DB directly through the existing `pipeline.releases.open_release_db()` contract.

`lookupField({ release, application, field })`

This is the Layer A ground-truth path and never falls back to semantic search.

### Rule search

Uses the existing offline TF-IDF/Chroma knowledge base.

`searchRules({ query, topic, nResults })`

### Release comparison

Uses the existing `pipeline.release_diff.diff_releases()` implementation against complete release DBs.

`compareReleases({ oldRelease, newRelease })`

### Artifact verification

Uses the existing `pipeline.artefact_fields.check_fields()` field gate.

`verifyArtifact({ file, application, release })`

The platform deliberately does not silently invoke the full compile/install verification path. Compile verification remains an explicit Temenos-Skills operation because it may depend on a real T24 installation and local build environment.

## Provenance

Every result returns platform Evidence:
- sourceSystem = Temenos-Skills
- sourceType
- release
- sourceReference
- toolVersion
- bounded excerpt

## Failure categories

The adapter distinguishes provider-unavailable and runtime failures. Workflow code can therefore pause or request an alternative provider instead of treating every failure as a business finding.

## Security

The platform does not persist:
- API keys
- Claude credentials
- MCP credentials
- T24 installation secrets

They remain in the execution environment.

## Phase 3 boundary

This phase validates and implements the first real execution boundary. MCP/Claude Code worker integration remains an alternative transport, not a requirement for the domain contract.
