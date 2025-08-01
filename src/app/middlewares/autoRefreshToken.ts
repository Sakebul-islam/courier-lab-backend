import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { User } from "../modules/user/user.model";
import { verifyToken } from "../utils/jwt";
import { createAccessTokenWithRefreshToken } from "../utils/userToken";

// Convert JWT expiration string to milliseconds
const convertJwtExpiryToMs = (expiry: string): number => {
  const unit = expiry.slice(-1);
  const value = parseInt(expiry.slice(0, -1));

  switch (unit) {
    case "s":
      return value * 1000; // seconds
    case "m":
      return value * 60 * 1000; // minutes
    case "h":
      return value * 60 * 60 * 1000; // hours
    case "d":
      return value * 24 * 60 * 60 * 1000; // days
    default:
      return 15 * 60 * 1000; // default 15 minutes
  }
};

export const autoRefreshToken =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check for token in Authorization header first, then in cookies
      let accessToken = req.headers.authorization;
      let isHeaderAuth = false;

      // If no token in header, check cookies
      if (!accessToken) {
        accessToken = req.cookies.accessToken;
      } else {
        isHeaderAuth = true;
      }

      if (!accessToken) {
        throw new AppError(403, "No Token Received");
      }

      // Development logging
      if (envVars.NODE_ENV === "development") {
        console.log("🔍 Auth Debug:", {
          hasHeaderToken: !!req.headers.authorization,
          hasCookieToken: !!req.cookies.accessToken,
          hasRefreshToken: !!req.cookies.refreshToken,
          isHeaderAuth,
          cookies: Object.keys(req.cookies),
        });
      }

      try {
        // Try to verify the access token
        const verifiedToken = verifyToken(
          accessToken,
          envVars.JWT_ACCESS_SECRET
        ) as JwtPayload;

        const isUserExits = await User.findOne({ email: verifiedToken.email });
        if (!isUserExits) {
          throw new AppError(400, "user does not found");
        }

        if (isUserExits.isBlock === true) {
          throw new AppError(403, "Your account is blocked");
        }

        if (isUserExits.isActive === false) {
          throw new AppError(403, "Your account is deactivate");
        }

        if (!authRoles.includes(verifiedToken.role)) {
          throw new AppError(
            403,
            "You are not permitted to view this route!!!"
          );
        }

        req.user = verifiedToken;
        next();
      } catch (tokenError: unknown) {
        // If token is expired, try to refresh it
        if (
          tokenError instanceof Error &&
          tokenError.name === "TokenExpiredError"
        ) {
          const refreshToken = req.cookies.refreshToken;

          // Development logging for token refresh
          if (envVars.NODE_ENV === "development") {
            console.log("🔄 Token Refresh Attempt:", {
              hasRefreshToken: !!refreshToken,
              isHeaderAuth,
              error: tokenError.message,
            });
          }

          // If using header auth and no refresh token in cookies, can't auto-refresh
          if (isHeaderAuth && !refreshToken) {
            throw new AppError(
              401,
              "Token expired. Please log in again to get a new token."
            );
          }

          // If no refresh token available (cookie-based auth)
          if (!refreshToken) {
            throw new AppError(401, "Session expired. Please log in again.");
          }

          try {
            // Try to get new access token using refresh token
            const newAccessToken = await createAccessTokenWithRefreshToken(
              refreshToken
            );

            // Set new access token in cookie with environment-based expiration
            res.cookie("accessToken", newAccessToken, {
              httpOnly: true,
              secure: false,
              sameSite: "lax",
              maxAge: convertJwtExpiryToMs(envVars.JWT_ACCESS_EXPIRES),
            });

            // Verify the new token and set user
            const verifiedNewToken = verifyToken(
              newAccessToken,
              envVars.JWT_ACCESS_SECRET
            ) as JwtPayload;

            const isUserExits = await User.findOne({
              email: verifiedNewToken.email,
            });
            if (!isUserExits) {
              throw new AppError(400, "user does not found");
            }

            if (isUserExits.isBlock === true) {
              throw new AppError(403, "Your account is blocked");
            }

            if (isUserExits.isActive === false) {
              throw new AppError(403, "Your account is deactivate");
            }

            if (!authRoles.includes(verifiedNewToken.role)) {
              throw new AppError(
                403,
                "You are not permitted to view this route!!!"
              );
            }

            req.user = verifiedNewToken;
            next();
          } catch (refreshError: unknown) {
            // If refresh token is also invalid/expired, clear cookies and ask for re-login
            res.clearCookie("accessToken", {
              httpOnly: true,
              secure: false,
              sameSite: "lax",
            });
            res.clearCookie("refreshToken", {
              httpOnly: true,
              secure: false,
              sameSite: "lax",
            });

            // Check if it's a token expiration error
            if (refreshError instanceof Error && refreshError.name === "TokenExpiredError") {
              throw new AppError(401, "Both access and refresh tokens have expired. Please log in again.");
            } else if (refreshError instanceof AppError) {
              // Re-throw AppError with its original message
              throw refreshError;
            } else {
              throw new AppError(401, "Session expired. Please log in again.");
            }
          }
        } else {
          // If it's not an expiration error, throw the original error
          throw tokenError;
        }
      }
    } catch (error) {
      next(error);
    }
  };
