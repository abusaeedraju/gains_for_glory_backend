
import { prisma } from "../../../utils/prisma"
import ApiError from "../../error/ApiErrors";
import { StatusCodes } from "http-status-codes";

/* const isValidUser = async (userId: string) => {
    if (!userId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found")
    }
   try {
     const result = await prisma.user.findUnique({
        where: { id: userId },
    })
console.log("result",result)
    if (result?.bibleCommunityStatus !== "APPROVED" || result?.workoutCommunityStatus !== "APPROVED" || result?.financeCommunityStatus !== "APPROVED") {
        return false
    }

    return true
   } catch (error) {
    throw new ApiError(StatusCodes.NOT_FOUND, "you are not allowed to create post, join community first")
   }
} */
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
    if (result.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No request found")
    }
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
   
       /*  const user= await  isValidUser(userId)
        console.log("user",user)
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "you are not allowed to create post, join community first")
        } */
    const result = await prisma.user.findUnique({
        where: { id: userId },
    })

    if (result?.bibleCommunityStatus !== "APPROVED" || result?.workoutCommunityStatus !== "APPROVED" || result?.financeCommunityStatus !== "APPROVED") {
        throw new ApiError(StatusCodes.NOT_FOUND, "you are not allowed to create post, join community first")
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
            like: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
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
            like: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
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
    const result = await prisma.post.update({
        where: {
            id: postId,
            userId: userId
        },
        data: payload,
    })
    return result
}
const deletePost = async (userId: string, postId: string) => {
    if (!userId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found")
    }
    if (!postId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "PostId not found")
    }
    const result = await prisma.post.delete({
        where: {
            id: postId,
            userId: userId
        }
    })
    return result
}

const createComment = async (userId: string, postId: string, payload: any) => {
    if (!userId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found")
    }
    if (!postId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "PostId not found")
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (user?.bibleCommunityStatus !== "APPROVED" || user?.workoutCommunityStatus !== "APPROVED" || user?.financeCommunityStatus !== "APPROVED") {
        throw new ApiError(StatusCodes.NOT_FOUND, "you are not allowed to create comment, join community first")
    }
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
    const result = await prisma.comment.update({
        where: {
            id: commentId,
            userId: userId
        },
        data: payload,
    })
    return result
}
const deleteComment = async (userId: string, commentId: string) => {
    if (!userId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found")
    }
    if (!commentId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "CommentId not found")
    }

    const result = await prisma.comment.delete({
        where: {
            id: commentId,
            userId: userId
        }
    })
    return result
}
export const communityServices = { getCommunity, createPost, getCommunityRequest, acceptRequest, blockRequest, getCommunityPosts, getCommunityPostByUserId, editPost, deletePost, createComment, editComment, deleteComment }