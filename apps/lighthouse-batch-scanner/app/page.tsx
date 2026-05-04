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
            <p className="eyebrow">Free website grading tool</p>
            <h1>Grade Your Website&apos;s Speed, SEO, and Accessibility</h1>
            <p className="summary">
              Scan up to five pages at once and get a plain-English report card. See what to fix
              first.
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
