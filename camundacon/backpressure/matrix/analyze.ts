#!/usr/bin/env tsx
/**
 * Matrix Benchmark — Post-hoc Analysis
 *
 * Reads results.json and produces detailed comparisons:
 *   - REST Balanced vs REST Disabled (backpressure benefit)
 *   - REST Balanced vs gRPC Stream (protocol comparison)
 *   - Per-scale, per-isolation, per-handler breakdowns
 *   - Win/tie/loss tallies
 *
 * Usage:
 *   tsx camundacon/backpressure/matrix/analyze.ts [results-dir]
 *   tsx camundacon/backpressure/matrix/analyze.ts ./camundacon/backpressure/matrix/results
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// ─── Types ───────────────────────────────────────────────
interface RunResult {
  sdkMode: string;
  handlerType: string;
  numClients: number;
  isolation: string;
  targetTotal: number;
  totalCompleted: number;
  totalErrors: number;
  totalQueueFull: number;
  wallClockS: number;
  throughput: number;
  jainFairness: number;
  status: string;
  rawOutputFile: string;
}

// ─── Helpers ─────────────────────────────────────────────
function resultLabel(r: RunResult): string {
  const iso = r.isolation === 'independent' ? 'ind' : 'shr';
  return `${r.numClients}c-${r.sdkMode}-${r.handlerType}-${iso}`;
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function pctDelta(a: number, b: number): string {
  if (b === 0) return a > 0 ? '+∞' : '0.0';
  const pct = ((a - b) / b) * 100;
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
}

type WinTieLoss = { wins: number; ties: number; losses: number };

function classify(aVal: number, bVal: number, threshold = 0.02): 'win' | 'tie' | 'loss' {
  const delta = bVal > 0 ? (aVal - bVal) / bVal : 0;
  if (delta > threshold) return 'win';
  if (delta < -threshold) return 'loss';
  return 'tie';
}

// ─── Main analysis ───────────────────────────────────────
function analyze(resultsDir: string) {
  const jsonPath = path.join(resultsDir, 'results.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`Results file not found: ${jsonPath}`);
    process.exit(1);
  }

  const allResults: RunResult[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const ok = allResults.filter((r) => r.status === 'ok');

  if (ok.length === 0) {
    console.error('No successful runs found in results.');
    process.exit(1);
  }

  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║   JS SDK Matrix Analysis                                    ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log(
    `  Total results: ${allResults.length} (${ok.length} ok, ${allResults.length - ok.length} failed)`
  );
  console.log('');

  // ═══ 1. Backpressure Benefit: Balanced vs Disabled ═══
  console.log('═══════════════════════════════════════════════════');
  console.log('  1. REST Balanced vs REST Disabled (BP benefit)');
  console.log('═══════════════════════════════════════════════════');

  const balanced = ok.filter((r) => r.sdkMode === 'rest-balanced');
  const disabled = ok.filter((r) => r.sdkMode === 'rest-disabled');

  if (balanced.length > 0 && disabled.length > 0) {
    const bpWtl: WinTieLoss = { wins: 0, ties: 0, losses: 0 };

    console.log(
      '\n  Config                      │ Disabled     │ Balanced     │ Δ Thrpt    │ Δ Errors │ Winner'
    );
    console.log(
      '  ────────────────────────────┼──────────────┼──────────────┼────────────┼──────────┼────────'
    );

    for (const nc of [...new Set(ok.map((r) => r.numClients))].sort()) {
      for (const handler of [...new Set(ok.map((r) => r.handlerType))]) {
        for (const iso of [...new Set(ok.map((r) => r.isolation))]) {
          const b = balanced.find(
            (r) => r.numClients === nc && r.handlerType === handler && r.isolation === iso
          );
          const d = disabled.find(
            (r) => r.numClients === nc && r.handlerType === handler && r.isolation === iso
          );
          if (!b || !d) continue;

          const isoShort = iso === 'independent' ? 'ind' : 'shr';
          const label = `${nc}c-${handler}-${isoShort}`.padEnd(28);
          const dStr = `${d.throughput.toFixed(1)}/s ${d.totalErrors}e`.padEnd(12);
          const bStr = `${b.throughput.toFixed(1)}/s ${b.totalErrors}e`.padEnd(12);
          const thrptDelta = pctDelta(b.throughput, d.throughput).padEnd(10);
          const errDelta = String(b.totalErrors - d.totalErrors).padEnd(8);

          // Winner: prefer fewer errors, then higher throughput
          let winner: string;
          if (b.totalErrors < d.totalErrors) {
            winner = 'BALANCED';
            bpWtl.wins++;
          } else if (d.totalErrors < b.totalErrors) {
            winner = 'DISABLED';
            bpWtl.losses++;
          } else {
            const wt = classify(b.throughput, d.throughput);
            if (wt === 'win') {
              winner = 'BALANCED';
              bpWtl.wins++;
            } else if (wt === 'loss') {
              winner = 'DISABLED';
              bpWtl.losses++;
            } else {
              winner = 'Tie';
              bpWtl.ties++;
            }
          }

          console.log(`  ${label}│ ${dStr} │ ${bStr} │ ${thrptDelta} │ ${errDelta} │ ${winner}`);
        }
      }
    }

    const bAvgTp = avg(balanced.map((r) => r.throughput));
    const dAvgTp = avg(disabled.map((r) => r.throughput));
    const bTotalErr = balanced.reduce((s, r) => s + r.totalErrors, 0);
    const dTotalErr = disabled.reduce((s, r) => s + r.totalErrors, 0);

    console.log('\n  Summary:');
    console.log(`    Balanced avg throughput: ${bAvgTp.toFixed(1)}/s`);
    console.log(
      `    Disabled avg throughput: ${dAvgTp.toFixed(1)}/s (${pctDelta(bAvgTp, dAvgTp)})`
    );
    console.log(`    Balanced total errors: ${bTotalErr}`);
    console.log(`    Disabled total errors: ${dTotalErr} (${pctDelta(bTotalErr, dTotalErr)})`);
    console.log(`    Win/Tie/Loss: ${bpWtl.wins}/${bpWtl.ties}/${bpWtl.losses}`);
  }

  // ═══ 2. Protocol Comparison: REST Balanced vs gRPC ═══
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  2. REST Balanced vs gRPC Stream');
  console.log('═══════════════════════════════════════════════════');

  const grpc = ok.filter((r) => r.sdkMode === 'grpc-stream');

  if (balanced.length > 0 && grpc.length > 0) {
    const protoWtl: WinTieLoss = { wins: 0, ties: 0, losses: 0 };

    console.log(
      '\n  Config                      │ REST Bal     │ gRPC Stream  │ Δ Thrpt    │ Δ Errors │ Winner'
    );
    console.log(
      '  ────────────────────────────┼──────────────┼──────────────┼────────────┼──────────┼────────'
    );

    for (const nc of [...new Set(ok.map((r) => r.numClients))].sort()) {
      for (const handler of [...new Set(ok.map((r) => r.handlerType))]) {
        for (const iso of [...new Set(ok.map((r) => r.isolation))]) {
          const b = balanced.find(
            (r) => r.numClients === nc && r.handlerType === handler && r.isolation === iso
          );
          const g = grpc.find(
            (r) => r.numClients === nc && r.handlerType === handler && r.isolation === iso
          );
          if (!b || !g) continue;

          const isoShort = iso === 'independent' ? 'ind' : 'shr';
          const label = `${nc}c-${handler}-${isoShort}`.padEnd(28);
          const bStr = `${b.throughput.toFixed(1)}/s ${b.totalErrors}e`.padEnd(12);
          const gStr = `${g.throughput.toFixed(1)}/s ${g.totalErrors}e`.padEnd(12);
          const thrptDelta = pctDelta(b.throughput, g.throughput).padEnd(10);
          const errDelta = String(b.totalErrors - g.totalErrors).padEnd(8);

          let winner: string;
          if (b.totalErrors < g.totalErrors) {
            winner = 'REST';
            protoWtl.wins++;
          } else if (g.totalErrors < b.totalErrors) {
            winner = 'gRPC';
            protoWtl.losses++;
          } else {
            const wt = classify(b.throughput, g.throughput);
            if (wt === 'win') {
              winner = 'REST';
              protoWtl.wins++;
            } else if (wt === 'loss') {
              winner = 'gRPC';
              protoWtl.losses++;
            } else {
              winner = 'Tie';
              protoWtl.ties++;
            }
          }

          console.log(`  ${label}│ ${bStr} │ ${gStr} │ ${thrptDelta} │ ${errDelta} │ ${winner}`);
        }
      }
    }

    const bAvgTp = avg(balanced.map((r) => r.throughput));
    const gAvgTp = avg(grpc.map((r) => r.throughput));
    const bTotalErr = balanced.reduce((s, r) => s + r.totalErrors, 0);
    const gTotalErr = grpc.reduce((s, r) => s + r.totalErrors, 0);

    console.log('\n  Summary:');
    console.log(`    REST Balanced avg throughput: ${bAvgTp.toFixed(1)}/s`);
    console.log(
      `    gRPC Stream avg throughput:   ${gAvgTp.toFixed(1)}/s (${pctDelta(gAvgTp, bAvgTp)} vs REST)`
    );
    console.log(`    REST Balanced total errors:   ${bTotalErr}`);
    console.log(`    gRPC Stream total errors:     ${gTotalErr}`);
    console.log(
      `    Win/Tie/Loss (REST perspective): ${protoWtl.wins}/${protoWtl.ties}/${protoWtl.losses}`
    );
  }

  // ═══ 3. Breakdowns ═══
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  3. Breakdowns');
  console.log('═══════════════════════════════════════════════════');

  // By scale
  console.log('\n  By Scale:');
  for (const nc of [...new Set(ok.map((r) => r.numClients))].sort()) {
    const subset = ok.filter((r) => r.numClients === nc);
    for (const mode of ['rest-disabled', 'rest-balanced', 'grpc-stream']) {
      const modeSubset = subset.filter((r) => r.sdkMode === mode);
      if (modeSubset.length === 0) continue;
      const avgTp = avg(modeSubset.map((r) => r.throughput));
      const totalErr = modeSubset.reduce((s, r) => s + r.totalErrors, 0);
      console.log(`    ${nc}c ${mode.padEnd(15)}: ${avgTp.toFixed(1)}/s, ${totalErr} errors`);
    }
  }

  // By handler
  console.log('\n  By Handler:');
  for (const handler of [...new Set(ok.map((r) => r.handlerType))]) {
    const subset = ok.filter((r) => r.handlerType === handler);
    for (const mode of ['rest-disabled', 'rest-balanced', 'grpc-stream']) {
      const modeSubset = subset.filter((r) => r.sdkMode === mode);
      if (modeSubset.length === 0) continue;
      const avgTp = avg(modeSubset.map((r) => r.throughput));
      const totalErr = modeSubset.reduce((s, r) => s + r.totalErrors, 0);
      console.log(
        `    ${handler.padEnd(5)} ${mode.padEnd(15)}: ${avgTp.toFixed(1)}/s, ${totalErr} errors`
      );
    }
  }

  // By isolation
  console.log('\n  By Isolation:');
  for (const iso of [...new Set(ok.map((r) => r.isolation))]) {
    const subset = ok.filter((r) => r.isolation === iso);
    for (const mode of ['rest-disabled', 'rest-balanced', 'grpc-stream']) {
      const modeSubset = subset.filter((r) => r.sdkMode === mode);
      if (modeSubset.length === 0) continue;
      const avgTp = avg(modeSubset.map((r) => r.throughput));
      const totalErr = modeSubset.reduce((s, r) => s + r.totalErrors, 0);
      const isoShort = iso === 'independent' ? 'ind' : 'shr';
      console.log(
        `    ${isoShort.padEnd(4)} ${mode.padEnd(15)}: ${avgTp.toFixed(1)}/s, ${totalErr} errors`
      );
    }
  }

  // ═══ 4. Grand Summary ═══
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  4. Grand Summary');
  console.log('═══════════════════════════════════════════════════');

  for (const mode of ['rest-disabled', 'rest-balanced', 'grpc-stream']) {
    const modeOk = ok.filter((r) => r.sdkMode === mode);
    if (modeOk.length === 0) continue;
    const avgTp = avg(modeOk.map((r) => r.throughput));
    const totalCompleted = modeOk.reduce((s, r) => s + r.totalCompleted, 0);
    const totalErr = modeOk.reduce((s, r) => s + r.totalErrors, 0);
    console.log(`\n  ${mode}:`);
    console.log(`    Configs:    ${modeOk.length}`);
    console.log(`    Completed:  ${totalCompleted}`);
    console.log(`    Errors:     ${totalErr}`);
    console.log(`    Avg thrpt:  ${avgTp.toFixed(1)}/s`);
  }

  console.log('');
}

// ─── Run ─────────────────────────────────────────────────
const dir = process.argv[2] || path.join(import.meta.dirname, 'results');
analyze(dir);
