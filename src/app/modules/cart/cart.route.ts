import { Router } from "express";
import { cartController } from "./cart.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/add-product",auth(),cartController.addToCart);
router.get("/cart", auth(), cartController.getMyCartItemController)
router.delete("/delete/:cartId", auth(), cartController.deleteCartItemController)

export const cartRoutes = router;