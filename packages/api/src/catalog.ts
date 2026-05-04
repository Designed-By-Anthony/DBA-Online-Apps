/**
 * Canonical tool catalog — mirrors pseo.ts from the store app.
 * .online is the source of truth; slugs match TOOL_SLUGS in apps/store/lib/pseo.ts.
 */

export interface CatalogTool {
  slug: string;
  name: string;
  tagline: string;
  price: string;
  url: string;
}

export const TOOL_CATALOG: CatalogTool[] = [
  {
    slug: 'construction-calculator',
    name: 'Construction Calculator',
    tagline: 'Estimate material and labor costs in seconds. Concrete, framing, roofing, and more.',
    price: '$29/mo',
    url: 'https://calculator.designedbyanthony.online',
  },
  {
    slug: 'lead-form-builder',
    name: 'Contact Form Builder',
    tagline: 'Build a contact form in minutes and start getting leads from your website.',
    price: '$49/mo',
    url: 'https://lead-form.designedbyanthony.online',
  },
  {
    slug: 'site-speed-monitor',
    name: 'Website Speed Test',
    tagline: 'Find out the moment your site slows down — before your customers notice.',
    price: '$29/mo',
    url: 'https://web-vitals.designedbyanthony.online',
  },
  {
    slug: 'seo-audit',
    name: 'Local SEO Checker',
    tagline: 'See how your business shows up on Google and get a simple list of what to fix.',
    price: '$49/mo',
    url: 'https://seo-audit.designedbyanthony.online',
  },
  {
    slug: 'cold-outreach',
    name: 'Follow-Up Email Writer',
    tagline: 'Write personalized follow-up emails for every prospect. No CRM needed.',
    price: '$79/mo',
    url: 'https://outreach.designedbyanthony.online',
  },
  {
    slug: 'service-area-map',
    name: 'Service Area Map',
    tagline: 'Show customers and Google exactly which towns you serve.',
    price: '$29/mo',
    url: 'https://service-area.designedbyanthony.online',
  },
  {
    slug: 'lighthouse-scanner',
    name: 'Website Speed Grader',
    tagline: 'Grade your website on speed, SEO, and accessibility. Scan up to five pages at once.',
    price: '$49/mo',
    url: 'https://lighthouse.designedbyanthony.online',
  },
];
