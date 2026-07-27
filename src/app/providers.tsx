"use client"

import * as React from "react"
import { Provider, useDispatch, useSelector } from "react-redux"
import store, { type RootState } from "@/redux/store"
import { TASK_FETCH_ALL_REQUESTED } from "@/redux/saga/taskSaga"
import { USER_FETCH_REQUESTED } from "@/redux/saga/userSaga"
import { TaskForm } from "@/libs/ui/components/src/task-form"
import { UserForm } from "@/libs/ui/components/src/user-form"
import type { TaskRecord } from "@/shared/types/task"
import dayjs from "dayjs"

type Theme = "dark" | "light" | "system"
type ResolvedTheme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"
const THEME_VALUES: Theme[] = ["dark", "light", "system"]

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(
  undefined
)

function isTheme(value: string | null): value is Theme {
  if (value === null) {
    return false
  }
  return THEME_VALUES.includes(value as Theme)
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window !== "undefined" && window.matchMedia(COLOR_SCHEME_QUERY).matches) {
    return "dark"
  }
  return "light"
}

function disableTransitionsTemporarily() {
  if (typeof document === "undefined") return () => { }
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}"
    )
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove()
      })
    })
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  disableTransitionOnChange = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme
    const storedTheme = localStorage.getItem(storageKey)
    if (isTheme(storedTheme)) {
      return storedTheme
    }
    return defaultTheme
  })

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, nextTheme)
      }
      setThemeState(nextTheme)
    },
    [storageKey]
  )

  const applyTheme = React.useCallback(
    (nextTheme: Theme) => {
      if (typeof document === "undefined") return
      const root = document.documentElement
      const resolvedTheme =
        nextTheme === "system" ? getSystemTheme() : nextTheme
      const restoreTransitions = disableTransitionOnChange
        ? disableTransitionsTemporarily()
        : null

      root.classList.remove("light", "dark")
      root.classList.add(resolvedTheme)

      if (restoreTransitions) {
        restoreTransitions()
      }
    },
    [disableTransitionOnChange]
  )

  React.useEffect(() => {
    applyTheme(theme)

    if (theme !== "system" || typeof window === "undefined") {
      return undefined
    }

    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY)
    const handleChange = () => {
      applyTheme("system")
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme, applyTheme])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) {
        return
      }

      if (event.key !== storageKey) {
        return
      }

      if (isTheme(event.newValue)) {
        setThemeState(event.newValue)
        return
      }

      setThemeState(defaultTheme)
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [defaultTheme, storageKey])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}

function InitialDataFetcher({ sessionUserId }: { sessionUserId?: string }) {
  const dispatch = useDispatch()
  const tasks = useSelector((state: RootState) => state.tasks)

  React.useEffect(() => {
    if (!sessionUserId) return
    if (tasks.length === 0) {
      dispatch({ type: TASK_FETCH_ALL_REQUESTED })
    }
    dispatch({
      type: USER_FETCH_REQUESTED,
      payload: sessionUserId,
    })
  }, [dispatch, tasks.length, sessionUserId])

  return null
}

function GlobalModals() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const draftTask: TaskRecord = React.useMemo(() => ({
    id: 0,
    title: "",
    description: "",
    priority: "Low",
    dueDate: dayjs(),
    status: "pending",
    subtasks: [],
    tags: [],
  }), [])

  if (!mounted) return null

  return (
    <>
      <TaskForm task={draftTask} />
      <UserForm />
    </>
  )
}

export function Providers({
  children,
  sessionUserId,
  authOnly = false,
}: {
  children: React.ReactNode
  sessionUserId?: string
  authOnly?: boolean
}) {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        {!authOnly && <InitialDataFetcher sessionUserId={sessionUserId} />}
        {children}
        {!authOnly && <GlobalModals />}
      </ThemeProvider>
    </Provider>
  )
}
