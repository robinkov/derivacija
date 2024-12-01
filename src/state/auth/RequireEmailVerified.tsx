'use client'

import { useSelector } from 'react-redux'
import { selectAuth } from '@/state/auth/authSlice'
import Error from '@/pages/Error'
import React from 'react'

type RequireAuthProps = {
  element: React.ReactNode,
  fallbackElement?: React.ReactNode,
  loadingElement?: React.ReactNode,
  unverified?: boolean
}

export default function RequireEmailVerified({
  element, fallbackElement, loadingElement = 'Loading...', unverified = false
}: RequireAuthProps) {
  const { isAuthenticated, isLoading, emailVerified } = useSelector(selectAuth);
  
  if (isLoading) return loadingElement;

  return (
    (isAuthenticated && emailVerified && !unverified) || (isAuthenticated && !emailVerified && unverified) ?
    element : (
      fallbackElement || <Error code={401} description='Email must be verified.' />
    )
  );
}
