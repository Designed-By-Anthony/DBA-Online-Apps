import { TOOL_LABELS, TOOL_PRICES, TOOL_SLUGS, TOOL_TAGLINES } from '../lib/pseo';

export default function StorePage() {
  const year = new Date().getFullYear();
  return (
    <>
      <header className="topbar">
        <span className="topbar-brand">
          Designed by <span>Anthony</span>
        </span>
        <a href="mailto:anthony@designedbyanthony.online" className="topbar-link">
          Get in touch
        </a>
      </header>

      <section className="hero">
        <p className="hero-eyebrow">7 tools for local service businesses</p>
        <h1>
          Run your business.
          <br />
          <em>Not a spreadsheet.</em>
        </h1>
        <p className="hero-sub">
          Job estimating, lead capture, SEO audits, and site speed monitoring — built for
          contractors and local service pros in New York State.
        </p>
        <div className="hero-cta-group">
          <a href="#tools" className="btn-primary">
            Browse all tools →
          </a>
          <a href="mailto:anthony@designedbyanthony.online" className="btn-ghost">
            Talk to Anthony
          </a>
        </div>
      </section>

      <section className="grid-section" id="tools">
        <p className="section-label">All tools</p>
        <div className="tool-grid">
          {TOOL_SLUGS.map((slug) => (
            <a key={slug} href={`/tools/${slug}`} className="tool-card">
              <h2 className="card-name">{TOOL_LABELS[slug]}</h2>
              <p className="card-desc">{TOOL_TAGLINES[slug]}</p>
              <div className="card-footer">
                <span className="card-open">Learn more →</span>
                <span className="card-badge">{TOOL_PRICES[slug]}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <div className="strip">
        <h2>One builder. Seven tools. No agency markup.</h2>
        <p>
          Every tool is designed, built, and supported by Anthony — one person based in Rome, NY who
          picks up the phone.
        </p>
        <a href="mailto:anthony@designedbyanthony.online" className="btn-primary">
          Get in touch →
        </a>
      </div>

      <section className="strip" style={{ background: 'var(--surface-2, #111)' }}>
        <h2>Need a custom build?</h2>
        <p>
          These tools are built by Anthony Jones — a full-stack web architect based in Rome, NY. For
          bespoke websites, design systems, and infrastructure work, visit the main studio.
        </p>
        <a href="https://designedbyanthony.com" className="btn-primary" rel="noopener">
          designedbyanthony.com →
        </a>
      </section>

      <footer>
        <div className="footer">
          <span className="footer-brand">Designed by Anthony</span>
          <ul className="footer-links">
            <li>
              <a href="/.well-known/security.txt">Security</a>
            </li>
            <li>
              <a href="/llms.txt">LLMs</a>
            </li>
            <li>
              <a href="mailto:anthony@designedbyanthony.online">Contact</a>
            </li>
          </ul>
          <p className="footer-copy">© {year} Designed by Anthony · Rome, NY</p>
        </div>
      </footer>
    </>
  );
}
