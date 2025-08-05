
import { prisma } from "../../../utils/prisma"
import ApiError from "../../error/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { isValidCommunityUser } from "../../helper/isValidCommunityUser"
import { getImageUrl } from './../../helper/uploadFile';


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


const getCommunityRequest = async (page: number, limit: number, typeStr: string) => {

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
        skip: (page - 1) * limit,
        take: Number(limit),
    })
    if (result.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No request found")
    }
    const total = await prisma.user.count({
        where: queryBuilder,
    })
    return {
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        data: result,
    }

}

const acceptRequest = async (userId: string, community: string) => {

    if (!userId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found")
    }
    if (!community) {
        throw new ApiError(StatusCodes.NOT_FOUND, "CommunityName is required")
    }

    const communityName = community.toUpperCase()
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

    // Step 1: Get all group chats
    const groupChats = await prisma.groupChat.findMany();
    const isGroupMember = await prisma.groupMember.findFirst({
        where: {
            userId: userId,
            groupChatId: {
                in: groupChats.map(group => group.id)
            }
        },
    })
    if (!isGroupMember) {
        // Step 2: Add this user to all groups
        await prisma.groupMember.createMany({
            data: groupChats.map(group => ({
                userId: userId,
                groupChatId: group.id,
            }))
        });
    }


    return result

}
const blockRequest = async (userId: string, community: string) => {

    if (!userId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found")
    }
    if (!community) {
        throw new ApiError(StatusCodes.NOT_FOUND, "CommunityName is required")
    }

    const communityName = community.toUpperCase()
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
const createPost = async (userId: string, category: string, payload: any, image: any) => {
    const imageUrl = image && await getImageUrl(image)
    const user = await isValidCommunityUser(userId, category)

    const post = await prisma.post.create({
        data: {
            userId: userId,
            image: imageUrl,
            category: category.toUpperCase(),
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

    if (!typeArrayEnum.includes(community)) {
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
            image: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            },
            _count: {
                select: {
                    comment: true,
                    like: true
                }
            }
        },

    })
    if (posts.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Posts not found")
    }
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
    const typeArrayEnum = ["BIBLE", "WORKOUT", "FINANCE"]

    if (!typeArrayEnum.includes(community)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid community name")
    }

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
            image: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            },
            _count: {
                select: {
                    comment: true,
                    like: true
                }
            }
        },
    })
    if (posts.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Posts not found")
    }
    return posts
}
const editPost = async (userId: string, postId: string, payload: any) => {
    if (!userId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found")
    }
    if (!postId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "PostId not found")
    }
    try {
        const result = await prisma.post.update({
            where: {
                id: postId,
                userId: userId
            },
            data: payload,
        })
        return result
    } catch (error) {
        throw new ApiError(StatusCodes.NOT_FOUND, "post not found")
    }
}
const deletePost = async (userId: string, postId: string) => {
    if (!userId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found")
    }
    if (!postId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "PostId not found")
    }
    try {
        const result = await prisma.post.delete({
            where: {
                id: postId,
                userId: userId
            }
        })
        return result
    } catch (error) {
        throw new ApiError(StatusCodes.NOT_FOUND, "post not found")
    }
}

const getCommunityUsers = async () => {
    const bibleUsers = await prisma.user.count({
        where: { bibleCommunityStatus: "APPROVED" },
    })
    const workoutUsers = await prisma.user.count({
        where: { workoutCommunityStatus: "APPROVED" },
    })
    const financeUsers = await prisma.user.count({
        where: { financeCommunityStatus: "APPROVED" },
    })
    return { "bibleUsers": bibleUsers, "workoutUsers": workoutUsers, "financeUsers": financeUsers }
}

export const communityServices = { getCommunity, createPost, getCommunityRequest, acceptRequest, blockRequest, getCommunityPosts, getCommunityPostByUserId, editPost, deletePost, isValidCommunityUser, getCommunityUsers }