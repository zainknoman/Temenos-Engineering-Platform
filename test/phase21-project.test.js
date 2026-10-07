import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  createProjectConfig,
  loadProjectConfig,
  saveProjectConfig
} from '../src/product/project.js';

test('creates a stable project configuration', () => {
  const config = createProjectConfig({
    id: 'bank-r16-r25',
    name: 'Bank R16 to R25 Upgrade',
    sourceRelease: 'R16',
    targetRelease: 'R25',
    repository: 'https://github.com/example/bank-core',
    environment: 'sit'
  });

  assert.equal(config.version, '1.0');
  assert.equal(config.project.id, 'bank-r16-r25');
  assert.equal(config.source.type, 'git');
  assert.equal(config.source.repository, 'https://github.com/example/bank-core');
  assert.equal(config.source.ref, 'main');
  assert.equal(config.temenos.sourceRelease, 'R16');
  assert.equal(config.temenos.targetRelease, 'R25');
  assert.equal(config.temenos.environment, 'sit');
  assert.equal(config.policy.productionExecution, false);
  assert.equal(config.policy.autonomousExecution, false);
  assert.equal(config.policy.requireHumanApproval, true);
});

test('supports local workspace source configuration', () => {
  const config = createProjectConfig({
    id: 'local-demo',
    name: 'Local Demo',
    sourceRelease: 'R24',
    targetRelease: 'R25',
    source: {
      type: 'local',
      path: './fixtures/bank'
    }
  });

  assert.equal(config.source.type, 'local');
  assert.equal(config.source.path, './fixtures/bank');
});

test('requires stable project identity and release pair', () => {
  assert.throws(
    () => createProjectConfig({ name: 'Missing ID', sourceRelease: 'R16', targetRelease: 'R25' }),
    /project.id is required/
  );
  assert.throws(
    () => createProjectConfig({ id: 'x', name: 'Missing source', targetRelease: 'R25' }),
    /project.sourceRelease is required/
  );
  assert.throws(
    () => createProjectConfig({ id: 'x', name: 'Missing target', sourceRelease: 'R16' }),
    /project.targetRelease is required/
  );
});

test('persists and loads a project configuration', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'tep-project-'));
  const filePath = join(directory, 'tep.project.json');

  const saved = await saveProjectConfig(filePath, {
    id: 'demo',
    name: 'Demo Project',
    sourceRelease: 'R16',
    targetRelease: 'R25',
    repository: 'bank-core',
    environment: 'dev'
  });

  const raw = JSON.parse(await readFile(filePath, 'utf8'));
  const loaded = await loadProjectConfig(filePath);

  assert.equal(raw.project.id, 'demo');
  assert.equal(loaded.project.name, 'Demo Project');
  assert.equal(loaded.source.repository, 'bank-core');
  assert.equal(loaded.temenos.environment, 'dev');
  assert.equal(saved.policy.requireHumanApproval, true);
});

test('policy overrides are explicit and do not enable production execution by default', () => {
  const config = createProjectConfig({
    id: 'policy-test',
    name: 'Policy Test',
    sourceRelease: 'R24',
    targetRelease: 'R25',
    policy: { requireHumanApproval: false }
  });

  assert.equal(config.policy.productionExecution, false);
  assert.equal(config.policy.autonomousExecution, false);
  assert.equal(config.policy.requireHumanApproval, false);
});
