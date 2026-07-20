"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

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

import { LayoutDashboard, Settings, BarChart2 } from "lucide-react"
import { BUTTON_VARIANTS, SIDEBAR_ITEM } from "../styles/tailwind-classes"
import { cn } from "../lib/utils"
import { Card, CardContent } from "@/shared/components/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar"

import { useState, useEffect } from "react"
export function AppSidebar() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const reduxUser = useSelector((state: RootState) => state.user)
  const user = mounted ? reduxUser : {
    displayName: "Nguyễn Văn A",
    email: "vana.intern@taskmaster.pro",
    role: "Frontend Engineering Intern",
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
                <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=1`} alt="Assignee" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-start gap-1">
                <span className='text-md font-semibold'>
                  {user.displayName}
                </span>
                <span className='text-sm text-muted-foreground'>
                  {user.role}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
