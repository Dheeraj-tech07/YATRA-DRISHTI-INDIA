require("dotenv").config();

const supabase = require("./config/supabase");
const { INDIA_HERITAGE } = require("./data");

async function migrateHeritage() {
    try {
        const records = [];

        for (const [state, places] of Object.entries(INDIA_HERITAGE)) {
            for (const place of places) {
                records.push({
                    name: place[0],
                    category: place[1],
                    lat: place[2],
                    lng: place[3],
                    state: state,
                    location: state,
                    description: "",
                    image_url: ""
                });
            }
        }

        console.log("Total records prepared:", records.length);

        const batchSize = 100;

        for (let i = 0; i < records.length; i += batchSize) {
            const batch = records.slice(i, i + batchSize);

            const { error } = await supabase
                .from("heritage")
                .insert(batch);

            if (error) {
                throw error;
            }

            console.log(
                `Migrated ${Math.min(i + batch.length, records.length)} / ${records.length}`
            );
        }

        console.log("Heritage migration completed successfully.");
    } catch (error) {
        console.error("Migration failed:", error);
    }
}

migrateHeritage();