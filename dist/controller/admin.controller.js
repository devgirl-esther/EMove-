"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoute = exports.getAllRoutes = exports.updateDriver = exports.registerDriver = void 0;
const driverModel_1 = __importDefault(require("../model/driverModel"));
const route_1 = __importDefault(require("../model/route"));
const registerDriver = async (req, res, next) => {
    console.log('controller');
    try {
        const isDriverExist = await driverModel_1.default.findOne({ fullName: req.body.fullName });
        if (isDriverExist) {
            return res.send("Driver with this name already exists");
        }
        console.log(req.body);
        const { fullName, operationRoute, phone, accountNo } = req.body;
        const body = req.files;
        console.log(body);
        const newDriverData = new driverModel_1.default({
            fullName,
            operationRoute,
            phone,
            accountNo,
            driverId: body.driverId[0].path,
            photo: body.photo[0].path,
        });
        const newDriver = await newDriverData.save();
        return res.status(201).send({
            status: "success",
            message: "driver created successfully",
            data: newDriver
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({
            status: "fail",
            message: "Database error"
        });
    }
};
exports.registerDriver = registerDriver;
const updateDriver = async (req, res, next) => {
    console.log('update');
    try {
        const driverId = req.params.id;
        const updatedDriver = await driverModel_1.default.findByIdAndUpdate(driverId, req.body, { new: true });
        return res.status(200).send({
            status: "success",
            message: "update successful",
            data: updatedDriver
        });
    }
    catch (error) {
        return res.status(500).send({
            status: "fail",
            message: "Database error"
        });
    }
};
exports.updateDriver = updateDriver;
const getAllRoutes = async (req, res, next) => {
    try {
        const routes = await route_1.default.find();
        res.send(routes);
    }
    catch (error) {
        res.send('An error occured');
        console.log(error);
    }
};
exports.getAllRoutes = getAllRoutes;
const getRoute = async (req, res, next) => {
    try {
        const route = await route_1.default.findById(req.params.id);
        res.send(route);
    }
    catch (error) {
        res.send('An error occured');
        console.log(error);
    }
};
exports.getRoute = getRoute;
