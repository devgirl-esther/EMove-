import { NextFunction, Request, Response } from 'express';
import User from '../model/userModel';
import Token from '../model/tokenModel';
import { toHash } from '../utils/passwordHashing';
import { sendEmail } from '../utils/email.config';
import crypto from 'crypto';
import Joi from "joi"
import { getToken, loginToken } from '../utils/token';
import { compare } from '../utils/passwordHashing';
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userData = req.body;
    try {
        let getExistingUsers = await User.findOne({
            email: req.body.email,
        });

        if (getExistingUsers) {
            return res.status(200).json({
                message: 'User already exists',
            });
        }

        const hashedPassword = await toHash(userData.password);

        const allUserData = {
            ...userData,
            password: hashedPassword,
        };

        const userSaved = await new User(allUserData).save();

        const token = await new Token({
            userId: userSaved._id,
            token: getToken(userSaved._id),
        }).save();

        const url = `${process.env.BASE_URL}/users/verify/${userSaved._id}/${token.token}`;
        const html = `<h1>Email Verification</h1>
        <h2>Hello ${userSaved.name}</h2>
        <p>Click the link below to verify mail</p>
        <a href=${url}>verify mail</a>
        </div>`
        await sendEmail(userSaved.email, 'Verify email', html);
        return res.status(200).send({
            message: 'An email has been sent to your account please verify',
            userId: userSaved._id,
            token: token.token
        });
    } catch (error) {
        return res.status(500).send({
            status: 'error',
        });
    }
};

export const verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findOne({
            _id: req.params.id,
        });

        if (!user) {
            return res.status(404).send({
                message: 'Invalid link',
            });
        }

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });

        if (!token) {
            return res.status(404).send({
                message: 'Invalid link',
            });
        }

        await User.updateOne(
            {
                _id: user._id,
            },
            {
                $set: {
                    verified: true,
                },
            }
        );

        await token.remove();

        return res.status(200).send({
            message: 'Email verified successfully',
        });
    } catch (error) {
        return res.status(500).send({
            status: 'error',
        });
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Invalid email ');

        const isMatch = await compare(user.password, req.body.password);
        if (!isMatch) return res.status(400).send('Invalid password');

        if (!user.verified) return res.status(400).send('User not verified');

        const token = loginToken(user._id.toString());

        res.status(200).send({
            message: 'login successful',
            user,
            loginToken: token,
        });
    } catch (error) {
        res.status(400).send('Error occured');
    }
};
export const forgotPassword  =async (
    req:Request, 
    res:Response,
    next:NextFunction
    ) => {
        try {
            const schema = Joi.object({ email: Joi.string().email().required() });
            const { error } = schema.validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);
    
            const user = await User.findOne({ email: req.body.email });
            if (!user)
                return res.status(400).send("user with given email doesn't exist");
    
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();
            }
    
            const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
            await sendEmail(user.email, "Password reset", link);
            //send password reset link to email
    
            res.send("password reset link sent to your email account");
        } catch (error) {
            res.send("An error occured");
            console.log(error);
        }
    };
    
    export const  resetPassword = async (
        req:Request, 
        res:Response,
        next:NextFunction
        ) => {
        try {
            const schema = Joi.object({ password: Joi.string().required() });
            const { error } = schema.validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);
    
            const user = await User.findById(req.params.userId);
            if (!user) return res.status(400).send("invalid link or expired");
    
            const token = await Token.findOne({
                userId: user._id,
                token: req.params.token,
            });
            if (!token) return res.status(400).send("Invalid link or expired");
    
            user.password = req.body.password;
            await user.save();
            await token.delete();
    
            res.send("password reset sucessfully.");
        } catch (error) {
            res.send("An error occured");
            console.log(error);
        }
    
    }










