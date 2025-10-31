'use client';

import { ConditionalValidationForm } from '@/components/forms/conditional-validation-form';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';

type Challenge = {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  requirements: string[];
  component?: React.ComponentType;
  completed?: boolean;
};

const challenges: Challenge[] = [
  {
    id: 'conditional-validation',
    title: 'Conditional Field Validation',
    difficulty: 'Medium',
    description:
      'Build a form where certain fields become required based on the value of other fields. This tests your understanding of dynamic validation rules.',
    requirements: [
      'Create a form with 5 fields: Name, Email, Account Type (select), Company Name, and Phone',
      'If Account Type is "Business", Company Name becomes required',
      'If Account Type is "Personal", Phone becomes required',
      'Email must be valid format',
      'Show appropriate error messages for each field',
    ],
    component: ConditionalValidationForm,
    completed: true,
  },
  {
    id: 'dynamic-fields',
    title: 'Dynamic Form Fields',
    difficulty: 'Hard',
    description:
      'Create a form that allows users to add and remove field groups dynamically. Perfect for scenarios like adding multiple addresses or contacts.',
    requirements: [
      'Allow users to add/remove multiple address entries',
      'Each address should have: Street, City, State, Zip Code',
      'Validate all fields in each address group',
      'Minimum 1 address required, maximum 5 addresses',
      'Display validation errors for each address separately',
    ],
    completed: false,
  },
  {
    id: 'async-validation',
    title: 'Async Field Validation',
    difficulty: 'Hard',
    description:
      'Implement asynchronous validation to check if a username or email is already taken. This simulates real-world API validation scenarios.',
    requirements: [
      'Create a registration form with username and email',
      'Check username availability with async validation (simulate API call)',
      'Show loading state during validation',
      'Display appropriate messages for available/taken usernames',
      'Debounce the validation to avoid excessive checks',
    ],
    completed: false,
  },
  {
    id: 'password-strength',
    title: 'Password Strength Validation',
    difficulty: 'Medium',
    description:
      'Build a form with complex password requirements and a visual strength indicator. Tests pattern matching and custom validation logic.',
    requirements: [
      'Password must be at least 8 characters',
      'Must contain uppercase, lowercase, number, and special character',
      'Show real-time password strength indicator',
      'Confirm password field must match',
      'Display which requirements are met/not met',
    ],
    completed: false,
  },
  {
    id: 'multi-step-form',
    title: 'Multi-Step Form with Validation',
    difficulty: 'Hard',
    description:
      'Create a multi-step form where each step must be validated before proceeding. Maintain form state across steps.',
    requirements: [
      'Create 3 steps: Personal Info, Address, Review',
      'Each step has its own validation rules',
      'Cannot proceed to next step without valid data',
      'Allow going back to previous steps',
      'Show progress indicator',
      'Final review before submission',
    ],
    completed: false,
  },
];

export default function FormPlaygroundPage() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(
    challenges[0]
  );

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'Hard':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Form Playground
        </h1>
        <p className="text-muted-foreground text-lg">
          Master complex form validation with React Hook Form challenges
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle>Challenges</CardTitle>
              <CardDescription>
                {challenges.filter((c) => c.completed).length} of{' '}
                {challenges.length} completed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {challenges.map((challenge) => (
                <button
                  key={challenge.id}
                  onClick={() => setSelectedChallenge(challenge)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedChallenge.id === challenge.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">
                        {challenge.title}
                      </h3>
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
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">
                    {selectedChallenge.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={getDifficultyColor(
                        selectedChallenge.difficulty
                      )}
                      variant="secondary"
                    >
                      {selectedChallenge.difficulty}
                    </Badge>
                    {selectedChallenge.completed && (
                      <Badge
                        className="bg-green-500/10 text-green-700 dark:text-green-400"
                        variant="secondary"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="solution">Solution</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="space-y-4 mt-4">
                  <div>
                    <h3 className="font-semibold mb-2">Challenge</h3>
                    <p className="text-muted-foreground">
                      {selectedChallenge.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <ul className="space-y-2">
                      {selectedChallenge.requirements.map((req, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="text-primary mt-0.5">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="solution" className="mt-4">
                  {selectedChallenge.component ? (
                    <div className="space-y-4">
                      <div className="rounded-lg border bg-muted/50 p-6">
                        {selectedChallenge.component && (
                          <selectedChallenge.component />
                        )}
                      </div>
                    </div>
                  ) : (
                    <Card className="p-8 text-center bg-muted/50">
                      <p className="text-muted-foreground">
                        Solution not yet available. Try implementing it
                        yourself!
                      </p>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
