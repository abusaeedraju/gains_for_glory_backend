import { Router } from "express";
import { cartController } from "./cart.controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
const router = Router();

router.post("/add-product/:productId",auth(Role.USER,Role.TECHNICIAN),cartController.addToCart);
router.get("/cart", auth(Role.USER,Role.TECHNICIAN), cartController.getMyCartItemController)
router.delete("/delete/:cartId", auth(Role.USER,Role.TECHNICIAN), cartController.deleteCartItemController)
router.put("/update/:cartId", auth(Role.USER,Role.TECHNICIAN), cartController.updateCartItemController)

export const cartRoutes = router;