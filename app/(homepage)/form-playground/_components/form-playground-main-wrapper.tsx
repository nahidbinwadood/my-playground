'use client';
import { useMemo, useState } from 'react';
import { challenges } from '../data';
import { IChallenge } from '../types';
import ChallengesTabContainer from './challenges-tab-container';
import ChallengesTabContentContainer from './challenges-tab-content-container';

// Difficulty rides the validation palette: signal = easy, warn = medium,
// fail = hard. Returned as a background class for a small marker dot, so the
// color never carries meaning on its own and never sits underneath body text.
export const getDifficultyColor = (difficulty: IChallenge['difficulty']) => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-signal';
    case 'Medium':
      return 'bg-warn';
    case 'Hard':
      return 'bg-fail';
  }
};

const FormPlayGroundMainWrapper = () => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    challenges[0].id
  );

  // find the selected challenge==>
  const selectedChallenge = useMemo(
    () => challenges.find((c) => c.id === selectedChallengeId) || challenges[0],
    [selectedChallengeId]
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-12 pb-20 sm:px-8 sm:pt-16 sm:pb-28">
      {/* ====Page Header==== */}
      <header className="border-b border-line pb-8">
        <p className="label-mono">/form-playground</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">
          Form challenges
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Every challenge states the rules a form has to enforce, then hands you
          the working version built with React Hook Form and Zod. Type an invalid
          value into one and watch it fail.
        </p>
      </header>

      {/* === Main Contents=== */}
      <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4 xl:col-span-3">
          {/* ===Challenges Tab Container=== */}
          <ChallengesTabContainer
            selectedChallengeId={selectedChallengeId}
            onChallengeSelect={setSelectedChallengeId}
          />
        </div>

        <div className="lg:col-span-8 xl:col-span-9">
          {/* ===Challenges Tab Content Container=== */}
          <ChallengesTabContentContainer
            selectedChallenge={selectedChallenge}
          />
        </div>
      </div>
    </section>
  );
};

export default FormPlayGroundMainWrapper;
