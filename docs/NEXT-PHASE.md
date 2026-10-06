# Next Phase

Phase 9 is complete.

## Phase 10 — ADC Zero-Downtime Upgrade Intelligence

Build on runtime and migration evidence to plan a controlled R16 → R25 cutover without taking the ADC channel down:

- active/standby channel topology and health checks
- compatibility and dual-run readiness
- traffic drain/switch planning
- session and transaction safety checks
- migration checkpoint gates
- rollback and traffic-reversal readiness
- human approval before any traffic switch

The platform should generate a cutover plan and readiness evidence first. Actual ADC traffic switching remains an external deployment capability behind explicit approval.

R16 → R25 remains evidence-complete only when the configured Temenos-Skills release knowledge contains the required source baseline. If R16 is unavailable, the platform must report the limitation rather than infer the diff.
