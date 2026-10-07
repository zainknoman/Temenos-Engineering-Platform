import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const DEFAULT_POLICY = Object.freeze({
  productionExecution: false,
  autonomousExecution: false,
  requireHumanApproval: true
});

const required = (value, name) => {
  if (value === undefined || value === null || value === '') {
    throw new Error(name + ' is required');
  }
  return value;
};

export function createProjectConfig(input = {}) {
  const now = new Date().toISOString();
  const project = {
    id: required(input.id, 'project.id'),
    name: required(input.name, 'project.name'),
    sourceRelease: required(input.sourceRelease, 'project.sourceRelease'),
    targetRelease: required(input.targetRelease, 'project.targetRelease'),
    repository: input.repository ?? null,
    environment: input.environment ?? 'local',
    status: input.status ?? 'ACTIVE',
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now
  };

  return {
    version: input.version ?? '1.0',
    project,
    source: {
      type: input.source?.type ?? (project.repository ? 'git' : 'local'),
      repository: input.source?.repository ?? project.repository,
      ref: input.source?.ref ?? 'main',
      path: input.source?.path ?? null
    },
    temenos: {
      sourceRelease: project.sourceRelease,
      targetRelease: project.targetRelease,
      environment: project.environment
    },
    policy: {
      ...DEFAULT_POLICY,
      ...(input.policy ?? {})
    }
  };
}

export async function saveProjectConfig(filePath, input) {
  const config = createProjectConfig(input);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(config, null, 2) + '\n', 'utf8');
  return config;
}

export async function loadProjectConfig(filePath) {
  const config = JSON.parse(await readFile(filePath, 'utf8'));
  return createProjectConfig({
    ...config.project,
    version: config.version,
    source: config.source,
    policy: config.policy
  });
}
