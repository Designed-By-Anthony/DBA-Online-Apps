'use client';

import { DemoGate } from '@dba/ui/DemoGate';
import { DemoResults } from './DemoResults';
import { Workspace } from './Workspace';

export function GatedWorkspace() {
  return (
    <DemoGate
      appName="Cold Outreach Sequencer"
      tagline="No CRM required. Paste prospects, generate a full 5-step sequence."
      demoContent={<DemoResults />}
    >
      <Workspace />
    </DemoGate>
  );
}
