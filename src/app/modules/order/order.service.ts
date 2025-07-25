import { prisma } from "../../../utils/prisma";
import ApiError from "../../error/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { notificationServices } from "../notifications/notification.service";
import { OrderStatus } from "@prisma/client";

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
            product: {
                select: {
                    image: true
                }
            }

        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return result
}

const getAllOrders = async (search?: OrderStatus) => {
    const result = await prisma.order.findMany({
        where: {
            orderStatus: search
        },
        select: {
            id: true,
            quantity: true,
            size: true,
            country: true,
            city: true,
            address: true,
            orderStatus: true,
            createdAt: true,
            number: true,
            user: {
                select: {
                    name: true,
                    email: true,
                    location: true
                }
            },
            product: {
                select: {
                    name: true,
                    image: true
                }
            }

        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return result
}

const updateOrderStatus = async (id: string, payload: any, userId: string) => {
    const result = await prisma.order.update({
        where: { id },
        data: { orderStatus: payload.orderStatus },
        select: {
            id: true,
            orderStatus: true,
            number: true,
            user: {
                select: {
                    name: true,
                    email: true,
                    location: true
                }
            },
            userId: true,

        },  
    });

    await notificationServices.sendSingleNotification(userId,result.userId, {
        title: "Order accepted",
        body: `Your order has been delivered`,
    }); 
    return result;
}

export const orderService = { getMyOrder, getAllOrders, updateOrderStatus    }
