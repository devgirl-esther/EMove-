"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginToken = exports.getToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getToken = (_id) => {
    const secret = process.env.JWTSECRET;
    return jsonwebtoken_1.default.sign({ _id }, secret, {
        expiresIn: '30d',
    });
};
exports.getToken = getToken;
const loginToken = (_id) => {
    const secret = process.env.JWTLOGINSECRET;
    return jsonwebtoken_1.default.sign({ _id }, secret, { expiresIn: '7d' });
};
exports.loginToken = loginToken;
