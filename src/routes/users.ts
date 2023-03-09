import express, { Request, Response, NextFunction } from 'express';
import { changePassword, login, register, verifyEmail } from '../controller/user.controller';

const router = express.Router();


router.post('/register', register)
router.get('/verify/:id/:token', verifyEmail)
router.patch("/change-password", changePassword)
router.post('/login', login)

export default router;
