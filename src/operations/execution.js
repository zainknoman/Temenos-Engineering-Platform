const U=v=>String(v??'').trim().toUpperCase();
const SAFE=['PASSED','READY','HEALTHY','VALIDATED','APPROVED'];
export const OPERATION_STATUS=Object.freeze(['NOT_REQUESTED','READY','APPROVAL_REQUIRED','APPROVED','EXECUTED','FAILED','BLOCKED']);
export const OPERATION_ACTIONS=Object.freeze(['HEALTH_CHECK','MIGRATION_VALIDATE','RUNTIME_LOGS','DEPLOY','ROLLBACK','ADC_DRAIN','ADC_SWITCH','ADC_ROLLBACK']);
export class OperationsExecutionAdapter{
 constructor({runner=null,allowExecution=false}={}){this.runner=runner;this.allowExecution=allowExecution;}
 capabilities(){return['healthCheck','validateMigration','collectRuntimeLogs','deploy','rollback','drainAdcTraffic','switchAdcTraffic','rollbackAdcTraffic'];}
 async _execute(action,payload={}){if(!this.allowExecution)return{status:'APPROVAL_REQUIRED',action,payload,executed:false,externalExecutionRequired:true};if(typeof this.runner!=='function')return{status:'BLOCKED',action,payload,executed:false,reason:'No external execution runner configured',externalExecutionRequired:true};const result=await this.runner(action,payload);return{status:'EXECUTED',action,payload,result,executed:true,externalExecutionRequired:true};}
 healthCheck(payload){return this._execute('HEALTH_CHECK',payload)}
 validateMigration(payload){return this._execute('MIGRATION_VALIDATE',payload)}
 collectRuntimeLogs(payload){return this._execute('RUNTIME_LOGS',payload)}
 deploy(payload){return this._execute('DEPLOY',payload)}
 rollback(payload){return this._execute('ROLLBACK',payload)}
 drainAdcTraffic(payload){return this._execute('ADC_DRAIN',payload)}
 switchAdcTraffic(payload){return this._execute('ADC_SWITCH',payload)}
 rollbackAdcTraffic(payload){return this._execute('ADC_ROLLBACK',payload)}
}
export function buildOperationRequest({action,controlTowerStatus='BLOCKED',approvalStatus='PENDING',preconditions=[],payload={}}){
 const normalized=U(action), validAction=OPERATION_ACTIONS.includes(normalized), checks=preconditions.map(c=>({id:c.id,status:U(c.status),passed:SAFE.includes(U(c.status))})), allPassed=checks.every(c=>c.passed);
 const ready=validAction&&controlTowerStatus==='READY_FOR_APPROVAL'&&U(approvalStatus)==='APPROVED'&&allPassed;
 return{schemaVersion:'1.0',type:'EXTERNAL_OPERATION_REQUEST',action:normalized,status:ready?'READY':'BLOCKED',approvalStatus:U(approvalStatus),preconditions:checks,payload,humanApprovalRequired:true,externalExecutionRequired:true,autonomousExecution:false,authorized:ready,recommendation:ready?'EXECUTE_EXTERNALLY':'DO_NOT_EXECUTE'};
}
export function buildOperationEvidence({project,operation,result}){return{ id:'evidence:operation:'+project.id+':'+operation.action,sourceSystem:'Temenos-Engineering-Platform',sourceType:'EXTERNAL_OPERATION',sourceReference:operation.type,release:project.targetRelease,excerpt:JSON.stringify({action:operation.action,status:result?.status??operation.status,executed:result?.executed??false}).slice(0,4000),toolVersion:'phase-12'};}
