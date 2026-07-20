import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { LanguageSettings } from "@/shared/type"

const initialState: LanguageSettings = {
    language: "English",
}

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setLanguageSettings: (_state, action: PayloadAction<LanguageSettings>) => action.payload,
        updateLanguageSettings: (state, action: PayloadAction<Partial<LanguageSettings>>) => {
            Object.assign(state, action.payload)
        },
        resetLanguageSettings: () => initialState,
    },
})

export const { setLanguageSettings, updateLanguageSettings, resetLanguageSettings } = languageSlice.actions
export default languageSlice.reducer