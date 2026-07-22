"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useTransition } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "@/shared/components/sidebar"

import { Button } from "@/shared/components/button"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

import { LayoutDashboard, Settings, BarChart2, LogOut, Loader2 } from "lucide-react"
import { BUTTON_VARIANTS, SIDEBAR_ITEM } from "../styles/tailwind-classes"
import { cn } from "../lib/utils"
import { Card, CardContent } from "@/shared/components/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar"

import { useState, useEffect } from "react"
import { logout } from "@/app/actions/auth"

export function AppSidebar() {
  const [mounted, setMounted] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setMounted(true)
  }, [])

  const reduxUser = useSelector((state: RootState) => state.user)
  const user = mounted ? reduxUser : {
    displayName: "",
    email: "",
    role: "",
  }

  const sidebarItems = [
    { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", url: "/analytics", icon: BarChart2 },
    { name: "Settings", url: "/settings", icon: Settings },
  ]

  const pathname = usePathname()

  const openTaskDialog = () => {
    const dialog = document.getElementById('inputDialog') as HTMLDialogElement
    dialog?.showModal()
  }

  const handleLogout = () => {
    startTransition(async () => {
      await logout()
    })
  }

  const avatarSeed = encodeURIComponent(user.displayName || "user")
  const initials = user.displayName
    ? user.displayName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  return (
    <Sidebar>
      <SidebarHeader className="p-5">
        <h1 className="text-lg font-bold text-primary dark:text-yellow-400">TaskMaster Pro</h1>
        <h2 className="text-sm text-muted-foreground">
          Frontend Intern Training
        </h2>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <SidebarMenu>
          {sidebarItems.map((item) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={SIDEBAR_ITEM.default}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
        <div className="flex flex-col justify-between items-center gap-8 m-6">
          <Button className={cn(BUTTON_VARIANTS.active, 'w-full h-12 rounded-lg text-md')} onClick={openTaskDialog}>
            + Add New Task
          </Button>
          <Card className='w-full bg-tabs-background dark:bg-background border-none rounded-xl ring-0 shadow-none'>
            <CardContent className='flex justify-start items-center gap-4'>
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${avatarSeed}`} alt={user.displayName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-start gap-1 flex-1 min-w-0">
                <span className='text-md font-semibold truncate'>
                  {user.displayName || "Loading…"}
                </span>
                <span className='text-sm text-muted-foreground truncate'>
                  {user.role}
                </span>
              </div>
              <button
                type="button"
                aria-label="Sign out"
                title="Sign out"
                onClick={handleLogout}
                disabled={isPending}
                className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
              >
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
              </button>
            </CardContent>
          </Card>
        </div>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
