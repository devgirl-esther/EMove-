const Joi = require('joi');

// Define a Joi schema for the route
const routeSchema = Joi.object({
    pickup: Joi.string().required(),
    destination: Joi.string().required(),
     price: Joi.number().required().min(0)
});


interface Route{
    pickup: string,
    destination: string
    price: number
}
// Validate a route object against the schema
export function validateRoute(route:Route) {
  return routeSchema.validate(route);
}

// Validate a route  price against the schema
export function validateRoutePrice(price: number) {
  return routeSchema.validate(routeSchema.price(price));
}
