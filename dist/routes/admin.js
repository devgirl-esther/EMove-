"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controller/admin.controller");
const multer_1 = require("../utils/multer");
const admin_controller_2 = require("../controller/admin.controller");
const admin_controller_3 = require("../controller/admin.controller");
const admin_controller_4 = require("../controller/admin.controller");
const router = express_1.default.Router();
router.post('/register-driver', multer_1.upload.fields([
    { name: 'driverId', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
]), admin_controller_1.registerDriver);
router.put('/edit-driver/:id', multer_1.upload.fields([
    { name: 'driverId', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
]), admin_controller_1.updateDriver);
router.get('/allDrivers', admin_controller_1.getAllDrivers);
router.get('/drivers/:id', admin_controller_1.getOneDriver);
router.delete('/drivers/:id', admin_controller_1.deleteDriver);
router.get('/totalSuccessfulRides/:id');
router.get('/totalPassengers', admin_controller_2.getAllPassengers);
router.get('/totalDrivers', admin_controller_2.totalDrivers);
router.get('/getAllRoutes', admin_controller_3.getAllRoutes);
router.get('/getRoute/:id', admin_controller_3.getRoute);
router.post("/createRoute", admin_controller_4.createRoute);
router.patch("/editRoute/:id", admin_controller_4.updateRoutePrice);
exports.default = router;
