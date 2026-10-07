const APPROVED=['APPROVED','GO'];
export class ControlledExecutionProvider{
  constructor({execute=null}={}){this.executeHandler=execute;}
  capabilities(){return['executeExternal','approvalGate','auditRequired'];}
  async executeExternal(request={}){
    if(!APPROVED.includes(String(request.approvalStatus??'').toUpperCase()))return{status:'BLOCKED',reason:'HUMAN_APPROVAL_REQUIRED',executionBoundary:'EXTERNAL',executed:false};
    if(typeof this.executeHandler!=='function')return{status:'NOT_CONFIGURED',executionBoundary:'EXTERNAL',approvalRequired:true,executed:false};
    const result=await this.executeHandler(request);
    return{...result,executionBoundary:'EXTERNAL',executed:true,approvalStatus:request.approvalStatus};
  }
}