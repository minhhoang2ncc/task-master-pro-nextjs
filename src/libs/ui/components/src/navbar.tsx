"use client"

import { Button } from "@/libs/ui/components/src/shadcn/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/libs/ui/components/src/shadcn/avatar"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

import { Search, CirclePlus, Bell, BellDot, CircleQuestionMark } from "lucide-react"
import { Separator } from "@/libs/ui/components/src/shadcn/separator"
import { USER_DIALOG_ID } from "./user-form"

export function NavBar() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  const [isNotification, setIsNotification] = useState(false)
  const reduxUser = useSelector((state: RootState) => state.user)
  const user = mounted ? reduxUser : {
    displayName: "Nguyễn Văn A",
    email: "vana.intern@taskmaster.pro",
    role: "Frontend Engineering Intern",
  }

  const openTaskDialog = () => {
    const dialog = document.getElementById('inputDialog') as HTMLDialogElement
    dialog?.showModal()
  }

  const openUserDialog = () => {
    const dialog = document.getElementById(USER_DIALOG_ID) as HTMLDialogElement
    dialog?.showModal()
  }

  const avatarSeed = encodeURIComponent(user.displayName || "user")
  const initials = user.displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <nav className="flex-1 flex items-center justify-between gap-4 relative">
      <div>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
        <input placeholder="Search tasks..." className="max-w-160 min-w-120 h-10 bg-white dark:text-background border border-input rounded-md pl-10 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setIsNotification(!isNotification)}>
          <Bell className={`size-4 ${isNotification ? 'hidden' : ''}`} />
          <BellDot className={`size-4 ${isNotification ? '' : 'hidden'}`} />
        </Button>
        <Button variant="ghost" size="icon">
          <CircleQuestionMark className="size-4" />
        </Button>
        <Separator orientation="vertical" className="self-stretch data-vertical:w-[1px] mx-2" />
        <button
          type="button"
          aria-label="Edit profile"
          title={`Edit profile — ${user.displayName}`}
          onClick={openUserDialog}
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform hover:scale-105 cursor-pointer"
        >
          <Avatar className="h-8 w-8 border-2 border-white">
            <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${avatarSeed}`} alt={user.displayName} />
            <AvatarFallback>{initials || "U"}</AvatarFallback>
          </Avatar>
        </button>
        <Button variant="default" size="lg" onClick={openTaskDialog}>
          <CirclePlus className="size-4" /> Create Task
        </Button>
      </div>
    </nav>
  )
}
