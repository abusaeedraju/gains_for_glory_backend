import { prisma } from "../../../utils/prisma"
import ApiError from "../../error/ApiErrors"
import { StatusCodes } from "http-status-codes"

const addToCart = async (payload: any, userId: string, productId: string) => {
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Product not found")
    }
    const result = await prisma.cart.create({
        data: {
            ...payload,
            userId, productId
        }
    })
    return result
}
const getMyCartItem = async (userId: string) => {

    const result = await prisma.cart.findMany({
        where: { userId },
        include: {
            productDetails: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    image: true,
                }
            }
        }
    })
    if (result.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Cart is empty")
    }
    return result
}
const deleteCartItem = async (id: string) => {
    const cart = await prisma.cart.findUnique({ where: { id } })
    if (!cart) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Cart not found")
    }
    const result = await prisma.cart.delete({ where: { id } })
    return result

}
const updateCartItem = async (cartId: string, payload: any) => {
    const cart = await prisma.cart.findUnique({ where: { id: cartId } })
    if (!cart) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Cart not found")
    }
    const result = await prisma.cart.update({ where: { id: cartId }, data: payload })
    return result
}

export const cartService = {
    addToCart, getMyCartItem, deleteCartItem, updateCartItem
}