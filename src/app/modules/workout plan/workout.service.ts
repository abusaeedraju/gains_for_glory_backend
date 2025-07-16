import { prisma } from "../../../utils/prisma";
import ApiError from "../../error/ApiErrors";

const aiWorkoutPlan = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    const payload = {
        "primary_goal": user?.goal,
        "weight_kg": user?.weight,
        "height_cm": user?.height,
        "is_meat_eater": user?.eatMeat,
        "is_lactose_intolerant": user?.lactoseIntolerant,
        "allergies": user?.anyAllergies,
        "eating_style": user?.eatingStyle,
        "caffeine_consumption": user?.caffeineIntake,
        "sugar_consumption": user?.sugarIntake,
        "workout_type": user?.workoutType,
        "workout_frequency": user?.workOutDaysInWeek,
        "date_of_birth": user?.dateOfBirth
    }
     
    const response = await fetch("https://gym-deploy-nfjx.onrender.com/api/v1/workout-planner", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // 👈 Required for JSON payload
        },
        body: JSON.stringify(payload),
    });
    const data = await response.json();


    await prisma.aiWorkoutPlan.deleteMany({ where: { userId } });
    // const result = await prisma.aiWorkoutPlan.create({
    //     data: {
    //         userId: userId, // replace with your actual user ID
    //         workoutData: data.workout_plan[0].warm_up, // or wherever the structured data lives
    //     }
    // });
    console.log(data)
    const result = await prisma.aiWorkoutPlan.create({
       data: {
           userId: userId,
           workoutData: data.workout_plan[0].warm_up
       }
    });
    const result2 = await prisma.aiWorkoutPlan.create({
        data: {
            userId: userId,
            workoutData: data.workout_plan[0].warm_up
        }
     });
     const result3 = await prisma.aiWorkoutPlan.create({
        data: {
            userId: userId,
            workoutData: data.workout_plan[0].warm_up
        }
     });

    return {result,result2,result3}   ;
}

const markAsComplete = async (id: string, userId: string, complete: boolean) => {
    await prisma.aiWorkoutPlan.update({ where: { id, userId }, data: { workoutData: { warmUp: {mart_complete: complete} } } });
}   

export const workoutService = { aiWorkoutPlan, markAsComplete }
