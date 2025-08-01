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
exports.globalErrorhandler = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const handleAllErrorFunction_1 = require("../errorHelpers/handleAllErrorFunction");
const globalErrorhandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (env_1.envVars.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log(err);
    }
    let errorSources = [];
    let statuscode = 500;
    let message = `Something Went Wrong!!`;
    //Duplicate error
    if (err.code === 11000) {
        const simplifiedError = (0, handleAllErrorFunction_1.handlerDuplicateError)(err);
        statuscode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Object ID error / Cast Error
    else if (err.name === "CastError") {
        const simplifiedError = (0, handleAllErrorFunction_1.handleCastError)(err);
        statuscode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if (err.name === "ZodError") {
        const simplifiedError = (0, handleAllErrorFunction_1.handlerZodError)(err);
        statuscode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    //Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handleAllErrorFunction_1.handlerValidationError)(err);
        statuscode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources;
        message = simplifiedError.message;
    }
    // JWT Errors
    else if (err.name === "JsonWebTokenError") {
        const simplifiedError = (0, handleAllErrorFunction_1.handleJwtError)(err);
        statuscode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if (err.name === "TokenExpiredError") {
        const simplifiedError = (0, handleAllErrorFunction_1.handleJwtExpiredError)(err);
        statuscode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if (err instanceof AppError_1.default) {
        statuscode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statuscode = 500;
        message = err.message;
    }
    res.status(statuscode).json({
        success: false,
        message,
        err: env_1.envVars.NODE_ENV === "development" ? err : null,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : null,
    });
});
exports.globalErrorhandler = globalErrorhandler;
