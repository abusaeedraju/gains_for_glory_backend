import { PrismaClient } from "@prisma/client";
import ApiError from "../../error/ApiErrors";
import { StatusCodes } from "http-status-codes";
const prisma = new PrismaClient();

const createReview = async (id: string, payload: any) => {
    const isExistReview = await prisma.review.findFirst({ where: { userId: id, productId: payload.productId } })
    if (isExistReview) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Your review already exists")
    }
    const result = await prisma.review.create({ data: { ...payload, userId: id } })
    return result

};
const getAllReview = async (productId : string) => {
    const result = await prisma.review.findMany( { where: { productId } })
    if(result.length === 0){
        throw new ApiError(StatusCodes.NOT_FOUND, "Review not found")
    }
    return result
}
export const reviewService = {
    createReview,getAllReview
};  