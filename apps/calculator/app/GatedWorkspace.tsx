'use client';

import { DemoGate } from '@dba/ui/DemoGate';
import { CalculatorHub } from './CalculatorHub';
import { DemoResults } from './DemoResults';

export function GatedWorkspace() {
  return (
    <DemoGate
      appName="Construction Calculator"
      tagline="Concrete, framing, roofing, insulation, and more. Type a number and get your answer."
      demoContent={<DemoResults />}
    >
      <CalculatorHub />
    </DemoGate>
  );
}
