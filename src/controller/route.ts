import Route from '../model/route';
import { Request, Response } from 'express';
import { validateRoute, validateRoutePrice } from '../utils/joiValidator';

export const createRoute = async (req: Request, res: Response) => {
    const { pickup, destination, price } = req.body;
    try {
        const { error } = validateRoute({pickup,destination, price});
        if (error) throw new Error(error.details[0].message);

    } catch (err:any) {
        return res.status(400).json({error: err.message})
    }

    console.log({pickup,destination,price})

    try {
        const newRoute = new Route({
            pickup: pickup,
            destination: destination,
            price: price
        })
        const route = await newRoute.save();
        res.status(201).json({status: "success", result:route })
    } catch (err:any) {
        res.status(500).json({message: "Internal server error", error: err.message})
    }
};


export const updateRoutePrice = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { newPrice } = req.body;
    
      try {
          const { error } = validateRoutePrice(parseInt(newPrice));
        if (error) throw new Error(error.details[0].message);
    } catch (err:any) {
        return res.status(400).json({error: err.message})
      }
    
    try {
        const result = await Route.findByIdAndUpdate({ _id: id }, { $set: { price: newPrice } });
        if (result) {
            res.status(201).json({ message: "price updated successfully", data: result })
        }
    } catch (err: any) {
        res.status(500).json({message: err.message})
    }
};