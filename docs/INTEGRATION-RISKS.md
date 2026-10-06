# Integration Risks

## R1 — No common API across repositories

**Impact:** high  
**Mitigation:** capability adapters with explicit transports and normalized contracts.

## R2 — RepoMind is browser/local-first

**Impact:** high  
**Mitigation:** initially integrate through an exported analysis model or a local adapter. Avoid introducing an unnecessary network service before the workflow proves value.

## R3 — T24Tools is a UI, not the domain engine

**Impact:** medium  
**Mitigation:** keep it as a presentation/integration surface; do not make core workflows depend on its internal React modules.

## R4 — agentic-suite and AgentVerse overlap

**Impact:** high  
**Mitigation:** agentic-suite is the workflow conductor; AgentVerse is optional execution/runtime infrastructure. Do not create two competing orchestrators.

## R5 — Release evidence may be incomplete

**Impact:** critical  
**Mitigation:** findings carry release/source provenance and verification state. Missing evidence becomes an explicit limitation, not a guessed answer.

## R6 — Bank-specific code can contain dynamic behavior

**Impact:** high  
**Mitigation:** preserve RepoMind confidence and blind spots; classify uncertain relationships separately.

## R7 — Proprietary Temenos data

**Impact:** critical  
**Mitigation:** do not copy Temenos knowledge databases/JARs into this repository. Store references, hashes and derived metadata only where licensing permits.

## R8 — Autonomous remediation risk

**Impact:** critical  
**Mitigation:** MVP is analysis-only. Any future write path requires approval, dry-run, audit evidence and reversible execution.

## R9 — Provider/runtime coupling

**Impact:** medium  
**Mitigation:** AgentVerse and AI providers sit behind runtime interfaces.

## R10 — Overbuilding before proving value

**Impact:** high  
**Mitigation:** implement one complete R16 → R25 assessment using real sample/customization data before broadening the platform.
