import { Router } from "express"
import { userRoutes } from "../modules/user/user.routes"
import { authRoutes } from "../modules/auth/auth.routes"
import { productRoutes } from "../modules/product/product.route"
import { reviewRoutes } from "../modules/review/review.routes"
import { cartRoutes } from "../modules/cart/cart.route"
import { communityRoutes } from "../modules/community/community.route"
import { likeRoutes } from "../modules/like/like.routes"
import { commentRoutes } from "../modules/comment/comment.routes"
import { mealPlanRoutes } from "../modules/mealPlan/meal.route"
import { chatRouters } from "../modules/chat/chat.Routes"
import { paymentRoutes } from "../modules/payment/payment.routes"
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
        path: "/product",
        component: productRoutes
    },
    {
        path: "/review",
        component: reviewRoutes
    },
    {
        path: "/cart",
        component: cartRoutes
    },
    {
        path: "/community",
        component: communityRoutes
    },
    {
        path: "/comment",
        component: commentRoutes
    },
    {
        path: "/like",
        component: likeRoutes
    },
    {
        path: "/mealPlan",
        component: mealPlanRoutes
    },
    {
        path: "/chat",
        component: chatRouters
    },
    {
        path: "/payment",
        component: paymentRoutes
    }
]

routes.forEach(route => router.use(route.path, route.component))
export default router 