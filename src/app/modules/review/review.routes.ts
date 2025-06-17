import { Router } from "express";
import { reviewController } from "./review.controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
const route = Router()

route.post("/create",auth(Role.USER,Role.TECHNICIAN),reviewController.createReviewController)
route.get("/:productId",auth(Role.USER,Role.TECHNICIAN),reviewController.getAllReviewController)

export const reviewRoutes = route