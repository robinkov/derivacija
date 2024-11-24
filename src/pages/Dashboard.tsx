'use client'

import AccountCircle from '@/assets/svgs/AccountCircle'
import Loader from '@/components/Loader'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import { Viewport, ViewportHeader, ViewportMain } from '@/components/Viewport'
import { auth } from '@/config/firebase'
import { useNavigation } from '@/hooks/navigation'
import { selectAuth } from '@/state/auth/authSlice'
import { signOut } from 'firebase/auth'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const user = useSelector(selectAuth);
  return (
    <Viewport>
      <ViewportHeader>
        <Navbar action={<ProfileNavAction />} />
      </ViewportHeader>
      <ViewportMain alignment='center'>
        <h1 className='font-semibold text-4xl'>Welcome to Derivacija!</h1>
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='p-1 h-auto [&_svg]:size-8 rounded-full'>
          { isLoading ? <Loader className='size-full border-[0.2rem]' /> : <AccountCircle /> }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent style={{ viewTransitionName: 'nav-dropdown' }}>
        <DropdownMenuLabel>Profile</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigation('/dashboard', { animation: 'zoom-in' })}>
              Dashboard
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
