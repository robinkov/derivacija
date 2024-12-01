'use client'

import Loader from '@/components/Loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { Viewport, ViewportMain } from '@/components/Viewport'
import { functions } from '@/config/firebase'
import { useNavigation } from '@/hooks/navigation'
import { GoHome } from '@/pages/Auth'
import { setEmailVerified } from '@/state/auth/authSlice'
import { AppDispatch } from '@/state/store'
import { httpsCallable } from 'firebase/functions'
import { FormEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function EmailVerification() {
  const REGEXP_ONLY_DIGITS = '^[0-9]*$';
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const verifyOTPCode = httpsCallable(functions, 'verifyOTPCode');
  const navigation = useNavigation(useNavigate());
  const dispatch = useDispatch<AppDispatch>();
  function handleVerification(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    verifyOTPCode({ otpCode: otp })
      .then(() => {
        dispatch(setEmailVerified(true));
        navigation('/dashboard', { animation: 'zoom-in' });
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.message);
      });
  }
  return (
    <Viewport>
      <ViewportMain alignment='center'>
        <div className='max-w-[28rem] w-full space-y-2'>
          <GoHome />
          <Card>
            <CardHeader>
              <CardTitle>Provjera email adrese</CardTitle>
              <CardDescription>
                Na vašu email adresu smo poslali šesteroznamenkasti kod.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className='flex flex-col gap-4 items-center' onSubmit={handleVerification}>
                <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}
                  value={otp} onChange={setOtp}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                { error &&
                  <div className='text-destructive'>
                    { error }
                  </div>
                }
                <Button variant='secondary'>
                  { isLoading ? <Loader className='size-full border-[0.2rem]' /> : 'Provjeri' }
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </ViewportMain>
    </Viewport>
  );
}