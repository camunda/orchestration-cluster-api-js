import fs from 'node:fs';
import path from 'node:path';

// Adds the unicode (u) flag to regex literals containing Unicode property escapes (\p{...}).
// The upstream spec uses patterns like [\p{L}_][\p{L}\p{N}_\-\.]* which require the u flag
// in JavaScript regex literals, but the generator emits them without it.

const root = process.cwd();
const zodGenPath = path.join(root, 'src/gen/zod.gen.ts');

if (!fs.existsSync(zodGenPath)) {
  console.error('[fix-unicode-regex] zod.gen.ts not found');
  process.exit(0);
}

const source = fs.readFileSync(zodGenPath, 'utf8');

// Match regex literals that contain \p{ but don't already have the u or v flag.
// Pattern: /.../ followed by optional flags (letters), where the regex body contains \p{
let count = 0;
const patched = source.replace(
  /\.regex\((\/[^/]*\\p\{[^/]*\/)((?:[gimsvy]*))\)/g,
  (_match, regexBody: string, flags: string) => {
    if (flags.includes('u') || flags.includes('v')) {
      return `.regex(${regexBody}${flags})`;
    }
    count++;
    return `.regex(${regexBody}${flags}u)`;
  }
);

if (count > 0) {
  fs.writeFileSync(zodGenPath, patched, 'utf8');
  console.log(
    `[fix-unicode-regex] Added 'u' flag to ${count} regex pattern(s) with Unicode property escapes`
  );
} else {
  console.log('[fix-unicode-regex] No regex patterns needed the unicode flag');
}
