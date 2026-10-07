import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadProjectConfig } from './project.js';
import { RepoMindAdapter } from '../adapters/repomind.js';
import { TemenosSkillsAdapter } from '../adapters/temenos-skills.js';
import { checkAdapterReadiness } from './adapter-onboarding.js';

const EMPTY_SECTIONS = Object.freeze({
  findings: [],
  risk: [],
  remediation: [],
  regression: [],
  migration: [],
  adc: [],
  certification: [],
  evidence: []
});

function projectSummary(config) {
  return {
    id: config.project.id,
    name: config.project.name,
    status: config.project.status,
    sourceRelease: config.temenos.sourceRelease,
    targetRelease: config.temenos.targetRelease,
    environment: config.temenos.environment,
    repository: config.project.repository,
    source: { ...config.source },
    policy: { ...config.policy }
  };
}

function emptyAdapter(id, reason = 'Adapter was not evaluated.') {
  return {
    id,
    status: 'UNVERIFIED',
    discovery: null,
    capabilityCheck: null,
    checks: [{ name: 'readiness', status: 'UNVERIFIED', reason }]
  };
}

export function createReadModelReport({
  config,
  repoMind = null,
  temenosSkills = null,
  sections = {},
  generatedAt = null
} = {}) {
  if (!config?.project?.id) throw new Error('A loaded project configuration is required');

  const inventory = repoMind?.inventory ?? null;
  const report = {
    schemaVersion: '1.0',
    generatedAt: generatedAt ?? new Date().toISOString(),
    project: projectSummary(config),
    adapters: {
      repomind: repoMind?.readiness ?? emptyAdapter('repomind'),
      temenosSkills: temenosSkills?.readiness ?? emptyAdapter('temenos-skills')
    },
    inventory: inventory
      ? {
          profile: inventory.profile,
          files: inventory.files,
          dependencies: inventory.dependencies,
          languages: inventory.languages,
          limitations: inventory.limitations
        }
      : null,
    upgrade: {
      sourceRelease: config.temenos.sourceRelease,
      targetRelease: config.temenos.targetRelease,
      status: 'UNASSESSED'
    },
    sections: {
      ...EMPTY_SECTIONS,
      ...sections
    },
    safety: {
      productionExecution: config.policy.productionExecution === true,
      autonomousExecution: config.policy.autonomousExecution === true,
      requireHumanApproval: config.policy.requireHumanApproval !== false,
      externalExecution: 'NOT_REQUESTED'
    }
  };

  const blockers = [];
  const warnings = [];
  if (report.adapters.repomind.status === 'FAILED') blockers.push('RepoMind readiness failed.');
  if (report.adapters.temenosSkills.status === 'FAILED') blockers.push('Temenos-Skills readiness failed.');
  if (report.adapters.repomind.status === 'UNVERIFIED') warnings.push('RepoMind readiness is unverified.');
  if (report.adapters.temenosSkills.status === 'UNVERIFIED') warnings.push('Temenos-Skills readiness is unverified.');
  if (report.inventory === null) warnings.push('Repository inventory is not loaded.');

  report.summary = {
    status: blockers.length ? 'BLOCKED' : warnings.length ? 'READY_WITH_WARNINGS' : 'READY',
    blockers,
    warnings,
    counts: {
      findings: report.sections.findings.length,
      risk: report.sections.risk.length,
      remediation: report.sections.remediation.length,
      regression: report.sections.regression.length,
      migration: report.sections.migration.length,
      adc: report.sections.adc.length,
      certification: report.sections.certification.length,
      evidence: report.sections.evidence.length
    }
  };

  return report;
}

export async function loadReadModelReport({
  configPath = '.tep/project.json',
  inputPath = null,
  checkTemenosSkills = false,
  sections = {},
  generatedAt = null
} = {}) {
  const resolvedConfig = resolve(configPath);
  const config = await loadProjectConfig(resolvedConfig);
  const rawInputPath = inputPath ?? config.source.path;

  let repoMind = null;
  if (rawInputPath) {
    const input = JSON.parse(await readFile(resolve(rawInputPath), 'utf8'));
    const adapter = new RepoMindAdapter();
    adapter.loadIndex(input);
    const artifacts = adapter.listArtifacts();
    repoMind = {
      readiness: await checkAdapterReadiness(adapter, {
        requiredCapabilities: ['getRepositoryProfile', 'listArtifacts', 'getDependencies', 'analyzeImpact']
      }),
      inventory: {
        profile: adapter.getRepositoryProfile(),
        files: artifacts.length,
        dependencies: (input.imports ?? []).length,
        languages: [...new Set(artifacts.map(file => file.language ?? file.lang).filter(Boolean))].sort(),
        limitations: adapter.getLimitations()
      }
    };
  }

  let temenosSkills = null;
  if (checkTemenosSkills) {
    const adapter = new TemenosSkillsAdapter();
    temenosSkills = {
      readiness: await checkAdapterReadiness(adapter, {
        requiredCapabilities: ['lookupField', 'searchRules', 'compareReleases', 'verifyArtifact']
      })
    };
  }

  return createReadModelReport({
    config,
    repoMind,
    temenosSkills,
    sections,
    generatedAt
  });
}

export function formatReadModelReport(report, format = 'json') {
  if (format === 'json') return JSON.stringify(report, null, 2);
  if (format !== 'text') throw new Error('Unsupported report format: ' + format);

  const lines = [
    `TEP Report — ${report.project.name}`,
    `Project: ${report.project.id}`,
    `Release: ${report.project.sourceRelease} → ${report.project.targetRelease}`,
    `Environment: ${report.project.environment}`,
    `Status: ${report.summary.status}`,
    `RepoMind: ${report.adapters.repomind.status}`,
    `Temenos-Skills: ${report.adapters.temenosSkills.status}`,
    `Inventory: ${report.inventory ? report.inventory.files + ' files, ' + report.inventory.dependencies + ' dependencies' : 'not loaded'}`,
    `Blockers: ${report.summary.blockers.length}`,
    `Warnings: ${report.summary.warnings.length}`
  ];

  if (report.summary.blockers.length) lines.push(...report.summary.blockers.map(item => 'BLOCKER: ' + item));
  if (report.summary.warnings.length) lines.push(...report.summary.warnings.map(item => 'WARNING: ' + item));
  return lines.join('\\n');
}
