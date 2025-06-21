
import { prisma } from "../../../utils/prisma"
import ApiError from "../../error/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { isValidCommunityUser } from "../../helper/isValidCommunityUser";
const createComment = async (userId: string, postId: string, category: string, payload: any) => {

    if (!postId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "PostId is required")
    }
    const user = await isValidCommunityUser(userId, category)

    
    const comment = await prisma.comment.findFirst({
        where: {
            userId: userId,
            postId: postId
        }
    })
    if (comment) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "You have already commented on this post")
    }
    const result = await prisma.comment.create({
        data: {
            userId: userId,
            postId: postId,
            ...payload
        },
    });
    return result
}

const editComment = async (userId: string, commentId: string, payload: any) => {
    if (!userId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found")
    }
    if (!commentId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "CommentId not found")
    }

    try {
        const result = await prisma.comment.update({
            where: {
                id: commentId,
                userId: userId
            },
            data: payload,
        })
        return result
    } catch (error: any) {
        throw new ApiError(StatusCodes.NOT_FOUND, "comment not found")
    }
}
const deleteComment = async (userId: string, commentId: string) => {
    if (!userId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found")
    }
    if (!commentId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "CommentId not found")
    }

    try {
        const result = await prisma.comment.delete({
            where: {
                id: commentId,
                userId: userId
            }
        })
        return result
    } catch (error) {
        throw new ApiError(StatusCodes.NOT_FOUND, "comment not found")
    }
}


export const commentServices = { createComment, editComment, deleteComment }