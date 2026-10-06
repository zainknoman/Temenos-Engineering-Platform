# Next Phase

Phase 4 is complete.

## Phase 5 — Orchestration

The next implementation step is to integrate **agentic-suite** as the workflow conductor:
- run the assessment as a DAG
- parallelize independent repository/release analyses
- persist resumable workflow state
- add explicit human approval gates before remediation
- expose run events and progress
- keep AgentVerse optional as an execution/runtime provider

The domain logic remains in this platform. agentic-suite should orchestrate it rather than become the source of Temenos upgrade rules.

## Phase 6 — T24Tools Surface

After orchestration, expose the assessment/report through T24Tools:
- upgrade dashboard
- artifact risk list
- evidence viewer
- remediation/verification checklist
- exportable report

## Important boundary

R16 → R25 is only as evidence-complete as the configured Temenos-Skills release knowledge. If the provider does not contain R16, the platform must report the missing baseline and must not infer an R16 diff from R23/R25 data.
