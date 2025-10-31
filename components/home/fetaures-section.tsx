import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Code2, Layers, Palette, Shield, Workflow, Zap } from 'lucide-react';

const features = [
  {
    name: 'Component Showcase',
    description:
      'Explore a curated collection of reusable React components with live previews and source code.',
    icon: Layers,
  },
  {
    name: 'Form Validation',
    description:
      'Master complex form validation patterns with real-world challenges using React Hook Form.',
    icon: Shield,
  },
  {
    name: 'Type Safety',
    description:
      'Full TypeScript support with strict typing for robust and maintainable code.',
    icon: Code2,
  },
  {
    name: 'Modern Stack',
    description:
      'Built with Next.js 15, Tailwind CSS 4, and the latest web development best practices.',
    icon: Zap,
  },
  {
    name: 'DRY Principles',
    description:
      'Demonstrating clean code architecture with reusable patterns and component composition.',
    icon: Workflow,
  },
  {
    name: 'Beautiful Design',
    description:
      'Production-ready UI components with shadcn/ui and thoughtful design system.',
    icon: Palette,
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32 bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to experiment
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A comprehensive playground designed for learning, experimenting, and
            building production-ready React applications.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.name}
                className="relative overflow-hidden transition-all hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
