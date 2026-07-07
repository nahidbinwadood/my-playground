'use client';

import { ComponentPreview } from '@/components/showcase/component-preview';
import { ComponentSidebar } from '@/components/showcase/component-sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { useState } from 'react';

export type ComponentItem = {
  id: string;
  name: string;
  category: string;
  component: React.ReactNode;
  code: string;
};

const components: ComponentItem[] = [
  {
    id: 'pricing-card',
    name: 'Pricing Card',
    category: 'Cards',
    component: (
      <Card className="p-6 max-w-sm">
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold">Pro Plan</h3>
            <p className="text-muted-foreground mt-2">
              Perfect for growing teams
            </p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">$29</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              Unlimited projects
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              Advanced analytics
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              Priority support
            </li>
          </ul>
          <Button className="w-full">Get Started</Button>
        </div>
      </Card>
    ),
    code: `import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function PricingCard() {
  return (
    <Card className="p-6 max-w-sm">
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold">Pro Plan</h3>
          <p className="text-muted-foreground mt-2">
            Perfect for growing teams
          </p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">$29</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span className="text-primary">✓</span>
            Unlimited projects
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary">✓</span>
            Advanced analytics
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary">✓</span>
            Priority support
          </li>
        </ul>
        <Button className="w-full">Get Started</Button>
      </div>
    </Card>
  );
}`,
  },
  {
    id: 'stat-card',
    name: 'Stat Card',
    category: 'Cards',
    component: (
      <Card className="p-6 max-w-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </p>
            <p className="text-3xl font-bold">$45,231</p>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+20.1%</span> from last month
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>
      </Card>
    ),
    code: `import { Card } from '@/components/ui/card';

export function StatCard() {
  return (
    <Card className="p-6 max-w-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Total Revenue
          </p>
          <p className="text-3xl font-bold">$45,231</p>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+20.1%</span> from last month
          </p>
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <DollarSign className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}`,
  },

  // ─── Feature Card ─────────────────────────────
  {
    id: 'feature-card',
    name: 'Feature Card',
    category: 'Cards',
    component: (
      <Card className="max-w-sm p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Zap className="h-6 w-6" />
        </div>
        <h3 className="mb-2 font-semibold">Lightning Fast</h3>
        <p className="text-sm text-muted-foreground">
          Built on Next.js 16 with server components for blazing performance out
          of the box.
        </p>
      </Card>
    ),
    code: `import { Card } from '@/components/ui/card';
import { Zap } from 'lucide-react';

export function FeatureCard() {
  return (
    <Card className="max-w-sm p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <Zap className="h-6 w-6" />
      </div>
      <h3 className="mb-2 font-semibold">Lightning Fast</h3>
      <p className="text-sm text-muted-foreground">
        Built on Next.js 16 with server components for blazing performance
        out of the box.
      </p>
    </Card>
  );
}`,
  },

  // ─── Testimonial Card ─────────────────────────
  {
    id: 'testimonial-card',
    name: 'Testimonial Card',
    category: 'Cards',
    component: (
      <Card className="max-w-sm p-6">
        <p className="mb-6 text-sm leading-relaxed">
          &ldquo;This playground saved me hours. The form challenges alone are
          worth it.&rdquo;
        </p>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-400">
            JD
          </div>
          <div>
            <p className="text-sm font-medium">Jane Doe</p>
            <p className="text-xs text-muted-foreground">Frontend Engineer</p>
          </div>
        </div>
      </Card>
    ),
    code: `import { Card } from '@/components/ui/card';

export function TestimonialCard() {
  return (
    <Card className="max-w-sm p-6">
      <p className="mb-6 text-sm leading-relaxed">
        &ldquo;This playground saved me hours. The form challenges alone are
        worth it.&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-400">
          JD
        </div>
        <div>
          <p className="text-sm font-medium">Jane Doe</p>
          <p className="text-xs text-muted-foreground">Frontend Engineer</p>
        </div>
      </div>
    </Card>
  );
}`,
  },

  // ─── Buttons & Badges ─────────────────────────
  {
    id: 'buttons-badges',
    name: 'Buttons & Badges',
    category: 'Elements',
    component: (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-linear-to-r from-emerald-500 to-teal-600 px-3 py-1 text-xs font-medium text-white">
            Gradient
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Success
          </span>
          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            Pending
          </span>
          <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400">
            Error
          </span>
        </div>
      </div>
    ),
    code: `import { Button } from '@/components/ui/button';

export function ButtonsAndBadges() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-linear-to-r from-emerald-500 to-teal-600 px-3 py-1 text-xs font-medium text-white">
          Gradient
        </span>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          Success
        </span>
        <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
          Pending
        </span>
        <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400">
          Error
        </span>
      </div>
    </div>
  );
}`,
  },
];

export default function ComponentsPage() {
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem>(
    components[0]
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Component Showcase
        </h1>
        <p className="text-muted-foreground text-lg">
          Browse and preview reusable React components with live code examples
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <ComponentSidebar
          components={components}
          selectedId={selectedComponent.id}
          onSelect={(id: string) => {
            const component = components.find((c) => c.id === id);
            if (component) setSelectedComponent(component);
          }}
        />
        <div className="flex-1 min-w-0">
          <ComponentPreview component={selectedComponent} />
        </div>
      </div>
    </div>
  );
}
