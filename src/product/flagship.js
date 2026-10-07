import { runR16R25Assessment } from '../workflows/assessment.js';
import { buildRegressionTestPack, comparePrePostBehavior, buildRegressionAssessment, buildRegressionEvidence } from '../regression/intelligence.js';
import { buildExecutionPlan, validateMigrationRehearsal, analyzeRuntimeLogs, compareRuntimeBehavior, buildReadinessGate, buildRuntimeMigrationAssessment, collectExecutionEvidence } from '../runtime-migration/intelligence.js';
import { buildAdcTopology, buildCompatibilityGate, buildSessionSafetyGate, buildMigrationCheckpoints, buildTrafficSwitchPlan, buildRollbackPlan, buildAdcReadinessGate, buildAdcZeroDowntimeAssessment } from '../adc-zero-downtime/intelligence.js';
import { buildUpgradeControlTower, evaluateGoNoGo, buildControlTowerEvidence } from '../control-tower/intelligence.js';
import { buildCertificationPlan, recordCertificationResult, evaluateCertification, buildProductionSignoff, buildReleaseManifest } from '../certification/intelligence.js';
import { buildReleaseCandidate, validateReleaseCandidate } from '../certification/release.js';

export const FLAGSHIP_PROJECT = Object.freeze({
  id: 'bank-r16-r25-demo',
  name: 'Bank R16 to R25 — Flagship Demo',
  sourceRelease: 'R16',
  targetRelease: 'R25'
});

export const FLAGSHIP_REPOMIND_FIXTURE = Object.freeze({
  project: { name: 'bank-r16-r25-demo', source: 'phase21-flagship-fixture' },
  toolVersion: 'fixture-1',
  files: [
    { path: 'CUSTOMER/PK.CUSTOMER.b', extension: '.b', language: 'jBC', lines: 42, application: 'CUSTOMER', metadata: { application: 'CUSTOMER', fields: ['NATIONALITY', 'ID.TYPE.NO'] } },
    { path: 'hooks/CustomerHook.java', extension: '.java', language: 'Java', lines: 80, application: 'CUSTOMER', metadata: { application: 'CUSTOMER', fields: ['NATIONALITY'] } },
    { path: 'FUNDS/PK.FUNDS.b', extension: '.b', language: 'jBC', lines: 31, application: 'FUNDS', metadata: { application: 'FUNDS', fields: ['ACCOUNT.NO', 'NEW.FIELD'] } }
  ],
  imports: [
    { from: 'hooks/CustomerHook.java', to: 'CUSTOMER/PK.CUSTOMER.b', kind: 'REFERENCES', confidence: 'high' },
    { from: 'CUSTOMER/PK.CUSTOMER.b', to: 'FUNDS/PK.FUNDS.b', kind: 'REFERENCES', confidence: 'medium' }
  ],
  stats: { files: 3, imports: 2 }
});

export const FLAGSHIP_RELEASE_DIFF = Object.freeze({
  summary: { applicationsChanged: 2, fieldsRemoved: 1, fieldsMoved: 1, jbcRenamed: 1 },
  apps: {
    CUSTOMER: {
      fields_removed: ['ID.TYPE.NO'],
      fields_moved: [['NATIONALITY', 20, 35]],
      jbc_renamed: [['NATIONALITY', 'OLD.NATIONALITY', 'NATIONALITY.CODE']]
    },
    FUNDS: { fields_added: ['NEW.FIELD'] }
  },
  apps_added: [],
  apps_removed: []
});

class MemoryStore {
  constructor() {
    this.state = { runs: [], artifacts: [], dependencies: [], evidence: [], findings: [], reports: [] };
  }
  add(collection, value) { this.state[collection].push(value); return value; }
  async save() { return this.state; }
}

function createDemoTemenosSkills() {
  return {
    version: 'fixture-temenos-skills-v1',
    async compareReleases() {
      return {
        oldRelease: 'R16',
        newRelease: 'R25',
        ...FLAGSHIP_RELEASE_DIFF,
        evidence: {
          id: 'evidence:temenos-skills:release-diff',
          sourceSystem: 'Temenos-Skills',
          sourceType: 'RELEASE_DIFF',
          sourceReference: 'R16->R25',
          release: 'R25',
          toolVersion: 'fixture-v1',
          excerpt: JSON.stringify(FLAGSHIP_RELEASE_DIFF.summary)
        }
      };
    }
  };
}

export async function runFlagshipDemo({ finalApprovalStatus = 'PENDING' } = {}) {
  const store = new MemoryStore();
  const assessment = await runR16R25Assessment({
    store,
    project: FLAGSHIP_PROJECT,
    repomindIndex: FLAGSHIP_REPOMIND_FIXTURE,
    temenosSkills: createDemoTemenosSkills()
  });

  const regressionPack = buildRegressionTestPack({
    project: FLAGSHIP_PROJECT,
    findings: assessment.findings,
    artifacts: assessment.normalized.artifacts,
    dependencies: assessment.normalized.dependencies
  });
  const results = Object.fromEntries(
    regressionPack.tests.map(test => [
      test.id,
      { status: 'PASSED', result: { contract: 'stable', application: test.application } }
    ])
  );
  const regressionComparison = comparePrePostBehavior({
    testPack: regressionPack,
    preUpgrade: { tests: results },
    postUpgrade: { tests: results }
  });
  const regressionEvidence = buildRegressionEvidence({
    project: FLAGSHIP_PROJECT,
    testPack: regressionPack,
    comparison: regressionComparison,
    buildResult: { status: 'PASSED', reference: 'fixture-build' }
  });
  const regression = buildRegressionAssessment({
    project: FLAGSHIP_PROJECT,
    testPack: regressionPack,
    comparison: regressionComparison,
    evidence: regressionEvidence
  });

  const executionPlan = buildExecutionPlan({
    project: FLAGSHIP_PROJECT,
    regressionPack,
    artifacts: assessment.normalized.artifacts,
    findings: assessment.findings
  });
  const migrationValidation = validateMigrationRehearsal({
    sourceSnapshot: { customers: 100, accounts: 200 },
    targetSnapshot: { customers: 100, accounts: 200 },
    keys: ['customers', 'accounts']
  });
  const runtimeAnalysis = analyzeRuntimeLogs([
    { id: 'log-1', severity: 'INFO', message: 'R25 smoke test passed' },
    { id: 'log-2', severity: 'INFO', message: 'No transaction errors detected' }
  ]);
  const runtimeComparison = compareRuntimeBehavior({
    pre: { login: 'ok', payment: 'ok' },
    post: { login: 'ok', payment: 'ok' }
  });
  const stageResults = executionPlan.stages.map(stage => ({
    stageId: stage.id,
    status: 'PASSED',
    summary: 'Deterministic fixture validation passed.'
  }));
  const migrationGate = buildReadinessGate({
    executionPlan,
    stageResults,
    migrationValidation,
    runtimeComparison,
    rollbackReady: true
  });
  const migrationEvidence = collectExecutionEvidence({ project: FLAGSHIP_PROJECT, stageResults });
  const migration = buildRuntimeMigrationAssessment({
    project: FLAGSHIP_PROJECT,
    executionPlan,
    evidence: migrationEvidence,
    migrationValidation,
    runtimeAnalysis,
    runtimeComparison,
    readinessGate: migrationGate
  });

  const topology = buildAdcTopology({
    project: FLAGSHIP_PROJECT,
    active: { id: 'R16-ACTIVE', release: 'R16' },
    standby: { id: 'R25-STANDBY', release: 'R25' },
    healthChecks: [{ id: 'standby-health', status: 'PASSED', required: true }],
    sessions: { stickySessions: true }
  });
  const compatibility = buildCompatibilityGate({
    activeRelease: 'R16',
    standbyRelease: 'R25',
    targetRelease: 'R25',
    dualRunReady: true,
    checks: [
      { id: 'api-compatibility', status: 'PASSED', required: true },
      { id: 'session-compatibility', status: 'PASSED', required: true }
    ]
  });
  const sessionSafety = buildSessionSafetyGate({
    activeSessions: 0,
    drainRequired: true,
    drainReady: true,
    stickySessionsSafe: true,
    inFlightTransactions: 0,
    transactionsSafe: true
  });
  const checkpoints = buildMigrationCheckpoints([
    { id: 'data-checkpoint', name: 'Data validation checkpoint', status: 'PASSED', rollbackPoint: 'R16-ACTIVE' }
  ]);
  const trafficPlan = buildTrafficSwitchPlan({
    topology,
    compatibilityGate: compatibility,
    sessionSafetyGate: sessionSafety,
    checkpoints
  });
  const rollbackPlan = buildRollbackPlan({
    previousActiveId: 'R16-ACTIVE',
    standbyId: 'R25-STANDBY',
    trafficReversalReady: true,
    dataRollbackReady: true,
    healthChecks: [{ id: 'r16-health', status: 'PASSED' }]
  });
  const adcGate = buildAdcReadinessGate({
    topology,
    compatibilityGate: compatibility,
    sessionSafetyGate: sessionSafety,
    checkpoints,
    trafficPlan,
    rollbackPlan,
    healthStatus: 'PASSED',
    approvalStatus: finalApprovalStatus
  });
  const adc = buildAdcZeroDowntimeAssessment({
    project: FLAGSHIP_PROJECT,
    topology,
    compatibilityGate: compatibility,
    sessionSafetyGate: sessionSafety,
    checkpoints,
    trafficPlan,
    rollbackPlan,
    readinessGate: adcGate,
    evidence: []
  });

  const controlTower = buildUpgradeControlTower({
    project: FLAGSHIP_PROJECT,
    upgradeAssessment: { status: 'READY' },
    findings: assessment.findings,
    regression: { status: regression.status },
    runtimeMigration: { status: migration.status },
    adc: { status: adc.status, trafficPlan, rollbackPlan }
  });
  const goNoGo = evaluateGoNoGo({ controlTower, finalApprovalStatus });
  const controlEvidence = buildControlTowerEvidence({ project: FLAGSHIP_PROJECT, controlTower });

  let certification = buildCertificationPlan({ project: FLAGSHIP_PROJECT });
  for (const area of certification.areas) {
    certification = recordCertificationResult(certification, {
      area: area.id,
      status: 'PASSED',
      evidence: assessment.normalized.evidence.map(e => e.id)
    });
  }
  const certificationResult = evaluateCertification(certification);
  const releaseCandidate = buildReleaseCandidate({
    version: '0.3.0-flagship-demo',
    commit: 'fixture',
    checks: [
      { id: 'tests', status: 'PASSED' },
      { id: 'certification', status: 'PASSED' },
      { id: 'safety', status: 'PASSED' }
    ]
  });
  const releaseValidation = validateReleaseCandidate(releaseCandidate);
  const productionSignoff = buildProductionSignoff({
    certification: certificationResult,
    approver: finalApprovalStatus === 'APPROVED' ? 'DEMO-HUMAN-APPROVER' : null
  });
  const manifest = buildReleaseManifest({
    version: releaseCandidate.version,
    commit: releaseCandidate.commit,
    certificationStatus: certificationResult.status,
    artifacts: ['flagship-r16-r25-report.json']
  });

  return {
    project: FLAGSHIP_PROJECT,
    inventory: {
      files: assessment.normalized.artifacts.length,
      dependencies: assessment.normalized.dependencies.length,
      languages: [...new Set(assessment.normalized.artifacts.map(a => a.language).filter(Boolean))].sort()
    },
    upgrade: {
      releaseDiff: FLAGSHIP_RELEASE_DIFF,
      findings: assessment.findings,
      correlations: assessment.correlations
    },
    regression: { pack: regressionPack, comparison: regressionComparison, assessment: regression },
    migration: {
      executionPlan,
      validation: migrationValidation,
      runtimeAnalysis,
      runtimeComparison,
      readinessGate: migrationGate,
      assessment: migration
    },
    adc: {
      topology,
      compatibility,
      sessionSafety,
      checkpoints,
      trafficPlan,
      rollbackPlan,
      readinessGate: adcGate,
      assessment: adc
    },
    controlTower: { ...controlTower, goNoGo },
    certification: {
      plan: certification,
      assessment: certificationResult,
      releaseCandidate,
      releaseValidation,
      productionSignoff,
      manifest
    },
    evidence: [
      ...assessment.normalized.evidence,
      ...regressionEvidence,
      ...migrationEvidence,
      ...controlEvidence
    ],
    safety: {
      productionExecution: false,
      autonomousExecution: false,
      humanApprovalRequired: true,
      externalExecution: 'NOT_REQUESTED'
    }
  };
}

export async function formatFlagshipDemo({ finalApprovalStatus = 'PENDING' } = {}) {
  return JSON.stringify(await runFlagshipDemo({ finalApprovalStatus }), null, 2);
}
