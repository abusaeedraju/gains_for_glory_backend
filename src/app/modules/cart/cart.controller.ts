import catchAsync from "../../../shared/catchAsync";
import { cartService } from "./cart.service";
import sendResponse from "../../middleware/sendResponse";
import { StatusCodes } from "http-status-codes";

const addToCart = catchAsync(async (req: any, res: any) => {
    const {id} = req.user
    const payload = req.body
    const result = await cartService.addToCart(payload, id)
    sendResponse(res, { statusCode: StatusCodes.CREATED, message: "Cart created successfully", data: result, success: true })
})
 const getMyCartItemController = catchAsync(async (req: any, res: any) => {
    const {id} = req.user
    const result = await cartService.getMyCartItem(id)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Cart retrieved successfully", data: result, success: true })
 })

export const cartController = {
    addToCart,getMyCartItemController
}