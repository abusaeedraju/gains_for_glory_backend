import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { prisma } from "../../../utils/prisma";

const submitToAi = catchAsync(async (req: any, res: any) => {
    const message = req.body;
    const conversationId = req.body.conversationId;
    if (!message) return res.status(400).json({ error: "Message required" });

    console.log("Input message: ",JSON.stringify(message));

    
    const aiRes = await fetch("https://gymapp-tukx.onrender.com/api/v1/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: message })
    });
    console.log(aiRes);
    const data = await aiRes.json();
    console.log("ERROR: ",data);
    const aiReply = data.reply;
    //console.log("AI REPLY: ",aiReply);
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