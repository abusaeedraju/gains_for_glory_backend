import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../middleware/sendResponse";
import { StatusCodes } from "http-status-codes";
import  {LikeService}  from "./like.service";
const createLikeController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user;
    const { postId } = req.params
    const communityData = await LikeService.createLike(id, postId);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Like/Dislike created successfully",
        data: communityData,
        success: true,
    });
})


export const likeController = {
    createLikeController
}