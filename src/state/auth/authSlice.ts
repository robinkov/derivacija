import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as Auth from 'firebase/auth'
import { RootState } from '@/state/store'

type AuthState = {
  isAuthenticated: boolean,
  isLoading: boolean,
  uid?: string,
  email?: string,
  emailVerified?: boolean,
  role?: string,
};

export type User = Pick<Auth.User, 'uid' | 'email' | 'emailVerified'> & {
  role: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  uid: undefined,
  email: undefined,
  emailVerified: undefined,
  role: undefined
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogout: (_state) => {
      return { ...initialState, isLoading: false };
    },
    setAuth: (
        state,
        action: PayloadAction<User>
      ) => {
      const { uid, email, emailVerified, role } = action.payload;
      if (state.uid) {
        throw new Error('Auth claims have already been set.');
      }
      if (!uid || !email || emailVerified === undefined || !role) {
        throw new Error('Auth does not have all necessary claims.');
      }
      return {
        isAuthenticated: true,
        isLoading: false,
        uid, email, emailVerified, role
      };
    },
    setEmailVerified: (state, action: PayloadAction<boolean>) => {
      state.emailVerified = action.payload;
    },
  }
});

export const selectAuth = (state: RootState) => state.auth;

export const { setLogout, setAuth, setEmailVerified } = authSlice.actions;
export default authSlice.reducer;
