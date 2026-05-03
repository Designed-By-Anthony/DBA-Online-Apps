'use client';

const DEMO_STEPS = [
  {
    day: 'Day 1',
    subject: 'North Star HVAC in Dallas: quick idea',
    body: 'Hi Alex, I was checking out North Star HVAC in Dallas and noticed a few easy website wins that could help bring in more leads this month.',
  },
  {
    day: 'Day 3',
    subject: 'North Star HVAC in Dallas: quick idea',
    body: 'Following up on my last note: Hi Alex, I was checking out North Star HVAC in Dallas and noticed a few easy website wins that could help bring in more leads this month.',
  },
  {
    day: 'Day 7',
    subject: 'North Star HVAC in Dallas: quick idea',
    body: 'Quick check-in: Hi Alex, I was checking out North Star HVAC in Dallas and noticed a few easy website wins that could help bring in more leads this month.',
  },
];

export function DemoResults() {
  return (
    <section className="workspace">
      <article className="panel output-panel" style={{ gridColumn: '1 / -1' }}>
        <div className="panel-heading">
          <p>Generated Sequences</p>
          <span>1 prospect &middot; 3 steps shown</span>
        </div>
        <div className="result-stack">
          <div className="sequence-card">
            <strong>Alex &middot; North Star HVAC &middot; Dallas</strong>
            <ul className="list">
              {DEMO_STEPS.map((step) => (
                <li key={step.day}>
                  <div className="item-row">
                    <span>
                      <span className="step-label">{step.day}</span> <strong>{step.subject}</strong>
                      <br />
                      {step.body}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </section>
  );
}
