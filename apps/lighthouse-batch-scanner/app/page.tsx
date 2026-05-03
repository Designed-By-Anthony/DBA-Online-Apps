'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';

type ScanResult = {
  url: string;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
};

function scoreClass(score: number): string {
  if (score >= 90) return 'score-badge score-badge--good';
  if (score >= 50) return 'score-badge score-badge--ok';
  return 'score-badge score-badge--poor';
}

function asScore(value: unknown): number {
  return Math.round((Number(value) || 0) * 100);
}

export default function Home() {
  const [urlsInput, setUrlsInput] = useState('');
  const [results, setResults] = useState<ScanResult[]>([]);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const scanAll = async () => {
    const urls = urlsInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('http'))
      .slice(0, 5);

    if (urls.length === 0) {
      setError('Add at least one valid URL that starts with http:// or https://');
      return;
    }

    setError('');
    setResults([]);
    setScanning(true);

    try {
      for (let index = 0; index < urls.length; index += 1) {
        const url = urls[index];
        if (!url) continue;
        setProgress(`Testing ${index + 1} of ${urls.length}...`);

        const response = await fetch(
          `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
            url,
          )}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo`,
        );

        if (!response.ok) {
          throw new Error(`PSI request failed (${response.status}) for ${url}`);
        }

        const data = await response.json();
        const lighthouse = data?.lighthouseResult;

        setResults((prev) => [
          ...prev,
          {
            url,
            performance: asScore(lighthouse?.categories?.performance?.score),
            accessibility: asScore(lighthouse?.categories?.accessibility?.score),
            bestPractices: asScore(lighthouse?.categories?.['best-practices']?.score),
            seo: asScore(lighthouse?.categories?.seo?.score),
          },
        ]);

        await new Promise((resolve) => {
          window.setTimeout(resolve, 200);
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run batch scan.');
    } finally {
      setScanning(false);
      setProgress('');
    }
  };

  return (
    <>
      <div className="dba-topbar">
        <a
          className="dba-topbar-brand"
          href="https://designedbyanthony.com"
          target="_blank"
          rel="noreferrer"
        >
          DBA
        </a>
        <span className="dba-topbar-sep">/</span>
        <span className="dba-topbar-name">Lighthouse Batch Scanner</span>
      </div>

      <main
        className="product-shell"
        style={{ '--accent': '#0369a1', '--accent-soft': '#e0f2fe' } as CSSProperties}
      >
        <section className="hero">
          <div>
            <p className="eyebrow">Batch Website Grading</p>
            <h1>Grade your website&apos;s speed, SEO, and accessibility.</h1>
            <p className="summary">Scan up to five URLs at once using Google PageSpeed Insights.</p>
          </div>
          <span className="status">Live PSI API</span>
        </section>

        <section className="workspace">
          <article className="panel">
            <div className="panel-heading">
              <p>URL List</p>
              <span>Max 5</span>
            </div>
            <div className="tool-form">
              <label className="field">
                One URL per line
                <textarea
                  className="text-area"
                  rows={6}
                  value={urlsInput}
                  onChange={(e) => setUrlsInput(e.target.value)}
                  placeholder="https://example.com\nhttps://example.org"
                />
              </label>

              <div className="action-row">
                <button
                  type="button"
                  className="primary-button"
                  onClick={scanAll}
                  disabled={scanning}
                >
                  {scanning ? 'Scanning...' : 'Scan All'}
                </button>
              </div>

              {progress ? <p className="muted-note">{progress}</p> : null}
              {error ? <p className="warning-note">{error}</p> : null}
            </div>
          </article>

          <article className="panel output-panel">
            <div className="panel-heading">
              <p>Scan Results</p>
              <span>{results.length} completed</span>
            </div>

            {results.length > 0 ? (
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
                  {results.map((row) => (
                    <tr key={row.url}>
                      <td className="url-cell" title={row.url}>
                        {row.url}
                      </td>
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
            ) : (
              <p className="muted-note">Run a batch scan to see scored results.</p>
            )}
          </article>
        </section>
      </main>

      <footer className="dba-footer">
        <div className="dba-footer-inner">
          <p>
            <strong>Designed by Anthony</strong> tools built for real client work.
          </p>
          <a
            className="dba-footer-link"
            href="https://designedbyanthony.online"
            target="_blank"
            rel="noreferrer"
          >
            designedbyanthony.online
          </a>
        </div>
      </footer>
    </>
  );
}
