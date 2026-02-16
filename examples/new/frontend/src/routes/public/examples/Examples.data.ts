export const techStack = [
  'Axolotl GraphQL',
  'GraphQL Yoga',
  'Zeus (Type-safe Client)',
  'React 19',
  'TypeScript',
  'Vite',
  'Tailwind CSS v4',
  'shadcn/ui',
  'React Router v7',
  'Zustand',
  'React Query v5',
  'React Hook Form',
  'Zod',
  'Sonner',
  'Lucide Icons',
];

export type SampleTableRow = {
  name: string;
  status: string;
  role: string;
};

export const getSampleTableData = (t: (key: string) => string): SampleTableRow[] => [
  { name: 'Alice Johnson', status: t('Active'), role: t('Admin') },
  { name: 'Bob Smith', status: t('Inactive'), role: t('Editor') },
  { name: 'Carol Williams', status: t('Active'), role: t('Viewer') },
  { name: 'David Brown', status: t('Active'), role: t('Editor') },
];
