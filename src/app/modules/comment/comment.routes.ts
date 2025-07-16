import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
import{commentController} from "./comment.controller"

const router = Router();

router.post("/create/:postId", auth(), commentController.createCommentController);
router.put("/edit/:commentId", auth(), commentController.editCommentController);
router.delete("/delete/:commentId", auth(), commentController.deleteCommentController);
router.get("/all/:postId", auth(), commentController.getCommentByPostIdController);

export const commentRoutes = router;