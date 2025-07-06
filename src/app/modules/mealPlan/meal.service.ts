import { prisma } from "../../../utils/prisma"
import { getImageUrl } from "../../helper/uploadFile"

const createMealPlan = async (payload: any, image: any, userId: string) => {
    const imageUrl = image && await getImageUrl(image)
    const result = await prisma.mealPlan.create({
        data: {
            ...payload,
            userId,
            image: imageUrl
        }
    })
    return result
}

const getMealPlan = async (userId: string) => {
    const result = await prisma.mealPlan.findMany({ where: { userId } })
    return result
}

const getMealPlanById = async (id: string) => {
    const result = await prisma.mealPlan.findUnique({ where: { id } })
    return result
}

const updateMealPlan = async (id: string, payload: any, image: any, userId: string) => {
    const imageUrl = image && await getImageUrl(image)
    const result = await prisma.mealPlan.update({
        where: { id, userId }, data: {
            ...payload,
            image: imageUrl
        }
    })
    return result
}

const deleteMealPlan = async (id: string, userId: string) => {
    const result = await prisma.mealPlan.delete({ where: { id, userId } })
    return result
}

export const mealPlanService = {
    createMealPlan,
    getMealPlan,
    updateMealPlan,
    deleteMealPlan,
    getMealPlanById
}
