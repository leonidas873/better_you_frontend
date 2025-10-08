/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary-500 text-primary-50 hover:bg-primary-600 active:bg-primary-700',
        destructive: 'bg-error text-white hover:bg-red-600 active:bg-red-700',
        outline:
          'border border-primary-500 bg-transparent text-primary-500 hover:bg-primary-50 hover:text-primary-600 active:bg-primary-100',
        secondary:
          'bg-secondary-500 text-secondary-50 hover:bg-secondary-600 active:bg-secondary-700',
        ghost:
          'hover:bg-primary-50 hover:text-primary-600 active:bg-primary-100',
        link: 'text-primary-500 underline-offset-4 hover:underline active:text-primary-600',
        success:
          'bg-success text-white hover:bg-secondary-600 active:bg-secondary-700',
        warning:
          'bg-warning text-white hover:bg-orange-600 active:bg-orange-700',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
