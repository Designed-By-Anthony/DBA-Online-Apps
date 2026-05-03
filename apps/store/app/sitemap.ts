import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';
import { TOOL_SLUGS, listAllToolPaths } from '../lib/pseo';

const BASE = 'https://designedbyanthony.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    // Homepage
    {
      url: BASE,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // Individual tool landing pages
    ...TOOL_SLUGS.map((slug) => ({
      url: `${BASE}/tools/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    // pSEO pages (1,680 combos)
    ...listAllToolPaths().map(({ tool, city, industry }) => ({
      url: `${BASE}/tools/${tool}/${city}/${industry}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return routes;
}
