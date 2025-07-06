import { Router } from "express";
import { addressController } from "./address.controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
const router = Router();

router.post("/create", auth(Role.USER,Role.TECHNICIAN),addressController.createAddressController)

export const addressRoutes = router 