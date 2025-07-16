
import { prisma } from "../../../utils/prisma"
import ApiError from "../../error/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { isValidCommunityUser } from "../../helper/isValidCommunityUser";
import { notificationServices } from "../notifications/notification.service";
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
        select: {
            id: true,
            comment: true,
            createdAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            }
        }
    });
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        },
        select: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            }
        }
    })
    if (!post) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Post not found")
    }
    await notificationServices.sendSingleNotification(userId, post.user.id, {
        title: "Commented on your post",
        body: `${result.user.name} commented on your post`,
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
            select: {
                id: true,
                comment: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                }
            }
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

const getCommentByPostId = async (postId: string) => {
    if (!postId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "please provide a valid postId")
    }
    const result = await prisma.comment.findMany({
        where: {
            postId: postId
        },
        select: {
            id: true,
            comment: true,
            createdAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            }
        },
    })
    const count = await prisma.comment.count({
        where: {
            postId: postId
        }
    })
    return {result,"Total Comments":count}
}

export const commentServices = { createComment, editComment, deleteComment, getCommentByPostId }