import { startOfDay, endOfDay } from 'date-fns';
import { prisma } from '../../utils/prisma';
import ApiError from '../error/ApiErrors';
import { StatusCodes } from 'http-status-codes';

export const checkAndTrackDailyUsage = async (userId: string, route: string) => {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const exists = await prisma.dailyUsage.findFirst({
        where: {
            userId,
            route,
            date: {
                gte: todayStart,
                lte: todayEnd,
            },
        },
    });

    if (exists) {
        if(route === 'ai-meal-plan'){
            const data = await prisma.aiMealPlan.findFirst({
                where: {
                    userId,
                },
            });
            return data?.mealData;
        }
        if(route === 'ai-workout-plan'){
            const data = await prisma.aiWorkoutPlan.findFirst({
                where: {
                    userId,
                },
            });
            return data;
        }   
        const data = await prisma.aiMealPlan.findFirst({
            where: {
                userId,
            },
        });
        return data?.mealData;
    } else {
        await prisma.dailyUsage.deleteMany({
            where: {
                userId,
                route,
            },
        });
        await prisma.dailyUsage.create({
            data: { userId, route },
        });
        return null;
    }
};
