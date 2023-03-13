"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route_1 = require("../controller/route");
const router = express_1.default.Router();
router.post("/create", route_1.createRoute);
router.patch("/edit/:id", route_1.updateRoutePrice);
exports.default = router;
