import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface SectionCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const SectionCard = ({ title, description, children }: SectionCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">{children}</CardContent>
  </Card>
);
