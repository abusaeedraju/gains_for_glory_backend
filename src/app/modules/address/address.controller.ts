import catchAsync from "../../../shared/catchAsync";
import { addressService } from "./address.service";
import sendResponse from "../../middleware/sendResponse";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

const createAddressController = catchAsync(async (req: Request, res: Response) => {
    const body = req?.body as any
    const userId = req.user.id as string
    const result = await addressService.createAddress(body, userId)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Address created successfully",
        data: result,
        success: true,
    })
})

export const addressController = {
    createAddressController
}