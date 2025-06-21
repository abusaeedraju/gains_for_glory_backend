import { Router } from "express";
import { likeController } from "./like.controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";

const router = Router();

router.post("/like/:postId", auth(Role.USER), likeController.createLikeController);

export const likeRoutes = router