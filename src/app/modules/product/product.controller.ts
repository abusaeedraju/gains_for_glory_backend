import { Request, Response } from "express";
import { productServices } from "./product.service";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../middleware/sendResponse";


const createProductController = catchAsync(async (req: Request, res: Response) => {
    const body = req?.body as any
    const image = req?.files as any
    const result = await productServices.createProduct(body, image);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Product created successfully",
        data: result,
        success: true,
    });
});
const updateProductController = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.productId
    const body = req?.body as any
    const image = req?.files as any
    const result = await productServices.updateProduct(productId, body, image);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Product updated successfully",
        data: result,
        success: true,
    });
})
const getSingleProductController = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.productId
    const result = await productServices.getSingleProduct(productId);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Product retrieved successfully",
        data: result,
        success: true,
    });
})
const getAllProductsController = catchAsync(async (req: Request, res: Response) => {
    const result = await productServices.getAllProducts();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Products retrieved successfully",
        data: result,
        success: true,
    });
});
const deleteProductController = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.productId
    const result = await productServices.deleteProduct(productId);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Product deleted successfully",
        data: result,
        success: true,
    });
})
const getSupplementsProductsController = catchAsync(async (req: Request, res: Response) => {
    const result = await productServices.getSupplementsProducts();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Products retrieved successfully",
        data: result,
        success: true,
    });
});
const getMerchandiseProductsController = catchAsync(async (req: Request, res: Response) => {
    const result = await productServices.getMerchandiseProducts();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Products retrieved successfully",
        data: result,
        success: true,
    });
})
const addToFavoritesController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user
    const productId = req.params.productId
    const result = await productServices.addToFavorites(productId, id)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Product added to favorites successfully",
        data: result,
        success: true,
    });
})
const getMyFavoritesController = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.user
    const result = await productServices.getMyFavorites(id)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Favorites retrieved successfully",
        data: result,
        success: true,
    });
})
const deleteFavoriteController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user
    const productId = req.params.productId
    const result = await productServices.removeFromFavorites(productId, id)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Favorite deleted successfully",
        data: result,
        success: true,
    });
})
export const productController = {
    createProductController,getSingleProductController, getAllProductsController, getSupplementsProductsController, getMerchandiseProductsController, addToFavoritesController, getMyFavoritesController, deleteFavoriteController, updateProductController, deleteProductController
}