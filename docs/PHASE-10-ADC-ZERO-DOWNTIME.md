# Phase 10 — ADC Zero-Downtime Upgrade Intelligence

Phase 10 adds planning and readiness intelligence for an R16 -> R25 upgrade where the ADC-facing channel must remain available.

## Flow

R16 active ADC -> R25 standby -> compatibility/dual-run gate -> migration checkpoint -> session/transaction safety -> human approval -> external traffic drain -> external switch -> post-switch validation -> rollback window.

## Scope

- active/standby topology and health evidence
- target-release compatibility and dual-run readiness
- session, sticky-session and in-flight transaction safety
- migration checkpoints
- controlled traffic drain/switch plan
- rollback and traffic-reversal readiness
- human approval before traffic switching
- T24Tools cockpit model

## Safety boundary

The platform does not switch ADC traffic. It produces a machine-readable plan and readiness gate. Actual drain, promotion, switching and rollback remain external execution capabilities and require explicit human approval.

A READY gate means sufficient evidence exists to request human deployment approval. It is not deployment authorization.

## Evidence

Missing or failed health, compatibility, migration, session, rollback or approval evidence blocks the gate rather than being inferred.