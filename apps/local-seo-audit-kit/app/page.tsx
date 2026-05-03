'use client';

import { DemoGate } from '@dba/ui';
import { DemoResults } from './DemoResults';

export default function Home() {
  return (
    <DemoGate
      appName="Local SEO Audit Kit"
      tagline="See how your business looks to Google — a quick checklist for local visibility and trust."
      demoContent={<DemoResults />}
    />
  );
}
