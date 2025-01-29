import { configureStore } from '@reduxjs/toolkit'
import authSlice from '@/state/auth/authSlice'
import userSlice from '@/state/user/userSlice';
import contentSlice from '@/state/content/contentSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    content: contentSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  devTools: import.meta.env.DEV
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
