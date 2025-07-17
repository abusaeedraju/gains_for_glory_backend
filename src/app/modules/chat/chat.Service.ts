import { PrismaClient } from "@prisma/client";
import ApiError from "../../error/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { Request } from "express";
// import httpStatus from "http-status";
// import ApiError from "../../errors/ApiError";
// import { userFilter } from "../../utils/searchFilter";
// import { Request } from "express";
// import { IPaginationOptions } from "../../interface/pagination.type";
// import { paginationHelper } from "../../../helpers/paginationHelper";
// import { fileUploader } from "../../helpers/fileUploader";

const prisma = new PrismaClient();
export const createGroup = async (defaultUserIds: string[]) => {
  const defaultGroups = [
    'Bible Study Chat',
    'Workout Study Chat',
    'Finance Study Chat',
  ];

  for (const name of defaultGroups) {
    const existing = await prisma.groupChat.findFirst({
      where: { name },
    });

    if (!existing) {
      await prisma.groupChat.create({
        data: {
          name,
          members: {
            create: defaultUserIds.map((userId) => ({
              user: { connect: { id: userId } },
            })),
          },
        },
      });
    }
  }
};

export const sendMessage = async (
  senderId: string,
  groupChatId: string,
  content: string
) => {
  const groupChat = await prisma.groupChat.findUnique({
    where: { id: groupChatId },
  });
  if (!groupChat) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid group chat id');
  } 
  
  const message = await prisma.message.create({
    data: {
      senderId,
      groupChatId,
      content,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return message;
};

export const getGroupMessages = async (groupChatId: string) => {
  const groupChat = await prisma.groupChat.findFirst({
    where: { id: groupChatId },
  });
  if (!groupChat) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid group chat id');
  }
  const messages = await prisma.message.findMany({
    where: { groupChatId },
    orderBy: { createdAt: 'asc' },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return messages;

};

const getMyChatGroup = async (userId: string, communityName: string) => {
  if(communityName !== "Finance Study Chat" && communityName !== "Workout Study Chat" && communityName !== "Bible Study Chat") {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid community name');
  }
  const groupChats = await prisma.groupChat.findMany({
    where: {
      name: communityName,
      members: {
        some: {
          userId,
        },
      },
    },
  });
  return groupChats;
};


const chatWithAI = async (payload: any, id: string) => {

  const response = await fetch("https://gym-update.onrender.com/api/v1/coach", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // 👈 Required for JSON payload
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  return data;
};

export const chatServices = {
   // createConversationIntoDB,
  // getConversationsByUserIdIntoDB,
  // getMessagesByConversationIntoDB,
  // createMessageIntoDB,
  // getChatUsersForUser,
  // deleteConversation,
  // countUnreadMessages,
  // markMessagesAsRead,
  // getMyChat,
  // searchUser, 
  chatWithAI,
  createGroup,
  sendMessage,
  getGroupMessages,
  getMyChatGroup,
  // createConversation,
  // sendMessage,
  // getMessages,
  // getUserConversations,
  // generateFile,
};
