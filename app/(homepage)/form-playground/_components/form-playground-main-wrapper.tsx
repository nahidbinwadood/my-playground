'use client';
import PageHeader from '@/components/common/page-header';
import { useMemo, useState } from 'react';
import { challenges } from '../data';
import { IChallenge } from '../types';
import ChallengesTabContainer from './challenges-tab-container';
import ChallengesTabContentContainer from './challenges-tab-content-container';

export const getDifficultyColor = (difficulty: IChallenge['difficulty']) => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-green-500/10 text-green-700 dark:text-green-400';
    case 'Medium':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
    case 'Hard':
      return 'bg-red-500/10 text-red-700 dark:text-red-400';
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
    <section className="container mx-auto py-8 px-4 max-w-7xl">
      {/* ====Page Header==== */}
      <PageHeader
        title="Form Playground"
        subtitle=" Master complex form validation with React Hook Form challenges"
      />

      {/* === Main Contents=== */}
      <div className="grid gap-6 lg:grid-cols-12  ">
        <div className="lg:col-span-4">
          {/* ===Challenges Tab Container=== */}
          <ChallengesTabContainer
            selectedChallengeId={selectedChallengeId}
            onChallengeSelect={setSelectedChallengeId}
          />
        </div>

        <div className="lg:col-span-8">
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
