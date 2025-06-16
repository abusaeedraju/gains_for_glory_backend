import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { prisma } from "../../../utils/prisma";

const submitToAi = catchAsync(async (req: any, res: any) => {
    const { message, conversationId } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    const aiRes = await fetch("http://10.0.10.37:8000/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: message })
    });
    const data = await aiRes.json();
    const aiReply = data.reply;
    if (aiRes.status !== 200 || !aiReply) {
        return res.status(500).json({ error: data.error || "AI API error" });
    }

    let convoId = conversationId;
    if (!convoId) {
        const newConvo = await prisma.conversation.create({ data: { userId: req.user.id } });
        convoId = newConvo.id;
    }

    await prisma.message.createMany({
        data: [
            { conversationId: convoId, sender: "user", content: message },
            { conversationId: convoId, sender: "ai", content: aiReply }
        ]
    });

    res.json({ reply: aiReply, conversationId: convoId });
});

export const aiController = {
    submitToAi
}