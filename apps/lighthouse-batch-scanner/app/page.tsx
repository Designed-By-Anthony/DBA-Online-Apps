'use client';

import { DemoGate } from '@dba/ui';
import { DemoResults } from './DemoResults';

export default function Home() {
  return (
    <DemoGate
      appName="Lighthouse Batch Scanner"
      tagline="Grade your website's speed, SEO, and accessibility — up to five URLs at once using Google PageSpeed Insights."
      demoContent={<DemoResults />}
    />
  );
}
