# Phase 7 — Approved Remediation Workflows

Phase 7 adds an approval-gated remediation boundary around upgrade findings.

## Flow

1. Create a remediation plan from findings.
2. Link candidate changes to affected artifacts and evidence.
3. Keep candidate changes explicit; the platform does not invent exact source replacements.
4. Require a named human approver.
5. Capture rollback information before applying any approved change.
6. Apply through an injected runtime callback.
7. Verify compile/build and focused regression results through an injected verifier.
8. Preserve remediation provenance as evidence.

## Safety

The platform never silently modifies a repository or production environment. Application and verification require explicit runtime callbacks, so source control, deployment and Temenos runtime access remain outside the domain layer.

Production migration and ADC traffic switching are not part of Phase 7.

## Lifecycle

DRAFT -> WAITING_APPROVAL -> APPROVED -> APPLIED -> VERIFIED

Failure states are FAILED; rejected plans can be represented as REJECTED.

## CI

.github/workflows/cli.yml runs npm test on every branch push and on pull requests targeting main, using Node.js 20 and 22.
