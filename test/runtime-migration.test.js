import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RuntimeMigrationAdapter,
  buildExecutionPlan,
  collectExecutionEvidence,
  validateMigrationRehearsal,
  analyzeRuntimeLogs,
  compareRuntimeBehavior,
  buildReadinessGate,
  buildRuntimeMigrationAssessment
} from '../src/index.js';

const project={id:'project:phase9',name:'R16 to R25',sourceRelease:'R16',targetRelease:'R25',repository:'bank/repo'};
const pack={affectedApplications:['CUSTOMER','FUNDS.TRANSFER']};

test('Phase 9 builds a staged runtime and migration execution plan',()=>{
  const plan=buildExecutionPlan({project,regressionPack:pack,artifacts:[],findings:[]});
  assert.equal(plan.type,'RUNTIME_MIGRATION_EXECUTION_PLAN');
  assert.equal(plan.stages.length,6);
  assert.deepEqual(plan.affectedApplications,['CUSTOMER','FUNDS.TRANSFER']);
});

test('Phase 9 validates migration rehearsal counts and expected counts',()=>{
  const result=validateMigrationRehearsal({
    sourceSnapshot:{CUSTOMER:{count:100},ACCOUNT:{count:250}},
    targetSnapshot:{CUSTOMER:{count:100},ACCOUNT:{count:250}},
    expectedCounts:{CUSTOMER:100},
    keys:['CUSTOMER','ACCOUNT']
  });
  assert.equal(result.status,'VALIDATED');
  assert.ok(result.checks.every(c=>c.passed));
});

test('Phase 9 blocks migration when validation detects data mismatch',()=>{
  const result=validateMigrationRehearsal({
    sourceSnapshot:{CUSTOMER:{count:100}},
    targetSnapshot:{CUSTOMER:{count:99}},
    keys:['CUSTOMER']
  });
  assert.equal(result.status,'FAILED');
  assert.equal(result.checks[0].delta,-1);
});

test('Phase 9 analyzes runtime logs without treating informational logs as errors',()=>{
  const result=analyzeRuntimeLogs([
    {id:'1',severity:'INFO',message:'service started'},
    {id:'2',severity:'ERROR',message:'ACCOUNT lookup failed',reference:'log:2'}
  ]);
  assert.equal(result.status,'FAILED');
  assert.equal(result.errorCount,1);
});

test('Phase 9 compares pre and post runtime behavior',()=>{
  const result=compareRuntimeBehavior({
    pre:{TPS:100,ERROR_RATE:0},
    post:{TPS:95,ERROR_RATE:0}
  });
  assert.equal(result.status,'INCONCLUSIVE');
  assert.equal(result.changed,1);
});

test('Phase 9 readiness gate requires migration, runtime and rollback evidence',()=>{
  const plan=buildExecutionPlan({project,regressionPack:pack});
  const base=[
    {stageId:'compile-build',status:'PASSED'},
    {stageId:'migration-rehearsal',status:'PASSED'},
    {stageId:'data-validation',status:'PASSED'},
    {stageId:'runtime-smoke',status:'PASSED'},
    {stageId:'runtime-logs',status:'PASSED'},
    {stageId:'pre-post-runtime',status:'PASSED'}
  ];
  const blocked=buildReadinessGate({executionPlan:plan,stageResults:base,migrationValidation:{status:'FAILED'},runtimeComparison:{status:'PASSED'},rollbackReady:true});
  assert.equal(blocked.status,'BLOCKED');
  const ready=buildReadinessGate({executionPlan:plan,stageResults:base,migrationValidation:{status:'VALIDATED'},runtimeComparison:{status:'PASSED'},rollbackReady:true});
  assert.equal(ready.status,'READY');
});

test('Phase 9 captures execution evidence and builds assessment',()=>{
  const plan=buildExecutionPlan({project,regressionPack:pack});
  const evidence=collectExecutionEvidence({project,stageResults:[
    {stageId:'compile-build',kind:'BUILD_RESULT',status:'PASSED',reference:'build:25'},
    {stageId:'runtime-logs',kind:'RUNTIME_LOG',status:'PASSED',summary:'0 errors',reference:'logs:25'}
  ]});
  const gate=buildReadinessGate({
    executionPlan:plan,
    stageResults:[
      {stageId:'compile-build',status:'PASSED'},{stageId:'migration-rehearsal',status:'PASSED'},
      {stageId:'data-validation',status:'PASSED'},{stageId:'runtime-smoke',status:'PASSED'},
      {stageId:'runtime-logs',status:'PASSED'},{stageId:'pre-post-runtime',status:'PASSED'}
    ],
    migrationValidation:{status:'VALIDATED'},runtimeComparison:{status:'PASSED'},rollbackReady:true
  });
  const assessment=buildRuntimeMigrationAssessment({project,executionPlan:plan,evidence,migrationValidation:{status:'VALIDATED',checks:[]},runtimeAnalysis:{status:'PASSED',errorCount:0},runtimeComparison:{status:'PASSED',changed:0,incomplete:0},readinessGate:gate});
  assert.equal(evidence.length,2);
  assert.equal(assessment.type,'RUNTIME_MIGRATION_ASSESSMENT');
  assert.equal(assessment.status,'READY');
});

test('Phase 9 adapter exposes runtime and migration capabilities',()=>{
  const adapter=new RuntimeMigrationAdapter();
  assert.deepEqual(adapter.capabilities(),[
    'buildExecutionPlan','collectExecutionEvidence','validateMigrationRehearsal','analyzeRuntimeLogs','compareRuntimeBehavior','buildReadinessGate','buildAssessment'
  ]);
});
