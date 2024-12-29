export default function Loading(): React.ReactElement {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-full animate-pulse rounded-lg bg-muted" />
        </div>

        {/* Overview Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-1/4 animate-pulse rounded-lg bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>

        {/* Timeline Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-1/4 animate-pulse rounded-lg bg-muted" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 animate-pulse rounded-lg bg-muted" />
                  <div className="h-3 w-full animate-pulse rounded-lg bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guidelines Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-1/4 animate-pulse rounded-lg bg-muted" />
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-5 w-1/4 animate-pulse rounded-lg bg-muted" />
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-4 w-full animate-pulse rounded-lg bg-muted" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
} 