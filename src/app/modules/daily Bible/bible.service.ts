import { prisma } from "../../../utils/prisma";

const createBibleIntoDB = async (payload: any) => {
    await prisma.bible.deleteMany()
    const result = await prisma.bible.create({
        data: payload
    })
    return result
}

const getBibleFromDB = async () => {
    const result = await prisma.bible.findFirst()
    return result
};


export const bibleService = { createBibleIntoDB, getBibleFromDB }   