'use client';

import { cn } from '@/lib/utils';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { z } from 'zod';

// Real Zod v4 schemas — the console below runs safeParse against these on
// every keystroke. Nothing here is canned output.
const emailSchema = z.email('Enter a full address, like you@example.com');

const passwordSchema = z
  .string()
  .min(8, 'Use at least 8 characters')
  .regex(/[A-Z]/, 'Add an uppercase letter')
  .regex(/\d/, 'Add a number');

const semverSchema = z
  .string()
  .regex(
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/,
    'Use major.minor.patch, like 1.4.0 or 2.0.0-rc.1'
  );

const SCHEMA_KEYS = ['email', 'password', 'semver'] as const;
type SchemaKey = (typeof SCHEMA_KEYS)[number];

const SCHEMAS = {
  email: {
    call: 'z.email()',
    placeholder: 'you@example.com',
    idle: 'Type an address. It is parsed on every keystroke.',
    run: (input: string) => emailSchema.safeParse(input),
  },
  password: {
    call: 'z.string().min(8).regex(…)',
    placeholder: 'At least 8 characters',
    idle: 'Type a password. Every failing check is listed at once.',
    run: (input: string) => passwordSchema.safeParse(input),
  },
  semver: {
    call: 'z.string().regex(semver)',
    placeholder: '1.4.0',
    idle: 'Type a version number, including the patch segment.',
    run: (input: string) => semverSchema.safeParse(input),
  },
};

const DEMO_VALUE = 'dev@playground.local';
const DEMO_SPEED_MS = 45;

function pad(count: number) {
  return String(count).padStart(3, '0');
}

export function ValidationConsole() {
  const inputId = useId();
  const resultId = useId();

  const [active, setActive] = useState<SchemaKey>('email');
  const [value, setValue] = useState('');
  const [keystrokes, setKeystrokes] = useState(0);
  // The empty string is parsed once on mount, so the counter starts at 1.
  const [parses, setParses] = useState(1);
  const [userDriving, setUserDriving] = useState(false);

  const userDrivingRef = useRef(false);
  const demoTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopDemo = useCallback(() => {
    if (demoTimer.current !== null) {
      clearInterval(demoTimer.current);
      demoTimer.current = null;
    }
  }, []);

  // Self-type a demo address on mount so the console arrives mid-thought.
  useEffect(() => {
    let typed = 0;

    demoTimer.current = setInterval(() => {
      if (userDrivingRef.current) {
        stopDemo();
        return;
      }
      typed += 1;
      setValue(DEMO_VALUE.slice(0, typed));
      setParses((count) => count + 1);
      if (typed >= DEMO_VALUE.length) stopDemo();
    }, DEMO_SPEED_MS);

    return stopDemo;
  }, [stopDemo]);

  // First focus or first edit hands the field to the reader and wipes the demo.
  const takeOver = useCallback(() => {
    if (userDrivingRef.current) return;
    userDrivingRef.current = true;
    stopDemo();
    setUserDriving(true);
    setValue('');
    setParses((count) => count + 1);
  }, [stopDemo]);

  const spec = SCHEMAS[active];
  const result = useMemo(() => spec.run(value), [spec, value]);

  const state = value.length === 0 ? 'idle' : result.success ? 'ok' : 'fail';

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!userDrivingRef.current) {
      takeOver();
      return;
    }
    setValue(event.target.value);
    setKeystrokes((count) => count + 1);
    setParses((count) => count + 1);
  };

  const selectSchema = (key: SchemaKey) => {
    stopDemo();
    if (key === active) return;
    setActive(key);
    setParses((count) => count + 1);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {/* Instrument strip: active schema on the left, live counters on the right. */}
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2.5">
        <p className="flex min-w-0 items-center gap-2 font-mono text-xs text-foreground">
          <span
            aria-hidden="true"
            className={cn(
              'size-1.5 shrink-0 rounded-full',
              state === 'ok' && 'bg-signal',
              state === 'fail' && 'bg-fail',
              state === 'idle' && 'bg-muted-foreground/60'
            )}
          />
          <span className="truncate">zod · {active}</span>
        </p>
        <p className="shrink-0 font-mono text-[0.6875rem] tabular-nums text-muted-foreground">
          keys {pad(keystrokes)} · parses {pad(parses)}
        </p>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div role="group" aria-label="Schema" className="flex flex-wrap gap-1.5">
          {SCHEMA_KEYS.map((key) => {
            const isActive = key === active;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={isActive}
                onClick={() => selectSchema(key)}
                className={cn(
                  'rounded-md border px-2.5 py-1 font-mono text-xs transition-colors',
                  isActive
                    ? 'border-border bg-secondary text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                )}
              >
                {key}
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <label htmlFor={inputId} className="label-mono block">
            Test value
          </label>
          <div className="relative">
            <input
              id={inputId}
              type="text"
              value={value}
              onChange={handleChange}
              onFocus={takeOver}
              aria-describedby={resultId}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder={spec.placeholder}
              className={cn(
                'w-full rounded-md border bg-background px-3 py-2.5 font-mono text-sm text-foreground transition-colors placeholder:text-muted-foreground',
                state === 'ok' && 'border-signal',
                state === 'fail' && 'border-fail',
                state === 'idle' && 'border-line'
              )}
            />
            {/* Ghost caret that trails the self-typed demo. Transparent copy of
                the value keeps it aligned; it disappears on first interaction. */}
            {!userDriving && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center overflow-hidden rounded-md border border-transparent px-3 font-mono text-sm"
              >
                <span className="whitespace-pre text-transparent">{value}</span>
                <span className="ml-px h-4 w-0.5 shrink-0 animate-blink bg-foreground" />
              </div>
            )}
          </div>
        </div>

        <div
          id={resultId}
          aria-live="polite"
          aria-atomic="true"
          className="min-h-[6.75rem] rounded-md border border-line bg-surface p-3 font-mono text-xs leading-relaxed"
        >
          {state === 'idle' && (
            <div className="space-y-1 text-muted-foreground">
              <p>
                <span className="text-foreground">idle</span> — no input yet
              </p>
              <p className="break-all">{spec.call}</p>
              <p>{spec.idle}</p>
            </div>
          )}

          {state === 'ok' && result.success && (
            <div className="space-y-1.5">
              <p className="text-muted-foreground">
                <span className="text-signal">ok</span> — safeParse returned data
              </p>
              <pre className="whitespace-pre-wrap break-all text-foreground">
                {`{\n  "schema": "${active}",\n  "data": ${JSON.stringify(result.data)}\n}`}
              </pre>
            </div>
          )}

          {state === 'fail' && !result.success && (
            <div className="space-y-1.5">
              <p className="text-muted-foreground">
                <span className="text-fail">fail</span> —{' '}
                {result.error.issues.length}{' '}
                {result.error.issues.length === 1 ? 'issue' : 'issues'}
              </p>
              <ul className="space-y-1">
                {result.error.issues.map((issue, index) => (
                  <li
                    key={`${issue.code}-${index}`}
                    className="flex gap-2 break-words"
                  >
                    <span aria-hidden="true" className="text-fail">
                      !
                    </span>
                    <span className="text-foreground">
                      <span className="text-muted-foreground">
                        {issue.code}
                      </span>{' '}
                      {issue.message}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
