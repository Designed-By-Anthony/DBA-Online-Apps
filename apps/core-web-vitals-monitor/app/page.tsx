'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';

type Snapshot = {
  id: string;
  date: string;
  url: string;
  performance: number;
  lcpMs: number;
  cls: number;
  inpMs: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
};

function asScore(value: unknown): number {
  return Math.round((Number(value) || 0) * 100);
}

function scoreClass(score: number): 'good' | 'ok' | 'poor' {
  if (score >= 90) return 'good';
  if (score >= 50) return 'ok';
  return 'poor';
}

function metricBadgeClass(metric: 'lcp' | 'cls' | 'inp', value: number): string {
  if (metric === 'lcp') {
    if (value < 2500) return 'score-badge score-badge--good';
    if (value < 4000) return 'score-badge score-badge--ok';
    return 'score-badge score-badge--poor';
  }

  if (metric === 'cls') {
    if (value < 0.1) return 'score-badge score-badge--good';
    if (value < 0.25) return 'score-badge score-badge--ok';
    return 'score-badge score-badge--poor';
  }

  if (value < 200) return 'score-badge score-badge--good';
  if (value < 500) return 'score-badge score-badge--ok';
  return 'score-badge score-badge--poor';
}

export default function Home() {
  const [url, setUrl] = useState('https://example.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Snapshot | null>(null);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  const runTest = async () => {
    const input = url.trim();
    if (!input) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
          input,
        )}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo`,
      );

      if (!response.ok) {
        throw new Error(`PSI request failed with status ${response.status}`);
      }

      const data = await response.json();
      const lighthouse = data?.lighthouseResult;

      const next: Snapshot = {
        id: `${Date.now()}-${Math.round(Math.random() * 10000)}`,
        date: new Date().toLocaleString(),
        url: input,
        performance: asScore(lighthouse?.categories?.performance?.score),
        lcpMs: Number(lighthouse?.audits?.['largest-contentful-paint']?.numericValue || 0),
        cls: Number(lighthouse?.audits?.['cumulative-layout-shift']?.numericValue || 0),
        inpMs: Number(lighthouse?.audits?.['interaction-to-next-paint']?.numericValue || 0),
        accessibility: asScore(lighthouse?.categories?.accessibility?.score),
        bestPractices: asScore(lighthouse?.categories?.['best-practices']?.score),
        seo: asScore(lighthouse?.categories?.seo?.score),
      };

      setResult(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to run test right now.');
    } finally {
      setLoading(false);
    }
  };

  const saveSnapshot = () => {
    if (!result) return;
    setSnapshots((prev) => [result, ...prev]);
  };

  const perfClass = result ? scoreClass(result.performance) : 'ok';

  return (
    <>
      <div className="dba-topbar">
        <a className="dba-topbar-brand" href="https://designedbyanthony.com" target="_blank" rel="noreferrer">
          DBA
        </a>
        <span className="dba-topbar-sep">/</span>
        <span className="dba-topbar-name">Core Web Vitals Monitor</span>
      </div>

      <main
        className="product-shell"
        style={{ '--accent': '#0369a1', '--accent-soft': '#e0f2fe' } as CSSProperties}
      >
        <section className="hero">
          <div>
            <p className="eyebrow">Google-Style Speed Test</p>
            <h1>Test how fast your website loads.</h1>
            <p className="summary">The same way Google grades it for real users on mobile.</p>
          </div>
          <span className="status">Live PSI API</span>
        </section>

        <section className="workspace">
          <article className="panel">
            <div className="panel-heading">
              <p>Run Website Test</p>
              <span>One URL at a time</span>
            </div>
            <div className="tool-form">
              <label className="field">
                Website URL
                <input className="text-input" value={url} onChange={(e) => setUrl(e.target.value)} />
              </label>
              <div className="action-row">
                <button type="button" className="primary-button" onClick={runTest} disabled={loading}>
                  {loading ? 'Running Test...' : 'Run Test'}
                </button>
              </div>
              {error ? <p className="warning-note">{error}</p> : null}
            </div>
          </article>

          <article className="panel output-panel">
            <div className="panel-heading">
              <p>Results</p>
              <span>{result ? 'Ready' : 'Waiting for test'}</span>
            </div>

            {result ? (
              <div className="result-stack">
                <div className={`score-circle score-${perfClass}`}>
                  {result.performance}
                  <small>PERF</small>
                </div>

                <div className="metric-grid">
                  <span className={metricBadgeClass('lcp', result.lcpMs)}>LCP {(result.lcpMs / 1000).toFixed(1)}s</span>
                  <span className={metricBadgeClass('cls', result.cls)}>CLS {result.cls.toFixed(3)}</span>
                  <span className={metricBadgeClass('inp', result.inpMs)}>INP {Math.round(result.inpMs)}ms</span>
                </div>

                <div className="metric-grid">
                  <span>Accessibility: {result.accessibility}</span>
                  <span>Best Practices: {result.bestPractices}</span>
                  <span>SEO: {result.seo}</span>
                </div>

                <div className="action-row">
                  <button type="button" className="primary-button" onClick={saveSnapshot}>
                    Save Snapshot
                  </button>
                </div>

                <table className="audit-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>URL</th>
                      <th>Perf</th>
                      <th>LCP</th>
                      <th>CLS</th>
                      <th>INP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshots.map((snap) => (
                      <tr key={snap.id}>
                        <td>{snap.date}</td>
                        <td>{snap.url}</td>
                        <td>{snap.performance}</td>
                        <td>{(snap.lcpMs / 1000).toFixed(1)}s</td>
                        <td>{snap.cls.toFixed(3)}</td>
                        <td>{Math.round(snap.inpMs)}ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {snapshots.length === 0 ? <p className="muted-note">No snapshots yet.</p> : null}
              </div>
            ) : (
              <p className="muted-note">Run a test to see your performance grades.</p>
            )}
          </article>
        </section>
      </main>

      <footer className="dba-footer">
        <div className="dba-footer-inner">
          <p>
            <strong>Designed by Anthony</strong> tools built for real client work.
          </p>
          <a className="dba-footer-link" href="https://designedbyanthony.online" target="_blank" rel="noreferrer">
            designedbyanthony.online
          </a>
        </div>
      </footer>
    </>
  );
}
