'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TabsDemo() {
  return (
    <Tabs defaultValue="preview" className="w-full max-w-md">
      <TabsList className="w-full">
        <TabsTrigger value="preview" className="font-mono text-xs">
          Preview
        </TabsTrigger>
        <TabsTrigger value="props" className="font-mono text-xs">
          Props
        </TabsTrigger>
        <TabsTrigger value="notes" className="font-mono text-xs">
          Notes
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="preview"
        className="rounded-md border border-line bg-surface p-4 text-sm leading-relaxed text-muted-foreground"
      >
        The panel keeps its own scroll position when you switch away and back.
      </TabsContent>
      <TabsContent
        value="props"
        className="rounded-md border border-line bg-surface p-4"
      >
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-mono text-xs">
          <dt className="text-muted-foreground">defaultValue</dt>
          <dd>string</dd>
          <dt className="text-muted-foreground">orientation</dt>
          <dd>horizontal | vertical</dd>
          <dt className="text-muted-foreground">activationMode</dt>
          <dd>automatic | manual</dd>
        </dl>
      </TabsContent>
      <TabsContent
        value="notes"
        className="rounded-md border border-line bg-surface p-4 text-sm leading-relaxed text-muted-foreground"
      >
        Arrow keys move between triggers; Home and End jump to the ends.
      </TabsContent>
    </Tabs>
  );
}

export function AccordionDemo() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="tokens"
      className="w-full max-w-md"
    >
      <AccordionItem value="tokens">
        <AccordionTrigger className="font-mono text-sm tracking-tight">
          Where do the colors come from?
        </AccordionTrigger>
        <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
          Every surface reads a semantic token defined in app/globals.css, so
          light and dark are the same markup with different variables.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="motion">
        <AccordionTrigger className="font-mono text-sm tracking-tight">
          Is the open and close animated?
        </AccordionTrigger>
        <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
          Height animates over 200ms. If you have reduced motion turned on, the
          panel snaps instead.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="keyboard">
        <AccordionTrigger className="font-mono text-sm tracking-tight">
          Does it work from the keyboard?
        </AccordionTrigger>
        <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
          Tab reaches each trigger, Enter or Space toggles it, and the focus
          ring stays visible the whole way through.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
