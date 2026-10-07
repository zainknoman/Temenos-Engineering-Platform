# Background Schema — Temenos Engineering Platform

## 1. Purpose

This schema describes the conceptual domain behind TEP. It is intentionally provider-neutral so RepoMind, Temenos-Skills and future enterprise providers can evolve independently.

## 2. Core Entity Model

```
Project
  |
  +-- WorkflowRun
  |      |
  |      +-- Finding
  |      |     |
  |      |     +-- Evidence
  |      |     +-- Dependency
  |      |
  |      +-- Verification
  |      +-- Gate
  |
  +-- Artifact
  |      |
  |      +-- Dependency
  |
  +-- Report
         |
         +-- Finding[]
         +-- Evidence[]
```

## 3. Project

```
id
name
sourceRelease
targetRelease
repository
environment
status
policy
createdAt
updatedAt
```

Represents one bank upgrade/migration initiative.

## 4. Artifact

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

Examples:
ROUTINE, INSERT, VERSION, ENQUIRY, SERVICE, JAVA_HOOK, COMPONENT, APPLICATION, FIELD, API, CLASS, CONFIG_RECORD.

## 5. Dependency

```
id
projectId
fromArtifactId
toArtifactId
kind
confidence
sourceSystem
```

Dependencies may be direct, transitive, runtime, configuration or provider-derived.

## 6. Finding

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

A finding must be explainable and traceable to evidence whenever confidence is material.

## 7. Evidence

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

Large proprietary source material should not be duplicated into every finding.

## 8. Verification

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

## 9. Workflow Run

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

## 10. Gate

Conceptually:

```
id
runId
name
status
required
blocking
checks[]
evidenceIds[]
approvalRequired
approvalState
```

Gates connect technical evidence to decision policy.

## 11. Report

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

## 12. Provider Boundary

Provider-specific objects must not leak into core entities. Use:

`Domain Entity → Adapter Metadata → Provider Payload`

This is essential for replacing deterministic fixtures with real RepoMind/Temenos-Skills/enterprise providers without rewriting the domain model.
