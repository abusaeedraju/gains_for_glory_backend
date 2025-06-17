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

const getAllProductsController = catchAsync(async (req: Request, res: Response) => {
    const result = await productServices.getAllProducts();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Products retrieved successfully",
        data: result,
        success: true,
    });
});
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
export const productController = {
    createProductController,getAllProductsController,getSupplementsProductsController,getMerchandiseProductsController
}