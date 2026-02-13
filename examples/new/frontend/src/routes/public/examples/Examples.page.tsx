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
import { DataDisplaySection, FormsShowcaseTab, GraphQLShowcaseTab } from './components';

export const ExamplesPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Axolotl Starter</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A fullstack GraphQL application showcasing Axolotl, Zeus, React, and shadcn/ui
        </p>
      </div>

      <Separator />

      {/* Tech Stack Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Tech Stack</h2>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="graphql">GraphQL</TabsTrigger>
        </TabsList>

        {/* ==================== COMPONENTS TAB ==================== */}
        <TabsContent value="components" className="space-y-6 mt-6">
          <div className="space-y-6">
            {/* Buttons & Badges */}
            <SectionCard title="Buttons & Badges" description="Interactive elements in every variant and size.">
              {/* Button variants */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Button Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="default">Default</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              {/* Button sizes */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Button Sizes</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">
                    <Plus />
                  </Button>
                </div>
              </div>

              {/* Buttons with icons */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">With Icons</h4>
                <div className="flex flex-wrap gap-3">
                  <Button>
                    <Mail /> Send Email
                  </Button>
                  <Button variant="outline">
                    <Settings /> Settings
                  </Button>
                  <Button variant="secondary">
                    <MessageSquare /> Chat
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Badge variants */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Badge Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>
            </SectionCard>

            {/* Cards & Alerts */}
            <SectionCard title="Cards & Alerts" description="Content containers and notification banners.">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Example card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Update</CardTitle>
                    <CardDescription>Latest changes to the codebase</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      The new authentication system has been deployed. All users will need to re-authenticate on their
                      next visit.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" size="sm">
                      Dismiss
                    </Button>
                    <Button size="sm">View Details</Button>
                  </CardFooter>
                </Card>

                {/* Alerts */}
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>This is an informational alert using the default variant.</AlertDescription>
                  </Alert>

                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Something went wrong. Please try again later.</AlertDescription>
                  </Alert>
                </div>
              </div>
            </SectionCard>

            {/* Toggle & Groups */}
            <SectionCard
              title="Toggle & Groups"
              description="Toggle buttons for switching states and grouped selections."
            >
              <div className="grid gap-6 md:grid-cols-2">
                {/* Individual toggles */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Toggle Buttons</h4>
                  <div className="flex gap-2">
                    <Toggle aria-label="Toggle bold" variant="outline">
                      <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle aria-label="Toggle italic" variant="outline">
                      <Italic className="h-4 w-4" />
                    </Toggle>
                    <Toggle aria-label="Toggle underline" variant="outline">
                      <Underline className="h-4 w-4" />
                    </Toggle>
                  </div>
                </div>

                {/* Toggle group — single selection */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Toggle Group (Single)</h4>
                  <ToggleGroup type="single" defaultValue="center" variant="outline">
                    <ToggleGroupItem value="left" aria-label="Align left">
                      <AlignLeft className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="center" aria-label="Align center">
                      <AlignCenter className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="right" aria-label="Align right">
                      <AlignRight className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>

              <Separator />

              {/* Toggle group — multiple selection */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Toggle Group (Multiple)</h4>
                <ToggleGroup type="multiple" variant="outline">
                  <ToggleGroupItem value="bold" aria-label="Toggle bold">
                    <Bold className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="italic" aria-label="Toggle italic">
                    <Italic className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="underline" aria-label="Toggle underline">
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
      </Tabs>
    </div>
  );
};
