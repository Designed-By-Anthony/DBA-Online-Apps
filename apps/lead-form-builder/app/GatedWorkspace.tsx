'use client';

import { DemoGate } from '@dba/ui/DemoGate';
import { DemoResults } from './DemoResults';
import { Workspace } from './Workspace';

export function GatedWorkspace() {
  return (
    <DemoGate
      appName="Lead Form Builder"
      tagline="Drop it on your website, get leads emailed or sent wherever you want."
      demoContent={<DemoResults />}
    >
      <Workspace />
    </DemoGate>
  );
}
