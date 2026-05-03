'use client';

import { DemoGate } from '@dba/ui/DemoGate';
import { DemoResults } from './DemoResults';
import { Workspace } from './Workspace';

export function GatedWorkspace() {
  return (
    <DemoGate
      appName="Core Web Vitals Monitor"
      tagline="The same way Google grades it for real users on mobile."
      demoContent={<DemoResults />}
    >
      <Workspace />
    </DemoGate>
  );
}
