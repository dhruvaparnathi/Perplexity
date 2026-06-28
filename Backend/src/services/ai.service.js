import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";

const llm = new ChatMistralAI({
    model: "mistral-large-latest",
    apiKey: process.env.MISTRAL_API_KEY,
});

const geminiAI = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
});



export const generateResponse = async (messages) => {
    try {
        const response = await llm.invoke(messages.map(msg => {
            if (msg.role === "user") {
                return new HumanMessage(msg.content);
            } else {
                return new AIMessage(msg.content);
            }
        }));
        return response.text;
    } catch (error) {
        console.error("Error generating response:", error);
        throw error;
    }
}

export const chatTitleGenerator = async (message) => {
    try {
        const response = await geminiAI.invoke([
            new SystemMessage(
                `You are a helpful assistant that generates concise and descriptive titles for given chat conversations.
                - The title should be a short phrase or sentence (maximum 5 words) that captures the main topic of the conversation.
                - The title should be in English, regardless of the language used in the conversation.
                - The title should be engaging and relevant to the content of the conversation.
                - The title should not contain any special characters, emojis, or punctuation marks unless they are essential for clarity.
                - The title should be in sentence case format.
                - You should generate only one title for each conversation.
            `
            ),
            new HumanMessage(`
                Generate title for the following chat conversation:
                ${message}
                `)
        ]);
        console.log("chat Title: ", response.text);
        return response.text;
    } catch (error) {
        console.error("Error generating chat title:", error);
        throw error;
    }
}