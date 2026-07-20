"use client"

import { useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "@/redux/slices/userSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import { Button } from "@/shared/components/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/avatar"
import { User, X, Mail, Briefcase } from "lucide-react"

export const USER_DIALOG_ID = "userDialog"

export function UserForm() {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.user)

  const displayNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const roleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const dialog = document.getElementById(USER_DIALOG_ID) as HTMLDialogElement | null
    if (!dialog) return

    const handleOpen = () => {
      if (displayNameRef.current) displayNameRef.current.value = user.displayName
      if (emailRef.current) emailRef.current.value = user.email
      if (roleRef.current) roleRef.current.value = user.role
    }

    const observer = new MutationObserver(() => {
      if (dialog.open) handleOpen()
    })
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] })

    return () => observer.disconnect()
  }, [user])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    dispatch(
      updateUser({
        displayName: String(formData.get("displayName") ?? ""),
        email: String(formData.get("email") ?? ""),
        role: String(formData.get("role") ?? ""),
      })
    )
    handleClose()
  }

  const handleClose = () => {
    const dialog = document.getElementById(USER_DIALOG_ID) as HTMLDialogElement | null
    dialog?.close()
  }

  const avatarSeed = encodeURIComponent(user.displayName || "user")
  const initials = user.displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <dialog
      id={USER_DIALOG_ID}
      className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm p-0 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl backdrop:bg-black/50 open:animate-in open:fade-in open:zoom-in-95 border-0 outline-none"
    >
      {/* ── Header gradient band ── */}
      <div className="relative h-24 rounded-t-2xl bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-end px-6 pb-0">
        {/* Close button */}
        <button
          type="button"
          aria-label="Close dialog"
          onClick={handleClose}
          className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
        >
          <X className="size-4" />
        </button>

        {/* Avatar sits half-inside the header */}
        <div className="absolute -bottom-8 left-6">
          <Avatar className="size-16 border-4 border-white dark:border-gray-900 shadow-lg">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${avatarSeed}`}
              alt={user.displayName}
            />
            <AvatarFallback className="text-lg font-bold bg-indigo-100 text-indigo-700">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="pt-12 px-6 pb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
          Edit Profile
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
          Update your personal information
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Display Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="user-displayName"
              className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide"
            >
              Display Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                ref={displayNameRef}
                type="text"
                id="user-displayName"
                name="displayName"
                required
                defaultValue={user.displayName}
                placeholder="Your full name"
                className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400 transition"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="user-email"
              className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                ref={emailRef}
                type="email"
                id="user-email"
                name="email"
                required
                defaultValue={user.email}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400 transition"
              />
            </div>
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="user-role"
              className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide"
            >
              Role
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                ref={roleRef}
                type="text"
                id="user-role"
                name="role"
                required
                defaultValue={user.role}
                placeholder="e.g. Frontend Engineer"
                className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400 transition"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 mt-1 border-t border-gray-100 dark:border-gray-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Cancel
            </Button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}
