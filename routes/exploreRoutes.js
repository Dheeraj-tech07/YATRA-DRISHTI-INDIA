const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const CATEGORY_MAP = {
    fort: [
        "Fort",
        "Fort & Palace",
        "Fort & Monument",
        "Fort & Wildlife",
        "Fort & Canyon",
        "Fort & Heritage"
    ],

    palace: [
        "Palace",
        "Fort & Palace",
        "Palace & Heritage",
        "Palace & Culture"
    ],

    temple: [
        "Temple",
        "Temple Heritage",
        "Temple & Nature",
        "Temple & Spiritual",
        "Temple & Architecture",
        "Cave & Temple Heritage"
    ],

    monument: [
        "Monument",
        "Fort & Monument"
    ],

    nature: [
        "Nature",
        "Culture & Nature",
        "Nature & Culture",
        "Nature & Wildlife",
        "Nature & Heritage",
        "Wildlife",
        "Wildlife & Nature",
        "Historic & Nature",
        "Historic Nature",
        "Island & Nature",
        "Temple & Nature",
        "Spiritual & Nature",
        "Fort & Wildlife"
    ],

    culture: [
        "Culture",
        "Culture & Nature",
        "Nature & Culture",
        "Culture & Heritage",
        "Cultural Heritage",
        "Tribal Culture",
        "Living Heritage",
        "Sikh Heritage",
        "Spiritual & Cultural",
        "Historic & Cultural",
        "Culture & Island Heritage",
        "Palace & Culture"
    ]
};

router.get("/", async (req, res) => {
    try {
        const state = String(req.query.state || "").trim();
        const category = String(req.query.category || "all")
            .trim()
            .toLowerCase();

        const search = String(req.query.search || "").trim();

        if (!state) {
            return res.status(400).json({
                success: false,
                message: "State required hai."
            });
        }

        /* =====================================
   FOOD CATEGORY — SUPABASE
===================================== */

if (category === "food") {

    const { data: destinations, error: destinationError } =
        await supabase
            .from("destinations")
           .select("id, name, state, lat, lng")
            .eq("state", state)
            .eq("is_active", true);

    if (destinationError) {
        console.error(
            "Food destination error:",
            destinationError
        );

        return res.status(500).json({
            success: false,
            message: "Food destinations fetch nahi ho sake.",
            error: destinationError.message
        });
    }

    const destinationIds =
        (destinations || []).map(function (destination) {
            return destination.id;
        });

    if (!destinationIds.length) {
        return res.json({
            success: true,
            state,
            category,
            count: 0,
            results: []
        });
    }

    const { data: foods, error: foodError } =
        await supabase
            .from("foods")
            .select(`
                id,
                destination_id,
                name,
                food_type,
                description,
                famous_area,
                veg_nonveg,
                price_range,
                image_url,
                tags
            `)
            .in("destination_id", destinationIds)
            .eq("is_active", true)
            .order("name", { ascending: true })
            .limit(100);

    if (foodError) {
        console.error(
            "Food Supabase error:",
            foodError
        );

        return res.status(500).json({
            success: false,
            message: "Food data fetch nahi ho saka.",
            error: foodError.message
        });
    }

    const destinationMap = {};

    (destinations || []).forEach(function (destination) {
        destinationMap[destination.id] = destination;
    });

    const results =
        (foods || []).map(function (food) {

            const destination =
                destinationMap[food.destination_id] || {};

          return {
    id: food.id,
    name: food.name,
    category: "Food",
    state: destination.state || state,
    location:
        food.famous_area ||
        destination.name ||
        state,
    description: food.description || "",
    image_url: food.image_url || "",
    food_type: food.food_type || "",
    veg_nonveg: food.veg_nonveg || "",
    price_range: food.price_range || "",
    tags: food.tags || [],
    lat: destination.lat ?? null,
    lng: destination.lng ?? null
};

        });

    return res.json({
        success: true,
        state,
        category,
        count: results.length,
        results
    });
}
        let query = supabase
            .from("heritage")
            .select(`
                id,
                name,
                location,
                state,
                description,
                category,
                lat,
                lng,
                image_url,
                created_at
            `)
            .eq("state", state);

        /*
         * Category filtering
         */
        if (category !== "all") {
            const categories = CATEGORY_MAP[category];

            if (!categories) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Explore category."
                });
            }

            query = query.in("category", categories);
        }

        /*
         * Search filtering
         */
        if (search) {
            query = query.or(
                `name.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`
            );
        }

        const { data, error } = await query
            .order("name", { ascending: true })
            .limit(100);

        if (error) {
            console.error("Explore Supabase error:", error);

            return res.status(500).json({
                success: false,
                message: "Explore data fetch nahi ho saka.",
                error: error.message
            });
        }

        return res.json({
            success: true,
            state,
            category,
            count: data.length,
            results: data
        });

    } catch (error) {
        console.error("Explore API error:", error);

        return res.status(500).json({
            success: false,
            message: "Explore API error.",
            error: error.message
        });
    }
});

module.exports = router;