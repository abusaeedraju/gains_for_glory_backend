import catchAsync from "../../../shared/catchAsync";
import { bibleService } from "./bible.service";
import { Request, Response } from "express";

const createBible = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await bibleService.createBibleIntoDB(payload);
    res.status(200).json({
        success: true,
        message: "Bible created successfully",
        data: result,
    });
});

const getBible = catchAsync(async (req: Request, res: Response) => {
    const result = await bibleService.getBibleFromDB();
    res.status(200).json({
        success: true,
        message: "Bible retrieved successfully",
        data: result,
    });
});

export const bibleController = {
    createBible,
    getBible,
};