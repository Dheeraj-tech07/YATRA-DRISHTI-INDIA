/* =========================================
   YATRA DRISHTI
   STEP 2 - EXPLORE INDIA ENGINE
========================================= */
 const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

    // 1. Initialize the Supabase client with your details
const supabaseUrl = 'https://xxhifkdicxdkpaoyumnr.supabase.co';
const supabaseKey = 'sb_publishable_lHlOARe0pA3GIrztt8AdDg_sELdMKUc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. Function to save details
async function saveToSupabase(event) {
    event.preventDefault(); // Stop the page from reloading

    // Get your form data (assuming your form has an ID like 'detailsForm')
    const form = event.target;
    const formData = new FormData(form);
    
    // Map your form fields to your Supabase columns
    // Replace 'column_name' with your actual table column names
    const dataToSave = {
        name: formData.get('name'), // example field
        email: formData.get('email'), // example field
        details: formData.get('details') // example field
    };

    // 3. Insert data into your Supabase table
    const { data, error } = await supabase
        .from('your_table_name') // <--- Change this to your table name
        .insert([dataToSave]);

    if (error) {
        console.error('Error saving data:', error.message);
        alert('Failed to save details: ' + error.message);
    } else {
        console.log('Details saved successfully:', data);
        alert('Details saved successfully!');
        form.reset(); // Clear the form
    }
}

// 4. Attach the function to your form's submit event
document.getElementById('detailsForm').addEventListener('submit', saveToSupabase);

    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    let chatHistory = []; // Local history for context
    
    // Core Function to Send Message
    async function sendHeritageMessage() {
        const message = userInput.value.trim();
        if (!message) return;
    
        // 1. Add User Message to UI
        addChatMessage(message, 'user');
        userInput.value = '';
        
        // 2. Show Typing Indicator
        const typingId = showTypingIndicator();
        
        try {
            // 3. API Request to Backend
            const response = await fetch(`${API_BASE_URL}/companion/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: "priya_123", // Example ID
                    message: message,
                    history: chatHistory,
                    site_id: null // Can be populated dynamically based on current view
                })
            });
    
            const data = await response.json();
            removeTypingIndicator(typingId);
    
            if (data.response) {
                // 4. Add AI Response to UI
                addChatMessage(data.response, 'ai');
                // Update history for context
                chatHistory.push({ role: "user", text: message });
                chatHistory.push({ role: "model", text: data.response });
            } else {
                addChatMessage("I'm having trouble connecting to the heritage database. Please try again.", 'ai');
            }
        } catch (error) {
            removeTypingIndicator(typingId);
            console.error("Chat Error:", error);
            addChatMessage("Sorry, I couldn't connect to Virasat AI right now. Check if the backend is running.", 'ai');
        }
    }
    
    // UI Helper: Add Message
    function addChatMessage(text, role) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${role}`;
        
        // Simple markdown-to-html conversion for newlines and bold
        const formattedText = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        msgDiv.innerHTML = formattedText;
        
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // UI Helper: Typing Indicator
    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.className = 'msg ai typing';
        typingDiv.id = id;
        typingDiv.innerHTML = '<i>Yatra Drishti  is thinking...</i>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }
    
    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }
    
    // Listeners
    sendBtn.addEventListener('click', sendHeritageMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendHeritageMessage();
    });
document.addEventListener("DOMContentLoaded", function () {


    /* =====================================
       LANGUAGE
    ===================================== */

    const languageBtn =
        document.getElementById("languageBtn");

    const languageDropdown =
        document.getElementById("languageDropdown");


    if (languageBtn && languageDropdown) {

        languageBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                languageDropdown.classList.toggle("show");

            }
        );


        document.addEventListener(
            "click",
            function () {

                languageDropdown.classList.remove("show");

            }
        );


        languageDropdown.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

            }
        );


        languageDropdown
            .querySelectorAll("button")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        languageBtn.textContent =
                            "🌐 " +
                            button.textContent.trim();

                        languageDropdown
                            .classList.remove("show");

                    }
                );

            });

    }


    /* =====================================
       NAVIGATION
    ===================================== */

    /* =====================================================
   STEP 9 — PREMIUM SCROLL SPY NAVIGATION
===================================================== */

const navLinks = document.querySelectorAll(".nav-menu a");
const navbar = document.querySelector(".navbar");


/* -----------------------------------------
   CLICK NAVIGATION
----------------------------------------- */

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        navLinks.forEach(function (item) {
            item.classList.remove("active");
        });

        link.classList.add("active");

    });

});


/* -----------------------------------------
   STICKY NAVBAR SCROLL EFFECT
----------------------------------------- */

window.addEventListener("scroll", function () {

    if (!navbar) return;

    if (window.scrollY > 30) {

        navbar.classList.add("nav-scrolled");

    } else {

        navbar.classList.remove("nav-scrolled");

    }

});


/* -----------------------------------------
   SCROLL SPY
----------------------------------------- */

const sections = document.querySelectorAll(
    "main section[id]"
);


function updateActiveNavigation() {

    const scrollPosition =
        window.scrollY + 180;

    let currentSection = "home";


    sections.forEach(function (section) {

        const sectionTop =
            section.offsetTop;

        const sectionHeight =
            section.offsetHeight;

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navLinks.forEach(function (link) {

        link.classList.remove("active");

        const href =
            link.getAttribute("href");

        if (href === "#" + currentSection) {

            link.classList.add("active");

        }

    });

}


/* -----------------------------------------
   RUN ON SCROLL
----------------------------------------- */

window.addEventListener(
    "scroll",
    updateActiveNavigation
);


/* -----------------------------------------
   RUN ON PAGE LOAD
----------------------------------------- */

window.addEventListener(
    "load",
    updateActiveNavigation
);


    /* =====================================
       STATE SELECT
    ===================================== */

    const stateSelect =
        document.getElementById("stateSelect");


    const exploreResults =
        document.getElementById("exploreResults");


    const selectedStateTitle =
        document.getElementById(
            "selectedStateTitle"
        );


    const placeCount =
        document.getElementById("placeCount");


    let currentState = "";

    let currentCategory = "all";


    /* =====================================
       POPULATE 36 STATES / UTs
    ===================================== */

    function populateStates() {

        if (!stateSelect) return;


        const states =
            getStates().sort();


        states.forEach(function (state) {

            const option =
                document.createElement("option");

            option.value = state;

            option.textContent = state;

            stateSelect.appendChild(option);

        });

    }


    populateStates();


    /* =====================================
       CATEGORY ICON
    ===================================== */

    function getIcon(category) {

        const c =
            category.toLowerCase();


        if (c.includes("fort"))
            return "🏰";

        if (c.includes("palace"))
            return "👑";

        if (c.includes("temple"))
            return "🛕";

        if (c.includes("monument"))
            return "🏛️";

        if (c.includes("nature"))
            return "🌿";

        if (c.includes("wildlife"))
            return "🐅";

        if (c.includes("culture"))
            return "🎭";

        if (c.includes("museum"))
            return "🏺";

        if (c.includes("buddhist"))
            return "☸️";

        if (c.includes("sikh"))
            return "🪯";

        if (c.includes("church"))
            return "⛪";

        if (c.includes("island"))
            return "🏝️";

        return "🏛️";

    }


    /* =====================================
       RECOMMENDATION SCORE
    ===================================== */

    function getRecommendation(
        placeName,
        category
    ) {

        let score =
            80 +
            Math.floor(
                Math.random() * 20
            );


        const popularPlaces = [

            "Taj Mahal",
            "Hampi",
            "Amber Fort",
            "Golden Temple",
            "Konark Sun Temple",
            "Ajanta Caves",
            "Ellora Caves",
            "Meenakshi Amman Temple",
            "Mysore Palace",
            "Khajuraho"

        ];


        if (
            popularPlaces.includes(placeName)
        ) {

            score = 96;

        }


        return score;

    }


    /* =====================================
       SHOW STATE
    ===================================== */

    function showState(state) {

        currentState = state;

        currentCategory = "all";

        const explorePlaceSearch =
    document.getElementById("explorePlaceSearch");

if (explorePlaceSearch) {
    explorePlaceSearch.value = "";
}


        document
            .querySelectorAll(".category-filter")
            .forEach(function (button) {

                button.classList.remove("active");

            });


        const allButton =
            document.querySelector(
                '[data-category="all"]'
            );


        if (allButton) {

            allButton.classList.add("active");

        }


        if (selectedStateTitle) {

            selectedStateTitle.textContent =
                state;

        }


        renderStatePlaces();

    }


    /* =====================================
       RENDER STATE PLACES
    ===================================== */

function renderStatePlaces() {

    if (!currentState) return;

    let places = getPlacesByState(currentState).map(function (place, index) {
    return {
        place: place,
        originalIndex: index
    };
});

    /* Category filtering */
    if (currentCategory !== "all") {
    places = places.filter(function (item) {
        return item.place[1]
            .toLowerCase()
            .includes(currentCategory.toLowerCase());
    });
}
/* Explore India Search */
const exploreSearchInput =
    document.getElementById("explorePlaceSearch");

const exploreQuery =
    exploreSearchInput
        ? exploreSearchInput.value.trim().toLowerCase()
        : "";

if (exploreQuery) {
    places = places.filter(function (item) {

        const place = item.place;

        const searchText = (
            place[0] + " " +
            place[1] + " " +
            currentState
        ).toLowerCase();

        return searchText.includes(exploreQuery);
    });
}


    /* Update place count */
if (placeCount) {

    const searchInput =
        document.getElementById("heritageSearch");

    const searchText =
        searchInput
            ? searchInput.value.trim()
            : "";

    if (searchText) {

        placeCount.textContent =
            places.length +
            (places.length === 1 ? " place found" : " places found");

    } else {

        placeCount.textContent =
            places.length +
            (places.length === 1 ? " place" : " places");

    }
}

    /* No results */
    if (!places.length) {

        exploreResults.innerHTML = `

            <div class="explore-empty">

                <div>🔍</div>

                <h3>No heritage place found</h3>
<p>
    Try another search term, state or heritage category.
</p>

            </div>

        `;

        return;

    }


    /* Render heritage cards */

    exploreResults.innerHTML = places.map(function (item) {

    const place = item.place;
    const originalIndex = item.originalIndex;

    const name = place[0];
    const category = place[1];
    const lat = place[2];
    const lng = place[3];

            const recommendation =
                getRecommendation(
                    name,
                    category
                );


            /* Check visited status */

            const visitedPlaces =
                getVisitedPlaces();

            const alreadyVisited =
                visitedPlaces.some(function (item) {

                    return (
                        item.name === name &&
                        item.state === currentState
                    );

                });


            /* Category icon */

            const icon =
                getIcon(category);


            return `

                <article class="heritage-card">

                    <!-- Card top -->

                    <div class="heritage-card-top">

                        <div class="heritage-card-icon">

                            ${icon}

                        </div>

                        <span class="heritage-category">

                            ${category}

                        </span>

                    </div>


                    <!-- Place information -->

                    <div class="heritage-card-content">

                        <h3>
                            ${name}
                        </h3>

                        <p class="heritage-card-location">

                            📍 ${currentState}

                        </p>


                        <div class="recommendation">

                            ⭐ ${recommendation}%
                            Recommended

                        </div>

                    </div>


                    <!-- Actions -->

                    <div class="heritage-card-actions">

                        <button
                                class="card-explore-btn"
                             onclick="viewHeritage('${escapeQuotes(currentState)}', ${originalIndex})">

                            ✦ Explore

                        </button>


                        <button
                         class="card-save-btn"
                           onclick="saveHeritage('${escapeQuotes(currentState)}', ${originalIndex})">

                            ♡ Save

                        </button>


                        <button
    class="card-nav-btn"
    onclick="navigateCardPlace(
        ${lat},
        ${lng},
        '${escapeQuotes(name)}'
    )">
    🧭 Navigate
</button>

<button
    class="card-yatra-btn"
    onclick="addPlaceToYatra(
        '${escapeQuotes(currentState)}',
        ${originalIndex}
    )">
    🗺️ Add to Yatra
</button>

                        <button
                            class="visited-btn ${alreadyVisited ? "visited" : ""}"
                            data-place-name="${escapeQuotes(name)}"
                            data-place-state="${escapeQuotes(currentState)}"
                            data-place-category="${escapeQuotes(category)}"
                            data-place-lat="${lat}"
                            data-place-lng="${lng}"
                            onclick="markCardVisited(this)"
                            ${alreadyVisited ? "disabled" : ""}>

                            ${alreadyVisited
                                ? "✓ Visited"
                                : "✓ Mark Visited"}

                        </button>

                    </div>

                </article>

            `;

        }

    ).join("");


    /* Restore visited buttons */

    restoreVisitedButtons();

}


    /* =====================================
       STATE CHANGE
    ===================================== */

    if (stateSelect) {

        stateSelect.addEventListener(
            "change",
            function () {

                if (!this.value) {

                    currentState = "";

                    selectedStateTitle.textContent =
                        "Select a State to Begin";

                    placeCount.textContent =
                        "0 places";

                    exploreResults.innerHTML = `

                        <div class="explore-empty">

                            <div>🇮🇳</div>

                            <h3>
                                Bharat Awaits You
                            </h3>

                            <p>
                                Select a State or UT to
                                discover its heritage places.
                            </p>

                        </div>

                    `;

                    return;

                }


                showState(this.value);

            }
        );

    }


    /* =====================================
       CATEGORY FILTER
    ===================================== */

    document
        .querySelectorAll(".category-filter")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    if (!currentState) {

                        alert(
                            "Please select a State / UT first."
                        );

                        return;

                    }


                    document
                        .querySelectorAll(
                            ".category-filter"
                        )
                        .forEach(
                            function (item) {

                                item.classList
                                    .remove("active");

                            }
                        );


                    this.classList.add("active");


                    currentCategory =
                        this.dataset.category;


            renderStatePlaces();
                    
     }
    );
    });

        /* =====================================
   EXPLORE INDIA SEARCH
===================================== */

const explorePlaceSearch =
    document.getElementById("explorePlaceSearch");

const clearHeritageSearch =
    document.getElementById("clearHeritageSearch");


if (explorePlaceSearch) {

    explorePlaceSearch.addEventListener(
        "input",
        function () {

            if (!currentState) {
                return;
            }

            renderStatePlaces();
        }
    );

}


if (clearHeritageSearch) {

    clearHeritageSearch.addEventListener(
        "click",
        function () {

            if (explorePlaceSearch) {
                explorePlaceSearch.value = "";
            }

            renderStatePlaces();

            if (explorePlaceSearch) {
                explorePlaceSearch.focus();
            }

        }
    );

}

    /* =====================================
       GLOBAL HERITAGE SEARCH
    ===================================== */

/* =====================================
   GLOBAL HERITAGE SEARCH — STEP 22.2
===================================== */

const searchInput =
    document.getElementById("heritageSearch");

const searchButton =
    document.getElementById("heritageSearchBtn");

const heritageResults =
    document.getElementById("heritageResults");


/* -------------------------------------
   SEARCH NORMALIZER
------------------------------------- */

function normalizeSearchText(text) {
    return String(text || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}


/* -------------------------------------
   SEARCH KEYWORDS
------------------------------------- */

const searchKeywordMap = {
    fort: [
        "fort",
        "forts",
        "qila",
        "garh",
        "fortress"
    ],

    palace: [
        "palace",
        "palaces",
        "mahal",
        "royal"
    ],

    temple: [
        "temple",
        "temples",
        "mandir",
        "shrine"
    ],

    monument: [
        "monument",
        "monuments",
        "memorial",
        "architecture"
    ],

    nature: [
        "nature",
        "wildlife",
        "forest",
        "national park",
        "park",
        "lake",
        "waterfall",
        "hill",
        "mountain"
    ],

    culture: [
        "culture",
        "cultural",
        "tradition",
        "traditions",
        "festival",
        "heritage",
        "tribal"
    ]
};


/* -------------------------------------
   SEARCH CATEGORY DETECTOR
------------------------------------- */

function detectSearchCategory(query) {

    const normalizedQuery =
        normalizeSearchText(query);

    for (const category in searchKeywordMap) {

        const keywords =
            searchKeywordMap[category];

        if (
            keywords.some(function (keyword) {
                return normalizedQuery.includes(
                    keyword
                );
            })
        ) {
            return category;
        }
    }

    return null;
}


/* -------------------------------------
   SEARCH SCORE
------------------------------------- */

function getSearchScore(place, query) {

    const search =
        normalizeSearchText(query);

    const name =
        normalizeSearchText(place.name);

    const state =
        normalizeSearchText(place.state);

    const category =
        normalizeSearchText(place.category);

    let score = 0;

    /* Exact place name */
    if (name === search) {
        score += 100;
    }

    /* Place name starts with query */
    else if (name.startsWith(search)) {
        score += 70;
    }

    /* Place name contains query */
    else if (name.includes(search)) {
        score += 50;
    }

    /* State match */
    if (state.includes(search)) {
        score += 40;
    }

    /* Category match */
    if (category.includes(search)) {
        score += 30;
    }

    /* Keyword category match */
    const detectedCategory =
        detectSearchCategory(search);

    if (
        detectedCategory &&
        category.includes(detectedCategory)
    ) {
        score += 60;
    }

    return score;
}

/* =====================================================
   STEP 22.4 — SMART HERITAGE SEARCH SUGGESTIONS
===================================================== */

const heritageSuggestions =
    document.getElementById(
        "heritageSearchSuggestions"
    );


function showHeritageSuggestions() {

    if (
        !heritageSuggestions ||
        !searchInput
    ) {
        return;
    }


    const query =
        searchInput.value
            .trim()
            .toLowerCase();


    /* Hide suggestions for empty/short search */

    if (query.length < 2) {

        heritageSuggestions.innerHTML = "";

        heritageSuggestions.classList.remove(
            "show"
        );

        return;
    }


    /* Get all heritage places */

    const places =
        getAllHeritagePlaces();


    /* Find matching places */

    const matches =
        places
            .filter(function (place) {

                const searchableText =
                    (
                        place.name +
                        " " +
                        place.state +
                        " " +
                        place.category
                    ).toLowerCase();


                return searchableText.includes(
                    query
                );

            })
            .slice(0, 6);


    /* No matches */

    if (!matches.length) {

        heritageSuggestions.innerHTML = `
            <div class="search-suggestion-empty">
                No matching heritage places found.
            </div>
        `;

        heritageSuggestions.classList.add(
            "show"
        );

        return;
    }


    /* Create suggestions */

    heritageSuggestions.innerHTML =
        matches
            .map(function (place) {

                return `
                    <button
                        type="button"
                        class="search-suggestion-item"
                        data-place-name="${escapeQuotes(place.name)}">

                        <span class="search-suggestion-icon">
                            ${getIcon(place.category)}
                        </span>

                        <span class="search-suggestion-content">

                            <span class="search-suggestion-title">
                                ${place.name}
                            </span>

                            <span class="search-suggestion-meta">
                                ${place.state} • ${place.category}
                            </span>

                        </span>

                    </button>
                `;

            })
            .join("");


    heritageSuggestions.classList.add(
        "show"
    );
}


/* =====================================================
   LIVE SEARCH SUGGESTIONS
===================================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        showHeritageSuggestions
    );

}


/* =====================================================
   CLICK SUGGESTION
===================================================== */

if (heritageSuggestions) {

    heritageSuggestions.addEventListener(
        "click",
        function (event) {

            const suggestion =
                event.target.closest(
                    ".search-suggestion-item"
                );


            if (!suggestion) {
                return;
            }


            const placeName =
                suggestion.getAttribute(
                    "data-place-name"
                );


            if (!placeName) {
                return;
            }


            searchInput.value =
                placeName;


            heritageSuggestions.innerHTML = "";

            heritageSuggestions.classList.remove(
                "show"
            );


            /* Use existing search system */

            searchHeritage();

        }
    );

}


/* =====================================================
   CLOSE SUGGESTIONS OUTSIDE SEARCH
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.closest(
                ".search-box"
            )
        ) {

            if (heritageSuggestions) {

                heritageSuggestions.classList.remove(
                    "show"
                );

            }

        }

    }
);
/* -------------------------------------
   MAIN SEARCH FUNCTION
------------------------------------- */


/* -------------------------------------
   INTELLIGENT HERITAGE SEARCH
------------------------------------- */
/* =====================================
   STEP 22.5 — INTELLIGENT SEARCH
===================================== */

function normalizeSearchText(text) {
    return (text || "")
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


/* -------------------------------------
   SEARCH KEYWORDS
------------------------------------- */

const intelligentsearchKeywordMap = {

    fort: [
        "fort",
        "forts",
        "qila",
        "qile",
        "garh",
        "fortress"
    ],

    palace: [
        "palace",
        "palaces",
        "mahal",
        "royal"
    ],

    temple: [
        "temple",
        "temples",
        "mandir",
        "mandirs",
        "shrine"
    ],

    monument: [
        "monument",
        "monuments",
        "memorial",
        "architecture"
    ],

    nature: [
        "nature",
        "natural",
        "wildlife",
        "forest",
        "national park",
        "park",
        "lake",
        "waterfall",
        "hill",
        "hills",
        "mountain",
        "valley"
    ],

    culture: [
        "culture",
        "cultural",
        "tradition",
        "traditions",
        "festival",
        "festivals",
        "tribal"
    ]

};


/* -------------------------------------
   DETECT SEARCH CATEGORY
------------------------------------- */

function detectSearchCategory(query) {

    const text =
        normalizeSearchText(query);

    for (const category in intelligentsearchKeywordMap) {

        const keywords =
            intelligentsearchKeywordMap[category];

        for (const keyword of keywords) {

            if (
                text.includes(
                    normalizeSearchText(keyword)
                )
            ) {
                return category;
            }

        }

    }

    return null;
}


/* -------------------------------------
   GET SEARCH SCORE
------------------------------------- */

function getSearchScore(place, query) {

    const text =
        normalizeSearchText(query);

    const name =
        normalizeSearchText(place.name);

    const state =
        normalizeSearchText(place.state);

    const category =
        normalizeSearchText(place.category);

    let score = 0;


    /* Exact place name */

    if (name === text) {
        score += 100;
    }


    /* Place name contains query */

    if (name.includes(text)) {
        score += 70;
    }


    /* State contains query */

    if (state.includes(text)) {
        score += 50;
    }


    /* Category contains query */

    if (category.includes(text)) {
        score += 40;
    }


    /* Individual query words */

    const words =
        text.split(" ")
            .filter(word => word.length > 1);


    words.forEach(function (word) {

        if (name.includes(word)) {
            score += 25;
        }

        if (state.includes(word)) {
            score += 20;
        }

        if (category.includes(word)) {
            score += 15;
        }

    });


    /* Category intent */

    const detectedCategory =
        detectSearchCategory(query);


    if (detectedCategory) {

        const categoryKeywords =
            searchKeywordMap[detectedCategory];

        categoryKeywords.forEach(
            function (keyword) {

                if (
                    category.includes(
                        normalizeSearchText(keyword)
                    )
                ) {
                    score += 35;
                }

            }
        );

    }


    return score;
}


/* =====================================
   STEP 22.7 — ADVANCED RELEVANCE RANKING
===================================== */

function getAdvancedSearchScore(
    place,
    query,
    detectedState,
    detectedCategory
) {

    const name =
        normalizeSearchText(place.name);

    const state =
        normalizeSearchText(place.state);

    const category =
        normalizeSearchText(place.category);

    const text =
        name + " " +
        state + " " +
        category;

    let score = 0;

    /* ---------------------------------
       1. EXACT PLACE NAME
    --------------------------------- */

    if (name === query) {
        score += 200;
    }

    /* ---------------------------------
       2. PLACE NAME STARTS WITH QUERY
    --------------------------------- */

    if (
        query.length > 2 &&
        name.startsWith(query)
    ) {
        score += 100;
    }

    /* ---------------------------------
       3. PLACE NAME CONTAINS QUERY
    --------------------------------- */

    if (
        query.length > 2 &&
        name.includes(query)
    ) {
        score += 70;
    }

    /* ---------------------------------
       4. STATE MATCH
    --------------------------------- */

    if (detectedState) {

        const normalizedDetectedState =
            normalizeSearchText(
                detectedState
            );

        if (
            state ===
            normalizedDetectedState
        ) {
            score += 80;
        }
    }

    /* ---------------------------------
       5. CATEGORY MATCH
    --------------------------------- */

    if (detectedCategory) {

        const keywords =
            searchKeywordMap[
                detectedCategory
            ] || [];

        keywords.forEach(
            function (keyword) {

                const cleanKeyword =
                    normalizeSearchText(
                        keyword
                    );

                if (
                    category.includes(
                        cleanKeyword
                    )
                ) {
                    score += 60;
                }

            }
        );
    }

    /* ---------------------------------
       6. QUERY WORD MATCH
    --------------------------------- */

    const words =
        query
            .split(" ")
            .filter(function (word) {
                return word.length > 1;
            });

    words.forEach(
        function (word) {

            if (name.includes(word)) {
                score += 30;
            }

            if (state.includes(word)) {
                score += 20;
            }

            if (category.includes(word)) {
                score += 15;
            }

        }
    );

    /* ---------------------------------
       7. FULL TEXT MATCH
    --------------------------------- */

    if (
        query.length > 2 &&
        text.includes(query)
    ) {
        score += 20;
    }

    return score;
}
/* =====================================
   STEP 22.6 — NATURAL LANGUAGE SEARCH
===================================== */

function parseNaturalLanguageSearch(query) {

    const text = normalizeSearchText(query);

    let detectedState = null;
    let detectedCategory = null;

    /* ---------------------------------
       DETECT CATEGORY
    --------------------------------- */

    detectedCategory = detectSearchCategory(text);


    /* ---------------------------------
       DETECT STATE / UT
    --------------------------------- */

    const states =
        typeof getStates === "function"
            ? getStates()
            : Object.keys(INDIA_HERITAGE);


    states.forEach(function (state) {

        const normalizedState =
            normalizeSearchText(state);

        if (
            text.includes(normalizedState)
        ) {
            detectedState = state;
        }

    });


    /* ---------------------------------
       COMMON NATURAL LANGUAGE PATTERNS
    --------------------------------- */

    const wordsToIgnore = [
        "show",
        "me",
        "find",
        "give",
        "suggest",
        "suggestions",
        "famous",
        "best",
        "popular",
        "places",
        "place",
        "visit",
        "visiting",
        "to",
        "in",
        "near",
        "for",
        "the",
        "of"
    ];


    const cleanedWords =
        text
            .split(" ")
            .filter(function (word) {

                return (
                    word.length > 1 &&
                    !wordsToIgnore.includes(word)
                );

            });


    return {
        originalQuery: query,
        normalizedQuery: text,
        state: detectedState,
        category: detectedCategory,
        keywords: cleanedWords
    };
}
/* -------------------------------------
   INTELLIGENT HERITAGE SEARCH
------------------------------------- */

function searchHeritage() {

    if (!searchInput || !heritageResults) {
        return;
    }


    const rawQuery =
        searchInput.value.trim();


    const query =
        normalizeSearchText(rawQuery);


const naturalSearch =
    parseNaturalLanguageSearch(rawQuery);

const detectedState =
    naturalSearch.state;

const naturaldetectedCategory =
    naturalSearch.category;

    /* Empty search */
    
    if (!query) {

        heritageResults.innerHTML = "";
        return;

    }

    /* ---------------------------------
       DETECT INTENT
    --------------------------------- */
 const detectedCategory =
    detectSearchCategory(query);


    const allPlaces =
        getAllHeritagePlaces();


    /* ---------------------------------
       SEARCH PLACES
    --------------------------------- */

    let results =
        allPlaces
            .map(function (place) {

                const name =
                    normalizeSearchText(
                        place.name
                    );

                const state =
                    normalizeSearchText(
                        place.state
                    );

                const category =
                    normalizeSearchText(
                        place.category
                    );


            let score =
    getAdvancedSearchScore(
        place,
        query,
        detectedState,
        detectedCategory
    );


                /* Category intent */

                if (detectedCategory) {

                    const keywords =
                        searchKeywordMap[
                            detectedCategory
                        ] || [];


                    keywords.forEach(
                        function (keyword) {

                            const cleanKeyword =
                                normalizeSearchText(
                                    keyword
                                );


                            if (
                                category.includes(
                                    cleanKeyword
                                )
                            ) {
                                score += 50;
                            }

                        }
                    );

                }


                /* Token matching */

                const words =
                    query.split(" ")
                        .filter(
                            word => word.length > 1
                        );


                words.forEach(
                    function (word) {

                        if (
                            name.includes(word)
                        ) {
                            score += 20;
                        }

                        if (
                            state.includes(word)
                        ) {
                            score += 15;
                        }

                        if (
                            category.includes(word)
                        ) {
                            score += 10;
                        }

                    }
                );


                return {
                    ...place,
                    searchScore: score
                };

            })
            

            .filter(function (place) {

    if (
        detectedState &&
        normalizeSearchText(place.state) !==
        normalizeSearchText(detectedState)
    ) {
        return false;
    }

    return place.searchScore > 0;

})
            .sort(function (a, b) {

                return (
                    b.searchScore -
                    a.searchScore
                );

            })
            .slice(0, 30);


    /* ---------------------------------
       NO RESULTS
    --------------------------------- */

    if (!results.length) {

        heritageResults.innerHTML = `
            <div class="explore-empty">
                <div>😕</div>

                <h3>
                    No heritage place found
                </h3>

                <p>
                    Try Taj Mahal, Rajasthan forts,
                    famous temples, palace, nature
                    or culture.
                </p>
            </div>
        `;

        return;
    }


    /* ---------------------------------
       RESULTS
    --------------------------------- */

    heritageResults.innerHTML =
        results.map(
            function (place) {

                const score =
                    getRecommendation(
                        place.name,
                        place.category
                    );


                return `
                    <article
                        class="heritage-card">

                        <div
                            class="heritage-card-icon">

                            ${getIcon(
                                place.category
                            )}

                        </div>


                        <h3>
                            ${place.name}
                        </h3>


                        <p
                            class="heritage-card-location">

                            📍 ${place.state}

                        </p>


                        <span
                            class="heritage-category">

                            ${place.category}

                        </span>


                        <div
                            class="recommendation">

                            ⭐ ${score}%
                            Recommended

                        </div>


                        <div class="card-actions">

                            <button
                                onclick="viewHeritage(
                                    '${escapeQuotes(place.state)}',
                                    ${place.index}
                                )">

                                ✦ Explore

                            </button>


                            <button
                                onclick="saveHeritage(
                                    '${escapeQuotes(place.state)}',
                                    ${place.index}
                                )">

                                ♡ Save

                            </button>


                            <button
                                onclick="markPlaceVisitedByName(
                                    '${escapeQuotes(place.state)}',
                                    '${escapeQuotes(place.name)}'
                                )">

                                ✅ Visited

                            </button>

                        </div>

                    </article>
                `;

            }
        ).join("");

}

    


/* -------------------------------------
   ENTER KEY SEARCH
------------------------------------- */

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                searchHeritage();

            }

        }
    );

}


/* -------------------------------------
   LIVE SEARCH
------------------------------------- */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            const value =
                searchInput.value.trim();

            if (value.length >= 2) {

                searchHeritage();

            }

        }
    );

}


/* -------------------------------------
   POPULAR SEARCH BUTTONS
------------------------------------- */

const popularSearchButtons =
    document.querySelectorAll(
        ".popular-search"
    );


popularSearchButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const searchValue =
                    button.dataset.search;

                if (!searchInput) {
                    return;
                }

                searchInput.value =
                    searchValue;

                searchHeritage();

                searchInput.focus();

            }
        );

    }
);

/* =====================================
   STEP 22.3 — VOICE HERITAGE SEARCH
===================================== */

const heritageVoiceBtn =
    document.getElementById("heritageVoiceBtn");


/* -------------------------------------
   CHECK BROWSER VOICE SUPPORT
------------------------------------- */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


/* -------------------------------------
   VOICE SEARCH
------------------------------------- */

if (
    heritageVoiceBtn &&
    SpeechRecognition
) {

    const recognition =
        new SpeechRecognition();


    /* Language */

    recognition.lang = "en-IN";


    /* One search at a time */

    recognition.continuous = false;


    /* Return final result */

    recognition.interimResults = false;


    /* ---------------------------------
       MIC BUTTON CLICK
    --------------------------------- */

    heritageVoiceBtn.addEventListener(
        "click",
        function () {

            recognition.start();

            heritageVoiceBtn.classList.add(
                "listening"
            );

            heritageVoiceBtn.innerHTML = "🔴";

            heritageVoiceBtn.title =
                "Listening... Speak now";

        }
    );


    /* ---------------------------------
       VOICE RESULT
    --------------------------------- */

    recognition.addEventListener(
        "result",
        function (event) {

            const transcript =
                event.results[0][0]
                    .transcript
                    .trim();


            if (!searchInput) {
                return;
            }


            /* Put voice text into search */

            searchInput.value =
                transcript;


            /* Automatically search */

            searchHeritage();

        }
    );


    /* ---------------------------------
       VOICE END
    --------------------------------- */

    recognition.addEventListener(
        "end",
        function () {

            heritageVoiceBtn.classList.remove(
                "listening"
            );

            heritageVoiceBtn.innerHTML = "🎙️";

            heritageVoiceBtn.title =
                "Search by voice";

        }
    );


    /* ---------------------------------
       VOICE ERROR
    --------------------------------- */

    recognition.addEventListener(
        "error",
        function (event) {

            heritageVoiceBtn.classList.remove(
                "listening"
            );

            heritageVoiceBtn.innerHTML = "🎙️";

            heritageVoiceBtn.title =
                "Search by voice";


            if (
                event.error ===
                "not-allowed"
            ) {

                alert(
                    "Microphone permission is required for voice search."
                );

                return;

            }


            if (
                event.error ===
                "no-speech"
            ) {

                alert(
                    "No speech detected. Please try again."
                );

                return;

            }


            alert(
                "Voice search could not start. Please try again."
            );

        }
    );

}


/* -------------------------------------
   BROWSER DOES NOT SUPPORT VOICE SEARCH
------------------------------------- */

else if (heritageVoiceBtn) {

    heritageVoiceBtn.addEventListener(
        "click",
        function () {

            alert(
                "Voice search is not supported in this browser. Please use Google Chrome or Microsoft Edge."
            );

        }
    );

}



    /* ------------------------------

    /* =====================================
       SCROLL ANIMATION
    ===================================== */

    const revealElements =
        document.querySelectorAll(
            ".culture-card, .video-card, .heritage-feature, .planner-step"
        );


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translateY(0)";

                        }

                    }
                );

            },
            {
                threshold: 0.1
            }
        );


    revealElements.forEach(
        function (element) {

            element.style.opacity = "0";

            element.style.transform =
                "translateY(20px)";

            element.style.transition =
                "opacity .6s ease, transform .6s ease";

            observer.observe(element);

        }
    );


    /* =====================================
       HELPERS
    ===================================== */

    window.escapeQuotes =
        function (text) {

            return text
                .replace(/\\/g, "\\\\")
                .replace(/'/g, "\\'");

        };


    /* =====================================
       EXPOSE FUNCTIONS
    ===================================== */
/* =========================================
   3D HERITAGE VIEWER
========================================= */

let current3DPlace = null;

let autoRotateEnabled = true;


/* =========================================
   PLACE DESCRIPTION
========================================= */

function getHeritageDescription(name) {

    const descriptions = {

        "Taj Mahal":
            "Agra ka Taj Mahal Mughal architecture ka ek iconic monument hai. Iski white marble architecture, symmetry aur intricate decoration ise duniya ke sabse famous heritage landmarks mein shamil karti hai.",

        "Hawa Mahal":
            "Jaipur ka Hawa Mahal apni distinctive honeycomb-style windows aur Rajput architecture ke liye famous hai. Iska facade Jaipur ke historic cityscape ki ek iconic pehchaan hai.",

        "Amber Fort":
            "Amber Fort Jaipur ke paas sthit ek magnificent hill fort hai. Rajput aur Mughal architectural influences iske palaces, courtyards aur decorative details mein dekhe ja sakte hain.",

        "Red Fort":
            "Delhi ka Red Fort Mughal-era architecture aur Indian history ka ek important landmark hai. Iski massive red sandstone walls ise Delhi ke most recognizable heritage sites mein banati hain.",

        "Mysore Palace":
            "Mysore Palace apni grand architecture, ornamental interiors aur royal heritage ke liye famous hai. Evening illumination ke time iska appearance especially spectacular hota hai.",

        "Golden Temple":
            "Amritsar ka Golden Temple Sikh heritage ka ek major spiritual aur architectural landmark hai. Sarovar aur golden facade iska distinctive visual character create karte hain.",

        "Hampi":
            "Hampi Vijayanagara Empire ke spectacular archaeological remains ke liye famous hai. Temples, stone structures aur dramatic landscape ise unique heritage destination banate hain.",

        "Konark Sun Temple":
            "Konark Sun Temple Odisha ki extraordinary temple architecture ka example hai. Iska design Surya ke celestial chariot se inspired hai aur intricate stone carvings ke liye famous hai.",

        "Khajuraho":
            "Khajuraho group of monuments apni remarkable temple architecture aur detailed stone sculptures ke liye world famous hai.",

        "Ajanta Caves":
            "Ajanta Caves ancient Buddhist rock-cut architecture aur paintings ke liye famous hain. Ye Indian art history ke important archaeological sites mein se ek hain."

    };


    return descriptions[name] ||
        `${name} ${"India ke rich cultural aur heritage landscape ka ek important destination hai. Yahan visitors architecture, history, traditions aur local culture ko explore kar sakte hain."}`;

}


/* =========================================
   MODEL FILE NAME
========================================= */

function getModelPath(name) {

    const slug = name

        .toLowerCase()

        .replace(/['’]/g, "")

        .replace(/[^a-z0-9]+/g, "-")

        .replace(/^-|-$/g, "");


    return `assets/models/${slug}.glb`;

}


/* =========================================
   OPEN 3D VIEWER
========================================= */

window.viewHeritage = function (
    state,
    index
) {

    const place =
        INDIA_HERITAGE[state][index];


    current3DPlace = {

        state: state,

        index: index,

        name: place[0],

        category: place[1],

        lat: place[2],

        lng: place[3]

    };


    const modal =
        document.getElementById(
            "heritage3DModal"
        );


    const model =
        document.getElementById(
            "heritageModel"
        );


    const title =
        document.getElementById(
            "modelTitle"
        );


    const category =
        document.getElementById(
            "modelCategory"
        );


    const location =
        document.getElementById(
            "modelLocation"
        );


    const description =
        document.getElementById(
            "modelDescription"
        );


    const recommendation =
        document.getElementById(
            "modelRecommendation"
        );


    const loading =
        document.getElementById(
            "modelLoading"
        );


    const fallback =
        document.getElementById(
            "modelFallback"
        );


    /* -------------------------
       TEXT
    ------------------------- */

    title.textContent =
        place[0];


    category.textContent =
        place[1];


    location.textContent =
        `📍 ${state}`;


    description.textContent =
        getHeritageDescription(
            place[0]
        );


    let score = 90;


    const popular = [

        "Taj Mahal",
        "Hawa Mahal",
        "Amber Fort",
        "Hampi",
        "Golden Temple",
        "Red Fort",
        "Mysore Palace",
        "Ajanta Caves",
        "Ellora Caves",
        "Konark Sun Temple"

    ];


    if (
        popular.includes(place[0])
    ) {

        score = 96;

    }


    recommendation.textContent =
        `⭐ ${score}% Recommended`;


    /* -------------------------
       RESET
    ------------------------- */

    loading.classList.remove(
        "hidden"
    );


    fallback.classList.remove(
        "active"
    );


    model.style.display =
        "block";


    model.removeAttribute(
        "src"
    );


    /* -------------------------
       OPEN MODAL
    ------------------------- */

    modal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";


    /* -------------------------
       LOAD MODEL
    ------------------------- */

    const modelPath =
        getModelPath(place[0]);


    model.src =
        modelPath;


    model.addEventListener(
        "load",
        function handleLoad() {

            loading.classList.add(
                "hidden"
            );

            fallback.classList.remove(
                "active"
            );

            model.style.display =
                "block";

            model.removeEventListener(
                "load",
                handleLoad
            );

        }
    );


    model.addEventListener(
        "error",
        function handleError() {

            loading.classList.add(
                "hidden"
            );

            model.style.display =
                "none";

            fallback.classList.add(
                "active"
            );

            model.removeEventListener(
                "error",
                handleError
            );

        }
    );


    /* -------------------------
       SAVE BUTTON
    ------------------------- */

    document
        .getElementById("save3DBtn")
        .onclick = function () {

            saveHeritage(
                state,
                index
            );

        };


    /* -------------------------
       JOURNEY BUTTON
    ------------------------- */

    document
        .getElementById("journey3DBtn")
        .onclick = function () {

            addToYatra(
                current3DPlace
            );

        };

};


/* =========================================
   CLOSE VIEWER
========================================= */

window.close3DViewer = function () {

    const modal =
        document.getElementById(
            "heritage3DModal"
        );


    modal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

};


/* =========================================
   RESET CAMERA
========================================= */

window.reset3DView = function () {

    const model =
        document.getElementById(
            "heritageModel"
        );


    if (!model) return;


    model.cameraOrbit =
        "0deg 75deg 105%";


    model.fieldOfView =
        "45deg";

};


/* =========================================
   AUTO ROTATE
========================================= */

window.toggleAutoRotate = function () {

    const model =
        document.getElementById(
            "heritageModel"
        );


    if (!model) return;


    autoRotateEnabled =
        !autoRotateEnabled;


    if (
        autoRotateEnabled
    ) {

        model.setAttribute(
            "auto-rotate",
            ""
        );

    } else {

        model.removeAttribute(
            "auto-rotate"
        );

    }

};


/* =========================================
   ADD TO YATRA
========================================= */

function addToYatra(place) {

    let journey =
        JSON.parse(
            localStorage.getItem(
                "yatra_journey"
            ) || "[]"
        );


    const exists =
        journey.some(
            function (item) {

                return (
                    item.name === place.name &&
                    item.state === place.state
                );

            }
        );


    if (exists) {

        alert(
            "🧭 This place is already in your Yatra."
        );

        return;

    }


    if (journey.length >= 4) {

        alert(
            "You can add maximum 4 places to one Yatra."
        );

        return;

    }


    journey.push(place);


    localStorage.setItem(
        "yatra_journey",
        JSON.stringify(journey)
    );

    renderMyJourneys();

    alert(
        `🧭 ${place.name} added to My Yatra!`
    );

}


/* =========================================
   VIDEO
========================================= */

window.openHeritageVideo = function () {

    if (!current3DPlace) return;


    const searchQuery =
        encodeURIComponent(
            current3DPlace.name +
            " " +
            current3DPlace.state +
            " heritage"
        );


    window.open(
        `https://www.youtube.com/results?search_query=${searchQuery}`,
        "_blank"
    );

};


/* =========================================
   ESC KEY
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            close3DViewer();

        }

    }
);


    window.saveHeritage =
        function (state, index) {

            const place =
                INDIA_HERITAGE[state][index];


            let saved =
                JSON.parse(
                    localStorage.getItem(
                        "yatra_saved"
                    ) || "[]"
                );


            const exists =
                saved.some(
                    function (item) {

                        return (
                            item.name === place[0] &&
                            item.state === state
                        );

                    }
                );


            if (exists) {

                alert(
                    "❤️ " +
                    place[0] +
                    " is already saved."
                );

                return;

            }


            saved.push({

                name: place[0],

                state: state,

                category: place[1],

                lat: place[2],

                lng: place[3]

            });


            localStorage.setItem(
                "yatra_saved",
                JSON.stringify(saved)
            );


            alert(
                "❤️ " +
                place[0] +
                " saved successfully!"
            );

        };


    console.log(
        "🇮🇳 Yatra Drishti Step 2 loaded successfully."
    );

});
/* =========================================
   STEP 4
   CULTURE ENGINE
========================================= */


/* =========================================
   RENDER CULTURE CATEGORIES
========================================= */

function renderCultureCategories() {

    const box =
        document.getElementById(
            "cultureCategories"
        );

    if (!box) return;


    box.innerHTML =
        CULTURE_CATEGORIES.map(
            function(category) {

                return `

                    <div
                        class="culture-category-card"
                        onclick="filterCultureCategory('${category.name}')">

                        <div
                            class="culture-category-icon">

                            ${category.icon}

                        </div>

                        <h3>
                            ${category.name}
                        </h3>

                        <p>
                            ${category.description}
                        </p>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================
   RENDER CULTURE VIDEOS
========================================= */

function renderCultureVideos(
    list = CULTURE_DATA
) {

    const box =
        document.getElementById(
            "cultureVideoGrid"
        );

    if (!box) return;


    if (!list.length) {

        box.innerHTML = `

            <div class="empty"
                 style="grid-column:1/-1">

                No culture experience found.

            </div>

        `;

        return;

    }


    box.innerHTML =
        list.map(
            function(item) {

                return `

                <div
                    class="culture-video-card">


                    <div
                        class="culture-video-thumbnail">

                        <div
                            class="video-big-icon">

                            ${item.icon}

                        </div>


                        <button
                            class="video-play"
                            onclick="openCultureVideo(${item.id})">

                            ▶

                        </button>

                    </div>


                    <div
                        class="culture-video-content">


                        <h3>
                            ${item.title}
                        </h3>


                        <p>
                            ${item.description}
                        </p>


                        <div
                            class="culture-video-meta">

                            <span
                                class="culture-tag">

                                ${item.category}

                            </span>


                            <span
                                class="culture-state">

                                📍 ${item.state}

                            </span>

                        </div>

                    </div>

                </div>

                `;

            }
        ).join("");

}


/* =========================================
   SEARCH CULTURE
========================================= */

window.searchCulture = function(query) {

    const q =
        query.toLowerCase().trim();


    if (!q) {

        renderCultureVideos(
            CULTURE_DATA
        );

        return;

    }


    const results =
        CULTURE_DATA.filter(
            function(item) {

                const searchable = (

                    item.title +
                    " " +
                    item.category +
                    " " +
                    item.state +
                    " " +
                    item.description +
                    " " +
                    item.tags.join(" ")

                ).toLowerCase();


                return searchable.includes(q);

            }
        );


    renderCultureVideos(results);

};


/* =========================================
   CATEGORY FILTER
========================================= */

window.filterCultureCategory =
    function(category) {

        const results =
            CULTURE_DATA.filter(
                function(item) {

                    return (
                        item.category ===
                        category
                    );

                }
            );


        renderCultureVideos(
            results
        );


        const videoSection =
            document.getElementById(
                "cultureVideos"
            );


        if (videoSection) {

            videoSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    };


/* =========================================
   OPEN VIDEO
========================================= */

window.openCultureVideo =
    function(id) {

        const item =
            CULTURE_DATA.find(
                function(x) {

                    return x.id === id;

                }
            );


        if (!item) return;


        document.getElementById(
            "cultureVideoCategory"
        ).textContent =
            item.category;


        document.getElementById(
            "cultureVideoTitle"
        ).textContent =
            item.title;


        document.getElementById(
            "cultureVideoDescription"
        ).textContent =
            item.description;


        document.getElementById(
            "cultureVideoContainer"
        ).innerHTML = `

            <iframe
                src="${item.video}"
                title="${item.title}"
                allow="accelerometer;
                autoplay;
                clipboard-write;
                encrypted-media;
                gyroscope;
                picture-in-picture;
                web-share"
                allowfullscreen>
            </iframe>

        `;


        document.getElementById(
            "cultureVideoModal"
        ).classList.add(
            "active"
        );


        document.body.style.overflow =
            "hidden";

    };


/* =========================================
   CLOSE VIDEO
========================================= */

window.closeCultureVideo =
    function() {

        const modal =
            document.getElementById(
                "cultureVideoModal"
            );


        const container =
            document.getElementById(
                "cultureVideoContainer"
            );


        modal.classList.remove(
            "active"
        );


        container.innerHTML =
            "";


        document.body.style.overflow =
            "";

    };


/* =========================================
   LANGUAGE
========================================= */

let selectedLanguage =
    localStorage.getItem(
        "yd_language"
    ) || "English";


window.changeLanguage =
    function(language, button) {

        selectedLanguage =
            language;


        localStorage.setItem(
            "yd_language",
            language
        );


        document
            .querySelectorAll(
                ".language-btn"
            )
            .forEach(
                function(btn) {

                    btn.classList.remove(
                        "active"
                    );

                }
            );


        if (button) {

            button.classList.add(
                "active"
            );

        }


        updateCultureLanguage(
            language
        );


        showLanguageToast(
            language
        );

    };


/* =========================================
   BASIC LANGUAGE UI
========================================= */

function updateCultureLanguage(
    language
) {

    const heading =
        document.querySelector(
            ".culture-heading h2"
        );


    if (!heading) return;


    const translations = {

        English:
            "India's Living Culture",

        Hindi:
            "भारत की जीवंत संस्कृति",

        Bengali:
            "ভারতের জীবন্ত সংস্কৃতি",

        Tamil:
            "இந்தியாவின் வாழும் கலாச்சாரம்",

        Telugu:
            "భారతదేశ సజీవ సంస్కృతి",

        Marathi:
            "भारताची जिवंत संस्कृती"

    };


    heading.textContent =
        translations[language] ||
        translations.English;

}


/* =========================================
   LANGUAGE TOAST
========================================= */

function showLanguageToast(
    language
) {

    if (
        typeof toast === "function"
    ) {

        toast(
            `🌐 Language changed to ${language}`
        );

    }

}


/* =========================================
   RANDOM CULTURE FACT
========================================= */

window.showRandomCultureFact =
    function() {

        const fact =
            CULTURE_FACTS[
                Math.floor(
                    Math.random() *
                    CULTURE_FACTS.length
                )
            ];


        document.getElementById(
            "cultureFactTitle"
        ).textContent =
            fact.title;


        document.getElementById(
            "cultureFactText"
        ).textContent =
            fact.text;

    };


/* =========================================
   SCROLL TO VIDEOS
========================================= */

window.scrollToCultureVideos =
    function() {

        const section =
            document.getElementById(
                "cultureVideos"
            );


        if (section) {

            section.scrollIntoView({
                behavior: "smooth"
            });

        }

    };


/* =========================================
   INITIALIZE CULTURE
========================================= */

function initializeCulture() {

    renderCultureCategories();

    renderCultureVideos(
        CULTURE_DATA
    );


    /* Restore language */

    const savedLanguage =
        localStorage.getItem(
            "yd_language"
        );


    if (savedLanguage) {

        selectedLanguage =
            savedLanguage;


        document
            .querySelectorAll(
                ".language-btn"
            )
            .forEach(
                function(btn) {

                    if (
                        btn.textContent
                            .toLowerCase()
                            .includes(
                                savedLanguage
                                    .toLowerCase()
                            )
                    ) {

                        btn.classList.add(
                            "active"
                        );

                    } else {

                        btn.classList.remove(
                            "active"
                        );

                    }

                }
            );

    }

}


/* =========================================
   RUN WHEN PAGE LOADS
========================================= */

window.addEventListener(
    "load",
    function() {

        setTimeout(
            initializeCulture,
            300
        );

    }
);
/* =====================================================
   STEP 5 — AI HERITAGE GUIDE
   YATRA DRISHTI
===================================================== */

let aiSelectedInterests = [];


/* =====================================================
   INITIALIZE AI GUIDE
===================================================== */

function initializeAIGuide() {

    const stateSelect =
        document.getElementById("aiState");

    if (!stateSelect) {
        console.warn("AI State selector not found.");
        return;
    }

    if (typeof INDIA_HERITAGE === "undefined") {
        console.error("INDIA_HERITAGE is not loaded.");
        return;
    }

    /* Clear old options */

    stateSelect.innerHTML =
        '<option value="">Select State / UT</option>';


    /* Add all States / UTs */

    Object.keys(INDIA_HERITAGE)
        .sort()
        .forEach(function(state) {

            const option =
                document.createElement("option");

            option.value = state;
            option.textContent = state;

            stateSelect.appendChild(option);

        });


    /* Interest buttons */

    document
        .querySelectorAll(".interest-btn")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const interest =
                        button.dataset.interest;

                    if (!interest) return;


                    if (
                        aiSelectedInterests
                            .includes(interest)
                    ) {

                        aiSelectedInterests =
                            aiSelectedInterests.filter(
                                function(item) {
                                    return item !== interest;
                                }
                            );

                        button.classList
                            .remove("active");

                    } else {

                        aiSelectedInterests.push(
                            interest
                        );

                        button.classList
                            .add("active");

                    }

                }
            );

        });


    console.log(
        "🇮🇳 AI Heritage Guide initialized successfully."
    );

}


/* =====================================================
   GET AI RECOMMENDATIONS
===================================================== */

function getAIRecommendations(
    state,
    interests
) {

    if (
        !INDIA_HERITAGE[state]
    ) {
        return [];
    }


    const places =
        INDIA_HERITAGE[state];


    /* Convert array data into objects */

    const convertedPlaces =
        places.map(function(place) {

            return {

                name: place[0],

                category: place[1],

                lat: place[2],

                lng: place[3],

                state: state

            };

        });


    /* If no interests */

    if (!interests.length) {

        return convertedPlaces
            .slice(0, 6);

    }


    /* Keywords */

    const keywords = {

        architecture: [
            "fort",
            "palace",
            "architecture",
            "monument",
            "city",
            "mahal"
        ],

        temples: [
            "temple",
            "mandir",
            "shrine"
        ],

        culture: [
            "culture",
            "heritage",
            "village",
            "museum",
            "tribal"
        ],

        nature: [
            "nature",
            "lake",
            "falls",
            "valley",
            "wildlife",
            "park",
            "hill",
            "mountain"
        ],

        food: [
            "city",
            "culture",
            "heritage"
        ],

        history: [
            "fort",
            "palace",
            "caves",
            "stupa",
            "museum",
            "monument",
            "ancient",
            "historic"
        ]

    };


    /* Score places */

    const scored =
        convertedPlaces.map(function(place) {

            const text =
                (
                    place.name +
                    " " +
                    place.category
                ).toLowerCase();


            let score = 0;


            interests.forEach(
                function(interest) {

                    const words =
                        keywords[interest] || [];


                    words.forEach(
                        function(word) {

                            if (
                                text.includes(
                                    word.toLowerCase()
                                )
                            ) {

                                score += 10;

                            }

                        }
                    );

                }
            );


            return {

                ...place,

                aiScore: score

            };

        });


    return scored
        .sort(function(a, b) {

            return b.aiScore -
                   a.aiScore;

        })
        .slice(0, 8);

}


/* =====================================================
   DETECT INTERESTS FROM USER QUERY
===================================================== */

function detectInterestsFromQuery(query) {

    if (!query) return;


    const text =
        query.toLowerCase();


    const detectionMap = {

        architecture: [
            "fort",
            "palace",
            "architecture",
            "mahal",
            "किला",
            "महल"
        ],

        temples: [
            "temple",
            "mandir",
            "temples",
            "मंदिर"
        ],

        culture: [
            "culture",
            "cultural",
            "tradition",
            "heritage",
            "संस्कृति"
        ],

        nature: [
            "nature",
            "lake",
            "waterfall",
            "mountain",
            "valley",
            "प्रकृति"
        ],

        food: [
            "food",
            "cuisine",
            "khana",
            "खाना"
        ],

        history: [
            "history",
            "historical",
            "ancient",
            "historic",
            "इतिहास"
        ]

    };


    Object.keys(detectionMap)
        .forEach(function(interest) {

            const found =
                detectionMap[interest]
                    .some(function(word) {

                        return text.includes(word);

                    });


            if (
                found &&
                !aiSelectedInterests
                    .includes(interest)
            ) {

                aiSelectedInterests
                    .push(interest);


                const button =
                    document.querySelector(
                        `.interest-btn[data-interest="${interest}"]`
                    );


                if (button) {

                    button.classList
                        .add("active");

                }

            }

        });

}


/* =====================================================
   GENERATE AI TRIP
===================================================== */

function generateAITrip() {

    try {

        const stateElement =
            document.getElementById(
                "aiState"
            );

        const durationElement =
            document.getElementById(
                "aiDuration"
            );

        const budgetElement =
            document.getElementById(
                "aiBudget"
            );

        const travelElement =
            document.getElementById(
                "aiTravelMode"
            );

        const queryElement =
            document.getElementById(
                "aiQuery"
            );


        if (!stateElement) {

            alert(
                "AI Guide is not initialized."
            );

            return;

        }


        const state =
            stateElement.value;


        const duration =
            parseInt(
                durationElement.value
            ) || 1;


        const budget =
            parseInt(
                budgetElement.value
            ) || 5000;


        const travelMode =
            travelElement.value;


        const query =
            queryElement.value.trim();


        /* State validation */

        if (!state) {

            alert(
                "Please select a State / UT first."
            );

            return;

        }


        /* Detect interests */

        detectInterestsFromQuery(
            query
        );


        /* Get recommendations */

        const recommendations =
            getAIRecommendations(
                state,
                aiSelectedInterests
            
            );


        if (!recommendations.length) {

            alert(
                "No heritage places found."
            );

            return;

        }


        /* Number of places */

        const numberOfPlaces =
            Math.min(
                Math.max(
                    duration * 2,
                    2
                ),
                recommendations.length
            );


        const tripPlaces =
            recommendations.slice(
                0,
                numberOfPlaces
            );


        renderAITrip(
            state,
            duration,
            budget,
            travelMode,
            tripPlaces
        );


    } catch (error) {

        console.error(
            "AI Trip Error:",
            error
        );


        alert(
            "Something went wrong while creating your Yatra."
        );

    }

}


/* =====================================================
   RENDER AI TRIP
===================================================== */

function renderAITrip(
    state,
    duration,
    budget,
    travelMode,
    places
) {

    const container =
        document.getElementById(
            "aiResult"
        );


    if (!container) {

        console.error(
            "aiResult container not found."
        );

        return;

    }


    let html = "";


    html += `

        <div class="trip-summary">

            <div>
                <span>📍 Destination</span>
                <strong>${state}</strong>
            </div>

            <div>
                <span>📅 Duration</span>
                <strong>${duration} Days</strong>
            </div>

            <div>
                <span>💰 Budget</span>
                <strong>₹${budget.toLocaleString("en-IN")}</strong>
            </div>

            <div>
                <span>🚗 Travel</span>
                <strong>${travelMode}</strong>
            </div>

        </div>


        <div class="ai-trip-heading">

            <span>✨ AI RECOMMENDED</span>

            <h2>
                Your ${state} Heritage Yatra
            </h2>

            <p>
                Personalized according to your
                interests and travel preferences.
            </p>

        </div>

    `;


    places.forEach(
        function(place, index) {

            const day =
                (index % duration) + 1;


            html += `

                <div class="itinerary-day">

                    <div class="day-number">
                        Day ${day}
                    </div>

                    <div class="place-recommendation">

    <div class="place-icon">
        🏛️
    </div>

    <div class="place-info">

        <h4>
            ${place.name}
        </h4>

        <span>
            ${place.category}
        </span>

        <p>
            Explore this destination
            and discover its heritage,
            culture and history.
        </p>

        <button
            class="ai-navigate-btn"
            onclick="navigateAIPlace(
                '${place.state}',
                ${place.originalIndex || 0}
            )">

            🧭 Navigate from My Location

        </button>

    </div>

</div>

                </div>

            `;

        }
    );


    html += `

        <div class="ai-actions">

            <button
                class="ai-action-btn primary"
                id="saveAIPlacesBtn">

                ❤️ Save Places

            </button>


            <button
                class="ai-action-btn"
                id="addAIJourneyBtn">

                🗺️ Add to My Journey

            </button>

        </div>

    `;


    container.innerHTML =
        html;


    container.classList.add(
        "show"
    );


    /* Save button */

    const saveButton =
        document.getElementById(
            "saveAIPlacesBtn"
        );


    if (saveButton) {

        saveButton.onclick =
            function() {

                saveAIRecommendations(
                    places
                );

            };

    }


    /* Journey button */

    const journeyButton =
        document.getElementById(
            "addAIJourneyBtn"
        );


    if (journeyButton) {

        journeyButton.onclick =
            function() {

                addAIPlacesToJourney(
                    places
                );

            };

    }


    container.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =====================================================
   SAVE AI RECOMMENDATIONS
===================================================== */

function saveAIRecommendations(
    places
) {

    if (!Array.isArray(places)) {
        return;
    }


    let savedPlaces =
        JSON.parse(
            localStorage.getItem(
                "yatra_saved"
            ) || "[]"
        );


    places.forEach(
        function(place) {

            const exists =
                savedPlaces.some(
                    function(item) {

                        return (
                            item.name ===
                                place.name &&
                            item.state ===
                                place.state
                        );

                    }
                );


            if (!exists) {

                savedPlaces.push(place);

            }

        }
    );


    localStorage.setItem(
        "yatra_saved",
        JSON.stringify(
            savedPlaces
        )
    );


    alert(
        `❤️ ${places.length} places saved successfully!`
    );

}


/* =====================================================
   ADD AI PLACES TO MY YATRA
===================================================== */

function addAIPlacesToJourney(
    places
) {

    if (!Array.isArray(places)) {
        return;
    }


    let journey =
        JSON.parse(
            localStorage.getItem(
                "yatra_journey"
            ) || "[]"
        );


    places.forEach(
        function(place) {

            if (
                journey.length >= 4
            ) {
                return;
            }


            const exists =
                journey.some(
                    function(item) {

                        return (
                            item.name ===
                                place.name &&
                            item.state ===
                                place.state
                        );

                    }
                );


            if (!exists) {

                journey.push(place);

            }

        }
    );

    localStorage.setItem(
    "yatra_journey",
    JSON.stringify(journey)
);

renderMyJourneys();

alert(
    "🗺️ Places added to My Yatra!"
);
}
/* =====================================================
   INITIALIZE AI GUIDE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        initializeAIGuide();

    }
);
/* =====================================================
   STEP 6 — SMART NAVIGATION
   CURRENT LOCATION → HERITAGE DESTINATION
===================================================== */

let userCurrentLocation = null;


/* =====================================================
   INITIALIZE NAVIGATION
===================================================== */

function initializeNavigation() {

    const destinationSelect =
        document.getElementById(
            "navigationDestination"
        );

    if (!destinationSelect) {
        return;
    }

    if (
        typeof INDIA_HERITAGE ===
        "undefined"
    ) {

        console.error(
            "INDIA_HERITAGE is not loaded."
        );

        return;
    }


    destinationSelect.innerHTML =
        `
        <option value="">
            Choose Heritage Destination
        </option>
        `;


    /*
       Add every heritage destination
    */

    Object.keys(
        INDIA_HERITAGE
    )
    .forEach(function(state) {

        const places =
            INDIA_HERITAGE[state];


        const group =
            document.createElement(
                "optgroup"
            );

        group.label =
            state;


        places.forEach(
            function(place, index) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    `${state}|${index}`;


                option.textContent =
                    place[0];


                group.appendChild(
                    option
                );

            }
        );


        destinationSelect.appendChild(
            group
        );

    });


    console.log(
        "🧭 Step 6 Smart Navigation initialized."
    );
}


/* =====================================================
   GET CURRENT LOCATION
===================================================== */

function getMyCurrentLocation() {

    const status =
        document.getElementById(
            "navigationStatus"
        );


    if (!navigator.geolocation) {

        if (status) {

            status.innerHTML =
                "❌ Your browser does not support location services.";

        }

        return;

    }


    if (status) {

        status.innerHTML =
            "📍 Detecting your current location...";

    }


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude =
                position.coords.latitude;


            const longitude =
                position.coords.longitude;


            userCurrentLocation = {

                lat: latitude,

                lng: longitude

            };


            if (status) {

                status.innerHTML =

                    "✅ Current location detected.<br>" +

                    "Latitude: " +
                    latitude.toFixed(5) +

                    " | Longitude: " +
                    longitude.toFixed(5);

            }


            console.log(
                "📍 Current Location:",
                userCurrentLocation
            );

        },


        function(error) {

            console.error(
                "Location Error:",
                error
            );


            let message =
                "❌ Unable to detect your location.";


            if (
                error.code ===
                error.PERMISSION_DENIED
            ) {

                message =
                    "❌ Location permission denied. Please allow location access in your browser.";

            }


            if (
                error.code ===
                error.POSITION_UNAVAILABLE
            ) {

                message =
                    "❌ Your location is currently unavailable.";

            }


            if (
                error.code ===
                error.TIMEOUT
            ) {

                message =
                    "❌ Location request timed out. Please try again.";

            }


            if (status) {

                status.textContent =
                    message;

            }

        },


        {
            enableHighAccuracy: true,

            timeout: 15000,

            maximumAge: 0

        }

    );

}


/* =====================================================
   NAVIGATE TO DESTINATION
===================================================== */

function navigateToSelectedDestination() {

    const destinationSelect =
        document.getElementById(
            "navigationDestination"
        );


    const travelModeSelect =
        document.getElementById(
            "navigationTravelMode"
        );


    const status =
        document.getElementById(
            "navigationStatus"
        );


    if (!destinationSelect) {
        return;
    }


    const selectedValue =
        destinationSelect.value;


    if (!selectedValue) {

        if (status) {

            status.textContent =
                "⚠️ Please select a heritage destination first.";

        }

        return;

    }


    /*
       Get current location
    */

    if (!userCurrentLocation) {

        if (status) {

            status.innerHTML =
                "📍 First detect your current location...";

        }


        getMyCurrentLocation();


        /*
           Don't open map yet because
           location permission is asynchronous.
        */

        return;

    }


    /*
       Read selected destination
    */

    const parts =
        selectedValue.split("|");


    const state =
        parts[0];


    const index =
        parseInt(parts[1]);


    const place =
        INDIA_HERITAGE[state][index];


    if (!place) {

        if (status) {

            status.textContent =
                "❌ Destination could not be found.";

        }

        return;

    }


    const destinationName =
        place[0];


    const destinationLat =
        place[2];


    const destinationLng =
        place[3];


    const travelMode =
        travelModeSelect.value;


    /*
       Google Maps Directions URL
    */

    const origin =
        userCurrentLocation.lat +
        "," +
        userCurrentLocation.lng;


    const destination =
        destinationLat +
        "," +
        destinationLng;


    const googleMapsURL =
        "https://www.google.com/maps/dir/?api=1" +

        "&origin=" +
        encodeURIComponent(
            origin
        ) +

        "&destination=" +
        encodeURIComponent(
            destination
        ) +

        "&travelmode=" +
        encodeURIComponent(
            travelMode
        );
function navigateAIPlace(
    state,
    index
) {

    navigateToPlace(
        state,
        index,
        "driving"
    );

}

    /*
       Status
    */

    if (status) {

        status.innerHTML =
            "🧭 Opening Google Maps for <strong>" +
            destinationName +
            "</strong>...";

    }


    /*
       Open Google Maps
    */

    window.open(
        googleMapsURL,
        "_blank"
    );

}


/* =====================================================
   NAVIGATE DIRECTLY FROM AI RESULT
===================================================== */

function navigateToPlace(
    state,
    index,
    travelMode = "driving"
) {

    if (
        !INDIA_HERITAGE[state]
    ) {
        return;
    }


    const place =
        INDIA_HERITAGE[state][index];


    if (!place) {
        return;
    }


    /*
       If current location
       not detected, detect it first.
    */

    if (!userCurrentLocation) {

        getMyCurrentLocation();


        alert(
            "📍 Please allow location access and then click Navigate again."
        );


        return;

    }


    const origin =
        userCurrentLocation.lat +
        "," +
        userCurrentLocation.lng;


    const destination =
        place[2] +
        "," +
        place[3];


    const url =
        "https://www.google.com/maps/dir/?api=1" +

        "&origin=" +
        encodeURIComponent(
            origin
        ) +

        "&destination=" +
        encodeURIComponent(
            destination
        ) +

        "&travelmode=" +
        encodeURIComponent(
            travelMode
        );


    window.open(
        url,
        "_blank"
    );

}

/* =====================================================
   EXPLORE INDIA CARD NAVIGATION
   Current Location → Selected Heritage Place
===================================================== */

function navigateCardPlace(lat, lng, placeName) {

    lat = Number(lat);
    lng = Number(lng);

    // Check destination coordinates
    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
    ) {
        alert("❌ This heritage place does not have a valid location.");
        return;
    }

    // Browser location support check
    if (!navigator.geolocation) {

        const destinationURL =
            "https://www.google.com/maps/search/?api=1" +
            "&query=" +
            encodeURIComponent(lat + "," + lng);

        window.open(destinationURL, "_blank");

        return;
    }

    // Get current location
    navigator.geolocation.getCurrentPosition(

        function(position) {

            const userLat =
                position.coords.latitude;

            const userLng =
                position.coords.longitude;

            const origin =
                userLat + "," + userLng;

            const destination =
                lat + "," + lng;

            const googleMapsURL =
                "https://www.google.com/maps/dir/?api=1" +
                "&origin=" +
                encodeURIComponent(origin) +
                "&destination=" +
                encodeURIComponent(destination) +
                "&travelmode=driving";

            window.open(
                googleMapsURL,
                "_blank"
            );
        },

        function(error) {

            console.error(
                "Location Error:",
                error
            );

            // If location permission is denied,
            // open the destination directly.

            const destinationURL =
                "https://www.google.com/maps/search/?api=1" +
                "&query=" +
                encodeURIComponent(lat + "," + lng);

            window.open(
                destinationURL,
                "_blank"
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}


/* =====================================================
   INITIALIZE AFTER PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        initializeNavigation();

    }
);

/* =====================================================
   STEP 7 — DIGITAL HERITAGE PASSPORT
===================================================== */


/* =========================================
   PASSPORT DATA
========================================= */

const PASSPORT_BADGES = [

    {
        id: "first-step",
        icon: "👣",
        title: "First Step",
        description: "Visit your first heritage destination.",
        requirement: 1
    },

    {
        id: "heritage-explorer",
        icon: "🏛️",
        title: "Heritage Explorer",
        description: "Visit 3 heritage destinations.",
        requirement: 3
    },

    {
        id: "culture-seeker",
        icon: "🎭",
        title: "Culture Seeker",
        description: "Visit 5 heritage destinations.",
        requirement: 5
    },

    {
        id: "bharat-traveller",
        icon: "🇮🇳",
        title: "Bharat Traveller",
        description: "Visit 10 heritage destinations.",
        requirement: 10
    },

    {
        id: "state-hopper",
        icon: "🗺️",
        title: "State Hopper",
        description: "Explore 3 different states or UTs.",
        requirement: 3
    },

    {
        id: "india-explorer",
        icon: "🌏",
        title: "India Explorer",
        description: "Explore 5 different states or UTs.",
        requirement: 5
    },

    {
        id: "heritage-master",
        icon: "🏆",
        title: "Heritage Master",
        description: "Visit 20 heritage destinations.",
        requirement: 20
    },

    {
        id: "bharat-champion",
        icon: "👑",
        title: "Bharat Champion",
        description: "Explore 10 states or UTs.",
        requirement: 10
    }

];


/* =========================================
   GET VISITED PLACES
========================================= */

function getVisitedPlaces() {

    return JSON.parse(
        localStorage.getItem(
            "yatra_visited"
        ) || "[]"
    );

}


/* =========================================
   SAVE VISITED PLACES
========================================= */

function saveVisitedPlaces(
    places
) {

    localStorage.setItem(
        "yatra_visited",
        JSON.stringify(places)
    );

}


/* =========================================
   MARK PLACE AS VISITED
========================================= */

function markPlaceVisited(
    state,
    index
) {

    if (
        !INDIA_HERITAGE[state]
    ) {

        return;

    }


    const place =
        INDIA_HERITAGE[state][index];


    if (!place) {

        return;

    }


    const visited =
        getVisitedPlaces();


    const placeName =
        place[0];


    const exists =
        visited.some(
            function(item) {

                return (
                    item.name ===
                        placeName &&
                    item.state ===
                        state
                );

            }
        );


    if (exists) {

        alert(
            "✅ You have already marked " +
            placeName +
            " as visited."
        );

        return;

    }


    visited.push({

        name: placeName,

        state: state,

        category: place[1],

        lat: place[2],

        lng: place[3],

        visitedAt:
            new Date().toISOString()

    });


    saveVisitedPlaces(
        visited
    );


    renderHeritagePassport();


    alert(
        "🎉 " +
        placeName +
        " added to your Heritage Passport!"
    );

}


/* =========================================
   MARK PLACE OBJECT AS VISITED
========================================= */

function markPlaceObjectVisited(
    place
) {

    if (!place) return;


    const visited =
        getVisitedPlaces();


    const exists =
        visited.some(
            function(item) {

                return (
                    item.name ===
                        place.name &&
                    item.state ===
                        place.state
                );

            }
        );


    if (exists) {

        alert(
            "✅ Already marked as visited."
        );

        return;

    }


    visited.push({

        name: place.name,

        state: place.state,

        category: place.category,

        lat: place.lat,

        lng: place.lng,

        visitedAt:
            new Date().toISOString()

    });


    saveVisitedPlaces(
        visited
    );


    renderHeritagePassport();


    alert(
        "🎉 " +
        place.name +
        " added to your Heritage Passport!"
    );

}


/* =========================================
   GET UNIQUE STATES
========================================= */

function getVisitedStates(
    visited
) {

    return [
        ...new Set(
            visited.map(
                function(place) {

                    return place.state;

                }
            )
        )
    ];

}


/* =========================================
   GET BADGE COUNT
========================================= */

function getUnlockedBadges(
    visited
) {

    const states =
        getVisitedStates(
            visited
        );


    const placeCount =
        visited.length;


    return PASSPORT_BADGES.filter(
        function(badge) {

            if (
                badge.id ===
                "state-hopper"
            ) {

                return states.length >=
                    badge.requirement;

            }


            if (
                badge.id ===
                "india-explorer"
            ) {

                return states.length >=
                    badge.requirement;

            }


            if (
                badge.id ===
                "bharat-champion"
            ) {

                return states.length >=
                    badge.requirement;

            }


            return placeCount >=
                badge.requirement;

        }
    );

}


/* =========================================
   RENDER BADGES
========================================= */

function renderPassportBadges(
    visited
) {

    const container =
        document.getElementById(
            "passportBadgesGrid"
        );


    if (!container) return;


    const states =
        getVisitedStates(
            visited
        );


    const placeCount =
        visited.length;


    container.innerHTML =
        PASSPORT_BADGES.map(
            function(badge) {

                let unlocked =
                    false;


                if (
                    badge.id ===
                    "state-hopper" ||
                    badge.id ===
                    "india-explorer" ||
                    badge.id ===
                    "bharat-champion"
                ) {

                    unlocked =
                        states.length >=
                        badge.requirement;

                } else {

                    unlocked =
                        placeCount >=
                        badge.requirement;

                }


                return `

                    <div
                        class="passport-badge
                        ${unlocked ? "unlocked" : ""}">

                        <div class="badge-icon">

                            ${badge.icon}

                        </div>

                        <h4>
                            ${badge.title}
                        </h4>

                        <p>
                            ${badge.description}
                        </p>

                        <span
                            class="badge-status">

                            ${
                                unlocked
                                ? "✓ UNLOCKED"
                                : "🔒 LOCKED"
                            }

                        </span>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================
   RENDER VISITED PLACES
========================================= */

function renderVisitedPlaces(
    visited
) {

    const container =
        document.getElementById(
            "visitedPlacesGrid"
        );


    if (!container) return;


    if (!visited.length) {

        container.innerHTML = `

            <div class="passport-empty">

                <div>
                    🗺️
                </div>

                <h3>
                    Your journey starts here
                </h3>

                <p>
                    Explore a heritage destination
                    and mark it as visited.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        visited
            .slice()
            .reverse()
            .map(
                function(place) {

                    return `

                        <div
                            class="visited-place-card">

                            <div
                                class="visited-check">

                                ✅

                            </div>

                            <div
                                class="visited-icon">

                                🏛️

                            </div>

                            <h4>
                                ${place.name}
                            </h4>

                            <p>
                                📍 ${place.state}
                            </p>

                            <p>
                                ${place.category}
                            </p>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================
   RENDER COMPLETE PASSPORT
========================================= */

function renderHeritagePassport() {

    const visited =
        getVisitedPlaces();


    const states =
        getVisitedStates(
            visited
        );


    const unlockedBadges =
        getUnlockedBadges(
            visited
        );


    /* =====================================
       STATS
    ===================================== */

    const statesElement =
        document.getElementById(
            "passportStates"
        );


    const placesElement =
        document.getElementById(
            "passportPlaces"
        );


    const badgesElement =
        document.getElementById(
            "passportBadges"
        );


    const progressElement =
        document.getElementById(
            "passportProgress"
        );


    const progressText =
        document.getElementById(
            "passportProgressText"
        );


    const progressBar =
        document.getElementById(
            "passportProgressBar"
        );


    if (statesElement) {

        statesElement.textContent =
            states.length;

    }


    if (placesElement) {

        placesElement.textContent =
            visited.length;

    }


    if (badgesElement) {

        badgesElement.textContent =
            unlockedBadges.length;

    }


    /*
       36 jurisdictions
    */

    const totalStates =
        Object.keys(
            INDIA_HERITAGE
        ).length;


    const progress =
        Math.min(
            100,
            Math.round(
                (
                    states.length /
                    totalStates
                ) * 100
            )
        );


    if (progressElement) {

        progressElement.textContent =
            progress + "%";

    }


    if (progressText) {

        progressText.textContent =
            progress + "%";

    }


    if (progressBar) {

        progressBar.style.width =
            progress + "%";

    }


    /* =====================================
       LEVEL
    ===================================== */

    const levelElement =
        document.getElementById(
            "passportLevel"
        );


    if (levelElement) {

        let level =
            "Heritage Beginner";


        if (
            visited.length >= 20
        ) {

            level =
                "🏆 Heritage Master";

        } else if (
            visited.length >= 10
        ) {

            level =
                "🇮🇳 Bharat Traveller";

        } else if (
            visited.length >= 5
        ) {

            level =
                "🎭 Culture Seeker";

        } else if (
            visited.length >= 3
        ) {

            level =
                "🏛️ Heritage Explorer";

        } else if (
            visited.length >= 1
        ) {

            level =
                "👣 First Step";

        }


        levelElement.textContent =
            level;

    }


    /* =====================================
       RENDER
    ===================================== */

    renderPassportBadges(
        visited
    );


    renderVisitedPlaces(
        visited
    );

}


/* =========================================
   INITIALIZE PASSPORT
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderHeritagePassport();

    }
);
/* =========================================
   STEP 7.4
   VISITED BUTTON UI
========================================= */

function markCardVisited(button) {

    const name =
        button.dataset.placeName;

    const state =
        button.dataset.placeState;


    const places =
        getPlacesByState(state);

    if (!places) return;


    const place =
        places.find(function(item) {

            return item[0] === name;

        });


    if (!place) return;


    const visited =
        getVisitedPlaces();


    const alreadyVisited =
        visited.some(function(item) {

            return (
                item.name === name &&
                item.state === state
            );

        });


    if (alreadyVisited) {

        setVisitedButton(
            button
        );

        return;

    }


    const placeObject = {

        name: name,

        state: state,

        category: place[1],

        lat: place[2],

        lng: place[3]

    };


    markPlaceObjectVisited(
        placeObject
    );


    setVisitedButton(
        button
    );

}


/* =========================================
   SET BLUE VISITED BUTTON
========================================= */

function setVisitedButton(button) {

    button.classList.add(
        "visited"
    );

    button.innerHTML =
        "Visited";

    button.disabled = true;

}

/* =========================================
   RESTORE VISITED BUTTONS
========================================= */

function restoreVisitedButtons() {

    const buttons =
        document.querySelectorAll(
            ".visited-btn"
        );


    const visited =
        getVisitedPlaces();


    buttons.forEach(function(button) {

        const name =
            button.dataset.placeName;

        const state =
            button.dataset.placeState;


        const exists =
            visited.some(function(item) {

                return (
                    item.name === name &&
                    item.state === state
                );

            });


        if (exists) {

            setVisitedButton(
                button
            );

        }

    });

}
/* =========================================
   STEP 11 — PREMIUM STATS ANIMATION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const statsSection = document.querySelector(".premium-stats");

    if (!statsSection) return;

    let statsAnimated = false;

    const observer = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting && !statsAnimated) {

                    statsAnimated = true;

                    statsSection.classList.add("stats-visible");

                    animateStats();

                }

            });

        },
        {
            threshold: 0.25
        }
    );

    observer.observe(statsSection);


    function animateStats() {

        const numbers = statsSection.querySelectorAll(
            ".stat-number[data-target]"
        );

        numbers.forEach(function (number) {

            const target = Number(
                number.getAttribute("data-target")
            );

            let current = 0;

            const duration = 1400;
            const startTime = performance.now();

            function updateNumber(currentTime) {

                const progress =
                    Math.min(
                        (currentTime - startTime) / duration,
                        1
                    );

                const eased =
                    1 - Math.pow(1 - progress, 3);

                current = Math.floor(target * eased);

                if (target >= 1000) {

                    number.textContent =
                        current >= 1000
                            ? current + "+"
                            : current;

                } else {

                    number.textContent = current;
                }

                if (progress < 1) {

                    requestAnimationFrame(updateNumber);

                } else {

                    number.textContent =
                        target >= 1000
                            ? target + "+"
                            : target;
                }
            }

            requestAnimationFrame(updateNumber);

        });

    }

});

/* =====================================================
   STEP 13 — HERITAGE SEARCH
===================================================== */

const heritageSearchInput =
    document.getElementById("heritageSearch");

const clearHeritageSearch =
    document.getElementById("clearHeritageSearch");

function filterHeritageSearch() {
    const searchText =
        heritageSearchInput
            ? heritageSearchInput.value.trim().toLowerCase()
            : "";

    if (clearHeritageSearch) {
        clearHeritageSearch.style.display =
            searchText ? "flex" : "none";
    }

    renderStatePlaces();
}

if (heritageSearchInput) {
    heritageSearchInput.addEventListener(
        "input",
        filterHeritageSearch
    );
}

if (clearHeritageSearch) {
    clearHeritageSearch.addEventListener(
        "click",
        function () {
            heritageSearchInput.value = "";
            clearHeritageSearch.style.display = "none";
            renderStatePlaces();
            heritageSearchInput.focus();
        }
    );
}



/* =====================================================
   STEP 14 — MY JOURNEYS
===================================================== */


/* =========================================
   GET JOURNEYS
========================================= */

function getMyJourneys() {

    return JSON.parse(
        localStorage.getItem(
            "yatra_journey"
        ) || "[]"
    );

}


/* =========================================
   SAVE JOURNEYS
========================================= */

function saveMyJourneys(journeys) {

    localStorage.setItem(
        "yatra_journey",
        JSON.stringify(journeys)
    );

}


/* =========================================
   RENDER MY JOURNEYS
========================================= */

function renderMyJourneys() {

    const container =
        document.getElementById(
            "myJourneysGrid"
        );

    if (!container) return;


    const journeys =
        getMyJourneys();


    /* =====================================
       UPDATE SUMMARY
    ===================================== */

    const placeCount =
        document.getElementById(
            "journeyPlaceCount"
        );

    const stateCount =
        document.getElementById(
            "journeyStateCount"
        );


    const uniqueStates =
        [
            ...new Set(
                journeys.map(
                    function(place) {
                        return place.state;
                    }
                )
            )
        ];


    if (placeCount) {

        placeCount.textContent =
            journeys.length;

    }


    if (stateCount) {

        stateCount.textContent =
            uniqueStates.length;

    }


    /* =====================================
       EMPTY STATE
    ===================================== */

    if (!journeys.length) {

        container.innerHTML = `

            <div class="journey-empty">

                <div class="journey-empty-icon">
                    🗺️
                </div>

                <h3>
                    Your Yatra is empty
                </h3>

                <p>
                    Explore heritage places and
                    add destinations to start
                    your journey.
                </p>

                <button
                    onclick="navigateById('explore')">

                    ✦ Explore India

                </button>

            </div>

        `;

        return;

    }


    /* =====================================
       JOURNEY CARDS
    ===================================== */

    container.innerHTML =
        journeys.map(
            function(place, index) {

                return `

                    <article
                        class="journey-card">

                        <div class="journey-number">
                            ${index + 1}
                        </div>

                        <div class="journey-card-icon">
                            🏛️
                        </div>

                        <div class="journey-card-content">

                            <span class="journey-category">
                                ${place.category || "Heritage"}
                            </span>

                            <h3>
                                ${place.name}
                            </h3>

                            <p>
                                📍 ${place.state}
                            </p>

                        </div>


                        <div class="journey-card-actions">

                            <button
                                class="journey-nav-btn"
                                onclick="navigateCardPlace(
                                    ${Number(place.lat)},
                                    ${Number(place.lng)},
                                    '${escapeQuotes(place.name)}'
                                )">

                                🧭 Navigate

                            </button>


                            <button
                                class="journey-remove-btn"
                                onclick="removeJourneyPlace(${index})">

                                ✕ Remove

                            </button>

                        </div>

                    </article>

                `;

            }
        ).join("");

}


/* =========================================
   REMOVE JOURNEY PLACE
========================================= */

function removeJourneyPlace(index) {

    const journeys =
        getMyJourneys();


    if (
        index < 0 ||
        index >= journeys.length
    ) {
        return;
    }


    const place =
        journeys[index];


    const confirmed =
        confirm(
            `Remove "${place.name}" from My Journey?`
        );


    if (!confirmed) {
        return;
    }


    journeys.splice(
        index,
        1
    );


    saveMyJourneys(
        journeys
    );


    renderMyJourneys();


    alert(
        `🗑️ ${place.name} removed from your journey.`
    );

}


/* =========================================
   INITIALIZE MY JOURNEYS
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderMyJourneys();

    }
);

/* =========================================
   STEP 15 — SAVED PLACES
========================================= */


/* =========================================
   GET SAVED PLACES
========================================= */

function getSavedPlaces() {

    return JSON.parse(
        localStorage.getItem("yatra_saved") || "[]"
    );

}


/* =========================================
   SAVE UPDATED SAVED PLACES
========================================= */

function saveUpdatedPlaces(places) {

    localStorage.setItem(
        "yatra_saved",
        JSON.stringify(places)
    );

}


/* =========================================
   RENDER SAVED PLACES
========================================= */

function renderSavedPlaces() {

    const container =
        document.getElementById(
            "savedPlacesGrid"
        );

    if (!container) return;
        container.classList.add(
        "saved-hidden"
    );


    const saved =
        getSavedPlaces();


    const placeCount =
        document.getElementById(
            "savedPlaceCount"
        );


    const stateCount =
        document.getElementById(
            "savedStateCount"
        );


    /* Unique States / UTs */

    const uniqueStates =
        [
            ...new Set(
                saved.map(
                    function (place) {
                        return place.state;
                    }
                )
            )
        ];


    /* Summary */

    if (placeCount) {

        placeCount.textContent =
            saved.length;

    }


    if (stateCount) {

        stateCount.textContent =
            uniqueStates.length;

    }


    /* Empty State */

    if (!saved.length) {

        container.innerHTML = `

            <div class="saved-empty">

                <div class="saved-empty-icon">
                    ❤️
                </div>

                <h3>
                    No Saved Places Yet
                </h3>

                <p>
                    Explore India's heritage and save
                    your favourite destinations here.
                </p>

                <a
                    href="#heritage"
                    class="saved-discover-btn">

                    🔎 Discover Heritage

                </a>

            </div>

        `;

        return;
    }


    /* Render Saved Cards */

    container.innerHTML =
        saved.map(
            function (place, index) {

                const lat =
                    Number(place.lat) || 0;

                const lng =
                    Number(place.lng) || 0;


                return `

    <article
        class="saved-place-card"
        ondblclick="unsaveSavedPlace(event, ${index})"
        title="Double-click to remove this place from Saved Places">


                        <div
                            class="saved-place-icon">

                            ${getIcon(place.category || "")}

                        </div>


                        <div
                            class="saved-place-content">


                            <span
                                class="saved-place-category">

                                ${place.category || "Heritage"}

                            </span>


                            <h3>
                                ${place.name}
                            </h3>


                            <p>
                                📍 ${place.state}
                            </p>


                            <div
                                class="saved-place-actions">


                                <button
                                    class="saved-explore-btn"
                                    onclick="
                                        openSavedPlace(
                                            '${window.escapeQuotes(place.state)}',
                                            '${window.escapeQuotes(place.name)}'
                                        )
                                    ">

                                    ✦ Explore

                                </button>


                                <button
                                    class="saved-navigate-btn"
                                    onclick="
                                        navigateCardPlace(
                                            ${lat},
                                            ${lng},
                                            '${window.escapeQuotes(place.name)}'
                                        )
                                    ">

                                    🧭 Navigate

                                </button>


                                <button
                                    class="saved-remove-btn"
                                    onclick="
                                        removeSavedPlace(
                                            ${index}
                                        )
                                    ">

                                    Remove

                                </button>


                            </div>

                        </div>

                    </article>

                `;

            }
        ).join("");

}


/* =========================================
   OPEN SAVED PLACE
========================================= */

function openSavedPlace(
    state,
    name
) {

    const places =
        getPlacesByState(state);


    if (!places) {

        alert(
            "❌ Heritage place could not be found."
        );

        return;

    }


    const index =
        places.findIndex(
            function (place) {

                return place[0] === name;

            }
        );


    if (index === -1) {

        alert(
            "❌ Heritage place could not be found."
        );

        return;

    }


    viewHeritage(
        state,
        index
    );

}


/* =========================================
   REMOVE SAVED PLACE
========================================= */

function removeSavedPlace(index) {

    /* =========================================
   DOUBLE CLICK → UNSAVE PLACE
========================================= */

function unsaveSavedPlace(event, index) {

    /* Button par double-click ho to
       card ko unsave mat karo */
    if (
        event &&
        event.target &&
        (
            event.target.closest("button") ||
            event.target.closest("a")
        )
    ) {
        return;
    }


    const saved =
        getSavedPlaces();


    if (
        index < 0 ||
        index >= saved.length
    ) {
        return;
    }


    const place =
        saved[index];


    saved.splice(
        index,
        1
    );


    saveUpdatedPlaces(
        saved
    );


    renderSavedPlaces();


    alert(
        `💔 ${place.name} removed from Saved Places.`
    );

}

    const saved =
        getSavedPlaces();


    if (
        index < 0 ||
        index >= saved.length
    ) {

        return;

    }


    const place =
        saved[index];


    const confirmed =
        confirm(
            `Remove "${place.name}" from Saved Places?`
        );


    if (!confirmed) {

        return;

    }


    saved.splice(
        index,
        1
    );


    saveUpdatedPlaces(
        saved
    );


    renderSavedPlaces();


    alert(
        `🗑️ ${place.name} removed from Saved Places.`
    );

}
/* =========================================
   SHOW / HIDE SAVED PLACES
========================================= */

function toggleSavedPlaces() {

    const grid =
        document.getElementById(
            "savedPlacesGrid"
        );

    const button =
        document.getElementById(
            "showSavedPlacesBtn"
        );


    if (!grid || !button) {
        return;
    }


    const isHidden =
        grid.classList.contains(
            "saved-hidden"
        );


    if (isHidden) {

        grid.classList.remove(
            "saved-hidden"
        );

        button.innerHTML =
            "🙈 Hide Saved Places";

    } else {

        grid.classList.add(
            "saved-hidden"
        );

        button.innerHTML =
            "👁 Show Saved Places";

    }

}

/* =========================================
   INITIALIZE SAVED PLACES
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderSavedPlaces();

    }
);
/* =========================================
   STEP 15 — SAVED PLACES DISPLAY
========================================= */

function getSavedPlaces() {

    return JSON.parse(
        localStorage.getItem("yatra_saved") || "[]"
    );

}


function renderSavedPlaces() {

    const grid =
        document.getElementById("savedPlacesGrid");

    if (!grid) {
        console.error(
            "❌ savedPlacesGrid not found."
        );
        return;
    }


    const saved =
        getSavedPlaces();


    /* Update count */

    const placeCount =
        document.getElementById(
            "savedPlaceCount"
        );

    if (placeCount) {

        placeCount.textContent =
            saved.length;

    }


    /* Update state count */

    const stateCount =
        document.getElementById(
            "savedStateCount"
        );

    if (stateCount) {

        const states = [
            ...new Set(
                saved.map(
                    function(place) {
                        return place.state;
                    }
                )
            )
        ];

        stateCount.textContent =
            states.length;

    }


    /* No saved places */

    if (saved.length === 0) {

        grid.innerHTML = `

            <div class="saved-empty">

                <div class="saved-empty-icon">
                    ❤️
                </div>

                <h3>
                    No Saved Places
                </h3>

                <p>
                    Save your favourite heritage
                    destinations and they will appear here.
                </p>

            </div>

        `;

        return;

    }


    /* Show saved places */

    grid.innerHTML =
        saved.map(
            function(place, index) {

                return `

                    <article
                        class="saved-place-card"
                        ondblclick="
                            unsaveSavedPlace(
                                event,
                                ${index}
                            )
                        ">


                        <div
                            class="saved-place-icon">

                            ${getIcon(
                                place.category || "heritage"
                            )}

                        </div>


                        <div
                            class="saved-place-content">


                            <span
                                class="saved-place-category">

                                ${place.category || "Heritage"}

                            </span>


                            <h3>
                                ${place.name}
                            </h3>


                            <p>
                                📍 ${place.state}
                            </p>


                            <div
                                class="saved-place-actions">


                                <button
                                    type="button"
                                    class="saved-explore-btn"
                                    onclick="
                                        openSavedPlace(
                                            '${place.state}',
                                            '${place.name}'
                                        )
                                    ">

                                    ✦ Explore

                                </button>


                                <button
                                    type="button"
                                    class="saved-navigate-btn"
                                    onclick="
                                        navigateCardPlace(
                                            ${Number(place.lat) || 0},
                                            ${Number(place.lng) || 0},
                                            '${place.name}'
                                        )
                                    ">

                                    🧭 Navigate

                                </button>


                                <button
                                    type="button"
                                    class="saved-remove-btn"
                                    onclick="
                                        removeSavedPlace(
                                            ${index}
                                        )
                                    ">

                                    Remove

                                </button>


                            </div>

                        </div>

                    </article>

                `;

            }
        ).join("");

}


/* =========================================
   SHOW / HIDE SAVED PLACES
========================================= */

function toggleSavedPlaces() {

    const grid =
        document.getElementById(
            "savedPlacesGrid"
        );

    const button =
        document.getElementById(
            "showSavedPlacesBtn"
        );

    if (!grid || !button) {
        return;
    }


    if (
        grid.classList.contains(
            "saved-hidden"
        )
    ) {

        grid.classList.remove(
            "saved-hidden"
        );

        button.textContent =
            "🙈 Hide Saved Places";

    } else {

        grid.classList.add(
            "saved-hidden"
        );

        button.textContent =
            "👁 Show Saved Places";

    }

}


/* =========================================
   OPEN SAVED PLACE
========================================= */

function openSavedPlace(
    state,
    name
) {

    const places =
        getPlacesByState(state);


    if (!places) {
        return;
    }


    const index =
        places.findIndex(
            function(place) {

                return place[0] === name;

            }
        );


    if (index === -1) {

        alert(
            "❌ Heritage place not found."
        );

        return;

    }


    viewHeritage(
        state,
        index
    );

}


/* =========================================
   REMOVE / UNSAVE
========================================= */

function unsaveSavedPlace(
    event,
    index
) {

    /* Don't trigger from buttons */

    if (
        event &&
        event.target &&
        event.target.closest("button")
    ) {

        return;

    }


    const saved =
        getSavedPlaces();


    if (
        index < 0 ||
        index >= saved.length
    ) {

        return;

    }


    const place =
        saved[index];


    saved.splice(
        index,
        1
    );


    localStorage.setItem(
        "yatra_saved",
        JSON.stringify(saved)
    );


    renderSavedPlaces();


    alert(
        "💔 " +
        place.name +
        " removed from Saved Places."
    );

}


/* =========================================
   REMOVE BUTTON
========================================= */

function removeSavedPlace(index) {

    const saved =
        getSavedPlaces();


    if (
        index < 0 ||
        index >= saved.length
    ) {

        return;

    }


    const place =
        saved[index];


    const confirmRemove =
        confirm(
            `Remove "${place.name}" from Saved Places?`
        );


    if (!confirmRemove) {
        return;
    }


    saved.splice(
        index,
        1
    );


    localStorage.setItem(
        "yatra_saved",
        JSON.stringify(saved)
    );


    renderSavedPlaces();

}


/* =========================================
   INITIALIZE SAVED PLACES
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderSavedPlaces();

    }
);
/* =========================================
   STEP 16 — HERITAGE QUIZ
========================================= */

const HERITAGE_QUIZ_QUESTIONS = [

    {
        question: "Which monument is known as the symbol of love?",
        options: [
            "Red Fort",
            "Taj Mahal",
            "Qutub Minar",
            "Gateway of India"
        ],
        answer: 1
    },

    {
        question: "In which city is the Golden Temple located?",
        options: [
            "Jaipur",
            "Varanasi",
            "Amritsar",
            "Delhi"
        ],
        answer: 2
    },

    {
        question: "Which festival is known as the Festival of Lights?",
        options: [
            "Holi",
            "Diwali",
            "Pongal",
            "Baisakhi"
        ],
        answer: 1
    },

    {
        question: "Where is the Qutub Minar located?",
        options: [
            "Delhi",
            "Agra",
            "Lucknow",
            "Mumbai"
        ],
        answer: 0
    },

    {
        question: "Which classical dance form originated in Tamil Nadu?",
        options: [
            "Kathak",
            "Bharatanatyam",
            "Kathakali",
            "Odissi"
        ],
        answer: 1
    },

    {
        question: "Which city is famous for its ghats on the River Ganga?",
        options: [
            "Varanasi",
            "Bengaluru",
            "Ahmedabad",
            "Chandigarh"
        ],
        answer: 0
    },

    {
        question: "Which monument is located in Hyderabad?",
        options: [
            "Charminar",
            "India Gate",
            "Hawa Mahal",
            "Sanchi Stupa"
        ],
        answer: 0
    },

    {
        question: "Hawa Mahal is located in which city?",
        options: [
            "Udaipur",
            "Jodhpur",
            "Jaipur",
            "Bhopal"
        ],
        answer: 2
    },

    {
        question: "Which Indian festival is famous for colours?",
        options: [
            "Diwali",
            "Holi",
            "Onam",
            "Navratri"
        ],
        answer: 1
    },

    {
        question: "Which fort is located in Agra?",
        options: [
            "Agra Fort",
            "Mehrangarh Fort",
            "Red Fort",
            "Golconda Fort"
        ],
        answer: 0
    }

];


let currentQuizQuestion = 0;
let heritageQuizScore = 0;
let quizAnswered = false;


/* Start Quiz */

function startHeritageQuiz() {

    currentQuizQuestion = 0;
    heritageQuizScore = 0;
    quizAnswered = false;

    const startScreen =
        document.getElementById("quizStartScreen");

    const game =
        document.getElementById("quizGame");

    const result =
        document.getElementById("quizResult");

    if (startScreen) {
        startScreen.style.display = "none";
    }

    if (result) {
        result.style.display = "none";
    }

    if (game) {
        game.style.display = "block";
    }

    showHeritageQuestion();
}


/* Show Question */

function showHeritageQuestion() {

    const question =
        HERITAGE_QUIZ_QUESTIONS[currentQuizQuestion];

    if (!question) return;

    quizAnswered = false;

    const questionNumber =
        document.getElementById("quizQuestionNumber");

    const score =
        document.getElementById("quizScore");

    const questionText =
        document.getElementById("quizQuestion");

    const options =
        document.getElementById("quizOptions");

    const nextButton =
        document.getElementById("quizNextBtn");

    const progress =
        document.getElementById("quizProgressBar");


    if (questionNumber) {
        questionNumber.textContent =
            `Question ${currentQuizQuestion + 1} / ${HERITAGE_QUIZ_QUESTIONS.length}`;
    }

    if (score) {
        score.textContent =
            `Score: ${heritageQuizScore}`;
    }

    if (questionText) {
        questionText.textContent =
            question.question;
    }

    if (progress) {
        const percentage =
            ((currentQuizQuestion + 1) /
            HERITAGE_QUIZ_QUESTIONS.length) * 100;

        progress.style.width =
            percentage + "%";
    }

    if (nextButton) {
        nextButton.disabled = true;
        nextButton.textContent =
            currentQuizQuestion ===
            HERITAGE_QUIZ_QUESTIONS.length - 1
                ? "Finish Quiz ✓"
                : "Next Question →";
    }


    if (options) {

        options.innerHTML =
            question.options.map(function(option, index) {

                return `
                    <button
                        type="button"
                        class="quiz-option"
                        onclick="selectHeritageAnswer(${index})">
                        ${String.fromCharCode(65 + index)}. ${option}
                    </button>
                `;

            }).join("");
    }
}


/* Select Answer */

function selectHeritageAnswer(selectedIndex) {

    if (quizAnswered) return;

    quizAnswered = true;

    const question =
        HERITAGE_QUIZ_QUESTIONS[currentQuizQuestion];

    const optionButtons =
        document.querySelectorAll(".quiz-option");

    optionButtons.forEach(function(button, index) {

        button.disabled = true;

        if (index === question.answer) {
            button.classList.add("correct");
        }

        if (
            index === selectedIndex &&
            selectedIndex !== question.answer
        ) {
            button.classList.add("wrong");
        }

    });


    if (selectedIndex === question.answer) {
        heritageQuizScore++;
    }


    const score =
        document.getElementById("quizScore");

    if (score) {
        score.textContent =
            `Score: ${heritageQuizScore}`;
    }


    const nextButton =
        document.getElementById("quizNextBtn");

    if (nextButton) {
        nextButton.disabled = false;
    }
}


/* Next Question */

function nextHeritageQuestion() {

    if (!quizAnswered) return;

    if (
        currentQuizQuestion >=
        HERITAGE_QUIZ_QUESTIONS.length - 1
    ) {
        showHeritageQuizResult();
        return;
    }

    currentQuizQuestion++;

    showHeritageQuestion();
}


/* Show Result */

function showHeritageQuizResult() {

    const game =
        document.getElementById("quizGame");

    const result =
        document.getElementById("quizResult");

    const finalScore =
        document.getElementById("quizFinalScore");

    const resultTitle =
        document.getElementById("quizResultTitle");

    const resultMessage =
        document.getElementById("quizResultMessage");

    const resultIcon =
        document.getElementById("quizResultIcon");


    if (game) {
        game.style.display = "none";
    }

    if (result) {
        result.style.display = "block";
    }

    if (finalScore) {
        finalScore.textContent =
            heritageQuizScore;
    }


    if (heritageQuizScore >= 9) {

        if (resultIcon) {
            resultIcon.textContent = "🏆";
        }

        if (resultTitle) {
            resultTitle.textContent =
                "Heritage Master";
        }

        if (resultMessage) {
            resultMessage.textContent =
                "Outstanding! You have an excellent knowledge of India's heritage.";
        }

    } else if (heritageQuizScore >= 6) {

        if (resultIcon) {
            resultIcon.textContent = "⭐";
        }

        if (resultTitle) {
            resultTitle.textContent =
                "Heritage Explorer";
        }

        if (resultMessage) {
            resultMessage.textContent =
                "Great job! Keep exploring India's amazing heritage.";
        }

    } else {

        if (resultIcon) {
            resultIcon.textContent = "🌱";
        }

        if (resultTitle) {
            resultTitle.textContent =
                "Heritage Beginner";
        }

        if (resultMessage) {
            resultMessage.textContent =
                "Keep exploring Yatra Drishti and discover more about Bharat.";
        }
    }
}


/* Restart */

function restartHeritageQuiz() {

    currentQuizQuestion = 0;

    heritageQuizScore = 0;

    quizAnswered = false;


    const result =
        document.getElementById(
            "quizResult"
        );

    const startScreen =
        document.getElementById(
            "quizStartScreen"
        );

    const game =
        document.getElementById(
            "quizGame"
        );


    if (result) {

        result.style.display =
            "none";

    }


    if (game) {

        game.style.display =
            "none";

    }


    if (startScreen) {

        startScreen.style.display =
            "block";

    }

}

/*<!-- =========================================
     STEP 17 — HERITAGE VIDEOS & STORIES
========================================= -->*/



/* =========================================
   STEP 17 — HERITAGE VIDEOS
========================================= */

const HERITAGE_VIDEOS = [

    {
        title: "The Timeless Taj Mahal",
        category: "monuments",
        label: "MONUMENTS",
        description:
            "Discover the timeless beauty and architectural story of the Taj Mahal.",
        image:
            "assets/images/taj-mahal.jpg",
        video:
            "assets/videos/taj-mahal.mp4"
    },

    {
        title: "The Spirit of Indian Culture",
        category: "culture",
        label: "CULTURE",
        description:
            "Experience the colours, traditions and cultural diversity of Bharat.",
        image:
            "assets/images/indian-culture.jpg",
        video:
            "assets/videos/indian-culture.mp4"
    },

    {
        title: "Festival of Lights",
        category: "festivals",
        label: "FESTIVALS",
        description:
            "Explore the traditions and celebrations of Diwali across India.",
        image:
            "assets/images/diwali.jpg",
        video:
            "assets/videos/diwali.mp4"
    },

    {
        title: "Sacred Temples of Bharat",
        category: "temples",
        label: "TEMPLES",
        description:
            "Journey through India's magnificent temples and spiritual heritage.",
        image:
            "assets/images/temples.jpg",
        video:
            "assets/videos/temples.mp4"
    },

    {
        title: "The Legacy of Indian Forts",
        category: "monuments",
        label: "MONUMENTS",
        description:
            "Explore the historic forts that tell stories of India's glorious past.",
        image:
            "assets/images/forts.jpg",
        video:
            "assets/videos/forts.mp4"
    },

    {
        title: "Colours of Indian Festivals",
        category: "festivals",
        label: "FESTIVALS",
        description:
            "A colourful journey through India's vibrant festivals and traditions.",
        image:
            "assets/images/festivals.jpg",
        video:
            "assets/videos/festivals.mp4"
    }

];


let currentHeritageVideoCategory = "all";


/* Render Videos */

function renderHeritageVideos(category) {

    const grid =
        document.getElementById("heritageVideosGrid");

    if (!grid) return;

    const filteredVideos =
        category === "all"
            ? HERITAGE_VIDEOS
            : HERITAGE_VIDEOS.filter(function(video) {
                return video.category === category;
            });


    if (!filteredVideos.length) {

        grid.innerHTML = `
            <div class="video-empty">
                <h3>No videos available</h3>
                <p>
                    More heritage stories are coming soon.
                </p>
            </div>
        `;

        return;
    }


    grid.innerHTML =
        filteredVideos.map(function(video) {

            const videoIndex =
                HERITAGE_VIDEOS.indexOf(video);

            return `
                <article class="heritage-video-card">

                    <div class="heritage-video-thumbnail">

                        <img
                            src="${video.image}"
                            alt="${video.title}"
                            onerror="
                                this.style.display='none';
                            "
                        >

                        <button
                            type="button"
                            class="heritage-play-btn"
                            onclick="
                                openHeritageVideoPlayer(
                                    ${videoIndex}
                                )
                            ">
                            ▶
                        </button>

                    </div>


                    <div class="heritage-video-content">

                        <span>
                            ${video.label}
                        </span>

                        <h3>
                            ${video.title}
                        </h3>

                        <p>
                            ${video.description}
                        </p>

                    </div>

                </article>
            `;

        }).join("");
}


/* Filter */

function filterHeritageVideos(category, button) {

    currentHeritageVideoCategory = category;

    document
        .querySelectorAll(".video-filter")
        .forEach(function(item) {
            item.classList.remove("active");
        });


    if (button) {
        button.classList.add("active");
    }


    renderHeritageVideos(category);
}


/* Open Video */

function openHeritageVideoPlayer(index) {

    const video =
        HERITAGE_VIDEOS[index];

    if (!video) return;


    const modal =
        document.getElementById("heritageVideoModal");

    const player =
        document.getElementById("heritageVideoPlayer");

    const title =
        document.getElementById("heritageVideoTitle");

    const category =
        document.getElementById("heritageVideoCategory");

    const description =
        document.getElementById("heritageVideoDescription");


    if (title) {
        title.textContent = video.title;
    }

    if (category) {
        category.textContent = video.label;
    }

    if (description) {
        description.textContent =
            video.description;
    }


    if (player) {

        player.pause();

        player.src = video.video;

        player.load();

        player.play().catch(function() {
            console.log(
                "Video playback requires user interaction."
            );
        });
    }


    if (modal) {
        modal.classList.add("show");
    }
}


/* Close Video */

function closeHeritageVideo() {

    const modal =
        document.getElementById("heritageVideoModal");

    const player =
        document.getElementById("heritageVideoPlayer");


    if (player) {

        player.pause();

        player.removeAttribute("src");

        player.load();
    }


    if (modal) {
        modal.classList.remove("show");
    }
}


/* Initial Render */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderHeritageVideos("all");

    }
);
/* =========================================
   STEP 18 : USER PROFILE SYSTEM
   ========================================= */

/* =========================================
   STEP 18 : USER PROFILE SYSTEM
========================================= */

/* ---------- PROFILE STORAGE ---------- */

function getProfileAccount() {

    try {

        return JSON.parse(
            localStorage.getItem("yatra_profile") || "null"
        );

    } catch (error) {

        return null;

    }
}


function saveProfileAccountToStorage(profile) {

    localStorage.setItem(
        "yatra_profile",
        JSON.stringify(profile)
    );

}


/* ---------- RENDER PROFILE ---------- */

function renderProfileName() {

    const profile =
        getProfileAccount();

    const nameElement =
        document.getElementById("profileUserName");

    const phoneElement =
        document.getElementById("profileUserEmail");

    if (!nameElement || !phoneElement) {
        return;
    }

    if (!profile) {

        nameElement.textContent =
            "Heritage Explorer";

        phoneElement.textContent =
            "📱 Create your profile to continue";

        return;
    }

    nameElement.textContent =
        profile.name;

    phoneElement.textContent =
        "📱 " + profile.phone;

}


/* ---------- OPEN PROFILE EDITOR ---------- */

function openProfileEditor() {

    const modal =
        document.getElementById("profileAccountModal");

    const title =
        document.getElementById("profileModalTitle");

    const saveButton =
        document.getElementById("profileSaveBtn");

    const nameInput =
        document.getElementById("profileNameInput");

    const phoneInput =
        document.getElementById("profilePhoneInput");

    const passwordInput =
        document.getElementById("profilePasswordInput");

    const confirmInput =
        document.getElementById("profileConfirmPasswordInput");

    if (!modal) return;

    const profile =
        getProfileAccount();

    if (profile) {

        title.textContent =
            "Edit Your Profile";

        saveButton.textContent =
            "Save Changes";

        nameInput.value =
            profile.name || "";

        phoneInput.value =
            profile.phone || "";

        passwordInput.value =
            "";

        confirmInput.value =
            "";

    } else {

        title.textContent =
            "Create Your Profile";

        saveButton.textContent =
            "Create Profile";

        nameInput.value =
            "";

        phoneInput.value =
            "";

        passwordInput.value =
            "";

        confirmInput.value =
            "";

    }

    modal.classList.add("show");

    setTimeout(function () {

        nameInput.focus();

    }, 100);

}


/* ---------- CLOSE PROFILE EDITOR ---------- */

function closeProfileEditor() {

    const modal =
        document.getElementById("profileAccountModal");

    if (!modal) return;

    modal.classList.remove("show");

}


/* ---------- SAVE / CREATE PROFILE ---------- */

function saveProfileAccount() {

    const nameInput =
        document.getElementById("profileNameInput");

    const phoneInput =
        document.getElementById("profilePhoneInput");

    const passwordInput =
        document.getElementById("profilePasswordInput");

    const confirmInput =
        document.getElementById("profileConfirmPasswordInput");

    const name =
        nameInput.value.trim();

    const phone =
        phoneInput.value.trim();

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmInput.value;

    const oldProfile =
        getProfileAccount();


    /* NAME */

    if (!name) {

        alert("Please enter your name.");

        nameInput.focus();

        return;

    }


    /* PHONE */

    if (!/^[6-9][0-9]{9}$/.test(phone)) {

        alert(
            "Please enter a valid 10-digit Indian mobile number."
        );

        phoneInput.focus();

        return;

    }


    /* PASSWORD */

    if (!oldProfile && password.length < 6) {

        alert(
            "Password must contain at least 6 characters."
        );

        passwordInput.focus();

        return;

    }


    /* EDIT PASSWORD */

    if (password && password.length < 6) {

        alert(
            "Password must contain at least 6 characters."
        );

        passwordInput.focus();

        return;

    }


    /* CONFIRM PASSWORD */

    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        confirmInput.focus();

        return;

    }


    const profile = {

        name: name,

        phone: phone,

        password:
            password || (oldProfile ? oldProfile.password : "")

    };


    saveProfileAccountToStorage(profile);

    renderUserProfile();

    closeProfileEditor();

    alert(
        oldProfile
            ? "✅ Profile updated successfully!"
            : "🎉 Profile created successfully!"
    );

}


/* ---------- PROFILE STATS ---------- */

function getProfileJourneys() {

    return JSON.parse(
        localStorage.getItem("yatra_journey") || "[]"
    );

}


function getProfileSavedPlaces() {

    return JSON.parse(
        localStorage.getItem("yatra_saved") || "[]"
    );

}


function getProfileVisitedPlaces() {

    return JSON.parse(
        localStorage.getItem("yatra_visited") || "[]"
    );

}


function renderProfileStats() {

    const journeys =
        getProfileJourneys();

    const saved =
        getProfileSavedPlaces();

    const visited =
        getProfileVisitedPlaces();


    const journeyElement =
        document.getElementById("profileJourneyCount");

    const savedElement =
        document.getElementById("profileSavedCount");

    const visitedElement =
        document.getElementById("profileVisitedCount");

    const stateElement =
        document.getElementById("profileStateCount");


    if (journeyElement) {

        journeyElement.textContent =
            journeys.length;

    }


    if (savedElement) {

        savedElement.textContent =
            saved.length;

    }


    if (visitedElement) {

        visitedElement.textContent =
            visited.length;

    }


    const states =
        new Set();

    visited.forEach(function(place) {

        if (place && place.state) {

            states.add(place.state);

        }

    });


    if (stateElement) {

        stateElement.textContent =
            states.size;

    }

}


/* ---------- PROFILE LEVEL ---------- */

function renderProfileLevel() {

    const visited =
        getProfileVisitedPlaces();

    const totalPlaces =
        typeof getAllHeritagePlaces === "function"
            ? getAllHeritagePlaces().length
            : 100;

    const visitedCount =
        visited.length;

    let progress =
        Math.round(
            (visitedCount / totalPlaces) * 100
        );

    progress =
        Math.max(
            0,
            Math.min(100, progress)
        );


    let level = 1;

    if (progress >= 10) level = 2;
    if (progress >= 25) level = 3;
    if (progress >= 45) level = 4;
    if (progress >= 70) level = 5;
    if (progress >= 90) level = 6;


    const levelElement =
        document.getElementById("profileLevel");

    const progressText =
        document.getElementById("profileProgressText");

    const progressBar =
        document.getElementById("profileProgressBar");

    const nextLevel =
        document.getElementById("profileNextLevel");


    if (levelElement) {

        levelElement.textContent =
            "Level " + level;

    }


    if (progressText) {

        progressText.textContent =
            progress + "%";

    }


    if (progressBar) {

        progressBar.style.width =
            progress + "%";

    }


    if (nextLevel) {

        nextLevel.textContent =
            level >= 6
                ? "🏆 You have reached the highest explorer level!"
                : "Keep exploring Bharat to unlock your next level.";

    }

}


/* ---------- PROFILE BADGES ---------- */

function renderProfileBadges() {

    const container =
        document.getElementById(
            "profileBadgesGrid"
        );

    if (!container) return;


    if (
        typeof PASSPORT_BADGES === "undefined"
    ) {

        container.innerHTML = `
            <div class="profile-badge unlocked">
                <div class="profile-badge-icon">
                    🏅
                </div>

                <strong>Explorer</strong>

                <small>
                    Start your heritage journey
                </small>
            </div>
        `;

        return;

    }


    const unlockedBadges =
        typeof getUnlockedBadges === "function"
            ? getUnlockedBadges()
            : [];


    container.innerHTML =
        PASSPORT_BADGES.map(function(badge) {

            const isUnlocked =
                unlockedBadges.some(function(item) {

                    return item.id === badge.id;

                });


            return `
                <div class="profile-badge ${
                    isUnlocked
                        ? "unlocked"
                        : "locked"
                }">

                    <div class="profile-badge-icon">
                        ${
                            isUnlocked
                                ? badge.icon
                                : "🔒"
                        }
                    </div>

                    <strong>
                        ${badge.name}
                    </strong>

                    <small>
                        ${
                            isUnlocked
                                ? "Unlocked"
                                : "Locked"
                        }
                    </small>

                </div>
            `;

        }).join("");

}


/* ---------- PROFILE INITIALIZE ---------- */

function renderUserProfile() {

    renderProfileName();

    renderProfileStats();

    renderProfileLevel();

    renderProfileBadges();

}


/* ---------- PROFILE BUTTON -------*/

/* ---------- NAVBAR PROFILE BUTTON ---------- */

function openUserProfile() {

    const profileSection =
        document.getElementById("profile");

    if (!profileSection) {
        console.error("Profile section not found.");
        return;
    }

    // Agar Quiz/fullscreen screen open hai to normal page restore karo
    document.body.style.overflow = "";

    // Profile section ko URL hash ke saath target karo
    history.pushState(null, "", "#profile");

    // Navbar ki height calculate karo
    const navbar =
        document.querySelector(".navbar");

    const navbarHeight =
        navbar ? navbar.offsetHeight : 80;

    // Profile ki exact position calculate karo
    const profilePosition =
        profileSection.getBoundingClientRect().top +
        window.pageYOffset -
        navbarHeight -
        15;

    // Direct Profile par scroll
    window.scrollTo({
        top: profilePosition,
        behavior: "smooth"
    });
}

/* ---------- INITIALIZE ---------- */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderUserProfile();

    }
);
/* =========================================
   PROFILE -> QUIZ PAGE
   ========================================= */
/* =========================================
   PROFILE -> QUIZ PAGE
========================================= */

function openQuizPage() {

    const quizSection =
        document.getElementById("quiz");

    if (!quizSection) {

        console.error(
            "Quiz section not found."
        );

        return;

    }


    /* Show Quiz */

    quizSection.classList.remove(
        "quiz-hidden"
    );

    quizSection.classList.add(
        "quiz-page-active"
    );


    document.body.style.overflow =
        "hidden";


    /* Reset Quiz */

    currentQuizQuestion = 0;

    heritageQuizScore = 0;

    quizAnswered = false;


    const startScreen =
        document.getElementById(
            "quizStartScreen"
        );

    const game =
        document.getElementById(
            "quizGame"
        );

    const result =
        document.getElementById(
            "quizResult"
        );


    if (startScreen) {

        startScreen.style.display =
            "block";

    }


    if (game) {

        game.style.display =
            "none";

    }


    if (result) {

        result.style.display =
            "none";

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
function closeQuizPage() {

    const quizSection =
        document.getElementById("quiz");

    if (!quizSection) return;


    quizSection.classList.remove(
        "quiz-page-active"
    );

    quizSection.classList.add(
        "quiz-hidden"
    );


    document.body.style.overflow =
        "";


    const profileSection =
        document.getElementById("profile");


    if (profileSection) {

        profileSection.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }

}
/* =====================================================
   STEP 19.3 — AI HERITAGE CHATBOT
   ===================================================== */

function toggleAIChat() {

    const chatWindow =
        document.getElementById("aiChatWindow");

    if (!chatWindow) return;

    chatWindow.classList.toggle("active");

    if (chatWindow.classList.contains("active")) {

        const input =
            document.getElementById("aiChatInput");

        if (input) {
            setTimeout(function () {
                input.focus();
            }, 200);
        }
    }
}


/* Enter key */

function handleAIChatKey(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendAIChatMessage();
    }
}


/* Send message */

function sendAIChatMessage() {

    const input =
        document.getElementById("aiChatInput");

    if (!input) return;

    const message =
        input.value.trim();

    if (!message) return;

    addAIChatMessage(message, "user");

    input.value = "";

    showAITyping();

    /*
       TEMPORARY RESPONSE

       Real AI backend Step 19.4 mein
       connect kiya jayega.
    */

    setTimeout(function () {

        removeAITyping();

        const response =
            getHeritageAIResponse(message);

        addAIChatMessage(response, "bot");

    }, 900);
}


/* Quick question */

function askAIQuickQuestion(question) {

    const input =
        document.getElementById("aiChatInput");

    if (!input) return;

    input.value = question;

    sendAIChatMessage();
}


/* Add message */

function addAIChatMessage(message, sender) {

    const messages =
        document.getElementById("aiChatMessages");

    if (!messages) return;

    const messageDiv =
        document.createElement("div");

    messageDiv.className =
        "ai-message " + sender;


    if (sender === "bot") {

        messageDiv.innerHTML = `
            <div class="ai-message-avatar">
                🤖
            </div>

            <div class="ai-message-content">
                <p>${formatAIMessage(message)}</p>
            </div>
        `;

    } else {

        messageDiv.innerHTML = `
            <div class="ai-message-content">
                <p>${formatAIMessage(message)}</p>
            </div>
        `;
    }


    messages.appendChild(messageDiv);

    messages.scrollTop =
        messages.scrollHeight;
}


/* Basic message formatting */

function formatAIMessage(message) {

    return message
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");
}


/* Typing indicator */

function showAITyping() {

    const messages =
        document.getElementById("aiChatMessages");

    if (!messages) return;

    removeAITyping();


    const typing =
        document.createElement("div");

    typing.id = "aiTypingIndicator";

    typing.className =
        "ai-message bot";

    typing.innerHTML = `
        <div class="ai-message-avatar">
            🤖
        </div>

        <div class="ai-typing">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;


    messages.appendChild(typing);

    messages.scrollTop =
        messages.scrollHeight;
}


/* Remove typing indicator */

function removeAITyping() {

    const typing =
        document.getElementById("aiTypingIndicator");

    if (typing) {
        typing.remove();
    }
}


/* =====================================================
   TEMPORARY HERITAGE RESPONSES
   Real AI will replace this in Step 19.4
   ===================================================== */

function getHeritageAIResponse(message) {

    const query =
        message.toLowerCase();


    /* Greeting */

    if (
        query.includes("hello") ||
        query.includes("hi") ||
        query.includes("namaste") ||
        query.includes("नमस्ते")
    ) {

        return `
            Namaste! 🙏<br>
            Main Yatra Drishti ka AI Heritage Guide hoon.
            Aap Bharat ke heritage, culture, traditions,
            monuments, festivals aur travel ke baare mein
            mujhse pooch sakte hain.
        `;
    }


    /* Taj Mahal */

    if (
        query.includes("taj mahal") ||
        query.includes("ताज महल")
    ) {

        return `
            🕌 Taj Mahal Agra, Uttar Pradesh mein
            Yamuna River ke kinare sthit ek famous
            Mughal-era monument hai. 

            Aap chahein to main iska history,
            architecture aur Agra heritage itinerary
            bhi bata sakta hoon.
        `;
    }


    /* Rajasthan */

    if (
        query.includes("rajasthan") ||
        query.includes("राजस्थान")
    ) {

        return `
            🏰 Rajasthan apne forts, palaces,
            desert culture aur royal heritage ke liye
            famous hai.

            Popular places mein Jaipur, Jodhpur,
            Udaipur, Jaisalmer aur Chittorgarh
            shamil hain.
        `;
    }


    /* Kashi / Varanasi */

    if (
        query.includes("kashi") ||
        query.includes("varanasi") ||
        query.includes("banaras") ||
        query.includes("काशी")
    ) {

        return `
            🕉️ Kashi, yani Varanasi/Banaras,
            Bharat ke pramukh spiritual aur cultural
            cities mein se ek hai.

            Ganga Ghats, Kashi Vishwanath Temple,
            Ganga Aarti aur ancient traditions
            iski identity ka important part hain.
        `;
    }


    /* Culture */

    if (
        query.includes("culture") ||
        query.includes("culture of india") ||
        query.includes("संस्कृति") ||
        query.includes("sanskriti")
    ) {

        return `
            🇮🇳 Indian culture bahut diverse hai.

            Ismein languages, music, dance,
            food, festivals, clothing, traditions,
            architecture aur regional customs
            shamil hain.

            India ke different regions ki apni
            unique cultural identity hai.
        `;
    }


    /* Heritage */

    if (
        query.includes("heritage") ||
        query.includes("monument") ||
        query.includes("monuments") ||
        query.includes("virasat") ||
        query.includes("विरासत")
    ) {

        return `
            🏛️ Bharat ka heritage historical
            monuments, archaeological sites,
            temples, forts, palaces, traditions,
            art forms aur living culture ka
            combination hai.

            Main aapko kisi bhi particular state,
            city ya heritage site ke baare mein
            explain kar sakta hoon.
        `;
    }


    /* Travel / Yatra */

    if (
        query.includes("trip") ||
        query.includes("travel") ||
        query.includes("yatra") ||
        query.includes("plan") ||
        query.includes("tour")
    ) {

        return `
            🗺️ Bilkul! Main aapki heritage Yatra
            plan karne mein help kar sakta hoon.

            Aap mujhe bas ye batao:

            📍 Destination
            📅 Kitne din
            💰 Approx budget
            ❤️ Kis type ka heritage pasand hai

            Example:
            "Mujhe 3 din ki Rajasthan heritage
            trip plan karo."
        `;
    }


    /* Default */

    return `
        🤖 Interesting question!

        Main Bharat ke heritage, culture,
        traditions, monuments, festivals,
        architecture aur Yatra planning se
        related questions answer kar sakta hoon.

        Aap apna question thoda detail mein
        pooch sakte hain.

        Example:
        "Khajuraho temples ki history batao."
    `;


}


/* =====================================================
   EXPLORE INDIA → ADD TO YATRA
===================================================== */

/* =========================================================
   STEP 20.3 — ADVANCED PLAN YATRA JAVASCRIPT
   ========================================================= */

let advancedYatraPlaces = [];

/* =====================================================
   ADD PLACE DIRECTLY TO YATRA
===================================================== */
function addPlaceToYatra(state, index) {

    if (advancedYatraPlaces.length >= 4) {
        alert("🧭 Your Yatra can have maximum 4 destinations.");
        return;
    }

    const places = getPlacesByState(state);

    if (!places || !places[index]) {
        alert("❌ Destination not found.");
        return;
    }

    const rawPlace = places[index];

    const place = {
        name: rawPlace[0],
        category: rawPlace[1],
        lat: rawPlace[2],
        lng: rawPlace[3],
        state: state
    };

    const alreadyAdded = advancedYatraPlaces.some(function(item) {
        return (
            item.name === place.name &&
            item.state === place.state
        );
    });

    if (alreadyAdded) {
        alert("🗺️ This destination is already in your Yatra.");
        return;
    }

    advancedYatraPlaces.push(place);

    updateYatraPlanner();

    /* ONLY OPEN PLAN YATRA AFTER 4TH DESTINATION */

    if (advancedYatraPlaces.length === 4) {

        const yatraSection =
            document.getElementById("yatra");

        if (yatraSection) {
            setTimeout(function() {
                yatraSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }, 300);
        }

        alert("🎉 4 destinations added! Your Yatra is ready to plan.");

    } else {

        alert(
            `🗺️ ${place.name} added to Yatra — ` +
            `${advancedYatraPlaces.length}/4`
        );

    }
}

/* ---------- OPEN DESTINATION PICKER ---------- */

function openYatraDestinationPicker(slotNumber) {

    if (advancedYatraPlaces.length >= 4) {
        alert("🧭 You can add maximum 4 destinations to your Yatra.");
        return;
    }

    const allPlaces = getAllHeritagePlaces();

    if (!allPlaces || allPlaces.length === 0) {
        alert("Heritage destinations are not available.");
        return;
    }

    let options = allPlaces.map(function(place, index) {

        return `
            <option value="${index}">
                ${place.name} — ${place.state}
            </option>
        `;

    }).join("");


    const existingPicker =
        document.getElementById("yatraDestinationPicker");

    if (existingPicker) {
        existingPicker.remove();
    }


    const picker = document.createElement("div");

    picker.id = "yatraDestinationPicker";

    picker.innerHTML = `

        <div class="yatra-picker-overlay"
             onclick="closeYatraDestinationPicker()">
        </div>

        <div class="yatra-picker-modal">

            <button
                type="button"
                class="yatra-picker-close"
                onclick="closeYatraDestinationPicker()">

                ×

            </button>

            <div class="yatra-picker-icon">
                🏛️
            </div>

            <span class="yatra-label">
                CHOOSE DESTINATION
            </span>

            <h3>
                Select a Heritage Place
            </h3>

            <p>
                Choose a destination to add to your Yatra.
            </p>

            <select
                id="yatraDestinationSelect"
                class="yatra-destination-select">

                <option value="">
                    Select a destination...
                </option>

                ${options}

            </select>

            <button
                type="button"
                class="yatra-picker-add"
                onclick="confirmYatraDestination(${slotNumber})">

                + Add Destination

            </button>

        </div>
    `;

    const planner = document.getElementById("yatraPlanner");

if (planner) {
    planner.appendChild(picker);
} else {
    document.body.appendChild(picker);
}

}


/* ---------- CONFIRM DESTINATION ---------- */

function confirmYatraDestination(slotNumber) {

    const select =
        document.getElementById("yatraDestinationSelect");

    if (!select || select.value === "") {

        alert("Please select a destination first.");

        return;
    }


    const allPlaces = getAllHeritagePlaces();

    const place =
        allPlaces[Number(select.value)];

    if (!place) return;


    /* Prevent duplicate destination */

    const alreadyAdded =
        advancedYatraPlaces.some(function(item) {

            return (
                item.name === place.name &&
                item.state === place.state
            );

        });


    if (alreadyAdded) {

        alert("🧭 This destination is already in your Yatra.");

        return;
    }


    /* Add destination */

    advancedYatraPlaces.push(place);


    updateYatraPlanner();


    closeYatraDestinationPicker();

}


/* ---------- CLOSE PICKER ---------- */

function closeYatraDestinationPicker() {

    const picker =
        document.getElementById("yatraDestinationPicker");

    if (picker) {
        picker.remove();
    }

}

 
    
    /* =====================================================
   REMOVE PLACE FROM YATRA
===================================================== */

function removePlaceFromYatra(index) {

    if (
        index < 0 ||
        index >= advancedYatraPlaces.length
    ) {
        return;
    }

    const place =
        advancedYatraPlaces[index];

    const confirmRemove =
        confirm(
            `Remove "${place.name}" from your Yatra?`
        );

    if (!confirmRemove) {
        return;
    }

    advancedYatraPlaces.splice(index, 1);

    updateYatraPlanner();

}
    /* =====================================================
   UPDATE PLAN YATRA UI
===================================================== */

function updateYatraPlanner() {

    /* Update selected count */
    const countElement =
        document.getElementById("yatraSelectedCount");

    if (countElement) {
        countElement.textContent =
            advancedYatraPlaces.length;
    }


    /* Update state count */
    const stateCount =
        document.getElementById("yatraStateCount");

    if (stateCount) {

        const states = [
            ...new Set(
                advancedYatraPlaces.map(function(place) {
                    return place.state;
                })
            )
        ];

        stateCount.textContent =
            states.length;
    }


    /* Update 4 destination slots */
    for (let i = 1; i <= 4; i++) {

        const slot =
            document.getElementById("yatraSlot" + i);

        const placeElement =
            document.getElementById("yatraPlace" + i);

        if (!slot || !placeElement) {
            continue;
        }


        const place =
            advancedYatraPlaces[i - 1];


        /* PLACE ADDED */
        if (place) {

            placeElement.textContent =
                place.name + " — " + place.state;

            slot.classList.add("selected");


            const button =
                slot.querySelector(".yatra-add-btn");

            if (button) {

                button.textContent =
                    "✓ Added";

                button.onclick =
                    function() {
                        removePlaceFromYatra(i - 1);
                    };

                button.classList.add(
                    "yatra-remove-btn"
                );
            }

        }


        /* EMPTY SLOT */
        else {

            placeElement.textContent =
                "Choose a heritage destination";

            slot.classList.remove("selected");


            const button =
                slot.querySelector(".yatra-add-btn");

            if (button) {

                button.textContent =
                    "+ Add";

                button.onclick =
                    function() {
                        openYatraDestinationPicker(i);
                    };

                button.classList.remove(
                    "yatra-remove-btn"
                );
            }
        }
    }
}

/* ---------- CLEAR YATRA ---------- */

function clearYatraPlanner() {

    if (advancedYatraPlaces.length === 0) {
        return;
    }


    advancedYatraPlaces = [];

    updateYatraPlanner();


    const result =
        document.getElementById("advancedYatraResult");

    if (result) {

        result.innerHTML = "";

        result.style.display = "none";

    }

}


/* ---------- GENERATE YATRA ---------- */
function generateAdvancedYatra() {

    if (advancedYatraPlaces.length === 0) {

        alert(
            "🗺️ Please add at least one destination before generating your Yatra"
        );

        return;
    }


    /* ---------- CHECK CURRENT LOCATION ---------- */

    if (!userCurrentLocation) {

        alert(
            "📍 Please detect your current location first."
        );

        setYatraCurrentLocation();

        return;
    }


    /* ---------- FIND BEST ROUTE ---------- */

    const optimizedYatra =
        findBestYatraRoute(
            userCurrentLocation,
            advancedYatraPlaces
        );


    if (!optimizedYatra) {

        alert(
            "❌ Unable to create your Yatra route."
        );

        return;
    }


    /* ---------- REORDER DESTINATIONS ---------- */

    advancedYatraPlaces =
        optimizedYatra.route;


    /* ---------- DISTANCE ---------- */

    const totalDistanceKm =
        optimizedYatra.distanceKm;


    console.log(
        "🧭 Optimized Yatra:",
        optimizedYatra.route
    );


    console.log(
        "📏 Estimated Distance:",
        totalDistanceKm.toFixed(2),
        "km"
    );


    const result =
        document.getElementById(
            "advancedYatraResult"
        );


    if (!result) return;


    const cards =
        advancedYatraPlaces.map(function(place, index) {

            return `

                <div class="advanced-yatra-result-item">

                    <div class="advanced-yatra-result-number">
                        ${index + 1}
                    </div>

                    <div>

                        <strong>
                            ${place.name}
                        </strong>

                        <span>
                            ${place.state} • ${place.category}
                        </span>

                    </div>

                </div>

            `;

        }).join("");


    result.innerHTML = `

        <div class="advanced-yatra-result-card">

            <span class="yatra-label">
                YOUR PERSONALIZED YATRA
            </span>

            <h3>
                🧭 Your Heritage Route is Ready
            </h3>

            <p>
                Explore these selected heritage destinations
                across Bharat.
            </p>

            <div class="advanced-yatra-result-list">

                ${cards}

            </div>

            <button
                type="button"
                class="btn primary"
                onclick="saveAdvancedYatra()">

                💾 Save to My Journeys

            </button>

        </div>

    `;


    result.style.display = "block";


    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =====================================================
   UNIFIED AI + YATRA GENERATOR
===================================================== */

function generateUnifiedYatra() {

    if (advancedYatraPlaces.length === 0) {

        alert(
            "🗺️ Please add at least one destination to your Yatra."
        );

        return;
    }


    if (!userCurrentLocation) {

        alert(
            "📍 Please select your starting location first."
        );

        setYatraCurrentLocation();

        return;
    }


    const durationElement =
        document.getElementById("aiDuration");

    const budgetElement =
        document.getElementById("aiBudget");

    const travelElement =
        document.getElementById("aiTravelMode");


    const duration =
        durationElement
            ? parseInt(durationElement.value) || 1
            : 1;

    const budget =
        budgetElement
            ? parseInt(budgetElement.value) || 5000
            : 5000;

    const travelMode =
        travelElement
            ? travelElement.value
            : "Driving";


    const optimizedYatra =
        findBestYatraRoute(
            userCurrentLocation,
            advancedYatraPlaces
        );


    if (!optimizedYatra) {

        alert(
            "❌ Unable to create your Yatra route."
        );

        return;
    }


    advancedYatraPlaces =
        optimizedYatra.route;


    updateYatraPlanner();


    renderUnifiedYatraResult(
        duration,
        budget,
        travelMode,
        optimizedYatra.distanceKm
    );

}

/* =====================================================
   RENDER UNIFIED YATRA RESULT
===================================================== */

function renderUnifiedYatraResult(
    duration,
    budget,
    travelMode,
    distanceKm
) {

    const result =
        document.getElementById(
            "advancedYatraResult"
        );

    if (!result) {
        console.error(
            "advancedYatraResult not found."
        );
        return;
    }


    let html = `

        <div class="unified-yatra-result">

            <div class="unified-result-header">

                <span>
                    ✨ YOUR PERSONALIZED YATRA
                </span>

                <h2>
                    Your Bharat Journey
                </h2>

                <p>
                    AI preferences and your selected
                    destinations have been combined
                    into your personalized journey.
                </p>

            </div>


            <div class="yatra-result-stats">

                <div>
                    <strong>
                        ${advancedYatraPlaces.length}
                    </strong>

                    <span>
                        Destinations
                    </span>
                </div>


                <div>
                    <strong>
                        ${duration}
                    </strong>

                    <span>
                        Days
                    </span>
                </div>


                <div>
                    <strong>
                        ₹${budget.toLocaleString("en-IN")}
                    </strong>

                    <span>
                        Budget
                    </span>
                </div>


                <div>
                    <strong>
                        ${distanceKm.toFixed(0)} km
                    </strong>

                    <span>
                        Estimated Distance
                    </span>
                </div>

            </div>


            <div class="yatra-route-timeline">

    `;


    advancedYatraPlaces.forEach(
        function(place, index) {

            html += `

                <div class="yatra-route-stop">

                    <div class="route-number">
                        ${index + 1}
                    </div>


                    <div class="route-content">

                        <span>
                            ${place.state}
                            •
                            ${place.category}
                        </span>


                        <h3>
                            ${place.name}
                        </h3>


                        <p>
                            📍 Heritage destination
                        </p>

                    </div>

                </div>

            `;

        }
    );


    html += `

            </div>


            <div class="route-note">

                🧭 Route sequence is calculated using
                geographic distance between destinations.

            </div>

        </div>

    `;


    result.innerHTML = html;

    result.style.display = "block";


    result.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}
/* ---------- SAVE YATRA ---------- */

function saveAdvancedYatra() {

    if (advancedYatraPlaces.length === 0) {
        return;
    }


    let journey =
        JSON.parse(
            localStorage.getItem("yatra_journey") || "[]"
        );


    advancedYatraPlaces.forEach(function(place) {

        const exists =
            journey.some(function(item) {

                return (
                    item.name === place.name &&
                    item.state === place.state
                );

            });


        if (!exists && journey.length < 4) {

            journey.push(place);

        }

    });


    localStorage.setItem(
        "yatra_journey",
        JSON.stringify(journey)
    );


    alert("🧭 Your Yatra has been saved to My Journeys!");


    if (typeof renderMyJourneys === "function") {

        renderMyJourneys();

    }

}



/* ---------- CURRENT LOCATION ---------- */

function setYatraCurrentLocation() {

    const locationElement =
        document.getElementById("yatraCurrentLocation");

    if (!locationElement) return;

    if (!navigator.geolocation) {

        locationElement.textContent =
            "Location is not supported by this browser.";

        return;
    }

    locationElement.textContent =
        "📍 Getting your current location...";

    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            /* Save location globally */
            userCurrentLocation = {
                lat: latitude,
                lng: longitude
            };

            /* Show location */
            locationElement.textContent =
                `📍 Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;

            console.log(
                "🧭 Yatra Current Location:",
                userCurrentLocation
            );
        },

        function(error) {

            console.error(
                "Yatra Location Error:",
                error
            );

            locationElement.textContent =
                "❌ Location permission was not granted.";
        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}


/* ---------- OPEN AI CHAT FROM YATRA ---------- */

function openAIChatFromYatra() {

    const chatWindow =
        document.getElementById("aiChatWindow");

    if (!chatWindow) return;


    chatWindow.classList.add("active");


    const input =
        document.getElementById("aiChatInput");

    if (input) {
        input.focus();
    }

}
/* =========================================================
   STEP 20.4 — SMART YATRA ROUTE OPTIMIZATION
   ========================================================= */

/* ---------- DISTANCE CALCULATOR ---------- */
function generateRoutePermutations(items) {

    if (items.length <= 1) {
        return [items.slice()];
    }

    const routes = [];

    items.forEach(function(item, index) {

        const remaining =
            items.slice(0, index)
            .concat(items.slice(index + 1));

        const subRoutes =
            generateRoutePermutations(remaining);

        subRoutes.forEach(function(route) {

            routes.push(
                [item].concat(route)
            );

        });

    });

    return routes;
}

function calculateDistanceKm(pointA, pointB) {

    const R = 6371;

    const dLat =
        (pointB.lat - pointA.lat) *
        Math.PI / 180;

    const dLng =
        (pointB.lng - pointA.lng) *
        Math.PI / 180;

    const lat1 =
        pointA.lat *
        Math.PI / 180;

    const lat2 =
        pointB.lat *
        Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(dLng / 2) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}

/* ---------- FIND BEST YATRA ROUTE ---------- */

function findBestYatraRoute(startLocation, destinations) {

    if (
        !startLocation ||
        !Array.isArray(destinations) ||
        destinations.length === 0
    ) {
        return null;
    }

    const routes =
        generateRoutePermutations(destinations);

    let bestRoute = null;
    let shortestDistance = Infinity;

    routes.forEach(function(route) {

        let totalDistance = 0;

        let currentPoint =
            startLocation;

        route.forEach(function(place) {

            totalDistance +=
                calculateDistanceKm(
                    currentPoint,
                    {
                        lat: Number(place.lat),
                        lng: Number(place.lng)
                    }
                );

            currentPoint = {
                lat: Number(place.lat),
                lng: Number(place.lng)
            };

        });

        if (
            totalDistance <
            shortestDistance
        ) {

            shortestDistance =
                totalDistance;

            bestRoute =
                route.slice();
        }

    });

    return {
        route: bestRoute,
        distanceKm: shortestDistance
    };
}
