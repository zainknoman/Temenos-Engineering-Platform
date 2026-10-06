import { buildRemediationRecommendation, buildVerificationPlan } from '../analysis/upgrade.js';

export function buildAssessmentReport({ project, run, releaseDiff, correlations, limitations = [] }) {
  const findings = correlations.map(c => ({
    artifact: c.artifact.name,
    path: c.artifact.path,
    type: c.artifact.type,
    application: c.application,
    severity: c.severity,
    impacts: c.impacts,
    remediation: buildRemediationRecommendation(c),
    verification: buildVerificationPlan(c, project.targetRelease)
  }));
  const counts = findings.reduce((a, f) => {
    a[f.severity] = (a[f.severity] ?? 0) + 1;
    return a;
  }, {});
  const report = {
    id: 'report:' + project.id + ':' + run.id,
    projectId: project.id,
    runId: run.id,
    type: 'R16-R25-UPGRADE-ASSESSMENT',
    generatedAt: new Date().toISOString(),
    sourceRelease: project.sourceRelease,
    targetRelease: project.targetRelease,
    releaseDiffSummary: releaseDiff?.summary ?? null,
    riskCounts: counts,
    findings,
    limitations
  };
  report.markdown = renderAssessmentMarkdown(report);
  return report;
}

export function renderAssessmentMarkdown(report) {
  const lines = [
    '# ' + report.sourceRelease + ' → ' + report.targetRelease + ' Upgrade Assessment',
    '',
    'Run: ' + report.runId,
    '',
    '## Release evidence',
    '',
    report.releaseDiffSummary
      ? Object.entries(report.releaseDiffSummary).map(([k, v]) => '- **' + k + '**: ' + v).join('\\n')
      : 'Release comparison was not available from the configured Temenos-Skills runtime.',
    '',
    '## Risk summary',
    '',
    Object.entries(report.riskCounts).map(([k, v]) => '- **' + k + '**: ' + v).join('\\n') || 'No correlated risks.',
    ''
  ];
  for (const finding of report.findings) {
    lines.push('## ' + finding.severity + ' — ' + finding.artifact);
    lines.push('');
    lines.push('- Application: ' + (finding.application || 'UNKNOWN'));
    lines.push('- Path: ' + (finding.path || 'UNKNOWN'));
    lines.push('');
    lines.push('### Why it is impacted');
    lines.push('');
    for (const impact of finding.impacts) lines.push('- ' + impact.reason);
    lines.push('');
    lines.push('### Recommended action');
    lines.push('');
    for (const action of finding.remediation) lines.push('- ' + action);
    lines.push('');
    lines.push('### Verification');
    lines.push('');
    for (const step of finding.verification) lines.push('- ' + step);
    lines.push('');
  }
  if (report.limitations.length) lines.push('## Limitations', '', ...report.limitations.map(x => '- ' + x), '');
  return lines.join('\\n');
}
