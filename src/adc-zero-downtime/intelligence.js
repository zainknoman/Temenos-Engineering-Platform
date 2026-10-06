export function buildAdcTopology({project,active=null,standby=null,healthChecks=[],sessions={}}){
 if(!project?.id) throw new Error('project.id is required');
 return {schemaVersion:'1.0',type:'ADC_TOPOLOGY',projectId:project.id,active,standby,healthChecks,sessions,ready:Boolean(active&&standby&&healthChecks.filter(h=>h.required!==false).every(h=>String(h.status).toUpperCase()==='PASSED'))};
}
export function buildCompatibilityGate({activeRelease,standbyRelease,targetRelease,dualRunReady=false,checks=[]}){
 const failed=checks.filter(c=>c.required!==false&&!['PASSED','READY'].includes(String(c.status).toUpperCase()));
 const releasesCompatible=Boolean(activeRelease&&standbyRelease===targetRelease);
 const ready=!failed.length&&releasesCompatible&&dualRunReady;
 return {type:'ADC_COMPATIBILITY_GATE',status:ready?'READY':'BLOCKED',activeRelease,standbyRelease,targetRelease,dualRunReady,releasesCompatible,checks,failedChecks:failed.map(c=>c.id),recommendation:ready?'PROCEED_TO_MIGRATION_CHECKPOINT':'BLOCK_ADC_CUTOVER'};
}
export function buildSessionSafetyGate({activeSessions=0,drainRequired=true,drainReady=false,stickySessionsSafe=false,inFlightTransactions=0,transactionsSafe=false}){
 const ready=(!drainRequired||drainReady)&&stickySessionsSafe&&Number(inFlightTransactions)===0&&transactionsSafe;
 return {type:'SESSION_TRANSACTION_SAFETY_GATE',status:ready?'READY':'BLOCKED',activeSessions:Number(activeSessions),drainRequired,drainReady,stickySessionsSafe,inFlightTransactions:Number(inFlightTransactions),transactionsSafe,recommendation:ready?'PROCEED_TO_TRAFFIC_DRAIN':'BLOCK_TRAFFIC_SWITCH'};
}
export function buildMigrationCheckpoints({checkpoints=[]}){return checkpoints.map((c,i)=>({id:c.id??'checkpoint:'+i,name:c.name??c.id??'migration-checkpoint',required:c.required!==false,status:String(c.status??'PENDING').toUpperCase(),evidenceIds:c.evidenceIds??[],rollbackPoint:c.rollbackPoint??null,details:c.details??null}));}
export function buildTrafficSwitchPlan({topology,compatibilityGate,sessionSafetyGate,checkpoints=[],drainTimeoutSeconds=300,rollbackWindowMinutes=30}){
 const ready=topology?.ready===true&&compatibilityGate?.status==='READY'&&sessionSafetyGate?.status==='READY'&&checkpoints.filter(c=>c.required).length>0&&checkpoints.filter(c=>c.required).every(c=>c.status==='PASSED');
 return {schemaVersion:'1.0',type:'ADC_TRAFFIC_SWITCH_PLAN',status:ready?'SWITCH_READY':'BLOCKED',preconditions:{compatibility:compatibilityGate?.status,sessionSafety:sessionSafetyGate?.status,checkpoints:ready?'READY':'BLOCKED'},steps:[
  {id:'health-standby',action:'VERIFY_STANDBY_HEALTH'},{id:'checkpoint',action:'CONFIRM_MIGRATION_CHECKPOINT'},{id:'drain',action:'DRAIN_ADC_TRAFFIC',timeoutSeconds:drainTimeoutSeconds,approvalRequired:true},{id:'switch',action:'PROMOTE_STANDBY_AND_SWITCH_TRAFFIC',approvalRequired:true},{id:'validate',action:'POST_SWITCH_HEALTH_AND_TRANSACTION_CHECK'},{id:'rollback-window',action:'MAINTAIN_ROLLBACK_WINDOW',minutes:rollbackWindowMinutes}],humanApprovalRequired:true,externalExecutionRequired:true,recommendation:ready?'REQUEST_HUMAN_TRAFFIC_SWITCH_APPROVAL':'DO_NOT_SWITCH'};
}
export function buildRollbackPlan({previousActiveId,standbyId,rollbackWindowMinutes=30,healthChecks=[],trafficReversalReady=false,dataRollbackReady=false}){
 const ready=Boolean(previousActiveId&&standbyId&&trafficReversalReady&&dataRollbackReady&&healthChecks.filter(c=>c.required!==false).every(c=>String(c.status).toUpperCase()==='PASSED'));
 return {type:'ADC_ROLLBACK_PLAN',status:ready?'READY':'BLOCKED',previousActiveId,standbyId,rollbackWindowMinutes,trafficReversalReady,dataRollbackReady,healthChecks,externalExecutionRequired:true,recommendation:ready?'ROLLBACK_READY':'ROLLBACK_NOT_READY'};
}
export function buildAdcReadinessGate({topology,compatibilityGate,sessionSafetyGate,checkpoints=[],trafficPlan,rollbackPlan,healthStatus='PASSED',approvalStatus='NOT_REQUESTED'}){
 const checkpointsReady=checkpoints.filter(c=>c.required).length>0&&checkpoints.filter(c=>c.required).every(c=>c.status==='PASSED');
 const ready=topology?.ready===true&&compatibilityGate?.status==='READY'&&sessionSafetyGate?.status==='READY'&&checkpointsReady&&trafficPlan?.status==='SWITCH_READY'&&rollbackPlan?.status==='READY'&&String(healthStatus).toUpperCase()==='PASSED'&&String(approvalStatus).toUpperCase()==='APPROVED';
 return {schemaVersion:'1.0',type:'ADC_ZERO_DOWNTIME_READINESS_GATE',status:ready?'READY':'BLOCKED',checks:{topologyReady:topology?.ready===true,compatibilityReady:compatibilityGate?.status==='READY',sessionSafetyReady:sessionSafetyGate?.status==='READY',checkpointsReady,trafficPlanReady:trafficPlan?.status==='SWITCH_READY',rollbackReady:rollbackPlan?.status==='READY',healthReady:String(healthStatus).toUpperCase()==='PASSED',humanApprovalReady:String(approvalStatus).toUpperCase()==='APPROVED'},recommendation:ready?'TRAFFIC_SWITCH_MAY_PROCEED_EXTERNALLY':'DO_NOT_SWITCH',externalExecutionRequired:true};
}
export function buildAdcZeroDowntimeAssessment({project,topology,compatibilityGate,sessionSafetyGate,checkpoints=[],trafficPlan=null,rollbackPlan=null,readinessGate=null,evidence=[]}){
 return {schemaVersion:'1.0',type:'ADC_ZERO_DOWNTIME_ASSESSMENT',projectId:project.id,sourceRelease:project.sourceRelease,targetRelease:project.targetRelease,status:readinessGate?.status??'BLOCKED',topology,compatibility:compatibilityGate,sessionSafety:sessionSafetyGate,checkpoints,trafficPlan,rollbackPlan,readinessGate,evidenceIds:evidence.map(e=>e.id??e),safety:{autonomousTrafficSwitch:false,humanApprovalRequired:true,externalExecutionRequired:true},generatedAt:new Date().toISOString()};
}
