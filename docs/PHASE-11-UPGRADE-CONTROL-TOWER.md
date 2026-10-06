# Phase 11 — Upgrade Control Tower

Phase 11 unifies the R16 -> R25 upgrade assessment, regression, runtime/migration and ADC zero-downtime readiness into one auditable control-tower model.

## Gate order

1. Upgrade assessment
2. Regression readiness
3. Runtime and migration readiness
4. ADC zero-downtime readiness
5. Final human deployment approval

The control tower produces a single cutover timeline, gate state, blocker summary and go/no-go recommendation.

## Safety

The control tower never treats machine readiness as deployment authorization. A READY_FOR_APPROVAL state means all configured evidence gates are ready and final human approval can be requested. Only an explicit APPROVED deployment decision changes the final evaluation to GO.

Production migration, deployment, ADC traffic drain/switch and rollback remain external execution capabilities.