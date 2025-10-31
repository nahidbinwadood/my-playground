export interface IChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  requirements: string[];
  component?: React.ComponentType;
  completed?: boolean;
}
