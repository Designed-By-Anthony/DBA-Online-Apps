'use client';

import type { CSSProperties } from 'react';

export function DemoResults() {
  return (
    <main
      className="product-shell"
      style={{ '--accent': '#0369a1', '--accent-soft': '#e0f2fe' } as CSSProperties}
    >
      <section className="hero">
        <div>
          <p className="eyebrow">Demo — Google-Style Speed Test</p>
          <h1>Sample test for example.com</h1>
          <p className="summary">The same way Google grades it for real users on mobile.</p>
        </div>
        <span className="status">Demo Data</span>
      </section>

      <section className="workspace">
        <article className="panel output-panel" style={{ gridColumn: '1 / -1' }}>
          <div className="panel-heading">
            <p>Results</p>
            <span>Ready</span>
          </div>
          <div className="result-stack">
            <div className="score-circle score-good">
              92
              <small>PERF</small>
            </div>
            <div className="metric-grid">
              <span className="score-badge score-badge--good">LCP 1.2s</span>
              <span className="score-badge score-badge--good">CLS 0.028</span>
              <span className="score-badge score-badge--good">INP 95ms</span>
            </div>
            <div className="metric-grid">
              <span>Accessibility: 98</span>
              <span>Best Practices: 95</span>
              <span>SEO: 100</span>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
