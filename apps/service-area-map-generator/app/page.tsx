'use client';

import { DemoGate } from '@dba/ui';
import { DemoResults } from './DemoResults';

export default function Home() {
  return (
    <DemoGate
      appName="Service Area Map Generator"
      tagline="Show customers and Google exactly where you work — map embed, schema block, and service city list in seconds."
      demoContent={<DemoResults />}
    />
  );
}
