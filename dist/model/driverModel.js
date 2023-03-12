"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const driverSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    operationRoute: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true
    },
    accountNo: {
        type: Number,
        required: true
    },
    driverId: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    }
});
const Driver = mongoose_1.default.model("driver", driverSchema);
exports.default = Driver;
