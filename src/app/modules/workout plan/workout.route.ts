import express from "express"
import { workoutController } from "./workout.controller"
const router = express.Router()


router.get("/ai-workout-plan", workoutController.aiWorkoutPlanController)


export const workoutRoutes = router 