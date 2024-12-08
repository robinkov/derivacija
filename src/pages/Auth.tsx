'use client'

import ArrowLeft from '@/assets/svgs/ArrowLeft'
import { Button } from '@/components/ui/button'
import { Viewport, ViewportFooter, ViewportMain } from '@/components/Viewport'
import { useNavigation } from '@/hooks/navigation'
import { Navigate, Outlet, useMatch, useNavigate, useOutlet } from 'react-router-dom'

export default function Auth() {
  const matchLogin = useMatch('/auth/login/*');
  const navigation = useNavigation(useNavigate());
  const outlet = useOutlet();
  const forgotPassword = (
    <ViewportFooter className='flex justify-center py-2'>
      <Button variant='outline' onClick={() => navigation('/auth/password-reset/send', { animation: 'swipe-down' })}>
        Forgot password?
      </Button>
    </ViewportFooter>
  );

  return (
    <Viewport>
      <ViewportMain alignment='center'>
        <div className='max-w-[28rem] w-full space-y-2'>
          <GoHome />
          {outlet ? <Outlet /> : <Navigate to='/auth/login' replace />}
        </div>
      </ViewportMain>
      {matchLogin && forgotPassword}
    </Viewport>
  );
}

export const GoHome = () => {
  const navigation = useNavigation(useNavigate());
  return (
    <Button variant='ghost' className='p-2 pr-3 h-auto'
      onClick={() => navigation('/home', { animation: 'swipe-left' })}
    >
      <ArrowLeft className='h-8' />
      <p>Home</p>
    </Button>
  );
};
