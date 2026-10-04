import PageHeader from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { JOURNAL_TIME_ZONE, TReminderStatus } from '@/lib/journal';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';

const todayFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: JOURNAL_TIME_ZONE,
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

const REMINDER_CHIP: Record<TReminderStatus['kind'], string> = {
  logged: 'bg-signal/12 text-signal-ink',
  next: 'bg-warn/15 text-warn-ink',
  done: 'bg-muted text-muted-foreground',
};

const reminderText = (status: TReminderStatus) =>
  status.kind === 'logged'
    ? 'Logged today'
    : status.kind === 'next'
      ? `Next reminder ${status.slot}:00`
      : 'No more reminders today';

const DashboardHeader = ({
  reminder,
  notesUnavailable,
}: {
  reminder: TReminderStatus;
  notesUnavailable: boolean;
}) => (
  <PageHeader
    eyebrow={todayFmt.format(new Date()).toLowerCase()}
    title="Overview"
    subtitle="Where the streak stands, what was logged, and what is still a draft."
    action={
      <>
        {notesUnavailable ? null : (
          <span
            className={cn(
              'rounded-full px-3 py-1.5 font-mono text-xs',
              REMINDER_CHIP[reminder.kind]
            )}
          >
            {reminderText(reminder)}
          </span>
        )}
        <Button asChild variant="outline">
          <Link href="/admin/blogs/create-blog">New post</Link>
        </Button>
        <Button asChild className="gap-2">
          <Link href="/admin/notes/create-note">
            <Plus className="size-4" aria-hidden="true" />
            New note
          </Link>
        </Button>
      </>
    }
  />
);

export default DashboardHeader;
