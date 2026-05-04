'use client';

import { useState } from 'react';

type ScanResult = {
  url: string;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
};

const PURCHASE_URL = 'https://designedbyanthony.com/tools';

function scoreClass(score: number): string {
  if (score >= 90) return 'score-badge score-badge--good';
  if (score >= 50) return 'score-badge score-badge--ok';
  return 'score-badge score-badge--poor';
}

function asScore(value: unknown): number {
  return Math.round((Number(value) || 0) * 100);
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
}

export function Workspace({ locked = false }: { locked?: boolean }) {
  const [urlsInput, setUrlsInput] = useState('');
  const [results, setResults] = useState<ScanResult[]>([]);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const scanAll = async () => {
    const urls = urlsInput.split('\n').map(normalizeUrl).filter(Boolean).slice(0, 5);

    if (urls.length === 0) {
      setError('Add at least one URL (e.g. example.com or https://example.com)');
      return;
    }

    setError('');
    setResults([]);
    setScanning(true);

    try {
      for (let index = 0; index < urls.length; index += 1) {
        const url = urls[index];
        if (!url) continue;

        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo`;

        let response: Response | null = null;

        for (let attempt = 0; attempt < 3; attempt += 1) {
          setProgress(`Testing ${index + 1} of ${urls.length}...`);

          try {
            response = await fetch(apiUrl);
          } catch {
            throw new Error(`Network error scanning ${url}`);
          }

          if (response.status !== 429) break;
          if (attempt === 2) break;

          setProgress('Google API is busy. Retrying...');
          const delay = 2 ** (attempt + 1) * 1000;
          await new Promise((resolve) => window.setTimeout(resolve, delay));
        }

        if (!response) {
          throw new Error(`Network error scanning ${url}`);
        }

        if (response.status === 429) {
          throw new Error('Google API is still busy. Please try again in a minute.');
        }

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

        await new Promise((resolve) => window.setTimeout(resolve, 200));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run batch scan.');
    } finally {
      setScanning(false);
      setProgress('');
    }
  };

  const DEMO_ROWS = [
    { url: 'example.com', p: 87, a: 92, bp: 78, s: 95 },
    { url: 'sample.org', p: 54, a: 71, bp: 83, s: 88 },
  ];

  return (
    <section className="workspace">
      {/* Input Panel — always visible */}
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
              placeholder={'example.com\nhttps://example.org'}
            />
          </label>

          <div className="action-row">
            {locked ? (
              <a
                href={PURCHASE_URL}
                className="primary-button"
                style={{ textDecoration: 'none', display: 'inline-block' }}
              >
                🔒 Unlock to Scan
              </a>
            ) : (
              <button
                type="button"
                className="primary-button"
                onClick={scanAll}
                disabled={scanning}
              >
                {scanning ? 'Scanning...' : 'Scan All'}
              </button>
            )}
          </div>

          {progress ? (
            <p className="muted-note" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  animation: 'pulse 1s infinite',
                }}
              />
              {progress}
            </p>
          ) : null}
          {error ? <p className="warning-note">{error}</p> : null}
        </div>
      </article>

      {/* Results Panel — gated for free users */}
      <article className="panel output-panel">
        <div className="panel-heading">
          <p>Scan Results</p>
          <span>{results.length} completed</span>
        </div>

        {locked ? (
          <div style={{ position: 'relative', minHeight: 200 }}>
            <div
              style={{ filter: 'blur(4px)', opacity: 0.35, pointerEvents: 'none', marginTop: 16 }}
            >
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
                  {DEMO_ROWS.map((r) => (
                    <tr key={r.url}>
                      <td className="url-cell">{r.url}</td>
                      <td>
                        <span className={scoreClass(r.p)}>{r.p}</span>
                      </td>
                      <td>
                        <span className={scoreClass(r.a)}>{r.a}</span>
                      </td>
                      <td>
                        <span className={scoreClass(r.bp)}>{r.bp}</span>
                      </td>
                      <td>
                        <span className={scoreClass(r.s)}>{r.s}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(244,245,246,0.7)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', margin: '0 0 8px' }}>
                  See your real scores
                </p>
                <p className="muted-note" style={{ marginBottom: 16 }}>
                  Subscribe to run scans with your actual URLs.
                </p>
                <a
                  href={PURCHASE_URL}
                  className="primary-button"
                  style={{ textDecoration: 'none', display: 'inline-block' }}
                >
                  Unlock Full Access →
                </a>
              </div>
            </div>
          </div>
        ) : results.length > 0 ? (
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
          <p className="muted-note" style={{ marginTop: 16 }}>
            Run a batch scan to see scored results.
          </p>
        )}
      </article>
    </section>
  );
}
