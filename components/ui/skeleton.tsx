import * as React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('shimmer rounded-xl bg-white/6', className)}
      aria-hidden="true"
      {...props}
    />
  );
}

/** Full quiz generation loading skeleton */
function QuizGeneratingSkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading quiz questions" role="status">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-6 space-y-4">
          <Skeleton className="h-5 w-3/4" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export { Skeleton, QuizGeneratingSkeleton };
