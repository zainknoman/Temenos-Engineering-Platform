# App Flow Document — Temenos Engineering Platform

## 1. End-to-End Flow

```
Bank Repository
      |
      v
RepoMind Inventory / Export
      |
      v
TEP Project Workspace
      |
      v
Normalize Artifacts + Dependencies
      |
      v
Temenos-Skills Release Knowledge
      |
      v
Correlation / Impact Analysis
      |
      v
Risk Classification
      |
      v
Remediation Recommendations
      |
      v
Regression Assessment
      |
      v
Migration + Runtime Validation
      |
      v
ADC Zero-Downtime Assessment
      |
      v
Upgrade Control Tower
      |
      v
Certification / Evidence
      |
      v
Human GO / NO-GO
      |
      +---- NO-GO ----> HOLD / REMEDIATE / REASSESS
      |
      +---- APPROVED --> External Controlled Execution
```

## 2. CLI Flow

### Intake
```
tep project create
        ↓
tep project show
```

### Repository
```
tep inventory --input <RepoMind export>
        ↓
persist source path
        ↓
inventory/read model
```

### Assessment
```
tep upgrade assess
tep regression assess
tep migration assess
tep adc assess
tep control-tower assess
tep certify
        ↓
tep report
tep report --format json
tep status
```

### Demo
```
tep demo r16-r25
        ↓
NO_GO / approval pending

tep demo r16-r25 --approval APPROVED
        ↓
decision artifact only
```

## 3. Browser Command Center Flow

```
Load Report JSON
      ↓
Normalize report
      ↓
Project / Adapter status
      ↓
Upgrade / Risk
      ↓
Remediation
      ↓
Regression / Migration
      ↓
ADC
      ↓
Certification
      ↓
Evidence / Audit
      ↓
Final GO / NO-GO
```

## 4. Human Gate

The system may calculate readiness, but it must not silently convert readiness into production execution.

Technical readiness:
`READY`

Approval state:
`PENDING`

Final decision:
`NO-GO`

These are intentionally separate states.

## 5. Failure Flow

Any failed technical gate should:
1. identify the failing stage;
2. preserve evidence;
3. block dependent gates;
4. prevent external execution;
5. produce remediation/reassessment guidance.

## 6. Design Principle

The UI displays read models. It does not implement Temenos intelligence. Domain engines remain outside the browser surface.
