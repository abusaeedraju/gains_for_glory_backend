import { Router } from "express"
import { userRoutes } from "../modules/user/user.routes"
import { authRoutes } from "../modules/auth/auth.routes"
import { aiRoutes } from "../modules/ai/ai.route"
import { productRoutes } from "../modules/product/product.route"
import { reviewRoutes } from "../modules/review/review.routes"
import { cartRoutes } from "../modules/cart/cart.route"

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
    },
    {
        path:"/product",
        component: productRoutes
    },
    {
        path:"/review",
        component:reviewRoutes
    },
    {
        path:"/cart",
        component:cartRoutes
    }
]

routes.forEach(route => router.use(route.path, route.component))
export default router 