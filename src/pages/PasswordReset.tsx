'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { functions } from '@/config/firebase';
import { httpsCallable } from 'firebase/functions';
import Loader from '@/components/Loader';
import { FormEvent, useState } from 'react';
import { Navigate, Outlet, useOutlet, useSearchParams } from 'react-router-dom';
import CheckMark from '@/assets/svgs/CheckMark';

export default function PasswordReset() {
  const outlet = useOutlet();
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl'>Promjena lozinke</CardTitle>
        <CardDescription>Ovdje možete promijeniti lozinku ukoliko ste ju zaboravili.</CardDescription>
      </CardHeader>
      <CardContent>
        {outlet ? <Outlet /> : <Navigate to='/auth/password-reset/send' />}
      </CardContent>
    </Card>
  );
}

export function SendResetLink() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [note, setNote] = useState<string>('');
  const sendPasswordResetEmail = httpsCallable(functions, 'sendPasswordResetEmail');
  async function handleSend(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    sendPasswordResetEmail({ email })
      .then(() => {
        setIsError(false);
        setIsSent(true);
        setNote('Email s linkom za promjenu je poslan na vašu email adresu.');
      })
      .catch((error) => {
        setIsError(true);
        setNote(error.message);
      })
      .finally(() => setIsLoading(false));
  }
  return (
    <form className='flex flex-col items-center gap-2' onSubmit={handleSend}>
      <Input type='email' placeholder='Vaš email' onChange={(e) => setEmail(e.target.value)} value={email} />
      <Button disabled={isLoading || isSent}>
        { isLoading && !isSent ? <Loader className='size-full border-[0.2rem]' /> : 'Promijeni lozinku' }
        { isSent && <CheckMark /> }
      </Button>
      {note &&
        <div className={`${isError ? 'text-destructive' : 'text-green-600'} text-center`}>
          { note }
        </div>
      }
    </form>
  );
}

export function ChangePasswordForm() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [note, setNote] = useState<string>('');
  const email = searchParams.get('email');
  const oobCode = searchParams.get('code');
  const changePassword = httpsCallable(functions, 'changePassword');
  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    changePassword({ email, oobCode, password, confirmPassword })
      .then(() => {
        setIsError(false);
        setIsSuccess(true);
        setNote('Lozinka je uspješno promijenjena.');
      })
      .catch((error) => {
        setIsError(true);
        setNote(error.message);
      })
      .finally(() => setIsLoading(false));
  }
  return (
    <form className='flex flex-col items-center gap-2' onSubmit={handlePasswordChange}>
      <Input type='password' placeholder='Lozinka'
        onChange={(e) => setPassword(e.target.value)} value={password} />
      <Input type='password' placeholder='Potvrdite lozinku'
        onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
      <Button disabled={isLoading || isSuccess}>
        { isLoading && !isSuccess ? <Loader className='size-full border-[0.2rem]' /> : 'Promijeni lozinku' }
        { isSuccess && <CheckMark /> }
      </Button>
      {note &&
        <div className={`${isError ? 'text-destructive' : 'text-green-600'} text-center`}>
          { note }
        </div>
      }
    </form>
  );
}
