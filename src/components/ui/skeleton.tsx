import { cn } from "@/lib/utils"

interface SkeletonProps extends React.ComponentProps<"div"> {
  variant?: 'default' | 'text' | 'circular' | 'rectangular'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  speed?: 'slow' | 'normal' | 'fast'
}

const variantClasses = {
  default: 'rounded-md',
  text: 'rounded-sm',
  circular: 'rounded-full',
  rectangular: 'rounded-none'
}

const sizeClasses = {
  sm: 'h-4',
  md: 'h-6',
  lg: 'h-8',
  xl: 'h-12'
}

const speedClasses = {
  slow: 'animate-[skeleton-shimmer_3s_ease-in-out_infinite]',
  normal: 'animate-[skeleton-shimmer_2s_ease-in-out_infinite]',
  fast: 'animate-[skeleton-shimmer_1.5s_ease-in-out_infinite]'
}

function Skeleton({ 
  className, 
  variant = 'default',
  size,
  speed = 'normal',
  ...props 
}: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      data-variant={variant}
      className={cn(
        "bg-accent will-change-transform contain-layout-style-paint",
        variantClasses[variant],
        size && sizeClasses[size],
        speedClasses[speed],
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
