const supabase = require("../../config/supabase");

/*
=========================================================
SEARCH HERITAGE
=========================================================

This tool searches the Yatra Drishti heritage database.

It is designed for India-wide searches:

- Place name
- State / UT
- City/place name
- Category
- General keyword

Examples:

searchHeritage({
    search: "Rishikesh"
});

searchHeritage({
    search: "Taj Mahal"
});

searchHeritage({
    state: "Uttar Pradesh"
});

searchHeritage({
    category: "Monument"
});

=========================================================
*/

async function searchHeritage(query = {}) {

    try {

        const {
            search = "",
            state = "",
            city = "",
            category = "",
            limit = 10
        } = query;


        /*
        =====================================================
        CLEAN INPUT
        =====================================================
        */

        const cleanSearch = String(search || "").trim();
        const cleanState = String(state || "").trim();
        const cleanCity = String(city || "").trim();
        const cleanCategory = String(category || "").trim();

        const resultLimit = Math.min(
            Math.max(Number(limit) || 10, 1),
            20
        );


        /*
        =====================================================
        BASE QUERY
        =====================================================
        */

        let dbQuery = supabase
            .from("heritage")
            .select("*")
            .limit(resultLimit);


        /*
        =====================================================
        STATE FILTER
        =====================================================

        Works for all Indian States and UTs.

        Example:
        Uttar Pradesh
        Rajasthan
        Uttarakhand
        Kerala
        Delhi
        Jammu and Kashmir
        etc.
        */

        if (cleanState) {

            dbQuery = dbQuery.ilike(
                "state",
                `%${cleanState}%`
            );
        }


        /*
        =====================================================
        CATEGORY FILTER
        =====================================================
        */

        if (cleanCategory) {

            dbQuery = dbQuery.ilike(
                "category",
                `%${cleanCategory}%`
            );
        }


        /*
        =====================================================
        CITY / PLACE SEARCH
        =====================================================

        IMPORTANT:

        Current database does not reliably expose a
        "city" column.

        Therefore city/place searches use the existing
        "name" field.

        Example:

        Rishikesh
        Agra
        Jaipur
        Varanasi
        etc.
        */

        if (cleanCity) {

            dbQuery = dbQuery.ilike(
                "name",
                `%${cleanCity}%`
            );
        }


        /*
        =====================================================
        GENERAL SEARCH
        =====================================================

        Search across the fields we have already verified
        in the heritage records.

        Example:

        "Taj Mahal"
        "Rishikesh"
        "fort"
        "temple"
        "museum"
        etc.
        */

        if (cleanSearch) {

            dbQuery = dbQuery.or(
                `name.ilike.%${cleanSearch}%,description.ilike.%${cleanSearch}%,location.ilike.%${cleanSearch}%`
            );
        }


        /*
        =====================================================
        EXECUTE QUERY
        =====================================================
        */

        const {
            data,
            error
        } = await dbQuery;


        /*
        =====================================================
        DATABASE ERROR
        =====================================================
        */

        if (error) {

            console.error(
                "Heritage search Supabase error:",
                error
            );

            throw new Error(
                "Heritage database search failed."
            );
        }


        /*
        =====================================================
        RETURN RESULTS
        =====================================================
        */

        return data || [];

    } catch (error) {

        console.error(
            "searchHeritage error:",
            error
        );

        throw error;
    }
}

/*
=========================================================
SEARCH PLACES
=========================================================

Generic India-wide place search.

NOTE:
This is currently a placeholder for the external
Places API integration. Do not invent live places,
ratings, prices, opening hours, or availability.
=========================================================
*/

/* =========================================================
   SEARCH PLACES
   SUPABASE DATABASE-FIRST SEARCH
========================================================= */

async function searchPlaces(query = {}) {

    try {

        const {
            search = "",
            state = "",
            city = "",
            category = "",
            limit = 10
        } = query;

        const cleanSearch =
            String(search || "").trim();

        const cleanState =
            String(state || "").trim();

        const cleanCity =
            String(city || "").trim();

        const cleanCategory =
            String(category || "").trim();

        const resultLimit = Math.min(
            Math.max(Number(limit) || 10, 1),
            20
        );

        let dbQuery = supabase
            .from("places")
            .select("*")
            .eq("is_active", true)
            .limit(resultLimit);

        /* STATE */
        if (cleanState) {

            dbQuery = dbQuery.ilike(
                "state",
                `%${cleanState}%`
            );

        }

        /* CITY */
        if (cleanCity) {

            dbQuery = dbQuery.ilike(
                "city",
                `%${cleanCity}%`
            );

        }

        /* CATEGORY */
        if (cleanCategory) {

            dbQuery = dbQuery.ilike(
                "category",
                `%${cleanCategory}%`
            );

        }

        /* SEARCH */
        if (cleanSearch) {

            dbQuery = dbQuery.or(
                `name.ilike.%${cleanSearch}%,description.ilike.%${cleanSearch}%,city.ilike.%${cleanSearch}%,state.ilike.%${cleanSearch}%`
            );

        }

        const {
            data,
            error
        } = await dbQuery;

        if (error) {

            console.error(
                "Places search Supabase error:",
                error
            );

            throw new Error(
                "Places database search failed."
            );

        }

        return {
            success: true,
            type: "places",
            search: cleanSearch,
            state: cleanState,
            city: cleanCity,
            category: cleanCategory,
            limit: resultLimit,
            results: data || []
        };

    } catch (error) {

        console.error(
            "searchPlaces error:",
            error
        );

        throw error;

    }

}

/* =========================================================
   SEARCH DESTINATIONS
========================================================= */

async function searchDestinations(query = {}) {

    try {

        const {
            search = "",
            state = "",
            destination_type = "",
            limit = 10
        } = query;

        const cleanSearch =
            String(search || "").trim();

        const cleanState =
            String(state || "").trim();

        const cleanType =
            String(destination_type || "").trim();

        const resultLimit = Math.min(
            Math.max(Number(limit) || 10, 1),
            20
        );

        let dbQuery = supabase
            .from("destinations")
            .select("*")
            .eq("is_active", true)
            .limit(resultLimit);

        if (cleanState) {
            dbQuery = dbQuery.ilike(
                "state",
                `%${cleanState}%`
            );
        }

        if (cleanType) {
            dbQuery = dbQuery.ilike(
                "destination_type",
                `%${cleanType}%`
            );
        }

        if (cleanSearch) {
            dbQuery = dbQuery.or(
                `name.ilike.%${cleanSearch}%,description.ilike.%${cleanSearch}%,state.ilike.%${cleanSearch}%`
            );
        }

        const { data, error } = await dbQuery;

        if (error) {
            console.error(
                "Destinations search Supabase error:",
                error
            );

            throw new Error(
                "Destinations database search failed."
            );
        }

        return {
            success: true,
            type: "destinations",
            results: data || []
        };

    } catch (error) {

        console.error(
            "searchDestinations error:",
            error
        );

        throw error;
    }
}


/* =========================================================
   SEARCH NEARBY PLACES
========================================================= */

async function searchNearbyPlaces(query = {}) {

    try {

        const {
            destination_id = "",
            place_name = "",
            category = "",
            limit = 10
        } = query;

        const cleanDestinationId =
            String(destination_id || "").trim();

        const cleanPlaceName =
            String(place_name || "").trim();

        const cleanCategory =
            String(category || "").trim();

        const resultLimit = Math.min(
            Math.max(Number(limit) || 10, 1),
            20
        );

        let dbQuery = supabase
            .from("nearby_places")
            .select("*")
            .eq("is_active", true)
            .limit(resultLimit);

        if (cleanDestinationId) {
            dbQuery = dbQuery.eq(
                "destination_id",
                cleanDestinationId
            );
        }

        if (cleanPlaceName) {
            dbQuery = dbQuery.ilike(
                "place_name",
                `%${cleanPlaceName}%`
            );
        }

        if (cleanCategory) {
            dbQuery = dbQuery.ilike(
                "category",
                `%${cleanCategory}%`
            );
        }

        const { data, error } = await dbQuery;

        if (error) {
            console.error(
                "Nearby places Supabase error:",
                error
            );

            throw new Error(
                "Nearby places database search failed."
            );
        }

        return {
            success: true,
            type: "nearby_places",
            results: data || []
        };

    } catch (error) {

        console.error(
            "searchNearbyPlaces error:",
            error
        );

        throw error;
    }
}


/* =========================================================
   SEARCH FOODS
========================================================= */

async function searchFoods(query = {}) {

    try {

        const {
            destination_id = "",
            search = "",
            food_type = "",
            limit = 10
        } = query;

        const cleanDestinationId =
            String(destination_id || "").trim();

        const cleanSearch =
            String(search || "").trim();

        const cleanFoodType =
            String(food_type || "").trim();

        const resultLimit = Math.min(
            Math.max(Number(limit) || 10, 1),
            20
        );

        let dbQuery = supabase
            .from("foods")
            .select("*")
            .eq("is_active", true)
            .limit(resultLimit);

        if (cleanDestinationId) {
            dbQuery = dbQuery.eq(
                "destination_id",
                cleanDestinationId
            );
        }

        if (cleanFoodType) {
            dbQuery = dbQuery.ilike(
                "food_type",
                `%${cleanFoodType}%`
            );
        }

        if (cleanSearch) {
            dbQuery = dbQuery.or(
                `name.ilike.%${cleanSearch}%,description.ilike.%${cleanSearch}%,famous_area.ilike.%${cleanSearch}%`
            );
        }

        const { data, error } = await dbQuery;

        if (error) {
            console.error(
                "Foods search Supabase error:",
                error
            );

            throw new Error(
                "Foods database search failed."
            );
        }

        return {
            success: true,
            type: "foods",
            results: data || []
        };

    } catch (error) {

        console.error(
            "searchFoods error:",
            error
        );

        throw error;
    }
}


/* =========================================================
   SEARCH THINGS TO DO
========================================================= */

async function searchThingsToDo(query = {}) {

    try {

        const {
            destination_id = "",
            search = "",
            category = "",
            limit = 10
        } = query;

        const cleanDestinationId =
            String(destination_id || "").trim();

        const cleanSearch =
            String(search || "").trim();

        const cleanCategory =
            String(category || "").trim();

        const resultLimit = Math.min(
            Math.max(Number(limit) || 10, 1),
            20
        );

        let dbQuery = supabase
            .from("things_to_do")
            .select("*")
            .eq("is_active", true)
            .limit(resultLimit);

        if (cleanDestinationId) {
            dbQuery = dbQuery.eq(
                "destination_id",
                cleanDestinationId
            );
        }

        if (cleanCategory) {
            dbQuery = dbQuery.ilike(
                "category",
                `%${cleanCategory}%`
            );
        }

        if (cleanSearch) {
            dbQuery = dbQuery.or(
                `name.ilike.%${cleanSearch}%,description.ilike.%${cleanSearch}%`
            );
        }

        const { data, error } = await dbQuery;

        if (error) {
            console.error(
                "Things to do Supabase error:",
                error
            );

            throw new Error(
                "Things to do database search failed."
            );
        }

        return {
            success: true,
            type: "things_to_do",
            results: data || []
        };

    } catch (error) {

        console.error(
            "searchThingsToDo error:",
            error
        );

        throw error;
    }
}


/* =========================================================
   SEARCH STAY AREAS
========================================================= */

async function searchStayAreas(query = {}) {

    try {

        const {
            destination_id = "",
            search = "",
            suitable_for = "",
            limit = 10
        } = query;

        const cleanDestinationId =
            String(destination_id || "").trim();

        const cleanSearch =
            String(search || "").trim();

        const cleanSuitableFor =
            String(suitable_for || "").trim();

        const resultLimit = Math.min(
            Math.max(Number(limit) || 10, 1),
            20
        );

        let dbQuery = supabase
            .from("stay_areas")
            .select("*")
            .eq("is_active", true)
            .limit(resultLimit);

        if (cleanDestinationId) {
            dbQuery = dbQuery.eq(
                "destination_id",
                cleanDestinationId
            );
        }

        if (cleanSuitableFor) {
            dbQuery = dbQuery.ilike(
                "suitable_for",
                `%${cleanSuitableFor}%`
            );
        }

        if (cleanSearch) {
            dbQuery = dbQuery.or(
                `area_name.ilike.%${cleanSearch}%,description.ilike.%${cleanSearch}%`
            );
        }

        const { data, error } = await dbQuery;

        if (error) {
            console.error(
                "Stay areas Supabase error:",
                error
            );

            throw new Error(
                "Stay areas database search failed."
            );
        }

        return {
            success: true,
            type: "stay_areas",
            results: data || []
        };

    } catch (error) {

        console.error(
            "searchStayAreas error:",
            error
        );

        throw error;
    }
}


/* =========================================================
   SEARCH TRANSPORT
========================================================= */

async function searchTransport(query = {}) {

    try {

        const {
            destination_id = "",
            from_location = "",
            to_location = "",
            transport_mode = "",
            limit = 10
        } = query;

        const cleanDestinationId =
            String(destination_id || "").trim();

        const cleanFrom =
            String(from_location || "").trim();

        const cleanTo =
            String(to_location || "").trim();

        const cleanMode =
            String(transport_mode || "").trim();

        const resultLimit = Math.min(
            Math.max(Number(limit) || 10, 1),
            20
        );

        let dbQuery = supabase
            .from("transport_options")
            .select("*")
            .eq("is_active", true)
            .limit(resultLimit);

        if (cleanDestinationId) {
            dbQuery = dbQuery.eq(
                "destination_id",
                cleanDestinationId
            );
        }

        if (cleanFrom) {
            dbQuery = dbQuery.ilike(
                "from_location",
                `%${cleanFrom}%`
            );
        }

        if (cleanTo) {
            dbQuery = dbQuery.ilike(
                "to_location",
                `%${cleanTo}%`
            );
        }

        if (cleanMode) {
            dbQuery = dbQuery.ilike(
                "transport_mode",
                `%${cleanMode}%`
            );
        }

        const { data, error } = await dbQuery;

        if (error) {
            console.error(
                "Transport search Supabase error:",
                error
            );

            throw new Error(
                "Transport database search failed."
            );
        }

        return {
            success: true,
            type: "transport",
            results: data || []
        };

    } catch (error) {

        console.error(
            "searchTransport error:",
            error
        );

        throw error;
    }
}


/* =========================================================
   EXPORT AI TOOLS
========================================================= */

module.exports = {
    searchHeritage,
    searchPlaces,
    searchDestinations,
    searchNearbyPlaces,
    searchFoods,
    searchThingsToDo,
    searchStayAreas,
    searchTransport
};