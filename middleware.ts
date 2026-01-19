import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except:
    // - API routes (/api/...)
    // - Next.js internals (/_next/...)
    // - Vercel internals (/_vercel/...)
    // - Static files with extensions (.ico, .png, .jpg, etc.)
    "/((?!api|_next|_vercel|favicon.ico|.*\\.[\\w]+$).*)",
    // Always match root
    "/",
  ],
};
