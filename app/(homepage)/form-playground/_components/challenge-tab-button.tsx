'use client';

import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { memo, useCallback, useEffect, useRef } from 'react';
import { IChallenge } from '../types';

const ChallengeTabButton = memo(
  ({
    challenge,
    isSelected,
    onSelect,
  }: {
    challenge: IChallenge;
    isSelected: boolean;
    onSelect: (id: string) => void;
  }) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const hasMounted = useRef(false);

    const handleTabChange = useCallback(() => {
      onSelect(challenge.id);
    }, [onSelect, challenge.id]);

    // Keep the active challenge in view — the mobile strip scrolls sideways and
    // the desktop rail scrolls down. Skipped on first paint so opening the page
    // never scrolls it for you.
    useEffect(() => {
      if (!hasMounted.current) {
        hasMounted.current = true;
        return;
      }
      if (!isSelected) return;
      buttonRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }, [isSelected]);

    return (
      <button
        ref={buttonRef}
        type="button"
        role="tab"
        id={`challenge-tab-${challenge.id}`}
        aria-selected={isSelected}
        aria-controls="challenge-panel"
        tabIndex={isSelected ? 0 : -1}
        data-challenge-id={challenge.id}
        onClick={handleTabChange}
        className={cn(
          'relative w-52 shrink-0 snap-start cursor-pointer rounded-md py-2.5 pr-3 pl-4 text-left transition-colors',
          'lg:w-full lg:snap-align-none',
          isSelected ? 'bg-accent' : 'hover:bg-accent/60'
        )}
      >
        {/* Active marker slides between challenges instead of blinking on. */}
        {isSelected && (
          <motion.span
            layoutId="challenge-tab-marker"
            aria-hidden="true"
            transition={{ duration: 0.25, ease: 'easeOut' as const }}
            className="pointer-events-none absolute inset-y-1.5 left-0 w-[2px] rounded-full bg-signal"
          />
        )}

        <span
          className={cn(
            'block font-mono text-[0.8125rem] leading-snug font-medium tracking-tight',
            isSelected
              ? 'text-foreground'
              : challenge.completed
                ? 'text-foreground/85'
                : 'text-muted-foreground'
          )}
        >
          {challenge.title}
        </span>

        <span className="mt-1 flex flex-wrap items-center gap-x-1.5 font-mono text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase">
          <span>{challenge.difficulty}</span>
          <span aria-hidden="true">/</span>
          <span className="tabular-nums">
            {challenge.requirements.length} rules
          </span>
          {!challenge.completed && (
            <>
              <span aria-hidden="true">/</span>
              <span>todo</span>
            </>
          )}
        </span>
      </button>
    );
  }
);

ChallengeTabButton.displayName = 'ChallengeTabButton';

export default ChallengeTabButton;
