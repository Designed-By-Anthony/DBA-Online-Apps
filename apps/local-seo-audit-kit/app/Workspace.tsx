'use client';

import { useMemo, useState } from 'react';

type Check = { label: string; pass: boolean; recommendation: string };

function scoreClass(score: number): 'good' | 'ok' | 'poor' {
  if (score >= 70) return 'good';
  if (score >= 40) return 'ok';
  return 'poor';
}

export function Workspace() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [hasGbp, setHasGbp] = useState(false);
  const [consistentAddress, setConsistentAddress] = useState(false);
  const [hasReviews, setHasReviews] = useState(false);
  const [audited, setAudited] = useState(false);

  const checks = useMemo<Check[]>(
    () => [
      {
        label: 'Business name is filled in',
        pass: name.trim().length > 0,
        recommendation: 'Add your exact business name as customers search for it.',
      },
      {
        label: 'Phone number is filled in',
        pass: phone.trim().length > 0,
        recommendation: 'Add a primary phone number to improve trust and conversion.',
      },
      {
        label: 'Address is filled in',
        pass: address.trim().length > 0,
        recommendation: 'Add your service address or office location.',
      },
      {
        label: 'Website URL is filled in',
        pass: website.trim().length > 0,
        recommendation: 'Add your website URL so Google can connect listings to your site.',
      },
      {
        label: 'Google Business Profile is active',
        pass: hasGbp,
        recommendation: 'Set up or claim your Google Business Profile listing.',
      },
      {
        label: 'Address is listed consistently online',
        pass: consistentAddress,
        recommendation: 'Match your business name, address, and phone across all directories.',
      },
      {
        label: 'You have at least 5 Google reviews',
        pass: hasReviews,
        recommendation: 'Request reviews from recent customers to build authority.',
      },
    ],
    [address, consistentAddress, hasGbp, hasReviews, name, phone, website],
  );

  const passed = checks.filter((item) => item.pass).length;
  const score = Math.round((passed / checks.length) * 100);
  const scoreState = scoreClass(score);

  const recommendations = checks.filter((item) => !item.pass).map((item) => item.recommendation);

  return (
    <section className="workspace">
      <article className="panel">
        <div className="panel-heading">
          <p>Business Details</p>
          <span>7 checks</span>
        </div>

        <div className="tool-form">
          <label className="field">
            Business Name
            <input className="text-input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="field">
            Phone
            <input
              className="text-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <label className="field">
            Address
            <input
              className="text-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <label className="field">
            Website
            <input
              className="text-input"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
            />
          </label>

          <label className="checkbox-row">
            <input type="checkbox" checked={hasGbp} onChange={(e) => setHasGbp(e.target.checked)} />
            I have a Google Business Profile
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={consistentAddress}
              onChange={(e) => setConsistentAddress(e.target.checked)}
            />
            My address is listed consistently online
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={hasReviews}
              onChange={(e) => setHasReviews(e.target.checked)}
            />
            I have 5+ Google reviews
          </label>

          <div className="action-row">
            <button type="button" className="primary-button" onClick={() => setAudited(true)}>
              Run Audit
            </button>
          </div>
        </div>
      </article>

      <article className="panel output-panel">
        <div className="panel-heading">
          <p>Audit Result</p>
          <span>{audited ? `${score}/100` : 'Waiting for audit'}</span>
        </div>

        {audited ? (
          <div className="result-stack">
            <div className={`score-circle score-${scoreState}`}>
              {score}
              <small>SCORE</small>
            </div>

            <div>
              {checks.map((item) => (
                <div className="check-row-result" key={item.label}>
                  <span className="check-icon">{item.pass ? '✅' : '❌'}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div>
              <strong>Recommendations</strong>
              {recommendations.length === 0 ? (
                <p className="muted-note">
                  Everything checks out. Keep collecting reviews every week.
                </p>
              ) : (
                <ul className="list">
                  {recommendations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <p className="muted-note">Fill in your details and click Run Audit.</p>
        )}
      </article>
    </section>
  );
}
