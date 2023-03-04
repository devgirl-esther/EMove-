import { NextFunction, Request, Response } from 'express'
import User from '../model/userModel'
import Token from '../model/tokenModel'
import { toHash } from '../utils/passwordHashing'

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userData = req.body
    try {
        const getExistingUsers = await User.findOne({
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

        const user = new User(allUserData)
        await user.save()

        res.status(200).send({
            status: 'success',
            path: req.url,
            message: `New user with email - ${userData.email} added successfully`,
            data: allUserData,
        })
    } catch (error) {
        return res.status(500).send({
            status: 'error',
        })
    }
}
