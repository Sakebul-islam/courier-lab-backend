"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        required: true,
    },
    isActive: { type: Boolean, default: true },
    isBlock: { type: Boolean, default: false },
}, {
    versionKey: false,
    timestamps: true
});
exports.User = (0, mongoose_1.model)('User', userSchema);
