'use client'

import { Viewport, ViewportMain } from '@/components/Viewport'

type ErrorProps = {
  code: number,
  description?: string
}

export default function Error({ code, description }: ErrorProps) {
  return (
    <Viewport>
      <ViewportMain alignment='center' className='px-2'>
        <div className='flex flex-col text-center gap-2'>
          <h1 className='font-semibold text-4xl'>
            <span className='text-2xl'>Error</span> {code}
          </h1>
          <p className='text-muted-foreground'>{description}</p>
        </div>
      </ViewportMain>
    </Viewport>
  );
}
