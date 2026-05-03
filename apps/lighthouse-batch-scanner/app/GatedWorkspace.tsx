'use client';

import { DemoGate } from '@dba/ui/DemoGate';
import { DemoResults } from './DemoResults';
import { Workspace } from './Workspace';

export function GatedWorkspace() {
  return (
    <DemoGate
      appName="Lighthouse Batch Scanner"
      tagline="Scan up to five URLs at once using Google PageSpeed Insights."
      demoContent={<DemoResults />}
    >
      <Workspace />
    </DemoGate>
  );
}
