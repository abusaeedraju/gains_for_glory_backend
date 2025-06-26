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
    const result = await prisma.product.findUnique({
        where: { id },
        include:
        {
            reviews:
            {
                include:
                {
                    user: {
                        select: {
                            name: true,
                            image: true
                        }
                    }
                }
            }
        }
    })
    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Product not found")
    }
    const { avgRating, totalRating } = await reviewService.getAllReview(id)

    return { result, avgRating, totalRating }
}
const getAllProducts = async () => {

    const ratings = await prisma.review.groupBy({
        by: ['productId'],
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        },
    });


    const products = await prisma.product.findMany({
        include: {
            reviews: true
        }
    })
    if (products.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Products not found")
    }

    const ratingsMap = new Map(
        ratings.map(r => [r.productId, { avg: r._avg.rating, count: r._count.rating }])
    );

    const productsWithRatings = products.map(product => ({
        ...product,
        averageRating: ratingsMap.get(product.id)?.avg || 0,
        totalReviews: ratingsMap.get(product.id)?.count || 0,
    }));



    return productsWithRatings
}

const getMerchandiseProducts = async () => {

    const ratings = await prisma.review.groupBy({
        by: ['productId'],
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        },
    });

    const products = await prisma.product.findMany({
        where: {
            category: "merchandise"
        },
        include: {
            reviews: {
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true
                        }
                    }
                },
            }
        },
    })
    if (products.length === 0) {
        throw new ApiError(404, "Products not found")
    }
    const ratingsMap = new Map(
        ratings.map(r => [r.productId, { avg: r._avg.rating, count: r._count.rating }])
    );

    const productsWithRatings = products.map(product => ({
        ...product,
        averageRating: ratingsMap.get(product.id)?.avg || 0,
        totalReviews: ratingsMap.get(product.id)?.count || 0,
    }));

    return productsWithRatings
}
const getSupplementsProducts = async () => {

    const ratings = await prisma.review.groupBy({
        by: ['productId'],
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        },
    });

    const products = await prisma.product.findMany({
        where: {
            category: "supplements"
        },
        include: {
            reviews: {
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true
                        }
                    }
                },
            }
        },
    })
    if (products.length === 0) {
        throw new ApiError(404, "Products not found")
    }

    const ratingsMap = new Map(
        ratings.map(r => [r.productId, { avg: r._avg.rating, count: r._count.rating }])
    );

    const productsWithRatings = products.map(product => ({
        ...product,
        averageRating: ratingsMap.get(product.id)?.avg || 0,
        totalReviews: ratingsMap.get(product.id)?.count || 0,
    }));

    return productsWithRatings
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
    const ratings = await prisma.review.groupBy({
        by: ['productId'],
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        },
    });


    const products = await prisma.favorite.findMany({
        where: { userId },
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
        }
    })
    if (products.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Favorites not found")
    }

    const ratingsMap = new Map(
        ratings.map(r => [r.productId, { avg: r._avg.rating, count: r._count.rating }])
    );

    const productsWithRatings = products.map(product => ({
        ...product,
        averageRating: ratingsMap.get(product.productDetails.id)?.avg || 0,
        totalReviews: ratingsMap.get(product.productDetails.id)?.count || 0,
    }));

    return productsWithRatings
}
const removeFromFavorites = async (productId: string, userId: string) => {
    const result = await prisma.favorite.deleteMany({ where: { userId, productId } })
    return result
}
export const productServices = {
    createProduct, getSingleProduct, getAllProducts, getMerchandiseProducts, getSupplementsProducts, addToFavorites, getMyFavorites, removeFromFavorites, updateProduct, deleteProduct
}