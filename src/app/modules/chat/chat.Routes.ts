import { Router } from "express";
import { ChatControllers } from "./chat.Controller";
import auth from "../../middleware/auth";

const router = Router();
router.put("/joinGroup", auth(), ChatControllers.joinGroupController);
router.post("/sendMessage", auth(), ChatControllers.sendMessageController);
router.get("/getGroupMessages", auth(), ChatControllers.getGroupMessagesController);
router.get("/getUserGroups", auth(), ChatControllers.getUserGroupsController);
router.put("/chatWithAI", auth(), ChatControllers.chatWithAIController);

export const chatRouters = router;
