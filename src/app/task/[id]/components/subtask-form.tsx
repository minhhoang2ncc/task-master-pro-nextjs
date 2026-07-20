import { useEffect, useState } from "react"
import { Button } from "@/shared/components/button"

export function SubTaskForm({
  open,
  defaultTitle = "",
  onSubmit,
  onOpenChange,
}: {
  open: boolean
  defaultTitle?: string
  onSubmit: (title: string) => void
  onOpenChange: (open: boolean) => void
}) {
  const [title, setTitle] = useState(defaultTitle)

  useEffect(() => {
    if (open) {
      setTitle(defaultTitle)
    }
  }, [defaultTitle, open])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextTitle = title.trim()

    if (!nextTitle) return

    onSubmit(nextTitle)
    onOpenChange(false)
    setTitle("")
  }

  return (
    <dialog
      open={open}
      className="fixed z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-white rounded-xl shadow-2xl backdrop:bg-black/50 open:animate-in open:fade-in open:zoom-in-95"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Create Subtask</h1>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
          aria-label="Close dialog"
          onClick={() => onOpenChange(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="subtask-title" className="text-sm font-semibold text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="subtask-title"
            name="subtask-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter subtask title"
          />
        </div>

        <div className="flex justify-end pt-4 mt-2 border-t border-gray-100">
          <Button type="submit" className="px-5 py-2 text-sm font-medium">
            Add Subtask
          </Button>
        </div>
      </form>
    </dialog>
  )
}
