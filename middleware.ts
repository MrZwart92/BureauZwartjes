import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["nl", "en"];
const defaultLocale = "nl";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to default locale
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Match all paths except static files and API
    "/((?!api|_next|_vercel|favicon.ico|.*\\.[\\w]+$).*)",
  ],
};
