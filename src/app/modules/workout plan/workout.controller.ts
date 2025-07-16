import catchAsync from "../../../shared/catchAsync"
import { workoutService } from "./workout.service"
import sendResponse from "../../middleware/sendResponse"
import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"
import { checkAndTrackDailyUsage } from "../../helper/restrictRoute"

const aiWorkoutPlanController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user
    const data = await checkAndTrackDailyUsage(req.user.id, 'ai-workout-plan');
    if (data) {
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            message: "Workout plan retrieved successfully",
            data: data,
            success: true,
        });
    } else {
        const result = await workoutService.aiWorkoutPlan(id)
        sendResponse(res, { statusCode: StatusCodes.OK, message: "Workout plan created successfully", data: result, success: true })
    }
})

const markAsCompleteController = catchAsync(async (req: Request, res: Response) => {
    const body = req.body 
    const userId = req.user.id
    const id   = req.params.id
    
    const result = await workoutService.markAsComplete(id, userId, body)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Workout plan marked as complete successfully", data: result, success: true })
})

export const workoutController = {
    aiWorkoutPlanController,
    markAsCompleteController
}   