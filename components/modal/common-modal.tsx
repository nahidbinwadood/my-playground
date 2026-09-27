'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { XIcon } from 'lucide-react';

/**
 * The shell every modal in this app uses — details, edit, anything.
 *
 * The contract, and it is not optional: the header (title, optional
 * description, close button) and the footer stay put, and only the body
 * scrolls. shadcn's own `DialogContent` scrolls as one block, which drags the
 * title and the close button off the top of a long note — so the content is a
 * flex column with `p-0` here and each region owns its padding.
 *
 * A footer holding a submit button lives outside the `<form>`. Give the form an
 * `id` in `children` and the button `form="<that id>"`; the browser wires the
 * submit up natively, no lifted handler needed.
 */
const CommonModal = ({
  open,
  onOpenChange,
  title,
  description,
  footer,
  className,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Optional. One line under the title — what this modal does, or when it was logged. */
  description?: React.ReactNode;
  /** Pinned below the scroll area. Omit it and the body runs to the bottom edge. */
  footer?: React.ReactNode;
  /** Width only, as a rule: `sm:max-w-lg` (forms) or `sm:max-w-2xl` (reading). */
  className?: string;
  children: React.ReactNode;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      showCloseButton={false}
      className={cn(
        'flex max-h-[min(90svh,44rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl',
        className
      )}
    >
      <DialogHeader className="shrink-0 space-y-1 border-b border-line bg-surface px-5 py-4 pr-14 text-left">
        <DialogTitle className="text-base leading-snug font-semibold">
          {title}
        </DialogTitle>
        {description ? (
          <DialogDescription className="text-sm">
            {description}
          </DialogDescription>
        ) : null}
      </DialogHeader>

      {/* Sits outside the scroll area on purpose — it must stay reachable at
          the bottom of a long body. */}
      <DialogClose className="absolute top-4 right-4 grid size-8 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none">
        <XIcon className="size-4" />
        <span className="sr-only">Close</span>
      </DialogClose>

      <div className="hide-scrollbar flex-1 overflow-y-auto overscroll-contain px-5 py-4">
        {children}
      </div>

      {footer ? (
        <div className="shrink-0 border-t border-line bg-surface px-5 py-3.5">
          {footer}
        </div>
      ) : null}
    </DialogContent>
  </Dialog>
);

export default CommonModal;
