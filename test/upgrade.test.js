import test from 'node:test';
import assert from 'node:assert/strict';
import { createProject } from '../src/core/contracts.js';
import { correlateReleaseChanges, classifyUpgradeRisk, buildRemediationRecommendation, buildVerificationPlan } from '../src/analysis/upgrade.js';
import { buildAssessmentReport } from '../src/reports/assessment.js';

const artifacts = [
  { id: 'a1', projectId: 'p1', type: 'ROUTINE', name: 'NATIONALITY', path: 'CUSTOMER/NATIONALITY.b', application: null, metadata: {}, release: 'R16' },
  { id: 'a2', projectId: 'p1', type: 'JAVA_HOOK', name: 'CustomerHook.java', path: 'CUSTOMER/CustomerHook.java', application: null, metadata: {}, release: 'R16' },
  { id: 'a3', projectId: 'p1', type: 'COMPONENT', name: 'CBI.LocalDevelopments', path: 'CUSTOMER/CBI.LocalDevelopments.component', application: null, metadata: {}, release: 'R16' }
];

const diff = {
  summary: { apps_changed: 1, fields_removed: 1, fields_moved: 1, jbc_renamed: 1 },
  apps: {
    CUSTOMER: {
      fields_added: [],
      fields_removed: ['NATIONALITY'],
      fields_moved: [['ID.TYPE.NO', 14, 16]],
      jbc_renamed: [['NATIONALITY', 'OLD.Customer.Nationality', 'NEW.Customer.Nationality']]
    }
  },
  apps_added: [],
  apps_removed: []
};

test('correlates release changes to bank artifacts', () => {
  const result = classifyUpgradeRisk(correlateReleaseChanges({ artifacts, releaseDiff: diff }));
  assert.equal(result.length, 3);
  assert.equal(result.find(x => x.artifact.id === 'a1').severity, 'Critical');
  assert.equal(result.find(x => x.artifact.id === 'a2').severity, 'Medium');
});

test('generates remediation and verification actions from evidence', () => {
  const result = classifyUpgradeRisk(correlateReleaseChanges({ artifacts: [artifacts[0]], releaseDiff: diff }))[0];
  assert.ok(buildRemediationRecommendation(result).some(x => x.includes('removed field')));
  assert.ok(buildVerificationPlan(result, 'R25').some(x => x.includes('target-release')));
});

test('builds a machine-readable and markdown assessment report', () => {
  const project = createProject({ id: 'p1', name: 'Bank Upgrade', sourceRelease: 'R16', targetRelease: 'R25' });
  const correlations = classifyUpgradeRisk(correlateReleaseChanges({ artifacts, releaseDiff: diff }));
  const report = buildAssessmentReport({ project, run: { id: 'run1' }, releaseDiff: diff, correlations, limitations: ['Sample limitation'] });
  assert.equal(report.type, 'R16-R25-UPGRADE-ASSESSMENT');
  assert.ok(report.markdown.includes('# R16 → R25 Upgrade Assessment'));
  assert.equal(report.riskCounts.Critical, 1);
});

test('unmatched fields do not create false field correlations', () => {
  const result = correlateReleaseChanges({
    artifacts: [{ id: 'x', type: 'SOURCE_FILE', name: 'PaymentHook.java', path: 'PAYMENT/PaymentHook.java', metadata: {} }],
    releaseDiff: diff
  });
  assert.equal(result.length, 0);
});
