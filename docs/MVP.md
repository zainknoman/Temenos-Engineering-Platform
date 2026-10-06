# MVP Definition

## Product

**R16 → R25 Upgrade & Migration Intelligence**

## Input

- bank customization repository
- source release R16
- target release R25
- optional environment metadata and migration constraints

## Processing

1. inventory custom code
2. normalize artifacts
3. identify dependencies
4. compare relevant release knowledge
5. identify impacted fields, APIs, applications, components and routines
6. classify risk
7. recommend remediation
8. identify verification requirements
9. generate regression/test plan
10. produce evidence-backed report

## Output

Each finding should contain, where available:

- artifact
- source/target release
- finding type
- severity/risk
- explanation
- evidence
- affected dependencies
- recommended action
- verification status
- provenance

## Success criteria

A technical user can provide a representative customization repository and receive a report that is traceable, release-aware, evidence-backed, actionable, reproducible and reviewable.

The MVP is **analysis and decision support**, not autonomous production migration.
