'use client';

import { DemoGate } from '@dba/ui/DemoGate';
import { DemoResults } from './DemoResults';

export default function Home() {
  return (
    <DemoGate
      appName="Core Web Vitals Monitor"
      tagline="Test how fast your website loads — the same way Google grades it for real users on mobile."
      demoContent={<DemoResults />}
    />
  );
}
