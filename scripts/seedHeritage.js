require("dotenv").config();

const mongoose = require("mongoose");
const Heritage = require("../models/Heritage");
const { INDIA_HERITAGE } = require("../data");

async function seedHeritage() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected for seeding.");

        const documents = [];

        for (const [state, places] of Object.entries(INDIA_HERITAGE)) {
            for (const place of places) {
                const [name, category, lat, lng] = place;

                documents.push({
                    name,
                    location: state,
                    state,
                    description: "",
                    category,
                    imageUrl: "",
                    lat,
                    lng
                });
            }
        }

        await Heritage.deleteMany({});

        await Heritage.insertMany(documents);

        console.log(`Heritage seeding completed.`);
        console.log(`Total records inserted: ${documents.length}`);
    } catch (error) {
        console.error("Heritage seeding failed:");
        console.error(error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

seedHeritage();