import type { Metadata } from 'next';
import { GatedWorkspace } from './GatedWorkspace';

export const metadata: Metadata = {
  title: 'Free Construction Calculator — Estimate Materials and Labor in Seconds',
  description:
    'Free construction calculator for concrete, framing, roofing, and more. Get accurate material and labor estimates in seconds. No sign-up required.',
  openGraph: {
    title: 'Free Construction Calculator — Designed by Anthony',
    description:
      'Estimate concrete, framing, roofing, and labor costs instantly. Free for contractors — no sign-up needed.',
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
          <p className="calc-hero-eyebrow">14 free calculators for contractors</p>
          <h1 className="calc-hero-title">Free Construction&nbsp;Calculator</h1>
          <p className="calc-hero-sub">
            Estimate materials and labor costs in seconds. Concrete, framing, roofing, insulation,
            and more — no sign-up, no ads.
          </p>
        </div>
      </header>

      {/* Client-side gated workspace */}
      <GatedWorkspace />
    </>
  );
}
