import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { userController } from "./user.controller";
import { UserValidation } from "./user.validation";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
import { fileUploader } from "../../helper/uploadFile";
import { parseBodyMiddleware } from "../../middleware/parseBodyData";

const route = Router()

route.post('/create', validateRequest(UserValidation.createValidation), userController.createUserController)

route.put('/change-password', auth(Role.USER || Role.ADMIN), validateRequest(UserValidation.changePasswordValidation), userController.changePasswordController)

route.put("/me", auth(Role.USER || Role.ADMIN), fileUploader.uploadProfileImage, parseBodyMiddleware, userController.updateUserController)
route.get("/me", auth(), userController.getMyProfileController)
route.delete("/delete/me", auth(), userController.deleteProfileController)
route.get("/refer-code", auth(Role.USER), userController.getMyReferCodeController)

route.get("/all-users", auth(Role.ADMIN), userController.getAllUsersController)

route.put("/reward-point", auth(), userController.rewardPointController)
route.get("/total-income/:year", auth(Role.ADMIN), userController.getTotalIncomeByMonthController)

export const userRoutes = route