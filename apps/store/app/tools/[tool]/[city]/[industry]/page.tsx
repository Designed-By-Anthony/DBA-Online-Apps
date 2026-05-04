import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  buildToolPagePayload,
  CITY_SLUGS,
  type CitySlug,
  INDUSTRY_SLUGS,
  type IndustrySlug,
  listAllToolPaths,
  TOOL_SLUGS,
  type ToolSlug,
} from '../../../../../lib/pseo';

type Props = {
  params: Promise<{ tool: string; city: string; industry: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return listAllToolPaths().map(({ tool, city, industry }) => ({
    tool,
    city,
    industry,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool, city, industry } = await params;
  if (
    !TOOL_SLUGS.includes(tool as ToolSlug) ||
    !CITY_SLUGS.includes(city as CitySlug) ||
    !INDUSTRY_SLUGS.includes(industry as IndustrySlug)
  )
    return {};
  const p = buildToolPagePayload(tool as ToolSlug, city as CitySlug, industry as IndustrySlug);
  return {
    title: p.title,
    description: p.description,
    alternates: {
      canonical: `https://designedbyanthony.online${p.canonicalPath}`,
    },
    openGraph: {
      title: p.title,
      description: p.description,
      url: `https://designedbyanthony.online${p.canonicalPath}`,
      siteName: 'Designed by Anthony',
      type: 'website',
    },
  };
}

export default async function PseoPage({ params }: Props) {
  const { tool, city, industry } = await params;

  if (
    !TOOL_SLUGS.includes(tool as ToolSlug) ||
    !CITY_SLUGS.includes(city as CitySlug) ||
    !INDUSTRY_SLUGS.includes(industry as IndustrySlug)
  )
    notFound();

  const p = buildToolPagePayload(tool as ToolSlug, city as CitySlug, industry as IndustrySlug);

  const year = new Date().getFullYear();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `https://designedbyanthony.online${p.canonicalPath}`,
        url: `https://designedbyanthony.online${p.canonicalPath}`,
        name: p.title,
        description: p.description,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Tools',
              item: 'https://designedbyanthony.online',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: p.toolLabel,
              item: `https://designedbyanthony.online/tools/${p.toolSlug}`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: p.h1,
              item: `https://designedbyanthony.online${p.canonicalPath}`,
            },
          ],
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: p.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      },
      {
        '@type': 'SoftwareApplication',
        name: p.toolLabel,
        description: p.toolTagline,
        applicationCategory: 'BusinessApplication',
        offers: {
          '@type': 'Offer',
          price: p.toolPrice.replace(/[^0-9.]/g, ''),
          priceCurrency: 'USD',
          billingIncrement: 'P1M',
        },
        provider: {
          '@type': 'Person',
          name: 'Anthony Jones',
          url: 'https://designedbyanthony.online',
        },
        areaServed: {
          '@type': 'City',
          name: p.cityLabel,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="topbar">
        <a href={`/tools/${p.toolSlug}`} className="topbar-link">
          ← {p.toolLabel}
        </a>
      </header>

      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Tools</a>
        <span aria-hidden="true"> / </span>
        <a href={`/tools/${p.toolSlug}`}>{p.toolLabel}</a>
        <span aria-hidden="true"> / </span>
        <a href={`/tools/${p.toolSlug}/${p.citySlug}/${p.industrySlug}`}>{p.cityLabel}</a>
        <span aria-hidden="true"> / </span>
        <span>{p.industryLabel}</span>
      </nav>

      {/* Hero */}
      <section className="pseo-hero">
        <div className="pseo-hero-inner">
          <p className="hero-eyebrow">
            {p.industryLabel} · {p.cityLabel}
          </p>
          <h1>{p.h1}</h1>
          <p className="hero-sub">{p.lead}</p>
          <div className="hero-cta-group">
            <a href={p.toolUrl} className="btn-primary">
              Open {p.toolLabel} →
            </a>
            <a href={`/tools/${p.toolSlug}`} className="btn-ghost">
              Learn more
            </a>
          </div>
        </div>
      </section>

      {/* What / Who / What you get */}
      <section className="grid-section">
        <div className="detail-two-col">
          <div className="detail-block">
            <p className="section-label">How it works</p>
            <p className="detail-prose">{p.toolDesc.plain}</p>
          </div>
          <div className="detail-meta">
            <div className="detail-meta-row">
              <span className="detail-meta-label">Who it's for</span>
              <span className="detail-meta-value">{p.toolDesc.who}</span>
            </div>
            <div className="detail-meta-row">
              <span className="detail-meta-label">What you get</span>
              <span className="detail-meta-value">{p.toolDesc.what}</span>
            </div>
            <div className="detail-meta-row">
              <span className="detail-meta-label">Price</span>
              <span className="detail-meta-value">
                {p.toolPrice} · No setup fee · Cancel any time
              </span>
            </div>
            <a href={p.toolUrl} className="btn-primary" style={{ marginTop: '8px' }}>
              Open {p.toolLabel} →
            </a>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="grid-section" style={{ marginTop: 0 }}>
        <p className="section-label">Frequently asked questions</p>
        <div className="faq-list">
          {p.faqs.map((faq) => (
            <div key={faq.q} className="faq-item">
              <p className="faq-q">{faq.q}</p>
              <p className="faq-a">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <div className="strip">
        <h2>Ready to save time on {p.toolLabel.toLowerCase().replace(/^(a|an|the)\s/i, '')}?</h2>
        <p>
          {p.toolPrice} · No contracts · Cancel any time. Built for {p.industryLabel.toLowerCase()}{' '}
          businesses in {p.cityLabel}.
        </p>
        <a href={p.toolUrl} className="btn-primary">
          Start free →
        </a>
      </div>

      <footer>
        <div className="footer">
          <span className="footer-brand">Designed by Anthony</span>
          <ul className="footer-links">
            <li>
              <a href="/">All tools</a>
            </li>
            <li>
              <a href={`/tools/${p.toolSlug}`}>{p.toolLabel}</a>
            </li>
            <li>
              <a href="https://designedbyanthony.com" rel="noopener">
                Main Studio
              </a>
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
