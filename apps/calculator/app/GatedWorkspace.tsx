'use client';

import { DemoGate } from '@dba/ui/DemoGate';
import { CalculatorHub } from './CalculatorHub';
import { DemoResults } from './DemoResults';

export function GatedWorkspace() {
  return (
    <DemoGate
      appName="Construction Calculator"
      tagline="Estimate materials and labor costs in seconds. No spreadsheet required."
      demoContent={<DemoResults />}
    >
      <CalculatorHub />
    </DemoGate>
  );
}
