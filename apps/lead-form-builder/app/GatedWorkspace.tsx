'use client';

import { DemoGate } from '@dba/ui/DemoGate';
import { DemoResults } from './DemoResults';
import { Workspace } from './Workspace';

export function GatedWorkspace() {
  return (
    <DemoGate
      appName="Contact Form Builder"
      tagline="Create a form in minutes and start getting leads from your website."
      demoContent={<DemoResults />}
    >
      <Workspace />
    </DemoGate>
  );
}
