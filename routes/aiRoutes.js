const express = require("express");

const router = express.Router();

const {
    generateAIResponse,
    generateAIPlan
} = require("../services/ai/aiService");

/* =========================================================
   POST /api/ai/chat
========================================================= */

router.post("/chat", async (req, res) => {

    try {

        const { message, history = [] } = req.body;

        /* -------------------------------------------------
           VALIDATION
        ------------------------------------------------- */

        if (
            !message ||
            typeof message !== "string" ||
            !message.trim()
        ) {

            return res.status(400).json({
                success: false,
                message: "AI message required hai."
            });

        }


        /* -------------------------------------------------
           AI RESPONSE
        ------------------------------------------------- */

       const safeHistory = Array.isArray(history)
    ? history.slice(-10)
    : [];

const reply = await generateAIResponse(
    message.trim(),
    safeHistory
);
        /* -------------------------------------------------
           SUCCESS
        ------------------------------------------------- */

        return res.json({
            success: true,
            reply
        });


    } catch (error) {

        console.error(
            "AI chat error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "AI response generate nahi ho saka.",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined
        });

    }

});

/* =========================================================
   POST /api/ai/plan
========================================================= */

router.post("/plan", async (req, res) => {

    try {

        const {
            state,
            duration,
            budget,
            travelMode,
            query,
            interests,
            localHeritagePlaces
        } = req.body;


        /* -------------------------------------------------
           VALIDATION
        ------------------------------------------------- */

        if (
            !state ||
            typeof state !== "string"
        ) {

            return res.status(400).json({
                success: false,
                message: "State required hai."
            });

        }


        const tripDuration =
            Number(duration) || 1;

        const tripBudget =
            Number(budget) || 5000;


        /* -------------------------------------------------
           AI PLAN
        ------------------------------------------------- */

        const plan =
            await generateAIPlan({

                state:
                    state.trim(),

                duration:
                    tripDuration,

                budget:
                    tripBudget,

                travelMode:
                    travelMode || "Car",

                query:
                    typeof query === "string"
                        ? query.trim()
                        : "",

                interests:
                    Array.isArray(interests)
                        ? interests
                        : [],

                localHeritagePlaces:
                    Array.isArray(localHeritagePlaces)
                        ? localHeritagePlaces
                        : []

            });


        /* -------------------------------------------------
           SUCCESS
        ------------------------------------------------- */

        return res.json({

            success: true,

            ...plan

        });


    } catch (error) {

        console.error(
            "AI plan error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "AI travel plan generate nahi ho saka.",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined

        });

    }

});

module.exports = router;