import { NextFunction, Request, Response } from 'express'
import User from '../model/userModel'
import Token from '../model/tokenModel'
import { toHash } from '../utils/passwordHashing'
import { sendEmail } from '../utils/email.config'
import crypto from 'crypto'
import { getToken } from '../utils/token'

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userData = req.body
    try {
        let getExistingUsers = await User.findOne({
            email: req.body.email,
        })

        if (getExistingUsers) {
            return res.status(200).json({
                message: 'User already exists',
            })
        }

        const hashedPassword = await toHash(userData.password)

        const allUserData = {
            ...userData,
            password: hashedPassword,
        }

        const userSaved = await new User(allUserData).save()

        const token = await new Token({
            userId: userSaved._id,
            token: getToken(userSaved._id),
        }).save()

        const url = `http://localhost:8081/users/verify/${userSaved._id}/${token.token}`
        await sendEmail(userSaved.email, 'Verify email', url)
        return res.status(200).send({
            message: 'An email has been sent to your account please verify',
        })
    } catch (error) {
        return res.status(500).send({
            status: 'error',
        })
    }
}

export const verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findOne({
            _id: req.params.id,
        })

        if (!user) {
            return res.status(404).send({
                message: 'Invalid link',
            })
        }

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        })

        if (!token) {
            return res.status(404).send({
                message: 'Invalid link',
            })
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
        )

        await token.remove()

        return res.status(200).send({
            message: 'Email verified successfully',
        })
    } catch (error) {
        return res.status(500).send({
            status: 'error',
        })
    }
}
