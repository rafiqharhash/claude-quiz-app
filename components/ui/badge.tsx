import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-violet-500/15 text-violet-300 border border-violet-500/20',
        secondary: 'bg-white/8 text-zinc-300 border border-white/10',
        success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
        warning: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/20',
        destructive: 'bg-red-500/15 text-red-300 border border-red-500/20',
        cyan: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20',
        outline: 'border border-white/15 text-zinc-300',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
