# Temenos Engineering Platform — Phases Flowcharts

Developer reference for the complete platform evolution. Each phase shows inputs, processing, gates, and outputs. Production execution remains external and human-approved.

## Phase 1 — Architecture & Discovery
\`\`\`mermaid
flowchart LR
A[Independent source repositories] --> B[Discover capabilities]
B --> C[Define boundaries]
C --> D[Capability -> Adapter -> Transport -> Runtime]
D --> E[Integration architecture]
\`\`\`

## Phase 2 — Contracts, Store & RepoMind Boundary
\`\`\`mermaid
flowchart LR
A[RepoMind exported index] --> B[RepoMind Adapter]
B --> C[Normalize artifacts and dependencies]
C --> D[Platform contracts]
D --> E[Project / Run / Evidence / Finding store]
\`\`\`

## Phase 3 — Temenos-Skills Adapter
\`\`\`mermaid
flowchart LR
A[Platform request] --> B[Temenos-Skills Adapter]
B --> C{Capability}
C -->|Fields| D[Field lookup]
C -->|Rules| E[Rule search]
C -->|Releases| F[Release diff]
C -->|Verify| G[Compile / field verification]
D --> H[Evidence]
E --> H
F --> H
G --> H
\`\`\`

## Phase 4 — Release-Aware Upgrade Intelligence
\`\`\`mermaid
flowchart LR
A[RepoMind artifacts] --> B[Release comparison]
C[Temenos-Skills evidence] --> B
B --> D[Correlation]
D --> E[Impact and risk]
E --> F[Findings]
F --> G[Remediation + verification plan]
\`\`\`

## Phase 5 — Orchestration
\`\`\`mermaid
flowchart LR
A[Assessment request] --> B[Inventory]
B --> C[Release comparison]
C --> D[Correlation]
D --> E[Risk and remediation]
E --> F{Human review}
F -->|Approved| G[Verification and report]
F -->|Not approved| H[Stop]
\`\`\`

## Phase 6 — T24Tools Surface
\`\`\`mermaid
flowchart LR
A[Platform assessment] --> B[T24Tools read model]
B --> C[Dashboard]
B --> D[Risk list]
B --> E[Evidence]
B --> F[Remediation checklist]
B --> G[Report export]
\`\`\`

## Phase 7 — Approval-Gated Remediation
\`\`\`mermaid
flowchart LR
A[Findings] --> B[Create remediation plan]
B --> C{Named approver}
C -->|Approved| D[External apply boundary]
C -->|Rejected| E[No change]
D --> F[Verification]
F --> G[Evidence + rollback record]
\`\`\`

## Phase 8 — Regression Intelligence
\`\`\`mermaid
flowchart LR
A[Changed artifacts] --> B[Impact analysis]
B --> C[Focused test pack]
C --> D[Compile and build tests]
C --> E[Functional tests]
C --> F[Runtime and log tests]
D --> G[Pre / post comparison]
E --> G
F --> G
G --> H[Regression gate]
\`\`\`

## Phase 9 — Runtime & Migration Intelligence
\`\`\`mermaid
flowchart LR
A[Upgrade assessment] --> B[Execution plan]
B --> C[Build / compile]
C --> D[Migration rehearsal]
D --> E[Data validation]
E --> F[Runtime smoke]
F --> G[Runtime logs]
G --> H[Pre / post behavior]
H --> I[Readiness gate]
\`\`\`

## Phase 10 — ADC Zero-Downtime
\`\`\`mermaid
flowchart LR
A[Active R16] --> B[Standby R25]
B --> C[Health checks]
C --> D[Compatibility + dual-run gate]
D --> E[Data / migration checkpoints]
E --> F[Session / transaction safety]
F --> G[Human approval]
G --> H[External ADC drain / switch]
H --> I[Post-switch validation]
I --> J[Rollback window]
\`\`\`

## Phase 11 — Upgrade Control Tower
\`\`\`mermaid
flowchart LR
A[Upgrade] --> E[Control Tower]
B[Regression] --> E
C[Runtime / Migration] --> E
D[ADC readiness] --> E
E --> F[Unified timeline]
F --> G{Final human approval}
G -->|GO| H[External cutover]
G -->|NO-GO| I[Stop]
\`\`\`

## Phase 12 — Operations Integration
\`\`\`mermaid
flowchart LR
A[Approved operation request] --> B[Operation adapter]
B --> C[Preconditions]
C --> D{Approval + readiness}
D -->|No| E[Blocked]
D -->|Yes| F[External runner]
F --> G[Operation result]
G --> H[Evidence]
\`\`\`

## Phase 13 — Live Cutover Evidence & Incident Control
\`\`\`mermaid
flowchart LR
A[External operation result] --> B[Live evidence ingestion]
C[Health telemetry] --> D[Telemetry evaluation]
B --> E[Cutover state]
D --> E
E --> F[Incident policy]
F --> G{Rollback recommended?}
G -->|Yes| H[Human approval]
H --> I[External rollback]
G -->|No| J[Continue]
E --> K[Audit hash chain]
\`\`\`

## Phase 14 — Cutover Command Center & Scenario Simulation
\`\`\`mermaid
flowchart LR
A[Current cutover state] --> B[Scenario builder]
B --> C[What-if gate changes]
B --> D[Blast-radius simulation]
B --> E[Environment comparison]
C --> F[Scenario result]
D --> F
E --> F
F --> G[Operator handoff]
G --> H[T24Tools command center]
\`\`\`

## Phase 15 — Evidence Federation
\`\`\`mermaid
flowchart LR
A[RepoMind evidence] --> D[Normalize]
B[Temenos-Skills evidence] --> D
C[Runtime / operation evidence] --> D
D --> E[Correlation ID]
E --> F[Evidence snapshot + SHA-256]
F --> G[Event store]
G --> H[Command center]
\`\`\`

## Phase 16 — Production Connectors & Enterprise Persistence
\`\`\`mermaid
flowchart LR
A[Bank / tenant context] --> B[Access policy]
B --> C[Production connectors]
C --> D{Enterprise sources}
D -->|PostgreSQL| E[Enterprise event store]
D -->|Kafka / Queue| F[Event bus]
D -->|ADC / Load Balancer| G[Telemetry]
D -->|Runtime| G
F --> H[Telemetry + evidence federation]
G --> H
E --> H
H --> I[Retention + correlation]
I --> J[SLO + operational metrics]
J --> K[Cutover Command Center]
K --> L{Human approval}
L -->|Approved| M[Controlled external execution]
L -->|Not approved| N[Blocked]
M --> O[Result + audit evidence]
O --> E
\`\`\`

## End-to-End Platform Flow
\`\`\`mermaid
flowchart LR
A[Bank customization repository] --> B[RepoMind]
B --> C[Temenos-Skills]
C --> D[Upgrade Intelligence]
D --> E[Regression]
E --> F[Runtime / Migration]
F --> G[ADC Zero-Downtime]
G --> H[Control Tower]
H --> I[Human Approval]
I --> J[External Operations]
J --> K[Live Evidence]
K --> L[Scenario / Command Center]
L --> M[Evidence Federation]
M --> N[Enterprise Persistence + Telemetry]
N --> O[SLO + Operations]
O --> P[Controlled Execution]
P --> Q[Audit / Evidence]
\`\`\`

## Developer Rule
**Intelligence first, adapters second, infrastructure third, execution last.** Every production connector must be replaceable, tenant-scoped, auditable, and approval-gated.
