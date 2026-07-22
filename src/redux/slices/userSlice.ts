import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/shared/types/user"


const initialState = {
  id: '',
  email: "example@gmail.com",
  displayName: "Jane Doe",
  role: "Frontend Engineer"
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (_state, action: PayloadAction<User>) => ({
      ...action.payload
    }),
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      Object.assign(state, action.payload)
    },
    resetUser: () => initialState,
  },
})

export const { setUser, updateUser, resetUser } = userSlice.actions
export default userSlice.reducer
