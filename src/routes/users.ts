import express, { Request, Response, NextFunction } from 'express';
import { register, verifyEmail} from '../controller/user.controller';
const router = express.Router();

router.post('/register', register)
router.get('/verify/:id/:token', verifyEmail)
export default router;
