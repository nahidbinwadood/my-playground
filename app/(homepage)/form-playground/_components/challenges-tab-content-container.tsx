import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2 } from 'lucide-react';
import { memo } from 'react';
import { IChallenge } from '../types';
import { getDifficultyColor } from './form-playground-main-wrapper';

const ChallengesTabContentContainer = memo(
  ({ selectedChallenge }: { selectedChallenge: IChallenge }) => {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">
                {selectedChallenge.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  className={getDifficultyColor(selectedChallenge.difficulty)}
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
              <TabsTrigger value="description" className="cursor-pointer">
                Description
              </TabsTrigger>
              <TabsTrigger value="solution" className="cursor-pointer">
                Solution
              </TabsTrigger>
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
                    Solution not yet available. Try implementing it yourself!
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }
);

ChallengesTabContentContainer.displayName = 'ChallengesTabContentContainer';

export default ChallengesTabContentContainer;
