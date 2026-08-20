'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Check, Server, TrendingUp } from 'lucide-react';

export function PricingCardDemo() {
  const included = [
    'Unlimited projects',
    'Usage analytics',
    'Priority support',
  ];

  return (
    <Card className="w-full max-w-sm gap-0 rounded-lg p-6">
      <div className="space-y-1">
        <p className="label-mono">Team</p>
        <h4 className="text-xl font-semibold tracking-tight">
          Shared workspaces
        </h4>
        <p className="text-sm leading-relaxed text-muted-foreground">
          For teams reviewing each other&rsquo;s work.
        </p>
      </div>

      <div className="mt-5 flex items-baseline gap-1.5">
        <span className="font-mono text-4xl font-semibold tabular-nums tracking-[-0.03em]">
          $29
        </span>
        <span className="font-mono text-sm text-muted-foreground">
          / month
        </span>
      </div>

      <ul className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
        {included.map((item) => (
          <li key={item} className="flex items-center gap-2.5">
            <Check aria-hidden="true" className="size-4 shrink-0 text-signal" />
            {item}
          </li>
        ))}
      </ul>

      <Button className="mt-6 w-full">Start team plan</Button>
    </Card>
  );
}

export function StatCardDemo() {
  return (
    <Card className="w-full max-w-sm gap-0 rounded-lg p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="label-mono">Total revenue</p>
          <p className="font-mono text-3xl font-semibold tabular-nums tracking-[-0.03em]">
            $45,231
          </p>
          <p className="flex items-center gap-1.5 font-mono text-xs tabular-nums text-muted-foreground">
            <TrendingUp aria-hidden="true" className="size-3.5 text-signal" />
            +20.1% against last month
          </p>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-line bg-surface">
          <span className="font-mono text-sm">$</span>
        </div>
      </div>
    </Card>
  );
}

export function FeatureCardDemo() {
  return (
    <Card className="w-full max-w-sm gap-0 rounded-lg p-6">
      <div className="mb-4 flex size-10 items-center justify-center rounded-md border border-line bg-surface">
        <Server aria-hidden="true" className="size-5 text-muted-foreground" />
      </div>
      <h4 className="font-mono text-base font-semibold tracking-tight">
        Server components by default
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Pages render on the server, so the browser only downloads the parts that
        actually need to be interactive.
      </p>
    </Card>
  );
}

export function TestimonialCardDemo() {
  return (
    <Card className="w-full max-w-sm gap-0 rounded-lg p-6">
      <p className="text-sm leading-relaxed">
        &ldquo;The async username check is the exact problem I had at work last
        week. I read the source and shipped the fix that afternoon.&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <Avatar>
          <AvatarFallback className="bg-surface font-mono text-xs">
            JD
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-mono text-sm tracking-tight">Jane Doe</p>
          <p className="text-xs text-muted-foreground">Frontend engineer</p>
        </div>
      </div>
    </Card>
  );
}
