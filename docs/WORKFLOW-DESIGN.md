# Workflow Design — R16 → R25 Assessment

## Goal

Produce an evidence-backed assessment of bank customizations affected by an R16 → R25 upgrade.

## Stage 0 — Intake

Input:

- bank repository
- source release
- target release
- optional migration constraints

Create Project and Run.

## Stage 1 — Repository inventory

RepoMind:

- index source
- identify T24 BASIC
- identify Java hooks/classes
- identify configuration records
- build symbols/references/dependencies
- identify analysis blind spots

Output: normalized Artifacts + Dependencies.

## Stage 2 — Release baseline

Temenos-Skills:

- load source/target release knowledge
- identify relevant application/field/API/class changes
- retrieve release-diff evidence
- establish target coding/verification rules

Output: release evidence.

## Stage 3 — Correlation

For each bank artifact:

`bank artifact → referenced T24 object → release change → dependency path`

This is the platform's highest-value domain logic.

## Stage 4 — Risk classification

Suggested factors:

- release object removed/renamed/moved
- field/API signature change
- artifact directly depends on changed object
- transitive dependency depth
- compile/verification evidence
- repository analysis confidence
- production criticality metadata

Initial risk:

`Critical > High > Medium > Low > Informational`

Risk must retain its contributing evidence rather than being an unexplained LLM label.

## Stage 5 — Remediation recommendation

Generate a proposed action:

- no action
- review
- field/API update
- routine refactor
- Java hook update
- componentization update
- configuration review
- regression test required

No production write.

## Stage 6 — Verification plan

For each actionable finding:

- field validation
- compile
- static analysis
- targeted test
- OFS/regression scenario
- manual review

Use Temenos-Skills verification where supported.

## Stage 7 — Human gate

The engineer reviews:

- critical/high findings
- evidence
- recommendations
- known blind spots
- verification results

The platform records the decision.

## Stage 8 — Report

Produce:

1. executive summary
2. inventory
3. release-change summary
4. impact graph
5. risk register
6. remediation recommendations
7. verification plan
8. blind spots/limitations
9. evidence appendix

## Future extension

The same normalized run can later feed controlled remediation, generated tests, ADC planning and migration execution.
