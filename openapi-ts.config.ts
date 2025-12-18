import { defineConfig } from '@hey-api/openapi-ts';

import { defineConfig as defineBranding } from './plugins/branding-plugin';
import { LOCAL_BUNDLED_SPEC_PATH } from './scripts/spec-location';

export default defineConfig({
  // Default input; the CLI `-i` flag still overrides this when provided.
  input: LOCAL_BUNDLED_SPEC_PATH,
  output: 'src/gen',
  plugins: [
    // Run branding first so it can monkey-patch fs.writeFileSync before other plugins emit files
    defineBranding({
      metadataPath: 'branding/branding-metadata.json',
      factories: true,
      validate: true,
    }),
    { name: '@hey-api/client-fetch', throwOnError: true },
    { name: 'zod', metadata: true, types: { infer: false } },
    { name: '@hey-api/sdk', asClass: false, validator: 'zod' },
  ],
});
