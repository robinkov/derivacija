'use client'

import Loader from '@/components/Loader'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Viewport, ViewportHeader, ViewportMain } from '@/components/Viewport'
import { useNavigation } from '@/hooks/navigation'
import { selectAuth } from '@/state/auth/authSlice'
import RequireAuth from '@/state/auth/RequireAuth'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ProfileNavAction } from './Dashboard'

export default function Home() {
  return (
    <Viewport>
      <ViewportHeader>
        <Navbar action={<NavAction />} />
      </ViewportHeader>
      <ViewportMain alignment='center' className='px-2'>
        <div className='relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center text-xl'>
          <h1>Najbolje online pripreme za maturu!</h1>
        </div>
      </ViewportMain>
    </Viewport>
  );
}

const NavAction: React.FC = () => {
  return (
    <RequireAuth
      element={<ProfileNavAction />}
      fallbackElement={<LoginButton />}
      loadingElement={<LoginButton isLoading />}
    />
  );
}

const LoginButton: React.FC<{ isLoading?: boolean }> = ({ isLoading }) => {
  const navigation = useNavigation(useNavigate());
  const auth = useSelector(selectAuth);
  return (
    <Button variant='secondary' disabled={auth.isLoading}
      onClick={() => navigation('/auth/login', { animation: 'swipe-right' })}
    >
      { isLoading ? <Loader className='size-full border-[0.2rem]' /> : 'Login' }
    </Button>
  );
}
