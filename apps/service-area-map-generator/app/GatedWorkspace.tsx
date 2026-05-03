'use client';

import { DemoGate } from '@dba/ui/DemoGate';
import { DemoResults } from './DemoResults';
import { Workspace } from './Workspace';

export function GatedWorkspace() {
  return (
    <DemoGate
      appName="Service Area Map"
      tagline="Enter the towns you serve and get a map you can paste on your website."
      demoContent={<DemoResults />}
    >
      <Workspace />
    </DemoGate>
  );
}
