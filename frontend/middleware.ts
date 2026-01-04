import { NextRequest, NextResponse } from 'next/server';

// Simple placeholder middleware - replace with proper auth middleware when Better Auth is configured
export function middleware(request: NextRequest) {
  // For now, allow all routes
  // In a real implementation, this would check authentication
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
