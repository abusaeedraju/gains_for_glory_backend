import catchAsync from "../../../shared/catchAsync"
import { workoutService } from "./workout.service"
import sendResponse from "../../middleware/sendResponse"
import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"
import { checkAndTrackDailyUsage } from "../../helper/restrictRoute"

const aiWorkoutPlanController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user
    const data = await checkAndTrackDailyUsage(req.user.id, 'ai-workout-plan');
    if(data){
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            message: "Workout plan retrieved successfully",
            data: data,
            success: true,
        });
    }else{
    const result = await workoutService.aiWorkoutPlan(id)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Workout plan created successfully", data: result, success: true })
    }
})  

export const workoutController = {
    aiWorkoutPlanController
}   