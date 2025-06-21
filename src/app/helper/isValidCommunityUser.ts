import { StatusCodes } from "http-status-codes"
import ApiError from "../error/ApiErrors"
import { prisma } from "../../utils/prisma"

export const isValidCommunityUser = async (userId: string, category: string) => {
    if (!userId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found")
    }
    if (!category) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Community Name is required")
    }

    const cate = category.toUpperCase()
    if (cate !== "BIBLE" && cate !== "WORKOUT" && cate !== "FINANCE") {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid community name")
    }


    const result = await prisma.user.findUnique({
        where: { id: userId },
    })

    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
    }

    if (cate === "FINANCE" && result.financeCommunityStatus !== "APPROVED" || cate === "BIBLE" && result.bibleCommunityStatus !== "APPROVED" || cate === "WORKOUT" && result.workoutCommunityStatus !== "APPROVED") {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "you are not allowed to create post, join community first")
    }

    return result
}