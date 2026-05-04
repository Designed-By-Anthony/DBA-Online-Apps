import type { CSSProperties } from 'react';
import { GatedWorkspace } from './GatedWorkspace';

export default function Home() {
  return (
    <>
      <main
        className="product-shell"
        style={{ '--accent': '#0369a1', '--accent-soft': '#e0f2fe' } as CSSProperties}
      >
        <section className="hero">
          <div>
            <p className="eyebrow">Free email follow-up tool</p>
            <h1>Write Follow-Up Emails That Actually Get Replies</h1>
            <p className="summary">
              Paste your prospect list and get a ready-to-send email sequence in seconds. No CRM
              needed.
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
