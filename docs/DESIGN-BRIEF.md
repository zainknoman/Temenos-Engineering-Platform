# Design Brief — Temenos Engineering Platform

## 1. Product Character

TEP should feel like an **engineering command system**, not a generic dashboard and not an AI chat application.

Primary design qualities:
- technical;
- evidence-driven;
- operational;
- auditable;
- calm under high-risk upgrade conditions;
- explicit about uncertainty and approval.

## 2. Information Hierarchy

The user should immediately see:

1. **Project** — bank, source release, target release, environment.
2. **Overall gate** — READY / BLOCKED / NO-GO.
3. **Critical risks** — what can stop the upgrade.
4. **Lifecycle state** — upgrade, regression, migration, ADC, certification.
5. **Evidence** — why the platform reached the decision.
6. **Approval** — who/what is waiting for human action.

## 3. Visual Language

Use:
- compact enterprise cards;
- status badges;
- evidence-linked findings;
- stage/timeline views;
- dependency/impact visualization;
- clear warning and blocker hierarchy;
- monospace presentation for technical identifiers, releases and commands.

Avoid:
- decorative AI imagery;
- excessive animations;
- consumer-style gradients;
- hidden gate logic;
- ambiguous green states;
- presenting certification as production authorization.

## 4. Command Center Layout

Recommended structure:

```
Header
  Project / Environment / Release Pair

Decision Banner
  Technical Readiness | ADC | Certification | Final GO/NO-GO

Lifecycle
  Upgrade → Regression → Migration → ADC → Control Tower → Certification

Risk & Findings
  Critical / High / Medium / Low

Evidence
  Source → Check → Result → Timestamp

Approval
  Pending / Approved / Rejected

Operational Actions
  Assess | Re-run | Export | Review
```

## 5. Status Semantics

- **READY** = technical checks satisfy the current gate.
- **PASSED** = completed validation succeeded.
- **BLOCKED** = a required gate is not satisfied.
- **PENDING** = human or external action is outstanding.
- **CERTIFIED** = engineering certification criteria passed.
- **APPROVED** = authorized human decision recorded.
- **NO-GO** = controlled execution must not proceed.

## 6. Trust Model

Every important result should answer:
- What was checked?
- Which provider produced it?
- What evidence supports it?
- What is unknown?
- What decision follows?
- Can a human override it, and how is that recorded?

## 7. Product Positioning

TEP should be positioned as the **engineering control plane for Temenos upgrade and migration programs**, with the ability to expand into broader Temenos engineering lifecycle management.

Its differentiator is not another parser, agent or UI. It is the correlation and governance layer connecting specialist tools.
