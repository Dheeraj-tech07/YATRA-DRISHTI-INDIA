(function () {
    "use strict";

    // Local development ke liye Express server ka single API base URL.
    const API_BASE_URL = "https://yatra-drishti-api.onrender.com/api";


 window.loadHeritageFromBackend = async function () {
    const response = await fetch(`${API_BASE_URL}/heritage`);

    if (!response.ok) {
        throw new Error("Heritage data load nahi hua.");
    }

    return await response.json();
};

    const searchInput = document.getElementById("heritageSearch");
    const searchButton = document.getElementById("heritageSearchBtn");
    const resultsContainer = document.getElementById("heritageResults");
    const feedbackForm = document.getElementById("detailsForm");
    const feedbackStatus = document.getElementById("feedbackStatus");

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderApiResults(monuments) {
        if (!resultsContainer) return;
        if (!monuments.length) {
            resultsContainer.innerHTML = "<div class=\"explore-empty\"><h3>No heritage place found</h3><p>MongoDB me is search ka result nahi mila.</p></div>";
            return;
        }

        // Backend records ko existing visual cards ke compatible simple markup me dikhate hain.
        resultsContainer.innerHTML = monuments.map(function (monument) {
            return "<article class=\"heritage-card api-heritage-card\">" +
                "<div class=\"heritage-card-icon\">🏛️</div>" +
                "<span class=\"heritage-category\">" + escapeHtml(monument.category) + "</span>" +
                "<h3>" + escapeHtml(monument.name) + "</h3>" +
                "<p class=\"heritage-card-location\">📍 " + escapeHtml(monument.location || monument.state) + "</p>" +
                "<p>" + escapeHtml(monument.description) + "</p>" +
                "<button type=\"button\" data-ai-site=\"" + escapeHtml(monument.name) + "\">✦ Get AI Summary</button>" +
                "<p class=\"api-ai-summary\" aria-live=\"polite\"></p>" +
                "</article>";
        }).join("");
    }

    async function searchBackend() {
        const query = searchInput ? searchInput.value.trim() : "";
        if (!query || !resultsContainer) return;

        try {
            const response = await fetch(API_BASE_URL + "/heritage/search?q=" + encodeURIComponent(query));
            if (!response.ok) throw new Error("Backend search unavailable");
            renderApiResults(await response.json());
        } catch (error) {
            // Mongo unavailable ho to existing local intelligent search ko fallback milta rahe.
            console.warn("Backend search fallback:", error.message);
            if (typeof searchHeritage === "function") searchHeritage();
        }
    }

    async function loadAISummary(button) {
        const card = button.closest(".api-heritage-card");
        const summary = card ? card.querySelector(".api-ai-summary") : null;
        button.disabled = true;
        if (summary) summary.textContent = "AI summary load ho rahi hai...";

        try {
            const response = await fetch(API_BASE_URL + "/ai-info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteName: button.dataset.aiSite })
            });
            const payload = await response.json();
            if (!response.ok) throw new Error(payload.message || "AI request failed");
            if (summary) summary.textContent = payload.summary;
        } catch (error) {
            if (summary) summary.textContent = "AI summary abhi available nahi hai. Backend key check karein.";
            console.error("AI info error:", error);
        } finally {
            button.disabled = false;
        }
    }

    if (searchButton) searchButton.addEventListener("click", searchBackend);
    if (searchInput) searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchBackend();
        }
    });

    if (resultsContainer) resultsContainer.addEventListener("click", function (event) {
        const button = event.target.closest("[data-ai-site]");
        if (button) loadAISummary(button);
    });

    // Existing Explore/View button ko wrap karke modal details ko Gemini summary se enrich karte hain.
    const originalViewHeritage = window.viewHeritage;
    if (typeof originalViewHeritage === "function") {
        window.viewHeritage = function (state, index) {
            originalViewHeritage(state, index);
            const heritageData = typeof INDIA_HERITAGE !== "undefined" ? INDIA_HERITAGE : null;
            const place = heritageData && heritageData[state]
                ? heritageData[state][index]
                : null;
            if (!place) return;

            fetch(API_BASE_URL + "/ai-info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteName: place[0] })
            })
                .then(function (response) { return response.ok ? response.json() : null; })
                .then(function (payload) {
                    const description = document.getElementById("modelDescription");
                    if (payload && description) description.textContent = payload.summary;
                })
                .catch(function (error) { console.warn("View details AI fallback:", error.message); });
        };
    }

    if (feedbackForm) feedbackForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const formData = new FormData(feedbackForm);
        const payload = Object.fromEntries(formData.entries());
        if (feedbackStatus) feedbackStatus.textContent = "Feedback submit ho raha hai...";

        try {
            const response = await fetch(API_BASE_URL + "/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Feedback submit failed");
            feedbackForm.reset();
            if (feedbackStatus) feedbackStatus.textContent = "Dhanyavaad! Feedback save ho gaya.";
        } catch (error) {
            if (feedbackStatus) feedbackStatus.textContent = "Feedback save nahi hua. Backend running hai?";
            console.error("Feedback error:", error);
        }
    });
})();