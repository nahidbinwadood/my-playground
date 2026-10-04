import { NextRequest, NextResponse } from 'next/server';

// Clears a dead session and sends the visitor to login. Lives in a route
// handler because server components (the admin layout) cannot write cookies.
export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/auth/login', request.url));
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');
  return response;
}
