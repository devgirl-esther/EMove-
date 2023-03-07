import express, { Request, Response, NextFunction } from 'express';
import { login, register, verifyEmail} from '../controller/user.controller';
const router = express.Router();

router.post('/register', register)
router.get('/verify/:id/:token', verifyEmail)
router.post('/login', login)
export default router;
