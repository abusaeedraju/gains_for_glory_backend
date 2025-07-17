import { prisma } from "../../../utils/prisma"
import { getImageUrl } from "../../helper/uploadFile"
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import { v4 as uuidv4 } from "uuid";



const createMealPlan = async (payload: any, image: any, userId: string) => {
    const imageUrl = image && await getImageUrl(image)
    const result = await prisma.mealPlan.create({
        data: {
            ...payload,
            userId,
            image: imageUrl
        }
    })
    return result
}

const getMealPlan = async (userId: string) => {
    const result = await prisma.mealPlan.findMany({ where: { userId } })
    return result
}

const getMealPlanById = async (id: string) => {
    const result = await prisma.mealPlan.findUnique({ where: { id } })
    return result
}

const updateMealPlan = async (id: string, payload: any, image: any, userId: string) => {
    const imageUrl = image && await getImageUrl(image)
    const result = await prisma.mealPlan.update({
        where: { id, userId }, data: {
            ...payload,
            image: imageUrl
        }
    })
    return result
}

const deleteMealPlan = async (id: string, userId: string) => {
    const result = await prisma.mealPlan.delete({ where: { id, userId } })
    return result
}

const aiMealPlan = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } })
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

    const response = await fetch("https://gym-update.onrender.com/api/v1/meal-planner", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // 👈 Required for JSON payload
        },
        body: JSON.stringify(payload),
    });
    const data: any = await response.json();

    await prisma.aiMealPlan.deleteMany({ where: { userId } });
    const result = await prisma.aiMealPlan.create({
        data: {
            userId: userId, // replace with your actual user ID
            mealData: data.meal_plan, // or wherever the structured data lives
        }
    });

    return result.mealData;
}

interface ImageFile {
    location: string;
    name?: string;
}

export const aiFoodScanner = async (imageFile: ImageFile) => {
    console.log("Downloading image from: ", imageFile.location);

    // Step 1: Download the remote image and save to temp file
    const response = await fetch(imageFile.location);
    if (!response.ok) throw new Error("Failed to download image");

    const buffer = await response.arrayBuffer();
    const fileName = imageFile.name || `image-${uuidv4()}.jpg`;
    const filePath = path.join(__dirname, fileName);

    fs.writeFileSync(filePath, Buffer.from(buffer)); // Save locally

    // Step 2: Prepare form-data with fs stream
    const form = new FormData();
    form.append("image", fs.createReadStream(filePath)); // ✅ Send file stream

    // Step 3: Call the external API
    const scanResponse = await fetch("https://gym-update.onrender.com/api/v1/food-scanner", {
        method: "POST",
        headers: form.getHeaders(), // Must include Content-Type with boundary
        body: form,
    });

    const data = await scanResponse.json();

    // Step 4: Cleanup (optional)
    fs.unlinkSync(filePath); // Delete temp file after upload

    return data;
};


export const mealPlanService = {
    createMealPlan,
    getMealPlan,
    updateMealPlan,
    deleteMealPlan,
    getMealPlanById,
    aiMealPlan,
    aiFoodScanner
}
