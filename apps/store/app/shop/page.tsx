import type { Metadata } from 'next';
import { TOOL_LABELS, TOOL_PRICES, TOOL_SLUGS, TOOL_TAGLINES, type ToolSlug } from '../../lib/pseo';
import { ShopClient } from './ShopClient';

export const metadata: Metadata = {
  title: 'Shop — Select Your Tools | Designed by Anthony',
  description: 'Choose the tools you need for your business and unlock full access.',
};

export default function ShopPage() {
  const tools = TOOL_SLUGS.map((slug: ToolSlug) => ({
    slug,
    name: TOOL_LABELS[slug],
    price: TOOL_PRICES[slug],
    tagline: TOOL_TAGLINES[slug],
  }));

  return <ShopClient tools={tools} />;
}
