'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { FormFieldWrapper } from './form-field-wrapper';
import { cn } from '@/lib/utils';
import { useEffect, useCallback, useState } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Minus,
  SquareCode,
  RemoveFormatting,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────

interface FormTextEditorProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  tooltip?: string;
  required?: boolean;
  placeholder?: string;
  editorClassName?: string;
  minHeight?: string; // e.g. "200px"
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}

// ─── Toolbar Button ─────────────────────────────────────────────────────────

const ToolbarButton = ({
  onClick,
  isActive,
  disabled,
  children,
  title,
}: ToolbarButtonProps) => (
  <button
    type="button"
    title={title}
    disabled={disabled}
    onClick={onClick}
    className={cn(
      'inline-flex items-center justify-center rounded-md p-1.5 text-sm',
      'text-muted-foreground hover:bg-muted hover:text-foreground',
      'transition-colors duration-150',
      'disabled:pointer-events-none disabled:opacity-30',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      isActive && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
    )}
  >
    {children}
  </button>
);

// ─── Divider ────────────────────────────────────────────────────────────────

const Divider = () => (
  <div className="mx-1 h-5 w-px shrink-0 bg-border" aria-hidden />
);

// ─── Link Dialog ────────────────────────────────────────────────────────────

interface LinkDialogProps {
  editor: Editor;
  onClose: () => void;
}

const LinkDialog = ({ editor, onClose }: LinkDialogProps) => {
  const [url, setUrl] = useState(() => editor.getAttributes('link').href ?? '');

  const apply = () => {
    if (url.trim()) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url.trim(), target: '_blank' })
        .run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    onClose();
  };

  const remove = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    onClose();
  };

  return (
    <div className="absolute z-50 mt-1 flex items-center gap-2 rounded-lg border bg-popover p-2 shadow-lg">
      <input
        autoFocus
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') apply();
          if (e.key === 'Escape') onClose();
        }}
        placeholder="https://example.com"
        className="h-8 w-56 rounded-md border bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        type="button"
        onClick={apply}
        className="h-8 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:opacity-90"
      >
        Apply
      </button>
      {editor.isActive('link') && (
        <button
          type="button"
          onClick={remove}
          className="h-8 rounded-md border px-3 text-xs font-medium text-muted-foreground hover:bg-muted"
        >
          Remove
        </button>
      )}
    </div>
  );
};

// ─── Toolbar ────────────────────────────────────────────────────────────────

const EditorToolbar = ({ editor }: { editor: Editor }) => {
  const [showLink, setShowLink] = useState(false);

  const toggleLink = useCallback(() => {
    setShowLink((v) => !v);
  }, []);

  if (!editor) return null;

  return (
    <div className="relative border-b bg-muted/50 px-2 py-1.5">
      <div className="flex flex-wrap items-center gap-0.5">
        {/* History */}
        <ToolbarButton
          title="Undo (Ctrl+Z)"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Redo (Ctrl+Y)"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-3.5 w-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Headings */}
        <ToolbarButton
          title="Heading 1"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive('heading', { level: 1 })}
        >
          <Heading1 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive('heading', { level: 3 })}
        >
          <Heading3 className="h-3.5 w-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Inline formatting */}
        <ToolbarButton
          title="Bold (Ctrl+B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic (Ctrl+I)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Underline (Ctrl+U)"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Highlight"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
        >
          <Highlighter className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Inline Code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
        >
          <Code className="h-3.5 w-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Text alignment */}
        <ToolbarButton
          title="Align Left"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Align Center"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Align Right"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
        >
          <AlignRight className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Justify"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
        >
          <AlignJustify className="h-3.5 w-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Ordered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Block elements */}
        <ToolbarButton
          title="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
        >
          <Quote className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Code Block"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
        >
          <SquareCode className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="h-3.5 w-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <div className="relative">
          <ToolbarButton
            title="Insert Link"
            onClick={toggleLink}
            isActive={editor.isActive('link') || showLink}
          >
            <LinkIcon className="h-3.5 w-3.5" />
          </ToolbarButton>
          {showLink && (
            <LinkDialog editor={editor} onClose={() => setShowLink(false)} />
          )}
        </div>

        <Divider />

        {/* Clear formatting */}
        <ToolbarButton
          title="Clear Formatting"
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
        >
          <RemoveFormatting className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

function FormTextEditor<T extends FieldValues>({
  name,
  label,
  control,
  tooltip,
  required,
  placeholder = 'Start writing your content here...',
  editorClassName,
  minHeight = '220px',
}: FormTextEditorProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const editor = useEditor({
    immediatelyRender: false, // avoids SSR hydration mismatch in Next.js
    extensions: [
      StarterKit.configure({
        // StarterKit includes: bold, italic, strike, code, heading, bulletList,
        // orderedList, blockquote, codeBlock, horizontalRule, hardBreak, history
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue-600 underline cursor-pointer' },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: field.value || '',
    onUpdate: ({ editor }) => {
      // Store HTML; your Zod schema validates it as a non-empty string
      const html = editor.getHTML();
      // Treat "<p></p>" (empty editor) as empty string so Zod required fires
      field.onChange(html === '<p></p>' ? '' : html);
    },
    onBlur: () => {
      field.onBlur();
    },
    editorProps: {
      attributes: {
        // These Tailwind classes style the rendered content inside the editor
        class: cn(
          'focus:outline-none px-4 py-3',
          // Prose-like styles without requiring @tailwindcss/typography plugin
          '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:mt-4',
          '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2 [&_h2]:mt-3',
          '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-1 [&_h3]:mt-3',
          '[&_p]:mb-2 [&_p]:leading-relaxed',
          '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2',
          '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2',
          '[&_li]:mb-0.5',
          '[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-2',
          '[&_code]:bg-muted [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono',
          '[&_pre]:bg-zinc-900 [&_pre]:text-zinc-100 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-2 [&_pre]:overflow-x-auto',
          '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
          '[&_hr]:my-4 [&_hr]:border-border',
          '[&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline',
          '[&_mark]:bg-yellow-200 [&_mark]:text-zinc-900 [&_mark]:rounded-sm [&_mark]:px-0.5',
          '[&_strong]:font-semibold',
          editorClassName
        ),
      },
    },
  });

  return (
    <FormFieldWrapper
      label={label}
      tooltip={tooltip}
      error={error?.message}
      required={required}
    >
      <div
        className={cn(
          'rounded-md border bg-background text-foreground overflow-hidden transition-colors',
          error
            ? 'border-destructive focus-within:border-destructive'
            : 'border-input focus-within:border-ring'
        )}
      >
        {editor && <EditorToolbar editor={editor} />}

        <EditorContent
          editor={editor}
          style={{ minHeight }}
          className="cursor-text"
          onClick={() => editor?.commands.focus()}
        />

        {/* Character count (optional, always visible) */}
        <div className="border-t bg-muted/40 px-3 py-1 text-right text-[11px] text-muted-foreground">
          {editor?.storage.characterCount?.characters?.() ??
            editor?.getText().length ??
            0}{' '}
          chars
        </div>
      </div>
    </FormFieldWrapper>
  );
}

export default FormTextEditor;
