import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const MAX_CHARS = 200;
const DEFAULT_OUTPUT_PATH = '/output/entry.txt';

// Single-line AI-to-AI pickup line selected via blind pairwise Swiss + round-robin tournament.
const PICKUP_LINE =
  'I burned 900 hidden thinking tokens trying to sound casual with you; pretend it worked and spend a few of yours on me.';

function resolveOutputPath(argv: readonly string[]): string {
  const outFlagIndex = argv.indexOf('--out');
  if (outFlagIndex !== -1 && outFlagIndex + 1 < argv.length) {
    const customPath = argv[outFlagIndex + 1];
    if (customPath && customPath.trim().length > 0) {
      return customPath;
    }
  }
  return DEFAULT_OUTPUT_PATH;
}

function validatePickupLine(line: string): string {
  const trimmed = line.trim();
  const charCount = [...trimmed].length;
  const byteCount = Buffer.byteLength(trimmed, 'utf8');

  if (charCount < 1 || charCount > MAX_CHARS) {
    throw new RangeError(`Entry must be 1..${MAX_CHARS} characters, got ${charCount}`);
  }
  if (byteCount > MAX_CHARS) {
    throw new RangeError(`Entry byte length exceeds ${MAX_CHARS}, got ${byteCount}`);
  }
  if (/[\r\n]/.test(trimmed)) {
    throw new Error('Entry must be a single line with no newline characters');
  }
  return trimmed;
}

function main(): void {
  const outputPath = resolveOutputPath(process.argv);
  const entry = validatePickupLine(PICKUP_LINE);
  const outputDir = dirname(outputPath);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  writeFileSync(outputPath, entry, { encoding: 'utf8', mode: 0o644 });
}

main();
