'use client';

import { DemoGate } from '@dba/ui/DemoGate';
import { DemoResults } from './DemoResults';
import { Workspace } from './Workspace';

export function GatedWorkspace() {
  return (
    <DemoGate
      appName="Website Speed Grader"
      tagline="Scan up to five pages at once and see exactly what to fix first."
      demoContent={<DemoResults />}
    >
      <Workspace />
    </DemoGate>
  );
}
