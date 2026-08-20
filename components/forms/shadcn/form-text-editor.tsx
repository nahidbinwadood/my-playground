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
import { useEffect, useCallback, useId, useState } from 'react';
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

// Mono/icon key in the toolbar strip. `title` doubles as the accessible name,
// and toggles report their state through aria-pressed.
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
    aria-label={title}
    aria-pressed={typeof isActive === 'boolean' ? isActive : undefined}
    disabled={disabled}
    onClick={onClick}
    className={cn(
      'inline-flex h-7 w-7 items-center justify-center rounded-sm border border-transparent',
      'text-muted-foreground hover:bg-muted hover:text-foreground',
      'transition-colors duration-150',
      'disabled:pointer-events-none disabled:opacity-30',
      isActive && 'border-line bg-foreground/10 text-foreground'
    )}
  >
    {children}
  </button>
);

// ─── Divider ────────────────────────────────────────────────────────────────

const Divider = () => (
  <div className="mx-1 h-5 w-px shrink-0 bg-line" aria-hidden="true" />
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
    <div className="absolute z-50 mt-1 flex items-center gap-2 rounded-lg border border-line bg-popover p-2 shadow-lg">
      <input
        autoFocus
        type="url"
        aria-label="Link address"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') apply();
          if (e.key === 'Escape') onClose();
        }}
        placeholder="https://example.com"
        className="h-8 w-56 rounded-md border border-line bg-background px-2 font-mono text-xs"
      />
      <button
        type="button"
        onClick={apply}
        className="h-8 rounded-md bg-foreground px-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-background transition-opacity hover:opacity-90"
      >
        Apply
      </button>
      {editor.isActive('link') && (
        <button
          type="button"
          onClick={remove}
          className="h-8 rounded-md border border-line px-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
    <div className="relative border-b border-line bg-surface px-2 py-1.5">
      <div
        role="group"
        aria-label="Formatting"
        className="flex flex-wrap items-center gap-0.5"
      >
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
          title="Inline code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
        >
          <Code className="h-3.5 w-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Text alignment */}
        <ToolbarButton
          title="Align left"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Align center"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Align right"
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
          title="Bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
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
          title="Code block"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
        >
          <SquareCode className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="h-3.5 w-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <div className="relative">
          <ToolbarButton
            title="Insert link"
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
          title="Clear formatting"
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

  const errorId = useId();
  const errorMessage = error?.message;

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
        HTMLAttributes: { class: 'underline cursor-pointer' },
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
        // The editable region needs its own accessible name — the field label
        // sits outside the contenteditable node.
        'aria-label': label,
        // These Tailwind classes style the rendered content inside the editor.
        // Headings use the mono display face, matching the published article.
        class: cn(
          'focus:outline-none px-4 py-3',
          // Prose-like styles without requiring @tailwindcss/typography plugin
          '[&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:mb-2 [&_h1]:mt-4',
          '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:mb-2 [&_h2]:mt-3',
          '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:mb-1 [&_h3]:mt-3',
          '[&_p]:mb-2 [&_p]:leading-relaxed',
          '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2',
          '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2',
          '[&_li]:mb-0.5',
          '[&_blockquote]:border-l-2 [&_blockquote]:border-line [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:my-2',
          '[&_code]:bg-surface [&_code]:border [&_code]:border-line [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono',
          '[&_pre]:bg-surface [&_pre]:text-foreground [&_pre]:border [&_pre]:border-line [&_pre]:font-mono [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-2 [&_pre]:overflow-x-auto',
          '[&_pre_code]:bg-transparent [&_pre_code]:border-0 [&_pre_code]:p-0',
          '[&_hr]:my-4 [&_hr]:border-line',
          '[&_a]:text-iris [&_a]:underline [&_a]:underline-offset-2',
          '[&_mark]:bg-warn/25 [&_mark]:text-foreground [&_mark]:rounded-sm [&_mark]:px-0.5',
          '[&_strong]:font-semibold',
          editorClassName
        ),
      },
    },
  });

  // Invalid state lives on the contenteditable node itself, which TipTap owns,
  // so it is mirrored there whenever the field error changes.
  useEffect(() => {
    const dom = editor?.view.dom;
    if (!dom) return;
    if (errorMessage) {
      dom.setAttribute('aria-invalid', 'true');
      dom.setAttribute('aria-describedby', errorId);
    } else {
      dom.removeAttribute('aria-invalid');
      dom.removeAttribute('aria-describedby');
    }
  }, [editor, errorMessage, errorId]);

  return (
    <FormFieldWrapper label={label} tooltip={tooltip} required={required}>
      <div
        className={cn(
          'rounded-md border bg-background text-foreground overflow-hidden transition-colors',
          'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/40',
          errorMessage ? 'border-fail' : 'border-line'
        )}
      >
        {editor && <EditorToolbar editor={editor} />}

        <EditorContent
          editor={editor}
          style={{ minHeight }}
          className="cursor-text"
          onClick={() => editor?.commands.focus()}
        />

        {/* Live character count — data, so mono and tabular. */}
        <div className="border-t border-line bg-surface px-3 py-1.5 text-right font-mono text-[0.6875rem] tabular-nums text-muted-foreground">
          {editor?.storage.characterCount?.characters?.() ??
            editor?.getText().length ??
            0}{' '}
          chars
        </div>
      </div>

      {errorMessage && (
        <p id={errorId} className="text-sm font-medium text-fail">
          {errorMessage}
        </p>
      )}
    </FormFieldWrapper>
  );
}

export default FormTextEditor;
