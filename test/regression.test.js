import test from 'node:test';
import assert from 'node:assert/strict';
import { RegressionAdapter, buildRegressionTestPack, comparePrePostBehavior, buildRegressionEvidence, buildRegressionAssessment } from '../src/index.js';

const project = { id: 'project:phase8', name: 'Bank Upgrade', sourceRelease: 'R16', targetRelease: 'R25' };
const artifacts = [
  { id: 'artifact:1', type: 'ROUTINE', name: 'CUSTOMER.CHECK', path: 'CUSTOMER/CUSTOMER.CHECK.b', application: 'CUSTOMER' },
  { id: 'artifact:2', type: 'JAVA_HOOK', name: 'CustomerHook.java', path: 'CUSTOMER/CustomerHook.java', application: 'CUSTOMER' }
];
const findings = [
  { id: 'finding:1', artifactId: 'artifact:1', severity: 'Critical', title: 'FIELD REMOVED', evidenceIds: ['e1'] },
  { id: 'finding:2', artifactId: 'artifact:2', severity: 'High', title: 'JBC RENAMED', evidenceIds: ['e2'] }
];

test('Phase 8 generates a focused regression pack from upgrade findings', () => {
  const pack = buildRegressionTestPack({ project, findings, artifacts });
  assert.equal(pack.status, 'PLANNED');
  assert.equal(pack.affectedApplications[0], 'CUSTOMER');
  assert.ok(pack.tests.some(t => t.kind === 'FOCUSED_FUNCTIONAL' && t.priority === 'P0'));
  assert.ok(pack.tests.some(t => t.kind === 'COMPILE_BUILD'));
  assert.ok(pack.tests.some(t => t.kind === 'RUNTIME_LOG_CHECK'));
});

test('Phase 8 adds dependency-impact tests only for affected dependencies', () => {
  const pack = buildRegressionTestPack({
    project,
    findings: [findings[0]],
    artifacts,
    dependencies: [
      { id: 'd1', fromArtifactId: 'artifact:1', toArtifactId: 'artifact:2' },
      { id: 'd2', fromArtifactId: 'other', toArtifactId: 'unrelated' }
    ]
  });
  assert.equal(pack.tests.filter(t => t.kind === 'DEPENDENCY_IMPACT').length, 1);
});

test('Phase 8 compares pre/post behavior and detects failures and changes', () => {
  const pack = buildRegressionTestPack({ project, findings: [findings[0]], artifacts });
  const functional = pack.tests.find(t => t.kind === 'FOCUSED_FUNCTIONAL');
  const compile = pack.tests.find(t => t.kind === 'COMPILE_BUILD');
  const preUpgrade = {
    tests: {
      [functional.id]: { status: 'PASS', result: { value: 'OK' } },
      [compile.id]: { status: 'PASS', result: { build: 'OK' } }
    }
  };
  const postUpgrade = {
    tests: {
      [functional.id]: { status: 'FAIL', result: { error: 'FIELD_NOT_FOUND' } },
      [compile.id]: { status: 'PASS', result: { build: 'OK' } }
    }
  };
  const comparison = comparePrePostBehavior({ testPack: pack, preUpgrade, postUpgrade });
  assert.equal(comparison.status, 'FAILED');
  assert.equal(comparison.failed, 1);
  assert.equal(comparison.incomplete, pack.tests.length - 2);
});

test('Phase 8 marks behavior changes as inconclusive instead of silently passing', () => {
  const pack = buildRegressionTestPack({ project, findings: [findings[0]], artifacts });
  const functional = pack.tests.find(t => t.kind === 'FOCUSED_FUNCTIONAL');
  const preUpgrade = { tests: { [functional.id]: { status: 'PASS', result: { value: 'A' } } } };
  const postUpgrade = { tests: { [functional.id]: { status: 'PASS', result: { value: 'B' } } } };
  const comparison = comparePrePostBehavior({ testPack: pack, preUpgrade, postUpgrade });
  assert.equal(comparison.status, 'INCONCLUSIVE');
  assert.equal(comparison.changed, 1);
});

test('Phase 8 creates evidence for test pack, build, runtime and comparison', () => {
  const pack = buildRegressionTestPack({ project, findings: [findings[0]], artifacts });
  const comparison = comparePrePostBehavior({ testPack: pack, preUpgrade: { tests: {} }, postUpgrade: { tests: {} } });
  const evidence = buildRegressionEvidence({
    project,
    testPack: pack,
    buildResult: { reference: 'build:25', status: 'OK' },
    runtimeEvidence: [{ reference: 'runtime:customer', errors: 0 }],
    comparison
  });
  assert.equal(evidence.length, 4);
  assert.deepEqual(evidence.map(e => e.sourceType), ['REGRESSION_TEST_PACK', 'BUILD_RESULT', 'RUNTIME_LOG', 'PRE_POST_COMPARISON']);
});

test('Phase 8 builds a machine-readable regression assessment', () => {
  const pack = buildRegressionTestPack({ project, findings: [findings[0]], artifacts });
  const comparison = { status: 'PASSED', passed: pack.tests.length, failed: 0, changed: 0, incomplete: 0 };
  const evidence = buildRegressionEvidence({ project, testPack: pack, comparison });
  const assessment = buildRegressionAssessment({ project, testPack: pack, comparison, evidence });
  assert.equal(assessment.type, 'UPGRADE_REGRESSION_ASSESSMENT');
  assert.equal(assessment.status, 'PASSED');
  assert.equal(assessment.priorityCounts.P0, 1);
  assert.equal(assessment.evidenceIds.length, 2);
});

test('Phase 8 adapter exposes the regression contract', () => {
  const adapter = new RegressionAdapter();
  assert.deepEqual(adapter.capabilities, ['buildTestPack', 'comparePrePostBehavior', 'buildEvidence', 'buildAssessment']);
});
