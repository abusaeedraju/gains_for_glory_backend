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

const createPost = async (userId: string, payload: any) => {
    if (!userId) {
        throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found")
    }
    const result = await prisma.user.findUnique({
        where: { id: userId },
    })
    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
    }

    const post = await prisma.post.create({
        data: {
            userId: userId,
            ...payload
        },
    });

    return post
}
const getCommunityRequest = async (name: string) => {
    if (name === "BIBLE") {
        const result = await prisma.user.findMany({
            where: {
                bibleCommunityStatus: "PENDING"
            },
            select: {
                id: true,
                name: true,
                email: true,
                location: true,
                subscription: true,
                bibleCommunityStatus: true
            },


        })
        return result
    }
    if (name === "WORKOUT") {
        const result = await prisma.user.findMany({
            where: {
                workoutCommunityStatus: "PENDING"
            },
            select: {
                id: true,
                name: true,
                email: true,
                location: true,
                subscription: true,
                workoutCommunityStatus: true
            },


        })
        return result
    }
    if (name === "FINANCE") {
        const result = await prisma.user.findMany({
            where: {
                financeCommunityStatus: "PENDING"
            },
            select: {
                id: true,
                name: true,
                email: true,
                location: true,
                subscription: true,
                financeCommunityStatus: true
            },


        })
        return result
    }

}

/* const acceptRequest = async (id: string, name: string) => {
   if(name === "BIBLE"){
    const result = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            bibleCommunityStatus: "APPROVED"
        }
    })
    return result
   }
   if(name === "WORKOUT"){
    const result = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            workoutCommunityStatus: "APPROVED"
        }
    })
    return result
   }
   if(name === "FINANCE"){
    const result = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            financeCommunityStatus: "APPROVED"
        }
    })
    return result
   }
} */
export const communityServices = { getCommunity, createPost, getCommunityRequest }