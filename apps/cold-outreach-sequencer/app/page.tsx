'use client';

import { DemoGate } from '@dba/ui/DemoGate';
import { DemoResults } from './DemoResults';

export default function Home() {
  return (
    <DemoGate
      appName="Cold Outreach Sequencer"
      tagline="Write personalized follow-up emails — no CRM required. Paste prospects, generate a full 5-step sequence."
      demoContent={<DemoResults />}
    />
  );
}
