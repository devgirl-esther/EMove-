import express from 'express';
import { registerDriver, updateDriver } from '../controller/admin.controller';
import { upload } from '../utils/multer';

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

export default router;
