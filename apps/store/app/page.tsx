import Image from 'next/image';
import { TOOL_LABELS, TOOL_PRICES, TOOL_SLUGS, TOOL_TAGLINES } from '../lib/pseo';

export default function StorePage() {
  const year = new Date().getFullYear();
  return (
    <>
      <header
        className="topbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 2rem',
        }}
      >
        {/* THE LOGO */}
        <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/tools logo.png"
            alt="Tools by Anthony"
            height={24}
            width={120}
            style={{ height: '24px', width: 'auto', objectFit: 'contain' }}
          />
        </a>

        {/* THE CTA BUTTON */}
        <a
          href="https://designedbyanthony.com/contact"
          className="btn-ghost"
          style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem', borderRadius: '99px' }}
        >
          Get in touch
        </a>
      </header>

      <section className="hero">
        <p className="hero-eyebrow">7 tools for small businesses</p>
        <h1>
          Tools to Run Your Business.
          <br />
          <em>Not a Spreadsheet.</em>
        </h1>
        <p className="hero-sub">
          Cost estimating, lead capture, SEO checkups, and site speed reports — built for
          contractors and local service businesses.
        </p>
        <div className="hero-cta-group">
          <a href="#tools" className="btn-primary">
            See all tools →
          </a>
          <a href="https://designedbyanthony.com/contact" className="btn-ghost">
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
        <h2>One person builds and supports every tool.</h2>
        <p>
          No call center. No ticket queue. Every tool is designed, built, and supported by Anthony
          from Rome, NY — and he picks up the phone.
        </p>
        <a href="https://designedbyanthony.com/contact" className="btn-primary">
          Get in touch →
        </a>
      </div>

      <section className="strip" style={{ background: 'var(--surface-2, #111)' }}>
        <h2>Need a custom website?</h2>
        <p>
          These tools are built by Anthony Jones in Rome, NY. For custom websites, SEO, and managed
          hosting, visit the main studio.
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
              <a href="https://designedbyanthony.com/contact">Contact</a>
            </li>
          </ul>
          <p className="footer-copy">© {year} Designed by Anthony · Rome, NY</p>
        </div>
      </footer>
    </>
  );
}
