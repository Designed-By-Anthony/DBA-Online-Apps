import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  CITY_LABELS,
  CITY_SLUGS,
  INDUSTRY_LABELS,
  INDUSTRY_SLUGS,
  TOOL_DESCRIPTIONS,
  TOOL_LABELS,
  TOOL_PRICES,
  TOOL_SLUGS,
  TOOL_TAGLINES,
  TOOL_URLS,
  type ToolSlug,
} from '../../../lib/pseo';

type Props = { params: Promise<{ tool: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return TOOL_SLUGS.map((slug) => ({ tool: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  const slug = tool as ToolSlug;
  if (!TOOL_LABELS[slug]) return {};
  const canonicalUrl = `https://designedbyanthony.online/tools/${slug}`;
  return {
    title: `${TOOL_LABELS[slug]} — Designed by Anthony`,
    description: TOOL_TAGLINES[slug],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${TOOL_LABELS[slug]} — Designed by Anthony`,
      description: TOOL_TAGLINES[slug],
      url: canonicalUrl,
      siteName: 'Designed by Anthony',
      type: 'website',
    },
  };
}

export default async function ToolLandingPage({ params }: Props) {
  const { tool } = await params;
  const slug = tool as ToolSlug;
  if (!TOOL_SLUGS.includes(slug)) notFound();

  const label = TOOL_LABELS[slug];
  const tagline = TOOL_TAGLINES[slug];
  const price = TOOL_PRICES[slug];
  const url = TOOL_URLS[slug];
  const desc = TOOL_DESCRIPTIONS[slug];
  const year = new Date().getFullYear();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: label,
    description: tagline,
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: price.replace(/[^0-9.]/g, ''),
      priceCurrency: 'USD',
      billingIncrement: 'P1M',
    },
    provider: {
      '@type': 'Person',
      name: 'Anthony Jones',
      url: 'https://designedbyanthony.online',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="topbar">
        <a href="/" className="topbar-brand">
          Designed by <span>Anthony</span>
        </a>
        <a href="/" className="topbar-link">
          ← All tools
        </a>
      </header>

      <section className="hero">
        <p className="hero-eyebrow">Free tool</p>
        <h1>{label}</h1>
        <p className="hero-sub">{tagline}</p>
        <div className="hero-cta-group">
          <a href={url} className="btn-primary">
            Open tool →
          </a>
          <a href="/" className="btn-ghost">
            ← Back to store
          </a>
        </div>
      </section>

      <section className="grid-section">
        <div className="detail-two-col">
          <div className="detail-block">
            <p className="section-label">What it does</p>
            <p className="detail-prose">{desc.plain}</p>
          </div>
          <div className="detail-meta">
            <div className="detail-meta-row">
              <span className="detail-meta-label">Who it's for</span>
              <span className="detail-meta-value">{desc.who}</span>
            </div>
            <div className="detail-meta-row">
              <span className="detail-meta-label">What you get</span>
              <span className="detail-meta-value">{desc.what}</span>
            </div>
            <div className="detail-meta-row">
              <span className="detail-meta-label">Price</span>
              <span className="detail-meta-value">{price} · Cancel any time</span>
            </div>
            <a href={url} className="btn-primary" style={{ marginTop: '8px' }}>
              Open {label} →
            </a>
          </div>
        </div>
      </section>

      <div className="strip">
        <h2>Available for businesses near you</h2>
        <p>
          See how {label} helps{' '}
          {slug === 'construction-calculator' ? 'contractors' : 'local businesses'} in your city.
        </p>
        <div className="pseo-link-grid">
          {CITY_SLUGS.map((city) =>
            INDUSTRY_SLUGS.map((industry) => (
              <a
                key={`${city}-${industry}`}
                href={`/tools/${slug}/${city}/${industry}`}
                className="pseo-link"
              >
                {CITY_LABELS[city]} · {INDUSTRY_LABELS[industry]}
              </a>
            )),
          )}
        </div>
      </div>

      <footer>
        <div className="footer">
          <span className="footer-brand">Designed by Anthony</span>
          <ul className="footer-links">
            <li>
              <a href="/">All tools</a>
            </li>
            <li>
              <a href="/.well-known/security.txt">Security</a>
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
