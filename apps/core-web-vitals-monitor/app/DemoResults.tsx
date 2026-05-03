'use client';

export function DemoResults() {
  return (
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
  );
}
