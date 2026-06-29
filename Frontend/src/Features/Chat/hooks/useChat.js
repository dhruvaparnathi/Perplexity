import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessage, getChats, getChatMessages, deleteChat } from "../services/chat.api";
import { useDispatch } from "react-redux";
import { setIsLoading, setError, setCurrentChatId, addNewMessage, addNewChat, setChats, addMessagesToChat } from "../chat.slice";


export const useChat = () => {
    const dispatch = useDispatch();

    async function handleSendMessage({question, chatId}){
        try {

            dispatch(setIsLoading(true));
            const data = await sendMessage(question, chatId);
            const { chat, aiMessage } = data;
            if (!chatId) {
                dispatch(addNewChat({ chatId: chat._id, title: chat.title }));
                dispatch(setCurrentChatId(chat._id));
            }
            dispatch(addNewMessage({chatId: chat._id, content: question, role: 'user'}));
            dispatch(addNewMessage({ chatId: chat._id, content: aiMessage.content, role: aiMessage.role }));

        } catch (error) {
            dispatch(setError(error.message));
        } finally{
            dispatch(setIsLoading(false));
        }
    }

    async function handleFetchChats(){
        try {

            dispatch(setIsLoading(true));
            const data = await getChats();
            const { chats } = data;
            dispatch(setChats(chats.reduce((acc, chat) => {
                acc[chat._id] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt
                }
                return acc;
            }, {})));

        } catch (error) {
            dispatch(setError(error.message));
        } finally{
            dispatch(setIsLoading(false));
        }
    }

    async function handleOpenChat(chatId){
        try{

            const data = await getMessages(chatId);
            const { messages } = data;

            const formattedMessages = messages.map( msg => ({
                content:msg.content,
                role:msg.role
            }));

            dispatch(addMessagesToChat({chatId, messages: formattedMessages }));
            dispatch(setCurrentChatId(chatId));

        }catch(error){
            dispatch(setError(error.message));
        }finally{
            dispatch(setIsLoading(false));
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleFetchChats,
        handleOpenChat,
    }
}