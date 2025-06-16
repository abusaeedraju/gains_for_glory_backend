import { Router } from "express"
import { userRoutes } from "../modules/user/user.routes"
import { authRoutes } from "../modules/auth/auth.routes"
import { aiRoutes } from "../modules/ai/ai.route"

const router = Router()
const routes = [
    {
        path: "/user",
        component: userRoutes
    },
    {
        path: "/auth",
        component: authRoutes
    },
    {
        path: "/ai",
        component: aiRoutes
    }
]

routes.forEach(route => router.use(route.path, route.component))
export default router 