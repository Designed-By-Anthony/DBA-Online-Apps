import type { Metadata } from 'next';
import { CalculatorHub } from './CalculatorHub';

export const metadata: Metadata = {
  title: 'Construction Calculator — Material Estimator for Contractors',
  description:
    'Free construction calculators for concrete, framing, roofing, insulation, flooring, electrical, and labor. No login required. Built for contractors and field crews.',
  openGraph: {
    title: 'Construction Calculator — Designed by Anthony',
    description:
      'Concrete, framing, roofing, insulation, flooring, electrical, and labor calculators. Free for contractors.',
    url: 'https://calculator.designedbyanthony.online',
    type: 'website',
  },
};

export default function CalculatorPage() {
  return <CalculatorHub />;
}
