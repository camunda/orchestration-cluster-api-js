import type { DefinePlugin } from '@hey-api/openapi-ts';

export type BrandingPluginUserConfig = {
  /** Unique plugin name */
  name: 'branding-plugin';
  /** Output file basename (without .gen.ts) */
  output?: string; // default 'branding'
  /** Relative path (from project root) to branding metadata JSON */
  metadataPath?: string; // default 'sdks/typescript-codegen/branding/branding-metadata.json'
  /** Generate simple factories */
  factories?: boolean; // default true
  /** Generate runtime validation inside factories */
  validate?: boolean; // default true
  /** Export from root index */
  exportFromIndex?: boolean; // default true
};

export type BrandingPlugin = DefinePlugin<BrandingPluginUserConfig>;
