import { PrismaClient } from "@prisma/client";

import { StatusCodes } from "http-status-codes";
import ApiError from "../app/error/ApiErrors";
const prisma = new PrismaClient();  

export const isValidUser = async (userId: string) => {
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
}