export default function Loading(): React.ReactElement {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-1/3 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-24 animate-pulse rounded-lg bg-muted" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-24 animate-pulse rounded-lg bg-muted" />
          <div className="space-y-2 rounded-lg border bg-card p-6">
            <div className="h-4 w-full animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>

        {/* Metadata Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-24 animate-pulse rounded-lg bg-muted" />
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-16 animate-pulse rounded-lg bg-muted" />
              <div className="h-4 w-24 animate-pulse rounded-lg bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded-lg bg-muted" />
              <div className="h-4 w-24 animate-pulse rounded-lg bg-muted" />
            </div>
          </dl>
        </div>

        {/* Feedback Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-24 animate-pulse rounded-lg bg-muted" />
          <div className="h-24 animate-pulse rounded-lg border bg-card" />
        </div>
      </div>
    </main>
  )
} 