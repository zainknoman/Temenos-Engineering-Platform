# Phase 6 — T24Tools Surface

Phase 6 creates the presentation boundary for T24Tools without moving Temenos domain logic into the UI.

## Ownership

- **Temenos Engineering Platform** owns project/run state, upgrade analysis, evidence, risk classification, remediation and verification policy.
- **T24Tools** consumes a stable read model and renders the cockpit.
- The T24Tools adapter does not mutate source code, release databases or production systems.

## Read model

`buildT24ToolsDashboard()` produces a versioned `schemaVersion: 1.0` payload containing:

1. upgrade summary
2. artifact risk list
3. evidence viewer data
4. remediation/verification checklist
5. exportable Markdown report

The payload is intentionally presentation-oriented. T24Tools should not reimplement release-diff, risk or remediation logic.

## Adapter contract

`T24ToolsAdapter` exposes:

- `getUpgradeDashboard`
- `getArtifactRiskList`
- `getEvidence`
- `getRemediationChecklist`
- `exportReport`

This is a local/read-model boundary today. A future T24Tools API integration can transport the same contract through HTTP without changing the domain layer.

## Safety

Phase 6 remains analysis-only. The cockpit can display recommended actions and verification steps, but it cannot approve source rewriting, migration, production deployment or ADC traffic switching through this adapter.

## R16 → R25 evidence rule

The dashboard reports whether release evidence is available. It never fabricates an R16 baseline from another release. Missing R16 knowledge remains a limitation from Temenos-Skills.
