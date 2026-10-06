import { createEvidence } from '../core/contracts.js';

export const RUNTIME_STATUS=Object.freeze(['NOT_RUN','RUNNING','PASSED','FAILED','BLOCKED','INCONCLUSIVE']);
export const MIGRATION_STATUS=Object.freeze(['NOT_STARTED','REHEARSAL','VALIDATED','FAILED','BLOCKED','INCONCLUSIVE']);
export const GATE_STATUS=Object.freeze(['OPEN','READY','BLOCKED']);

const stableId=value=>{let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
const status=value=>String(value??'').trim().toUpperCase();

export function buildExecutionPlan({project,regressionPack=null,artifacts=[],findings=[]}){
  if(!project?.id) throw new Error('project.id is required');
  const applications=[...new Set([
    ...(regressionPack?.affectedApplications??[]),
    ...artifacts.map(a=>a.application).filter(Boolean)
  ])];
  return {
    schemaVersion:'1.0',type:'RUNTIME_MIGRATION_EXECUTION_PLAN',projectId:project.id,
    sourceRelease:project.sourceRelease,targetRelease:project.targetRelease,status:'NOT_STARTED',
    stages:[
      {id:'compile-build',kind:'COMPILE_BUILD',status:'NOT_RUN',required:true},
      {id:'migration-rehearsal',kind:'MIGRATION_REHEARSAL',status:'NOT_RUN',required:true},
      {id:'data-validation',kind:'DATA_VALIDATION',status:'NOT_RUN',required:true},
      {id:'runtime-smoke',kind:'RUNTIME_SMOKE',status:'NOT_RUN',required:true},
      {id:'runtime-logs',kind:'RUNTIME_LOG_ANALYSIS',status:'NOT_RUN',required:true},
      {id:'pre-post-runtime',kind:'PRE_POST_RUNTIME_COMPARISON',status:'NOT_RUN',required:true}
    ],
    affectedApplications:applications,
    findingIds:findings.map(f=>f.id),
    generatedAt:new Date().toISOString()
  };
}

export function collectExecutionEvidence({project,stageResults=[]}){
  return stageResults.map((result,index)=>createEvidence({
    id:'evidence:execution:'+project.id+':'+(result.stageId??index),
    sourceSystem:result.sourceSystem??'Temenos-Engineering-Platform',
    sourceType:result.sourceType??result.kind??'EXECUTION_RESULT',
    sourceReference:result.reference??result.stageId??project.id,
    release:result.release??project.targetRelease,
    toolVersion:result.toolVersion??'phase-9',
    excerpt:JSON.stringify({
      status:result.status??'UNKNOWN',
      summary:result.summary??null,
      errors:result.errors??[],
      metrics:result.metrics??null
    }).slice(0,4000)
  }));
}

export function validateMigrationRehearsal({sourceSnapshot,targetSnapshot,expectedCounts={},keys=[]}){
  if(!sourceSnapshot||!targetSnapshot) return {status:'INCONCLUSIVE',checks:[],reason:'Both sourceSnapshot and targetSnapshot are required'};
  const checks=[];
  for(const key of keys){
    const sourceCount=Number(sourceSnapshot[key]?.count??sourceSnapshot[key]??0);
    const targetCount=Number(targetSnapshot[key]?.count??targetSnapshot[key]??0);
    checks.push({key,sourceCount,targetCount,delta:targetCount-sourceCount,passed:sourceCount===targetCount});
  }
  for(const [key,expected] of Object.entries(expectedCounts)){
    const actual=Number(targetSnapshot[key]?.count??targetSnapshot[key]??0);
    checks.push({key,expected,actual,passed:actual===Number(expected)});
  }
  const statusValue=checks.length&&checks.every(c=>c.passed)?'VALIDATED':checks.some(c=>!c.passed)?'FAILED':'INCONCLUSIVE';
  return {status:statusValue,checks};
}

export function analyzeRuntimeLogs({logs=[]}){
  const entries=logs.map((log,index)=>{
    const text=String(log.message??log.text??log).toLowerCase();
    const severity=status(log.severity??(text.includes('error')||text.includes('exception')?'ERROR':'INFO'));
    return {id:log.id??'log:'+index,severity,message:log.message??log.text??String(log),reference:log.reference??null,hasError:['ERROR','FATAL','SEVERE'].includes(severity)};
  });
  const errors=entries.filter(e=>e.hasError);
  return {status:errors.length?'FAILED':'PASSED',total:entries.length,errorCount:errors.length,entries};
}

export function compareRuntimeBehavior({pre={},post={}}){
  const keys=[...new Set([...Object.keys(pre),...Object.keys(post)])];
  const comparisons=keys.map(key=>{
    const before=pre[key]??null, after=post[key]??null;
    const changed=JSON.stringify(before)!==JSON.stringify(after);
    return {key,before,after,changed,status:before===null||after===null?'INCOMPLETE':changed?'CHANGED':'UNCHANGED'};
  });
  const changed=comparisons.filter(c=>c.status==='CHANGED');
  const incomplete=comparisons.filter(c=>c.status==='INCOMPLETE');
  return {status:incomplete.length?'INCONCLUSIVE':changed.length?'INCONCLUSIVE':'PASSED',changed:changed.length,incomplete:incomplete.length,comparisons};
}

export function buildReadinessGate({executionPlan,stageResults=[],migrationValidation=null,runtimeComparison=null,rollbackReady=false}){
  const byStage=new Map(stageResults.map(r=>[r.stageId,r]));
  const required=executionPlan?.stages?.filter(s=>s.required)??[];
  const missing=required.filter(s=>!byStage.has(s.id));
  const failed=required.filter(s=>['FAILED','BLOCKED'].includes(status(byStage.get(s.id)?.status)));
  const buildOk=status(byStage.get('compile-build')?.status)==='PASSED';
  const runtimeOk=status(byStage.get('runtime-smoke')?.status)==='PASSED'&&status(byStage.get('runtime-logs')?.status)!=='FAILED';
  const migrationOk=migrationValidation?.status==='VALIDATED';
  const comparisonOk=!runtimeComparison||runtimeComparison.status==='PASSED';
  const ready=!missing.length&&!failed.length&&buildOk&&runtimeOk&&migrationOk&&comparisonOk&&rollbackReady;
  return {
    schemaVersion:'1.0',type:'DEPLOYMENT_READINESS_GATE',status:ready?'READY':'BLOCKED',
    checks:{missingStages:missing.map(s=>s.id),failedStages:failed.map(s=>s.id),buildOk,runtimeOk,migrationOk,comparisonOk,rollbackReady},
    recommendation:ready?'READY_FOR_HUMAN_DEPLOYMENT_APPROVAL':'DO_NOT_DEPLOY'
  };
}

export function buildRuntimeMigrationAssessment({project,executionPlan,evidence=[],migrationValidation=null,runtimeAnalysis=null,runtimeComparison=null,readinessGate=null}){
  return {
    schemaVersion:'1.0',type:'RUNTIME_MIGRATION_ASSESSMENT',projectId:project.id,
    sourceRelease:project.sourceRelease,targetRelease:project.targetRelease,
    status:readinessGate?.status??'BLOCKED',
    migration:migrationValidation?{status:migrationValidation.status,checks:migrationValidation.checks}:null,
    runtime:runtimeAnalysis?{status:runtimeAnalysis.status,errorCount:runtimeAnalysis.errorCount}:null,
    runtimeComparison:runtimeComparison?{status:runtimeComparison.status,changed:runtimeComparison.changed,incomplete:runtimeComparison.incomplete}:null,
    readinessGate:readinessGate??null,evidenceIds:evidence.map(e=>e.id),
    generatedAt:new Date().toISOString(),executionPlanId:executionPlan.type+':'+project.id
  };
}
