'use client'

import { CatalogueCard, CatalogueContent, CatalogueProvider, CatalogueTitle } from '@/components/Catalogue';

export default function Content() {

  return (
    <div className='mx-auto p-4 space-y-5 w-full max-w-screen-lg'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      <CatalogueProvider>
        <CatalogueTitle>Moj sadržaj</CatalogueTitle>
        <CatalogueContent>
          <CatalogueCard title='Matematika' description='MATURA' />
        </CatalogueContent>
      </CatalogueProvider>
      <CatalogueProvider>
        <CatalogueTitle>Sve lekcije</CatalogueTitle>
        <CatalogueContent>
          <CatalogueCard title='Engleski' description='MATURA' />
          <CatalogueCard title='Fizika' description='MATURA' />
        </CatalogueContent>
      </CatalogueProvider>
    </div>
  );
}
