import {createRemediationPlan,approveRemediationPlan,applyApprovedRemediation,verifyRemediationPlan,buildRemediationEvidence} from '../remediation/workflow.js';
export class RemediationAdapter{
  capabilities(){return ['createPlan','approvePlan','applyApprovedPlan','verifyAppliedPlan','buildEvidence']}
  createPlan(input){return createRemediationPlan(input)}
  approvePlan(plan,approval){return approveRemediationPlan(plan,approval)}
  applyApprovedPlan(plan,runtime){return applyApprovedRemediation(plan,runtime)}
  verifyAppliedPlan(plan,runtime){return verifyRemediationPlan(plan,runtime)}
  buildEvidence(plan,options){return buildRemediationEvidence(plan,options)}
}
