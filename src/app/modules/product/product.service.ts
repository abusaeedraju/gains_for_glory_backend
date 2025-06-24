import { prisma } from "../../../utils/prisma"
import ApiError from "../../error/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { reviewService } from "../review/review.service";

const createProduct = async (payload: any, imageFiles: any[]) => {
    // Extract only URLs into a string array
    const imageUrls: string[] = imageFiles.map(file => file.location);

    // Save to DB
    const result = await prisma.product.create({
        data: {
            ...payload,
            image: imageUrls, // This is now a string[]
        },
    });

    return result;
};
const updateProduct = async (id: string, payload: any, imageFiles: any[]) => {
     const imageUrls: string[] = imageFiles.map(file => file.location);
    const result = await prisma.product.update({ where: { id }, data: { ...payload, image: imageUrls } })
    return result
}
const getSingleProduct = async (id: string) => {
    const result = await prisma.product.findUnique({ where: { id }, include: { reviews: true } })
    if (!result) {
        throw new ApiError(404, "Product not found")
    }
    const {  avgRating, totalRating } = await reviewService.getAllReview(id)
    return {result, avgRating, totalRating}
}
const getAllProducts = async () => {
    const result = await prisma.product.findMany({
        include: {
            reviews: true
        }
    })
    if (result.length === 0) {
        throw new ApiError(404, "Products not found")
    }
   
    return result
}

const getMerchandiseProducts = async () => {
    const result = await prisma.product.findMany({
        where: {
            category: "merchandise"
        },
        include: {
            reviews: true
        }
    })
    if (result.length === 0) {
        throw new ApiError(404, "Products not found")
    }
    return result
}
const getSupplementsProducts = async () => {
    const result = await prisma.product.findMany({
        where: {
            category: "supplements"
        },
        include: {
            reviews: true
        }
    })
    if (result.length === 0) {
        throw new ApiError(404, "Products not found")
    }
    return result
}
const deleteProduct = async (id: string) => {
    const result = await prisma.product.delete({ where: { id } })
    return result
}
const addToFavorites = async (productId: string, userId: string) => {
    const isExit = await prisma.favorite.findFirst({ where: { userId, productId } })
    if (isExit) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Product already exists in favorites")
    }
    const result = await prisma.favorite.create({ data: { userId, productId } })
    return result
}
const getMyFavorites = async (userId: string) => {

    const result = await prisma.favorite.findMany({ where: { userId },
     select: {
        productDetails: {
            select: {
                id: true,
                name: true,
                price: true,
                image: true,
                category: true,
                size: true,
            }
        }
    } })
    if (result.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Favorites not found")
    }
    return result
}
const removeFromFavorites = async (productId: string, userId: string) => {
    const result = await prisma.favorite.deleteMany({ where: { userId, productId } })
    return result
}
export const productServices = {
    createProduct,getSingleProduct, getAllProducts, getMerchandiseProducts, getSupplementsProducts, addToFavorites, getMyFavorites, removeFromFavorites, updateProduct, deleteProduct
}