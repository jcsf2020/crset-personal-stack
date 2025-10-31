import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/50 backdrop-blur-sm",
        "relative overflow-hidden",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        "before:animate-shimmer before:transform before:translate-x-[-100%]",
        className
      )}
      style={{
        animationDuration: "2s",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite"
      }}
      {...props}
    />
  )
}

// Specialized skeletons for common components
function CardSkeleton() {
  return (
    <div className="space-y-3 p-6 border rounded-lg bg-card/50 backdrop-blur-sm">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

function ButtonSkeleton() {
  return <Skeleton className="h-10 w-24 rounded-md" />
}

function AvatarSkeleton() {
  return <Skeleton className="h-12 w-12 rounded-full" />
}

function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )} 
        />
      ))}
    </div>
  )
}

export { 
  Skeleton, 
  CardSkeleton, 
  ButtonSkeleton, 
  AvatarSkeleton, 
  TextSkeleton 
}
