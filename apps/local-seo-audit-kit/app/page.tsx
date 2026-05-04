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
            <p className="eyebrow">Free local SEO audit</p>
            <h1>Free Local SEO Checker for Small Businesses</h1>
            <p className="summary">
              Find out if customers can actually find you on Google. Get a simple checklist of what
              to fix.
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
