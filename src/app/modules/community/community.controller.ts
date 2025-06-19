
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../middleware/sendResponse";
import { StatusCodes } from "http-status-codes";
import { communityServices } from "./community.service";

const getCommunityController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user;
    const communityData = await communityServices.getCommunity(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Community data retrieved successfully",
        data: communityData,
        success: true,
    });
});

const createPostController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user;
    const payload = req.body
    const communityData = await communityServices.createPost(id, payload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Post created successfully",
        data: communityData,
        success: true,
    });
})

const getBibleCommunityRequestController = catchAsync(async (req: Request, res: Response) => {
    const communityData = await communityServices.getCommunityRequest("BIBLE");
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Bible Community data retrieved successfully",
        data: communityData,
        success: true,
    });
})

const getWorkoutCommunityRequestController = catchAsync(async (req: Request, res: Response) => {
    const communityData = await communityServices.getCommunityRequest("WORKOUT");
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Bible Community data retrieved successfully",
        data: communityData,
        success: true,
    });
})

const getFinanceCommunityRequestController = catchAsync(async (req: Request, res: Response) => {
    const communityData = await communityServices.getCommunityRequest("FINANCE");
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Bible Community data retrieved successfully",
        data: communityData,
        success: true,
    });
})

const acceptBibleCommunityRequestController = catchAsync(async (req: Request, res: Response) => {
    
})
const acceptWorkoutCommunityRequestController = catchAsync(async (req: Request, res: Response) => {
})
const acceptFinanceCommunityRequestController = catchAsync(async (req: Request, res: Response) => {
    
})
export const communityController = { getCommunityController,createPostController,getBibleCommunityRequestController,getWorkoutCommunityRequestController,getFinanceCommunityRequestController , acceptBibleCommunityRequestController,acceptWorkoutCommunityRequestController,acceptFinanceCommunityRequestController}  