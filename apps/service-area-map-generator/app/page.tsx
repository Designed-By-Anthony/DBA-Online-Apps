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
        <span className="dba-topbar-name">Service Area Map</span>
      </div>

      <main
        className="product-shell"
        style={{ '--accent': '#0369a1', '--accent-soft': '#e0f2fe' } as CSSProperties}
      >
        <section className="hero">
          <div>
            <p className="eyebrow">Free service area map tool</p>
            <h1>Show Customers Exactly Where You Work</h1>
            <p className="summary">
              Enter the towns you serve and get an embeddable map for your website. Helps you show
              up in local search.
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
