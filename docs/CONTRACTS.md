# Integration Contracts

Stable contracts are required before deep integrations.

## Core entities

### Project
Represents a bank, upgrade initiative and source/target context.

### Artifact
Normalized representation of a T24 customization or related object.

Suggested fields: `id, type, name, source, release, location, metadata, dependencies`.

### Finding
A technical observation or incompatibility.

Suggested fields: `id, projectId, artifactId, category, severity, status, summary, evidenceIds, recommendation`.

### Evidence
Proof supporting a finding.

Suggested fields: `id, sourceSystem, sourceReference, release, excerptOrHash, collectedAt`.

### Workflow
A named business/engineering process with versioned steps.

### Run
One execution of a workflow for a project.

### Report
Human-readable aggregation of findings, evidence, decisions and verification state.

## Adapter principles

Adapters hide external implementation details, expose capability-based methods, return normalized objects, preserve source references, report capability/version information, and fail explicitly when evidence is unavailable.

Contracts should be versioned once implementation begins.
