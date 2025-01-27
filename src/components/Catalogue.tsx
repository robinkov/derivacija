import React from 'react'
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import DefaultImage from '@/assets/images/default.webp';

type CatalogueProviderProps = React.ComponentPropsWithoutRef<'div'> & {
};
const CatalogueProvider: React.FC<CatalogueProviderProps> = ({
  children, className, ...props
}) => (
  <div
    className={cn(
      'flex flex-col w-full space-y-4',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

type CatalogueTitleProps = React.ComponentPropsWithoutRef<'h1'> & {};
declare const Title: React.ForwardRefExoticComponent<CatalogueTitleProps & React.RefAttributes<HTMLHeadingElement>>;

const CatalogueTitle = React.forwardRef<
  React.ElementRef<typeof Title>,
  React.ComponentPropsWithoutRef<typeof Title>
>(({ children, className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn('text-xl font-semibold', className)}
    {...props}
  >
    {children}
  </h1>
));

type CatalogueContentProps = React.ComponentPropsWithoutRef<'div'> & {};
declare const Content: React.ForwardRefExoticComponent<CatalogueContentProps & React.RefAttributes<HTMLDivElement>>;

const CatalogueContent = React.forwardRef<
  React.ElementRef<typeof Content>,
  React.ComponentPropsWithRef<typeof Content>
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('grid gap-2 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4', className)}
    {...props}
  >
    {children}
  </div>
));

type CatalogueCardProps = React.ComponentPropsWithoutRef<typeof Card> & {
  title?: string,
  description?: string,
  image?: string
}
const CatalogueCard: React.FC<CatalogueCardProps> = ({
  title, description, image, ...props
}) => (
  <Card className='border-none bg-background shadow-none h-fit cursor-pointer rounded-md' {...props}>
    <CardContent className='p-0'>
      <AspectRatio ratio={16/9} className='flex overflow-hidden justify-center items-center rounded-md'>
        <img src={image ? image : DefaultImage} alt={title} className='w-full' />
      </AspectRatio>
    </CardContent>
    {
      (title || description) &&
      <CardFooter className='px-1 py-1'>
        <div>
          {title && <CardTitle className='text-base'>{title}</CardTitle>}
          {description && <CardDescription className='text-xs md:text-sm text-wrap'>{description}</CardDescription>}
        </div>
      </CardFooter>
    }
  </Card>
);

export { CatalogueProvider, CatalogueTitle, CatalogueContent, CatalogueCard };