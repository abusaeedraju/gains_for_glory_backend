import { Router } from "express";
import auth from "../../middleware/auth";
import { aiController } from "./ai.controller";
const router = Router();

router.post("/coach/chat", auth(), aiController.submitToAi);
//router.post("/food-scanner/analyze", auth(), aiController.foodScanner);
//router.post("/meal-planner/generate", auth(), aiController.mealPlanner);
//router.post("/workout-planner/generate", auth(), aiController.workoutPlanner);

export const aiRoutes = router