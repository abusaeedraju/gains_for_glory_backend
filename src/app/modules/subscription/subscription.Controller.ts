import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { subscriptionService } from "./subscription.Service";
import sendResponse from "../../middleware/sendResponse";
import { StatusCodes } from "http-status-codes";

const createSubscriptionController = catchAsync(async (req: Request, res: Response) => {

    const body = req.body
    const result = await subscriptionService.createSubscriptionIntoDB(body)
    sendResponse(res, { statusCode: StatusCodes.CREATED, message: "Subscription created successfully", data: result, success: true })

})


const updateSubscriptionController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const body = req.body
    const result = await subscriptionService.updateSubscriptionIntoDB(id, body)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Subscription updated successfully", data: result, success: true })

});

const deleteSubscriptionController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await subscriptionService.deleteSubscriptionIntoDB(id)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Subscription deleted successfully", data: result, success: true })    

});

const getAllSubscriptionsController = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.user
    const result = await subscriptionService.getAllSubscriptionsFromDB(id)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Subscriptions retrieved successfully", data: result, success: true })
})


export const subscriptionController = { createSubscriptionController, updateSubscriptionController, deleteSubscriptionController, getAllSubscriptionsController }