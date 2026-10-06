import test from 'node:test';
import assert from 'node:assert/strict';
import {RemediationAdapter,createRemediationPlan,approveRemediationPlan,applyApprovedRemediation,verifyRemediationPlan} from '../src/index.js';

const project={id:'project:phase7',sourceRelease:'R16',targetRelease:'R25'};
const finding={id:'finding:phase7:1',artifactId:'artifact:1',severity:'High',recommendation:'Update the target-release jBC/component reference.',evidenceIds:['evidence:1']};
const artifact={id:'artifact:1',name:'CUSTOMER.CHECK',path:'CUSTOMER/CUSTOMER.CHECK.b'};
const evidence=[{id:'evidence:1',sourceSystem:'Temenos-Skills',sourceType:'RELEASE_DIFF',sourceReference:'R16->R25',release:'R25',contentHash:'abc'}];

test('Phase 7 creates evidence-linked remediation candidates',()=>{
 const plan=createRemediationPlan({project,findings:[finding],artifacts:[artifact],evidence});
 assert.equal(plan.status,'WAITING_APPROVAL');
 assert.equal(plan.changes[0].artifactName,'CUSTOMER.CHECK');
 assert.deepEqual(plan.changes[0].evidenceIds,['evidence:1']);
 assert.equal(plan.rollback.required,true);
});
test('Phase 7 requires explicit human approval before application',()=>{
 const plan=createRemediationPlan({project,findings:[finding],artifacts:[artifact],evidence});
 assert.throws(()=>applyApprovedRemediation(plan,{applyChange:async()=>true,captureRollback:async()=> 'rollback/1'}),/APPROVED/);
 const approved=approveRemediationPlan(plan,{approver:'human-review'});
 assert.equal(approved.status,'APPROVED');
 assert.equal(approved.approvedBy,'human-review');
});
test('Phase 7 captures rollback before applying approved changes',async()=>{
 const plan=approveRemediationPlan(createRemediationPlan({project,findings:[finding],artifacts:[artifact],evidence}),{approver:'human-review'});
 const calls=[];
 const applied=await applyApprovedRemediation(plan,{captureRollback:async()=>{calls.push('rollback');return 'rollback/phase7'},applyChange:async c=>{calls.push('apply:'+c.id);return {changed:true}}});
 assert.equal(applied.status,'APPLIED');
 assert.deepEqual(calls,['rollback','apply:change:finding:phase7:1']);
 assert.equal(applied.rollback.captured,true);
});
test('Phase 7 verifies applied remediation',async()=>{
 const approved=approveRemediationPlan(createRemediationPlan({project,findings:[finding],artifacts:[artifact],evidence}),{approver:'human-review'});
 const applied=await applyApprovedRemediation(approved,{captureRollback:async()=> 'rollback/phase7',applyChange:async()=>({changed:true})});
 const verified=await verifyRemediationPlan(applied,{verify:async()=>({passed:true,compile:'OK',regression:'PASS'})});
 assert.equal(verified.status,'VERIFIED');
 assert.equal(verified.verification.compile,'OK');
});
test('Phase 7 adapter exposes the remediation contract',()=>{
 const adapter=new RemediationAdapter();
 assert.deepEqual(adapter.capabilities(),['createPlan','approvePlan','applyApprovedPlan','verifyAppliedPlan','buildEvidence']);
});
