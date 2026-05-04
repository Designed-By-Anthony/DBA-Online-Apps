'use client';

import { useAuthState } from '@dba/ui/useAuthState';
import { Workspace } from './Workspace';

export function GatedWorkspace() {
  const auth = useAuthState();
  return <Workspace locked={auth !== 'paid'} />;
}
