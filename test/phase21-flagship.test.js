import test from 'node:test';
import assert from 'node:assert/strict';
import { runFlagshipDemo } from '../src/product/flagship.js';
import { runCli } from '../src/cli.js';

test('flagship fixture runs the R16 to R25 inventory and upgrade correlation', async () => {
  const result = await runFlagshipDemo();
  assert.equal(result.inventory.files, 3);
  assert.equal(result.inventory.dependencies, 2);
  assert.equal(result.upgrade.findings.length, 3);
  assert.ok(result.upgrade.findings.some(f => f.severity === 'Critical'));
  assert.ok(result.upgrade.findings.some(f => f.severity === 'High'));
});

test('flagship regression and migration gates pass deterministically', async () => {
  const result = await runFlagshipDemo();
  assert.equal(result.regression.assessment.status, 'PASSED');
  assert.equal(result.regression.comparison.failed, 0);
  assert.equal(result.migration.validation.status, 'VALIDATED');
  assert.equal(result.migration.readinessGate.status, 'READY');
});

test('flagship ADC remains blocked until human approval', async () => {
  const pending = await runFlagshipDemo();
  assert.equal(pending.adc.readinessGate.status, 'BLOCKED');
  assert.equal(pending.controlTower.goNoGo.status, 'NO_GO');
  assert.equal(pending.safety.autonomousExecution, false);

  const approved = await runFlagshipDemo({ finalApprovalStatus: 'APPROVED' });
  assert.equal(approved.adc.readinessGate.status, 'READY');
  assert.equal(approved.controlTower.goNoGo.status, 'GO');
  assert.equal(approved.certification.productionSignoff.status, 'APPROVED');
});

test('flagship certification and release candidate pass without enabling production execution', async () => {
  const result = await runFlagshipDemo({ finalApprovalStatus: 'APPROVED' });
  assert.equal(result.certification.assessment.status, 'CERTIFIED');
  assert.equal(result.certification.releaseValidation.status, 'ACCEPTED');
  assert.equal(result.safety.productionExecution, false);
  assert.equal(result.safety.autonomousExecution, false);
  assert.equal(result.safety.externalExecution, 'NOT_REQUESTED');
});

test('flagship CLI command exposes the deterministic workflow', async () => {
  let output = '';
  const code = await runCli(['demo', 'r16-r25'], { stdout: value => { output += value; } });
  assert.equal(code, 0);
  const report = JSON.parse(output);
  assert.equal(report.project.sourceRelease, 'R16');
  assert.equal(report.project.targetRelease, 'R25');
  assert.equal(report.controlTower.goNoGo.status, 'NO_GO');
});

test('CLI help documents all Phase 21 assessment surfaces', async () => {
  let output = '';
  const code = await runCli(['--help'], { stdout: value => { output += value; } });
  assert.equal(code, 0);
  for (const command of ['demo r16-r25', 'upgrade assess --demo', 'regression assess --demo', 'migration assess --demo', 'adc assess --demo', 'control-tower assess --demo', 'certify --demo']) {
    assert.ok(output.includes(command), 'missing CLI help entry: ' + command);
  }
});
