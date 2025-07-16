import catchAsync from "../../../shared/catchAsync";
import { orderService } from "./order.service";
import sendResponse from "../../middleware/sendResponse";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

const getMyOrderController = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result = await orderService.getMyOrder(userId);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order Retrieve successfully",
        data: result,
    });
})

const getAllOrdersController = catchAsync(async (req: Request, res: Response) => {
    const result = await orderService.getAllOrders();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order Retrieve successfully",
        data: result,
    });
})

const updateOrderStatusController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;
    const result = await orderService.updateOrderStatus(id, req.body, userId);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order Status updated successfully",
        data: result,
    });
})

export const orderController = { getMyOrderController   , getAllOrdersController, updateOrderStatusController }
