'use client';

import { useMemo, useState } from 'react';

type Prospect = { name: string; company: string; city: string };

const DEFAULT_TEMPLATE =
  'Hi {{name}}, I was checking out {{company}} in {{city}} and noticed a few easy website wins that could help bring in more leads this month.';

const STEP_CONFIG = [
  { day: 'Day 1', opener: '' },
  { day: 'Day 3', opener: 'Following up on my last note: ' },
  { day: 'Day 7', opener: 'Quick check-in: ' },
  { day: 'Day 14', opener: 'One more idea for you: ' },
  { day: 'Day 21', opener: 'Last follow-up from me: ' },
] as const;

type SequenceStep = { day: string; subject: string; body: string };

const PURCHASE_URL = 'https://designedbyanthony.com/tools';

function fillTemplate(template: string, prospect: Prospect): string {
  return template
    .replaceAll('{{name}}', prospect.name)
    .replaceAll('{{company}}', prospect.company)
    .replaceAll('{{city}}', prospect.city);
}

export function Workspace({ locked = false }: { locked?: boolean }) {
  const [rawProspects, setRawProspects] = useState('');
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [copiedKey, setCopiedKey] = useState('');
  const [activeProspect, setActiveProspect] = useState(0);

  const prospects = useMemo(
    () =>
      rawProspects
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line): Prospect | null => {
          const [name, company, city] = line.split(',').map((v) => v?.trim() ?? '');
          if (!name || !company || !city) return null;
          return { name, company, city };
        })
        .filter((p): p is Prospect => p !== null),
    [rawProspects],
  );

  const sequences = useMemo(
    () =>
      prospects.map((prospect) => {
        const personalized = fillTemplate(template, prospect);
        const subject = `${prospect.company} in ${prospect.city}: quick idea`;
        return {
          prospect,
          steps: STEP_CONFIG.map<SequenceStep>((step) => ({
            day: step.day,
            subject,
            body: `${step.opener}${personalized}`,
          })),
        };
      }),
    [prospects, template],
  );

  const safeActiveProspect = Math.min(activeProspect, Math.max(0, sequences.length - 1));
  const activeSequence = sequences[safeActiveProspect];

  const copyStep = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(''), 1200);
  };

  const downloadAll = () => {
    const content = sequences
      .map((seq) => {
        const header = `${seq.prospect.name} | ${seq.prospect.company} | ${seq.prospect.city}`;
        const steps = seq.steps
          .map((step) => `${step.day}\nSubject: ${step.subject}\n${step.body}`)
          .join('\n\n');
        return `${header}\n${'-'.repeat(header.length)}\n${steps}`;
      })
      .join('\n\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'outreach-sequences.txt';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <section className="workspace">
      {/* Input Panel — always visible */}
      <article className="panel">
        <div className="panel-heading">
          <p>Input</p>
          <span>{prospects.length} prospects</span>
        </div>
        <div className="tool-form">
          <label className="field">
            Prospects (name,company,city per line)
            <textarea
              className="text-area"
              rows={6}
              value={rawProspects}
              onChange={(e) => setRawProspects(e.target.value)}
              placeholder="Alex,North Star HVAC,Dallas"
            />
          </label>
          <label className="field">
            Message Template
            <textarea
              className="text-area"
              rows={5}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            />
          </label>
          <p className="muted-note">
            Use placeholders: {'{{name}}'}, {'{{company}}'}, {'{{city}}'}.
          </p>
          <div className="action-row">
            {locked ? (
              <a
                href={PURCHASE_URL}
                className="primary-button"
                style={{ textDecoration: 'none', display: 'inline-block' }}
              >
                🔒 Unlock to Download
              </a>
            ) : (
              <button
                type="button"
                className="primary-button"
                onClick={downloadAll}
                disabled={sequences.length === 0}
              >
                Download all as .txt
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Output Panel — gated for free users */}
      <article className="panel output-panel">
        <div className="panel-heading">
          <p>Generated Sequences</p>
          <span>{sequences.length} ready</span>
        </div>

        {locked ? (
          <div style={{ position: 'relative', minHeight: 260 }}>
            <div
              style={{ filter: 'blur(4px)', opacity: 0.35, pointerEvents: 'none', padding: '12px 0' }}
            >
              {[1, 2].map((i) => (
                <div key={i} className="sequence-card" style={{ marginBottom: 12 }}>
                  <strong>Sample Prospect · Company · City</strong>
                  <ul className="list">
                    {STEP_CONFIG.map((step) => (
                      <li key={step.day}>
                        <span className="step-label">{step.day}</span> Sample email subject · Sample body text here.
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
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
                  Your sequences are ready
                </p>
                <p className="muted-note" style={{ marginBottom: 16 }}>
                  Subscribe to view and download your personalized emails.
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
        ) : sequences.length > 0 ? (
          <>
            {sequences.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  flexWrap: 'wrap',
                  padding: '12px 0 8px',
                  borderBottom: '1px solid var(--line)',
                  marginBottom: 12,
                }}
              >
                {sequences.map((seq, i) => (
                  <button
                    key={`${seq.prospect.name}-${seq.prospect.company}`}
                    type="button"
                    onClick={() => setActiveProspect(i)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 999,
                      border: '1px solid',
                      borderColor: i === safeActiveProspect ? 'var(--accent)' : 'var(--line)',
                      background: i === safeActiveProspect ? 'var(--accent)' : 'transparent',
                      color: i === safeActiveProspect ? '#fff' : 'var(--foreground)',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {seq.prospect.name}
                  </button>
                ))}
              </div>
            )}

            {activeSequence && (
              <>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 12px' }}>
                  {activeSequence.prospect.company} · {activeSequence.prospect.city}
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: 10,
                  }}
                >
                  {activeSequence.steps.map((step) => {
                    const key = `${activeSequence.prospect.name}-${step.day}`;
                    const value = `Subject: ${step.subject}\n\n${step.body}`;
                    return (
                      <div
                        key={key}
                        className="sequence-card"
                        style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span className="step-label">{step.day}</span>
                          <button
                            type="button"
                            className={`copy-button${copiedKey === key ? ' copied' : ''}`}
                            onClick={() => copyStep(value, key)}
                          >
                            {copiedKey === key ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <strong style={{ fontSize: 13 }}>{step.subject}</strong>
                        <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, lineHeight: 1.45 }}>
                          {step.body}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        ) : (
          <p className="muted-note" style={{ marginTop: 18 }}>
            Add prospects to generate personalized sequences.
          </p>
        )}
      </article>
    </section>
  );
}
