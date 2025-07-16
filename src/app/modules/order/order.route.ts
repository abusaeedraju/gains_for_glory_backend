import express from "express";
import { orderController } from "./order.controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
const router = express.Router();


router.get("/my-order", auth(), orderController.getMyOrderController);  
router.get("/all-order", auth(Role.ADMIN), orderController.getAllOrdersController);
router.put("/update-order-status/:id", auth(Role.ADMIN), orderController.updateOrderStatusController);


export const orderRouter = router;      