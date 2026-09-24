// Run: pnpm check:journal. Dhaka is UTC+6, so each instant below is written in
// UTC with its Dhaka wall time beside it.
import assert from 'node:assert/strict';
import { getReminderStatus } from '../lib/journal.ts';

const at = (iso) => new Date(iso);

assert.deepEqual(getReminderStatus(true, at('2026-09-24T16:30:00Z')), { kind: 'logged' }); // 22:30, logged
assert.deepEqual(getReminderStatus(false, at('2026-09-24T11:59:00Z')), { kind: 'next', slot: 18 }); // 17:59
assert.deepEqual(getReminderStatus(false, at('2026-09-24T12:30:00Z')), { kind: 'next', slot: 22 }); // 18:30
assert.deepEqual(getReminderStatus(false, at('2026-09-24T16:00:00Z')), { kind: 'next', slot: 23 }); // 22:00
assert.deepEqual(getReminderStatus(false, at('2026-09-24T17:10:00Z')), { kind: 'done' }); // 23:10
assert.deepEqual(getReminderStatus(false, at('2026-09-24T18:30:00Z')), { kind: 'next', slot: 18 }); // 00:30 next day

console.log('journal: ok');
