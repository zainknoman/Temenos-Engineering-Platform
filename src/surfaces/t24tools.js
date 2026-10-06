import { buildRemediationRecommendation, buildVerificationPlan } from '../analysis/upgrade.js';

export function buildT24ToolsDashboard({ project, run, artifacts = [], findings = [], evidence = [], report = null }) {
  const artifactById = new Map(artifacts.map(a => [a.id, a]));
  const riskCounts = findings.reduce((counts, finding) => {
    counts[finding.severity] = (counts[finding.severity] ?? 0) + 1;
    return counts;
  }, {});

  const riskList = findings.map(finding => {
    const artifact = artifactById.get(finding.artifactId);
    return {
      findingId: finding.id,
      artifactId: finding.artifactId,
      artifactName: artifact?.name ?? finding.artifactId ?? 'UNKNOWN',
      artifactType: artifact?.type ?? 'OTHER',
      path: artifact?.path ?? null,
      application: artifact?.application ?? null,
      severity: finding.severity,
      status: finding.status,
      title: finding.title,
      description: finding.description,
      recommendation: finding.recommendation,
      evidenceIds: finding.evidenceIds
    };
  });

  const checklist = findings.map(finding => {
    const artifact = artifactById.get(finding.artifactId);
    const correlation = { artifact: artifact ?? { id: finding.artifactId, name: finding.title }, impacts: [] };
    const remediation = finding.recommendation ? [finding.recommendation] : buildRemediationRecommendation(correlation);
    const verification = buildVerificationPlan(correlation, project.targetRelease);
    return {
      findingId: finding.id,
      artifactId: finding.artifactId,
      artifactName: artifact?.name ?? finding.artifactId ?? 'UNKNOWN',
      severity: finding.severity,
      remediation: remediation.length ? remediation : ['Review the finding and define an approved remediation.'],
      verification
    };
  });

  return {
    schemaVersion: '1.0',
    surface: 'T24Tools',
    generatedAt: new Date().toISOString(),
    project: {
      id: project.id,
      name: project.name,
      sourceRelease: project.sourceRelease,
      targetRelease: project.targetRelease,
      repository: project.repository,
      environment: project.environment,
      status: project.status
    },
    run: run ? {
      id: run.id,
      workflow: run.workflow,
      status: run.status,
      currentStage: run.currentStage,
      approvalState: run.approvalState,
      startedAt: run.startedAt,
      completedAt: run.completedAt
    } : null,
    summary: {
      artifactCount: artifacts.length,
      findingCount: findings.length,
      evidenceCount: evidence.length,
      riskCounts,
      releaseEvidenceAvailable: Boolean(report?.releaseDiffSummary)
    },
    riskList,
    evidence: evidence.map(item => ({
      id: item.id,
      sourceSystem: item.sourceSystem,
      sourceType: item.sourceType,
      sourceReference: item.sourceReference,
      release: item.release,
      excerpt: item.excerpt,
      collectedAt: item.collectedAt,
      toolVersion: item.toolVersion
    })),
    checklist,
    report: report ? {
      id: report.id,
      type: report.type,
      generatedAt: report.generatedAt,
      markdown: report.markdown
    } : null
  };
}

export function exportT24ToolsReport(readModel) {
  if (!readModel?.report?.markdown) throw new Error('T24Tools report is not available');
  return {
    filename: readModel.project.id + '-upgrade-assessment.md',
    contentType: 'text/markdown; charset=utf-8',
    content: readModel.report.markdown
  };
}
