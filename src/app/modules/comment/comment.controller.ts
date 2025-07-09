import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../middleware/sendResponse";
import { StatusCodes } from "http-status-codes";
import { commentServices } from "./comment.service";
const createCommentController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user;
    const { postId } = req.params
    const category = req.query.category as string
    const payload = req.body
    const communityData = await commentServices.createComment(id, postId, category, payload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Comment created successfully",
        data: communityData,
        success: true,
    });
})

const editCommentController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user;
    const { commentId } = req.params
    const payload = req.body
    const communityData = await commentServices.editComment(id, commentId, payload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Comment updated successfully",
        data: communityData,
        success: true,
    });
})

const deleteCommentController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user;
    const { commentId } = req.params
    const communityData = await commentServices.deleteComment(id, commentId);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Comment deleted successfully",
        data: communityData,
        success: true,
    });
})

const getCommentByPostIdController = catchAsync(async (req: Request, res: Response) => {
    const { postId } = req.params
    const communityData = await commentServices.getCommentByPostId(postId);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Comment retrieved successfully",
        data: communityData,
        success: true,
    });
})  

export const commentController = { createCommentController, editCommentController, deleteCommentController, getCommentByPostIdController }  