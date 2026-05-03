import basePreset from '@dba/config-tailwind';
import type { Config } from 'tailwindcss';

const config = {
  presets: [basePreset],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
} satisfies Config;

export default config;
