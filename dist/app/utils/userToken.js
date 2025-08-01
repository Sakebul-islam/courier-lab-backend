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
exports.createAccessTokenWithRefreshToken = exports.createUserToken = void 0;
const env_1 = require("../config/env");
const jwt_1 = require("./jwt");
const user_model_1 = require("../modules/user/user.model");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
// crate access token and refresh token
const createUserToken = (user) => {
    const JwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwt_1.generateToken)(JwtPayload, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
    const refreshToken = (0, jwt_1.generateToken)(JwtPayload, env_1.envVars.JWT_REFRESH_SECRET, env_1.envVars.JWT_REFRESH_EXPIRES);
    return {
        accessToken,
        refreshToken,
    };
};
exports.createUserToken = createUserToken;
const createAccessTokenWithRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifiedRefreshToken = (0, jwt_1.verifyToken)(refreshToken, env_1.envVars.JWT_REFRESH_SECRET);
        const isUserExits = yield user_model_1.User.findOne({
            email: verifiedRefreshToken.email,
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
        const JwtPayload = {
            userId: isUserExits._id,
            email: isUserExits.email,
            role: isUserExits.role,
        };
        const accessToken = (0, jwt_1.generateToken)(JwtPayload, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
        return accessToken;
    }
    catch (error) {
        // If it's a JWT error (expired/invalid), re-throw it
        if (error instanceof Error &&
            (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError")) {
            throw error;
        }
        // For other errors, throw as AppError
        if (error instanceof AppError_1.default) {
            throw error;
        }
        throw new AppError_1.default(401, "Invalid refresh token");
    }
});
exports.createAccessTokenWithRefreshToken = createAccessTokenWithRefreshToken;
