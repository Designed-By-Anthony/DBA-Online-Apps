'use client';

import { useMemo, useState } from 'react';

type Prospect = {
  name: string;
  company: string;
  city: string;
};

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

function fillTemplate(template: string, prospect: Prospect): string {
  return template
    .replaceAll('{{name}}', prospect.name)
    .replaceAll('{{company}}', prospect.company)
    .replaceAll('{{city}}', prospect.city);
}

export function Workspace() {
  const [rawProspects, setRawProspects] = useState('');
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [copiedKey, setCopiedKey] = useState('');

  const prospects = useMemo(
    () =>
      rawProspects
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line): Prospect | null => {
          const [name, company, city] = line.split(',').map((value) => value?.trim() ?? '');
          if (!name || !company || !city) {
            return null;
          }
          return { name, company, city };
        })
        .filter((prospect): prospect is Prospect => prospect !== null),
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

  const copyStep = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(''), 1200);
  };

  const downloadAll = () => {
    const content = sequences
      .map((sequence) => {
        const header = `${sequence.prospect.name} | ${sequence.prospect.company} | ${sequence.prospect.city}`;
        const steps = sequence.steps
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
              onChange={(event) => setRawProspects(event.target.value)}
              placeholder="Alex,North Star HVAC,Dallas"
            />
          </label>
          <label className="field">
            Message Template
            <textarea
              className="text-area"
              rows={5}
              value={template}
              onChange={(event) => setTemplate(event.target.value)}
            />
          </label>
          <p className="muted-note">
            Use placeholders: {'{{name}}'}, {'{{company}}'}, {'{{city}}'}.
          </p>
          <div className="action-row">
            <button
              type="button"
              className="primary-button"
              onClick={downloadAll}
              disabled={sequences.length === 0}
            >
              Download all as .txt
            </button>
          </div>
        </div>
      </article>

      <article className="panel output-panel">
        <div className="panel-heading">
          <p>Generated Sequences</p>
          <span>{sequences.length} ready</span>
        </div>

        {sequences.length > 0 ? (
          <div className="result-stack">
            {sequences.map((sequence) => (
              <div
                key={`${sequence.prospect.name}-${sequence.prospect.company}`}
                className="sequence-card"
              >
                <strong>
                  {sequence.prospect.name} · {sequence.prospect.company} · {sequence.prospect.city}
                </strong>
                <ul className="list">
                  {sequence.steps.map((step) => {
                    const key = `${sequence.prospect.name}-${step.day}`;
                    const value = `Subject: ${step.subject}\n\n${step.body}`;

                    return (
                      <li key={key}>
                        <div className="item-row">
                          <span>
                            <span className="step-label">{step.day}</span>{' '}
                            <strong>{step.subject}</strong>
                            <br />
                            {step.body}
                          </span>
                          <button
                            type="button"
                            className={`copy-button${copiedKey === key ? ' copied' : ''}`}
                            onClick={() => copyStep(value, key)}
                          >
                            {copiedKey === key ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted-note">Add prospects to generate personalized sequences.</p>
        )}
      </article>
    </section>
  );
}
