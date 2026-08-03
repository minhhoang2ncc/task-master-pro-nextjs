"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { uploadFile } from "@/api/database/storage/task"
import { CloudUpload, FileText, ImageIcon, FileIcon, X } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type FileStatus = "pending" | "uploading" | "success" | "error"

interface FileEntry {
  file: File
  status: FileStatus
}

type OverlayStatus = "idle" | "dragging" | "uploading" | "done"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FileTypeIcon({ mime }: { mime: string }) {
  if (mime.startsWith("image/")) return <ImageIcon className="w-4 h-4 shrink-0 text-blue-400" />
  if (mime === "application/pdf") return <FileText className="w-4 h-4 shrink-0 text-red-400" />
  return <FileIcon className="w-4 h-4 shrink-0 text-gray-400" />
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DropOverlay({ taskId, onUploadSuccess }: { taskId: string; onUploadSuccess?: () => void }) {
  const [overlayStatus, setOverlayStatus] = useState<OverlayStatus>("idle")
  const [entries, setEntries] = useState<FileEntry[]>([])

  const dragCounterRef = useRef(0)
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dismiss = useCallback(() => {
    setOverlayStatus("idle")
    setEntries([])
    dragCounterRef.current = 0
  }, [])

  const scheduleDismiss = useCallback(
    (delay = 2400) => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
      dismissTimerRef.current = setTimeout(dismiss, delay)
    },
    [dismiss]
  )

  // ── File selection ──────────────────────────────────────────────────────────

  const handleFileSelection = useCallback((fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    const incoming: FileEntry[] = Array.from(fileList).map((file) => ({ file, status: "pending" }))
    setEntries((prev) => {
      const existingNames = new Set(prev.map((e) => e.file.name))
      const fresh = incoming.filter((e) => !existingNames.has(e.file.name))
      return [...prev, ...fresh]
    })
    setOverlayStatus("idle")
  }, [])

  const removeEntry = useCallback((name: string) => {
    setEntries((prev) => prev.filter((e) => e.file.name !== name))
  }, [])

  // ── Upload ──────────────────────────────────────────────────────────────────

  const handleUploadClick = useCallback(async () => {
    const pending = entries.filter((e) => e.status === "pending")
    if (pending.length === 0) return

    setOverlayStatus("uploading")

    await Promise.all(
      pending.map(async (entry) => {
        setEntries((prev) =>
          prev.map((e) => (e.file.name === entry.file.name ? { ...e, status: "uploading" } : e))
        )
        try {
          await uploadFile(entry.file, taskId)
          setEntries((prev) =>
            prev.map((e) => (e.file.name === entry.file.name ? { ...e, status: "success" } : e))
          )
        } catch {
          setEntries((prev) =>
            prev.map((e) => (e.file.name === entry.file.name ? { ...e, status: "error" } : e))
          )
        }
      })
    )

    onUploadSuccess?.()
    setOverlayStatus("done")
    scheduleDismiss()
  }, [entries, taskId, onUploadSuccess, scheduleDismiss])

  // ── Drag events ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const target: EventTarget = document.getElementById("dragDialog") as EventTarget

    const onDragEnter = (e: Event) => {
      e.preventDefault()
      dragCounterRef.current += 1
      setOverlayStatus((prev) => (prev === "uploading" ? prev : "dragging"))
    }
    const onDragLeave = () => {
      dragCounterRef.current -= 1
      if (dragCounterRef.current <= 0) {
        dragCounterRef.current = 0
        setOverlayStatus((prev) => (prev === "dragging" ? "idle" : prev))
      }
    }
    const onDragOver = (e: Event) => e.preventDefault()
    const onDrop = (e: Event) => {
      e.preventDefault()
      dragCounterRef.current = 0
      handleFileSelection((e as DragEvent).dataTransfer?.files ?? null)
    }

    target.addEventListener("dragenter", onDragEnter)
    target.addEventListener("dragleave", onDragLeave)
    target.addEventListener("dragover", onDragOver)
    target.addEventListener("drop", onDrop)
    return () => {
      target.removeEventListener("dragenter", onDragEnter)
      target.removeEventListener("dragleave", onDragLeave)
      target.removeEventListener("dragover", onDragOver)
      target.removeEventListener("drop", onDrop)
    }
  }, [handleFileSelection])

  useEffect(() => () => {
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
  }, [])

  // ── Render ──────────────────────────────────────────────────────────────────

  const isDragging = overlayStatus === "dragging"
  const isUploading = overlayStatus === "uploading"
  const hasPending = entries.some((e) => e.status === "pending")

  const statusBadge: Record<FileStatus, { label: string; cls: string }> = {
    pending: { label: "Ready", cls: "bg-gray-100 text-gray-500" },
    uploading: { label: "Uploading…", cls: "bg-blue-100 text-blue-600 animate-pulse" },
    success: { label: "Done", cls: "bg-emerald-100 text-emerald-600" },
    error: { label: "Failed", cls: "bg-red-100 text-red-500" },
  }

  return (
    <>
      <dialog
        id="dragDialog"
        className="z-50 h-fit m-auto bg-white rounded-[20px] shadow-2xl w-full max-w-[700px] p-8 border-none backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm"
        style={{ animation: "popIn 0.2s ease-out forwards" }}
      >
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Upload files</h2>
            <button
              onClick={() => {
                const dialog = document.getElementById("dragDialog") as HTMLDialogElement
                dialog?.close()
                dismiss()
              }}
              className="text-gray-400 hover:text-gray-600 font-bold p-2"
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>

          {/* Drop zone */}
          <div
            className={`flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg mb-4 transition-colors ${isDragging ? "border-blue-500 bg-blue-50" : "border-blue-300 bg-[#f8fbff]"
              }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              dragCounterRef.current = 0
              handleFileSelection(e.dataTransfer.files)
            }}
          >
            <CloudUpload className="w-10 h-10 text-blue-500 mb-3" strokeWidth={1.5} />
            <p className="text-gray-600 font-medium">
              Drag &amp; Drop your files or{" "}
              <label className="text-blue-600 underline cursor-pointer hover:text-blue-700 transition-colors">
                Browse
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileSelection(e.target.files)}
                />
              </label>
            </p>
            <p className="mt-1 text-xs text-gray-400">PNG, JPG, PDF · up to 5 MB each · select multiple</p>
          </div>

          {/* File list */}
          {entries.length > 0 && (
            <ul className="flex flex-col gap-2 mb-4 max-h-52 overflow-y-auto pr-1">
              {entries.map((entry) => {
                const badge = statusBadge[entry.status]
                return (
                  <li
                    key={entry.file.name}
                    className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 text-sm"
                  >
                    <FileTypeIcon mime={entry.file.type} />
                    <span className="flex-1 truncate text-gray-700" title={entry.file.name}>
                      {entry.file.name}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${badge.cls}`}>
                      {badge.label}
                    </span>
                    {entry.status === "pending" && (
                      <button
                        type="button"
                        aria-label={`Remove ${entry.file.name}`}
                        onClick={() => removeEntry(entry.file.name)}
                        className="text-gray-300 hover:text-gray-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-6 px-1">
            <span>Supported: PNG, JPG, PDF</span>
            <span>Max 5 MB per file</span>
          </div>

          {/* Action button */}
          <div className="flex justify-end gap-3">
            {entries.some((e) => e.status === "error") && (
              <button
                type="button"
                onClick={() =>
                  setEntries((prev) =>
                    prev.map((e) => (e.status === "error" ? { ...e, status: "pending" } : e))
                  )
                }
                className="px-5 py-2.5 border border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Retry failed
              </button>
            )}
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={!hasPending || isUploading}
              className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading
                ? `Uploading ${entries.filter((e) => e.status === "uploading").length} file(s)…`
                : `Upload${entries.filter((e) => e.status === "pending").length > 0 ? ` (${entries.filter((e) => e.status === "pending").length})` : ""}`}
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}
