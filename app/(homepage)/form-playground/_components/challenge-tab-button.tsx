import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';
import { memo, useCallback } from 'react';
import { IChallenge } from '../types';
import { getDifficultyColor } from './form-playground-main-wrapper';

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
    const handleTabChange = useCallback(() => {
      onSelect(challenge.id);
    }, [onSelect, challenge.id]);
    return (
      <button
        key={challenge.id}
        onClick={handleTabChange}
        className={`w-full cursor-pointer text-left p-4 rounded-lg border transition-all ${
          isSelected
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{challenge.title}</h3>
          </div>
          {challenge.completed ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 ml-2" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground shrink-0 ml-2" />
          )}
        </div>
        <Badge
          className={getDifficultyColor(challenge.difficulty)}
          variant="secondary"
        >
          {challenge.difficulty}
        </Badge>
      </button>
    );
  }
);

ChallengeTabButton.displayName = 'ChallengeTabButton';

export default ChallengeTabButton;
