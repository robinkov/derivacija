'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '@/state/user/userSlice'

type RequireUserProps = {
  element: React.ReactNode,
  fallbackElement?: React.ReactNode,
  loadingElement?: React.ReactNode
}

export default function RequireUser({
  element, loadingElement = 'Loading...'
}: RequireUserProps) {
  const { isFetched } = useSelector(selectUser);

  return isFetched ? element : loadingElement;
}
