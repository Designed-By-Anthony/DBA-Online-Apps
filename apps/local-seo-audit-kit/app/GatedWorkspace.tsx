'use client';

import { DemoGate } from '@dba/ui/DemoGate';
import { DemoResults } from './DemoResults';
import { Workspace } from './Workspace';

export function GatedWorkspace() {
  return (
    <DemoGate
      appName="Local SEO Audit Kit"
      tagline="A quick checklist for local visibility and trust."
      demoContent={<DemoResults />}
    >
      <Workspace />
    </DemoGate>
  );
}
