import { prisma } from "../../../utils/prisma"
import ApiError from "../../error/ApiErrors"
import { StatusCodes } from "http-status-codes"

const addToCart = async (payload: any, userId: string) => {
    const isExit = await prisma.cart.findFirst({ where: { userId, productId: payload.productId } })
    if (isExit) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Product already exists in cart")
    }
    const result = await prisma.cart.create({ data: { ...payload, userId } })
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
                    category: true,
                    size: true,
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
    const result = await prisma.cart.delete({ where: { id } })
    return result

}

export const cartService = {
    addToCart, getMyCartItem, deleteCartItem
}