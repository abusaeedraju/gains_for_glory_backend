import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
import { productController } from "./product.controller";
import { fileUploader } from "../../helper/uploadFile";
import { parseBodyMiddleware } from "../../middleware/parseBodyData";
const router = Router();

router.post('/create',auth(Role.ADMIN),fileUploader.uploadProductImages,parseBodyMiddleware,productController.createProductController) 
router.put('/update/:productId',auth(Role.ADMIN),fileUploader.uploadProductImages,parseBodyMiddleware,productController.updateProductController)

router.delete('/delete/:productId',auth(Role.ADMIN),productController.deleteProductController)

router.get('/favorite',auth(),productController.getMyFavoritesController)

router.get('/all',auth(),productController.getAllProductsController)
router.get('/supplements',auth(),productController.getSupplementsProductsController)
router.get('/merchandise',auth(),productController.getMerchandiseProductsController)
router.get('/:productId',auth(),productController.getSingleProductController)

router.post('/favorite/:productId',auth(),productController.addToFavoritesController)
router.delete('/favorite/:productId',auth(),productController.deleteFavoriteController)

export const productRoutes = router;