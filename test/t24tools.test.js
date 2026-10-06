import test from 'node:test';
import assert from 'node:assert/strict';
import { T24ToolsAdapter, buildT24ToolsDashboard, exportT24ToolsReport } from '../src/index.js';

const project = {
  id: 'project:test',
  name: 'Bank Upgrade',
  sourceRelease: 'R16',
  targetRelease: 'R25',
  repository: 'bank/customizations',
  environment: 'local',
  status: 'ACTIVE'
};
const artifacts = [
  { id: 'artifact:1', type: 'ROUTINE', name: 'CUSTOMER.CHECK', path: 'CUSTOMER/CUSTOMER.CHECK.b', application: 'CUSTOMER' }
];
const findings = [{
  id: 'finding:1',
  projectId: project.id,
  artifactId: 'artifact:1',
  severity: 'Critical',
  status: 'OPEN',
  title: 'CUSTOMER.CHECK: FIELD REMOVED',
  description: 'A referenced field was removed.',
  recommendation: 'Replace the removed field reference.',
  evidenceIds: ['evidence:1']
}];
const evidence = [{
  id: 'evidence:1',
  sourceSystem: 'Temenos-Skills',
  sourceType: 'RELEASE_DIFF',
  sourceReference: 'R16->R25',
  release: 'R25',
  excerpt: 'field change evidence',
  collectedAt: '2026-10-07T00:00:00.000Z',
  toolVersion: 'test'
}];
const report = {
  id: 'report:1',
  type: 'R16-R25-UPGRADE-ASSESSMENT',
  generatedAt: '2026-10-07T00:00:00.000Z',
  releaseDiffSummary: { fields_removed: 1 },
  markdown: '# R16 -> R25 Upgrade Assessment'
};
const run = {
  id: 'run:1',
  workflow: 'R16-R25-UPGRADE-ASSESSMENT',
  status: 'COMPLETED',
  currentStage: 'VERIFICATION_AND_REPORT',
  approvalState: 'APPROVED',
  startedAt: '2026-10-07T00:00:00.000Z',
  completedAt: '2026-10-07T00:01:00.000Z'
};

test('T24Tools dashboard exposes upgrade cockpit sections', () => {
  const dashboard = buildT24ToolsDashboard({ project, run, artifacts, findings, evidence, report });
  assert.equal(dashboard.surface, 'T24Tools');
  assert.equal(dashboard.summary.findingCount, 1);
  assert.equal(dashboard.summary.riskCounts.Critical, 1);
  assert.equal(dashboard.riskList[0].artifactName, 'CUSTOMER.CHECK');
  assert.equal(dashboard.evidence[0].sourceSystem, 'Temenos-Skills');
  assert.equal(dashboard.checklist[0].remediation.length, 1);
  assert.equal(dashboard.report.markdown.startsWith('# R16'), true);
});

test('T24Tools adapter exposes stable read-model capabilities', () => {
  const adapter = new T24ToolsAdapter();
  assert.deepEqual(adapter.capabilities(), [
    'getUpgradeDashboard',
    'getArtifactRiskList',
    'getEvidence',
    'getRemediationChecklist',
    'exportReport'
  ]);
  assert.equal(adapter.getArtifactRiskList({ project, run, artifacts, findings, evidence, report }).length, 1);
});

test('T24Tools report export returns a markdown download contract', () => {
  const exported = exportT24ToolsReport(buildT24ToolsDashboard({ project, run, artifacts, findings, evidence, report }));
  assert.equal(exported.filename, 'project:test-upgrade-assessment.md');
  assert.equal(exported.contentType, 'text/markdown; charset=utf-8');
  assert.equal(exported.content, report.markdown);
});
