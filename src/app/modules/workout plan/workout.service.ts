import { prisma } from "../../../utils/prisma";
import ApiError from "../../error/ApiErrors";

const aiWorkoutPlan = async (userId: string) => {
    console.log(userId)
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    console.log(user)
    // const payload = {
    //     "primary_goal": user?.goal,
    //     "weight_kg": user?.weight,
    //     "height_cm": user?.height,
    //     "is_meat_eater": user?.eatMeat,
    //     "is_lactose_intolerant": user?.lactoseIntolerant,
    //     "allergies": user?.anyAllergies,
    //     "eating_style": user?.eatingStyle,
    //     "caffeine_consumption": user?.caffeineIntake,
    //     "sugar_consumption": user?.sugarIntake,
    //     "workout_type": "Home",
    //     "workout_frequency": 1,
    //     "date_of_birth": user?.dateOfBirth
    // }

    const payload = {
        "primary_goal": "Build Muscle",
        "weight_kg": 0,
        "height_cm": 0,
        "is_meat_eater": true,
        "is_lactose_intolerant": true,
        "allergies": [
          "string"
        ],
        "eating_style": "Vegan",
        "caffeine_consumption": "None",
        "sugar_consumption": "None",
        "workout_type": "Home",
        "workout_frequency": 1,
        "date_of_birth": "string"
    }
    const response = await fetch("https://gym-deploy-nfjx.onrender.com/api/v1/workout-planner", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // 👈 Required for JSON payload
        },
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    console.log(data)
    return data;
}

export const workoutService = { aiWorkoutPlan }
