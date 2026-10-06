# MVP Implementation Backlog

## Epic A — Platform foundation

- define JavaScript domain types/interfaces
- adapter registry
- project/run persistence
- evidence store
- structured logging
- configuration for source/target releases

**Acceptance:** a local run can be created and persisted without external integrations.

## Epic B — RepoMind integration

- adapter interface
- local analysis import
- artifact normalization
- dependency normalization
- confidence/limitation mapping

**Acceptance:** a representative T24 customization repository becomes platform Artifacts and Dependencies.

## Epic C — Temenos-Skills integration

- release provider
- field lookup
- class/API lookup
- release diff
- rule search
- verification result adapter

**Acceptance:** a finding can cite release-specific Temenos evidence.

## Epic D — Correlation engine

- T24 artifact-to-field mapping
- artifact-to-application mapping
- dependency correlation
- release-change matching
- risk scoring with evidence

**Acceptance:** at least one realistic customization produces an explainable impact finding.

## Epic E — Assessment workflow

- intake
- inventory
- release baseline
- correlation
- risk
- recommendations
- verification plan
- human gate
- report

**Acceptance:** one complete run reaches a final report.

## Epic F — agentic-suite integration

- workflow definition adapter
- run state synchronization
- gate synchronization
- event mapping
- resume support

**Acceptance:** the same assessment can be executed through agentic-suite without changing domain logic.

## Epic G — T24Tools surface

- findings endpoint/model
- report endpoint/model
- impact graph payload
- run status payload

**Acceptance:** T24Tools can consume a platform result without importing platform internals.

## Deferred

- AgentVerse as mandatory runtime
- automatic source rewriting
- production deployment execution
- ADC traffic switching
- full regression automation
- SaaS/enterprise multi-tenancy
