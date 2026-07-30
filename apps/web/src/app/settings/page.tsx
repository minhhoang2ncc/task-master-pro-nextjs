"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ThemeSettings } from "./components/theme-settings"
import { TitleBar } from "@/libs/ui/components/src/titlebar"
import { NotifyCard } from "./components/notify-card"
import { LanguageSecurity } from "./components/language-security"
import { Button } from "@repo/ui"
import { Profile } from "./components/profile"
import { USER_UPDATE_REQUESTED } from "@/redux/saga/userSaga"
import { updateNotificationSettings } from "@/redux/slices/notifySlice"
import { updateLanguageSettings } from "@/redux/slices/languageSlice"
import type { RootState } from "@/redux/store"
import type { AppLanguage, LanguageSettings, NotificationSettings } from "@repo/types"
import type { User } from "@repo/types"
import { TEXT_SIZES } from "@/shared/styles/tailwind-classes"

export default function SettingsPage() {
  const dispatch = useDispatch()
  const reduxUser = useSelector((state: RootState) => state.user)
  const reduxNotify = useSelector((state: RootState) => state.notify)
  const reduxLanguage = useSelector((state: RootState) => state.language)

  const [user, setUser] = useState<User>(reduxUser)
  const [notify, setNotify] = useState<NotificationSettings>(reduxNotify)
  const [language, setLanguage] = useState<LanguageSettings>(reduxLanguage)

  useEffect(() => {
    setUser(reduxUser)
  }, [reduxUser])

  useEffect(() => {
    setNotify(reduxNotify)
  }, [reduxNotify])

  useEffect(() => {
    setLanguage(reduxLanguage)
  }, [reduxLanguage])

  const handleUserChange = (field: keyof User, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotifyChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotify((prev) => ({ ...prev, [field]: value }))
  }

  const handleLanguageChange = (lang: AppLanguage) => {
    setLanguage((prev) => ({ ...prev, language: lang }))
  }

  const handleSave = () => {
    console.log("Saving...")
    dispatch({
      type: USER_UPDATE_REQUESTED,
      payload: {
        ...user,
        browserNotifications: notify.browserNotifications,
        emailNotifications: notify.emailNotifications,
        languageDisplay: language.language,
      },
    })

    dispatch(updateNotificationSettings(notify))
    dispatch(updateLanguageSettings(language))
    console.log("Done")
  }

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <section>
      <TitleBar>
        <div>
          <h1 className={TEXT_SIZES.card_title_default}>Settings & Preferences</h1>
          <p className={`${TEXT_SIZES.title_secondary} text-muted-foreground`}>
            This is the settings page. You can customize your preferences here.
          </p>
        </div>
      </TitleBar>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 p-4 w-full h-fit">
        <Profile user={user} onChange={handleUserChange} />
        <ThemeSettings />
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 w-full h-fit">
        <NotifyCard settings={notify} onChange={handleNotifyChange} />
        <LanguageSecurity settings={language} onChange={handleLanguageChange} />
      </div>

      <div className="flex justify-end gap-4 p-4 w-full h-fit">
        <Button
          variant="outline"
          size="lg"
          className="mt-4 h-12 rounded-[8px] px-6 text-foreground bg-hint-background hover:bg-hint-background/80"
          // Assuming you might want to add a handleCancel function later to match the first code's behavior
          onClick={() => console.log("Cancel clicked")}
        >
          Cancel
        </Button>
        <Button
          variant="default"
          size="lg"
          className="mt-4 h-12 rounded-[8px] px-6 text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer dark:bg-foreground dark:text-background dark:hover:bg-foreground/80"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </section>
  )
}
