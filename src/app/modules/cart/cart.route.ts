import { Router } from "express";
import { cartController } from "./cart.controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";

const router = Router();

router.post("/add-product",auth(),cartController.addToCart);
router.get("/cart", auth(), cartController.getMyCartItemController)

export const cartRoutes = router;