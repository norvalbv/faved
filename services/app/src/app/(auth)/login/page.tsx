import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Content Review Platform",
  description: "Login to manage content submissions",
}

export default function LoginPage() {
  return (
    <main className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter your credentials to access the platform
          </p>
        </div>
        {/* Auth form will be added here */}
      </div>
    </main>
  )
} 