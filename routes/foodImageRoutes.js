const express = require("express");

const router = express.Router();
const supabase = require("../config/supabase");

const STORAGE_BUCKET = "heritage-images";
// Temporary cache: same failed image ko baar-baar search nahi karenge
const FAILED_IMAGE_CACHE = new Set();

function getImageCacheKey(name, state, category) {
    return [
        normalizeText(name),
        normalizeText(state),
        normalizeText(category)
    ].join("|");
}

// ============================================================
// BASIC HELPERS
// ============================================================

function normalizeText(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


function slugify(value) {
    return normalizeText(value)
        .replace(/\s+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);
}


function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}


function safeMetadataValue(value) {
    if (!value) return "";

    if (typeof value === "object") {
        return (
            value.value ||
            value.text ||
            value.html ||
            ""
        );
    }

    return String(value);
}


function getExtension(contentType, url) {

    const type = String(contentType || "").toLowerCase();

    if (type.includes("png")) return "png";
    if (type.includes("webp")) return "webp";
    if (type.includes("gif")) return "gif";

    const cleanUrl = String(url || "")
        .split("?")[0]
        .toLowerCase();

    if (cleanUrl.endsWith(".png")) return "png";
    if (cleanUrl.endsWith(".webp")) return "webp";
    if (cleanUrl.endsWith(".gif")) return "gif";

    return "jpg";
}


function isUsableImageUrl(url) {

    if (!url) return false;

    const value = String(url).toLowerCase();

    if (!value.startsWith("http")) return false;

    if (
        value.includes(".svg") ||
        value.includes(".pdf") ||
        value.includes(".tif") ||
        value.includes(".tiff")
    ) {
        return false;
    }

    return true;
}


// ============================================================
// FETCH WITH TIMEOUT
// ============================================================

async function fetchWithTimeout(url, options = {}, timeout = 8000) {

    const controller = new AbortController();

    const timer = setTimeout(function () {
        controller.abort();
    }, timeout);

    try {

        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });

        return response;

    } finally {

        clearTimeout(timer);

    }
}


// ============================================================
// WIKIMEDIA SEARCH
// ============================================================

async function searchWikimedia(query) {

    const url =
        "https://commons.wikimedia.org/w/api.php?" +
        new URLSearchParams({
            action: "query",
            format: "json",
            generator: "search",
            gsrsearch: query,
            gsrnamespace: "6",
            gsrlimit: "5",
            prop: "imageinfo",
            iiprop: "url|mime|size|extmetadata",
            iiurlwidth: "900"
        }).toString();

    try {

        const response = await fetchWithTimeout(url);

        if (!response.ok) {
            return [];
        }

        const data = await response.json();

        const pages =
            data &&
            data.query &&
            data.query.pages
                ? Object.values(data.query.pages)
                : [];

        return pages
            .map(function (page) {

                const info =
                    page.imageinfo &&
                    page.imageinfo[0]
                        ? page.imageinfo[0]
                        : null;

                if (!info) return null;

                const imageUrl =
                    info.thumburl ||
                    info.url ||
                    "";

                if (!isUsableImageUrl(imageUrl)) {
                    return null;
                }

                const metadata =
                    info.extmetadata || {};

                return {
                    title: page.title || "",
                    image_url: imageUrl,
                    source_url:
                        "https://commons.wikimedia.org/wiki/" +
                        encodeURIComponent(
                            String(page.title || "").replace(/ /g, "_")
                        ),
                    license:
                        safeMetadataValue(
                            metadata.LicenseShortName
                        ) ||
                        safeMetadataValue(
                            metadata.License
                        ) ||
                        "",
                    credit:
                        safeMetadataValue(
                            metadata.Artist
                        ) ||
                        safeMetadataValue(
                            metadata.Credit
                        ) ||
                        "",
                    description:
                        safeMetadataValue(
                            metadata.ImageDescription
                        ) || "",
                    width: Number(info.width || 0),
                    height: Number(info.height || 0)
                };

            })
            .filter(Boolean);

    } catch (error) {

        console.warn(
            "Wikimedia search failed:",
            error.message
        );

        return [];

    }
}


// ============================================================
// WIKIMEDIA SCORING
// ============================================================

function scoreWikimediaCandidate(candidate, name, state, category) {

    const title = normalizeText(candidate.title);
    const description = normalizeText(candidate.description);

    const targetName = normalizeText(name);
    const targetState = normalizeText(state);
    const targetCategory = normalizeText(category);

    let score = 0;

    // ==========================================
    // 1. WRONG IMAGE TYPES REJECT
    // ==========================================

    const badWords = [
        "map",
        "maps",
        "logo",
        "flag",
        "diagram",
        "icon",
        "symbol",
        "stamp",
        "poster",
        "collage",
        "route",
        "location map",
        "district map",
        "event poster",
        "festival poster",
        "infographic",
        "chart",
        "ticket",
        "menu",
        "restaurant menu",
        "cookbook",
        "book",
        "illustration",
        "drawing",
        "sketch",
        "packaging",
        "advertisement",
        "banner",
        "thumbnail",
        "screenshot"
    ];

    for (const word of badWords) {
        if (title.includes(word)) {
            return 0;
        }
    }

    // ==========================================
    // 2. PLACE NAME MATCH
    // ==========================================

    const nameWords = targetName
        .split(" ")
        .filter(function (word) {
            return word.length >= 3;
        });

    const matchedNameWords = nameWords.filter(function (word) {
        return title.includes(word);
    });

    // Exact name
    if (
        targetName &&
        title.includes(targetName)
    ) {
        score += 150;
    }

    // All important words
    else if (
        nameWords.length > 0 &&
        matchedNameWords.length === nameWords.length
    ) {
        score += 110;
    }

    // Most words
    else if (
        nameWords.length > 0 &&
        matchedNameWords.length / nameWords.length >= 0.75
    ) {
        score += 70;
    }

    // No useful match
    else {
        return 0;
    }

    // ==========================================
    // 3. STATE MATCH
    // ==========================================

    if (
        targetState &&
        title.includes(targetState)
    ) {
        score += 35;
    }
    else if (
        targetState &&
        description.includes(targetState)
    ) {
        score += 15;
    }

    // ==========================================
    // 4. CATEGORY MATCH
    // ==========================================

    if (
        targetCategory &&
        title.includes(targetCategory)
    ) {
        score += 10;
    }

    // ==========================================
    // 5. IMAGE QUALITY
    // ==========================================

    if (
        candidate.width >= 1200 &&
        candidate.height >= 700
    ) {
        score += 15;
    }
    else if (
        candidate.width >= 800 &&
        candidate.height >= 500
    ) {
        score += 8;
    }

    return score;
}
// ============================================================
// WIKIMEDIA BEST IMAGE
// ============================================================

async function findBestWikimediaImage(
    name,
    state,
    category
) {

    const queries = [
        `"${name}" ${state} India`,
        `"${name}" ${state}`,
        `"${name}" India`,
        `${name} ${state}`
    ];

    const candidateMap = new Map();

    for (const query of queries) {

        const results =
            await searchWikimedia(query);

        for (const item of results) {

            const key =
                normalizeText(item.title) +
                "|" +
                String(item.image_url || "");

            if (!candidateMap.has(key)) {
                candidateMap.set(key, item);
            }
        }
    }

    const scored =
        Array.from(candidateMap.values())
            .map(function (item) {

                return {
                    ...item,
                    score:
                        scoreWikimediaCandidate(
                            item,
                            name,
                            state,
                            category
                        )
                };

            })
            .filter(function (item) {
                return item.score > 0;
            })
            .sort(function (a, b) {
                return b.score - a.score;
            });

    if (
        !scored.length ||
        scored[0].score < 100
    ) {

        console.log(
            "No strong image found:",
            name,
            state
        );

        return null;
    }

    console.log(
        "Selected image:",
        name,
        "=>",
        scored[0].title,
        "score:",
        scored[0].score
    );

    return scored[0];
}
// ============================================================
// OPENVERSE SEARCH
// ============================================================

async function searchOpenverse(
    name,
    state,
    category
) {

   const queries = [
    `${name} ${state}`
];

    for (const query of queries) {

        try {

            const url =
                "https://api.openverse.org/v1/images/?" +
                new URLSearchParams({
                    q: query,
                    page_size: "8"
                }).toString();


            const response =
                await fetchWithTimeout(url);


            if (!response.ok) {
                continue;
            }


            const data =
                await response.json();


            const results =
                Array.isArray(data.results)
                    ? data.results
                    : [];


            const usable =
                results.filter(function (item) {

                    return (
                        item &&
                        (
                            item.thumbnail ||
                            item.url
                        )
                    );

                });


            if (usable.length > 0) {

                const target =
                    normalizeText(name);

                const targetState =
                    normalizeText(state);


                usable.sort(function (a, b) {

                    const aText =
                        normalizeText(
                            `${a.title || ""} ${a.tags || ""}`
                        );

                    const bText =
                        normalizeText(
                            `${b.title || ""} ${b.tags || ""}`
                        );


                    let aScore = 0;
                    let bScore = 0;


                    if (aText.includes(target)) {
                        aScore += 50;
                    }

                    if (bText.includes(target)) {
                        bScore += 50;
                    }


                    if (
                        targetState &&
                        aText.includes(targetState)
                    ) {
                        aScore += 15;
                    }

                    if (
                        targetState &&
                        bText.includes(targetState)
                    ) {
                        bScore += 15;
                    }


                    return bScore - aScore;

                });


                const best = usable[0];


                return {

                    title:
                        best.title || name,

                    image_url:
                        best.url ||
                        best.thumbnail ||
                        "",

                    source_url:
                        best.foreign_landing_url ||
                        best.detail_url ||
                        best.source ||
                        "",

                    license:
                        best.license ||
                        "",

                    credit:
                        best.creator ||
                        "",

                    description:
                        best.title ||
                        "",

                    width:
                        Number(best.width || 0),

                    height:
                        Number(best.height || 0),

                    source: "Openverse"

                };

            }

        } catch (error) {

            console.warn(
                "Openverse search failed:",
                error.message
            );

        }

        //await sleep(150);
    }

    return null;
}


// ============================================================
// DOWNLOAD IMAGE
// ============================================================

async function downloadImage(imageUrl) {

    const response =
        await fetchWithTimeout(
            imageUrl,
            {},
            10000
        );


    if (!response.ok) {
        throw new Error(
            `Image download failed: HTTP ${response.status}`
        );
    }


    const contentType =
        response.headers.get("content-type") ||
        "image/jpeg";


    if (
        !contentType.startsWith("image/")
    ) {
        throw new Error(
            `Not an image: ${contentType}`
        );
    }


    const buffer =
        Buffer.from(
            await response.arrayBuffer()
        );


    if (!buffer.length) {
        throw new Error(
            "Downloaded image is empty"
        );
    }


    return {
        buffer,
        contentType
    };
}


// ============================================================
// UPLOAD TO SUPABASE STORAGE
// ============================================================

async function uploadToSupabaseStorage(
    buffer,
    contentType,
    folder,
    name,
    id
) {

    const extension =
        getExtension(
            contentType,
            ""
        );


    const fileName =
        `${slugify(name)}-${id}.${extension}`;


    const storagePath =
        `${folder}/${fileName}`;


    const uploadResult =
        await supabase
            .storage
            .from(STORAGE_BUCKET)
            .upload(
                storagePath,
                buffer,
                {
                    contentType,
                    cacheControl: "31536000",
                    upsert: true
                }
            );


    if (uploadResult.error) {

        throw new Error(
            uploadResult.error.message
        );

    }


    const publicResult =
        supabase
            .storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(storagePath);


    if (
        !publicResult ||
        !publicResult.data ||
        !publicResult.data.publicUrl
    ) {

        throw new Error(
            "Supabase public URL create nahi hua."
        );

    }


    return {
        path: storagePath,
        publicUrl:
            publicResult.data.publicUrl
    };
}


// ============================================================
// FIND IMAGE
// ============================================================

async function findImage(
    name,
    state,
    category
) {

        const cacheKey = getImageCacheKey(
        name,
        state,
        category
    );

    if (FAILED_IMAGE_CACHE.has(cacheKey)) {
        return null;
    }
    // -----------------------------------------
    // 1. WIKIMEDIA FIRST
    // -----------------------------------------

    const wikimedia =
        await findBestWikimediaImage(
            name,
            state,
            category
        );


    if (wikimedia) {

        return {
            ...wikimedia,
            source: "Wikimedia Commons"
        };

    }


    // -----------------------------------------
    // 2. OPENVERSE FALLBACK
    // -----------------------------------------

    const openverse =
        await searchOpenverse(
            name,
            state,
            category
        );


    if (openverse) {
        return openverse;
    }


     FAILED_IMAGE_CACHE.add(cacheKey);
    return null;
}

// ============================================================
// SYNC FOOD
// ============================================================

async function syncFood(food) {

    const name =
        food.name || "food";


    const state =
        food.state || "";


    const category =
        "food";


    const image =
        await findImage(
            name,
            state,
            category
        );


    if (!image) {

        return {
            success: false,
            id: food.id,
            name,
            reason:
                "No suitable image found"
        };

    }


    const downloaded =
        await downloadImage(
            image.image_url
        );


    const uploaded =
        await uploadToSupabaseStorage(
            downloaded.buffer,
            downloaded.contentType,
            "food",
            name,
            food.id
        );

const updateResult =
    await supabase
        .from("foods")
        .update({

            image_url:
                uploaded.publicUrl,

            image_source_url:
                image.source_url || "",

            image_license:
                image.license || "",

            image_credit:
                image.credit || "",

            image_sync_status:
                "success",

            image_sync_error:
                ""

        })
        .eq("id", food.id);


    if (updateResult.error) {

        throw new Error(
            updateResult.error.message
        );

    }


    return {

        success: true,

        id: food.id,

        name,

        image_url:
            uploaded.publicUrl,

        source:
            image.source,

        source_url:
            image.source_url || "",

        license:
            image.license || "",

        credit:
            image.credit || ""

    };
}


// ============================================================
// SYNC HERITAGE
// ============================================================

async function syncHeritage(place) {

    const name =
        place.name || "heritage";


    const state =
        place.state || "";


    const category =
        place.category || "heritage";


    const image =
        await findImage(
            name,
            state,
            category
        );


    if (!image) {
    await supabase
        .from("heritage")
        .update({
            image_sync_status: "failed",
            image_sync_error: "No suitable image found"
        })
        .eq("id", place.id);

    return {
        success: false,
        id: place.id,
        name,
        reason: "No suitable image found"
    };
}


    const downloaded =
        await downloadImage(
            image.image_url
        );


    const uploaded =
        await uploadToSupabaseStorage(
            downloaded.buffer,
            downloaded.contentType,
            "heritage",
            name,
            place.id
        );


    const updateResult =
        await supabase
            .from("heritage")
            .update({

                image_url:
                    uploaded.publicUrl,

                image_source_url:
                    image.source_url || "",

                image_license:
                    image.license || "",

                image_credit:
    image.credit || "",

image_sync_status: "success",
image_sync_error: ""

                    

            })
            .eq("id", place.id);


    if (updateResult.error) {

        throw new Error(
            updateResult.error.message
        );

    }


    return {

        success: true,

        id: place.id,

        name,

        category,

        image_url:
            uploaded.publicUrl,

        source:
            image.source,

        source_url:
            image.source_url || "",

        license:
            image.license || "",

        credit:
            image.credit || ""

    };
}


// ============================================================
// MAIN SYNC ROUTE
//
// Examples:
//
// POST /api/admin/food-images/sync?type=food&state=Uttar%20Pradesh&limit=2
//
// POST /api/admin/food-images/sync?type=heritage&state=Uttar%20Pradesh&limit=2
//
// POST /api/admin/food-images/sync?type=food&limit=10
//
// POST /api/admin/food-images/sync?type=heritage&limit=10
// ============================================================

router.post("/sync", async function (req, res) {

    try {

        const type =
            String(
                req.query.type || "food"
            ).toLowerCase();


        const state =
            String(
                req.query.state || ""
            ).trim();


        let limit =
            Number(
                req.query.limit || 2
            );


        if (!Number.isFinite(limit)) {
            limit = 2;
        }


        limit =
            Math.max(
                1,
                Math.min(
                    limit,
                    50
                )
            );


        // ====================================================
        // FOOD
        // ====================================================

        if (type === "food") {

            let query =
                supabase
                    .from("foods")
                    .select(`
                        id,
                        name,
                        destination_id,
                        image_url,
                        destinations!inner(
                            state,
                            name
                        )
                    `)
                    .eq("is_active", true)
                   .or(
    "image_url.is.null,image_url.eq."
)
.neq(
    "image_sync_status",
    "failed"
)
.limit(limit);

            const queryResult =
                await query;


            if (queryResult.error) {

                throw new Error(
                    queryResult.error.message
                );

            }


            let foods =
                queryResult.data || [];


            if (state) {

                foods =
                    foods.filter(function (food) {

                        return (
                            String(
                                food.destinations &&
                                food.destinations.state
                                    || ""
                            ).toLowerCase()
                        ===
                            state.toLowerCase()
                        );

                    });

            }


            const results = [];

const CONCURRENCY = 4;
let nextIndex = 0;

async function processNextFood() {

    while (true) {

        const index = nextIndex++;

        if (index >= foods.length) {
            return;
        }

        const food = foods[index];

        try {

            const result =
                await syncFood({

                    id: food.id,

                    name: food.name,

                    state:
                        food.destinations &&
                        food.destinations.state
                            || "",

                    destination:
                        food.destinations &&
                        food.destinations.name
                            || ""

                });

            results.push(result);

        } catch (error) {

            results.push({

                success: false,

                id: food.id,

                name: food.name,

                reason:
                    error.message

            });

        }
    }
}

const workers = [];

for (
    let i = 0;
    i < CONCURRENCY;
    i++
) {
    workers.push(
        processNextFood()
    );
}

await Promise.all(workers);


            return res.json({

                success: true,

                type: "food",

                state:
                    state || "all",

                processed:
                    results.length,

                successful:
                    results.filter(
                        function (item) {
                            return item.success;
                        }
                    ).length,

                failed:
                    results.filter(
                        function (item) {
                            return !item.success;
                        }
                    ).length,

                results

            });

        }


        // ====================================================
        // HERITAGE
        // ====================================================

      // ====================================================
// HERITAGE
// ====================================================

if (type === "heritage") {

    // Thode extra records fetch karenge taaki
    // image na milne wale records batch ko block na karein.
    const fetchLimit = Math.min(limit * 5, 50);

    let query =
        supabase
            .from("heritage")
           .select(`
    id,
    name,
    state,
    category,
    image_url,
    image_sync_status
`)
            
            .or(
    "image_url.is.null,image_url.eq."
)
.neq(
    "image_sync_status",
    "failed"
)
.limit(fetchLimit);

    if (state) {
        query =
            query.eq(
                "state",
                state
            );
    }

    const queryResult =
        await query;

    if (queryResult.error) {

        throw new Error(
            queryResult.error.message
        );

    }

    const places =
        queryResult.data || [];

    const results = [];

    let successfulCount = 0;

    // Maximum requested successful images tak process karenge.
   const CONCURRENCY = 3;

let nextIndex = 0;

async function processNextHeritage() {

    while (true) {

        if (successfulCount >= limit) {
            return;
        }

        const index = nextIndex++;

        if (index >= places.length) {
            return;
        }

        const place = places[index];

        try {

            const result =
                await syncHeritage(place);

            results.push(result);

            if (result.success) {
                successfulCount++;
            }

        } catch (error) {

            results.push({

                success: false,

                id: place.id,

                name: place.name,

                reason:
                    error.message

            });

        }

    }
}

const workers = [];

for (
    let i = 0;
    i < CONCURRENCY;
    i++
) {
    workers.push(
        processNextHeritage()
    );
}

await Promise.all(workers);

    return res.json({

        success: true,

        type: "heritage",

        state:
            state || "all",

        requested:
            limit,

        processed:
            results.length,

        successful:
            results.filter(
                function (item) {
                    return item.success;
                }
            ).length,

        failed:
            results.filter(
                function (item) {
                    return !item.success;
                }
            ).length,

        results

    });
}

        // ====================================================
        // INVALID TYPE
        // ====================================================

        return res.status(400).json({

            success: false,

            message:
                "Invalid type. Use food or heritage."

        });


    } catch (error) {

        console.error(
            "Image sync error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Image sync failed.",

            error:
                error.message

        });

    }

});


module.exports = router;