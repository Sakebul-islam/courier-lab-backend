"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleJwtExpiredError = exports.handleJwtError = exports.handlerZodError = exports.handlerValidationError = exports.handlerDuplicateError = exports.handleCastError = void 0;
const handleCastError = (err) => {
    return {
        statusCode: 400,
        message: "Invalid MongoDB ObjectID. Please provide a valid id",
    };
};
exports.handleCastError = handleCastError;
/* eslint-disable @typescript-eslint/no-explicit-any */
const handlerDuplicateError = (err) => {
    const matchedArray = err.message.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: `${matchedArray[1]} already exists!!`,
    };
};
exports.handlerDuplicateError = handlerDuplicateError;
/* eslint-disable @typescript-eslint/no-explicit-any */
const handlerValidationError = (err) => {
    const errorSources = [];
    const errors = Object.values(err.errors);
    errors.forEach((errorObject) => errorSources.push({
        path: errorObject.path,
        message: errorObject.message,
    }));
    return {
        statusCode: 400,
        message: "Validation Error",
        errorSources,
    };
};
exports.handlerValidationError = handlerValidationError;
const handlerZodError = (err) => {
    const errorSources = [];
    err.issues.forEach((issue) => {
        errorSources.push({
            path: issue.path[issue.path.length - 1],
            message: issue.message,
        });
    });
    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources,
    };
};
exports.handlerZodError = handlerZodError;
// JWT Error Handlers
const handleJwtError = (err) => {
    return {
        statusCode: 401,
        message: "Invalid token. Please log in again!",
    };
};
exports.handleJwtError = handleJwtError;
const handleJwtExpiredError = (err) => {
    return {
        statusCode: 401,
        message: "Token expired. Please log in again!",
    };
};
exports.handleJwtExpiredError = handleJwtExpiredError;
