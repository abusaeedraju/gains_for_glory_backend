import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { userServices } from "./user.service";
import sendResponse from "../../middleware/sendResponse";
import { StatusCodes } from "http-status-codes";
import { SubscriptionPlan } from "@prisma/client";


const createUserController = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.createUserIntoDB(req.body)
    sendResponse(res, { statusCode: StatusCodes.CREATED, message: "Please check your email for verification", data: result, success: true })
})

const changePasswordController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user
    const body = req.body as any
    const result = await userServices.changePasswordIntoDB(id, body)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Password updated successfully", data: result, success: true })
})

const updateUserController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user
    const body = req?.body as any
    const image = req?.file as any
    const result = await userServices.updateUserIntoDB(id, body, image)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "User updated successfully", data: result, success: true })
})

const getMyProfileController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user
    const result = await userServices.getMyProfile(id)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "User profile retrieved successfully", data: result, success: true })
})

const deleteProfileController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user
    const result = await userServices.deleteProfile(id)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "User profile deleted successfully", data: result, success: true })
})
const getMyReferCodeController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user
    const result = await userServices.getMyReferCode(id)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "User refer code retrieved successfully", data: result, success: true })
})
const getAllUsersController = catchAsync(async (req: Request, res: Response) => {
    const { search } = req.query
    const result = await userServices.getAllUsers(search as SubscriptionPlan)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Users retrieved successfully", data: result, success: true })
})
export const userController = { createUserController, updateUserController, changePasswordController, getMyProfileController, deleteProfileController, getMyReferCodeController, getAllUsersController } 