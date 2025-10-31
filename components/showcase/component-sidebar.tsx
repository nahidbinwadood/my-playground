'use client';

import { ComponentItem } from '@/app/(homepage)/components/page';
import { cn } from '@/lib/utils';

type ComponentSidebarProps = {
  components: ComponentItem[];
  selectedId: string;
  onSelect: any;
};

export function ComponentSidebar({
  components,
  selectedId,
  onSelect,
}: ComponentSidebarProps) {
  const categories = Array.from(new Set(components.map((c) => c.category)));

  return (
    <aside className="w-full lg:w-64 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Components</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {components.length} components
          </p>
        </div>
        <nav className="p-2">
          {categories.map((category) => (
            <div key={category} className="mb-4 last:mb-0">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {category}
              </div>
              <div className="space-y-1">
                {components
                  .filter((c) => c.category === category)
                  .map((component) => (
                    <button
                      key={component.id}
                      onClick={() => onSelect(component.id)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                        selectedId === component.id
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {component.name}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
