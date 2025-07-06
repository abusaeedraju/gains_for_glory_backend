import { Router } from "express";
import { mealPlanController } from "./meal.controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
import { fileUploader } from "../../helper/uploadFile";
import { parseBodyMiddleware } from "../../middleware/parseBodyData";
const router = Router();

router.post("/create", auth(Role.USER,Role.TECHNICIAN),fileUploader.uploadFoodImages,parseBodyMiddleware,mealPlanController.createMealPlanController);
router.get("/my-meal/", auth(Role.USER,Role.TECHNICIAN),mealPlanController.getMealPlanController)
router.get("/meal/:id", auth(Role.USER,Role.TECHNICIAN),mealPlanController.getMealPlanByIdController)
router.put("/update/:id", auth(Role.USER,Role.TECHNICIAN),fileUploader.uploadFoodImages,parseBodyMiddleware,mealPlanController.updateMealPlanController)
router.delete("/delete/:id", auth(Role.USER,Role.TECHNICIAN),mealPlanController.deleteMealPlanController)

export const mealPlanRoutes = router;   