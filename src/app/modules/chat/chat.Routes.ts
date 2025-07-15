import { Router } from "express";
import { ChatControllers } from "./chat.Controller";
import auth from "../../middleware/auth";

const router = Router();
router.post("/sendMessage/:groupChatId", auth(), ChatControllers.sendMessageController);
router.get("/getGroupMessages/:groupChatId", auth(), ChatControllers.getGroupMessagesController);
router.put("/chatWithAI", auth(), ChatControllers.chatWithAIController);
router.get("/getMyChatGroup", auth(), ChatControllers.getMyChatGroupController);

export const chatRouters = router;
    