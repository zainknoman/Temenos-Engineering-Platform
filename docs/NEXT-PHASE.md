# Next Phase

Phase 6 is complete.

## Phase 7 — Approved Remediation Workflows

Build approval-gated remediation workflows around findings:

- generate candidate code/config changes
- attach exact evidence and affected artifacts
- require human approval before applying changes
- verify compile/build and focused regression tests
- preserve before/after provenance and rollback information

No production migration or ADC traffic switching is automatic.

## Later

- regression intelligence
- ADC zero-downtime upgrade planning
- migration execution controls

R16 → R25 remains evidence-complete only when the configured Temenos-Skills release knowledge contains the required source baseline. If R16 is unavailable, the platform must report the limitation rather than infer the diff.
