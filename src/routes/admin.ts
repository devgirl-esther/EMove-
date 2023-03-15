import express from 'express';
import {
    deleteDriver,
    getAllDrivers,
    getOneDriver,
    registerDriver,
    updateDriver,
} from '../controller/admin.controller';
import { upload } from '../utils/multer';
import { totalDrivers, getAllPassengers } from '../controller/admin.controller';

const router = express.Router();

router.post(
    '/register-driver',
    upload.fields([
        { name: 'driverId', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
    ]),
    registerDriver
);

router.put(
    '/edit-driver/:id',
    upload.fields([
        { name: 'driverId', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
    ]),
    updateDriver
);

router.get('/allDrivers', getAllDrivers);
router.get('/drivers/:id', getOneDriver);
router.delete('/drivers/:id', deleteDriver);
router.get('/totalSuccessfulRides/:id');
router.get('/totalPassengers', getAllPassengers);
router.get('/totalDrivers', totalDrivers);

export default router;
