'use client';

import { memo, type KeyboardEvent } from 'react';
import { challenges } from '../data';
import { IChallenge } from '../types';
import ChallengeTabButton from './challenge-tab-button';

const ARROW_KEYS = [
  'ArrowDown',
  'ArrowUp',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
];

const ChallengesTabContainer = memo(
  ({
    selectedChallengeId,
    onChallengeSelect,
  }: {
    selectedChallengeId: string;
    onChallengeSelect: (id: string) => void;
  }) => {
    const solvedCount = challenges.filter((c) => c.completed).length;

    // Tablist keyboard model: both axes work, because the rail is vertical on
    // desktop and a horizontal strip on mobile. Selection follows focus.
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (!ARROW_KEYS.includes(event.key)) return;

      const tabs = Array.from(
        event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      );
      if (tabs.length === 0) return;

      const focusedIndex = tabs.findIndex((tab) => tab === document.activeElement);
      const selectedIndex = tabs.findIndex(
        (tab) => tab.dataset.challengeId === selectedChallengeId
      );
      const from = focusedIndex !== -1 ? focusedIndex : Math.max(selectedIndex, 0);

      let nextIndex = from;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        nextIndex = (from + 1) % tabs.length;
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        nextIndex = (from - 1 + tabs.length) % tabs.length;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else {
        nextIndex = tabs.length - 1;
      }

      const nextTab = tabs[nextIndex];
      const nextId = nextTab?.dataset.challengeId;
      if (!nextId) return;

      event.preventDefault();
      onChallengeSelect(nextId);
      // The button scrolls itself into view once selected.
      nextTab.focus({ preventScroll: true });
    };

    return (
      <div className="lg:sticky lg:top-24">
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-baseline justify-between gap-3 border-b border-line px-4 py-3">
            <h2 className="font-mono text-sm font-semibold tracking-tight">
              Challenges
            </h2>
            <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase tabular-nums">
              {solvedCount}/{challenges.length} solved
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Form validation challenges"
            aria-orientation="vertical"
            onKeyDown={handleKeyDown}
            className="hide-scrollbar flex snap-x snap-mandatory gap-1 overflow-x-auto p-2 lg:max-h-[32rem] lg:snap-none lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto"
          >
            {challenges.map((challenge: IChallenge) => (
              <ChallengeTabButton
                key={challenge.id}
                challenge={challenge}
                isSelected={selectedChallengeId === challenge.id}
                onSelect={onChallengeSelect}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

ChallengesTabContainer.displayName = 'ChallengesTabContainer';
export default ChallengesTabContainer;
