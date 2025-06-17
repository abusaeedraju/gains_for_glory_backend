import { prisma } from "../../../utils/prisma"
import ApiError from "../../error/ApiErrors";

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
const getAllProducts = async () => {
    const result = await prisma.product.findMany()
    if (result.length === 0) {
        throw new ApiError(404, "Products not found")
    }
    return result
}

const getMerchandiseProducts = async () => {
    const result = await prisma.product.findMany({
        where: {
            category: "merchandise"
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
        }
    })
    if (result.length === 0) {
        throw new ApiError(404, "Products not found")
    }
    return result
}
export const productServices = {
    createProduct, getAllProducts, getMerchandiseProducts, getSupplementsProducts
}