'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Keyboard } from 'lucide-react';
import { useId } from 'react';

export function DialogDemo() {
  const id = useId();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Rename workspace</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono tracking-tight">
            Rename workspace
          </DialogTitle>
          <DialogDescription>
            The slug updates with the name. Existing links keep working.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label
            htmlFor={id}
            className="font-mono text-xs uppercase tracking-[0.12em]"
          >
            Name
          </Label>
          <Input id={id} defaultValue="Playground" />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Rename workspace</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete post</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-mono tracking-tight">
            Delete this post?
          </AlertDialogTitle>
          <AlertDialogDescription>
            The post and its revisions are removed. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep post</AlertDialogCancel>
          <AlertDialogAction>Delete post</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function PopoverDemo() {
  const id = useId();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Table settings</Button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-72 space-y-4">
        <p className="label-mono">Display</p>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor={`${id}-dense`} className="font-normal">
            Dense rows
          </Label>
          <Switch id={`${id}-dense`} defaultChecked />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor={`${id}-ids`} className="font-normal">
            Show record ids
          </Label>
          <Switch id={`${id}-ids`} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Keyboard shortcuts">
          <Keyboard />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span className="font-mono text-xs">Shortcuts — ⌘K</span>
      </TooltipContent>
    </Tooltip>
  );
}

export function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="font-mono">
          @nahidbinwadood
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex gap-3">
          <Avatar>
            <AvatarFallback className="font-mono text-xs">NW</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="font-mono text-sm tracking-tight">Nahid Bin Wadood</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Builds the components on this page, then breaks them on purpose to
              see what the validation catches.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
