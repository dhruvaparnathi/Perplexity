import { generateResponse, chatTitleGenerator } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const { question, chat: chatId } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({ error: "Question or message is required" });
        }

        
        let title = null, chat = null;
        if (!chatId) {
            title = await chatTitleGenerator(question);
            chat = await chatModel.create({ user: req.user._id, title });
        }
        
        const userMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: question,
            role: "user",
        });

        const messages = await messageModel.find({
            chat: chatId || chat._id,
        });
        
        const response = await generateResponse(messages);

        const aiMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: response,
            role: "ai",
        });
        

        return res.status(200).json({
            success: true,
            chat,
            messages: [userMessage, aiMessage],
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getChats = async(req,res) => {

    const chats = await chatModel.find({ user: req.user._id });

    if(!chats) {
        return res.status(404).json({ error: "No chats found" });
    }

    return res.status(200).json({
        success: true,
        chats,
    });
    
}

export const getChatMessages = async(req,res) => {

    const { chatId } = req.params;
    const chat = await chatModel.findById(chatId);

    if(!chat) {
        return res.status(404).json({ error: "Chat not found" });
    }

    const messages = await messageModel.find({ chat: chatId });

    if(!messages) {
        return res.status(404).json({ error: "No messages found" });
    }

    return res.status(200).json({
        success: true,
        messages,
    });
}


export const deleteChat = async(req,res) => {

    const { chatId } = req.params;
    const chat = await chatModel.findById(chatId);

    if(!chat) {
        return res.status(404).json({ error: "Chat not found" });
    }

    await chatModel.findByIdAndDelete(chatId);

    await messageModel.deleteMany({ chat: chatId });
    
    return res.status(200).json({
        success: true,
        message: "Chat deleted successfully",
    });
}