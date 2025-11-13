#!/usr/bin/env node
import semanticRelease from 'semantic-release';

async function main() {
  try {
    const result = await semanticRelease({
      dryRun: true,
      ci: false,
    });
    if (result && result.nextRelease && result.nextRelease.version) {
      console.log(`next_version=${result.nextRelease.version}`);
      process.exit(0);
    } else {
      console.log('next_version=');
      process.exit(0); // no release required
    }
  } catch (err) {
    console.error('[next-version] semantic-release dry-run failed');
    console.error(err);
    process.exit(1);
  }
}
main();
