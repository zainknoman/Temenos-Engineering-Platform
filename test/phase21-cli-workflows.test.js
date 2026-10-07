import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runCli } from '../src/cli.js';

async function tempDir() {
  return mkdtemp(join(tmpdir(), 'tep-cli-'));
}

test('project create writes a versioned workspace configuration', async () => {
  const dir = await tempDir();
  const config = join(dir, 'project.json');
  const output = [];
  const code = await runCli([
    'project', 'create',
    '--id', 'bank-r16-r25',
    '--name', 'Bank R16 to R25',
    '--source-release', 'R16',
    '--target-release', 'R25',
    '--repository', 'bank-core',
    '--path', join(dir, 'repomind.json'),
    '--environment', 'sit',
    '--config', config
  ], { stdout: value => output.push(value) });

  assert.equal(code, 0);
  const saved = JSON.parse(await readFile(config, 'utf8'));
  assert.equal(saved.project.id, 'bank-r16-r25');
  assert.equal(saved.temenos.targetRelease, 'R25');
  assert.equal(saved.source.path, join(dir, 'repomind.json'));
  assert.equal(saved.policy.productionExecution, false);
  assert.match(output[0], /project.create/);
});

test('project show reads the workspace configuration', async () => {
  const dir = await tempDir();
  const config = join(dir, 'project.json');
  await runCli([
    'project', 'create', '--id', 'demo', '--name', 'Demo',
    '--source-release', 'R24', '--target-release', 'R25', '--config', config
  ], { stdout: () => {} });

  const output = [];
  const code = await runCli(['project', 'show', '--config', config], {
    stdout: value => output.push(value)
  });

  assert.equal(code, 0);
  const shown = JSON.parse(output[0]);
  assert.equal(shown.action, 'project.show');
  assert.equal(shown.config.project.id, 'demo');
});

test('inventory summarizes a RepoMind export without mutating it', async () => {
  const dir = await tempDir();
  const config = join(dir, 'project.json');
  const input = join(dir, 'repomind.json');
  await runCli([
    'project', 'create', '--id', 'inventory-demo', '--name', 'Inventory Demo',
    '--source-release', 'R16', '--target-release', 'R25',
    '--path', input, '--config', config
  ], { stdout: () => {} });

  const repoMind = {
    project: { name: 'Bank Core' },
    files: [
      { path: 'CUSTOMER/CUSTOMER.b', extension: '.b', language: 'jBC' },
      { path: 'hooks/CustomerHook.java', extension: '.java', language: 'Java' }
    ],
    imports: [{ from: 'hooks/CustomerHook.java', to: 'CUSTOMER/CUSTOMER.b' }],
    stats: { files: 2 }
  };
  await import('node:fs/promises').then(fs => fs.writeFile(input, JSON.stringify(repoMind), 'utf8'));

  const output = [];
  const code = await runCli(['inventory', '--config', config], {
    stdout: value => output.push(value)
  });

  assert.equal(code, 0);
  const result = JSON.parse(output[0]);
  assert.equal(result.action, 'inventory');
  assert.equal(result.inventory.files, 2);
  assert.equal(result.inventory.dependencies, 1);
  assert.deepEqual(result.inventory.languages, ['Java', 'jBC']);
  assert.equal(result.inventory.limitations.length > 0, true);
});


test('report exposes a deterministic read model as JSON', async () => {
  const dir = await tempDir();
  const config = join(dir, 'project.json');
  const input = join(dir, 'repomind.json');
  await runCli([
    'project', 'create', '--id', 'report-demo', '--name', 'Report Demo',
    '--source-release', 'R16', '--target-release', 'R25',
    '--path', input, '--config', config
  ], { stdout: () => {} });

  await import('node:fs/promises').then(fs => fs.writeFile(input, JSON.stringify({
    project: { name: 'Bank Core' },
    files: [
      { path: 'CUSTOMER/CUSTOMER.b', extension: '.b', language: 'jBC' },
      { path: 'hooks/CustomerHook.java', extension: '.java', language: 'Java' }
    ],
    imports: [{ from: 'hooks/CustomerHook.java', to: 'CUSTOMER/CUSTOMER.b' }]
  }), 'utf8'));

  const output = [];
  const code = await runCli(['report', '--config', config, '--format', 'json'], {
    stdout: value => output.push(value)
  });

  assert.equal(code, 0);
  const result = JSON.parse(output[0]);
  assert.equal(result.schemaVersion, '1.0');
  assert.equal(result.project.id, 'report-demo');
  assert.equal(result.project.targetRelease, 'R25');
  assert.equal(result.inventory.files, 2);
  assert.equal(result.adapters.repomind.status, 'READY');
  assert.equal(result.safety.productionExecution, false);
});

test('status is a read-only alias for the project readiness report', async () => {
  const dir = await tempDir();
  const config = join(dir, 'project.json');
  await runCli([
    'project', 'create', '--id', 'status-demo', '--name', 'Status Demo',
    '--source-release', 'R24', '--target-release', 'R25', '--config', config
  ], { stdout: () => {} });

  const output = [];
  const code = await runCli(['status', '--config', config], {
    stdout: value => output.push(value)
  });

  assert.equal(code, 0);
  assert.match(output[0], /TEP Report — Status Demo/);
  assert.match(output[0], /RepoMind: UNVERIFIED/);
  assert.match(output[0], /Temenos-Skills: UNVERIFIED/);
});
