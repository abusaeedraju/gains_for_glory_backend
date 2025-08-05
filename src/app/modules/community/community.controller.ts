
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

const getCommunityRequestController = catchAsync(async (req: Request, res: Response) => {
    const type = req.query.type
    const { page, limit } = req.query
    const communityData = await communityServices.getCommunityRequest(page as any || 1, limit as any || 10,type as string);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Bible Community data retrieved successfully",
        data: communityData,
        success: true,
    });
})

const acceptCommunityRequestController = catchAsync(async (req: Request, res: Response) => {

    const { id, communityName } = req.query
    const communityData = await communityServices.acceptRequest(id as string, communityName as string);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Request accepted successfully",
        data: communityData,
        success: true,
    })
})
const blockCommunityRequestController = catchAsync(async (req: Request, res: Response) => {
    const { id, communityName } = req.query
    const communityData = await communityServices.blockRequest(id as string, communityName as string);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Request blocked successfully",
        data: communityData,
        success: true,
    })
})
const createPostController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user;
    const category = req.query.category as string
    const payload = req.body 
    const image = req.file as any
    const communityData = await communityServices.createPost(id, category, payload, image);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Post created successfully",
        data: communityData,
        success: true,
    });
})

const getCommunityPostsController = catchAsync(async (req: Request, res: Response) => {
    const { communityName } = req.query
    const communityData = await communityServices.getCommunityPosts(communityName as string);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Posts retrieved successfully",
        data: communityData,
        success: true,
    });
})
const getCommunityPostByUserIdController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user;
    const { communityName } = req.query
    const communityData = await communityServices.getCommunityPostByUserId(id,communityName as string);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Posts retrieved successfully",
        data: communityData,
        success: true,
    });
})
const editPostController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user;
    const { postId } = req.params
    const payload = req.body
    const communityData = await communityServices.editPost(id, postId, payload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Post updated successfully",
        data: communityData,
        success: true,
    });
})
const deletePostController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user;
    const { postId } = req.params
    const communityData = await communityServices.deletePost(id, postId);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Post deleted successfully",
        data: communityData,
        success: true,
    });
})
const getCommunityUsersController = catchAsync(async (req: Request, res: Response) => {
    const communityData = await communityServices.getCommunityUsers();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Community users retrieved successfully",
        data: communityData,
        success: true,
    });
})  
export const communityController = { getCommunityController, createPostController, acceptCommunityRequestController, getCommunityRequestController, blockCommunityRequestController,getCommunityPostsController,getCommunityPostByUserIdController,editPostController,deletePostController,getCommunityUsersController }  