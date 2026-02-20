import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlertCircle,
  Bold,
  Info,
  Italic,
  Mail,
  MessageSquare,
  Plus,
  Settings,
  Underline,
} from 'lucide-react';
import { useDynamite } from '@aexol/dynamite';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Toggle } from '@/components/ui/Toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/ToggleGroup';

import { SectionCard } from '@/components/atoms';

import { techStack } from './Examples.data';
import { DataDisplaySection, FormsShowcaseTab, GraphQLShowcaseTab, NotesShowcase } from './components';

export const ExamplesPage = () => {
  const { t } = useDynamite();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Axolotl Starter</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('A fullstack GraphQL application showcasing Axolotl, Zeus, React, and shadcn/ui')}
        </p>
      </div>

      <Separator />

      {/* Tech Stack Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">{t('Tech Stack')}</h2>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </section>

      <Separator />

      {/* Tabbed Showcase */}
      <Tabs defaultValue="components" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="components">{t('Components')}</TabsTrigger>
          <TabsTrigger value="forms">{t('Forms')}</TabsTrigger>
          <TabsTrigger value="graphql">GraphQL</TabsTrigger>
          <TabsTrigger value="notes">{t('Notes')}</TabsTrigger>
        </TabsList>

        {/* ==================== COMPONENTS TAB ==================== */}
        <TabsContent value="components" className="space-y-6 mt-6">
          <div className="space-y-6">
            {/* Buttons & Badges */}
            <SectionCard
              title={t('Buttons & Badges')}
              description={t('Interactive elements in every variant and size.')}
            >
              {/* Button variants */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">{t('Button Variants')}</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="default">{t('Default')}</Button>
                  <Button variant="destructive">{t('Destructive')}</Button>
                  <Button variant="outline">{t('Outline')}</Button>
                  <Button variant="secondary">{t('Secondary')}</Button>
                  <Button variant="ghost">{t('Ghost')}</Button>
                  <Button variant="link">{t('Link')}</Button>
                </div>
              </div>

              {/* Button sizes */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">{t('Button Sizes')}</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">{t('Small')}</Button>
                  <Button size="default">{t('Default')}</Button>
                  <Button size="lg">{t('Large')}</Button>
                  <Button size="icon">
                    <Plus />
                  </Button>
                </div>
              </div>

              {/* Buttons with icons */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">{t('With Icons')}</h4>
                <div className="flex flex-wrap gap-3">
                  <Button>
                    <Mail /> {t('Send Email')}
                  </Button>
                  <Button variant="outline">
                    <Settings /> {t('Settings')}
                  </Button>
                  <Button variant="secondary">
                    <MessageSquare /> {t('Chat')}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Badge variants */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">{t('Badge Variants')}</h4>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default">{t('Default')}</Badge>
                  <Badge variant="secondary">{t('Secondary')}</Badge>
                  <Badge variant="destructive">{t('Destructive')}</Badge>
                  <Badge variant="outline">{t('Outline')}</Badge>
                </div>
              </div>
            </SectionCard>

            {/* Cards & Alerts */}
            <SectionCard title={t('Cards & Alerts')} description={t('Content containers and notification banners.')}>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Example card */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('Project Update')}</CardTitle>
                    <CardDescription>{t('Latest changes to the codebase')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t(
                        'The new authentication system has been deployed. All users will need to re-authenticate on their next visit.',
                      )}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" size="sm">
                      {t('Dismiss')}
                    </Button>
                    <Button size="sm">{t('View Details')}</Button>
                  </CardFooter>
                </Card>

                {/* Alerts */}
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>{t('Information')}</AlertTitle>
                    <AlertDescription>
                      {t('This is an informational alert using the default variant.')}
                    </AlertDescription>
                  </Alert>

                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t('Error')}</AlertTitle>
                    <AlertDescription>{t('Something went wrong. Please try again later.')}</AlertDescription>
                  </Alert>
                </div>
              </div>
            </SectionCard>

            {/* Toggle & Groups */}
            <SectionCard
              title={t('Toggle & Groups')}
              description={t('Toggle buttons for switching states and grouped selections.')}
            >
              <div className="grid gap-6 md:grid-cols-2">
                {/* Individual toggles */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">{t('Toggle Buttons')}</h4>
                  <div className="flex gap-2">
                    <Toggle aria-label={t('Toggle bold')} variant="outline">
                      <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle aria-label={t('Toggle italic')} variant="outline">
                      <Italic className="h-4 w-4" />
                    </Toggle>
                    <Toggle aria-label={t('Toggle underline')} variant="outline">
                      <Underline className="h-4 w-4" />
                    </Toggle>
                  </div>
                </div>

                {/* Toggle group — single selection */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">{t('Toggle Group (Single)')}</h4>
                  <ToggleGroup type="single" defaultValue="center" variant="outline">
                    <ToggleGroupItem value="left" aria-label={t('Align left')}>
                      <AlignLeft className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="center" aria-label={t('Align center')}>
                      <AlignCenter className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="right" aria-label={t('Align right')}>
                      <AlignRight className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>

              <Separator />

              {/* Toggle group — multiple selection */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">{t('Toggle Group (Multiple)')}</h4>
                <ToggleGroup type="multiple" variant="outline">
                  <ToggleGroupItem value="bold" aria-label={t('Toggle bold')}>
                    <Bold className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="italic" aria-label={t('Toggle italic')}>
                    <Italic className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="underline" aria-label={t('Toggle underline')}>
                    <Underline className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </SectionCard>

            <DataDisplaySection />
          </div>
        </TabsContent>

        {/* ==================== FORMS TAB ==================== */}
        <TabsContent value="forms" className="space-y-6 mt-6">
          <FormsShowcaseTab />
        </TabsContent>

        {/* ==================== GRAPHQL TAB ==================== */}
        <TabsContent value="graphql" className="space-y-6 mt-6">
          <GraphQLShowcaseTab />
        </TabsContent>

        {/* ==================== NOTES TAB ==================== */}
        <TabsContent value="notes" className="space-y-6 mt-6">
          <NotesShowcase />
        </TabsContent>
      </Tabs>
    </div>
  );
};
