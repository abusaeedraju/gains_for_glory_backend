import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
import { communityController } from "./community.controller";

const router = Router();

router.get("/", auth(Role.USER), communityController.getCommunityController);
router.get("/request", auth(Role.ADMIN), communityController.getCommunityRequestController);
router.put("/accept-request", auth(Role.ADMIN), communityController.acceptCommunityRequestController);
router.put("/block-request", auth(Role.ADMIN), communityController.blockCommunityRequestController);
router.post("/post-create", auth(Role.USER), communityController.createPostController);
router.get("/posts", auth(Role.USER), communityController.getCommunityPostsController);
router.get("/posts/user", auth(Role.USER), communityController.getCommunityPostByUserIdController);
router.put("/post-edit/:postId", auth(Role.USER), communityController.editPostController);
router.delete("/post-delete/:postId", auth(Role.USER), communityController.deletePostController);

export const communityRoutes = router;