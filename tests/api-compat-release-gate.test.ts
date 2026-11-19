/*
 * Guards the stable-branch release gate (scripts/api-compat-release-gate.sh) and its
 * approval search (scripts/api-break-approvals.sh) against approving a break they should
 * not: an api-break-approved label counts only on a PR merged into the release branch
 * after the published tag, on a history that descends from it, and only covers the API up
 * to that PR's merge. The approved revision is built without the release job's credentials.
 *
 * Real git; npm and gh are stubs. The npm stub logs to $HOME because the approved build runs
 * under `env -i`, which keeps only PATH and HOME.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const SCRIPTS = path.resolve(__dirname, '..', 'scripts');
const hasJq = spawnSync('jq', ['--version']).status === 0;

let tmp: string;
let repo: string;
let shas: Record<'before' | 'first' | 'second', string>;

function git(...args: string[]): string {
  return execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], {
    cwd: repo,
    encoding: 'utf8',
  }).trim();
}

function write(file: string, body: string) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body, { mode: 0o755 });
}

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'api-compat-gate-'));
  repo = path.join(tmp, 'repo');
  fs.mkdirSync(repo);
  git('init', '-q');
  const commits: Partial<typeof shas> = {};
  for (const name of ['before', 'first', 'second'] as const) {
    fs.writeFileSync(path.join(repo, 'marker'), name);
    fs.writeFileSync(path.join(repo, 'package.json'), `{"version":"${name}"}`);
    git('add', 'marker', 'package.json');
    git('commit', '-q', '-m', name);
    commits[name] = git('rev-parse', 'HEAD');
    if (name === 'before') git('tag', 'v10.0.0');
  }
  shas = commits as typeof shas;
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

function pr(number: number, base: string, mergeSha: string | null, labelled = true) {
  return {
    number,
    merged_at: mergeSha ? '2026-01-01T00:00:00Z' : null,
    merge_commit_sha: mergeSha,
    base: { ref: base },
    labels: labelled ? [{ name: 'api-break-approved' }] : [],
  };
}

describe.skipIf(!hasJq)('api-break-approvals.sh', () => {
  // `gh api repos/<r>/commits/<sha>/pulls --jq <filter>`, answered from $FIXTURES/<sha>.json.
  function search(byCommit: Record<string, unknown>) {
    const fixtures = path.join(tmp, 'pulls');
    fs.mkdirSync(fixtures, { recursive: true });
    for (const [sha, body] of Object.entries(byCommit)) {
      fs.writeFileSync(
        path.join(fixtures, `${sha}.json`),
        typeof body === 'string' ? body : JSON.stringify(body)
      );
    }
    write(
      path.join(tmp, 'bin', 'gh'),
      '#!/usr/bin/env bash\nset -euo pipefail\nsha="${2##*/commits/}"; sha="${sha%/pulls}"\n' +
        'f="$FIXTURES/$sha.json"; [ -f "$f" ] || { echo "[]"; exit 0; }\njq -r "$4" "$f"\n'
    );
    return spawnSync(
      'bash',
      [path.join(SCRIPTS, 'api-break-approvals.sh'), 'v10.0.0', 'stable/10'],
      {
        cwd: repo,
        encoding: 'utf8',
        env: {
          ...process.env,
          PATH: `${path.join(tmp, 'bin')}${path.delimiter}${process.env.PATH}`,
          FIXTURES: fixtures,
          GITHUB_REPOSITORY: 'o/r',
        },
      }
    );
  }

  function approvals(...prs: unknown[]): string[] {
    const r = search({ [shas.second]: prs });
    expect(r.status, r.stderr).toBe(0);
    return r.stdout.split('\n').filter(Boolean);
  }

  it('approves a labelled PR merged into the release branch', () => {
    expect(approvals(pr(1, 'stable/10', shas.second))).toEqual([`#1 ${shas.second}`]);
  });

  it.each([
    ['merged into another branch', () => pr(2, 'main', shas.second)],
    ['merged before the baseline', () => pr(3, 'stable/10', shas.before)],
    ['unlabelled', () => pr(4, 'stable/10', shas.second, false)],
    ['unmerged', () => pr(5, 'stable/10', null)],
  ])('ignores a PR %s', (_, record) => {
    expect(approvals(record())).toEqual([]);
  });

  it('ignores merges on a history that diverged before the published tag', () => {
    // A reset or recreated release branch: the published tag is not an ancestor of HEAD.
    const published = git('commit-tree', 'HEAD^{tree}', '-p', shas.before, '-m', 'published');
    git('tag', '-f', 'v10.0.0', published);
    expect(approvals(pr(8, 'stable/10', shas.second))).toEqual([]);
  });

  it('ignores a tag reached only through a second parent', () => {
    // A reset release branch that merged the published history back in: every later merge
    // descends from the tag, but none was made on the line the tag was released from.
    const published = git('commit-tree', 'HEAD^{tree}', '-p', shas.before, '-m', 'published');
    git('tag', '-f', 'v10.0.0', published);
    const merged = git('commit-tree', 'HEAD^{tree}', '-p', 'HEAD', '-p', published, '-m', 'merge');
    const approved = git('commit-tree', 'HEAD^{tree}', '-p', merged, '-m', 'labelled PR');
    git('reset', '-q', '--hard', approved);
    const r = search({ [approved]: [pr(9, 'stable/10', approved)] });
    expect([r.status, r.stdout], r.stderr).toEqual([0, '']);
  });

  it('lists the newest merge first', () => {
    const r = search({
      [shas.first]: [pr(6, 'stable/10', shas.first)],
      [shas.second]: [pr(7, 'stable/10', shas.second)],
    });
    expect(r.stdout.split('\n').filter(Boolean)).toEqual([`#7 ${shas.second}`, `#6 ${shas.first}`]);
  });

  it.each(['second', 'first'] as const)(
    'fails when the lookup for the %s commit fails',
    (broken) => {
      // The newest commit is looked up first; its failure must not be masked by later ones.
      expect(search({ [shas[broken]]: 'not json' }).status).not.toBe(0);
    }
  );
});

describe('api-compat-release-gate.sh', () => {
  let home: string;
  let baselines: string;

  beforeEach(() => {
    home = path.join(tmp, 'home');
    baselines = path.join(tmp, 'baselines');
    fs.mkdirSync(home);
    fs.mkdirSync(path.join(tmp, 'tmpdir'));
    fs.mkdirSync(path.join(tmp, 'scripts'));
    fs.copyFileSync(
      path.join(SCRIPTS, 'api-compat-release-gate.sh'),
      path.join(tmp, 'scripts', 'gate.sh')
    );
  });

  function gate(baseline: string, env: Record<string, string> = {}, mode: string[] = []) {
    fs.writeFileSync(path.join(home, 'calls'), '');
    write(
      path.join(tmp, 'scripts', 'api-break-approvals.sh'),
      '#!/usr/bin/env bash\necho "approvals $2" >> "$HOME/calls"\n[ -z "${APPROVALS_FAIL:-}" ] || exit 1\n' +
        '[ -z "${APPROVALS:-}" ] || printf "%s\\n" "$APPROVALS"\n'
    );
    write(
      path.join(tmp, 'bin', 'npm'),
      `#!/usr/bin/env bash
case "$*" in
  "run -s api-compat -- --baseline-version "*) echo release >> "$HOME/calls"; exit "$RC_RELEASE" ;;
  "run -s api-compat -- --baseline "*) echo "since $(cat "\${@: -1}/marker")" >> "$HOME/calls"; exit "$(cat "$HOME/rc_since")" ;;
  "ci "*) echo "ci $(cat marker) token=\${GH_TOKEN:-none} oidc=\${ACTIONS_ID_TOKEN_REQUEST_TOKEN:-none}" >> "$HOME/calls" ;;
  "run -s build:types") echo "build $(cat marker)" >> "$HOME/calls"; mkdir -p dist && cp marker dist/index.d.ts; [ ! -e "$HOME/fail_build" ] ;;
  *) exit 99 ;;
esac
`
    );
    fs.writeFileSync(path.join(home, 'rc_since'), env.RC_SINCE ?? '0');
    if (env.FAIL_BUILD) fs.writeFileSync(path.join(home, 'fail_build'), '');
    const r = spawnSync('bash', [path.join(tmp, 'scripts', 'gate.sh'), ...mode, baseline], {
      cwd: repo,
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: `${path.join(tmp, 'bin')}${path.delimiter}${process.env.PATH}`,
        HOME: home,
        TMPDIR: path.join(tmp, 'tmpdir'),
        API_COMPAT_BASELINES: baselines,
        GITHUB_REF_NAME: 'stable/10',
        GITHUB_REPOSITORY: 'o/r',
        GH_TOKEN: 'release-token',
        ACTIONS_ID_TOKEN_REQUEST_TOKEN: 'oidc-token',
        RC_RELEASE: '1',
        ...env,
      },
    });
    const calls = fs.readFileSync(path.join(home, 'calls'), 'utf8').split('\n').filter(Boolean);
    return { rc: r.status, out: r.stdout + r.stderr, calls };
  }

  it('passes a compatible release without searching for approvals', () => {
    const { rc, out, calls } = gate('10.0.0', { RC_RELEASE: '0', APPROVALS_FAIL: '1' });
    expect([rc, calls], out).toEqual([0, ['release']]);
  });

  it('treats a checker setup error as a setup error', () => {
    expect(gate('10.0.0', { RC_RELEASE: '2' }).rc).toBe(2);
  });

  it('fails as a setup error when the baseline has no tag', () => {
    const { rc, calls } = gate('10.0.1', { APPROVALS: `#1 ${shas.second}` });
    expect([rc, calls]).toEqual([2, []]);
  });

  it('passes a break approved by the manual-run input', () => {
    expect(gate('10.0.0', { DISPATCH_APPROVED: 'true' }).rc).toBe(0);
  });

  it('blocks an unapproved break', () => {
    const { rc, out } = gate('10.0.0');
    expect(rc).toBe(1);
    expect(out).toContain('Release blocked');
  });

  it('treats a failed approval search as a setup error', () => {
    expect(gate('10.0.0', { APPROVALS_FAIL: '1' }).rc).toBe(2);
  });

  const prepare = (env: Record<string, string>) => gate('10.0.0', env, ['--prepare']);
  // The prepare job's output for the merge whose marker file holds `name`.
  function stage(sha: string, name: string) {
    fs.mkdirSync(path.join(baselines, sha), { recursive: true });
    fs.writeFileSync(path.join(baselines, sha, 'package.json'), '{}');
    fs.writeFileSync(path.join(baselines, sha, 'marker'), name);
  }

  it('prepare builds the newest approved merge without credentials and stages its types', () => {
    const { rc, out, calls } = prepare({ APPROVALS: `#6 ${shas.first}` });
    expect([rc, calls], out).toEqual([
      0,
      ['approvals stable/10', 'ci first token=none oidc=none', 'build first'],
    ]);
    expect(fs.readdirSync(path.join(baselines, shas.first)).sort()).toEqual([
      'dist',
      'package.json',
    ]);
    expect(fs.readdirSync(path.join(tmp, 'tmpdir'))).toEqual([]);
  });

  it('prepare builds an approved merge at HEAD too', () => {
    // The publish job regenerates code before its check, so HEAD as committed is not what it publishes.
    const { rc, calls } = prepare({ APPROVALS: `#7 ${shas.second}` });
    expect([rc, calls]).toEqual([
      0,
      ['approvals stable/10', 'ci second token=none oidc=none', 'build second'],
    ]);
  });

  it('prepare stages nothing without an approval', () => {
    const { rc, calls } = prepare({});
    expect([rc, calls, fs.existsSync(baselines)]).toEqual([0, ['approvals stable/10'], false]);
  });

  it.each([
    ['build', { FAIL_BUILD: '1' }],
    ['approval search', { APPROVALS_FAIL: '1' }],
  ])('prepare treats a failed %s as a setup error', (_, env) => {
    expect(prepare({ APPROVALS: `#6 ${shas.first}`, ...env }).rc).toBe(2);
  });

  it('checks the release against the staged build of the newest approved merge, never building', () => {
    stage(shas.first, 'first');
    const { rc, out, calls } = gate('10.0.0', { APPROVALS: `#6 ${shas.first}` });
    expect([rc, calls], out).toEqual([0, ['release', 'approvals stable/10', 'since first']]);
  });

  it('blocks generated changes released at an approved HEAD', () => {
    stage(shas.second, 'second');
    const { rc, out, calls } = gate('10.0.0', { APPROVALS: `#7 ${shas.second}`, RC_SINCE: '1' });
    expect([rc, calls]).toEqual([1, ['release', 'approvals stable/10', 'since second']]);
    expect(out).toContain('added after #7');
  });

  it('blocks a break added after the newest approved merge', () => {
    stage(shas.first, 'first');
    const { rc, out } = gate('10.0.0', { APPROVALS: `#6 ${shas.first}`, RC_SINCE: '1' });
    expect(rc).toBe(1);
    expect(out).toContain('added after #6');
  });

  it.each([
    ['a comparison error', true, { RC_SINCE: '2' }],
    ['a missing staged build', false, {}],
  ])('treats %s as a setup error', (_, staged, env) => {
    if (staged) stage(shas.first, 'first');
    expect(gate('10.0.0', { APPROVALS: `#6 ${shas.first}`, ...env }).rc).toBe(2);
  });
});
