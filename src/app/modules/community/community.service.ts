import { prisma } from "../../../utils/prisma"
import ApiError from "../../error/ApiErrors";
import { StatusCodes } from "http-status-codes";

const getCommunity = async (userId: string) => {
    if (!userId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found")
    }
    const result = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            bibleCommunityStatus: true,
            workoutCommunityStatus: true,
            financeCommunityStatus: true
        }
    })
    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
    }
    return result
}


const getCommunityRequest = async (typeStr: string) => {

    if (!typeStr) {
        throw new ApiError(StatusCodes.NOT_FOUND, "CommunityName is required")
    }
    const communityName = typeStr.toUpperCase()
    const typeArrayEnum = ["BIBLE", "WORKOUT", "FINANCE"]

    if (!typeArrayEnum.includes(communityName)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid community name")
    }
    let queryBuilder = {}
    if (communityName === "BIBLE") {
        queryBuilder = { bibleCommunityStatus: "PENDING" }

    }
    else if (communityName === "WORKOUT") {
        queryBuilder = { workoutCommunityStatus: "PENDING" }

    }
    else if (communityName === "FINANCE") {
        queryBuilder = { financeCommunityStatus: "PENDING" }

    }
    const result = await prisma.user.findMany({
        where: queryBuilder,
        select: {
            id: true,
            name: true,
            email: true,
            location: true,
            subscription: true,
            bibleCommunityStatus: true,
            workoutCommunityStatus: true,
            financeCommunityStatus: true
        },


    })
    return result

}

const acceptRequest = async (userId: string, typeStr: string) => {

    if (!userId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found")
    }
    if (!typeStr) {
        throw new ApiError(StatusCodes.NOT_FOUND, "CommunityName is required")
    }

    const communityName = typeStr.toUpperCase()
    const typeArrayEnum = ["BIBLE", "WORKOUT", "FINANCE"]

    if (!typeArrayEnum.includes(communityName)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid community name")
    }
    let queryBuilder = {}
    if (communityName === "BIBLE") {
        queryBuilder = { bibleCommunityStatus: "APPROVED" }

    }
    else if (communityName === "WORKOUT") {
        queryBuilder = { workoutCommunityStatus: "APPROVED" }

    }
    else if (communityName === "FINANCE") {
        queryBuilder = { financeCommunityStatus: "APPROVED" }

    }

    const result = await prisma.user.update({
        where: {
            id: userId
        },
        data: queryBuilder,
        select: {
            id: true,
            name: true,
            email: true,
            location: true,
            subscription: true,
            bibleCommunityStatus: true,
            workoutCommunityStatus: true,
            financeCommunityStatus: true
        }
    })
    return result

}
const blockRequest = async (userId: string, typeStr: string) => {

    if (!userId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found")
    }
    if (!typeStr) {
        throw new ApiError(StatusCodes.NOT_FOUND, "CommunityName is required")
    }

    const communityName = typeStr.toUpperCase()
    const typeArrayEnum = ["BIBLE", "WORKOUT", "FINANCE"]

    if (!typeArrayEnum.includes(communityName)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid community name")
    }
    let queryBuilder = {}
    if (communityName === "BIBLE") {
        queryBuilder = { bibleCommunityStatus: "BLOCKED" }

    }
    else if (communityName === "WORKOUT") {
        queryBuilder = { workoutCommunityStatus: "BLOCKED" }

    }
    else if (communityName === "FINANCE") {
        queryBuilder = { financeCommunityStatus: "BLOCKED" }

    }

    const result = await prisma.user.update({
        where: {
            id: userId
        },
        data: queryBuilder,
        select: {
            id: true,
            name: true,
            email: true,
            location: true,
            subscription: true,
            bibleCommunityStatus: true,
            workoutCommunityStatus: true,
            financeCommunityStatus: true
        }
    })
    return result
}
const createPost = async (userId: string, category: string, payload: any) => {
    if (!userId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found")
    }
    const result = await prisma.user.findUnique({
        where: { id: userId },
    })
    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
    }
    if (!category) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Community Name is required")
    }
    const cate = category.toUpperCase()
    if (cate !== "BIBLE" && cate !== "WORKOUT" && cate !== "FINANCE") {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid community name")
    }
    const post = await prisma.post.create({
        data: {
            userId: userId,
            category: cate,
            ...payload
        },
    });

    return post
}

const getCommunityPosts = async (communityName: any) => {
    if (!communityName) {
        throw new ApiError(StatusCodes.NOT_FOUND, "CommunityName is required")
    }

    const community = communityName.toUpperCase()
    const typeArrayEnum = ["BIBLE", "WORKOUT", "FINANCE"]

    if (!typeArrayEnum.includes(communityName)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid community name")
    }

    const posts = await prisma.post.findMany({
        where: {
            category: community
        },
        select: {
            id: true,
            userId: true,
            category: true,
            body: true,
            like: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
        },
    })
    return posts
}
const getCommunityPostByUserId = async (userId: any, communityName: any) => {
    if (!userId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found")
    }
    if (!communityName) {
        throw new ApiError(StatusCodes.NOT_FOUND, "CommunityName is required")
    }
    const community = communityName.toUpperCase()

    const posts = await prisma.post.findMany({
        where: {
            userId: userId,
            category: community
        },
        select: {
            id: true,
            userId: true,
            category: true,
            body: true,
            like: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
        },
    })
    return posts
}
export const communityServices = { getCommunity, createPost, getCommunityRequest, acceptRequest, blockRequest, getCommunityPosts, getCommunityPostByUserId }