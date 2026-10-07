import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectConfig } from '../src/product/project.js';
import { RepoMindAdapter } from '../src/adapters/repomind.js';
import { createReadModelReport, formatReadModelReport } from '../src/product/report.js';

function fixtureConfig() {
  return createProjectConfig({
    id: 'bank-r16-r25',
    name: 'Bank R16 to R25',
    sourceRelease: 'R16',
    targetRelease: 'R25',
    environment: 'sit',
    repository: 'bank-core'
  });
}

function fixtureRepoMind() {
  const adapter = new RepoMindAdapter();
  adapter.loadIndex({
    project: { name: 'Bank Core' },
    toolVersion: 'fixture',
    files: [
      { path: 'CUSTOMER/CUSTOMER.b', extension: '.b', language: 'jBC' },
      { path: 'hooks/CustomerHook.java', extension: '.java', language: 'Java' }
    ],
    imports: [{ from: 'hooks/CustomerHook.java', to: 'CUSTOMER/CUSTOMER.b' }],
    stats: { files: 2, imports: 1 }
  });
  return adapter;
}

test('read model exposes stable project, adapter, inventory and safety surfaces', () => {
  const adapter = fixtureRepoMind();
  const report = createReadModelReport({
    config: fixtureConfig(),
    generatedAt: '2026-10-07T00:00:00.000Z',
    repoMind: {
      readiness: {
        status: 'READY',
        discovery: { id: adapter.id, version: adapter.version, transport: adapter.transport, capabilities: adapter.capabilities },
        capabilityCheck: { valid: true, required: ['listArtifacts'], missing: [], capabilities: adapter.capabilities },
        checks: [{ name: 'health', status: 'READY' }]
      },
      inventory: {
        profile: adapter.getRepositoryProfile(),
        files: adapter.listArtifacts().length,
        dependencies: 1,
        languages: ['Java', 'jBC'],
        limitations: adapter.getLimitations()
      }
    }
  });

  assert.equal(report.schemaVersion, '1.0');
  assert.equal(report.project.sourceRelease, 'R16');
  assert.equal(report.project.targetRelease, 'R25');
  assert.equal(report.adapters.repomind.status, 'READY');
  assert.equal(report.inventory.files, 2);
  assert.deepEqual(report.inventory.languages, ['Java', 'jBC']);
  assert.equal(report.summary.status, 'READY_WITH_WARNINGS');
  assert.equal(report.safety.productionExecution, false);
  assert.equal(report.safety.autonomousExecution, false);
  assert.equal(report.safety.requireHumanApproval, true);
  assert.equal(report.sections.findings.length, 0);
});

test('read model records failed adapters as blockers and unverified adapters as warnings', () => {
  const report = createReadModelReport({
    config: fixtureConfig(),
    generatedAt: '2026-10-07T00:00:00.000Z',
    repoMind: {
      readiness: { status: 'FAILED', checks: [{ name: 'health', status: 'FAILED' }] },
      inventory: null
    }
  });

  assert.equal(report.summary.status, 'BLOCKED');
  assert.equal(report.summary.blockers.length, 1);
  assert.equal(report.adapters.temenosSkills.status, 'UNVERIFIED');
  assert.equal(report.summary.warnings.includes('Temenos-Skills readiness is unverified.'), true);
});

test('report formatter provides deterministic JSON and concise text output', () => {
  const report = createReadModelReport({
    config: fixtureConfig(),
    generatedAt: '2026-10-07T00:00:00.000Z'
  });
  const json = formatReadModelReport(report, 'json');
  const text = formatReadModelReport(report, 'text');

  assert.equal(JSON.parse(json).project.id, 'bank-r16-r25');
  assert.match(text, /TEP Report — Bank R16 to R25/);
  assert.match(text, /Release: R16 → R25/);
  assert.match(text, /Temenos-Skills: UNVERIFIED/);
});

test('report sections are stable and caller supplied read-only data is preserved', () => {
  const report = createReadModelReport({
    config: fixtureConfig(),
    sections: {
      findings: [{ id: 'F-1', title: 'Changed field' }],
      risk: [{ id: 'R-1', severity: 'HIGH' }],
      remediation: [{ id: 'M-1', status: 'PENDING_APPROVAL' }]
    }
  });

  assert.equal(report.sections.findings[0].id, 'F-1');
  assert.equal(report.sections.risk[0].severity, 'HIGH');
  assert.equal(report.sections.remediation[0].status, 'PENDING_APPROVAL');
  assert.equal(report.summary.counts.findings, 1);
  assert.equal(report.summary.counts.risk, 1);
  assert.equal(report.summary.counts.remediation, 1);
});
