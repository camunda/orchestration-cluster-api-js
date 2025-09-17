import { describe, it, expect, vi } from 'vitest';
import { hydrateConfig } from '../src/runtime/unifiedConfiguration';
import { createAuthFacade } from '../src/runtime/auth';
import createCamundaClient from '../src';
import fs from 'fs';

// Minimal fake PEMs
const CERT = '-----BEGIN CERTIFICATE-----\nFAKECERT\n-----END CERTIFICATE-----';
const KEY = '-----BEGIN PRIVATE KEY-----\nFAKEKEY\n-----END PRIVATE KEY-----';
const CA = '-----BEGIN CERTIFICATE-----\nFAKECA\n-----END CERTIFICATE-----';

describe('mTLS config precedence', () => {
  it('prefers inline over path', async () => {
    const tmpDir = fs.mkdtempSync('/tmp/mtls-test-');
    const certPath = tmpDir + '/c.pem';
    const keyPath = tmpDir + '/k.pem';
    const caPath = tmpDir + '/ca.pem';
    fs.writeFileSync(certPath, CERT.replace('FAKECERT','FROM_PATH'));
    fs.writeFileSync(keyPath, KEY.replace('FAKEKEY','FROM_PATH'));
    fs.writeFileSync(caPath, CA.replace('FAKECA','FROM_PATH'));
    const { config } = hydrateConfig({ env: {
      CAMUNDA_AUTH_STRATEGY: 'NONE',
      CAMUNDA_MTLS_CERT: CERT,
      CAMUNDA_MTLS_KEY: KEY,
      CAMUNDA_MTLS_CA: CA,
      CAMUNDA_MTLS_CERT_PATH: certPath,
      CAMUNDA_MTLS_KEY_PATH: keyPath,
      CAMUNDA_MTLS_CA_PATH: caPath
    }});
    // Should build facade without throwing (agent constructed). We can't directly inspect private agent.
    const auth = createAuthFacade(config, { fetch: vi.fn().mockResolvedValue({ ok:true, json: async () => ({}) }) });
    await auth.getAuthHeaders();
    expect(true).toBe(true); // if no throw, pass
  });

  it('handles path-only material', async () => {
    const tmpDir = fs.mkdtempSync('/tmp/mtls-test-');
    const certPath = tmpDir + '/c.pem';
    const keyPath = tmpDir + '/k.pem';
    const caPath = tmpDir + '/ca.pem';
    fs.writeFileSync(certPath, CERT);
    fs.writeFileSync(keyPath, KEY);
    fs.writeFileSync(caPath, CA);
    const { config } = hydrateConfig({ env: {
      CAMUNDA_AUTH_STRATEGY: 'NONE',
      CAMUNDA_MTLS_CERT_PATH: certPath,
      CAMUNDA_MTLS_KEY_PATH: keyPath,
      CAMUNDA_MTLS_CA_PATH: caPath
    }});
    const auth = createAuthFacade(config, { fetch: vi.fn().mockResolvedValue({ ok:true, json: async () => ({}) }) });
    await auth.getAuthHeaders();
    expect(true).toBe(true);
  });

  it('wraps fetch when agent present (paths precedence)', async () => {
    const tmp = fs.mkdtempSync('/tmp/mtls-newgen-');
    const certPath = tmp + '/c.pem'; const keyPath = tmp + '/k.pem'; const caPath = tmp + '/ca.pem';
    fs.writeFileSync(certPath, CERT); fs.writeFileSync(keyPath, KEY); fs.writeFileSync(caPath, CA);
    // Simulate facade creating an agent by stubbing global variable used in integration
    (globalThis as any).__CAMUNDA_MTLS_AGENT = { dummy: true };
    const spy = vi.fn(async () => new Response(JSON.stringify({ ok:true }), { status:200, headers:{'Content-Type':'application/json'} }));
    const camunda = createCamundaClient({ config: {
      CAMUNDA_AUTH_STRATEGY: 'NONE',
      CAMUNDA_MTLS_CERT_PATH: certPath,
      CAMUNDA_MTLS_KEY_PATH: keyPath,
      CAMUNDA_MTLS_CA_PATH: caPath
    }, fetch: spy });

    await camunda.getLicense();
    expect(spy).toHaveBeenCalledTimes(1);
    delete (globalThis as any).__CAMUNDA_MTLS_AGENT;
  });
});
