"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { useEffect, useRef, useState } from "react"
import {
  Bold, Italic, Strikethrough,
  List, ListOrdered, Minus,
  Undo2, Redo2,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  variant?: "full" | "minimal"
  hasError?: boolean
  id?: string
}

// ─── Utility ─────────────────────────────────────────────────────────────────

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolbarButton({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault() // keep editor focus
        onClick()
      }}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={[
        "p-1.5 rounded transition-colors text-sm",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        "disabled:opacity-40 disabled:cursor-not-allowed",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

// ─── Inner editor (always mounted so Tiptap state persists) ──────────────────

function Editor({
  value, onChange, placeholder, variant, hasError, id, onBlur,
}: RichTextEditorProps & { onBlur: () => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: variant === "minimal" ? false : { levels: [2, 3] },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        class: [
          "prose prose-sm dark:prose-invert max-w-none min-h-[60px] px-3 py-2 text-sm focus:outline-none",
          "prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5",
          "[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
          "[&_.is-editor-empty:first-child::before]:text-muted-foreground",
          "[&_.is-editor-empty:first-child::before]:float-left",
          "[&_.is-editor-empty:first-child::before]:pointer-events-none",
          "[&_.is-editor-empty:first-child::before]:h-0",
        ].join(" "),
      },
    },
    onUpdate({ editor }) {
      onChange(editor.isEmpty ? "" : editor.getHTML())
    },
    onBlur() {
      onBlur()
    },
    immediatelyRender: false,
  })

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    if (!editor) return
    const current = editor.isEmpty ? "" : editor.getHTML()
    if (current !== value) {
      editor.commands.setContent(value ?? "")
    }
  }, [value, editor])

  // Auto-focus when mounted
  useEffect(() => {
    if (editor) {
      // Small tick to let the DOM settle before focusing
      setTimeout(() => editor.commands.focus("end"), 0)
    }
  }, [editor])

  if (!editor) return null

  const ico = "w-3.5 h-3.5"

  return (
    <div
      className={[
        "rounded-md border bg-background overflow-hidden",
        "ring-2 ring-offset-0 ring-ring",
        hasError ? "border-red-400 ring-red-400" : "border-input",
      ].join(" ")}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1 border-b bg-muted/40 flex-wrap">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")} title="Bold"
        ><Bold className={ico} /></ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")} title="Italic"
        ><Italic className={ico} /></ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")} title="Strikethrough"
        ><Strikethrough className={ico} /></ToolbarButton>

        {variant === "full" && (
          <>
            <div className="w-px h-4 bg-border mx-1 shrink-0" />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive("bulletList")} title="Bullet list"
            ><List className={ico} /></ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive("orderedList")} title="Ordered list"
            ><ListOrdered className={ico} /></ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Horizontal rule"
            ><Minus className={ico} /></ToolbarButton>

            <div className="w-px h-4 bg-border mx-1 shrink-0" />

            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()} title="Undo"
            ><Undo2 className={ico} /></ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()} title="Redo"
            ><Redo2 className={ico} /></ToolbarButton>
          </>
        )}
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}

// ─── Public component (click-to-edit) ────────────────────────────────────────

export function RichTextEditor(props: RichTextEditorProps) {
  const { value, placeholder, hasError } = props
  const [editing, setEditing] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleBlur = () => {
    setTimeout(() => {
      if (wrapperRef.current && !wrapperRef.current.contains(document.activeElement)) {
        setEditing(false)
      }
    }, 150)
  }

  const isEmpty = !value || stripHtml(value) === ""

  return (
    <div ref={wrapperRef}>
      {editing ? (
        <Editor {...props} onBlur={handleBlur} />
      ) : isEmpty ? (
        /* ── Preview: empty / placeholder ── */
        <div
          role="button"
          tabIndex={0}
          onClick={() => setEditing(true)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setEditing(true) }}
          className={[
            "rte-preview prose prose-sm dark:prose-invert max-w-none min-h-[38px] px-3 py-2 rounded-md border text-sm cursor-text",
            "hover:border-input/80 transition-colors",
            hasError ? "border-red-400" : "border-transparent",
          ].join(" ")}
        >
          <span className="text-muted-foreground">
            {placeholder ?? "Click to edit…"}
          </span>
        </div>
      ) : (
        /* ── Preview: has content ── */
        <div
          role="button"
          tabIndex={0}
          onClick={() => setEditing(true)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setEditing(true) }}
          className={[
            "rte-preview prose prose-sm dark:prose-invert max-w-none min-h-[38px] px-3 py-2 rounded-md border text-sm cursor-text",
            "hover:border-input/80 transition-colors",
            hasError ? "border-red-400" : "border-transparent",
          ].join(" ")}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      )}
    </div>
  )
}
