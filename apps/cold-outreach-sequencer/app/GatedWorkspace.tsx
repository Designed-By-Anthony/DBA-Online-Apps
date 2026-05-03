'use client';

import { DemoGate } from '@dba/ui/DemoGate';
import { DemoResults } from './DemoResults';
import { Workspace } from './Workspace';

export function GatedWorkspace() {
  return (
    <DemoGate
      appName="Follow-Up Email Writer"
      tagline="Paste your prospect list and get a ready-to-send email sequence."
      demoContent={<DemoResults />}
    >
      <Workspace />
    </DemoGate>
  );
}
