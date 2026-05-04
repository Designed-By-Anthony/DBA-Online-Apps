import { NextResponse } from 'next/server';
import {
  TOOL_DESCRIPTIONS,
  TOOL_LABELS,
  TOOL_PRICES,
  TOOL_SLUGS,
  TOOL_TAGLINES,
  TOOL_URLS,
  type ToolSlug,
} from '../../../lib/pseo';

export const runtime = 'edge';

/**
 * GET /api/tools — canonical tool catalog.
 * .com fetches this endpoint to mirror .online pricing & descriptions.
 */
export function GET() {
  const tools = TOOL_SLUGS.map((slug: ToolSlug) => ({
    slug,
    name: TOOL_LABELS[slug],
    price: TOOL_PRICES[slug],
    tagline: TOOL_TAGLINES[slug],
    url: TOOL_URLS[slug],
    description: TOOL_DESCRIPTIONS[slug],
  }));

  return NextResponse.json(
    { tools },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    },
  );
}
