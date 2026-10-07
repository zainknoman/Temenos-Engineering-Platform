# Phase 21 Flagship R16 → R25 Demo

The flagship workflow is a deterministic, read-only validation of the full Phase 21 engineering lifecycle.

## Run

    powershell
    node bin/tep.js demo r16-r25 > flagship-r16-r25.json

The command runs the following existing domain engines:

1. RepoMind repository inventory.
2. Temenos-Skills release comparison using a deterministic provider fixture.
3. R16 → R25 artifact correlation.
4. Upgrade risk classification and remediation recommendations.
5. Regression test-pack generation and pre/post comparison.
6. Runtime/migration execution planning, data validation, log analysis and readiness gating.
7. ADC topology, compatibility, session safety, migration checkpoint, traffic-switch and rollback analysis.
8. Upgrade control-tower decision.
9. Certification evidence and release-candidate validation.
10. Human GO/NO-GO evaluation.

No bank source code is modified and no external execution is performed.

## Human approval gate

Default:

    powershell
    node bin/tep.js demo r16-r25

The workflow uses PENDING approval. The expected result is:

- ADC readiness: BLOCKED
- Control Tower: BLOCKED
- GO/NO-GO: NO_GO
- Autonomous execution: false
- Production execution: false

The approval path can be demonstrated deterministically:

    powershell
    node bin/tep.js demo r16-r25 --approval APPROVED > flagship-r16-r25-approved.json

The expected result becomes:

- ADC readiness: READY
- Control Tower: READY_FOR_APPROVAL
- GO/NO-GO: GO
- Certification: CERTIFIED
- Production signoff: APPROVED

GO is a decision artifact only. The platform still does not switch ADC traffic or perform a production deployment.

## Fixture

The bank customization fixture contains representative:

- CUSTOMER jBC customization.
- CUSTOMER Java hook.
- FUNDS jBC customization.
- Cross-artifact dependencies.
- R16 → R25 field removal.
- Field movement.
- jBC rename.
- Target-release field addition.

Fixtures:

- test/fixtures/phase21-flagship-repomind-export.json
- test/fixtures/phase21-flagship-release-diff.json

The executable implementation is src/product/flagship.js, which composes existing Phase 4/8/9/10/11/20 domain engines rather than duplicating them.

## Expected validation

    powershell
    node --test test/phase21-flagship.test.js
    npm test
    node bin/tep.js --help
    node bin/tep.js demo r16-r25

The flagship demo is deterministic except for generated evidence timestamps in underlying domain evidence records.

## Safety boundary

The demo is read-only. It demonstrates planning, evidence, readiness and human approval states. Production execution, migration, rollback, ADC traffic switching and failover remain external actions requiring explicit human approval and provider configuration.
