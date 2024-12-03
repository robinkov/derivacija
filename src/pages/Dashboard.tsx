'use client'

import AccountCircle from '@/assets/svgs/AccountCircle'
import LogoutIcon from '@/assets/svgs/LogoutIcon'
import PaymentsIcon from '@/assets/svgs/PaymentsIcon'
import Loader from '@/components/Loader'
import Navbar from '@/components/Navbar'
import Separator from '@/components/Separator'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Viewport, ViewportHeader, ViewportMain } from '@/components/Viewport'
import { auth } from '@/config/firebase'
import { useNavigation } from '@/hooks/navigation'
import { selectAuth } from '@/state/auth/authSlice'
import RequireAuth from '@/state/auth/RequireAuth'
import RequireEmailVerified from '@/state/auth/RequireEmailVerified'
import { DashboardIcon } from '@radix-ui/react-icons'
import { signOut } from 'firebase/auth'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const user = useSelector(selectAuth);
  return (
    <Viewport>
      <ViewportHeader>
        <Navbar action={<ProfileNavAction />} />
      </ViewportHeader>
      <ViewportMain alignment='center'>
        <h1 className='font-semibold text-4xl text-center'>Welcome to Derivacija!</h1>
        <h1 className='font-semibold text-4xl text-center'>Welcome to Derivacija!</h1>
        <h3 className='font-semibold text-xl text-muted-foreground'>{user.email}</h3>
      </ViewportMain>
    </Viewport>
  );
}

export const ProfileNavAction: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation(useNavigate());
  function handleLogout() {
    setIsLoading(true);
    navigation('/home', { animation: 'zoom-out' });
    signOut(auth).finally(() => setIsLoading(false));
  }
  function handleNavigation() {
    navigation('/dashboard', { animation: 'zoom-in' });
  }

  const SheetMenu = (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' className='p-1 h-auto [&_svg]:size-8 rounded-full'>
          { isLoading ? <Loader className='size-full border-[0.2rem]' /> : <AccountCircle /> }
        </Button>
      </SheetTrigger>
      <SheetContent style={{ viewTransitionName: 'nav-sheet' }} className='overflow-y-auto'>
        <SheetHeader>
          <SheetTitle className='text-2xl lg:text-lg'>Profile</SheetTitle>
          <SheetDescription className='hidden' />
        </SheetHeader>
        <div className='py-6 lg:py-4 space-y-4 lg:space-y-2 [&_button]:w-full [&_button]:justify-start [&_button]:text-base [&_button]:h-10 lg:[&_button]:text-sm'>
          <div className='space-y-1'>
            <Button variant='ghost' onClick={handleNavigation}>
              <DashboardIcon />Dashboard
            </Button>
            <Button variant='ghost'>
              <PaymentsIcon />Payments
            </Button>
          </div>
          <Separator />
          <div>
            <Button variant='ghost' onClick={handleLogout}>
              <LogoutIcon />Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return SheetMenu;
}

export const DashboardRoute = () => <RequireAuth
  element={
    <RequireEmailVerified
      element={<Dashboard />}
      loadingElement={<Loader fullscreen />}
      fallbackElement={<Navigate to='/email-verification' replace />}
    />
  }
  loadingElement={<Loader fullscreen />}
/>;
