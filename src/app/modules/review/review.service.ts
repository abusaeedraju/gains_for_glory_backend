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
const getAllReview = async (productId: string) => {
    const result = await prisma.review.findMany({ where: { productId } })

    const averageRating = await prisma.review.aggregate({
        where: {
            productId: productId, // replace with actual product ID
        },
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        }
    });
    const avgRating = averageRating._avg.rating
    const totalRating = averageRating._count.rating

    return { result, avgRating, totalRating }
}
export const reviewService = {
    createReview, getAllReview
};  