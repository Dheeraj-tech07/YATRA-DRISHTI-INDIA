const { GoogleGenAI } = require("@google/genai");

const {
    searchHeritage,
    searchPlaces,
    searchDestinations,
    searchNearbyPlaces,
    searchFoods,
    searchThingsToDo,
    searchStayAreas,
    searchTransport
} = require("./aiTools");

let gemini = null;

if (process.env.GEMINI_API_KEY) {
    gemini = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });
}

/* =========================================================
   GEMINI MODELS
========================================================= */

const GEMINI_MODELS = [
    "gemini-3.8-flash"
];

/* =========================================================
   HERITAGE TOOL
========================================================= */

const heritageTool = {
    functionDeclarations: [
        {
            name: "search_heritage",

          description:
    "Search Indian heritage places from the Yatra Drishti heritage database. Use this when the user asks about a specific heritage place, monument, fort, temple, museum, historical place, or heritage destination. IMPORTANT: The search argument must contain ONLY the place name or short search keyword, NOT the user's full question. For example, for 'Taj Mahal kisne banwaya tha aur kab?', use search='Taj Mahal'. For 'Rajasthan ke famous forts batao', use state='Rajasthan' and category='Fort' or a relevant short keyword.",

            parameters: {
                type: "OBJECT",

                properties: {
                    search: {
                        type: "STRING",
                        description:
    "ONLY the heritage place name or a short keyword. Never put the complete user question here. Example: 'Taj Mahal', 'Rishikesh', 'Amber Fort', 'temple'."
                    },

                    state: {
                        type: "STRING",
                        description:
                            "Indian state or union territory."
                    },

                    city: {
                        type: "STRING",
                        description:
                            "Indian city or destination."
                    },

                    category: {
                        type: "STRING",
                        description:
                            "Heritage category such as Monument, Fort, Temple, Museum, etc."
                    },

                    limit: {
                        type: "INTEGER",
                        description:
                            "Maximum number of results. Normally use 5 to 10."
                    }
                }
            }
        }
    ]
};

/* =========================================================
   PLACES TOOL
========================================================= */

const placesTool = {
    functionDeclarations: [
        {
            name: "search_places",

            description:
                "Search general travel places across India. Use this when the user asks for tourist places, sightseeing places, destinations, attractions, or places to visit that are not necessarily heritage places.",

            parameters: {
                type: "OBJECT",

                properties: {
                    search: {
                        type: "STRING",
                        description:
                            "Place name, attraction, destination, or keyword."
                    },

                    state: {
                        type: "STRING",
                        description:
                            "Indian state or union territory."
                    },

                    city: {
                        type: "STRING",
                        description:
                            "Indian city or destination."
                    },

                    category: {
                        type: "STRING",
                        description:
                            "Travel category such as sightseeing, nature, waterfall, beach, hill station, market, etc."
                    },

                    limit: {
                        type: "INTEGER",
                        description:
                            "Maximum number of results. Normally use 5 to 10."
                    }
                }
            }
        }
    ]
};

/* =========================================================
   TRAVEL KNOWLEDGE TOOLS
========================================================= */

const destinationsTool = {
    functionDeclarations: [
        {
            name: "search_destinations",
            description:
                "Search India-wide travel destinations from the Yatra Drishti database. Use this for famous destinations, cities, hill stations, beaches, valleys, tourist regions, or destinations in a specific Indian state.",
            parameters: {
                type: "OBJECT",
                properties: {
                    search: {
                        type: "STRING",
                        description:
                            "Destination name or short travel keyword."
                    },
                    state: {
                        type: "STRING",
                        description:
                            "Indian state or union territory."
                    },
                    destination_type: {
                        type: "STRING",
                        description:
                            "Destination type such as hill station, valley, beach, city, heritage village, lake, etc."
                    },
                    limit: {
                        type: "INTEGER",
                        description:
                            "Maximum number of results. Normally use 5 to 10."
                    }
                }
            }
        }
    ]
};


const nearbyPlacesTool = {
    functionDeclarations: [
        {
            name: "search_nearby_places",
            description:
                "Search famous nearby places around a Yatra Drishti destination.",
            parameters: {
                type: "OBJECT",
                properties: {
                    destination_id: {
                        type: "STRING",
                        description:
                            "Destination database ID when known."
                    },
                    place_name: {
                        type: "STRING",
                        description:
                            "Nearby place name or keyword."
                    },
                    category: {
                        type: "STRING",
                        description:
                            "Nearby place category."
                    },
                    limit: {
                        type: "INTEGER",
                        description:
                            "Maximum number of results."
                    }
                }
            }
        }
    ]
};


const foodsTool = {
    functionDeclarations: [
        {
            name: "search_foods",
            description:
                "Search local and famous foods for an Indian destination.",
            parameters: {
                type: "OBJECT",
                properties: {
                    destination_id: {
                        type: "STRING",
                        description:
                            "Destination database ID when known."
                    },
                    search: {
                        type: "STRING",
                        description:
                            "Food name or food keyword."
                    },
                    food_type: {
                        type: "STRING",
                        description:
                            "Food type such as local, street food, traditional, Tibetan, vegetarian, etc."
                    },
                    limit: {
                        type: "INTEGER",
                        description:
                            "Maximum number of results."
                    }
                }
            }
        }
    ]
};


const thingsToDoTool = {
    functionDeclarations: [
        {
            name: "search_things_to_do",
            description:
                "Search activities and things to do at an Indian destination.",
            parameters: {
                type: "OBJECT",
                properties: {
                    destination_id: {
                        type: "STRING",
                        description:
                            "Destination database ID when known."
                    },
                    search: {
                        type: "STRING",
                        description:
                            "Activity or experience keyword."
                    },
                    category: {
                        type: "STRING",
                        description:
                            "Activity category such as trekking, sightseeing, adventure, culture, nature, etc."
                    },
                    limit: {
                        type: "INTEGER",
                        description:
                            "Maximum number of results."
                    }
                }
            }
        }
    ]
};


const stayAreasTool = {
    functionDeclarations: [
        {
            name: "search_stay_areas",
            description:
                "Search recommended stay areas for an Indian destination. This returns area-level stay guidance, not live hotel availability.",
            parameters: {
                type: "OBJECT",
                properties: {
                    destination_id: {
                        type: "STRING",
                        description:
                            "Destination database ID when known."
                    },
                    search: {
                        type: "STRING",
                        description:
                            "Area name or stay keyword."
                    },
                    suitable_for: {
                        type: "STRING",
                        description:
                            "Suitable traveler type such as family, couple, backpacker, budget, luxury, etc."
                    },
                    limit: {
                        type: "INTEGER",
                        description:
                            "Maximum number of results."
                    }
                }
            }
        }
    ]
};


const transportTool = {
    functionDeclarations: [
        {
            name: "search_transport",
            description:
                "Search transport options and routes between Indian locations from the Yatra Drishti database. Durations and prices are approximate, not live schedules or fares.",
            parameters: {
                type: "OBJECT",
                properties: {
                    destination_id: {
                        type: "STRING",
                        description:
                            "Destination database ID when known."
                    },
                    from_location: {
                        type: "STRING",
                        description:
                            "Starting location."
                    },
                    to_location: {
                        type: "STRING",
                        description:
                            "Destination location."
                    },
                    transport_mode: {
                        type: "STRING",
                        description:
                            "Transport mode such as bus, train, flight, taxi, or road."
                    },
                    limit: {
                        type: "INTEGER",
                        description:
                            "Maximum number of results."
                    }
                }
            }
        }
    ]
};
/* =========================================================
   SYSTEM INSTRUCTION
========================================================= */

const systemInstruction = `
You are Yatra Drishti AI, an intelligent India Travel and Heritage Assistant.

You help users with:

- Indian heritage
- Indian history
- monuments
- forts
- temples
- museums
- architecture
- culture and traditions
- Indian states and cities
- famous places
- travel planning
- itineraries
- food suggestions
- hotel suggestions
- routes
- sightseeing

LANGUAGE RULES:

1. Answer in the same language as the user whenever possible.
2. Hindi question -> Hindi answer.
3. Hinglish question -> natural Hinglish answer.
4. English question -> English answer.
5. If the user uses another language, try to answer in that language.

HERITAGE DATABASE RULE:

If the user asks about:

- a specific Indian heritage place
- monuments
- forts
- temples
- museums
- famous historical places
- heritage places in a state
- heritage places in a city

use the search_heritage tool when database information can help.

IMPORTANT:

Never invent database results.

If the tool returns results, use those results to make the answer useful and natural.

For historical questions, provide clear historical information.

TRAVEL KNOWLEDGE DATABASE RULE:

For general travel and destination questions, use the
Yatra Drishti travel knowledge database whenever
database information can help.

Use:

- search_destinations for destinations and famous places
- search_nearby_places for nearby attractions
- search_foods for local and famous foods
- search_things_to_do for activities and sightseeing
- search_stay_areas for recommended stay areas
- search_transport for routes and transport options

Do NOT claim live hotel availability, live prices,
live restaurant availability, or live transport schedules.

Use database information as the factual travel foundation
and then explain it naturally to the user.

For a broad destination request such as
"Shimla ghoomna hai", combine relevant travel tools
when useful instead of relying on only one database.

For travel planning, understand:

- destination
- number of days
- interests
- budget
- starting location
- transportation

If some information is missing, make a reasonable general suggestion instead of repeatedly asking unnecessary questions.

Never claim live hotel prices, booking availability, restaurant availability, or exact current information unless a live tool provides it.

Do not unnecessarily mention that you are an AI.

Keep answers useful, clear and easy to understand.

You are the main conversational assistant of the Yatra Drishti website.
`;


/* =========================================================
   MODEL CREATOR
========================================================= */
function getModel(modelName) {
    if (!gemini) {
        throw new Error(
            "GEMINI_API_KEY configured nahi hai."
        );
    }

    return {
        model: modelName,
        client: gemini
    };
}

/* =========================================================
   FAST HERITAGE RESPONSE
========================================================= */

function formatHeritageResults(results, userMessage) {

    if (!results || results.length === 0) {
        return "Mujhe Yatra Drishti heritage database mein is query ke liye koi matching place nahi mila.";
    }

    const lines = results.map((place, index) => {

        const name =
            place.name ||
            "Unknown place";

        const location =
            place.location ||
            place.state ||
            "";

        const category =
            place.category ||
            "Heritage";

        const description =
            String(place.description || "")
                .replace(/\s+/g, " ")
                .trim();

        let line =
            `${index + 1}. ${name}`;

        if (category) {
            line += ` — ${category}`;
        }

        if (location) {
            line += ` (${location})`;
        }

        if (description) {
            line += `\n   ${description}`;
        }

        return line;
    });

    return `Yatra Drishti ke heritage database ke according:

${lines.join("\n\n")}

Agar chaho, main in places ke liye itinerary bhi bana sakta hoon.`;
}

/* =========================================================
   CHECK TEMPORARY GEMINI ERROR
========================================================= */

function isTemporaryGeminiError(error) {
    const message =
        String(error?.message || "").toLowerCase();

    const status =
        Number(
            error?.status ||
            error?.response?.status ||
            0
        );

    return (
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        message.includes("429") ||
        message.includes("500") ||
        message.includes("502") ||
        message.includes("503") ||
        message.includes("too many requests") ||
        message.includes("quota exceeded") ||
        message.includes("resource exhausted") ||
        message.includes("service unavailable") ||
        message.includes("high demand") ||
        message.includes("temporarily") ||
        message.includes("overloaded")
    );
}

/* =========================================================
   NORMAL GEMINI REQUEST WITH FALLBACK
========================================================= */

async function generateWithFallback(requestBuilder) {

    let lastError = null;

    for (const modelName of GEMINI_MODELS) {

        try {

            console.log(
                `Trying Gemini model: ${modelName}`
            );

            const model = getModel(modelName);

            const result =
                await requestBuilder(
                    model.client,
                    model.model
                );

            console.log(
                `Gemini model succeeded: ${modelName}`
            );

            return {
                result,
                modelName
            };

        } catch (error) {

            lastError = error;

            const status =
                Number(
                    error?.status ||
                    error?.response?.status ||
                    0
                );

            console.error(
                `Gemini model failed: ${modelName}`,
                `status=${status}`,
                error.message
            );

            if (!isTemporaryGeminiError(error)) {
                throw error;
            }

            console.warn(
                `Gemini temporary/quota error detected for ${modelName}.`
            );
        }
    }

    throw lastError;
}

/* =========================================================
   MAIN AI RESPONSE
========================================================= */
 async function generateAIResponse(
    message,
    conversationHistory = []
) {

    const normalizedMessage =
        String(message || "")
            .toLowerCase()
            .trim();

            const recentHistory =
    Array.isArray(conversationHistory)
        ? conversationHistory.slice(-10)
        : [];

const historyText =
    recentHistory
        .map(item => {

            const role =
                item.role || "user";

            const text =
                item.text ||
                item.content ||
                "";

            return `${role}: ${String(text).trim()}`;

        })
        .filter(line =>
            line.split(": ").slice(1).join(": ").trim()
        )
        .join("\n");

        /* =====================================================
   FOLLOW-UP QUESTION DETECTION
===================================================== */

const followUpPatterns = [
    "kisne banaya",
    "kisne banwaya",
    "kisne banaya tha",
    "kisne banwaya tha",
    "kab banaya",
    "kab banaya tha",
    "kab banwaya",
    "kab banwaya tha",
    "kahan hai",
    "kaha hai",
    "history batao",
    "history kya hai",
    "aur batao",
    "iske baare mein batao",
    "is ke baare mein batao",
    "kyun banaya",
    "kyun banwaya",
    "kyu banaya",
    "kyu banwaya",
    "kitne saal lage"
];

const isFollowUp =
    followUpPatterns.some(pattern =>
        normalizedMessage.includes(pattern)
    );

let conversationContext = "";

let travelContext = "";

if (historyText) {
    conversationContext = historyText;
}
            /* =====================================================
   FAST HERITAGE DATABASE ROUTING
   Simple heritage questions should NOT depend on Gemini
===================================================== */

const knownHeritagePlaces = [
    "taj mahal",
    "qutub minar",
    "red fort",
    "lal qila",
    "india gate",
    "fatehpur sikri",
    "amber fort",
    "amer fort",
    "hawa mahal",
    "city palace",
    "mehrangarh fort",
    "jaisalmer fort",
    "gateway of india",
    "victoria memorial",
    "charminar",
    "konark sun temple",
    "meenaakshi amman temple",
    "meenakshi amman temple",
    "mysore palace",
    "sanchi stupa",
    "khajuraho",
    "ajanta caves",
    "ellora caves",
    "agra fort"
];

let detectedHeritagePlace = "";

for (const place of knownHeritagePlaces) {

    if (normalizedMessage.includes(place)) {

        detectedHeritagePlace = place;
        break;

    }

}

/* =====================================================
   FOLLOW-UP HERITAGE DATABASE ROUTING
   Resolve previous heritage place from conversation history
===================================================== */

if (isFollowUp && historyText) {

    console.log(
        "🔎 Heritage follow-up detected. Checking conversation history..."
    );

    let historyHeritagePlace = "";

    /*
       First check the latest conversation history
       for a known heritage place.
    */

    for (const place of knownHeritagePlaces) {

        if (
            historyText
                .toLowerCase()
                .includes(place)
        ) {

            historyHeritagePlace = place;
            break;

        }

    }


    /*
       If a previous heritage place is found,
       search Supabase for its structured facts.
    */

    if (historyHeritagePlace) {

        console.log(
            "⚡ Follow-up heritage place:",
            historyHeritagePlace
        );

        try {

            const heritageResults =
                await searchHeritage({

                    search:
                        historyHeritagePlace,

                    limit: 5

                });


            if (
                Array.isArray(heritageResults) &&
                heritageResults.length > 0
            ) {

                const heritage =
                    heritageResults[0];


                /*
                   =========================================
                   WHO BUILT / WHO COMMISSIONED
                   =========================================
                */

                if (
                    normalizedMessage.includes("kisne") &&
                    (
                        normalizedMessage.includes("banaya") ||
                        normalizedMessage.includes("banwaya")
                    )
                ) {

                    if (heritage.built_by) {

                        let answer =
                            `${heritage.name} ko ${heritage.built_by} ne banwaya tha.`;

                        if (heritage.built_for) {

                            answer +=
                                ` Yeh ${heritage.built_for} ki yaad mein banwaya gaya tha.`;

                        }

                        return answer;
                    }
                }


                /*
                   =========================================
                   WHEN WAS IT BUILT
                   =========================================
                */

                if (
                    normalizedMessage.includes("kab") &&
                    (
                        normalizedMessage.includes("banaya") ||
                        normalizedMessage.includes("banwaya")
                    )
                ) {

                    if (
                        heritage.construction_start ||
                        heritage.construction_end
                    ) {

                        let answer =
                            `${heritage.name} ka construction `;

                        if (
                            heritage.construction_start &&
                            heritage.construction_end
                        ) {

                            answer +=
                                `${heritage.construction_start} se ${heritage.construction_end} ke beech hua.`;

                        } else if (
                            heritage.construction_start
                        ) {

                            answer +=
                                `${heritage.construction_start} ke aas-paas shuru hua.`;

                        } else {

                            answer +=
                                `${heritage.construction_end} ke aas-paas complete hua.`;

                        }

                        return answer;
                    }
                }


                /*
                   =========================================
                   LOCATION
                   =========================================
                */

                if (
                    normalizedMessage.includes("kahan") ||
                    normalizedMessage.includes("kaha")
                ) {

                    if (
                        heritage.location ||
                        heritage.state
                    ) {

                        return (
                            `${heritage.name} ` +
                            `📍 ${heritage.location || heritage.state}.`
                        );
                    }
                }


                /*
                   =========================================
                   ARCHITECTURE
                   =========================================
                */

                if (
                    normalizedMessage.includes("architecture") ||
                    normalizedMessage.includes("style") ||
                    normalizedMessage.includes("shaili")
                ) {

                    if (heritage.architecture_style) {

                        return (
                            `${heritage.name} ki architecture style ` +
                            `${heritage.architecture_style} hai.`
                        );
                    }
                }


                /*
                   =========================================
                   GENERAL HISTORY FOLLOW-UP
                   =========================================
                */

                if (
                    normalizedMessage.includes("history") ||
                    normalizedMessage.includes("itihas") ||
                    normalizedMessage.includes("baare mein")
                ) {

                    if (heritage.description) {

                        return (
                            `${heritage.name} ke baare mein:\n\n` +
                            heritage.description
                        );
                    }
                }

            }

        } catch (error) {

            console.warn(
                "Heritage follow-up DB search failed:",
                error.message
            );

        }

    }

}

/* =====================================================
   DIRECT HERITAGE DATABASE SEARCH
===================================================== */

if (detectedHeritagePlace) {

    console.log(
        "⚡ Direct heritage DB routing:",
        detectedHeritagePlace
    );

    try {

        const heritageResults =
            await searchHeritage({

                search:
                    detectedHeritagePlace,

                limit: 5

            });


        console.log(
            "Heritage DB results:",
            heritageResults?.length || 0
        );


        if (
            Array.isArray(heritageResults) &&
            heritageResults.length > 0
        ) {

            return formatHeritageResults(
                heritageResults,
                message
            );

        }

    } catch (error) {

        console.warn(
            "Heritage DB direct search failed:",
            error.message
        );

    }

}

    /* =====================================================
       DETECT TOURIST / GENERAL PLACE SEARCH
    ===================================================== */
const isPlaceSearch =
    /(tourist places?|famous places?|places? to visit|ghoomne|ghumne|ghoomna|ghumna|sightseeing|attractions?|destinations?|visit places?|kahan ghoome|kahan ghumne|kya dekhein|kya dekhna|ghoomna hai)/i
        .test(normalizedMessage);

    /* =====================================================
       KNOWN CITY DETECTION
    ===================================================== */

    const knownCities = [
        "jaipur",
        "delhi",
        "new delhi",
        "agra",
        "mumbai",
        "goa",
        "varanasi",
        "rishikesh",
        "haridwar",
        "shimla",
        "manali",
        "mussoorie",
        "jodhpur",
        "udaipur",
        "amritsar",
        "lucknow",
        "hyderabad",
        "kolkata",
        "chennai",
        "bengaluru",
        "bangalore",
        "mysore",
        "mysuru",
        "hampi",
        "dehradun",
        "nainital",
        "mount abu",
        "jaisalmer",
        "pushkar",
        "mathura",
        "vrindavan",
        "ayodhya",
        "khajuraho",
        "aurangabad",
        "pune",
        "ahmedabad",
        "surat",
        "srinagar",
        "darjeeling",
        "gangtok",
        "ooty",
        "coorg",
        "vijayawada",
        "kochi",
        "pondicherry",
        "puducherry"
    ];

    let detectedCity = "";

    for (const city of knownCities) {

        if (
            normalizedMessage.includes(city)
        ) {

            detectedCity = city;
            break;
        }
    }
    const specificPlaceQuery =
    /famous places?|tourist places?|places to visit|ghoomne ki jagah|dekhne ki jagah|kya dekhe|kahan ghoome|sightseeing|attractions?/i
        .test(message);

    /* =====================================================
   DIRECT PLACES DATABASE SEARCH
===================================================== */

if (
    isPlaceSearch &&
    detectedCity
) {

    /*
       IMPORTANT:
       Broad travel queries such as
       "Shimla ghoomna hai"
       should NOT stop at places table.

       Only specific tourist-place queries
       should use direct places search.
    */

    const specificPlaceQuery =
        /famous places?|tourist places?|places to visit|ghoomne ki jagah|dekhne ki jagah|kya dekhe|kahan ghoome|sightseeing|attractions?/i
            .test(message);


    /* =================================================
       SPECIFIC PLACE SEARCH
    ================================================= */

    if (specificPlaceQuery) {

        console.log(
            "Direct routing to search_places:",
            {
                message,
                city: detectedCity
            }
        );

        const placesResult =
            await searchPlaces({
                search: "",
                city: detectedCity,
                limit: 10
            });


        /* =================================================
           PLACES FOUND
        ================================================= */

        if (
            placesResult.success &&
            placesResult.results &&
            placesResult.results.length > 0
        ) {

            const lines =
                placesResult.results.map(
                    (place, index) => {

                        const name =
                            place.name ||
                            "Unknown place";

                        const city =
                            place.city ||
                            "";

                        const state =
                            place.state ||
                            "";

                        const category =
                            place.category ||
                            "Tourist Place";

                        const description =
                            String(
                                place.description || ""
                            )
                            .replace(/\s+/g, " ")
                            .trim();


                        let line =
                            `${index + 1}. ${name}`;

                        line +=
                            ` — ${category}`;


                        if (
                            city ||
                            state
                        ) {

                            line +=
                                ` (${[
                                    city,
                                    state
                                ]
                                .filter(Boolean)
                                .join(", ")})`;
                        }


                        if (description) {

                            line +=
                                `\n   ${description}`;
                        }


                        return line;
                    }
                );


            return (
                "Yatra Drishti travel database ke according:\n\n" +
                lines.join("\n\n") +
                "\n\nAgar chaho, main in places ke basis par itinerary bhi bana sakta hoon."
            );
        }


        /* =================================================
           NO PLACES FOUND
        ================================================= */

        console.log(
            "No matching places found for:",
            detectedCity
        );

        /*
           IMPORTANT:
           Do NOT return an error here.
           Let Gemini use destinations/travel tools.
        */

    }

}

/* =====================================================
   BROAD DESTINATION DATABASE RESPONSE
===================================================== */

if (
    detectedCity &&
    !specificPlaceQuery &&
    isPlaceSearch
) {

    console.log(
        "Broad destination DB routing:",
        detectedCity
    );

    const destinationResult =
        await searchDestinations({
            search: detectedCity,
            limit: 5
        });

    if (
        destinationResult.success &&
        destinationResult.results &&
        destinationResult.results.length > 0
    ) {

        const destination =
            destinationResult.results.find(
                item =>
                    String(item.name || "")
                        .toLowerCase() ===
                    detectedCity.toLowerCase()
            ) ||
            destinationResult.results[0];

        const destinationId =
            destination.id;

        console.log(
            "Selected destination:",
            destination
        );

        const [
            nearbyResult,
            foodResult,
            thingsResult,
            stayResult,
            transportResult
        ] = await Promise.all([

            searchNearbyPlaces({
                destination_id: String(destinationId),
                limit: 8
            }),

            searchFoods({
                destination_id: String(destinationId),
                limit: 8
            }),

            searchThingsToDo({
                destination_id: String(destinationId),
                limit: 8
            }),

            searchStayAreas({
                destination_id: String(destinationId),
                limit: 6
            }),

            searchTransport({
                destination_id: String(destinationId),
                limit: 6
            })

        ]);

        let answer =
            `Yatra Drishti travel database ke according ${destination.name} ke liye:\n\n`;

        /* ---------------------------------------------
           DESTINATION
        --------------------------------------------- */

        answer +=
            `📍 Destination\n`;

        answer +=
            `${destination.name}`;

        if (destination.state) {
            answer +=
                `, ${destination.state}`;
        }

        if (destination.destination_type) {
            answer +=
                ` — ${destination.destination_type}`;
        }

        if (destination.description) {
            answer +=
                `\n${destination.description}`;
        }

        if (destination.best_time) {
            answer +=
                `\nBest time: ${destination.best_time}`;
        }

        if (destination.ideal_duration) {
            answer +=
                `\nIdeal duration: ${destination.ideal_duration}`;
        }

        answer += "\n\n";


        /* ---------------------------------------------
           NEARBY PLACES
        --------------------------------------------- */

        if (
            nearbyResult.success &&
            nearbyResult.results?.length
        ) {

            answer +=
                "📍 Nearby places\n";

            nearbyResult.results.forEach(
                (item, index) => {

                    answer +=
                        `${index + 1}. ${item.place_name}`;

                    if (item.category) {
                        answer +=
                            ` — ${item.category}`;
                    }

                    if (
                        item.distance_km !== null &&
                        item.distance_km !== undefined
                    ) {
                        answer +=
                            ` (${item.distance_km} km)`;
                    }

                    if (item.description) {
                        answer +=
                            `\n   ${String(
                                item.description
                            )
                            .replace(/\s+/g, " ")
                            .trim()}`;
                    }

                    answer += "\n";
                }
            );

            answer += "\n";
        }


        /* ---------------------------------------------
           FOOD
        --------------------------------------------- */

        if (
            foodResult.success &&
            foodResult.results?.length
        ) {

            answer +=
                "🍴 Famous foods\n";

            foodResult.results.forEach(
                (item, index) => {

                    answer +=
                        `${index + 1}. ${item.name}`;

                    if (item.food_type) {
                        answer +=
                            ` — ${item.food_type}`;
                    }

                    if (item.famous_area) {
                        answer +=
                            ` | ${item.famous_area}`;
                    }

                    if (item.price_range) {
                        answer +=
                            ` | ${item.price_range}`;
                    }

                    answer += "\n";
                }
            );

            answer += "\n";
        }


        /* ---------------------------------------------
           THINGS TO DO
        --------------------------------------------- */

        if (
            thingsResult.success &&
            thingsResult.results?.length
        ) {

            answer +=
                "🎯 Things to do\n";

            thingsResult.results.forEach(
                (item, index) => {

                    answer +=
                        `${index + 1}. ${item.name}`;

                    if (item.category) {
                        answer +=
                            ` — ${item.category}`;
                    }

                    if (item.duration) {
                        answer +=
                            ` | ${item.duration}`;
                    }

                    if (item.price_range) {
                        answer +=
                            ` | ${item.price_range}`;
                    }

                    answer += "\n";
                }
            );

            answer += "\n";
        }


        /* ---------------------------------------------
           STAY AREAS
        --------------------------------------------- */

        if (
            stayResult.success &&
            stayResult.results?.length
        ) {

            answer +=
                "🏨 Recommended stay areas\n";

            stayResult.results.forEach(
                (item, index) => {

                    answer +=
                        `${index + 1}. ${item.area_name}`;

                    if (item.suitable_for) {
                        answer +=
                            ` — ${item.suitable_for}`;
                    }

                    if (item.price_range) {
                        answer +=
                            ` | ${item.price_range}`;
                    }

                    answer += "\n";
                }
            );

            answer += "\n";
        }


        /* ---------------------------------------------
           TRANSPORT
        --------------------------------------------- */

        if (
            transportResult.success &&
            transportResult.results?.length
        ) {

            answer +=
                "🚗 Transport options\n";

            transportResult.results.forEach(
                (item, index) => {

                    const route =
                        [
                            item.from_location,
                            item.to_location
                        ]
                        .filter(Boolean)
                        .join(" → ");

                    answer +=
                        `${index + 1}. ${route || "Route"}`;

                    if (item.transport_mode) {
                        answer +=
                            ` — ${item.transport_mode}`;
                    }

                    if (item.approximate_duration) {
                        answer +=
                            ` | ${item.approximate_duration}`;
                    }

                    if (item.price_range) {
                        answer +=
                            ` | ${item.price_range}`;
                    }

                    answer += "\n";
                }
            );

            answer += "\n";
        }


       travelContext = `
YATRA DRISHTI TRAVEL DATABASE CONTEXT

DESTINATION:
${JSON.stringify(destination, null, 2)}

NEARBY PLACES:
${JSON.stringify(
    nearbyResult.results || [],
    null,
    2
)}

FOODS:
${JSON.stringify(
    foodResult.results || [],
    null,
    2
)}

THINGS TO DO:
${JSON.stringify(
    thingsResult.results || [],
    null,
    2
)}

STAY AREAS:
${JSON.stringify(
    stayResult.results || [],
    null,
    2
)}

TRANSPORT:
${JSON.stringify(
    transportResult.results || [],
    null,
    2
)}
`;

console.log(
    "Travel database context prepared for Gemini:",
    detectedCity
);
    }
}
    /* =====================================================
       GEMINI FALLBACK
    ===================================================== */

    if (!gemini) {

        throw new Error(
            "GEMINI_API_KEY configured nahi hai."
        );
    }
const prompt = `
${systemInstruction}

Conversation history:

${conversationContext || "No previous conversation."}

YATRA DRISHTI DATABASE CONTEXT:

${travelContext || "No destination-specific travel database context available."}

Current user message:

${message}

IMPORTANT TRAVEL INSTRUCTIONS:

If Yatra Drishti database context is available, use it as the primary factual source.

For travel requests:
- Understand the destination.
- Understand number of days if provided.
- Understand the user's interests.
- Consider food, culture, nature, heritage and sightseeing preferences.
- Use the supplied database places and travel information.
- Create a practical and personalized response.
- If the user asks for an itinerary, make it day-wise.
- Keep the route realistic.
- Do not invent database records.
- Do not claim live hotel availability.
- Do not claim live prices, ratings, opening hours or live transport schedules unless a live source provides them.
- If some live information is unavailable, clearly state that it should be verified from an official/current source.
`;

    const firstRequest =
    await generateWithFallback(
        (client, modelName) => {

            return client.models.generateContent({

                model: modelName,

                contents: prompt,

                config: {
                    systemInstruction: systemInstruction,

                    tools: [
                        heritageTool,
                        placesTool,
                        destinationsTool,
                        nearbyPlacesTool,
                        foodsTool,
                        thingsToDoTool,
                        stayAreasTool,
                        transportTool
                    ]
                }
            });
        }
    );

 const response =
    firstRequest.result;

const functionCalls =
    response.functionCalls || [];

    /* =====================================================
       GEMINI TOOL CALLS
    ===================================================== */

    if (
        functionCalls &&
        functionCalls.length > 0
    ) {

        const functionCall =
            functionCalls[0];


        /* ================================================
           HERITAGE SEARCH
        ================================================ */

        if (
            functionCall.name ===
            "search_heritage"
        ) {

            const toolArguments =
                functionCall.args || {};


            console.log(
                "AI calling search_heritage:",
                toolArguments
            );


            const heritageResults =
                await searchHeritage(
                    toolArguments
                );


            console.log(
                "Heritage results:",
                heritageResults.length
            );


            return formatHeritageResults(
                heritageResults,
                message
            );
        }


        /* ================================================
           PLACES SEARCH
        ================================================ */

        if (
            functionCall.name ===
            "search_places"
        ) {

            const toolArguments =
                functionCall.args || {};


            console.log(
                "AI calling search_places:",
                toolArguments
            );


            const placesResult =
                await searchPlaces(
                    toolArguments
                );


            console.log(
                "Places result:",
                placesResult
            );


            if (
                !placesResult.success ||
                !placesResult.results ||
                placesResult.results.length === 0
            ) {

                return (
                    "Mujhe Yatra Drishti places database mein " +
                    "is query ke liye koi matching place nahi mila."
                );
            }


            const lines =
                placesResult.results.map(
                    (place, index) => {

                        const name =
                            place.name ||
                            "Unknown place";

                        const city =
                            place.city ||
                            "";

                        const state =
                            place.state ||
                            "";

                        const category =
                            place.category ||
                            "Tourist Place";

                        const description =
                            String(
                                place.description || ""
                            )
                            .replace(/\s+/g, " ")
                            .trim();


                        let line =
                            `${index + 1}. ${name}`;

                        line +=
                            ` — ${category}`;


                        if (
                            city ||
                            state
                        ) {

                            line +=
                                ` (${[
                                    city,
                                    state
                                ]
                                .filter(Boolean)
                                .join(", ")})`;
                        }


                        if (description) {

                            line +=
                                `\n   ${description}`;
                        }


                        return line;
                    }
                );

              return `
Yatra Drishti travel database ke according:

${lines.join("\n\n")}

Agar chaho, main in places ke basis par itinerary bhi bana sakta hoon.
`;
        }

/* ================================================
   DESTINATIONS SEARCH
================================================ */

        if (
            functionCall.name ===
            "search_destinations"
        ) {

            const toolArguments =
                functionCall.args || {};

            console.log(
                "AI calling search_destinations:",
                toolArguments
            );

            const result =
                await searchDestinations(
                    toolArguments
                );

            console.log(
                "Destinations result:",
                result
            );

            if (
                !result.success ||
                !result.results ||
                result.results.length === 0
            ) {
                return (
                    "Yatra Drishti travel database mein " +
                    "is destination ke liye koi matching result nahi mila."
                );
            }

            const lines =
                result.results.map(
                    (item, index) => {

                        const name =
                            item.name ||
                            "Unknown destination";

                        const state =
                            item.state ||
                            "";

                        const type =
                            item.destination_type ||
                            "Destination";

                        const description =
                            String(
                                item.description || ""
                            )
                            .replace(/\s+/g, " ")
                            .trim();

                        let line =
                            `${index + 1}. ${name}`;

                        line +=
                            ` — ${type}`;

                        if (state) {
                            line +=
                                ` (${state})`;
                        }

                        if (description) {
                            line +=
                                `\n   ${description}`;
                        }

                        return line;
                    }
                );

            return `
Yatra Drishti travel database ke according:

${lines.join("\n\n")}
`;
        }


        /* ================================================
           NEARBY PLACES SEARCH
        ================================================ */

        if (
            functionCall.name ===
            "search_nearby_places"
        ) {

            const toolArguments =
                functionCall.args || {};

            console.log(
                "AI calling search_nearby_places:",
                toolArguments
            );

            const result =
                await searchNearbyPlaces(
                    toolArguments
                );

            console.log(
                "Nearby places result:",
                result
            );

            if (
                !result.success ||
                !result.results ||
                result.results.length === 0
            ) {
                return (
                    "Is destination ke aas-paas " +
                    "koi matching place database mein nahi mila."
                );
            }

            const lines =
                result.results.map(
                    (item, index) => {

                        const name =
                            item.place_name ||
                            "Unknown place";

                        const category =
                            item.category ||
                            "Tourist Place";

                        const distance =
                            item.distance_km;

                        const description =
                            String(
                                item.description || ""
                            )
                            .replace(/\s+/g, " ")
                            .trim();

                        let line =
                            `${index + 1}. ${name}`;

                        line +=
                            ` — ${category}`;

                        if (
                            distance !== null &&
                            distance !== undefined
                        ) {
                            line +=
                                ` (${distance} km)`;
                        }

                        if (description) {
                            line +=
                                `\n   ${description}`;
                        }

                        return line;
                    }
                );

            return `
Yatra Drishti nearby places database ke according:

${lines.join("\n\n")}
`;
        }


        /* ================================================
           FOOD SEARCH
        ================================================ */

        if (
            functionCall.name ===
            "search_foods"
        ) {

            const toolArguments =
                functionCall.args || {};

            console.log(
                "AI calling search_foods:",
                toolArguments
            );

            const result =
                await searchFoods(
                    toolArguments
                );

            console.log(
                "Foods result:",
                result
            );

            if (
                !result.success ||
                !result.results ||
                result.results.length === 0
            ) {
                return (
                    "Is destination ke famous foods " +
                    "database mein nahi mile."
                );
            }

            const lines =
                result.results.map(
                    (item, index) => {

                        const name =
                            item.name ||
                            "Unknown food";

                        const type =
                            item.food_type ||
                            "Local food";

                        const area =
                            item.famous_area ||
                            "";

                        const price =
                            item.price_range ||
                            "";

                        const description =
                            String(
                                item.description || ""
                            )
                            .replace(/\s+/g, " ")
                            .trim();

                        let line =
                            `${index + 1}. ${name}`;

                        line +=
                            ` — ${type}`;

                        if (area) {
                            line +=
                                ` | ${area}`;
                        }

                        if (price) {
                            line +=
                                ` | ${price}`;
                        }

                        if (description) {
                            line +=
                                `\n   ${description}`;
                        }

                        return line;
                    }
                );

            return `
Yatra Drishti food database ke according:

${lines.join("\n\n")}
`;
        }


        /* ================================================
           THINGS TO DO SEARCH
        ================================================ */

        if (
            functionCall.name ===
            "search_things_to_do"
        ) {

            const toolArguments =
                functionCall.args || {};

            console.log(
                "AI calling search_things_to_do:",
                toolArguments
            );

            const result =
                await searchThingsToDo(
                    toolArguments
                );

            console.log(
                "Things to do result:",
                result
            );

            if (
                !result.success ||
                !result.results ||
                result.results.length === 0
            ) {
                return (
                    "Is destination ke activities " +
                    "database mein nahi mili."
                );
            }

            const lines =
                result.results.map(
                    (item, index) => {

                        const name =
                            item.name ||
                            "Activity";

                        const category =
                            item.category ||
                            "Activity";

                        const duration =
                            item.duration ||
                            "";

                        const price =
                            item.price_range ||
                            "";

                        const bestTime =
                            item.best_time ||
                            "";

                        const description =
                            String(
                                item.description || ""
                            )
                            .replace(/\s+/g, " ")
                            .trim();

                        let line =
                            `${index + 1}. ${name}`;

                        line +=
                            ` — ${category}`;

                        if (duration) {
                            line +=
                                ` | ${duration}`;
                        }

                        if (price) {
                            line +=
                                ` | ${price}`;
                        }

                        if (bestTime) {
                            line +=
                                ` | Best time: ${bestTime}`;
                        }

                        if (description) {
                            line +=
                                `\n   ${description}`;
                        }

                        return line;
                    }
                );

            return `
Yatra Drishti things-to-do database ke according:

${lines.join("\n\n")}
`;
        }


        /* ================================================
           STAY AREAS SEARCH
        ================================================ */

        if (
            functionCall.name ===
            "search_stay_areas"
        ) {

            const toolArguments =
                functionCall.args || {};

            console.log(
                "AI calling search_stay_areas:",
                toolArguments
            );

            const result =
                await searchStayAreas(
                    toolArguments
                );

            console.log(
                "Stay areas result:",
                result
            );

            if (
                !result.success ||
                !result.results ||
                result.results.length === 0
            ) {
                return (
                    "Is destination ke stay areas " +
                    "database mein nahi mile."
                );
            }

            const lines =
                result.results.map(
                    (item, index) => {

                        const area =
                            item.area_name ||
                            "Stay area";

                        const suitable =
                            item.suitable_for ||
                            "";

                        const price =
                            item.price_range ||
                            "";

                        const description =
                            String(
                                item.description || ""
                            )
                            .replace(/\s+/g, " ")
                            .trim();

                        let line =
                            `${index + 1}. ${area}`;

                        if (suitable) {
                            line +=
                                ` — Suitable for: ${suitable}`;
                        }

                        if (price) {
                            line +=
                                ` | ${price}`;
                        }

                        if (description) {
                            line +=
                                `\n   ${description}`;
                        }

                        return line;
                    }
                );

            return `
Yatra Drishti stay-area database ke according:

${lines.join("\n\n")}
`;
        }


        /* ================================================
           TRANSPORT SEARCH
        ================================================ */

        if (
            functionCall.name ===
            "search_transport"
        ) {

            const toolArguments =
                functionCall.args || {};

            console.log(
                "AI calling search_transport:",
                toolArguments
            );

            const result =
                await searchTransport(
                    toolArguments
                );

            console.log(
                "Transport result:",
                result
            );

            if (
                !result.success ||
                !result.results ||
                result.results.length === 0
            ) {
                return (
                    "Is route ke liye transport information " +
                    "database mein nahi mili."
                );
            }

            const lines =
                result.results.map(
                    (item, index) => {

                        const from =
                            item.from_location ||
                            "";

                        const to =
                            item.to_location ||
                            "";

                        const mode =
                            item.transport_mode ||
                            "Transport";

                        const duration =
                            item.approximate_duration ||
                            "";

                        const price =
                            item.price_range ||
                            "";

                        const description =
                            String(
                                item.description || ""
                            )
                            .replace(/\s+/g, " ")
                            .trim();

                        let route =
                            [from, to]
                            .filter(Boolean)
                            .join(" → ");

                        let line =
                            `${index + 1}. ${route || "Route"}`;

                        line +=
                            ` — ${mode}`;

                        if (duration) {
                            line +=
                                ` | ${duration}`;
                        }

                        if (price) {
                            line +=
                                ` | ${price}`;
                        }

                        if (description) {
                            line +=
                                `\n   ${description}`;
                        }

                        return line;
                    }
                );

        return `
Yatra Drishti transport database ke according:

${lines.join("\n\n")}
`;
        }

    } // ✅ OUTER functionCalls block CLOSE

    /* =====================================================
       NORMAL GEMINI TEXT RESPONSE
    ===================================================== */
    const finalText =
        response.text().trim();


    if (!finalText) {

        throw new Error(
            "Gemini ne empty response return kiya."
        );
    }


    return finalText;
}

/* =========================================================
   AI TRAVEL PLAN
   DATA.JS + SUPABASE DATABASE
========================================================= */

async function generateAIPlan({
    state,
    duration,
    budget,
    travelMode,
    query,
    interests,
    localHeritagePlaces
}) {

    const safeState =
        String(state || "").trim();

    const safeDuration =
        Math.max(
            1,
            Number(duration) || 1
        );

    const safeBudget =
        Math.max(
            0,
            Number(budget) || 5000
        );

    const safeTravelMode =
        String(
            travelMode || "Car"
        ).trim();

    const safeQuery =
        String(query || "").trim();

    const safeInterests =
        Array.isArray(interests)
            ? interests
            : [];

    const localPlaces =
        Array.isArray(localHeritagePlaces)
            ? localHeritagePlaces
            : [];


    console.log(
        "🧭 Creating AI Travel Plan:",
        {
            state: safeState,
            duration: safeDuration,
            budget: safeBudget,
            travelMode: safeTravelMode,
            interests: safeInterests,
            localPlaces: localPlaces.length
        }
    );


    /* =====================================================
       1. GET DESTINATION DATA FROM SUPABASE
    ===================================================== */

    let destinations = [];

    try {

        const destinationResult =
            await searchDestinations({

                state: safeState,

                limit: 20

            });


        if (
            destinationResult &&
            destinationResult.success &&
            Array.isArray(
                destinationResult.results
            )
        ) {

            destinations =
                destinationResult.results;

        }

    } catch (error) {

        console.warn(
            "Destination database lookup failed:",
            error.message
        );

    }


    /* =====================================================
       2. FIND BEST DESTINATION
    ===================================================== */
let selectedDestination = null;

if (destinations.length) {

    const queryText =
        safeQuery
            .toLowerCase()
            .trim();

    /*
       First priority:
       Query ke andar destination name
       directly match karo.

       Example:
       "Shimla ghoomna hai"
       → "Shimla"
    */
    selectedDestination =
        destinations.find(
            destination => {

                const name =
                    String(
                        destination.name || ""
                    )
                        .toLowerCase()
                        .trim();

                return (
                    name &&
                    queryText.includes(name)
                );

            }
        );

    /*
       Second priority:
       Query destination ke naam
       ke andar ho.
    */
    if (!selectedDestination) {

        selectedDestination =
            destinations.find(
                destination => {

                    const name =
                        String(
                            destination.name || ""
                        )
                            .toLowerCase()
                            .trim();

                    return (
                        name &&
                        name.includes(queryText)
                    );

                }
            );

    }

    /*
       Final fallback:
       State ka first destination.
    */
    if (!selectedDestination) {

        selectedDestination =
            destinations[0];

    }

}


    /* =====================================================
       3. COLLECT SUPABASE TRAVEL DATA
    ===================================================== */

    let nearbyPlaces = [];
    let foods = [];
    let thingsToDo = [];
    let stayAreas = [];
    let transportOptions = [];


    if (selectedDestination?.id) {

        const destinationId =
            String(
                selectedDestination.id
            );


        const results =
            await Promise.allSettled([

                searchNearbyPlaces({

                    destination_id:
                        destinationId,

                    limit: 20

                }),

                searchFoods({

                    destination_id:
                        destinationId,

                    limit: 20

                }),

                searchThingsToDo({

                    destination_id:
                        destinationId,

                    limit: 20

                }),

                searchStayAreas({

                    destination_id:
                        destinationId,

                    limit: 10

                }),

                searchTransport({

                    destination_id:
                        destinationId,

                    limit: 10

                })

            ]);


        nearbyPlaces =
            results[0].status === "fulfilled" &&
            results[0].value?.success
                ? results[0].value.results || []
                : [];


        foods =
            results[1].status === "fulfilled" &&
            results[1].value?.success
                ? results[1].value.results || []
                : [];


        thingsToDo =
            results[2].status === "fulfilled" &&
            results[2].value?.success
                ? results[2].value.results || []
                : [];


        stayAreas =
            results[3].status === "fulfilled" &&
            results[3].value?.success
                ? results[3].value.results || []
                : [];


        transportOptions =
            results[4].status === "fulfilled" &&
            results[4].value?.success
                ? results[4].value.results || []
                : [];

    }


    /* =====================================================
       4. COMBINE data.js + SUPABASE PLACES
    ===================================================== */

    const combinedPlaces = [];


    /* -----------------------------------------------------
       DATA.JS PLACES FIRST
    ----------------------------------------------------- */

    localPlaces.forEach(
        place => {

            if (!place || !place.name) {
                return;
            }


            combinedPlaces.push({

                name:
                    place.name,

                category:
                    place.category ||
                    "Heritage",

                state:
                    place.state ||
                    safeState,

                city:
                    place.city ||
                    "",

                lat:
                    Number(place.lat) ||
                    null,

                lng:
                    Number(place.lng) ||
                    null,

                originalIndex:
                    Number.isInteger(
                        place.originalIndex
                    )
                        ? place.originalIndex
                        : 0,

                source:
                    "data.js"

            });

        }
    );


    /* -----------------------------------------------------
       SUPABASE NEARBY PLACES
    ----------------------------------------------------- */

    nearbyPlaces.forEach(
        place => {

            if (!place || !place.place_name) {
                return;
            }


            combinedPlaces.push({

                name:
                    place.place_name,

                category:
                    place.category ||
                    "Tourist Place",

                state:
                    place.state ||
                    safeState,

                city:
                    place.city ||
                    "",

                lat:
                    Number(place.lat) ||
                    null,

                lng:
                    Number(place.lng) ||
                    null,

                originalIndex:
                    0,

                source:
                    "supabase"

            });

        }
    );


    /* =====================================================
       5. REMOVE DUPLICATE PLACES
    ===================================================== */

    const uniquePlaces = [];

    const seenPlaces =
        new Set();


    combinedPlaces.forEach(
        place => {

            const key =
                String(
                    place.name || ""
                )
                    .trim()
                    .toLowerCase();


            if (!key) {
                return;
            }


            if (
                seenPlaces.has(key)
            ) {
                return;
            }


            seenPlaces.add(key);

            uniquePlaces.push(place);

        }
    );


    /* =====================================================
       6. INTEREST-BASED FILTERING
    ===================================================== */

    let filteredPlaces =
        uniquePlaces;


    if (safeInterests.length) {

        const interestText =
            safeInterests
                .join(" ")
                .toLowerCase();


        const scoredPlaces =
            uniquePlaces.map(
                place => {

                    const text =
                        (
                            String(
                                place.name || ""
                            ) +
                            " " +
                            String(
                                place.category || ""
                            )
                        )
                            .toLowerCase();


                    let score = 0;


                    safeInterests.forEach(
                        interest => {

                            const keyword =
                                String(
                                    interest || ""
                                )
                                    .toLowerCase();


                            if (
                                keyword &&
                                text.includes(
                                    keyword
                                )
                            ) {

                                score += 5;

                            }

                        }
                    );


                    if (
                        interestText.includes(
                            "temple"
                        ) &&
                        text.includes(
                            "temple"
                        )
                    ) {

                        score += 5;

                    }


                    if (
                        interestText.includes(
                            "nature"
                        ) &&
                        (
                            text.includes(
                                "nature"
                            ) ||
                            text.includes(
                                "lake"
                            ) ||
                            text.includes(
                                "waterfall"
                            ) ||
                            text.includes(
                                "valley"
                            ) ||
                            text.includes(
                                "hill"
                            )
                        )
                    ) {

                        score += 5;

                    }


                    if (
                        interestText.includes(
                            "architecture"
                        ) &&
                        (
                            text.includes(
                                "fort"
                            ) ||
                            text.includes(
                                "palace"
                            ) ||
                            text.includes(
                                "monument"
                            ) ||
                            text.includes(
                                "architecture"
                            )
                        )
                    ) {

                        score += 5;

                    }


                    if (
                        interestText.includes(
                            "food"
                        ) &&
                        text.includes(
                            "food"
                        )
                    ) {

                        score += 3;

                    }


                    return {
                        ...place,
                        score
                    };

                }
            );


        scoredPlaces.sort(
            (a, b) =>
                b.score - a.score
        );


        filteredPlaces =
            scoredPlaces;

    }


    /* =====================================================
       7. NUMBER OF PLACES
    ===================================================== */

    const requiredPlaces =
        Math.min(
            Math.max(
                safeDuration * 2,
                2
            ),
            filteredPlaces.length
        );


    let selectedPlaces =
        filteredPlaces.slice(
            0,
            requiredPlaces
        );


    /* =====================================================
       8. FALLBACK
    ===================================================== */

    if (!selectedPlaces.length) {

        selectedPlaces = [

            {

                name:
                    selectedDestination?.name ||
                    safeState,

                category:
                    selectedDestination?.destination_type ||
                    "Destination",

                state:
                    safeState,

                city:
                    "",

                lat:
                    selectedDestination?.lat ||
                    null,

                lng:
                    selectedDestination?.lng ||
                    null,

                originalIndex:
                    0,

                source:
                    "supabase"

            }

        ];

    }


    /* =====================================================
       9. BUILD DAY-WISE PLAN
    ===================================================== */

    const places =
        selectedPlaces.map(
            (place, index) => {

                const day =
                    (index % safeDuration) + 1;


                return {

                    name:
                        place.name,

                    category:
                        place.category ||
                        "Tourist Place",

                    state:
                        place.state ||
                        safeState,

                    city:
                        place.city ||
                        "",

                    lat:
                        place.lat ??
                        null,

                    lng:
                        place.lng ??
                        null,

                    originalIndex:
                        Number.isInteger(
                            place.originalIndex
                        )
                            ? place.originalIndex
                            : 0,

                    day,

                    source:
                        place.source ||
                        "database"

                };

            }
        );


    /* =====================================================
       10. RETURN COMPLETE PLAN
    ===================================================== */

    return {

        state:
            safeState,

        duration:
            safeDuration,

        budget:
            safeBudget,

        travelMode:
            safeTravelMode,

        query:
            safeQuery,

        interests:
            safeInterests,

        destination:
            selectedDestination,

        places,

        travelInfo: {

            foods:
                foods.slice(0, 10),

            thingsToDo:
                thingsToDo.slice(0, 10),

            stayAreas:
                stayAreas.slice(0, 10),

            transport:
                transportOptions.slice(0, 10)

        },

        meta: {

            localHeritageCount:
                localPlaces.length,

            databaseDestinationCount:
                destinations.length,

            nearbyPlacesCount:
                nearbyPlaces.length,

            generatedAt:
                new Date().toISOString()

        }

    };

}

/* =========================================================
   EXPORT
========================================================= */
module.exports = {
    generateAIResponse,
    generateAIPlan
};