'use client';

import { DemoGate } from '@dba/ui';
import { DemoResults } from './DemoResults';

export default function Home() {
  return (
    <DemoGate
      appName="Construction Calculator"
      tagline="Free construction calculators for concrete, framing, roofing, insulation, flooring, electrical, and labor."
      demoContent={<DemoResults />}
    />
  );
}
