"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controller/admin.controller");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
router.post('/register-driver', multer_1.upload.fields([
    { name: 'driverId', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
]), admin_controller_1.registerDriver);
router.put('/edit-driver/:id', multer_1.upload.fields([
    { name: 'driverId', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
]), admin_controller_1.updateDriver);
router.get('/getAllRoutes', admin_controller_1.getAllRoutes);
router.get('/getRoute/:id', admin_controller_1.getRoute);
exports.default = router;
