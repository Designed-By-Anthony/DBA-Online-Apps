'use client';

const DEMO_SCHEMA = JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Mohawk Valley HVAC',
    areaServed: [
      { '@type': 'City', name: 'Utica, NY' },
      { '@type': 'City', name: 'Rome, NY' },
      { '@type': 'City', name: 'Herkimer, NY' },
    ],
  },
  null,
  2,
);

export function DemoResults() {
  return (
    <section className="workspace">
      <article className="panel output-panel" style={{ gridColumn: '1 / -1' }}>
        <div className="panel-heading">
          <p>Generated Output</p>
          <span>3 cities</span>
        </div>
        <div className="result-stack">
          <div>
            <strong>Service Cities</strong>
            <ul className="list">
              <li>Utica, NY &middot; 20 miles</li>
              <li>Rome, NY &middot; 15 miles</li>
              <li>Herkimer, NY &middot; 25 miles</li>
            </ul>
          </div>
          <div>
            <strong>Schema JSON-LD</strong>
            <pre className="code-block">{DEMO_SCHEMA}</pre>
          </div>
        </div>
      </article>
    </section>
  );
}
