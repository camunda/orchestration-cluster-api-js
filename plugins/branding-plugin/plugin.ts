import fs from 'fs';
import path from 'path';
import type { BrandingPlugin } from './types';

interface BrandingMetadataKey { 
  name: string; 
  description?: string; 
  constraints: { pattern?: string; minLength?: number; maxLength?: number }; 
  // Added: composition info from metadata to allow filtering
  composition?: { schemaKind?: string; refs?: string[]; inlineFragments?: number };
}
interface BrandingArrayMeta { name: string; minItems?: number; maxItems?: number; uniqueItems?: boolean; itemRef?: string; itemType?: string; }
interface BrandingMetadata { keys: BrandingMetadataKey[]; arrays?: BrandingArrayMeta[]; schemaVersion: string; generatedAt: string; specHash: string; }

export const handler: BrandingPlugin['Handler'] = (ctx) => {
  console.log('[branding-plugin] handler start');
  const { plugin } = ctx;
  const cfg: any = (ctx as any).config || {};
  let metadataPath = path.resolve(process.cwd(), cfg.metadataPath || 'branding/branding-metadata.json');
  if (!fs.existsSync(metadataPath)) {
    // Fallback: check typical alternate relative locations
    const candidates = [
      path.resolve(process.cwd(), 'sdks/typescript-codegen/branding/branding-metadata.json'),
      path.resolve(process.cwd(), '../branding/branding-metadata.json'),
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) { metadataPath = c; break; }
    }
  }
  if (!fs.existsSync(metadataPath)) { console.warn('[branding-plugin] metadata missing after fallbacks, skipping'); return; }
  let meta: BrandingMetadata;
  try { meta = JSON.parse(fs.readFileSync(metadataPath, 'utf8')); } catch (e) { console.warn('[branding-plugin] bad metadata JSON', e); return; }

  try {
    const debugFiles = (ctx as any).files;
    if (debugFiles) {
      console.log('[branding-plugin] available files:', Object.values(debugFiles).map((f: any) => f.name));
    }
  } catch {/* ignore */}

  // Rely entirely on preprocessing script for key selection (no in-plugin filtering now).

  const lines: string[] = [];
  lines.push('// branding-plugin generated');
  lines.push(`// schemaVersion=${meta.schemaVersion}`);
  lines.push(`// specHash=${meta.specHash}`);
  lines.push(`// generatedAt=${meta.generatedAt}`);
  lines.push('');
  // NOTE: We no longer emit the generic brand wrapper here; instead we patch the base
  // alias in types.gen.ts from `export type CamundaKey = string;` to the generic branded form.
  // This avoids an import cycle and keeps all existing references to `CamundaKey` working.
  const doValidate = cfg.validate !== false;
  if (doValidate) {
    lines.push('export function assertConstraint(value: string, label: string, c: { pattern?: string; minLength?: number; maxLength?: number }) {');
    lines.push('  if (c.pattern && !(new RegExp(c.pattern).test(value))) throw new Error(`Invalid pattern for ${label}`);');
    lines.push('  if (typeof c.minLength === "number" && value.length < c.minLength) throw new Error(`Value too short for ${label}`);');
    lines.push('  if (typeof c.maxLength === "number" && value.length > c.maxLength) throw new Error(`Value too long for ${label}`);');
    lines.push('}');
  }
  // Load lifter overrides once (search common relative locations)
  let lifterOverrides: Record<string,string> = {};
  try {
    const overrideCandidates = [
      path.resolve(process.cwd(), 'branding/lifter-overrides.json'), // when cwd = sdks/typescript-codegen
      path.resolve(process.cwd(), 'sdks/typescript-codegen/branding/lifter-overrides.json'), // when cwd = repo root
      path.resolve(process.cwd(), '../branding/lifter-overrides.json')
    ];
    for (const p of overrideCandidates) {
      if (fs.existsSync(p)) { lifterOverrides = JSON.parse(fs.readFileSync(p,'utf8')); break; }
    }
  } catch {/* ignore */}

  for (const k of meta.keys.sort((a,b)=>a.name.localeCompare(b.name))) {
    const c: string[] = [];
    if (k.constraints.pattern) c.push(`pattern: ${JSON.stringify(k.constraints.pattern)}`);
    if (k.constraints.minLength !== undefined) c.push(`minLength: ${k.constraints.minLength}`);
    if (k.constraints.maxLength !== undefined) c.push(`maxLength: ${k.constraints.maxLength}`);
    const obj = `{ ${c.join(', ')} }`;
    // lifter method overrides sidecar
  const lifterName = lifterOverrides[k.name] || 'assumeExists';
    if (k.description) lines.push(`// ${k.description.replace(/\n/g,' ')}`);
    lines.push(`export namespace ${k.name} {`);
    lines.push(`  export function ${lifterName}(value: string): ${k.name} {`);
    if (doValidate && c.length) lines.push(`    assertConstraint(value, '${k.name}', ${obj});`);
    lines.push('    return value as any;');
    lines.push('  }');
    lines.push(`  export function getValue(key: ${k.name}): string { return key; }`);
    lines.push('  export function isValid(value: string): boolean {');
    if (doValidate && c.length) {
      lines.push('    try {');
      lines.push(`      assertConstraint(value, '${k.name}', ${obj});`);
      lines.push('      return true;');
      lines.push('    } catch { return false; }');
    } else {
      lines.push('    return true;');
    }
    lines.push('  }');
    lines.push('}');
  }

  // Prepare helper namespace source we will append into types.gen.ts instead of separate file (simplifies consumption)
  const helperSource = lines.join('\n');

  // Monkey patch writeFileSync early so when types.gen.ts is emitted we can rewrite in-memory content.
  try {
  const keyNames = meta.keys.map(k => k.name);
  console.log(`[branding-plugin] metadata keys (${keyNames.length}): ${keyNames.join(', ')}`);
  const keySet = new Set(keyNames);
  const targetTypesSuffix = path.join('src','gen','types.gen.ts');
  const targetZodSuffix = path.join('src','gen','zod.gen.ts');
    const originalWrite = fs.writeFileSync.bind(fs);
    (fs as any).writeFileSync = function(filePath: any, data: any, ...rest: any[]) {
      try {
        if (typeof filePath === 'string' && typeof data === 'string') {
          // Patch types.gen.ts branding
            if (filePath.endsWith(targetTypesSuffix)) {
              console.log('[branding-plugin] intercepting write for types.gen.ts');
              let src: string = data;
              if (!src.includes('// branding-plugin patch: applied primitive branding')) {
                // Insert generic CamundaKey alias if missing (generator no longer emits base alias)
                if (!/export type CamundaKey<.*__brand: T/.test(src)) {
                  const headerMatch = src.match(/\/\/ This file is auto-generated by @hey-api\/openapi-ts\n?/);
                  if (headerMatch) {
                    const insertion = `${headerMatch[0]}\nexport type CamundaKey< T extends string = string > = string & { readonly __brand: T };\n// branding-plugin patch: applied primitive branding\n`;
                    src = src.replace(/\/\/ This file is auto-generated by @hey-api\/openapi-ts\n?/, insertion);
                  } else {
                    // Fallback: prepend
                    src = `export type CamundaKey< T extends string = string > = string & { readonly __brand: T };\n// branding-plugin patch: applied primitive branding\n` + src;
                  }
                }
                const lineRegex = /^export type (\w+) = ([^;]+);$/gm;
                let changed = 0;
                src = src.replace(lineRegex, (full, name, rhs) => {
                  if (!keySet.has(name)) return full;
                  if (rhs.includes('|')) return full;
                  const tokens = rhs.split('&').map(t => t.trim().replace(/[()]/g,'').trim());
                  const allowed = new Set(['CamundaKey','LongKey','unknown']);
                  if (!tokens.every(t => allowed.has(t))) return full;
                  changed++;
                  return `export type ${name} = CamundaKey<'${name}'>;`;
                });
                if (changed) {
                  if (changed > keySet.size) {
                    console.warn(`[branding-plugin] WARNING: branded ${changed} > metadata keys ${keySet.size}`);
                  }
                  console.log(`[branding-plugin] branded ${changed} aliases during write`);
                }
              }
              // Generic bounded array length transformation based on metadata
              try {
                const arrayMetaList: BrandingArrayMeta[] = (meta as any).arrays || [];
                if (arrayMetaList.length) {
                  const arrayMetaMap = new Map(arrayMetaList.map(a => [a.name, a]));
                  const aliasRegex = /^export type (\w+) = Array<([^>]+)>;$/gm;
                  src = src.replace(aliasRegex, (full, name, elemType) => {
                    const m = arrayMetaMap.get(name);
                    if (!m) return full; // not tracked
                    if (/readonly length:/.test(full)) return full; // already transformed
                    // Only act if maxItems defined and <= 10 (policy cap) and > 0
                    const max = typeof m.maxItems === 'number' ? m.maxItems : undefined;
                    const min = typeof m.minItems === 'number' ? m.minItems : 0; // default policy
                    if (!max || max > 10) return full;
                    if (min < 0 || min > max) return full;
                    // If fixed length (min==max) and small, optionally emit tuple for precision
                    if (min === max) {
                      if (max === 0) {
                        return `export type ${name} = [] & { readonly length: 0 }; // fixed length 0`;
                      }
                      if (max <= 10) {
                        const tupleElems = Array.from({ length: max }, () => elemType).join(', ');
                        return `export type ${name} = [${tupleElems}] & { readonly length: ${max} }; // fixed length ${max}`;
                      }
                    }
                    // Build union of lengths
                    const lengths = [] as number[];
                    for (let i = min; i <= max; i++) lengths.push(i);
                    const union = lengths.join(' | ');
                    const uniquenessComment = m.uniqueItems ? ' uniqueItems=true;' : '';
                    return `export type ${name} = Array<${elemType}> & { readonly length: ${union} }; // minItems=${min} maxItems=${max};${uniquenessComment}`;
                  });
                }
              } catch (e) {
                console.warn('[branding-plugin] array length transformation failed', e);
              }
              // Apply lifter override post-generation for already appended namespaces (in case of regeneration order)
              try {
                if (Object.keys(lifterOverrides).length) {
                  for (const [typeName, methodName] of Object.entries(lifterOverrides)) {
                    const nsRegex = new RegExp(`export namespace ${typeName} {[^}]*?export function (assumeExists|${methodName})\\(value: string\\): ${typeName}`,'s');
                    if (nsRegex.test(src)) {
                      src = src.replace(new RegExp(`export function assumeExists\\(value: string\\): ${typeName}`,'g'), `export function ${methodName}(value: string): ${typeName}`);
                    }
                  }
                }
              } catch {/* ignore */}
              arguments[1] = src;
            }
            // Inject zod augmentation import into zod.gen.ts if missing
            if (filePath.endsWith(targetZodSuffix)) {
              let src: string = data;
              if (!/zod-augment/.test(src)) {
                console.log('[branding-plugin] injecting zod augmentation import');
                const lines = src.split(/\n/);
                // Insert after initial comment & any blank lines, before first import (line with import { z }
                let insertIndex = 0;
                while (insertIndex < lines.length && lines[insertIndex].startsWith('//')) insertIndex++;
                while (insertIndex < lines.length && lines[insertIndex].trim() === '') insertIndex++;
                if (lines[insertIndex].startsWith('import')) {
                  insertIndex++;
                }
                lines.splice(insertIndex, 0, "import '../zod-augment'; // branding-plugin zod augmentation");
                src = lines.join('\n');
                arguments[1] = src;
              }
            }
            // Append helper namespaces to types file (after branding) so users can import from one place.
            if (filePath.endsWith(targetTypesSuffix)) {
              let src: string = arguments[1];
              if (!/branding-plugin generated/.test(src)) {
                src += `\n\n${helperSource}`;
                arguments[1] = src;
                console.log('[branding-plugin] appended key helper namespaces into types.gen.ts');
              }
            }
        }
      } catch (e) {
        console.warn('[branding-plugin] write intercept failed', e);
      }
      return originalWrite(filePath, arguments[1], ...rest);
    };
  } catch (e) {
    console.warn('[branding-plugin] failed monkey patch setup', e);
  }
};

