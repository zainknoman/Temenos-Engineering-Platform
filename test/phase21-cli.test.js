import test from 'node:test';
import assert from 'node:assert/strict';

import {
  VERSION,
  formatHelp,
  formatVersion,
  parseCliArgs,
  runCli
} from '../src/cli.js';

test('parses an empty command as help', () => {
  assert.deepEqual(parseCliArgs([]), { command: 'help', args: [] });
});

test('parses long help option', () => {
  assert.deepEqual(parseCliArgs(['--help']), { command: 'help', args: [] });
});

test('parses short help option', () => {
  assert.deepEqual(parseCliArgs(['-h']), { command: 'help', args: [] });
});

test('parses long version option', () => {
  assert.deepEqual(parseCliArgs(['--version']), { command: 'version', args: [] });
});

test('parses commands and preserves arguments', () => {
  assert.deepEqual(parseCliArgs(['project', 'create', '--name', 'demo']), {
    command: 'project',
    args: ['create', '--name', 'demo']
  });
});

test('formats the current version', () => {
  assert.equal(formatVersion(), `Temenos Engineering Platform v${VERSION}`);
});

test('help contains the primary command contract', () => {
  const help = formatHelp();
  assert.match(help, /Usage:/);
  assert.match(help, /tep <command>/);
  assert.match(help, /help/);
  assert.match(help, /version/);
});

test('runCli returns zero for help and writes output', () => {
  const output = [];
  const code = runCli(['help'], { stdout: value => output.push(value) });

  assert.equal(code, 0);
  assert.equal(output.length, 1);
  assert.match(output[0], /Temenos Engineering Platform/);
});

test('runCli returns zero for version and writes output', () => {
  const output = [];
  const code = runCli(['--version'], { stdout: value => output.push(value) });

  assert.equal(code, 0);
  assert.deepEqual(output, [formatVersion()]);
});

test('runCli rejects unknown commands without throwing', () => {
  const output = [];
  const code = runCli(['not-a-command'], { stdout: value => output.push(value) });

  assert.equal(code, 1);
  assert.match(output[0], /Unknown command: not-a-command/);
});
