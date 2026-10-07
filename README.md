# Temenos Engineering Platform

Integration and workflow platform for Temenos engineering intelligence.

## Architecture

- Temenos-Skills — Temenos release/domain knowledge
- RepoMind — bank customization repository intelligence
- agentic-suite — workflow/conductor integration
- AgentVerse — optional generic agent/runtime provider
- T24Tools — presentation/cockpit surface

The platform owns cross-system correlation, evidence, risk, workflow policy, remediation, reports and enterprise integration contracts.

## Flagship capability

R16 -> R25 Upgrade & Migration Intelligence

Bank Repository -> RepoMind -> Temenos-Skills -> Correlation/Impact -> Risk -> Remediation -> Verification/Regression -> Runtime/Migration -> ADC Zero-Downtime -> Upgrade Control Tower -> Human Approval -> External Operations -> Live Cutover Evidence -> Cutover Command Center -> Evidence Federation -> Enterprise Persistence/Telemetry -> Controlled External Execution

## Implemented phases

1. architecture/discovery
2. contracts/store/RepoMind boundary
3. Temenos-Skills adapter
4. release-aware upgrade intelligence
5. orchestration
6. T24Tools surface
7. approval-gated remediation
8. regression intelligence
9. runtime/migration intelligence
10. ADC zero-downtime intelligence
11. Upgrade Control Tower
12. Execution Adapter & Operations Integration
13. Live Cutover Evidence & Incident Control
14. Cutover Command Center & Scenario Simulation
15. Production Integration & Evidence Federation
16. Production Connectors & Enterprise Persistence

## Phase 16

Phase 16 adds PostgreSQL/event-bus persistence boundaries, ADC/runtime telemetry adapters, tenant and retention policy, operational SLO metrics, controlled external execution integration, and the V16 T24Tools command-center contract.

Production execution remains external and explicitly approval-gated. Credentials and infrastructure clients remain outside the platform contracts.

See docs/PHASES-FLOWCHART.md for developer-friendly flowcharts for every phase and docs/PHASE-16-PRODUCTION-CONNECTORS.md for the Phase 16 design.
