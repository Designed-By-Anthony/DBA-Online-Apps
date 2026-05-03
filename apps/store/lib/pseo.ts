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
  'lead-form-builder': 'Contact Form Builder',
  'site-speed-monitor': 'Website Speed Test',
  'seo-audit': 'Local SEO Checker',
  'cold-outreach': 'Follow-Up Email Writer',
  'service-area-map': 'Service Area Map',
  'lighthouse-scanner': 'Website Speed Grader',
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
    'Estimate material and labor costs in seconds. Concrete, framing, roofing, and more.',
  'lead-form-builder': 'Build a contact form in minutes and start getting leads from your website.',
  'site-speed-monitor': 'Find out the moment your site slows down — before your customers notice.',
  'seo-audit': 'See how your business shows up on Google and get a simple list of what to fix.',
  'cold-outreach': 'Write personalized follow-up emails for every prospect. No CRM needed.',
  'service-area-map': 'Show customers and Google exactly which towns you serve.',
  'lighthouse-scanner':
    'Grade your website on speed, SEO, and accessibility. Scan up to five pages at once.',
};

export const TOOL_DESCRIPTIONS: Record<ToolSlug, { plain: string; who: string; what: string }> = {
  'construction-calculator': {
    plain:
      'Type in your measurements and the calculator tells you how much material you need. Concrete bags, lumber, shingles — whatever the job calls for. No more guessing or over-ordering.',
    who: 'Contractors, estimators, and project managers who price jobs every day.',
    what: 'Material quantities, bag counts, cost estimates, and waste factors for concrete, framing, roofing, and more.',
  },
  'lead-form-builder': {
    plain:
      'Build a contact form in minutes and put it on your website. New leads get sent straight to your email or phone. No coding or developer needed.',
    who: 'Any service business that wants more calls and form fills from their website.',
    what: 'Simple form builder, spam protection, instant notifications, and CRM-ready exports.',
  },
  'site-speed-monitor': {
    plain:
      'We check your website every week for the speed signals Google actually grades you on. If something slips, you get an alert before it hurts your rankings.',
    who: 'Business owners who want to keep their site fast without checking it themselves.',
    what: 'Weekly speed scans, trend history, and email alerts when something slows down.',
  },
  'seo-audit': {
    plain:
      'Run your business through the same checklist Google uses when deciding where to rank you. You get a scored report with clear steps to take — no jargon, just action items.',
    who: 'Local service businesses that want to show up when customers search.',
    what: 'Google Business Profile review, listing accuracy, on-page SEO grade, and a fix list sorted by impact.',
  },
  'cold-outreach': {
    plain:
      'Paste a list of prospects and let the tool write your follow-up emails. You handle the conversations — we handle the reminders and timing.',
    who: 'Agencies, consultants, and service businesses that reach out by email.',
    what: 'Personalized email sequences, prospect tracking, and follow-up reminders.',
  },
  'service-area-map': {
    plain:
      'Enter the towns you cover and get an embeddable map for your website. Google sees structured location data. Customers see exactly where you work.',
    who: 'Service businesses that travel to customers — HVAC, plumbing, landscaping, and more.',
    what: 'Embeddable service-area map, location data for Google, and copy-paste embed code.',
  },
  'lighthouse-scanner': {
    plain:
      'Paste your website URLs and get a full speed, accessibility, and SEO grade on every page at once. The same test Google runs, but covering your whole site in one click.',
    who: 'Business owners, web designers, and agencies managing multiple pages.',
    what: 'Multi-page website audit, per-page scores, PDF report, and a prioritized fix list.',
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
  const description = `${toolTagline} Built for ${industryLabel.toLowerCase()} businesses in ${cityLabel}. No setup fees, no long-term contract.`;

  const lead = `${industryLabel} businesses in ${cityLabel} use the ${toolLabel} to save time on the work that does not need to be done by hand. ${toolDesc.plain} Try it free. Upgrade when it pays for itself.`;

  const faqs: Array<{ q: string; a: string }> = [
    {
      q: `Is this built for ${industryLabel.toLowerCase()} businesses?`,
      a: `Yes. The ${toolLabel} is used by ${industryLabel.toLowerCase()} businesses across ${cityLabel} and nearby areas. It is set up for the way service businesses actually work — not generic office software.`,
    },
    {
      q: 'Do I need to be tech-savvy to use it?',
      a: `Not at all. If you can fill out a form on your phone, you can use this. ${toolDesc.what}`,
    },
    {
      q: `How much does it cost?`,
      a: `${toolPrice}. No setup fees, no annual commitment required. Cancel any time.`,
    },
    {
      q: `Does it work on my phone?`,
      a: `Yes. It is built for mobile first. Most ${industryLabel.toLowerCase()} businesses in ${cityLabel} use it right from the job site or the truck.`,
    },
    {
      q: `Who builds and supports this?`,
      a: `Anthony Jones, based in Rome, NY. One person builds and supports every tool. You reach the same person who made it — not a support ticket queue.`,
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
