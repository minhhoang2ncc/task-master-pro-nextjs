"use client"

import { useState } from "react"
import { Plus, Columns3, Palette } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  Button,
  Input,
  Label,
} from "@repo/ui"
import { cn } from "@repo/utils"
import type { ColumnConfig } from "@repo/types"

const COLOR_PRESETS: { name: string; label: string; preview: string; border: string }[] = [
  { name: "violet",  label: "Violet",  preview: "#8b5cf6", border: "#7c3aed" },
  { name: "rose",    label: "Rose",    preview: "#f43f5e", border: "#e11d48" },
  { name: "sky",     label: "Sky",     preview: "#0ea5e9", border: "#0284c7" },
  { name: "orange",  label: "Orange",  preview: "#f97316", border: "#ea580c" },
  { name: "teal",    label: "Teal",    preview: "#14b8a6", border: "#0d9488" },
  { name: "pink",    label: "Pink",    preview: "#ec4899", border: "#db2777" },
  { name: "lime",    label: "Lime",    preview: "#84cc16", border: "#65a30d" },
  { name: "indigo",  label: "Indigo",  preview: "#6366f1", border: "#4f46e5" },
]

interface AddColumnDialogProps {
  onAddColumn: (column: ColumnConfig) => void
  existingIds: string[]
}

export function AddColumnDialog({ onAddColumn, existingIds }: AddColumnDialogProps) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState("")
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0].name)

  const slugify = (str: string) =>
    str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

  const columnId = slugify(label) || "custom"
  const isDuplicate = existingIds.includes(columnId)

  const handleCreate = () => {
    if (!label.trim() || isDuplicate) return
    onAddColumn({
      id: columnId as ColumnConfig["id"],
      label: label.trim(),
      colorName: selectedColor,
    })
    setLabel("")
    setSelectedColor(COLOR_PRESETS[0].name)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCreate()
    if (e.key === "Escape") setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          id="add-column-btn"
          variant="outline"
          className="h-auto flex-col gap-2 rounded-2xl border-dashed border-2 px-6 py-8 text-muted-foreground hover:text-foreground hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all duration-200 group min-w-[220px] self-start"
        >
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted/60 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/50 transition-colors">
            <Plus className="w-5 h-5 group-hover:text-indigo-600 transition-colors" />
          </span>
          <span className="text-sm font-medium">Add Column</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 shadow-md shadow-indigo-200 dark:shadow-indigo-900/40">
              <Columns3 className="w-4 h-4 text-white" />
            </div>
            <DialogTitle>New Column</DialogTitle>
          </div>
          <DialogDescription>
            Create a custom status column for your kanban board.
          </DialogDescription>
        </DialogHeader>

        {/* Column Name */}
        <div className="flex flex-col gap-1.5 mb-4">
          <Label htmlFor="column-name-input">Column name</Label>
          <Input
            id="column-name-input"
            placeholder="e.g. Blocked, Review, Design…"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-invalid={isDuplicate}
          />
          {isDuplicate && (
            <p className="text-xs text-destructive">
              A column with this name already exists.
            </p>
          )}
          {label.trim() && !isDuplicate && (
            <p className="text-[11px] text-muted-foreground">
              Column ID: <code className="font-mono">{columnId}</code>
            </p>
          )}
        </div>

        {/* Color picker */}
        <div className="flex flex-col gap-2">
          <Label className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" />
            Column color
          </Label>
          <div className="grid grid-cols-4 gap-2">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color.name)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border-2 p-2.5 transition-all duration-150 hover:scale-105 focus:outline-none",
                  selectedColor === color.name
                    ? "border-foreground/30 bg-muted/50 scale-105"
                    : "border-transparent hover:border-border"
                )}
              >
                <span
                  className="w-6 h-6 rounded-full ring-2 ring-offset-1 ring-transparent transition-all"
                  style={{
                    backgroundColor: color.preview,
                    ...(selectedColor === color.name
                      ? { boxShadow: `0 0 0 2px ${color.border}` }
                      : {}),
                  }}
                />
                <span className="text-[10px] font-medium text-muted-foreground">
                  {color.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            id="create-column-submit-btn"
            onClick={handleCreate}
            disabled={!label.trim() || isDuplicate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white border-transparent"
          >
            <Plus className="w-4 h-4" />
            Create column
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
