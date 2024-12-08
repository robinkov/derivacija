'use client'

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Home from '@/pages/Home'
import Error from '@/pages/Error'
import { ThemeProvider } from '@/components/ThemeProvider'
import RequireAuth from '@/state/auth/RequireAuth'
import { Provider } from 'react-redux'
import { store } from '@/state/store'
import AuthProvider from '@/state/auth/AuthProvider'
import Loader from '@/components/Loader'
import Auth from '@/pages/Auth'
import LoginForm from '@/state/auth/LoginForm'
import { DashboardRoute } from '@/pages/Dashboard'
import RegisterForm from '@/state/auth/RegisterForm'
import EmailVerification from '@/pages/EmailVerification'
import RequireEmailVerified from '@/state/auth/RequireEmailVerified'
import PasswordReset, { ChangePasswordForm, SendResetLink } from '@/pages/PasswordReset'

const router = createBrowserRouter(
  [
    {
      path: '/',
      errorElement: <Error code={404} description='Stranica kojoj pokušavaš pristupiti još ne postoji.' />,
      children: [
        {
          path: 'home',
          element: <Home />
        },
        {
          path: '',
          element: <RequireAuth
                      element={<Navigate to='/dashboard' replace />}
                      fallbackElement={<Navigate to='/home' replace />}
                      loadingElement={<Loader fullscreen />}
                    />
        }
      ]
    },
    {
      path: '/auth',
      element: <RequireAuth
                  element={<Auth />}
                  fallbackElement={<Navigate to='/dashboard' replace />}
                  loadingElement={<Loader fullscreen />}
                  loggedOut
                />,
      children: [
        {
          path: 'login',
          element: <LoginForm />,
        },
        {
          path: 'register',
          element: <RegisterForm />
        },      
        {
          path: 'password-reset',
          element: <PasswordReset />,
          children: [
            {
              path: 'send',
              element: <SendResetLink />
            },
            {
              path: 'change',
              element: <ChangePasswordForm />
            }
          ]
        }
      ]
    },
    {
      path: '/dashboard',
      element: <DashboardRoute />
    },
    {
      path: '/email-verification',
      element: <RequireEmailVerified
                  element={<EmailVerification />}
                  loadingElement={<Loader fullscreen />}
                  fallbackElement={<Navigate to='/home' />}
                  unverified
                />
    },
  ],
);


function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
   
  )
}

export default App
