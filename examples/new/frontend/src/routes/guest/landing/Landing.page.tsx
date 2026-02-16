// Landing page - rendered with SSR
// Pure marketing page with hero, features, CTA, and footer
import { Link } from 'react-router';
import { useDynamite } from '@aexol/dynamite';
import { Separator } from '@/components/ui/Separator';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getFeatures, techStackItems } from './Landing.data';

export const Landing = () => {
  const { t } = useDynamite();
  const features = getFeatures(t);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          {t('Build Type-Safe GraphQL Apps')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t(
            'Axolotl is a schema-first GraphQL framework with end-to-end type safety, auto-generated resolvers, and a modern React frontend.',
          )}
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button size="lg" asChild>
            <Link to="/login">{t('Get Started')}</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/examples">{t('View Examples')}</Link>
          </Button>
        </div>
      </section>

      <Separator />

      <section className="space-y-8">
        {/* Section heading */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground">{t('Everything You Need')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('A complete fullstack toolkit for building modern GraphQL applications.')}
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-muted p-2">
                    <feature.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tech stack badges */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground text-center">{t('Tech Stack')}</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {techStackItems.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      <section className="text-center space-y-4 py-12">
        <h2 className="text-2xl font-semibold text-foreground">{t('Ready to get started?')}</h2>
        <Button size="lg" asChild>
          <Link to="/login">{t('Sign In')}</Link>
        </Button>
      </section>

      <footer className="text-center py-6">
        <p className="text-muted-foreground text-sm">{t('Powered by Axolotl + GraphQL Yoga + Zeus')}</p>
      </footer>
    </div>
  );
};
