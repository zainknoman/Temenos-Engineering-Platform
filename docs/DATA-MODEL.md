# Common Data Model

The platform needs a small normalized model. External systems may have richer internal models; adapters translate into these objects.

## Project

Represents one bank/upgrade initiative.

```
id
name
sourceRelease
targetRelease
repository
environment
status
createdAt
updatedAt
```

## Artifact

Represents a technical object.

```
id
projectId
type
name
path
application
release
language
metadata
sourceSystem
externalId
```

Artifact types should include at least:

- ROUTINE
- INSERT
- VERSION
- ENQUIRY
- SERVICE
- JAVA_HOOK
- COMPONENT
- APPLICATION
- FIELD
- API
- CLASS
- CONFIG_RECORD

## Dependency

```
id
projectId
fromArtifactId
toArtifactId
kind
confidence
sourceSystem
```

## Finding

```
id
projectId
artifactId
category
severity
status
title
description
recommendation
sourceRelease
targetRelease
evidenceIds[]
dependencyIds[]
```

## Evidence

Evidence is mandatory for high-confidence upgrade findings.

```
id
sourceSystem
sourceType
sourceReference
release
contentHash
excerpt
collectedAt
toolVersion
```

Do not store large proprietary source documents in every finding. Store references/hashes and only the minimum excerpt needed for traceability.

## Verification

```
id
artifactId
method
release
status
commandOrCheck
result
evidenceId
```

Examples: FIELD_CHECK, COMPILE, STATIC_ANALYSIS, TEST, MANUAL_REVIEW.

## Workflow Run

```
id
projectId
workflow
version
status
startedAt
completedAt
currentStage
approvalState
```

## Report

```
id
projectId
runId
type
status
generatedAt
summary
findingIds[]
evidenceIds[]
```

## Design rule

Core objects must remain provider-neutral. External IDs and raw provider payloads belong under adapter metadata, not in domain logic.
