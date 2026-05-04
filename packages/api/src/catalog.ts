/**
 * Canonical tool catalog — matches Stripe products exactly.
 * Slugs here must match the checkout route on .com and PRODUCT_META in dashboards.
 */

export interface CatalogTool {
  slug: string;
  name: string;
  tagline: string;
  starter: { month: number; year: number };
  pro: { month: number; year: number };
  agency: { month: number; year: number };
}

export const TOOL_CATALOG: CatalogTool[] = [
  {
    slug: 'sitescan',
    name: 'SiteScan — Website Health Reports',
    tagline: 'Grade your website on speed, SEO, and accessibility. Scan up to five pages at once.',
    starter: { month: 1900, year: 19000 },
    pro: { month: 3900, year: 39000 },
    agency: { month: 7900, year: 79000 },
  },
  {
    slug: 'reviewpilot',
    name: 'ReviewPilot — AI Review Response',
    tagline: 'See how your business shows up on Google and get a simple list of what to fix.',
    starter: { month: 2900, year: 29000 },
    pro: { month: 4900, year: 49000 },
    agency: { month: 7900, year: 79000 },
  },
  {
    slug: 'clienthub',
    name: 'ClientHub — Client Portal',
    tagline: 'Build a contact form in minutes and start getting leads from your website.',
    starter: { month: 2900, year: 29000 },
    pro: { month: 4900, year: 49000 },
    agency: { month: 7900, year: 79000 },
  },
  {
    slug: 'localrank',
    name: 'LocalRank — Local SEO Dashboard',
    tagline: 'Simple local SEO tracking for service businesses. Monitor rankings and competitors.',
    starter: { month: 1900, year: 19000 },
    pro: { month: 3900, year: 39000 },
    agency: { month: 5900, year: 59000 },
  },
  {
    slug: 'testiflow',
    name: 'TestiFlow — Testimonial Collector',
    tagline: 'Automated testimonial and review collection. Send requests and embed widgets.',
    starter: { month: 1900, year: 19000 },
    pro: { month: 2900, year: 29000 },
    agency: { month: 4900, year: 49000 },
  },
  {
    slug: 'contentmill',
    name: 'ContentMill — AI Social Content',
    tagline: 'Turn one photo or update into posts for every platform. AI-powered templates.',
    starter: { month: 1900, year: 19000 },
    pro: { month: 3900, year: 39000 },
    agency: { month: 6900, year: 69000 },
  },
];
