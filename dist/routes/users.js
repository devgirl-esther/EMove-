"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controller/admin.controller");
const user_controller_1 = require("../controller/user.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post('/register', user_controller_1.register);
router.get('/verify/:id/:token', user_controller_1.verifyEmail);
router.patch('/change-password', user_controller_1.changePassword);
router.post('/login', user_controller_1.login);
router.post('/forgotPassword', user_controller_1.forgotPassword);
router.post('/resetPassword/:userId/:token', user_controller_1.resetPassword);
router.get('/getAllRoutes', user_controller_1.getAllRoutes);
router.get('/getRoute/:id', user_controller_1.getRoute);
//router.post('/book-trip/:routeId', bookTrip);

router.post("/paystack/pay", auth_1.authMiddleware, user_controller_1.initPayment);
router.get("/paystack/callback", auth_1.authMiddleware, user_controller_1.getReference);
router.get('/tripHistoryByPassenger', auth_1.authMiddleware, admin_controller_1.tripHistoryByPassenger);

router.get('/transaction/:userId', user_controller_1.getTransaction);

exports.default = router;
