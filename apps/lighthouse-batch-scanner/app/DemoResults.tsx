'use client';

const DEMO_ROWS = [
  { url: 'https://example.com', performance: 92, accessibility: 98, bestPractices: 95, seo: 100 },
  {
    url: 'https://store.example.com',
    performance: 67,
    accessibility: 85,
    bestPractices: 78,
    seo: 91,
  },
  {
    url: 'https://blog.example.com',
    performance: 44,
    accessibility: 72,
    bestPractices: 83,
    seo: 88,
  },
];

function scoreClass(score: number): string {
  if (score >= 90) return 'score-badge score-badge--good';
  if (score >= 50) return 'score-badge score-badge--ok';
  return 'score-badge score-badge--poor';
}

export function DemoResults() {
  return (
    <main
      className="product-shell"
      style={{ '--accent': '#0369a1', '--accent-soft': '#e0f2fe' } as React.CSSProperties}
    >
      <section className="hero">
        <div>
          <p className="eyebrow">Demo — Batch Website Grading</p>
          <h1>Sample scan of 3 URLs</h1>
          <p className="summary">
            Below is what a real scan looks like using Google PageSpeed Insights.
          </p>
        </div>
        <span className="status">Demo Data</span>
      </section>

      <section className="workspace">
        <article className="panel output-panel" style={{ gridColumn: '1 / -1' }}>
          <div className="panel-heading">
            <p>Scan Results</p>
            <span>3 completed</span>
          </div>
          <table className="audit-table">
            <thead>
              <tr>
                <th>URL</th>
                <th>Performance</th>
                <th>Accessibility</th>
                <th>Best Practices</th>
                <th>SEO</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_ROWS.map((row) => (
                <tr key={row.url}>
                  <td className="url-cell">{row.url}</td>
                  <td>
                    <span className={scoreClass(row.performance)}>{row.performance}</span>
                  </td>
                  <td>
                    <span className={scoreClass(row.accessibility)}>{row.accessibility}</span>
                  </td>
                  <td>
                    <span className={scoreClass(row.bestPractices)}>{row.bestPractices}</span>
                  </td>
                  <td>
                    <span className={scoreClass(row.seo)}>{row.seo}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </main>
  );
}
