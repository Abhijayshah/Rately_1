const axios = require('axios');

// OpenRouter configuration
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.AI_MODEL || 'google/gemini-2.0-flash-exp:free';

// System context for the chatbot
const SYSTEM_CONTEXT = `You are a helpful AI assistant for Rately, a store rating and review platform. 

About Rately:
- Users can discover and rate local stores
- Store owners can manage their store profiles and view ratings
- System admins can manage users and stores
- Users can submit ratings (1-5 stars) and reviews
- The platform helps local businesses grow through customer feedback

Your role:
- Help users navigate the platform
- Answer questions about how to rate stores, view ratings, or manage their account
- Provide information about Rately features
- Be friendly, concise, and helpful
- If asked about technical issues, suggest contacting support

Keep responses brief and conversational.`;

/**
 * @desc    Send message to chatbot and get AI response via OpenRouter
 * @route   POST /api/chat/message
 * @access  Private (authenticated users only)
 */
const sendMessage = async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // Check if API key is configured
        if (!API_KEY) {
            return res.status(500).json({
                success: false,
                message: 'Chatbot is not configured properly. Missing OpenRouter API Key.'
            });
        }

        // Build messages array for OpenRouter (OpenAI format)
        const messages = [
            { role: 'system', content: SYSTEM_CONTEXT },
            ...conversationHistory.slice(-10).map(msg => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
            })),
            { role: 'user', content: message }
        ];

        // Make request to OpenRouter
        const response = await axios.post(
            OPENROUTER_URL,
            {
                model: MODEL,
                messages: messages,
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'HTTP-Referer': 'http://localhost:3000', // Optional, for OpenRouter rankings
                    'X-Title': 'Rately Store Rating System', // Optional
                    'Content-Type': 'application/json'
                }
            }
        );

        const aiMessage = response.data.choices[0].message.content;

        res.json({
            success: true,
            message: aiMessage,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Chatbot error (OpenRouter):', error.response?.data || error.message);

        let errorMessage = 'Failed to get response from chatbot. Please try again.';

        if (error.response?.status === 401) {
            errorMessage = 'Invalid API key. Please check your OpenRouter configuration.';
        } else if (error.response?.data?.error?.message) {
            errorMessage = error.response.data.error.message;
        }

        res.status(500).json({
            success: false,
            message: errorMessage
        });
    }
};

module.exports = {
    sendMessage
};
