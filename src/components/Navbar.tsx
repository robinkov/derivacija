'use client'

import React from 'react'
import LogoExtended from '@/assets/svgs/LogoExtended'
import { cn } from '@/lib/utils'
import { DarkModeSwitch } from '@/components/ThemeProvider'
import { useNavigation } from '@/hooks/navigation'
import { useNavigate } from 'react-router-dom'

type NavbarProviderProps = React.ComponentPropsWithoutRef<'div'> & {
  action?: React.ReactNode
};
const NavbarProvider: React.FC<NavbarProviderProps> = ({
  children, className, ...props
}) => (
  <div
    className={cn(
      'flex flex-col items-center overflow-y-hidden',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

type NavbarContentProps = React.ComponentPropsWithoutRef<'div'>;
declare const Content: React.ForwardRefExoticComponent<NavbarContentProps & React.RefAttributes<HTMLDivElement>>;

const NavbarContent = React.forwardRef<
  React.ElementRef<typeof Content>,
  React.ComponentPropsWithoutRef<typeof Content>
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex justify-between items-center max-w-screen-lg w-full p-2',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

type NavbarNavigationProps = React.ComponentPropsWithoutRef<'nav'>;
declare const Navigation: React.ForwardRefExoticComponent<NavbarNavigationProps & React.RefAttributes<HTMLDivElement>>

const NavbarNavigation = React.forwardRef<
  React.ElementRef<typeof Navigation>,
  React.ComponentPropsWithoutRef<typeof Navigation>
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative inline-flex w-full h-full justify-center align-center',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

function Navbar(
  { className, action, ...props }: NavbarProviderProps
) {
  const navigation = useNavigation(useNavigate());
  return (
    <NavbarProvider className={className} style={{ viewTransitionName: 'navbar' }} {...props}>
      <NavbarContent className='space-x-2'>        
        <NavbarNavigation className='justify-normal'>
          <DarkModeSwitch />
        </NavbarNavigation>
        <NavbarNavigation>
          <LogoExtended className='h-10 cursor-pointer' onClick={() => navigation('/home', { animation: 'zoom-out' })} />
        </NavbarNavigation>
        <NavbarNavigation className='justify-end'>
          {action}
        </NavbarNavigation>
      </NavbarContent>
    </NavbarProvider>
  );
}

export default Navbar;
export { NavbarProvider, NavbarContent, NavbarNavigation };
