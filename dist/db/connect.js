"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import logger from "./logger";
async function connect() {
    const dbUri = process.env.DBURI;
    try {
        mongoose_1.default.set("strictQuery", false);
        await mongoose_1.default.connect(dbUri);
        console.log("DB connected");
    }
    catch (error) {
        console.log("Could not connect to db");
        process.exit(1);
    }
}
exports.default = connect;
