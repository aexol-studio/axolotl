import type { LucideIcon } from 'lucide-react';
import { FileCode2, Zap, Radio, Puzzle, Globe, Palette } from 'lucide-react';

export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const getFeatures = (t: (key: string) => string): Feature[] => [
  {
    title: t('Schema-First Development'),
    description: t('Define your GraphQL schema first, get fully typed resolvers automatically.'),
    icon: FileCode2,
  },
  {
    title: t('Type-Safe Client with Zeus'),
    description: t('End-to-end type safety from schema to frontend with Zeus GraphQL client.'),
    icon: Zap,
  },
  {
    title: t('Real-Time Subscriptions'),
    description: t('Built-in support for GraphQL subscriptions with WebSocket transport.'),
    icon: Radio,
  },
  {
    title: t('Micro-Federation'),
    description: t('Split your API into independent modules that merge seamlessly.'),
    icon: Puzzle,
  },
  {
    title: t('SSR Ready'),
    description: t('Server-side rendering with Vite for fast initial loads and SEO.'),
    icon: Globe,
  },
  {
    title: t('Beautiful UI'),
    description: t('shadcn/ui components with dark mode and full theme customization.'),
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
