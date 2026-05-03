'use client';

import type { CSSProperties } from 'react';

const DEMO_CHECKS = [
  { label: 'Business name is filled in', pass: true },
  { label: 'Phone number is filled in', pass: true },
  { label: 'Address is filled in', pass: true },
  { label: 'Website URL is filled in', pass: true },
  { label: 'Google Business Profile is active', pass: true },
  { label: 'Address is listed consistently online', pass: false },
  { label: 'You have at least 5 Google reviews', pass: false },
];

const DEMO_RECS = [
  'Match your business name, address, and phone across all directories.',
  'Request reviews from recent customers to build authority.',
];

export function DemoResults() {
  const passed = DEMO_CHECKS.filter((c) => c.pass).length;
  const score = Math.round((passed / DEMO_CHECKS.length) * 100);

  return (
    <main
      className="product-shell"
      style={{ '--accent': '#0369a1', '--accent-soft': '#e0f2fe' } as CSSProperties}
    >
      <section className="hero">
        <div>
          <p className="eyebrow">Demo — Local Search Checklist</p>
          <h1>Sample audit for &quot;Mohawk Valley HVAC&quot;</h1>
          <p className="summary">A quick checklist for local visibility and trust.</p>
        </div>
        <span className="status">Demo Data</span>
      </section>

      <section className="workspace">
        <article className="panel output-panel" style={{ gridColumn: '1 / -1' }}>
          <div className="panel-heading">
            <p>Audit Result</p>
            <span>{score}/100</span>
          </div>
          <div className="result-stack">
            <div className="score-circle score-ok">
              {score}
              <small>SCORE</small>
            </div>
            <div>
              {DEMO_CHECKS.map((item) => (
                <div className="check-row-result" key={item.label}>
                  <span className="check-icon">{item.pass ? '\u2705' : '\u274C'}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <div>
              <strong>Recommendations</strong>
              <ul className="list">
                {DEMO_RECS.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
