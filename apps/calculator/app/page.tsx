import type { Metadata } from 'next';
import { GatedWorkspace } from './GatedWorkspace';

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
  return (
    <>
      {/* SEO-visible content — always in the DOM for Googlebot */}
      <header className="calc-hero">
        <div className="calc-hero-inner">
          <p className="calc-hero-eyebrow">14 calculators · free to use</p>
          <h1 className="calc-hero-title">Construction&nbsp;Calculator</h1>
          <p className="calc-hero-sub">
            Concrete, framing, roofing, insulation, flooring, electrical, and labor. Type a number
            and get your answer — no login, no ads.
          </p>
        </div>
      </header>

      {/* Client-side gated workspace */}
      <GatedWorkspace />
    </>
  );
}
