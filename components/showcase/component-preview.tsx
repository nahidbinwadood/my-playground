'use client';

import { ComponentItem } from '@/app/(homepage)/components/page';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

type ComponentPreviewProps = {
  component: ComponentItem;
};

export function ComponentPreview({ component }: ComponentPreviewProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(component.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{component.name}</h2>
        <p className="text-muted-foreground mt-1">
          Category: <span className="font-medium">{component.category}</span>
        </p>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="mt-4">
          <Card className="p-8 min-h-[400px] flex items-center justify-center bg-muted/50">
            {component.component}
          </Card>
        </TabsContent>
        <TabsContent value="code" className="mt-4">
          <div className="relative">
            <Button
              size="sm"
              variant="outline"
              className="absolute top-4 right-4 z-10"
              onClick={copyCode}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Card className="p-6 bg-muted">
              <pre className="text-sm overflow-x-auto">
                <code>{component.code}</code>
              </pre>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
