import { definePluginConfig } from '@hey-api/openapi-ts';
import { handler } from './plugin';
import type { BrandingPlugin } from './types';

export const defaultConfig: BrandingPlugin['Config'] = {
  config: {
    // Use project-local relative path; plugin will resolve & fallback upward
    metadataPath: 'branding/branding-metadata.json',
    factories: true,
    validate: true,
    exportFromIndex: true,
  },
  // No dependencies: we run first to intercept file writes.
  dependencies: [],
  handler,
  name: 'branding-plugin',
  output: 'keys',
};

export const defineConfig = definePluginConfig(defaultConfig);
