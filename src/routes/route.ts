import express from "express";
import { createRoute, updateRoutePrice } from "../controller/route";


const router = express.Router();

router.post("/create", createRoute);
router.patch("/edit", updateRoutePrice);

export default router;