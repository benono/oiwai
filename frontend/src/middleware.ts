import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/event(.*)', '/my-page(.*)'])

const isPublicRoute = createRouteMatcher(["/", "/rsvp(.*)", "/sign-in(.*)"]);


export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  const currentPath = req.nextUrl.pathname;

  if (userId && isPublicRoute(req) && currentPath !== "/my-page") {
    return NextResponse.redirect(new URL("/my-page", req.url));
  }

  if (!userId && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
