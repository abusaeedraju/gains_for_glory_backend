import { prisma } from "../../../utils/prisma";
import ApiError from "../../error/ApiErrors";
import { StatusCodes } from "http-status-codes";

const getMyOrder = async (userId: string) => {
    const findUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    if (!findUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
    }
    const result = await prisma.order.findMany({
        where: {
            userId
        },
        select: {
            id: true,
            productId: true,
            productName: true,
            productPrice: true,
            quantity: true,
            orderStatus: true,
            createdAt: true,
            
        }  ,
        orderBy: {
            createdAt: "desc"
        } 
    })
    return result
}

export const orderService = { getMyOrder }
