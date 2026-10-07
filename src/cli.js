const VERSION = '0.3.0';

export function parseCliArgs(argv = []) {
  const args = [...argv];

  if (args.length === 0) {
    return { command: 'help', args: [] };
  }

  const first = args[0];

  if (first === '--help' || first === '-h') {
    return { command: 'help', args: args.slice(1) };
  }

  if (first === '--version' || first === '-v') {
    return { command: 'version', args: args.slice(1) };
  }

  return {
    command: first,
    args: args.slice(1)
  };
}

export function formatHelp() {
  return [
    'Temenos Engineering Platform',
    '',
    'Usage:',
    '  tep <command> [options]',
    '',
    'Commands:',
    '  help                 Show this help message',
    '  version              Show the platform version',
    '',
    'Options:',
    '  -h, --help           Show this help message',
    '  -v, --version        Show the platform version',
    '',
    'Product workflows will be added incrementally in Phase 21.'
  ].join('\n');
}

export function formatVersion() {
  return `Temenos Engineering Platform v${VERSION}`;
}

export function runCli(argv = [], { stdout = console.log } = {}) {
  const parsed = parseCliArgs(argv);

  switch (parsed.command) {
    case 'help':
      stdout(formatHelp());
      return 0;
    case 'version':
      stdout(formatVersion());
      return 0;
    default:
      stdout(`Unknown command: ${parsed.command}\n\n${formatHelp()}`);
      return 1;
  }
}

export function main(argv = process.argv.slice(2)) {
  return runCli(argv);
}

export { VERSION };
