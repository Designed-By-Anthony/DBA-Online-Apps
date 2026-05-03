import type { CSSProperties } from 'react';
import { GatedWorkspace } from './GatedWorkspace';

export default function Home() {
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
        <span className="dba-topbar-name">Cold Outreach Sequencer</span>
      </div>

      <main
        className="product-shell"
        style={{ '--accent': '#0369a1', '--accent-soft': '#e0f2fe' } as CSSProperties}
      >
        <section className="hero">
          <div>
            <p className="eyebrow">Email Sequence Tool</p>
            <h1>Write personalized follow-up emails.</h1>
            <p className="summary">
              No CRM required. Paste prospects, generate a full 5-step sequence.
            </p>
          </div>
        </section>

        <GatedWorkspace />
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
