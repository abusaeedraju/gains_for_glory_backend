import { Router } from "express";
import { ChatControllers } from "./chat.Controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/createConversation", auth(), ChatControllers.createConversation);
// router.get("/getConversationByUserId", auth(), ChatControllers.getConversationByUserId);
// router.get("/getMessagesByConversation", auth(), ChatControllers.getMessagesByConversation);
// router.get("/getSingleMassageConversation", auth(), ChatControllers.getSingleMassageConversation);
router.put("/chatWithAI", auth(), ChatControllers.chatWithAIController);
// router.post(
//   "/generateFile",
//   auth(),
//   fileUploader.uploadFile,
//   ChatControllers.generateFile
// );

export const chatRouters = router;
