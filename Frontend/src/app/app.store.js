import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/Auth/auth.slice";
import chatReducer from "../Features/Chat/chat.slice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer
    }
});

export default store;