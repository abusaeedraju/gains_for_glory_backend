import { Router } from "express";
import { subscriptionController } from "./subscription.Controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
const route = Router()

route.post('/create', auth(Role.ADMIN), subscriptionController.createSubscriptionController)
route.put('/update/:id', auth(Role.ADMIN), subscriptionController.updateSubscriptionController)
route.delete('/delete/:id', auth(Role.ADMIN), subscriptionController.deleteSubscriptionController)

route.get('/', subscriptionController.getAllSubscriptionsController)

export const subscriptionRoutes = route   