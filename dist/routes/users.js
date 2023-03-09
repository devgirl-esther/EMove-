"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const router = express_1.default.Router();
router.post('/register', user_controller_1.register);
router.get('/verify/:id/:token', user_controller_1.verifyEmail);
router.patch("/change-password", user_controller_1.changePassword);
router.post('/login', user_controller_1.login);
exports.default = router;
