import type { LucideIcon } from 'lucide-react';
import { FileCode2, Zap, Radio, Puzzle, Globe, Palette } from 'lucide-react';

export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const features: Feature[] = [
  {
    title: 'Schema-First Development',
    description: 'Define your GraphQL schema first, get fully typed resolvers automatically.',
    icon: FileCode2,
  },
  {
    title: 'Type-Safe Client with Zeus',
    description: 'End-to-end type safety from schema to frontend with Zeus GraphQL client.',
    icon: Zap,
  },
  {
    title: 'Real-Time Subscriptions',
    description: 'Built-in support for GraphQL subscriptions with WebSocket transport.',
    icon: Radio,
  },
  {
    title: 'Micro-Federation',
    description: 'Split your API into independent modules that merge seamlessly.',
    icon: Puzzle,
  },
  {
    title: 'SSR Ready',
    description: 'Server-side rendering with Vite for fast initial loads and SEO.',
    icon: Globe,
  },
  {
    title: 'Beautiful UI',
    description: 'shadcn/ui components with dark mode and full theme customization.',
    icon: Palette,
  },
];

export const techStackItems = [
  'Axolotl',
  'GraphQL Yoga',
  'Zeus',
  'React',
  'Vite SSR',
  'Tailwind CSS v4',
  'shadcn/ui',
  'Zustand',
  'React Hook Form',
  'Zod',
];
