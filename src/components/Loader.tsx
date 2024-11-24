'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type LoaderProps = React.ComponentPropsWithoutRef<'div'> & {
  fullscreen?: boolean
};
declare const LoaderComponent: React.ForwardRefExoticComponent<LoaderProps & React.RefAttributes<HTMLDivElement>>;

const Loader = React.forwardRef<
  React.ElementRef<typeof LoaderComponent>,
  React.ComponentPropsWithoutRef<typeof LoaderComponent>
>(({ className, fullscreen, ...props }, ref) => {
  const LoaderComp = (
    <div
      ref={ref}
      className={cn(
        `rounded-full aspect-square ${fullscreen ? 'size-14 border-[0.5rem]' : 'size-8 border-[0.35rem]'} border-muted-foreground border-b-transparent animate-spin`,
        className
      )}
      {...props}
    />
  );
  return fullscreen ? (
    <div className='flex min-h-svh h-full justify-center items-center'>
      {LoaderComp}
    </div>
  ) : LoaderComp
});

export default Loader;
