'use client'

import { cn } from '@/lib/utils'

export default function ArrowLeft({
  className, ...rest 
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
      className={cn('fill-foreground h-20', className)}
      {...rest}
    >
      <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z"/>
    </svg>
  );
}
