import { Request, Response } from 'express';
import { chatServices } from './chat.Service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../middleware/sendResponse';
import { StatusCodes } from 'http-status-codes';

const sendMessageController = catchAsync(async (req: Request, res: Response) => {
    const senderId = req.user.id;
    const groupChatId = req.params.groupChatId;
    const content = req.body.content;
    const result = await chatServices.sendMessage(senderId, groupChatId, content);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Message sent successfully',
        data: result,
    });
});

const getGroupMessagesController = catchAsync(async (req: Request, res: Response) => {
    const { groupChatId } = req.params;
    const userId = req.user.id;
    const limit = req.query.limit;
    const result = await chatServices.getGroupMessages(groupChatId as string, limit as any || 50);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Group messages retrieved successfully',
        data: result,
    });
});

const getMyChatGroupController = catchAsync(async (req: Request, res: Response) => {
  const { communityName } = req.query;
  const result = await chatServices.getMyChatGroup(req.user.id, communityName as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Group messages retrieved successfully',
    data: result,
  });
});

const chatWithAIController = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as any;
  const { id } = req.user;
  const result = await chatServices.chatWithAI(payload, id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Chat with AI successfully",
    data: result,
  });
});

export const ChatControllers = {
  //createConversation,
  // sendMessage,
  // getMessages,
  // getUserConversations,
  // deleteConversion,
  // getMyChat,
  // searchUser, 
  chatWithAIController,
  sendMessageController,
  getGroupMessagesController,
  getMyChatGroupController,
  // generateFile,
};
