import path from 'path';

import { defineConfig } from '@hey-api/openapi-ts';

import { defineConfig as defineBranding } from './plugins/branding-plugin';

export default defineConfig({
  input: path.resolve(__dirname, '../../rest-api.domain.yaml'),
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
