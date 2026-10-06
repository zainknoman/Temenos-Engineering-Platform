import { createEvidence } from '../core/contracts.js';

export const REMEDIATION_STATUS=Object.freeze(['DRAFT','WAITING_APPROVAL','APPROVED','APPLIED','VERIFIED','REJECTED','FAILED']);
const required=(v,n)=>{if(v===undefined||v===null||v==='')throw new Error(n+' is required');return v};

export function createRemediationPlan({project,findings=[],artifacts=[],evidence=[],generatedAt=new Date().toISOString()}){
  required(project?.id,'project.id');
  const artifactMap=new Map(artifacts.map(a=>[a.id,a]));
  const evidenceMap=new Map(evidence.map(e=>[e.id,e]));
  const changes=findings.map(f=>{const a=artifactMap.get(f.artifactId);return{
    id:'change:'+f.id,findingId:f.id,artifactId:f.artifactId??null,artifactName:a?.name??f.artifactId??'UNKNOWN',
    path:a?.path??null,severity:f.severity,operation:'CANDIDATE_REMEDIATION',
    proposedChange:f.recommendation||'Review and define an approved target-release change.',
    exactSourceChangeRequired:true,sourceRelease:project.sourceRelease,targetRelease:project.targetRelease,
    evidenceIds:f.evidenceIds??[],status:'DRAFT'
  }});
  const evidenceLinks=[...new Set(changes.flatMap(c=>c.evidenceIds))].map(id=>evidenceMap.get(id)).filter(Boolean).map(e=>({
    id:e.id,sourceSystem:e.sourceSystem,sourceType:e.sourceType,sourceReference:e.sourceReference,release:e.release,contentHash:e.contentHash??null
  }));
  return{
    id:'remediation:'+project.id+':'+Date.now(),schemaVersion:'1.0',projectId:project.id,
    sourceRelease:project.sourceRelease,targetRelease:project.targetRelease,status:changes.length?'WAITING_APPROVAL':'DRAFT',
    generatedAt,approvedAt:null,appliedAt:null,verifiedAt:null,changes,evidence:evidenceLinks,
    rollback:{required:true,captured:false,location:null}
  };
}

export function approveRemediationPlan(plan,{approver,approvedAt=new Date().toISOString()}={}){
  required(approver,'approver');
  if(!plan||plan.status!=='WAITING_APPROVAL')throw new Error('Remediation plan must be WAITING_APPROVAL');
  return {...plan,status:'APPROVED',approvedAt,approvedBy:approver,changes:plan.changes.map(c=>({...c,status:'APPROVED'}))};
}

export async function applyApprovedRemediation(plan,{applyChange,captureRollback}={}){
  if(!plan||plan.status!=='APPROVED')throw new Error('Only an APPROVED remediation plan can be applied');
  if(typeof applyChange!=='function')throw new Error('applyChange callback is required');
  if(typeof captureRollback!=='function')throw new Error('captureRollback callback is required');
  const rollback=await captureRollback(plan),applied=[];
  try{
    for(const change of plan.changes)applied.push({changeId:change.id,result:await applyChange(change)});
    return {...plan,status:'APPLIED',appliedAt:new Date().toISOString(),changes:plan.changes.map(c=>({...c,status:'APPLIED'})),rollback:{required:true,captured:true,location:rollback},applicationResults:applied};
  }catch(error){
    return {...plan,status:'FAILED',rollback:{required:true,captured:true,location:rollback},applicationResults:applied,error:error.message};
  }
}

export async function verifyRemediationPlan(plan,{verify}={}){
  if(!plan||plan.status!=='APPLIED')throw new Error('Only an APPLIED remediation plan can be verified');
  if(typeof verify!=='function')throw new Error('verify callback is required');
  const result=await verify(plan),passed=result===true||result?.passed===true;
  return {...plan,status:passed?'VERIFIED':'FAILED',verifiedAt:new Date().toISOString(),verification:typeof result==='object'?result:{passed}};
}

export function buildRemediationEvidence(plan,{sourceSystem='Temenos-Engineering-Platform'}={}){
  return createEvidence({
    id:'evidence:remediation:'+plan.id,sourceSystem,sourceType:'REMEDIATION_PLAN',sourceReference:plan.id,
    release:plan.targetRelease,toolVersion:'phase-7',
    excerpt:JSON.stringify({status:plan.status,changeCount:plan.changes.length,evidenceCount:plan.evidence.length,rollback:plan.rollback}).slice(0,4000)
  });
}
