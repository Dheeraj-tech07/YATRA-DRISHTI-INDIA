const supabase = require("../config/supabase");

async function registerUser(req, res) {
    try {
        const { name, email, phone, password } = req.body || {};

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email aur password required hain."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password kam se kam 6 characters ka hona chahiye."
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.toLowerCase().trim();
        const cleanPhone = String(phone || "").trim();

        if (
            cleanPhone &&
            !/^[6-9][0-9]{9}$/.test(cleanPhone)
        ) {
            return res.status(400).json({
                message: "Valid 10-digit Indian mobile number required hai."
            });
        }

        const { data, error } = await supabase.auth.admin.createUser({
            email: cleanEmail,
            password,
            email_confirm: true,
            user_metadata: {
                name: cleanName,
                phone: cleanPhone
            }
        });

        if (error) {
            console.error("Supabase register error:", error);

            if (
                error.message?.toLowerCase().includes("already") ||
                error.message?.toLowerCase().includes("registered")
            ) {
                return res.status(409).json({
                    message: "Is email se user already registered hai."
                });
            }

            return res.status(400).json({
                message: error.message
            });
        }

        // Auth user create hone ke baad profiles table mein data save karo.
        const { error: profileError } = await supabase
            .from("profiles")
            .insert({
                id: data.user.id,
                name: cleanName,
                email: data.user.email,
                phone: cleanPhone,
                profile_image: ""
            });

        if (profileError) {
            console.error("Profile create error:", profileError);

            // Agar profile create nahi hui to incomplete Auth user hata do.
            await supabase.auth.admin.deleteUser(data.user.id);

            return res.status(500).json({
                message: "Profile create nahi ho saka."
            });
        }

        res.status(201).json({
            message: "Registration successful.",
            user: {
                id: data.user.id,
                name: cleanName,
                email: data.user.email,
                phone: cleanPhone
            }
        });

    } catch (error) {
        console.error("Register error:", error);

        res.status(500).json({
            message: "Registration fail ho gaya."
        });
    }
}


async function loginUser(req, res) {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({
                message: "Email aur password required hain."
            });
        }

        const cleanEmail = email.toLowerCase().trim();

        const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password
        });

        if (error || !data.user) {
            return res.status(401).json({
                message: "Invalid email ya password."
            });
        }

        res.json({
            message: "Login successful.",
            token: data.session.access_token,
            user: {
                id: data.user.id,
                name: data.user.user_metadata?.name || "",
                phone: data.user.user_metadata?.phone || "",
                email: data.user.email,
                profileImage: data.user.user_metadata?.profileImage || ""
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Login fail ho gaya.",
            error: error.message
        });
    }
}


async function updateProfile(req, res) {
    try {
        const authHeader = req.headers.authorization || "";

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication token required."
            });
        }

        const token = authHeader.replace("Bearer ", "").trim();

        if (!token) {
            return res.status(401).json({
                message: "Authentication token required."
            });
        }

        // Logged-in user verify karo.
        const {
            data: userData,
            error: userError
        } = await supabase.auth.getUser(token);

        if (userError || !userData.user) {
            return res.status(401).json({
                message: "Invalid ya expired login session."
            });
        }

        const user = userData.user;

        const {
            name,
            phone,
            email,
            password
        } = req.body || {};

        const cleanName = String(name || "").trim();
        const cleanPhone = String(phone || "").trim();
        const cleanEmail = String(email || "").toLowerCase().trim();

        if (!cleanName) {
            return res.status(400).json({
                message: "Name required hai."
            });
        }

        if (
            cleanPhone &&
            !/^[6-9][0-9]{9}$/.test(cleanPhone)
        ) {
            return res.status(400).json({
                message: "Valid 10-digit Indian mobile number required hai."
            });
        }

        const updateData = {
            user_metadata: {
                ...user.user_metadata,
                name: cleanName,
                phone: cleanPhone
            }
        };

        // Email change sirf tab karo jab email actually change hua ho.
        if (
            cleanEmail &&
            cleanEmail !== String(user.email || "").toLowerCase()
        ) {
            updateData.email = cleanEmail;
        }

        // Password tabhi update karo jab new password diya gaya ho.
        if (password) {
            if (String(password).length < 6) {
                return res.status(400).json({
                    message: "Password kam se kam 6 characters ka hona chahiye."
                });
            }

            updateData.password = password;
        }

        const {
            data,
            error
        } = await supabase.auth.admin.updateUserById(
            user.id,
            updateData
        );

        if (error) {
            console.error("Supabase profile update error:", error);

            return res.status(400).json({
                message: error.message
            });
        }

        // profiles table bhi update karo.
        const { error: profileError } = await supabase
            .from("profiles")
            .upsert({
                id: user.id,
                name: cleanName,
                email: cleanEmail || user.email,
                phone: cleanPhone,
                profile_image: user.user_metadata?.profileImage || "",
                updated_at: new Date().toISOString()
            });

        if (profileError) {
            console.error("Profile table update error:", profileError);

            return res.status(500).json({
                message: "Profile database mein update nahi ho saka."
            });
        }

        return res.json({
            message: "Profile successfully updated.",
            user: {
                id: data.user.id,
                name: data.user.user_metadata?.name || "",
                phone: data.user.user_metadata?.phone || "",
                email: data.user.email,
                profileImage:
                    data.user.user_metadata?.profileImage || ""
            }
        });

    } catch (error) {
        console.error("Profile update error:", error);

        return res.status(500).json({
            message: "Profile update fail ho gaya."
        });
    }
}


module.exports = {
    registerUser,
    loginUser,
    updateProfile
};