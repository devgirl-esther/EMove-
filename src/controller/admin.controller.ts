import express, { Request, Response, NextFunction } from 'express';
import Driver from '../model/driverModel';

export const registerDriver = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log('controller');
    try {
      const isDriverExist = await Driver.findOne({ fullName: req.body.fullName });
      if (isDriverExist) {
        return res.send("Driver with this name already exists");
      }
      console.log(req.body);
      const { fullName, operationRoute, phone, accountNo } =
        req.body;
      const body: any = req.files

      console.log(body);

      const newDriverData = new Driver ({
        fullName,
        operationRoute,
        phone,
        accountNo,
        driverId: body.driverId[0].path,
        photo: body.photo[0].path,
      });

      const newDriver = await newDriverData.save()

      return res.status(201).send({
        status: "success",
        message: "driver created successfully",
        data: newDriver
      })
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        status: "fail",
        message: "Database error"
      })
    }
};

export const updateDriver = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log('update');
    try {
      const driverId = req.params.id
      const updatedDriver  = await Driver.findByIdAndUpdate(driverId, req.body, {new: true})
      return res.status(200).send({
        status: "success",
        message: "update successful",
        data: updatedDriver
      })
    } catch (error) {
      return res.status(500).send({
        status: "fail",
        message: "Database error"
      })
    }
};
