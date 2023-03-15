import express from 'express';
import { registerDriver, updateDriver, getAllRoutes, getRoute} from '../controller/admin.controller';
import { upload } from '../utils/multer';
import { createRoute, updateRoutePrice } from "../controller/admin.controller";

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

router.get('/getAllRoutes', getAllRoutes);
router.get('/getRoute/:id', getRoute);

router.post("/createRoute", createRoute);
router.patch("/editRoute/:id", updateRoutePrice);


export default router;
