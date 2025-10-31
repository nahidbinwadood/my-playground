import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { memo } from 'react';
import { challenges } from '../data';
import { IChallenge } from '../types';
import ChallengeTabButton from './challenge-tab-button';

const ChallengesTabContainer = memo(
  ({
    selectedChallengeId,
    onChallengeSelect,
  }: {
    selectedChallengeId: string;
    onChallengeSelect: (id: string) => void;
  }) => {
    return (
      <Card className="lg:sticky lg:top-24">
        <CardHeader>
          <CardTitle>Challenges</CardTitle>
          <CardDescription>
            {challenges.filter((c) => c.completed).length} of{' '}
            {challenges.length} completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {challenges.map((challenge: IChallenge) => (
            <ChallengeTabButton
              key={challenge.id}
              challenge={challenge}
              isSelected={selectedChallengeId === challenge.id}
              onSelect={onChallengeSelect}
            />
          ))}
        </CardContent>
      </Card>
    );
  }
);

ChallengesTabContainer.displayName = 'ChallengesTabContainer';
export default ChallengesTabContainer;
