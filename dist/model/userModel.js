"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const UserSchema = new Schema({
    name: { type: String, min: 3, required: true, max: 255 },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email",
        },
    },
    password: { type: String, required: true },
    verified: {
        type: Boolean,
        default: false,
    },
    phone: { type: Number, required: true },
    userType: { type: String, required: true },
}, {
    timestamps: true,
});
const User = mongoose_1.default.model("user", UserSchema);
exports.default = User;
