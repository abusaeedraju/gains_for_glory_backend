import express from "express";
import { bibleController } from "./bible.controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/create", auth(Role.ADMIN), bibleController.createBible);
router.get("/get", auth(), bibleController.getBible);

export const bibleRoutes = router   