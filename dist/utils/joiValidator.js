"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRoutePrice = exports.validateRoute = void 0;
const Joi = require('joi');
// Define a Joi schema for the route
const routeSchema = Joi.object({
    pickup: Joi.string().required(),
    destination: Joi.string().required(),
    price: Joi.number().required().min(0)
});
// Validate a route object against the schema
function validateRoute(route) {
    return routeSchema.validate(route);
}
exports.validateRoute = validateRoute;
// Validate a route  price against the schema
function validateRoutePrice(price) {
    return routeSchema.validate(routeSchema.price(price));
}
exports.validateRoutePrice = validateRoutePrice;
