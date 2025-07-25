import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
import { paymentController } from "./payment.controller";

const route = Router()

route.post('/create', auth(Role.USER), paymentController.createPaymentController)
route.post('/donation', auth(Role.USER), paymentController.createDonationController)
route.get('/donation', auth(Role.USER), paymentController.getDonationController)
// route.post('/save-card', auth(Role.USER), paymentController.saveCardController)
// route.get('/get-card', auth(Role.USER), paymentController.getSaveCardController)
// route.delete('/delete-card', auth(Role.USER), paymentController.deleteCardController)
route.post("/subscribe", auth(Role.USER), paymentController.subscribeToPlanController)

export const paymentRoutes = route