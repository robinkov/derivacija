'use client'

import { useSelector } from 'react-redux'
import { selectAuth } from '@/state/auth/authSlice'
import Error from '@/pages/Error'
import React from 'react'

type RequireAuthProps = {
  element: React.ReactNode,
  fallbackElement?: React.ReactNode,
  loadingElement?: React.ReactNode,
  loggedOut?: boolean,
}

export default function RequireAuth({
  element, fallbackElement, loadingElement = 'Loading...', loggedOut = false
}: RequireAuthProps) {
  const { isAuthenticated, isLoading } = useSelector(selectAuth);
  
  if (isLoading) return loadingElement;

  return (
    (isAuthenticated && !loggedOut) || (!isAuthenticated && loggedOut) ?
    element : (
      fallbackElement || <Error code={401} description='Unauthorized access.' />
    )
  );
}
