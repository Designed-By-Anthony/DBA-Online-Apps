'use client';

import { DemoGate } from '@dba/ui/DemoGate';
import { DemoResults } from './DemoResults';
import { Workspace } from './Workspace';

export function GatedWorkspace() {
  return (
    <DemoGate
      appName="Service Area Map Generator"
      tagline="Generate a map embed, schema block, and service city list in seconds."
      demoContent={<DemoResults />}
    >
      <Workspace />
    </DemoGate>
  );
}
