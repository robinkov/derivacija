'use client'

import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

type ViewportProps = React.ComponentPropsWithoutRef<'div'>;
const Viewport: React.FC<ViewportProps> = (
  { children, className, ...props }
) => (
  <div className={cn('flex flex-col min-h-svh h-full', className)} {...props}>
    {children}
  </div>
);

const mainVariants = cva(
  'flex flex-1 flex-col',
  {
    variants: {
      alignment: {
        center: 'justify-center items-center'
      }
    }
  }
);

type ViewportMainProps = React.ComponentPropsWithoutRef<'div'> & VariantProps<typeof mainVariants>;
declare const Main: React.ForwardRefExoticComponent<ViewportMainProps & React.RefAttributes<HTMLDivElement>>;

const ViewportMain = React.forwardRef<
  React.ElementRef<typeof Main>,
  React.ComponentPropsWithoutRef<typeof Main>
>(({ children, className, alignment, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(mainVariants({ alignment, className }))}
    {...props}
  >
    {children}
  </div>
));

type ViewportFooterProps = React.ComponentPropsWithoutRef<'div'>;
declare const Footer: React.ForwardRefExoticComponent<ViewportFooterProps & React.RefAttributes<HTMLDivElement>>;

const ViewportFooter = React.forwardRef<
  React.ElementRef<typeof Footer>,
  React.ComponentPropsWithoutRef<typeof Footer>
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    {...props}
  >
    {children}
  </div>
));

type ViewportHeaderProps = React.ComponentPropsWithoutRef<'div'>;
declare const Header: React.ForwardRefExoticComponent<ViewportHeaderProps & React.RefAttributes<HTMLDivElement>>;

const ViewportHeader = React.forwardRef<
  React.ElementRef<typeof Header>,
  React.ComponentPropsWithoutRef<typeof Header>
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    {...props}
  >
    {children}
  </div>
));

export { Viewport, ViewportMain, ViewportFooter, ViewportHeader };
