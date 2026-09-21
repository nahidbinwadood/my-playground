import { JOURNAL_TIME_ZONE } from '@/lib/journal';

// Dates are rendered in the journal's timezone, not the reader's: a note logged
// at 01:00 Dhaka belongs to that day, and the timeline, the streak and the
// calendar all say so. Locale and zone are both explicit, so the server render
// and the client render cannot disagree.
const dateFmt = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: JOURNAL_TIME_ZONE,
});

export const formatNoteDate = (value?: string) =>
  value ? dateFmt.format(new Date(value)) : '—';
