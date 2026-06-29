import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:3000/api/chats",
    withCredentials: true,
});

export const sendMessage = async (question, chatId) => {
    const response = await api.post("/send", { question, chat: chatId });
    return response.data;
}

export const getChats = async () => {
    const response = await api.get("/get-chats");
    return response.data;
}

export const getChatMessages = async (chatId) => {
    const response = await api.get(`/get-chat-messages/${chatId}`);
    return response.data;
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/delete-chat/${chatId}`);
    return response.data;
}