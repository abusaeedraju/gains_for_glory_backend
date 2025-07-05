import catchAsync from "../../../shared/catchAsync";
import { cartService } from "./cart.service";
import sendResponse from "../../middleware/sendResponse";
import { StatusCodes } from "http-status-codes";

const addToCart = catchAsync(async (req: any, res: any) => {
    const payload = req.body
    const userId = req.user.id
    const productId = req.params.productId
    const result = await cartService.addToCart(payload,userId,productId)
    sendResponse(res, { statusCode: StatusCodes.CREATED, message: "Product added to cart successfully", data: result, success: true })
})
 const getMyCartItemController = catchAsync(async (req: any, res: any) => {
    const userId = req.user.id
    const result = await cartService.getMyCartItem(userId)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Cart retrieved successfully", data: result, success: true })
 })
const deleteCartItemController = catchAsync(async (req: any, res: any) => {
    const cartId = req.params.cartId
    const result = await cartService.deleteCartItem(cartId)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Cart deleted successfully", data: result, success: true })
})
const updateCartItemController = catchAsync(async (req: any, res: any) => {
    const cartId = req.params.cartId
    const payload = req.body
    const result = await cartService.updateCartItem(cartId, payload)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Cart updated successfully", data: result, success: true })
})
export const cartController = {
    addToCart,getMyCartItemController,deleteCartItemController,updateCartItemController  
}