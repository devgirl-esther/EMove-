"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoutePrice = exports.createRoute = void 0;
const route_1 = __importDefault(require("../model/route"));
const joiValidator_1 = require("../utils/joiValidator");
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
        const newRoute = new route_1.default({
            pickup: pickup,
            destination: destination,
            price: price
        });
        const route = await newRoute.save();
        res.status(201).json({ status: "success", result: route });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
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
        const result = await route_1.default.findByIdAndUpdate({ _id: id }, { $set: { price: price } });
        if (result) {
            res.status(201).json({ message: "price updated successfully" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.updateRoutePrice = updateRoutePrice;
