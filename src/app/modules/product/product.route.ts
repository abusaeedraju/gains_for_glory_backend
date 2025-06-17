import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
import { productController } from "./product.controller";
import { fileUploader } from "../../helper/uploadFile";
import { parseBodyMiddleware } from "../../middleware/parseBodyData";
const router = Router();

router.post('/create',auth(Role.ADMIN),fileUploader.uploadProductImages,parseBodyMiddleware,productController.createProductController) 

router.get('/all',productController.getAllProductsController)
router.get('/supplements',productController.getSupplementsProductsController)
router.get('/merchandise',productController.getMerchandiseProductsController)

export const productRoutes = router;