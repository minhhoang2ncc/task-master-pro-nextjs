import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { NotificationSettings } from "@/shared/type"

const initialState: NotificationSettings = {
    browserNotifications: true,
    emailNotifications: true,
}

const notifySlice = createSlice({
    name: "notify",
    initialState,
    reducers: {
        setNotificationSettings: (_state, action: PayloadAction<NotificationSettings>) => action.payload,
        updateNotificationSettings: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
            Object.assign(state, action.payload)
        },
        resetNotificationSettings: () => initialState,
    },
})

export const { setNotificationSettings, updateNotificationSettings, resetNotificationSettings } = notifySlice.actions
export default notifySlice.reducer