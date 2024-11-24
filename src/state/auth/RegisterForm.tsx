'use client'

import GoogleMonochrome from '@/assets/svgs/GoogleMonochrome'
import Loader from '@/components/Loader'
import Separator from '@/components/Separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { auth, functions } from '@/config/firebase'
import { useNavigation } from '@/hooks/navigation'
import { Label } from '@radix-ui/react-label'
import { GoogleAuthProvider, signInWithCustomToken, signInWithPopup } from 'firebase/auth'
import { httpsCallable } from 'firebase/functions'
import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type ErrorFields = { id: string, isError: boolean }[];
const initialErrorFields = [
  { id: 'email', isError: false },
  { id: 'password', isError: false },
  { id: 'confirm-password', isError: false },
];

export default function RegisterForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [errorFields, setErrorFields] = useState<ErrorFields>(initialErrorFields);
  const navigation = useNavigation(useNavigate());
  const registerUser = httpsCallable(functions, 'registerUser');
  function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .catch((error) => {
        console.error(error);
      });
  }
  function handleEmailPasswordRegister(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    registerUser({ email, password, confirmPassword })
      .then((response) => {
        const token = response.data as string;
        if (!token) {
          throw new Error('Server nije uspio dohvatiti token.');
        }
        return signInWithCustomToken(auth, token);
      })
      .catch((error) => {
        if (error.details) {
          const details = error.details as string[];
          const errorFields = initialErrorFields.map((field) => {
            return details.includes(field.id) ? {...field, isError: true} : field;
          });
          setErrorFields(errorFields);
        } else setErrorFields(initialErrorFields);
        setError(error.message);
        setLoading(false);
      })
  }
  useEffect(() => {
    errorFields.forEach((field) => {
      const selector = document.getElementById(field.id)?.classList;
      if (field.isError) selector?.add('!border-destructive');
      else selector?.remove('!border-destructive');
    });
  }, [errorFields]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl'>Registracija</CardTitle>
        <CardDescription>Brzo i jednostavno stvorite račun.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <Button variant='outline' className='w-full' onClick={handleGoogleLogin}>
          <GoogleMonochrome />Google
        </Button>
        <Separator childOf='card'>ILI</Separator>
        <form onSubmit={handleEmailPasswordRegister}>
          <div className='grid w-full items-center gap-4 [&_label]:font-medium'>
            <div className='space-y-1.5'>
              <Label htmlFor='email'>Email</Label>
              <Input type='email' id='email' placeholder='your@email.com' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='password'>Lozinka</Label>
              <Input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='confirm-password'>Potvrdi lozinku</Label>
              <Input type='password' id='confirm-password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            {error && <div className='text-center text-destructive'>{error}</div>}
            <div className='flex justify-center'>
              <Button type='submit' disabled={isLoading}>
                { isLoading ? <Loader className='size-full border-[0.2rem]' /> : 'Stvori račun' }
              </Button>
            </div>
          </div>
          <div className='[&_button]:text-base pt-4' >
            Already have an account?&nbsp;
            <Button variant='link' type='button' className='px-0 h-7'
              onClick={() => navigation('/auth/login', { animation: 'swipe-left', replace: true })}>
              Login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
