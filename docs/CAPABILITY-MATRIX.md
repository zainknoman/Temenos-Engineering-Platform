# Capability Matrix

## Capability-level comparison

| Capability | Temenos-Skills | RepoMind | agentic-suite | AgentVerse | T24Tools | Platform owns? |
|---|---:|---:|---:|---:|---:|---:|
| T24 field truth | **Primary** | secondary/reference | no | no | consumes knowledge | correlation |
| T24 Java/API truth | **Primary** | partial Java analysis | no | no | class viewer | correlation |
| Release comparison | **Primary** | no | no | no | release UI | workflow use |
| Code generation | **Primary** | no | generic build | generic generation | **Primary UI** | remediation policy |
| Compile/verification | **Primary** | no | generic verification | generic execution | displays tools | evidence aggregation |
| Repository indexing | supporting | **Primary** | build survey | project context | no | normalization |
| Symbols/references | no | **Primary** | no | generic agents | no | correlation |
| Dependency graph | limited T24 component analysis | **Primary** | workflow DAG | execution DAG | visual utility | cross-domain graph |
| T24 routine/config analysis | **Primary knowledge** | **Primary bank analysis** | no | no | developer UI | correlation |
| Impact analysis | T24 release impact | **Primary code impact** | task impact | workflow impact | tool navigation | **Primary cross-system** |
| Workflow orchestration | no | no | **Primary** | secondary | no | workflow contracts |
| Human approval | no | limited investigation UX | **Primary** | **Primary** | UI only | policy boundary |
| Agent execution | Claude Code skill | browser/local AI context | Claude Code agents | **Primary** | no | agent definitions |
| Memory | knowledge DB | saved context | state/memory | **Primary** | browser state | project/run state |
| Sandbox | no | no | target-dependent | **Primary** | browser isolation | policy |
| Unified report | knowledge/report inputs | repository reports | build summaries | pipeline outputs | UI outputs | **Primary** |
| Bank project/run state | no | local workspace | workflow state | DB-backed projects | browser state | **Primary** |

## Reuse priority

### Must reuse in MVP

1. Temenos-Skills release knowledge and verification.
2. RepoMind repository intelligence.
3. agentic-suite workflow concepts and state model.

### Useful but deferred

4. AgentVerse provider/runtime/sandbox capabilities.
5. T24Tools UI and visualization patterns.

### Must not duplicate

- Temenos product knowledge corpus
- RepoMind parser/index implementation
- agentic-suite generic conductor
- AgentVerse generic agent registry/runtime
- T24Tools application implementation

## Architectural implication

The platform is valuable because it **correlates** capabilities that are currently separated. It should not attempt to rebuild them.
