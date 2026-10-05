'use client';

import {
  auditNoteAction,
  generateCardsAction,
  TAuditIssue,
  TRecallCard,
} from '@/actions/ai.action';
import { Button } from '@/components/ui/button';
import { Loader2, ScanSearch, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type TBusy = 'cards' | 'audit' | null;

/**
 * Two AI helpers on one note. Nothing is saved — results live in this panel
 * until the dialog closes. Free models can take 30–60 s, so the button says so.
 *
 * Cards hide the answer behind a native <details>: reading the answer first
 * defeats the point of a recall card.
 */
const NoteAIPanel = ({ noteId }: { noteId: string }) => {
  const [busy, setBusy] = useState<TBusy>(null);
  const [cards, setCards] = useState<TRecallCard[] | null>(null);
  const [issues, setIssues] = useState<TAuditIssue[] | null>(null);

  const run = async (kind: Exclude<TBusy, null>) => {
    setBusy(kind);
    try {
      if (kind === 'cards') {
        const res = await generateCardsAction(noteId);
        if (res.success) setCards(res.data.cards);
        else toast.error(res.message);
      } else {
        const res = await auditNoteAction(noteId);
        if (res.success) setIssues(res.data.issues);
        else toast.error(res.message);
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface px-4 py-2">
        <p className="label-mono">AI study tools</p>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busy !== null}
            onClick={() => run('cards')}
          >
            {busy === 'cards' ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="size-4" aria-hidden="true" />
            )}
            Recall cards
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busy !== null}
            onClick={() => run('audit')}
          >
            {busy === 'audit' ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <ScanSearch className="size-4" aria-hidden="true" />
            )}
            Check mistakes
          </Button>
        </div>
      </div>

      <div className="space-y-4 p-4 text-sm" aria-live="polite">
        {busy ? (
          <p className="text-muted-foreground">
            Asking the model… free models can take up to a minute.
          </p>
        ) : null}

        {!busy && !cards && !issues ? (
          <p className="text-muted-foreground">
            Generate recall cards to test yourself, or check this note for
            mistakes. Try answering before you reveal.
          </p>
        ) : null}

        {cards ? (
          <section className="space-y-2">
            <h3 className="font-semibold">Recall cards</h3>
            <ol className="space-y-2">
              {cards.map((card, i) => (
                <li key={i} className="rounded-sm border border-line px-3 py-2">
                  <details>
                    <summary className="cursor-pointer">
                      {card.question}
                    </summary>
                    <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                      {card.answer}
                    </p>
                  </details>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {issues ? (
          <section className="space-y-2">
            <h3 className="font-semibold">Possible mistakes</h3>
            {issues.length === 0 ? (
              <p className="text-signal-ink">No mistakes found.</p>
            ) : (
              <ul className="space-y-2">
                {issues.map((issue, i) => (
                  <li
                    key={i}
                    className="rounded-sm border border-line px-3 py-2"
                  >
                    <blockquote className="border-l-2 border-warn pl-2 italic break-words">
                      {issue.quote}
                    </blockquote>
                    <p className="mt-2">{issue.why}</p>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-muted-foreground">
              AI can be wrong — verify each point before editing the note.
            </p>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default NoteAIPanel;
