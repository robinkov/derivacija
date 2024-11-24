'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

const separatorVariants = cva(
  'px-2',
  {
    variants: {
      childOf: {
        default: 'bg-background',
        card: 'bg-card'
      }
    },
    defaultVariants: {
      childOf: 'default'
    }
  }
);

type SeparatorProps = React.ComponentPropsWithoutRef<'div'> & {
  childOf?: 'card'
};
declare const SeparatorComponent: React.ForwardRefExoticComponent<SeparatorProps & React.RefAttributes<HTMLDivElement>>;

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorComponent>,
  React.ComponentPropsWithoutRef<typeof SeparatorComponent>
>(({ children, className, childOf, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'peer flex w-full relative justify-center text-muted-foreground z-0 before:absolute before:content-normal before:inset-0 before:h-[1px] before:bg-muted-foreground before:top-1/2 before:-z-10',
      className
    )}
    {...props}
  >
    <div className={cn(separatorVariants({ childOf, className }))}>
      {children}
    </div>
  </div>
));

export default Separator;
