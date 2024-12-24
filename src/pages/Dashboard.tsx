'use client'

import { ProfileNavActionData } from '@/assets/data/NavAction'
import AccountCircle from '@/assets/svgs/AccountCircle'
import LogoutIcon from '@/assets/svgs/LogoutIcon'
import Loader from '@/components/Loader'
import Navbar from '@/components/Navbar'
import Separator from '@/components/Separator'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Viewport, ViewportHeader, ViewportMain } from '@/components/Viewport'
import { auth } from '@/config/firebase'
import { useNavigation } from '@/hooks/navigation'
import RequireAuth from '@/state/auth/RequireAuth'
import RequireEmailVerified from '@/state/auth/RequireEmailVerified'
import RequireUser from '@/state/user/RequireUser'
import { signOut } from 'firebase/auth'
import React, { useState } from 'react'
import { Navigate, Outlet, useNavigate, useOutlet } from 'react-router-dom'

export default function Dashboard() {
  const outlet = useOutlet();
  return (
    <Viewport>
      <ViewportHeader>
        <Navbar action={<ProfileNavAction />} />
      </ViewportHeader>
      <ViewportMain>
        <RequireUser
          element={outlet ? <Outlet /> : <Navigate to='/dashboard/content' replace />}
          loadingElement={<Loader />}
        />
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
  const SheetMenu = (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' className='p-1 h-auto [&_svg]:size-8 rounded-full'>
          { isLoading ? <Loader className='size-full border-[0.2rem]' /> : <AccountCircle /> }
        </Button>
      </SheetTrigger>
      <SheetContent style={{ viewTransitionName: 'sidebar' }} className='overflow-y-auto'>
        <SheetHeader>
          <SheetTitle className='text-2xl lg:text-lg'>Profile</SheetTitle>
          <SheetDescription className='hidden' />
        </SheetHeader>
        <div className='py-6 lg:py-4 space-y-4 lg:space-y-2 [&_button]:w-full [&_button]:justify-start [&_button]:text-base [&_button]:h-10 lg:[&_button]:text-sm'>
          <div className='space-y-1'>
            { ProfileNavActionData(navigation).map((element) => (
              <SheetClose asChild key={`${element.text}-key`}>
                <Button variant='ghost' onClick={element.action}>
                  {element.icon}{element.text}
                </Button>
              </SheetClose>
            )) }
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
