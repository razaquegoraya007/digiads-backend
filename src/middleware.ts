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
  response.headers.set("Access-Control-Allow-Credentials", "true");

  // Paths that require middleware intervention
  const pathsToCheck = ["/api/user/", "/api/admin/", "/admin/", "/user/"];

  // Check if the current pathname starts with any of the paths in pathsToCheck
  const isProtectedRoute = pathsToCheck.some((path) =>
    pathname.startsWith(path)
  );

  // If the path is not in the protected routes, skip middleware processing
  if (!isProtectedRoute) {
    return response;
  }

  // Extract token from the cookie
  const token = req.cookies.get("user-token");

  // Check if the token is not available
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const isAdminUrl =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  try {
    // Decode the token using a function that you expect to resolve to a payload containing `id` and `isAdmin`
    const { id, isAdmin } = (await decodeToken(
      token,
      isAdminUrl
    )) as TokenPayload;
    console.log(id, isAdmin);

    // Check if the id exists and is decoded properly
    if (id || isAdmin) {
      response.headers.set("x-user-id", id);
      response.headers.set("x-is-admin", isAdmin ? "true" : "false");

      return response;
    } else {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}
