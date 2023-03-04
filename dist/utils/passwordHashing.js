"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.toHash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const toHash = async (password) => {
    const salt = await bcrypt_1.default.genSalt(10);
    return await bcrypt_1.default.hash(password, salt);
};
exports.toHash = toHash;
const compare = async (storedPassword, suppliedPassword) => {
    return await bcrypt_1.default.compare(suppliedPassword, storedPassword);
};
exports.compare = compare;
