"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.changePassword = exports.login = exports.verifyEmail = exports.register = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const tokenModel_1 = __importDefault(require("../model/tokenModel"));
const passwordHashing_1 = require("../utils/passwordHashing");
const email_config_1 = require("../utils/email.config");
const crypto_1 = __importDefault(require("crypto"));
const joi_1 = __importDefault(require("joi"));
const token_1 = require("../utils/token");
const passwordHashing_2 = require("../utils/passwordHashing");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
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
            token: token.token,
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
const changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res
            .status(400)
            .json({ error: 'fill required password' });
    }
    const { authorization } = req.headers;
    if (!authorization) {
        console.log('auth fired');
        return res
            .status(401)
            .json({ error: 'Access denied. No token provided.' });
    }
    // Get the JWT token from the authorization header
    const token = authorization.split(' ')[1];
    const secret = process.env.JWTSECRET;
    // Decode the JWT and extract the user ID
    try {
        const decoded = (await jwt.verify(token, secret));
        if (!decoded) {
            return res.status(400).json({ error: 'Invalid token' });
        }
        const userId = decoded._id;
        try {
            // Find the user by their ID
            const user = await userModel_1.default.findById(userId);
            if (user) {
                // Check if the current password matches
                const passwordMatches = await bcrypt_1.default.compare(currentPassword, user.password);
                if (!passwordMatches) {
                    return res
                        .status(400)
                        .json({ error: 'Current password is incorrect' });
                }
                // Check if the new password and confirmation match
                if (newPassword !== confirmNewPassword) {
                    return res
                        .status(400)
                        .json({ error: 'New passwords do not match' });
                }
                // Hash the new password and save it to the database
                const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
                user.password = hashedPassword;
                await user.save();
                // Send a success response
                return res.status(200).json({
                    message: 'Password updated successfully',
                    status: 'sucess',
                });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};
exports.changePassword = changePassword;
const forgotPassword = async (req, res, next) => {
    try {
        const schema = joi_1.default.object({ email: joi_1.default.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        const user = await userModel_1.default.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send("user with given email doesn't exist");
        let token = await tokenModel_1.default.findOne({ userId: user._id });
        if (!token) {
            token = await new tokenModel_1.default({
                userId: user._id,
                token: crypto_1.default.randomBytes(32).toString("hex"),
            }).save();
        }
        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
        await (0, email_config_1.sendEmail)(user.email, "Password reset", link);
        res.send("password reset link sent to your email account");
    }
    catch (error) {
        res.send("An error occured");
        console.log(error);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        const schema = joi_1.default.object({ password: joi_1.default.string().required() });
        const { error } = schema.validate(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        const user = await userModel_1.default.findById(req.params.userId);
        if (!user)
            return res.status(400).send("invalid link or expired");
        const token = await tokenModel_1.default.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token)
            return res.status(400).send("Invalid link or expired");
        user.password = req.body.password;
        await user.save();
        await token.delete();
        res.send("password reset sucessfully.");
    }
    catch (error) {
        res.send("An error occured");
        console.log(error);
    }
};
exports.resetPassword = resetPassword;
