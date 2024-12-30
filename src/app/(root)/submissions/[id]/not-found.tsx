import Link from "next/link"

export default function NotFound(): React.ReactElement {
  return (
    <main className="container mx-auto flex min-h-[50vh] items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Submission not found</h2>
        <p className="mt-2 text-muted-foreground">
          The submission you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          Return to dashboard
        </Link>
      </div>
    </main>
  )
} 