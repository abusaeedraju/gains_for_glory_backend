import catchAsync from "../../../shared/catchAsync"
import { workoutService } from "./workout.service"
import sendResponse from "../../middleware/sendResponse"
import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"

const aiWorkoutPlanController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user
    console.log(id)
    const result = await workoutService.aiWorkoutPlan(id)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Workout plan created successfully", data: result, success: true })
})  

export const workoutController = {
    aiWorkoutPlanController
}   