import { createRun } from '../core/contracts.js';
import { normalizeRepoMindIndex } from '../normalizers/repomind.js';
import { correlateReleaseChanges, classifyUpgradeRisk, buildUpgradeFindings, buildUpgradeEvidence } from '../analysis/upgrade.js';
import { buildAssessmentReport } from '../reports/assessment.js';

export async function runR16R25Assessment({ store, project, repomindIndex, temenosSkills }) {
  const run = createRun({
    id: 'run:' + project.id + ':' + Date.now(),
    projectId: project.id,
    workflow: 'R16-R25-UPGRADE-ASSESSMENT',
    status: 'RUNNING',
    startedAt: new Date().toISOString(),
    currentStage: 'REPOSITORY_INVENTORY'
  });
  store.add('runs', run);

  const normalized = normalizeRepoMindIndex({ projectId: project.id, release: project.sourceRelease, index: repomindIndex });
  for (const a of normalized.artifacts) store.add('artifacts', a);
  for (const d of normalized.dependencies) store.add('dependencies', d);
  for (const e of normalized.evidence) store.add('evidence', e);

  run.currentStage = 'RELEASE_COMPARISON';
  let releaseDiff = null;
  const limitations = [...normalized.limitations];

  if (temenosSkills) {
    try {
      const result = await temenosSkills.compareReleases({
        oldRelease: project.sourceRelease,
        newRelease: project.targetRelease
      });
      releaseDiff = result;
      if (result.evidence) store.add('evidence', result.evidence);
    } catch (error) {
      limitations.push('Temenos-Skills release comparison unavailable: ' + error.message);
      store.add('evidence', {
        id: 'evidence:temenos-skills:unavailable:' + Date.now(),
        sourceSystem: 'Temenos-Skills',
        sourceType: 'PROVIDER_STATUS',
        sourceReference: project.sourceRelease + '->' + project.targetRelease,
        release: project.targetRelease,
        excerpt: error.message,
        toolVersion: temenosSkills.version ?? null
      });
    }
  } else {
    limitations.push('Temenos-Skills adapter was not supplied; release correlation is not evidence-backed.');
  }

  run.currentStage = 'CORRELATION';
  const correlations = releaseDiff
    ? classifyUpgradeRisk(correlateReleaseChanges({ artifacts: normalized.artifacts, releaseDiff }))
    : [];

  const upgradeEvidence = buildUpgradeEvidence({ project, releaseDiff, correlations });
  store.add('evidence', upgradeEvidence);

  const findings = buildUpgradeFindings({
    project,
    correlations,
    evidenceIds: normalized.evidence.map(e => e.id).concat(upgradeEvidence.id)
  });
  for (const finding of findings) store.add('findings', finding);

  run.currentStage = 'REPORTING';
  const report = buildAssessmentReport({ project, run, releaseDiff, correlations, limitations });
  store.add('reports', report);

  run.currentStage = 'COMPLETED';
  run.status = 'COMPLETED';
  run.completedAt = new Date().toISOString();
  run.approvalState = findings.length ? 'HUMAN_REVIEW_RECOMMENDED' : 'NOT_REQUIRED';
  await store.save();

  return { run, normalized, releaseDiff, correlations, findings, report, limitations };
}
