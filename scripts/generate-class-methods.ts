import fs from 'fs';
import path from 'path';

import { parse } from 'yaml';

interface OA3Parameter {
  in?: string;
  name?: string;
  required?: boolean;
}
interface OA3Schema {
  oneOf?: any[];
  anyOf?: any[];
  $ref?: string;
  type?: string;
  properties?: Record<string, OA3Schema>;
  required?: string[];
}
interface OA3MediaType {
  schema?: OA3Schema;
}
interface OA3RequestBody {
  content?: Record<string, OA3MediaType>;
}
interface OA3Operation {
  operationId?: string;
  parameters?: OA3Parameter[];
  requestBody?: OA3RequestBody;
  summary?: string;
  description?: string;
  tags?: string[];
  ['x-eventually-consistent']?: boolean;
}
interface OA3PathItem {
  [method: string]: OA3Operation | any;
}
interface OA3Spec {
  paths?: Record<string, OA3PathItem>;
  components?: { schemas?: Record<string, OA3Schema> };
}

const ROOT = process.cwd();
const SPEC_PATH = path.resolve(ROOT, './rest-api.source.yaml');
const TEMPLATE_FILE = path.join(ROOT, 'src/template/CamundaClient.template.ts');
const CLASS_FILE = path.join(ROOT, 'src/gen/CamundaClient.ts');
const SDK_GEN_PATH = path.join(ROOT, 'src/gen/sdk.gen.ts');

const MARK_TYPES_START = '// === AUTO-GENERATED CAMUNDA SUPPORT TYPES START ===';
const MARK_TYPES_END = '// === AUTO-GENERATED CAMUNDA SUPPORT TYPES END ===';
const MARK_METHODS_START = '// === AUTO-GENERATED CAMUNDA METHODS START ===';
const MARK_METHODS_END = '// === AUTO-GENERATED CAMUNDA METHODS END ===';

function main() {
  if (!fs.existsSync(SPEC_PATH)) {
    throw new Error('[class-gen] Spec missing, skipping');
  }
  if (!fs.existsSync(TEMPLATE_FILE)) {
    throw new Error('[class-gen] Template missing, skipping');
  }
  const spec: OA3Spec = parse(fs.readFileSync(SPEC_PATH, 'utf8'));
  const tpl = fs.readFileSync(TEMPLATE_FILE, 'utf8');
  const tS = tpl.indexOf(MARK_TYPES_START),
    tE = tpl.indexOf(MARK_TYPES_END),
    mS = tpl.indexOf(MARK_METHODS_START),
    mE = tpl.indexOf(MARK_METHODS_END);
  if ([tS, tE, mS, mE].some((i) => i === -1) || tE < tS || mE < mS) {
    throw new Error('[class-gen] Markers missing');
  }

  // Underlying docs
  const docs: Record<string, string> = {};
  if (fs.existsSync(SDK_GEN_PATH)) {
    const sdk = fs.readFileSync(SDK_GEN_PATH, 'utf8');
    const re = /\n\/\*\*([\s\S]*?)\*\/\nexport const (\w+)\s*=\s*</g;
    let m;
    while ((m = re.exec(sdk))) docs[m[2]] = '/**' + m[1] + '*/';
  }
  // Collect available exported zod response schema names to avoid emitting invalid references
  const availableResponses = new Set<string>();
  const voidResponses = new Set<string>();
  const ZOD_GEN_PATH = path.join(ROOT, 'src/gen/zod.gen.ts');
  if (fs.existsSync(ZOD_GEN_PATH)) {
    const zsrc = fs.readFileSync(ZOD_GEN_PATH, 'utf8');
    const rResp = /export const (z[A-Z][A-Za-z0-9_]*)\s*=\s*([^;]+);/g;
    let mm;
    while ((mm = rResp.exec(zsrc))) {
      const name = mm[1];
      const rhs = mm[2];
      availableResponses.add(name);
      if (/z\.void\s*\(\)/.test(rhs)) voidResponses.add(name);
    }
  }

  interface OpMeta {
    opId: string;
    hasBody: boolean;
    bodyOnly: boolean;
    summary?: string;
    description?: string;
    tags?: string[];
    originalOpId: string;
    unionBodies: string[];
    eventual: boolean;
    verb: string;
    pathParams: string[];
    queryParams: string[];
    optionalTenantIdInBody: boolean;
  }
  const ops: OpMeta[] = [];
  for (const item of Object.values(spec.paths || {})) {
    for (const [verb, raw] of Object.entries(item as any)) {
      const op = raw as OA3Operation;
      if (!op?.operationId) continue;
      const originalId = op.operationId;
      const opId = sanitize(op.operationId);
      const params = (op.parameters || []) as OA3Parameter[];
      const pathParams = params
        .filter((p) => p.in === 'path' && !!p.name)
        .map((p) => p.name!) as string[];
      const queryParams = params
        .filter((p) => p.in === 'query' && !!p.name)
        .map((p) => p.name!) as string[];
      const hasPQ = params.some((p) => p.in === 'path' || p.in === 'query');
      const hasBody = !!op.requestBody && hasJsonLike(op.requestBody);
      const bodyOnly = !!(hasBody && !hasPQ);
      const eventual = !!(op as any)['x-eventually-consistent'];
      // Detect union body variants (top-level oneOf/anyOf) when bodyOnly
      const unionBodies: string[] = [];
      let optionalTenantIdInBody = false;
      if (bodyOnly && op.requestBody?.content) {
        for (const mt of Object.values(op.requestBody.content)) {
          const schema = mt?.schema as OA3Schema | undefined;
          const variants = schema?.oneOf || schema?.anyOf;
          if (Array.isArray(variants) && variants.length > 1) {
            for (const v of variants) {
              if (v && typeof v === 'object' && '$ref' in v && typeof v.$ref === 'string') {
                const ref = v.$ref as string;
                const name = ref.split('/').pop();
                if (name) unionBodies.push(name.replace(/XML/g, 'Xml'));
              }
            }
            // Conservative union handling: only mark optionalTenantIdInBody if ALL variants allow optional tenantId
            const resolved = variants.map((v) => resolveSchema(v, spec));
            if (
              resolved.length > 0 &&
              resolved.every((rs) => rs && hasOptionalTenantId(rs))
            ) {
              optionalTenantIdInBody = true;
            }
          } else {
            const resolved = resolveSchema(schema, spec);
            if (resolved && hasOptionalTenantId(resolved)) optionalTenantIdInBody = true;
          }
        }
      }
      ops.push({
        opId,
        hasBody,
        bodyOnly,
        summary: op.summary,
        description: op.description,
        tags: op.tags,
        originalOpId: originalId,
        unionBodies: Array.from(new Set(unionBodies)),
        eventual,
        verb: verb.toLowerCase(),
        pathParams,
        queryParams,
        optionalTenantIdInBody,
      });
    }
  }
  ops.sort((a, b) => a.opId.localeCompare(b.opId));

  const support: string[] = [];
  support.push('// Generated ' + new Date().toISOString());
  support.push('// Operations: ' + ops.length);
  support.push('type _RawReturn<F> = F extends (...a:any)=>Promise<infer R> ? R : never;');
  support.push(
    'type _DataOf<F> = Exclude<_RawReturn<F> extends { data: infer D } ? D : _RawReturn<F>, undefined>;'
  );
  for (const o of ops) {
    support.push(`type ${o.opId}Options = Parameters<typeof Sdk.${o.opId}>[0];`);
    if (o.hasBody)
      support.push(
        `type ${o.opId}Body = (NonNullable<${o.opId}Options> extends { body?: infer B } ? B : never);`
      );
    // Path & query param extracted types (individual)
    for (const pp of o.pathParams)
      support.push(
        `type ${o.opId}PathParam_${pp} = (NonNullable<${o.opId}Options> extends { path: { ${pp}: infer P } } ? P : any);`
      );
    for (const qp of o.queryParams)
      support.push(
        `type ${o.opId}QueryParam_${qp} = (NonNullable<${o.opId}Options> extends { query: { ${qp}: infer Q } } ? Q : any);`
      );
    // Build unified Input type (domain-only).
    const pieces: string[] = [];
    if (o.pathParams.length || o.queryParams.length || o.hasBody) {
      if (o.hasBody) pieces.push(o.opId + 'Body');
      const extras: string[] = [];
      for (const pp of o.pathParams) extras.push(`${pp}: ${o.opId}PathParam_${pp}`);
      for (const qp of o.queryParams)
        extras.push(`${qp}${o.bodyOnly ? '?' : ''}: ${o.opId}QueryParam_${qp}`); // query optional by default (cannot infer required easily without spec extension here)
      if (extras.length) pieces.push(`{ ${extras.join('; ')} }`);
      if (o.opId === 'createDeployment') {
        // Enforce File[] resources at the public input surface (Blob not allowed)
        // createDeploymentBody comes from generated SDK types (still broad); override here.
        support.push(
          `type ${o.opId}Input = Omit<${o.opId}Body, 'resources'> & { resources: File[] };`
        );
      } else {
        support.push(`type ${o.opId}Input = ${pieces.join(' & ')};`);
      }
    } else {
      support.push(`type ${o.opId}Input = void;`);
    }
    if (o.eventual)
      support.push(`/** Management of eventual consistency **/
type ${o.opId}Consistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.${o.opId}>> 
};`);
  }

  // Extended deployment result (public) - built atop generated REST types
  support.push(
    '/** Extended deployment result with typed buckets for direct access to deployed artifacts. */'
  );
  support.push(
    'export interface ExtendedDeploymentResult extends _DataOf<typeof Sdk.createDeployment> {'
  );
  support.push(
    '  processes: Array<NonNullable<_DataOf<typeof Sdk.createDeployment>["deployments"][number]["processDefinition"]>>;'
  );
  support.push(
    '  decisions: Array<NonNullable<_DataOf<typeof Sdk.createDeployment>["deployments"][number]["decisionDefinition"]>>;'
  );
  support.push(
    '  decisionRequirements: Array<NonNullable<_DataOf<typeof Sdk.createDeployment>["deployments"][number]["decisionRequirements"]>>;'
  );
  support.push(
    '  forms: Array<NonNullable<_DataOf<typeof Sdk.createDeployment>["deployments"][number]["form"]>>;'
  );
  support.push(
    '  resources: Array<NonNullable<_DataOf<typeof Sdk.createDeployment>["deployments"][number]["resource"]>>;'
  );
  support.push('}');

  const methods: string[] = [];
  methods.push('  // Generated methods (' + new Date().toISOString() + ')');
  // (createDeployment) enrichment handled inline per-call; types above exported
  for (const o of ops) {
    let jsdoc = forwardJsDoc(o, docs);
    if (jsdoc && o.eventual) {
      jsdoc = jsdoc.replace(
        /\n \* @tags[^\n]*\n/,
        (m) =>
          m +
          ' * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.\n'
      );
      if (!/@consistency eventual/.test(jsdoc)) {
        jsdoc = jsdoc.replace(
          /\*\/$/,
          ' * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.\n */'
        );
      }
    }
    if (jsdoc) {
      // augment createDeployment doc with enrichment mention
      if (o.opId === 'createDeployment') {
        jsdoc = jsdoc.replace(
          /\* @tags Resource/,
          '* @tags Resource\n * @returns Enriched deployment result with typed arrays (processes, decisions, decisionRequirements, forms, resources).'
        );
      }
      methods.push(indent(jsdoc, 2));
    }
    // Method signature (single unified input)
    const returnType =
      o.opId === 'createDeployment' ? 'ExtendedDeploymentResult' : `_DataOf<typeof Sdk.${o.opId}>`;
    if (o.hasBody || o.pathParams.length || o.queryParams.length) {
      methods.push(
        o.eventual
          ? `  ${o.opId}(input: ${o.opId}Input, /** Management of eventual consistency **/ consistencyManagement: ${o.opId}Consistency): CancelablePromise<${returnType}>;`
          : `  ${o.opId}(input: ${o.opId}Input): CancelablePromise<${returnType}>;`
      );
    } else {
      methods.push(
        o.eventual
          ? `  ${o.opId}(consistencyManagement: ${o.opId}Consistency): CancelablePromise<${returnType}>;`
          : `  ${o.opId}(): CancelablePromise<${returnType}>;`
      );
    }
    methods.push(
      `  ${o.opId}(${o.hasBody || o.pathParams.length || o.queryParams.length ? 'arg: any' : 'arg?: any'}${o.eventual ? ', /** Management of eventual consistency **/ consistencyManagement: ' + o.opId + 'Consistency' : ''}): CancelablePromise<any> {`
    );
    if (o.eventual) {
      methods.push(
        '    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");'
      );
      methods.push('    const useConsistency = consistencyManagement.consistency;');
    }
    methods.push('    return toCancelable(async signal => {');
    // Build envelope
    const hasInputs = o.hasBody || o.pathParams.length || o.queryParams.length;
    if (hasInputs) {
      // Destructure and separate
      const allParamNames = [...o.pathParams, ...o.queryParams];
      if (o.hasBody) {
        if (allParamNames.length) {
          methods.push(`      const { ${allParamNames.join(', ')}, ..._body } = arg || {};`);
        } else {
          methods.push('      const _body = arg;');
        }
      } else if (allParamNames.length) {
        methods.push(`      const { ${allParamNames.join(', ')} } = arg || {};`);
      }
      methods.push('      let envelope: any = {};');
      if (o.pathParams.length)
        methods.push(`      envelope.path = { ${o.pathParams.join(', ')} };`);
      if (o.queryParams.length)
        methods.push(`      envelope.query = { ${o.queryParams.join(', ')} };`);
      if (o.hasBody) methods.push('      envelope.body = _body;');
      if (o.hasBody && o.optionalTenantIdInBody) {
        methods.push(
          '      if (envelope.body && (envelope.body.tenantId === undefined || envelope.body.tenantId === null)) {'
        );
        methods.push(
          "        envelope.body.tenantId = this._config.defaultTenantId;"
        );
        methods.push(
          "        this._log.trace(() => ['tenant.default.inject', { op: '" + o.originalOpId + "', tenant: this._config.defaultTenantId }]);"
        );
        methods.push('      }');
      }
      // Request validation against full envelope schema
      methods.push(`      if (this._validation.settings.req !== 'none') {`);
      methods.push(
        `        const maybe = await this._validation.gateRequest('${o.originalOpId}', Schemas.z${o.opId.charAt(0).toUpperCase() + o.opId.slice(1)}Data, envelope);`
      );
      methods.push(`        if (this._validation.settings.req === 'strict') envelope = maybe;`);
      methods.push('      }');
      // Build options for SDK call
      methods.push('      const opts: any = { client: this._client, signal };');
      if (o.pathParams.length) methods.push('      if (envelope.path) opts.path = envelope.path;');
      if (o.queryParams.length)
        methods.push('      if (envelope.query) opts.query = envelope.query;');
      if (o.hasBody)
        methods.push('      if (envelope.body !== undefined) opts.body = envelope.body;');
      methods.push(`      const call = async () => {`);
      methods.push(`        const r = await Sdk.${o.opId}(opts);`);
      methods.push('        let data = (r as any)?.data;');
      methods.push('        if (data === undefined) data = r;');
      methods.push(
        `        const _respSchemaName = 'z${o.opId.charAt(0).toUpperCase() + o.opId.slice(1)}Response';`
      );
      methods.push('        if (this._isVoidResponse(_respSchemaName)) {');
      methods.push('          data = undefined;');
      methods.push('        }');
      // Response validation (guarded) occurs BEFORE any enrichment so fanatical mode sees raw spec shape
      const respName = `z${o.opId.charAt(0).toUpperCase() + o.opId.slice(1)}Response`;
      if (availableResponses.has(respName)) {
        methods.push("        if (this._validation.settings.res !== 'none') {");
        methods.push(`          const _schema = Schemas.${respName};`);
        methods.push('          if (_schema) {');
        methods.push(
          `            const maybeR = await this._validation.gateResponse('${o.originalOpId}', _schema, data);`
        );
        methods.push("            if (this._validation.settings.res === 'strict') data = maybeR;");
        methods.push('          }');
        methods.push('        }');
      }
      if (o.opId === 'createDeployment') {
        methods.push('        // Enrich deployment response AFTER validation to avoid fanatical extras errors');
        methods.push('        if (data) {');
        methods.push('          const base = data as _DataOf<typeof Sdk.createDeployment>;');
        methods.push(
          '          const ext: ExtendedDeploymentResult = { ...base, processes: [], decisions: [], decisionRequirements: [], forms: [], resources: [] };'
        );
        methods.push('          if (Array.isArray(base.deployments)) {');
        methods.push('            for (const d of base.deployments) {');
        methods.push('              if (d?.processDefinition) ext.processes.push(d.processDefinition);');
        methods.push('              if (d?.decisionDefinition) ext.decisions.push(d.decisionDefinition);');
        methods.push('              if (d?.decisionRequirements) ext.decisionRequirements.push(d.decisionRequirements);');
        methods.push('              if (d?.form) ext.forms.push(d.form);');
        methods.push('              if (d?.resource) ext.resources.push(d.resource);');
        methods.push('            }');
        methods.push('          }');
        methods.push('          data = ext;');
        methods.push('        }');
      }
      methods.push('        return data;');
      methods.push('      };');
      if (o.eventual) {
        methods.push('      const invoke = () => toCancelable(()=>call());');
        methods.push(
          `      if (useConsistency) return eventualPoll('${o.originalOpId}', ${o.verb === 'get'}, invoke, { ...useConsistency, logger: (this as any)._log });`
        );
        methods.push('      return invoke();');
      } else {
        methods.push('      return call();');
      }
    } else {
      // No-input operation
      methods.push('      const opts: any = { client: this._client, signal };');
      methods.push('      const call = async () => {');
      methods.push(`        const r = await Sdk.${o.opId}(opts as any);`);
      methods.push('        let data = (r as any)?.data;');
      methods.push('        if (data === undefined) data = r;');
      methods.push(
        `        const _respSchemaName = 'z${o.opId.charAt(0).toUpperCase() + o.opId.slice(1)}Response';`
      );
      methods.push('        if (this._isVoidResponse(_respSchemaName)) {');
      methods.push('          data = undefined;');
      methods.push('        }');
      const respName2 = `z${o.opId.charAt(0).toUpperCase() + o.opId.slice(1)}Response`;
      if (availableResponses.has(respName2)) {
        methods.push("        if (this._validation.settings.res !== 'none') {");
        methods.push(`          const _schema = Schemas.${respName2};`);
        methods.push('          if (_schema) {');
        methods.push(
          `            const maybeR = await this._validation.gateResponse('${o.originalOpId}', _schema, data);`
        );
        methods.push("            if (this._validation.settings.res === 'strict') data = maybeR;");
        methods.push('          }');
        methods.push('        }');
      }
      methods.push('        return data;');
      methods.push('      };');
      if (o.eventual) {
        methods.push('      const invoke = () => toCancelable(()=>call());');
        methods.push(
          `      if (useConsistency) return eventualPoll('${o.originalOpId}', true, invoke, { ...useConsistency, logger: (this as any)._log });`
        );
        methods.push('      return invoke();');
      } else {
        methods.push('      return call();');
      }
    }
    methods.push('    });');
    methods.push('  }');
    methods.push('');
  }

  const banner = '// @generated from CamundaClient.template.ts - DO NOT EDIT DIRECTLY\n';
  const withTypes =
    tpl.slice(0, tS + MARK_TYPES_START.length) + '\n' + support.join('\n') + '\n' + tpl.slice(tE);
  const w2S = withTypes.indexOf(MARK_METHODS_START);
  const w2E = withTypes.indexOf(MARK_METHODS_END);
  let finalSrc =
    banner +
    withTypes.slice(0, w2S + MARK_METHODS_START.length) +
    '\n' +
    methods.join('\n') +
    '\n' +
    withTypes.slice(w2E);
  // Strip template-only @ts-ignore annotations (we keep them in template for DX, but don't ship them)
  finalSrc = finalSrc.replace(/\n[^\n]*@ts-ignore[^\n]*\n/g, () => '\n');
  // Strip any template hint comments (// TEMPLATE: ...)
  finalSrc = finalSrc.replace(/^\/\/ TEMPLATE:.*(?:\r?\n|$)/gm, '');
  fs.writeFileSync(CLASS_FILE, finalSrc, 'utf8');
  // Regression gate: forbid usage of private Zod internals '_def?.typeName'
  if (/_def\?\.typeName/.test(finalSrc)) {
    console.error(
      '[class-gen][FAIL] Detected forbidden pattern _def?.typeName in generated output.'
    );
    process.exit(1);
  }
  console.log(`[class-gen] Wrote Camunda.ts with ${ops.length} methods`);
}

// Resolve a schema (follows single $ref into components/schemas)
function resolveSchema(s: any, spec: OA3Spec): OA3Schema | undefined {
  if (!s) return undefined;
  if (s.$ref && typeof s.$ref === 'string') {
    const parts = s.$ref.split('/');
    const name = parts[parts.length - 1];
    return spec.components?.schemas?.[name];
  }
  return s as OA3Schema;
}

function hasOptionalTenantId(schema: OA3Schema): boolean {
  if (!schema || schema.type !== 'object') return false;
  if (!schema.properties || !schema.properties['tenantId']) return false;
  const required = schema.required || [];
  return !required.includes('tenantId');
}

function hasJsonLike(rb: OA3RequestBody): boolean {
  return (
    !!rb?.content && Object.keys(rb.content).some((k) => /json|octet|multipart|text\//i.test(k))
  );
}
function sanitize(id: string): string {
  return id.replace(/XML/g, 'Xml');
}
function forwardJsDoc(op: any, docs: Record<string, string>): string {
  const base = docs[op.opId];
  if (base) {
    const inj: string[] = [];
    inj.push(' *');
    inj.push(` * @operationId ${op.originalOpId}`);
    if (op.tags?.length) inj.push(` * @tags ${op.tags.join(', ')}`);
    return base.replace(/\*\/$/, inj.join('\n') + '\n */');
  }
  return buildJsDoc(op);
}
function buildJsDoc(op: {
  summary?: string;
  description?: string;
  originalOpId: string;
  tags?: string[];
}) {
  const parts: string[] = [];
  if (op.summary) parts.push(op.summary);
  if (op.description) parts.push(...String(op.description).split(/\r?\n/));
  parts.push(`@operationId ${op.originalOpId}`);
  if (op.tags?.length) parts.push(`@tags ${op.tags.join(', ')}`);
  return '/**\n' + parts.map((l) => ' * ' + l.replace(/\*/g, '')).join('\n') + '\n */';
}
function indent(s: string, d: number) {
  const pad = ' '.repeat(d);
  return s
    .split('\n')
    .map((l) => pad + l)
    .join('\n');
}

main();
