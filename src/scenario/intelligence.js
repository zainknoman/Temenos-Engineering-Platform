const U=v=>String(v??'').trim().toUpperCase();
const list=v=>Array.isArray(v)?v:[];
const ready=v=>['READY','PASSED','COMPLETED','HEALTHY','VALIDATED'].includes(U(v));
const clone=v=>JSON.parse(JSON.stringify(v??null));
const gateAliases={'control-tower':'controlTower','runtime-migration':'runtimeMigration'};
export const SCENARIO_STATUS=Object.freeze(['BASELINE','READY','BLOCKED','SIMULATED']);
export function buildCutoverScenario({project,controlTower=null,adc=null,runtimeMigration=null,regression=null,overrides={}}={}){
 if(!project?.id)throw new Error('project.id is required');
 const gates=[
  {id:'control-tower',status:U(overrides.controlTowerStatus??controlTower?.status??'BLOCKED')},
  {id:'adc',status:U(overrides.adcStatus??adc?.status??'BLOCKED')},
  {id:'runtime-migration',status:U(overrides.runtimeMigrationStatus??runtimeMigration?.status??'BLOCKED')},
  {id:'regression',status:U(overrides.regressionStatus??regression?.status??'INCONCLUSIVE')}
 ];
 const blocked=gates.filter(g=>!ready(g.status));
 return{schemaVersion:'1.0',type:'CUTOVER_SCENARIO',id:overrides.id??'scenario:'+project.id,name:overrides.name??'Baseline',projectId:project.id,sourceRelease:project.sourceRelease,targetRelease:project.targetRelease,mode:'SIMULATION',status:blocked.length?'BLOCKED':'READY',gates,overrides:clone(overrides),safety:{simulationOnly:true,productionExecution:false,autonomousExecution:false,humanApprovalRequired:true},generatedAt:new Date().toISOString()};
}
export function simulateCutoverScenario({scenario,changes={}}={}){
 if(!scenario?.id)throw new Error('scenario.id is required');
 const gateChanges=changes.gates??{};
 const gates=scenario.gates.map(g=>{const alias=gateAliases[g.id];const value=gateChanges[g.id]??gateChanges[alias]??g.status;return{...g,status:U(value)};});
 const blockers=gates.filter(g=>!ready(g.status));
 const riskDelta=Number(changes.riskDelta??0);
 return{schemaVersion:'1.0',type:'CUTOVER_SCENARIO_RESULT',scenarioId:scenario.id,mode:'SIMULATION',status:blockers.length?'BLOCKED':'SIMULATED',gates,changes:clone(changes),risk:{baselineDelta:riskDelta,direction:riskDelta>0?'INCREASED':riskDelta<0?'DECREASED':'UNCHANGED'},recommendation:blockers.length?'DO_NOT_PROCEED_IN_SCENARIO':'SCENARIO_READY_FOR_REVIEW',safety:{productionExecution:false,autonomousExecution:false,humanApprovalRequired:true}};
}
export function replayCutoverReadiness({timeline=[],events=[]}={}){
 const observed=new Set(list(events).map(e=>e.stageId??e.id));
 const stages=list(timeline).map((stage,index)=>{const id=stage.id??'stage:'+index;const observedStage=events.find(e=>(e.stageId??e.id)===id);const passed=observed.has(id)&&['PASSED','READY','COMPLETED','SUCCEEDED'].includes(U(observedStage?.status));return{id,sequence:stage.sequence??index+1,label:stage.label??stage.name??id,expectedStatus:stage.status??'UNKNOWN',observedStatus:observedStage?.status??'NOT_OBSERVED',replayedReady:passed};});
 const missing=stages.filter(s=>!s.replayedReady).map(s=>s.id);
 return{schemaVersion:'1.0',type:'CUTOVER_READINESS_REPLAY',status:missing.length?'BLOCKED':'READY',stages,missingStageIds:missing,completedCount:stages.length-missing.length,totalStages:stages.length,safety:{simulationOnly:true,productionExecution:false}};
}
export function simulateBlastRadius({rootArtifactIds=[],dependencies=[],artifacts=[]}={}){
 const roots=new Set(list(rootArtifactIds)), byFrom=new Map();
 list(dependencies).forEach(d=>{if(!byFrom.has(d.fromArtifactId))byFrom.set(d.fromArtifactId,[]);byFrom.get(d.fromArtifactId).push(d);});
 const seen=new Set(roots), queue=[...roots], edges=[];
 while(queue.length){const from=queue.shift();for(const d of byFrom.get(from)??[]){edges.push(d);if(!seen.has(d.toArtifactId)){seen.add(d.toArtifactId);queue.push(d.toArtifactId);}}}
 const affected=list(artifacts).filter(a=>seen.has(a.id));
 return{schemaVersion:'1.0',type:'BLAST_RADIUS_SIMULATION',rootArtifactIds:[...roots],affectedArtifactIds:[...seen],affectedArtifacts:affected,dependencyEdgeCount:edges.length,depthAware:false,safety:{simulationOnly:true,productionExecution:false}};
}
export function compareCutoverEnvironments({environments=[]}={}){
 const envs=list(environments),keys=[...new Set(envs.flatMap(e=>Object.keys(e.metrics??{})))];
 const comparisons=keys.map(key=>({key,values:Object.fromEntries(envs.map(e=>[e.name??e.id,e.metrics?.[key]??null])),consistent:new Set(envs.map(e=>JSON.stringify(e.metrics?.[key]??null))).size<=1}));
 const blockers=envs.filter(e=>!ready(e.readiness??e.status??'BLOCKED')).map(e=>e.name??e.id);
 return{schemaVersion:'1.0',type:'CUTOVER_ENVIRONMENT_COMPARISON',environments:envs.map(e=>({id:e.id??e.name,name:e.name??e.id,status:e.status??e.readiness??'UNKNOWN'})),metricComparisons:comparisons,inconsistentMetrics:comparisons.filter(c=>!c.consistent).map(c=>c.key),readinessBlockers:blockers,status:blockers.length?'BLOCKED':'COMPARED',safety:{simulationOnly:true,productionExecution:false}};
}
export function buildOperatorHandoff({project,controlTower=null,timeline=[],incidents=[],openFindings=[],contacts=[]}={}){
 if(!project?.id)throw new Error('project.id is required');
 const blockers=[...list(openFindings).filter(f=>U(f.severity)==='CRITICAL'&&U(f.status??'OPEN')!=='CLOSED'),...list(incidents).filter(i=>i.triggered&&!['RESOLVED','CLOSED'].includes(U(i.status)))];
 return{schemaVersion:'1.0',type:'CUTOVER_OPERATOR_HANDOFF',projectId:project.id,projectName:project.name,controlTowerStatus:controlTower?.status??'BLOCKED',timeline:list(timeline),blockers,contacts:list(contacts),operatorChecklist:['CONFIRM_FINAL_GO_NO_GO','CONFIRM_EXTERNAL_EXECUTION_OWNER','CONFIRM_ROLLBACK_OWNER','CONFIRM_TELEMETRY','CONFIRM_AUDIT_CHAIN','EXECUTE_ONLY_AFTER_HUMAN_APPROVAL'],handoffStatus:blockers.length?'BLOCKED':'READY',safety:{productionExecution:false,autonomousExecution:false,humanApprovalRequired:true,externalExecutionRequired:true}};
}