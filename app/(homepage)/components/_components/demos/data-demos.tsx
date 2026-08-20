'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { SpecimenTag } from '../specimen';

const headCell = 'font-mono text-[0.6875rem] uppercase tracking-[0.12em]';

const rows = [
  { id: 'BLG-104', title: 'Debouncing an async check', type: 'Frontend', status: 'signal' as const, statusLabel: 'Published' },
  { id: 'BLG-103', title: 'Server actions without an ORM', type: 'Backend', status: 'warn' as const, statusLabel: 'Draft' },
  { id: 'BLG-102', title: 'Narrowing unions in Zod v4', type: 'JavaScript', status: 'signal' as const, statusLabel: 'Published' },
];

export function TableDemo() {
  return (
    <div className="w-full">
      <Table>
        <TableCaption className="text-xs">
          Three of the most recent posts.
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-surface hover:bg-surface">
            <TableHead className={headCell}>Id</TableHead>
            <TableHead className={headCell}>Title</TableHead>
            <TableHead className={headCell}>Type</TableHead>
            <TableHead className={`${headCell} text-right`}>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                {row.id}
              </TableCell>
              <TableCell className="font-medium">{row.title}</TableCell>
              <TableCell className="font-mono text-xs">{row.type}</TableCell>
              <TableCell className="text-right">
                <SpecimenTag tone={row.status}>{row.statusLabel}</SpecimenTag>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ProgressDemo() {
  const [value, setValue] = useState(60);
  const step = (delta: number) =>
    setValue((current) => Math.min(100, Math.max(0, current + delta)));

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <span className="label-mono">Upload</span>
        <span className="font-mono text-sm tabular-nums text-foreground">
          {value}%
        </span>
      </div>
      <Progress value={value} aria-label="Upload progress" />
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => step(-10)}
          aria-label="Decrease progress by 10 percent"
        >
          <Minus />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => step(10)}
          aria-label="Increase progress by 10 percent"
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
}

export function AvatarDemo() {
  const people = ['NW', 'JD', 'AK', 'RS'];

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex -space-x-2">
        {people.map((initials) => (
          <Avatar key={initials} className="ring-2 ring-card">
            <AvatarFallback className="bg-surface font-mono text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          <AvatarFallback className="bg-surface font-mono text-sm">
            NW
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-mono text-sm tracking-tight">Nahid Bin Wadood</p>
          <p className="text-xs text-muted-foreground">
            Falls back to initials when no image loads.
          </p>
        </div>
      </div>
    </div>
  );
}

export function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border border-border bg-card"
    />
  );
}

// Mirrors the blog card: media block, two title lines, meta row.
export function SkeletonDemo() {
  return (
    <div className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-card p-4">
      <Skeleton className="aspect-[16/9] w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
      <div className="flex items-center gap-3 border-t border-line pt-3">
        <Skeleton className="size-8 shrink-0 rounded-full" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="ml-auto h-3 w-12" />
      </div>
    </div>
  );
}
