'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { INote } from '@/types';

export function useCopyNote() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (note: INote, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const textToCopy = `${note.title}\n\n${note.description ? note.description + '\n\n' : ''}${note.content}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      toast.error('Copy failed — your browser blocked clipboard access');
      return;
    }
    setCopiedId(note.id);
    toast.success('Takeaway copied to clipboard');
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return { copiedId, handleCopy };
}
