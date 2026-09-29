const mongoose = require("mongoose");

let databaseReady = false;

async function connectDatabase() {
    if (!process.env.MONGO_URI) {
        console.warn("MONGO_URI missing: database routes unavailable rahengi.");
        return false;
    }

    try {
      await mongoose.connect(process.env.MONGO_URI, {
    family: 4,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000
});
        databaseReady = true;
        console.log("MongoDB Atlas connected successfully.");
        return true;
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        return false;
    }
}

function isDatabaseReady() {
    return databaseReady;
}

module.exports = {
    connectDatabase,
    isDatabaseReady
};