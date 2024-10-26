import { NextRequest, NextResponse } from "next/server";
import { decodeToken } from "./libs/authUtils";

interface TokenPayload {
  id: string;
  isAdmin: boolean;
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log("Middleware Triggered");
  console.log("Request Path", pathname);

  // Manually set CORS headers
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*"); // Be more specific in production environments
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, application/json"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  if (!pathname.startsWith("/api")) {
    return response;
  }

  console.log("All Cookies: ", req.cookies);

  // Paths that require middleware intervention
  const pathsToCheck = ["/api/user/", "/api/admin/"];

  // Check if the current pathname starts with any of the paths in pathsToCheck
  const isProtectedRoute = pathsToCheck.some((path) =>
    pathname.startsWith(path)
  );

  console.log("Protected Route", isProtectedRoute);

  // If the path is not in the protected routes, skip middleware processing
  if (!isProtectedRoute) {
    return response;
  }

  // Extract token from the cookie
  const token = req.cookies.get("user-token");

  const isAdminUrl =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (isAdminUrl && pathname.startsWith("/api/admin/login")) {
    return response;
  }

  console.log("TOKEN: ", token.value, "PATH", pathname);

  // Check if the token is not available
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    // Decode the token using a function that you expect to resolve to a payload containing `id` and `isAdmin`
    const { id, isAdmin } = (await decodeToken(
      token.value,
      false
    )) as TokenPayload;
    console.log(id, isAdmin);

    // Check if the id exists and is decoded properly
    if (id || isAdmin) {
      response.headers.set("x-user-id", id);
      response.headers.set("x-is-admin", isAdmin ? "true" : "false");

      return response;
    } else {
      console.log("HERE REDIRECTING");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}
