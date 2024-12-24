'use client'

import { useDispatch } from "react-redux"
import { AppDispatch } from "../store"
import { useEffect } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/config/firebase"
import { setIsFetched, setLogout } from "@/state/user/userSlice"
import { useSelector } from "react-redux"
import { selectAuth } from "@/state/auth/authSlice"

type UserProviderProps = {
  children?: React.ReactNode
}

export default function UserProvider({
  children
}: UserProviderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { uid } = useSelector(selectAuth);
  useEffect(() => {
    if (uid) {
      const observer = onSnapshot(doc(db, 'users', uid), (doc) => {
        if (doc.exists()) {
          dispatch(setIsFetched(true));
        } else {
          dispatch(setIsFetched(false));
        }
      })
      return () => observer(); // unsubscribe
    } else {
      dispatch(setLogout());
    }
  }, [uid])

  return children;
}
