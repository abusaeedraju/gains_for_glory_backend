
import { StatusCodes } from "http-status-codes"
import ApiError from "../../error/ApiErrors"
import { prisma } from "../../../utils/prisma"

const createLike = async (userId: string, postId: string) => {
    if (!userId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found")
    }
    if (!postId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "PostId not found")
    }
    try {
        const isExistLike = await prisma.like.findFirst({
            where: {
                userId: userId,
                postId: postId
            }
        })
        if (isExistLike) {
            await prisma.like.delete({
                where: {
                    id: isExistLike.id
                }
            })

            const post = await prisma.post.findUnique({
                where: {
                    id: postId
                }
            })
            if (!post) {
                throw new ApiError(StatusCodes.NOT_FOUND, "post not found")
            }
            const result = await prisma.post.update({
                where: {
                    id: postId
                },
                data: {
                    totalLike: post.totalLike - 1
                }
            })
            return "Disliked"
        }
        const result = await prisma.like.create({
            data: {
                userId: userId,
                postId: postId
            }
        })
        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        })
        if (!post) {
            throw new ApiError(StatusCodes.NOT_FOUND, "post not found")
        }
        const updateLike = await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                totalLike: post.totalLike + 1
            }
        })
        return "liked"
    } catch (error) {
        throw new ApiError(StatusCodes.NOT_FOUND, "like not found")
    }
}
export const LikeService = { createLike } 