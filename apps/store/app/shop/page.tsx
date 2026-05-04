import type { Metadata } from 'next';
import { ShopClient } from './ShopClient';

export const metadata: Metadata = {
  title: 'Shop — Select Your Tools | Designed by Anthony',
  description: 'Choose the tools you need for your business and unlock full access.',
};

/**
 * Canonical product catalog — matches Stripe products exactly.
 * Slugs here must match the keys in the .com checkout route.
 */
const PRODUCTS = [
  {
    slug: 'sitescan',
    name: 'SiteScan — Website Health Reports',
    tagline: 'Grade your website on speed, SEO, and accessibility. Scan up to five pages at once.',
    starter: '$19/mo',
    pro: '$39/mo',
    agency: '$79/mo',
  },
  {
    slug: 'reviewpilot',
    name: 'ReviewPilot — AI Review Response',
    tagline: 'See how your business shows up on Google and get a simple list of what to fix.',
    starter: '$29/mo',
    pro: '$49/mo',
    agency: '$79/mo',
  },
  {
    slug: 'clienthub',
    name: 'ClientHub — Client Portal',
    tagline: 'Build a contact form in minutes and start getting leads from your website.',
    starter: '$29/mo',
    pro: '$49/mo',
    agency: '$79/mo',
  },
  {
    slug: 'localrank',
    name: 'LocalRank — Local SEO Dashboard',
    tagline: 'Simple local SEO tracking for service businesses. Monitor rankings and competitors.',
    starter: '$19/mo',
    pro: '$39/mo',
    agency: '$59/mo',
  },
  {
    slug: 'testiflow',
    name: 'TestiFlow — Testimonial Collector',
    tagline: 'Automated testimonial and review collection. Send requests and embed widgets.',
    starter: '$19/mo',
    pro: '$29/mo',
    agency: '$49/mo',
  },
  {
    slug: 'contentmill',
    name: 'ContentMill — AI Social Content',
    tagline: 'Turn one photo or update into posts for every platform. AI-powered templates.',
    starter: '$19/mo',
    pro: '$39/mo',
    agency: '$69/mo',
  },
];

export default function ShopPage() {
  return <ShopClient products={PRODUCTS} />;
}
