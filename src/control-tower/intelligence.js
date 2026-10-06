const upper=v=>String(v??'').trim().toUpperCase();
const list=v=>Array.isArray(v)?v:[];
const gate=(name,status,details={})=>({name,status:upper(status??'BLOCKED'),...details});

export function buildUpgradeControlTower({project,upgradeAssessment=null,findings=[],regression=null,runtimeMigration=null,adc=null,approvals=[]}){
 if(!project?.id) throw new Error('project.id is required');
 const gates=[
  gate('upgrade-assessment',upgradeAssessment?.status??(findings.length?'REVIEW':'BLOCKED'),{source:'upgrade'}),
  gate('regression',regression?.status??'INCONCLUSIVE',{source:'regression'}),
  gate('runtime-migration',runtimeMigration?.status??'BLOCKED',{source:'runtime-migration'}),
  gate('adc-zero-downtime',adc?.status??'BLOCKED',{source:'adc'})
 ];
 const criticalFindings=list(findings).filter(f=>upper(f.severity)==='CRITICAL'&&upper(f.status??'OPEN')!=='CLOSED');
 const blockers=gates.filter(g=>!['READY','PASSED','COMPLETED'].includes(g.status));
 const approval=approvals.find(a=>upper(a.scope??a.type)==='DEPLOYMENT')??null;
 const overall=blockers.length?'BLOCKED':'READY_FOR_APPROVAL';
 return {schemaVersion:'1.0',type:'UPGRADE_CONTROL_TOWER',projectId:project.id,sourceRelease:project.sourceRelease,targetRelease:project.targetRelease,
  status:overall,gates,criticalFindingCount:criticalFindings.length,criticalFindingIds:criticalFindings.map(f=>f.id),
  approvals:{deployment:approval?.status??'NOT_REQUESTED'},goNoGo:overall==='BLOCKED'?'NO_GO':'GO_PENDING_HUMAN_APPROVAL',
  recommendation:overall==='BLOCKED'?'DO_NOT_PROCEED':'REQUEST_FINAL_DEPLOYMENT_APPROVAL',humanApprovalRequired:true,autonomousExecution:false,
  cutoverTimeline:buildCutoverTimeline({gates,adc}),evidenceIds:[...new Set(gates.flatMap(g=>list(g.evidenceIds)))],generatedAt:new Date().toISOString()};
}

export function buildCutoverTimeline({gates=[],adc=null}){
 const order=[['upgrade-assessment','UPGRADE_ASSESSMENT'],['regression','REGRESSION'],['runtime-migration','RUNTIME_MIGRATION'],['adc-zero-downtime','ADC_CUTOVER']];
 return order.map(([key,label],index)=>{const g=gates.find(x=>x.name===key);return{id:'stage:'+key,sequence:index+1,label,status:g?.status??'BLOCKED',ready:['READY','PASSED','COMPLETED'].includes(g?.status),approvalRequired:key==='adc-zero-downtime',details:key==='adc-zero-downtime'?{trafficSwitchStatus:adc?.trafficPlan?.status??null,rollbackStatus:adc?.rollbackPlan?.status??null}:null};});
}

export function evaluateGoNoGo({controlTower,finalApprovalStatus='PENDING'}){
 const approval=upper(finalApprovalStatus);
 const evidenceReady=controlTower?.status==='READY_FOR_APPROVAL';
 const approved=approval==='APPROVED';
 return {type:'FINAL_GO_NO_GO',status:evidenceReady&&approved?'GO':'NO_GO',evidenceReady,finalApprovalStatus:approval,humanApprovalRequired:true,autonomousExecution:false,recommendation:evidenceReady&&approved?'PROCEED_WITH_EXTERNAL_DEPLOYMENT':'HOLD_DEPLOYMENT'};
}

export function buildControlTowerEvidence({project,controlTower}){
 return [{id:'evidence:control-tower:'+project.id,sourceSystem:'Temenos-Engineering-Platform',sourceType:'UPGRADE_CONTROL_TOWER',sourceReference:controlTower.type,release:project.targetRelease,excerpt:JSON.stringify({status:controlTower.status,goNoGo:controlTower.goNoGo,gates:controlTower.gates,criticalFindingCount:controlTower.criticalFindingCount}).slice(0,4000),toolVersion:'phase-11'}];
}