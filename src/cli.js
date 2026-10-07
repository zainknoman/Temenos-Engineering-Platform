import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createProjectConfig, loadProjectConfig } from './product/project.js';
import { RepoMindAdapter } from './adapters/repomind.js';
import { formatReadModelReport, loadReadModelReport } from './product/report.js';
import { formatFlagshipDemo } from './product/flagship.js';

const VERSION = '0.4.0';
const DEFAULT_PROJECT_FILE = '.tep/project.json';

export function parseCliArgs(argv = []) {
  const args = [...argv];
  if (!args.length) return { command: 'help', args: [] };
  const first = args[0];
  if (first === '--help' || first === '-h') return { command: 'help', args: args.slice(1) };
  if (first === '--version' || first === '-v') return { command: 'version', args: args.slice(1) };
  return { command: first, args: args.slice(1) };
}

function options(args = []) {
  const out = { _: [] };
  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (!token.startsWith('--')) {
      out._.push(token);
      continue;
    }
    const [key, inline] = token.slice(2).split('=', 2);
    if (inline !== undefined) out[key] = inline;
    else if (args[i + 1] && !args[i + 1].startsWith('--')) out[key] = args[++i];
    else out[key] = true;
  }
  return out;
}

function value(opts, ...names) {
  for (const name of names) {
    if (opts[name] !== undefined) return opts[name];
  }
  return undefined;
}

async function projectCreate(args, stdout) {
  const opts = options(args);
  const configPath = resolve(value(opts, 'config') ?? DEFAULT_PROJECT_FILE);
  const config = createProjectConfig({
    id: value(opts, 'id'),
    name: value(opts, 'name'),
    sourceRelease: value(opts, 'source-release', 'sourceRelease'),
    targetRelease: value(opts, 'target-release', 'targetRelease'),
    repository: value(opts, 'repository'),
    environment: value(opts, 'environment'),
    source: {
      type: value(opts, 'source-type', 'sourceType'),
      repository: value(opts, 'source-repository', 'sourceRepository'),
      ref: value(opts, 'ref') ?? 'main',
      path: value(opts, 'path')
    }
  });
  await mkdir(dirname(configPath), { recursive: true });
  await writeFile(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
  stdout(JSON.stringify({ ok: true, action: 'project.create', configPath, project: config.project }, null, 2));
  return 0;
}

async function projectShow(args, stdout) {
  const opts = options(args);
  const configPath = resolve(value(opts, 'config') ?? DEFAULT_PROJECT_FILE);
  const config = await loadProjectConfig(configPath);
  stdout(JSON.stringify({ ok: true, action: 'project.show', configPath, config }, null, 2));
  return 0;
}

async function inventory(args, stdout) {
  const opts = options(args);
  const configPath = resolve(value(opts, 'config') ?? DEFAULT_PROJECT_FILE);
  const config = await loadProjectConfig(configPath);
  const rawInputPath = value(opts, 'input') ?? config.source.path;
  if (!rawInputPath) throw new Error('RepoMind export path is required: use --input <path> or project source.path');
  const inputPath = resolve(rawInputPath);
  if (config.source.path !== inputPath) {
    config.source = { ...config.source, path: inputPath };
    await writeFile(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
  }
  const index = JSON.parse(await readFile(inputPath, 'utf8'));
  const adapter = new RepoMindAdapter();
  const profile = adapter.loadIndex(index);
  const artifacts = adapter.listArtifacts();
  const dependencies = index.imports ?? [];
  stdout(JSON.stringify({
    ok: true,
    action: 'inventory',
    projectId: config.project.id,
    sourceRelease: config.temenos.sourceRelease,
    repository: profile,
    inventory: {
      files: artifacts.length,
      dependencies: dependencies.length,
      languages: [...new Set(artifacts.map(x => x.language).filter(Boolean))].sort(),
      limitations: adapter.getLimitations()
    }
  }, null, 2));
  return 0;
}

export function formatHelp() {
  return [
    'Temenos Engineering Platform',
    '',
    'Usage:',
    '  tep <command> [options]',
    '',
    'Commands:',
    '  help                         Show this help message',
    '  version                      Show the platform version',
    '  project create               Create a project workspace',
    '  project show                 Show the current project workspace',
    '  inventory                    Inspect a RepoMind export',
    '  report                       Show the project read model/report',
    '  status                       Show the project readiness status',
    '  demo r16-r25                 Run the deterministic flagship R16→R25 workflow',
    '  upgrade assess --demo       Run the flagship upgrade assessment',
    '  regression assess --demo    Run the flagship regression assessment',
    '  migration assess --demo     Run the flagship migration assessment',
    '  adc assess --demo           Run the flagship ADC readiness assessment',
    '  control-tower assess --demo Run the flagship control-tower assessment',
    '  certify --demo              Run the flagship certification assessment',
    '',
    'Project create options:',
    '  --id <id>                    Stable project id',
    '  --name <name>                Project name',
    '  --source-release <release>   Source Temenos release',
    '  --target-release <release>   Target Temenos release',
    '  --repository <url>           Repository identifier',
    '  --path <file>                RepoMind export path',
    '  --environment <name>         Environment metadata',
    '  --config <file>              Project config path',
    '',
    'Other:',
    '  --config <file>              Project config path',
    '  --input <file>               RepoMind export for inventory',
    '  --format <json|text>         Report output format (default: text)',
    '  --check-temenos-skills       Check the local Temenos-Skills provider',
    '  --demo                       Use the deterministic flagship fixture',
    '  --approval <PENDING|APPROVED>  Simulate the human GO/NO-GO approval gate',
    '  -h, --help                   Show this help message',
    '  -v, --version                Show the platform version'
  ].join('\n');
}

export function formatVersion() {
  return `Temenos Engineering Platform v${VERSION}`;
}

export function runCli(argv = [], { stdout = console.log } = {}) {
  const parsed = parseCliArgs(argv);
  try {
    switch (parsed.command) {
      case 'help':
        stdout(formatHelp());
        return 0;
      case 'version':
        stdout(formatVersion());
        return 0;
      case 'project':
        if (parsed.args[0] === 'create') return projectCreate(parsed.args.slice(1), stdout);
        if (parsed.args[0] === 'show') return projectShow(parsed.args.slice(1), stdout);
        stdout('Usage: tep project <create|show> [options]');
        return 1;
      case 'inventory':
        return inventory(parsed.args, stdout);
      case 'report':
        return report(parsed.args, stdout, 'text');
      case 'status':
        return report(parsed.args, stdout, 'text');
      case 'demo':
        if (parsed.args[0] === 'r16-r25') return flagship(parsed.args.slice(1), stdout);
        stdout('Usage: tep demo r16-r25 [--approval PENDING|APPROVED]');
        return 1;
      case 'upgrade':
      case 'regression':
      case 'migration':
      case 'adc':
      case 'control-tower':
        if (parsed.args[0] === 'assess' && parsed.args.includes('--demo')) return flagship(parsed.args.slice(1), stdout);
        stdout('This assessment command currently requires --demo.');
        return 1;
      case 'certify':
        if (parsed.args.includes('--demo')) return flagship(parsed.args.slice(1), stdout);
        stdout('This certification command currently requires --demo.');
        return 1;
      default:
        stdout(`Unknown command: ${parsed.command}\\n\\n${formatHelp()}`);
        return 1;
    }
  } catch (error) {
    stdout(`Error: ${error.message}`);
    return 1;
  }
}

export async function main(argv = process.argv.slice(2)) {
  return await runCli(argv);
}

export { VERSION };async function flagship(args, stdout) {
  const opts = options(args);
  const approval = value(opts, 'approval') ?? 'PENDING';
  stdout(await formatFlagshipDemo({ finalApprovalStatus: String(approval).toUpperCase() }));
  return 0;
}

async function report(args, stdout, defaultFormat = 'text') {
  const opts = options(args);
  const configPath = resolve(value(opts, 'config') ?? DEFAULT_PROJECT_FILE);
  const inputPath = value(opts, 'input');
  const format = value(opts, 'format') ?? defaultFormat;
  const report = await loadReadModelReport({
    configPath,
    inputPath,
    checkTemenosSkills: value(opts, 'check-temenos-skills') === true
  });
  stdout(formatReadModelReport(report, format));
  return 0;
}

