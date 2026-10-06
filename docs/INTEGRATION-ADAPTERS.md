# Integration Adapter Design

Adapters are ports between the platform and external repositories. They return platform contracts and preserve provenance.

## Adapter lifecycle

Each adapter declares:
- id and version
- capabilities
- transport
- runtime mode
- provider limitations
- structured failure categories

The transport can change without changing workflow code.

## 1. Temenos-Skills adapter

Capabilities:
lookupField, lookupApplication, lookupClass, searchRules, compareReleases, verifyArtifact, generateArtifact

Preferred transport: MCP/CLI worker. The worker owns provider authentication and process lifecycle.

Evidence includes source reference, release, lookup type, verification result and tool version.

## 2. RepoMind adapter

Capabilities:
indexRepository, getRepositoryProfile, listArtifacts, findSymbol, findReferences, getDependencies, getDependents, analyzeImpact, runAnalyzer, getLimitations

Phase 2 transport: exported analysis JSON. This is intentionally read-only and avoids inventing a fake remote API for RepoMind's browser/local-first architecture.

The adapter normalizes files, symbols/dependencies and limitations into platform artifacts, dependencies and evidence.

## 3. agentic-suite adapter

Capabilities:
createWorkflow, startRun, pauseRun, resumeRun, approveGate, getRunState, getRunEvents

Transport: worker/CLI initially. The platform owns business workflow definitions; agentic-suite owns scheduling, task parallelism, state and dashboard mechanics.

## 4. AgentVerse adapter

Capabilities:
executeAgent, executePipeline, requestApproval, memoryRead, memoryWrite, sandboxExecute

Transport: HTTP/API.

MVP rule: AgentVerse is optional. Do not make the first R16 → R25 assessment depend on it.

## 5. T24Tools adapter

T24Tools is primarily a presentation surface. Initial integration exposes:
- project/run status
- findings
- evidence
- reports
- artifact details
- impact graph data

Do not embed T24Tools source here.

## Adapter contract rules

Every adapter must:
- declare version, capabilities, transport and runtime mode
- return normalized objects
- preserve provenance
- expose explicit failures
- identify unavailable capabilities
- avoid leaking provider-specific types into core
- be replaceable without changing domain workflows
