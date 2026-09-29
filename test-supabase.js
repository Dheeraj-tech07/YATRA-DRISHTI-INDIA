require("dotenv").config();

const supabase = require("./config/supabase");

async function testSupabase() {
    try {
        const { count, error } = await supabase
            .from("heritage")
            .select("*", { count: "exact", head: true });

        if (error) {
            throw error;
        }

        console.log("Supabase connection successful.");
        console.log("Heritage record count:", count);
    } catch (error) {
        console.error("Supabase test failed:", error);
    }
}

testSupabase();