# Phase 12 — Execution Adapter & Operations Integration

Phase 12 adds explicit external-operation contracts for health checks, migration validation, runtime/log collection, deployment, rollback and ADC drain/switch/rollback.

## Boundary

The platform does not own production execution. OperationsExecutionAdapter is an adapter boundary with two modes:

- default: dry/approval-required; no external action occurs
- configured runner + allowExecution=true: delegates an explicitly requested action to an external executor

Every operation carries human-approval and external-execution requirements. ADC switching and rollback are never autonomous.

## Control flow

Control Tower -> approved operation request -> external executor -> result -> evidence -> Control Tower/T24Tools.

The adapter intentionally does not assume a specific ADC vendor, deployment platform, migration tool, observability product or API.