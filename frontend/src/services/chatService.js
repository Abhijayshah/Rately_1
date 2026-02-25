import api from './api';

/**
 * Chat Service - Handles chatbot API communication
 */
export const chatService = {
    /**
     * Send a message to the chatbot
     * @param {string} message - User's message
     * @param {Array} conversationHistory - Previous conversation messages
     * @returns {Promise} - API response with AI message
     */
    sendMessage: async (message, conversationHistory = []) => {
        try {
            const response = await api.post('/chat/message', {
                message,
                conversationHistory
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default chatService;
