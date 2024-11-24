'use client'

import GoogleMonochrome from '@/assets/svgs/GoogleMonochrome'
import Loader from '@/components/Loader'
import Separator from '@/components/Separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { auth } from '@/config/firebase'
import { useNavigation } from '@/hooks/navigation'
import { Label } from '@radix-ui/react-label'
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthErrorMessages } from '@/state/auth/AuthErrors'

export default function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigation = useNavigation(useNavigate());
  function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .catch((error) => {
        console.error(error.message);
      });
  }
  function handleEmailPasswordLogin(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        setLoading(false);
        setError(AuthErrorMessages[error.code]);
      });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl'>Login</CardTitle>
        <CardDescription>Prijavite se kako biste pristupili svim značajkama i sadržaju.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <Button variant='outline' className='w-full' onClick={handleGoogleLogin}>
          <GoogleMonochrome />Google
        </Button>
        <Separator childOf='card'>ILI</Separator>
        <form onSubmit={handleEmailPasswordLogin}>
          <div className='grid w-full items-center gap-4 [&_label]:font-medium'>
            <div className='space-y-1.5'>
              <Label htmlFor='email'>Email</Label>
              <Input type='email' id='email' placeholder='your@email.com' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='password'>Lozinka</Label>
              <Input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <div className='text-center text-destructive'>{error}</div>}
            <div className='flex justify-center'>
              <Button type='submit' disabled={isLoading}>
                { isLoading ? <Loader className='size-full border-[0.2rem]' /> : 'Log in' }
              </Button>
            </div>
          </div>
          <div className='[&_button]:text-base pt-4' >
            Don't have an account?&nbsp;
            <Button variant='link' type='button' className='px-0 h-7'
              onClick={() => navigation('/auth/register', { animation: 'swipe-right', replace: true })}>
              Register
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
