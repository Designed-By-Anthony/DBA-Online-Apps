'use client';

import { DemoGate } from '@dba/ui/DemoGate';
import { DemoResults } from './DemoResults';
import { Workspace } from './Workspace';

export function GatedWorkspace() {
  return (
    <DemoGate
      appName="Local SEO Checker"
      tagline="Find out if customers can find you on Google. Quick and free."
      demoContent={<DemoResults />}
    >
      <Workspace />
    </DemoGate>
  );
}
