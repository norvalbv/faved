export default function Loading(): React.ReactElement {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-1/4 animate-pulse rounded-lg bg-muted" />
            <div className="h-6 w-1/2 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="h-16 animate-pulse rounded-lg border bg-card" />

        {/* List Skeleton */}
        <div className="divide-y rounded-lg border bg-card">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-24 animate-pulse rounded-lg bg-muted" />
                    <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-4 w-96 animate-pulse rounded-lg bg-muted" />
                    <div className="h-4 w-72 animate-pulse rounded-lg bg-muted" />
                  </div>
                </div>
                <div className="h-4 w-24 animate-pulse rounded-lg bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
} 