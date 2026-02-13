import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { useDynamite } from '@aexol/dynamite';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/HoverCard';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Progress } from '@/components/ui/Progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Separator } from '@/components/ui/Separator';
import { Skeleton } from '@/components/ui/Skeleton';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Textarea } from '@/components/ui/Textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip';

import { SectionCard } from '@/components/atoms';

import { getSampleTableData } from '../Examples.data';

export const DataDisplaySection = () => {
  const { t } = useDynamite();
  const [sliderValue, setSliderValue] = useState([50]);
  const sampleTableData = getSampleTableData(t);

  return (
    <>
      {/* Inputs & Controls */}
      <SectionCard title={t('Inputs & Controls')} description={t('Form elements for user input (display-only demos).')}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Text inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="demo-input">{t('Text Input')}</Label>
              <Input id="demo-input" placeholder={t('Type something...')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-email">{t('Email Input')}</Label>
              <Input id="demo-email" type="email" placeholder="email@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-textarea">{t('Textarea')}</Label>
              <Textarea id="demo-textarea" placeholder={t('Write a longer message here...')} />
            </div>
          </div>

          {/* Selection controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('Select')}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={t('Choose an option')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                  <SelectItem value="svelte">Svelte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('Radio Group')}</Label>
              <RadioGroup defaultValue="option-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-1" id="r1" />
                  <Label htmlFor="r1">{t('Option One')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-2" id="r2" />
                  <Label htmlFor="r2">{t('Option Two')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-3" id="r3" />
                  <Label htmlFor="r3">{t('Option Three')}</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <Separator />

        {/* Toggle controls */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="demo-checkbox" />
            <Label htmlFor="demo-checkbox">{t('Accept terms and conditions')}</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="demo-switch" />
            <Label htmlFor="demo-switch">{t('Enable notifications')}</Label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t('Volume')}</Label>
              <span className="text-sm text-muted-foreground">{sliderValue[0]}%</span>
            </div>
            <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
          </div>
        </div>
      </SectionCard>

      {/* Data Display */}
      <SectionCard title={t('Data Display')} description={t('Tables, progress bars, skeletons, and avatars.')}>
        {/* Progress */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">{t('Progress Bar')}</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t('Upload progress')}</span>
              <span className="font-medium text-foreground">60%</span>
            </div>
            <Progress value={60} />
          </div>
        </div>

        <Separator />

        {/* Skeleton loading */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">{t('Skeleton Loading States')}</h4>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Avatars */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">{t('Avatars')}</h4>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>BS</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>CW</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <Separator />

        {/* Table */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">{t('Table')}</h4>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('Name')}</TableHead>
                  <TableHead>{t('Status')}</TableHead>
                  <TableHead>{t('Role')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleTableData.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === t('Active') ? 'default' : 'secondary'}>{row.status}</Badge>
                    </TableCell>
                    <TableCell>{row.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SectionCard>

      {/* Navigation */}
      <SectionCard
        title={t('Navigation')}
        description={t('Accordions, tabs, and breadcrumbs for content organization.')}
      >
        {/* Breadcrumb */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">{t('Breadcrumb')}</h4>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">{t('Home')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">{t('Documentation')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('Components')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Separator />

        {/* Accordion */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">{t('Accordion')}</h4>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>{t('What is Axolotl?')}</AccordionTrigger>
              <AccordionContent>
                {t(
                  'Axolotl is a type-safe, schema-first GraphQL framework. It generates TypeScript types from your GraphQL schema and provides a fully typed resolver experience.',
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>{t('What is Zeus?')}</AccordionTrigger>
              <AccordionContent>
                {t(
                  'Zeus is a type-safe GraphQL client that generates TypeScript types from your schema. It allows you to write queries using plain JavaScript objects instead of GraphQL strings.',
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>{t('What is shadcn/ui?')}</AccordionTrigger>
              <AccordionContent>
                {t(
                  'shadcn/ui is a collection of re-usable components built with Radix UI and Tailwind CSS. Components are copied into your project, giving you full ownership and control.',
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <Separator />

        {/* Nested Tabs */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">{t('Nested Tabs')}</h4>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">{t('Overview')}</TabsTrigger>
              <TabsTrigger value="features">{t('Features')}</TabsTrigger>
              <TabsTrigger value="docs">{t('Documentation')}</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="rounded-md border p-4">
              <p className="text-sm text-muted-foreground">
                {t(
                  'This is the overview tab content. Tabs are great for organizing related content into switchable panels.',
                )}
              </p>
            </TabsContent>
            <TabsContent value="features" className="rounded-md border p-4">
              <p className="text-sm text-muted-foreground">
                {t('Feature highlights: type-safe queries, auto-generated types, schema-first development, and more.')}
              </p>
            </TabsContent>
            <TabsContent value="docs" className="rounded-md border p-4">
              <p className="text-sm text-muted-foreground">
                {t('Visit the documentation for detailed guides, API references, and best practices.')}
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </SectionCard>

      {/* Overlays & Dialogs */}
      <SectionCard title={t('Overlays & Dialogs')} description={t('Modals, popovers, tooltips, and hover cards.')}>
        <div className="flex flex-wrap gap-3">
          {/* Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">{t('Open Dialog')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('Example Dialog')}</DialogTitle>
                <DialogDescription>
                  {t('This is a modal dialog. It overlays the page content and requires interaction before returning.')}
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                {t('Dialogs are great for confirmations, forms, or detailed views that need focused attention.')}
              </p>
              <DialogFooter>
                <Button variant="outline">{t('Cancel')}</Button>
                <Button>{t('Continue')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">{t('Open Popover')}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">{t('Popover Content')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t(
                    'Popovers are non-modal and appear adjacent to their trigger element. Great for additional context or quick actions.',
                  )}
                </p>
              </div>
            </PopoverContent>
          </Popover>

          {/* Tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">{t('Hover for Tooltip')}</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('This is a tooltip with helpful information')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Hover Card */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">@axolotl</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarFallback>AX</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">@axolotl</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('A type-safe, schema-first GraphQL framework for building modern APIs.')}
                  </p>
                  <div className="flex items-center pt-2">
                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                    <span className="text-xs text-muted-foreground">{t('Created December 2023')}</span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </SectionCard>
    </>
  );
};
