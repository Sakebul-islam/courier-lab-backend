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
exports.checkAuth = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const user_model_1 = require("../modules/user/user.model");
const jwt_1 = require("../utils/jwt");
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check for token in Authorization header first, then in cookies
        let accessToken = req.headers.authorization;
        // If no token in header, check cookies
        if (!accessToken) {
            accessToken = req.cookies.accessToken;
        }
        if (!accessToken) {
            throw new AppError_1.default(403, "No Token Received");
        }
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
    catch (error) {
        next(error);
    }
});
exports.checkAuth = checkAuth;
