"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalDrivers = exports.getAllPassengers = exports.deleteDriver = exports.getOneDriver = exports.getAllDrivers = exports.updateDriver = exports.registerDriver = void 0;
const driverModel_1 = __importDefault(require("../model/driverModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const registerDriver = async (req, res, next) => {
    console.log('controller');
    try {
        const isDriverExist = await driverModel_1.default.findOne({
            fullName: req.body.fullName,
        });
        if (isDriverExist) {
            return res.send('Driver with this name already exists');
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
            status: 'success',
            message: 'driver created successfully',
            data: newDriver,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({
            status: 'fail',
            message: 'Database error',
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
            status: 'success',
            message: 'update successful',
            data: updatedDriver,
        });
    }
    catch (error) {
        return res.status(500).send({
            status: 'fail',
            message: 'Database error',
        });
    }
};
exports.updateDriver = updateDriver;
//get all drivers
const getAllDrivers = async (req, res, next) => {
    console.log('get');
    try {
        const driver = req.params;
        const allDrivers = await driverModel_1.default.find(driver, req.body, { new: true });
        return res.status(200).send({
            status: 'success',
            message: 'successful',
            data: allDrivers,
        });
    }
    catch (error) {
        return res.status(500).send({
            status: 'fail',
            message: 'Database error',
        });
    }
};
exports.getAllDrivers = getAllDrivers;
// Get one Driver//
const getOneDriver = async (req, res, next) => {
    console.log('get');
    try {
        const driverId = req.params.id;
        const oneDriver = await driverModel_1.default.findById({ _id: driverId });
        return res.status(200).send({
            status: 'success',
            message: 'successful',
            data: oneDriver,
        });
    }
    catch (error) {
        return res.status(500).send({
            status: 'fail',
            message: 'Database error',
        });
    }
};
exports.getOneDriver = getOneDriver;
//delete driver
const deleteDriver = async (req, res, next) => {
    console.log('get');
    try {
        const driverId = req.params.id;
        const oneDriver = await driverModel_1.default.findByIdAndDelete(driverId, req.body);
        return res.status(200).send({
            status: 'success',
            message: ' delete successful',
            data: oneDriver,
        });
    }
    catch (error) {
        return res.status(500).send({
            status: 'fail',
            message: 'Database error',
        });
    }
};
exports.deleteDriver = deleteDriver;
// total number of passenger
const getAllPassengers = async (req, res, next) => {
    try {
        const allPassengers = await userModel_1.default.find({});
        return res.status(200).send({
            status: 'success',
            message: 'successful',
            passengerCount: allPassengers.length,
            passengers: allPassengers
        });
    }
    catch (error) {
        return res.status(500).send({
            status: 'fail',
            message: 'Database error',
        });
    }
};
exports.getAllPassengers = getAllPassengers;
const totalDrivers = async (req, res, next) => {
    console.log('get');
    try {
        const drivers = req.params;
        const totalDrivers = await driverModel_1.default.find(drivers, req.body, {
            new: true,
        });
        return res.status(200).send({
            status: 'success',
            message: 'successful',
            data: totalDrivers,
        });
    }
    catch (error) {
        return res.status(500).send({
            status: 'fail',
            message: 'Database error',
        });
    }
};
exports.totalDrivers = totalDrivers;
