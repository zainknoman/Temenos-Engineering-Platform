import { createEvidence } from '../core/contracts.js';

export const REGRESSION_STATUS=Object.freeze(['PLANNED','RUNNING','PASSED','FAILED','BLOCKED','INCONCLUSIVE']);
export const REGRESSION_PRIORITY=Object.freeze(['P0','P1','P2','P3']);

const severityPriority={Critical:'P0',High:'P1',Medium:'P2',Low:'P3',Informational:'P3'};
const stableId=value=>{let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
const normalize=value=>String(value??'').trim();
const unique=items=>[...new Map(items.map(item=>[item.id,item])).values()];

function artifactApplication(artifact){
  return normalize(artifact?.application||artifact?.metadata?.application||String(artifact?.path||'').split('/')[0])||'UNKNOWN';
}

function flowFor(artifact, finding, businessFlows){
  const app=artifactApplication(artifact);
  const explicit=businessFlows?.find(flow=>normalize(flow.application).toUpperCase()===app.toUpperCase());
  return explicit?.id||explicit?.name||('FLOW:'+app);
}

function buildTest({id,kind,title,priority,artifactId=null,application='UNKNOWN',flowId=null,evidenceIds=[]}){
  return {id,kind,title,priority,artifactId,application,flowId,evidenceIds,status:'PLANNED'};
}

export function buildRegressionTestPack({project,findings=[],artifacts=[],dependencies=[],businessFlows=[]}){
  if(!project?.id) throw new Error('project.id is required');
  const artifactMap=new Map(artifacts.map(a=>[a.id,a]));
  const tests=[];
  const affectedApps=new Set();
  for(const finding of findings){
    const artifact=artifactMap.get(finding.artifactId);
    const application=artifactApplication(artifact);
    const flowId=flowFor(artifact,finding,businessFlows);
    affectedApps.add(application);
    tests.push(buildTest({
      id:'regression:'+stableId(project.id+'|finding|'+finding.id),
      kind:'FOCUSED_FUNCTIONAL',
      title:'Validate '+(artifact?.name||finding.artifactId||finding.title)+' against the '+project.targetRelease+' behavior contract.',
      priority:severityPriority[finding.severity]??'P3',
      artifactId:finding.artifactId??null,application,flowId,evidenceIds:finding.evidenceIds??[]
    }));
  }
  for(const application of affectedApps){
    tests.push(buildTest({
      id:'regression:'+stableId(project.id+'|compile|'+application),
      kind:'COMPILE_BUILD',
      title:'Compile/build affected '+application+' customizations on '+project.targetRelease+'.',
      priority:'P1',application,flowId:'FLOW:'+application
    }));
    tests.push(buildTest({
      id:'regression:'+stableId(project.id+'|runtime|'+application),
      kind:'RUNTIME_LOG_CHECK',
      title:'Check '+application+' runtime/log behavior for new errors after upgrade.',
      priority:'P1',application,flowId:'FLOW:'+application
    }));
  }
  const affectedArtifactIds=new Set(findings.map(f=>f.artifactId).filter(Boolean));
  for(const dependency of dependencies){
    if(!affectedArtifactIds.has(dependency.fromArtifactId)&&!affectedArtifactIds.has(dependency.toArtifactId)) continue;
    tests.push(buildTest({
      id:'regression:'+stableId(project.id+'|dependency|'+dependency.id),
      kind:'DEPENDENCY_IMPACT',
      title:'Validate dependency behavior for '+dependency.fromArtifactId+' -> '+dependency.toArtifactId+'.',
      priority:'P1',artifactId:dependency.fromArtifactId
    }));
  }
  const finalTests=unique(tests);
  return {
    schemaVersion:'1.0',type:'REGRESSION_TEST_PACK',projectId:project.id,
    sourceRelease:project.sourceRelease,targetRelease:project.targetRelease,
    generatedAt:new Date().toISOString(),status:finalTests.length?'PLANNED':'INCONCLUSIVE',
    affectedApplications:[...affectedApps],affectedFlows:[...new Set(finalTests.map(t=>t.flowId).filter(Boolean))],
    tests:finalTests
  };
}

function resultSignature(result){
  if(result===null||result===undefined) return '';
  if(typeof result==='string') return result;
  return JSON.stringify(result);
}

export function comparePrePostBehavior({testPack,preUpgrade={},postUpgrade={}}){
  if(!testPack?.tests) throw new Error('testPack.tests is required');
  const pre=new Map(Object.entries(preUpgrade.tests??{}));
  const post=new Map(Object.entries(postUpgrade.tests??{}));
  const comparisons=testPack.tests.map(test=>{
    const before=pre.get(test.id)??null;
    const after=post.get(test.id)??null;
    const beforeStatus=normalize(before?.status??'NOT_RUN').toUpperCase();
    const afterStatus=normalize(after?.status??'NOT_RUN').toUpperCase();
    const beforeSignature=resultSignature(before?.result);
    const afterSignature=resultSignature(after?.result);
    const changed=Boolean(before&&after&&(beforeStatus!==afterStatus||beforeSignature!==afterSignature));
    let status='NOT_RUN';
    if(!before||!after) status='INCOMPLETE';
    else if(['FAIL','FAILED','ERROR'].includes(afterStatus)) status='FAILED';
    else if(changed) status='CHANGED';
    else if(['PASS','PASSED','OK'].includes(afterStatus)) status='PASSED';
    else status='INCONCLUSIVE';
    return {testId:test.id,kind:test.kind,application:test.application,flowId:test.flowId,beforeStatus,afterStatus,changed,status,beforeResult:before?.result??null,afterResult:after?.result??null};
  });
  const failed=comparisons.filter(x=>x.status==='FAILED');
  const changed=comparisons.filter(x=>x.status==='CHANGED');
  const incomplete=comparisons.filter(x=>x.status==='INCOMPLETE');
  const passed=comparisons.filter(x=>x.status==='PASSED');
  const overall=failed.length?'FAILED':incomplete.length?'INCONCLUSIVE':changed.length?'INCONCLUSIVE':passed.length===comparisons.length&&comparisons.length?'PASSED':'INCONCLUSIVE';
  return {schemaVersion:'1.0',status:overall,testCount:comparisons.length,passed:passed.length,failed:failed.length,changed:changed.length,incomplete:incomplete.length,comparisons};
}

export function buildRegressionEvidence({project,testPack,buildResult=null,runtimeEvidence=[],comparison=null,sourceSystem='Temenos-Engineering-Platform'}){
  const evidence=[];
  evidence.push(createEvidence({
    id:'evidence:regression:pack:'+project.id,sourceSystem,sourceType:'REGRESSION_TEST_PACK',
    sourceReference:testPack.type+':'+project.id,release:project.targetRelease,toolVersion:'phase-8',
    excerpt:JSON.stringify({testCount:testPack.tests.length,affectedApplications:testPack.affectedApplications,affectedFlows:testPack.affectedFlows}).slice(0,4000)
  }));
  if(buildResult){
    evidence.push(createEvidence({
      id:'evidence:regression:build:'+project.id,sourceSystem,sourceType:'BUILD_RESULT',
      sourceReference:buildResult.reference??project.id,release:project.targetRelease,toolVersion:'phase-8',
      excerpt:JSON.stringify(buildResult).slice(0,4000)
    }));
  }
  for(const item of runtimeEvidence){
    evidence.push(createEvidence({
      id:'evidence:regression:runtime:'+stableId(JSON.stringify(item)),sourceSystem,sourceType:'RUNTIME_LOG',
      sourceReference:item.reference??project.id,release:item.release??project.targetRelease,toolVersion:'phase-8',
      excerpt:JSON.stringify(item).slice(0,4000)
    }));
  }
  if(comparison){
    evidence.push(createEvidence({
      id:'evidence:regression:comparison:'+project.id,sourceSystem,sourceType:'PRE_POST_COMPARISON',
      sourceReference:project.sourceRelease+'->'+project.targetRelease,release:project.targetRelease,toolVersion:'phase-8',
      excerpt:JSON.stringify({status:comparison.status,failed:comparison.failed,changed:comparison.changed,incomplete:comparison.incomplete}).slice(0,4000)
    }));
  }
  return evidence;
}

export function buildRegressionAssessment({project,testPack,comparison=null,evidence=[]}){
  const status=comparison?.status??testPack.status;
  const counts={P0:0,P1:0,P2:0,P3:0};
  for(const test of testPack.tests) counts[test.priority]=(counts[test.priority]??0)+1;
  return {
    schemaVersion:'1.0',type:'UPGRADE_REGRESSION_ASSESSMENT',projectId:project.id,
    sourceRelease:project.sourceRelease,targetRelease:project.targetRelease,status,
    testPackId:testPack.type+':'+project.id,testCount:testPack.tests.length,
    priorityCounts:counts,evidenceIds:evidence.map(e=>e.id),
    summary:comparison?{passed:comparison.passed,failed:comparison.failed,changed:comparison.changed,incomplete:comparison.incomplete}:null,
    generatedAt:new Date().toISOString()
  };
}
