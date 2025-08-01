"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const env_1 = require("../config/env");
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
// set cookies in Browser
const setAuthCookie = (res, tokenInfo) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: convertJwtExpiryToMs(env_1.envVars.JWT_ACCESS_EXPIRES),
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: convertJwtExpiryToMs(env_1.envVars.JWT_REFRESH_EXPIRES),
        });
    }
};
exports.setAuthCookie = setAuthCookie;
