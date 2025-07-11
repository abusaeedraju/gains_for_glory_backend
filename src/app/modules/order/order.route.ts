import express from "express";
import { orderController } from "./order.controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
const router = express.Router();


router.get("/my-order", auth(), orderController.getMyOrderController);


export const orderRouter = router;  