// ── pSEO data for designedbyanthony.online/tools store ─────────────────────
// Pattern: /tools/[tool]/[city]/[industry] → unique landing page per combo
// 7 tools × 16 cities × 15 industries = 1,680 pages (all high-signal combos)

export const TOOL_SLUGS = [
  'construction-calculator',
  'lead-form-builder',
  'site-speed-monitor',
  'seo-audit',
  'cold-outreach',
  'service-area-map',
  'lighthouse-scanner',
] as const;

export type ToolSlug = (typeof TOOL_SLUGS)[number];

export const CITY_SLUGS = [
  'utica-ny',
  'rome-ny',
  'syracuse-ny',
  'albany-ny',
  'buffalo-ny',
  'rochester-ny',
  'watertown-ny',
  'schenectady-ny',
  'troy-ny',
  'plattsburgh-ny',
  'glens-falls-ny',
  'amsterdam-ny',
  'new-hartford-ny',
  'herkimer-ny',
  'oneida-ny',
  'new-york-city-ny',
] as const;

export type CitySlug = (typeof CITY_SLUGS)[number];

export const INDUSTRY_SLUGS = [
  'contractors',
  'hvac',
  'plumbing',
  'electrical',
  'roofing',
  'landscaping',
  'home-services',
  'construction',
  'medspa',
  'healthcare',
  'legal',
  'automotive',
  'retail',
  'hospitality',
  'professional-services',
] as const;

export type IndustrySlug = (typeof INDUSTRY_SLUGS)[number];

// ── Labels ─────────────────────────────────────────────────────────────────

export const TOOL_LABELS: Record<ToolSlug, string> = {
  'construction-calculator': 'Construction Calculator',
  'lead-form-builder': 'Lead Form Builder',
  'site-speed-monitor': 'Site Speed Monitor',
  'seo-audit': 'SEO Audit Kit',
  'cold-outreach': 'Cold Outreach Sequencer',
  'service-area-map': 'Service Area Map Generator',
  'lighthouse-scanner': 'Lighthouse Batch Scanner',
};

export const TOOL_URLS: Record<ToolSlug, string> = {
  'construction-calculator': 'https://calculator.designedbyanthony.online',
  'lead-form-builder': 'https://lead-form.designedbyanthony.online',
  'site-speed-monitor': 'https://web-vitals.designedbyanthony.online',
  'seo-audit': 'https://seo-audit.designedbyanthony.online',
  'cold-outreach': 'https://outreach.designedbyanthony.online',
  'service-area-map': 'https://service-area.designedbyanthony.online',
  'lighthouse-scanner': 'https://lighthouse.designedbyanthony.online',
};

export const TOOL_PRICES: Record<ToolSlug, string> = {
  'construction-calculator': '$29/mo',
  'lead-form-builder': '$49/mo',
  'site-speed-monitor': '$29/mo',
  'seo-audit': '$49/mo',
  'cold-outreach': '$79/mo',
  'service-area-map': '$29/mo',
  'lighthouse-scanner': '$49/mo',
};

export const TOOL_TAGLINES: Record<ToolSlug, string> = {
  'construction-calculator':
    'Accurate job estimates in seconds — concrete, framing, roofing, and more.',
  'lead-form-builder':
    'Build smart contact forms that send leads straight to your inbox or CRM.',
  'site-speed-monitor':
    'Know the moment your site slows down, before your customers notice.',
  'seo-audit':
    'See exactly why Google ranks your competitors above you and how to fix it.',
  'cold-outreach':
    'Send personalized follow-up sequences to prospects without the manual work.',
  'service-area-map':
    'Show Google and your customers the exact towns you serve.',
  'lighthouse-scanner':
    'Grade every page on your site for speed, SEO, and accessibility in one run.',
};

export const TOOL_DESCRIPTIONS: Record<ToolSlug, { plain: string; who: string; what: string }> = {
  'construction-calculator': {
    plain:
      'Type in your job dimensions and the calculator tells you exactly how much material you need — concrete bags, lumber, shingles, whatever the job calls for. No more guessing or under-ordering.',
    who: 'Contractors, estimators, and project managers who price jobs daily.',
    what: 'Material quantities, bag counts, cost estimates, and waste factors for concrete, framing, roofing, and more.',
  },
  'lead-form-builder': {
    plain:
      'Create a contact form in minutes, drop it on your site, and get new leads delivered exactly where you need them — email, text, or your CRM. No developer needed.',
    who: 'Any service business that wants more calls and form submissions from their website.',
    what: 'Custom form builder, spam protection, instant notifications, and CRM-ready exports.',
  },
  'site-speed-monitor': {
    plain:
      'We check your website every week for the three speed signals Google actually grades you on. If something slips, you get an alert before it costs you rankings.',
    who: 'Business owners and web managers who want to stay fast without checking manually.',
    what: 'Weekly Core Web Vitals scans, trend history, and regression alerts by email.',
  },
  'seo-audit': {
    plain:
      'Run your business through the same checklist Google uses when deciding where to rank you in local search. You get a scored report with clear action items — not a wall of jargon.',
    who: 'Local service businesses serious about showing up when customers search.',
    what: 'Google Business Profile review, citation consistency, on-page SEO grade, and a fix list sorted by impact.',
  },
  'cold-outreach': {
    plain:
      'Upload a list of prospects, write one good email, and let the tool handle the follow-up timing. You focus on the conversations; we handle the reminders.',
    who: 'Agencies, consultants, and B2B service providers who prospect by email.',
    what: 'Personalized email sequences, prospect status tracking, and reply detection.',
  },
  'service-area-map': {
    plain:
      'Tell us the towns you cover, and we generate an embeddable map you can drop on your website. Google sees structured location data; customers see exactly where you work.',
    who: 'Service businesses that travel to customers — HVAC, plumbing, landscaping, and more.',
    what: 'Embeddable service-area map, SEO-structured location data, and copy-paste embed code.',
  },
  'lighthouse-scanner': {
    plain:
      'Paste in your site URLs and get a full performance, accessibility, and SEO grade on every page at once — the same test Google runs, but automated across your whole site.',
    who: 'Web designers, agencies, and site owners managing multiple pages.',
    what: 'Batch Lighthouse audits, per-page scores, PDF report, and prioritized fix list.',
  },
};

export const CITY_LABELS: Record<CitySlug, string> = {
  'utica-ny': 'Utica, NY',
  'rome-ny': 'Rome, NY',
  'syracuse-ny': 'Syracuse, NY',
  'albany-ny': 'Albany, NY',
  'buffalo-ny': 'Buffalo, NY',
  'rochester-ny': 'Rochester, NY',
  'watertown-ny': 'Watertown, NY',
  'schenectady-ny': 'Schenectady, NY',
  'troy-ny': 'Troy, NY',
  'plattsburgh-ny': 'Plattsburgh, NY',
  'glens-falls-ny': 'Glens Falls, NY',
  'amsterdam-ny': 'Amsterdam, NY',
  'new-hartford-ny': 'New Hartford, NY',
  'herkimer-ny': 'Herkimer, NY',
  'oneida-ny': 'Oneida, NY',
  'new-york-city-ny': 'New York City, NY',
};

export const INDUSTRY_LABELS: Record<IndustrySlug, string> = {
  contractors: 'General Contractors',
  hvac: 'HVAC',
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  roofing: 'Roofing',
  landscaping: 'Landscaping',
  'home-services': 'Home Services',
  construction: 'Construction',
  medspa: 'Medspa & Aesthetics',
  healthcare: 'Healthcare',
  legal: 'Legal',
  automotive: 'Automotive',
  retail: 'Retail',
  hospitality: 'Hospitality',
  'professional-services': 'Professional Services',
};

// ── pSEO page payload builder ──────────────────────────────────────────────

export interface ToolPagePayload {
  toolSlug: ToolSlug;
  toolLabel: string;
  toolUrl: string;
  toolPrice: string;
  toolTagline: string;
  toolDesc: { plain: string; who: string; what: string };
  citySlug: CitySlug;
  cityLabel: string;
  industrySlug: IndustrySlug;
  industryLabel: string;
  canonicalPath: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  faqs: Array<{ q: string; a: string }>;
}

export function buildToolPagePayload(
  toolSlug: ToolSlug,
  citySlug: CitySlug,
  industrySlug: IndustrySlug,
): ToolPagePayload {
  const toolLabel = TOOL_LABELS[toolSlug];
  const cityLabel = CITY_LABELS[citySlug];
  const industryLabel = INDUSTRY_LABELS[industrySlug];
  const toolUrl = TOOL_URLS[toolSlug];
  const toolPrice = TOOL_PRICES[toolSlug];
  const toolTagline = TOOL_TAGLINES[toolSlug];
  const toolDesc = TOOL_DESCRIPTIONS[toolSlug];
  const canonicalPath = `/tools/${toolSlug}/${citySlug}/${industrySlug}`;

  const h1 = `${toolLabel} for ${industryLabel} in ${cityLabel}`;
  const title = `${h1} — Designed by Anthony`;
  const description = `${toolTagline} Built for ${industryLabel.toLowerCase()} businesses in ${cityLabel} — no setup fees, no long-term contract.`;

  const lead = `${industryLabel} businesses in ${cityLabel} use the ${toolLabel} to save time on the work that doesn't need to be manual. ${toolDesc.plain} Start free, upgrade when it pays for itself.`;

  const faqs: Array<{ q: string; a: string }> = [
    {
      q: `Is this built for ${industryLabel.toLowerCase()} businesses specifically?`,
      a: `Yes. The ${toolLabel} is used by ${industryLabel.toLowerCase()} operators across ${cityLabel} and surrounding areas. The defaults and workflows are tuned for the way service businesses actually operate — not generic office software.`,
    },
    {
      q: 'Do I need to be technical to use it?',
      a: `No. If you can fill out a form on your phone, you can use this tool. ${toolDesc.what}`,
    },
    {
      q: `How much does it cost?`,
      a: `${toolPrice}. No setup fees, no annual commitment required. Cancel any time.`,
    },
    {
      q: `Does it work on mobile?`,
      a: `Yes — it is built mobile-first. Most ${industryLabel.toLowerCase()} contractors in ${cityLabel} check it from the job site or truck.`,
    },
    {
      q: `Who builds and supports this?`,
      a: `Designed by Anthony — a one-person digital infrastructure studio based in Rome, NY. You reach the same person who built it, not a support ticket queue.`,
    },
  ];

  return {
    toolSlug,
    toolLabel,
    toolUrl,
    toolPrice,
    toolTagline,
    toolDesc,
    citySlug,
    cityLabel,
    industrySlug,
    industryLabel,
    canonicalPath,
    title,
    description,
    h1,
    lead,
    faqs,
  };
}

export function listAllToolPaths(): {
  tool: ToolSlug;
  city: CitySlug;
  industry: IndustrySlug;
}[] {
  const out: { tool: ToolSlug; city: CitySlug; industry: IndustrySlug }[] = [];
  for (const tool of TOOL_SLUGS) {
    for (const city of CITY_SLUGS) {
      for (const industry of INDUSTRY_SLUGS) {
        out.push({ tool, city, industry });
      }
    }
  }
  return out;
}
