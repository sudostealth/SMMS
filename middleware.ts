import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  // Update session
  let response = NextResponse.next({
    request,
  });

  // Get the supabase client
  const supabase = await createClient();

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser();

  // Check if user is trying to access protected routes
  if (request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/batch") ||
      request.nextUrl.pathname.startsWith("/profile") ||
      request.nextUrl.pathname.startsWith("/create-batch")) {

    // Redirect to login if not authenticated
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check if email is verified
    if (!user.email_confirmed_at) {
      // Redirect to login with error message
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "verify_email");
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
