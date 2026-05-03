'use client';

import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';

type ServiceArea = { id: string; city: string; state: string; radiusMiles: number };

function toMapSrc(city: string, state: string): string {
  const query = `${city} ${state} service area`;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export default function Home() {
  const [businessName, setBusinessName] = useState('Your Business Name');
  const [city, setCity] = useState('Dallas');
  const [state, setState] = useState('TX');
  const [radiusMiles, setRadiusMiles] = useState(20);
  const [areas, setAreas] = useState<ServiceArea[]>([
    { id: 'dallas-tx', city: 'Dallas', state: 'TX', radiusMiles: 20 },
  ]);
  const [copiedKey, setCopiedKey] = useState('');

  const addArea = () => {
    const nextCity = city.trim();
    const nextState = state.trim();
    if (!nextCity || !nextState) return;

    setAreas((prev) => [
      ...prev,
      {
        id: `${nextCity.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${nextState.toLowerCase()}`,
        city: nextCity,
        state: nextState,
        radiusMiles,
      },
    ]);
  };

  const removeArea = (id: string) => {
    setAreas((prev) => prev.filter((area) => area.id !== id));
  };

  const primary = areas[0];

  const mapEmbedSnippet = useMemo(() => {
    if (!primary) return '';
    return `<iframe src="${toMapSrc(primary.city, primary.state)}" width="100%" height="420" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  }, [primary]);

  const schemaBlock = useMemo(() => {
    const areaServed = areas.map((area) => ({
      '@type': 'City',
      name: `${area.city}, ${area.state}`,
    }));
    return JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: businessName,
        areaServed,
      },
      null,
      2,
    );
  }, [areas, businessName]);

  const cityListHtml = useMemo(
    () =>
      `<ul class="service-areas">\n${areas
        .map((area) => `  <li>${area.city}, ${area.state} (${area.radiusMiles} mile radius)</li>`)
        .join('\n')}\n</ul>`,
    [areas],
  );

  const copyValue = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(''), 1200);
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
        <span className="dba-topbar-name">Service Area Map Generator</span>
      </div>

      <main
        className="product-shell"
        style={{ '--accent': '#0369a1', '--accent-soft': '#e0f2fe' } as CSSProperties}
      >
        <section className="hero">
          <div>
            <p className="eyebrow">Local SEO Utility</p>
            <h1>Show customers and Google exactly where you work.</h1>
            <p className="summary">
              Generate a map embed, schema block, and service city list in seconds.
            </p>
          </div>
          <span className="status">Ready to Publish</span>
        </section>

        <section className="workspace">
          <article className="panel">
            <div className="panel-heading">
              <p>Service Area Builder</p>
              <span>{areas.length} cities</span>
            </div>

            <div className="tool-form">
              <label className="field">
                Business Name
                <input
                  className="text-input"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </label>

              <div className="form-grid three-col">
                <label className="field">
                  City
                  <input
                    className="text-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </label>
                <label className="field">
                  State
                  <input
                    className="text-input"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </label>
                <label className="field">
                  Radius (miles)
                  <input
                    type="number"
                    min={1}
                    className="text-input"
                    value={radiusMiles}
                    onChange={(e) => setRadiusMiles(Number(e.target.value || 1))}
                  />
                </label>
              </div>

              <div className="action-row">
                <button type="button" className="primary-button" onClick={addArea}>
                  Add City
                </button>
              </div>

              <ul className="list">
                {areas.map((area) => (
                  <li className="item-row" key={area.id}>
                    <span>
                      {area.city}, {area.state} · {area.radiusMiles} miles
                    </span>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => removeArea(area.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="panel output-panel">
            <div className="panel-heading">
              <p>Map Preview</p>
              <span>{primary ? `${primary.city}, ${primary.state}` : 'No city selected'}</span>
            </div>
            {primary ? (
              <div className="result-stack">
                <div className="map-preview">
                  <iframe
                    src={toMapSrc(primary.city, primary.state)}
                    loading="lazy"
                    title="Service area map"
                  />
                </div>

                <div>
                  <div className="panel-heading">
                    <p>Map Embed Code</p>
                    <button
                      type="button"
                      className={`copy-button${copiedKey === 'embed' ? ' copied' : ''}`}
                      onClick={() => copyValue(mapEmbedSnippet, 'embed')}
                    >
                      {copiedKey === 'embed' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="code-block">{mapEmbedSnippet}</pre>
                </div>

                <div>
                  <div className="panel-heading">
                    <p>JSON-LD Schema</p>
                    <button
                      type="button"
                      className={`copy-button${copiedKey === 'schema' ? ' copied' : ''}`}
                      onClick={() => copyValue(schemaBlock, 'schema')}
                    >
                      {copiedKey === 'schema' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="code-block">{schemaBlock}</pre>
                </div>

                <div>
                  <div className="panel-heading">
                    <p>Service Cities HTML</p>
                    <button
                      type="button"
                      className={`copy-button${copiedKey === 'cities' ? ' copied' : ''}`}
                      onClick={() => copyValue(cityListHtml, 'cities')}
                    >
                      {copiedKey === 'cities' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="code-block">{cityListHtml}</pre>
                </div>
              </div>
            ) : (
              <p className="muted-note">Add a city to generate your map and schema output.</p>
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
