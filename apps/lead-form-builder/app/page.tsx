'use client';

import { DemoGate } from '@dba/ui/DemoGate';
import { DemoResults } from './DemoResults';

export default function Home() {
  return (
    <DemoGate
      appName="Lead Form Builder"
      tagline="Build a contact form in minutes — drop it on your website, get leads emailed or sent wherever you want."
      demoContent={<DemoResults />}
    />
  );
}
