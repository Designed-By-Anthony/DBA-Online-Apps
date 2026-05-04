'use client';

import { useAuthState } from '@dba/ui/useAuthState';
import { CalculatorHub } from './CalculatorHub';

export function GatedWorkspace() {
  const auth = useAuthState();
  return <CalculatorHub locked={auth !== 'paid'} />;
}
