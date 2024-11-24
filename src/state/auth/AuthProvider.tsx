'use client'

import { auth } from '@/config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/state/store'
import { setAuth, setLogout, User } from '@/state/auth/authSlice'

type AuthProviderProps = {
  children?: React.ReactNode
}

export default function AuthProvider({
  children
}: AuthProviderProps) {

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const observer = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult(true);
          const dispatchUser = {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            // default role until server generates a valid one
            // ONLY when registered using Google Provider
            role: idTokenResult.claims['role'] || 'user'
          } as User;
          dispatch(setAuth(dispatchUser));
        } catch (error) {
          signOut(auth);
          dispatch(setLogout());
        }
      } else {
        dispatch(setLogout());
      }
    });

    return () => observer(); // unsubscribe
  }, []);

  return children;
}
