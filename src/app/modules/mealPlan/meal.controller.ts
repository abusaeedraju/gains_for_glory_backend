import catchAsync from "../../../shared/catchAsync";
import { mealPlanService } from "./meal.service";
import { Request, Response } from "express";
import sendResponse from "../../middleware/sendResponse";
import { StatusCodes } from "http-status-codes";
const createMealPlanController = catchAsync(async (req: Request, res: Response) => {
    const body = req?.body as any
    const image = req?.file as any
    const userId = req.user.id
    const result = await mealPlanService.createMealPlan(body, image, userId);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Meal plan created successfully",
        data: result,
        success: true,
    });
})

const getMealPlanController = catchAsync(async (req: Request, res: Response) => {
    const result = await mealPlanService.getMealPlan(req.user.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Meal plan retrieved successfully",
        data: result,
        success: true,
    });
})

const getMealPlanByIdController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await mealPlanService.getMealPlanById(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Meal plan retrieved successfully",
        data: result,
        success: true,
    });
})
const updateMealPlanController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const body = req?.body as any
    const image = req?.file as any
    const userId = req.user.id
    const result = await mealPlanService.updateMealPlan(id, body, image, userId);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Meal plan updated successfully",
        data: result,
        success: true,
    });
})

const deleteMealPlanController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const userId = req.user.id
    const result = await mealPlanService.deleteMealPlan(id, userId);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Meal plan deleted successfully",
        data: result,
        success: true,
    });
})


export const mealPlanController = {
    createMealPlanController,
    getMealPlanController,
    updateMealPlanController,
    deleteMealPlanController,
    getMealPlanByIdController
}
