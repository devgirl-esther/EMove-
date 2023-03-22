import express, { Request, Response, NextFunction } from 'express';
import {
  forgotPassword,
  login,
  resetPassword,
  changePassword,
  register,
  verifyEmail,
  getAllRoutes,
  getRoute,
  initPayment,
  getReference,
  getTransaction,
} from '../controller/user.controller';
import { authMiddleware } from '../middlewares/auth';
const router = express.Router();

router.post('/register', register);
router.get('/verify/:id/:token', verifyEmail);
router.patch('/change-password', changePassword);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword/:userId/:token', resetPassword);
router.get('/getAllRoutes', getAllRoutes);
router.get('/getRoute/:id', getRoute);

//router.post('/book-trip/:routeId', bookTrip);

router.get('/transaction/:userId', getTransaction);

router.post('/paystack/pay', authMiddleware, initPayment);
router.get('/paystack/callback', authMiddleware, getReference);




export default router;
