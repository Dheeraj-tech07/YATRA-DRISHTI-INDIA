const { generateAIResponse } = require("../services/ai/aiService");
const { searchHeritage } = require("../services/ai/aiTools");

async function testHeritageSearch(req, res) {
    try {
        const results = await searchHeritage(req.body || {});

        return res.json({
            success: true,
            count: results.length,
            results
        });

    } catch (error) {
        console.error("Heritage tool test error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function chatWithAI(req, res) {
    try {
        const { message } = req.body || {};

        if (!message || !String(message).trim()) {
            return res.status(400).json({
                message: "AI ko bhejne ke liye message required hai."
            });
        }

        const reply = await generateAIResponse(
            String(message).trim()
        );

        return res.json({
            success: true,
            reply
        });

    } catch (error) {
        console.error("AI chat error:", error);

        return res.status(500).json({
            success: false,
            message: "AI response generate nahi ho saka.",
            error: error.message
        });
    }
}

module.exports = {
    chatWithAI,
    testHeritageSearch
};