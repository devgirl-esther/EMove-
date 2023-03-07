"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.verifyEmail = exports.register = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const tokenModel_1 = __importDefault(require("../model/tokenModel"));
const passwordHashing_1 = require("../utils/passwordHashing");
const email_config_1 = require("../utils/email.config");
const token_1 = require("../utils/token");
const passwordHashing_2 = require("../utils/passwordHashing");
const register = async (req, res, next) => {
    const userData = req.body;
    try {
        let getExistingUsers = await userModel_1.default.findOne({
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
        const userSaved = await new userModel_1.default(allUserData).save();
        const token = await new tokenModel_1.default({
            userId: userSaved._id,
            token: (0, token_1.getToken)(userSaved._id),
        }).save();
        const url = `${process.env.BASE_URL}/users/verify/${userSaved._id}/${token.token}`;
        const html = `<h1>Email Verification</h1>
        <h2>Hello ${userSaved.name}</h2>
        <p>Click the link below to verify mail</p>
        <a href=${url}>verify mail</a>
        </div>`;
        await (0, email_config_1.sendEmail)(userSaved.email, 'Verify email', html);
        return res.status(200).send({
            message: 'An email has been sent to your account please verify',
            userId: userSaved._id,
            token: token.token
        });
    }
    catch (error) {
        return res.status(500).send({
            status: 'error',
        });
    }
};
exports.register = register;
const verifyEmail = async (req, res, next) => {
    try {
        const user = await userModel_1.default.findOne({
            _id: req.params.id,
        });
        if (!user) {
            return res.status(404).send({
                message: 'Invalid link',
            });
        }
        const token = await tokenModel_1.default.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) {
            return res.status(404).send({
                message: 'Invalid link',
            });
        }
        await userModel_1.default.updateOne({
            _id: user._id,
        }, {
            $set: {
                verified: true,
            },
        });
        await token.remove();
        return res.status(200).send({
            message: 'Email verified successfully',
        });
    }
    catch (error) {
        return res.status(500).send({
            status: 'error',
        });
    }
};
exports.verifyEmail = verifyEmail;
const login = async (req, res, next) => {
    try {
        const user = await userModel_1.default.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send('Invalid email ');
        const isMatch = await (0, passwordHashing_2.compare)(user.password, req.body.password);
        if (!isMatch)
            return res.status(400).send('Invalid password');
        if (!user.verified)
            return res.status(400).send('User not verified');
        const token = (0, token_1.loginToken)(user._id.toString());
        res.status(200).send({
            message: 'login successful',
            user,
            loginToken: token,
        });
    }
    catch (error) {
        res.status(400).send('Error occured');
    }
};
exports.login = login;
