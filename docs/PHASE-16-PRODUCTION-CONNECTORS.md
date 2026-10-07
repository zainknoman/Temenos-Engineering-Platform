# Phase 16 — Production Connectors & Enterprise Persistence

## Goal
Move Phase 15 integration-ready boundaries toward enterprise deployment without moving production authority into the platform.

## Implemented
- PostgreSQL event-store adapter using an injected parameterized query executor.
- PostgreSQL schema/index definition.
- Event-bus abstraction for Kafka/queue implementations.
- Queue telemetry adapter boundary.
- HTTP telemetry adapter plus ADC/load-balancer and runtime specializations.
- Tenant context, tenant authorization and retention policy.
- Operational SLO evaluation and platform metrics.
- Controlled execution-provider wrapper for AgentVerse/agentic-suite or another external executor.
- T24Tools command center upgraded to the V16 read model.

## Architecture
Provider -> Adapter -> Tenant Policy -> Evidence/Event Store -> Correlation -> SLO/Assessment -> T24Tools -> Human Approval -> External Execution -> Audit Evidence.

## Production connector rule
Credentials, database pools, Kafka clients, ADC credentials and runtime authentication belong to the hosting/runtime layer. Adapters receive an already-authorized client or handler. The platform does not persist secrets.

## PostgreSQL
PostgresEventStore uses an injected query(sql, params) function, so pg, a managed database client, or another PostgreSQL-compatible implementation can be supplied by the deployment. Event values use parameterized SQL.

## Event bus
EventBusAdapter is provider-neutral. Kafka, RabbitMQ, Azure Service Bus or another queue can implement publish/subscribe without changing platform contracts.

## Telemetry
HttpTelemetryAdapter is the common boundary. AdcTelemetryAdapter and RuntimeTelemetryAdapter specialize source identity/capability. No endpoint is contacted until a base URL and fetch implementation are supplied.

## Tenancy and retention
Every enterprise event should carry tenantId. Tenant authorization must be evaluated before reads/writes. Retention is policy data; destructive cleanup remains approval-controlled.

## Execution safety
ControlledExecutionProvider refuses requests without explicit APPROVED or GO status. Even after approval it labels execution as EXTERNAL and returns the provider result for audit. It does not deploy, migrate, switch ADC traffic or rollback itself.

## SLOs
The platform evaluates availability, error-rate and latency targets from collected measurements and exposes the result to the command center.

## Exit criteria
- Enterprise persistence and event-bus boundaries are concrete.
- ADC/runtime telemetry connectors are concrete and safe when unconfigured.
- Tenant and retention policy are explicit.
- SLO/operational metrics are available.
- Controlled external execution integration is approval-gated.
- T24Tools command center consumes the V16 model.
- All Phase 1–16 tests pass locally before release.
