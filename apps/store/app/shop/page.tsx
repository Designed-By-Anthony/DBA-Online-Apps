import type { Metadata } from 'next';
import { TOOL_LABELS, TOOL_PRICES, TOOL_SLUGS, TOOL_TAGLINES, TOOL_URLS } from '../../lib/pseo';
import { ShopClient } from './ShopClient';

export const metadata: Metadata = {
  title: 'Shop — Select Your Tools | Designed by Anthony',
  description: 'Choose the tools you need for your business and unlock full access.',
};

const PRODUCTS = TOOL_SLUGS.map((slug) => ({
  slug,
  name: TOOL_LABELS[slug],
  tagline: TOOL_TAGLINES[slug],
  price: TOOL_PRICES[slug],
  url: TOOL_URLS[slug],
}));

export default function ShopPage() {
  return <ShopClient products={PRODUCTS} />;
}
