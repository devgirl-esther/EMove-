import express, { Request, Response, NextFunction } from 'express';
import Driver from '../model/driverModel';

import User from '../model/userModel';

import Route from '../model/routeModel';
import { validateRoute, validateRoutePrice } from '../utils/joiValidator';


export const registerDriver = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const isDriverExist = await Driver.findOne({
            fullName: req.body.fullName,
        });
        if (isDriverExist) {
            return res.send('Driver with this name already exists');
        }
        console.log(req.body);
        const { fullName, operationRoute, phone, accountNo } = req.body;
        const body: any = req.files;

        const route = await Route.findById(operationRoute)
        if(!route) {
          return res.send("Invalid route Id")
        }
        const newDriverData = new Driver({
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
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            status: 'fail',
            message: 'Database error',
        });
    }
};

export const updateDriver = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log('update');
    try {
        const driverId = req.params.id;
        const updatedDriver = await Driver.findByIdAndUpdate(
            driverId,
            req.body,
            { new: true }
        );
        return res.status(200).send({
            status: 'success',
            message: 'update successful',
            data: updatedDriver,
        });
    } catch (error) {
        return res.status(500).send({
            status: 'fail',
            message: 'Database error',
        });
    }
};

//get all drivers
export const getAllDrivers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log('get');
    try {
        const driver = req.params;
        const allDrivers = await Driver.find(driver, req.body, { new: true });
        return res.status(200).send({
            status: 'success',
            message: 'successful',
            data: allDrivers,
        });
    } catch (error) {
        return res.status(500).send({
            status: 'fail',
            message: 'Database error',
        });
    }
};
// Get one Driver//
export const getOneDriver = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log('get');
    try {
        const driverId = req.params.id;
        const oneDriver = await Driver.findById({ _id: driverId });
        return res.status(200).send({
            status: 'success',
            message: 'successful',
            data: oneDriver,
        });
    } catch (error) {
        return res.status(500).send({
            status: 'fail',
            message: 'Database error',
        });
    }
};

//delete driver
export const deleteDriver = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log('get');
    try {
        const driverId = req.params.id;
        const oneDriver = await Driver.findByIdAndDelete(driverId, req.body);
        return res.status(200).send({
            status: 'success',
            message: ' delete successful',
            data: oneDriver,
        });
    } catch (error) {
        return res.status(500).send({
            status: 'fail',
            message: 'Database error',
        });
    }
};

// total number of passenger
export const getAllPassengers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const allPassengers = await User.find({});
        return res.status(200).send({
            status: 'success',
            message: 'successful',
            passengerCount: allPassengers.length,
            passengers: allPassengers
        });
    } catch (error) {
        return res.status(500).send({
            status: 'fail',
            message: 'Database error',
        });
    }
};

export const totalDrivers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log('get');
    try {
        const drivers = req.params;
        const totalDrivers = await Driver.find(drivers, req.body, {
            new: true,
        });
        return res.status(200).send({
            status: 'success',
            message: 'successful',
            data: totalDrivers,
        });
    } catch (error) {
        return res.status(500).send({
            status: 'fail',
            message: 'Database error',
        });
    }
};

export const getAllRoutes = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const routes = await Route.find();
        res.send(routes);
    } catch (error) {
        res.send('An error occured');
        console.log(error);
    }
};

export const getRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const route = await Route.findById(req.params.id);
        res.send(route);
    } catch (error) {
        res.send('An error occured');
        console.log(error);
    }
};


export const createRoute = async (req: Request, res: Response) => {
    const { pickup, destination, price } = req.body;
    try {
        const { error } = validateRoute({pickup,destination, price});
        if (error) throw new Error(error.details[0].message);

    } catch (err:any) {
        return res.status(400).json({error: err.message})
    }

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
    const { price } = req.body;
      try {
          const { error } = validateRoutePrice({price});
          if (error) throw new Error(error.details[0].message);
      } catch (err: any) {
          console.log(err.message)
        return res.status(400).json({error: err.message})
      }
    
    try {
        const result = await Route.findByIdAndUpdate({ _id: id }, { $set: { price: price } });
        if (result) {
            res.status(201).json({ message: "price updated successfully"})
        }
    } catch (err: any) {
        res.status(500).json({message: err.message})
    }
};