import { createEvidence, createFinding } from '../core/contracts.js';

const normalize = value => String(value ?? '').trim().toUpperCase();
const artifactApp = artifact => normalize(artifact.application || artifact.metadata?.application || String(artifact.path || '').split('/')[0]);
const artifactTokens = artifact => {
  const path = normalize(artifact.path);
  const name = normalize(artifact.name);
  const fields = artifact.metadata?.fields ?? artifact.metadata?.referencedFields ?? [];
  return new Set([name, path, ...fields.map(normalize)]);
};

function appChange(releaseDiff, app) {
  const entry = releaseDiff?.apps?.[app];
  if (entry) return entry;
  if (releaseDiff?.apps_added?.some(x => normalize(x) === app)) return { app_added: true };
  if (releaseDiff?.apps_removed?.some(x => normalize(x) === app)) return { app_removed: true };
  return null;
}

function matchesField(tokens, field) {
  const f = normalize(field);
  return [...tokens].some(t => t === f || t.endsWith('/' + f) || t.includes('/' + f + '.'));
}

function correlateArtifact(artifact, releaseDiff) {
  const app = artifactApp(artifact);
  const tokens = artifactTokens(artifact);
  const change = appChange(releaseDiff, app);
  const impacts = [];

  if (!change) return { artifact, application: app || null, impacts };

  if (change.app_removed) impacts.push({ type: 'APPLICATION_REMOVED', application: app, reason: 'Application ' + app + ' is present in the source/target diff as removed.' });
  if (change.app_added) impacts.push({ type: 'APPLICATION_ADDED', application: app, reason: 'Application ' + app + ' is newly present in the target release.' });

  for (const field of change.fields_removed ?? []) {
    if (matchesField(tokens, field)) impacts.push({ type: 'FIELD_REMOVED', application: app, field, reason: 'Customization references changed field ' + app + '.' + field + '.' });
  }
  for (const field of change.fields_moved ?? []) {
    if (matchesField(tokens, field[0])) impacts.push({ type: 'FIELD_MOVED', application: app, field: field[0], fromPosition: field[1], toPosition: field[2], reason: 'Field ' + app + '.' + field[0] + ' moved from position ' + field[1] + ' to ' + field[2] + '.' });
  }
  for (const field of change.fields_added ?? []) {
    if (matchesField(tokens, field)) impacts.push({ type: 'FIELD_ADDED', application: app, field, reason: 'Customization explicitly references target-added field ' + app + '.' + field + '.' });
  }
  for (const item of change.jbc_renamed ?? []) {
    const field = item[0];
    const oldName = normalize(item[1]);
    const newName = normalize(item[2]);
    if (matchesField(tokens, field) || [...tokens].some(t => t.includes(oldName) || t.includes(newName))) {
      impacts.push({ type: 'JBC_RENAMED', application: app, field, from: item[1], to: item[2], reason: 'jBC mapping for ' + app + '.' + field + ' changed from ' + item[1] + ' to ' + item[2] + '.' });
    }
  }

  if (!impacts.length) impacts.push({ type: 'APPLICATION_CHANGED', application: app, reason: 'Application ' + app + ' changed in the release comparison and contains bank customization.' });
  return { artifact, application: app || null, impacts };
}

const rank = { Critical: 4, High: 3, Medium: 2, Low: 1, Informational: 0 };
function riskFor(impact) {
  if (['APPLICATION_REMOVED', 'FIELD_REMOVED'].includes(impact.type)) return 'Critical';
  if (['JBC_RENAMED', 'FIELD_MOVED'].includes(impact.type)) return 'High';
  if (['APPLICATION_CHANGED', 'FIELD_ADDED'].includes(impact.type)) return 'Medium';
  return 'Low';
}

export function correlateReleaseChanges({ artifacts, releaseDiff }) {
  return artifacts.map(a => correlateArtifact(a, releaseDiff)).filter(x => x.impacts.length);
}

export function classifyUpgradeRisk(correlations) {
  return correlations.map(c => {
    const severity = c.impacts.map(riskFor).sort((a, b) => rank[b] - rank[a])[0] ?? 'Informational';
    return { ...c, severity };
  });
}

export function buildRemediationRecommendation(correlation) {
  const actions = new Set();
  for (const impact of correlation.impacts) {
    if (impact.type === 'FIELD_REMOVED') actions.add('Replace the removed field reference with the supported target-release field or redesign the customization.');
    if (impact.type === 'FIELD_MOVED') actions.add('Review positional access and replace hard-coded positions with supported field access where possible.');
    if (impact.type === 'JBC_RENAMED') actions.add('Update jBC/component references to the target-release name and verify component bindings.');
    if (impact.type === 'APPLICATION_REMOVED') actions.add('Confirm the business function replacement in the target release before migrating the customization.');
    if (impact.type === 'APPLICATION_ADDED') actions.add('Review whether the customization should be re-homed on the target application.');
    if (impact.type === 'APPLICATION_CHANGED') actions.add('Review the customization against the target application definition and regression-test affected flows.');
    if (impact.type === 'FIELD_ADDED') actions.add('Confirm target-release field semantics before relying on the new field.');
  }
  return [...actions];
}

export function buildVerificationPlan(correlation, targetRelease) {
  const steps = [
    'Verify ' + correlation.artifact.name + ' against ' + targetRelease + ' release definitions.',
    'Compile/build the artifact in the target-release development environment.',
    'Execute focused functional tests for the affected application and customization path.'
  ];
  if (correlation.impacts.some(i => i.type === 'FIELD_MOVED')) steps.push('Test read/write behavior for every affected field position.');
  if (correlation.impacts.some(i => i.type === 'JBC_RENAMED')) steps.push('Verify jBC/component resolution and runtime invocation.');
  if (correlation.impacts.some(i => i.type === 'FIELD_REMOVED' || i.type === 'APPLICATION_REMOVED')) steps.push('Obtain explicit business/functional sign-off for the replacement design.');
  return steps;
}

export function buildUpgradeFindings({ project, correlations, evidenceIds = [] }) {
  return correlations.map(c => {
    const primary = c.impacts[0];
    return createFinding({
      id: 'finding:' + project.id + ':' + c.artifact.id,
      projectId: project.id,
      artifactId: c.artifact.id,
      category: 'UPGRADE_IMPACT',
      severity: c.severity,
      title: c.artifact.name + ': ' + primary.type.replaceAll('_', ' '),
      description: c.impacts.map(i => i.reason).join(' '),
      recommendation: buildRemediationRecommendation(c).join(' '),
      sourceRelease: project.sourceRelease,
      targetRelease: project.targetRelease,
      evidenceIds
    });
  });
}

export function buildUpgradeEvidence({ project, releaseDiff, correlations }) {
  return createEvidence({
    id: 'evidence:upgrade-assessment:' + project.id + ':' + Date.now(),
    sourceSystem: 'Temenos-Engineering-Platform',
    sourceType: 'UPGRADE_CORRELATION',
    sourceReference: project.sourceRelease + '->' + project.targetRelease,
    release: project.targetRelease,
    toolVersion: 'phase-4',
    excerpt: JSON.stringify({
      sourceRelease: project.sourceRelease,
      targetRelease: project.targetRelease,
      summary: releaseDiff?.summary ?? null,
      correlatedArtifacts: correlations.length
    }).slice(0, 4000)
  });
}
