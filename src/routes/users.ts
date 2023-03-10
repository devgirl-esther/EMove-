import express, { Request, Response, NextFunction } from 'express';
import { forgotPassword,login,resetPassword, register, verifyEmail} from '../controller/user.controller';
const router = express.Router();

router.post('/register', register)
router.get('/verify/:id/:token', verifyEmail)
router.post('/login', login)
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:userId/:token", resetPassword)

export default router;
