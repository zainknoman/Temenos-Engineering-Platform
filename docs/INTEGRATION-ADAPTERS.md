# Integration Adapter Design

Adapters are ports between the platform and external repositories. They must return platform contracts and preserve source provenance.

## 1. Temenos-Skills adapter

### Purpose

Expose release-aware Temenos evidence.

### Required capabilities

```
lookupField(release, application, field)
lookupApplication(release, application)
lookupClass(release, className)
searchRules(query, release, topic?)
compareReleases(sourceRelease, targetRelease)
verifyArtifact(artifact, release)
generateArtifact(request, release)
```

### Preferred transport

Use the existing MCP/CLI/pipeline surfaces where practical. Do not read the internal SQLite database directly from the platform as the primary contract.

### Evidence

Return source reference, release, lookup type, verification result and tool version.

## 2. RepoMind adapter

### Purpose

Turn a bank customization repository into normalized codebase intelligence.

### Required capabilities

```
indexRepository(source)
getRepositoryProfile()
listArtifacts(filter?)
findSymbol(query)
findReferences(symbol)
getDependencies(node)
getDependents(node)
analyzeImpact(node, options)
runAnalyzer(analyzerId?)
getLimitations()
```

### Initial transport

Because RepoMind is currently browser/local-first, the first adapter should be a thin local integration boundary around its analysis model or an exported analysis artifact. Do not create a fake remote API merely for symmetry.

## 3. agentic-suite adapter

### Purpose

Delegate long-running workflow orchestration.

### Required capabilities

```
createWorkflow(definition)
startRun(runId)
pauseRun(runId)
resumeRun(runId)
approveGate(runId, gateId)
getRunState(runId)
getRunEvents(runId)
```

### Boundary

The platform owns the business workflow definition. agentic-suite owns execution mechanics such as scheduling, task parallelism, state persistence and dashboard mechanics.

## 4. AgentVerse adapter

### Purpose

Optional generic runtime.

### Required capabilities

```
executeAgent(request)
executePipeline(request)
requestApproval(request)
memoryRead(request)
memoryWrite(request)
sandboxExecute(request)
```

### MVP rule

Do not make the first R16 → R25 assessment depend on AgentVerse. Add it after the workflow works using the simplest reliable execution path.

## 5. T24Tools adapter

T24Tools is primarily a presentation surface, not a backend dependency.

Initial integration should expose platform results in a form T24Tools can consume later:

- project/run status
- findings
- evidence
- reports
- artifact details
- impact graph data

Do not embed T24Tools source in this repository.

## Adapter contract rules

Every adapter must:

- declare its version/capabilities
- return normalized objects
- preserve provenance
- expose explicit failures
- identify unavailable capabilities
- avoid leaking provider-specific types into core
- be replaceable without changing domain workflows
