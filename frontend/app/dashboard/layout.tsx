'use client';

import { signOut, useSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { LogOut, CheckSquare } from 'lucide-react';
import React, { Suspense } from 'react';

// Simple Error Boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center">
          <h2 className="text-xl font-semibold text-destructive">Something went wrong.</h2>
          <p className="text-muted-foreground mt-2">Please refresh the page or try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-bold hidden sm:block">Todo Web App</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border rounded-md"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden xs:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="h-32 bg-muted rounded-lg w-full"></div>
              <div className="h-64 bg-muted rounded-lg w-full"></div>
            </div>
          }>
            {children}
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}