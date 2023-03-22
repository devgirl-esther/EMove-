"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

exports.tripHistoryByPassenger = exports.tripHistory = exports.bookTrip = exports.updateRoutePrice = exports.createRoute = exports.getRoute = exports.getAllRoutes = exports.totalDrivers = exports.getAllPassengers = exports.deleteDriver = exports.getOneDriver = exports.getAllDrivers = exports.updateDriver = exports.registerDriver = void 0;

exports.bookTrip = exports.updateRoutePrice = exports.createRoute = exports.getRoute = exports.getAllRoutes = exports.totalDrivers = exports.getAllPassengers = exports.deleteDriver = exports.getOneDriver = exports.getAllDrivers = exports.updateDriver = exports.registerDriver = void 0;

const driverModel_1 = __importDefault(require("../model/driverModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const tripModel_1 = __importDefault(require("../model/tripModel"));
const routeModel_1 = __importDefault(require("../model/routeModel"));
const joiValidator_1 = require("../utils/joiValidator");
const registerDriver = async (req, res, next) => {
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
        const route = await routeModel_1.default.findById(operationRoute);
        if (!route) {
            return res.send("Invalid route Id");
        }
        const newDriverData = new driverModel_1.default({
            fullName,
            operationRoute: `${route.pickup} - ${route.destination}`,
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
            passengers: allPassengers,
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
const getAllRoutes = async (req, res, next) => {
    try {
        const routes = await routeModel_1.default.find();
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
        const route = await routeModel_1.default.findById(req.params.id);
        res.send(route);
    }
    catch (error) {
        res.send('An error occured');
        console.log(error);
    }
};
exports.getRoute = getRoute;
const createRoute = async (req, res) => {
    const { pickup, destination, price } = req.body;
    try {
        const { error } = (0, joiValidator_1.validateRoute)({ pickup, destination, price });
        if (error)
            throw new Error(error.details[0].message);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
    try {
        const newRoute = new routeModel_1.default({
            pickup: pickup,
            destination: destination,
            price: price,
        });
        const route = await newRoute.save();
        res.status(201).json({ status: 'success', result: route });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }
};
exports.createRoute = createRoute;
const updateRoutePrice = async (req, res) => {
    const { id } = req.params;
    const { price } = req.body;
    try {
        const { error } = (0, joiValidator_1.validateRoutePrice)({ price });
        if (error)
            throw new Error(error.details[0].message);
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).json({ error: err.message });
    }
    try {
        const result = await routeModel_1.default.findByIdAndUpdate({ _id: id }, { $set: { price: price } });
        if (result) {
            res.status(201).json({ message: 'price updated successfully' });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.updateRoutePrice = updateRoutePrice;
const bookTrip = async (req, res) => {
    // Decode the JWT and extract the user ID
    try {
        const userId = req.userId;
        const routeId = req.params.routeId;
        try {
            const route = await routeModel_1.default.findById({ _id: routeId });
            console.log(route);
            if (route) {
                const { pickup, destination, price } = route;
                const user = await userModel_1.default.findById({ _id: userId });
                console.log(user);
                if (user) {
                    // if user wallet ballance is less thab trip price return errrror
                    if (user.walletBalance < price) {
                        return res
                            .status(400)
                            .json({ message: 'Insufficient fund' });
                    }
                    const newTrip = new tripModel_1.default({
                        pickup: pickup,
                        destination: destination,
                        price: price,
                        passenger: user.name,
                    });
                    await newTrip.save();
                    const newBallance = user.walletBalance - price;
                    console.log(newBallance);
                    await userModel_1.default.findByIdAndUpdate(userId, { walletBalance: newBallance });
                    return res
                        .status(200)
                        .json({ message: 'book successfull', trip: newTrip });
                }
            }
        }
        catch (error) {
            return res.status(500).json({ error: 'Route not found' });
        }
    }
    catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};
exports.bookTrip = bookTrip;
const tripHistory = async (req, res) => {
    try {
        const result = await tripModel_1.default.find({});
        if (result) {
            res.status(200).json({ data: result });
        }
    }
    catch (err) {
        res.status(400).json({ message: "Internal server error", error: err.message });
    }
};
exports.tripHistory = tripHistory;
const tripHistoryByPassenger = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel_1.default.findById({ _id: userId });
        if (user) {
            const { name } = user;
            const tripsByUser = await tripModel_1.default.find({ passenger: name });
            console.log(tripsByUser);
            if (tripsByUser) {
                res.status(200).json({ status: "success", data: tripsByUser });
            }
            else {
                res.status(404).json({ status: "failed", message: "No trips created by user" });
            }
        }
    }
    catch (err) {
        res.status(400).json({ message: "Internal server error", error: err.message });
    }
};
exports.tripHistoryByPassenger = tripHistoryByPassenger;
