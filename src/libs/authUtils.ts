import * as jose from "jose";
import * as crypto from "crypto";

/**
 * Generates a user token.
 * @param {Object} user - The user payload.
 * @param {string} user.id - The user ID.
 * @param {boolean} user.isAdmin - Whether the user is an admin.
 * @returns {Promise<string>} The generated JWT.
 */
export const generateUserToken = async (user) => {
  const secret = new TextEncoder().encode(process.env.USER_TOKEN_SECRET);

  const jwt = await new jose.SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);
  return jwt;
};

/**
 * Generates an admin token.
 * @param {Object} admin - The admin payload.
 * @param {string} admin.id - The admin ID.
 * @param {boolean} admin.isAdmin - Whether the admin is an admin.
 * @returns {Promise<string>} The generated JWT.
 */
export const generateAdminToken = async (admin) => {
  const secret = new TextEncoder().encode(process.env.USER_TOKEN_SECRET);
  const jwt = await new jose.SignJWT(admin)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);
  return jwt;
};

/**
 * Decodes a token.
 * @param {string} token - The JWT to decode.
 * @param {boolean} [isAdmin=false] - Whether the token is for an admin.
 * @returns {Promise<{id: string, isAdmin: boolean} | null>} The decoded payload.
 */
export const decodeToken = async (token, isAdmin = false) => {
  try {
    const secret = new TextEncoder().encode(process.env.USER_TOKEN_SECRET);

    const { payload } = await jose.jwtVerify(token, secret);
    return {
      id: payload.id,
      isAdmin: payload.isAdmin,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

/**
 * Decodes a token.
 * @param {string} token - The JWT to decode.
 * @returns {Promise<{email: string} | null>} The decoded payload.
 */
export const decodeVerifyToken = async (token) => {
  try {
    const secret = new TextEncoder().encode(process.env.USER_TOKEN_SECRET);

    const { payload } = await jose.jwtVerify(token, secret);
    return {
      email: payload.email,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

/**
 * Authenticates an admin token.
 * @param {string} token - The JWT to decode.
 * @returns {Promise<{id: string, isAdmin: boolean} | null>} The decoded payload.
 */
export const adminAuthentication = (token) => {
  return decodeToken(token, false);
};

/**
 * Authenticates a user token.
 * @param {string} token - The JWT to decode.
 * @returns {Promise<{id: string, isAdmin: boolean} | null>} The decoded payload.
 */
export const userAuthentication = (token) => {
  return decodeToken(token, false);
};
