import jwt from 'jsonwebtoken';
import { Request } from 'express';

export const getToken = (_id: any) => {
    const secret = process.env.JWTSECRET as string;
    return jwt.sign({ _id }, secret, {
        expiresIn: '30d',
    });
};

export const loginToken = (_id: string) => {
    const secret = process.env.JWTLOGINSECRET as string;
    return jwt.sign({ _id }, secret, { expiresIn: '7d' });
};
