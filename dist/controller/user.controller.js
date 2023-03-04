"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const passwordHashing_1 = require("../utils/passwordHashing");
const register = async (req, res, next) => {
    const userData = req.body;
    try {
        const getExistingUsers = await userModel_1.default.findOne({
            email: req.body.email,
        });
        if (getExistingUsers) {
            return res.status(200).json({
                message: 'User already exists',
            });
        }
        const hashedPassword = await (0, passwordHashing_1.toHash)(userData.password);
        const allUserData = {
            ...userData,
            password: hashedPassword,
        };
        const user = new userModel_1.default(allUserData);
        await user.save();
        res.status(200).send({
            status: 'success',
            path: req.url,
            message: `New user with email - ${userData.email} added successfully`,
            data: allUserData,
        });
    }
    catch (error) {
        return res.status(500).send({
            status: 'error',
        });
    }
};
exports.register = register;
