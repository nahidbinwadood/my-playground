import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { memo } from 'react';
import { IChallenge } from '../types';
import { getDifficultyColor } from './form-playground-main-wrapper';

const ChallengesTabContentContainer = memo(
  ({ selectedChallenge }: { selectedChallenge: IChallenge }) => {
    const SolutionForm = selectedChallenge.component;

    return (
      <div
        id="challenge-panel"
        role="tabpanel"
        aria-labelledby={`challenge-tab-${selectedChallenge.id}`}
        className="w-full max-w-3xl overflow-hidden rounded-lg border border-border bg-card"
      >
        {/* Hairline header strip: names what is loaded into the pane. */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line bg-surface px-4 py-3 sm:px-6">
          <h2 className="font-mono text-sm font-semibold tracking-tight sm:text-base">
            {selectedChallenge.title}
          </h2>
          <span className="flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase">
            <span
              aria-hidden="true"
              className={cn(
                'size-1.5 rounded-full',
                getDifficultyColor(selectedChallenge.difficulty)
              )}
            />
            {selectedChallenge.difficulty}
          </span>
          {!selectedChallenge.completed && (
            <span className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase">
              todo
            </span>
          )}
        </div>

        <div className="p-4 sm:p-6">
          <Tabs
            key={selectedChallenge.id}
            defaultValue="description"
            className="w-full"
          >
            <TabsList className="grid w-full max-w-xs grid-cols-2 bg-surface">
              <TabsTrigger
                value="description"
                className="cursor-pointer font-mono text-xs tracking-[0.1em] uppercase"
              >
                Spec
              </TabsTrigger>
              <TabsTrigger
                value="solution"
                className="cursor-pointer font-mono text-xs tracking-[0.1em] uppercase"
              >
                Solution
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6 space-y-7">
              <section>
                <h3 className="label-mono">What it covers</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {selectedChallenge.description}
                </p>
              </section>
              <section>
                <h3 className="label-mono">
                  Requirements{' '}
                  <span className="tabular-nums">
                    ({selectedChallenge.requirements.length})
                  </span>
                </h3>
                <ol className="mt-3 space-y-2.5">
                  {selectedChallenge.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-0.5 font-mono text-[0.6875rem] text-foreground/40 tabular-nums"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </TabsContent>

            <TabsContent value="solution" className="mt-6">
              {SolutionForm ? (
                <div className="rounded-lg border border-line bg-surface p-4 sm:p-6">
                  <SolutionForm />
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-line px-6 py-12 text-center">
                  <p className="font-mono text-sm font-medium tracking-tight">
                    No solution yet
                  </p>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    This one is specified but not built. Open the spec and
                    implement it yourself, or pick another challenge from the
                    list.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }
);

ChallengesTabContentContainer.displayName = 'ChallengesTabContentContainer';

export default ChallengesTabContentContainer;
