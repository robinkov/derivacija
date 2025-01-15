import { configureStore } from '@reduxjs/toolkit'
import authSlice from '@/state/auth/authSlice'
import userSlice from '@/state/user/userSlice';


export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  devTools: import.meta.env.DEV
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
