# Source Repository Baselines

Phase 1 inspected the current default branches. These are discovery baselines, not vendored dependencies.

| Repository | Branch | Primary evidence inspected | Integration conclusion |
|---|---|---|---|
| Temenos-Skills | master | README, CLAUDE.md, MCP server, release/verification pipeline | domain/evidence provider |
| T24Tools | main | README, package manifest | browser cockpit/presentation provider |
| RepoMind | main | README, analyzer contract, concepts, T24 services | bank repository intelligence provider |
| agentic-suite | master | README, conductor/agent-builder references, plugin manifest | workflow conductor |
| AgentVerse | main | README, backend package, DAG, permission, memory, pipeline and sandbox modules | optional runtime provider |

## Temenos-Skills evidence

Important verified capabilities include:

- R23 and R25 release knowledge
- field/application/class lookup
- release-diff pipeline
- 59 compile-verified artefact types
- field verification
- compile verification
- optional MCP server with field lookup and semantic rule search
- component analysis
- migration/integration/admin/devsecops/architecture skills

## T24Tools evidence

The current application provides:

- Routine Builder
- Artefact Generator
- OFS Message Generator
- T24 Log Analyzer
- Application Viewer
- JAR Viewer
- Markdown Viewer
- active release switching
- browser-local knowledge files

It explicitly keeps data in the browser and consumes published Temenos-Skills knowledge files.

## RepoMind evidence

The current codebase intelligence model provides:

- files/languages
- symbols
- references
- imports/exports
- dependencies
- impact
- health
- analyzers
- Git intelligence
- reports/context
- Temenos BASIC/T24 analyzers
- Java and configuration-aware T24 analysis
- confidence and blind-spot reporting

The T24 analyzer currently has known gaps around some VERSION/EB.API/PGM.FILE attachment relationships, dynamic calls and some component dependencies. These limitations must remain visible in platform findings.

## agentic-suite evidence

The current suite provides:

- conductor
- BUILD/GROW/ACT routing
- global dependency graph scheduling
- milestone gates
- approvals
- crash-resume state
- dashboards
- agent registry
- target adapters
- handoff/state contracts

The suite is therefore the best fit for workflow execution rather than domain knowledge.

## AgentVerse evidence

The current runtime provides:

- multiple AI providers
- REST API
- DAG execution
- validation/retry
- permission modes
- vector memory
- isolated-vm sandbox
- plugin system
- App Builder pipeline orchestration
- project/step state

It overlaps with agentic-suite at orchestration level. This is why it is optional for the MVP.

## Baseline rule

If any source repository changes materially, Phase 1 conclusions must be revalidated before the affected adapter is implemented.
