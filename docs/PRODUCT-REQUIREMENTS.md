# Product Requirements Document — Temenos Engineering Platform

**Status:** Productized / validation stage  
**Date:** 2026-10-07  
**Repository:** zainknoman/Temenos-Engineering-Platform

## 1. Product Vision

Temenos Engineering Platform (TEP) is an engineering decision and workflow platform for banks running Temenos Transact. It correlates bank customization intelligence from RepoMind with release-specific Temenos knowledge from Temenos-Skills and turns that intelligence into an evidence-backed upgrade, regression, migration, ADC, certification and GO/NO-GO workflow.

TEP is not a replacement for RepoMind, Temenos-Skills, T24Tools or a generic agent runtime. Its product value is **cross-system correlation, workflow state, evidence, risk, policy and approval**.

## 2. Primary Problem

Temenos upgrade programs normally require engineers to manually connect:
- bank customization inventory;
- T24/Temenos release changes;
- dependency and impact analysis;
- remediation decisions;
- regression planning;
- migration validation;
- ADC/cutover readiness;
- evidence and approval.

This creates fragmented evidence, inconsistent decisions and weak traceability.

## 3. Target Users

- Temenos Solution Architects
- Core Banking Technical Leads
- Temenos Developers
- Upgrade/Migration Leads
- QA/UAT Leads
- Production/Release Managers
- Bank Technology Risk and Audit teams

## 4. Core Product Journey

`Bank Repository → RepoMind → Temenos-Skills → TEP Correlation → Risk → Remediation → Regression → Migration → ADC → Control Tower → Certification → Human GO/NO-GO`

## 5. Functional Requirements

### P0
1. Create and persist a bank/project workspace.
2. Ingest RepoMind exports.
3. Maintain source/target Temenos releases and environment.
4. Assess upgrade impact.
5. Generate risk and remediation findings.
6. Generate regression assessment.
7. Generate migration/runtime assessment.
8. Assess ADC zero-downtime readiness.
9. Aggregate gates in an Upgrade Control Tower.
10. Generate certification/evidence results.
11. Produce a stable JSON report/read model.
12. Enforce human approval before external execution.

### P1
13. Support real Temenos-Skills provider onboarding.
14. Support real evidence providers.
15. Provide enterprise Command Center/API hosting.
16. Support controlled external execution providers.
17. Persist enterprise run/evidence history.

### P2
18. Multi-bank/tenant SaaS operation.
19. Advanced analytics and historical benchmarking.
20. Broader upgrade paths beyond the initial R16→R25 flagship.

## 6. Non-Functional Requirements

- Deterministic offline/demo mode.
- Evidence-backed findings.
- Provider-neutral domain contracts.
- Read-only analysis by default.
- No autonomous production execution.
- Explicit human approval for external execution.
- Reproducible reports.
- Auditability and provenance.
- JavaScript/ESM core.
- CLI-first automation with browser read surface.

## 7. Success Criteria

A technical user can supply a representative bank customization inventory and receive a traceable, release-aware, actionable and reviewable engineering assessment through one workflow.

## 8. Product Boundary

TEP owns:
- project/run state;
- adapters;
- cross-system correlation;
- upgrade/migration workflows;
- risk and evidence aggregation;
- policy gates;
- reports;
- approval boundaries.

TEP does **not** own:
- the Temenos knowledge corpus;
- repository parsing/indexing;
- generic agent runtime;
- provider-specific production infrastructure.

## 9. Safety

Production deployment, migration execution, rollback and ADC traffic switching remain external actions. Certification is not equivalent to production authorization.
