import { createSlice, current } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
    },
    reducers:{
        setChats(state,action){
            state.chats = action.payload;
        },
        setCurrentChatId(state,action){
            state.currentChatId = action.payload;
        },
        setIsLoading(state,action){
            state.isLoading = action.payload;
        },
        setError(state,action){
            state.error = action.payload;
        },
        addNewMessage(state,action){
            const {chatId, title} = action.payload;
            state.chats[chatId] = {
                _id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString()
            }
        },
        addNewChat(state,action){
            const {chatId , content, role} = action.payload;
            state.chats[chatId].messages.push({content, role});
        },
        addMessagesToChat(state,action){
            const {chatId , messages} = action.payload;
            state.chats[chatId].messages.push(...messages);
            state.chats[chatId].lastUpdated = new Date().toISOString();
        }
    }
})

export const {setChats, setCurrentChatId, setIsLoading, setError, addNewMessage, addNewChat, addMessagesToChat} = chatSlice.actions;
export default chatSlice.reducer;