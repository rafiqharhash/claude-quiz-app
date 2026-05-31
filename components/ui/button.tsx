import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-violet-600 hover:shadow-violet-500/40 active:scale-[0.98]',
        secondary:
          'bg-white/8 border border-white/10 text-white hover:bg-white/12 active:scale-[0.98]',
        ghost: 'text-zinc-400 hover:text-white hover:bg-white/8 active:scale-[0.98]',
        destructive:
          'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 active:scale-[0.98]',
        outline:
          'border border-white/15 bg-transparent text-white hover:bg-white/8 active:scale-[0.98]',
        success:
          'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 active:scale-[0.98]',
        cyan: 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-500 hover:to-cyan-600 active:scale-[0.98]',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
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
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
