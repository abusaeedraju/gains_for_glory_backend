import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import { reviewService } from "./review.service"
import sendResponse from "../../middleware/sendResponse"
import { StatusCodes } from "http-status-codes"
const createReviewController = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as any
    const { id } = req.user 
    const result = await reviewService.createReview(id, payload)
    sendResponse(res, { statusCode: StatusCodes.CREATED, message: "Review created successfully", data: result, success: true })
})
const getAllReviewController = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.productId
    const result = await reviewService.getAllReview(productId)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Review retrieved successfully", data: result, success: true })
})
export const reviewController = {
    createReviewController,getAllReviewController
}