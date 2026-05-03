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
          <p className="eyebrow">Demo — Construction Calculator</p>
          <h1>Sample concrete slab estimate</h1>
          <p className="summary">Instant material calculations for contractors and field crews.</p>
        </div>
        <span className="status">Demo Data</span>
      </section>

      <section className="workspace">
        <article className="panel output-panel" style={{ gridColumn: '1 / -1' }}>
          <div className="panel-heading">
            <p>Concrete Slab — 20 ft &times; 30 ft &times; 4 in</p>
            <span>Estimate</span>
          </div>
          <div className="result-stack">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Concrete Volume</td>
                  <td>7.41</td>
                  <td>cubic yards</td>
                </tr>
                <tr>
                  <td>80 lb Bags (pre-mix)</td>
                  <td>124</td>
                  <td>bags</td>
                </tr>
                <tr>
                  <td>Estimated Cost</td>
                  <td>$965</td>
                  <td>at $130/yd</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  );
}
