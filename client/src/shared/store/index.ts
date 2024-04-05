import { configureStore } from "@reduxjs/toolkit";
import { api } from "../api";
import userReducer from '../../entities/user/lib/store/userStore'

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        user: userReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(api.middleware)
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch