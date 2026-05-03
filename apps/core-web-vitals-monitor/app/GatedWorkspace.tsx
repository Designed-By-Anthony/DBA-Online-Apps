'use client';

import { DemoGate } from '@dba/ui/DemoGate';
import { DemoResults } from './DemoResults';
import { Workspace } from './Workspace';

export function GatedWorkspace() {
  return (
    <DemoGate
      appName="Website Speed Test"
      tagline="See the same speed score Google uses to rank your site. Takes 30 seconds."
      demoContent={<DemoResults />}
    >
      <Workspace />
    </DemoGate>
  );
}
