'use client'

import { cn } from '@/lib/utils'

export default function CheckMark({
  className, ...rest 
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
      className={cn('fill-foreground h-20', className)}
      {...rest}
    >
      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
    </svg>
  );
}
