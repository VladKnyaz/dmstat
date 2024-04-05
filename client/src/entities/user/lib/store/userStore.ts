import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    isAuth: true,
    token: '',
    isLoading: true,
}

export const userSlice = createSlice({
    name: 'userStore',
    initialState,
    reducers: {
        setAuth: (state, toggle: PayloadAction<boolean>) => {
            state.isAuth = toggle.payload
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload
        },
        setLoading: (state, toggle: PayloadAction<boolean>) => {
            state.isLoading = toggle.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setAuth, setToken, setLoading } = userSlice.actions

export default userSlice.reducer

