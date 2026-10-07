# Temenos Engineering Platform — Development Roadmap

Single developer-facing status file for the platform. **Completed** items are implemented in the repository. **Pending** items are the remaining work.

## Overall status

**Phases completed: 1–17**  
**Phases remaining: 3 planned phases (18–20)**  
**Current maturity: enterprise-hardening baseline; production execution remains external and approval-gated.**

---

## Phase status

| Phase | Status | Purpose |
|---|---|---|
| 1 | COMPLETED | Architecture & discovery |
| 2 | COMPLETED | Platform contracts, store, RepoMind boundary |
| 3 | COMPLETED | Temenos-Skills adapter |
| 4 | COMPLETED | Release-aware upgrade intelligence |
| 5 | COMPLETED | DAG orchestration and approval gate |
| 6 | COMPLETED | T24Tools read model |
| 7 | COMPLETED | Approval-gated remediation |
| 8 | COMPLETED | Regression intelligence |
| 9 | COMPLETED | Runtime/migration intelligence |
| 10 | COMPLETED | ADC zero-downtime intelligence |
| 11 | COMPLETED | Upgrade Control Tower |
| 12 | COMPLETED | Operations/execution boundary |
| 13 | COMPLETED | Live cutover evidence and incident control |
| 14 | COMPLETED | Cutover Command Center and scenario simulation |
| 15 | COMPLETED | Evidence federation |
| 16 | COMPLETED | Production connector boundaries and enterprise persistence |
| 17 | COMPLETED | Enterprise hardening and deployment baseline |
| 18 | PENDING | Production infrastructure implementation |
| 19 | PENDING | Enterprise UI, observability and scale |
| 20 | PENDING | Production certification and release |

---

# COMPLETED

## Phase 1 — Architecture & Discovery
- Source repositories kept independent.
- Capability → Adapter → Transport → Runtime model.
- Integration repository established.

## Phase 2 — Contracts & RepoMind
- Project, Run, Artifact, Evidence, Finding contracts.
- RepoMind exported-index boundary.
- Artifact/dependency normalization.

## Phase 3 — Temenos-Skills
- Field lookup.
- Rule search.
- Release comparison.
- Artifact verification boundary.

## Phase 4 — Upgrade Intelligence
- R16 → R25 correlation model.
- Impact/risk analysis.
- Remediation and verification recommendations.

## Phase 5 — Orchestration
- DAG workflow.
- Parallel discovery.
- Human approval gate.
- agentic-suite integration boundary.

## Phase 6 — T24Tools
- Upgrade dashboard.
- Risk list.
- Evidence view.
- Remediation checklist.
- Report export.

## Phase 7 — Remediation
- Remediation plans.
- Explicit approver.
- Rollback requirement.
- Verification.

## Phase 8 — Regression
- Focused regression packs.
- Compile/build tests.
- Runtime/log tests.
- Pre/post comparison.

## Phase 9 — Runtime & Migration
- Migration rehearsal.
- Data validation.
- Runtime smoke/log analysis.
- Readiness gate.

## Phase 10 — ADC Zero-Downtime
- Active R16 / standby R25 model.
- Dual-run compatibility.
- Session/transaction safety.
- ADC drain/switch boundary.
- Rollback window.

## Phase 11 — Control Tower
- Unified upgrade gates.
- Cutover timeline.
- Final approval.
- GO/NO-GO decision.

## Phase 12 — Operations
- External operation contracts.
- Dry/approval-required default.
- Operation evidence.

## Phase 13 — Live Cutover
- External result ingestion.
- Live telemetry.
- Incident policy.
- Audit hash chain.
- Cutover reconciliation.

## Phase 14 — Scenario Simulation
- What-if simulation.
- Readiness replay.
- Blast radius.
- Environment comparison.
- Operator handoff.

## Phase 15 — Evidence Federation
- Evidence normalization.
- Cross-system correlation.
- SHA-256 evidence snapshots.
- Event persistence.
- Command Center V15.

## Phase 16 — Enterprise Connectors
- PostgreSQL event-store boundary.
- Event-bus abstraction.
- ADC/runtime telemetry adapters.
- Tenant/retention policy.
- SLO metrics.
- Controlled external execution.
- Command Center V16.

## Phase 17 — Enterprise Hardening
- Production deployment profile.
- RBAC policy and authorization.
- Tenant-scoped audit export.
- Retention job planning.
- Immutable/encrypted evidence-storage policy.
- Disaster-recovery plan with external failover.
- Performance budgets.
- Deployment readiness gate.
- Phase 17 tests.

---

# PENDING

## Phase 18 — Production Infrastructure Implementation
**Goal:** turn Phase 16/17 provider boundaries into deployable enterprise infrastructure.

### Tasks
- [ ] PostgreSQL connection pool and migrations.
- [ ] Concrete Kafka/queue provider.
- [ ] Object-storage implementation.
- [ ] SSO/OIDC authentication.
- [ ] Enterprise RBAC/claims mapping.
- [ ] Secret-manager integration.
- [ ] Real retention workers.
- [ ] Audit export to enterprise SIEM.
- [ ] Concrete ADC/load-balancer connectors.
- [ ] Concrete TAFJ/runtime telemetry connector.
- [ ] HA deployment manifests.
- [ ] Backup/restore automation.

**Exit:** all infrastructure providers are deployable without changing platform contracts.

## Phase 19 — Enterprise UI, Observability & Scale
**Goal:** turn the platform into an operator-ready enterprise control plane.

### Tasks
- [ ] Full T24Tools Command Center UI.
- [ ] Live upgrade timeline.
- [ ] Evidence explorer.
- [ ] Tenant/project selector.
- [ ] RBAC-aware UI actions.
- [ ] SLO dashboards.
- [ ] Prometheus/OpenTelemetry integration.
- [ ] Alerting.
- [ ] Performance/load testing.
- [ ] Large repository scalability tests.
- [ ] Multi-bank/multi-project operational views.
- [ ] Operator incident workflow.

**Exit:** operators can monitor and manage the complete upgrade lifecycle from T24Tools without bypassing approval controls.

## Phase 20 — Production Certification & Release
**Goal:** certify the platform for real bank upgrade programs.

### Tasks
- [ ] End-to-end R16 → R25 rehearsal.
- [ ] Multi-environment SIT/UAT/pre-production validation.
- [ ] ADC zero-downtime rehearsal.
- [ ] Failure/rollback drills.
- [ ] Disaster-recovery drill.
- [ ] Security review.
- [ ] Dependency/license review.
- [ ] Penetration/security testing.
- [ ] Performance certification.
- [ ] Evidence/audit certification.
- [ ] Operational runbooks.
- [ ] Bank deployment checklist.
- [ ] Versioned release process.
- [ ] Production sign-off.

**Exit:** production certification package is complete and the platform is ready for controlled bank deployments.

---

# Architecture rule for every future phase

\`\`\`text
Domain Intelligence
       ↓
Platform Contract
       ↓
Adapter
       ↓
Infrastructure / Provider
       ↓
Evidence
       ↓
Policy / Gate
       ↓
Human Approval
       ↓
External Execution
       ↓
Audit + Evidence
\`\`\`

Never move production authority into an intelligence module.

## Current next action

**Phase 18 is the next implementation target.**

Do not add more domain intelligence before Phase 18 infrastructure is concrete and tested.
