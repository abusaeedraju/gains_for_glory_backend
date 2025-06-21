import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
import{commentController} from "./comment.controller"

const router = Router();

router.post("/comment-create/:postId", auth(Role.USER), commentController.createCommentController);
router.put("/comment-edit/:commentId", auth(Role.USER), commentController.editCommentController);
router.delete("/comment-delete/:commentId", auth(Role.USER), commentController.deleteCommentController);

export const commentRoutes = router;