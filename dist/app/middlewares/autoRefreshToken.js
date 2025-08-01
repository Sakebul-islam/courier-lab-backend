"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoRefreshToken = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const user_model_1 = require("../modules/user/user.model");
const jwt_1 = require("../utils/jwt");
const userToken_1 = require("../utils/userToken");
// Convert JWT expiration string to milliseconds
const convertJwtExpiryToMs = (expiry) => {
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
const autoRefreshToken = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check for token in Authorization header first, then in cookies
        let accessToken = req.headers.authorization;
        let isHeaderAuth = false;
        // If no token in header, check cookies
        if (!accessToken) {
            accessToken = req.cookies.accessToken;
        }
        else {
            isHeaderAuth = true;
        }
        if (!accessToken) {
            throw new AppError_1.default(403, "No Token Received");
        }
        // Development logging
        if (env_1.envVars.NODE_ENV === "development") {
            // eslint-disable-next-line no-console
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
            const verifiedToken = (0, jwt_1.verifyToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
            const isUserExits = yield user_model_1.User.findOne({ email: verifiedToken.email });
            if (!isUserExits) {
                throw new AppError_1.default(400, "user does not found");
            }
            if (isUserExits.isBlock === true) {
                throw new AppError_1.default(403, "Your account is blocked");
            }
            if (isUserExits.isActive === false) {
                throw new AppError_1.default(403, "Your account is deactivate");
            }
            if (!authRoles.includes(verifiedToken.role)) {
                throw new AppError_1.default(403, "You are not permitted to view this route!!!");
            }
            req.user = verifiedToken;
            next();
        }
        catch (tokenError) {
            // If token is expired, try to refresh it
            if (tokenError instanceof Error &&
                tokenError.name === "TokenExpiredError") {
                const refreshToken = req.cookies.refreshToken;
                // Development logging for token refresh
                if (env_1.envVars.NODE_ENV === "development") {
                    // eslint-disable-next-line no-console
                    console.log("🔄 Token Refresh Attempt:", {
                        hasRefreshToken: !!refreshToken,
                        isHeaderAuth,
                        error: tokenError.message,
                    });
                }
                // If using header auth and no refresh token in cookies, can't auto-refresh
                if (isHeaderAuth && !refreshToken) {
                    throw new AppError_1.default(401, "Token expired. Please log in again to get a new token.");
                }
                // If no refresh token available (cookie-based auth)
                if (!refreshToken) {
                    throw new AppError_1.default(401, "Session expired. Please log in again.");
                }
                try {
                    // Try to get new access token using refresh token
                    const newAccessToken = yield (0, userToken_1.createAccessTokenWithRefreshToken)(refreshToken);
                    // Set new access token in cookie with environment-based expiration
                    res.cookie("accessToken", newAccessToken, {
                        httpOnly: true,
                        secure: false,
                        sameSite: "lax",
                        maxAge: convertJwtExpiryToMs(env_1.envVars.JWT_ACCESS_EXPIRES),
                    });
                    // Verify the new token and set user
                    const verifiedNewToken = (0, jwt_1.verifyToken)(newAccessToken, env_1.envVars.JWT_ACCESS_SECRET);
                    const isUserExits = yield user_model_1.User.findOne({
                        email: verifiedNewToken.email,
                    });
                    if (!isUserExits) {
                        throw new AppError_1.default(400, "user does not found");
                    }
                    if (isUserExits.isBlock === true) {
                        throw new AppError_1.default(403, "Your account is blocked");
                    }
                    if (isUserExits.isActive === false) {
                        throw new AppError_1.default(403, "Your account is deactivate");
                    }
                    if (!authRoles.includes(verifiedNewToken.role)) {
                        throw new AppError_1.default(403, "You are not permitted to view this route!!!");
                    }
                    req.user = verifiedNewToken;
                    next();
                }
                catch (refreshError) {
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
                        throw new AppError_1.default(401, "Both access and refresh tokens have expired. Please log in again.");
                    }
                    else if (refreshError instanceof AppError_1.default) {
                        // Re-throw AppError with its original message
                        throw refreshError;
                    }
                    else {
                        throw new AppError_1.default(401, "Session expired. Please log in again.");
                    }
                }
            }
            else {
                // If it's not an expiration error, throw the original error
                throw tokenError;
            }
        }
    }
    catch (error) {
        next(error);
    }
});
exports.autoRefreshToken = autoRefreshToken;
