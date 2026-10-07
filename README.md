# Temenos Engineering Platform

Integration and workflow platform for Temenos engineering intelligence.

## Completed lifecycle

Phases 1–17 established the architecture, contracts, RepoMind and Temenos-Skills integration, upgrade/regression/migration intelligence, ADC zero-downtime planning, control tower, live evidence, scenario simulation, enterprise persistence boundaries and hardening.

## Phase 18 — Production Infrastructure

Concrete provider implementations now exist behind stable platform boundaries for PostgreSQL pooling/migrations, Kafka/queue transport, object storage, OIDC claims, secret management, retention, SIEM audit export, ADC/load-balancer control, TAFJ runtime telemetry, backup/restore and HA deployment.

Providers are injected; no cloud/vendor SDK is required by the core package.

## Phase 19 — Enterprise Operations

The platform exposes a tenant/RBAC-aware Command Center surface, Prometheus-compatible metrics, SLO dashboard data, alert evaluation, operator incident workflow and measurable load-budget utilities.

## Phase 20 — Production Certification

Certification plans cover R16→R25 rehearsal, multi-environment validation, ADC zero-downtime, rollback, DR, security, dependencies, performance, evidence/audit, runbooks and deployment checklists. Production sign-off remains explicit human approval.

## Safety

`productionExecution` and `autonomousExecution` remain false throughout intelligence and platform layers. External execution requires an explicit provider and human approval.

See `docs/DEVELOPMENT-ROADMAP.md` for the single phase status and remaining release gates.
