import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
import { communityController } from "./community.controller";

const router = Router();

router.get("/", auth(Role.USER), communityController.getCommunityController);
router.get("/bible-request", auth(Role.ADMIN), communityController.getBibleCommunityRequestController);
router.get("/workout-request", auth(Role.ADMIN), communityController.getWorkoutCommunityRequestController);
router.get("/finance-request", auth(Role.ADMIN), communityController.getFinanceCommunityRequestController);
router.put("/accept/bible-request", auth(Role.ADMIN), communityController.acceptBibleCommunityRequestController);
router.put("/accept/workout-request", auth(Role.ADMIN), communityController.acceptWorkoutCommunityRequestController);
router.put("/accept/finance-request", auth(Role.ADMIN), communityController.acceptFinanceCommunityRequestController);
router.post("/post-create", auth(Role.USER), communityController.createPostController);

export const communityRoutes = router;