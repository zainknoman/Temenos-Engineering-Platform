# Next Phase

## Phase 21 — Productization + Real-World Validation

### Current Work: 21.2 — Project / Workspace Model

Phase 21.1 CLI Foundation is complete: `tep` entry point, help/version contract, focused tests, and full CI validation.

The active implementation slice is **21.2 — Project / Workspace Model**.

### 21.2 implementation

- Stable project identity and versioned workspace configuration
- Local or Git repository source configuration
- Explicit Temenos source/target release pair
- Environment metadata
- Project-level safety policy
- JSON persistence/load support
- Deterministic unit tests

### Completion rule

21.2 must not be marked COMPLETE until the new tests and the complete existing test suite pass in CI.

### After 21.2

Proceed to **21.3 — Product CLI Workflows**, beginning with:

1. `tep project create`
2. `tep project show`
3. `tep inventory`

All workflows must reuse existing TEP domain engines and adapters.

Production execution remains disabled by default and explicitly human-approval gated.
