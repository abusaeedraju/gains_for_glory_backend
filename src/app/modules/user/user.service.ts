
import ApiError from "../../error/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { compare, hash } from "bcrypt"
import { OTPFn } from "../../helper/OTPFn";
import { getImageUrl } from "../../helper/uploadFile";
import { prisma } from "../../../utils/prisma";
import { SubscriptionPlan } from "@prisma/client";
import dayjs from 'dayjs';

const createUserIntoDB = async (payload: any) => {

    const findUser = await prisma.user.findUnique({
        where: {
            email: payload.email
        }
    })
    if (findUser && findUser?.isVerified) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User already exists")
    }
    if (findUser && !findUser?.isVerified) {
        await OTPFn(payload.email)
        return
    }
    if (payload.password !== payload.confirmPassword) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Password and confirm password does not match")
    }
    const { confirmPassword, ...filteredPayload } = payload
    const newPass = await hash(filteredPayload.password, 10)
    const referCode = Math.floor(Math.random() * 900000) + 100000
    const result = await prisma.user.create({
        data: {
            ...filteredPayload,
            password: newPass,
            referCode: referCode
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            referCode: true,
            createdAt: true
        }
    })
    //refer point calculate
    const user = await prisma.user.findFirst({
        where: {
            referCode: payload.referBy
        }
    })
    if (user) {
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                referPoint: user.referPoint + 100
            }
        })
    }
    OTPFn(payload.email)
    return result
}

const changePasswordIntoDB = async (id: string, payload: any) => {

    const findUser = await prisma.user.findUnique({
        where: {
            id
        }
    })
    if (!findUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
    }
    try {
        const isMatch = await compare(payload.oldPassword, findUser.password)
        if (!isMatch) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Old password is incorrect")
        }
        const newPass = await hash(payload.newPassword, 10)
        await prisma.user.update({
            where: {
                id
            },
            data: {
                password: newPass
            }
        })
        return

    } catch {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Old password is incorrect")
    }
}

const updateUserIntoDB = async (id: string, payload: any, image: any) => {


    const userImage = image && await getImageUrl(image)

    try {
        const result = await prisma.user.update({
            where: {
                id
            },
            data: {
                ...payload,
                image: userImage ?? undefined
            }
        })
        const { password, fcmToken, connectAccountId, customerId, ...updateDetails } = result

        return updateDetails

    } catch (error: any) {
        throw new ApiError(StatusCodes.BAD_REQUEST, error)
    }
}

const getMyProfile = async (id: string) => {

    const result: any = await prisma.user.findUnique({
        where: {
            id
        }
    })
    const { password, fcmToken, connectAccountId, customerId, ...updateDetails } = result
    return updateDetails
}
const deleteProfile = async (id: string) => {
    const findUser = await prisma.user.findUnique({
        where: {
            id
        }
    })
    if (!findUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
    }
    const result = await prisma.user.delete({
        where: {
            id
        }
    })
    return result
}
const getMyReferCode = async (id: string) => {

    const result: any = await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            referCode: true
        }
    })
    return result
}

const getAllUsers = async (search?: SubscriptionPlan) => {
    const result = await prisma.user.findMany({
        where: {
            subscription: search

        }
    })
    return result
}

const rewardPoint = async (id: string, rewardPoint: number) => {
    const findUser = await prisma.user.findUnique({
        where: {
            id
        }
    })
    if (!findUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
    }
    const result = await prisma.user.update({
        where: {
            id
        },
        data: {
            referPoint: findUser.referPoint + rewardPoint
        },
        select: {
            id: true,
            name: true,
            referPoint: true
        }
    })
    return result
}


const getTotalIncomeByMonth = async (year: number) => {
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

    // Fetch Payment data
    const payments = await prisma.payment.findMany({
        where: {
            createdAt: {
                gte: startOfYear,
                lte: endOfYear,
            },
        },
    });

    // Fetch Donation data
    const donations = await prisma.donation.findMany({
        where: {
            createdAt: {
                gte: startOfYear,
                lte: endOfYear,
            },
            status: 'completed', // optional filter
        },
    });

    const monthly = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;

        const monthlyPayments = payments.filter(p => p.createdAt.getUTCMonth() + 1 === month);
        const monthlyDonations = donations.filter(d => d.createdAt.getUTCMonth() + 1 === month);

        const paymentIncome = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
        const donationIncome = monthlyDonations.reduce((sum, d) => sum + d.amount, 0);

        return {
            month: dayjs().month(i).format('MMM'),
            income: paymentIncome + donationIncome,
        };
    });

    const total = monthly.reduce((sum, m) => sum + m.income, 0);
   const totalUser = await prisma.user.count({
    where: {   
        isVerified: true,
        status: "ACTIVE"
    },
   })   
    return {
        total,
        monthly,
        totalUser
    };
};

export const userServices = { createUserIntoDB, updateUserIntoDB, changePasswordIntoDB, getMyProfile, deleteProfile, getMyReferCode, getAllUsers, rewardPoint, getTotalIncomeByMonth }