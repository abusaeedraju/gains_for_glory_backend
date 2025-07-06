import { prisma } from "../../../utils/prisma"

const createAddress = async (payload: any, userId: string) => {
    const result = await prisma.address.create({ data: { ...payload, userId } })
    return result
}

export const addressService = {
    createAddress
}   