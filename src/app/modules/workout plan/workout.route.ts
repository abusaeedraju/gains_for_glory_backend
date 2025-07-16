import express from "express"
import { workoutController } from "./workout.controller"
import auth from "../../middleware/auth"
const router = express.Router()


router.put("/ai-workout-plan/mark/:id",auth(), workoutController.markAsCompleteController)
router.get("/ai-workout-plan",auth(), workoutController.aiWorkoutPlanController)


export const workoutRoutes = router 