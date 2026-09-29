const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("heritage")
            .select("*")
            .order("name", { ascending: true });

        if (error) {
            throw error;
        }

        res.json(data);
    } catch (error) {
        console.error("Heritage load error:", error);

        res.status(500).json({
            message: "Heritage data load nahi ho saka.",
            error: error.message
        });
    }
});


router.get("/search", async (req, res) => {
    const query = String(req.query.q || "").trim();

    if (!query) {
        return res.json([]);
    }

    try {
        const searchTerm = `%${query}%`;

        const { data, error } = await supabase
            .from("heritage")
            .select("*")
            .or(
                `name.ilike.${searchTerm},location.ilike.${searchTerm},state.ilike.${searchTerm},category.ilike.${searchTerm}`
            )
            .order("name", { ascending: true })
            .limit(50);

        if (error) {
            throw error;
        }

        res.json(data);
    } catch (error) {
        console.error("Heritage search error:", error);

        res.status(500).json({
            message: "Heritage search fail ho gayi.",
            error: error.message
        });
    }
});


module.exports = router;