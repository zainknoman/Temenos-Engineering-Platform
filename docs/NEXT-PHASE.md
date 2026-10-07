# Next Phase

## Phase 21 — Productization + Real-World Validation

### Current Work: 21.4 — Real Adapter Onboarding

Phase 21.1–21.3 are implemented on `main`. The active slice is 21.4: connect the existing RepoMind and Temenos-Skills adapter contracts to deterministic onboarding/readiness checks without enabling production execution.

### 21.4 implementation

- [x] Validate RepoMind export/input shape.
- [x] Discover adapter identity, transport, version and capabilities.
- [x] Validate required capabilities before provider calls.
- [x] Add RepoMind readiness/health check.
- [x] Add Temenos-Skills worker readiness/health check using the existing injected runner contract.
- [x] Normalize RepoMind artifacts, dependencies and evidence through the existing adapter.
- [x] Preserve offline/deterministic worker tests.
- [x] Add deterministic integration fixture.
- [x] Keep onboarding read-only and production execution disabled.

### Completion rule

21.4 is complete only after the focused adapter tests, the complete test suite and CI all pass.

### After 21.4

Proceed to **21.5 — Report / Read API**.

The next product surface should expose stable read models for project summary, findings/risk, remediation, regression, migration, ADC, certification and evidence/audit history.

### CLI help maintenance rule

Every new CLI command or subcommand must be added to `src/cli.js`, its focused tests, and the **CLI Help** tab in `docs/index.html` in the same implementation change.

Production execution remains disabled by default and explicitly human-approval gated.
